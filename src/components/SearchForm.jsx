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
    cabinClass: '', // Set default to empty string
    adults: 1,
    childrens: 0,
    infants: 0
  });

  const [tripType, setTripType] = useState('round'); // 'round' or 'one-way'

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

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const passengerDropdownRef = useRef(null);
  const [tempPassengerCounts, setTempPassengerCounts] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!suggestionsRef.current.from?.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, from: false }));
      }
      if (!suggestionsRef.current.to?.contains(event.target)) {
        setShowSuggestions(prev => ({ ...prev, to: false }));
      }
      if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
        setShowPassengerDropdown(false);
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

  const handleTripTypeChange = (e) => {
    const newTripType = e.target.value;
    setTripType(newTripType);
    if (newTripType === 'one-way') {
      setSearchData(prev => ({ ...prev, returnDate: null }));
    }
  };

  const handlePassengerCount = (type, operation) => {
    const limits = {
      adults: { min: 1, max: 9 },
      childrens: { min: 0, max: 9 },
      infants: { min: 0, max: 9 }
    };

    setTempPassengerCounts(prev => {
      const newCount = operation === 'add' ? prev[type] + 1 : prev[type] - 1;
      if (newCount >= limits[type].min && newCount <= limits[type].max) {
        return { ...prev, [type]: newCount };
      }
      return prev;
    });
  };

  const getTotalPassengers = () => {
    return searchData.adults + searchData.childrens + searchData.infants;
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
      // Format the date and filter out empty cabinClass
      const formattedData = {
        ...searchData,
        departDate: formatDateToString(searchData.departDate)
      };

      // Remove cabinClass if it's empty
      if (!formattedData.cabinClass) {
        delete formattedData.cabinClass;
      }
      
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
        {/* Trip Type Selector */}
        <div className="mb-4">
          <select
            value={tripType}
            onChange={handleTripTypeChange}
            className="p-2 text-sm text-gray-600 border rounded bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <option value="round">Round Trip</option>
            <option value="one-way">One Way</option>
          </select>
        </div>

        {/* Main search inputs - 4 columns on large screens, 2 on medium, 1 on small */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* From Field */}
          <div className="relative" ref={el => suggestionsRef.current.from = el}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              placeholder="e.g., New York"
              className="p-2 border rounded w-full"
              value={searchData.from}
              onChange={(e) => handleInputChange(e, 'from')}
            />
            {showSuggestions.from && suggestions.from.length > 0 && (
              <div className="absolute z-20 w-full bg-white border rounded-md shadow-lg mt-1">
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

          {/* To Field */}
          <div className="relative" ref={el => suggestionsRef.current.to = el}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              placeholder="e.g., London"
              className="p-2 border rounded w-full"
              value={searchData.to}
              onChange={(e) => handleInputChange(e, 'to')}
            />
            {showSuggestions.to && suggestions.to.length > 0 && (
              <div className="absolute z-20 w-full bg-white border rounded-md shadow-lg mt-1">
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

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <DatePicker
              selected={searchData.departDate}
              onChange={(date) => handleDateChange(date, 'departDate')}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded"
              placeholderText="Select date"
              required
            />
          </div>

          {/* Return Date - Only show if round trip is selected */}
          {tripType === 'round' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return
              </label>
              <DatePicker
                selected={searchData.returnDate}
                onChange={(date) => handleDateChange(date, 'returnDate')}
                minDate={searchData.departDate}
                dateFormat="yyyy-MM-dd"
                className="w-full p-2 border rounded"
                placeholderText="Select return"
              />
            </div>
          )}
        </div>

        {/* Secondary options - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cabin Class
            </label>
            <select 
              className="w-full p-2 border rounded"
              value={searchData.cabinClass}
              onChange={(e) => setSearchData({...searchData, cabinClass: e.target.value})}
            >
              <option value="">Any Class</option>
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
          <div className="relative" ref={passengerDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <button
              type="button"
              onClick={() => {
                setShowPassengerDropdown(!showPassengerDropdown);
                setTempPassengerCounts({ ...searchData });
              }}
              className="w-full p-2 border rounded flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{getTotalPassengers()} Passenger{getTotalPassengers() !== 1 ? 's' : ''}</span>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {showPassengerDropdown && (
              <div className="absolute z-50 mt-1 w-72 bg-white rounded-lg shadow-lg border p-4">
                {/* Passenger Categories */}
                {[
                  { type: 'adults', label: 'Adults', subtext: 'Age 12+' },
                  { type: 'childrens', label: 'Children', subtext: 'Age 2-11' },
                  { type: 'infants', label: 'Infants', subtext: 'Under 2' }
                ].map(({ type, label, subtext }) => (
                  <div key={type} className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-gray-500">{subtext}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handlePassengerCount(type, 'subtract')}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            tempPassengerCounts[type] <= (type === 'adults' ? 1 : 0)
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                          }`}
                          disabled={tempPassengerCounts[type] <= (type === 'adults' ? 1 : 0)}
                        >
                          -
                        </button>
                        <span className="w-4 text-center">{tempPassengerCounts[type]}</span>
                        <button
                          type="button"
                          onClick={() => handlePassengerCount(type, 'add')}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            tempPassengerCounts[type] >= 9
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                          }`}
                          disabled={tempPassengerCounts[type] >= 9}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-4 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowPassengerDropdown(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchData(tempPassengerCounts);
                      setShowPassengerDropdown(false);
                    }}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
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