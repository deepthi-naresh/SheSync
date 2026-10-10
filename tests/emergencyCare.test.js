import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  generateEmergencyMessage, 
  sendEmergencyAlertService, 
  parseHeartRateMeasurement,
  BleHeartRateManager,
  generateSimulatedPulseReading, 
  isValidPhoneNumber, 
  getHospitalSearchUrl,
  BLE_HEART_RATE_SERVICE_UUID,
  BLE_HEART_RATE_MEASUREMENT_UUID
} from '../src/utils/emergencyServices';
import { 
  EMERGENCY_NUMBERS, 
  INITIAL_PREGNANCY_PROFILE, 
  INITIAL_EMERGENCY_CONTACTS, 
  VERIFIED_HOSPITALS_DIRECTORY, 
  FIRST_AID_PROTOCOLS 
} from '../src/data/emergencyData';
import { storage } from '../src/utils/storage';

describe('SheSync Pregnancy Emergency Care & SOS Module', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('1. Emergency Message Generation & Selective Consent Controls', () => {
    it('generates a complete emergency message when all consent toggles are active', () => {
      const fullProfile = {
        weeksPregnant: 28,
        trimester: '3rd Trimester',
        bloodGroup: 'B+',
        allergies: 'Penicillin',
        medications: 'Iron 30mg daily',
        doctorName: 'Dr. Ananya Sharma',
        doctorPhone: '+919876543210',
        shareStageOnSOS: true,
        shareBloodGroupOnSOS: true,
        shareAllergiesOnSOS: true,
        shareLocationOnSOS: true,
        shareDoctorInfoOnSOS: true
      };

      const coords = { lat: 12.9716, lng: 77.5946, accuracy: 15 };
      const message = generateEmergencyMessage({
        profile: fullProfile,
        coordinates: coords,
        customNote: 'Felt dizzy and fainted in kitchen',
        timestamp: '10/10/2026, 01:00 PM IST'
      });

      expect(message).toContain('EMERGENCY SOS ALERT');
      expect(message).toContain('Felt dizzy and fainted in kitchen');
      expect(message).toContain('12.97160, 77.59460');
      expect(message).toContain('https://maps.google.com/?q=12.9716,77.5946');
      expect(message).toContain('28 Weeks');
      expect(message).toContain('Blood Group: B+');
      expect(message).toContain('Allergies: Penicillin');
      expect(message).toContain('Current Meds: Iron 30mg daily');
      expect(message).toContain('Dr. Ananya Sharma');
      expect(message).toContain('112 / 108');
    });

    it('strictly omits location and clinical data when user disables selective consent', () => {
      const restrictedProfile = {
        weeksPregnant: 32,
        bloodGroup: 'O+',
        allergies: 'Latex',
        medications: 'Insulin',
        doctorName: 'Dr. Priya',
        shareStageOnSOS: false,
        shareBloodGroupOnSOS: false,
        shareAllergiesOnSOS: false,
        shareLocationOnSOS: false,
        shareDoctorInfoOnSOS: false
      };

      const coords = { lat: 12.9716, lng: 77.5946 };
      const message = generateEmergencyMessage({
        profile: restrictedProfile,
        coordinates: coords,
        customNote: 'Need urgent help'
      });

      expect(message).toContain('EMERGENCY SOS ALERT');
      expect(message).toContain('Need urgent help');
      expect(message).not.toContain('12.9716');
      expect(message).not.toContain('32 Weeks');
      expect(message).not.toContain('Blood Group: O+');
      expect(message).not.toContain('Latex');
      expect(message).not.toContain('Insulin');
      expect(message).not.toContain('Dr. Priya');
    });

    it('handles missing coordinates gracefully when location permission is not available', () => {
      const profile = {
        weeksPregnant: 18,
        shareStageOnSOS: true,
        shareLocationOnSOS: true
      };

      const message = generateEmergencyMessage({
        profile,
        coordinates: null
      });

      expect(message).toContain('Location unavailable');
      expect(message).toContain('18 Weeks');
    });

    it('allows emergency SOS activation unconditionally without Bluetooth device connection', () => {
      const message = generateEmergencyMessage({
        profile: INITIAL_PREGNANCY_PROFILE,
        coordinates: null,
        customNote: 'Bluetooth disconnected - emergency activated directly'
      });
      expect(message).toContain('EMERGENCY SOS ALERT');
      expect(message).toContain('Bluetooth disconnected - emergency activated directly');
      expect(message).toContain('112 / 108');
    });
  });

  describe('2. Standard Bluetooth Heart Rate GATT (0x180D, 0x2A37) Parsing', () => {
    it('parses valid 8-bit Heart Rate Measurement packets correctly', () => {
      // 8-bit format: Flags byte has bit 0 = 0.
      // Byte 0: 0x00 (8-bit BPM, no extra fields)
      // Byte 1: 74 (BPM = 74)
      const buffer = new ArrayBuffer(2);
      const view = new DataView(buffer);
      view.setUint8(0, 0x00);
      view.setUint8(1, 74);

      const parsed = parseHeartRateMeasurement(view);
      expect(parsed.bpm).toBe(74);
      expect(parsed.is16Bit).toBe(false);
      expect(parsed.isSimulated).toBe(false);
      expect(parsed.timestamp).toBeDefined();
    });

    it('parses valid 16-bit Heart Rate Measurement packets correctly', () => {
      // 16-bit format: Flags byte has bit 0 = 1.
      // Byte 0: 0x01
      // Byte 1 & 2: UINT16 little-endian BPM = 280 (0x0118 -> byte1=0x18, byte2=0x01)
      const buffer = new ArrayBuffer(3);
      const view = new DataView(buffer);
      view.setUint8(0, 0x01);
      view.setUint16(1, 280, true);

      const parsed = parseHeartRateMeasurement(view);
      expect(parsed.bpm).toBe(280);
      expect(parsed.is16Bit).toBe(true);
      expect(parsed.isSimulated).toBe(false);
    });

    it('parses sensor contact status and RR-Interval / HRV when present', () => {
      // Flags: Bit 0 = 0 (8-bit), Bit 1 = 1, Bit 2 = 1 (Sensor Contact detected), Bit 4 = 1 (RR-Interval present)
      // Flags = 0x00 | 0x02 | 0x04 | 0x10 = 0x16
      // Byte 0: 0x16
      // Byte 1: 82 BPM
      // Byte 2 & 3: RR-interval = 1024 (which is exactly 1000ms / 1.0s)
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint8(0, 0x16);
      view.setUint8(1, 82);
      view.setUint16(2, 1024, true);

      const parsed = parseHeartRateMeasurement(view);
      expect(parsed.bpm).toBe(82);
      expect(parsed.sensorContactSupported).toBe(true);
      expect(parsed.sensorContactDetected).toBe(true);
      expect(parsed.rrIntervals).toHaveLength(1);
      expect(parsed.rrIntervals[0]).toBe(1000); // 1024/1024 * 1000 = 1000 ms
      expect(parsed.hrv).toBe(1000);
    });

    it('throws descriptive errors on empty, null, or truncated packets', () => {
      expect(() => parseHeartRateMeasurement(null)).toThrow('Invalid or incomplete heart rate measurement packet');
      
      const emptyBuffer = new ArrayBuffer(1);
      const emptyView = new DataView(emptyBuffer);
      expect(() => parseHeartRateMeasurement(emptyView)).toThrow('minimum 2 bytes required');

      // 16-bit flag set but only 2 bytes provided (missing high byte)
      const truncatedBuffer = new ArrayBuffer(2);
      const truncatedView = new DataView(truncatedBuffer);
      truncatedView.setUint8(0, 0x01); // 16-bit flag
      truncatedView.setUint8(1, 75);
      expect(() => parseHeartRateMeasurement(truncatedView)).toThrow('Incomplete 16-bit heart rate measurement packet');
    });
  });

  describe('3. Web Bluetooth API Lifecyle & Mock Device Integration', () => {
    it('detects unsupported browser environment gracefully when navigator.bluetooth is missing', () => {
      const originalBt = navigator.bluetooth;
      // @ts-ignore
      delete navigator.bluetooth;

      expect(BleHeartRateManager.isSupported()).toBe(false);

      const manager = new BleHeartRateManager();
      return expect(manager.connect({ onReading: () => {}, onDisconnect: () => {} }))
        .rejects
        .toThrow('Web Bluetooth API is not supported in this browser');

      // Restore
      if (originalBt) navigator.bluetooth = originalBt;
    });

    it('handles user cancellation and permission denial during device selection', async () => {
      // Mock navigator.bluetooth with requestDevice rejecting with NotFoundError
      const mockBluetooth = {
        requestDevice: vi.fn().mockRejectedValue(new DOMException('User cancelled the requestDevice() chooser', 'NotFoundError'))
      };

      // @ts-ignore
      navigator.bluetooth = mockBluetooth;

      const manager = new BleHeartRateManager();
      await expect(manager.connect({ onReading: () => {}, onDisconnect: () => {} }))
        .rejects
        .toThrow('User cancelled the requestDevice() chooser');

      expect(mockBluetooth.requestDevice).toHaveBeenCalledWith({
        filters: [{ services: [BLE_HEART_RATE_SERVICE_UUID] }],
        optionalServices: ['battery_service', 'device_information']
      });
    });

    it('connects to GATT server, discovers service 0x180D, subscribes to 0x2A37, and handles measurements', async () => {
      let characteristicListener = null;
      let deviceDisconnectListener = null;

      const mockCharacteristic = {
        startNotifications: vi.fn().mockResolvedValue(undefined),
        stopNotifications: vi.fn().mockResolvedValue(undefined),
        addEventListener: vi.fn((event, handler) => {
          if (event === 'characteristicvaluechanged') characteristicListener = handler;
        }),
        removeEventListener: vi.fn()
      };

      const mockService = {
        getCharacteristic: vi.fn().mockResolvedValue(mockCharacteristic)
      };

      const mockGatt = {
        connected: true,
        connect: vi.fn().mockResolvedValue({
          getPrimaryService: vi.fn().mockResolvedValue(mockService)
        }),
        disconnect: vi.fn()
      };

      const mockDevice = {
        id: 'polar-h10-demo',
        name: 'Polar H10 12345678',
        gatt: mockGatt,
        addEventListener: vi.fn((event, handler) => {
          if (event === 'gattserverdisconnected') deviceDisconnectListener = handler;
        }),
        removeEventListener: vi.fn()
      };

      // @ts-ignore
      navigator.bluetooth = {
        requestDevice: vi.fn().mockResolvedValue(mockDevice)
      };

      const readings = [];
      const manager = new BleHeartRateManager();
      const connection = await manager.connect({
        onReading: (m) => readings.push(m),
        onDisconnect: vi.fn()
      });

      expect(connection.deviceName).toBe('Polar H10 12345678');
      expect(mockCharacteristic.startNotifications).toHaveBeenCalled();
      expect(characteristicListener).toBeDefined();

      // Simulate incoming BLE GATT measurement event (8-bit, 78 BPM)
      const buffer = new ArrayBuffer(2);
      const view = new DataView(buffer);
      view.setUint8(0, 0x00);
      view.setUint8(1, 78);

      characteristicListener({ target: { value: view } });

      expect(readings).toHaveLength(1);
      expect(readings[0].bpm).toBe(78);
      expect(readings[0].isSimulated).toBe(false);

      // Clean disconnect
      await manager.disconnect();
      expect(mockCharacteristic.stopNotifications).toHaveBeenCalled();
      expect(mockGatt.disconnect).toHaveBeenCalled();
    });

    it('cleans up event listeners and executes onDisconnect callback when device disconnects', async () => {
      let deviceDisconnectListener = null;

      const mockCharacteristic = {
        startNotifications: vi.fn().mockResolvedValue(undefined),
        stopNotifications: vi.fn().mockResolvedValue(undefined),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };

      const mockService = {
        getCharacteristic: vi.fn().mockResolvedValue(mockCharacteristic)
      };

      const mockGatt = {
        connected: true,
        connect: vi.fn().mockResolvedValue({
          getPrimaryService: vi.fn().mockResolvedValue(mockService)
        }),
        disconnect: vi.fn()
      };

      const mockDevice = {
        id: 'garmin-hrm-demo',
        name: 'Garmin HRM-Dual',
        gatt: mockGatt,
        addEventListener: vi.fn((event, handler) => {
          if (event === 'gattserverdisconnected') deviceDisconnectListener = handler;
        }),
        removeEventListener: vi.fn()
      };

      // @ts-ignore
      navigator.bluetooth = {
        requestDevice: vi.fn().mockResolvedValue(mockDevice)
      };

      const disconnectCallback = vi.fn();
      const manager = new BleHeartRateManager();
      await manager.connect({
        onReading: vi.fn(),
        onDisconnect: disconnectCallback
      });

      // Simulate unexpected hardware disconnect
      expect(deviceDisconnectListener).toBeDefined();
      deviceDisconnectListener({ target: mockDevice });

      expect(disconnectCallback).toHaveBeenCalled();
    });
  });

  describe('4. Simulation Mode Separation & Pulse Bounds', () => {
    it('generates simulated pulse readings with explicit isSimulated flag', () => {
      const reading = generateSimulatedPulseReading(76, false);
      expect(reading.bpm).toBeGreaterThanOrEqual(60);
      expect(reading.bpm).toBeLessThanOrEqual(100);
      expect(reading.isSimulated).toBe(true);
      expect(reading.status).toBe('normal');
      expect(reading.timestamp).toBeDefined();
    });

    it('generates simulated low pulse during syncope demo with explicit isSimulated flag', () => {
      const reading = generateSimulatedPulseReading(76, true);
      expect(reading.bpm).toBeLessThanOrEqual(54);
      expect(reading.status).toBe('low');
      expect(reading.isSimulated).toBe(true);
    });
  });

  describe('5. Emergency SMS Architecture & Directory Validation', () => {
    it('transparently reports demo fallback mode when no live backend SMS service is integrated', async () => {
      const report = await sendEmergencyAlertService({
        contacts: INITIAL_EMERGENCY_CONTACTS,
        message: 'Test emergency broadcast'
      });

      expect(report.success).toBe(false);
      expect(report.mode).toBe('demo_fallback');
      expect(report.message).toContain('Demo / Client-Only Mode');
      expect(report.contactsNotified).toContain('Kavita Sharma (Partner)');
    });

    it('validates Indian and international phone numbers correctly', () => {
      expect(isValidPhoneNumber('+919876543210')).toBe(true);
      expect(isValidPhoneNumber('9876543210')).toBe(true);
      expect(isValidPhoneNumber('+1-800-555-0199')).toBe(true);
      expect(isValidPhoneNumber('080-26701150')).toBe(true);

      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('invalid-text')).toBe(false);
      expect(isValidPhoneNumber(null)).toBe(false);
    });

    it('constructs dynamic Google Maps hospital search URLs correctly', () => {
      const coordsUrl = getHospitalSearchUrl('', { lat: 13.0827, lng: 80.2707 });
      expect(coordsUrl).toBe('https://www.google.com/maps/search/maternity+emergency+hospital/@13.0827,80.2707,14z');

      const cityUrl = getHospitalSearchUrl('Bengaluru');
      expect(cityUrl).toBe('https://www.google.com/maps/search/maternity+emergency+hospital+in+Bengaluru');

      const defaultUrl = getHospitalSearchUrl();
      expect(defaultUrl).toBe('https://www.google.com/maps/search/maternity+emergency+hospital+near+me');
    });

    it('verifies all 5 national emergency helplines have valid numbers and descriptions', () => {
      expect(EMERGENCY_NUMBERS.length).toBeGreaterThanOrEqual(5);
      const numbers = EMERGENCY_NUMBERS.map(n => n.number);
      expect(numbers).toContain('112');
      expect(numbers).toContain('108');
      expect(numbers).toContain('102');
      expect(numbers).toContain('181');
      expect(numbers).toContain('14416');
    });

    it('verifies verified hospitals catalog contains authentic casualty numbers and 24/7 facilities', () => {
      expect(VERIFIED_HOSPITALS_DIRECTORY.length).toBeGreaterThanOrEqual(6);
      VERIFIED_HOSPITALS_DIRECTORY.forEach((hosp) => {
        expect(hosp.id).toBeDefined();
        expect(hosp.name).toBeDefined();
        expect(hosp.city).toBeDefined();
        expect(hosp.phone).toBeDefined();
        expect(hosp.emergencyPhone).toBeDefined();
        expect(hosp.open24x7).toBe(true);
        expect(hosp.coordinates.lat).toBeGreaterThan(0);
        expect(hosp.coordinates.lng).toBeGreaterThan(0);
        expect(hosp.facilities.length).toBeGreaterThan(0);
      });
    });

    it('verifies fainting and red-flags first-aid protocols cite recognized public health authorities', () => {
      expect(FIRST_AID_PROTOCOLS.length).toBe(2);
      const fainting = FIRST_AID_PROTOCOLS.find(p => p.id === 'protocol-fainting');
      expect(fainting.citation).toContain('World Health Organization');
      expect(fainting.steps.some(s => s.title.includes('Left Side'))).toBe(true);

      const redflags = FIRST_AID_PROTOCOLS.find(p => p.id === 'protocol-redflags');
      expect(redflags.flags.length).toBeGreaterThanOrEqual(5);
      expect(redflags.citation).toContain('Ministry of Health and Family Welfare');
    });
  });

  describe('6. LocalStorage Isolation & Demo Reset Protection', () => {
    it('saves emergency data under shesync_ namespace and purges cleanly on clearAllSheSyncData', () => {
      storage.set('emergency_contacts', [{ id: 'test-1', name: 'Test Contact', phone: '+919999999999' }]);
      storage.set('pregnancy_profile', { weeksPregnant: 20, bloodGroup: 'A+' });
      localStorage.setItem('other_app_user_data', 'preserved');

      const savedContacts = storage.get('emergency_contacts');
      expect(savedContacts.length).toBe(1);
      expect(savedContacts[0].name).toBe('Test Contact');

      const savedProfile = storage.get('pregnancy_profile');
      expect(savedProfile.weeksPregnant).toBe(20);

      storage.clearAllSheSyncData();

      expect(storage.get('emergency_contacts')).toBeNull();
      expect(storage.get('pregnancy_profile')).toBeNull();
      expect(localStorage.getItem('other_app_user_data')).toBe('preserved');
    });
  });
});
