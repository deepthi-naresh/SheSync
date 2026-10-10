import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Trash2, 
  Edit3, 
  Star, 
  ShieldCheck, 
  Check, 
  X,
  AlertCircle,
  BellRing
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import './EmergencyContactsCard.css';

export default function EmergencyContactsCard() {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    removeContact, 
    setPrimaryContact 
  } = useEmergency();

  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Partner / Spouse');
  const [isPrimary, setIsPrimary] = useState(false);
  const [notifyOnSOS, setNotifyOnSOS] = useState(true);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('+91');
    setRelationship('Partner / Spouse');
    setIsPrimary(contacts.length === 0);
    setNotifyOnSOS(true);
    setShowModal(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship || 'Partner / Spouse');
    setIsPrimary(!!contact.isPrimary);
    setNotifyOnSOS(contact.notifyOnSOS !== false);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please enter both name and phone number.', 'error');
      return;
    }

    if (editingContact) {
      const success = updateContact(editingContact.id, {
        name: name.trim(),
        phone: phone.trim(),
        relationship,
        isPrimary,
        notifyOnSOS
      });
      if (success) setShowModal(false);
    } else {
      const success = addContact({
        name: name.trim(),
        phone: phone.trim(),
        relationship,
        isPrimary,
        notifyOnSOS
      });
      if (success) setShowModal(false);
    }
  };

  return (
    <div className="emergency-contacts-card">
      <div className="contacts-card-header">
        <div className="contacts-title-group">
          <Users size={20} className="card-icon" />
          <div>
            <h3 className="card-title">Trusted Emergency Contacts</h3>
            <span className="card-subtitle">
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} configured for 1-click calls and SOS broadcasts
            </span>
          </div>
        </div>

        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={openAddModal}
          aria-label="Add new emergency contact"
        >
          <UserPlus size={15} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="contacts-list">
        {contacts.map((contact) => (
          <div 
            key={contact.id} 
            className={`contact-item-row ${contact.isPrimary ? 'primary-contact' : ''}`}
          >
            <div className="contact-main-info">
              <div className="contact-avatar">
                {contact.name.charAt(0).toUpperCase()}
              </div>

              <div className="contact-details">
                <div className="contact-name-row">
                  <span className="contact-name">{contact.name}</span>
                  {contact.isPrimary && (
                    <span className="badge badge-primary-contact" title="Primary emergency contact">
                      <Star size={11} /> Primary
                    </span>
                  )}
                  {contact.notifyOnSOS && (
                    <span className="badge badge-notify-on" title="Included in SOS message">
                      <BellRing size={11} /> SOS Alert
                    </span>
                  )}
                </div>

                <div className="contact-meta-row">
                  <span className="contact-phone">{contact.phone}</span>
                  <span className="meta-dot">•</span>
                  <span className="contact-relation">{contact.relationship}</span>
                </div>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="contact-actions">
              <a 
                href={`tel:${contact.phone}`} 
                className="btn-contact-action call-action" 
                title={`Call ${contact.name}`}
                aria-label={`Call ${contact.name}`}
              >
                <Phone size={15} />
                <span className="action-label">Call</span>
              </a>

              {!contact.isPrimary && (
                <button
                  type="button"
                  className="btn-contact-action star-action"
                  title="Make primary emergency contact"
                  onClick={() => setPrimaryContact(contact.id)}
                  aria-label={`Set ${contact.name} as primary contact`}
                >
                  <Star size={15} />
                </button>
              )}

              <button
                type="button"
                className="btn-contact-action edit-action"
                title="Edit contact"
                onClick={() => openEditModal(contact)}
                aria-label={`Edit ${contact.name}`}
              >
                <Edit3 size={15} />
              </button>

              <button
                type="button"
                className="btn-contact-action delete-action"
                title="Remove contact"
                onClick={() => removeContact(contact.id)}
                aria-label={`Delete ${contact.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="empty-contacts-state">
            <AlertCircle size={24} color="var(--accent-amber)" />
            <p>No emergency contacts added yet. Please add at least one trusted responder.</p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={openAddModal}>
              Add Contact Now
            </button>
          </div>
        )}
      </div>

      {/* Footer Consent Notice */}
      <div className="contacts-consent-notice">
        <ShieldCheck size={14} className="notice-icon" />
        <span>
          Emergency contacts are saved 100% locally in your browser storage. Your contact numbers are never sent to external servers or ad networks.
        </span>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        footer={
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSubmit}
            >
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label className="form-label" htmlFor="contact-name-input">Full Name / Identifier *</label>
            <input 
              id="contact-name-input"
              type="text" 
              className="form-input" 
              required
              placeholder="e.g. Kavita Sharma (Partner)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-phone-input">Phone Number (with Country Code) *</label>
            <input 
              id="contact-phone-input"
              type="tel" 
              className="form-input" 
              required
              placeholder="e.g. +919876543210" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-relation-select">Relationship</label>
            <select 
              id="contact-relation-select"
              className="form-select"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            >
              <option value="Partner / Spouse">Partner / Spouse</option>
              <option value="Primary Obstetrician">Primary Obstetrician / Doctor</option>
              <option value="Family Member">Family Member / Parent</option>
              <option value="Friend / Colleague">Friend / Colleague</option>
              <option value="Neighbor / Caregiver">Neighbor / Caregiver</option>
              <option value="Other Responder">Other Responder</option>
            </select>
          </div>

          <div className="checkbox-group" style={{ marginTop: '12px' }}>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
              />
              <span>Set as Primary Contact (Default 1-Click Call)</span>
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={notifyOnSOS}
                onChange={(e) => setNotifyOnSOS(e.target.checked)}
              />
              <span>Include this contact in Emergency SOS broadcast list</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
