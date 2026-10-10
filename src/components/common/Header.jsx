import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  ShoppingBag, 
  CalendarDays, 
  BookOpen, 
  ShieldAlert,
  Moon, 
  Sun, 
  RotateCcw, 
  ShieldCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ResetDataModal from './ResetDataModal';
import './Header.css';

export default function Header({ activeTab, setActiveTab, onResetComplete }) {
  const { theme, toggleTheme } = useTheme();
  const [showResetModal, setShowResetModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { 
      id: 'wellbeing', 
      label: 'Periods & Wellbeing', 
      shortLabel: 'Wellbeing',
      icon: Sparkles,
      desc: 'Cycle tracking, symptom log & health report'
    },
    { 
      id: 'shop', 
      label: 'Wellness Store', 
      shortLabel: 'Shop',
      icon: ShoppingBag,
      desc: 'Period care, comfort picks & essentials'
    },
    { 
      id: 'appointments', 
      label: 'Doctor Appointments', 
      shortLabel: 'Appointments',
      icon: CalendarDays,
      desc: 'Specialist discovery & consultation bookings'
    },
    { 
      id: 'learn', 
      label: 'Learn & Support', 
      shortLabel: 'Learn',
      icon: BookOpen,
      desc: 'Evidence-based guides, quiz & helplines'
    },
    { 
      id: 'emergency', 
      label: 'Emergency Care & SOS', 
      shortLabel: 'Emergency SOS',
      icon: ShieldAlert,
      desc: 'Instant SOS alert, pulse monitor & nearby hospital triage'
    },
  ];

  // Close mobile menu on escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="app-header">
        <div className="app-container header-inner">
          {/* Brand Logo (Semantic Accessible Button) */}
          <button 
            className="header-brand" 
            onClick={() => handleSelectTab('wellbeing')}
            aria-label="SheSync Home - Go to Wellbeing module"
          >
            <div className="brand-icon-wrapper" aria-hidden="true">
              <HeartHandshake size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-title">SheSync</span>
              <span className="brand-tagline">Your cycle. Your care. Your space.</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="header-nav" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} />
                  <span>{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="header-actions">
            <div className="privacy-pill" title="100% Client-Side Private Storage">
              <ShieldCheck size={14} />
              <span>Private Local Mode</span>
            </div>

            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="reset-trigger-btn"
              onClick={() => setShowResetModal(true)}
              aria-label="Reset Demo Data"
              title="Reset SheSync Demo Data"
            >
              <RotateCcw size={17} />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            id="mobile-nav-drawer" 
            className="mobile-menu-drawer"
            role="dialog"
            aria-label="Mobile Navigation Menu"
          >
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Switch Module</span>
              <span className="badge badge-plum">All 5 Sections</span>
            </div>

            <div className="mobile-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className={`mobile-nav-icon-wrap ${isActive ? 'active' : ''}`}>
                      <Icon size={20} />
                    </div>
                    <div className="mobile-nav-text">
                      <div className="mobile-nav-label-row">
                        <span className="mobile-nav-label">{item.label}</span>
                        {isActive && <span className="mobile-active-badge">Active</span>}
                      </div>
                      <span className="mobile-nav-desc">{item.desc}</span>
                    </div>
                    <ChevronRight size={16} className="mobile-nav-chevron" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <ResetDataModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onResetComplete={onResetComplete}
      />
    </>
  );
}
