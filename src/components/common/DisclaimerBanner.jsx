import React, { useState } from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import Modal from './Modal';
import './DisclaimerBanner.css';

export default function DisclaimerBanner() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <aside className="disclaimer-banner" aria-label="Medical and Demo Disclaimer">
        <div className="disclaimer-content">
          <AlertCircle size={15} className="disclaimer-icon" />
          <span className="disclaimer-text">
            <strong>Wellness & Educational Demo:</strong> Predictions are estimates for tracking only. Not intended for contraception or medical diagnosis. Shopping & Appointments run in safe simulation mode.
          </span>
        </div>
        <button 
          className="disclaimer-btn" 
          onClick={() => setShowModal(true)}
          aria-label="View disclaimer details"
        >
          Details
        </button>
      </aside>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Important Disclaimers & Ethics Notice"
        footer={
          <button className="btn btn-primary" onClick={() => setShowModal(false)}>
            I Understand
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', lineHeight: 1.55 }}>
          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
              <ShieldCheck size={18} /> 1. Menstrual & Fertility Estimates
            </h4>
            <p>
              SheSync uses mathematical rhythm calculations based on standard cycle parameters. Every body is unique; cycle length can vary due to stress, hormonal shifts, and sleep. <strong>Do not use ovulation estimates as natural contraception or pregnancy prevention.</strong>
            </p>
          </div>

          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
              <ShieldCheck size={18} /> 2. Safe Simulated Features (Demo Mode)
            </h4>
            <p>
              The <strong>Shopping</strong> store and <strong>Appointments</strong> booking features are educational simulations. No actual monetary payments are processed, no real bank cards are charged, and no real hospital bookings are created without verified tele-health partnerships.
            </p>
          </div>

          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
              <ShieldCheck size={18} /> 3. Privacy-First Local Storage
            </h4>
            <p>
              All your cycle logs, cart items, and booked demo appointments are stored <strong>100% locally on your device</strong> using browser storage. No health telemetry or personal data is transmitted to external cloud servers.
            </p>
          </div>

          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
              <ShieldCheck size={18} /> 4. Transparent Algorithms (No Fake AI)
            </h4>
            <p>
              SheSync relies on deterministic clinical calendar methods and evidence-based lifestyle tips rather than unverified AI claims.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
