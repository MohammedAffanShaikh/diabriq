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
  UserCheck,
  Stethoscope,
  Heart,
  Droplet,
} from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";

const stats = [
  { value: "18 min", label: "Average OPD waiting time", note: "simulated" },
  { value: "94%", label: "Slot utilization efficiency", note: "simulated" },
  { value: "5", label: "Connected hospital centres", note: "simulated" },
  { value: "2,481", label: "Appointments coordinated today", note: "simulated" },
];

const problems = [
  "Appointment congestion during peak OPD clinic hours",
  "Long queues with zero wait time visibility for patients",
  "Cancelled slots left unfilled while patients wait",
  "Fragmented diabetes history between different hospitals",
  "Uncoordinated hospital bed availability and resource allocation",
  "Lack of standardized glucose metrics (TIR) in routine OPD visits",
];

const features = [
  {
    icon: <Droplet size={22} className="text-red-500" />,
    title: "Patient Diabetes Monitoring & TIR",
    desc: "Glucose tracking, Time-in-Range (70-180 mg/dL) analytics, and continuous care timeline.",
  },
  {
    icon: <Activity size={22} className="text-blue-600" />,
    title: "Real-Time OPD & Smart Queue",
    desc: "Live token tracking, estimated wait time calculation, and doctor-assisted consultation workflow.",
  },
  {
    icon: <Bed size={22} className="text-indigo-600" />,
    title: "Bed Availability Management",
    desc: "Real-time bed status updates across General, ICU, and Observation wards.",
  },
  {
    icon: <Users size={22} className="text-teal-600" />,
    title: "Hospital Staff & HRM Module",
    desc: "Personnel roster management, shift assignments, and duty availability tracking.",
  },
  {
    icon: <Stethoscope size={22} className="text-emerald-600" />,
    title: "Doctor Patient Summary",
    desc: "Endocrinologist workflow showing patient diabetes history, glucose trends, and follow-up notes.",
  },
  {
    icon: <BarChart3 size={22} className="text-violet-600" />,
    title: "Intelligent Operational Analytics",
    desc: "OPD demand distribution by day of week and resource utilization visualizations.",
  },
];

export default function HomePage() {
  const { setRole } = useDataContext();
  const router = useRouter();

  const handleSelectRole = (selectedRole: UserRole, href: string) => {
    setRole(selectedRole);
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900">DiabetesCareFlow</span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2">Diabetes Care & Operations Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectRole("patient", "/patient")}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Patient Portal
            </button>
            <button
              onClick={() => handleSelectRole("doctor", "/doctor")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Launch Prototype
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Frontend-Only Diabetes Healthcare Research Prototype
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Connecting <span className="text-blue-600">Diabetes Care</span>, OPD Queue & Hospital Operations.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A unified platform integrating Patient Diabetes Monitoring → OPD Appointments → Smart Queue → Doctor Consultation → Hospital Bed Management → HRM Staff Operations.
          </p>

          {/* ROLE LOGIN SIMULATION CARDS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-3xl mx-auto text-left mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Frontend Role Simulator — Select Demo Role
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleSelectRole("patient", "/patient")}
                className="group flex flex-col justify-between bg-teal-50 hover:bg-teal-100/80 border border-teal-200 p-4 rounded-xl transition-all duration-200 text-left hover:scale-[1.02]"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-3 shadow-sm">
                    <UserCheck size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Continue as Patient</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    View profile, log glucose readings, check TIR metrics, book OPD slots, and track queue.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                  Enter Patient Portal <ArrowRight size={13} />
                </span>
              </button>

              <button
                onClick={() => handleSelectRole("doctor", "/doctor")}
                className="group flex flex-col justify-between bg-blue-50 hover:bg-blue-100/80 border border-blue-200 p-4 rounded-xl transition-all duration-200 text-left hover:scale-[1.02]"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm">
                    <Stethoscope size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Continue as Doctor</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    View OPD queue, open patient summary, inspect glucose trends, and complete consultations.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                  Enter Doctor Portal <ArrowRight size={13} />
                </span>
              </button>

              <button
                onClick={() => handleSelectRole("admin", "/admin")}
                className="group flex flex-col justify-between bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 p-4 rounded-xl transition-all duration-200 text-left hover:scale-[1.02]"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-sm">
                    <Hospital size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Continue as Admin</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Manage bed allocation, HRM staff roster, OPD department slots, and operational analytics.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
                  Enter Command Center <ArrowRight size={13} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Simulated Prototype Metrics — Local Storage Persistence
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Integrated Architecture</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Core Diabetes & Hospital Modules</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
