---
description: Create a reusable UI component with props
---

Create a new reusable component in the vacation planner app.

**Instructions:**
1. Ask the user for the component name (e.g., "Button", "Card", "NavBar", "TripCard")
2. Ask what props the component should accept (or suggest common ones based on the type)
3. Create the directory `src/components/` if it doesn't exist
4. Create a new file `src/components/{ComponentName}.jsx` with:
   - Functional component using PascalCase naming
   - Proper React imports
   - Destructured props with sensible defaults
   - Tailwind CSS classes only (no inline styles)
   - Proper prop spreading for flexibility (className merging, etc.)
5. Show the user an example of how to use the component

**Template Structure:**

```jsx
function {ComponentName}({ prop1, prop2, className = '', ...props }) {
  return (
    <div className={`base-tailwind-classes ${className}`} {...props}>
      {/* Component content */}
    </div>
  )
}

export default {ComponentName}
```

**Common Component Patterns:**

**Button:**
```jsx
function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseClasses = 'font-semibold rounded-lg transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  }
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Card:**
```jsx
function Card({ title, children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...props}>
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      {children}
    </div>
  )
}
```

**NavBar:**
```jsx
function NavBar({ links = [], logo, className = '' }) {
  return (
    <nav className={`bg-white shadow-md ${className}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {logo && <div className="font-bold text-xl">{logo}</div>}
        <ul className="flex gap-6">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="text-gray-700 hover:text-blue-600">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
```

**Usage Example Pattern:**
After creating the component, show:
```jsx
import {ComponentName} from './components/{ComponentName}.jsx'

// Example usage:
<{ComponentName} prop1="value" prop2="value" />
```

Ensure all components follow the project's conventions: functional components only, Tailwind classes only (no inline styles), and PascalCase for component files.
