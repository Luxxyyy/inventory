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

  return (
    <>
      <div
        className="dashboard-summary"
        style={{ display: 'flex', gap: 20, padding: 20, flexWrap: 'wrap' }}
      >
        {[
          { count: sources.length, icon: <FaFaucet size={32} />, label: 'Sources' },
          { count: balangays.length, icon: <FaMapMarkerAlt size={32} />, label: 'Balangays' },
          { count: puroks.length, icon: <FaMapPin size={32} />, label: 'Puroks' },
          { count: users.length, icon: <FiUserPlus size={32} />, label: 'Users' },
        ].map(({ count, icon, label }) => (
          <div
            key={label}
            className="summary-card"
            style={{
              flex: '1 1 200px',
              padding: 20,
              backgroundColor:
                label === 'Sources'
                  ? '#f0f0f0'
                  : label === 'Balangays'
                  ? '#e0f7fa'
                  : label === 'Puroks'
                  ? '#fff3e0'
                  : '#e8f5e9',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              minWidth: 180,
            }}
          >
            {icon}
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{count}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>

      <div
        className="dashboard-data-lists"
        style={{
          display: 'flex',
          gap: 20,
          padding: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { items: getSortedSources(), label: 'Sources' },
          { items: getSortedBalangays(), label: 'Balangays' },
          { items: getSortedPuroks(), label: 'Puroks' },
          { items: getSortedUsers(), label: 'Users' },
        ].map(({ items, label }) => (
          <div
            key={label}
            style={{
              flex: '1 1 220px',
              minHeight: 400,
              maxHeight: 400,
              overflowX: 'hidden',
              overflowY: 'auto',
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              padding: 15,
              minWidth: 200,
            }}
            aria-label={`${label} alphabetical list`}
          >
            <h5
              style={{
                marginBottom: 12,
                textAlign: 'center',
                borderBottom: '1px solid #ddd',
                paddingBottom: 6,
              }}
            >
              {label}
            </h5>
            {items.length > 0 ? (
              <ul
                style={{
                  listStyle: 'none',
                  paddingLeft: 0,
                  margin: 0,
                  fontSize: 14,
                  color: '#444',
                }}
              >
                {items.map((name, idx) => (
                  <li key={idx} style={{ padding: '2px 0' }}>
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontStyle: 'italic', color: '#999', textAlign: 'center' }}>
                No data
              </p>
            )}
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ListGroup;
