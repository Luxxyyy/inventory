import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/SideBar';
import AppRoutes from './routes/AppRoutes';
import GetPageTitle from './utils/GetPageTitle';
import PageHeader from './components/PageHeader';

const App: React.FC = () => {
  const location = useLocation();
  const currentPage = GetPageTitle(location.pathname);

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageHeader />
        <main
          className="bg-white text-dark p-4"
          style={{ flex: 1, overflowY: 'auto' }}
        >
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default App;
