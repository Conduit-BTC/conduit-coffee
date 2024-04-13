async function getLocationFromZipCode(zipCode) {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

    if (!response.ok) {
      throw new Error(`Error fetching city and state: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.places && data.places.length > 0) {
      const country = data['country abbreviation'];
      const { 'place name': city, 'state abbreviation': state } =
        data.places[0];
      const trimmedState = typeof state === 'string' ? state.trim() : state;
      return { city, state: trimmedState, country };
    } else {
      throw new Error(`No data found for zip code: ${zipCode}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = { getLocationFromZipCode };
