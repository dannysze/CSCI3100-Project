import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/pages/SearchPage.css';
import { Search } from 'react-bootstrap-icons';
import SearchResultCard from '../components/Event/SearchResultCard'
import CustomDatePicker from '../components/CustomeDatePicker';

const SearchPage = () => {

  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    document.title = 'Search Page';
  })



  return (
    <Container className="home" fluid>
      <Header />
      <Navbar />
      <Row className="Search-box-container">
        <div className="Search-bar-container">
          <Col className="Search-bar">
            <input type="text" name="Search-bar" placeholder="  Enter keyword..."></input>
            <button className="Search-button"><Search /></button>
          </Col>
        </div>
        <Row className="Price-container">
          <Col xs={1} className="p-tag">Price:&nbsp;</Col>
          <Col xs={3}>
            <input type="checkbox" className="p-choice-1" value="Free"></input>
            <label for="p-choice-1"> Free</label><br></br>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="p-choice-2" value="$1-50"></input>
            <label for="p-choice-2">$1-50</label>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="p-choice-3" value="$51-150"></input>
            <label for="p-choice-3">$51-150</label>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="p-choice-4" value="$51-500"></input>
            <label for="p-choice-4">$151-500</label>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="p-choice-5" value="$500+"></input>
            <label for="p-choice-5">$500+</label>
          </Col>
        </Row>
        <Row className="Date-container">
          <Col xs={6} className="Datepicker-container">
            <div className="d-tag">Start Date:&nbsp;</div>
            <div >
              <CustomDatePicker
                // onChangeHandler={(date) => setStartSelectedDate(date)}
                // startDate={startSelectedDate}
                placeholder="Select Start Time"
              />
            </div>
          </Col>
          <Col xs={6} className="Datepicker-container">
            <div className="d-tag">End Date:&nbsp;</div>
            <div>
              <CustomDatePicker
                // onChangeHandler={(date) => setStartSelectedDate(date)}
                // startDate={startSelectedDate}
                placeholder="Select Start Time"
              />
            </div>
          </Col>
        </Row>
        <Row className="Category-container">
          <Col xs={1} className="c-tag">Type:&nbsp;</Col>
          <Col xs={3}>
            <input type="checkbox" className="c-choice-1" value="Academic"></input>
            <label for="p-choice-1"> Academic</label><br></br>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="c-choice-2" value="Sport"></input>
            <label for="p-choice-2">Sport</label>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="c-choice-3" value="Music"></input>
            <label for="p-choice-3">Music</label>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="c-choice-4" value="Health"></input>
            <label for="p-choice-4">Health</label>
          </Col>
          <Col xs={2}>
            <input type="checkbox" className="c-choice-5" value="Festival"></input>
            <label for="p-choice-5">Festival</label>
          </Col>

        </Row>


      </Row>
      <Row className="Search-results">
        <Col xs={6} md={4}><SearchResultCard /></Col>
        <Col xs={6} md={4}><SearchResultCard /></Col>
        <Col xs={6} md={4}><SearchResultCard /></Col>
        <Col xs={6} md={4}><SearchResultCard /></Col>
      </Row>
      <Footer />
    </Container>
  )
}

export default SearchPage