import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Report from './pages/Report';
import DisruptMetrics from './pages/DisruptMetrics';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/team/ALL" replace />} />
          <Route path="/team/:teamKey" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/report" element={<Report />} />
          <Route path="/disrupt_metrics" element={<DisruptMetrics />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
