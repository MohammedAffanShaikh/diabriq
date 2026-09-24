import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    operational: "green",
    "high-load": "amber",
    critical: "red",
    waiting: "amber",
    "in-consultation": "blue",
    confirmed: "blue",
    completed: "green",
    cancelled: "red",
    upcoming: "blue",
    rescheduled: "amber",
  };
  return map[status] ?? "blue";
}

export function getCapacityColor(percent: number): string {
  if (percent >= 90) return "bg-red-500";
  if (percent >= 75) return "bg-amber-500";
  return "bg-emerald-500";
}

export function getCapacityBadge(percent: number): string {
  if (percent >= 90) return "status-red";
  if (percent >= 75) return "status-amber";
  return "status-green";
}
