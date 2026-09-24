"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "amber" | "red" | "blue" | "violet" | "slate";
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = "blue", className, dot = true }: BadgeProps) {
  const variants = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const dotColors = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    slate: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

export function AIBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200",
        className
      )}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.09 8.26L2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-1.18-6.86 5-4.87-7.09-1.01L12 2z" />
      </svg>
      AI-assisted recommendation — Human approval required
    </span>
  );
}
