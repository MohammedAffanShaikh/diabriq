# Diabriq — Connected Diabetes Care Network

> **Healthcare Hackathon Demo** · A production-quality frontend prototype for a connected diabetes outpatient care operations platform.

---

## Overview

Diabriq is an assistive healthcare operations and continuity-of-care platform that demonstrates how multiple hospitals and clinics across a city can coordinate diabetes outpatient care through one connected operational network.

**Core concept:** One Patient Identity → Multiple Hospitals → Connected Doctors → Real-Time OPD & Bed Visibility → Coordinated Care

> ⚠️ This is NOT a diagnostic or treatment recommendation system. All AI-assisted suggestions are operational only and require explicit human approval.

---

## Features

- **Patient Portal** — Appointment booking, live OPD queue, health record timeline, hospital network, caregiver access
- **Doctor Dashboard** — Live OPD queue management, patient profile drawer, AI slot recommendations, all doctor actions
- **Hospital Operations** — Interactive city network map, OPD capacity trends, bed availability, cross-hospital slot sharing, bottleneck detection
- **Network Admin** — City-level command center, hospital status table, patient flow monitor, AI alerts, complete audit trail
- **Demo Role Switcher** — One-click switch between all four dashboards for hackathon demonstration
- **AI-Assisted Automation** — Every AI recommendation shows "Human approval required" with Approve/Reject controls

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| React 18 | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Recharts | Analytics Charts |
| Lucide React | Icons |

---

## Project Structure

```
diabriq/
├── app/
│   ├── page.tsx              # Landing page
│   ├── patient/              # Patient portal
│   │   ├── page.tsx          # Dashboard
│   │   ├── appointments/     # Appointments
│   │   ├── queue/            # Live queue
│   │   ├── records/          # Health records
│   │   ├── hospitals/        # Hospital network
│   │   └── notifications/    # Notifications
│   ├── doctor/               # Doctor portal
│   │   └── page.tsx          # OPD dashboard
│   ├── hospital/             # Hospital operations
│   │   └── page.tsx          # Operations center
│   └── admin/                # Network admin
│       ├── page.tsx          # Command center
│       ├── hospitals/        # Hospital management
│       └── audit/            # Audit trail
├── components/
│   ├── layout/               # Sidebar, Topbar, Layout
│   └── ui/                   # Badge, Button, Card, Progress
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── mockData.ts           # Simulated demo data
│   └── utils.ts              # Utility functions
└── README.md
```

---

## Local Setup

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

## Build for Production

```bash
npm run build
npm run start
```

---

## Vercel Deployment

### Deploy with Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Deploy with Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. No environment variables required
4. Build command: `npm run build`
5. Output directory: `.next`
6. Click **Deploy**

> No backend or API keys required. All data is simulated mock data.

---

## Demo Accounts / Roles

| Role | URL | Description |
|---|---|---|
| Patient | `/patient` | Rahul Sharma — DIA-204829 |
| Doctor | `/doctor` | Dr. Ayesha Khan — City Diabetes Centre |
| Hospital | `/hospital` | City Diabetes Centre Operations |
| Admin | `/admin` | Mumbai Network Administrator |

Use the **Demo Role Switcher** (top-right of any dashboard) to switch between roles instantly.

---

## Demo Flow for Judges

1. Open landing page (`/`) — see the network concept
2. Click **Explore Network** → Patient Portal
3. View upcoming appointment + live queue (Token #18)
4. Open health records timeline (consent-based access)
5. Switch role → **Doctor**
6. See live OPD queue — click View on Token #18
7. See AI slot recommendation for cancelled 11:30 AM slot
8. Click **Approve** — see confirmation
9. Switch role → **Hospital**
10. See OPD capacity overview + click hospital nodes on network map
11. View bed availability table + cross-hospital slots
12. Approve AI bottleneck recommendation
13. Switch role → **Admin**
14. See city-wide hospital table with OPD loads
15. View patient flow monitor
16. Check audit trail for all logged actions

---

## Safety Boundary

This application does **NOT** perform:

- Diagnosis
- Treatment recommendations
- Clinical decision support
- Medication recommendations
- Interpretation of medical reports

All AI assistance is limited to operational coordination only, with human approval required for every action.

---

## Data Notice

> ⚠️ **DEMO ENVIRONMENT — All patient and hospital data shown is simulated.** Fictional Indian names and hospital names are used for demonstration purposes only. No real patient data is included.

---

## License

MIT License — Built for healthcare hackathon demonstration.
