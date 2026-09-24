"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Monitor } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const roles = [
  { id: "patient", label: "Patient", href: "/patient", color: "bg-teal-600" },
  { id: "doctor", label: "Doctor", href: "/doctor", color: "bg-blue-700" },
  { id: "hospital", label: "Hospital", href: "/hospital", color: "bg-indigo-700" },
  { id: "admin", label: "Admin", href: "/admin", color: "bg-slate-700" },
];

interface DemoRoleSwitcherProps {
  currentRole?: "patient" | "doctor" | "hospital" | "admin";
}

export function DemoRoleSwitcher({ currentRole }: DemoRoleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const current = roles.find((r) => r.id === currentRole);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150"
      >
        <Monitor size={13} />
        <span className="hidden sm:inline">Demo:</span>
        <span className="font-semibold">{current?.label ?? "Select Role"}</span>
        <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Demo Mode — Switch Role
              </p>
            </div>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  router.push(role.href);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left",
                  role.id === currentRole ? "bg-slate-50" : ""
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", role.color)} />
                <span className="font-medium text-slate-700">{role.label}</span>
                {role.id === currentRole && (
                  <span className="ml-auto text-[10px] text-slate-400 font-medium">Current</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
