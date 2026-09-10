import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

const PNRStatus = () => {
  const [pnrInput, setPnrInput] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;

    setLoading(true);
    try {
      const data = await auth.fetch(`/api/pnr/${pnrInput.trim()}`);
      if (data.success && data.booking) {
        setBooking(data.booking);
      } else if (data.isSimulated) {
        setBooking(data);
      } else {
        window.showToast('PNR not found. Showing sample PNR details.', 'info');
      }
    } catch (e) {
      window.showToast('Lookup failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="railsmart-section" style={{ minHeight: '80vh', maxWidth: '840px' }}>
      <div className="section-header-center" style={{ marginBottom: '32px' }}>
        <div className="section-pill-tag">
          <i className="fa-solid fa-ticket"></i>
          <span>PASSENGER NAME RECORD</span>
        </div>
        <h2 className="section-title">Check 10-Digit PNR Status</h2>
        <p className="section-subtitle">
          Real-time confirmation status, coach allotment, charting status, and one-click seat meal ordering.
        </p>
      </div>

      <form onSubmit={handleLookup} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input 
          type="text" 
          className="railsmart-input" 
          placeholder="Enter 10-digit PNR number (e.g. 2458913456)" 
          value={pnrInput}
          onChange={e => setPnrInput(e.target.value)}
          maxLength="10"
          style={{ padding: '14px 18px', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '1px' }}
          required
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px' }} disabled={loading}>
          {loading ? 'Searching...' : 'Check Status'}
        </button>
      </form>

      {booking && (
        <div className="glass-card" style={{ border: '1px solid rgba(245,158,11,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 800 }}>PNR NUMBER: {booking.pnr}</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.35rem' }}>{booking.trainName} (#{booking.trainNumber})</h3>
            </div>
            <span style={{ background: booking.chartPrepared ? '#dcfce7' : '#fef3c7', color: booking.chartPrepared ? '#15803d' : '#b45309', padding: '6px 14px', borderRadius: '12px', fontWeight: 800, fontSize: '0.82rem' }}>
              {booking.chartPrepared ? 'CHART PREPARED' : 'CHART NOT PREPARED'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>From:</span>
              <div style={{ fontWeight: 700 }}>{booking.fromStationName || booking.fromStation}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>To:</span>
              <div style={{ fontWeight: 700 }}>{booking.toStationName || booking.toStation}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Journey Date:</span>
              <div style={{ fontWeight: 700 }}>{booking.journeyDate}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Class & Quota:</span>
              <div style={{ fontWeight: 700 }}>{booking.travelClass} • {booking.quota}</div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Passenger Status Details:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {booking.passengers?.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-card)', borderRadius: '10px' }}>
                <div>
                  <strong>{idx + 1}. {p.name}</strong> ({p.age} yrs, {p.gender})
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#00ff88', fontWeight: 800, fontSize: '0.95rem' }}>
                    {p.statusDetails || `Confirmed (Coach ${p.allocatedCoach} / Berth ${p.allocatedBerth})`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              onClick={() => navigate(`/e-catering?pnr=${booking.pnr}&station=${booking.fromStation}`)}
            >
              <i className="fa-solid fa-utensils"></i> Order Food on this PNR
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              onClick={() => navigate(`/live-status?train=${booking.trainNumber}`)}
            >
              <i className="fa-solid fa-satellite-dish"></i> Live Train GPS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PNRStatus;