import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchFlights } from '../utils/apiService';
import { isValidFutureDate, formatDateToString } from '../utils/utils';

const SearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    from: '',
    fromEntityId: '27544008', // Default for LOND
    to: '',
    toEntityId: '27537542', // Default for NYCA
    departDate: new Date(), // Initialize with today's date
    returnDate: null,
    passengers: 1,
    cabinClass: 'economy'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, field) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z]{0,4}$/.test(value)) {
      setSearchData(prev => ({ 
        ...prev, 
        [field]: value,
        [`${field}EntityId`]: ''
      }));
    }
  };

  const handleDateChange = (date, field) => {
    setSearchData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchData.from || !searchData.to) {
      alert('Please enter departure and arrival airports');
      return;
    }

    if (!searchData.departDate) {
      alert('Please select a departure date');
      return;
    }

    try {
      setLoading(true);
      // Format the date before sending to API
      const formattedData = {
        ...searchData,
        departDate: formatDateToString(searchData.departDate)
      };
      
      const results = await searchFlights(formattedData);
      onSearch(results);
    } catch (error) {
      console.error('Error:', error);
      alert('Error searching flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="From (e.g., LOND)"
              className="p-2 border rounded w-full"
              value={searchData.from}
              onChange={(e) => handleInputChange(e, 'from')}
              maxLength={4}
            />
            <p className="text-xs text-gray-500 mt-1">Enter airport code (e.g., LOND, NYCA)</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="To (e.g., NYCA)"
              className="p-2 border rounded w-full"
              value={searchData.to}
              onChange={(e) => handleInputChange(e, 'to')}
              maxLength={4}
            />
            <p className="text-xs text-gray-500 mt-1">Enter airport code (e.g., LOND, NYCA)</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <DatePicker
              selected={searchData.departDate}
              onChange={(date) => handleDateChange(date, 'departDate')}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded"
              placeholderText="Select departure date"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date (Optional)
            </label>
            <DatePicker
              selected={searchData.returnDate}
              onChange={(date) => handleDateChange(date, 'returnDate')}
              minDate={searchData.departDate}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded"
              placeholderText="Select return date"
            />
          </div>
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
          disabled={loading}
          className={`w-full md:w-auto px-6 py-2 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded`}
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;