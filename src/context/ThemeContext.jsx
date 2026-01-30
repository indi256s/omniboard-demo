import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const getInitialTheme = () => {
  // Handle SSR/testing environments
  if (typeof window === 'undefined') return 'dark';
  
  try {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('omniboard-theme');
    if (stored) return stored;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch (e) {
    // localStorage might not be available in some environments
  }
  return 'dark';
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // Apply theme to document
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try {
      localStorage.setItem('omniboard-theme', theme);
    } catch (e) {
      // localStorage might not be available
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
