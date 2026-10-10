/**
 * SheSync Emergency Services & SOS Utilities
 * 
 * Clean abstraction layer for emergency messaging, location formatting,
 * standard Bluetooth Low Energy (BLE) Heart Rate GATT parsing, and hospital discovery.
 * 
 * IMPORTANT ARCHITECTURAL DISCLOSURES:
 * - This module runs 100% in the client browser.
 * - No private backend API secrets are embedded in client code.
 * - Real automated SMS/carrier dispatch requires an authenticated server-side backend
 *   (e.g., Twilio, AWS SNS). In client mode, it provides direct copyable payloads and native `tel:` / `sms:` links.
 * - Web Bluetooth connects to physical BLE Heart Rate monitors (Service: 0x180D, Characteristic: 0x2A37).
 */

// Bluetooth GATT UUID Constants (Bluetooth SIG Standards)
export const BLE_HEART_RATE_SERVICE_UUID = 'heart_rate'; // 0x180D
export const BLE_HEART_RATE_MEASUREMENT_UUID = 'heart_rate_measurement'; // 0x2A37

/**
 * Parses a standard Bluetooth Heart Rate Measurement Characteristic DataView (0x2A37).
 * Spec: Bluetooth SIG Heart Rate Service Specification
 * 
 * Flags Byte (Offset 0):
 * - Bit 0: Heart Rate Value Format (0 = UINT8, 1 = UINT16)
 * - Bit 1 & 2: Sensor Contact Status (Bit 1 = Supported, Bit 2 = Detected)
 * - Bit 3: Energy Expended Status (1 = Present)
 * - Bit 4: RR-Interval Status (1 = Present, each is 1/1024s)
 * 
 * @param {DataView} value DataView received from characteristicvaluechanged event
 * @returns {Object} Parsed heart rate measurement object
 */
export function parseHeartRateMeasurement(value) {
  if (!value || typeof value.getUint8 !== 'function' || value.byteLength < 2) {
    throw new Error('Invalid or incomplete heart rate measurement packet (minimum 2 bytes required).');
  }

  const flags = value.getUint8(0);
  const is16Bit = (flags & 0x01) !== 0;
  let offset = 1;
  let bpm = 0;

  if (is16Bit) {
    if (value.byteLength < 3) {
      throw new Error('Incomplete 16-bit heart rate measurement packet (minimum 3 bytes required).');
    }
    bpm = value.getUint16(offset, true); // little-endian
    offset += 2;
  } else {
    bpm = value.getUint8(offset);
    offset += 1;
  }

  // Sensor Contact Status
  const sensorContactSupported = (flags & 0x04) !== 0;
  const sensorContactDetected = (flags & 0x02) !== 0;

  // Energy Expended (UINT16 in kilo Joules)
  let energyExpended = null;
  if ((flags & 0x08) !== 0) {
    if (value.byteLength >= offset + 2) {
      energyExpended = value.getUint16(offset, true);
      offset += 2;
    }
  }

  // RR-Intervals / HRV (UINT16 in 1/1024 seconds)
  const rrIntervals = [];
  if ((flags & 0x10) !== 0) {
    while (offset + 2 <= value.byteLength) {
      const rawRr = value.getUint16(offset, true);
      const rrMs = Math.round((rawRr / 1024) * 1000);
      rrIntervals.push(rrMs);
      offset += 2;
    }
  }

  // Approximate HRV from RR-intervals if available
  let hrv = null;
  if (rrIntervals.length > 0) {
    hrv = rrIntervals[rrIntervals.length - 1];
  }

  return {
    bpm,
    flags,
    is16Bit,
    sensorContactSupported,
    sensorContactDetected,
    energyExpended,
    rrIntervals,
    hrv,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isSimulated: false
  };
}

/**
 * Web Bluetooth Heart Rate Connection Manager
 * Encapsulates device discovery, GATT connection, notification subscription, and cleanup.
 */
export class BleHeartRateManager {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this.onReadingCallback = null;
    this.onDisconnectCallback = null;
    this.boundHandleCharacteristicValue = this._handleCharacteristicValue.bind(this);
    this.boundHandleDisconnection = this._handleDisconnection.bind(this);
  }

  /**
   * Checks whether the current browser supports Web Bluetooth.
   */
  static isSupported() {
    return typeof navigator !== 'undefined' && typeof navigator.bluetooth !== 'undefined';
  }

  /**
   * Prompts user for BLE Heart Rate device selection, connects to GATT server,
   * and subscribes to heart_rate_measurement notifications.
   */
  async connect({ onReading, onDisconnect }) {
    if (!BleHeartRateManager.isSupported()) {
      throw new Error('Web Bluetooth API is not supported in this browser. Please use Google Chrome or Microsoft Edge on a supported desktop or Android device.');
    }

    this.onReadingCallback = onReading;
    this.onDisconnectCallback = onDisconnect;

    // 1. Request BLE Device with Heart Rate Service
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [BLE_HEART_RATE_SERVICE_UUID] }],
      optionalServices: ['battery_service', 'device_information']
    });

    if (!this.device) {
      throw new Error('No device selected.');
    }

    // Attach disconnection listener
    this.device.addEventListener('gattserverdisconnected', this.boundHandleDisconnection);

    // 2. Connect to GATT Server
    this.server = await this.device.gatt.connect();

    // 3. Get Primary Heart Rate Service
    this.service = await this.server.getPrimaryService(BLE_HEART_RATE_SERVICE_UUID);

    // 4. Get Heart Rate Measurement Characteristic
    this.characteristic = await this.service.getCharacteristic(BLE_HEART_RATE_MEASUREMENT_UUID);

    // 5. Start Notifications & Listen
    await this.characteristic.startNotifications();
    this.characteristic.addEventListener('characteristicvaluechanged', this.boundHandleCharacteristicValue);

    return {
      deviceName: this.device.name || 'Bluetooth Heart Rate Monitor',
      deviceId: this.device.id
    };
  }

  /**
   * Internal handler for characteristicvaluechanged events.
   */
  _handleCharacteristicValue(event) {
    try {
      const dataView = event.target.value;
      if (dataView) {
        const measurement = parseHeartRateMeasurement(dataView);
        if (this.onReadingCallback) {
          this.onReadingCallback(measurement);
        }
      }
    } catch (err) {
      console.warn('[BLE Manager] Failed to parse measurement packet:', err);
    }
  }

  /**
   * Internal handler for gattserverdisconnected events.
   */
  _handleDisconnection(event) {
    this._cleanupListeners();
    if (this.onDisconnectCallback) {
      this.onDisconnectCallback(event);
    }
  }

  /**
   * Cleans up event listeners.
   */
  _cleanupListeners() {
    if (this.characteristic) {
      try {
        this.characteristic.removeEventListener('characteristicvaluechanged', this.boundHandleCharacteristicValue);
      } catch (e) {
        // Ignore removal error
      }
    }
    if (this.device) {
      try {
        this.device.removeEventListener('gattserverdisconnected', this.boundHandleDisconnection);
      } catch (e) {
        // Ignore removal error
      }
    }
  }

  /**
   * Gracefully stops notifications, removes listeners, and disconnects GATT server.
   */
  async disconnect() {
    this._cleanupListeners();

    if (this.characteristic) {
      try {
        await this.characteristic.stopNotifications();
      } catch (e) {
        // Characteristic may already be disconnected
      }
      this.characteristic = null;
    }

    if (this.device && this.device.gatt && this.device.gatt.connected) {
      try {
        this.device.gatt.disconnect();
      } catch (e) {
        // Device may already be disconnected
      }
    }

    this.server = null;
    this.service = null;
    this.device = null;
  }
}

/**
 * Singleton instance of the Bluetooth Manager
 */
export const bleHeartRateManager = new BleHeartRateManager();

/**
 * Simulated Pulse Generator for Demo Presentations
 */
export function generateSimulatedPulseReading(prevBpm = 76, isFaintingSimulation = false) {
  let bpm;
  let hrv;
  let status = 'normal';

  if (isFaintingSimulation) {
    // Fainting / Vasovagal syncope simulation: Sudden bradycardia drop
    bpm = Math.floor(46 + Math.random() * 8); // 46–54 BPM
    hrv = Math.floor(85 + Math.random() * 20);
    status = 'low';
  } else {
    // Normal slight physiological fluctuation
    const delta = (Math.random() - 0.48) * 4;
    bpm = Math.max(62, Math.min(94, Math.round(prevBpm + delta)));
    hrv = Math.max(35, Math.min(65, Math.round(52 + (Math.random() - 0.5) * 8)));
    status = bpm < 55 ? 'low' : bpm > 100 ? 'elevated' : 'normal';
  }

  return {
    bpm,
    hrv,
    status,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isSimulated: true
  };
}

/**
 * Generates an emergency SOS dispatch message respecting user privacy and consent toggles.
 */
export function generateEmergencyMessage({
  profile = {},
  coordinates = null,
  customNote = '',
  timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
}) {
  const parts = [];

  parts.push(`🚨 EMERGENCY SOS ALERT — SheSync Wellness`);
  parts.push(`Time: ${timestamp}`);
  parts.push(`Situation: I am experiencing a sudden medical emergency / fainting episode and urgently require immediate assistance.`);

  if (customNote && customNote.trim()) {
    parts.push(`Urgent Note: "${customNote.trim()}"`);
  }

  // Location details with explicit consent
  if (profile.shareLocationOnSOS && coordinates && coordinates.lat && coordinates.lng) {
    const mapsUrl = `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`;
    const accuracy = coordinates.accuracy ? ` (±${Math.round(coordinates.accuracy)}m)` : '';
    parts.push(`📍 GPS Location: ${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}${accuracy}`);
    parts.push(`🗺️ Open in Maps: ${mapsUrl}`);
  } else if (profile.shareLocationOnSOS && !coordinates) {
    parts.push(`📍 GPS Location: [Location unavailable — requesting caller to share landmarks]`);
  }

  // Pregnancy details with explicit consent
  const clinicalDetails = [];
  if (profile.shareStageOnSOS && profile.weeksPregnant) {
    clinicalDetails.push(`Pregnancy: ${profile.weeksPregnant} Weeks (${profile.trimester || 'Active'})`);
  }
  if (profile.shareBloodGroupOnSOS && profile.bloodGroup) {
    clinicalDetails.push(`Blood Group: ${profile.bloodGroup}`);
  }
  if (profile.shareAllergiesOnSOS && profile.allergies) {
    clinicalDetails.push(`Allergies: ${profile.allergies}`);
  }
  if (profile.shareAllergiesOnSOS && profile.medications) {
    clinicalDetails.push(`Current Meds: ${profile.medications}`);
  }
  if (profile.shareDoctorInfoOnSOS && profile.doctorName) {
    clinicalDetails.push(`Treating Obstetrician: ${profile.doctorName} (${profile.doctorPhone || 'N/A'})`);
  }

  if (clinicalDetails.length > 0) {
    parts.push(`📋 Medical Profile (Consent-Approved):\n• ` + clinicalDetails.join('\n• '));
  }

  parts.push(`⚠️ Please call Emergency Services (112 / 108 in India) or send immediate help to this location.`);

  return parts.join('\n\n');
}

/**
 * Service abstraction for dispatching emergency SMS/Push notifications.
 */
export async function sendEmergencyAlertService({
  contacts = [],
  message = '',
  coordinates = null
}) {
  const backendEndpoint = typeof window !== 'undefined' ? window.__SHESYNC_EMERGENCY_API__ : null;

  if (backendEndpoint) {
    try {
      const response = await fetch(backendEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts, message, coordinates, sentAt: new Date().toISOString() })
      });
      if (response.ok) {
        return {
          success: true,
          mode: 'live_backend',
          message: 'Emergency broadcast dispatched via verified SMS gateway.'
        };
      }
    } catch (err) {
      console.warn('[Emergency Service] Backend dispatch failed, falling back to client mode:', err);
    }
  }

  return {
    success: false,
    mode: 'demo_fallback',
    message: 'Demo / Client-Only Mode: Automated background SMS requires a configured server gateway (e.g., Twilio/AWS SNS). Use 1-Click Copy, Native SMS, or Phone Dialer to dispatch alerts directly.',
    contactsNotified: contacts.filter((c) => c.notifyOnSOS).map((c) => c.name)
  };
}

/**
 * Generates a dynamic Google Maps search link for nearby emergency maternity hospitals.
 */
export function getHospitalSearchUrl(city = '', coordinates = null) {
  if (coordinates && coordinates.lat && coordinates.lng) {
    return `https://www.google.com/maps/search/maternity+emergency+hospital/@${coordinates.lat},${coordinates.lng},14z`;
  }
  if (city && city.trim()) {
    const encodedCity = encodeURIComponent(city.trim());
    return `https://www.google.com/maps/search/maternity+emergency+hospital+in+${encodedCity}`;
  }
  return `https://www.google.com/maps/search/maternity+emergency+hospital+near+me`;
}

/**
 * Validates phone numbers for Indian & international format.
 */
export function isValidPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return cleaned.length >= 8 && cleaned.length <= 15 && /^(\+)?[0-9]+$/.test(cleaned);
}
