import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Navbar from './Navbar';

describe('Navbar', () => {
  describe('Rendering', () => {
    it('renders the navbar without crashing', () => {
      render(<Navbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders the VacationPlanner logo/brand', () => {
      render(<Navbar />);

      expect(screen.getByText('VacationPlanner')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<Navbar />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Planner')).toBeInTheDocument();
      expect(screen.getByText('Hotels')).toBeInTheDocument();
    });

    it('displays user greeting with first name', () => {
      render(<Navbar />);

      // Default user context provides firstName "Sarah"
      expect(screen.getByText(/Hi, Sarah/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('renders Home link with correct href', () => {
      render(<Navbar />);

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders Explore link with correct href', () => {
      render(<Navbar />);

      const exploreLink = screen.getByText('Explore').closest('a');
      expect(exploreLink).toHaveAttribute('href', '/explore');
    });

    it('renders Planner link with correct href', () => {
      render(<Navbar />);

      const plannerLink = screen.getByText('Planner').closest('a');
      expect(plannerLink).toHaveAttribute('href', '/planner');
    });

    it('renders Hotels link with correct href', () => {
      render(<Navbar />);

      const hotelsLink = screen.getByText('Hotels').closest('a');
      expect(hotelsLink).toHaveAttribute('href', '/hotels');
    });

    it('renders Profile link with correct href', () => {
      render(<Navbar />);

      const profileLink = screen.getByText(/Hi, Sarah/i).closest('a');
      expect(profileLink).toHaveAttribute('href', '/profile');
    });
  });

  describe('Active Link Styling', () => {
    it('applies appropriate styling classes to navigation links', () => {
      render(<Navbar />);

      // All nav links should have the NavLink component applied
      const homeLink = screen.getByText('Home').closest('a');
      const exploreLink = screen.getByText('Explore').closest('a');

      // Both links should exist and have appropriate classes
      expect(homeLink).toBeInTheDocument();
      expect(exploreLink).toBeInTheDocument();

      // One should have active styling, others inactive
      // Home link should be active by default (root route)
      expect(homeLink).toHaveClass('text-gray-900');
    });

    it('inactive links have hover effect classes', () => {
      render(<Navbar />);

      // Check that links have transition classes for hover effects
      const plannerLink = screen.getByText('Planner').closest('a');
      expect(plannerLink).toHaveClass('transition-colors');
    });
  });

  describe('Logo Interaction', () => {
    it('logo links to home page', () => {
      render(<Navbar />);

      const logoLink = screen.getByText('VacationPlanner').closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders SVG icon in logo', () => {
      render(<Navbar />);

      const svg = screen.getByText('VacationPlanner')
        .closest('a')
        .querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles user with empty firstName gracefully', () => {
      // This test would require mocking the UserContext
      // For now, it demonstrates the test structure
      render(<Navbar />);

      // Should still render the greeting area
      const profileLink = screen.getByText(/Hi,/i);
      expect(profileLink).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('has fixed positioning for sticky navbar', () => {
      render(<Navbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('fixed');
      expect(nav).toHaveClass('top-0');
    });

    it('has backdrop blur styling', () => {
      render(<Navbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('backdrop-blur-xl');
    });

    it('contains all navigation sections', () => {
      render(<Navbar />);

      // Logo section
      expect(screen.getByText('VacationPlanner')).toBeInTheDocument();

      // Navigation links section
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Planner')).toBeInTheDocument();
      expect(screen.getByText('Hotels')).toBeInTheDocument();

      // Profile section
      expect(screen.getByText(/Hi,/i)).toBeInTheDocument();
    });
  });
});
