// this is the js file for creating the result cards in search page
import React, { useState, useEffect } from 'react';
import "../../styles/components/Event/SearchResultCard.css"
import PropTypes from 'prop-types';
import { FormButton } from "../CustomButton.js";


import { Container, Row, Col, Modal, ListGroup, Button, ListGroupItem } from 'react-bootstrap'


const SearchResultCard = ({ event, onClick }) => {
    return (
        // the container for the result card
        <div className="SR-card-container">
            {/* the container for the event image */}
            <div className="SR-img-container">
                {/* the price tag for the event */}
                <div className="SR-fee">$777</div>
                {/* the event image on the result card */}
                <img src={EventTarget.img_loc} alt="event image"></img>
            </div>
            {/* the part that show the title */}
            <div className="SR-title">Test Event 3100 project deadline is 14/4, WHAT A DISASTER{EventTarget.title}</div>
            {/* the container for the information of the event in result card */}
            <div className="SR-info-container">
                <div className="SR-Organizer">By Sze MuK Hei CLS LIMITED</div>
                <div className="SR-Date">Date:&nbsp;14/4</div>
                <div className="SR-Time">Time:&nbsp;11:59</div>
                <div className="SR-Venue">Venue:&nbsp;home</div>
            </div>
            {/* the row container for the buttons */}
            <Row>
                <Col sm={4}></Col>
                {/* the column container for More button */}
                <Col className="SR-More-Con" sm={3}>
                    {/* imported more button */}
                    <FormButton content="More" />
                </Col>
                {/* the column container for Join button */}
                <Col className="SR-Join-Con" sm={1}>
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