import React, { useState } from 'react';
import '../../styles/components/Calendars/Calendar.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const days = [...Array(35).keys()];

const Calendar = () => {
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <CalendarHeader month='November (Demo)' year='2018' />
      </div>
      <div className="calendar">
        {dayNames.map((day, index) => (<span className="day-name" key={index}>{day}</span>))}
        {days.map((item, index) => <CalendarItems name={(item)%31+1} key={index} />)}
        <section className="task task--warning">Projects</section>
        <section className="task task--danger">Design Sprint</section>
        <section className="task task--primary">Product Checkup 1<div className="task__detail">
                <h2>Product Checkup 1</h2>
                <p>15-17th November</p>
            </div>
        </section>
        <section className="task task--info">Product Checkup 2</section>
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
    <div className="day">
      {props.name}
    </div>
  )
}

export default Calendar