import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export const DatePicker = ({ selected, onChange, placeholder }) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      placeholderText={placeholder}
      className="w-full p-2 border rounded"
      dateFormat="MM/dd/yyyy"
      minDate={new Date()}
    />
  );
};