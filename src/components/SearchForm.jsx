import React, { useState } from 'react';
import { DatePicker } from './DatePicker';
import { searchFlights } from '../utils/apiService';
import { isValidFutureDate, formatDateToString } from '../utils/utils';

const SearchForm = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: null,
    returnDate: null,
    passengers: 1,
    cabinClass: 'economy'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!isValidFutureDate(searchData.departDate)) {
      alert('Please select a valid departure date');
      return;
    }

    if (searchData.returnDate && !isValidFutureDate(searchData.returnDate)) {
      alert('Please select a valid return date');
      return;
    }

    const formattedData = {
      ...searchData,
      departDate: formatDateToString(searchData.departDate),
      returnDate: formatDateToString(searchData.returnDate)
    };

    try {
      await searchFlights(formattedData);
    } catch (error) {
      console.error('Error submitting search:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="From"
            className="p-2 border rounded"
            value={searchData.from}
            onChange={(e) => setSearchData({...searchData, from: e.target.value})}
          />
          <input
            type="text"
            placeholder="To"
            className="p-2 border rounded"
            value={searchData.to}
            onChange={(e) => setSearchData({...searchData, to: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            selected={searchData.departDate}
            onChange={(date) => setSearchData({...searchData, departDate: date})}
            placeholder="Departure Date"
          />
          <DatePicker
            selected={searchData.returnDate}
            onChange={(date) => setSearchData({...searchData, returnDate: date})}
            placeholder="Return Date"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            className="p-2 border rounded"
            value={searchData.cabinClass}
            onChange={(e) => setSearchData({...searchData, cabinClass: e.target.value})}
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
          <input
            type="number"
            min="1"
            placeholder="Passengers"
            className="p-2 border rounded"
            value={searchData.passengers}
            onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
          />
        </div>
        <button 
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default SearchForm;