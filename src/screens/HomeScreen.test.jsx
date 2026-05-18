import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  it('renders the hero section', () => {
    render(<HomeScreen />);

    expect(screen.getByText(/Your Next Adventure/i)).toBeInTheDocument();
    expect(screen.getByText(/Awaits/i)).toBeInTheDocument();
  });

  it('displays welcome message with user name', () => {
    render(<HomeScreen />);

    // UserContext provides default user with firstName "Sarah"
    expect(screen.getByText(/Welcome back, Sarah/i)).toBeInTheDocument();
  });

  it('renders featured destinations section', () => {
    render(<HomeScreen />);

    expect(screen.getByText(/Featured Destinations/i)).toBeInTheDocument();
    expect(screen.getByText(/Paris/i)).toBeInTheDocument();
    expect(screen.getByText(/Tokyo/i)).toBeInTheDocument();
    expect(screen.getByText(/Bali/i)).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<HomeScreen />);

    const searchInput = screen.getByPlaceholderText(
      /Search destinations, activities, or experiences/i
    );
    expect(searchInput).toBeInTheDocument();
  });
});
