import React, { useState, useEffect, useContext } from 'react';
import { CSSTransition } from 'react-transition-group'
import Eventrecord from './Event/Event_record';
import getaddr from './getaddr';
import useToken from '../useToken';
import { UserContext } from '../UserContext';
import "../styles/components/History.css";

const History = () => {

  const [events, setEvents] = useState([]);
  const {token} = useToken();
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents()
      setEvents(eventsFromServer)
    }
    getEvents()
  }, [user])

  // GET the private events of the user
  const fetchEvents = async () => {
    const res = await fetch(getaddr()+'joined_events/'+user.user_id, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()
    // console.log(data)
    return data
  }

  return (
    <div className="history--container">
      <h1 className="history--title">Record</h1>
      <div className="history--list">
        <ul>
          {events.map((event, index) => {
            return (
                <Eventrecord key={index} event={event} index={index} />
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default History;