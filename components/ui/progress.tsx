"use client";

import { cn, getCapacityColor } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
  showPercent?: boolean;
  colorByValue?: boolean;
  color?: "blue" | "green" | "amber" | "red";
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  max = 100,
  className,
  label,
  showPercent = false,
  colorByValue = false,
  color = "blue",
  size = "md",
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  const barColor = colorByValue ? getCapacityColor(percent) : colorClasses[color];

  const heights = {
    sm: "h-1.5",
    md: "h-2",
  };

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs text-slate-500">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-slate-700">{percent}%</span>}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-slate-100 overflow-hidden", heights[size])}>
        <div
          className={cn("rounded-full transition-all duration-500", heights[size], barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
