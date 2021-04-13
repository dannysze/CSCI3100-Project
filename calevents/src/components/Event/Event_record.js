//This is a js file that create the record card,  which is a component in MyCalendar page to show the event that the user join
import React, { useState, useEffect, useContext } from 'react';
import { CaretDownFill, } from 'react-bootstrap-icons';
import { FormButton } from '../CustomButton';
import { CSSTransition } from 'react-transition-group';
import EventForm from './EventForm';
import PropTypes from 'prop-types'
import getaddr from '../getaddr'
import useToken from '../../useToken'
import { UserContext } from '../../UserContext'
import "../../styles/components/Event/Event_record.css"


const Eventrecord = ({ event, onClick, index }) => {

    const [showDetail, toggleShowDetail] = useState(false);
    const [height, setHeight] = useState('');
    useEffect(() => {
        setHeight(document.getElementsByClassName('record-info')[index].scrollHeight)
    }, [])

    // const [edit, toggleEdit] = useState(false)
    const [editForm, setEditForm] = useState({
        'show': false,
        'start_date': event.start_date,
        'end_date': event.end_date,
    });

    const formInfo = {
        'show': true,
        // event.start_date: event.start_date,
        'start_date': new Date(),
        'end_date': new Date(),
        'event_name': event.name,
        'venue': event.venue,
        'capacity': event.capacity,
        'ticket': event.ticket,
        'description': event.description,
    }
    const showRecordDetail = () => {
        toggleShowDetail(!showDetail);
    }

    const { token } = useToken();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        // getUser();
    }, [])

    // DELETE events API 
    const deleteEvent = async (event) => {
        fetch(getaddr() + 'user_events/' + event.id, {
            method: 'DELETE'
        }).then(res => {
            res.json()
        }).then(res => {
            console.log(res)
        })
    }

    // Edit event API
    const editEvent = (e) => {
        e.preventDefault();

    }

    // User request for refunding
    const userRefund = async (e) => {
        e.preventDefault()
        let data = new FormData();
        data.append('user_id', user.user_id);
        await fetch(`${getaddr()}refund/${event.event_id}`, {
            method: 'POST',
            headers: {
                'auth': token,
            },
            body: data
        });
    }

    const toggleEditForm = (event) => {
        setEditForm(formInfo);
    }
    //the code below is the component to show the information of events that the user join
    return (

        <li className='record-container'>
            <CSSTransition
                in={editForm['show']}
                timeout={300}
                classNames={"create-event-form-"}
                unmountOnExit
            >
                <EventForm dismissHandler={() => setEditForm({ 'show': false, 'start_date': editForm['start_date'] })} startDate={editForm['start_date']} edit={true} editInfo={editForm} editHandler={editEvent} />
            </CSSTransition>
            {/* shows the titlw of the joined event */}
            <div className='record-title' onClick={showRecordDetail}><span className='record' style={showDetail ? { whiteSpace: 'normal' } : {}}>{event.name}</span><span style={showDetail ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' }} className="record-title-icon"><CaretDownFill /></span></div>
            {/* shows the other  informations of the joined event */}
            <div className='record-info' style={showDetail ? { height: `${height}px`, marginTop: '10px' } : { height: '0px' }}>
                <div className="organizer"><em>Organizer:</em>&nbsp;{event.organizer}</div>
                <div className="venue"><em>Venue:</em>&nbsp;{event.venue}</div>
                <div className="date">
                    {event.start_date === event.end_date ? `${event.start_date}` : `${event.start_date}` + " to " + `${event.end_date}`}
                    <span className="time">{event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}</span>
                </div>
                <hr style={{ margin: '.5em' }} />
                <div className="re-description-head">Description:</div>
                <div className="description">{event.description}</div>
                {/* the buttons for delete(cancel) the joined event, and edit the joined event */}
                <div className="record-button-group">
                    {(event.visible === 1 && user.type === 0) ? <FormButton classes="record-button" clickHandler={userRefund} content="refund" disabled={true} /> : <FormButton classes="record-button" clickHandler={deleteEvent} content="delete" />
                    }
                    <FormButton classes="record-button" clickHandler={toggleEditForm} content="edit" />
                </div>
            </div>
        </li>
    )
}

export default Eventrecord

Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}