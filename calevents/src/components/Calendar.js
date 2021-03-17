import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/components/calendar.css';

const head = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const days = [...Array(35).keys()];

const Calendar = () => {
  return (
    <div id="calendar">
      {head.map((item) => <CalendarItems name={item} />)}
      {days.map((item) => <CalendarItems name={item+1} />)}
    </div>
  )
}

const CalendarItems = (props) => {
  return (
    <div className="calendar-items">
      <h3>{props.name}</h3>
    </div>
  )
}

export default Calendar