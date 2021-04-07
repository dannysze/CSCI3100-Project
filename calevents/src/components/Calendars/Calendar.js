import React, { useState, useEffect } from 'react';
import { startOfMonth, startOfWeek, endOfMonth, endOfWeek, startOfDay, addDays, getDate, getMonth, getYear, addMonths, subMonths } from 'date-fns';
import { CalendarButton } from '../CustomButton';
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
      'disabled': false
    }
    // disable when the day is not in the same month 
    if (day < startOfMonth(startOfDay(date)) || day > endOfMonth(startOfDay(date))) {
      calendarObj.disabled = true;
    }
    days.push(calendarObj);
    day = addDays(day, 1);
  }
  // return array of calendar days (obj)
  return days;
}

const Calendar = ({ heightHandler }) => {

  // initial information of the calendar (day of visit)
  const today = startOfDay(new Date());
  const initialInfo = { 'calendarStart': startOfMonth(today), 'calendarArr': takeMonth(today) };
  const [calendarInfo, setCalendarInfo] = useState(initialInfo);

  // change the height of upcoming events according to the calendar
  useEffect(() => {
    heightHandler();
  })

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
        {dayNames.map((day, index) => (<span className="day-name" key={index}>{day}</span>))}
        {calendarInfo['calendarArr'].map((item, index) => <CalendarItems disabled={item.disabled} name={(item.day)} key={index} />)}
        <CalendarEvent classes="task--warning" name="Projects" />
        <CalendarEvent classes="task--danger" name="Product Checkup 1" />
        <CalendarEvent classes="task--primary" name="Design Sprint" />
        <CalendarEvent classes="task--info" name="Product Checkup 2" />
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
    <div className={`day ${props.disabled ? 'day--disabled' : ''}`}>
      {props.name}
    </div>
  )
}

const CalendarEvent = ({ classes, name }) => {
  return (
    <section className={`task ${classes}`}>{name}</section>
  )
}

export default Calendar