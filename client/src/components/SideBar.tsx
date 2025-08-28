import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps { }

const Sidebar: React.FC<SidebarProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div
      className={`text-white d-flex flex-column ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      id="sideBar_Body"
      style={{
        width: collapsed ? '60px' : '300px',
        transition: 'width 0.3s ease',
        height: '100vh',
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center border-bottom border-secondary px-3 py-2"
        id="sidebar-top"
      >
        {!collapsed && user ? (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.6 }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.username}</span>
            <span style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '2px' }}>{user.role}</span>
          </div>
        ) : (
          <h5 className="mb-0">{collapsed ? '' : 'Name'}</h5>
        )}

        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          style={{ minWidth: '30px' }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="flex-grow-1 px-2 py-3 bg-dark">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className="nav-link modern-link">
              {collapsed ? '' : 'Dashboard'}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/list" className="nav-link modern-link">
              {collapsed ? '' : 'Lists'}
            </Link>
          </li>
          <h5>{collapsed ? '' : 'Manage'}</h5>
          <li className="nav-item">
            <Link to="/source" className="nav-link modern-link">
              {collapsed ? '' : 'Source'}
            </Link>
            <Link to="/balangay" className="nav-link modern-link">
              {collapsed ? '' : 'Balangay'}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/purok" className="nav-link modern-link">
              {collapsed ? '' : 'Purok'}
            </Link>
          </li>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <li className="nav-item">
              <>
                <Link to="/add-user" className="nav-link modern-link">
                  {collapsed ? '' : 'Add User'}
                </Link>
              </>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
