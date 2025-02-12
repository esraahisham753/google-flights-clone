import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';
import { searchFlights } from './utils/apiService';

const App = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchData) => {
    setLoading(true);
    try {
      const results = await searchFlights(searchData);
      setFlights(results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Flight Search</h1>
        <SearchForm onSearch={handleSearch} />
        {loading ? (
          <div className="text-center mt-8">Loading...</div>
        ) : (
          <FlightResults flights={flights} />
        )}
      </div>
    </div>
  );
};

export default App;