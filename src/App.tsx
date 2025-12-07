import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MedecinDashboard from './pages/medecin/MedecinDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import LaboratoireDashboard from './pages/laboratoire/LaboratoireDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role-based dashboards */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/medecin/dashboard" element={<MedecinDashboard />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/laboratoire/dashboard" element={<LaboratoireDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;