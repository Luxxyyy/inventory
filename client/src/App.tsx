import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/SideBar';
import AppRoutes from './routes/AppRoutes';
import GetPageTitle from './utils/GetPageTitle';
import PageHeader from './components/PageHeader';
import PageFooter from './components/PageFooter';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const App: React.FC = () => {
  const location = useLocation();
 
  // Don't show sidebar, header, and footer on login page
  const isLoginPage = location.pathname === '/login';
  
  if (isLoginPage) {
    return (
      <AuthProvider>
        <div className="d-flex" style={{ height: '100vh' }}>
          <main
            className="bg-white text-dark main"
            style={{ flex: 1, overflowY: 'auto' }}
          >
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="d-flex" style={{ height: '100vh' }}>
        <ProtectedRoute>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <PageHeader />
            <main
              className="bg-white text-dark main"
              style={{ flex: 1, overflowY: 'auto' }}
            >
              <AppRoutes />
            </main>
            <PageFooter />
          </div>
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
};

export default App;
