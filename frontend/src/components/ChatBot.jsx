import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiSend, FiX, FiActivity, FiSmile } from 'react-icons/fi';
import apiClient from '../api/apiClient';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am Vitalis AI, your dedicated health assistant. How can I support your wellness journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const updatedMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post('/chat', { 
        message: userMessage,
        history: updatedMessages.slice(-10)
      });
      const aiText = res.data.response || "Try again in a moment.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        onClick={() => {
          console.log("ChatBot Bubble Clicked");
          setIsOpen(true);
        }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          pointerEvents: 'auto'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FiMessageSquare size={28} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2rem',
            width: '380px',
            height: '500px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.2rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ fontWeight: '600' }}>Vitalis AI Assistant</span>
            </div>
            <FiX 
              style={{ cursor: 'pointer', opacity: 0.7 }} 
              onClick={() => setIsOpen(false)} 
            />
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '0.8rem 1rem',
                borderRadius: '16px',
                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? 'white' : 'inherit',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '0.8rem', opacity: 0.5 }}>
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSend}
            style={{
              padding: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input 
              type="text" 
              placeholder="Ask anything about your health..."
              className="input-control"
              style={{ flex: 1, borderRadius: '24px', padding: '0.6rem 1.2rem' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0.6rem', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={loading || !input.trim()}
            >
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
