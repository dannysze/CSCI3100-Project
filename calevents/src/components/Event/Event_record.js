import React, { useState, useEffect } from 'react';
import { CaretDownFill, } from 'react-bootstrap-icons';
import { FormButton } from '../CustomButton';
import { CSSTransition } from 'react-transition-group';
import EventForm from './EventForm';
import PropTypes from 'prop-types'
import "../../styles/components/Event/Event_record.css"


const Eventrecord = ({ event, onClick, userType, index }) => {

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

    // DELETE events API 
    const deleteEvent = (event) => {

    }
    
    // Edit event API
    const editEvent = (e) => {
        e.preventDefault();
    }

    const toggleEditForm = (event) => {
        setEditForm(formInfo);
    }


    return (
        <li className='record-container'>
            <CSSTransition
                in={editForm['show']}
                timeout={300}
                classNames={"create-event-form-"}
                unmountOnExit
            >
                <EventForm dismissHandler={() => setEditForm({'show': false, 'start_date': editForm['start_date']})} startDate={editForm['start_date']} edit={true} editInfo={editForm} editHandler={editEvent}/>
            </CSSTransition>
            <div className='record-title' onClick={showRecordDetail}><span className='record'  style={showDetail ? { whiteSpace: 'normal' } : {  }}>{event.name}</span><span style={showDetail ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' }} className="record-title-icon"><CaretDownFill /></span></div>
            <div className='record-info' style={showDetail ? { height: `${height}px`, marginTop: '10px' } : { height: '0px' }}>
                <div className="organizer"><em>Organizer:</em>&nbsp;{event.organizer}</div>
                <div className="venue"><em>Venue:</em>&nbsp;{event.venue}</div>
                <div className="date">
                    {event.start_date === event.end_date ? `${event.start_date}` : `${event.start_date}` + "-" + `${event.end_date}`}
                    <span className="time">{event.start_time}-{event.end_time}</span>
                </div>
                <hr style={{ margin: '.5em'}}/>
                <div className="re-description-head">Description:</div>
                <div className="description">{event.desc}</div>
                <div className="record-button-group">
                    <FormButton classes="record-button" clickHandler={deleteEvent} content="delete"/>
                    <FormButton classes="record-button" clickHandler={toggleEditForm} content="edit"/>
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