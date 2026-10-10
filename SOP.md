# SheSync: Statement of Purpose & Standard Operating Procedure (SOP)

**Event:** SITAMS × HackSphere Hackathon  
**Track / Domain:** Healthcare & Women's Wellness *(Official category designation: Pending confirmation)*  
**Project:** SheSync — Women's Holistic Wellness Companion  
**Version:** 0.4.0 (Phase 4 Baseline: Doctor Appointments & Calendar Export)

---

## 1. Problem Statement, Target Audience & Motivation

### 1.1 Problem Statement
Reproductive and hormonal health management for women is significantly hindered by fragmented single-purpose tools, invasive cloud trackers that monetize intimate cycle telemetry, and deceptive marketing around unverified "AI" medical diagnostics. Women and menstruators frequently face:
* **Privacy Vulnerabilities:** Sensitive menstrual, symptom, and personal data being sent to third-party ad networks or unencrypted cloud databases.
* **Fragmented Care Workflows:** Needing separate apps for cycle logging, hygiene product purchasing, practitioner appointment scheduling, and clinical education.
* **Medical Misinformation:** Unverified online health advice and lack of accessible, evidence-based reproductive guidance cited from recognized public-health authorities.

### 1.2 Target Audience
* **Menstruators & Cycle Trackers:** Individuals seeking transparent, predictable, client-side cycle calculations and daily symptom/mood logs without privacy trade-offs.
* **Essential Care Seekers:** Users wanting curated menstrual hygiene, pregnancy, comfort, and postpartum essentials in a unified interface.
* **Healthcare Consult Seekers:** Users looking to discover relevant healthcare specialists (gynaecologists, fertility experts, nutritionists) and manage consultation schedules with calendar integration.
* **Health Seekers & Expectant Mothers:** Individuals looking for peer-reviewed reproductive guides, red-flag pregnancy warning signs, interactive myth-busting, and emergency helplines.

### 1.3 Project Motivation
SheSync was designed from first principles as a **privacy-first, deterministic, all-in-one companion**. By executing all calculations and storage 100% locally in the client browser, SheSync eliminates server telemetry risks while delivering a complete, modern wellness ecosystem.

---

## 2. Proposed Solution Architecture & Implemented Modules

SheSync is a single-page progressive web application built with **React 18** and **Vite 6**, styled using a custom **Vanilla CSS token design system** with zero heavy UI dependencies.

```text
SheSync Architecture (Phase 4 Baseline)
├── Shared Shell
│   ├── Responsive Header (Desktop Nav, Theme Switcher, Demo Reset, Medical Disclaimer)
│   ├── Mobile Bottom Navigation Bar (4-Tab Switcher)
│   ├── Toast Notification Provider (Non-blocking queue)
│   ├── Theme Engine (Blush Light / Velvet Dark with localStorage persistence)
│   └── Medical & Simulation Disclaimer Modal
│
├── Module 1: Periods & Wellbeing (Fully Implemented)
│   ├── Deterministic Cycle Math (Ovulation = Cycle Length − 14d, Fertile Window: −5d to +1d)
│   ├── Interactive Monthly Cycle Calendar (Visual period & fertile status indicators)
│   ├── Daily Symptom & Mood Logger (Flow, 1–5 pain scale, energy, cervical mucus, moods, notes)
│   ├── Cycle History & Irregularity Detector (Rolling average & clinical variance alerts)
│   ├── Phase-Aligned Wellbeing Guidance (Follicular, Ovulatory, Luteal, Menstrual tips)
│   └── Printable Doctor Consultation Report (PDF-ready medical summary)
│
├── Module 2: Wellness Store (Simulation Mode — Fully Implemented)
│   ├── Categorized Product Catalog (Period Care, Baby Care, Pregnancy, Comfort Picks, Wellness)
│   ├── Product Detail Modal (INR pricing, descriptions, usage notes, key highlights)
│   ├── Dedicated "Comfort Picks" Showcase (Nourishing foods with explicit non-cure disclaimers)
│   ├── Cart Drawer (Item CRUD, live subtotal math, free delivery threshold calculation)
│   ├── Promo Voucher Engine (Simulated codes: SHESYNC10, HACKSPHERE)
│   ├── 2-Step Simulated Checkout (Contact details, simulated payment method, validation)
│   └── Itemized Order Receipts & Simulated Delivery Tracker
│
├── Module 3: Doctor Consultations (Simulation Mode — Fully Implemented)
│   ├── Specialist Directory (8 fictional profiles across 6 clinical domains)
│   ├── Multi-Criteria Discovery (Instant search by name, specialty, keywords & mode filter)
│   ├── Doctor Detail Modal (Credentials, clinic location, consultation fee, bio, reviews)
│   ├── Booking Modal (Constraint-checked date selection: tomorrow to +30 days, approved slots)
│   ├── Appointment Management (Active duplicate booking prevention, confirmed/rescheduled/cancelled states)
│   ├── Reschedule & Cancellation Modals (Atomic date/slot updates and confirmation dialogs)
│   └── RFC 5545 `.ics` Calendar Sync (1-click export for Apple Calendar, Google Calendar, Outlook)
│
└── Module 4: Learn & Support Hub (Fully Implemented)
    ├── Evidence-Based Maternal & Cycle Guides (8 articles with WHO, MoHFW India, NHS, CDC citations)
    ├── Article Reader Modal, Search & Persistent Bookmarking
    ├── Urgent Pregnancy Warning Signs Checklist (Immediate hospital consultation guidance)
    ├── Interactive Myth vs. Fact Mini-Quiz (Instant scientific validation & explanations)
    └── National Emergency Helpline Directory (Verified India emergency & crisis numbers)
```

---

## 3. Key User Workflows

```text
[1. Cycle Tracking Workflow]
User Enters Last Period Date & Cycle Length
  ──> Deterministic Engine computes next period, ovulation day, and fertile window
  ──> Calendar renders color-coded indicators
  ──> User logs daily symptoms/moods ──> Persisted to localStorage (shesync_symptoms)
  ──> User views history / generates Printable Doctor Summary for clinical appointments

[2. Wellness Store Workflow]
User Browses Categories / Comfort Picks
  ──> Views Product Details ──> Adds to Cart (shesync_cart)
  ──> Applies Promo Voucher (SHESYNC10) ──> Proceeds to Simulated Checkout
  ──> Fills Simulated Shipping Details ──> Completes Demo Order
  ──> Order persisted to shesync_orders ──> Displays Itemized Delivery Receipt

[3. Doctor Appointment Workflow]
User Searches/Filters Specialist Directory (by Specialty, Keyword, or Mode)
  ──> Clicks "Book Consultation" or views Doctor Profile Modal
  ──> Selects valid Date (Tomorrow to +30d) and Approved Time Slot
  ──> Submits Booking ──> Validated against duplicate active bookings with same doctor
  ──> Persisted to shesync_appointments ──> Appears in "Upcoming Consultations"
  ──> User can 1-Click Export .ics Calendar File, Reschedule to another slot, or Cancel

[4. Learn & Support Workflow]
User Searches Health Topics or Browses Categories
  ──> Opens Article Reader with official Public-Health Citations (WHO, NHS, MoHFW, CDC)
  ──> Bookmarks Articles for offline reference (shesync_bookmarks)
  ──> Takes Myth vs. Fact Quiz for interactive scientific learning
  ──> Accesses Urgent Red-Flag Signs Checklist or Emergency Helplines
```

---

## 4. Technology Stack & Implementation Standards

* **Frontend Framework:** React 18.3.1 (`react`, `react-dom`)
* **Build System & Dev Tooling:** Vite 6.1.0 (`vite`, `@vitejs/plugin-react`)
* **Styling Architecture:** Custom CSS Custom Properties (`variables.css`, `index.css`) utilizing modular component CSS files, responsive media queries, and high-contrast WCAG-compliant color palettes.
* **Iconography:** Lucide React 1.16.0 (`lucide-react`)
* **Testing Stack:** Vitest 3.0.5 (`vitest`) with JSDOM 25.0.1 (`jsdom`)
* **Calendar Engine:** RFC 5545 compliant `.ics` generator with line folding and character escaping (`src/utils/calendarExport.js`)
* **Data Storage:** Safe `localStorage` layer (`src/utils/storage.js`) featuring JSON parsing validation, schema safety, and `shesync_` namespace isolation.

---

## 5. AI-Assisted Development Disclosure

* **AI Tooling Utilized:** Antigravity IDE (powered by Gemini) was utilized throughout the hackathon as an AI pair-programming assistant for project scaffolding, architectural structuring, unit test formulation, and documentation maintenance.
* **Code Verification & Oversight:** All generated code was inspected, verified, and audited against strict functional requirements. Comprehensive automated test suites (`tests/`) validate all calculation logic, storage operations, and component state transitions.
* **No False AI Claims:** SheSync explicitly **does not contain a live AI model, neural network, or automated machine-learning diagnostic system**. All clinical cycle estimations, appointment conflict validations, and cart calculations are transparent, deterministic, client-side algorithms.
* **Hackathon Compliance:** AI usage in this project conforms to standard hackathon pair-programming guidelines *[Official hackathon AI policy status: Pending Confirmation with Organizers]*.

---

## 6. Data Handling, Privacy, Security & Disclaimers

1. **Strict Client-Side Isolation:** 100% of user data is stored in the client browser's `localStorage`. No user-identifying telemetry, cookies, or remote server endpoints exist.
2. **Data Minimization in Scheduling:** Appointment records store only scheduling metadata (`id`, `doctorId`, `doctorName`, `specialty`, `date`, `timeSlot`, `consultationMode`, `status`, `createdAt`, `updatedAt`). No patient names, phone numbers, email addresses, symptoms, or medical notes are stored in appointment records.
3. **Deterministic Rhythm Formulas:** Cycle forecasts use standard calendar rhythm math. They are non-diagnostic approximations and must **never** be used for contraception, family planning, or pregnancy prevention.
4. **Fictional Doctor Profiles:** All 8 specialists in the Appointments module are fictional demo profiles. Credentials, fees, clinic names, and availability slots are simulated.
5. **Simulation Disclosures:** Store checkout and doctor appointments operate in simulation mode. No real monetary transactions, credit card charges, or actual clinical bookings take place.
6. **Educational Scope:** Articles in the Learn Hub are compiled from authoritative public-health agencies (WHO, MoHFW, NHS, CDC) for general awareness. They do not replace professional clinical diagnosis or emergency medical care.
7. **Comfort Foods Non-Cure Disclaimer:** Snacks in "Comfort Picks" provide dietary nourishment and personal comfort, but do not cure dysmenorrhea or menstrual cramps.
8. **Isolated Demo Reset:** The "Reset Demo Data" action purges only keys prefixed with `shesync_` and atomically synchronizes all React context state without page reload or touching other browser data.

---

## 7. Testing & Quality Assurance Plan

### 7.1 Automated Test Suites (`npm run test`)
The test suite consists of **13 test files with 69 passing tests** across all core modules:

| Test Suite File | Test Count | Module / Scope Covered |
| :--- | :--- | :--- |
| `tests/storage.test.js` | 3 tests | Key prefix isolation, JSON serialization & error fallbacks |
| `tests/phase1Verification.test.js` | 5 tests | Shell navigation, disclaimer modal & theme switcher |
| `tests/cycleCalculations.test.js` | 13 tests | Rhythm math, ovulation offsets, fertile windows & irregularity alerts |
| `tests/cycleBoundaryDates.test.js` | 6 tests | Leap years, year transitions, bounds checking & late cycle handling |
| `tests/cycleContext.test.js` | 4 tests | Cycle state CRUD, symptom logging & printable summary aggregation |
| `tests/productFilter.test.js` | 3 tests | Product catalog categorization & keyword search filtering |
| `tests/cartOperations.test.js` | 4 tests | Cart CRUD, quantity steppers, promo voucher math & order persistence |
| `tests/cartEdgeCases.test.js` | 4 tests | Quantity bounds, coupon case-insensitivity, grand total & address regex |
| `tests/learnArticles.test.js` | 3 tests | Health guides catalog, public-health citations & bookmark storage |
| `tests/resetStateSync.test.js` | 2 tests | Isolated `shesync_*` key purge and React state re-sync |
| `tests/doctorFilter.test.js` | 7 tests | Doctor catalog schema, name/specialty/keyword search & mode filter |
| `tests/appointmentBooking.test.js` | 10 tests | Booking constraints, duplicate prevention, rescheduling & cancellation |
| `tests/appointmentEdgeCases.test.js` | 5 tests | Leap year dates, slot release on cancel, rescheduling isolation & RFC 5545 `.ics` |

> [!NOTE]
> **Test Status Note:** 69/69 tests passed represents the latest reported automated test execution in the development environment and is not a guarantee of future environment-dependent results.

### 7.2 Manual Verification Scope & Known Limitations
* **Automated:** Algorithmic calculation accuracy, state transitions, validation boundaries, and serialization.
* **Manual Verification Required:**
  * Native OS calendar app integration: Opening generated `.ics` files in Apple Calendar, Google Calendar, or Microsoft Outlook on diverse mobile and desktop operating systems.
  * Print dialog styling: Rendering of the Printable Doctor Summary across various printer drivers and page formats.
  * Physical touchscreen interactions across varied device dimensions.

---

## 8. Build & Deployment Status

* **Local Production Build:** Fully verified. Running `npm run build` compiles clean production assets to `dist/` with zero bundling warnings. The local build can be previewed using `npm run preview`.
* **Public Cloud Deployment:** Live remote hosting (e.g., Vercel, Netlify, or GitHub Pages) and automated CI/CD deployment pipelines remain to be configured as planned future work. No live deployment URLs or production secrets are currently configured.

---

## 9. SITAMS × HackSphere Participant Compliance Checklist

- [x] **Problem Identification:** Explicitly documented women's health fragmentation and privacy vulnerabilities.
- [x] **Standard Operating Procedure (SOP):** Defined architecture, technology stack, testing plan, and data handling policies.
- [x] **Permitted AI Disclosure:** Truthfully documented AI pair-programming usage with zero false AI diagnostic claims.
- [x] **Phase 1 Foundation Build:** Responsive navigation, design system tokens, disclaimer modal & theme engine.
- [x] **Phase 2 Periods & Wellbeing Module:** Deterministic cycle math, interactive calendar, symptom logger & printable health summary.
- [x] **Phase 3 Wellness Store & Learn Expansion:** 5 product categories, Comfort Picks, Cart Drawer, vouchers, simulated checkout, order receipts, 8 evidence-based health guides with public-health citations (WHO, MoHFW, NHS, CDC), search, bookmarking, and Myth vs. Fact quiz.
- [x] **Phase 4 Doctor Appointments Module:** 8 fictional specialist profiles, multi-criteria search/filtering, conflict-free booking, atomic rescheduling, cancellation, and RFC 5545 `.ics` calendar sync.
- [x] **Automated Testing:** 69/69 tests passing across 13 test suites (`npm run test`).
- [x] **Clean Production Build:** Production bundle compiled with zero errors (`npm run build`).
- [ ] **Phase 5 Advanced Health & Community Support:** *(Planned Future Work)*.
- [ ] **Phase 6 Privacy, Security & Offline Data Persistence (PIN Lock / JSON Backup):** *(Planned Future Work)*.
- [ ] **Phase 7 Live Public Deployment & CI Pipeline:** *(Planned Future Work)*.
