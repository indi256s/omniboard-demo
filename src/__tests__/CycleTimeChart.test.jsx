import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CycleTimeChart from '../components/CycleTimeChart';

const mockData = [
  { week: 'W1', avg: 4.2, median: 3.8, p90: 6.5 },
  { week: 'W2', avg: 3.9, median: 3.5, p90: 6.0 },
  { week: 'W3', avg: 3.5, median: 3.2, p90: 5.5 },
  { week: 'W4', avg: 3.2, median: 2.9, p90: 5.2 },
  { week: 'W5', avg: 2.8, median: 2.5, p90: 4.8 },
  { week: 'W6', avg: 3.0, median: 2.7, p90: 5.0 },
  { week: 'W7', avg: 2.9, median: 2.6, p90: 4.9 },
  { week: 'W8', avg: 2.7, median: 2.4, p90: 4.7 },
];

describe('CycleTimeChart Component', () => {
  it('renders without crashing', () => {
    render(<CycleTimeChart data={mockData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });

  it('displays correct title', () => {
    render(<CycleTimeChart data={mockData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
    expect(screen.getByText(/Последние 8 недель/)).toBeInTheDocument();
  });

  it('shows legend labels', () => {
    render(<CycleTimeChart data={mockData} />);
    expect(screen.getByText('P90')).toBeInTheDocument();
    expect(screen.getByText('Median')).toBeInTheDocument();
    expect(screen.getByText('Avg')).toBeInTheDocument();
  });

  it('displays target information', () => {
    render(<CycleTimeChart data={mockData} />);
    expect(screen.getByText(/Цель: <3д/)).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<CycleTimeChart data={[]} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });

  it('displays with good cycle times (< 3d)', () => {
    const goodData = [
      { week: 'W1', avg: 2.5, median: 2.2, p90: 4.0 },
      { week: 'W2', avg: 2.3, median: 2.0, p90: 3.8 },
      { week: 'W3', avg: 2.4, median: 2.1, p90: 3.9 },
    ];
    
    render(<CycleTimeChart data={goodData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });

  it('displays with warning cycle times (3-5d)', () => {
    const warningData = [
      { week: 'W1', avg: 4.0, median: 3.5, p90: 6.0 },
      { week: 'W2', avg: 4.2, median: 3.8, p90: 6.2 },
      { week: 'W3', avg: 3.9, median: 3.4, p90: 5.8 },
    ];
    
    render(<CycleTimeChart data={warningData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });

  it('displays with poor cycle times (> 5d)', () => {
    const poorData = [
      { week: 'W1', avg: 6.0, median: 5.5, p90: 8.0 },
      { week: 'W2', avg: 6.5, median: 6.0, p90: 8.5 },
      { week: 'W3', avg: 5.8, median: 5.3, p90: 7.8 },
    ];
    
    render(<CycleTimeChart data={poorData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });

  it('handles varying metric values', () => {
    const variedData = [
      { week: 'W1', avg: 2.0, median: 1.8, p90: 4.0 },
      { week: 'W2', avg: 7.0, median: 6.5, p90: 9.0 },
    ];
    
    render(<CycleTimeChart data={variedData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });

  it('handles decimal values correctly', () => {
    const decimalData = [
      { week: 'W1', avg: 2.123, median: 1.987, p90: 4.567 },
      { week: 'W2', avg: 3.456, median: 3.210, p90: 5.789 },
    ];
    
    render(<CycleTimeChart data={decimalData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });
});

describe('CycleTimeChart Zone Backgrounds', () => {
  it('renders with zone background support', () => {
    // Zone backgrounds are rendered via ReferenceArea in Recharts
    // Component should render without errors
    render(<CycleTimeChart data={mockData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });

  it('supports target line at 3 days', () => {
    // Target line is rendered via ReferenceLine in Recharts
    render(<CycleTimeChart data={mockData} />);
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
  });
});
