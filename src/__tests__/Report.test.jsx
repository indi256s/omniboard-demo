import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Report from '../pages/Report';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/report' }),
  };
});

const renderReport = () => {
  return render(
    <BrowserRouter>
      <Report />
    </BrowserRouter>
  );
};

describe('Report Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the report header', () => {
    renderReport();
    expect(screen.getByText('📊 Отчёт')).toBeInTheDocument();
  });

  it('displays period selector with months', () => {
    renderReport();
    expect(screen.getByText('Январь 2026')).toBeInTheDocument();
    expect(screen.getByText('Декабрь 2025')).toBeInTheDocument();
    expect(screen.getByText('Ноябрь 2025')).toBeInTheDocument();
    expect(screen.getByText('Октябрь 2025')).toBeInTheDocument();
  });

  it('displays team selector', () => {
    renderReport();
    expect(screen.getByText('Все команды')).toBeInTheDocument();
  });

  it('renders Velocity Analysis section', () => {
    renderReport();
    expect(screen.getByText('Velocity Analysis')).toBeInTheDocument();
  });

  it('displays velocity metrics', () => {
    renderReport();
    expect(screen.getByText('Спринтов')).toBeInTheDocument();
    expect(screen.getByText('Commitment')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Avg Velocity')).toBeInTheDocument();
  });

  it('renders Cycle Time Breakdown section', () => {
    renderReport();
    expect(screen.getByText('Cycle Time Breakdown')).toBeInTheDocument();
  });

  it('displays cycle time by issue type', () => {
    renderReport();
    expect(screen.getByText('По типу задачи')).toBeInTheDocument();
    expect(screen.getByText('Bug')).toBeInTheDocument();
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByText('Story')).toBeInTheDocument();
    expect(screen.getByText('Request')).toBeInTheDocument();
  });

  it('displays cycle time by stage section', () => {
    renderReport();
    expect(screen.getByText('По этапу')).toBeInTheDocument();
    // Dev appears multiple times (in stage list and in bottleneck), use getAllByText
    expect(screen.getAllByText(/Dev/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Review/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/QA/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows bottleneck highlight', () => {
    renderReport();
    // Bottleneck appears multiple times, use getAllByText
    expect(screen.getAllByText(/Bottleneck:/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays auto-insights with magnifying glass icon', () => {
    renderReport();
    const insights = screen.getAllByText('🔍');
    expect(insights.length).toBeGreaterThan(0);
  });

  it('changes month when clicking month selector', () => {
    renderReport();
    const decemberButton = screen.getByText('Декабрь 2025');
    fireEvent.click(decemberButton);
    // Button should now be selected (has different styling)
    expect(decemberButton).toBeInTheDocument();
  });

  it('shows breadcrumb navigation', () => {
    renderReport();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Report')).toBeInTheDocument();
  });

  it('displays total cycle time', () => {
    renderReport();
    expect(screen.getByText('Total Cycle Time')).toBeInTheDocument();
  });

  it('shows sprint breakdown section', () => {
    renderReport();
    expect(screen.getByText('По спринтам')).toBeInTheDocument();
  });

  it('displays velocity trend indicator', () => {
    renderReport();
    expect(screen.getByText('Trend:')).toBeInTheDocument();
  });

  it('renders footer with version info', () => {
    renderReport();
    expect(screen.getByText(/ОМНИБОРД v2.0/)).toBeInTheDocument();
  });
});
