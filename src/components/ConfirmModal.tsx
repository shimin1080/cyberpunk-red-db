import React from 'react';
import './ItemFormModal.css';

interface Props {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<Props> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <h2 className="cyber-font" style={{ color: '#ff5555' }}>WARNING</h2>
        <p style={{ margin: '20px 0', whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn danger" onClick={onConfirm}>DELETE</button>
          <button className="btn" onClick={onCancel}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};
