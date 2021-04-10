import PropTypes from 'prop-types'
import "../../styles/components/Event/Event_record.css"
import React, { useState } from 'react';
import { CaretDownFill, House, Search } from 'react-bootstrap-icons';

const Eventrecord = ({ event, onClick }) => {
    //const [showDropdownMenu, setShowDropdownMenu] = useState(false);
    return (
        <li className='record-container'>
            <div className='record'>{event.name}

            </div>
            <div className='record-info'>
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