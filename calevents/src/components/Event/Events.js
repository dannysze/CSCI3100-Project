import { useState, useEffect } from 'react'
import { Container, Row, Col, Modal, ListGroup, Button, ListGroupItem } from 'react-bootstrap'
import EventCard from './EventCard'
import getaddr from '../getaddr'
import '../../styles/components/Event/Events.css'

function Events({ height }) {
  const [events, setEvents] = useState([]);
  const [showEvent, setShow] = useState({ toggle: false, event: {} });

  //temporarily it will fetch all events since backend is still in progress
  useEffect(() => {
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents()
      setEvents(eventsFromServer)
    }
    getEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await fetch(getaddr() + 'events', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()

    return data
  }

  return (
    <div className='Events' >
      <div className="outer" style={{ width: "100%" }}>
        <h1>Upcoming</h1>
        <div className='events' style={{ height: `${height - 61}px` }}>
          {events.map((event, idx) => (
            <EventCard key={idx} event={event} onClick={() => setShow({ toggle: true, event: event })} />
          ))}
        </div>
      </div>


      <Modal
        show={showEvent.toggle}
        onHide={() => setShow({ toggle: false, event: {} })}
        dialogClassName='custom-modal'
        aria-labelledby='example-custom-modal-styling-title'
      >
        <Modal.Header className="pop-up-bar" closeButton>
          {/* <Modal.Title id='example-custom-modal-styling-title'>
            {showEvent.event.name}
          </Modal.Title> */}
        </Modal.Header>

        <Modal.Body>

          <Row className="row-container">
            <Col className="pop-img-container" sm={4}>

              <img src={showEvent.event.img_loc} alt="event-photo"></img>

            </Col >
            <Col className="pop-info-container" sm={7}>
              <div className="pop-up-title">Event Title: {showEvent.event.name}</div>
              <ListGroup>
                <ListGroup.Item className="pop-info">Organizer: {showEvent.event.organizer}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Date: {showEvent.event.start_date === showEvent.event.end_date ? `${showEvent.event.start_date}` : `${showEvent.event.start_date}` + "-" + `${showEvent.event.end_date}`}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Time: {showEvent.event.start_time} - {showEvent.event.end_time}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Venue: {showEvent.event.venue}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Maximum Number of Participant: {showEvent.event.capacity === null ? "Unlimited" : `${showEvent.event.capacity}`}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Fee: {showEvent.event.ticket === 0 ? "Free" : `${showEvent.event.ticket}`}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Days for refund: {showEvent.event.days_for_refund === null ? "Not Allow" : `${showEvent.event.days_for_refund}`}</ListGroup.Item>

              </ListGroup>
            </Col>
          </Row>
          <Row >
            <Col>
              <div className="pop-description-head">Description</div>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div className="pop-description" data-spy="scroll" >{showEvent.event.desc}</div>
            </Col>
          </Row>
          <Row>
            <Col sm={8}></Col>
            <Col sm={1}>
              <button className="pop-button">Join</button>
            </Col>

            <Col sm={3}>
              <button className="pop-button-organizer">Contact Organizer</button>
            </Col>
          </Row>






        </Modal.Body>
      </Modal>
    </div >
  );
}

export default Events;