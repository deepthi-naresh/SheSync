import { describe, it, expect } from 'vitest';
import { 
  DOCTORS_CATALOG, 
  DOCTOR_SPECIALTIES, 
  CONSULTATION_MODES, 
  filterDoctors, 
  getDoctorById 
} from '../src/data/doctorsData';
import { APPROVED_TIME_SLOTS } from '../src/context/AppointmentContext';

describe('SheSync Phase 4: Doctor Catalog & Filter Tests', () => {
  it('1. Contains exactly 8 fictional demo doctors with unique IDs and required fields', () => {
    expect(DOCTORS_CATALOG.length).toBe(8);

    const ids = new Set();
    DOCTORS_CATALOG.forEach((doc) => {
      expect(doc.id).toBeDefined();
      expect(typeof doc.id).toBe('string');
      expect(ids.has(doc.id)).toBe(false);
      ids.add(doc.id);

      expect(doc.name).toBeDefined();
      expect(doc.specialtyId).toBeDefined();
      expect(doc.specialtyLabel).toBeDefined();
      expect(doc.title).toBeDefined();
      expect(doc.credentials).toContain('Fictional Demo Profile');
      expect(doc.experienceYears).toBeDefined();
      expect(Array.isArray(doc.languages)).toBe(true);
      expect(doc.languages.length).toBeGreaterThan(0);
      expect(doc.rating).toContain('Demo Rating');
      expect(typeof doc.simulatedFee).toBe('number');
      expect(doc.simulatedFeeFormatted).toContain('Simulated Demo');
      expect(Array.isArray(doc.supportedModes)).toBe(true);
      expect(doc.supportedModes.length).toBeGreaterThan(0);
      expect(doc.clinicLocation).toBeDefined();
      expect(doc.bio).toBeDefined();
      expect(Array.isArray(doc.searchKeywords)).toBe(true);
      expect(Array.isArray(doc.availableSlots)).toBe(true);
      expect(doc.availableSlots.length).toBeGreaterThan(0);
      expect(doc.isFictionalDemo).toBe(true);
    });
  });

  it('2. Search query matches doctor names, specialties, and keywords case-insensitively', () => {
    // Search by doctor name
    const byName = filterDoctors({ query: 'ANANYA' });
    expect(byName.length).toBe(1);
    expect(byName[0].id).toBe('doc-gyn-1');

    // Search by condition keyword 'PCOS'
    const byKeyword = filterDoctors({ query: 'pcos' });
    expect(byKeyword.length).toBeGreaterThanOrEqual(1);
    expect(byKeyword.some(d => d.id === 'doc-pcos-2')).toBe(true);

    // Search by clinical focus 'nutrition'
    const byNutrition = filterDoctors({ query: 'nutrition' });
    expect(byNutrition.some(d => d.id === 'doc-nutri-3')).toBe(true);

    // Search by symptom keyword 'cramps'
    const byCramps = filterDoctors({ query: 'cramps' });
    expect(byCramps.length).toBeGreaterThanOrEqual(2);
  });

  it('3. Handles empty and whitespace-only search queries safely without throwing', () => {
    expect(filterDoctors().length).toBe(8);
    expect(filterDoctors({}).length).toBe(8);
    expect(filterDoctors({ query: '' }).length).toBe(8);
    expect(filterDoctors({ query: '   ' }).length).toBe(8);
    expect(filterDoctors({ query: undefined, specialty: 'all', mode: 'all' }).length).toBe(8);
  });

  it('4. Filters accurately by specialty and consultation mode', () => {
    // Specialty filter: Gynaecology
    const gynDoctors = filterDoctors({ specialty: 'gynaecology' });
    expect(gynDoctors.length).toBe(1);
    expect(gynDoctors[0].id).toBe('doc-gyn-1');

    // Specialty filter: Maternal Mental Health
    const mentalDoctors = filterDoctors({ specialty: 'maternal_mental_health' });
    expect(mentalDoctors.length).toBe(1);
    expect(mentalDoctors[0].id).toBe('doc-ment-4');

    // Mode filter: In-Clinic (only returns doctors supporting in_clinic)
    const inClinicDoctors = filterDoctors({ mode: 'in_clinic' });
    expect(inClinicDoctors.length).toBe(6); // doc-nutri-3 and doc-ment-4 are video only
    expect(inClinicDoctors.every(d => d.supportedModes.includes('in_clinic'))).toBe(true);

    // Mode filter: Video
    const videoDoctors = filterDoctors({ mode: 'video' });
    expect(videoDoctors.length).toBe(8); // All 8 doctors support video
  });

  it('5. Combines search query, specialty, and mode filters using AND logic', () => {
    // Valid combination that matches
    const combinedMatch = filterDoctors({
      query: 'Priya',
      specialty: 'pcos_endocrinology',
      mode: 'video'
    });
    expect(combinedMatch.length).toBe(1);
    expect(combinedMatch[0].id).toBe('doc-pcos-2');

    // Mismatched specialty for that doctor -> returns empty
    const mismatched = filterDoctors({
      query: 'Priya',
      specialty: 'gynaecology',
      mode: 'video'
    });
    expect(mismatched.length).toBe(0);

    // Completely non-existent query
    const noMatch = filterDoctors({ query: 'completely_unknown_doctor_xyz' });
    expect(noMatch.length).toBe(0);
  });

  it('6. Ensures every doctor availableSlot belongs to APPROVED_TIME_SLOTS', () => {
    DOCTORS_CATALOG.forEach((doc) => {
      doc.availableSlots.forEach((slot) => {
        expect(APPROVED_TIME_SLOTS).toContain(slot);
      });
    });
  });

  it('7. getDoctorById returns the correct profile or null on unknown ID', () => {
    const doc1 = getDoctorById('doc-gyn-1');
    expect(doc1).not.toBeNull();
    expect(doc1.name).toBe('Dr. Ananya Sharma');

    expect(getDoctorById('unknown-id')).toBeNull();
    expect(getDoctorById('')).toBeNull();
    expect(getDoctorById(null)).toBeNull();
  });
});
