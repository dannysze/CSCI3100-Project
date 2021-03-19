import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import UpcomingEvents from '../components/UpcomingEvents';
import Footer from '../components/Footer';
import '../styles/pages/Home.css';

const Home = () => {

  useEffect(() => {
    document.title = 'Home Page';
  })

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
      <Footer />
    </Container>
  )
}

export default Home