import React, { useState } from 'react';
import '../styles/components/calendar.css';

const head = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const days = [...Array(35).keys()];

const Calendar = () => {
  return (
    <div id="calendar">
      <div className="calendar-header">
        {head.map((item) => <CalendarHeader name={item} />)}
      </div>
      <div className="calendar-body">
        {days.map((item) => <CalendarItems name={item+1} />)}
      </div>
    </div>
  )
}

const CalendarHeader = (props) => {
  return (
    <div className="calendar-header-items">
      <h3>{props.name}</h3>
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