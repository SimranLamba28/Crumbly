import React, { useState, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';

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

  const AlertModal = () => (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className={`bg-${alertVariant} text-white`}>
        <Modal.Title>{alertTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{alertMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return { showAlert, AlertModal };
};