import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DisruptMetrics from '../pages/DisruptMetrics';
import T2MGauge from '../components/T2MGauge';
import WaitTimeChart from '../components/WaitTimeChart';
import OwnershipRing from '../components/OwnershipRing';
import DisruptTrendChart from '../components/DisruptTrendChart';
import SolutionsList from '../components/SolutionsList';
import { disruptMetrics, solutionTypes } from '../data/disruptData';

// Wrapper for components that need router context
const RouterWrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/disrupt_metrics']}>
    {children}
  </MemoryRouter>
);

describe('DisruptMetrics Page', () => {
  it('renders the page header', () => {
    render(<DisruptMetrics />, { wrapper: RouterWrapper });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Disrupt Metrics');
  });

  it('renders all three metric sections', () => {
    render(<DisruptMetrics />, { wrapper: RouterWrapper });
    expect(screen.getByText('Time to Market')).toBeInTheDocument();
    expect(screen.getByText('Wait Time Ratio')).toBeInTheDocument();
    expect(screen.getByText('Solution Ownership Rate')).toBeInTheDocument();
  });

  it('renders the trend chart section', () => {
    render(<DisruptMetrics />, { wrapper: RouterWrapper });
    expect(screen.getByText('6-Sprint Trend')).toBeInTheDocument();
  });

  it('renders the solutions list section', () => {
    render(<DisruptMetrics />, { wrapper: RouterWrapper });
    expect(screen.getByText('Recent Solutions')).toBeInTheDocument();
  });

  it('displays the team badge', () => {
    render(<DisruptMetrics />, { wrapper: RouterWrapper });
    // There are multiple "Disrupt" texts (sidebar + badge), use getAllByText
    expect(screen.getAllByText('Disrupt').length).toBeGreaterThanOrEqual(1);
  });

  it('displays the current period', () => {
    render(<DisruptMetrics />, { wrapper: RouterWrapper });
    expect(screen.getByText(/MEDIAN 26-06/)).toBeInTheDocument();
  });
});

describe('T2MGauge Component', () => {
  it('renders current value', () => {
    render(<T2MGauge current={14} target={12} max={30} />);
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('days')).toBeInTheDocument();
  });

  it('renders target value', () => {
    render(<T2MGauge current={14} target={12} max={30} />);
    expect(screen.getByText('Target: 12d')).toBeInTheDocument();
  });

  it('renders min and max labels', () => {
    render(<T2MGauge current={14} target={12} max={30} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });
});

describe('WaitTimeChart Component', () => {
  const mockData = {
    ratio: 18,
    target: 15,
    bySource: [
      { team: 'Backend', pct: 8, hours: 24, color: '#ef4444' },
      { team: 'Design', pct: 5, hours: 15, color: '#f97316' }
    ]
  };

  it('renders the ratio value', () => {
    render(<WaitTimeChart {...mockData} />);
    expect(screen.getByText('18% blocked')).toBeInTheDocument();
  });

  it('renders flow percentage', () => {
    render(<WaitTimeChart {...mockData} />);
    expect(screen.getByText('82% flowing')).toBeInTheDocument();
  });

  it('renders target info', () => {
    render(<WaitTimeChart {...mockData} />);
    expect(screen.getByText(/Target: ≤15% blocked/)).toBeInTheDocument();
  });

  it('renders breakdown by team', () => {
    render(<WaitTimeChart {...mockData} />);
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('shows over target indicator when above target', () => {
    render(<WaitTimeChart {...mockData} />);
    expect(screen.getByText(/3% over target/)).toBeInTheDocument();
  });
});

describe('OwnershipRing Component', () => {
  it('renders the rate value', () => {
    render(<OwnershipRing rate={87} baseline={80} />);
    expect(screen.getByText('87%')).toBeInTheDocument();
  });
});

describe('DisruptTrendChart Component', () => {
  const mockSprints = [
    { name: 'MEDIAN 26-01', t2m: 22, waitRatio: 32, ownership: 75 },
    { name: 'MEDIAN 26-02', t2m: 19, waitRatio: 28, ownership: 78 }
  ];

  it('renders without crashing', () => {
    const { container } = render(<DisruptTrendChart sprints={mockSprints} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});

describe('SolutionsList Component', () => {
  const mockSolutions = [
    { 
      constraint: 'Backend API delayed', 
      solution: 'Client-side caching', 
      type: 'cache',
      impact: 'Shipped on time'
    },
    { 
      constraint: 'Design specs not finalized', 
      solution: 'Feature flag', 
      type: 'flag',
      impact: 'Unblocked 3 devs'
    }
  ];

  it('renders all solutions', () => {
    render(<SolutionsList solutions={mockSolutions} />);
    expect(screen.getByText('Backend API delayed')).toBeInTheDocument();
    expect(screen.getByText('Design specs not finalized')).toBeInTheDocument();
  });

  it('renders solution descriptions', () => {
    render(<SolutionsList solutions={mockSolutions} />);
    expect(screen.getByText('Client-side caching')).toBeInTheDocument();
    expect(screen.getByText('Feature flag')).toBeInTheDocument();
  });

  it('renders type badges', () => {
    render(<SolutionsList solutions={mockSolutions} />);
    expect(screen.getByText('Caching')).toBeInTheDocument();
    expect(screen.getByText('Feature Flag')).toBeInTheDocument();
  });

  it('renders impact text', () => {
    render(<SolutionsList solutions={mockSolutions} />);
    expect(screen.getByText('Shipped on time')).toBeInTheDocument();
    expect(screen.getByText('Unblocked 3 devs')).toBeInTheDocument();
  });
});

describe('disruptData', () => {
  it('has valid T2M data', () => {
    expect(disruptMetrics.t2m.current).toBeGreaterThan(0);
    expect(disruptMetrics.t2m.target).toBeGreaterThan(0);
    expect(disruptMetrics.t2m.trend).toHaveLength(6);
  });

  it('has valid wait time data', () => {
    expect(disruptMetrics.waitTime.ratio).toBeGreaterThanOrEqual(0);
    expect(disruptMetrics.waitTime.ratio).toBeLessThanOrEqual(100);
    expect(disruptMetrics.waitTime.bySource.length).toBeGreaterThan(0);
  });

  it('has valid ownership data', () => {
    expect(disruptMetrics.ownership.rate).toBeGreaterThanOrEqual(0);
    expect(disruptMetrics.ownership.rate).toBeLessThanOrEqual(100);
    expect(disruptMetrics.ownership.baseline).toBe(80);
  });

  it('has valid sprints data', () => {
    expect(disruptMetrics.sprints).toHaveLength(6);
    disruptMetrics.sprints.forEach(sprint => {
      expect(sprint).toHaveProperty('name');
      expect(sprint).toHaveProperty('t2m');
      expect(sprint).toHaveProperty('waitRatio');
      expect(sprint).toHaveProperty('ownership');
    });
  });

  it('has solution types defined', () => {
    expect(solutionTypes).toHaveProperty('cache');
    expect(solutionTypes).toHaveProperty('flag');
    expect(solutionTypes).toHaveProperty('optimization');
    expect(solutionTypes).toHaveProperty('degradation');
  });
});
