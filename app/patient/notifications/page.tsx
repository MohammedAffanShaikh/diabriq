"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { notifications } from "@/lib/mockData";

const iconMap = {
  info: <Info size={16} className="text-blue-500" />,
  warning: <AlertTriangle size={16} className="text-amber-500" />,
  success: <CheckCircle2 size={16} className="text-emerald-500" />,
  alert: <XCircle size={16} className="text-red-500" />,
};

const variantMap = {
  info: "blue" as const,
  warning: "amber" as const,
  success: "green" as const,
  alert: "red" as const,
};

export default function PatientNotifications() {
  return (
    <DashboardLayout role="patient" title="Notifications" unreadNotifications={3}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <p className="text-sm text-slate-500 mt-0.5">3 unread notifications</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-4 px-5 py-4 ${!n.read ? "bg-blue-50/30" : ""}`}>
                <div className="shrink-0 mt-0.5">{iconMap[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      <span className="text-xs text-slate-400">{n.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
