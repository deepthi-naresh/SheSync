import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  Search, 
  X, 
  Filter, 
  UserCheck, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Video, 
  MapPin, 
  RotateCcw, 
  AlertCircle, 
  Sparkles, 
  CalendarPlus 
} from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { useToast } from '../../context/ToastContext';
import { 
  DOCTORS_CATALOG, 
  DOCTOR_SPECIALTIES, 
  CONSULTATION_MODES, 
  filterDoctors 
} from '../../data/doctorsData';
import { generateICSContent } from '../../utils/calendarExport';

import DoctorCard from './DoctorCard';
import DoctorDetailModal from './DoctorDetailModal';
import BookingModal from './BookingModal';
import AppointmentCard from './AppointmentCard';
import RescheduleModal from './RescheduleModal';
import CancelModal from './CancelModal';
import './AppointmentsUI.css';

export default function AppointmentsView() {
  const { upcomingAppointments, pastAppointments } = useAppointments();
  const { showToast } = useToast();

  // Active top-level tab: 'find' (Find Specialists) vs 'my_consultations' (My Consultations)
  const [activeTab, setActiveTab] = useState('find');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');

  // Active consultations sub-tab: 'upcoming' vs 'past'
  const [consultationsSubTab, setConsultationsSubTab] = useState('upcoming');

  // Modal target states
  const [detailDoctor, setDetailDoctor] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [cancelAppointmentTarget, setCancelAppointmentTarget] = useState(null);

  // Compute filtered doctor list using pure helper
  const filteredDoctors = useMemo(() => {
    return filterDoctors({
      query: searchQuery,
      specialty: selectedSpecialty,
      mode: selectedMode
    });
  }, [searchQuery, selectedSpecialty, selectedMode]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedSpecialty !== 'all' || selectedMode !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedMode('all');
  };

  // 1-Click RFC 5545 Calendar File Export Handler
  const handleExportCalendar = (appointment) => {
    try {
      if (!appointment) return;
      const icsString = generateICSContent(appointment);

      // Create browser Blob and trigger download
      const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `shesync-demo-consultation-${appointment.id}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast(`Calendar invite (.ics) downloaded for ${appointment.doctorName}!`, 'success');
    } catch (err) {
      console.error('[SheSync Calendar Export Error]:', err);
      showToast('Failed to generate calendar file. Please try again.', 'error');
    }
  };

  return (
    <div className="module-view app-container">
      {/* Module Hero Section */}
      <section className="module-hero">
        <div className="hero-tag">
          <span className="badge badge-lavender">
            <CalendarDays size={13} /> Module 3: Consultations
          </span>
          <span className="badge badge-amber">Simulated Demo Mode</span>
        </div>
        <h1 className="hero-title">Specialist Consultations & Care</h1>
        <p className="hero-description">
          Explore simulated specialist profiles across women’s health, test tele-consultation booking workflows, and manage scheduled consultations in safe demonstration mode.
        </p>
      </section>

      {/* Demo Simulation Notice Banner */}
      <div className="demo-disclaimer-box" style={{ marginBottom: 'var(--space-lg)' }}>
        <ShieldCheck size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Educational Demonstration Only:</strong> Specialist profiles, consultation slots, and telehealth booking workflows are demonstration simulations created for the SITAMS × HackSphere hackathon. No real doctors, clinics, telemedicine services, or financial transactions are involved.
        </div>
      </div>

      {/* Top View Switcher Tabs */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '8px', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '12px',
          marginBottom: 'var(--space-lg)'
        }}
        role="tablist"
        aria-label="Appointments View Selection"
      >
        <button
          className={`btn ${activeTab === 'find' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('find')}
          role="tab"
          aria-selected={activeTab === 'find'}
          aria-controls="find-specialists-panel"
          id="tab-find-specialists"
        >
          <Search size={15} /> Find Specialists ({filteredDoctors.length})
        </button>

        <button
          className={`btn ${activeTab === 'my_consultations' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('my_consultations')}
          role="tab"
          aria-selected={activeTab === 'my_consultations'}
          aria-controls="my-consultations-panel"
          id="tab-my-consultations"
        >
          <CalendarDays size={15} /> My Consultations
          {upcomingAppointments.length > 0 && (
            <span 
              className="badge badge-sage" 
              style={{ marginLeft: '4px', fontSize: '0.72rem', padding: '2px 7px' }}
            >
              {upcomingAppointments.length} Active
            </span>
          )}
        </button>
      </div>

      {/* ====================================================================
          TAB 1: FIND SPECIALISTS
          ==================================================================== */}
      {activeTab === 'find' && (
        <div id="find-specialists-panel" role="tabpanel" aria-labelledby="tab-find-specialists">
          {/* Search Bar & Mode Filter Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Keyword Search Input */}
              <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search 
                  size={16} 
                  color="var(--text-tertiary)" 
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
                />
                <input
                  type="text"
                  className="input-text-custom"
                  style={{ width: '100%', paddingLeft: '38px', paddingRight: searchQuery ? '36px' : '14px' }}
                  placeholder="Search by doctor name, specialty, or condition (e.g. PCOS, pregnancy, cramps)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search specialists by name, specialty, or clinical keyword"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', padding: '4px' }}
                    aria-label="Clear search text"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Consultation Mode Filter Pill Toggle */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {CONSULTATION_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    className={`btn ${selectedMode === mode.id ? 'btn-secondary' : 'btn-outline'}`}
                    style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                    onClick={() => setSelectedMode(mode.id)}
                    aria-pressed={selectedMode === mode.id}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty Filter Chips Carousel */}
            <div 
              style={{ 
                display: 'flex', 
                gap: '8px', 
                overflowX: 'auto', 
                paddingBottom: '4px',
                scrollbarWidth: 'none'
              }}
              role="group"
              aria-label="Filter by medical specialty"
            >
              {DOCTOR_SPECIALTIES.map((spec) => (
                <button
                  key={spec.id}
                  className={`phase-chip ${selectedSpecialty === spec.id ? 'active' : ''}`}
                  onClick={() => setSelectedSpecialty(spec.id)}
                  style={{ whiteSpace: 'nowrap' }}
                  aria-pressed={selectedSpecialty === spec.id}
                >
                  {spec.label}
                </button>
              ))}
            </div>

            {/* Filter Summary & Clear Action */}
            {hasActiveFilters && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Showing <strong>{filteredDoctors.length}</strong> of {DOCTORS_CATALOG.length} specialists
                </span>
                <button 
                  className="btn btn-ghost" 
                  style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                  onClick={handleClearFilters}
                >
                  <RotateCcw size={13} /> Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Doctor Cards Grid */}
          {filteredDoctors.length > 0 ? (
            <div className="grid-2">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewProfile={(doc) => setDetailDoctor(doc)}
                  onBookAppointment={(doc) => setBookingDoctor(doc)}
                />
              ))}
            </div>
          ) : (
            /* Empty State for Doctor Search */
            <div className="solid-card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                No specialists found
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto var(--space-md)' }}>
                No specialist profiles matched your query "{searchQuery}". Try searching for terms like "PCOS", "period", "nutrition", or resetting your filters.
              </p>
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                <RotateCcw size={15} /> Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          TAB 2: MY CONSULTATIONS
          ==================================================================== */}
      {activeTab === 'my_consultations' && (
        <div id="my-consultations-panel" role="tabpanel" aria-labelledby="tab-my-consultations">
          {/* Sub-tabs: Upcoming vs Past/Cancelled */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)' }}>
            <button
              className={`phase-chip ${consultationsSubTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setConsultationsSubTab('upcoming')}
            >
              Upcoming Active ({upcomingAppointments.length})
            </button>
            <button
              className={`phase-chip ${consultationsSubTab === 'past' ? 'active' : ''}`}
              onClick={() => setConsultationsSubTab('past')}
            >
              Past & Cancelled ({pastAppointments.length})
            </button>
          </div>

          {/* UPCOMING ACTIVE APPOINTMENTS */}
          {consultationsSubTab === 'upcoming' && (
            <div>
              {upcomingAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onReschedule={(targetApt) => setRescheduleAppointment(targetApt)}
                      onCancel={(targetApt) => setCancelAppointmentTarget(targetApt)}
                      onExportCalendar={handleExportCalendar}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State: Zero Upcoming Consultations */
                <div className="solid-card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
                  <div style={{ width: '52px', height: '52px', margin: '0 auto var(--space-sm)', background: 'var(--accent-primary-subtle)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    <CalendarDays size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    No Upcoming Consultations
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto var(--space-md)' }}>
                    You haven't scheduled any demo specialist consultations yet. Explore our directory of 8 fictional specialists and test the scheduling workflow.
                  </p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('find')}>
                    <Search size={15} /> Explore Specialists
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PAST & CANCELLED APPOINTMENTS */}
          {consultationsSubTab === 'past' && (
            <div>
              {pastAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {pastAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onReschedule={() => {}}
                      onCancel={() => {}}
                      onExportCalendar={() => {}}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State: Zero Past Consultations */
                <div className="solid-card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
                  <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-sm)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                    <Calendar size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    No Past or Cancelled Consultations
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Cancelled demo appointments and past consultation records will appear in this archive.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          MODALS & DIALOGS
          ==================================================================== */}

      {/* 1. Doctor Profile Detail Modal */}
      {detailDoctor && (
        <DoctorDetailModal
          isOpen={true}
          doctor={detailDoctor}
          onClose={() => setDetailDoctor(null)}
          onBook={(doc) => {
            setDetailDoctor(null);
            setBookingDoctor(doc);
          }}
        />
      )}

      {/* 2. Booking Wizard Modal */}
      {bookingDoctor && (
        <BookingModal
          isOpen={true}
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onBookingSuccess={(newAppointment) => {
            setBookingDoctor(null);
            setActiveTab('my_consultations');
            setConsultationsSubTab('upcoming');
          }}
        />
      )}

      {/* 3. Reschedule Modal */}
      {rescheduleAppointment && (
        <RescheduleModal
          isOpen={true}
          appointment={rescheduleAppointment}
          onClose={() => setRescheduleAppointment(null)}
          onRescheduleSuccess={() => {
            setRescheduleAppointment(null);
          }}
        />
      )}

      {/* 4. Cancellation Confirmation Modal */}
      {cancelAppointmentTarget && (
        <CancelModal
          isOpen={true}
          appointment={cancelAppointmentTarget}
          onClose={() => setCancelAppointmentTarget(null)}
          onCancelSuccess={() => {
            setCancelAppointmentTarget(null);
          }}
        />
      )}
    </div>
  );
}
