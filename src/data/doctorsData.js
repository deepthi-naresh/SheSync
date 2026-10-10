/**
 * SheSync — Simulated Doctor & Specialist Directory
 * 
 * IMPORTANT DEMO DISCLOSURE:
 * All doctor profiles, clinical credentials, ratings, consultation fees, clinic locations,
 * and available time slots in this file are entirely fictional sample data created for the
 * SITAMS × HackSphere hackathon demonstration. No real medical practitioner affiliation,
 * healthcare provider verification, or actual hospital booking is implied.
 */

export const DOCTOR_SPECIALTIES = [
  { id: 'all', label: 'All Specialties' },
  { id: 'gynaecology', label: 'Obstetrics & Gynaecology' },
  { id: 'pcos_endocrinology', label: 'PCOS & Hormonal Health' },
  { id: 'clinical_nutrition', label: 'Menstrual & Metabolic Nutrition' },
  { id: 'maternal_mental_health', label: 'Perinatal & Maternal Wellbeing' },
  { id: 'pelvic_health', label: 'Pelvic Floor & Physiotherapy' },
  { id: 'adolescent_health', label: 'Adolescent & Young Adult Health' },
  { id: 'fertility_counseling', label: 'Preconception & Fertility Guidance' },
  { id: 'menopause_care', label: 'Perimenopause & Healthy Aging' }
];

export const CONSULTATION_MODES = [
  { id: 'all', label: 'All Modes' },
  { id: 'video', label: 'Video Call (Simulated)' },
  { id: 'in_clinic', label: 'In-Clinic (Simulated)' }
];

export const DOCTORS_CATALOG = [
  {
    id: 'doc-gyn-1',
    name: 'Dr. Ananya Sharma',
    specialtyId: 'gynaecology',
    specialtyLabel: 'Obstetrics & Gynaecology',
    title: 'Senior Consultant Obstetrician & Gynaecologist',
    credentials: 'MBBS, MS (OB-GYN), DNB — Fictional Demo Profile',
    experienceYears: '14+ Years (Simulated)',
    languages: ['English', 'Hindi', 'Kannada'],
    rating: '4.95 (Demo Rating • 320 reviews)',
    simulatedFee: 750,
    simulatedFeeFormatted: '₹750 (Simulated Demo)',
    supportedModes: ['video', 'in_clinic'],
    clinicName: 'Indiranagar Demo Wellness Clinic (Simulated)',
    clinicLocation: '100ft Road, Indiranagar, Bengaluru, Karnataka (Simulated Demo)',
    bio: 'Specializes in comprehensive menstrual health management, routine pelvic examinations, contraceptive guidance, and prenatal wellness consultations in safe demo simulation.',
    searchKeywords: [
      'gynaecology', 'obstetrics', 'period', 'heavy bleeding', 'pelvic pain', 
      'fibroids', 'pap smear', 'pregnancy', 'ultrasound', 'ananya', 'sharma'
    ],
    availableSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
    isFictionalDemo: true
  },
  {
    id: 'doc-pcos-2',
    name: 'Dr. Priya Venkatesh',
    specialtyId: 'pcos_endocrinology',
    specialtyLabel: 'PCOS & Hormonal Health',
    title: 'Reproductive Endocrinologist & PCOS Lead',
    credentials: 'MD (Internal Medicine), DM (Endocrinology) — Fictional Demo Profile',
    experienceYears: '11+ Years (Simulated)',
    languages: ['English', 'Tamil', 'Hindi'],
    rating: '4.92 (Demo Rating • 410 reviews)',
    simulatedFee: 900,
    simulatedFeeFormatted: '₹900 (Simulated Demo)',
    supportedModes: ['video', 'in_clinic'],
    clinicName: 'Koramangala Hormonal Health Center (Simulated)',
    clinicLocation: '80ft Road, 4th Block Koramangala, Bengaluru (Simulated Demo)',
    bio: 'Focuses on insulin resistance, hyperandrogenism, irregular ovulation cycles, and evidence-informed hormonal balance strategies for individuals with PCOS.',
    searchKeywords: [
      'pcos', 'pcod', 'hormones', 'irregular periods', 'insulin', 'hirsutism', 
      'acne', 'thyroid', 'endocrinology', 'priya', 'venkatesh'
    ],
    availableSlots: ['09:30 AM', '11:00 AM', '03:30 PM', '05:00 PM', '06:30 PM'],
    isFictionalDemo: true
  },
  {
    id: 'doc-nutri-3',
    name: 'Dr. Neha Malik',
    specialtyId: 'clinical_nutrition',
    specialtyLabel: 'Menstrual & Metabolic Nutrition',
    title: 'Clinical Menstrual Dietitian & Nutritionist',
    credentials: 'M.Sc (Clinical Nutrition), RD, CDE — Fictional Demo Profile',
    experienceYears: '8+ Years (Simulated)',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: '4.88 (Demo Rating • 280 reviews)',
    simulatedFee: 600,
    simulatedFeeFormatted: '₹600 (Simulated Demo)',
    supportedModes: ['video'],
    clinicName: 'Online Tele-Nutrition Center (Simulated)',
    clinicLocation: 'Telehealth Video Consultation Only (Simulated Demo)',
    bio: 'Designs evidence-based nutritional protocols to support cycle regularity, micronutrient replenishment (iron, folate, magnesium), and gut-hormone axis balance.',
    searchKeywords: [
      'nutrition', 'diet', 'food', 'iron', 'magnesium', 'cramps', 'metabolism', 
      'weight', 'bloating', 'dietitian', 'neha', 'malik'
    ],
    availableSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'],
    isFictionalDemo: true
  },
  {
    id: 'doc-ment-4',
    name: 'Dr. Rohini Das',
    specialtyId: 'maternal_mental_health',
    specialtyLabel: 'Perinatal & Maternal Wellbeing',
    title: 'Perinatal Psychologist & Emotional Counselor',
    credentials: 'M.Phil (Clinical Psychology), Ph.D — Fictional Demo Profile',
    experienceYears: '12+ Years (Simulated)',
    languages: ['English', 'Bengali', 'Hindi'],
    rating: '4.94 (Demo Rating • 250 reviews)',
    simulatedFee: 850,
    simulatedFeeFormatted: '₹850 (Simulated Demo)',
    supportedModes: ['video'],
    clinicName: 'Mind & Maternal Wellness Tele-Suite (Simulated)',
    clinicLocation: 'Telehealth Video Consultation Only (Simulated Demo)',
    bio: 'Provides compassionate psychological care for premenstrual dysphoric disorder (PMDD), postpartum emotional adjustments, perinatal anxiety, and stress mitigation.',
    searchKeywords: [
      'mental health', 'pmdd', 'pms', 'anxiety', 'postpartum', 'mood', 
      'depression', 'counseling', 'therapy', 'rohini', 'das'
    ],
    availableSlots: ['11:00 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'],
    isFictionalDemo: true
  },
  {
    id: 'doc-pelv-5',
    name: 'Dr. Sunita Ramamurthy',
    specialtyId: 'pelvic_health',
    specialtyLabel: 'Pelvic Floor & Physiotherapy',
    title: 'Pelvic Floor Physical Therapist & Recovery Specialist',
    credentials: 'MPT (Women’s Health), Certified Pelvic Floor Rehab — Fictional Demo Profile',
    experienceYears: '9+ Years (Simulated)',
    languages: ['English', 'Kannada', 'Telugu'],
    rating: '4.89 (Demo Rating • 190 reviews)',
    simulatedFee: 700,
    simulatedFeeFormatted: '₹700 (Simulated Demo)',
    supportedModes: ['video', 'in_clinic'],
    clinicName: 'Jayanagar Movement & Pelvic Health Studio (Simulated)',
    clinicLocation: '4th T Block, Jayanagar, Bengaluru, Karnataka (Simulated Demo)',
    bio: 'Specialized physical rehabilitation addressing pelvic pain, core restoration after childbirth, incontinence prevention, and safe postpartum return-to-exercise.',
    searchKeywords: [
      'pelvic floor', 'physiotherapy', 'kegel', 'postpartum recovery', 'diastasis recti', 
      'incontinence', 'core', 'rehabilitation', 'sunita', 'ramamurthy'
    ],
    availableSlots: ['09:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
    isFictionalDemo: true
  },
  {
    id: 'doc-adol-6',
    name: 'Dr. Tanvi Kulkarni',
    specialtyId: 'adolescent_health',
    specialtyLabel: 'Adolescent & Young Adult Health',
    title: 'Adolescent Gynaecologist & Puberty Educator',
    credentials: 'MBBS, DGO, Fellowship in Pediatric & Adolescent Gyn — Fictional Demo Profile',
    experienceYears: '10+ Years (Simulated)',
    languages: ['English', 'Marathi', 'Hindi'],
    rating: '4.91 (Demo Rating • 215 reviews)',
    simulatedFee: 650,
    simulatedFeeFormatted: '₹650 (Simulated Demo)',
    supportedModes: ['video', 'in_clinic'],
    clinicName: 'Bandra Youth Wellness Center (Simulated)',
    clinicLocation: 'Hill Road, Bandra West, Mumbai, Maharashtra (Simulated Demo)',
    bio: 'Provides gentle, accessible care for teens experiencing menarche, severe dysmenorrhea, cycle irregularities, and puberty-related health queries.',
    searchKeywords: [
      'teen', 'adolescent', 'puberty', 'first period', 'menarche', 'school health', 
      'cramps', 'irregular', 'tanvi', 'kulkarni'
    ],
    availableSlots: ['11:00 AM', '02:00 PM', '05:00 PM', '06:30 PM'],
    isFictionalDemo: true
  },
  {
    id: 'doc-fert-7',
    name: 'Dr. Kavita Nambiar',
    specialtyId: 'fertility_counseling',
    specialtyLabel: 'Preconception & Fertility Guidance',
    title: 'Fertility Consultant & Preconception Specialist',
    credentials: 'MBBS, MS (OB-GYN), DRM (Germany) — Fictional Demo Profile',
    experienceYears: '15+ Years (Simulated)',
    languages: ['English', 'Malayalam', 'Hindi'],
    rating: '4.96 (Demo Rating • 340 reviews)',
    simulatedFee: 950,
    simulatedFeeFormatted: '₹950 (Simulated Demo)',
    supportedModes: ['video', 'in_clinic'],
    clinicName: 'Kochi Reproductive Care Clinic (Simulated)',
    clinicLocation: 'MG Road, Ernakulam, Kochi, Kerala (Simulated Demo)',
    bio: 'Expert guidance on preconception health optimization, ovarian reserve assessments, fertile window tracking, and assisted reproduction pathways in safe demo mode.',
    searchKeywords: [
      'fertility', 'preconception', 'ovulation', 'follicular', 'amh', 'conception', 
      'ivf', 'pregnancy planning', 'kavita', 'nambiar'
    ],
    availableSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '05:00 PM', '06:30 PM'],
    isFictionalDemo: true
  },
  {
    id: 'doc-meno-8',
    name: 'Dr. Meenakshi Sundaram',
    specialtyId: 'menopause_care',
    specialtyLabel: 'Perimenopause & Healthy Aging',
    title: 'Midlife & Menopause Medicine Consultant',
    credentials: 'MD (OB-GYN), Certified Menopause Practitioner (IMS) — Fictional Demo Profile',
    experienceYears: '18+ Years (Simulated)',
    languages: ['English', 'Tamil', 'Hindi'],
    rating: '4.97 (Demo Rating • 380 reviews)',
    simulatedFee: 800,
    simulatedFeeFormatted: '₹800 (Simulated Demo)',
    supportedModes: ['video', 'in_clinic'],
    clinicName: 'Adyar Healthy Aging & Menopause Clinic (Simulated)',
    clinicLocation: 'Sardar Patel Road, Adyar, Chennai, Tamil Nadu (Simulated Demo)',
    bio: 'Clinical expertise in perimenopause transition support, hot flash management, bone density preservation, sleep health, and holistic midlife hormonal transitions.',
    searchKeywords: [
      'menopause', 'perimenopause', 'hot flashes', 'night sweats', 'bone density', 
      'osteoporosis', 'hormone therapy', 'estrogen', 'meenakshi', 'sundaram'
    ],
    availableSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '06:30 PM'],
    isFictionalDemo: true
  }
];

/**
 * Pure search and filtering helper for the doctors directory.
 * Supports case-insensitive query matching against name, title, bio, and keywords.
 * 
 * @param {Object} options
 * @param {string} [options.query=''] - Search term
 * @param {string} [options.specialty='all'] - Specialty ID filter
 * @param {string} [options.mode='all'] - Consultation mode filter ('video' | 'in_clinic' | 'all')
 * @returns {Array} Filtered doctor list
 */
export function filterDoctors({ query = '', specialty = 'all', mode = 'all' } = {}) {
  const cleanQuery = query.trim().toLowerCase();

  return DOCTORS_CATALOG.filter((doc) => {
    // 1. Specialty filter
    if (specialty && specialty !== 'all' && doc.specialtyId !== specialty) {
      return false;
    }

    // 2. Mode filter
    if (mode && mode !== 'all') {
      if (!doc.supportedModes.includes(mode)) {
        return false;
      }
    }

    // 3. Search query filter
    if (cleanQuery) {
      const nameMatch = doc.name.toLowerCase().includes(cleanQuery);
      const titleMatch = doc.title.toLowerCase().includes(cleanQuery);
      const specMatch = doc.specialtyLabel.toLowerCase().includes(cleanQuery);
      const bioMatch = doc.bio.toLowerCase().includes(cleanQuery);
      const keywordMatch = doc.searchKeywords.some((kw) => kw.toLowerCase().includes(cleanQuery));

      if (!nameMatch && !titleMatch && !specMatch && !bioMatch && !keywordMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Pure helper to look up a doctor profile by ID.
 * @param {string} doctorId 
 * @returns {Object|null}
 */
export function getDoctorById(doctorId) {
  if (!doctorId) return null;
  return DOCTORS_CATALOG.find((doc) => doc.id === doctorId) || null;
}
