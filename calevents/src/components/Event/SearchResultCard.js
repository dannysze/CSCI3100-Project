// this is the js file for creating the result cards in search page
import React, { useState, useEffect } from 'react';
import "../../styles/components/Event/SearchResultCard.css"
import PropTypes from 'prop-types';
import { FormButton } from "../CustomButton.js";
import { Container, Row, Col, Modal, ListGroup, Button, ListGroupItem } from 'react-bootstrap'


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

    return (
        // the container for the result card
        <div className="SR-card-container">
            {/* the container for the event image */}
            <div className="SR-img-container">
                {/* the price tag for the event */}
                <div className="SR-fee">${event.ticket}</div>
                {/* the event image on the result card */}
                <img src={event.img_loc} alt="event image"></img>
            </div>
            {/* the part that show the title */}
            <div className="SR-title">{event.title}</div>
            {/* the container for the information of the event in result card */}
            <div className="SR-info-container">
                <div className="SR-Organizer">{event.organizer}</div>
                <div className="SR-Date">Date:&nbsp;{event.start_date}</div>
                <div className="SR-Time">Time:&nbsp;{event.start_time}</div>
                <div className="SR-Venue">Venue:&nbsp;{event.venue}</div>
            </div>
            {/* the row container for the buttons */}
            <Row>
                {/* the column container for More button */}
                <Col className="SR-More-Con flex-center" md={6}>
                    {/* imported more button */}
                    <FormButton content="More" />
                </Col>
                {/* the column container for Join button */}
                <Col className="SR-Join-Con flex-center" md={6}>
                    {/* imported join button */}
                    <FormButton content="Join" />
                </Col>
            </Row>


        </div>
    )
}

export default SearchResultCard

Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}