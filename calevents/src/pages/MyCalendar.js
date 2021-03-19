import React, { useEffect, useState } from 'react';
import '../styles/pages/MyCalendar.css'

const MyCalendar = () => {

  useEffect(() => {
    document.title = 'My Calendar';
  })

  return (
    <h1>
      My Calendar Page
    </h1>
  )
}

export default MyCalendar