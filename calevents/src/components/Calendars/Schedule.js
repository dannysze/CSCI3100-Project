import React, { useState } from 'react';
import '../../styles/components/Calendars/Schedule.css';

const dayNames = [' ', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const box = [...Array(48).keys()];

const Schedule = () => {
  return (
    <div className="schedule-container">
      {dayNames.map((day, index) => (<span className="schedule-day-name" key={index}>{day}</span>))}
      {box.map((item, index) => (index % 2 == 0 ? <div className="timeslots" key={index}>{`${('0' + item / 2).slice(-2)}:00`}</div> : ''))}
    </div>
  )
}

export default Schedule