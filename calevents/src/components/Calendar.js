import React, { useState } from 'react';
import { HandIndex } from 'react-bootstrap-icons';
import '../styles/components/Calendar.css';

const head = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const days = [...Array(35).keys()];

const Calendar = () => {
  return (
    <div id="calendar">
      <div className="calendar-header">
        {head.map((item, index) => <CalendarHeader name={item} key={index} />)}
      </div>
      <div className="calendar-body">
        {days.map((item, index) => <CalendarItems name={(item)%31+1} key={index} />)}
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