"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Monitor, UserCheck, Stethoscope, Hospital, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/lib/context/DataContext";
import { UserRole } from "@/lib/types";

const roles: { id: UserRole; label: string; href: string; color: string; icon: React.ReactNode }[] = [
  { id: "patient", label: "Patient", href: "/patient", color: "bg-teal-600", icon: <UserCheck size={14} /> },
  { id: "doctor", label: "Doctor", href: "/doctor", color: "bg-blue-600", icon: <Stethoscope size={14} /> },
  { id: "hospital", label: "Hospital Admin", href: "/hospital", color: "bg-indigo-600", icon: <Hospital size={14} /> },
  { id: "admin", label: "Network Admin", href: "/admin", color: "bg-slate-700", icon: <Shield size={14} /> },
];

interface DemoRoleSwitcherProps {
  currentRole?: UserRole;
}

export function DemoRoleSwitcher({ currentRole }: DemoRoleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { role: contextRole, setRole } = useDataContext();

  const activeRole = currentRole || contextRole;
  const current = roles.find((r) => r.id === activeRole);

  const handleSelectRole = (r: (typeof roles)[0]) => {
    setRole(r.id);
    router.push(r.href);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 shadow-sm"
      >
        <Monitor size={14} className="text-blue-400" />
        <span className="hidden sm:inline text-slate-400">Role:</span>
        <span className="font-semibold text-white">{current?.label ?? "Select Role"}</span>
        <ChevronDown size={13} className={cn("transition-transform text-slate-400", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Frontend Role Simulator
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Switch view & permissions</p>
            </div>
            <div className="p-1.5 space-y-0.5">
              {roles.map((r) => {
                const isSelected = r.id === activeRole;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-left font-medium",
                      isSelected
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <span className={cn("p-1 rounded-md", isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400")}>
                      {r.icon}
                    </span>
                    <span>{r.label}</span>
                    {isSelected && (
                      <span className="ml-auto text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
