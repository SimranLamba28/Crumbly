import { useState, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';

export const useConfirmation = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Confirm Action');
  const [resolvePromise, setResolvePromise] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setTitle(options.title || 'Confirm Action');
      setMessage(options.message || 'Are you sure you want to proceed?');
      setShow(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
    }
    setShow(false);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
    }
    setShow(false);
  }, [resolvePromise]);

  const ConfirmationModal = () => (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return { confirm, ConfirmationModal };
};
