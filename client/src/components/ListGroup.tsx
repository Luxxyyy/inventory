import React, { useEffect, useState } from 'react';
import http from '../api/http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaFaucet, FaMapMarkerAlt, FaMapPin } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';

const ListGroup: React.FC = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [balangays, setBalangays] = useState<any[]>([]);
  const [puroks, setPuroks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sourcesRes, balangaysRes, puroksRes, usersRes] = await Promise.all([
        http.get('/sources'),
        http.get('/balangays'),
        http.get('/puroks'),
        http.get('/users'),
      ]);
      setSources(Array.isArray(sourcesRes.data) ? sourcesRes.data : []);
      setBalangays(Array.isArray(balangaysRes.data) ? balangaysRes.data : []);
      setPuroks(Array.isArray(puroksRes.data) ? puroksRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      toast.error('⚠️ Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard summary...</p>;

  if (error) return <div className="alert alert-danger">{error}</div>;

  const getSortedSources = () =>
    sources
      .map((item) => item.source || 'Unknown')
      .sort((a, b) => a.localeCompare(b));

  const getSortedBalangays = () =>
    balangays
      .map((item) => item.balangay || 'Unknown')
      .sort((a, b) => a.localeCompare(b));

  const getSortedPuroks = () =>
    puroks
      .map((item) => item.purok || 'Unknown')
      .sort((a, b) => a.localeCompare(b));

  const getSortedUsers = () =>
    users
      .map((item) => item.username || 'Unknown')
      .sort((a, b) => a.localeCompare(b));

  const cardsData = [
    { count: sources.length, icon: <FaFaucet />, label: 'Sources', color: 'primary' },
    { count: balangays.length, icon: <FaMapMarkerAlt />, label: 'Balangays', color: 'info' },
    { count: puroks.length, icon: <FaMapPin />, label: 'Puroks', color: 'warning' },
    { count: users.length, icon: <FiUserPlus />, label: 'Users', color: 'success' },
  ];

  const listsData = [
    { items: getSortedSources(), label: 'Sources' },
    { items: getSortedBalangays(), label: 'Balangays' },
    { items: getSortedPuroks(), label: 'Puroks' },
    { items: getSortedUsers(), label: 'Users' },
  ];

  return (
    <>
      <style>
        {`
          .card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .list-group-item:hover {
            background-color: #007bff; /* Bootstrap primary blue */
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}
      </style>

      <div className="container my-4">
        {/* Summary cards */}
        <div className="row g-4 justify-content-center">
          {cardsData.map(({ count, icon, label, color }) => (
            <div key={label} className="col-6 col-md-3">
              <div className={`card text-center border-${color} shadow-sm h-100`}>
                <div className={`card-body text-${color}`}>
                  <div className="mb-3" style={{ fontSize: '2.5rem' }}>
                    {icon}
                  </div>
                  <h2 className="card-title fw-bold">{count}</h2>
                  <p className="card-text">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lists */}
        <div className="row mt-5 g-4 justify-content-center">
          {listsData.map(({ items, label }) => (
            <div key={label} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light text-center">
                  <h5 className="mb-0">{label}</h5>
                </div>
                <div
                  className="card-body overflow-auto"
                  style={{ maxHeight: '300px', padding: '0.75rem 1.25rem' }}
                  aria-label={`${label} alphabetical list`}
                >
                  {items.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {items.map((name, idx) => (
                        <li key={idx} className="list-group-item py-1">
                          {name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted fst-italic text-center my-3">No data</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ListGroup;
