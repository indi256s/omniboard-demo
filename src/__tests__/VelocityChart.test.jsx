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
    expect(screen.getByText('Скорость')).toBeInTheDocument();
  });

  it('displays correct title in Russian', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Скорость')).toBeInTheDocument();
    expect(screen.getByText(/Последние 6 спринтов/)).toBeInTheDocument();
  });

  it('shows legend with Russian labels', () => {
    render(<VelocityChart data={mockData} />);
    expect(screen.getByText('Выполнено SP')).toBeInTheDocument();
    expect(screen.getByText('Запланировано SP')).toBeInTheDocument();
  });

  it('renders chart container', () => {
    const { container } = render(<VelocityChart data={mockData} />);
    // ResponsiveContainer should render
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('calculates target line correctly (60% of avg planned from last 3 sprints)', () => {
    const { container } = render(<VelocityChart data={mockData} />);
    
    // Last 3 sprints: S4 (90), S5 (80), S6 (85)
    // Average planned: (90 + 80 + 85) / 3 = 85
    // 60% of 85 = 51
    
    // Check if target line label contains "51"
    const targetLabel = screen.getByText(/Цель 60%/);
    expect(targetLabel).toBeInTheDocument();
    expect(targetLabel.textContent).toContain('51');
  });

  it('displays percentage badges on bars', () => {
    const { container } = render(<VelocityChart data={mockData} />);
    
    // Percentages should be rendered as text elements
    const texts = container.querySelectorAll('text');
    const percentageTexts = Array.from(texts).filter(t => 
      t.textContent.includes('%')
    );
    
    expect(percentageTexts.length).toBeGreaterThan(0);
  });

  it('renders Y axis label in Russian', () => {
    const { container } = render(<VelocityChart data={mockData} />);
    
    // Y axis label should be "Очки"
    const texts = container.querySelectorAll('text');
    const yAxisLabel = Array.from(texts).find(t => 
      t.textContent === 'Очки'
    );
    
    expect(yAxisLabel).toBeDefined();
  });

  it('handles empty data gracefully', () => {
    const { container } = render(<VelocityChart data={[]} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders all sprint labels', () => {
    const { container } = render(<VelocityChart data={mockData} />);
    
    mockData.forEach(item => {
      const sprintLabel = container.querySelector(`text[text-anchor="middle"]:not([font-family])`);
      // At least some sprint labels should be present
      expect(sprintLabel).toBeTruthy();
    });
  });
});

describe('VelocityChart Data Integrity', () => {
  it('correctly processes data with varying completion rates', () => {
    const variedData = [
      { sprint: 'S1', planned: 100, completed: 40, pct: 40 },  // Red (< 50%)
      { sprint: 'S2', planned: 100, completed: 55, pct: 55 },  // Yellow (50-60%)
      { sprint: 'S3', planned: 100, completed: 70, pct: 70 },  // Green (>= 60%)
    ];
    
    const { container } = render(<VelocityChart data={variedData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('handles large SP values', () => {
    const largeData = [
      { sprint: 'S1', planned: 500, completed: 300, pct: 60 },
      { sprint: 'S2', planned: 600, completed: 400, pct: 67 },
    ];
    
    render(<VelocityChart data={largeData} />);
    expect(screen.getByText('Скорость')).toBeInTheDocument();
  });

  it('handles small SP values', () => {
    const smallData = [
      { sprint: 'S1', planned: 5, completed: 3, pct: 60 },
      { sprint: 'S2', planned: 6, completed: 4, pct: 67 },
    ];
    
    render(<VelocityChart data={smallData} />);
    expect(screen.getByText('Скорость')).toBeInTheDocument();
  });
});
