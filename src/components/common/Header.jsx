import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  ShoppingBag, 
  CalendarDays, 
  BookOpen, 
  Moon, 
  Sun, 
  RotateCcw, 
  ShieldCheck 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ResetDataModal from './ResetDataModal';
import './Header.css';

export default function Header({ activeTab, setActiveTab, onResetComplete }) {
  const { theme, toggleTheme } = useTheme();
  const [showResetModal, setShowResetModal] = useState(false);

  const navItems = [
    { id: 'wellbeing', label: 'Wellbeing', icon: Sparkles },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'learn', label: 'Learn', icon: BookOpen },
  ];

  return (
    <>
      <header className="app-header">
        <div className="app-container header-inner">
          {/* Brand Logo (Semantic Accessible Button) */}
          <button 
            className="header-brand" 
            onClick={() => setActiveTab('wellbeing')}
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
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Actions */}
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
          </div>
        </div>
      </header>

      <ResetDataModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onResetComplete={onResetComplete}
      />
    </>
  );
}
