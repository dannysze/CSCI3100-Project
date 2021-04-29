// upcoming events component showing the events started after the today (current day)
import React, { useState, useEffect } from 'react';
import '../styles/components/UpcomingEvents.css';
import Events from './Event/Events'
import getaddr from '../components/getaddr'

// Main component
// props:
// height: the height depending on the height of the calendar 
const UpcomingEvents = ({ height }) => {
  const [events, setEvents] = useState([]);

  // sqlToJsDate convert the date from format in sql db (YYYY-MM-DD) to js Date obj
  const sqlToJsDate = (sqlDate, sqlTime) => {

    var sqlDateArr1 = sqlDate.split("-");
    var sYear = sqlDateArr1[0];
    var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
    var sDay = sqlDateArr1[2];
  
    var sqlTimeArr = sqlTime.split(":");

    return new Date(sYear, sMonth, sDay, sqlTimeArr[0], sqlTimeArr[1], sqlTimeArr[2]);
  }

  // get the events form the server and filtering the events that suitable
  useEffect(() => {
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents()
      const upcomingEvents = eventsFromServer.filter(upcomingEvent => {
        if (sqlToJsDate(upcomingEvent.start_date, upcomingEvent.start_time) >= new Date()) {
          return upcomingEvent
        }
      })
      setEvents(upcomingEvents)
    }
    getEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await fetch(getaddr() + 'search_events', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()

    return data
  }

  return (
    <div className="upcoming-events" style={{width:"100%", maxHeight: `${height}px`}}>
      {/* rendering event cards */}
      <Events  height={height} events={events} title="Upcoming"/>
    </div>
  )
}

export default UpcomingEvents