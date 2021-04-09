import React, { useState } from 'react';
import { CalendarButton } from '../CustomButton';
import { getDate, startOfWeek, endOfWeek, startOfDay, addDays } from 'date-fns';
import '../../styles/components/Calendars/Schedule.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const box = [...Array(48).keys()];

const takeWeek = (date = new Date()) => {
  let days = [];
  let start = startOfWeek(startOfDay(date));
  let end = endOfWeek(startOfDay(date));

  let day = start;
  while (day < end) {
    days.push(getDate(day));
    day = addDays(day, 1);
  }
  return days;
}

const Schedule = () => {
  const today = new Date();
  const initialInfo = {
    'weekStart': startOfWeek(startOfDay(today)),
    'scheduleArr': takeWeek(today)
  }
  const [schedule, setSchedule] = useState(initialInfo);

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="timeslots timeslots-button flex-center">
          <CalendarButton classes="calendar-button-left" />
          <CalendarButton classes="calendar-button-reset" />
          <CalendarButton classes="calendar-button-right" />
        </div>
        {schedule.scheduleArr.map((day, index) => {
          let style = {
            gridColumn: `${index + 2}`
          }
          return (
            <span className="schedule-day-name" style={style} key={index}><span className="schedule-header--number">{day}</span>&nbsp;&nbsp;{dayNames[index]}</span>
          )
        })}
      </div>
      <div className="schedule-week">
        <div className="timeslots all-day-events">All-day</div>
        {[...Array(7)].map((_, index) => (<div className="all-day-events" key={index}></div>))}
      </div>
      <div className="schedule-body">
        {box.map((item, index) => (index % 2 == 0 && index != 0 ? <div className="timeslots" key={index}>{`${item / 2 % 12 == 0 ? 12 : item / 2 % 12} ${item/2 < 12 ? 'am' : 'pm'}`}</div> : <div className="timeslots" key={index}></div>))}
        {[...Array(7)].map((_, col) => {
          return box.map((_, row) => {
            let style = {
              gridRow: row+1,
              gridColumn: col+2,
            }
            return (
              <div style={style} className="block" key={col * row + row}>&nbsp;</div>
            )
          })
        })}
      </div>
    </div>
  )
}

export default Schedule