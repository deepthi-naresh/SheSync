import React, { useState } from 'react';
import { 
  FileHeart, 
  Edit3, 
  Lock, 
  ShieldCheck, 
  Heart, 
  AlertCircle, 
  Check, 
  Droplet,
  Pill,
  UserCheck
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import './PregnancyProfileCard.css';

export default function PregnancyProfileCard() {
  const { pregnancyProfile, updatePregnancyProfile } = useEmergency();
  const { showToast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Form State
  const [weeksPregnant, setWeeksPregnant] = useState(pregnancyProfile.weeksPregnant || 24);
  const [dueDate, setDueDate] = useState(pregnancyProfile.dueDate || '');
  const [trimester, setTrimester] = useState(pregnancyProfile.trimester || '2nd Trimester');
  const [bloodGroup, setBloodGroup] = useState(pregnancyProfile.bloodGroup || 'O+');
  const [allergies, setAllergies] = useState(pregnancyProfile.allergies || '');
  const [medications, setMedications] = useState(pregnancyProfile.medications || '');
  const [doctorName, setDoctorName] = useState(pregnancyProfile.doctorName || '');
  const [doctorPhone, setDoctorPhone] = useState(pregnancyProfile.doctorPhone || '');

  // Consent Toggles
  const [shareStageOnSOS, setShareStageOnSOS] = useState(pregnancyProfile.shareStageOnSOS !== false);
  const [shareBloodGroupOnSOS, setShareBloodGroupOnSOS] = useState(pregnancyProfile.shareBloodGroupOnSOS !== false);
  const [shareAllergiesOnSOS, setShareAllergiesOnSOS] = useState(pregnancyProfile.shareAllergiesOnSOS !== false);
  const [shareLocationOnSOS, setShareLocationOnSOS] = useState(pregnancyProfile.shareLocationOnSOS !== false);
  const [shareDoctorInfoOnSOS, setShareDoctorInfoOnSOS] = useState(pregnancyProfile.shareDoctorInfoOnSOS !== false);

  const openModal = () => {
    setWeeksPregnant(pregnancyProfile.weeksPregnant || 24);
    setDueDate(pregnancyProfile.dueDate || '');
    setTrimester(pregnancyProfile.trimester || '2nd Trimester');
    setBloodGroup(pregnancyProfile.bloodGroup || 'O+');
    setAllergies(pregnancyProfile.allergies || '');
    setMedications(pregnancyProfile.medications || '');
    setDoctorName(pregnancyProfile.doctorName || '');
    setDoctorPhone(pregnancyProfile.doctorPhone || '');
    setShareStageOnSOS(pregnancyProfile.shareStageOnSOS !== false);
    setShareBloodGroupOnSOS(pregnancyProfile.shareBloodGroupOnSOS !== false);
    setShareAllergiesOnSOS(pregnancyProfile.shareAllergiesOnSOS !== false);
    setShareLocationOnSOS(pregnancyProfile.shareLocationOnSOS !== false);
    setShareDoctorInfoOnSOS(pregnancyProfile.shareDoctorInfoOnSOS !== false);
    setShowEditModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePregnancyProfile({
      weeksPregnant: Number(weeksPregnant),
      dueDate,
      trimester,
      bloodGroup,
      allergies,
      medications,
      doctorName,
      doctorPhone,
      shareStageOnSOS,
      shareBloodGroupOnSOS,
      shareAllergiesOnSOS,
      shareLocationOnSOS,
      shareDoctorInfoOnSOS
    });
    setShowEditModal(false);
  };

  const handleToggleConsent = (key, currentVal) => {
    updatePregnancyProfile({ [key]: !currentVal });
  };

  return (
    <div className="pregnancy-profile-card">
      {/* Header */}
      <div className="profile-card-header">
        <div className="profile-title-group">
          <FileHeart size={20} className="card-icon" />
          <div>
            <h3 className="card-title">Pregnancy Emergency Profile</h3>
            <span className="card-subtitle">
              Selective medical context shared strictly with emergency responders upon SOS activation
            </span>
          </div>
        </div>

        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={openModal}
          aria-label="Edit pregnancy emergency profile"
        >
          <Edit3 size={14} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Overview Details */}
      <div className="profile-details-grid">
        <div className="profile-item">
          <span className="item-label">Pregnancy Stage</span>
          <span className="item-val highlight">{pregnancyProfile.weeksPregnant} Weeks ({pregnancyProfile.trimester || 'Active'})</span>
          <span className="item-sub">Due Date: {pregnancyProfile.dueDate || 'Not set'}</span>
        </div>

        <div className="profile-item">
          <span className="item-label">
            <Droplet size={13} color="var(--accent-rose)" /> Blood Group
          </span>
          <span className="item-val">{pregnancyProfile.bloodGroup || 'Unknown'}</span>
          <span className="item-sub">Crucial for emergency transfusion</span>
        </div>

        <div className="profile-item">
          <span className="item-label">
            <Pill size={13} color="var(--accent-amber)" /> Allergies & Meds
          </span>
          <span className="item-val">{pregnancyProfile.allergies || 'None reported'}</span>
          <span className="item-sub">{pregnancyProfile.medications || 'No daily meds'}</span>
        </div>

        <div className="profile-item">
          <span className="item-label">
            <UserCheck size={13} color="var(--accent-sage)" /> Treating Obstetrician
          </span>
          <span className="item-val">{pregnancyProfile.doctorName || 'Not specified'}</span>
          <span className="item-sub">{pregnancyProfile.doctorPhone || 'No direct phone'}</span>
        </div>
      </div>

      {/* Selective Consent & Sharing Toggles */}
      <div className="consent-toggles-section">
        <h4 className="consent-section-title">
          <Lock size={15} />
          <span>Selective SOS Broadcast Consent (Privacy Controls)</span>
        </h4>

        <div className="consent-toggles-grid">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={pregnancyProfile.shareStageOnSOS !== false}
              onChange={() => handleToggleConsent('shareStageOnSOS', pregnancyProfile.shareStageOnSOS !== false)}
            />
            <span>Include Gestational Stage ({pregnancyProfile.weeksPregnant}w) in SOS message</span>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={pregnancyProfile.shareBloodGroupOnSOS !== false}
              onChange={() => handleToggleConsent('shareBloodGroupOnSOS', pregnancyProfile.shareBloodGroupOnSOS !== false)}
            />
            <span>Include Blood Group ({pregnancyProfile.bloodGroup}) in SOS message</span>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={pregnancyProfile.shareAllergiesOnSOS !== false}
              onChange={() => handleToggleConsent('shareAllergiesOnSOS', pregnancyProfile.shareAllergiesOnSOS !== false)}
            />
            <span>Include Allergies & Current Medications in SOS message</span>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={pregnancyProfile.shareLocationOnSOS !== false}
              onChange={() => handleToggleConsent('shareLocationOnSOS', pregnancyProfile.shareLocationOnSOS !== false)}
            />
            <span>Include GPS Location Coordinates in SOS message</span>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={pregnancyProfile.shareDoctorInfoOnSOS !== false}
              onChange={() => handleToggleConsent('shareDoctorInfoOnSOS', pregnancyProfile.shareDoctorInfoOnSOS !== false)}
            />
            <span>Include Obstetrician Contact in SOS message</span>
          </label>
        </div>
      </div>

      {/* Local Storage Privacy Advisory */}
      <div className="profile-privacy-advisory">
        <ShieldCheck size={15} className="advisory-icon" />
        <div className="advisory-text">
          <strong>Client-Side Storage Notice:</strong> This profile is stored locally in your browser (`shesync_pregnancy_profile`). It is never uploaded to remote ad servers. Please note that browser storage is private to this browser and will not synchronize automatically to other devices.
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Pregnancy Emergency Profile"
        footer={
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSave}
            >
              Save Profile
            </button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="profile-edit-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-weeks-input">Weeks Pregnant (Gestational Age)</label>
              <input 
                id="profile-weeks-input"
                type="number" 
                min="1" 
                max="44"
                className="form-input" 
                value={weeksPregnant}
                onChange={(e) => setWeeksPregnant(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-trimester-select">Trimester</label>
              <select
                id="profile-trimester-select"
                className="form-select"
                value={trimester}
                onChange={(e) => setTrimester(e.target.value)}
              >
                <option value="1st Trimester">1st Trimester (Weeks 1–12)</option>
                <option value="2nd Trimester">2nd Trimester (Weeks 13–26)</option>
                <option value="3rd Trimester">3rd Trimester (Weeks 27–40+)</option>
                <option value="Postpartum">Postpartum (0–6 Months)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-duedate-input">Estimated Due Date</label>
              <input 
                id="profile-duedate-input"
                type="date" 
                className="form-input" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-bloodgroup-select">Blood Group & Rh Factor</label>
              <select
                id="profile-bloodgroup-select"
                className="form-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
                <option value="Unknown">Unknown / Rh Negative</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-allergies-input">Known Allergies (Drugs, Latex, Food)</label>
            <input 
              id="profile-allergies-input"
              type="text" 
              className="form-input" 
              placeholder="e.g. Penicillin, Sulfa drugs, Latex..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-meds-input">Current Medications & Conditions</label>
            <input 
              id="profile-meds-input"
              type="text" 
              className="form-input" 
              placeholder="e.g. Folic acid 500mcg, Insulin for Gestational Diabetes..."
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-docname-input">Primary Obstetrician / Doctor Name</label>
              <input 
                id="profile-docname-input"
                type="text" 
                className="form-input" 
                placeholder="Dr. Ananya Sharma"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-docphone-input">Doctor's Emergency Contact</label>
              <input 
                id="profile-docphone-input"
                type="tel" 
                className="form-input" 
                placeholder="+919876543210"
                value={doctorPhone}
                onChange={(e) => setDoctorPhone(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
