// this is the js file for creating the result cards in search page
import React, { useState, useEffect } from 'react';
import "../../styles/components/Event/SearchResultCard.css"
import PropTypes from 'prop-types';
import { FormButton } from "../CustomButton.js";
import { Container, Row, Col, Modal, ListGroup, Button, ListGroupItem } from 'react-bootstrap'
import { EventModal } from './Events'

// Main component
// props: 
// event: default value is empty for all fields -> prevent errors
const SearchResultCard = ({ event = {
    user_id: '',
    event_name: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    visible: 0,
    repeat: 0,
    venue: '',
    capacity: 0,
    description: '',
    ticket: 10,
    refund: 1,
    refund_days: 0,
    category: '',
  }, onClick }) => {

    const [showMore, setShowMore] = useState({ 'toggle': false , 'event': {}});

    return (
        <>
            {/* // the container for the result card */}
            <div className="SR-card-container" onClick={() => setShowMore({'toggle': true, 'event': event})}>
                {/* the container for the event image */}
                <div className="SR-img-container">
                    {/* the price tag for the event */}
                    <div className="SR-fee">${event.ticket}</div>
                    {/* the event image on the result card */}
                    <img src={event.img_loc} alt="event image"></img>
                </div>
                {/* the part that show the title */}
                <div className="SR-title">{event.name}</div>
                {/* the container for the information of the event in result card */}
                <div className="SR-info-container">
                    <div className="SR-Organizer">{event.username}</div>
                    <div className="SR-Date">Date:&nbsp;{event.start_date}</div>
                    <div className="SR-Time">Time:&nbsp;{event.start_time}</div>
                    <div className="SR-Venue">Venue:&nbsp;{event.venue}</div>
                </div>
            </div>
            <EventModal showEvent={showMore} setShow={setShowMore} />
        </>
    )
}

export default SearchResultCard

Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}