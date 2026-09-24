"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { auditEvents } from "@/lib/mockData";

export default function AdminAudit() {
  return (
    <DashboardLayout role="admin" title="Audit Logs" unreadNotifications={4}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Audit Trail</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Every action is logged with user, facility, and timestamp. Full operational accountability.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={16} className="text-slate-500" />
            System Audit Log — Today
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Facility</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="text-slate-500 font-mono text-xs whitespace-nowrap">{event.timestamp}</td>
                    <td className="font-medium text-slate-900">{event.user}</td>
                    <td>
                      <Badge
                        variant={
                          event.userRole === "doctor"
                            ? "blue"
                            : event.userRole === "network-admin"
                            ? "violet"
                            : event.userRole === "hospital-admin"
                            ? "violet"
                            : "slate"
                        }
                        dot={false}
                        className="text-[10px]"
                      >
                        {event.userRole.replace("-", " ")}
                      </Badge>
                    </td>
                    <td>
                      <p className="text-sm text-slate-700 max-w-xs">{event.action}</p>
                      {event.details && (
                        <p className="text-[10px] text-violet-600 mt-0.5">{event.details}</p>
                      )}
                    </td>
                    <td className="text-slate-600 text-sm">{event.facility}</td>
                    <td>
                      <Badge
                        variant={
                          event.status === "completed"
                            ? "green"
                            : event.status === "approved"
                            ? "blue"
                            : event.status === "rejected"
                            ? "red"
                            : "amber"
                        }
                        dot={true}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
