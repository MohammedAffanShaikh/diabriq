"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

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
  unreadNotifications = 3,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role={role} unreadNotifications={unreadNotifications} />

      {/* Main content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Topbar
          role={role}
          title={title}
          subtitle={subtitle}
          unreadNotifications={unreadNotifications}
        />

        {/* Demo environment banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-1.5 flex items-center gap-2">
          <span className="text-xs text-amber-700 font-medium">
            ⚠ DEMO ENVIRONMENT — All patient and hospital data shown is simulated.
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
