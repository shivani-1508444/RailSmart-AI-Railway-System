import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '60px 32px 30px', marginTop: '60px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--primary-gradient)', color: '#000', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>🚆</div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-primary)' }}>Rail<span style={{ color: 'var(--primary-color)' }}>Smart</span></span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Next-generation AI-powered smart train reservation, live PNR tracking, waitlist confirmation prediction, and seat-delivery e-catering.
          </p>
        </div>

        {/* Railway Services */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>Railway Services</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/trains">Vande Bharat Express</Link></li>
            <li><Link to="/trains">Rajdhani & Tejas Booking</Link></li>
            <li><Link to="/pnr">10-Digit PNR Status</Link></li>
            <li><Link to="/live-status">Live GPS Train Running</Link></li>
            <li><Link to="/e-catering">e-Catering Meals</Link></li>
          </ul>
        </div>

        {/* AI & Smart Tools */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>AI & Smart Tools</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li><a href="#railbot">RailBot AI Assistant</a></li>
            <li><Link to="/trains">Waitlist Confirmation Estimator</Link></li>
            <li><Link to="/dashboard">Journey Reminders</Link></li>
            <li><Link to="/dashboard">Security Login Alerts</Link></li>
            <li><Link to="/dashboard">Instant Refund Tracker</Link></li>
          </ul>
        </div>

        {/* Emergency & Support */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>24/7 Helpline</h4>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              <i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i> 139
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>All-India Railway Passenger Helpline (Security, Medical, PNR, Catering).</p>
          </div>
        </div>

      </div>

      <div style={{ maxWidth: '1320px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap', gap: '12px' }}>
        <div>&copy; {new Date().getFullYear()} RailSmart. Engineered for Modern Indian Railways Travel.</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#terms">Terms of Service</a>
          <span>•</span>
          <a href="#privacy">Privacy Policy</a>
          <span>•</span>
          <a href="#irctc">IRCTC Guidelines</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;