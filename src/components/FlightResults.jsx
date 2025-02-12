import React from 'react';

const FlightResults = ({ flights }) => {
  return (
    <div className="max-w-6xl mx-auto mt-8">
      {flights?.map((flight, index) => (
        <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex-1">
              <div className="text-lg font-semibold">
                {flight.airline}
              </div>
              <div className="flex items-center space-x-4">
                <span>{flight.departureTime}</span>
                <span>→</span>
                <span>{flight.arrivalTime}</span>
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-gray-600">
                Duration: {flight.duration}
              </div>
              <div className="text-gray-600">
                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="text-xl font-bold">
                ${flight.price}
              </div>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Select
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightResults;