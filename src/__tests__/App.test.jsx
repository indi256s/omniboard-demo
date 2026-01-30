import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Alerts from '../pages/Alerts';
import Report from '../pages/Report';
import DisruptMetrics from '../pages/DisruptMetrics';

// Test component that mimics App routing without BrowserRouter
function TestApp({ initialRoute }) {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<Navigate to="/team/ALL" replace />} />
        <Route path="/team/:teamKey" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/report" element={<Report />} />
        <Route path="/disrupt_metrics" element={<DisruptMetrics />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('App Routing', () => {
  it('redirects / to /team/ALL', () => {
    render(<TestApp initialRoute="/" />);
    // Dashboard should render - check for main element
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders Dashboard at /team/ALL', () => {
    render(<TestApp initialRoute="/team/ALL" />);
    // Check main content area exists
    expect(screen.getByRole('main')).toBeInTheDocument();
    // Check for VelocityChart heading (use getAllByText since it appears multiple times)
    expect(screen.getAllByText('Velocity').length).toBeGreaterThan(0);
  });

  it('renders Dashboard at /team/WEB', () => {
    render(<TestApp initialRoute="/team/WEB" />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders Alerts page at /alerts', () => {
    render(<TestApp initialRoute="/alerts" />);
    // Alerts page has h1 with "🚨 Алерты"
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Алерты');
  });

  it('renders Report page at /report', () => {
    render(<TestApp initialRoute="/report" />);
    // Report page has h1 with "📊 Отчёт"
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Отчёт');
  });

  it('handles deep refresh simulation for /team/BACKEND', () => {
    // Simulates user landing directly on a deep route (like after refresh)
    render(<TestApp initialRoute="/team/BACKEND" />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles deep refresh simulation for /alerts', () => {
    render(<TestApp initialRoute="/alerts" />);
    // Check page rendered with main content
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Алерты');
  });

  it('handles deep refresh simulation for /report', () => {
    render(<TestApp initialRoute="/report" />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Отчёт');
  });

  it('renders DisruptMetrics page at /disrupt_metrics', () => {
    render(<TestApp initialRoute="/disrupt_metrics" />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Disrupt Metrics');
  });
});
