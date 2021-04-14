import React, { useState, useEffect, useContext} from 'react';
import { startOfMonth, startOfWeek, endOfMonth, endOfWeek, startOfDay, addDays, getDate, getMonth, getYear, addMonths, subMonths, getWeekOfMonth, getDay, differenceInDays, differenceInCalendarDays, differenceInCalendarWeeks, getDaysInMonth } from 'date-fns';
import { Modal } from 'react-bootstrap';
import { CalendarButton } from '../CustomButton';
import { CSSTransition } from 'react-transition-group';
import EventForm from '../Event/EventForm';
import EventCard from '../Event/EventCard';
import { EventModal } from '../Event/Events';
import getaddr from '../getaddr';
import '../../styles/components/Calendars/Calendar.css';
import {UserContext} from '../../UserContext';
import useToken from '../../useToken';
import { Container, Row, Col } from 'react-bootstrap';

// constants store the names of the calendar
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'Feburay', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// get the calendar days of specfied date
const takeMonth = (date = new Date()) => {
  let days = [];
  // find the first and last calendar day of a month
  let start = startOfWeek(startOfMonth(startOfDay(date)));
  let end = endOfWeek(endOfMonth(startOfDay(date)));

  let day = start;
  let calendarObj = {};
  while (day < end) {
    
    calendarObj = {
      'day': day,
      'disabled': false,
      'today': false,
      'sunday': false,
      'hide': 0
    }
    // disable when the day is not in the same month 
    if (day < startOfMonth(startOfDay(date)) || day > endOfMonth(startOfDay(date))) {
      calendarObj.disabled = true;
    }
    if (getDay(day) === 0) {
      calendarObj.sunday = true;
    }
    if (differenceInCalendarDays(day, new Date()) == 0) {
      calendarObj.today = true;
    }
    days.push(calendarObj);
    day = addDays(day, 1);
  }
  // return array of calendar days (obj)
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

const Calendar = ({ heightHandler }) => {

  const {user, setUser} = useContext(UserContext);
  const {token, setToken} = useToken();
  // initial information of the calendar (day of visit)
  const today = startOfDay(new Date());
  const initialInfo = { 
    'calendarStart': startOfMonth(today), 
    'calendarArr': takeMonth(today)
  };
  const [calendarInfo, setCalendarInfo] = useState(initialInfo);
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    'show': false,
    'startDate': new Date(),
  });
  const [eventCardModal, setEventCardModal] = useState({
    'toggle': false,
    'events': []
  });

  // change the height of upcoming events according to the calendar
  useEffect(() => {
    heightHandler();
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents();
      // console.log(JSON.stringify(eventsFromServer));
      
      // filter the events on this month (can be done here)
      // console.log(eventsFromServer);
      
      setEvents(eventsFromServer);
    }
    getEvents();
    // console.log(events)
  }, [calendarInfo], [events]);
  
  const fetchEvents = async () => {
    const res = await fetch(getaddr()+'search_events', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()
    return data
  }
  
  // add fetched events to calendar
  let dayRecord = {};
  const stickEvents = () => {
    dayRecord = {};
    const eventsBars = events.map((event, index) => {
      // console.log(event);
    // const eventsBars = [...Array(3)].map((event, index) => {
      let start_date = sqlToJsDate(event.start_date, event.start_time);
      // start = start_date || startOfWeek(startOfMonth(startOfDay(date)))
      // end = end_date || endOfWeek(endOfMonth(startOfDay(date)))
      let end_date = sqlToJsDate(event.end_date, event.end_time);
      
      if (end_date < calendarInfo.calendarArr[0].day || start_date > calendarInfo.calendarArr[calendarInfo.calendarArr.length-1].day) {
        // console.log(start_date, end_date);
        return
      } 
      if (start_date < calendarInfo.calendarArr[0].day) {
        start_date = calendarInfo.calendarArr[0].day;
      } 
      if (end_date > calendarInfo.calendarArr[calendarInfo.calendarArr.length-1].day) {
        end_date = calendarInfo.calendarArr[calendarInfo.calendarArr.length-1].day;
      }
      
      let start = startOfDay(start_date);
      let end = startOfDay(end_date);
      // console.log(start_date, end_date);
      let startRow = getWeekOfMonth(start) + 1;
      let colNum = getDay(start) + 1;
      let diffDays = differenceInDays(end, start) + 1;
      let diffWeeks = differenceInCalendarWeeks(end, start);
      // console.log(`${diffWeeks} - ${diffDays}`)
      
      if (start_date < calendarInfo['calendarStart']) {
        startRow = 2;
      } 

      if (start_date > endOfMonth(calendarInfo['calendarStart'])) {
        startRow = getWeekOfMonth(endOfMonth(calendarInfo['calendarStart'])) + 1
      }

      let span;
      if (diffWeeks > 0) {
        span = [...Array(diffWeeks + 1)].map((_, index) => {
          if (index == 0) {
            diffDays -= (7 - colNum) + 1
            return (7 - colNum) + 1;
          } else if (index == diffWeeks) {
            return diffDays;
          } else {
            diffDays -= 7;
            return 7;
          }
        })
      } else {
        span = [diffDays]; 
      }
      
      let curPos = {
        'center': true,
        'end': true,
      }
      for (let i = start; i <= end; i = addDays(i, 1)) {
        if (dayRecord[i]) {
          dayRecord[i]['frequency']++;
          
          curPos['center'] = curPos['center'] && dayRecord[i]['center']
          curPos['end'] = curPos['end'] && dayRecord[i]['end']

        } else {
          dayRecord[i] = {
            'center': true,
            'end': true,
            'frequency': 1,
            'hide': 0,
            'row': startRow + differenceInCalendarWeeks(i, start),
            'column': getDay(i) + 1,
            'events': []
          }
        }
        dayRecord[i]['events'].push(event);
        
      }
      // console.log(dayRecord);
      let display = 'block';
      // console.log(JSON.stringify(dayRecord[new Date(2021, 4, 18)]));

      if (curPos['center']) {
        // console.log(startstart, end)
        for (let i = start; i <= end; i = addDays(i, 1)) {
          dayRecord[i]['center'] = false;
        }
      } else if (curPos['end']) {
        // console.log(`end ${start} ${end}`);
        for (let i = start; i <= end; i = addDays(i, 1)) {
          dayRecord[i]['end'] = false;
        }
      } else {
        display = 'none'
        dayRecord[start]['hide']++;
      }
      // console.log(dayRecord[new Date(2021, 3, 23)])
      let pos = curPos['center'] ? 'center' : (curPos['end'] ? 'end' : '');
      
      // console.log(display, pos);
      // console.log(dayRecord)
      // console.log(JSON.stringify(dayRecord));
      return (span.map((colSpan, idx) => {
          let style = {
            gridColumn: `${idx == 0 ? colNum : 1} / span ${colSpan}`,
            gridRow: `${startRow + idx}`,
            alignSelf: `${pos}`,
            display: display
          }
          return (
            <CalendarEvent key={idx} classes={`task--${event.category}`} styles={style} name={event.name} />
          )
        })
      )
    })
    return eventsBars;
  }

  const stickTags = () => {
    let tagsArr = [];
    for (let key in dayRecord) {
      // console.log(dayRecord[key]['hide'])
      if (dayRecord[key]['hide'] !== 0) {
        let style = {
          gridColumn: `${dayRecord[key]['column']}`,
          gridRow: `${dayRecord[key]['row']}`,
          alignSelf: 'start',
        }
        // console.log(dayRecord[key]['events'])
          tagsArr.push(<CalendarTag styles={style} hide={dayRecord[key]['hide']} key={key} />)
      } else {
      }
    }
    return tagsArr
  }

  // view the previous month
  const previousMonth = () => {
    let newMonth = subMonths(calendarInfo['calendarStart'], 1);
    setCalendarInfo({
      'calendarStart': newMonth,
      'calendarArr': takeMonth(newMonth)
    });
  }

  // view the next month
  const nextMonth = () => {
    let newMonth = addMonths(calendarInfo['calendarStart'], 1);
    setCalendarInfo({
      'calendarStart': newMonth,
      'calendarArr': takeMonth(newMonth)
    });
  }

  const createEventForm = (date) => {
    setEventForm({
      'show': true,
      'startDate': date
    });
  }

  const showEventCardModal = (date) => {
    if (dayRecord[date]) {
      // console.log(dayRecord[date]['events'])
      setEventCardModal({ 'toggle': true, 'events': dayRecord[date]['events']});
    } else setEventCardModal({ 'toggle': true, 'events': []});
     
  }

  const [eventModal, setEventModal] = useState({ 'toggle': false, 'event': {}})

  const dismissEventCardModal = (e) => {
    setEventCardModal({ 'toggle': false , 'events': []})
    setEventModal({ 'toggle': true, 'event': e})
    console.log(e)
  }

  return (
    <div className="calendar-container">
      <CSSTransition
        in={eventForm['show']}
        timeout={300}
        classNames={"create-event-form-"}
        unmountOnExit
      >
        <EventForm dismissHandler={() => setEventForm({'show': false, 'startDate': eventForm['startDate']})} startDate={eventForm['startDate']} edit={false}/>
      </CSSTransition>
      <div className="calendar-header">
        <CalendarHeader 
          month={monthNames[getMonth(calendarInfo['calendarStart'])]} 
          year={getYear(calendarInfo['calendarStart'])} 
          previousMonth={previousMonth}
          nextMonth={nextMonth}
        />
      </div>
      <div className="calendar">
        {dayNames.map((day, index) => (<span className="day-name" key={index} style={day === "Sun" ? {color: "rgb(217, 83, 79)"} : {}}>{day}</span>))}
        {calendarInfo['calendarArr'].map((item, index) => {
          // console.log(item)
          return (<CalendarItems 
            disabled={item.disabled} 
            name={(item.day)} 
            today={item.today} 
            sunday={item.sunday} 
            key={index} 
            doubleClickHandler={user.type==1?createEventForm:()=>{}}            
            clickHandler={showEventCardModal}
            />)
        })}
        {stickEvents()}
        {stickTags()}
      </div>
      <div>
          <div style={{textAlign:'right', fontWeight: "350", fontStyle:"oblique"}}>*<b>Click</b> to check events of the day.<b>Double Click</b>  to create public event (Only for organizer).</div>
          {['Sport', 'Music', 'Academic', 'Health', 'Festival'].map((item, index) => (
                    <div style={{  fontWeight: "350", fontStyle:"oblique"}}>
                      <span className={`task--${item} dot`}></span> {item}
                    </div>
            ))}     
      </div>
      <Modal
        show={eventCardModal['toggle']}
        onHide={() => setEventCardModal({ 'toggle': false , 'events': []})}
        dialogClassName="calendar-event-modal"
      >
        <Modal.Header closeButton className="calendar-event-modal-title">More Events...</Modal.Header>
        <Modal.Body>
          <div className="calendar-event-list-modal-container">
            {/* {console.log(eventCardModal['events'])} */}
            {eventCardModal['events'].length != 0 ? eventCardModal['events'].map((ev, index) => {
              return <EventCard event={ev} key={index} onClick={() => dismissEventCardModal(ev)} />
            }) : <h1>There is no more events on this day</h1>}
          </div>
        </Modal.Body>
      </Modal>
      <EventModal showEvent={eventModal} setShow={setEventModal}/>
    </div>
  )
}

const CalendarHeader = ({ month, year, previousMonth, nextMonth }) => {
  return (
    <>
      <h1 className="flex-center">
        <CalendarButton classes="calendar-button-left" clickHandler={previousMonth} />
        <span style={{width: '100px', textAlign: 'center'}}>{month}</span>
        <CalendarButton classes="calendar-button-right" clickHandler={nextMonth} />
      </h1>
      <p>{year}</p>
    </>
  )
}

const CalendarItems = (props) => {

  const mouseOverHandler = (event) => {
    // console.log(props.name);
    var delay = setTimeout(() => {
      props.clickHandler(props.name)
    }, 1000)
    event.target.addEventListener('mouseleave', () => {clearTimeout(delay)})
  }

  return (
    <div className={`day ${props.disabled ? 'day--disabled' : ''}`} style={props.sunday ? {color: `rgba(217, 83, 79, ${props.disabled ? 0.6 : 1})`} : {}} onDoubleClick={() => props.doubleClickHandler(props.name)} onMouseOver={mouseOverHandler}>
      <span className={props.today ? "calendar--today" : ""}>{getDate(props.name)}</span>
    </div>
  )
}

const CalendarEvent = ({ classes, name, styles }) => {
  return (
    <section className={`task ${classes}`} style={styles}>{name}</section>
  )
}

const CalendarTag = ({ styles, hide }) => {
  return (
    <section className='tag' style={styles}>{`${hide} more`}</section>
  )
}

export default Calendar