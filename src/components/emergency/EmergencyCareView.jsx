import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Users, 
  Activity, 
  Building2, 
  FileHeart, 
  BookHeart,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';
import EmergencySOSPanel from './EmergencySOSPanel';
import EmergencyContactsCard from './EmergencyContactsCard';
import PulseMonitorPanel from './PulseMonitorPanel';
import NearbyHospitalsCard from './NearbyHospitalsCard';
import PregnancyProfileCard from './PregnancyProfileCard';
import EmergencyGuidanceCard from './EmergencyGuidanceCard';
import { useEmergency } from '../../context/EmergencyContext';
import './EmergencyCareView.css';

export default function EmergencyCareView() {
  const { sosState } = useEmergency();
  const [activeSubTab, setActiveSubTab] = useState('all');

  const subTabs = [
    { id: 'all', label: 'Complete Overview', icon: Sparkles },
    { id: 'sos', label: 'Instant SOS', icon: AlertOctagon },
    { id: 'contacts', label: 'Emergency Contacts', icon: Users },
    { id: 'pulse', label: 'Pulse Telemetry', icon: Activity },
    { id: 'hospitals', label: 'Nearby Hospitals', icon: Building2 },
    { id: 'profile', label: 'Medical Profile', icon: FileHeart },
    { id: 'guidance', label: 'First-Aid Protocols', icon: BookHeart }
  ];

  return (
    <div className="emergency-view-wrapper">
      <div className="app-container">
        {/* Hero Section */}
        <section className="emergency-hero-card" aria-label="Emergency Care Overview">
          <div className="hero-content">
            <div className="hero-badge-row">
              <span className="badge badge-rose">
                <ShieldAlert size={12} /> Emergency Support Hub
              </span>
              <span className="badge badge-sage">
                100% Client-Side Private
              </span>
            </div>

            <h1 className="hero-heading">Pregnancy Emergency Care & SOS</h1>
            <p className="hero-description">
              Rapid assistance in acute maternal emergencies, sudden syncope/fainting episodes, or distress. Configure emergency contacts, broadcast your consent-filtered location, check pulse telemetry, and find verified hospital casualty units.
            </p>
          </div>

          <div className="hero-status-box">
            <div className={`status-orb ${sosState.isActive ? 'active-orb' : ''}`} />
            <div className="status-text-group">
              <span className="status-caption">SOS Broadcast System</span>
              <span className="status-state">
                {sosState.isActive ? '🚨 Active Emergency Broadcast' : '✓ Armed & Ready'}
              </span>
            </div>
          </div>
        </section>

        {/* Sub-Tabs Quick Filter Navigation */}
        <nav className="emergency-subnav" aria-label="Emergency Sub-Navigation">
          <div className="subnav-inner">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`subnav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveSubTab(tab.id)}
                  aria-pressed={isActive}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Layout */}
        <div className="emergency-content-layout">
          {/* Main SOS Panel (Always visible or in 'sos' / 'all' mode) */}
          {(activeSubTab === 'all' || activeSubTab === 'sos') && (
            <section id="section-sos" aria-label="Instant Emergency SOS Broadcast">
              <EmergencySOSPanel />
            </section>
          )}

          {/* Grid Layout for Other Modules */}
          <div className="emergency-cards-grid">
            {(activeSubTab === 'all' || activeSubTab === 'contacts') && (
              <section id="section-contacts" aria-label="Trusted Emergency Responders">
                <EmergencyContactsCard />
              </section>
            )}

            {(activeSubTab === 'all' || activeSubTab === 'pulse') && (
              <section id="section-pulse" aria-label="Pulse and Fainting Telemetry Monitor">
                <PulseMonitorPanel />
              </section>
            )}

            {(activeSubTab === 'all' || activeSubTab === 'hospitals') && (
              <section id="section-hospitals" aria-label="Nearby Maternity Emergency Hospitals">
                <NearbyHospitalsCard />
              </section>
            )}

            {(activeSubTab === 'all' || activeSubTab === 'profile') && (
              <section id="section-profile" aria-label="Pregnancy Emergency Profile">
                <PregnancyProfileCard />
              </section>
            )}

            {(activeSubTab === 'all' || activeSubTab === 'guidance') && (
              <section id="section-guidance" aria-label="Emergency First Aid and Red Flags">
                <EmergencyGuidanceCard />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
