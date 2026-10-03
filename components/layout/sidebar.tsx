"use client";

import { cn } from "@/lib/utils";
import {
  Activity,
  Bell,
  Calendar,
  ChevronRight,
  ClipboardList,
  Hospital,
  LayoutDashboard,
  Settings,
  Shield,
  Stethoscope,
  Users,
  Bed,
  Network,
  FileText,
  Home,
  Clock,
  UserCheck,
  LineChart as LineChartIcon,
  BookOpen,
  History,
  Droplet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDataContext } from "@/lib/context/DataContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const patientNav: NavItem[] = [
  { label: "Dashboard", href: "/patient", icon: <Home size={18} /> },
  { label: "Diabetes Profile", href: "/patient/profile", icon: <UserCheck size={18} /> },
  { label: "Glucose Monitoring", href: "/patient/glucose", icon: <Droplet size={18} /> },
  { label: "Diabetes Timeline", href: "/patient/timeline", icon: <History size={18} /> },
  { label: "Appointments", href: "/patient/appointments", icon: <Calendar size={18} /> },
  { label: "Live Queue", href: "/patient/queue", icon: <Clock size={18} /> },
  { label: "Consultation History", href: "/patient/consultations", icon: <FileText size={18} /> },
  { label: "Hospital Directory", href: "/patient/hospitals", icon: <Hospital size={18} /> },
  { label: "Doctor Directory", href: "/patient/doctors", icon: <Stethoscope size={18} /> },
  { label: "Diabetes Education", href: "/patient/education", icon: <BookOpen size={18} /> },
  { label: "Notifications", href: "/patient/notifications", icon: <Bell size={18} /> },
];

const doctorNav: NavItem[] = [
  { label: "Dashboard", href: "/doctor", icon: <LayoutDashboard size={18} /> },
  { label: "Today's OPD Queue", href: "/doctor/opd", icon: <Activity size={18} /> },
  { label: "My Patients", href: "/doctor/patients", icon: <Users size={18} /> },
  { label: "Appointments", href: "/doctor/appointments", icon: <Calendar size={18} /> },
  { label: "Consultation History", href: "/doctor/consultations", icon: <FileText size={18} /> },
  { label: "Notifications", href: "/doctor/notifications", icon: <Bell size={18} /> },
];

const hospitalNav: NavItem[] = [
  { label: "Dashboard", href: "/hospital", icon: <LayoutDashboard size={18} /> },
  { label: "OPD Operations", href: "/hospital/opd", icon: <Activity size={18} /> },
  { label: "Bed Management", href: "/hospital/beds", icon: <Bed size={18} /> },
  { label: "HRM / Staff", href: "/hospital/staff", icon: <Users size={18} /> },
  { label: "Appointments", href: "/hospital/appointments", icon: <Calendar size={18} /> },
  { label: "Doctor Directory", href: "/hospital/doctors", icon: <Stethoscope size={18} /> },
  { label: "Notifications", href: "/hospital/notifications", icon: <Bell size={18} /> },
];

const adminNav: NavItem[] = [
  { label: "Command Center", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "OPD Management", href: "/admin/opd", icon: <Activity size={18} /> },
  { label: "Bed Management", href: "/admin/beds", icon: <Bed size={18} /> },
  { label: "HRM / Staff", href: "/admin/staff", icon: <Users size={18} /> },
  { label: "Doctor Management", href: "/admin/doctors", icon: <Stethoscope size={18} /> },
  { label: "Intelligent Analytics", href: "/admin/analytics", icon: <LineChartIcon size={18} /> },
  { label: "Audit Trail", href: "/admin/audit", icon: <Shield size={18} /> },
];

const roleConfig = {
  patient: {
    nav: patientNav,
    label: "Patient Portal",
  },
  doctor: {
    nav: doctorNav,
    label: "Doctor Portal",
  },
  hospital: {
    nav: hospitalNav,
    label: "Hospital Dashboard",
  },
  admin: {
    nav: adminNav,
    label: "Network Admin",
  },
};

interface SidebarProps {
  role: "patient" | "doctor" | "hospital" | "admin";
  unreadNotifications?: number;
}

export function Sidebar({ role, unreadNotifications = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { patientProfile } = useDataContext();
  const config = roleConfig[role];

  const userInfo =
    role === "patient"
      ? { name: patientProfile.name, subtitle: `${patientProfile.diabetesType} Diabetes` }
      : role === "doctor"
      ? { name: "Dr. Ayesha Khan", subtitle: "Endocrinologist · OPD 02" }
      : role === "hospital"
      ? { name: "City Diabetes Centre", subtitle: "Hospital Administrator" }
      : { name: "Network Administrator", subtitle: "Diabriq Command Center" };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col z-30 shadow-xl border-r border-slate-800">
      {/* Logo Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white leading-none">DiabetesCareFlow</p>
            <p className="text-[10px] text-slate-400 leading-none mt-1">Healthcare & Operations</p>
          </div>
        </Link>
      </div>

      {/* Role Tag */}
      <div className="px-5 py-2.5 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
          {config.label}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        {config.nav.map((item) => {
          const isActive =
            item.href === `/${role}`
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-600 text-white shadow-md font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
              {item.label === "Notifications" && unreadNotifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-4 text-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {userInfo.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userInfo.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{userInfo.subtitle}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
