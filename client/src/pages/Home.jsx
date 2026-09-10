import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../utils/auth';
import { getTranslation } from '../i18n/i18n';
import ConfirmationPredictorModal from '../components/ConfirmationPredictorModal';

const Home = ({ lang, openVoiceModal }) => {
  const [fromStation, setFromStation] = useState('NDLS - New Delhi');
  const [toStation, setToStation] = useState('BSB - Varanasi Jn');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().slice(0, 10);
  });
  const [travelClass, setTravelClass] = useState('ALL');
  const [quota, setQuota] = useState('GENERAL');
  const [featuredTrains, setFeaturedTrains] = useState([]);
  const [predictorOpen, setPredictorOpen] = useState(false);
  const [predictTarget, setPredictTarget] = useState({ status: 'WL 14', classCode: '3A' });

  const navigate = useNavigate();

  useEffect(() => {
    auth.fetch('/api/trains/search?from=NDLS&to=BSB').then(res => {
      if (res.success && res.trains) {
        setFeaturedTrains(res.trains.slice(0, 4));
      }
    });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const fromCode = fromStation.split('-')[0].trim();
    const toCode = toStation.split('-')[0].trim();
    navigate(`/trains?from=${fromCode}&to=${toCode}&date=${journeyDate}&class=${travelClass}&quota=${quota}`);
  };

  const handlePredictClick = (status, classCode) => {
    setPredictTarget({ status, classCode });
    setPredictorOpen(true);
  };

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="railsmart-hero">
        <div className="railsmart-hero-content">
          <div className="railsmart-hero-tag">
            <i className="fa-solid fa-bolt" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
            {getTranslation(lang, 'tagline')}
          </div>
          <h1 className="railsmart-hero-title">
            <span>Next-Gen Smart</span> <span style={{ color: 'var(--primary-color)' }}>Train Booking</span>
          </h1>
          <p className="railsmart-hero-desc">
            Fastest train reservations, real-time IRCTC berth availability, AI waitlist confirmation prediction, instant digital QR passes, and e-catering meals delivered to your berth.
          </p>

          {/* Search Card */}
          <div className="railsmart-search-card">
            <div className="railsmart-search-card-header">
              <div className="railsmart-search-tabs">
                <div className="railsmart-search-tab active">
                  <i className="fa-solid fa-train"></i>
                  <span>Book Train Tickets</span>
                </div>
                <Link to="/pnr" className="railsmart-search-tab">
                  <i className="fa-solid fa-ticket"></i>
                  <span>PNR Enquiry</span>
                </Link>
                <Link to="/live-status" className="railsmart-search-tab">
                  <i className="fa-solid fa-satellite-dish"></i>
                  <span>Live Train Tracking</span>
                </Link>
              </div>

              <button 
                type="button" 
                onClick={openVoiceModal} 
                className="btn-voice-nav" 
                title="Voice Search"
                style={{ width: 'auto', borderRadius: '20px', padding: '6px 14px', gap: '8px', fontSize: '0.85rem' }}
              >
                <i className="fa-solid fa-microphone"></i>
                <span>Voice Search</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="railsmart-search-form">
              {/* Field 1: FROM */}
              <div className="railsmart-form-col">
                <label className="railsmart-label">{getTranslation(lang, 'from')}</label>
                <div className="railsmart-input-wrap">
                  <i className="fa-solid fa-train-subway railsmart-input-icon"></i>
                  <select 
                    className="railsmart-select" 
                    value={fromStation} 
                    onChange={e => setFromStation(e.target.value)}
                  >
                    <option value="NDLS - New Delhi">NDLS - New Delhi</option>
                    <option value="BCT - Mumbai Central">BCT - Mumbai Central</option>
                    <option value="HWH - Howrah Jn">HWH - Howrah Jn</option>
                    <option value="MAS - Chennai Central">MAS - Chennai Central</option>
                    <option value="SBC - KSR Bengaluru">SBC - KSR Bengaluru</option>
                    <option value="LKO - Lucknow Charbagh">LKO - Lucknow Charbagh</option>
                    <option value="PNBE - Patna Jn">PNBE - Patna Jn</option>
                    <option value="ADI - Ahmedabad Jn">ADI - Ahmedabad Jn</option>
                  </select>
                </div>
              </div>

              {/* Field 2: TO */}
              <div className="railsmart-form-col">
                <label className="railsmart-label">{getTranslation(lang, 'to')}</label>
                <div className="railsmart-input-wrap">
                  <i className="fa-solid fa-location-dot railsmart-input-icon"></i>
                  <select 
                    className="railsmart-select" 
                    value={toStation} 
                    onChange={e => setToStation(e.target.value)}
                  >
                    <option value="BSB - Varanasi Jn">BSB - Varanasi Jn</option>
                    <option value="BCT - Mumbai Central">BCT - Mumbai Central</option>
                    <option value="NDLS - New Delhi">NDLS - New Delhi</option>
                    <option value="MAS - Chennai Central">MAS - Chennai Central</option>
                    <option value="LKO - Lucknow Charbagh">LKO - Lucknow Charbagh</option>
                    <option value="PUNE - Pune Jn">PUNE - Pune Jn</option>
                    <option value="CDG - Chandigarh">CDG - Chandigarh</option>
                    <option value="MAO - Madgaon (Goa)">MAO - Madgaon (Goa)</option>
                  </select>
                </div>
              </div>

              {/* Field 3: DATE */}
              <div className="railsmart-form-col">
                <label className="railsmart-label">{getTranslation(lang, 'date')}</label>
                <div className="railsmart-input-wrap">
                  <i className="fa-regular fa-calendar railsmart-input-icon"></i>
                  <input 
                    type="date" 
                    className="railsmart-input" 
                    value={journeyDate} 
                    onChange={e => setJourneyDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Field 4: CLASS */}
              <div className="railsmart-form-col">
                <label className="railsmart-label">{getTranslation(lang, 'travelClass')}</label>
                <div className="railsmart-input-wrap">
                  <i className="fa-solid fa-couch railsmart-input-icon"></i>
                  <select className="railsmart-select" value={travelClass} onChange={e => setTravelClass(e.target.value)}>
                    <option value="ALL">All Classes</option>
                    <option value="EC">Exec. Chair Car (EC)</option>
                    <option value="CC">AC Chair Car (CC)</option>
                    <option value="1A">AC 1st Class (1A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="3A">AC 3 Tier (3A)</option>
                    <option value="SL">Sleeper (SL)</option>
                  </select>
                </div>
              </div>

              {/* Field 5: QUOTA */}
              <div className="railsmart-form-col">
                <label className="railsmart-label">{getTranslation(lang, 'quota')}</label>
                <div className="railsmart-input-wrap">
                  <i className="fa-solid fa-users railsmart-input-icon"></i>
                  <select className="railsmart-select" value={quota} onChange={e => setQuota(e.target.value)}>
                    <option value="GENERAL">General</option>
                    <option value="TATKAL">Tatkal</option>
                    <option value="LADIES">Ladies</option>
                    <option value="SENIOR_CITIZEN">Senior Citizen</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button type="submit" className="railsmart-btn-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>{getTranslation(lang, 'searchTrainsBtn')}</span>
              </button>
            </form>
          </div>

          {/* Quick Service Action Pills */}
          <div className="quick-services-bar">
            <Link to="/trains" className="service-pill-btn">
              <i className="fa-solid fa-bolt" style={{ color: 'var(--primary-color)' }}></i>
              <span>Vande Bharat Trains</span>
            </Link>
            <Link to="/pnr" className="service-pill-btn">
              <i className="fa-solid fa-ticket" style={{ color: '#38bdf8' }}></i>
              <span>PNR Status Timeline</span>
            </Link>
            <Link to="/live-status" className="service-pill-btn">
              <i className="fa-solid fa-satellite-dish" style={{ color: '#00ff88' }}></i>
              <span>Live Train GPS</span>
            </Link>
            <Link to="/e-catering" className="service-pill-btn">
              <i className="fa-solid fa-utensils" style={{ color: '#f59e0b' }}></i>
              <span>Order Food to Berth</span>
            </Link>
            <button onClick={() => handlePredictClick('WL 12', '3A')} className="service-pill-btn">
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#a855f7' }}></i>
              <span>AI Waitlist Predictor</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURED TRAINS ================= */}
      <section className="railsmart-section">
        <div className="section-header-center">
          <div className="section-pill-tag">
            <i className="fa-solid fa-award"></i>
            <span>SUPERFAST & VANDE BHARAT FLEET</span>
          </div>
          <h2 className="section-title">Popular Rail Corridors</h2>
          <p className="section-subtitle">
            Instant booking with live seat availability, verified on-time performance, and premium catering.
          </p>
        </div>

        <div className="routes-grid">
          {featuredTrains.map(train => (
            <div key={train._id} className="train-card-white">
              <div className="train-header-row">
                <div className="train-name-box">
                  <h3>{train.trainName}</h3>
                  <span className="train-number-tag">#{train.trainNumber} • {train.trainType}</span>
                </div>
                <span className="train-type-badge">{train.trainType}</span>
              </div>

              <div className="train-timings-grid">
                <div>
                  <div className="time-val">{train.departureTime}</div>
                  <div className="station-val">{train.fromStationName}</div>
                </div>

                <div className="duration-box">
                  <span>{train.durationHours}</span>
                  <div className="duration-line"></div>
                  <span style={{ color: '#10b981', fontSize: '0.72rem' }}>On-Time: {train.onTimeRating * 20}%</span>
                </div>

                <div>
                  <div className="time-val">{train.arrivalTime}</div>
                  <div className="station-val">{train.toStationName}</div>
                </div>
              </div>

              {/* Class Cards */}
              <div className="classes-scroll-row">
                {train.classes.map(cls => (
                  <div key={cls.classCode} className="class-pill-box">
                    <span className="class-code">{cls.classCode}</span>
                    <span className="class-fare">₹{cls.baseFare}</span>
                    <span className="class-avail">
                      <i className="fa-solid fa-circle-check" style={{ marginRight: '3px' }}></i>
                      {cls.availableSeats} Left
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem', color: '#0f172a', background: '#f1f5f9', borderColor: '#e2e8f0' }}
                  onClick={() => handlePredictClick('WL 8', '3A')}
                >
                  <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--primary-color)' }}></i> AI Chances
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1.2, padding: '10px', fontSize: '0.9rem' }}
                  onClick={() => navigate(`/booking?trainId=${train._id}&class=CC&date=${journeyDate}`)}
                >
                  Book Now <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= E-CATERING PROMO ================= */}
      <section className="railsmart-section" style={{ paddingTop: 0 }}>
        <div style={{ background: 'linear-gradient(135deg, #132247 0%, #0c1836 100%)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '24px', padding: '48px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <div className="section-pill-tag">
              <i className="fa-solid fa-utensils"></i>
              <span>RAILWAY E-CATERING</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '14px' }}>
              {getTranslation(lang, 'orderFoodTitle')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
              {getTranslation(lang, 'orderFoodDesc')} Partnered with Haldiram's, Domino's, Behrouz Biryani, and IRCTC certified kitchens across 250+ stations.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/e-catering" className="btn btn-primary">
                <i className="fa-solid fa-utensils"></i>
                <span>{getTranslation(lang, 'exploreMenu')}</span>
              </Link>
              <Link to="/pnr" className="btn btn-secondary">
                <span>Enter PNR to Order</span>
              </Link>
            </div>
          </div>

          <div style={{ borderRadius: '18px', overflow: 'hidden', height: '280px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
            <img 
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80" 
              alt="Delicious Indian Railway Thali Meal" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </section>

      {/* Confirmation Predictor Modal */}
      <ConfirmationPredictorModal 
        isOpen={predictorOpen} 
        onClose={() => setPredictorOpen(false)} 
        defaultStatus={predictTarget.status} 
        classCode={predictTarget.classCode} 
      />
    </div>
  );
};

export default Home;