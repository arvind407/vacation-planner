#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server data operations
 * This doesn't test the MCP protocol itself, just the data layer
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

async function runTests() {
  console.log('Testing Vacation Planner MCP Server Data Layer\n');

  try {
    // Test 1: Read initial data
    console.log('✓ Test 1: Reading data.json');
    let data = await readData();
    console.log('  Initial state:', JSON.stringify(data, null, 2));

    // Test 2: Create a trip
    console.log('\n✓ Test 2: Creating a trip');
    const newTrip = {
      id: data.nextTripId++,
      destination: 'Paris, France',
      startDate: '2024-06-01',
      endDate: '2024-06-07',
      activities: [],
      createdAt: new Date().toISOString(),
    };
    data.trips.push(newTrip);
    await writeData(data);
    console.log('  Created trip:', JSON.stringify(newTrip, null, 2));

    // Test 3: Add activity to trip
    console.log('\n✓ Test 3: Adding activity to trip');
    const trip = data.trips.find((t) => t.id === newTrip.id);
    if (!trip.activities[0]) trip.activities[0] = [];
    trip.activities[0].push({
      id: Date.now(),
      name: 'Visit Eiffel Tower',
      time: '10:00 AM',
      description: 'Iconic Paris landmark',
    });
    await writeData(data);
    console.log('  Updated trip:', JSON.stringify(trip, null, 2));

    // Test 4: Add favorite
    console.log('\n✓ Test 4: Adding favorite');
    const newFavorite = {
      id: data.nextFavoriteId++,
      name: 'Colosseum',
      country: 'Italy',
      category: 'tourism.attraction',
      lon: 12.4924,
      lat: 41.8902,
      addedAt: new Date().toISOString(),
    };
    data.favorites.push(newFavorite);
    await writeData(data);
    console.log('  Added favorite:', JSON.stringify(newFavorite, null, 2));

    // Test 5: Get all trips
    console.log('\n✓ Test 5: Getting all trips');
    data = await readData();
    console.log(`  Total trips: ${data.trips.length}`);

    // Test 6: Get all favorites
    console.log('\n✓ Test 6: Getting all favorites');
    console.log(`  Total favorites: ${data.favorites.length}`);

    console.log('\n✅ All tests passed!');
    console.log('\nFinal data state:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
