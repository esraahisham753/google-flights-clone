import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const FlightResults = ({ flights, searchParams }) => {
  // Add debug logging
  console.log('FlightResults props:', {
    hasFlights: !!flights,
    flightCount: flights?.data?.itineraries?.length,
    hasSearchParams: !!searchParams
  });

  const [displayCount, setDisplayCount] = useState(3);
  const [activeTab, setActiveTab] = useState('best');
  const [isLoading, setIsLoading] = useState(false);

  // Sort flights based on active tab
  const sortedFlights = useMemo(() => {
    if (!flights?.data?.itineraries) return [];
    
    const flightsCopy = [...flights.data.itineraries];
    
    if (activeTab === 'cheapest') {
      return flightsCopy.sort((a, b) => {
        const priceA = parseFloat(a.price?.raw || 0);
        const priceB = parseFloat(b.price?.raw || 0);
        return priceA - priceB;
      });
    }
    
    return flightsCopy;
  }, [flights, activeTab]);

  // Early return if no flights data
  if (!flights?.data?.itineraries) {
    return <div className="text-center text-gray-600">Loading flights...</div>;
  }

  // Update the currentFlights logic to use sortedFlights
  const visibleFlights = sortedFlights.slice(0, displayCount);
  const hasMoreFlights = sortedFlights.length > displayCount;

  // Calculate cheapest price from original flights
  const cheapestPrice = useMemo(() => {
    if (!flights?.data?.itineraries?.length) return 0;
    
    return flights.data.itineraries.reduce((min, flight) => {
      const price = parseFloat(flight.price?.raw || 0);
      return price < min ? price : min;
    }, parseFloat(flights.data.itineraries[0].price?.raw || 0));
  }, [flights]);

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid time';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderCarriers = (carriers) => {
    if (!carriers?.marketing?.length) return null;
    return carriers.marketing.map((carrier) => (
      <div key={carrier.id} className="flex items-center">
        {carrier.logoUrl && (
          <img 
            src={carrier.logoUrl} 
            alt={carrier.name}
            className="w-8 h-8 object-contain"
          />
        )}
        <span className="ml-2 text-sm text-gray-600">{carrier.name}</span>
      </div>
    ));
  };

  // Update the tab click handlers
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setDisplayCount(3); // Reset display count when switching tabs
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-4">
      {/* Tabs */}
      <div className="flex border-b w-full">
        <button
          className={`flex-1 px-6 py-3 text-sm font-medium ${
            activeTab === 'best'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabClick('best')}
        >
          Best
        </button>
        <button
          className={`flex-1 px-6 py-3 text-sm font-medium ${
            activeTab === 'cheapest'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabClick('cheapest')}
        >
          Cheapest (from ${cheapestPrice})
        </button>
      </div>

      {/* Results Count */}
      <div className="text-gray-600 mb-4">
        Found {sortedFlights.length || 0} flights
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <p>Loading {activeTab === 'cheapest' ? 'cheapest' : 'best'} flights...</p>
        </div>
      )}

      {/* Flight Results */}
      {!isLoading && visibleFlights.map((itinerary) => (
        <div key={itinerary.id || Math.random()} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-blue-600">
              {itinerary.price?.formatted || 'Price unavailable'}
            </div>
            <div className="flex space-x-2">
              {itinerary.tags?.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {itinerary.legs?.map((leg, index) => (
            <div key={leg.id || index} className="border-t pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {renderCarriers(leg.carriers)}
                </div>
                <div className="text-sm text-gray-500">
                  {leg.stopCount === 0 ? 'Direct' : `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl font-semibold">{formatDateTime(leg.departure)}</div>
                  <div className="text-sm text-gray-600">{leg.origin?.city}</div>
                  <div className="text-xs text-gray-500">{leg.origin?.name}</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500">{formatDuration(leg.durationInMinutes)}</div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="text-xs text-gray-500">
                    {leg.segments?.length > 1 ? `${leg.segments.length - 1} connection${leg.segments.length > 2 ? 's' : ''}` : 'Direct'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-semibold">{formatDateTime(leg.arrival)}</div>
                  <div className="text-sm text-gray-600">{leg.destination?.city}</div>
                  <div className="text-xs text-gray-500">{leg.destination?.name}</div>
                </div>
              </div>

              {leg.segments?.length > 1 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <div className="text-sm text-gray-600">Connections:</div>
                  {leg.segments.slice(0, -1).map((segment, idx) => (
                    <div key={idx} className="text-xs text-gray-500 mt-1">
                      {segment.destination?.name} ({segment.destination?.displayCode})
                      - {formatDuration(
                        new Date(leg.segments[idx + 1].departure) - new Date(segment.arrival)
                      )} layover
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Show More Button */}
      {hasMoreFlights && (
        <div className="text-center mt-6">
          <button
            onClick={() => setDisplayCount(prev => prev + 3)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Show {sortedFlights.length - displayCount} More Flights
          </button>
        </div>
      )}
    </div>
  );
};

FlightResults.propTypes = {
  flights: PropTypes.object.isRequired,
  searchParams: PropTypes.object.isRequired
};

export default FlightResults;