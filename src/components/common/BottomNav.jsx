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
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
