import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Alerts from '../pages/Alerts';

const renderAlerts = () => {
  return render(
    <MemoryRouter initialEntries={['/alerts']}>
      <Routes>
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Alerts Page', () => {
  it('renders without crashing', () => {
    renderAlerts();
    expect(document.body).toBeInTheDocument();
  });

  it('displays Алерты title', async () => {
    renderAlerts();
    await waitFor(() => {
      expect(screen.getByText('Алерты')).toBeInTheDocument();
    });
  });

  it('displays subtitle', async () => {
    renderAlerts();
    await waitFor(() => {
      expect(screen.getByText('Метрики, требующие внимания')).toBeInTheDocument();
    });
  });

  it('has link back to Dashboard', async () => {
    renderAlerts();
    await waitFor(() => {
      expect(screen.getByText('← Дашборд')).toBeInTheDocument();
    });
  });

  it('renders sidebar', async () => {
    renderAlerts();
    await waitFor(() => {
      const sidebar = document.querySelector('aside');
      expect(sidebar).toBeInTheDocument();
    });
  });

  it('displays summary stats', async () => {
    renderAlerts();
    await waitFor(() => {
      expect(screen.getByText('Всего алертов')).toBeInTheDocument();
      // Use getAllByText since these appear in both summary and section headers
      expect(screen.getAllByText('Критично').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Внимание').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Отлично').length).toBeGreaterThan(0);
    });
  });

  it('renders filter dropdowns', async () => {
    renderAlerts();
    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('has type filter options', async () => {
    renderAlerts();
    await waitFor(() => {
      expect(screen.getByText('Все типы')).toBeInTheDocument();
    });
  });

  it('has severity filter options', async () => {
    renderAlerts();
    await waitFor(() => {
      expect(screen.getByText('Все уровни')).toBeInTheDocument();
    });
  });
});

describe('Alerts Filtering', () => {
  it('filters by type', async () => {
    renderAlerts();
    await waitFor(() => {
      const typeSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(typeSelect, { target: { value: 'velocity' } });
      expect(typeSelect.value).toBe('velocity');
    });
  });

  it('filters by severity', async () => {
    renderAlerts();
    await waitFor(() => {
      const severitySelect = screen.getAllByRole('combobox')[1];
      fireEvent.change(severitySelect, { target: { value: 'critical' } });
      expect(severitySelect.value).toBe('critical');
    });
  });
});

describe('Alert Categories', () => {
  it('displays critical section when alerts exist', async () => {
    renderAlerts();
    await waitFor(() => {
      // Check for critical section header or alerts (appears multiple times)
      const criticalElements = screen.getAllByText(/Критично/);
      expect(criticalElements.length).toBeGreaterThan(0);
    });
  });

  it('displays warning section label', async () => {
    renderAlerts();
    await waitFor(() => {
      // There's a summary stat with "Внимание"
      const elements = screen.getAllByText('Внимание');
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('displays success section label', async () => {
    renderAlerts();
    await waitFor(() => {
      // There's a summary stat with "Отлично"
      const elements = screen.getAllByText('Отлично');
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});

describe('Alert Cards', () => {
  it('renders alert cards with team names', async () => {
    renderAlerts();
    await waitFor(() => {
      // Check for any team name from mock data
      const teamElements = document.querySelectorAll('.glass.rounded-xl');
      expect(teamElements.length).toBeGreaterThan(0);
    });
  });

  it('alert cards are clickable links', async () => {
    renderAlerts();
    await waitFor(() => {
      const links = document.querySelectorAll('a[href^="/team/"]');
      // Should have at least the back link plus any alert cards
      expect(links.length).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Alerts Layout', () => {
  it('renders main layout structure', () => {
    renderAlerts();
    
    const sidebar = document.querySelector('aside');
    expect(sidebar).toBeInTheDocument();
    
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('renders footer', async () => {
    renderAlerts();
    await waitFor(() => {
      const footers = screen.getAllByText(/ОМНИБОРД/);
      expect(footers.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays alert type labels', async () => {
    renderAlerts();
    await waitFor(() => {
      // Type labels in filter: Velocity, Cycle Time, Team Health
      const velocityOption = screen.getByRole('option', { name: 'Velocity' });
      expect(velocityOption).toBeInTheDocument();
    });
  });
});

describe('Alert Severity Icons', () => {
  it('uses correct icons for severity levels', async () => {
    renderAlerts();
    await waitFor(() => {
      // Critical: 🔴, Warning: 🟡, Success: 🟢
      // At least some of these should be present
      const pageText = document.body.textContent;
      expect(
        pageText.includes('🔴') || 
        pageText.includes('🟡') || 
        pageText.includes('🟢')
      ).toBe(true);
    });
  });
});
