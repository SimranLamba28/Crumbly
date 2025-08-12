'use client';

import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import '../styles/exportDialog.css';

export default function ExportDialog({ onClose, onDownload }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <div className="export-dialog-overlay">
      <div className="export-dialog" ref={dialogRef}>
        <div className="export-dialog-header">
          <h3>Download Recipe</h3>
          <button 
            className="export-close-btn"
            onClick={onClose}
            aria-label="Close export dialog"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="export-dialog-body">
          <p>Choose a format to download:</p>
          <div className="export-options">
            <button 
              className="export-option-btn"
              onClick={() => onDownload('pdf')}
              aria-label="Download as PDF"
            >
              <div className="export-icon pdf-icon">PDF</div>
              <span>PDF Document</span>
              <small>High-quality printable</small>
            </button>
            
            <button 
              className="export-option-btn"
              onClick={() => onDownload('jpg')}
              aria-label="Download as JPG"
            >
              <div className="export-icon image-icon">JPG</div>
              <span>JPG Image</span>
              <small>Perfect for sharing</small>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}