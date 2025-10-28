import React, { useState, useCallback } from 'react';
import '../styles/Alert.css'; 

export const useConfirmation = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Confirm Action');
  const [resolvePromise, setResolvePromise] = useState(null);

  const confirm = useCallback(({ title: t, message: m }) => {
    return new Promise((resolve) => {
      setTitle(t || 'Confirm Action');
      setMessage(m || 'Are you sure you want to proceed?');
      setShow(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolvePromise) resolvePromise(true);
    setShow(false);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) resolvePromise(false);
    setShow(false);
  }, [resolvePromise]);

  const ConfirmationModal = () => {
    if (!show) return null;

    return (
      <div className="alert-overlay" onClick={handleCancel}>
        <div
          className="alert-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
        >
          <header className="alert-header">
            <h2 id="confirm-title" className="alert-title">{title}</h2>
            <button className="alert-close-btn" onClick={handleCancel} aria-label="Cancel">&times;</button>
          </header>
          <section id="confirm-message" className="alert-body">{message}</section>
          <footer className="alert-footer">
            <button className="confirmation-btn"
            onClick={handleConfirm}>
              Confirm
            </button>
            <button className="confirmation-btn"
            onClick={handleCancel}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmationModal };
};
