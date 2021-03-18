import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import UpcomingEvents from '../components/UpcomingEvents'
import '../styles/pages/home.css';

const Home = () => {
  return (
    <Container className="home" fluid>
      <Header />
      <Navbar />
      <Row className="main-content">
        <Col sm={9}>
          <Calendar />
        </Col>
        <Col sm={3}>
          <UpcomingEvents />
          {/* <h1>EventCard</h1> */}
          {/* <EventCard /> */}
        </Col>
      </Row>
      <div className="bg-danger">
        <h1>Footer</h1>
        {/* <Footer /> */}
      </div>
    </Container>
  )
}

export default Home