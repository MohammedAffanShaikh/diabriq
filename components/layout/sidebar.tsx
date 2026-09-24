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
  LogOut,
  Settings,
  Shield,
  Stethoscope,
  Users,
  Bed,
  Network,
  FileText,
  Home,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const patientNav: NavItem[] = [
  { label: "Home", href: "/patient", icon: <Home size={18} /> },
  { label: "Appointments", href: "/patient/appointments", icon: <Calendar size={18} /> },
  { label: "Live Queue", href: "/patient/queue", icon: <Clock size={18} /> },
  { label: "Records", href: "/patient/records", icon: <FileText size={18} /> },
  { label: "Hospitals", href: "/patient/hospitals", icon: <Hospital size={18} /> },
  { label: "Notifications", href: "/patient/notifications", icon: <Bell size={18} /> },
];

const doctorNav: NavItem[] = [
  { label: "Dashboard", href: "/doctor", icon: <LayoutDashboard size={18} /> },
  { label: "Today's OPD", href: "/doctor/opd", icon: <Activity size={18} /> },
  { label: "Patients", href: "/doctor/patients", icon: <Users size={18} /> },
  { label: "Appointments", href: "/doctor/appointments", icon: <Calendar size={18} /> },
  { label: "Records", href: "/doctor/records", icon: <FileText size={18} /> },
  { label: "Network", href: "/doctor/network", icon: <Network size={18} /> },
  { label: "Notifications", href: "/doctor/notifications", icon: <Bell size={18} /> },
];

const hospitalNav: NavItem[] = [
  { label: "Dashboard", href: "/hospital", icon: <LayoutDashboard size={18} /> },
  { label: "OPD Operations", href: "/hospital/opd", icon: <Activity size={18} /> },
  { label: "Bed Availability", href: "/hospital/beds", icon: <Bed size={18} /> },
  { label: "Appointments", href: "/hospital/appointments", icon: <Calendar size={18} /> },
  { label: "Doctors", href: "/hospital/doctors", icon: <Stethoscope size={18} /> },
  { label: "Network", href: "/hospital/network", icon: <Network size={18} /> },
  { label: "Notifications", href: "/hospital/notifications", icon: <Bell size={18} /> },
  { label: "Audit Trail", href: "/hospital/audit", icon: <Shield size={18} /> },
  { label: "Settings", href: "/hospital/settings", icon: <Settings size={18} /> },
];

const adminNav: NavItem[] = [
  { label: "Network Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Hospitals", href: "/admin/hospitals", icon: <Hospital size={18} /> },
  { label: "Doctors", href: "/admin/doctors", icon: <Stethoscope size={18} /> },
  { label: "Patients", href: "/admin/patients", icon: <Users size={18} /> },
  { label: "Capacity", href: "/admin/capacity", icon: <Activity size={18} /> },
  { label: "Operations", href: "/admin/operations", icon: <ClipboardList size={18} /> },
  { label: "Audit Logs", href: "/admin/audit", icon: <Shield size={18} /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
];

const roleConfig = {
  patient: {
    nav: patientNav,
    label: "Patient Portal",
    accent: "bg-teal-700",
    name: "Rahul Sharma",
    role: "Patient — DIA-204829",
  },
  doctor: {
    nav: doctorNav,
    label: "Doctor Portal",
    accent: "bg-navy-700",
    name: "Dr. Ayesha Khan",
    role: "Endocrinologist",
  },
  hospital: {
    nav: hospitalNav,
    label: "Hospital Dashboard",
    accent: "bg-indigo-700",
    name: "City Diabetes Centre",
    role: "Hospital Administrator",
  },
  admin: {
    nav: adminNav,
    label: "Network Admin",
    accent: "bg-slate-800",
    name: "Network Administrator",
    role: "Diabriq Network",
  },
};

interface SidebarProps {
  role: "patient" | "doctor" | "hospital" | "admin";
  unreadNotifications?: number;
}

export function Sidebar({ role, unreadNotifications = 0 }: SidebarProps) {
  const pathname = usePathname();
  const config = roleConfig[role];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Diabriq</p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">Connected Care Network</p>
          </div>
        </div>
      </div>

      {/* Role label */}
      <div className="px-4 py-3 border-b border-slate-700/60">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {config.label}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {config.nav.map((item) => {
          const isActive =
            item.href === `/${role}` ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
              {item.label === "Notifications" && unreadNotifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-slate-700/60">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {config.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{config.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{config.role}</p>
          </div>
          <ChevronRight size={14} className="text-slate-500 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
