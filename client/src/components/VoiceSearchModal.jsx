import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceSearchModal = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('hi-IN'); // 'hi-IN' or 'en-IN'
  const [statusMessage, setStatusMessage] = useState('Click microphone and speak your route (e.g. "Delhi to Mumbai" or "Varanasi se Delhi")');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setStatusMessage('Click microphone and speak your route (e.g. "Delhi to Mumbai" or "Varanasi se Delhi")');
    }
  }, [isOpen]);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('❌ Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage('🎙️ Listening... Speak your route clearly now');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      const err = event.error;
      if (err === 'not-allowed') {
        setStatusMessage('⚠️ Microphone access denied. Please click the mic icon in your browser address bar to allow mic permissions.');
      } else if (err === 'no-speech') {
        setStatusMessage('🗣️ No speech detected. Please click the microphone button and speak again.');
      } else if (err === 'network') {
        setStatusMessage('📶 Network issue. Please check your internet connection for speech recognition.');
      } else {
        setStatusMessage('⚠️ Voice recognition error. Please try again or choose a sample route.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatusMessage('✅ Listening finished. Review your voice command below or search trains.');
    };

    try {
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setStatusMessage('Microphone busy or already active. Please try again.');
    }
  };

  const parseVoiceText = (rawText) => {
    if (!rawText) return { from: 'NDLS', to: 'BSB' };
    
    // Clean text of punctuation and convert to lowercase
    const text = rawText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ');

    const stationMap = {
      'delhi': 'NDLS',
      'new delhi': 'NDLS',
      'mumbai': 'BCT',
      'bombay': 'BCT',
      'mumbai central': 'BCT',
      'varanasi': 'BSB',
      'banaras': 'BSB',
      'kashi': 'BSB',
      'lucknow': 'LKO',
      'charbagh': 'LKO',
      'bangalore': 'SBC',
      'bengaluru': 'SBC',
      'chennai': 'MAS',
      'madras': 'MAS',
      'kanpur': 'CNB',
      'agra': 'AGC',
      'pune': 'PUNE',
      'kolkata': 'HWH',
      'howrah': 'HWH',
      'sealdah': 'SDAH',
      'patna': 'PNBE',
      'ahmedabad': 'ADI',
      'surat': 'ST',
      'jaipur': 'JP',
      'bhopal': 'BPL',
      'chandigarh': 'CDG',
      'amritsar': 'ASR',
      'guwahati': 'GHY',
      'goa': 'MAO',
      'madgaon': 'MAO',
      'ayodhya': 'AY',
      'gorakhpur': 'GKP',
      'hyderabad': 'SC',
      'secunderabad': 'SC',
      'jammu': 'JAT',
      'prayagraj': 'PRYJ',
      'allahabad': 'PRYJ',
      'nagpur': 'NGP',
      'vadodara': 'BRC',
      'haridwar': 'HW',
      'dehradun': 'DDN',
      'puri': 'PURI'
    };

    let foundFrom = null;
    let foundTo = null;

    // Pattern matching: "from X to Y" or "X se Y" or "X tak Y"
    const fromRegex = /(?:from|se|start|de|origin)\s+([a-z\s]+?)(?=\s+(?:to|tak|aur|and|destination|ko)|$)/i;
    const toRegex = /(?:to|tak|ko|destination)\s+([a-z\s]+?)(?=\s+(?:train|se|from)|$)/i;

    const fMatch = text.match(fromRegex);
    const tMatch = text.match(toRegex);

    if (fMatch) {
      const key = fMatch[1].trim();
      if (stationMap[key]) foundFrom = stationMap[key];
    }
    if (tMatch) {
      const key = tMatch[1].trim();
      if (stationMap[key]) foundTo = stationMap[key];
    }

    // Fallback dictionary scan
    if (!foundFrom || !foundTo) {
      const matchedCodes = [];
      // Sort keys by length descending so "new delhi" matches before "delhi"
      const keys = Object.keys(stationMap).sort((a, b) => b.length - a.length);
      
      let tempText = text;
      for (const key of keys) {
        if (tempText.includes(key)) {
          matchedCodes.push({ code: stationMap[key], index: tempText.indexOf(key) });
          tempText = tempText.replace(key, ' ');
        }
      }

      // Sort by position in spoken text
      matchedCodes.sort((a, b) => a.index - b.index);

      if (matchedCodes.length >= 2) {
        if (!foundFrom) foundFrom = matchedCodes[0].code;
        if (!foundTo) foundTo = matchedCodes[1].code;
      } else if (matchedCodes.length === 1) {
        if (!foundTo) foundTo = matchedCodes[0].code;
        if (!foundFrom) foundFrom = foundTo === 'NDLS' ? 'BSB' : 'NDLS';
      }
    }

    return {
      from: foundFrom || 'NDLS',
      to: foundTo || (foundFrom === 'BCT' ? 'NDLS' : 'BCT')
    };
  };

  const handleApplyVoiceSearch = () => {
    const { from, to } = parseVoiceText(transcript);
    onClose();
    navigate(`/trains?from=${from}&to=${to}`);
  };

  const handleSampleClick = (sampleText) => {
    setTranscript(sampleText);
    setStatusMessage('Sample command loaded. Click "Find Trains" to execute search.');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>🎙️ AI Voice Train Search</h3>
        </div>

        {/* Language selector toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setSelectedLang('hi-IN')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: selectedLang === 'hi-IN' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: selectedLang === 'hi-IN' ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)',
              color: selectedLang === 'hi-IN' ? 'var(--primary-color)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            🇮🇳 हिंदी / Hinglish
          </button>
          <button
            onClick={() => setSelectedLang('en-IN')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: selectedLang === 'en-IN' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: selectedLang === 'en-IN' ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)',
              color: selectedLang === 'en-IN' ? 'var(--primary-color)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            🌐 English
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px', minHeight: '38px', lineHeight: 1.4 }}>
          {statusMessage}
        </p>

        {/* Pulsing Mic Button */}
        <div 
          onClick={startVoiceRecognition}
          style={{
            width: '94px',
            height: '94px',
            borderRadius: '50%',
            background: isListening ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.2)',
            border: `3px solid ${isListening ? '#ef4444' : 'var(--primary-color)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            cursor: 'pointer',
            fontSize: '2.4rem',
            color: isListening ? '#ef4444' : 'var(--primary-color)',
            boxShadow: isListening ? '0 0 35px rgba(239,68,68,0.7)' : '0 0 22px rgba(245,158,11,0.4)',
            transition: 'all 0.3s ease',
            animation: isListening ? 'pulse 1.2s infinite' : 'none'
          }}
          title="Click to start voice input"
        >
          <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
        </div>

        {/* Spoken / Typed Command Box */}
        <div style={{ marginBottom: '18px', textAlign: 'left' }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Voice Command / Route Input:
          </label>
          <input 
            type="text" 
            className="railsmart-input" 
            placeholder="e.g. Delhi to Mumbai or Varanasi se Delhi..." 
            value={transcript} 
            onChange={(e) => setTranscript(e.target.value)} 
            style={{ width: '100%', padding: '12px 16px', fontSize: '1rem', fontWeight: 600 }}
          />
        </div>

        {/* Sample Voice Hints */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>💡 Quick Sample Routes:</span>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Delhi to Mumbai', 'Varanasi se Delhi', 'Bangalore to Chennai', 'Lucknow to Kanpur'].map(sample => (
              <button
                key={sample}
                type="button"
                onClick={() => handleSampleClick(sample)}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                🗣️ "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleApplyVoiceSearch} style={{ minWidth: '150px' }}>
            Find Trains <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearchModal;