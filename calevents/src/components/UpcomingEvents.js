import React, { useState } from 'react';
import '../styles/components/UpcomingEvents.css';
import Events from './Event/Events'

const UpcomingEvents = () => {
  return (
    <div className="upcoming-events" style={{width:"100%"}}>
      <Events/>
    </div>
  )
}

export default UpcomingEvents