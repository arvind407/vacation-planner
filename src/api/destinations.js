const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
const GEOCODE_URL = 'https://api.geoapify.com/v1/geocode/search';
const PLACES_URL = 'https://api.geoapify.com/v2/places';

// Category mapping for Geoapify API
const CATEGORY_MAP = {
  all: 'tourism',
  beach: 'beach',
  city: 'tourism.attraction',
  mountain: 'natural.peak',
  adventure: 'sport',
};

/**
 * Get coordinates for a city
 * @param {string} cityName - Name of the city
 * @param {string} country - Country name
 * @returns {Promise<{lon: number, lat: number}>} - Coordinates
 */
async function getCoordinates(cityName, country) {
  const text = `${cityName} ${country}`;
  const url = `${GEOCODE_URL}?text=${encodeURIComponent(text)}&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error(`No results found for ${cityName}, ${country}`);
  }

  const [lon, lat] = data.features[0].geometry.coordinates;
  return { lon, lat };
}

/**
 * Fetch places from Geoapify
 * @param {number} lon - Longitude
 * @param {number} lat - Latitude
 * @param {string} category - Geoapify category
 * @returns {Promise<Array>} - Array of place objects
 */
async function fetchPlaces(lon, lat, category) {
  const url = `${PLACES_URL}?categories=${category}&filter=circle:${lon},${lat},10000&limit=20&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Places API failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    return [];
  }

  // Transform and filter results
  return data.features
    .map((feature) => {
      const { properties, geometry } = feature;
      const [placeLon, placeLat] = geometry.coordinates;

      return {
        id: properties.place_id,
        name: properties.name,
        category: properties.categories?.[0] || category,
        lon: placeLon,
        lat: placeLat,
      };
    })
    .filter((place) => place.name); // Filter out places without names
}

/**
 * Fetch all tourism destinations for a city
 * @param {string} cityName - Name of the city
 * @param {string} country - Country name
 * @returns {Promise<Array>} - Array of destination objects
 */
export async function fetchDestinations(cityName, country) {
  const { lon, lat } = await getCoordinates(cityName, country);
  return fetchPlaces(lon, lat, CATEGORY_MAP.all);
}

/**
 * Fetch destinations by category for a city
 * @param {string} cityName - Name of the city
 * @param {string} country - Country name
 * @param {string} category - Category filter (all, beach, city, mountain, adventure)
 * @returns {Promise<Array>} - Array of destination objects
 */
export async function fetchDestinationsByCategory(cityName, country, category) {
  const { lon, lat } = await getCoordinates(cityName, country);
  const mappedCategory = CATEGORY_MAP[category] || CATEGORY_MAP.all;
  return fetchPlaces(lon, lat, mappedCategory);
}

/**
 * Get detailed information about a specific destination
 * @param {string} placeId - The place ID from Geoapify
 * @returns {Promise<Object>} - Detailed destination information
 */
export async function getDestinationDetails(placeId) {
  const url = `${PLACES_URL}?id=${placeId}&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch destination details: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error('Destination not found');
  }

  const feature = data.features[0];
  const { properties, geometry } = feature;
  const [lon, lat] = geometry.coordinates;

  return {
    id: properties.place_id,
    name: properties.name || 'Unnamed Location',
    address: properties.formatted || properties.address_line1 || properties.address_line2 || 'Address not available',
    description: properties.description || properties.datasource?.raw?.description || 'No description available for this destination.',
    category: properties.categories?.[0] || 'tourism',
    lon,
    lat,
    city: properties.city,
    country: properties.country,
    postcode: properties.postcode,
    street: properties.street,
    housenumber: properties.housenumber,
  };
}
