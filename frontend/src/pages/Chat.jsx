import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiArrowLeft, FiUser, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m your Vitalis health assistant. How can I help you today?' }
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
      
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "Vitalis AI is currently taking a short break. Please try your question again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft} onClick={() => navigate('/dashboard')}>
          <FiArrowLeft size={20} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Health Assistant</h2>
        </div>
        <div style={styles.statusIndicator}>
          <div style={styles.onlineDot}></div>
          <span>Vitalis AI</span>
        </div>
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              style={{
                ...styles.messageWrapper,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                ...styles.bubble,
                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? 'white' : 'inherit',
                borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px'
              }}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', opacity: 0.8, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 1rem' }}>
              <div className="spinner-sm"></div>
              <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Vitalis is thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <div style={styles.inputSection}>
        <form onSubmit={handleSend} style={styles.inputContainer} className="glass-panel">
          <input 
            type="text" 
            placeholder="Ask a health question..." 
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" style={styles.sendBtn} disabled={loading || !input.trim()}>
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-dark)'
  },
  header: {
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 10
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)'
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981'
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  messageWrapper: {
    maxWidth: '75%',
    display: 'flex',
    flexDirection: 'column'
  },
  bubble: {
    padding: '1rem 1.2rem',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  inputSection: {
    padding: '1.5rem 2rem',
    background: 'var(--bg-dark)'
  },
  inputContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0.5rem',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'white',
    padding: '0.6rem 1rem',
    outline: 'none',
    fontSize: '1rem'
  },
  sendBtn: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    opacity: 0.9
  }
};

export default Chat;
