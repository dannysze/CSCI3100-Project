import React, { useState, useEffect } from 'react';
import { CalendarButton } from '../CustomButton';
import { getDate, getDay, startOfWeek, endOfWeek, startOfDay, addDays, differenceInCalendarDays, addWeeks, subWeeks } from 'date-fns';
import '../../styles/components/Calendars/Schedule.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const box = [...Array(48).keys()];

const takeWeek = (date = new Date()) => {
  let days = [];
  let start = startOfWeek(startOfDay(date));
  let end = endOfWeek(startOfDay(date));

  let scheduleObj = {};
  let day = start;
  while (day < end) {
    scheduleObj = {
      'day': getDate(day),
      'disabled': false,
      'today': false,
      'sunday': false,
    };
    if (day < startOfDay(new Date())) {
      // console.log(day)
      scheduleObj.disabled = true;
    }
    if (getDay(day) === 0) {
      scheduleObj.sunday = true;
    }
    if (differenceInCalendarDays(day, new Date()) == 0) {
      scheduleObj.today = true;
    }
    days.push(scheduleObj);
    day = addDays(day, 1);
  }
  return days;
}

const Schedule = () => {
  const today = startOfDay(new Date());
  const initialInfo = {
    'weekStart': startOfWeek(today),
    'scheduleArr': takeWeek(today)
  }
  const [scheduleInfo, setScheduleInfo] = useState(initialInfo);

  // view the previous month
  const previousWeek = () => {
    let newWeek = subWeeks(scheduleInfo['weekStart'], 1);
    console.log(newWeek);
    setScheduleInfo({
      'weekStart': newWeek,
      'scheduleArr': takeWeek(newWeek)
    });
    console.log(scheduleInfo);
  }

  // view the next week
  const nextWeek = () => {
    let newWeek = addWeeks(scheduleInfo['weekStart'], 1);
    setScheduleInfo({
      'weekStart': newWeek,
      'scheduleArr': takeWeek(newWeek)
    });
  }

  // view the current week
  const currentWeek = () => {
    setScheduleInfo(initialInfo)
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="timeslots timeslots-button">
          <CalendarButton classes="calendar-button-left" clickHandler={previousWeek}/>
          <CalendarButton classes="calendar-button-reset" clickHandler={currentWeek}/>
          <CalendarButton classes="calendar-button-right" clickHandler={nextWeek}/>
        </div>
        
        {scheduleInfo.scheduleArr.map((day, index) => {
          let style = {
            gridColumn: `${index + 2}`,
            color: `${day.sunday ? `rgba(217, 83, 79, ${day.disabled ? 0.6 : 1})` : day.disabled ? `rgba(152, 160, 166, 0.6)` : '#282828' }`,
            fontWeight: `${day.today ? '600' : '400'}`,
          }
          return (
            <span className={`schedule-day-name`} style={style} key={index}><span className="schedule-header--number">{day.day}</span>&nbsp;&nbsp;{dayNames[index]}</span>
          )
        })}
      </div>
      <div className="schedule-week">
        <div className="timeslots all-day-events--title">All-day</div>
        <div className="all-day-events--grid">
          {scheduleInfo.scheduleArr.map((day, index) => (<div className={`all-day-events--slots ${day.today? 'block--today' : ''}`} key={index}></div>))}
          <section className="task task--warning all-day-events--bar">Test</section>
          <section className="task task--danger all-day-events--bar" style={{gridColumn: '2 / span 3', gridRow: '2'}}>Test</section>
          <section className="task task--info all-day-events--bar" style={{gridColumn: '3 / span 5', gridRow: '1'}}>Test</section>
          <section className="task task--danger all-day-events--bar" style={{gridColumn: '2 / span 4', gridRow: '5'}}>Test</section>
          <section className="task task--info all-day-events--bar" style={{gridColumn: '4 / span 2', gridRow: '3'}}>Test</section>
          <section className="task task--danger all-day-events--bar" style={{gridColumn: '5 / span 1', gridRow: '4'}}>Test</section>
          <section className="task task--info all-day-events--bar" style={{gridColumn: '1 / span 1', gridRow: '2'}}>Test</section>
        </div>
      </div>
      <div className="schedule-body">
        {box.map((item, index) => (index % 2 == 0 && index != 0 ? <div className="timeslots" key={index}>{`${item / 2 % 12 == 0 ? 12 : item / 2 % 12} ${item/2 < 12 ? 'am' : 'pm'}`}</div> : <div className="timeslots" key={index}></div>))}
        {scheduleInfo.scheduleArr.map((day, col) => {
          return box.map((_, row) => {
            let style = {
              gridRow: row+1,
              gridColumn: col+2,
            }
            return (
              <div style={style} className={`block ${day.today ? 'block--today' : ''}`} key={col * row + row}>&nbsp;</div>
            )
          })
        })}
        <section className="block--events task task--danger">Test</section>
        <section className="block--events task task--danger" style={{gridColumn: '3', gridRow: '4 / span 8'}}>Test</section>
        <section className="block--events task task--danger" style={{gridColumn: '4', gridRow: '16 / span 8'}}>Test</section>
      </div>
    </div>
  )
}

export default Schedule