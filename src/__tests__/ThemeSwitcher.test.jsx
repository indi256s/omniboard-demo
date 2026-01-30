import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

// Helper to render with ThemeProvider
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

// Test component to check theme value
function ThemeDisplay() {
  const { theme } = useTheme();
  return <span data-testid="theme-value">{theme}</span>;
}

describe('ThemeSwitcher Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders without crashing', () => {
    renderWithTheme(<ThemeSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows "Light mode" text when in dark theme', () => {
    renderWithTheme(<ThemeSwitcher />);
    expect(screen.getByText('Light mode')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    renderWithTheme(
      <>
        <ThemeSwitcher />
        <ThemeDisplay />
      </>
    );
    
    // Initially dark
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    
    // Click to toggle
    fireEvent.click(screen.getByRole('button'));
    
    // Now light
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('toggles back to dark when clicked twice', () => {
    renderWithTheme(
      <>
        <ThemeSwitcher />
        <ThemeDisplay />
      </>
    );
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('renders in collapsed mode', () => {
    renderWithTheme(<ThemeSwitcher collapsed={true} />);
    // In collapsed mode, text should not be visible
    expect(screen.queryByText('Light mode')).not.toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    renderWithTheme(<ThemeSwitcher />);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });
});

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to dark theme', () => {
    renderWithTheme(<ThemeDisplay />);
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('persists theme to localStorage', () => {
    renderWithTheme(<ThemeSwitcher />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(localStorage.getItem('omniboard-theme')).toBe('light');
  });

  it('reads theme from localStorage', () => {
    localStorage.setItem('omniboard-theme', 'light');
    
    renderWithTheme(<ThemeDisplay />);
    
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('sets data-theme attribute on document', () => {
    renderWithTheme(<ThemeSwitcher />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
