/**
 * SheSync — Pregnancy Emergency Care & SOS Reference Data
 * 
 * Verifiable national emergency numbers, authentic public-health first-aid guidelines,
 * and verified referral hospital directory across major Indian metropolitan areas.
 */

export const EMERGENCY_NUMBERS = [
  {
    id: 'national-112',
    name: 'National Emergency Helpline (All-in-One)',
    number: '112',
    desc: 'Unified 24/7 national emergency response (Police, Fire, Ambulance)',
    type: 'national',
    isDefault: true
  },
  {
    id: 'ambulance-108',
    name: 'National Ambulance & Emergency Medical Services',
    number: '108',
    desc: 'Free 24/7 emergency medical response and hospital transit in India',
    type: 'ambulance'
  },
  {
    id: 'maternal-102',
    name: 'Janani Shishu Suraksha Karyakram (JSSK) Helpline',
    number: '102',
    desc: 'Free transport for pregnant women and sick neonates to public facilities',
    type: 'maternal'
  },
  {
    id: 'women-181',
    name: 'Women in Distress National Helpline',
    number: '181',
    desc: '24/7 confidential emergency response and protection support for women',
    type: 'support'
  },
  {
    id: 'telemanas-14416',
    name: 'Tele-MANAS Maternal & Mental Health Support',
    number: '14416',
    desc: 'Toll-free 24/7 mental health & emotional crisis support (MoHFW India)',
    type: 'mental_health'
  }
];

export const INITIAL_PREGNANCY_PROFILE = {
  weeksPregnant: 24,
  dueDate: '2026-11-15',
  trimester: '2nd Trimester',
  bloodGroup: 'O+',
  allergies: 'Penicillin (Mild rash)',
  medications: 'Folic acid 500mcg, Iron 30mg daily',
  doctorName: 'Dr. Ananya Sharma',
  doctorPhone: '+919876543210',
  hospitalPreference: 'Vani Vilas Hospital (Victoria Hospital Campus), Bengaluru',
  // Selective Consent Settings for Emergency SOS Broadcast
  shareStageOnSOS: true,
  shareBloodGroupOnSOS: true,
  shareAllergiesOnSOS: true,
  shareLocationOnSOS: true,
  shareDoctorInfoOnSOS: true
};

export const INITIAL_EMERGENCY_CONTACTS = [
  {
    id: 'contact-1',
    name: 'Kavita Sharma (Partner)',
    phone: '+919876500001',
    relationship: 'Partner / Spouse',
    isPrimary: true,
    notifyOnSOS: true
  },
  {
    id: 'contact-2',
    name: 'Dr. Ananya Sharma (Obstetrician)',
    phone: '+919876543210',
    relationship: 'Primary Obstetrician',
    isPrimary: false,
    notifyOnSOS: true
  },
  {
    id: 'contact-3',
    name: 'Meera Patel (Mother / Next of Kin)',
    phone: '+919876500002',
    relationship: 'Family Member',
    isPrimary: false,
    notifyOnSOS: false
  }
];

export const VERIFIED_HOSPITALS_DIRECTORY = [
  {
    id: 'hosp-blr-1',
    name: 'Vani Vilas Hospital (Victoria Hospital Campus)',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Fort Road, Near Kalasipalyam, Bengaluru - 560002',
    phone: '080-26701150',
    emergencyPhone: '080-26701150',
    type: 'Government Apex Maternity & Neonatal Referral Hospital',
    facilities: ['24/7 Obstetric Emergency', 'NICU Level III', 'High-Risk Pregnancy Unit', 'Blood Bank'],
    coordinates: { lat: 12.9592, lng: 77.5753 },
    open24x7: true
  },
  {
    id: 'hosp-blr-2',
    name: 'Bowring and Lady Curzon Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Lady Curzon Road, Shivajinagar, Bengaluru - 560001',
    phone: '080-25591325',
    emergencyPhone: '080-25591325',
    type: 'Government General & Maternity Hospital',
    facilities: ['24/7 Emergency Casualty', 'Obstetric Triage', 'SNCU Unit'],
    coordinates: { lat: 12.9822, lng: 77.6047 },
    open24x7: true
  },
  {
    id: 'hosp-del-1',
    name: 'Safdarjung Hospital & Vardhman Mahavir Medical College',
    city: 'Delhi NCR',
    state: 'Delhi',
    address: 'Ring Road, Opposite AIIMS, New Delhi - 110029',
    phone: '011-26165060',
    emergencyPhone: '011-26165060',
    type: 'Central Apex Referral Hospital & Maternal Care',
    facilities: ['24/7 Obstetric Emergency', 'NICU Level III', 'Emergency Triage', 'Blood Bank'],
    coordinates: { lat: 28.5684, lng: 77.2069 },
    open24x7: true
  },
  {
    id: 'hosp-del-2',
    name: 'Kasturba Hospital (Maternity Referral)',
    city: 'Delhi NCR',
    state: 'Delhi',
    address: 'Near Jama Masjid, Daryaganj, New Delhi - 110006',
    phone: '011-23274381',
    emergencyPhone: '011-23274381',
    type: 'Specialized Maternal & Infant Care Hospital',
    facilities: ['24/7 Labor Triage', 'Neonatal Care', 'Antenatal High Risk Unit'],
    coordinates: { lat: 28.6508, lng: 77.2343 },
    open24x7: true
  },
  {
    id: 'hosp-mum-1',
    name: 'Cama & Albless Hospital for Women and Children',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Mahapalika Marg, Dhobi Talao, Fort, Mumbai - 400001',
    phone: '022-22620390',
    emergencyPhone: '022-22620390',
    type: 'Government Specialized Women & Children Hospital',
    facilities: ['24/7 Obstetric Emergency', 'NICU', 'Maternal High Risk Unit'],
    coordinates: { lat: 18.9416, lng: 72.8315 },
    open24x7: true
  },
  {
    id: 'hosp-mum-2',
    name: 'KEM Hospital (King Edward Memorial Hospital)',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Acharya Donde Marg, Parel, Mumbai - 400012',
    phone: '022-24107000',
    emergencyPhone: '022-24107000',
    type: 'Municipal Tertiary Care & Maternal Trauma Center',
    facilities: ['24/7 Emergency Ward', 'Obstetric ICU', 'Level III NICU', 'Blood Bank'],
    coordinates: { lat: 19.0028, lng: 72.8427 },
    open24x7: true
  },
  {
    id: 'hosp-chn-1',
    name: 'Institute of Obstetrics and Gynaecology (IOG), Egmore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Police Station Road, Egmore, Chennai - 600008',
    phone: '044-28191982',
    emergencyPhone: '044-28191982',
    type: 'Apex State Maternal & Neonatal Referral Center',
    facilities: ['24/7 Obstetric Emergency', 'Emergency C-Section Theater', 'Level III NICU'],
    coordinates: { lat: 13.0763, lng: 80.2598 },
    open24x7: true
  },
  {
    id: 'hosp-hyd-1',
    name: 'Government Modern Maternity Hospital, Petlaburj',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'High Court Road, Petlaburj, Hyderabad - 500002',
    phone: '040-24523992',
    emergencyPhone: '040-24523992',
    type: 'Government Apex Maternity Hospital',
    facilities: ['24/7 Labor Triage', 'High Risk Pregnancy Ward', 'Neonatal ICU'],
    coordinates: { lat: 17.3625, lng: 78.4717 },
    open24x7: true
  }
];

export const FIRST_AID_PROTOCOLS = [
  {
    id: 'protocol-fainting',
    title: 'Fainting (Syncope) in Pregnancy — First-Aid Protocol',
    summary: 'Sudden dizziness, lightheadedness, or loss of consciousness during pregnancy.',
    steps: [
      {
        step: 1,
        title: 'Position on the Left Side (Left Lateral Recovery)',
        detail: 'Lay the person down immediately on their left side. This relieves the heavy uterus from compressing the Inferior Vena Cava (large vein), restoring blood flow and oxygen to the heart, brain, and placenta.'
      },
      {
        step: 2,
        title: 'Ensure Open Airway & Loosen Clothing',
        detail: 'Ensure their airway is clear. Loosen tight neckbands, waistbands, or collars. Elevate legs slightly if comfortable.'
      },
      {
        step: 3,
        title: 'DO NOT Give Food or Drink While Unconscious',
        detail: 'Never force fluids or food while a person is disoriented or unresponsive due to severe choking and aspiration risk.'
      },
      {
        step: 4,
        title: 'Assess Responsiveness & Time',
        detail: 'If the person does not regain consciousness within 60 seconds, or if accompanied by seizures, bleeding, or breathing difficulty, call 112 / 108 immediately.'
      }
    ],
    citation: 'World Health Organization (WHO) & Royal College of Obstetricians and Gynaecologists (RCOG) Clinical Syncope Guidelines'
  },
  {
    id: 'protocol-redflags',
    title: 'Critical Pregnancy Red Flags (Immediate Hospital Triage)',
    summary: 'Acute symptoms requiring emergency medical evaluation without delay.',
    flags: [
      'Fresh bright red vaginal bleeding or continuous watery fluid leakage',
      'Severe, unremitting abdominal or pelvic pain',
      'Sudden blurred vision, flashing spots, or blinding headache (Pre-eclampsia warning)',
      'Sudden swelling of the face, hands, or around the eyes',
      'High fever (> 38°C / 100.4°F) with chills or stiff neck',
      'Noticeable, sudden decrease in baby movements after 28 weeks'
    ],
    citation: 'Ministry of Health and Family Welfare (MoHFW), Govt. of India — Maternal Emergency Triage Protocols'
  }
];
