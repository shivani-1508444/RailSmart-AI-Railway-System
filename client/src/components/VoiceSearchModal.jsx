import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceSearchModal = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Click microphone and speak your route (e.g. "Trains from Delhi to Mumbai tomorrow")');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
    }
  }, [isOpen]);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('Voice recognition is not supported in this browser. Please type your search.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage('Listening... Speak now 🎙️');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setStatusMessage('Could not recognize voice. Please try again or type.');
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatusMessage('Finished listening. Processing train search...');
    };

    recognition.start();
  };

  const handleApplyVoiceSearch = () => {
    const text = transcript.toLowerCase();
    let from = 'NDLS';
    let to = 'BCT';

    if (text.includes('delhi')) from = 'NDLS';
    if (text.includes('mumbai')) to = 'BCT';
    if (text.includes('varanasi') || text.includes('banaras')) to = 'BSB';
    if (text.includes('lucknow')) to = 'LKO';
    if (text.includes('bangalore') || text.includes('bengaluru')) to = 'SBC';
    if (text.includes('chennai')) to = 'MAS';

    onClose();
    navigate(`/trains?from=${from}&to=${to}`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>

        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>🎙️ AI Voice Train Search</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>{statusMessage}</p>

        <div 
          onClick={startVoiceRecognition}
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            border: `2px solid ${isListening ? '#ef4444' : 'var(--primary-color)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            cursor: 'pointer',
            fontSize: '2.2rem',
            color: isListening ? '#ef4444' : 'var(--primary-color)',
            boxShadow: isListening ? '0 0 30px rgba(239,68,68,0.6)' : '0 0 20px rgba(245,158,11,0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
        </div>

        {transcript && (
          <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '20px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Recognized Voice Command:</span>
            <p style={{ fontSize: '1rem', color: '#00ff88', fontWeight: 600, margin: '4px 0 0 0' }}>"{transcript}"</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleApplyVoiceSearch} disabled={!transcript}>
            Find Trains <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearchModal;