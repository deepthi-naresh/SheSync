import React, { useState } from 'react';
import { 
  BookHeart, 
  AlertTriangle, 
  HelpCircle, 
  PhoneCall, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import './EmergencyGuidanceCard.css';

export default function EmergencyGuidanceCard() {
  const { emergencyNumbersList, firstAidProtocols } = useEmergency();
  const [expandedProtocol, setExpandedProtocol] = useState('protocol-fainting');

  const faintingProtocol = firstAidProtocols.find((p) => p.id === 'protocol-fainting');
  const redFlagsProtocol = firstAidProtocols.find((p) => p.id === 'protocol-redflags');

  return (
    <div className="emergency-guidance-card">
      {/* Header */}
      <div className="guidance-card-header">
        <div className="guidance-title-group">
          <BookHeart size={20} className="card-icon" />
          <div>
            <h3 className="card-title">Emergency First-Aid & Red-Flag Guidance</h3>
            <span className="card-subtitle">
              Evidence-based clinical protocols compiled from WHO, MoHFW India, and RCOG guidelines
            </span>
          </div>
        </div>
      </div>

      {/* Verified National Helpline Quick Dialers */}
      <div className="helpline-quick-dialers">
        <span className="dialers-label">24/7 National Emergency Helplines (India):</span>
        <div className="dialers-grid">
          {emergencyNumbersList.map((helpline) => (
            <a 
              key={helpline.id}
              href={`tel:${helpline.number}`}
              className="helpline-pill"
              title={`${helpline.name}: ${helpline.desc}`}
            >
              <PhoneCall size={14} className="pill-call-icon" />
              <div className="pill-text-group">
                <span className="pill-num">{helpline.number}</span>
                <span className="pill-name">{helpline.name.split('(')[0]}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Accordion Protocols */}
      <div className="protocols-accordion">
        {/* 1. Fainting / Syncope Protocol */}
        {faintingProtocol && (
          <div className="protocol-block">
            <button
              type="button"
              className="protocol-trigger-btn"
              onClick={() => setExpandedProtocol(expandedProtocol === 'protocol-fainting' ? '' : 'protocol-fainting')}
              aria-expanded={expandedProtocol === 'protocol-fainting'}
            >
              <div className="trigger-title-row">
                <AlertTriangle size={18} color="var(--accent-amber)" />
                <span className="trigger-title">{faintingProtocol.title}</span>
              </div>
              {expandedProtocol === 'protocol-fainting' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expandedProtocol === 'protocol-fainting' && (
              <div className="protocol-body">
                <p className="protocol-summary">{faintingProtocol.summary}</p>
                <div className="steps-list">
                  {faintingProtocol.steps.map((s) => (
                    <div key={s.step} className="step-item">
                      <div className="step-num">{s.step}</div>
                      <div className="step-content">
                        <strong className="step-title">{s.title}</strong>
                        <p className="step-detail">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="do-dont-box">
                  <div className="do-col">
                    <span className="col-title do-title"><CheckCircle2 size={14} /> DO:</span>
                    <ul>
                      <li>Place on Left Side immediately</li>
                      <li>Loosen tight clothing</li>
                      <li>Call 112 if unresponsive &gt; 60 seconds</li>
                    </ul>
                  </div>
                  <div className="dont-col">
                    <span className="col-title dont-title"><XCircle size={14} /> DO NOT:</span>
                    <ul>
                      <li>Do NOT keep flat on back (Vena Cava compression)</li>
                      <li>Do NOT force liquids while semi-conscious</li>
                      <li>Do NOT delay calling emergency help</li>
                    </ul>
                  </div>
                </div>

                <div className="protocol-citation">
                  <ShieldCheck size={13} />
                  <span>Source: {faintingProtocol.citation}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Critical Red Flags Protocol */}
        {redFlagsProtocol && (
          <div className="protocol-block">
            <button
              type="button"
              className="protocol-trigger-btn"
              onClick={() => setExpandedProtocol(expandedProtocol === 'protocol-redflags' ? '' : 'protocol-redflags')}
              aria-expanded={expandedProtocol === 'protocol-redflags'}
            >
              <div className="trigger-title-row">
                <AlertTriangle size={18} color="var(--accent-rose)" />
                <span className="trigger-title">{redFlagsProtocol.title}</span>
              </div>
              {expandedProtocol === 'protocol-redflags' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expandedProtocol === 'protocol-redflags' && (
              <div className="protocol-body">
                <p className="protocol-summary">{redFlagsProtocol.summary}</p>
                <ul className="redflags-list">
                  {redFlagsProtocol.flags.map((flag, idx) => (
                    <li key={idx} className="redflag-item">
                      <AlertTriangle size={14} className="flag-icon" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>

                <div className="protocol-citation">
                  <ShieldCheck size={13} />
                  <span>Source: {redFlagsProtocol.citation}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
