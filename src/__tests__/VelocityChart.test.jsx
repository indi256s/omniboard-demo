import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VelocityChart from '../components/VelocityChart';

const mockData = [
  { sprint: 'DISRUPT 26-01', planned: 42, completed: 34, pct: 81 },
  { sprint: 'DISRUPT 26-02', planned: 38, completed: 32, pct: 84 },
  { sprint: 'DISRUPT 26-03', planned: 45, completed: 40, pct: 89 },
  { sprint: 'DISRUPT 26-04', planned: 40, completed: 34, pct: 85 },
  { sprint: 'DISRUPT 26-05', planned: 43, completed: 36, pct: 84 },
  { sprint: 'DISRUPT 26-06', planned: 41, completed: 35, pct: 85 },
];

const mockDataWithLowVelocity = [
  { sprint: 'TEAM 26-01', planned: 42, completed: 20, pct: 48 },
  { sprint: 'TEAM 26-02', planned: 38, completed: 22, pct: 58 },
  { sprint: 'TEAM 26-03', planned: 45, completed: 25, pct: 56 },
];

describe('VelocityChart', () => {
  it('renders without crashing', () => {
    render(<VelocityChart data={mockData} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays Velocity title', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('displays subtitle', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Последние 6 спринтов')).toBeInTheDocument();
  });

  it('displays legend items', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Выполнено SP')).toBeInTheDocument();
    expect(screen.getByText('Запланировано SP')).toBeInTheDocument();
  });

  it('renders chart container', () => {
    render(<VelocityChart data={mockData} />);
    // ResponsiveContainer may not render SVG in test env, check container exists
    const container = document.querySelector('.recharts-responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('displays velocity percentages', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('81%')).toBeInTheDocument();
    // Use getAllByText for duplicates (84% appears twice in mockData)
    const elements84 = screen.getAllByText('84%');
    expect(elements84.length).toBeGreaterThan(0);
    expect(screen.getByText('89%')).toBeInTheDocument();
  });

  it('does NOT display Target 60% reference line', () => {
    render(<VelocityChart data={mockData} />);
    // Target line was removed - should not be present
    expect(screen.queryByText('Target 60%')).not.toBeInTheDocument();
  });

  it('does NOT render ReferenceLine element', () => {
    render(<VelocityChart data={mockData} />);
    // ReferenceLine would create a line element with specific attributes
    const referenceLines = document.querySelectorAll('.recharts-reference-line');
    expect(referenceLines.length).toBe(0);
  });
});

describe('VelocityChart Color Coding', () => {
  it('shows green text for good velocity (>= 60%)', () => {
    render(<VelocityChart data={mockData} />);
    // Check velocity percentage labels have green color
    const greenTexts = document.querySelectorAll('.text-green-400');
    expect(greenTexts.length).toBeGreaterThan(0);
  });

  it('shows red text for low velocity (< 60%)', () => {
    render(<VelocityChart data={mockDataWithLowVelocity} />);
    // Check velocity percentage labels have red color
    const redTexts = document.querySelectorAll('.text-red-400');
    expect(redTexts.length).toBeGreaterThan(0);
  });
});

describe('VelocityChart Responsiveness', () => {
  it('uses ResponsiveContainer', () => {
    render(<VelocityChart data={mockData} />);
    const container = document.querySelector('.recharts-responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('has proper height', () => {
    render(<VelocityChart data={mockData} />);
    const container = document.querySelector('.recharts-responsive-container');
    expect(container).toHaveStyle({ height: '240px' });
  });
});
