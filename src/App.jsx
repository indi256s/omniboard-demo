import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/team/DISRUPT" replace />} />
        <Route path="/team/:teamKey" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
