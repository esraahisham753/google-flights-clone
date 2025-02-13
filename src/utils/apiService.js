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
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights', // Updated to v1
      params: {
        originSkyId: searchParams.from.toUpperCase(),
        destinationSkyId: searchParams.to.toUpperCase(),
        originEntityId: searchParams.fromEntityId || '27544008',
        destinationEntityId: searchParams.toEntityId || '27537542',
        date: formattedDate,
        cabinClass: searchParams.cabinClass || 'economy',
        adults: searchParams.passengers?.toString() || '1',
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