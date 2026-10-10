import React, { useState } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  ShieldAlert, 
  XCircle, 
  RotateCcw,
  Navigation,
  Info,
  ShieldCheck,
  Heart,
  Bluetooth,
  Activity
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useToast } from '../../context/ToastContext';
import { generateEmergencyMessage } from '../../utils/emergencyServices';
import './EmergencySOSPanel.css';

export default function EmergencySOSPanel() {
  const { 
    sosState, 
    pulseState,
    triggerSOS, 
    cancelSOS, 
    resetSOS, 
    fetchCoordinates, 
    contacts, 
    pregnancyProfile, 
    emergencyNumber 
  } = useEmergency();

  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];
  const notifyCount = contacts.filter((c) => c.notifyOnSOS).length;

  const currentMessage = generateEmergencyMessage({
    profile: pregnancyProfile,
    coordinates: sosState.coordinates,
    customNote: customNote || sosState.customNote,
    timestamp: sosState.activatedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });

  const handleCopyMessage = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentMessage);
      } else {
        // Fallback for older browsers / testing
        const textArea = document.createElement('textarea');
        textArea.value = currentMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast('Emergency SOS message copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      showToast('Could not copy message automatically. Please select text manually.', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: '🚨 SheSync Pregnancy Emergency SOS',
          text: currentMessage
        });
        showToast('Emergency broadcast shared successfully.', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyMessage();
        }
      }
    } else {
      handleCopyMessage();
    }
  };

  const mapsUrl = sosState.coordinates 
    ? `https://maps.google.com/?q=${sosState.coordinates.lat},${sosState.coordinates.lng}`
    : 'https://maps.google.com';

  const smsUrl = primaryContact 
    ? `sms:${primaryContact.phone}?body=${encodeURIComponent(currentMessage)}`
    : `sms:?body=${encodeURIComponent(currentMessage)}`;

  return (
    <div className={`sos-panel-card ${sosState.isActive ? 'sos-active-mode' : ''}`}>
      {/* Header Banner */}
      <div className="sos-panel-header">
        <div className="sos-title-badge-group">
          <div className={`sos-status-dot ${sosState.isActive ? 'active-pulse' : ''}`} />
          <h2 className="sos-panel-title">
            {sosState.isActive ? 'EMERGENCY SOS IS ACTIVE' : 'Instant Emergency SOS'}
          </h2>
        </div>
        <span className={`badge ${sosState.isActive ? 'badge-rose' : 'badge-plum'}`}>
          {sosState.isActive ? 'Active Broadcast' : 'Ready & Armed'}
        </span>
      </div>

      {/* Main SOS Trigger Area */}
      {!sosState.isActive ? (
        <div className="sos-idle-workflow">
          <p className="sos-lead-text">
            If you experience sudden fainting, acute pelvic pain, heavy bleeding, or severe distress, press the button below to activate instant emergency mode.
          </p>

          <div className="sos-button-wrapper">
            <button
              type="button"
              className="sos-master-btn"
              onClick={() => triggerSOS(customNote)}
              aria-label="Activate Emergency SOS"
            >
              <div className="sos-btn-ripple" aria-hidden="true" />
              <div className="sos-btn-inner">
                <AlertOctagon size={42} className="sos-btn-icon" />
                <span className="sos-btn-text">PRESS FOR SOS</span>
                <span className="sos-btn-sub">Instant Alert Broadcast</span>
              </div>
            </button>
          </div>

          {/* Quick Note Input */}
          <div className="sos-note-input-wrap">
            <label htmlFor="sos-quick-note" className="form-label" style={{ fontSize: '0.82rem' }}>
              Optional Emergency Context / Location Landmark (Included in SOS message):
            </label>
            <input
              id="sos-quick-note"
              type="text"
              className="form-input"
              placeholder="e.g., Felt faint in kitchen, 2nd floor, Apt 304..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Configuration Summary Pills */}
          <div className="sos-readiness-row">
            <div className="readiness-pill">
              <PhoneCall size={14} className="pill-icon" />
              <span>Helpline: <strong>{emergencyNumber}</strong></span>
            </div>
            <div className="readiness-pill">
              <ShieldCheck size={14} className="pill-icon" />
              <span>Contacts Ready: <strong>{notifyCount}</strong></span>
            </div>
            <div className="readiness-pill">
              <MapPin size={14} className="pill-icon" />
              <span>GPS Consent: <strong>{pregnancyProfile.shareLocationOnSOS ? 'Enabled' : 'Disabled'}</strong></span>
            </div>
            <div className="readiness-pill">
              <Bluetooth size={14} className="pill-icon" />
              <span>
                BLE Heart Monitor: <strong>{
                  pulseState.mode === 'real' && (pulseState.connectionStatus === 'connected_receiving' || pulseState.connectionStatus === 'connected_waiting')
                    ? 'Connected (Optional)'
                    : pulseState.mode === 'simulated'
                      ? 'Demo Stream Active'
                      : 'Standby (Optional)'
                }</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Active Emergency State */
        <div className="sos-active-workflow">
          <div className="sos-active-alert-box">
            <div className="active-icon-banner">
              <ShieldAlert size={28} />
              <div>
                <h3 className="active-alert-heading">Emergency State Active</h3>
                <span className="active-timestamp">Triggered: {sosState.activatedAt}</span>
              </div>
            </div>

            <p className="active-instruction">
              Stay calm. Please contact emergency ambulance (112) or your primary contact immediately. If feeling faint, lie on your <strong>Left Side</strong>.
            </p>
          </div>

          {/* Primary 1-Click Call Actions */}
          <div className="sos-call-actions-grid">
            <a 
              href={`tel:${emergencyNumber}`} 
              className="btn btn-emergency-call"
              aria-label={`Call Emergency Services ${emergencyNumber}`}
            >
              <PhoneCall size={20} />
              <span>Call Emergency {emergencyNumber}</span>
            </a>

            {primaryContact && (
              <a 
                href={`tel:${primaryContact.phone}`} 
                className="btn btn-primary-call"
                aria-label={`Call primary contact ${primaryContact.name}`}
              >
                <PhoneCall size={18} />
                <span>Call {primaryContact.name}</span>
              </a>
            )}
          </div>

          {/* Location Information Card */}
          <div className="sos-location-card">
            <div className="location-card-header">
              <div className="location-card-title">
                <MapPin size={16} color="var(--accent-rose)" />
                <span>Your Location Status</span>
              </div>
              <button 
                type="button" 
                className="btn-link-action"
                onClick={fetchCoordinates}
                disabled={sosState.locationLoading}
              >
                <Navigation size={13} />
                <span>{sosState.locationLoading ? 'Locating...' : 'Refresh GPS'}</span>
              </button>
            </div>

            {sosState.coordinates ? (
              <div className="location-details">
                <div className="coords-text">
                  <span>Coordinates: <strong>{sosState.coordinates.lat.toFixed(5)}, {sosState.coordinates.lng.toFixed(5)}</strong></span>
                  {sosState.coordinates.accuracy && (
                    <span className="coords-accuracy"> (Accuracy: ±{Math.round(sosState.coordinates.accuracy)}m)</span>
                  )}
                </div>
                <a 
                  href={mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-open-map"
                >
                  <ExternalLink size={14} />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            ) : sosState.locationError ? (
              <div className="location-warning">
                <Info size={15} />
                <span>{sosState.locationError} You can still share your message manually with local landmarks.</span>
              </div>
            ) : (
              <div className="location-pending">
                <span>Fetching GPS coordinates with your consent...</span>
              </div>
            )}
          </div>

          {/* Pre-Formatted Emergency Message Box */}
          <div className="sos-message-preview-card">
            <div className="message-header-row">
              <span className="message-title">Formatted Emergency Message</span>
              <div className="message-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={handleCopyMessage}
                >
                  {copied ? <Check size={14} color="var(--accent-sage)" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Message'}</span>
                </button>

                <a 
                  href={smsUrl} 
                  className="btn btn-secondary btn-sm"
                  aria-label="Send via native SMS"
                >
                  <Share2 size={14} />
                  <span>Send SMS</span>
                </a>

                {typeof navigator !== 'undefined' && navigator.share && (
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={handleNativeShare}
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                )}
              </div>
            </div>

            <textarea 
              className="sos-message-textarea" 
              value={currentMessage} 
              readOnly 
              rows={6}
              aria-label="Formatted emergency dispatch text"
            />
          </div>

          {/* Transparent Dispatch Disclosure */}
          <div className="sos-transparent-banner">
            <Info size={15} className="banner-icon" />
            <div className="banner-text">
              <strong>Transparent System Status:</strong> {sosState.lastDispatchReport?.mode === 'live_backend'
                ? sosState.lastDispatchReport.message
                : 'Demo / Client-Only Mode. In this local browser environment, please tap "Call Emergency 112" or "Copy Message / Send SMS" to reach responders.'}
            </div>
          </div>

          {/* Accidental Activation / Cancel Safe Flow */}
          <div className="sos-cancel-section">
            {!showConfirmCancel ? (
              <button 
                type="button" 
                className="btn btn-outline-danger"
                onClick={() => setShowConfirmCancel(true)}
              >
                <XCircle size={16} />
                <span>I Am Safe / Cancel Emergency SOS</span>
              </button>
            ) : (
              <div className="cancel-confirm-box">
                <p>Are you sure you want to cancel this emergency alert and return to safe standby?</p>
                <div className="cancel-btn-group">
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      cancelSOS();
                      setShowConfirmCancel(false);
                    }}
                  >
                    Yes, Cancel Alert
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowConfirmCancel(false)}
                  >
                    Keep Alert Active
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancelled Return to Standby State */}
      {sosState.status === 'cancelled' && (
        <div className="sos-cancelled-banner">
          <span>Alert was cancelled. Status is safe.</span>
          <button type="button" className="btn btn-sm btn-secondary" onClick={resetSOS}>
            <RotateCcw size={13} />
            <span>Reset to Standby</span>
          </button>
        </div>
      )}
    </div>
  );
}
