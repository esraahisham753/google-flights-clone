const API_KEY = 'YOUR_RAPID_API_KEY';

export const searchFlights = async (searchParams) => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=${searchParams.from}&destinationSkyId=${searchParams.to}&date=${searchParams.departDate}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};