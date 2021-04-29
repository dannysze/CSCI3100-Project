// cutomized date picker using react-datepicker library
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// main component
// props:
// startDate: if exists, the default selected date of the datepicker
// showTime: if true, there would also be time picker
// minDate: the earliest date can be chosen
const CustomDatePicker = ({ onChangeHandler, placeholder, startDate, showTime = true, minDate = false}) => {

  return (
    <DatePicker
      selected={startDate}
      onChange={date => onChangeHandler(date)}
      dateFormat={`MM/dd/yyyy  ${showTime ? 'hh:mmaa' : ''}`}
      placeholderText={placeholder}
      showTimeInput={showTime}
      minDate={minDate}
    />
  )
}

export default CustomDatePicker