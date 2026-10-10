import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { CycleProvider } from './context/CycleContext';
import { CartProvider } from './context/CartContext';
import { AppointmentProvider } from './context/AppointmentContext';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import DisclaimerBanner from './components/common/DisclaimerBanner';
import PeriodTrackerView from './components/period-tracker/PeriodTrackerView';
import ShoppingView from './components/shopping/ShoppingView';
import AppointmentsView from './components/appointments/AppointmentsView';
import LearnView from './components/learn/LearnView';
import Modal from './components/common/Modal';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';
import './App.css';

function MainApp({ onResetComplete }) {
  const [activeTab, setActiveTab] = useState('wellbeing');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const { showToast } = useToast();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Keyboard Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Top Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onResetComplete={onResetComplete}
      />

      {/* Active Tab View */}
      <main id="main-content" className="main-content" role="main">
        {activeTab === 'wellbeing' && <PeriodTrackerView />}
        {activeTab === 'shop' && <ShoppingView />}
        {activeTab === 'appointments' && <AppointmentsView />}
        {activeTab === 'learn' && <LearnView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-container footer-inner">
          <div className="footer-credit">
            <span>SheSync © 2026</span>
            <span>•</span>
            <span>Built for SITAMS × HackSphere</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-sage)' }}>
              <ShieldCheck size={14} /> 100% Client-Side Privacy
            </span>
          </div>

          <div className="footer-links">
            <button className="footer-link-btn" onClick={() => setShowAboutModal(true)}>
              About SheSync
            </button>
            <button className="footer-link-btn" onClick={() => {
              showToast('Export & backup features will unlock in Phase 6!', 'info');
            }}>
              Export Data
            </button>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About SheSync"
        footer={
          <button className="btn btn-primary" onClick={() => setShowAboutModal(false)}>
            Close
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem', lineHeight: 1.6 }}>
          <p>
            <strong>SheSync</strong> is an integrated, privacy-first women’s holistic health companion developed for the <strong>SITAMS × HackSphere</strong> hackathon.
          </p>
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <strong>Our Core Principles:</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
              <li><strong>Zero Cloud Tracking:</strong> All health logs stay strictly on your local device.</li>
              <li><strong>No Fake AI:</strong> Clear, deterministic clinical calendar formulas.</li>
              <li><strong>Transparent Simulation:</strong> Shopping and appointment booking are clearly marked as educational demonstrations.</li>
              <li><strong>Accessible Design:</strong> Responsive, high-contrast, mobile-first design system.</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  const handleResetComplete = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <CycleProvider key={`cycle-${resetKey}`}>
          <CartProvider key={`cart-${resetKey}`}>
            <AppointmentProvider key={`appointments-${resetKey}`}>
              <MainApp onResetComplete={handleResetComplete} />
            </AppointmentProvider>
          </CartProvider>
        </CycleProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
