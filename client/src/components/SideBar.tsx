import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps { }

const Sidebar: React.FC<SidebarProps> = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={`text-white d-flex flex-column ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
            id="sideBar_Body"
            style={{
                width: collapsed ? '60px' : '220px',
                transition: 'width 0.3s ease',
                height: '100vh',
            }}
        >
            <div className="d-flex align-items-center justify-content-between border-bottom border-secondary" id='sidebar-top'>
                <h5 className="mb-0">{collapsed ? '' : 'Name'}</h5>
                <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            <nav className="flex-grow-1 px-2 py-3 bg-dark">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link to="/" className="nav-link text-white px-3 py-2 rounded hover-effect">
                            {collapsed ? '' : 'Dashboard'}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/list" className="nav-link text-white px-3 py-2 rounded hover-effect">
                            {collapsed ? '' : 'Lists'}
                        </Link>
                    </li>
                    <h5>{collapsed ? '' : 'Manage'}</h5> 
                    <li className="nav-item">
                        <Link to="/source" className="nav-link text-white px-3 py-2 rounded hover-effect">
                            {collapsed ? '' : 'Source'}
                        </Link>
                        <Link to="/balangay" className="nav-link text-white px-3 py-2 rounded hover-effect">
                            {collapsed ? '' : 'Balangay'}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/consumer" className="nav-link text-white px-3 py-2 rounded hover-effect">
                            {collapsed ? '' : 'Consumers'}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/logs" className="nav-link text-white px-3 py-2 rounded hover-effect">
                            {collapsed ? '' : 'Logs'}
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
