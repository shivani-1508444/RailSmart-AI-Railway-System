import React, { useState, useEffect, useRef } from 'react';
import auth from '../utils/auth';

const RailBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am **RailBot**, your AI Railway Assistant 🚆. Ask me to check PNR status, find Vande Bharat trains, predict waitlist confirmation, or order meals to your seat!'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInputVal('');
    setLoading(true);

    try {
      const data = await auth.fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: query, sessionId: 'user_session' })
      });

      if (data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'I am experiencing a momentary connection delay. Please try again.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Network issue. Please ensure the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Icon */}
      <div 
        className="railbot-float-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with RailBot AI Assistant"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'}`}></i>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="railbot-chat-window">
          <div className="railbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }}></div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>RailBot AI Assistant</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary-color)' }}>Online • IRCTC & Railway AI</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>

          <div className="railbot-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-bubble ${m.sender}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ animation: 'pulse 1s infinite' }}>Thinking...</span> 🤖
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid var(--border-color)' }}>
            {['Check PNR 2458913456', 'Delhi to Mumbai Trains', 'Order Food in Train', 'Waitlist Confirmation Chance'].map(chip => (
              <button 
                key={chip}
                onClick={() => handleSend(chip)}
                style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '12px', whiteSpace: 'nowrap', border: '1px solid var(--border-color)' }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="railbot-input-row">
            <input 
              type="text" 
              className="railsmart-input" 
              placeholder="Type your railway query..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{ padding: '8px 14px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }} disabled={loading}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default RailBot;