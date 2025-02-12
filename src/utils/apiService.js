import axios from 'axios';

const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const API_HOST = 'sky-scrapper.p.rapidapi.com';

// First, get session ID
const getSessionId = async (searchParams) => {
  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
    params: {
      originSkyId: searchParams.from,
      destinationSkyId: searchParams.to,
      date: searchParams.departDate,
      adults: searchParams.passengers || '1',
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US'
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  const response = await axios.request(options);
  return response.data.sessionId;
};

export const searchFlights = async (searchParams) => {
  try {
    // Get session ID first
    const sessionId = await getSessionId(searchParams);
    
    // Then get flight details
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails',
      params: {
        sessionId: sessionId,
        legs: JSON.stringify([{
          origin: searchParams.from,
          destination: searchParams.to,
          date: searchParams.departDate
        }]),
        adults: searchParams.passengers || '1',
        currency: 'USD',
        market: 'en-US',
        locale: 'en-US',
        cabinClass: searchParams.cabinClass || 'economy',
        countryCode: 'US'
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};