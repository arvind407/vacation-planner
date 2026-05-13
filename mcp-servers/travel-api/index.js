#!/usr/bin/env node
/* eslint-env node */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEOAPIFY_KEY;

if (!API_KEY) {
  console.error('Error: GEOAPIFY_KEY environment variable is not set');
  process.exit(1);
}

const GEOCODE_URL = 'https://api.geoapify.com/v1/geocode/search';
const PLACES_URL = 'https://api.geoapify.com/v2/places';
const PLACE_DETAILS_URL = 'https://api.geoapify.com/v2/place-details';

// Category mapping for search_by_category
const CATEGORY_MAP = {
  beach: 'beach',
  city: 'tourism.attraction',
  mountain: 'natural.peak',
  adventure: 'sport',
  all: 'tourism',
};

// Helper function to geocode a location
async function geocodeLocation(cityName, country) {
  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        text: `${cityName} ${country}`,
        apiKey: API_KEY,
      },
    });

    if (!response.data.features || response.data.features.length === 0) {
      throw new Error(`Location not found: ${cityName}, ${country}`);
    }

    const coordinates = response.data.features[0].geometry.coordinates;
    return {
      lon: coordinates[0],
      lat: coordinates[1],
    };
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
}

// Helper function to search places
async function searchPlaces(lon, lat, categories, limit = 20) {
  try {
    const response = await axios.get(PLACES_URL, {
      params: {
        categories,
        filter: `circle:${lon},${lat},10000`,
        limit,
        apiKey: API_KEY,
      },
    });

    if (!response.data.features) {
      return [];
    }

    return response.data.features.map((feature) => ({
      id: feature.properties.place_id,
      name: feature.properties.name || 'Unnamed place',
      category: feature.properties.categories?.[0] || 'Unknown',
      coordinates: {
        lon: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
    }));
  } catch (error) {
    throw new Error(`Places search failed: ${error.message}`);
  }
}

const server = new Server(
  {
    name: 'travel-api',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_destinations',
        description:
          'Search for tourist destinations and places of interest in a city. Returns popular attractions, landmarks, and points of interest.',
        inputSchema: {
          type: 'object',
          properties: {
            cityName: {
              type: 'string',
              description: 'Name of the city to search',
            },
            country: {
              type: 'string',
              description: 'Country where the city is located',
            },
          },
          required: ['cityName', 'country'],
        },
      },
      {
        name: 'search_by_category',
        description:
          'Search for destinations filtered by category (beach, city, mountain, adventure, or all). Returns places matching the specified category.',
        inputSchema: {
          type: 'object',
          properties: {
            cityName: {
              type: 'string',
              description: 'Name of the city to search',
            },
            country: {
              type: 'string',
              description: 'Country where the city is located',
            },
            category: {
              type: 'string',
              description:
                'Category to filter by: beach, city, mountain, adventure, or all',
              enum: ['beach', 'city', 'mountain', 'adventure', 'all'],
            },
          },
          required: ['cityName', 'country', 'category'],
        },
      },
      {
        name: 'get_destination_details',
        description:
          'Get detailed information about a specific destination including name, address, description, and coordinates.',
        inputSchema: {
          type: 'object',
          properties: {
            placeId: {
              type: 'string',
              description: 'The unique place ID from search results',
            },
          },
          required: ['placeId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'search_destinations') {
      const { cityName, country } = args;

      if (!cityName || !country) {
        throw new Error('cityName and country are required');
      }

      // Step 1: Geocode the location
      const { lon, lat } = await geocodeLocation(cityName, country);

      // Step 2: Search for tourism places
      const places = await searchPlaces(lon, lat, 'tourism');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                location: `${cityName}, ${country}`,
                coordinates: { lon, lat },
                places,
                count: places.length,
              },
              null,
              2
            ),
          },
        ],
      };
    } else if (name === 'search_by_category') {
      const { cityName, country, category } = args;

      if (!cityName || !country || !category) {
        throw new Error('cityName, country, and category are required');
      }

      const geoapifyCategory = CATEGORY_MAP[category];
      if (!geoapifyCategory) {
        throw new Error(
          `Invalid category. Must be one of: ${Object.keys(CATEGORY_MAP).join(', ')}`
        );
      }

      // Step 1: Geocode the location
      const { lon, lat } = await geocodeLocation(cityName, country);

      // Step 2: Search for places by category
      const places = await searchPlaces(lon, lat, geoapifyCategory);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                location: `${cityName}, ${country}`,
                category,
                coordinates: { lon, lat },
                places,
                count: places.length,
              },
              null,
              2
            ),
          },
        ],
      };
    } else if (name === 'get_destination_details') {
      const { placeId } = args;

      if (!placeId) {
        throw new Error('placeId is required');
      }

      const response = await axios.get(PLACE_DETAILS_URL, {
        params: {
          id: placeId,
          apiKey: API_KEY,
        },
      });

      if (!response.data.features || response.data.features.length === 0) {
        throw new Error(`Place not found with ID: ${placeId}`);
      }

      const feature = response.data.features[0];
      const props = feature.properties;

      const details = {
        id: placeId,
        name: props.name || 'Unnamed place',
        address: props.formatted || props.address_line1 || 'Address not available',
        description:
          props.description || props.wiki_description || 'No description available',
        coordinates: {
          lon: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
        },
        categories: props.categories || [],
        website: props.website || null,
        opening_hours: props.opening_hours || null,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(details, null, 2),
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Travel API MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
