import axios from 'axios';

const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const API_HOST = 'sky-scrapper.p.rapidapi.com';

export const searchFlights = async (searchParams) => {
  try {
    const formattedDate = searchParams.departDate instanceof Date 
      ? searchParams.departDate.toISOString().split('T')[0]
      : searchParams.departDate;

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
      params: {
        originSkyId: searchParams.from.toUpperCase(),
        destinationSkyId: searchParams.to.toUpperCase(),
        originEntityId: searchParams.fromEntityId || '27544008',
        destinationEntityId: searchParams.toEntityId || '27537542',
        date: formattedDate,
        cabinClass: searchParams.cabinClass || 'economy',
        adults: searchParams.adults?.toString() || '1',
        childrens: searchParams.childrens?.toString() || '0',
        infants: searchParams.infants?.toString() || '0',
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      }
    };

    console.log('API Request:', options);
    const response = await axios.request(options);
    
    // Return the full response data structure
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Add this new function to your existing apiService.js

export const searchAirports = async (query) => {
  if (!query || query.length < 2) return [];

  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
    params: {
      query: query,
      locale: 'en-US'
    },
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
      'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.data || [];
  } catch (error) {
    console.error('Airport search error:', error);
    return [];
  }
};

// Add a new function for searching flights with different sort options
export const searchFlightsSorted = async (searchParams, sortBy = 'best') => {
  try {
    const formattedDate = searchParams.departDate instanceof Date 
      ? searchParams.departDate.toISOString().split('T')[0]
      : searchParams.departDate;

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
      params: {
        originSkyId: searchParams.from.toUpperCase(),
        destinationSkyId: searchParams.to.toUpperCase(),
        originEntityId: searchParams.fromEntityId || '27544008',
        destinationEntityId: searchParams.toEntityId || '27537542',
        date: formattedDate,
        cabinClass: searchParams.cabinClass || 'economy',
        adults: searchParams.adults?.toString() || '1',
        childrens: searchParams.childrens?.toString() || '0',
        infants: searchParams.infants?.toString() || '0',
        sortBy: sortBy,
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      }
    };

    console.log('API Request for sorted flights:', options);
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error searching sorted flights:', error);
    throw error;
  }
};