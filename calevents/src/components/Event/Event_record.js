import PropTypes from 'prop-types'
import "../../styles/components/Event/Event_record.css"
import React, { useState, useEffect } from 'react';
import { CaretDownFill, } from 'react-bootstrap-icons';

const Eventrecord = ({ event, onClick, userType, index }) => {

    const [showDetail, toggleShowDetail] = useState(false);
    const [height, setHeight] = useState(''); 
    useEffect(() =>{
        setHeight(document.getElementsByClassName('record-info')[index].scrollHeight)    
    }, []) 
    
    const showRecordDetail = () => {
        toggleShowDetail(!showDetail);
    }

    return (
        <li className='record-container'>
            <div className='record-title' onClick={showRecordDetail}><span className='record'>{event.name}</span><span style={showDetail ? {transform: 'rotate(180deg)'} : {transform: 'rotate(0deg)'}} className="record-title-icon"><CaretDownFill /></span></div>
            <div className='record-info' style={showDetail ? {height: `${height}px`} : {height: '0px'}}>
                <div className="date">Date:&nbsp;{event.start_date}-{event.end_date}</div>
                <div className="time">Time:&nbsp;{event.start_time}-{event.end_time}</div>
                <div className="venue">Venue:&nbsp;{event.venue}</div>
                <div className="description-head">Description:</div>
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