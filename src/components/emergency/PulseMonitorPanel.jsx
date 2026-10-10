import React from 'react';
import { 
  Activity, 
  Heart, 
  Bluetooth, 
  AlertTriangle, 
  Info, 
  Play, 
  Pause, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  WifiOff
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import './PulseMonitorPanel.css';

export default function PulseMonitorPanel() {
  const { 
    pulseState, 
    isBleSupported,
    connectRealWearable, 
    disconnectRealWearable,
    startSimulatedPulseDemo,
    stopSimulatedPulseDemo,
    triggerFaintingDemo
  } = useEmergency();

  // Waveform calculation
  const history = pulseState.history || [];
  const hasReadings = history.length > 0 && pulseState.bpm !== null;

  let points = '0,40 300,40';
  if (hasReadings && history.length > 1) {
    const minVal = Math.min(...history, 40);
    const maxVal = Math.max(...history, 120);
    const range = maxVal - minVal || 1;

    points = history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * 300;
      const y = 80 - ((val - minVal) / range) * 60;
      return `${x},${y}`;
    }).join(' ');
  }

  // Connection State Badge helper
  const renderConnectionBadge = () => {
    switch (pulseState.connectionStatus) {
      case 'unsupported':
        return (
          <span className="badge badge-unsupported" title="Web Bluetooth not supported">
            <WifiOff size={12} /> Browser / Bluetooth Unsupported
          </span>
        );
      case 'ready':
        return (
          <span className="badge badge-ready" title="Ready to pair Bluetooth monitor">
            <Bluetooth size={12} /> Ready to Connect (BLE)
          </span>
        );
      case 'waiting_selection':
        return (
          <span className="badge badge-amber" title="Selecting device from browser picker">
            <Bluetooth size={12} /> Waiting for Device Selection...
          </span>
        );
      case 'connecting':
        return (
          <span className="badge badge-amber" title="Connecting to GATT server">
            <Bluetooth size={12} /> Connecting to Device...
          </span>
        );
      case 'connected_waiting':
        return (
          <span className="badge badge-amber" title="Connected. Waiting for first measurement">
            <Radio size={12} /> Connected — Waiting for First Reading
          </span>
        );
      case 'connected_receiving':
        return (
          <span className="badge badge-sage" title="Receiving real heart rate measurements">
            <Radio size={12} /> Connected — Receiving Real Measurements
          </span>
        );
      case 'disconnected':
        return (
          <span className="badge badge-tertiary" title="Bluetooth device disconnected">
            <Bluetooth size={12} /> Disconnected
          </span>
        );
      case 'permission_denied':
        return (
          <span className="badge badge-rose" title="Permission denied or cancelled">
            <XCircle size={12} /> Permission Denied / Cancelled
          </span>
        );
      case 'device_unavailable':
        return (
          <span className="badge badge-rose" title="Device unavailable or Bluetooth off">
            <AlertTriangle size={12} /> Device Unavailable / BT Off
          </span>
        );
      case 'connection_failed':
        return (
          <span className="badge badge-rose" title="Connection to GATT failed">
            <XCircle size={12} /> Connection Failed
          </span>
        );
      case 'simulated_active':
        return (
          <span className="badge badge-demo" title="Explicit Demonstration Mode">
            <Sparkles size={12} /> SIMULATED DEMO — NOT A REAL MEASUREMENT
          </span>
        );
      default:
        return (
          <span className="badge badge-tertiary">
            <Bluetooth size={12} /> Standby
          </span>
        );
    }
  };

  const isRealConnected = pulseState.mode === 'real' && (pulseState.connectionStatus === 'connected_receiving' || pulseState.connectionStatus === 'connected_waiting');
  const isDemo = pulseState.mode === 'simulated';
  const isStale = pulseState.isStale && !isDemo;

  const isLow = pulseState.bpm !== null && pulseState.bpm < 55;
  const isHigh = pulseState.bpm !== null && pulseState.bpm > 100;

  return (
    <div className={`pulse-monitor-panel ${isLow ? 'pulse-warning-state' : ''}`}>
      {/* Header */}
      <div className="pulse-header">
        <div className="pulse-title-group">
          <Activity size={22} className="pulse-icon" />
          <div>
            <h3 className="pulse-title">Pulse & Heart-Rate Telemetry Monitor</h3>
            <span className="pulse-subtitle">
              Standard Bluetooth GATT Heart Rate Service (0x180D) & syncope first-aid support
            </span>
          </div>
        </div>

        <div className="badge-wrapper">
          {renderConnectionBadge()}
        </div>
      </div>

      {/* Prominent Mode Banner */}
      {isDemo && (
        <div className="demo-warning-banner" role="alert">
          <Sparkles size={16} className="banner-icon" />
          <div className="banner-text">
            <strong>SIMULATED DEMO MODE ACTIVE:</strong> The pulse numbers and waveform shown below are artificially generated for hackathon evaluation purposes. They are <strong>NOT genuine measurements</strong> from your body.
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={stopSimulatedPulseDemo}
          >
            Exit Demo Mode
          </button>
        </div>
      )}

      {isRealConnected && (
        <div className="real-connected-banner">
          <CheckCircle2 size={16} color="var(--accent-sage)" />
          <span>
            Connected to <strong>{pulseState.deviceName || 'Bluetooth Heart Rate Monitor'}</strong> via GATT Service <code>0x180D</code>.
          </span>
        </div>
      )}

      {/* Telemetry Readout & Waveform Grid */}
      <div className="pulse-readout-grid">
        {/* Left: BPM Display Card */}
        <div className={`bpm-display-card ${isStale ? 'stale-card' : ''}`}>
          <div className="heart-icon-wrapper">
            <Heart 
              size={30} 
              className={`heart-svg ${pulseState.bpm && !isStale ? 'heart-beat' : ''}`}
              style={{ animationDuration: pulseState.bpm ? `${60 / Math.max(40, pulseState.bpm)}s` : '1s' }}
            />
          </div>

          <div className="bpm-number-group">
            {pulseState.bpm !== null ? (
              <>
                <span className={`bpm-value ${isStale ? 'stale-text' : ''}`}>{pulseState.bpm}</span>
                <span className="bpm-unit">BPM</span>
              </>
            ) : (
              <span className="bpm-placeholder">--</span>
            )}
          </div>

          {/* Status Label */}
          <div className="bpm-status-tag">
            {isStale && pulseState.bpm !== null ? (
              <span className="status-stale">⚠️ Stale Reading (Disconnected)</span>
            ) : pulseState.bpm === null ? (
              <span className="status-waiting">
                {pulseState.connectionStatus === 'connected_waiting' 
                  ? 'Awaiting first packet...' 
                  : isBleSupported 
                    ? 'Device Not Connected' 
                    : 'Bluetooth Unsupported'}
              </span>
            ) : isLow ? (
              <span className="status-warning">⚠️ Low Pulse (Bradycardia / Syncope Drop)</span>
            ) : isHigh ? (
              <span className="status-elevated">⚡ Elevated Pulse (Tachycardia)</span>
            ) : (
              <span className="status-normal">✓ Typical Resting Rhythm (60–100)</span>
            )}
          </div>

          {/* Meta Details */}
          <div className="telemetry-meta">
            <span>HRV: <strong>{pulseState.hrv ? `${pulseState.hrv} ms` : 'N/A'}</strong></span>
            <span>•</span>
            <span>Latest: <strong>{pulseState.lastUpdated || 'None'}</strong></span>
          </div>
        </div>

        {/* Right: Waveform Trend Card */}
        <div className="pulse-waveform-card">
          <div className="waveform-header">
            <div className="waveform-label-group">
              <span className="waveform-label">Live Waveform Trend</span>
              {isDemo && <span className="waveform-sub-tag">(Simulated)</span>}
              {isRealConnected && <span className="waveform-sub-tag real">(GATT Telemetry)</span>}
            </div>
            <span className="waveform-window">
              {hasReadings ? `${history.length} data points` : 'Awaiting data stream'}
            </span>
          </div>

          <div className="svg-container">
            {hasReadings ? (
              <svg viewBox="0 0 300 80" className="waveform-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-rose)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent-rose)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="var(--accent-rose)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                <polygon
                  fill="url(#waveGradient)"
                  points={`0,80 ${points} 300,80`}
                />
              </svg>
            ) : (
              <div className="waveform-empty-state">
                <Activity size={24} color="var(--text-tertiary)" />
                <span>Connect a Bluetooth monitor or start the simulated demo to view live waveform</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="pulse-controls-bar">
        {/* Real Device Actions */}
        <div className="real-device-actions">
          {!isRealConnected ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={connectRealWearable}
              disabled={pulseState.connectionStatus === 'connecting'}
              aria-label="Connect Heart-Rate Monitor via Bluetooth"
            >
              <Bluetooth size={16} />
              <span>
                {pulseState.connectionStatus === 'connecting' 
                  ? 'Connecting...' 
                  : pulseState.connectionStatus === 'disconnected' || pulseState.connectionStatus === 'connection_failed'
                    ? 'Reconnect Heart-Rate Monitor'
                    : 'Connect Heart-Rate Monitor'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={disconnectRealWearable}
              aria-label="Disconnect Bluetooth Heart-Rate Monitor"
            >
              <WifiOff size={15} />
              <span>Disconnect {pulseState.deviceName || 'Device'}</span>
            </button>
          )}
        </div>

        {/* Demo Mode Actions */}
        <div className="demo-actions-group">
          {!isDemo ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={startSimulatedPulseDemo}
              title="Launch explicitly labelled simulated pulse demonstration"
            >
              <Sparkles size={14} />
              <span>Start Simulated Demo</span>
            </button>
          ) : (
            <div className="demo-active-buttons">
              <button
                type="button"
                className={`btn btn-sm ${pulseState.isFaintingSimulation ? 'btn-danger' : 'btn-secondary'}`}
                onClick={triggerFaintingDemo}
                title="Demonstrate sudden bradycardia pulse drop (48 BPM)"
              >
                <AlertTriangle size={14} />
                <span>{pulseState.isFaintingSimulation ? 'Reset Normal BPM' : 'Simulate Fainting Drop (48 BPM)'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={stopSimulatedPulseDemo}
              >
                <span>Stop Demo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Browser Compatibility & Privacy Guidelines */}
      <div className="ble-compatibility-note">
        <Info size={15} className="note-icon" />
        <div className="note-text">
          <strong>Browser & Hardware Requirements:</strong>
          <span> Web Bluetooth requires a compatible BLE device (e.g., Polar H10, Garmin HRM-Dual, Coospo, Wahoo TICKR), HTTPS or localhost context, and Google Chrome or Microsoft Edge on Windows, Mac, or Android. Note that Apple Safari on iOS does not support Web Bluetooth natively. No heart-rate streams are stored in local storage or uploaded to remote cloud servers.</span>
        </div>
      </div>

      {/* Critical Medical & Diagnostic Disclaimers */}
      <div className="pulse-disclaimer-card">
        <ShieldAlert size={18} className="disclaimer-icon" />
        <div className="disclaimer-content">
          <strong>Strict Non-Diagnostic Clinical Disclaimers:</strong>
          <ul className="disclaimer-list">
            <li>
              <strong>Non-Diagnostic Monitoring:</strong> Heart-rate readings do <em>not</em> diagnose low blood pressure, hypoglycemia, pre-eclampsia, or placental complications. A normal heart-rate <em>does not</em> rule out an obstetric emergency.
            </li>
            <li>
              <strong>Fainting & Syncope Advisory:</strong> A heart-rate monitor alone cannot establish whether a person has fainted or lost consciousness. If someone feels faint or is unresponsive, lay them on their <strong>Left Side</strong> immediately and call <strong>112 / 108</strong> without delay.
            </li>
            <li>
              <strong>Emergency Assistance Unconditional:</strong> Emergency SOS assistance is always accessible and <em>never</em> requires a Bluetooth device.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
