// My Page component
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Schedule from '../components/Calendars/Schedule';
import History from '../components/History';
import Footer from '../components/Footer';
import '../styles/pages/MyCalendar.css'

// Main component
const MyCalendar = () => {

  // setting the doc. title
  useEffect(() => {
    document.title = 'My Calendar';
  }, [])

  // The basic layout of the page using BS4 grid
  return (
    <Container className="home" fluid>
      <Header />
      <Navbar />
      <Row className="main-content">
        <Col xs={8}>
          <Schedule />
        </Col>
        <Col xs={4}>
          <History />
        </Col>
      </Row>
      <Footer />
    </Container>
  )
}

export default MyCalendar