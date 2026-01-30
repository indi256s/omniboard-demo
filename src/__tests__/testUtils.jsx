import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';

// Wrapper with BrowserRouter and ThemeProvider
export function AllProviders({ children }) {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Wrapper with MemoryRouter and ThemeProvider (for route testing)
export function MemoryProviders({ children, initialEntries = ['/'] }) {
  return (
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </ThemeProvider>
  );
}

// Just ThemeProvider wrapper
export function ThemeWrapper({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
