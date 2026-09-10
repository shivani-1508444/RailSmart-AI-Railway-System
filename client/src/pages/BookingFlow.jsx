import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import auth from '../utils/auth';

const BookingFlow = () => {
  const [searchParams] = useSearchParams();
  const trainId = searchParams.get('trainId');
  const travelClass = searchParams.get('class') || 'CC';
  const journeyDate = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const quota = searchParams.get('quota') || 'GENERAL';

  const [train, setTrain] = useState(null);
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'male', berthPreference: 'no_preference', foodPreference: 'veg' }
  ]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.getUser()) {
      window.showToast('Please login to complete your ticket booking', 'info');
      navigate('/login');
      return;
    }

    if (trainId) {
      auth.fetch(`/api/trains/${trainId}`).then(res => {
        if (res.success) setTrain(res.train);
      });
    }
  }, [trainId, navigate]);

  const addPassenger = () => {
    if (passengers.length >= 6) {
      window.showToast('Maximum 6 passengers allowed per booking', 'warning');
      return;
    }
    setPassengers([...passengers, { name: '', age: '', gender: 'male', berthPreference: 'no_preference', foodPreference: 'veg' }]);
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, idx) => idx !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    for (const p of passengers) {
      if (!p.name.trim() || !p.age) {
        window.showToast('Please fill all passenger names and ages', 'warning');
        return;
      }
    }

    // Check if user is logged in before submitting
    if (!auth.getUser() || !auth.getToken()) {
      window.showToast('Session expired. Please login again.', 'warning');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const data = await auth.fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          trainId: train._id,
          journeyDate,
          travelClass,
          quota,
          passengers,
          paymentMethod
        })
      });

      if (data.success) {
        setConfirmedBooking(data.booking);
        window.showToast('🎉 Ticket Booked & Digital QR Pass Generated!', 'success');
      } else if (data.message && data.message.includes('authorized')) {
        // Token expired - force re-login
        window.showToast('Session expired. Please login again.', 'warning');
        auth.logout(false);
        navigate('/login');
      } else {
        window.showToast(data.message || 'Booking failed', 'danger');
      }
    } catch (err) {
      window.showToast('Booking processing error', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="railsmart-section" style={{ minHeight: '80vh', maxWidth: '780px' }}>
        <div style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '24px', padding: '36px', boxShadow: 'var(--shadow-lg)', border: '2px solid var(--primary-color)' }}>
          {/* Ticket Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2rem' }}>🚆</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>E-TICKET / DIGITAL RAIL PASS</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Indian Railways Authorized Reservation</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>10-Digit PNR</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706', letterSpacing: '2px' }}>{confirmedBooking.pnr}</div>
            </div>
          </div>

          {/* Train & Journey Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Train Details</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{confirmedBooking.trainName} (#{confirmedBooking.trainNumber})</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Class: <strong>{confirmedBooking.travelClass}</strong> • Quota: <strong>{confirmedBooking.quota}</strong></div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Schedule</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{confirmedBooking.fromStation} ➔ {confirmedBooking.toStation}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Date: <strong>{confirmedBooking.journeyDate}</strong> ({confirmedBooking.departureTime})</div>
            </div>
          </div>

          {/* Passenger Berth Details */}
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Booked Passengers & Allocated Berths:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {confirmedBooking.passengers.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f1f5f9', borderRadius: '10px' }}>
                <div>
                  <strong>{idx + 1}. {p.name}</strong> ({p.age} yrs, {p.gender})
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                    Coach {p.allocatedCoach} / Berth {p.allocatedBerth} ({p.allocatedBerthType})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* QR Code & Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed #cbd5e1', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <QRCodeSVG value={confirmedBooking.qrToken} size={90} />
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Scan QR at barrier gates<br />or during TTE verification.
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Fare Paid:</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>₹{confirmedBooking.fareBreakdown.totalFare}.00</div>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>PAID via {paymentMethod}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button className="btn btn-secondary" style={{ flex: 1, color: '#0f172a', background: '#f1f5f9' }} onClick={() => window.print()}>
              <i className="fa-solid fa-print"></i> Print Ticket
            </button>
            <button className="btn btn-primary" style={{ flex: 1.5 }} onClick={() => navigate('/dashboard')}>
              Go to My Bookings <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="railsmart-section" style={{ minHeight: '80vh', maxWidth: '920px' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '24px' }}>Passenger Details & Reservation</h2>

      {train && (
        <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{train.trainName} (#{train.trainNumber})</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {train.fromStationName} ➔ {train.toStationName} • <strong>{journeyDate}</strong> • Class: <strong>{travelClass}</strong>
            </p>
          </div>
          <span className="train-type-badge">{quota}</span>
        </div>
      )}

      <form onSubmit={handleBookingSubmit}>
        {/* Passenger Forms */}
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Passengers List</h3>
            <button type="button" onClick={addPassenger} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-plus"></i> Add Passenger
            </button>
          </div>

          {passengers.map((p, index) => (
            <div key={index} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>Passenger #{index + 1}</span>
                {passengers.length > 1 && (
                  <button type="button" onClick={() => removePassenger(index)} style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-trash"></i> Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1.5fr', gap: '12px' }}>
                <div>
                  <label className="railsmart-label">Full Name</label>
                  <input 
                    type="text" 
                    className="railsmart-input" 
                    placeholder="As on Aadhaar / ID" 
                    value={p.name} 
                    onChange={e => handlePassengerChange(index, 'name', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="railsmart-label">Age</label>
                  <input 
                    type="number" 
                    className="railsmart-input" 
                    placeholder="Age" 
                    value={p.age} 
                    onChange={e => handlePassengerChange(index, 'age', e.target.value)} 
                    required 
                    min="1" 
                    max="120" 
                  />
                </div>
                <div>
                  <label className="railsmart-label">Gender</label>
                  <select 
                    className="railsmart-select" 
                    value={p.gender} 
                    onChange={e => handlePassengerChange(index, 'gender', e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Other</option>
                  </select>
                </div>
                <div>
                  <label className="railsmart-label">Berth Preference</label>
                  <select 
                    className="railsmart-select" 
                    value={p.berthPreference} 
                    onChange={e => handlePassengerChange(index, 'berthPreference', e.target.value)}
                  >
                    <option value="no_preference">No Preference</option>
                    <option value="lower">Lower Berth</option>
                    <option value="middle">Middle Berth</option>
                    <option value="upper">Upper Berth</option>
                    <option value="side_lower">Side Lower</option>
                    <option value="side_upper">Side Upper</option>
                    <option value="window">Window Seat</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Options & Summary */}
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Payment Mode</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {['UPI', 'DEBIT_CARD', 'CREDIT_CARD', 'NET_BANKING'].map(method => (
              <div 
                key={method}
                onClick={() => setPaymentMethod(method)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: paymentMethod === method ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)',
                  border: paymentMethod === method ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: paymentMethod === method ? 'var(--primary-color)' : 'var(--text-primary)'
                }}
              >
                {method.replace('_', ' ')}
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
            disabled={isProcessing}
          >
            {isProcessing ? 'Verifying & Generating Ticket...' : 'Proceed to Pay & Confirm ➔'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingFlow;