import {useState, useEffect} from 'react'
import {Container, Row, Col, Modal, ListGroup, Button, ListGroupItem} from 'react-bootstrap'
import EventCard from './EventCard'
import getaddr from '../getaddr'
import '../../styles/components/Event/Events.css'

function Events({ height }) {
  const [events, setEvents] = useState([]);
  const [showEvent, setShow] = useState({toggle:false, event:{}});

  //temporarily it will fetch all events since backend is still in progress
  useEffect(() => {
    const getEvents = async () => {
      const eventsFromServer = await fetchEvents()
      setEvents(eventsFromServer)
    }
    getEvents()
  })

  const fetchEvents = async () => {
    const res = await fetch(getaddr()+'events')
    const data = await res.json()

    return data
  }

  return (
    <div className='Events' >
      <div className="outer" style={{width:"100%"}}>
        <h1>Upcoming</h1>
        <div className='events' style={{height:`${height-61}px`}}>
        {events.map((event, idx)=> (
            <EventCard key={idx} event={event} onClick={() => setShow({toggle:true, event:event})}/>
        ))}
        </div>
      </div>


    <Modal
        show={showEvent.toggle}
        onHide={() => setShow({toggle:false, event:{}})}
        dialogClassName='custom-modal'
        aria-labelledby='example-custom-modal-styling-title'
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id='example-custom-modal-styling-title'>
            {showEvent.event.name}
          </Modal.Title> */}
        </Modal.Header>
        
        <Modal.Body>
          <Container style={{margin:'0px 0px'}} fluid>
            <Row>
              <Col xs={8} className='d-flex justify-content-start'>
                <h1>Event Title: {showEvent.event.name}</h1>
              </Col>
              <Col className='d-flex justify-content-end'>
                <Container>
                  <Row >
                     <h3 className="title">Participants: {showEvent.event.capacity===null?"not restricted":("placeholder"+"/"+showEvent.event.capacity)}</h3>
                  </Row>
                  <Row>
                    <Button variant='light'>
                        Join Event
                    </Button>
                    <Button variant='light'>
                        Contact Organizer
                    </Button>
                  </Row>
                </Container>
   
              </Col>
            </Row>
            <Row>
              <h3 className='title'>Details</h3>
            </Row>
            <Row>
              <ListGroup variant='flush'>
              <ListGroup.Item>Organizer: {showEvent.event.organizer}</ListGroup.Item>
              <ListGroup.Item>Date: {showEvent.event.start_date}</ListGroup.Item>
              <ListGroup.Item>Duration: {showEvent.event.start_time} - {showEvent.event.end_time}</ListGroup.Item>
              <ListGroup.Item>Venue: {showEvent.event.venue}</ListGroup.Item>
              <ListGroup.Item>Ticket: {(showEvent.event.ticket===0)?"free of charge":(showEvent.event.ticket+"HKD")}</ListGroup.Item>
              {showEvent.event.ticket!==0&&
                <>
                  <ListGroup.Item>Allow refund? : {showEvent.event.allow_refund===0?"No":"Yes"}</ListGroup.Item>
                  {showEvent.event.allow_refund!==0&&
                   <ListGroup.Item>
                    Days for refund: {showEvent.event.allow_refund} days
                    </ListGroup.Item>}
                </>
              }
              <ListGroup.Item></ListGroup.Item>
              </ListGroup>
            </Row>
            <Row>
              <h3 className='title'>Description</h3>
            </Row>
            <Row>
              <p>{showEvent.event.desc}</p>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Events;