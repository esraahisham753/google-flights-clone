import React from 'react';
import PropTypes from 'prop-types';

const FlightResults = ({ flights }) => {
  console.log('FlightResults props:', flights);

  // Early return if flights is not provided
  if (!flights) {
    return <div className="text-center text-gray-600">Loading flights...</div>;
  }

  // Check for data property
  if (!flights.data) {
    return <div className="text-center text-gray-600">No flight data available</div>;
  }

  // Check for itineraries array
  if (!Array.isArray(flights.data.itineraries) || flights.data.itineraries.length === 0) {
    return <div className="text-center text-gray-600">No flights found for this route</div>;
  }

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-4">
      {/* Show total results count */}
      <div className="text-gray-600 mb-4">
        Found {flights.data.itineraries.length} flights
      </div>

      {flights.data.itineraries.map((itinerary) => (
        <div key={itinerary.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-blue-600">
              {itinerary.price.formatted}
            </div>
            <div className="flex space-x-2">
              {itinerary.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {itinerary.legs.map((leg, index) => (
            <div key={leg.id} className="border-t pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {leg.carriers.marketing.map((carrier) => (
                    <div key={carrier.id} className="flex items-center">
                      <img 
                        src={carrier.logoUrl} 
                        alt={carrier.name}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="ml-2 text-sm text-gray-600">{carrier.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {leg.stopCount === 0 ? 'Direct' : `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl font-semibold">{formatDateTime(leg.departure)}</div>
                  <div className="text-sm text-gray-600">{leg.origin.city}</div>
                  <div className="text-xs text-gray-500">{leg.origin.name}</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500">{formatDuration(leg.durationInMinutes)}</div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="text-xs text-gray-500">
                    {leg.segments.length > 1 ? `${leg.segments.length - 1} connection${leg.segments.length > 2 ? 's' : ''}` : 'Direct'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-semibold">{formatDateTime(leg.arrival)}</div>
                  <div className="text-sm text-gray-600">{leg.destination.city}</div>
                  <div className="text-xs text-gray-500">{leg.destination.name}</div>
                </div>
              </div>

              {leg.segments.length > 1 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <div className="text-sm text-gray-600">Connections:</div>
                  {leg.segments.slice(0, -1).map((segment, idx) => (
                    <div key={idx} className="text-xs text-gray-500 mt-1">
                      {segment.destination.name} ({segment.destination.displayCode})
                      - {formatDuration(leg.segments[idx + 1].departure - segment.arrival)} layover
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Update PropTypes to be more specific
FlightResults.propTypes = {
  flights: PropTypes.shape({
    status: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      itineraries: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          price: PropTypes.shape({
            formatted: PropTypes.string.isRequired,
            raw: PropTypes.number.isRequired
          }).isRequired,
          legs: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              origin: PropTypes.shape({
                name: PropTypes.string.isRequired,
                city: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
                displayCode: PropTypes.string.isRequired
              }).isRequired,
              destination: PropTypes.shape({
                name: PropTypes.string.isRequired,
                city: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
                displayCode: PropTypes.string.isRequired
              }).isRequired,
              durationInMinutes: PropTypes.number.isRequired,
              departure: PropTypes.string.isRequired,
              arrival: PropTypes.string.isRequired,
              stopCount: PropTypes.number.isRequired,
              carriers: PropTypes.shape({
                marketing: PropTypes.arrayOf(
                  PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    name: PropTypes.string.isRequired,
                    logoUrl: PropTypes.string.isRequired
                  })
                ).isRequired
              }).isRequired
            })
          ).isRequired
        })
      ).isRequired
    }).isRequired
  })
};

export default FlightResults;