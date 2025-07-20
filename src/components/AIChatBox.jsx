'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import '@/styles/AIChatBox.css';

const AIChatBox = ({ recipe, show, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatPopupRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, show]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai', { 
        messages: newMessages,
        recipe: recipe
       });
      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Error sending message to AI:', err);
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = `Error: ${err.response.data.error}`;
      }
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Handle escape key to close chat
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && show) {
        handleClose();
      }
    };
    
    if (show) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [show]);

  // Prevent background scrolling when chat is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  if (!show && !isClosing) return null;

  const chatContent = (
    <div 
      ref={chatPopupRef}
      className={`ai-chat-popup ${isClosing ? 'closing' : ''}`}
    >
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <FaRobot className="text-primary" size={24} />
            <span>Baking Assistant</span>
          </div>
          <button 
            onClick={handleClose} 
            className="ai-close-btn"
            aria-label="Close chat"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="ai-chat-body">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-bubble">
                <h5>👋 Hi there!</h5>
                <p>I'm your baking assistant. Ask me anything about this recipe!</p>
                <p>Try questions like:</p>
                <ul>
                  <li>"Can I make this vegan?"</li>
                  <li>"What substitutions can I use?"</li>
                  <li>"How should I store these?"</li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message ${msg.role}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="message-icon">
                  {msg.role === 'user' ? <FaUser size={16} /> : <FaRobot size={16} />}
                </div>
                <div className="message-content">
                  {msg.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message assistant">
              <div className="message-icon">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-footer">
          <form className="w-100" onSubmit={sendMessage}>
            <div className="input-group">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this recipe..."
                className="ai-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="ai-send-btn"
                disabled={loading || !input.trim()}
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render using portal to avoid positioning issues
  return createPortal(chatContent, document.body);
};

export default AIChatBox;