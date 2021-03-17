import React, { useState } from 'react';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import UpcomingEvents from '../components/UpcomingEvents'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* <Header /> */}
      </div>
      <div className="navbar">
        {/* <Navbar /> */}
      </div>
      <div className="row">
        <div className="col-9">
          <Calendar />
        </div>
        <div className="col-3">
          <UpcomingEvents />
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