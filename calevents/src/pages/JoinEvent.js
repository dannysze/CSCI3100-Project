import React from 'react';
import {useState, useContext, useEffect} from 'react';
import {UserContext} from '../UserContext' ;
import getaddr from '../components/getaddr';
import Events from '../components/Event/Events';
import useToken from '../useToken';

const JoinEvent = () => {
// const JoinEvent = ({event}) => {
    const event = {
        event_id:7,
        ticket:0,
        start_time:'04:36:54',
        end_time:'04:36:54',
    }
    const {user, setUser} = useContext(UserContext);
    const {token, setToken} = useToken();
    const [clashes,setClashes] = useState([]);
    const [confirm,setConfirm] = useState(0);
    const [joinResult, setJoinResult] = useState({errorMsg:'', alert:false});

    //may need date conversion
    const compareTime = (joinedEvent) => {
        if(((joinedEvent.start_time >= event.start_time && joinedEvent.start_time <= event.end_time)&&(joinedEvent.start_date >= event.start_date && joinedEvent.start_date <= event.end_date))
            || ((joinedEvent.end_time >= event.start_time && joinedEvent.end_time <= event.end_time)&&(joinedEvent.end_date >= event.start_date && joinedEvent.end_date <= event.end_date)))
        return true;
    };

    const checkTimeClash = async () => {
        let joinedEvents = await (await fetch(getaddr()+'joined_events/' + user.user_id)).json();
        let clashedEvents  = joinedEvents.filter(
            joinedEvent => {return compareTime(joinedEvent);});
        setClashes(clashedEvents);
        console.log(clashes);
    };


    const showEvents = async () => {
        let joinedEvents = await (await fetch(getaddr()+'search_events')).json();
        setClashes(joinedEvents);
    };

    const joinEvent = async () => {
        try{
            let res = await fetch(getaddr()+'join_event', {
              method: 'POST',
              headers: {
                'auth': token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({event_id:event.event_id}),
            });
            let body = await res.json();
            if (!res.ok){
                  setJoinResult({'errorMsg':body['error'], 'alert':true});
                  setUser({...user,'account_balance':user.account_balance-event.ticket})
            }else{
                setJoinResult({'errorMsg':'You has successfully joined the event', 'alert':true});
            }
          }catch(err){
            console.log(err);
          }
    };

    const deleteEvent = async () => {
        try{
          //change getaddr() to getaddr(isLocal=false) to make it use remote address
          //basically passing the token by the header
          let res = await fetch(getaddr()+'user_events/37' , {
            method: 'DELETE',
          });

        }catch(err){
          console.log(err);
        }
      }

    useEffect(() => {
      checkTimeClash();
      setJoinResult({errorMsg:'', alert:false});
    }, [user]);
    return (
        <div>
            <p>Your current account balance is: {user.account_balance} The price of the ticket is:{event.ticket} </p>
            {(user.account_balance<event.ticket)
            ?<>
                <p>Your account balance is not sufficient</p>
                <p>You can top up your account by <a href="">redeeming gift card</a></p>
            </>
            :<>
                <p>Your account has sufficient fund.</p>
                <button type="submit" onClick={()=>{JoinEvent()}}>Join</button>
                {<div className="alert-box" style={joinResult.alert ? {visibility: 'visible'} : {visibility: 'hidden'}}>{joinResult.errorMsg}</div>}
                {clashes.length>0&&
                    <>
                        <p>There are events that have time clashes with the event you are going to join.If you still want to join, you can click join.</p>
                        <Events events={clashes}></Events>
                    </>
                }
            </>
            }
        </div>
    )
}

export default JoinEvent
