import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DshbWidget from '../components/DshbWidget';

const mockData = {
  baseline: 150,
  target: 135,
  current: 142,
  progressPct: 53.3,
  quarter: 'Q1 2026'
};

const mockDataOnTrack = {
  baseline: 150,
  target: 135,
  current: 140,
  progressPct: 66.7,
  quarter: 'Q1 2026'
};

describe('DshbWidget', () => {
  it('renders without crashing', () => {
    render(<DshbWidget data={mockData} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays ДШБ title', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('ДШБ')).toBeInTheDocument();
  });

  it('displays quarter', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText(/Q1 2026/)).toBeInTheDocument();
  });

  it('displays baseline value', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Baseline')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('displays target value', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('135')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('displays reduced count', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('-8')).toBeInTheDocument();
    expect(screen.getByText('Сокращено')).toBeInTheDocument();
  });

  it('displays remaining count', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Осталось')).toBeInTheDocument();
  });

  it('displays progress bar', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('shows Риск status when progress < 50%', () => {
    // Progress is calculated: ((baseline - current) / (baseline - target)) * 100
    // For At Risk, need progress < 50%, so: (baseline - current) / (baseline - target) < 0.5
    const atRiskData = { 
      baseline: 150, 
      target: 135, 
      current: 148,  // (150-148)/(150-135) = 2/15 = 13.3% < 50%
      progressPct: 13.3, 
      quarter: 'Q1 2026' 
    };
    render(<DshbWidget data={atRiskData} />);
    expect(screen.getByText('Риск')).toBeInTheDocument();
  });

  it('shows В норме status when progress >= 50%', () => {
    render(<DshbWidget data={mockDataOnTrack} />);
    expect(screen.getByText('В норме')).toBeInTheDocument();
  });

  it('has horizontal layout with stats on the right', () => {
    render(<DshbWidget data={mockData} />);
    
    // Check that stats are in a flex container (horizontal layout)
    const statsContainer = document.querySelector('.flex.items-center.gap-8');
    expect(statsContainer).toBeInTheDocument();
  });

  it('displays progress percentage', () => {
    render(<DshbWidget data={mockData} />);
    // Progress is calculated: ((baseline - current) / (baseline - target)) * 100
    // = ((150 - 142) / (150 - 135)) * 100 = (8/15) * 100 = 53.3%
    expect(screen.getByText('53.3%')).toBeInTheDocument();
  });
});

describe('DshbWidget Edge Cases', () => {
  it('handles zero remaining bugs', () => {
    const completedData = {
      baseline: 150,
      target: 135,
      current: 135,
      progressPct: 100,
      quarter: 'Q1 2026'
    };
    render(<DshbWidget data={completedData} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles overachievement (current < target)', () => {
    const overachievedData = {
      baseline: 150,
      target: 135,
      current: 130,
      progressPct: 133.3,
      quarter: 'Q1 2026'
    };
    render(<DshbWidget data={overachievedData} />);
    expect(screen.getByText('В норме')).toBeInTheDocument();
  });
});
