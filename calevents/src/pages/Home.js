import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendars/Calendar';
import UpcomingEvents from '../components/UpcomingEvents';
import Footer from '../components/Footer';
import '../styles/pages/Home.css';

const Home = () => {

  const [height, setHeight] = useState(796);

  useEffect(() => {
    document.title = 'Home Page';
  })

  const heightHandler = () => {
    const viewHeight = document.getElementsByClassName('calendar-container')[0].clientHeight;
    setHeight(viewHeight);
  }

  return (
    <Container className="home" fluid>
      <Header />
      <Navbar />
      <Row className="main-content">
        <Col md={9}>
          <Calendar heightHandler={heightHandler}/>
        </Col>
        <Col md={3}>
          <UpcomingEvents height={height}/>
        </Col>
      </Row>
      <Footer />
    </Container>
  )
}

export default Home