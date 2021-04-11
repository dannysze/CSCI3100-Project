import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/pages/SearchPage.css';

const SearchPage = () => {
  
  const [startDate, setStartDate] = useState(new Date()); 

  useEffect(() => {
    document.title = 'Search Page';
  })


  return (
    <Container className="home" fluid>
      <Header />
      <Navbar />
      <Row className="main-content">
        <Col md={9}>
          
        </Col>
        <Col md={3}>
          
        </Col>
      </Row>
      <Footer />
    </Container>
  )
}

export default SearchPage