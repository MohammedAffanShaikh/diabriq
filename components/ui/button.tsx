"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-navy-700 hover:bg-navy-800 text-white border-transparent shadow-sm",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent",
    outline: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 border-transparent",
    danger: "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-sm",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs gap-1.5",
    sm: "px-3 py-2 text-sm gap-2",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

interface ApproveRejectProps {
  onApprove: () => void;
  onReject: () => void;
  approveLabel?: string;
  rejectLabel?: string;
  className?: string;
}

export function ApproveRejectButtons({
  onApprove,
  onReject,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  className,
}: ApproveRejectProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button variant="success" size="sm" onClick={onApprove}>
        {approveLabel}
      </Button>
      <Button variant="outline" size="sm" onClick={onReject} className="text-red-600 border-red-200 hover:bg-red-50">
        {rejectLabel}
      </Button>
    </div>
  );
}
