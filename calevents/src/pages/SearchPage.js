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
      <Row></Row>
      <Row>
        <Col md={12}>

          <div className="Search-top">
            <div className="logo-container">
              S e a r c h
              <Search className="Search-logo" />

            </div>
          </div>

        </Col>
      </Row>
      <Row className="Search-box-container">
        <Row className="Search-bar-container">
          <Col md={10}>
            <form className="Search-bar">
              <input type="text" name="Search-bar" placeholder="  Enter keyword..."></input>

            </form>

          </Col>
          <Col md={2}>
            <button className="Search-button">
              <Search />
            </button>
          </Col>
        </Row>
        <Row className="Price-container">
          <Col sm={1} className="p-tag">Price:&nbsp;</Col>
          <Col sm={3}>
            <input type="checkbox" className="p-choice-1" value="Free"></input>
            <label for="p-choice-1"> Free</label><br></br>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="p-choice-2" value="$1-50"></input>
            <label for="p-choice-2">$1-50</label>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="p-choice-3" value="$51-150"></input>
            <label for="p-choice-3">$51-150</label>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="p-choice-4" value="$51-500"></input>
            <label for="p-choice-4">$151-500</label>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="p-choice-5" value="$500+"></input>
            <label for="p-choice-5">$500+</label>
          </Col>
        </Row>
        <Row className="Date-container">
          <Col sm={1} className="d-tag">Date:&nbsp;</Col>
          {/* <CustomDatePicker
            onChangeHandler={(date) => setStartSelectedDate(date)}
            startDate={startSelectedDate}
            placeholder="Select Start Time"
          />
          <CustomDatePicker
            onChangeHandler={(date) => { setEndSelectedDate(date) }}
            startDate={endSelectedDate}
            placeholder="Select End Time"
          /> */}

        </Row>
        <Row className="Category-container">
          <Col sm={1} className="c-tag">Type:&nbsp;</Col>
          <Col sm={3}>
            <input type="checkbox" className="c-choice-1" value="Academic"></input>
            <label for="p-choice-1"> Academic</label><br></br>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="c-choice-2" value="Sport"></input>
            <label for="p-choice-2">Sport</label>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="c-choice-3" value="Music"></input>
            <label for="p-choice-3">Music</label>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="c-choice-4" value="Health"></input>
            <label for="p-choice-4">Health</label>
          </Col>
          <Col sm={2}>
            <input type="checkbox" className="c-choice-5" value="Festival"></input>
            <label for="p-choice-5">Festival</label>
          </Col>

        </Row>


      </Row>
      <Row>
        <Col sm={3}></Col>
        <Col sm={3}><SearchResultCard /></Col>
        <Col sm={3}><SearchResultCard /></Col>
        <Col sm={3}></Col>

      </Row>
      <Footer />
    </Container>
  )
}

export default SearchPage