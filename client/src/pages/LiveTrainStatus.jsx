import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import auth from '../utils/auth';

const LiveTrainStatus = () => {
  const [searchParams] = useSearchParams();
  const initialTrain = searchParams.get('train') || '22436';
  const [trainQuery, setTrainQuery] = useState(initialTrain);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchLiveStatus = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await auth.fetch(`/api/trains/${query}/status`);
      if (data.success && data.liveStatus) {
        setLiveData(data.liveStatus);
      } else {
        setError('Train not found. Please check the train number and try again.');
        window.showToast('Train not found', 'warning');
      }
    } catch (e) {
      setError('Server connection failed. Please make sure the server is running.');
      window.showToast('Failed to load status', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStatus(trainQuery);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trainQuery.trim()) fetchLiveStatus(trainQuery.trim());
  };

  return (
    <div className="railsmart-section" style={{ minHeight: '80vh', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '30px' }}>
        <div className="section-pill-tag">
          <i className="fa-solid fa-satellite-dish"></i>
          <span>GPS RADAR TRACKING</span>
        </div>
        <h2 className="section-title">Live Train Running Status</h2>
        <p className="section-subtitle">Real-time GPS coordinates, upcoming stations, and delay estimates.</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
        <input 
          type="text" 
          className="railsmart-input" 
          placeholder="Enter Train Number (e.g. 22436 or 12952)" 
          value={trainQuery} 
          onChange={e => setTrainQuery(e.target.value)} 
          style={{ padding: '14px 18px', fontSize: '1rem', fontWeight: 700 }}
          required 
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px' }} disabled={loading}>
          {loading ? 'Tracking...' : 'Track Train'}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <i className="fa-solid fa-satellite-dish fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'block' }}></i>
          Fetching live GPS data...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '30px', borderLeft: '4px solid var(--danger-color)' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.5rem', color: 'var(--danger-color)', marginBottom: '10px', display: 'block' }}></i>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{error}</p>
        </div>
      )}

      {liveData && !loading && (
        <div className="glass-card">
          {/* Status Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{liveData.trainName} (#{liveData.trainNumber})</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Speed: <strong>{liveData.speedKmh} km/h</strong> • Platform: <strong>#{liveData.platform}</strong></span>
            </div>

            <span style={{ background: liveData.delayMinutes === 0 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: liveData.delayMinutes === 0 ? '#00ff88' : 'var(--primary-color)', border: `1px solid ${liveData.delayMinutes === 0 ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`, padding: '6px 16px', borderRadius: '20px', fontWeight: 800 }}>
              {liveData.status}
            </span>
          </div>

          {/* Interactive Station Timeline */}
          <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Station Route Timeline:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '20px' }}>
            <div style={{ position: 'absolute', left: '26px', top: '15px', bottom: '15px', width: '3px', background: 'var(--border-color)' }}></div>

            {liveData.stationsTimeline?.map((st, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: st.isCurrent ? '#00ff88' : st.isPassed ? 'var(--primary-color)' : '#64748b',
                  boxShadow: st.isCurrent ? '0 0 12px #00ff88' : 'none',
                  flexShrink: 0
                }}></div>

                <div style={{ flex: 1, padding: '12px 18px', background: st.isCurrent ? 'rgba(0,255,136,0.1)' : 'var(--bg-secondary)', border: `1px solid ${st.isCurrent ? '#00ff88' : 'var(--border-color)'}`, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{st.stationName} ({st.stationCode})</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Platform #{st.platform || 1} • {st.distanceKm} km</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>Arr: {st.scheduledArrival}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Dep: {st.scheduledDeparture}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrainStatus;