import React, { useState, useEffect, useContext } from 'react';
import Eventrecord from './Event/Event_record';
import getaddr from './getaddr';
import useToken from '../useToken';
import { UserContext } from '../UserContext';
import "../styles/components/History.css";

const History = () => {

  const [events, setEvents] = useState([]);
  const {token} = useToken();
  const {user, setUser} = useContext(UserContext);

  const getUser = async () => {
      try{
        //change getaddr() to getaddr(isLocal=false) to make it use remote address
        //basically passing the token by the header
        let res = await fetch(getaddr(false)+'user', {
            method: 'GET',
            headers: {
            'auth': token,
            'Content-Type': 'application/json',
            },
            //body: JSON.stringify({token:token}),
        });
        let body = await res.json();
        setUser(body);
      }catch(err){
        console.log(err);
      }
  }

  useEffect(() => {
    getUser();
    // console.log(user)
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents()
      setEvents(eventsFromServer)
    }
    getEvents()
  }, [])

  // GET the private events of the user
  const fetchEvents = async () => {
    const res = await fetch(`${getaddr()}user_events/${user.user_id}`, {
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
            return <Eventrecord key={index} event={event} index={index} />
          })}
        </ul>
      </div>
    </div>
  )
}

export default History;