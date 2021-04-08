import React, { useState, useEffect } from 'react';
import { startOfMonth, startOfWeek, endOfMonth, endOfWeek, startOfDay, addDays, getDate, getMonth, getYear, addMonths, subMonths, getWeekOfMonth, getDay, differenceInDays, differenceInCalendarDays, differenceInCalendarWeeks } from 'date-fns';
import { CalendarButton } from '../CustomButton';
import getaddr from '../getaddr'
import '../../styles/components/Calendars/Calendar.css';

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
      'day': getDate(day),
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

const sqlToJsDate = (sqlDate) => {
  //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
  var sqlDateArr1 = sqlDate.split("-");
  //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
  var sYear = sqlDateArr1[0];
  var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
  var sqlDateArr2 = sqlDateArr1[2].split(" ");
  //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
  var sDay = sqlDateArr2[0];
  var sqlDateArr3 = sqlDateArr2[1].split(":");
  //format of sqlDateArr3[] = ['hh','mm','ss.ms']
  var sHour = sqlDateArr3[0];
  var sMinute = sqlDateArr3[1];
  var sqlDateArr4 = sqlDateArr3[2].split(".");
  //format of sqlDateArr4[] = ['ss','ms']
  var sSecond = sqlDateArr4[0];
  var sMillisecond = sqlDateArr4[1];
   
  return new Date(sYear,sMonth,sDay,sHour,sMinute,sSecond,sMillisecond);
}

const Calendar = ({ heightHandler }) => {

  // initial information of the calendar (day of visit)
  const today = startOfDay(new Date());
  const initialInfo = { 'calendarStart': startOfMonth(today), 'calendarArr': takeMonth(today)};
  const [calendarInfo, setCalendarInfo] = useState(initialInfo);
  const [events, setEvents] = useState([]);

  // change the height of upcoming events according to the calendar
  useEffect(() => {
    heightHandler();
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents();
      // console.log(JSON.stringify(eventsFromServer));
      
      // filter the events on this month (can be done here)

      setEvents(eventsFromServer);
    }
    getEvents();
  }, [])
  
    const fetchEvents = async () => {
      const res = await fetch(getaddr()+'search_events')
      const data = await res.json()
      return data
    }
  
  // add fetched events to calendar
  let dayRecord = {};
  const stickEvents = () => {
    dayRecord = {};
    // const eventsBars = events.map((event, index) => {
    const eventsBars = [...Array(3)].map((event, index) => {
      // let date = sqlToJsDate(event.date);
      // start = start_date || startOfWeek(startOfMonth(startOfDay(date)))
      let start = startOfDay(new Date());
      // end = end_date || endOfWeek(endOfMonth(startOfDay(date)))
      let end = startOfDay(new Date(2021, 3, 10));

      let startRow = getWeekOfMonth(start) + 1;
      let endRow = getWeekOfMonth(end) + 1;
      let colNum = getDay(start) + 1;
      let diffDays = differenceInDays(end, start) + 1;
      let diffWeeks = differenceInCalendarWeeks(end, start);
      let span = [...Array(diffWeeks + 1)].map((_, index) => {
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
      // console.log(start)
      // console.log(`${startRow} - ${endRow} - ${colNum} - ${span}`);
      
      let pos = 'center'

      let display = 'block';
      for (let i = start; i <= end; i = addDays(i, 1)) {
        if (dayRecord[i]) {
          dayRecord[i]['frequency']++;
          if (dayRecord[i]['frequency'] <= 2) {
            pos = 'end';
            dayRecord[i]['end'] = true;
          } else {
            display = 'none';
            dayRecord[i]['hide']++;
            return (<></>)
          }
        } else {
          dayRecord[i] = {
            'frequency': 1,
            'hide': 0,
            'row': startRow,
            'column': colNum + differenceInDays(i, start),
          }
        }
      }
      // console.log(JSON.stringify(dayRecord));
      return (span.map((colSpan, idx) => {
          let style = {
            gridColumn: `${idx == 0 ? colNum : 1} / span ${colSpan}`,
            gridRow: `${startRow + idx}`,
            alignSelf: `${pos}`,
            display: display
          }
          return (
            <CalendarEvent key={idx} classes="task--warning" styles={style} name="test"/>
          )
        })
      )
    })
    return eventsBars;
  }

  const stickTags = () => {
    for (let key in dayRecord) {
      if (dayRecord[key]['hide'] !== 0) {
        let style = {
          gridColumn: `${dayRecord[key]['column']}`,
          gridRow: `${dayRecord[key]['row']}`,
          alignSelf: 'start',
        }
        // console.log(dayRecord[key]);
        return (
          <CalendarTag styles={style} hide={dayRecord[key]['hide']}/>
        )
      } else {
        return (<></>)
      }
    }
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


  return (
    <div className="calendar-container">
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
        {calendarInfo['calendarArr'].map((item, index) => <CalendarItems disabled={item.disabled} name={(item.day)} today={item.today} sunday={item.sunday} key={index} />)}
        {stickEvents()}
        {stickTags()}
      </div>
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
  return (
    <div className={`day ${props.disabled ? 'day--disabled' : ''}`} style={props.sunday ? {color: `rgba(217, 83, 79, ${props.disabled ? 0.6 : 1})`} : {}}>
      <span className={props.today ? "today" : ""}>{props.name}</span>
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