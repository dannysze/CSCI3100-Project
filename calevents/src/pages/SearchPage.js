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
    <div>
      Search Page
    </div>
  )
}

export default SearchPage