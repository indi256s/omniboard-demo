import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Report from '../pages/Report';

const renderReport = () => {
  return render(
    <MemoryRouter initialEntries={['/report']}>
      <Routes>
        <Route path="/report" element={<Report />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Report Page', () => {
  it('renders without crashing', () => {
    renderReport();
    expect(document.body).toBeInTheDocument();
  });

  it('displays Monthly Report title', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('Monthly Report')).toBeInTheDocument();
    });
  });

  it('renders month selector', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });
  });

  it('renders Velocity Analysis section', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('Velocity Analysis')).toBeInTheDocument();
    });
  });

  it('renders Cycle Time Breakdown section', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('Cycle Time Breakdown')).toBeInTheDocument();
    });
  });

  it('displays velocity metrics', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('Avg Velocity')).toBeInTheDocument();
      expect(screen.getByText('SP Completed')).toBeInTheDocument();
    });
  });

  it('displays cycle time metrics', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('Median')).toBeInTheDocument();
      expect(screen.getByText('Average')).toBeInTheDocument();
    });
  });

  it('shows By Issue Type breakdown', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('By Issue Type')).toBeInTheDocument();
      expect(screen.getByText('Bug')).toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Story')).toBeInTheDocument();
    });
  });

  it('shows By Stage breakdown', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('By Stage')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('Code Review')).toBeInTheDocument();
      expect(screen.getByText('QA')).toBeInTheDocument();
    });
  });

  it('displays insights', async () => {
    renderReport();
    await waitFor(() => {
      const insights = screen.getAllByText('Insight');
      expect(insights.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows bottleneck warning', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText(/Bottleneck/)).toBeInTheDocument();
    });
  });

  it('renders charts (SVG elements)', async () => {
    renderReport();
    await waitFor(() => {
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  it('has link back to Dashboard', async () => {
    renderReport();
    await waitFor(() => {
      expect(screen.getByText('← Dashboard')).toBeInTheDocument();
    });
  });

  it('renders sidebar', async () => {
    renderReport();
    await waitFor(() => {
      const sidebar = document.querySelector('aside');
      expect(sidebar).toBeInTheDocument();
    });
  });
});

describe('Report Month Selection', () => {
  it('allows changing month', async () => {
    renderReport();
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      fireEvent.change(select, { target: { value: '2025-12' } });
      expect(select.value).toBe('2025-12');
    });
  });

  it('displays multiple month options', async () => {
    renderReport();
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('Report Layout', () => {
  it('renders main layout structure', () => {
    renderReport();
    
    const sidebar = document.querySelector('aside');
    expect(sidebar).toBeInTheDocument();
    
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('renders footer', async () => {
    renderReport();
    await waitFor(() => {
      // Use getAllByText since ОМНИБОРД appears in sidebar and footer
      const elements = screen.getAllByText(/ОМНИБОРД/);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
  });
});
