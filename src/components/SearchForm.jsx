import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchFlights, searchAirports } from '../utils/apiService';
import { isValidFutureDate, formatDateToString } from '../utils/utils';

const SearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    from: '',
    fromEntityId: '',
    to: '',
    toEntityId: '',
    departDate: new Date(),
    returnDate: null,
    passengers: 1,
    cabinClass: 'economy'
  });

  const [suggestions, setSuggestions] = useState({
    from: [],
    to: []
  });
  
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState({
    from: false,
    to: false
  });

  const suggestionsRef = useRef({
    from: null,
    to: null
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!suggestionsRef.current.from?.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, from: false }));
      }
      if (!suggestionsRef.current.to?.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, to: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e, field) => {
    const value = e.target.value;
    setSearchData(prev => ({
      ...prev,
      [field]: value,
      [`${field}EntityId`]: ''
    }));

    if (value.length >= 2) {
      try {
        const results = await searchAirports(value);
        setSuggestions(prev => ({
          ...prev,
          [field]: results
        }));
        setShowSuggestions(prev => ({
          ...prev,
          [field]: true
        }));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions(prev => ({
        ...prev,
        [field]: []
      }));
    }
  };

  const handleSuggestionSelect = (suggestion, field) => {
    setSearchData(prev => ({
      ...prev,
      [field]: suggestion.presentation.title,
      [`${field}EntityId`]: suggestion.navigation.entityId
    }));
    setShowSuggestions(prev => ({
      ...prev,
      [field]: false
    }));
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
          <div className="relative" ref={el => suggestionsRef.current.from = el}>
            <input
              type="text"
              placeholder="From (e.g., New York)"
              className="p-2 border rounded w-full"
              value={searchData.from}
              onChange={(e) => handleInputChange(e, 'from')}
            />
            {showSuggestions.from && suggestions.from.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                {suggestions.from.map((suggestion, index) => (
                  <div
                    key={suggestion.navigation.entityId}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionSelect(suggestion, 'from')}
                  >
                    <div className="font-medium">{suggestion.presentation.title}</div>
                    <div className="text-sm text-gray-500">{suggestion.presentation.subtitle}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={el => suggestionsRef.current.to = el}>
            <input
              type="text"
              placeholder="To (e.g., London)"
              className="p-2 border rounded w-full"
              value={searchData.to}
              onChange={(e) => handleInputChange(e, 'to')}
            />
            {showSuggestions.to && suggestions.to.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                {suggestions.to.map((suggestion, index) => (
                  <div
                    key={suggestion.navigation.entityId}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionSelect(suggestion, 'to')}
                  >
                    <div className="font-medium">{suggestion.presentation.title}</div>
                    <div className="text-sm text-gray-500">{suggestion.presentation.subtitle}</div>
                  </div>
                ))}
              </div>
            )}
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