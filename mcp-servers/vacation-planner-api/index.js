#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData = {
      trips: [],
      favorites: [],
      nextTripId: 1,
      nextFavoriteId: 1,
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read data from JSON file
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write data to JSON file
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Create the MCP server
const server = new Server(
  {
    name: 'vacation-planner-api',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_all_trips',
        description: 'Get all vacation trips',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_trip',
        description: 'Get a specific trip by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'The trip ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_trip',
        description: 'Create a new vacation trip',
        inputSchema: {
          type: 'object',
          properties: {
            destination: {
              type: 'string',
              description: 'The destination name',
            },
            startDate: {
              type: 'string',
              description: 'Trip start date (YYYY-MM-DD)',
            },
            endDate: {
              type: 'string',
              description: 'Trip end date (YYYY-MM-DD)',
            },
          },
          required: ['destination', 'startDate', 'endDate'],
        },
      },
      {
        name: 'add_activity',
        description: 'Add an activity to a specific day of a trip',
        inputSchema: {
          type: 'object',
          properties: {
            tripId: {
              type: 'number',
              description: 'The trip ID',
            },
            dayIndex: {
              type: 'number',
              description: 'The day index (0-based)',
            },
            activity: {
              type: 'object',
              description: 'The activity object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Activity name',
                },
                time: {
                  type: 'string',
                  description: 'Activity time',
                },
                description: {
                  type: 'string',
                  description: 'Activity description',
                },
              },
              required: ['name'],
            },
          },
          required: ['tripId', 'dayIndex', 'activity'],
        },
      },
      {
        name: 'get_favorites',
        description: 'Get all favorite destinations',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'add_favorite',
        description: 'Add a destination to favorites',
        inputSchema: {
          type: 'object',
          properties: {
            destination: {
              type: 'object',
              description: 'The destination object to add to favorites',
              properties: {
                name: {
                  type: 'string',
                  description: 'Destination name',
                },
                country: {
                  type: 'string',
                  description: 'Country',
                },
                category: {
                  type: 'string',
                  description: 'Category',
                },
                lon: {
                  type: 'number',
                  description: 'Longitude',
                },
                lat: {
                  type: 'number',
                  description: 'Latitude',
                },
              },
              required: ['name'],
            },
          },
          required: ['destination'],
        },
      },
      {
        name: 'remove_favorite',
        description: 'Remove a destination from favorites',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'The favorite ID to remove',
            },
          },
          required: ['id'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_all_trips': {
        const data = await readData();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data.trips, null, 2),
            },
          ],
        };
      }

      case 'get_trip': {
        const data = await readData();
        const trip = data.trips.find((t) => t.id === args.id);
        if (!trip) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Trip not found' }),
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(trip, null, 2),
            },
          ],
        };
      }

      case 'create_trip': {
        const data = await readData();
        const newTrip = {
          id: data.nextTripId++,
          destination: args.destination,
          startDate: args.startDate,
          endDate: args.endDate,
          activities: [],
          createdAt: new Date().toISOString(),
        };
        data.trips.push(newTrip);
        await writeData(data);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newTrip, null, 2),
            },
          ],
        };
      }

      case 'add_activity': {
        const data = await readData();
        const trip = data.trips.find((t) => t.id === args.tripId);
        if (!trip) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Trip not found' }),
              },
            ],
            isError: true,
          };
        }

        // Initialize activities array if it doesn't exist
        if (!trip.activities) {
          trip.activities = [];
        }

        // Initialize day array if it doesn't exist
        if (!trip.activities[args.dayIndex]) {
          trip.activities[args.dayIndex] = [];
        }

        // Add activity to the specified day
        trip.activities[args.dayIndex].push({
          id: Date.now(),
          ...args.activity,
        });

        await writeData(data);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(trip, null, 2),
            },
          ],
        };
      }

      case 'get_favorites': {
        const data = await readData();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data.favorites, null, 2),
            },
          ],
        };
      }

      case 'add_favorite': {
        const data = await readData();
        const newFavorite = {
          id: data.nextFavoriteId++,
          ...args.destination,
          addedAt: new Date().toISOString(),
        };
        data.favorites.push(newFavorite);
        await writeData(data);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newFavorite, null, 2),
            },
          ],
        };
      }

      case 'remove_favorite': {
        const data = await readData();
        const index = data.favorites.findIndex((f) => f.id === args.id);
        if (index === -1) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Favorite not found' }),
              },
            ],
            isError: true,
          };
        }
        const removed = data.favorites.splice(index, 1)[0];
        await writeData(data);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Favorite removed successfully',
                removed,
              }),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: `Unknown tool: ${name}` }),
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// HTTP Endpoints

// GET /trips - Get all trips
app.get('/trips', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /trips/:id - Get a specific trip
app.get('/trips/:id', async (req, res) => {
  try {
    const data = await readData();
    const trip = data.trips.find((t) => t.id === parseInt(req.params.id));
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /trips - Create a new trip
app.post('/trips', async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.body;
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required fields: destination, startDate, endDate'
      });
    }

    const data = await readData();
    const newTrip = {
      id: data.nextTripId++,
      destination,
      startDate,
      endDate,
      activities: [],
      createdAt: new Date().toISOString(),
    };
    data.trips.push(newTrip);
    await writeData(data);
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /trips/:id/activities - Add activity to a trip
app.post('/trips/:id/activities', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const { dayIndex, activity } = req.body;

    if (dayIndex === undefined || !activity || !activity.name) {
      return res.status(400).json({
        error: 'Missing required fields: dayIndex, activity.name'
      });
    }

    const data = await readData();
    const trip = data.trips.find((t) => t.id === tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Initialize activities array if it doesn't exist
    if (!trip.activities) {
      trip.activities = [];
    }

    // Initialize day array if it doesn't exist
    if (!trip.activities[dayIndex]) {
      trip.activities[dayIndex] = [];
    }

    // Add activity to the specified day
    const newActivity = {
      id: Date.now(),
      ...activity,
    };
    trip.activities[dayIndex].push(newActivity);

    await writeData(data);
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /favorites - Get all favorites
app.get('/favorites', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /favorites - Add a favorite
app.post('/favorites', async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination || !destination.name) {
      return res.status(400).json({
        error: 'Missing required field: destination.name'
      });
    }

    const data = await readData();
    const newFavorite = {
      id: data.nextFavoriteId++,
      ...destination,
      addedAt: new Date().toISOString(),
    };
    data.favorites.push(newFavorite);
    await writeData(data);
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /favorites/:id - Remove a favorite
app.delete('/favorites/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.favorites.findIndex((f) => f.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    const removed = data.favorites.splice(index, 1)[0];
    await writeData(data);
    res.json({ message: 'Favorite removed successfully', removed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
async function main() {
  await initializeDataFile();

  // Start Express server
  app.listen(PORT, () => {
    console.error(`Express HTTP server running on http://localhost:${PORT}`);
  });

  // Start MCP server on stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Vacation Planner MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
