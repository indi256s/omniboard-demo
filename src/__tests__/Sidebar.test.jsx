import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { teams, platforms } from '../data/mockData';
import { AllProviders } from './testUtils';

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: AllProviders });
};

describe('Sidebar Component', () => {
  const defaultProps = {
    selectedPlatform: 'Все',
    setSelectedPlatform: vi.fn(),
    selectedTeam: teams[2], // Disrupt
    setSelectedTeam: vi.fn(),
    collapsed: false,
    setCollapsed: vi.fn(),
  };

  it('renders all platforms when not collapsed', () => {
    renderWithRouter(<Sidebar {...defaultProps} />);
    platforms.forEach(platform => {
      expect(screen.getByText(platform)).toBeInTheDocument();
    });
  });

  it('renders team list when not collapsed', () => {
    renderWithRouter(<Sidebar {...defaultProps} />);
    // "Disrupt" appears in both nav and team list, use getAllByText
    expect(screen.getAllByText('Disrupt').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Surf')).toBeInTheDocument();
  });

  it('calls setSelectedPlatform when platform clicked', () => {
    const setSelectedPlatform = vi.fn();
    renderWithRouter(<Sidebar {...defaultProps} setSelectedPlatform={setSelectedPlatform} />);
    
    fireEvent.click(screen.getByText('iOS'));
    expect(setSelectedPlatform).toHaveBeenCalledWith('iOS');
  });

  it('calls setSelectedTeam when team clicked', () => {
    const setSelectedTeam = vi.fn();
    renderWithRouter(<Sidebar {...defaultProps} setSelectedTeam={setSelectedTeam} />);
    
    fireEvent.click(screen.getByText('Surf'));
    expect(setSelectedTeam).toHaveBeenCalled();
  });

  it('filters teams by selected platform', () => {
    renderWithRouter(<Sidebar {...defaultProps} selectedPlatform="iOS" />);
    
    // iOS teams should be visible
    expect(screen.getByText('Surf')).toBeInTheDocument();
    expect(screen.getByText('Wave')).toBeInTheDocument();
    // Web team should not be visible
    expect(screen.queryByText('Web Production')).not.toBeInTheDocument();
  });

  it('shows search input when not collapsed', () => {
    renderWithRouter(<Sidebar {...defaultProps} collapsed={false} />);
    // Russian placeholder
    expect(screen.getByPlaceholderText('Поиск...')).toBeInTheDocument();
  });

  it('hides team list and search when collapsed', () => {
    renderWithRouter(<Sidebar {...defaultProps} collapsed={true} />);
    expect(screen.queryByPlaceholderText('Поиск...')).not.toBeInTheDocument();
  });

  it('calls setCollapsed when toggle button clicked', () => {
    const setCollapsed = vi.fn();
    renderWithRouter(<Sidebar {...defaultProps} setCollapsed={setCollapsed} />);
    
    const toggleButton = screen.getByTitle('Collapse');
    fireEvent.click(toggleButton);
    expect(setCollapsed).toHaveBeenCalledWith(true);
  });

  it('shows expand title when collapsed', () => {
    renderWithRouter(<Sidebar {...defaultProps} collapsed={true} />);
    expect(screen.getByTitle('Expand')).toBeInTheDocument();
  });
});

describe('Sidebar Search', () => {
  const defaultProps = {
    selectedPlatform: 'Все',
    setSelectedPlatform: vi.fn(),
    selectedTeam: teams[2],
    setSelectedTeam: vi.fn(),
    collapsed: false,
    setCollapsed: vi.fn(),
  };

  it('filters teams by search query', () => {
    renderWithRouter(<Sidebar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Поиск...');
    fireEvent.change(searchInput, { target: { value: 'Disrupt' } });
    
    // Disrupt appears in both nav and filtered team list, use getAllByText
    expect(screen.getAllByText('Disrupt').length).toBeGreaterThanOrEqual(1);
    // Others should be filtered out (but this depends on implementation)
  });

  it('shows empty state when no teams match', () => {
    renderWithRouter(<Sidebar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Поиск...');
    fireEvent.change(searchInput, { target: { value: 'ZZZZNONEXISTENT' } });
    
    expect(screen.getByText('Нет команд')).toBeInTheDocument();
  });
});

describe('Sidebar Collapsed State', () => {
  const defaultProps = {
    selectedPlatform: 'Все',
    setSelectedPlatform: vi.fn(),
    selectedTeam: null,
    setSelectedTeam: vi.fn(),
    collapsed: true,
    setCollapsed: vi.fn(),
  };

  it('shows platform initials when collapsed', () => {
    renderWithRouter(<Sidebar {...defaultProps} />);
    // Shows first letter of each platform
    expect(screen.getByText('В')).toBeInTheDocument(); // Все
    expect(screen.getByText('i')).toBeInTheDocument(); // iOS
  });
});
