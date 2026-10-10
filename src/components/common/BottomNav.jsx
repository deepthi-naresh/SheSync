import React from 'react';
import { Sparkles, ShoppingBag, CalendarDays, BookOpen } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'wellbeing', label: 'Wellbeing', icon: Sparkles },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'learn', label: 'Learn', icon: BookOpen },
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation Bar">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to ${tab.label} section`}
            >
              <div className={`bottom-nav-icon-box ${isActive ? 'active' : ''}`}>
                <Icon size={18} />
              </div>
              <span className="bottom-nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
