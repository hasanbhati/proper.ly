import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import MaintenanceDetail from './pages/MaintenanceDetail';
import Announcements from './pages/Announcements';
import Contracts from './pages/Contracts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useStore from './store';
import useAuthStore from './store/auth';
import { useEffect } from 'react';

const AppTitle: React.FC = () => {
  const companyName = useStore(state => state.companyName);
  
  useEffect(() => {
    document.title = `Property Management Application - ${companyName}`;
  }, [companyName]);

  return null;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <AppTitle />
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="maintenance/:id" element={<MaintenanceDetail />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* Catch-all route */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;