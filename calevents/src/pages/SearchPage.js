import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendars/Calendar';
import UpcomingEvents from '../components/UpcomingEvents';
import Footer from '../components/Footer';
import '../styles/pages/SearchPage.css';

const SearchPage = () => {

  useEffect(() => {
    document.title = 'Search Page';
  })

  return (
    <h1>
      Search Page
    </h1>
  )
}

export default SearchPage