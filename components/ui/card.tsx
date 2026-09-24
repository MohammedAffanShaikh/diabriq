"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        hover && "hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 py-4 border-b border-slate-100", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm font-semibold text-slate-900", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: "blue" | "green" | "amber" | "red" | "violet" | "teal";
  className?: string;
}

export function StatCard({ label, value, icon, trend, trendValue, accent = "blue", className }: StatCardProps) {
  const accents = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
    violet: "from-violet-500 to-violet-600",
    teal: "from-teal-500 to-teal-600",
  };

  const iconBg = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-600",
    teal: "bg-teal-50 text-teal-600",
  };

  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {trendValue && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-slate-500"
              )}
            >
              {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg[accent])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
