---
description: Add a new route to App.jsx for an existing screen
---

Add a new React Router route to App.jsx for an existing screen component.

**Instructions:**
1. Ask the user for the screen component name (e.g., "HomeScreen", "DestinationsScreen")
2. Ask for the desired route path (e.g., "/", "/destinations", "/trip/:id")
3. Verify that the screen file exists in `src/screens/`
4. Update `src/App.jsx` to:
   - Add an import statement for the screen component at the top
   - Add a new `<Route>` element within the existing router structure
5. Show the user the route path and confirm the setup

**Route Patterns:**

**Simple route:**
```jsx
<Route path="/destinations" element={<DestinationsScreen />} />
```

**Root route:**
```jsx
<Route path="/" element={<HomeScreen />} />
```

**Dynamic route with parameters:**
```jsx
<Route path="/trip/:id" element={<TripDetailsScreen />} />
```

**Nested route:**
```jsx
<Route path="/dashboard/*" element={<DashboardScreen />} />
```

**Import Pattern:**
```jsx
import ScreenName from './screens/ScreenName.jsx'
```

**Steps:**
1. Read `src/App.jsx` to understand the current routing structure
2. Check if `Routes` component is already imported from 'react-router-dom'
3. Add the import for the screen component
4. Add the `<Route>` element in the appropriate location within `<Routes>`
5. Maintain consistent formatting and order (typically alphabetical or by route hierarchy)

**Notes:**
- If App.jsx doesn't have a `<Routes>` wrapper yet, add it
- Place new routes in logical order (root path first, then alphabetical)
- For dynamic routes, remind the user how to access params: `const { id } = useParams()`
