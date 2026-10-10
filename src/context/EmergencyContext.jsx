import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { storage } from '../utils/storage';
import { 
  EMERGENCY_NUMBERS, 
  INITIAL_PREGNANCY_PROFILE, 
  INITIAL_EMERGENCY_CONTACTS, 
  VERIFIED_HOSPITALS_DIRECTORY, 
  FIRST_AID_PROTOCOLS 
} from '../data/emergencyData';
import { 
  generateEmergencyMessage, 
  sendEmergencyAlertService, 
  bleHeartRateManager,
  BleHeartRateManager,
  generateSimulatedPulseReading,
  isValidPhoneNumber 
} from '../utils/emergencyServices';
import { useToast } from './ToastContext';

const EmergencyContext = createContext(null);

export function EmergencyProvider({ children }) {
  const { showToast } = useToast();

  // 1. Emergency Contacts State
  const [contacts, setContacts] = useState(() => {
    return storage.get('emergency_contacts', INITIAL_EMERGENCY_CONTACTS);
  });

  // 2. Pregnancy Emergency Profile State
  const [pregnancyProfile, setPregnancyProfile] = useState(() => {
    return storage.get('pregnancy_profile', INITIAL_PREGNANCY_PROFILE);
  });

  // 3. Configurable Emergency Helpline Number (Default 112 India)
  const [emergencyNumber, setEmergencyNumberState] = useState(() => {
    return storage.get('emergency_number', '112');
  });

  // 4. Active SOS State
  const [sosState, setSosState] = useState({
    isActive: false,
    status: 'idle', // 'idle' | 'active' | 'cancelled'
    activatedAt: null,
    coordinates: null,
    locationError: null,
    locationLoading: false,
    customNote: '',
    lastDispatchReport: null
  });

  // Check initial Bluetooth browser capability
  const isBleSupported = BleHeartRateManager.isSupported();

  // 5. Pulse Monitoring & Bluetooth State
  // Modes: 'standby' | 'real' | 'simulated'
  // Connection states:
  // - 'unsupported'
  // - 'ready'
  // - 'waiting_selection'
  // - 'connecting'
  // - 'connected_waiting'
  // - 'connected_receiving'
  // - 'disconnected'
  // - 'permission_denied'
  // - 'device_unavailable'
  // - 'connection_failed'
  // - 'simulated_active'
  const [pulseState, setPulseState] = useState({
    mode: 'standby', // 'standby' | 'real' | 'simulated'
    connectionStatus: isBleSupported ? 'ready' : 'unsupported',
    deviceName: null,
    bpm: null,
    hrv: null,
    isStale: false,
    lastUpdated: null,
    history: [],
    errorMessage: null,
    isSimulatedStreaming: false,
    isFaintingSimulation: false
  });

  // Keep storage in sync when state updates
  useEffect(() => {
    storage.set('emergency_contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    storage.set('pregnancy_profile', pregnancyProfile);
  }, [pregnancyProfile]);

  useEffect(() => {
    storage.set('emergency_number', emergencyNumber);
  }, [emergencyNumber]);

  // Pulse stream ticker for realistic simulation demo (ONLY runs when mode === 'simulated')
  const pulseIntervalRef = useRef(null);

  useEffect(() => {
    if (pulseState.mode === 'simulated' && pulseState.isSimulatedStreaming) {
      pulseIntervalRef.current = setInterval(() => {
        setPulseState((prev) => {
          if (prev.mode !== 'simulated') return prev;
          const prevBpm = prev.bpm || 76;
          const reading = generateSimulatedPulseReading(prevBpm, prev.isFaintingSimulation);
          const newHistory = [...prev.history.slice(-14), reading.bpm];
          return {
            ...prev,
            bpm: reading.bpm,
            hrv: reading.hrv,
            lastUpdated: reading.timestamp,
            history: newHistory,
            isStale: false
          };
        });
      }, 2000);
    } else {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    }

    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, [pulseState.mode, pulseState.isSimulatedStreaming, pulseState.isFaintingSimulation]);

  // Cleanup Web Bluetooth connections when unmounting
  useEffect(() => {
    return () => {
      bleHeartRateManager.disconnect().catch(() => {});
    };
  }, []);

  // Geolocation fetcher with fallback
  const fetchCoordinates = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setSosState((prev) => ({
        ...prev,
        locationError: 'Geolocation is not supported by your browser or device.',
        locationLoading: false
      }));
      return null;
    }

    setSosState((prev) => ({ ...prev, locationLoading: true, locationError: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setSosState((prev) => ({
            ...prev,
            coordinates: coords,
            locationLoading: false,
            locationError: null
          }));
          resolve(coords);
        },
        (error) => {
          let errorMsg = 'Location permission was denied or unavailable.';
          if (error.code === 1) errorMsg = 'Location permission denied by user.';
          else if (error.code === 2) errorMsg = 'Location position unavailable.';
          else if (error.code === 3) errorMsg = 'Location request timed out.';

          setSosState((prev) => ({
            ...prev,
            locationLoading: false,
            locationError: errorMsg
          }));
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    });
  }, []);

  // SOS Trigger Action (Available at all times regardless of Bluetooth status)
  const triggerSOS = useCallback(async (customNote = '') => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    // Set immediate active emergency state
    setSosState((prev) => ({
      ...prev,
      isActive: true,
      status: 'active',
      activatedAt: timestamp,
      customNote: customNote || prev.customNote,
      lastDispatchReport: null
    }));

    showToast('🚨 SOS Activated! Emergency mode is active.', 'warning');

    // Attempt to retrieve coordinates if consented
    let coords = sosState.coordinates;
    if (pregnancyProfile.shareLocationOnSOS && !coords) {
      coords = await fetchCoordinates();
    }

    // Prepare dispatch message
    const message = generateEmergencyMessage({
      profile: pregnancyProfile,
      coordinates: coords,
      customNote: customNote || sosState.customNote,
      timestamp
    });

    // Run dispatch service abstraction (checks backend or returns transparent demo mode)
    const report = await sendEmergencyAlertService({
      contacts,
      message,
      coordinates: coords
    });

    setSosState((prev) => ({
      ...prev,
      lastDispatchReport: report
    }));
  }, [contacts, pregnancyProfile, sosState.coordinates, sosState.customNote, fetchCoordinates, showToast]);

  // Cancel SOS Action
  const cancelSOS = useCallback(() => {
    setSosState((prev) => ({
      ...prev,
      isActive: false,
      status: 'cancelled'
    }));
    showToast('Emergency SOS cancelled. Status set to safe.', 'info');
  }, [showToast]);

  // Reset SOS to Idle
  const resetSOS = useCallback(() => {
    setSosState({
      isActive: false,
      status: 'idle',
      activatedAt: null,
      coordinates: null,
      locationError: null,
      locationLoading: false,
      customNote: '',
      lastDispatchReport: null
    });
  }, []);

  // Contact CRUD
  const addContact = useCallback((newContact) => {
    if (!newContact.name || !newContact.phone) {
      showToast('Please provide both contact name and phone number.', 'error');
      return false;
    }
    if (!isValidPhoneNumber(newContact.phone)) {
      showToast('Please enter a valid phone number (8–15 digits).', 'error');
      return false;
    }

    const contactToAdd = {
      ...newContact,
      id: `contact-${Date.now()}`,
      isPrimary: contacts.length === 0 ? true : !!newContact.isPrimary,
      notifyOnSOS: newContact.notifyOnSOS !== false
    };

    setContacts((prev) => {
      let updated = [...prev];
      if (contactToAdd.isPrimary) {
        updated = updated.map((c) => ({ ...c, isPrimary: false }));
      }
      return [...updated, contactToAdd];
    });

    showToast(`Emergency contact "${contactToAdd.name}" added successfully.`, 'success');
    return true;
  }, [contacts.length, showToast]);

  const updateContact = useCallback((id, updatedFields) => {
    if (updatedFields.phone && !isValidPhoneNumber(updatedFields.phone)) {
      showToast('Please enter a valid phone number.', 'error');
      return false;
    }

    setContacts((prev) => {
      let updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      if (updatedFields.isPrimary) {
        updated = updated.map((c) => (c.id === id ? { ...c, isPrimary: true } : { ...c, isPrimary: false }));
      }
      return updated;
    });

    showToast('Emergency contact updated.', 'success');
    return true;
  }, [showToast]);

  const removeContact = useCallback((id) => {
    setContacts((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (remaining.length > 0 && !remaining.some((c) => c.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
    showToast('Emergency contact removed.', 'info');
  }, [showToast]);

  const setPrimaryContact = useCallback((id) => {
    setContacts((prev) => prev.map((c) => ({ ...c, isPrimary: c.id === id })));
    showToast('Primary emergency contact updated.', 'success');
  }, [showToast]);

  // Profile Update
  const updatePregnancyProfile = useCallback((updatedFields) => {
    setPregnancyProfile((prev) => ({
      ...prev,
      ...updatedFields
    }));
    showToast('Emergency pregnancy profile updated.', 'success');
  }, [showToast]);

  // Helpline Update
  const setEmergencyNumber = useCallback((number) => {
    setEmergencyNumberState(number);
    showToast(`Emergency helpline updated to ${number}.`, 'info');
  }, [showToast]);

  // Real Web Bluetooth Connection Actions
  const connectRealWearable = useCallback(async () => {
    if (!BleHeartRateManager.isSupported()) {
      setPulseState((prev) => ({
        ...prev,
        mode: 'real',
        connectionStatus: 'unsupported',
        errorMessage: 'Web Bluetooth API is not supported in this browser. Please use Chrome or Edge over HTTPS.'
      }));
      showToast('Web Bluetooth is not supported in this browser.', 'error');
      return;
    }

    // Stop demo stream if active, clear values so simulated data is never mixed with real data
    setPulseState({
      mode: 'real',
      connectionStatus: 'waiting_selection',
      deviceName: null,
      bpm: null,
      hrv: null,
      isStale: true,
      lastUpdated: null,
      history: [],
      errorMessage: null,
      isSimulatedStreaming: false,
      isFaintingSimulation: false
    });

    try {
      // Step: connecting
      setPulseState((prev) => ({ ...prev, connectionStatus: 'connecting' }));

      const connection = await bleHeartRateManager.connect({
        onReading: (measurement) => {
          setPulseState((prev) => {
            if (prev.mode !== 'real') return prev;
            return {
              ...prev,
              connectionStatus: 'connected_receiving',
              bpm: measurement.bpm,
              hrv: measurement.hrv,
              lastUpdated: measurement.timestamp,
              isStale: false,
              history: [...prev.history.slice(-14), measurement.bpm]
            };
          });
        },
        onDisconnect: () => {
          setPulseState((prev) => ({
            ...prev,
            connectionStatus: 'disconnected',
            isStale: true
          }));
          showToast('Heart-rate monitor disconnected.', 'info');
        }
      });

      // Connected, waiting for 1st measurement packet
      setPulseState((prev) => ({
        ...prev,
        connectionStatus: 'connected_waiting',
        deviceName: connection.deviceName,
        isStale: true
      }));

      showToast(`Connected to ${connection.deviceName}. Awaiting first measurement...`, 'success');
    } catch (err) {
      console.warn('[BLE Connect Error]:', err);
      let status = 'connection_failed';
      let errorMsg = err.message || 'Failed to connect to Bluetooth device.';

      if (err.name === 'NotFoundError' || err.message?.includes('User cancelled')) {
        status = 'permission_denied';
        errorMsg = 'Device selection cancelled or permission denied.';
      } else if (err.name === 'SecurityError') {
        status = 'permission_denied';
        errorMsg = 'Bluetooth access blocked by security policy or missing user gesture.';
      } else if (err.message?.includes('Bluetooth adapter not available') || err.message?.includes('unavailable')) {
        status = 'device_unavailable';
        errorMsg = 'Bluetooth adapter is turned off or unavailable.';
      }

      setPulseState((prev) => ({
        ...prev,
        connectionStatus: status,
        errorMessage: errorMsg,
        isStale: true
      }));

      showToast(errorMsg, 'info');
    }
  }, [showToast]);

  const disconnectRealWearable = useCallback(async () => {
    try {
      await bleHeartRateManager.disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
    setPulseState((prev) => ({
      ...prev,
      connectionStatus: 'disconnected',
      isStale: true
    }));
    showToast('Heart-rate monitor disconnected.', 'info');
  }, [showToast]);

  // Demo Simulation Actions (Clearly labelled, separate from real data)
  const startSimulatedPulseDemo = useCallback(() => {
    // If real device is connected, disconnect it first
    bleHeartRateManager.disconnect().catch(() => {});

    setPulseState({
      mode: 'simulated',
      connectionStatus: 'simulated_active',
      deviceName: 'Simulated Pulse Stream',
      bpm: 78,
      hrv: 55,
      isStale: false,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      history: [76, 78, 77, 80, 78, 79, 78],
      errorMessage: null,
      isSimulatedStreaming: true,
      isFaintingSimulation: false
    });
    showToast('Simulated Pulse Demo activated (Not a real measurement).', 'info');
  }, [showToast]);

  const stopSimulatedPulseDemo = useCallback(() => {
    setPulseState({
      mode: 'standby',
      connectionStatus: BleHeartRateManager.isSupported() ? 'ready' : 'unsupported',
      deviceName: null,
      bpm: null,
      hrv: null,
      isStale: false,
      lastUpdated: null,
      history: [],
      errorMessage: null,
      isSimulatedStreaming: false,
      isFaintingSimulation: false
    });
    showToast('Simulated demo stopped. Ready for real device connection.', 'info');
  }, [showToast]);

  const triggerFaintingDemo = useCallback(() => {
    if (pulseState.mode !== 'simulated') {
      showToast('Fainting simulation is only available during Simulated Demo mode.', 'info');
      return;
    }
    setPulseState((prev) => ({
      ...prev,
      isFaintingSimulation: !prev.isFaintingSimulation
    }));
    showToast(
      !pulseState.isFaintingSimulation 
        ? '⚠️ Demonstrating sudden pulse drop (Demo simulation only — not a clinical diagnosis).' 
        : 'Restored simulated rhythm to normal bounds.',
      'warning'
    );
  }, [pulseState.mode, pulseState.isFaintingSimulation, showToast]);

  const value = {
    contacts,
    pregnancyProfile,
    emergencyNumber,
    sosState,
    pulseState,
    isBleSupported,
    emergencyNumbersList: EMERGENCY_NUMBERS,
    nearbyHospitals: VERIFIED_HOSPITALS_DIRECTORY,
    firstAidProtocols: FIRST_AID_PROTOCOLS,
    // Actions
    triggerSOS,
    cancelSOS,
    resetSOS,
    fetchCoordinates,
    addContact,
    updateContact,
    removeContact,
    setPrimaryContact,
    updatePregnancyProfile,
    setEmergencyNumber,
    // Real BLE Actions
    connectRealWearable,
    disconnectRealWearable,
    // Demo Mode Actions
    startSimulatedPulseDemo,
    stopSimulatedPulseDemo,
    triggerFaintingDemo
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
