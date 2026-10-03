"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, Info, AlertTriangle, Check } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, role } = useDataContext();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role={role}
      title="System Notifications"
      subtitle="Real-Time Event & Status Alerts"
      unreadNotifications={unreadCount}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notifications & Alerts</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time updates triggered by appointment bookings, queue changes, consultations, and profile updates
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} className="text-blue-600" />
            Activity Log ({notifications.length})
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="red" dot={false}>
              {unreadCount} Unread
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <p className="text-center py-12 text-slate-400 italic">No notifications.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                    !n.read ? "bg-blue-50/40" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {n.type === "success" ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ) : n.type === "warning" ? (
                        <AlertTriangle size={18} className="text-amber-500" />
                      ) : (
                        <Info size={18} className="text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 text-sm">{n.title}</p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{n.timestamp}</p>
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => markNotificationAsRead(n.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0"
                    >
                      <Check size={13} /> Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
