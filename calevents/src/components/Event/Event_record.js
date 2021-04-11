import PropTypes from 'prop-types'
import "../../styles/components/Event/Event_record.css"
import React, { useState, useEffect } from 'react';
import { CaretDownFill, } from 'react-bootstrap-icons';


const Eventrecord = ({ event, onClick, userType, index }) => {

    const [showDetail, toggleShowDetail] = useState(false);
    const [height, setHeight] = useState('');
    useEffect(() => {
        setHeight(document.getElementsByClassName('record-info')[index].scrollHeight)
    }, [])

    const showRecordDetail = () => {
        toggleShowDetail(!showDetail);
    }

    return (
        <li className='record-container'>
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
            </div>
        </li>
    )
}

export default Eventrecord

Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}