// History component showing the records of created and joined events of the users
import React, { useState, useEffect, useContext } from 'react';
import Eventrecord from './Event/Event_record';
import getaddr from './getaddr';
import useToken from '../useToken';
import { UserContext } from '../UserContext';
import "../styles/components/History.css";

// Main component
const History = () => {

  const [events, setEvents] = useState([]);
  const {token} = useToken();
  const {user, setUser} = useContext(UserContext);

  // get the private event or joined events (individual users) form datebase
  useEffect(() => {
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents()
      setEvents(eventsFromServer)
    }
    getEvents()
  }, [user])

  // GET request
  const fetchEvents = async () => {
    const res = await fetch(getaddr()+'joined_events/'+user.user_id, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()
    return data
  }

  return (
    <div className="history--container">
      <h1 className="history--title">Record</h1>
      <div className="history--list">
        <ul>
          {/* render a record for each event */}
          {events.map((event, index) => {
            return (
                <Eventrecord key={index} event={event} index={index} />
            )
          })}
          {events.length===0&&<h1 className="history--title">No joined/organized event</h1>}
        </ul>
      </div>
    </div>
  )
}

export default History;