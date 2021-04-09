import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Schedule from '../components/Calendars/Schedule';
import History from '../components/History';
import Footer from '../components/Footer';
import '../styles/pages/MyCalendar.css'

const MyCalendar = () => {

  useEffect(() => {
    document.title = 'My Calendar';
  })

  return (
    <Container className="home" fluid>
      <Header />
      <Navbar />
      <Row className="main-content">
        <Col sm={8}>
          <Schedule />
        </Col>
        <Col sm={4}>
          <History />
        </Col>
      </Row>
      <Footer />
    </Container>
  )
}

export default MyCalendar