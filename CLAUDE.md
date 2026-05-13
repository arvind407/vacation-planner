# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vacation planner web application built with React, Vite, and Tailwind CSS. The project uses modern React patterns with React Router for navigation and is currently in early development stages.

## Development Commands

### Running the Development Server

```bash
npm run dev
```

Starts the Vite development server with Hot Module Replacement (HMR) for instant feedback during development.

### Building for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

### Linting

```bash
npm run lint
```

Runs ESLint to check for code quality issues. The project uses ESLint 10+ with the new flat config format.

### Preview Production Build

```bash
npm run preview
```

Locally preview the production build after running `npm run build`.

## GitHub Integration

GitHub is connected to this project via MCP (Model Context Protocol). You can interact with the repository directly from the conversation:

- **Create issues**: Ask Claude to create GitHub issues for tracking features, bugs, or tasks
- **Read pull requests**: Ask Claude to list or read PR details without leaving the conversation
- **Check repository status**: View open issues, PRs, branches, and commits
- **Push changes**: Commit and push code changes directly to branches

Simply ask in natural language (e.g., "list my open PRs", "create an issue for...", "push my changes") and Claude will handle the GitHub operations.

**Repository**: arvind407/vacation-planner

## Playwright Integration

Playwright is connected to this project via MCP (Model Context Protocol) for automated browser testing and verification. Use it to:

- **Verify screens**: Open http://localhost:5174 in a browser and verify all routes work correctly
- **Test UI interactions**: Click buttons, fill forms, and verify user flows
- **Check for errors**: Monitor console logs and identify runtime issues
- **Visual verification**: Take screenshots and capture page snapshots

### Screen Verification Command

Run `/verify-screens` after any significant change to verify all 5 main routes:
- Home (/)
- Explore (/explore)
- Planner (/planner)
- Hotels (/hotels)
- Profile (/profile)

This command automatically opens the application, navigates to each screen, and reports any loading issues, missing elements, or console errors.

**Important**: Make sure the dev server is running (`npm run dev`) before running screen verification.

## Vacation Planner API

The project includes a custom MCP server that provides both MCP tools and HTTP REST API endpoints for managing trips and favorites. The server is located at `mcp-servers/vacation-planner-api/`.

### Running the API Server

```bash
node mcp-servers/vacation-planner-api/index.js
```

This starts both:
- **Express HTTP server** on `http://localhost:3001` (configurable via PORT env variable)
- **MCP server** on stdio for Claude integration

The server uses a JSON file (`mcp-servers/vacation-planner-api/data.json`) for data persistence.

### HTTP API Endpoints

**Trips:**
- `GET /trips` - Get all trips
- `GET /trips/:id` - Get a specific trip
- `POST /trips` - Create a new trip
  - Body: `{ destination, startDate, endDate }`
- `POST /trips/:id/activities` - Add activity to a trip
  - Body: `{ dayIndex, activity: { name, time?, description? } }`

**Favorites:**
- `GET /favorites` - Get all favorites
- `POST /favorites` - Add a favorite
  - Body: `{ destination: { name, country?, category?, lon?, lat? } }`
- `DELETE /favorites/:id` - Remove a favorite

### MCP Tools

The server provides the following MCP tools for Claude to interact with:
- `get_all_trips` - Retrieve all vacation trips
- `get_trip` - Get a specific trip by ID
- `create_trip` - Create a new vacation trip
- `add_activity` - Add an activity to a specific day of a trip
- `get_favorites` - Get all favorite destinations
- `add_favorite` - Add a destination to favorites
- `remove_favorite` - Remove a destination from favorites

### React App Integration

The React app contexts are connected to the HTTP API:

- **TripContext** (`src/context/TripContext.jsx`) - Fetches trips from `http://localhost:3001/trips`
  - Automatically loads all trips on mount
  - Provides methods: `fetchTrips()`, `fetchTrip(id)`, `createTrip(data)`, `addActivity(tripId, dayIndex, activity)`

- **FavoritesContext** (`src/context/FavoritesContext.jsx`) - Fetches favorites from `http://localhost:3001/favorites`
  - Automatically loads all favorites on mount
  - Provides methods: `fetchFavorites()`, `addFavorite(destination)`, `removeFavorite(id)`, `isFavorite(id)`

**Important**: The API server must be running for the React app to fetch data properly. Both servers (Vite dev server and API server) should run simultaneously during development.

## Architecture

### Tech Stack

- **React 19.2.5**: UI framework with StrictMode enabled
- **React Router DOM 7.15.0**: Client-side routing
- **Vite 8.0.10**: Build tool and dev server
- **Tailwind CSS 3.4.19**: Utility-first CSS framework
- **Prettier 3.8.3**: Code formatting

### Entry Point

The application bootstraps in `src/main.jsx`, which:

- Wraps the app in `<StrictMode>` for development checks
- Wraps the app in `<BrowserRouter>` for React Router functionality
- Renders the root `<App>` component into `#root` element

### ESLint Configuration

The project uses ESLint's modern flat config system (`eslint.config.js`):

- Ignores the `dist/` directory
- Applies to all `.js` and `.jsx` files
- Includes recommended React Hooks rules and React Refresh configuration
- Configured for browser globals with JSX support

### Tailwind Configuration

Tailwind is configured to scan `index.html` and all `.js`/`.jsx` files in `src/` for classes.

### Current State

The app currently displays a landing page with:

- Hero section with React and Vite logos
- Links to documentation
- Social/community links
- A simple counter demonstration

### Folder Structure

src/screens/ for pages, src/components/ for resuable UI, src/hooks/ for custom hooks, src/api/ for data fetching

### Component Rules

Use functional components only. No class compoenents. No inline styles - use Tailwind classes only.

### Naming Conventions

PascalCase for component files (HomeScreen.jsx), camelCase for hooks(useTrips.js)

### State Management

The application uses Context API for shared state management with backend API integration:

- **All shared state lives in src/context/**
  - **UserContext**: User profile data (name, email, avatar, etc.) - local state
  - **FavoritesContext**: Favorite destinations - fetches from `http://localhost:3001/favorites`
  - **TripContext**: Trip planning and management - fetches from `http://localhost:3001/trips`

- **Import via hooks from src/hooks/, not directly from context files**
  - Use `import useUser from '../hooks/useUser'` instead of importing from context directly
  - Use `import useFavorites from '../hooks/useFavorites'` for favorites functionality
  - Use `import { useTrip } from '../context/TripContext'` for trip management
  - Custom hooks like `useDestinations` and `useTripPlanner` manage data logic and state

- **Screen components call hooks and render only**
  - No useState or useEffect for data logic directly in screen files
  - Keep only UI-specific state in screen components (e.g., modal open/closed, form visibility)
  - All business logic and data management should be in hooks

- **API-connected contexts provide loading and error states**
  - Both TripContext and FavoritesContext expose `loading` and `error` states
  - Handle loading states in UI components for better user experience
  - All API methods are async and should be used with try/catch or .then/.catch

Do not introduce Redux for now.

The application is ready to be extended with vacation planning features.
