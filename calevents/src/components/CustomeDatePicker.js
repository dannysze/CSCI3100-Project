import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({ onChangeHandler, placeholder, startDate }) => {

  return (
    <DatePicker
      selected={startDate}
      onChange={onChangeHandler}
      dateFormat="MM/dd/yyyy  hh:mmaa"
      placeholderText={placeholder}
      showTimeInput
    />
  )
}

export default CustomDatePicker