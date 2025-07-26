'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import MessageBubble from './MessageBubble';
import WelcomeMessage from './WelcomeMessage';
import ChatInput from './ChatInput';
import '@/styles/AIChatBox.css';

const AIChatBox = ({ recipe, show, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [show]);

  // Escape key to close chat
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && show) handleClose();
    };
    if (show) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [show]);

  const parseStream = async (reader) => {
    const decoder = new TextDecoder();
    let fullMessage = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer+= decoder.decode(value, {stream: true});
      const lines = buffer.split('\n');
      buffer= lines.pop();

      for (const line of lines) {
        if (line.startsWith('data:') && !line.includes('[DONE]')) {
          try {
            const jsonStr = line.substring(5).trim();
            if (!jsonStr) continue;
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content || '';
            fullMessage += content;

            setMessages((prev) => {
              const newMsgs = [...prev];
              const lastIndex = newMsgs.length - 1;
              newMsgs[lastIndex] = {
                ...newMsgs[lastIndex],
                content: (newMsgs[lastIndex]?.content || '') + content,
                isLoading: false
              };
              return newMsgs;
            });
          } catch (err) {
            console.error('JSON parse error in streaming chunk:', err, line);
          }
        }
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Add blank assistant message to stream into
      setMessages(prev => [...prev, { role: 'assistant', content: '', isLoading: true }]);

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, recipe }),
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body.getReader();
      await parseStream(reader);

    } catch (err) {
      console.error('AI Error:', err);
      const errorMessage = typeof err === 'string'
        ? err.message
        : 'Sorry, I encountered an error. Please try again later.';

      // Replace loading assistant message with error
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: errorMessage,
        isLoading: false
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

  if (!show && !isClosing) return null;

  return createPortal(
    <div className={`ai-chat-popup ${isClosing ? 'closing' : ''}`}>
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <span role="img" aria-label="robot">🤖</span>
            <span>Baking Assistant</span>
          </div>
          <button onClick={handleClose} className="ai-close-btn" aria-label="Close chat">
            <IoClose size={24} />
          </button>
        </div>

        <div className="ai-chat-body">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                role={msg.role}
                content={msg.content}
                isLoading={msg.isLoading}
                index={idx}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-footer">
          <ChatInput
            input={input}
            setInput={setInput}
            inputRef={inputRef}
            loading={loading}
            onSubmit={sendMessage}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AIChatBox;
