import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../context/UserContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { TripProvider } from '../context/TripContext';

/**
 * Custom render function that wraps components with all necessary providers
 * Use this instead of @testing-library/react's render for component tests
 */
export function renderWithProviders(ui, options = {}) {
  const Wrapper = ({ children }) => {
    return (
      <UserProvider>
        <FavoritesProvider>
          <TripProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </TripProvider>
        </FavoritesProvider>
      </UserProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render with our custom version
export { renderWithProviders as render };
