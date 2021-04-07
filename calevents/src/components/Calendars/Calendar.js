import React, { useState } from 'react';
import { startOfMonth, startOfWeek, endOfMonth, endOfWeek, startOfDay, addDays, getDate, getMonth, getYear, addMonths, subMonths } from 'date-fns';
import '../../styles/components/Calendars/Calendar.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'Feburay', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const takeMonth = (date = new Date()) => {
  let days = [];
  let start = startOfWeek(startOfMonth(startOfDay(date)));
  let end = endOfWeek(endOfMonth(startOfDay(date)));

  let day = start;
  let calendarObj = {};
  while (day < end) {
    // console.log(day);
    calendarObj = {
      'day': getDate(day),
      'disabled': false
    } 
    if (day < startOfMonth(startOfDay(date)) || day > endOfMonth(startOfDay(date))) {
      calendarObj.disabled = true;
    }
    days.push(calendarObj);
    day = addDays(day, 1);
  }
  return days;
}

// takeMonth();

const Calendar = () => {

  const today = startOfDay(new Date());
  const initialInfo = { 'calendarStart': startOfMonth(today), 'calendarArr': takeMonth(today) };
  const [calendarInfo, setCalendarInfo] = useState(initialInfo);

  const previousMonth = () => {
    let newMonth = subMonths(calendarInfo['calendarStart'], 1);
    setCalendarInfo({
      'calendarStart': newMonth,
      'calendarArr': takeMonth(newMonth)
    });
    // console.log(calendarInfo);
  }

  const nextMonth = () => {
    let newMonth = addMonths(calendarInfo['calendarStart'], 1);
    setCalendarInfo({
      'calendarStart': newMonth,
      'calendarArr': takeMonth(newMonth)
    });
    // console.log(calendarInfo);
  }


  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={previousMonth}>Pre</button>
        <CalendarHeader month={monthNames[getMonth(calendarInfo['calendarStart'])]} year={getYear(calendarInfo['calendarStart'])} />
        <button onClick={nextMonth}>Next</button>
      </div>
      <div className="calendar">
        {dayNames.map((day, index) => (<span className="day-name" key={index}>{day}</span>))}
        {calendarInfo['calendarArr'].map((item, index) => <CalendarItems disabled={item.disabled} name={(item.day)} key={index} />)}
        {/* <section className="task task--warning">Projects</section>
        <section className="task task--danger">Design Sprint</section>
        <section className="task task--primary">Product Checkup 1<div className="task__detail">
                <h2>Product Checkup 1</h2>
                <p>15-17th November</p>
            </div>
        </section>
        <section className="task task--info">Product Checkup 2</section> */}
      </div>
    </div>
  )
}

const CalendarHeader = (props) => {
  return (
    <>
      <h1>{props.month}</h1>
      <p>{props.year}</p>
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

export default Calendar