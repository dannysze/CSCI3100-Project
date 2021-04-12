import React, { useState, useEffect } from 'react';
import "../../styles/components/Event/SearchResultCard.css"
import PropTypes from 'prop-types';
import { FormButton } from "../CustomButton.js";

import { Container, Row, Col, Modal, ListGroup, Button, ListGroupItem } from 'react-bootstrap'


const SearchResultCard = ({ event, onClick }) => {
    return (
        <div className="SR-card-container">
            <div className="SR-img-container">
                <div className="SR-fee">$777</div>
                <img src={EventTarget.img_loc} alt="event image"></img>
            </div>

            <div className="SR-title">Test Event 3100 project deadline is 14/4, WHAT A DISASTER{EventTarget.title}</div>
            <div className="SR-info-container">
                <div className="SR-Organizer">By Sze MuK Hei CLS LIMITED</div>
                <div className="SR-Date">Date:&nbsp;14/4</div>
                <div className="SR-Time">Time:&nbsp;11:59</div>
                <div className="SR-Venue">Venue:&nbsp;home</div>
            </div>
            <Row>
                <Col sm={4}></Col>
                <Col className="SR-More-Con" sm={3}>
                    <FormButton content="More" />
                </Col>

                <Col className="SR-Join-Con" sm={1}>
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