import React, { useState } from 'react';
import '../styles/components/UpcomingEvents.css';
import Events from './Event/Events'

const UpcomingEvents = ({ height }) => {
  return (
    <div className="upcoming-events" style={{width:"100%", maxHeight: `${height}px`}}>
      <Events  height={height}/>
    </div>
  )
}

export default UpcomingEvents