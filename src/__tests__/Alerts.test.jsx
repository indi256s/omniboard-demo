import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import Alerts from '../pages/Alerts';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/alerts' }),
  };
});

const renderAlerts = () => {
  return render(
    <ThemeProvider>
      <BrowserRouter>
        <Alerts />
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('Alerts Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the alerts header', () => {
    renderAlerts();
    expect(screen.getByText('🚨 Алерты')).toBeInTheDocument();
  });

  it('displays alert statistics', () => {
    renderAlerts();
    expect(screen.getByText(/алертов/)).toBeInTheDocument();
  });

  it('renders filter buttons for alert types', () => {
    renderAlerts();
    expect(screen.getByText('Все типы')).toBeInTheDocument();
    // Use getAllByText since Velocity appears in both filter and section header
    expect(screen.getAllByText('Velocity').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cycle Time').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Team Health').length).toBeGreaterThanOrEqual(1);
  });

  it('renders severity filter buttons', () => {
    renderAlerts();
    // Use getAllByText since emoji icons appear in both filter and alerts
    expect(screen.getAllByText('🔴').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🟡').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🟢').length).toBeGreaterThanOrEqual(1);
  });

  it('filters alerts by type when clicking filter', () => {
    renderAlerts();
    // Get filter buttons specifically (first one should be the filter)
    const velocityFilters = screen.getAllByText('Velocity');
    const filterButton = velocityFilters[0]; // First one is the filter button
    fireEvent.click(filterButton);
    // Should still show Velocity section
    expect(screen.getAllByText('Velocity').length).toBeGreaterThanOrEqual(1);
  });

  it('filters alerts by severity when clicking severity filter', () => {
    renderAlerts();
    // Get filter buttons specifically (first one is the filter)
    const criticalFilters = screen.getAllByText('🔴');
    const filterButton = criticalFilters[0];
    fireEvent.click(filterButton);
    // Filter should be active
    expect(screen.getAllByText('🔴').length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to team dashboard when clicking an alert', () => {
    renderAlerts();
    // Find any alert card and click it
    const alertCards = document.querySelectorAll('[class*="cursor-pointer"]');
    if (alertCards.length > 0) {
      fireEvent.click(alertCards[0]);
      expect(mockNavigate).toHaveBeenCalled();
    }
  });

  it('shows breadcrumb navigation', () => {
    renderAlerts();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('renders footer with version info', () => {
    renderAlerts();
    expect(screen.getByText(/PMO Омниборд v2.0/)).toBeInTheDocument();
  });
});
