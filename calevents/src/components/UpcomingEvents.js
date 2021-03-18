import React, { useState } from 'react';
import '../styles/components/upcomingEvents.css';
import Events from './Event/Events'

const UpcomingEvents = () => {
  return (
    <div className="upcoming-events" style={{width:"100%"}}>
      <Events/>
    </div>
  )
}

export default UpcomingEvents