import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<Header selectedTeam={null} />);
    expect(screen.getByText('All Teams')).toBeInTheDocument();
  });

  it('displays team name when team is selected', () => {
    const team = {
      name: 'Disrupt',
      platform: 'iOS',
      key: 'DISRUPT'
    };
    render(<Header selectedTeam={team} />);
    expect(screen.getByText('Disrupt')).toBeInTheDocument();
  });

  it('displays breadcrumb when team is selected', () => {
    const team = {
      name: 'Disrupt',
      platform: 'iOS',
      key: 'DISRUPT'
    };
    render(<Header selectedTeam={team} />);
    // Platform and key appear in breadcrumb (may appear multiple times)
    const iOSElements = screen.getAllByText('iOS');
    expect(iOSElements.length).toBeGreaterThan(0);
    expect(screen.getByText('DISRUPT')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Header selectedTeam={null} />);
    const button = screen.getByLabelText('Toggle theme');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme on button click', () => {
    render(<Header selectedTeam={null} />);
    const button = screen.getByLabelText('Toggle theme');
    
    // Initial theme should be dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    // Click to toggle to light
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    
    // Click again to toggle back to dark
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('persists theme preference in localStorage', () => {
    render(<Header selectedTeam={null} />);
    const button = screen.getByLabelText('Toggle theme');
    
    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('loads theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'light');
    render(<Header selectedTeam={null} />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('displays formatted date', () => {
    render(<Header selectedTeam={null} />);
    // Check for date format pattern (will vary by locale)
    const dateElements = screen.getAllByText(/\d{2}.\d{2}.\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('shows platform badge when team is selected', () => {
    const team = {
      name: 'Disrupt',
      platform: 'iOS',
      key: 'DISRUPT'
    };
    render(<Header selectedTeam={team} />);
    const badges = screen.getAllByText('iOS');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('shows "Обзор" when no team is selected', () => {
    render(<Header selectedTeam={null} />);
    expect(screen.getByText('Обзор')).toBeInTheDocument();
  });
});
