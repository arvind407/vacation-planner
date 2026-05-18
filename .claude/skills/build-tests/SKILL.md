---
name: build-tests
description: Generate comprehensive Vitest test suite for React components and hooks
allowed-tools: filesystem
trigger: manual
---

# build-tests

Generate a comprehensive Vitest unit test suite for React components or custom hooks. Covers happy path, edge cases, error states, and user interactions.

## Instructions

You are running the build-tests skill to automatically generate test files. Follow these steps:

### 1. Parse Arguments and Identify Target File

Extract the file path from $ARGUMENTS:

- **If file path provided**: Use the exact path
- **If no arguments**: Ask the user which file they want to test

Validate the file:
- Check if the file exists using the Read tool
- Verify it's a `.jsx`, `.js`, `.tsx`, or `.ts` file
- Determine if it's a component (PascalCase filename) or hook (starts with `use`)

### 2. Analyze the Source File

Read and analyze the source file to understand:

**For Components:**
- What props does it accept?
- Does it use context (useUser, useFavorites, useTrip, etc.)?
- Does it render conditional content based on props or state?
- Does it handle user interactions (clicks, form inputs, etc.)?
- Does it make API calls or use async operations?
- Does it use React Router (navigation, links, params)?
- What are the key UI elements that should be tested?

**For Custom Hooks:**
- What parameters does it accept?
- What does it return (state, functions, loading states, errors)?
- Does it use other hooks or contexts?
- Does it have side effects (useEffect, API calls)?
- What are the different states it can be in?

### 3. Generate Comprehensive Test Suite

Create a test file with the following structure:

#### Import Section
```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils'; // Use custom test utils
import userEvent from '@testing-library/user-event';
import ComponentName from './ComponentName';
```

For hooks:
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useHookName from './useHookName';
```

#### Test Structure

Organize tests into logical groups using `describe` blocks:

**For Components:**
1. **Rendering Tests** - Verify component renders correctly
   - Renders without crashing
   - Displays correct initial content
   - Shows proper data from props
   - Handles missing/undefined props gracefully

2. **Conditional Rendering Tests** - Test different UI states
   - Loading states
   - Error states
   - Empty states
   - Success states with data

3. **User Interaction Tests** - Test user actions
   - Button clicks
   - Form inputs and submissions
   - Checkbox/radio selections
   - Dropdown/select changes
   - Keyboard interactions

4. **Integration Tests** - Test with context and routing
   - Proper context data usage
   - Navigation behavior
   - URL parameter handling

5. **Edge Cases** - Test boundary conditions
   - Empty arrays/objects
   - Null/undefined values
   - Very long strings
   - Special characters

**For Custom Hooks:**
1. **Initial State Tests** - Verify default values
2. **State Update Tests** - Test state changes
3. **Function Tests** - Test returned functions
4. **Side Effect Tests** - Test useEffect behavior
5. **Error Handling Tests** - Test error states
6. **Async Operation Tests** - Test loading and completion

#### Test Quality Guidelines

- **Use realistic test data**: Don't use "foo", "bar", "test" - use realistic values
- **Test user-facing behavior**: Focus on what users see and do, not implementation details
- **Use accessible queries**: Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
- **Mock external dependencies**: Mock API calls, context providers when needed
- **Test async operations**: Use `waitFor` for async state updates
- **Add descriptive test names**: Each test should clearly describe what it's testing

#### Example Test Pattern

```javascript
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders the component with default props', () => {
      render(<ComponentName />);
      expect(screen.getByText(/expected text/i)).toBeInTheDocument();
    });

    it('displays data from props correctly', () => {
      const testData = { title: 'Paris', description: 'Beautiful city' };
      render(<ComponentName data={testData} />);
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Beautiful city')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles button click', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick} />);

      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('updates input value on change', async () => {
      const user = userEvent.setup();
      render(<ComponentName />);

      const input = screen.getByRole('textbox', { name: /search/i });
      await user.type(input, 'Paris');

      expect(input).toHaveValue('Paris');
    });
  });

  describe('Conditional Rendering', () => {
    it('shows loading state while fetching data', () => {
      render(<ComponentName loading={true} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('displays error message when error occurs', () => {
      const error = 'Failed to fetch data';
      render(<ComponentName error={error} />);
      expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data array gracefully', () => {
      render(<ComponentName data={[]} />);
      expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });

    it('handles undefined props without crashing', () => {
      render(<ComponentName data={undefined} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });
});
```

### 4. Context and Provider Mocking

If the component uses contexts:

**Use the custom test utils** which already include all providers:
```javascript
import { render, screen } from '../utils/test-utils';
```

**For testing specific context values**, you can mock the context:
```javascript
import { vi } from 'vitest';
import * as UserContext from '../context/UserContext';

vi.spyOn(UserContext, 'useUser').mockReturnValue({
  user: { firstName: 'Test', email: 'test@example.com' },
  updateUser: vi.fn(),
});
```

### 5. API and External Dependency Mocking

Mock fetch calls or external dependencies:

```javascript
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('fetches data on mount', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ destinations: [] }),
  });

  render(<ComponentName />);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/destinations');
  });
});
```

### 6. Save Test File

Save the generated test file with proper naming:
- Component: `ComponentName.jsx` → `ComponentName.test.jsx`
- Hook: `useHookName.js` → `useHookName.test.js`
- Place in the same directory as the source file

### 7. Run Tests and Verify

After generating the test file:

1. Run the tests using `npm run test:run`
2. Check if all tests pass
3. If tests fail:
   - Read the error messages
   - Fix any issues in the test file
   - Re-run tests until they all pass

### 8. Report Results

Provide a summary to the user:

```markdown
✅ Test Suite Generated: src/components/ComponentName.test.jsx

📊 Test Coverage:
- Rendering: X tests
- User Interactions: X tests
- Conditional Rendering: X tests
- Edge Cases: X tests

Total: X tests generated

🧪 Test Results:
✓ All X tests passing
```

If there were issues during generation or test execution, report them clearly and suggest fixes.

### Important Notes

- **Always use the custom test utils** (`../utils/test-utils`) for component tests to include all providers
- **Don't test implementation details** - focus on user-facing behavior
- **Use realistic data** - avoid generic "test" values
- **Make tests independent** - each test should work in isolation
- **Clean up after tests** - use `afterEach` to reset mocks and state
- **Test accessibility** - use semantic queries like `getByRole`
- **Handle async properly** - use `waitFor` for async state changes
- **Mock wisely** - only mock external dependencies, not internal logic
- **Keep tests readable** - use descriptive names and clear assertions

### Example File Determination

Given file path `src/screens/HomeScreen.jsx`:
- File exists? Check with Read tool
- Is component? Yes (PascalCase, returns JSX)
- Uses context? Check imports (useUser, etc.)
- Has interactions? Look for buttons, inputs, forms
- Generate test file: `src/screens/HomeScreen.test.jsx`

### Testing Custom Hooks Example

```javascript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useDestinations from './useDestinations';

describe('useDestinations', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useDestinations());

    expect(result.current.destinations).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches destinations on mount', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ destinations: [{ id: 1, name: 'Paris' }] }),
    });

    const { result } = renderHook(() => useDestinations());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.destinations).toHaveLength(1);
    expect(result.current.destinations[0].name).toBe('Paris');
  });
});
```

### Coverage Goals

Aim to generate tests that achieve:
- **Happy path**: Normal usage scenarios
- **Edge cases**: Empty, null, undefined, extreme values
- **Error states**: API failures, validation errors
- **User interactions**: All clickable elements and inputs
- **Conditional rendering**: All branches of conditional UI
- **Async operations**: Loading states, success, and failure

The generated test suite should be immediately runnable and comprehensive enough to catch most common bugs.
