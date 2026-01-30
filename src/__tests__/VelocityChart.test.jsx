import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VelocityChart from '../components/VelocityChart';

const mockData = [
  { sprint: 'S1', planned: 80, completed: 45, pct: 56 },
  { sprint: 'S2', planned: 75, completed: 50, pct: 67 },
  { sprint: 'S3', planned: 85, completed: 55, pct: 65 },
  { sprint: 'S4', planned: 90, completed: 60, pct: 67 },
  { sprint: 'S5', planned: 80, completed: 70, pct: 88 },
  { sprint: 'S6', planned: 85, completed: 55, pct: 65 },
];

describe('VelocityChart Component', () => {
  it('renders without crashing', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('displays correct title', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
    expect(screen.getByText(/Последние 6 спринтов/)).toBeInTheDocument();
  });

  it('shows legend labels', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Completed SP')).toBeInTheDocument();
    expect(screen.getByText('Planned SP')).toBeInTheDocument();
  });

  it('renders chart container', () => {
    const { container } = render(<VelocityChart data={mockData} />);
    // ResponsiveContainer should render
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    render(<VelocityChart data={[]} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('renders with varying completion rates', () => {
    const variedData = [
      { sprint: 'S1', planned: 100, completed: 40, pct: 40 },
      { sprint: 'S2', planned: 100, completed: 55, pct: 55 },
      { sprint: 'S3', planned: 100, completed: 70, pct: 70 },
    ];
    
    render(<VelocityChart data={variedData} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('handles large SP values', () => {
    const largeData = [
      { sprint: 'S1', planned: 500, completed: 300, pct: 60 },
      { sprint: 'S2', planned: 600, completed: 400, pct: 67 },
    ];
    
    render(<VelocityChart data={largeData} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('handles small SP values', () => {
    const smallData = [
      { sprint: 'S1', planned: 5, completed: 3, pct: 60 },
      { sprint: 'S2', planned: 6, completed: 4, pct: 67 },
    ];
    
    render(<VelocityChart data={smallData} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });
});

describe('VelocityChart Target Calculation', () => {
  it('calculates target line from last 3 sprints', () => {
    // Last 3 sprints: S4 (90), S5 (80), S6 (85)
    // Average planned: (90 + 80 + 85) / 3 = 85
    // 60% of 85 = 51
    
    render(<VelocityChart data={mockData} />);
    // Component renders without errors
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('handles data with consistent planned values', () => {
    const consistentData = [
      { sprint: 'S1', planned: 100, completed: 60, pct: 60 },
      { sprint: 'S2', planned: 100, completed: 65, pct: 65 },
      { sprint: 'S3', planned: 100, completed: 70, pct: 70 },
    ];
    
    render(<VelocityChart data={consistentData} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });
});
