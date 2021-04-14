import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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