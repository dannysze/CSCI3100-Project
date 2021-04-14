import React, { useState, useEffect, useContext } from 'react';
import { CalendarButton } from '../CustomButton';
import EventForm from '../Event/EventForm';
import { getDate, getDay, getMonth, startOfWeek, endOfWeek, startOfDay, addDays, differenceInCalendarDays, addWeeks, subWeeks, addMinutes, getMinutes, getHours, addHours, differenceInMinutes } from 'date-fns';
import { CSSTransition } from 'react-transition-group';
import useToken from '../../useToken';
import getaddr from '../getaddr';
import { UserContext } from '../../UserContext';
import '../../styles/components/Calendars/Schedule.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'Feburay', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const box = [...Array(48).keys()];

const takeWeek = (date = new Date()) => {
  let days = [];
  let start = startOfWeek(startOfDay(date));
  let end = endOfWeek(startOfDay(date));

  let scheduleObj = {};
  let day = start;
  while (day < end) {
    scheduleObj = {
      'day': day,
      'disabled': false,
      'today': false,
      'sunday': false,
      'frequency': 0
    };
    if (day < startOfDay(new Date())) {
      // console.log(day)
      scheduleObj.disabled = true;
    }
    if (getDay(day) === 0) {
      scheduleObj.sunday = true;
    }
    if (differenceInCalendarDays(day, new Date()) == 0) {
      scheduleObj.today = true;
    }
    days.push(scheduleObj);
    day = addDays(day, 1);
  }
  return days;
}

const sqlToJsDate = (sqlDate, sqlTime) => {

  var sqlDateArr1 = sqlDate.split("-");
  var sYear = sqlDateArr1[0];
  var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
  var sDay = sqlDateArr1[2];

  var sqlTimeArr = sqlTime.split(":");
   
  return new Date(sYear,sMonth,sDay,sqlTimeArr[0],sqlTimeArr[1],sqlTimeArr[2]);
}

const Schedule = () => {
  const today = startOfDay(new Date());
  const initialInfo = {
    'weekStart': startOfWeek(today),
    'scheduleArr': takeWeek(today)
  }
  const [scheduleInfo, setScheduleInfo] = useState(initialInfo);
  const [eventForm, setEventForm] = useState({
    'show': false,
    'startDateTime': new Date(),
  });

  const [events, setEvents] = useState([]);

  const {token} = useToken();
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    // getUser();
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents();
      // console.log(eventsFromServer);
      setEvents(eventsFromServer);
    }
    // console.log(user)
    getEvents();
  }, [scheduleInfo, user]);

  const fetchEvents = async () => {
    const res = await fetch(getaddr()+'joined_events/'+user.user_id, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()

    return data
  }

  let eventRecord = {};
  const stickScheduleEvents = () => {
    eventRecord = {};
    // console.log(events)
    const thisWeekEvents = events.filter(thisWeekEvent => {
      let start_date = sqlToJsDate(thisWeekEvent.start_date, thisWeekEvent.start_time);
      // let end_date = new Date(2021, 3, 12, 22, 30, 0)
      let end_date = sqlToJsDate(thisWeekEvent.end_date, thisWeekEvent.end_time);
      if (differenceInCalendarDays(end_date, start_date) > 0) {
      } else if (start_date > scheduleInfo.scheduleArr[scheduleInfo.scheduleArr.length - 1].day || end_date < scheduleInfo['weekStart']) {
      } else return thisWeekEvent;
    })
    const scheduleEventBlocks = thisWeekEvents.map((scheduleEvent, index) => {
    // const scheduleEventBlocks = [...Array(3)].map((scheduleEvent, index) => {
      
      // let start_date = new Date(2021, 3, 12, 9, 0, 0);
      let start_date = sqlToJsDate(scheduleEvent.start_date, scheduleEvent.start_time);
      // let end_date = new Date(2021, 3, 12, 22, 30, 0)
      let end_date = sqlToJsDate(scheduleEvent.end_date, scheduleEvent.end_time);

      let colNum = getDay(start_date) + 2;
      // console.log(`${start} - ${end}`)
      let minutesDiff = differenceInMinutes(end_date, start_date)
      // console.log(`${minutesDiff} - ${minutesDiff}`)
      let startMinute = getMinutes(start_date);
      let startHour = getHours(start_date)
      let endMinute = getMinutes(end_date);
      let endHour = getHours(end_date);
      let rowStart;
      if (startMinute <= 30 && startMinute > 0) {
        rowStart = startHour * 2 + 2;
      } else if (startMinute == 0) {
        rowStart = startHour * 2 + 1; 
      } else {
        rowStart = startMinute * 2 + 2;
      }
      let rowSpan;
      // if (endMinute <= 30 && endMinute > 0)
      rowSpan = Math.floor(minutesDiff / 30);
      
      let extrapx = minutesDiff % 30;
      
      let style = {
        gridColumn: `${colNum}`,
        gridRow: `${rowStart} / span ${rowSpan}`,
      }

      return (
        <section className="block--events task task--danger" style={style}>
          <div className="block--events-title">{scheduleEvent.name}</div>
          <div className="">{`${startHour}:${('0'+startMinute).slice(-2)} - ${endHour}:${('0'+endMinute).slice(-2)}`}</div>
        </section>
      )
    })
    return scheduleEventBlocks;
  }

  // let allDayEventRecord = {};
  const stickAllDayEvent = () => {
    // console.log(scheduleInfo)
    // let allDayEventRecord = scheduleInfo.scheduleArr.slice(0, 7);
    const allDayEventRecord = scheduleInfo.scheduleArr.slice(0, 7).map((item, index) => {
      item.frequency = 0;
      return item;
    })

    const allDayEventBar = events.map((allDayEvent, index) => {
    // const allDayEventBar = [...Array(2)].map((allDayEvent, index) => {
      // let start = startOfDay(new Date());
      // let end = startOfDay(new Date(2021, 3, 12));
      // console.log(allDayEvent);
      let start = startOfDay(sqlToJsDate(allDayEvent.start_date, allDayEvent.start_time));
      let end = startOfDay(sqlToJsDate(allDayEvent.end_date, allDayEvent.end_time));
      if (differenceInCalendarDays(end, start) === 0) {
        return
      } 
      if (end < scheduleInfo['weekStart'] || start > scheduleInfo.scheduleArr[scheduleInfo.scheduleArr.length - 1].day) {
        return 
      }

      if (start < scheduleInfo['weekStart']) {
        start = scheduleInfo['weekStart']
      }
      if (end > scheduleInfo.scheduleArr[scheduleInfo.scheduleArr.length - 1].day) {
        end = scheduleInfo.scheduleArr[scheduleInfo.scheduleArr.length - 1].day
      }
      
      let colNum = getDay(start) + 1;
      let colSpan = differenceInCalendarDays(end, start) + 1;
      
      let max = 1;
      let rangeStart = false;
      // console.log(allDayEventRecord)
      for (let i = 0; i < allDayEventRecord.length; i++) {
        if (rangeStart) {
          allDayEventRecord[i].frequency++;
          max = Math.max(max, allDayEventRecord[i].frequency);
          if (differenceInCalendarDays(allDayEventRecord[i].day, end) === 0) {
            // rangeStart = false;
            break;
          }
        }
        if (differenceInCalendarDays(allDayEventRecord[i].day, start) === 0) {
          rangeStart = true;
          allDayEventRecord[i].frequency++;
          max = allDayEventRecord[i].frequency;
        }
      }
      let row = max;
      let style = {
        gridColumn: `${colNum} / span ${colSpan}`,
        gridRow: `${row}`,
      }
      // console.log(style);
      // console.log(allDayEventRecord)
      return (
        <section className={`task task--${allDayEvent.category} all-day-events--bar`} style={style}>{allDayEvent.name}</section>
      )
    })
    // console.log(scheduleInfo)
    return allDayEventBar;
  }

  // view the previous month
  const previousWeek = () => {
    let newWeek = subWeeks(scheduleInfo['weekStart'], 1);
    // console.log(newWeek);
    setScheduleInfo({
      'weekStart': newWeek,
      'scheduleArr': takeWeek(newWeek)
    });
    // console.log(scheduleInfo);
  }

  // view the next week
  const nextWeek = () => {
    let newWeek = addWeeks(scheduleInfo['weekStart'], 1);
    setScheduleInfo({
      'weekStart': newWeek,
      'scheduleArr': takeWeek(newWeek)
    });
  }

  // view the current week
  const currentWeek = () => {
    setScheduleInfo(initialInfo)
  }

  const createEventForm = (dateTime) => {
    setEventForm({
      'show': true,
      'startDateTime': dateTime
    });
  }

  return (
    <div className="schedule-container">
      <CSSTransition
        in={eventForm['show']}
        timeout={300}
        classNames={"create-event-form-"}
        unmountOnExit
      >
        <EventForm dismissHandler={() => setEventForm({'show': false, 'startDateTime': eventForm['startDateTime']})} startDate={eventForm['startDateTime']}/>
      </CSSTransition>
      <div className="schedule-header">
        <div className="timeslots timeslots-button">
          <span id="schedule--month">{monthNames[getMonth(scheduleInfo.weekStart)]}</span>
          <CalendarButton classes="calendar-button-left" clickHandler={previousWeek}/>
          <CalendarButton classes="calendar-button-reset" clickHandler={currentWeek}/>
          <CalendarButton classes="calendar-button-right" clickHandler={nextWeek}/>
        </div>
        
        {scheduleInfo.scheduleArr.map((day, index) => {
          let style = {
            gridColumn: `${index + 2}`,
            color: `${day.sunday ? `rgba(217, 83, 79, ${day.disabled ? 0.6 : 1})` : day.disabled ? `rgba(152, 160, 166, 0.6)` : '#282828' }`,
            fontWeight: `${day.today ? '600' : '400'}`,
          }
          return (
            <span className={`schedule-day-name`} style={style} key={index}><span className="schedule-header--number">{getDate(day.day)}</span>&nbsp;&nbsp;{dayNames[index]}</span>
          )
        })}
      </div>
      <div className="schedule-week">
        <div className="timeslots all-day-events--title">All-day</div>
        <div className="all-day-events--grid">
          {scheduleInfo.scheduleArr.map((day, index) => (<div className={`all-day-events--slots ${day.today? 'block--today' : ''}`} key={index}></div>))}
          {stickAllDayEvent()}
        </div>
      </div>
      <div className="schedule-body">
        {box.map((item, index) => (index % 2 == 0 && index != 0 ? <div className="timeslots" key={index}>{`${item / 2 % 12 == 0 ? 12 : item / 2 % 12} ${item/2 < 12 ? 'am' : 'pm'}`}</div> : <div className="timeslots" key={index}></div>))}
        {scheduleInfo.scheduleArr.map((day, col) => {
          return box.map((_, row) => {
            let style = {
              gridRow: row+1,
              gridColumn: col+2,
            }
            return (
              <div style={style} className={`block ${day.today ? 'block--today' : ''}`} key={col * row + row} onClick={() => createEventForm(addMinutes(day.day, 30 * (row)))}>&nbsp;</div>
            )
          })
        })}
        {stickScheduleEvents()}
      </div>
      <div style={{textAlign:'right', fontWeight: "350", fontStyle:"oblique"}}>*<b>Click</b> to create event (Private for normal user/Public for organizer).</div>
    </div>
  )
}

export default Schedule