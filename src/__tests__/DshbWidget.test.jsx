import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DshbWidget from '../components/DshbWidget';

const mockData = {
  quarter: 'Q1 2026',
  baseline: 850,
  current: 650,
  target: 500,
  progressPct: 57,
};

const mockDataOnTrack = {
  quarter: 'Q1 2026',
  baseline: 850,
  current: 500,
  target: 500,
  progressPct: 100,
};

const mockDataAtRisk = {
  quarter: 'Q1 2026',
  baseline: 850,
  current: 750,
  target: 500,
  progressPct: 29,
};

describe('DshbWidget Component', () => {
  it('renders without crashing', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('ДШБ')).toBeInTheDocument();
  });

  it('displays quarter information', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText(/Q1 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Динамическая шкала багов/)).toBeInTheDocument();
  });

  it('shows all three metrics in Russian', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('Базовая')).toBeInTheDocument();
    expect(screen.getByText('Текущая')).toBeInTheDocument();
    expect(screen.getByText('Цель')).toBeInTheDocument();
  });

  it('displays correct metric values', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('850')).toBeInTheDocument(); // Baseline
    expect(screen.getByText('650')).toBeInTheDocument(); // Current
    expect(screen.getByText('500')).toBeInTheDocument(); // Target
  });

  it('shows progress label in Russian', () => {
    render(<DshbWidget data={mockData} />);
    expect(screen.getByText('Прогресс')).toBeInTheDocument();
  });

  it('displays progress percentage', () => {
    render(<DshbWidget data={mockData} />);
    // Progress = ((baseline - current) / (baseline - target)) * 100
    // ((850 - 650) / (850 - 500)) * 100 = 57.14%
    const progressText = screen.getByText(/57\./);
    expect(progressText).toBeInTheDocument();
  });

  it('shows "В графике" status when progress >= 50%', () => {
    render(<DshbWidget data={mockDataOnTrack} />);
    expect(screen.getByText('В графике')).toBeInTheDocument();
  });

  it('shows "Риск" status when progress < 50%', () => {
    render(<DshbWidget data={mockDataAtRisk} />);
    expect(screen.getByText('Риск')).toBeInTheDocument();
  });

  it('displays bugs reduced count', () => {
    render(<DshbWidget data={mockData} />);
    // Bugs reduced = baseline - current = 850 - 650 = 200
    expect(screen.getByText(/200/)).toBeInTheDocument();
    expect(screen.getByText(/Сокращено:/)).toBeInTheDocument();
  });

  it('displays bugs remaining count', () => {
    render(<DshbWidget data={mockData} />);
    // Bugs remaining = current - target = 650 - 500 = 150
    expect(screen.getByText(/150/)).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
  });

  it('renders progress bar', () => {
    const { container } = render(<DshbWidget data={mockData} />);
    
    // Progress bar should be a div with gradient background
    const progressBar = container.querySelector('div[style*="width"]');
    expect(progressBar).toBeTruthy();
  });

  it('uses horizontal layout (grid with 2 columns)', () => {
    const { container } = render(<DshbWidget data={mockData} />);
    
    // Should have grid with stats on left, progress on right
    const gridContainer = container.querySelector('.grid-cols-\\[auto_1fr\\]');
    expect(gridContainer).toBeTruthy();
  });
});

describe('DshbWidget Progress Calculation', () => {
  it('calculates progress correctly for mid-range values', () => {
    const data = {
      quarter: 'Q1 2026',
      baseline: 1000,
      current: 700,
      target: 400,
      progressPct: 50, // ((1000-700)/(1000-400))*100 = 50%
    };
    
    render(<DshbWidget data={data} />);
    const progressText = screen.getByText(/50\.0%/);
    expect(progressText).toBeInTheDocument();
  });

  it('handles 100% progress correctly', () => {
    const data = {
      quarter: 'Q1 2026',
      baseline: 800,
      current: 500,
      target: 500,
      progressPct: 100,
    };
    
    render(<DshbWidget data={data} />);
    expect(screen.getByText('В графике')).toBeInTheDocument();
    expect(screen.getByText(/100\.0%/)).toBeInTheDocument();
  });

  it('handles 0% progress correctly', () => {
    const data = {
      quarter: 'Q1 2026',
      baseline: 800,
      current: 800,
      target: 500,
      progressPct: 0,
    };
    
    render(<DshbWidget data={data} />);
    expect(screen.getByText('Риск')).toBeInTheDocument();
    expect(screen.getByText(/0\.0%/)).toBeInTheDocument();
  });

  it('handles over 100% progress correctly', () => {
    const data = {
      quarter: 'Q1 2026',
      baseline: 800,
      current: 400,
      target: 500,
      progressPct: 133, // ((800-400)/(800-500))*100 = 133%
    };
    
    render(<DshbWidget data={data} />);
    expect(screen.getByText('В графике')).toBeInTheDocument();
  });
});

describe('DshbWidget Visual Styling', () => {
  it('applies green styling for "В графике" status', () => {
    const { container } = render(<DshbWidget data={mockDataOnTrack} />);
    const statusBadge = screen.getByText('В графике');
    
    expect(statusBadge.className).toContain('text-green-400');
    expect(statusBadge.className).toContain('border-green-500');
  });

  it('applies yellow styling for "Риск" status', () => {
    const { container } = render(<DshbWidget data={mockDataAtRisk} />);
    const statusBadge = screen.getByText('Риск');
    
    expect(statusBadge.className).toContain('text-yellow-400');
    expect(statusBadge.className).toContain('border-yellow-500');
  });

  it('uses gradient progress bar', () => {
    const { container } = render(<DshbWidget data={mockData} />);
    
    const progressBar = container.querySelector('.bg-gradient-to-r');
    expect(progressBar).toBeTruthy();
  });

  it('displays larger stat numbers (text-3xl)', () => {
    const { container } = render(<DshbWidget data={mockData} />);
    
    const statNumbers = container.querySelectorAll('.text-3xl');
    expect(statNumbers.length).toBe(3); // Baseline, Current, Target
  });
});
