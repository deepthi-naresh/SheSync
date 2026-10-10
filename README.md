# SheSync — Women's Holistic Wellness & Cycle Companion

> **SITAMS × HackSphere Hackathon Project**  
> A privacy-first, client-side, mobile-responsive women's wellness web application with zero external health tracking, transparent deterministic algorithms, and realistic module workflows.

---

## 📌 Project Overview & Problem Statement

### Problem Statement
Modern women's health tracking is frequently fragmented across disconnected applications that monetize sensitive health telemetry through third-party cloud trackers, promote opaque or misleading "AI" diagnostic claims, and fail to provide holistic care integration (such as curated hygiene essentials, medical consultation scheduling, and evidence-based clinical education).

### SheSync Solution
SheSync provides a unified, 100% client-side, private wellness companion that combines:
1. **Periods & Wellbeing:** Clinically grounded deterministic cycle predictions, interactive monthly calendar, daily symptom and mood logger, cycle history analysis with irregularity alerts, and printable doctor consultation summaries.
2. **Wellness Store (Simulation Mode):** Curated menstrual, maternal, and wellness product discovery, cart management, promotional voucher calculations, and simulated checkout with itemized order receipts.
3. **Doctor Appointments (Simulation Mode):** Specialist directory of fictional practitioners, search and multi-criteria filtering, conflict-free appointment booking, atomic rescheduling, cancellation, and standard RFC 5545 `.ics` calendar sync.
4. **Learn & Support Hub:** Evidence-based reproductive and maternal health guides cited from public-health authorities (WHO, MoHFW India, NHS, CDC), interactive Myth vs. Fact quiz, urgent pregnancy warning signs checklist, and verified national emergency helplines.
5. **Pregnancy Emergency Care & SOS:** Instant manual SOS trigger, accidental cancellation flow, consent-controlled medical profile & GPS location sharing, pulse telemetry & fainting drop simulation, verified 24/7 maternity referral hospital directory, and first-aid protocols.

---

## 👥 Target Users & Problem Addressed

| Target Audience | Core Need Addressed | SheSync Feature Solution |
| :--- | :--- | :--- |
| **Menstruators & Cycle Trackers** | Private, transparent cycle forecasting without third-party data collection. | Client-side deterministic cycle engine, fertile window calculation, symptom & mood logging. |
| **Individuals Seeking Care Essentials** | Finding curated hygiene, pregnancy, and comfort products in one place. | Categorized wellness store, "Comfort Picks" nourishing foods, simulated cart & checkout. |
| **Users Needing Specialist Consultations** | Finding relevant health practitioners and managing appointment schedules. | Multi-specialty doctor directory, slot booking, rescheduling, and 1-click `.ics` calendar export. |
| **Expectant Mothers & Urgent Situations** | Fast, reliable emergency access during fainting or sudden medical distress. | 1-Click SOS broadcast, emergency contacts, pulse monitor, and nearby hospital triage. |
| **Health Seekers & Expectant Parents** | Accessing credible, peer-reviewed health guidance free of medical myths. | Public-health sourced health guides, urgent red-flag checklists, Myth vs. Fact quiz, emergency helplines. |

---

## 📊 Feature Status Matrix (Complete Baseline)

| Module / Area | Feature | Current Status | Notes |
| :--- | :--- | :--- | :--- |
| **Shell & Layout** | Responsive Navigation (Desktop + Mobile) | ✅ **Implemented** | 5-tab desktop header & mobile bottom navigation bar |
| **Shell & Layout** | Theme Engine (Blush Light / Velvet Dark) | ✅ **Implemented** | Persistent theme toggle via `localStorage` |
| **Shell & Layout** | Medical & Demo Disclaimer Banner | ✅ **Implemented** | Interactive modal and top awareness banner |
| **Privacy & Security** | Safe Isolated Demo Data Reset | ✅ **Implemented** | Clears only `shesync_*` keys with immediate React state re-sync |
| **Privacy & Security** | 100% Client-Side Local Storage | ✅ **Implemented** | Zero external telemetry, cookies, or remote server synchronization |
| **Periods & Wellbeing** | Deterministic Cycle Engine & Calculations | ✅ **Implemented** | Clinical rhythm math (Ovulation = Cycle Length − 14d) |
| **Periods & Wellbeing** | Interactive Monthly Cycle Calendar | ✅ **Implemented** | Highlights period days, predicted next cycle, & fertile window |
| **Periods & Wellbeing** | Daily Mood & Symptom Logger | ✅ **Implemented** | Flow intensity, pain rating (1–5), energy, cervical mucus, moods, notes |
| **Periods & Wellbeing** | Cycle History & Irregularity Detection | ✅ **Implemented** | Rolling cycle average & clinical variance alert notifications |
| **Periods & Wellbeing** | Phase-Aligned Wellbeing Guidance | ✅ **Implemented** | Evidence-based nutrition, gentle exercise, & cramp care suggestions |
| **Periods & Wellbeing** | Printable Medical Health Summary | ✅ **Implemented** | Clean, printable PDF-ready consultation report for doctor visits |
| **Wellness Store** | Categorized Product Catalog (5 Categories) | ✅ **Implemented** | Period Care, Baby Care, Pregnancy, Comfort Picks, General Wellness |
| **Wellness Store** | Visual Product Cards & Detail Modal | ✅ **Implemented** | INR pricing, key highlights, image fallbacks, usage notes |
| **Wellness Store** | Dedicated "Comfort Picks" Showcase | ✅ **Implemented** | Nourishing foods with explicit non-cure cramp disclaimers |
| **Wellness Store** | Cart Drawer & Live Subtotal Math | ✅ **Implemented** | Add/remove items, quantity steppers, subtotal & free delivery threshold |
| **Wellness Store** | Promo Codes & Simulated Checkout Flow | ✅ **Implemented** | `SHESYNC10`, `HACKSPHERE` vouchers, 2-step simulated checkout |
| **Wellness Store** | Order Receipts & Delivery Timeline | ✅ **Implemented** | Itemized order confirmation, simulated delivery tracking, printable receipt |
| **Doctor Appointments** | Specialist Directory (8 Fictional Profiles) | ✅ **Implemented** | Gynaecology, Fertility, Nutrition, Obstetrics, Endocrinology, Pelvic Health |
| **Doctor Appointments** | Search & Multi-Filter Engine | ✅ **Implemented** | Instant search by name, specialty, keywords, and consultation mode |
| **Doctor Appointments** | Doctor Detail & Booking Modals | ✅ **Implemented** | Profile overview, credentials, slot selection (tomorrow to +30 days) |
| **Doctor Appointments** | Appointment Conflict & Status Management | ✅ **Implemented** | Duplicate active booking prevention, confirmed/rescheduled/cancelled states |
| **Doctor Appointments** | Reschedule & Cancel Workflows | ✅ **Implemented** | In-modal slot adjustment and explicit cancellation modal |
| **Doctor Appointments** | RFC 5545 `.ics` Calendar Sync | ✅ **Implemented** | 1-click `.ics` file generation for Apple Calendar, Google Calendar, Outlook |
| **Emergency Care & SOS** | Instant Manual SOS Broadcast & Cancel Flow | ✅ **Implemented** | High-impact SOS button, active emergency HUD & accidental cancel flow |
| **Emergency Care & SOS** | Location & Medical Profile Consent Sharing | ✅ **Implemented** | Selective toggles for gestational age, blood group, allergies, and GPS |
| **Emergency Care & SOS** | Emergency Contacts Management | ✅ **Implemented** | CRUD trusted contacts, primary contact star, and 1-click `tel:` dialers |
| **Emergency Care & SOS** | Real Bluetooth BLE Heart-Rate Monitor (GATT 0x180D / 0x2A37) | ✅ **Implemented** | Web Bluetooth API, 8-bit & 16-bit BPM parsing, 10 connection states, live waveform & timestamps |
| **Emergency Care & SOS** | Simulated Pulse Demo Mode (Isolated) | ✅ **Implemented** | Explicitly labeled "SIMULATED DEMO — NOT A REAL MEASUREMENT", zero mixing with genuine BLE data |
| **Emergency Care & SOS** | Nearby 24/7 Hospital Directory & Maps Search | ✅ **Implemented** | Verified referral centers, casualty phone numbers & Google Maps search |
| **Emergency Care & SOS** | First-Aid & Red-Flag Guidance | ✅ **Implemented** | Left Lateral position steps, emergency checklist, & 24/7 helpline pills |
| **Learn & Support** | Health & Maternal Guides (8 Articles) | ✅ **Implemented** | Traceable public-health citations (WHO, MoHFW India, NHS, CDC) |
| **Learn & Support** | Article Search & Bookmarking Engine | ✅ **Implemented** | Keyword filter and persistent bookmarking saved to `localStorage` |
| **Learn & Support** | Urgent Pregnancy Warning Signs Guide | ✅ **Implemented** | Clinical red-flag checklist recommending prompt emergency care |
| **Learn & Support** | Myth vs. Fact Interactive Mini-Quiz | ✅ **Implemented** | Instant scientific validation and evidence explanations |
| **Learn & Support** | Emergency Helpline Directory (India) | ✅ **Implemented** | Verified toll-free numbers with authority citations |
| **Privacy & Security** | PIN Lock & JSON Data Backup/Restore | ⏳ *Planned Future Work* | 4-digit passcode lock & offline JSON data export/import |
| **Deployment** | CI/CD Automated Cloud Hosting Pipeline | ⏳ *Planned Future Work* | Production deployment verification |

---

## 🛡️ Privacy Disclosures & Demo Limitations

> [!IMPORTANT]
> **Please review these disclosures regarding data handling and simulation scope:**

* **100% Client-Side Storage:** All cycle records, symptom entries, cart contents, bookmarks, demo orders, appointment schedules, emergency contacts, and pregnancy profiles are stored strictly in your browser's `localStorage` under the `shesync_` namespace. No health, personal, or tracking data is uploaded to remote servers.
* **Bluetooth Privacy & Ephemeral Data:** Real Bluetooth heart-rate readings are strictly ephemeral and processed in-memory only. Continuous heart-rate streams are **never** persisted to `localStorage` or transmitted to any external telemetry service or analytics endpoint.
* **Web Bluetooth Compatibility:** Real heart-rate monitoring uses the standard Web Bluetooth API (`navigator.bluetooth`). It requires a secure context (HTTPS or localhost) and a compatible browser (Google Chrome or Microsoft Edge on Windows, macOS, Linux, ChromeOS, or Android). **iOS Safari does not support the Web Bluetooth API**.
* **Emergency Support Scope & Non-Diagnostic Advisory:** SheSync Emergency Care is a rapid **emergency-support tool, NOT a diagnostic medical device**. A heart-rate monitor alone cannot diagnose fainting, low blood pressure, low blood sugar, or pregnancy complications. Normal or abnormal pulse readings do not rule out obstetric emergencies. SheSync does not invent arbitrary clinical thresholds or trigger automatic emergency broadcasts from pulse data. In severe situations or reported fainting, always contact national emergency **112 / 108** immediately.
* **SOS Unconditional Access:** Emergency SOS triggers, emergency contacts dialers, nearby hospital routes, and first-aid instructions remain 100% accessible at all times without requiring a Bluetooth connection or active wearable device.
* **Honest Notification Architecture:** Emergency SMS broadcasts and hospital listings operate in transparent demo/client mode. Real automated SMS delivery requires an integrated backend service (e.g., Twilio/AWS SNS). In client mode, users can use 1-click copy, native SMS links, or direct phone dialers.
* **Fictional Doctor Profiles:** All 8 doctor profiles, credentials, ratings, experience records, clinic names, consultation fees, and availability schedules in the Appointments module are **entirely fictional demonstration data**.
* **Simulated Appointments & Payments:** The appointment booking and wellness store checkout systems operate in **demonstration simulation mode**. No actual doctor consultations are scheduled and no real financial transactions take place.
* **Estimation & Non-Contraceptive Advisory:** Cycle predictions and fertile window calculations are mathematical approximations derived from standard calendar rhythm formulas. They are **not** clinical diagnoses and must **never** be used for contraception or pregnancy prevention.

---

## 💾 Local Storage Behavior & Data Reset

SheSync uses an isolated key prefix (`shesync_`) to ensure user data remains completely separate from other browser storage:

| Storage Key | Content Stored | Data Type |
| :--- | :--- | :--- |
| `shesync_cycles` | Past period start dates and cycle lengths | JSON Array |
| `shesync_symptoms` | Daily symptom, mood, flow, and pain logs | JSON Object (keyed by `YYYY-MM-DD`) |
| `shesync_cart` | Active shopping cart items and quantities | JSON Array |
| `shesync_orders` | Completed simulated orders and delivery receipts | JSON Array |
| `shesync_bookmarks` | IDs of bookmarked educational articles | JSON Array |
| `shesync_appointments` | Simulated doctor appointment records | JSON Array |
| `shesync_emergency_contacts` | Trusted emergency contacts with relationship & notification flags | JSON Array |
| `shesync_pregnancy_profile` | Gestational age, blood group, allergies, meds & consent flags | JSON Object |
| `shesync_emergency_number` | Primary emergency helpline (Default: `112`) | String |
| `shesync_theme` | Selected UI theme (`blush` or `velvet`) | String |

### Reset Demo Data Function
The **Reset Demo Data** action (accessible in the application header) provides an isolated data purge:
1. Prompts for explicit user confirmation via a modal dialog.
2. Removes **only** keys starting with `shesync_` from `localStorage`, leaving all unrelated browser storage untouched.
3. Automatically increments an internal reset key in `App.jsx` to re-mount context providers (`CycleContext`, `CartContext`, `AppointmentContext`, `EmergencyContext`), instantly clearing all in-memory React state without requiring a browser page refresh.

---

## 🛠️ Technology Stack & Dependencies

The project is built using modern, lightweight frontend standards without heavy component libraries:

* **Core Framework:** [React 18.3.1](https://react.dev/) (`react`, `react-dom`)
* **Build Tooling & Dev Server:** [Vite 6.1.0](https://vitejs.dev/) (`vite`, `@vitejs/plugin-react`)
* **Styling System:** Custom Vanilla CSS with CSS custom properties (variables), responsive flex/grid layouts, and glassmorphic aesthetic tokens (`src/styles/variables.css`, `src/styles/index.css`) — *No Tailwind CSS or third-party CSS frameworks*
* **Iconography:** [Lucide React 1.16.0](https://lucide.dev/) (`lucide-react`)
* **Test Runner & Environment:** [Vitest 3.0.5](https://vitest.dev/) (`vitest`) + [JSDOM 25.0.1](https://github.com/jsdom/jsdom) (`jsdom`)
* **Calendar Sync Utility:** Pure JavaScript RFC 5545 `.ics` iCalendar generator (`src/utils/calendarExport.js`)

---

## 📁 Project Structure

```text
SheSync_Project/
├── index.html                           # Single-page HTML entry point
├── package.json                         # Project metadata, scripts & dependencies
├── vite.config.js                       # Vite configuration
├── vercel.json                          # Vercel SPA rewrite & static caching configuration
├── README.md                            # Comprehensive project documentation
├── SOP.md                               # Statement of Purpose & hackathon compliance
├── tests/                               # Automated test suites (Vitest)
│   ├── appointmentBooking.test.js       # Appointment booking, conflict & date validation tests
│   ├── appointmentEdgeCases.test.js     # Leap years, cancellation slot release & .ics tests
│   ├── cartEdgeCases.test.js            # Quantity bounds, negative protection & address regex tests
│   ├── cartOperations.test.js           # Cart calculations, quantities & promo voucher tests
│   ├── cycleBoundaryDates.test.js       # Leap years, year-end transitions & boundary calculations
│   ├── cycleCalculations.test.js        # Deterministic cycle math & irregularity detection tests
│   ├── cycleContext.test.js             # Cycle state management & symptom logger tests
│   ├── doctorFilter.test.js             # Doctor catalog search & multi-criteria filter tests
│   ├── emergencyCare.test.js            # Emergency SOS, consent, telemetry & hospital search tests
│   ├── learnArticles.test.js            # Article catalog, public-health citations & bookmark tests
│   ├── mobileNavigation.test.js         # Mobile navigation, 5-tab switcher & section switching tests
│   ├── phase1Verification.test.js       # Shell navigation, disclaimer & theme tests
│   ├── productFilter.test.js            # Store product categorization & keyword search tests
│   ├── resetStateSync.test.js           # Isolated demo data reset & state sync tests
│   └── storage.test.js                  # LocalStorage wrapper & error fallback tests
└── src/
    ├── main.jsx                         # React DOM application root
    ├── App.jsx                          # Main shell, tab routing & context provider hierarchy
    ├── App.css                          # Shell layout & view container styles
    ├── index.css                        # Base global CSS entry
    ├── styles/
    │   ├── variables.css                # Color tokens (Blush & Velvet themes), spacing & typography
    │   └── index.css                    # Global resets, glassmorphism utilities & typography
    ├── context/
    │   ├── ThemeContext.jsx             # Light/Dark theme provider & persistence
    │   ├── ToastContext.jsx             # Non-blocking notification toast queue
    │   ├── CycleContext.jsx             # Cycle calculation engine, calendar & symptom state
    │   ├── CartContext.jsx              # Wellness store cart, promo vouchers & demo orders
    │   ├── AppointmentContext.jsx       # Doctor appointment booking, rescheduling & persistence
    │   └── EmergencyContext.jsx         # Emergency SOS, contact CRUD, pulse stream & geolocation
    ├── data/
    │   ├── articlesData.js              # 8 evidence-based health articles with clinical citations
    │   ├── doctorsData.js               # 8 fictional doctor profiles with approved slot definitions
    │   ├── emergencyData.js             # Verified helplines, hospital directory & first-aid protocols
    │   └── productsData.js              # Categorized wellness store product catalog
    ├── utils/
    │   ├── calendarExport.js            # RFC 5545 .ics file generation & browser download helper
    │   ├── cycleCalculations.js         # Deterministic calendar math, fertile window & phase logic
    │   ├── emergencyServices.js         # Message generation, SMS abstraction & wearable interfaces
    │   └── storage.js                   # Safe localStorage accessor with schema isolation
    └── components/
        ├── common/                      # Reusable shell & modal components
        │   ├── Header.jsx & Header.css
        │   ├── BottomNav.jsx & BottomNav.css
        │   ├── Modal.jsx & Modal.css
        │   ├── Toast.css
        │   ├── DisclaimerBanner.jsx & DisclaimerBanner.css
        │   └── ResetDataModal.jsx
        ├── emergency/                   # Pregnancy Emergency Care & SOS components
        │   ├── EmergencyCareView.jsx & EmergencyCareView.css
        │   ├── EmergencySOSPanel.jsx & EmergencySOSPanel.css
        │   ├── EmergencyContactsCard.jsx & EmergencyContactsCard.css
        │   ├── PulseMonitorPanel.jsx & PulseMonitorPanel.css
        │   ├── NearbyHospitalsCard.jsx & NearbyHospitalsCard.css
        │   ├── PregnancyProfileCard.jsx & PregnancyProfileCard.css
        │   └── EmergencyGuidanceCard.jsx & EmergencyGuidanceCard.css
        ├── period-tracker/              # Cycle tracking & wellbeing components
        │   ├── PeriodTrackerView.jsx & PeriodTrackerView.css
        │   ├── CycleCalendar.jsx & CycleCalendar.css
        │   ├── CyclePhaseCard.jsx & CyclePhaseCard.css
        │   ├── CycleHistoryList.jsx & CycleHistoryList.css
        │   ├── CycleSettingsModal.jsx
        │   ├── SymptomLoggerModal.jsx & SymptomLogger.css
        │   ├── WellbeingInsights.jsx
        │   └── PrintableReportModal.jsx & PrintableReportModal.css
        ├── shopping/                    # Wellness store components
        │   ├── ShoppingView.jsx & ShoppingView.css
        │   ├── ProductCard.jsx & ProductCard.css
        │   ├── ProductDetailModal.jsx
        │   ├── CartDrawer.jsx & CartDrawer.css
        │   ├── CheckoutModal.jsx & CheckoutModal.css
        │   └── OrderReceiptModal.jsx & OrderReceiptModal.css
        ├── appointments/                # Doctor discovery & scheduling components
        │   ├── AppointmentsView.jsx     # Master doctor discovery & appointment manager view
        │   ├── AppointmentsUI.css       # Dedicated styles for appointment cards & modals
        │   ├── DoctorCard.jsx           # Specialist profile card with quick booking triggers
        │   ├── DoctorDetailModal.jsx    # Expanded doctor credentials, bio & clinic details
        │   ├── BookingModal.jsx         # Date picker & approved slot selection modal
        │   ├── AppointmentCard.jsx      # Active/past consultation card with action buttons
        │   ├── RescheduleModal.jsx      # Atomic appointment slot rescheduling modal
        │   └── CancelModal.jsx          # Explicit booking cancellation confirmation modal
        └── learn/                       # Educational hub components
            └── LearnView.jsx            # Article reader, search, bookmarks, quiz & helplines
```

---

## 🚀 Local Setup & Installation Instructions

### Prerequisites
* **Node.js:** v18.x or v20.x recommended
* **npm:** v9.x or v10.x recommended

### 1. Clone & Navigate
```bash
# Navigate to project workspace
cd SheSync_Project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Run Automated Test Suite
```bash
npm run test
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build Locally
```bash
npm run preview
```

---

## 🧪 Testing & Verification Status

> [!NOTE]
> **Latest Reported Automated Test Run:**  
> **103 tests passed across 16 test suites** (`npm run test`).  
> *(Note: Web Bluetooth tests mock the browser GATT interfaces; unit tests validate protocol compliance but do not prove physical device compatibility).*

```text
 ✓ tests/evaluatorAuditQuality.test.js (8 tests)
 ✓ tests/phase1Verification.test.js (5 tests)
 ✓ tests/mobileNavigation.test.js (5 tests)
 ✓ tests/cycleBoundaryDates.test.js (6 tests)
 ✓ tests/cycleContext.test.js (4 tests)
 ✓ tests/cycleCalculations.test.js (13 tests)
 ✓ tests/learnArticles.test.js (3 tests)
 ✓ tests/emergencyCare.test.js (21 tests)
 ✓ tests/resetStateSync.test.js (2 tests)
 ✓ tests/doctorFilter.test.js (7 tests)
 ✓ tests/appointmentEdgeCases.test.js (5 tests)
 ✓ tests/appointmentBooking.test.js (10 tests)
 ✓ tests/storage.test.js (3 tests)
 ✓ tests/productFilter.test.js (3 tests)
 ✓ tests/cartOperations.test.js (4 tests)
 ✓ tests/cartEdgeCases.test.js (4 tests)

 Test Files  16 passed (16)
      Tests  103 passed (103)
```

### Scope of Automated vs. Manual Testing
* **Automated Coverage:** 
  * BLE Heart Rate Measurement Flags parsing (8-bit uint8 and 16-bit uint16 formats).
  * Bluetooth GATT connection lifecycle, notification subscription, disconnection handlers, and listener cleanup.
  * Stale reading state transition upon disconnection.
  * Strict mode isolation: Simulated pulse data is cleared immediately upon real connection and never mixed with authentic readings.
  * Browser incompatibility (`navigator.bluetooth` undefined) and user denial handling.
  * Unconditional emergency SOS accessibility with or without Bluetooth.
  * Emergency message formulation, selective consent privacy filtering, emergency contact validation.
* **Items Requiring Real-World Manual Verification:**
  * Physical BLE device pairing and GATT advertisement reception.
  * Native mobile calendar import handlers (e.g., opening `.ics` directly in iOS Calendar or Google Calendar on Android).
  * Operating system print dialog formatting variations.

---

## 📡 How to Connect and Test a Real BLE Heart-Rate Monitor

### Supported Hardware
Any standard Bluetooth Low Energy device that implements the official Bluetooth SIG Heart Rate Service:
* **Chest Straps:** Polar H10, Polar H9, Garmin HRM-Pro, Garmin HRM-Dual, Wahoo TICKR.
* **Armbands / Optical Sensors:** Scosche Rhythm+, Polar Verity Sense, CooSpo HW807.
* **BLE Simulators (Free Testing Tools):**
  * **nRF Connect for Mobile** (Android / iOS): Use the "Advertiser" tab to broadcast a mock Heart Rate Service (`0x180D`) with Heart Rate Measurement characteristic (`0x2A37`).
  * **LightBlue** (iOS / Android): Create a custom peripheral advertising standard service `0x180D`.
  * **Chrome Virtual Bluetooth (Desktop Chrome DevTools):** Enable Web Bluetooth mock devices in `chrome://bluetooth-internals`.

### Connection Steps
1. Ensure your browser is **Google Chrome** or **Microsoft Edge** on a supported desktop OS or Android device.
2. Open SheSync over **HTTPS** (or `http://localhost:5173` locally).
3. Ensure Bluetooth is enabled on your host computer/phone.
4. Navigate to the **Emergency Care** section.
5. In the **Wearable Telemetry** panel, click **"Connect Heart-Rate Monitor"**.
6. The browser will present a native device pairing prompt displaying nearby BLE devices advertising `0x180D`.
7. Select your device and click **Pair**.
8. SheSync connects via GATT, subscribes to notifications on characteristic `0x2A37`, and displays live BPM, sensor contact status, and live waveform.
9. To disconnect, click **"Disconnect"** to safely release the GATT server and clear listeners.

---

## 🌐 Deployment Status

* **Local Production Build:** Fully supported and validated. Running `npm run build` generates an optimized production asset bundle in `dist/`, which can be served locally with `npm run preview`.
* **Public Cloud Deployment:** Live remote hosting: [https://she-sync-xi.vercel.app/](https://she-sync-xi.vercel.app/).

---

## 👥 Hackathon Attribution
Built for the **SITAMS × HackSphere** hackathon.

