"use client";

import { Bell, Globe, HelpCircle, Menu } from "lucide-react";
import { DemoRoleSwitcher } from "./demo-role-switcher";
import { cn } from "@/lib/utils";

interface TopbarProps {
  role: "patient" | "doctor" | "hospital" | "admin";
  title?: string;
  subtitle?: string;
  unreadNotifications?: number;
}

const roleColors = {
  patient: "bg-teal-700",
  doctor: "from-navy-800 to-navy-900",
  hospital: "bg-indigo-800",
  admin: "bg-slate-900",
};

export function Topbar({ role, title, subtitle, unreadNotifications = 0 }: TopbarProps) {
  return (
    <header className="h-14 bg-slate-900 flex items-center px-4 gap-4 border-b border-slate-700/50">
      {/* Demo banner pill */}
      <div className="hidden sm:flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-md px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
          Demo Mode
        </span>
      </div>

      {/* Title */}
      {title && (
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">{title}</h1>
          {subtitle && <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>}
        </div>
      )}

      <div className="flex-1" />

      {/* Notification */}
      <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
        <Bell size={18} />
        {unreadNotifications > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 notification-dot" />
        )}
      </button>

      {/* Language */}
      <button className="hidden sm:flex items-center gap-1.5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium">
        <Globe size={16} />
        EN
      </button>

      {/* Role switcher */}
      <DemoRoleSwitcher currentRole={role} />
    </header>
  );
}
