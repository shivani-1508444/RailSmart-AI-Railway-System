import React, { useState, useEffect } from 'react';
import auth from '../utils/auth';

const ConfirmationPredictorModal = ({ isOpen, onClose, defaultStatus = 'WL 12', classCode = '3A' }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      auth.fetch('/api/ai/prediction', {
        method: 'POST',
        body: JSON.stringify({ currentStatus: defaultStatus, classCode, journeyDate: new Date(Date.now() + 86400000 * 3) })
      }).then(res => {
        if (res.success) setPrediction(res.prediction);
        setLoading(false);
      });
    }
  }, [isOpen, defaultStatus, classCode]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '1.6rem' }}>🔮</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>AI Confirmation Predictor</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Status: {defaultStatus} ({classCode})</span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '12px' }}></i>
            <p>Analyzing cancellation history & charting patterns...</p>
          </div>
        ) : prediction ? (
          <div>
            {/* Probability Gauge Box */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: prediction.probabilityPercentage >= 75 ? '#00ff88' : '#f59e0b', fontFamily: 'Outfit' }}>
                {prediction.probabilityPercentage}%
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {prediction.trend} Probability of Confirmation
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px' }}>{prediction.advice}</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>AI Factors:</strong> {prediction.factors.quotaDemand} • Historical Clearance: {prediction.factors.historicalClearanceRate}.
              <div style={{ marginTop: '8px', fontSize: '0.72rem', opacity: 0.8 }}>*{prediction.disclaimer}</div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Got It
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ConfirmationPredictorModal;