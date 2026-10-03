# DiabetesCareFlow — Integrated Diabetes Care & Hospital Operations Platform

> **Healthcare Hackathon & Research Prototype** · A comprehensive, frontend-only diabetes healthcare coordination and hospital operations platform.

---

## 📌 Executive Summary

**DiabetesCareFlow** is a research prototype demonstrating how digital technology can connect patient diabetes monitoring with hospital operational workflows into one unified platform.

```text
Patient Diabetes Monitoring
          ↓
Appointment Booking & OPD Slots
          ↓
Smart OPD Queue Management
          ↓
Doctor Consultation & Clinical Notes
          ↓
Follow-Up Scheduling & Timeline Feed
          ↓
Continuous Monitoring & HRM / Bed Management
```

---

## 🚀 Key Features & Research Modules

### 1. Patient Diabetes Portal (`/patient`)
- **Diabetes Summary Card**: Real-time display of Diabetes Type (Type 1, Type 2, Gestational, Pre-diabetes), Diagnosis Year, Latest Glucose, HbA1c (%), Blood Pressure, Weight (kg), BMI (auto-calculated), Last Consultation, and Next Follow-up.
- **Detailed Diabetes Profile (`/patient/profile`)**: Interactive profile editing, vitals management, medication lists, and LocalStorage persistence.
- **Glucose Tracker & Visualizations (`/patient/glucose`)**: Log blood sugar readings (Fasting, Before Meal, After Meal, Random) with validation, Recharts trend charts, and filterable history logs.
- **Time-In-Range (TIR) Research Dashboard**: Standardized CGM metrics (% Time in Range: 70–180 mg/dL, % Time Above Range: >180, % Time Below Range: <70) labeled clearly as **"Prototype / Simulated CGM Metric"**.
- **Simulated CGM Integration Mock**: Architectural preview card with sensor connection status, last sync, and simulated reading.
- **Diabetes Care Timeline (`/patient/timeline`)**: Unified chronological feed listing glucose logs, HbA1c updates, appointments, doctor consultations, follow-ups, and profile changes.
- **Consultation History (`/patient/consultations`)**: List and Timeline views of past doctor consultation notes, observations, and follow-up dates.
- **Patient Diabetes Education (`/patient/education`)**: Educational guides covering 7 non-diagnostic self-care categories.

### 2. Doctor Portal & Outpatient Workflow (`/doctor`)
- **OPD Queue Table**: Real-time OPD queue list with status badges (`Waiting`, `Called`, `In Consultation`, `Completed`, `Skipped`).
- **Doctor Queue Controls**: Single-click actions for **Call Next**, **Start Consultation**, **Skip Patient**, and **Complete Consultation**.
- **Doctor Diabetes Summary**: Complete patient history view showing vitals, glucose trend line, recent readings, care timeline, and past consultations.
- **Consultation Modal Workflow**: Doctor enters clinical notes, physical observations, and a next follow-up date—saving automatically completes the appointment, updates patient follow-up dates, advances the queue token, and writes to LocalStorage.

### 3. Hospital & Bed Management (`/hospital` & `/hospital/beds`)
- **Interactive Bed Management System (`/hospital/beds`)**: Individual bed records across General, ICU, Observation, and Emergency wards.
- **Dynamic Bed Status Recalculations**: Admin/Hospital user can switch any bed status (`Available ✓`, `Occupied ●`, `Reserved ⚑`, `Maintenance ⚠`), instantly triggering real-time recalculation of Total, Available, Occupied, Reserved, and Maintenance counts.
- **HRM / Staff Management Module (`/hospital/staff`)**: Full personnel roster management (Doctors, Nurses, Receptionists, Technicians, Administrators) with shift assignment, availability status, and Add Staff modal.
- **OPD Department Configuration (`/hospital/opd`)**: Configure working hours, slot duration (min), max patients per slot, and Open/Close OPD toggles.

### 4. Network Admin Command Center (`/admin`)
- **City-Wide Operational Command Center**: Aggregated stats for 5 connected clinics, total appointments, available beds, on-duty staff, and active doctors.
- **Intelligent Operational Analytics (`/admin/analytics`)**: OPD demand distribution by day of the week (Monday to Saturday bar chart calculated from appointment logs) and bed occupancy breakdown.
- **Live System Audit Log (`/admin/audit`)**: System-wide log tracking all patient and operational actions with user role, timestamp, and status.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| React 18 | UI Library |
| TypeScript | Strict Type Safety |
| Tailwind CSS | Modern Utility Styling |
| Recharts | Dynamic Analytics & Trend Visualizations |
| Lucide React | Icons |
| LocalStorage | Pure Frontend Persistence |

---

## 📁 Project Structure

```
diabriq/
├── app/
│   ├── page.tsx                  # Landing page & Role Selection Simulator
│   ├── layout.tsx                # Root layout wrapped in DataProvider
│   ├── patient/                  # Patient Portal
│   │   ├── page.tsx              # Patient Dashboard
│   │   ├── profile/              # Diabetes Profile & Vitals Form
│   │   ├── glucose/              # Glucose Monitoring & TIR Dashboard
│   │   ├── timeline/             # Chronological Care Feed
│   │   ├── appointments/         # Book OPD Slot & Manage Appointments
│   │   ├── queue/                # Smart OPD Live Queue & Estimated Wait
│   │   ├── consultations/        # Doctor Notes & History
│   │   ├── hospitals/            # Filterable Hospital Directory
│   │   ├── doctors/              # Specialist Doctor Directory
│   │   ├── education/            # Patient Self-Care Guides
│   │   ├── notifications/        # System Notifications
│   │   └── records/              # Health Records & Access Trail
│   ├── doctor/                   # Doctor Portal
│   │   ├── page.tsx              # Doctor Dashboard & Patient Summary
│   │   ├── opd/                  # Today's OPD Queue
│   │   ├── patients/             # Assigned Patient Roster
│   │   ├── appointments/         # Appointments View
│   │   └── consultations/        # Consultation Records
│   ├── hospital/                 # Hospital Operations
│   │   ├── page.tsx              # Operations Center
│   │   ├── beds/                 # Bed Management System
│   │   ├── staff/                # HRM / Staff Management
│   │   ├── opd/                  # OPD Schedule Configuration
│   │   ├── doctors/              # Doctor Roster
│   │   └── settings/             # Platform Settings & Demo Reset
│   └── admin/                    # Network Command Center
│       ├── page.tsx              # Command Center Dashboard
│       ├── beds/                 # Bed Management
│       ├── staff/                # HRM Staff Management
│       ├── opd/                  # OPD Configuration
│       ├── analytics/            # Intelligent Operational Analytics
│       └── audit/                # Live System Audit Trail
├── components/
│   ├── layout/                   # Sidebar, Topbar, DemoRoleSwitcher, DashboardLayout
│   └── ui/                       # Badge, Button, Card, Progress
└── lib/
    ├── context/
    │   └── DataContext.tsx       # Central React Context & LocalStorage Provider
    ├── types.ts                  # TypeScript interfaces (Patient, Bed, Staff, etc.)
    ├── mockData.ts               # Default mock datasets
    └── utils.ts                  # Helper utilities
```

---

## 💻 Local Setup & Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎭 Demo Roles & Quick Navigation

Use the **Demo Role Switcher** (top-right of any dashboard) or role selection cards on the homepage (`/`) to switch between roles instantly:

| Role | URL | Key Capability |
|---|---|---|
| **Patient** | `/patient` | Log glucose, view TIR metrics, track live OPD token & book slots |
| **Doctor** | `/doctor` | Inspect patient summary, view glucose trend, complete visit & save notes |
| **Hospital Admin** | `/hospital` | Manage bed statuses, HRM staff roster, and OPD department schedules |
| **Network Admin** | `/admin` | City command center, OPD demand bar chart, and system audit trail |

---

## 🛡️ Medical Safety & Safety Boundaries

This application is a **healthcare information and coordination prototype**. It does **NOT**:
- Provide autonomous diabetes diagnosis
- Recommend insulin dosage changes or prescription modifications
- Replace direct clinical judgment by qualified healthcare professionals

For abnormal blood sugar levels, neutral guidance directs users to consult a qualified physician.

---

## 📄 License

MIT License — Built for healthcare hackathon demonstration.
