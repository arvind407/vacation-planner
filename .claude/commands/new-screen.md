---
description: Generate a new React screen with routing
---

Create a new React screen component in the vacation planner app.

**Instructions:**

1. Ask the user for the screen name (e.g., "Home", "Destinations", "TripDetails")
2. Create the directory `src/screens/` if it doesn't exist
3. Create a new file `src/screens/{ScreenName}Screen.jsx` with:
   - Functional component using PascalCase naming
   - Proper React imports
   - Clean Tailwind CSS layout with a container, padding, and semantic structure
   - A descriptive heading and placeholder content
4. Update `src/App.jsx` to:
   - Import the new screen component
   - Add a `<Route>` element for the new screen using React Router DOM
   - Use a kebab-case path (e.g., "/destinations" for DestinationsScreen)
5. Confirm the route path with the user and show them how to navigate to it

**Template Structure:**

```jsx
function {ScreenName}Screen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {Screen Title}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            {Screen description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default {ScreenName}Screen
```

**Routing Pattern:**

- Import: `import {ScreenName}Screen from './screens/{ScreenName}Screen.jsx'`
- Route: `<Route path="/{kebab-case-path}" element={<{ScreenName}Screen />} />`

Ensure all components follow the project's conventions: functional components only, Tailwind classes only (no inline styles), and PascalCase for component files.
