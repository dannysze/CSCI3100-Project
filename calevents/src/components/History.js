import React, { useState, useEffect } from 'react';
import Eventrecord from './Event/Event_record';
import getaddr from './getaddr';
import "../styles/components/History.css";

const History = () => {

  const [events, setEvents] = useState([]);
  const [show, setShow] = useState({ toggle: false, event: {} });

  useEffect(() => {
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents()
      setEvents(eventsFromServer)
    }
    getEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await fetch(getaddr() + `events`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()
    console.log(data)
    return data
  }

  return (
    <div className="history--container">
      <h1 className="history--title">Record</h1>
      <div className="history--list">
        <ul>
          {events.map((event, index) => {
            return <Eventrecord key={index} event={event} />
          })}
        </ul>
      </div>
    </div>
  )
}

export default History;