import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await auth.fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (data.success) {
        auth.login(data.token, data.user);
        window.showToast('✅ Login successful! Redirecting...', 'success');
        setTimeout(() => navigate('/'), 400);
      } else {
        window.showToast(data.message || 'Invalid credentials', 'danger');
      }
    } catch (e) {
      window.showToast('Network error', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🚆</div>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Login to your RailSmart passenger account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label className="railsmart-label">Email Address</label>
            <input type="email" className="railsmart-input" placeholder="user@railsmart.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="railsmart-label">Password</label>
            <input type="password" className="railsmart-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Quick Demo Login */}
        <div style={{ marginTop: '24px', padding: '14px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed rgba(245,158,11,0.4)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase' }}>⚡ 1-Click Quick Demo Login</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
              onClick={() => { setEmail('user@railsmart.com'); setPassword('user123'); }}
            >
              👤 Passenger
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ flex: 1, fontSize: '0.8rem', padding: '8px', borderColor: 'var(--primary-color)' }}
              onClick={() => { setEmail('admin@railsmart.com'); setPassword('admin123'); }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;