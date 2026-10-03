"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AlertCircle, ShieldAlert, Activity } from "lucide-react";

interface DashboardLayoutProps {
  role: "patient" | "doctor" | "hospital" | "admin";
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  unreadNotifications?: number;
}

export function DashboardLayout({
  role,
  children,
  title,
  subtitle,
  unreadNotifications = 0,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role={role} unreadNotifications={unreadNotifications} />

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar
          role={role}
          title={title}
          subtitle={subtitle}
          unreadNotifications={unreadNotifications}
        />

        {/* Medical Safety & Research Disclaimer Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-800">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert size={15} className="text-amber-600 shrink-0" />
            <span>
              <strong>Healthcare Prototype & Operational Simulation:</strong> All patient data, glucose metrics, and bed statuses are simulated. This platform does not provide autonomous clinical diagnosis.
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono text-[11px]">
            <Activity size={12} className="text-amber-700" />
            Research Mode
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
