import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import UpcomingEvents from '../components/UpcomingEvents'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/pages/home.css';

const Home = () => {
  return (
    <div className="container-fluid home">
      <Header />
      <Navbar />
      <div className="row main-content">
        <div className="col-9">
          <Calendar />
        </div>
        <div className="col-3">
          <UpcomingEvents />
          {/* <h1>EventCard</h1> */}
          {/* <EventCard /> */}
        </div>
      </div>
      <div className="bg-danger">
        <h1>Footer</h1>
        {/* <Footer /> */}
      </div>
    </div>
  )
}

export default Home