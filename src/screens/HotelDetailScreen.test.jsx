import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HotelDetailScreen from './HotelDetailScreen';
import * as destinationsApi from '../api/destinations';
import { UserProvider } from '../context/UserContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { TripProvider } from '../context/TripContext';

// Mock the destinations API
vi.mock('../api/destinations');

// Helper function to render with all providers and routing
function renderWithRouter(ui, { initialEntries = ['/hotels'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <UserProvider>
        <FavoritesProvider>
          <TripProvider>
            <Routes>
              <Route path="/hotels/:id" element={ui} />
              <Route path="/hotels" element={ui} />
            </Routes>
          </TripProvider>
        </FavoritesProvider>
      </UserProvider>
    </MemoryRouter>
  );
}

// Mock window.history.back
const mockHistoryBack = vi.fn();
Object.defineProperty(window, 'history', {
  value: {
    back: mockHistoryBack,
  },
  writable: true,
});

describe('HotelDetailScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders loading state initially when ID is provided', () => {
      destinationsApi.getDestinationDetails.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/test-place-123'],
      });

      expect(screen.getByText(/loading destination details/i)).toBeInTheDocument();
      const spinnerContainer = screen.getByText(/loading destination details/i).closest('div').parentElement;
      expect(spinnerContainer.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders mock destination when no ID is provided', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/downtown paris, france/i)).toBeInTheDocument();
      expect(
        screen.getByText(/experience luxury and comfort in the heart of paris/i)
      ).toBeInTheDocument();
    });

    it('displays destination details after successful API call', async () => {
      const mockDestination = {
        name: 'Eiffel Tower Hotel',
        address: '5 Avenue Anatole, Paris, France',
        description: 'A magnificent hotel near the Eiffel Tower with stunning city views.',
      };

      destinationsApi.getDestinationDetails.mockResolvedValue(mockDestination);

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/eiffel-tower-hotel-123'],
      });

      await waitFor(() => {
        expect(screen.getByText(/eiffel tower hotel/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/5 avenue anatole, paris, france/i)).toBeInTheDocument();
      expect(
        screen.getByText(/a magnificent hotel near the eiffel tower/i)
      ).toBeInTheDocument();
    });

    it('displays all hotel information sections', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      // Check for main sections using heading roles
      expect(screen.getByRole('heading', { name: /amenities/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /guest reviews/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
    });

    it('displays pricing information in booking sidebar', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/\$299/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/\/ night/i)).toBeInTheDocument();

      // Check for rating and reviews - there are two instances, so use getAllByText
      const ratings = screen.getAllByText(/4\.5/i);
      expect(ratings.length).toBeGreaterThan(0);

      const reviews = screen.getAllByText(/\(128 reviews\)/i);
      expect(reviews.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API call fails', async () => {
      destinationsApi.getDestinationDetails.mockRejectedValue(
        new Error('Destination not found')
      );

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/invalid-id'],
      });

      await waitFor(() => {
        expect(screen.getByText(/error loading destination/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/destination not found/i)).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('displays error message when API call fails without error message', async () => {
      destinationsApi.getDestinationDetails.mockRejectedValue(new Error());

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/invalid-id'],
      });

      await waitFor(() => {
        expect(screen.getByText(/error loading destination/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/failed to load destination details/i)).toBeInTheDocument();
    });

    it('renders go back button in error state', async () => {
      destinationsApi.getDestinationDetails.mockRejectedValue(
        new Error('Network error')
      );

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/invalid-id'],
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
      });
    });
  });

  describe('Image Gallery', () => {
    it('displays the first image by default', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      const image = screen.getByAltText(/grand luxury hotel & spa view 1/i);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
      );
    });

    it('changes image when next button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      // Find and click next button
      const nextButtons = screen.getAllByRole('button');
      const nextButton = nextButtons.find((btn) =>
        btn.querySelector('path[d*="M9 5l7 7-7 7"]')
      );
      await user.click(nextButton);

      // Check that image changed
      const image = screen.getByAltText(/grand luxury hotel & spa view 2/i);
      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'
      );
    });

    it('changes image when previous button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      // Find and click previous button
      const prevButtons = screen.getAllByRole('button');
      const prevButton = prevButtons.find((btn) =>
        btn.querySelector('path[d*="M15 19l-7-7 7-7"]')
      );
      await user.click(prevButton);

      // Should cycle to last image
      const image = screen.getByAltText(/grand luxury hotel & spa view 4/i);
      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'
      );
    });

    it('cycles back to first image after last image', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      const nextButtons = screen.getAllByRole('button');
      const nextButton = nextButtons.find((btn) =>
        btn.querySelector('path[d*="M9 5l7 7-7 7"]')
      );

      // Click next 4 times to cycle through all images and back to first
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      const image = screen.getByAltText(/grand luxury hotel & spa view 1/i);
      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
      );
    });

    it('allows clicking on image dots to navigate', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      // Get all buttons and filter for dot buttons (small circular buttons)
      const allButtons = screen.getAllByRole('button');
      const dotButtons = allButtons.filter((btn) => {
        const hasWidthClass = btn.className.includes('w-2');
        const hasHeightClass = btn.className.includes('h-2');
        return hasWidthClass && hasHeightClass;
      });

      // Click on the third dot (index 2)
      await user.click(dotButtons[2]);

      const image = screen.getByAltText(/grand luxury hotel & spa view 3/i);
      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200'
      );
    });
  });

  describe('Amenities Section', () => {
    it('displays all amenities', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /amenities/i })).toBeInTheDocument();
      });

      expect(screen.getByText(/swimming pool/i)).toBeInTheDocument();
      expect(screen.getByText(/free wifi/i)).toBeInTheDocument();
      expect(screen.getByText(/free parking/i)).toBeInTheDocument();
      expect(screen.getByText(/breakfast included/i)).toBeInTheDocument();
      expect(screen.getByText(/fitness center/i)).toBeInTheDocument();
      expect(screen.getByText(/room service/i)).toBeInTheDocument();
    });

    it('displays amenity icons', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /amenities/i })).toBeInTheDocument();
      });

      const amenitiesHeading = screen.getByRole('heading', { name: /amenities/i });
      const amenitiesSection = amenitiesHeading.closest('div');
      const svgIcons = amenitiesSection.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Reviews Section', () => {
    it('displays all guest reviews', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/guest reviews/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument();
      expect(screen.getByText(/michael chen/i)).toBeInTheDocument();
      expect(screen.getByText(/emma williams/i)).toBeInTheDocument();
    });

    it('displays review dates and ratings', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/guest reviews/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/march 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/february 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/january 2024/i)).toBeInTheDocument();
    });

    it('displays review comments', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/guest reviews/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/absolutely wonderful stay! the staff was incredibly friendly/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/great hotel with excellent amenities/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/best hotel experience in paris!/i)
      ).toBeInTheDocument();
    });

    it('displays star ratings for reviews', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/guest reviews/i)).toBeInTheDocument();
      });

      const reviewsSection = screen.getByText(/guest reviews/i).closest('div');
      const starIcons = reviewsSection.querySelectorAll('svg');
      // Each review has 5 stars, so 3 reviews = 15 stars minimum
      expect(starIcons.length).toBeGreaterThanOrEqual(15);
    });
  });

  describe('Booking Sidebar', () => {
    it('displays booking form inputs', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      // Check for form inputs using more specific queries
      const dateInputs = screen.getAllByDisplayValue('');
      expect(dateInputs.length).toBeGreaterThanOrEqual(2); // At least check-in and check-out

      const guestsSelect = screen.getByRole('combobox');
      expect(guestsSelect).toBeInTheDocument();
    });

    it('displays booking button', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
    });

    it('displays cancellation policy', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/free cancellation up to 24 hours before check-in/i)
      ).toBeInTheDocument();
    });

    it('allows selecting number of guests', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      const guestsSelect = screen.getByRole('combobox');
      await user.selectOptions(guestsSelect, '3 guests');

      expect(guestsSelect.value).toBe('3 guests');
    });

    it('allows selecting check-in date', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      // Get date inputs - there should be two (check-in and check-out)
      const dateInputs = screen.getAllByDisplayValue('');
      const checkInInput = dateInputs[0]; // First date input is check-in
      await user.type(checkInInput, '2024-06-15');

      expect(checkInInput.value).toBe('2024-06-15');
    });

    it('allows selecting check-out date', async () => {
      const user = userEvent.setup();
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });

      // Get date inputs - there should be two (check-in and check-out)
      const dateInputs = screen.getAllByDisplayValue('');
      const checkOutInput = dateInputs[1]; // Second date input is check-out
      await user.type(checkOutInput, '2024-06-20');

      expect(checkOutInput.value).toBe('2024-06-20');
    });
  });

  describe('User Interactions', () => {
    it('handles go back button click in error state', async () => {
      const user = userEvent.setup();
      destinationsApi.getDestinationDetails.mockRejectedValue(
        new Error('Not found')
      );

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/invalid-id'],
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
      });

      const goBackButton = screen.getByRole('button', { name: /go back/i });
      await user.click(goBackButton);

      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles destination with minimal data', async () => {
      const minimalDestination = {
        name: 'Basic Hotel',
        address: '',
        description: '',
      };

      destinationsApi.getDestinationDetails.mockResolvedValue(minimalDestination);

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/minimal-hotel'],
      });

      await waitFor(() => {
        expect(screen.getByText(/basic hotel/i)).toBeInTheDocument();
      });
    });

    it('handles very long destination name', async () => {
      const longNameDestination = {
        name: 'The Grand Imperial Luxury Hotel & Spa Resort with Panoramic Views and World-Class Amenities',
        address: '123 Main Street, Paris',
        description: 'A luxurious hotel',
      };

      destinationsApi.getDestinationDetails.mockResolvedValue(longNameDestination);

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/long-name-hotel'],
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            /the grand imperial luxury hotel & spa resort with panoramic views/i
          )
        ).toBeInTheDocument();
      });
    });

    it('handles special characters in destination name', async () => {
      const specialCharDestination = {
        name: "L'Hôtel Château & Résidence",
        address: 'Paris, France',
        description: 'A French hotel',
      };

      destinationsApi.getDestinationDetails.mockResolvedValue(specialCharDestination);

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/special-char-hotel'],
      });

      await waitFor(() => {
        expect(screen.getByText(/l'hôtel château & résidence/i)).toBeInTheDocument();
      });
    });

    it('handles undefined ID parameter', async () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      await waitFor(() => {
        expect(screen.getByText(/grand luxury hotel & spa/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('calls getDestinationDetails with correct ID', async () => {
      const testId = 'test-destination-123';
      destinationsApi.getDestinationDetails.mockResolvedValue({
        name: 'Test Hotel',
        address: 'Test Address',
        description: 'Test Description',
      });

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: [`/hotels/${testId}`],
      });

      await waitFor(() => {
        expect(destinationsApi.getDestinationDetails).toHaveBeenCalledWith(testId);
      });
    });

    it('does not call API when no ID is provided', () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      expect(destinationsApi.getDestinationDetails).not.toHaveBeenCalled();
    });

    it('handles network timeout errors', async () => {
      destinationsApi.getDestinationDetails.mockRejectedValue(
        new Error('Request timeout')
      );

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/timeout-test'],
      });

      await waitFor(() => {
        expect(screen.getByText(/request timeout/i)).toBeInTheDocument();
      });
    });
  });

  describe('Conditional Rendering', () => {
    it('transitions from loading to success state', async () => {
      const mockDestination = {
        name: 'Success Hotel',
        address: 'Success Street',
        description: 'Success Description',
      };

      destinationsApi.getDestinationDetails.mockResolvedValue(mockDestination);

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/success-hotel'],
      });

      // Initially loading
      expect(screen.getByText(/loading destination details/i)).toBeInTheDocument();

      // Then success
      await waitFor(() => {
        expect(screen.queryByText(/loading destination details/i)).not.toBeInTheDocument();
      });
      expect(screen.getByText(/success hotel/i)).toBeInTheDocument();
    });

    it('transitions from loading to error state', async () => {
      destinationsApi.getDestinationDetails.mockRejectedValue(
        new Error('API Error')
      );

      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels/error-hotel'],
      });

      // Initially loading
      expect(screen.getByText(/loading destination details/i)).toBeInTheDocument();

      // Then error
      await waitFor(() => {
        expect(screen.queryByText(/loading destination details/i)).not.toBeInTheDocument();
      });
      expect(screen.getByText(/error loading destination/i)).toBeInTheDocument();
    });

    it('does not show loading state when no ID provided', () => {
      renderWithRouter(<HotelDetailScreen />, {
        initialEntries: ['/hotels'],
      });

      expect(screen.queryByText(/loading destination details/i)).not.toBeInTheDocument();
    });
  });
});
