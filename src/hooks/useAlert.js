import React, { useState, useCallback } from 'react';
import '../styles/Alert.css'; 
export const useAlert = () => {
  const [show, setShow] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('info');

  const showAlert = useCallback(({ title, message, variant = 'info' }) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVariant(variant);
    setShow(true);
  }, []);

  const handleClose = () => setShow(false);

  const AlertModal = () => {
    if (!show) return null;

    return (
      <div className="alert-overlay" onClick={handleClose}>
        <div
          className={`crm-alert alert-modal alert-${alertVariant}`}
          onClick={(e) => e.stopPropagation()}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-title"
          aria-describedby="alert-message"
        >
          <header className="alert-header">
            <h2 id="alert-title" className="alert-title">{alertTitle}</h2>
            <button className="alert-close-btn" onClick={handleClose} aria-label="Close alert">&times;</button>
          </header>
          <section id="alert-message" className="alert-body">{alertMessage}</section>
          <footer className="alert-footer">
            <button className="alert-close-btn-footer" onClick={handleClose}>Close</button>
          </footer>
        </div>
      </div>
    );
  };

  return { showAlert, AlertModal };
};
