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

The application uses Context API for shared state management:

- **All shared state lives in src/context/**
  - UserContext: User profile data (name, email, avatar, etc.)
  - FavoritesContext: Saved/favorited destinations
  - TripContext: Current trip planning state

- **Import via hooks from src/hooks/, not directly from context files**
  - Use `import useUser from '../hooks/useUser'` instead of importing from context directly
  - Use `import useFavorites from '../hooks/useFavorites'` for favorites functionality
  - Custom hooks like `useDestinations` and `useTripPlanner` manage data logic and state

- **Screen components call hooks and render only**
  - No useState or useEffect for data logic directly in screen files
  - Keep only UI-specific state in screen components (e.g., modal open/closed, form visibility)
  - All business logic and data management should be in hooks

Do not introduce Redux for now.

The application is ready to be extended with vacation planning features.
