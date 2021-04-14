import { useState, useContext} from 'react'
import { Container, Row, Col, Modal, ListGroup, Button, ListGroupItem } from 'react-bootstrap'
import EventCard from './EventCard'
import '../../styles/components/Event/Events.css'
import { FormButton } from "../CustomButton.js"
import {UserContext} from '../../UserContext'
import useToken from '../../useToken'
import getaddr from '../../components/getaddr'


const sqlToJsDate = (sqlDate, sqlTime) => {
  if(!sqlDate||!sqlTime) return;
  var sqlDateArr1 = sqlDate.split("-");
  var sYear = sqlDateArr1[0];
  var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
  var sDay = sqlDateArr1[2];

  var sqlTimeArr = sqlTime.split(":");

  return new Date(sYear, sMonth, sDay, sqlTimeArr[0], sqlTimeArr[1], sqlTimeArr[2]);
}

function Events({ height, events, title}) {
  const [showEvent, setShow] = useState({ toggle: false, event: {} });

  return (
    <div className='Events' >
      <div className="outer" style={{ width: "100%" }}>
        <h1>{title}</h1>
        <div className='events' style={{ height: `${height - 61}px` }}>
          {events.map((event, idx) => (
            <EventCard key={idx} event={event} onClick={() => setShow({ toggle: true, event: event })} />
            ))}
        </div>
      </div>
      <EventModal showEvent={showEvent} setShow={setShow}/>
    </div>
  )
}

export default Events;  


const EventModal = ({ showEvent, setShow }) => {
  const {user, setUser} = useContext(UserContext);
  const {token, setToken} = useToken();
  const [confirm,setConfirm] = useState(0);

  // //may need date conversion
  const compareTime = (joinedEvent) => {
      let event = showEvent.event;
      if(((joinedEvent.start_time >= event.start_time && joinedEvent.start_time <= event.end_time)&&(joinedEvent.start_date >= event.start_date && joinedEvent.start_date <= event.end_date))
          || ((joinedEvent.end_time >= event.start_time && joinedEvent.end_time <= event.end_time)&&(joinedEvent.end_date >= event.start_date && joinedEvent.end_date <= event.end_date)))
      return true;
  };

  const checkTimeClash = async () => {
      let joinedEvents = await (await fetch(getaddr()+'joined_events/' + user.user_id)).json();
      let clashedEvents  = joinedEvents.filter(
          joinedEvent => {return compareTime(joinedEvent);});
      console.log(clashedEvents);
      return clashedEvents;
  };

  const joinEvent = async () => {
    try{
        let res = await fetch(getaddr()+'join_event', {
          method: 'POST',
          headers: {
            'auth': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({user_id:user.user_id,event_id:showEvent.event.event_id}),
        });
        let body = await res.json();
        if (!res.ok){
              alert(body['error']);
        }else{
            let clashes = await checkTimeClash();
            console.log(clashes);
            clashes.length>0
            ? alert('You has successfully joined the event but please note that the event coincides in time with some of the joined events.\nYou can check in schedule.')
            : alert('You has successfully joined the event.');
        }
      }catch(err){
        console.log(err);
      }
  };


  const checkJoinable = () => {
    return sqlToJsDate(showEvent.event.start_date, showEvent.event.start_time) >= new Date()&&user.type===0;
  };


  return (
    <>
    {/* pop-up screen for showing complete selected event's information */}
      <Modal
        show={showEvent.toggle}
        onHide={() => setShow({ toggle: false, event: {} })}
        dialogClassName='custom-modal'
        aria-labelledby='example-custom-modal-styling-title'
      >
        {/* the header bar of the pop-up screen */}
        <Modal.Header className="pop-up-bar" closeButton>
          {/* <Modal.Title id='example-custom-modal-styling-title'>
            {showEvent.event.name}
          </Modal.Title> */}
          <h1>E v e n t</h1>
        </Modal.Header>
        {/* the body of the pop-up screen */}
        <Modal.Body>
          {/* first part: row container to show the image and event information except event description */}
          <Row className="row-container">
            {/* column container to show the image */}
            <Col className="pop-img-container" sm={4}>
              {/* the  image */}
              <img src={showEvent.event.img_loc} alt="event-photo"></img>

            </Col >
            {/* columen container for information of the event */}
            <Col className="pop-info-container" sm={7}>
              {/* the title of the event */}
              <div className="pop-up-title">{showEvent.event.name}</div>
              {/* Bootstrap listgroup to show the event information */}
              <ListGroup variant="flush">
                <ListGroup.Item className="pop-info">Organizer: {showEvent.event.username||showEvent.event.organizer}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Date: {showEvent.event.start_date === showEvent.event.end_date ? `${showEvent.event.start_date}` : `${showEvent.event.start_date}` + "  to  " + `${showEvent.event.end_date}`}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Time: {showEvent.event.start_time}&nbsp;-&nbsp;{showEvent.event.end_time}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Venue: {showEvent.event.venue}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Maximum Number of Participant: {showEvent.event.capacity === null ? "Unlimited" : `${showEvent.event.capacity}`}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Fee: {showEvent.event.ticket === 0 ? "Free" : `${showEvent.event.ticket}`}</ListGroup.Item>
                <ListGroup.Item className="pop-info">Days for refund: {showEvent.event.days_for_refund === null ? "Not Allow" : `${showEvent.event.days_for_refund}`}</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          {/* second part: row container for the word "Description" */}
          <Row >
            <Col>
              <div className="pop-description-head">Description</div>
            </Col>
          </Row>
          {/* third part: row container for the description body */}
          <Row>
            <Col sm={12}>
              {/* the discription */}
              <div className="pop-description" data-spy="scroll" >{showEvent.event.description}</div>
            </Col>
          </Row>
          <Row>
            <Col sm={8}></Col>
            <Col sm={1}>
              {/* <button className="pop-button">Join</button> */}
              {/* the button for joining event */}
              {checkJoinable()&&<FormButton content="Join" clickHandler={joinEvent}/>}
            </Col>
            <Col sm={3}>
              {/* <button className="pop-button-organizer">Contact Organizer</button> */}
              {/* the button for contacting organizer */}
              <FormButton className="pop-button-organizer" content="Contact Organizer" />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export { EventModal }