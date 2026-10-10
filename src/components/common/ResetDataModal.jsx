import React, { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { storage } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

export default function ResetDataModal({ isOpen, onClose, onResetComplete }) {
  const [isResetting, setIsResetting] = useState(false);
  const { showToast } = useToast();

  const handleConfirmReset = () => {
    setIsResetting(true);
    try {
      const success = storage.clearAllSheSyncData();
      if (success) {
        showToast('All SheSync demo data has been safely cleared.', 'success');
        if (onResetComplete) onResetComplete();
      } else {
        showToast('Unable to clear data completely.', 'error');
      }
    } catch (err) {
      showToast('An error occurred while resetting.', 'error');
    } finally {
      setIsResetting(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset SheSync Demo Data"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={isResetting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirmReset} disabled={isResetting}>
            <RotateCcw size={16} />
            {isResetting ? 'Resetting...' : 'Yes, Reset Data'}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'var(--accent-amber-subtle)', borderRadius: 'var(--radius-md)' }}>
          <AlertTriangle size={24} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <strong>This will reset only SheSync demo data:</strong>
            <ul style={{ marginTop: '6px', paddingLeft: '18px', lineHeight: 1.5 }}>
              <li>Cycle dates & symptom logs</li>
              <li>Shopping cart items & simulated orders</li>
              <li>Demo doctor appointment bookings</li>
              <li>Saved article bookmarks</li>
            </ul>
          </div>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          All other browser data and unrelated websites will remain completely untouched.
        </p>
      </div>
    </Modal>
  );
}
