import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/SideBar';
import AppRoutes from './routes/AppRoutes';
import GetPageTitle from './utils/GetPageTitle';
import PageHeader from './components/PageHeader';
import { getFruits } from './api/Fruits';
import PageFooter from './components/PageFooter';

const App: React.FC = () => {
  const location = useLocation();
  const currentPage = GetPageTitle(location.pathname);

  const fetchApi = async () => {
    try {
      const fruits = await getFruits();
      console.log(fruits);
    } catch (error) {
      console.error('Error fetching fruits:', error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

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
        <PageFooter />
      </div>
    </div>
  );
};

export default App;
