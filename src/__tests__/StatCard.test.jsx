import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../components/StatCard';

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Velocity',
    value: '73%',
    subtitle: 'Sprint target',
    status: 'good',
  };

  it('renders title and value', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
    expect(screen.getByText('73%')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Sprint target')).toBeInTheDocument();
  });

  it('renders status badge for good status', () => {
    render(<StatCard {...defaultProps} status="good" />);
    expect(screen.getByText('On Track')).toBeInTheDocument();
  });

  it('renders status badge for warning status', () => {
    render(<StatCard {...defaultProps} status="warning" />);
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('renders status badge for critical status', () => {
    render(<StatCard {...defaultProps} status="critical" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('renders without status', () => {
    const { title, value, subtitle } = defaultProps;
    render(<StatCard title={title} value={value} subtitle={subtitle} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
    expect(screen.queryByText('On Track')).not.toBeInTheDocument();
  });

  it('renders trend indicator when positive', () => {
    render(<StatCard {...defaultProps} trend={5} />);
    expect(screen.getByText(/↗/)).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });

  it('renders trend indicator when negative', () => {
    render(<StatCard {...defaultProps} trend={-3} />);
    expect(screen.getByText(/↘/)).toBeInTheDocument();
    // Check for red-400 class indicating negative trend
    const trendEl = screen.getByText(/↘/).closest('span');
    expect(trendEl).toHaveClass('text-red-400');
  });

  it('renders alert when provided', () => {
    render(<StatCard {...defaultProps} alert="Action required" />);
    expect(screen.getByText(/Action required/)).toBeInTheDocument();
  });

  it('applies hero size class', () => {
    const { container } = render(<StatCard {...defaultProps} size="hero" />);
    expect(container.innerHTML).toContain('p-8');
  });

  it('applies normal size by default', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    expect(container.innerHTML).toContain('p-5');
  });
});
