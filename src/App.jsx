import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';

const App = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Flight Search</h1>
        <SearchForm onSearch={handleSearchResults} />
        {searchResults && <FlightResults flights={searchResults} />}
      </div>
    </div>
  );
};

export default App;