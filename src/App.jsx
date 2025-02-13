import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';

const App = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResults = async (results) => {
    setIsLoading(true);
    try {
      console.log('Raw Search Results:', results);
      
      if (!results) {
        console.warn('No results received');
        return;
      }

      // Handle the new API response format
      if (results.status && results.data?.itineraries) {
        console.log('Valid results structure found:', results.data.itineraries.length, 'items');
        setSearchResults(results);
      } else {
        console.warn('Invalid results structure:', results);
      }
    } catch (error) {
      console.error('Error processing search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Flight Search</h1>
        <SearchForm onSearch={handleSearchResults} />
        {isLoading && (
          <div className="text-center py-4">
            <p>Searching for flights...</p>
          </div>
        )}
        {searchResults && searchResults.data?.itineraries && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
              Found {searchResults.data.itineraries.length} Flights
            </h2>
            <FlightResults 
              flights={searchResults} 
              onSelectFlight={(flight) => console.log('Selected flight:', flight)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;