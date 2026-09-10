import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RailBot from './components/RailBot';
import VoiceSearchModal from './components/VoiceSearchModal';

import Home from './pages/Home';
import TrainResults from './pages/TrainResults';
import BookingFlow from './pages/BookingFlow';
import PNRStatus from './pages/PNRStatus';
import LiveTrainStatus from './pages/LiveTrainStatus';
import ECatering from './pages/ECatering';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [lang, setLang] = useState('en');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar lang={lang} setLang={setLang} openVoiceModal={() => setVoiceModalOpen(true)} />
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home lang={lang} openVoiceModal={() => setVoiceModalOpen(true)} />} />
            <Route path="/trains" element={<TrainResults lang={lang} />} />
            <Route path="/booking" element={<BookingFlow lang={lang} />} />
            <Route path="/pnr" element={<PNRStatus lang={lang} />} />
            <Route path="/live-status" element={<LiveTrainStatus lang={lang} />} />
            <Route path="/e-catering" element={<ECatering lang={lang} />} />
            <Route path="/dashboard" element={<Dashboard lang={lang} />} />
            <Route path="/login" element={<Login lang={lang} />} />
            <Route path="/register" element={<Register lang={lang} />} />
          </Routes>
        </div>

        <Footer />
        <RailBot />
        <VoiceSearchModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
      </div>
    </Router>
  );
}

export default App;