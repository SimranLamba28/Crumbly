'use client';

import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import '../../styles/exportDialog.css';

export default function ExportDialog({ onClose, onDownload }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleClickOutside = e => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) onClose();
    };
    const handleEscape = e => {
      if (e.key === 'Escape') onClose();
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
    <div className="export-dialog-overlay d-flex align-items-center justify-content-center">
      <div
        className="export-dialog shadow-lg border-0 bg-white"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
      >
        <div className="export-dialog-header d-flex justify-content-between align-items-center">
          <h3 className="m-0 text-white">Download Recipe</h3>
          <button
            className="export-close-btn d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close export dialog"
          >
            <FaTimes />
          </button>
        </div>

        <div className="export-dialog-body p-4">
          <p className="text-muted mb-3">Choose a format to download:</p>
          <div className="export-options d-grid gap-3">
            <button
              className="export-option-btn p-3 border rounded-3 bg-white"
              onClick={() => onDownload('pdf')}
              aria-label="Download as PDF"
            >
              <div className="export-icon pdf-icon shadow-sm">PDF</div>
              <span className="fw-semibold">PDF Document</span>
              <small>High-quality printable</small>
            </button>

            <button
              className="export-option-btn p-3 border rounded-3 bg-white"
              onClick={() => onDownload('jpg')}
              aria-label="Download as JPG"
            >
              <div className="export-icon image-icon shadow-sm">JPG</div>
              <span className="fw-semibold">JPG Image</span>
              <small>Perfect for sharing</small>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
