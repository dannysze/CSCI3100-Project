import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/pages/SearchPage.css';
import { Search } from 'react-bootstrap-icons';
import SearchResultCard from '../components/Event/SearchResultCard'
import CustomDatePicker from '../components/CustomeDatePicker';
import getaddr from '../components/getaddr'


const SearchPage = () => {
  // const priceRange = ['Free', '$1 - $50', '$51 - $150', '$151 - $500', '$500+'];
  const priceRange = [{
    'name': 'Free',
    'min': 0,
    'max': 0
  }, {
    'name': '$1 - $50',
    'min': 1,
    'max': 50
  }, {
    'name': '$51 - $150',
    'min': 51,
    'max': 150
  }, {
    'name': '$151 - $500',
    'min': 151,
    'max': 500
  }, {
    'name': '$500+',
    'min': 501,
    'max': 1000
  }]

  const initialSearchInfo = {
    'event_name': '',
    'min': 0,
    'max': 0,
    'category': []
  }
  const categories = ['Academic', 'Sport', 'Music', 'Health', 'Festival', 'Career', 'Others']

  const [startSelectedDate, setStartSelectedDate] = useState(new Date());
  const [endSelectedDate, setEndSelectedDate] = useState(new Date());
  const [searchInfo, setSearchInfo] = useState(initialSearchInfo);
  const history = useHistory();

  const [searchResult, setSearchResult] = useState([]); 
  useEffect(() => {
    document.title = 'Search Page';
    
  }, [searchInfo, history, searchResult]);


  const onChangeHandler = (event) => {
    // console.log(event.target.value);
    if (event.target.type === 'radio') {
      setSearchInfo({...searchInfo, 'min': parseInt(event.target.value.split('-')[0]), 'max': parseInt(event.target.value.split('-')[1])});
    } else if (event.target.type === 'checkbox') { 
      let categoryArr = searchInfo.category.slice();
      if (event.target.checked) {
        categoryArr.push(event.target.value);
      } else {
        const index = categoryArr.indexOf(event.target.value);
        if (index > -1) {
          categoryArr.splice(index, 1);
        }
      }
      setSearchInfo({...searchInfo, 'category': categoryArr});
    } else {
      setSearchInfo({...searchInfo, [event.target.name]: event.target.value});
    }
  }

  const submitSearch = async (event) => {
    const params = new URLSearchParams();

    params.append('name', searchInfo['event_name']);
    params.append('min', searchInfo['min']);
    params.append('max', searchInfo['max']);
    params.append('start_date', startSelectedDate.toJSON().split('T')[0]);
    params.append('end_date', endSelectedDate.toJSON().split('T')[0]);
    params.append('category', JSON.stringify(searchInfo['category']));
    console.log(params.toString());

    fetch(getaddr()+'filter_events/?'+params.toString(), {
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      // console.log(JSON.stringify(data));
      setSearchResult(data);
    })
  }


  return (
    <Container className="home" fluid>
      <Header />
      <Navbar />
      <Row className="Search-box-container">
        <div className="Search-bar-container">
          <Col className="Search-bar">
            <input type="text" name="event_name" placeholder="Search Events..." onChange={onChangeHandler}></input>
            <button className="Search-button" onClick={submitSearch}><Search /></button>
          </Col>
        </div>
        <Row className="Price-container">
          <Col xs={1} className="p-tag">Price:&nbsp;</Col>
          {priceRange.map((price, index) => (
            <Col xs key={index}>
              <input type="radio" className="p-choice-1" name="price" value={`${price.min}-${price.max}`} onChange={onChangeHandler}></input>
              <label htmlFor="p-choice-1">&nbsp;{price.name}</label><br></br>
            </Col>
          ))}
        </Row>
        <Row className="Date-container">
          <Col xs={6} className="Datepicker-container">
            <div className="d-tag">Start Date:&nbsp;</div>
            <div >
              <CustomDatePicker
                onChangeHandler={(date) => setStartSelectedDate(date)}
                startDate={startSelectedDate}
                placeholder="Select Start Time"
                showTime={false}
              />
            </div>
          </Col>
          <Col xs={6} className="Datepicker-container">
            <div className="d-tag">End Date:&nbsp;</div>
            <div>
              <CustomDatePicker
                onChangeHandler={(date) => setEndSelectedDate(date)}
                startDate={endSelectedDate}
                placeholder="Select Start Time"
                showTime={false}
                minDate={startSelectedDate}
              />
            </div>
          </Col>
        </Row>
        <Row className="Category-container">
          <Col xs={1} className="c-tag">Type:&nbsp;</Col>
          {categories.map((category, index) => (
            <Col xs key={index}>
              <input type="checkbox" className="c-choice-1" value={category} name="category" onChange={onChangeHandler}></input>
              <label htmlFor="c-choice-1">&nbsp;{category}</label><br></br>
            </Col>
          ))}
        </Row>
      </Row>
      <Row className="Search-results">
        {searchResult.length === 0 ? <h1>No matching results</h1> : 
          searchResult.map((event, index) => (
            <Col xs={6} md={4}>
              <SearchResultCard event={event} key={index} />
            </Col>
          ))}
      </Row>
      <Footer />
    </Container>
  )
}

export default SearchPage