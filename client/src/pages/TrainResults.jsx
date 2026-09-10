import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import auth from '../utils/auth';
import ConfirmationPredictorModal from '../components/ConfirmationPredictorModal';

const TrainResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || 'NDLS';
  const to = searchParams.get('to') || 'BSB';
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const selectedClass = searchParams.get('class') || 'ALL';
  const selectedQuota = searchParams.get('quota') || 'GENERAL';

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [filterAC, setFilterAC] = useState(false);
  const [predictorOpen, setPredictorOpen] = useState(false);
  const [predictTarget, setPredictTarget] = useState({ status: 'WL 14', classCode: '3A' });

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    auth.fetch(`/api/trains/search?from=${from}&to=${to}&date=${date}&class=${selectedClass}&quota=${selectedQuota}`).then(res => {
      if (res.success && res.trains) {
        setTrains(res.trains);
      }
      setLoading(false);
    });
  }, [from, to, date, selectedClass, selectedQuota]);

  const filteredTrains = trains.filter(t => {
    if (filterType !== 'ALL' && t.trainType !== filterType) return false;
    if (filterAC && !t.classes.some(c => ['1A', '2A', '3A', 'CC', 'EC'].includes(c.classCode))) return false;
    return true;
  });

  return (
    <div className="railsmart-section" style={{ minHeight: '80vh' }}>
      {/* Search Header Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px 28px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase' }}>Available Rail Services</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '4px 0' }}>{from} ➔ {to}</h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Journey Date: <strong>{date}</strong> • Quota: <strong>{selectedQuota}</strong></span>
        </div>

        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <i className="fa-solid fa-pen-to-square"></i> Modify Search
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px' }}>
        {/* Filters Sidebar */}
        <aside style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <i className="fa-solid fa-filter" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> Filters
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Train Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['ALL', 'Vande Bharat', 'Rajdhani', 'Shatabdi', 'Superfast'].map(type => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    background: filterType === type ? 'rgba(245,158,11,0.15)' : 'transparent',
                    color: filterType === type ? 'var(--primary-color)' : 'var(--text-muted)',
                    border: filterType === type ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  {type === 'ALL' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Comfort</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={filterAC} onChange={e => setFilterAC(e.target.checked)} />
              AC Coaches Only
            </label>
          </div>
        </aside>

        {/* Results List */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '16px' }}></i>
              <p>Fetching real-time seat availability from Indian Railways network...</p>
            </div>
          ) : filteredTrains.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredTrains.map(train => (
                <div key={train._id} className="train-card-white">
                  <div className="train-header-row">
                    <div>
                      <h3 style={{ fontSize: '1.35rem', margin: 0 }}>{train.trainName}</h3>
                      <span className="train-number-tag">Train #{train.trainNumber} • Runs on: {train.runningDays?.join(', ')}</span>
                    </div>
                    <span className="train-type-badge">{train.trainType}</span>
                  </div>

                  <div className="train-timings-grid">
                    <div>
                      <div className="time-val">{train.departureTime}</div>
                      <div className="station-val">{train.fromStationName} ({train.fromStationCode})</div>
                    </div>

                    <div className="duration-box">
                      <span>{train.durationHours}</span>
                      <div className="duration-line"></div>
                      <span style={{ color: '#10b981', fontSize: '0.75rem' }}>Pantry: {train.pantryAvailable ? 'Yes' : 'No'}</span>
                    </div>

                    <div>
                      <div className="time-val">{train.arrivalTime}</div>
                      <div className="station-val">{train.toStationName} ({train.toStationCode})</div>
                    </div>
                  </div>

                  {/* Class options inside train card */}
                  <div className="classes-scroll-row">
                    {train.classes.map(cls => (
                      <div 
                        key={cls.classCode} 
                        className="class-pill-box"
                        onClick={() => navigate(`/booking?trainId=${train._id}&class=${cls.classCode}&date=${date}&quota=${selectedQuota}`)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="class-code">{cls.classCode}</span>
                          <span className="class-fare">₹{selectedQuota === 'TATKAL' ? cls.tatkalFare : cls.baseFare}</span>
                        </div>
                        <span className="class-avail">
                          <i className="fa-solid fa-circle-check" style={{ marginRight: '3px' }}></i>
                          AVL {cls.availableSeats}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#0f172a', background: '#f1f5f9', borderColor: '#e2e8f0' }}
                      onClick={() => {
                        setPredictTarget({ status: 'WL 14', classCode: '3A' });
                        setPredictorOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--primary-color)' }}></i> AI Prediction %
                    </button>

                    <button 
                      className="btn btn-primary" 
                      onClick={() => navigate(`/booking?trainId=${train._id}&class=${train.classes[0]?.classCode || 'CC'}&date=${date}&quota=${selectedQuota}`)}
                    >
                      Book Ticket <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
              <i className="fa-solid fa-train" style={{ fontSize: '3rem', color: '#64748b', marginBottom: '16px' }}></i>
              <h3>No direct trains found for selected criteria</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try choosing another date or exploring nearby alternative stations.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationPredictorModal 
        isOpen={predictorOpen} 
        onClose={() => setPredictorOpen(false)} 
        defaultStatus={predictTarget.status} 
        classCode={predictTarget.classCode} 
      />
    </div>
  );
};

export default TrainResults;