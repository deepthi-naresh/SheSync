import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = '520px' }) {
  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    // Focus the modal container or first interactive element
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(focusableSelectors);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(focusableSelectors);
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedRef.current && previouslyFocusedRef.current.focus) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div 
        ref={modalRef}
        className="modal-container" 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h3 id={titleId} className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
