import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';
import skyBanner from '../src/assets/sky-banner.jpg'; // Update path as needed

const App = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState(null);

  const handleSearchResults = async (results, params) => {
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
        setCurrentSearchParams(params); // Store the search parameters
      } else {
        console.warn('Invalid results structure:', results);
      }
    } catch (error) {
      console.error('Error processing search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add debug logging
  console.log('Current render state:', {
    hasResults: !!searchResults,
    hasItineraries: !!searchResults?.data?.itineraries,
    hasParams: !!currentSearchParams,
    isLoading
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div className="relative h-32 w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${skyBanner})`,
          }}
        >
          {/* Overlay for transparency */}
          <div className="absolute inset-0 bg-blue-900/30"></div>
        </div>
        
        {/* Header Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            FLIGHTS
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="relative z-20">
          <SearchForm onSearch={handleSearchResults} />
          {isLoading && (
            <div className="text-center py-4">
              <p>Searching for flights...</p>
            </div>
          )}
          {!isLoading && searchResults && (
            <div className="mt-4">
              {console.log('Rendering FlightResults with:', {
                hasResults: !!searchResults,
                hasData: !!searchResults?.data,
                hasItineraries: !!searchResults?.data?.itineraries,
                itinerariesLength: searchResults?.data?.itineraries?.length
              })}
              <FlightResults 
                flights={searchResults} 
                searchParams={currentSearchParams}
              />
            </div>
          )}
          {!isLoading && searchResults && !searchResults.data?.itineraries && (
            <div className="text-center py-4 text-red-600">
              No flights found for your search criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;