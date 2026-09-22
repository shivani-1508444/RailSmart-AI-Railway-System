import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import auth from '../utils/auth';
import { getTranslation } from '../i18n/i18n';

const Navbar = ({ lang, setLang, openVoiceModal }) => {
  const [user, setUser] = useState(auth.getUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('railsmart_theme') || 'light');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const syncUser = () => setUser(auth.getUser());
    window.addEventListener('railsmart-auth-change', syncUser);
    document.documentElement.setAttribute('data-theme', theme);
    return () => window.removeEventListener('railsmart-auth-change', syncUser);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('railsmart_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    auth.logout(false);
    setUser(null);
    if (window.showToast) window.showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <>
      {/* Top Status Announcement Bar */}
      <div className="railsmart-topbar">
        <div className="railsmart-topbar-left">
          <div className="railsmart-live-badge">
            <span className="railsmart-live-pulse"></span>
            <span>Indian Railways Network Active • Live GPS & IRCTC Sync</span>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            <i className="fa-solid fa-headset" style={{ color: 'var(--primary-color)', marginRight: '6px' }}></i>
            {getTranslation(lang, 'helpline')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            className="btn-lang-switch"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
          
          <button 
            className="btn-lang-switch"
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            title="Switch Language"
          >
            <i className="fa-solid fa-language"></i>
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="railsmart-header">
        <div className="railsmart-nav-container">
          {/* Logo */}
          <Link to="/" className="railsmart-logo-link">
            <div className="railsmart-logo-badge">🚆</div>
            <div className="railsmart-logo-text">
              <span className="logo-rail">Rail</span>
              <span className="logo-smart">Smart</span>
            </div>
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          {/* Nav Menu */}
          <ul className={`railsmart-nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <Link to="/" className={`railsmart-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <i className="fa-solid fa-house"></i>
                <span>{getTranslation(lang, 'home')}</span>
              </Link>
            </li>
            <li>
              <Link to="/trains" className={`railsmart-nav-link ${location.pathname === '/trains' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--primary-color)' }}></i>
                <span>{getTranslation(lang, 'trainSearch')}</span>
              </Link>
            </li>
            <li>
              <Link to="/pnr" className={`railsmart-nav-link ${location.pathname === '/pnr' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <i className="fa-solid fa-ticket" style={{ color: '#38bdf8' }}></i>
                <span>{getTranslation(lang, 'pnrStatus')}</span>
              </Link>
            </li>
            <li>
              <Link to="/live-status" className={`railsmart-nav-link ${location.pathname === '/live-status' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <i className="fa-solid fa-satellite-dish" style={{ color: '#00ff88' }}></i>
                <span>{getTranslation(lang, 'liveStatus')}</span>
              </Link>
            </li>
            <li>
              <Link to="/e-catering" className={`railsmart-nav-link ${location.pathname === '/e-catering' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <i className="fa-solid fa-utensils" style={{ color: '#f59e0b' }}></i>
                <span>{getTranslation(lang, 'eCatering')}</span>
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/dashboard" className={`railsmart-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <i className="fa-solid fa-gauge-high"></i>
                  <span>{user.role === 'admin' ? 'Admin Center' : getTranslation(lang, 'dashboard')}</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Right Action Controls */}
          <div className="railsmart-nav-right">
            {/* Voice Search Trigger */}
            <button 
              className="btn-voice-nav" 
              onClick={openVoiceModal}
              title="Voice Search (Speak destination)"
              aria-label="Voice Search"
            >
              <i className="fa-solid fa-microphone"></i>
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="user-nav-chip">
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="user-nav-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{user?.name?.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase' }}>{user?.role}</span>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  style={{ color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer' }}
                  title="Logout"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="railsmart-btn-login">
                <span>{getTranslation(lang, 'login')}</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
