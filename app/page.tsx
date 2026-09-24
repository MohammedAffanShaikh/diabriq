"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Hospital,
  Network,
  Shield,
  Users,
  Zap,
  BarChart3,
  Bed,
  Globe,
} from "lucide-react";

const stats = [
  { value: "18 min", label: "Average waiting time", note: "simulated" },
  { value: "94%", label: "Appointment utilization", note: "simulated" },
  { value: "27", label: "Connected facilities", note: "simulated" },
  { value: "2,481", label: "Appointments coordinated today", note: "simulated" },
];

const problems = [
  "Appointment congestion during peak hours",
  "Long OPD queues with no visibility",
  "Cancelled slots left unused",
  "Fragmented records across hospitals",
  "Changing hospital capacity — no real-time view",
  "Manual coordination between facilities",
];

const features = [
  {
    icon: <Users size={22} className="text-blue-600" />,
    title: "Centralized Patient Identity",
    desc: "One patient profile across all connected facilities. Consent-based authorized record access.",
  },
  {
    icon: <Activity size={22} className="text-blue-600" />,
    title: "Real-Time OPD Visibility",
    desc: "Live queue management, token tracking, and estimated wait times for every connected clinic.",
  },
  {
    icon: <Hospital size={22} className="text-blue-600" />,
    title: "Network Bed Availability",
    desc: "See operational bed availability across the network in real time. For operations, not clinical decisions.",
  },
  {
    icon: <Zap size={22} className="text-blue-600" />,
    title: "Smart Slot Utilization",
    desc: "AI-assisted slot reallocation for cancellations and walk-ins — every suggestion requires human approval.",
  },
  {
    icon: <Network size={22} className="text-blue-600" />,
    title: "Cross-Hospital Coordination",
    desc: "When one facility is at capacity, coordinators can see nearby available slots across the network.",
  },
  {
    icon: <Shield size={22} className="text-blue-600" />,
    title: "Audit Trail & Accountability",
    desc: "Every action logged with user, timestamp, facility, and status. Complete operational accountability.",
  },
];

const howItWorks = [
  { step: "01", title: "Patient Books", desc: "Patient selects hospital, doctor, and available slot through the patient portal." },
  { step: "02", title: "Clinic Manages", desc: "Hospital staff manages OPD queue, walk-ins, and bed availability in real time." },
  { step: "03", title: "Doctor Coordinates", desc: "Doctor sees live queue, patient continuity history, and coordinates with other facilities." },
  { step: "04", title: "Network Shares Capacity", desc: "When a clinic is full, available slots at nearby connected facilities are surfaced automatically." },
  { step: "05", title: "Patient Receives Updates", desc: "Patients get real-time notifications about wait times, slot changes, and appointment confirmations." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900">Diabriq</span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2">Connected Diabetes Care Network</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 bg-slate-100 rounded-md px-2.5 py-1.5">
              <Globe size={13} />
              <span>EN</span>
            </div>
            <Link
              href="/patient"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              View Demo
            </Link>
            <Link
              href="/patient"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Explore Network
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Healthcare Operations Platform · Hackathon Demo
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            One connected network for{" "}
            <span className="text-blue-600">better diabetes care</span>{" "}
            operations.
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect patients, doctors and hospitals through real-time appointment, OPD and
            capacity coordination. Less waiting. Better utilization. Connected records. Human-controlled automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/patient"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-md text-base"
            >
              Explore Network
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/doctor"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-6 py-3.5 rounded-xl border border-slate-200 transition-colors text-base"
            >
              Doctor Demo
            </Link>
          </div>
        </div>

        {/* Network visualization */}
        <div className="max-w-3xl mx-auto mt-16">
          <NetworkDiagram />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-navy-950 text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Demo / Simulated Data — Not real-world results
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-widest">The Problem</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
                Busy diabetes clinics operate in silos
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Each hospital manages its own OPD independently. Patients face long waits, cancelled
                slots go unfilled, and records don't travel between facilities.
              </p>
              <ul className="space-y-3">
                {problems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">The Solution</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">
                One connected operational layer
              </h3>
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle size={18} className="text-emerald-600" />, text: "Real-time OPD queue visibility across all facilities" },
                  { icon: <CheckCircle size={18} className="text-emerald-600" />, text: "Automated slot reuse — with human approval always required" },
                  { icon: <CheckCircle size={18} className="text-emerald-600" />, text: "Consent-based cross-facility record access" },
                  { icon: <CheckCircle size={18} className="text-emerald-600" />, text: "Network bed and capacity visibility for coordinators" },
                  { icon: <CheckCircle size={18} className="text-emerald-600" />, text: "Patient notifications and caregiver access" },
                  { icon: <CheckCircle size={18} className="text-emerald-600" />, text: "Full audit trail for every action" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">{item.icon}</span>
                    <span className="text-sm text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Five steps to connected care</h2>
          </div>
          <div className="grid sm:grid-cols-5 gap-4">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm h-full">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold mb-3">
                    {step.step}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden sm:block absolute top-8 -right-2 z-10 text-slate-300">
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Platform Features</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Built for real healthcare operations</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            See the connected network in action
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Explore all four dashboards: Patient, Doctor, Hospital, and Network Admin.
            Each demonstrates a different operational perspective on the same connected system.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {[
              { label: "Patient Portal", href: "/patient", color: "bg-teal-600 hover:bg-teal-700" },
              { label: "Doctor Dashboard", href: "/doctor", color: "bg-blue-600 hover:bg-blue-700" },
              { label: "Hospital Operations", href: "/hospital", color: "bg-indigo-600 hover:bg-indigo-700" },
              { label: "Network Admin", href: "/admin", color: "bg-violet-600 hover:bg-violet-700" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-2 ${item.color} text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm`}
              >
                {item.label}
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Activity size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">Diabriq</span>
            <span className="text-xs text-slate-500">Connected Diabetes Care Network</span>
          </div>
          <p className="text-xs text-slate-500">
            Healthcare Hackathon Demo · All data is simulated · Not for clinical use
          </p>
        </div>
      </footer>
    </div>
  );
}

function NetworkDiagram() {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-lg p-8 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex items-center justify-center gap-0">
        {/* Patient */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow-md">
            <Users size={24} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Patient</span>
          <span className="text-[10px] text-slate-500">84,291 patients</span>
        </div>

        {/* Arrow + line */}
        <div className="flex flex-col items-center px-3">
          <div className="w-12 h-0.5 bg-blue-300 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </div>

        {/* Doctor */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md node-pulse">
            <Activity size={24} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Doctor</span>
          <span className="text-[10px] text-slate-500">186 active</span>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center px-3">
          <div className="w-12 h-0.5 bg-blue-300 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </div>

        {/* Hospital */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
            <Hospital size={24} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Hospital</span>
          <span className="text-[10px] text-slate-500">27 facilities</span>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center px-3">
          <div className="w-12 h-0.5 bg-blue-300 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </div>

        {/* Network */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center shadow-md">
            <Network size={24} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-700">City Network</span>
          <span className="text-[10px] text-slate-500">Real-time ops</span>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="relative mt-8 grid grid-cols-4 gap-3">
        {[
          { icon: <Clock size={14} />, label: "Avg Wait", value: "18 min", color: "text-blue-600 bg-blue-50" },
          { icon: <Calendar size={14} />, label: "Today's Apts", value: "2,481", color: "text-teal-600 bg-teal-50" },
          { icon: <Bed size={14} />, label: "Available Beds", value: "348", color: "text-indigo-600 bg-indigo-50" },
          { icon: <BarChart3 size={14} />, label: "Utilization", value: "78%", color: "text-violet-600 bg-violet-50" },
        ].map((m, i) => (
          <div key={i} className={`rounded-lg ${m.color} px-3 py-2.5 text-center border border-current/10`}>
            <div className="flex items-center justify-center mb-1">{m.icon}</div>
            <p className="text-base font-bold">{m.value}</p>
            <p className="text-[10px] opacity-70">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
