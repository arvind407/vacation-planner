# Vacation Planner MCP Server

A Model Context Protocol (MCP) server for managing vacation trips and favorite destinations.

## Features

This MCP server provides 7 tools for managing vacation planning data:

### Trip Management
- **get_all_trips**: Retrieve all vacation trips
- **get_trip**: Get a specific trip by ID
- **create_trip**: Create a new vacation trip with destination and dates
- **add_activity**: Add an activity to a specific day of a trip

### Favorites Management
- **get_favorites**: Retrieve all favorite destinations
- **add_favorite**: Add a destination to favorites
- **remove_favorite**: Remove a destination from favorites by ID

## Data Storage

All data is stored in a local `data.json` file with the following structure:

```json
{
  "trips": [
    {
      "id": 1,
      "destination": "Paris",
      "startDate": "2024-06-01",
      "endDate": "2024-06-07",
      "activities": [
        [
          {
            "id": 1234567890,
            "name": "Visit Eiffel Tower",
            "time": "10:00 AM",
            "description": "Visit the iconic landmark"
          }
        ]
      ],
      "createdAt": "2024-05-12T..."
    }
  ],
  "favorites": [
    {
      "id": 1,
      "name": "Colosseum",
      "country": "Italy",
      "category": "tourism.attraction",
      "lon": 12.4924,
      "lat": 41.8902,
      "addedAt": "2024-05-12T..."
    }
  ],
  "nextTripId": 2,
  "nextFavoriteId": 2
}
```

## Installation

The MCP server is already set up with the necessary dependencies:

```bash
cd mcp-servers/vacation-planner-api
npm install  # Already done
```

## Usage

### Running the Server

```bash
node index.js
```

Or use npm:

```bash
npm start
```

### Tool Examples

#### Create a Trip
```javascript
{
  "name": "create_trip",
  "arguments": {
    "destination": "Tokyo, Japan",
    "startDate": "2024-08-15",
    "endDate": "2024-08-22"
  }
}
```

#### Add Activity to Trip
```javascript
{
  "name": "add_activity",
  "arguments": {
    "tripId": 1,
    "dayIndex": 0,
    "activity": {
      "name": "Visit Senso-ji Temple",
      "time": "9:00 AM",
      "description": "Explore Tokyo's oldest temple"
    }
  }
}
```

#### Add Favorite Destination
```javascript
{
  "name": "add_favorite",
  "arguments": {
    "destination": {
      "name": "Santorini",
      "country": "Greece",
      "category": "beach",
      "lon": 25.4615,
      "lat": 36.3932
    }
  }
}
```

## Configuration with Claude Desktop

To use this MCP server with Claude Desktop, add it to your MCP settings:

```json
{
  "mcpServers": {
    "vacation-planner-api": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/vacation-planner-api/index.js"]
    }
  }
}
```

## Development

The server uses:
- **@modelcontextprotocol/sdk** for MCP protocol implementation
- **Node.js fs/promises** for file operations
- **JSON** for data persistence

## License

ISC
