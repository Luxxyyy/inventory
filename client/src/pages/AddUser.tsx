import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const UserCreate: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAdmin } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await authService.register(form);
      setSuccess('User successfully created!');
      setForm({ username: '', email: '', password: '', role: 'user' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  if (!isAdmin) return <p>Access Denied</p>;

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: '600px' }}>
      <h2>Create New User</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create User
        </button>
      </form>
    </div>
  );
};

export default UserCreate;
