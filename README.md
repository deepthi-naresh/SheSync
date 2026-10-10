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

---

## 👥 Target Users & Problem Addressed

| Target Audience | Core Need Addressed | SheSync Feature Solution |
| :--- | :--- | :--- |
| **Menstruators & Cycle Trackers** | Private, transparent cycle forecasting without third-party data collection. | Client-side deterministic cycle engine, fertile window calculation, symptom & mood logging. |
| **Individuals Seeking Care Essentials** | Finding curated hygiene, pregnancy, and comfort products in one place. | Categorized wellness store, "Comfort Picks" nourishing foods, simulated cart & checkout. |
| **Users Needing Specialist Consultations** | Finding relevant health practitioners and managing appointment schedules. | Multi-specialty doctor directory, slot booking, rescheduling, and 1-click `.ics` calendar export. |
| **Health Seekers & Expectant Parents** | Accessing credible, peer-reviewed health guidance free of medical myths. | Public-health sourced health guides, urgent red-flag checklists, Myth vs. Fact quiz, emergency helplines. |

---

## 📊 Feature Status Matrix (Phase 4 Baseline)

| Module / Area | Feature | Current Status | Notes |
| :--- | :--- | :--- | :--- |
| **Shell & Layout** | Responsive Navigation (Desktop + Mobile) | ✅ **Implemented** | Top header navigation bar & mobile bottom navigation |
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
| **Learn & Support** | Health & Maternal Guides (8 Articles) | ✅ **Implemented** | Traceable public-health citations (WHO, MoHFW India, NHS, CDC) |
| **Learn & Support** | Article Search & Bookmarking Engine | ✅ **Implemented** | Keyword filter and persistent bookmarking saved to `localStorage` |
| **Learn & Support** | Urgent Pregnancy Warning Signs Guide | ✅ **Implemented** | Clinical red-flag checklist recommending prompt emergency care |
| **Learn & Support** | Myth vs. Fact Interactive Mini-Quiz | ✅ **Implemented** | Instant scientific validation and evidence explanations |
| **Learn & Support** | Emergency Helpline Directory (India) | ✅ **Implemented** | Verified toll-free numbers with authority citations |
| **Privacy & Security** | PIN Lock & JSON Data Backup/Restore | ⏳ *Planned Future Work* | 4-digit passcode lock & offline JSON data export/import |
| **Deployment** | Public Cloud Hosting & CI/CD Pipeline | ⏳ *Planned Future Work* | Live hosting setup remains to be completed |

---

## 🛡️ Privacy Disclosures & Demo Limitations

> [!IMPORTANT]
> **Please review these disclosures regarding data handling and simulation scope:**

* **100% Client-Side Storage:** All cycle records, symptom entries, cart contents, bookmarks, demo orders, and appointment schedules are stored strictly in your browser's `localStorage` under the `shesync_` namespace. No health, personal, or tracking data is uploaded to remote servers or third-party analytics services.
* **Data Minimization:** Appointment records intentionally store only essential scheduling metadata (`id`, `doctorId`, `doctorName`, `specialty`, `date`, `timeSlot`, `consultationMode`, `status`, `createdAt`, `updatedAt`). Patient names, phone numbers, email addresses, symptoms, and clinical notes are never stored in appointment records.
* **Fictional Doctor Profiles:** All 8 doctor profiles, credentials, ratings, experience records, clinic names, consultation fees, and availability schedules in the Appointments module are **entirely fictional demonstration data**. They do not represent real medical practitioners or clinics.
* **Simulated Appointments & Payments:** The appointment booking and wellness store checkout systems operate in **demonstration simulation mode**. No actual doctor consultations are scheduled, no tele-medicine video streams are established, and no real financial transactions, credit card charges, or bank debits occur.
* **Estimation & Non-Contraceptive Advisory:** Cycle predictions and fertile window calculations are mathematical approximations derived from standard calendar rhythm formulas. They are **not** clinical diagnoses and must **never** be used for natural family planning, contraception, or pregnancy prevention.
* **Non-Diagnostic Educational Information:** Educational guides, symptom insights, and quiz answers are sourced from reputable public-health organizations for general awareness only. They do not constitute clinical advice, medical diagnosis, or personalized treatment plans. Users experiencing severe symptoms or medical emergencies should immediately seek professional healthcare.
* **Nourishing Foods & Cramp Disclaimer:** Items in the "Comfort Picks" collection are nourishing food suggestions intended for personal comfort and dietary energy. They are not pharmaceutical treatments and do not cure dysmenorrhea or menstrual cramps.
* **Helplines Geographic Scope:** Helplines provided in the Learn Hub are public emergency numbers in India (e.g., Women Helpline 1091/181, National Emergency 112). Users outside India should contact their local national emergency numbers.

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
| `shesync_theme` | Selected UI theme (`blush` or `velvet`) | String |

### Reset Demo Data Function
The **Reset Demo Data** action (accessible in the application header) provides an isolated data purge:
1. Prompts for explicit user confirmation via a modal dialog.
2. Removes **only** keys starting with `shesync_` from `localStorage`, leaving all unrelated browser storage untouched.
3. Automatically increments an internal reset key in `App.jsx` to re-mount context providers (`CycleContext`, `CartContext`, `AppointmentContext`), instantly clearing all in-memory React state without requiring a browser page refresh.

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
│   ├── learnArticles.test.js            # Article catalog, public-health citations & bookmark tests
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
    │   └── AppointmentContext.jsx       # Doctor appointment booking, rescheduling & persistence
    ├── data/
    │   ├── articlesData.js              # 8 evidence-based health articles with clinical citations
    │   ├── doctorsData.js               # 8 fictional doctor profiles with approved slot definitions
    │   └── productsData.js              # Categorized wellness store product catalog
    ├── utils/
    │   ├── calendarExport.js            # RFC 5545 .ics file generation & browser download helper
    │   ├── cycleCalculations.js         # Deterministic calendar math, fertile window & phase logic
    │   └── storage.js                   # Safe localStorage accessor with schema isolation
    └── components/
        ├── common/                      # Reusable shell & modal components
        │   ├── Header.jsx & Header.css
        │   ├── BottomNav.jsx & BottomNav.css
        │   ├── Modal.jsx & Modal.css
        │   ├── Toast.css
        │   ├── DisclaimerBanner.jsx & DisclaimerBanner.css
        │   └── ResetDataModal.jsx
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
> **69 tests passed across 13 test suites** (`npm run test`).  
> *(Note: This reflects the latest executed test verification run and is not an endorsement or guarantee of future environment-dependent results).*

```text
 ✓ tests/cycleBoundaryDates.test.js (6 tests)
 ✓ tests/storage.test.js (3 tests)
 ✓ tests/cycleContext.test.js (4 tests)
 ✓ tests/phase1Verification.test.js (5 tests)
 ✓ tests/cycleCalculations.test.js (13 tests)
 ✓ tests/cartEdgeCases.test.js (4 tests)
 ✓ tests/learnArticles.test.js (3 tests)
 ✓ tests/resetStateSync.test.js (2 tests)
 ✓ tests/doctorFilter.test.js (7 tests)
 ✓ tests/appointmentEdgeCases.test.js (5 tests)
 ✓ tests/appointmentBooking.test.js (10 tests)
 ✓ tests/productFilter.test.js (3 tests)
 ✓ tests/cartOperations.test.js (4 tests)

 Test Files  13 passed (13)
      Tests  69 passed (69)
```

### Scope of Automated vs. Manual Testing
* **Automated Coverage:** Data parsing, storage fallbacks, deterministic cycle math, cart calculations, promo vouchers, appointment validation, rescheduling constraints, duplicate prevention, and calendar `.ics` formatting.
* **Items Requiring Real-World Manual Verification:** Native mobile calendar import handlers (e.g., opening `.ics` directly in iOS Calendar or Google Calendar on Android), operating system print dialog formatting variations, and specific physical touchscreen gestures across hardware devices.

---

## 🌐 Deployment Status

* **Local Production Build:** Fully supported and validated. Running `npm run build` generates an optimized production asset bundle in `dist/`, which can be served locally with `npm run preview`.
* **Public Cloud Deployment:** Remote production deployment (e.g., GitHub Pages, Vercel, or Netlify) remains to be configured as planned future work. No public deployment URLs or secrets are associated with this repository.

---

## 👥 Hackathon Attribution
Built for the **SITAMS × HackSphere** hackathon.
