import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

const renderDashboard = (initialRoute = '/team/DISRUPT') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/team/:teamKey" element={<Dashboard />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Dashboard Page', () => {
  it('renders without crashing', () => {
    renderDashboard();
    expect(document.body).toBeInTheDocument();
  });

  it('displays team name from URL param', async () => {
    renderDashboard('/team/DISRUPT');
    await waitFor(() => {
      // Use getAllBy since team name appears multiple times
      const elements = screen.getAllByText(/Disrupt/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('renders sidebar with platforms', () => {
    renderDashboard();
    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('iOS')).toBeInTheDocument();
  });

  it('renders velocity metrics', async () => {
    renderDashboard();
    await waitFor(() => {
      // Multiple velocity elements exist
      const elements = screen.getAllByText(/Velocity/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('renders charts (SVG elements)', async () => {
    renderDashboard();
    await waitFor(() => {
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  it('handles different team routes', async () => {
    renderDashboard('/team/SURF');
    await waitFor(() => {
      const elements = screen.getAllByText(/Surf/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('renders summary table with cycle time header', async () => {
    renderDashboard();
    await waitFor(() => {
      const elements = screen.getAllByText(/Cycle Time/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('renders DSHB widget', async () => {
    renderDashboard();
    await waitFor(() => {
      // Widget title is in Russian: ДШБ (appears multiple times)
      const elements = screen.getAllByText('ДШБ');
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});

describe('Dashboard Responsiveness', () => {
  it('renders on mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
    window.dispatchEvent(new Event('resize'));
    
    renderDashboard();
    expect(document.body).toBeInTheDocument();
  });

  it('renders on tablet viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
    window.dispatchEvent(new Event('resize'));
    
    renderDashboard();
    expect(document.body).toBeInTheDocument();
  });

  it('renders on desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true });
    window.dispatchEvent(new Event('resize'));
    
    renderDashboard();
    expect(document.body).toBeInTheDocument();
  });
});

describe('Dashboard Components Integration', () => {
  it('renders main layout structure', () => {
    renderDashboard();
    
    // Sidebar exists
    const sidebar = document.querySelector('aside');
    expect(sidebar).toBeInTheDocument();
    
    // Main content area exists
    const main = document.querySelector('main') || document.querySelector('[class*="flex"]');
    expect(main).toBeInTheDocument();
  });

  it('shows platform selector in sidebar', () => {
    renderDashboard();
    expect(screen.getByText('Платформа')).toBeInTheDocument();
  });

  it('shows team count in sidebar', () => {
    renderDashboard();
    expect(screen.getByText(/Команды/)).toBeInTheDocument();
  });
});
