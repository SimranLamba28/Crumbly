'use client';
import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import MessageBubble from './MessageBubble';
import WelcomeMessage from './WelcomeMessage';
import ChatInput from './ChatInput';
import '@/styles/AIChatBox.css';

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    
    case 'UPDATE_LAST_MESSAGE':
      if (state.messages.length === 0) return state;
      const lastMessageIndex = state.messages.length - 1;
      return {
        ...state,
        messages: state.messages.map((msg, index) => 
          index === lastMessageIndex
            ? { 
                ...msg, 
                content: msg.content + (action.delta || ''), 
                isLoading: action.isLoading ?? msg.isLoading 
              }
            : msg
        )
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    
    case 'SET_INPUT':
      return { ...state, input: action.input };
    
    case 'CLEAR_CHAT':
      return { messages: [], input: '', loading: false };
    
    default:
      return state;
  }
};

const initialState = { messages: [], input: '', loading: false };

const parseStreamData = (line) => {
  if (!line.startsWith("data:")) return null; 

  const data = line.slice(5).trim(); 
  if (data === "[DONE]") return { done: true };

  try {
    const { choices } = JSON.parse(data);
    return { delta: choices?.[0]?.delta?.content || '' };
  } catch {
    console.warn("Invalid JSON:", data);
    return null;
  }
};

export default function AIChatBox({ recipe, show, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [{ messages, input, loading }, dispatch] = useReducer(chatReducer, initialState);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); 

  const handleClose = useCallback(() => { 
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      dispatch({ type: 'CLEAR_CHAT' });
    }, 300);
  }, [onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!show) return;
    
    inputRef.current?.focus();

    const handleEscape = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleEscape);
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [show, handleClose]);

  const parseStream = useCallback(async (reader) => {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; 
        
        for (const line of lines) {
          const result = parseStreamData(line);
          if (!result) continue;
          
          if (result.done) {
            dispatch({ type: 'UPDATE_LAST_MESSAGE', isLoading: false });
            return;
          }
          
          if (result.delta) {
            dispatch({ type: 'UPDATE_LAST_MESSAGE', delta: result.delta });
          }
        }
      }
    } catch (error) {
      console.error('Stream parsing error:', error);
      dispatch({ 
        type: 'UPDATE_LAST_MESSAGE', 
        delta: 'Connection error. Please try again.',
        isLoading: false 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, []);

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const msgsToSend = [...messages, userMsg];

    dispatch({ type: 'SET_INPUT', input: '' });
    dispatch({ type: 'ADD_MESSAGE', message: userMsg });
    dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: '', isLoading: true } });
    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgsToSend, recipe }),
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error('AI API error:', res.status, errText);
        throw new Error('Request failed');
      }
      
      if (!res.body) throw new Error('No stream available');

      await parseStream(res.body.getReader());

    } catch (err) {
      console.error('AI Error:', err);
      dispatch({
        type: 'UPDATE_LAST_MESSAGE',
        delta: 'Sorry, something went wrong. Please try again later.',
        isLoading: false
      });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, [input, loading, messages, recipe, parseStream]);

  if (!show && !isClosing) return null;

  return createPortal(
    <div className={`ai-chat-popup ${isClosing ? 'closing' : ''}`}>
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <span role="img" aria-label="robot">🤖</span> Baking Assistant
          <button onClick={handleClose} className="ai-close-btn" aria-label="Close">
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
            setInput={(value) => dispatch({ type: 'SET_INPUT', input: value })} 
            inputRef={inputRef} 
            loading={loading} 
            onSubmit={sendMessage} 
          />
        </div>
      </div>
    </div>,
    document.body
  );
}