import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await auth.fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password })
      });

      if (data.success) {
        auth.login(data.token, data.user);
        window.showToast('✅ Account registered successfully!', 'success');
        setTimeout(() => navigate('/'), 400);
      } else {
        window.showToast(data.message || 'Registration failed', 'danger');
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
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Join RailSmart for instant booking & AI features</p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '14px' }}>
            <label className="railsmart-label">Full Name</label>
            <input type="text" className="railsmart-input" placeholder="Rohan Sharma" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label className="railsmart-label">Email Address</label>
            <input type="email" className="railsmart-input" placeholder="rohan@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label className="railsmart-label">Phone Number</label>
            <input type="tel" className="railsmart-input" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="railsmart-label">Password</label>
            <input type="password" className="railsmart-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;