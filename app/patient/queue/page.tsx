"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { liveQueue } from "@/lib/mockData";
import { Clock, Users } from "lucide-react";

export default function PatientQueue() {
  const myToken = 18;
  const currentlyServing = 12;
  const ahead = liveQueue.filter((q) => q.token > currentlyServing && q.token < myToken).length;

  return (
    <DashboardLayout role="patient" title="Live OPD Queue" unreadNotifications={3}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Live OPD Queue</h2>
        <p className="text-sm text-slate-500 mt-0.5">City Diabetes Centre — OPD 02 · Dr. Ayesha Khan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Queue status */}
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Currently Serving</p>
            <div className="w-24 h-24 rounded-full border-4 border-blue-500 bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-blue-700">#{currentlyServing}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold text-slate-900">{myToken}</p>
                <p className="text-xs text-slate-500">Your token</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{ahead}</p>
                <p className="text-xs text-slate-500">Ahead of you</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">24m</p>
                <p className="text-xs text-slate-500">Est. wait</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-emerald-600 font-medium">Clinic operating normally</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your Appointment</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Doctor</span>
                <span className="font-medium text-slate-900">Dr. Ayesha Khan</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Specialty</span>
                <span className="font-medium text-slate-900">Endocrinology</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Hospital</span>
                <span className="font-medium text-slate-900">City Diabetes Centre</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-900">10:30 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Token</span>
                <span className="font-bold text-amber-600">#18</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <Badge variant="amber" dot>Waiting</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue list */}
      <Card>
        <CardHeader><CardTitle>Queue Status</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Status</th>
                <th>Wait</th>
              </tr>
            </thead>
            <tbody>
              {liveQueue.filter((q) => q.token <= 22).map((entry) => (
                <tr key={entry.token} className={entry.token === myToken ? "bg-amber-50" : ""}>
                  <td>
                    <span className={`font-bold text-sm ${entry.token === myToken ? "text-amber-600" : "text-slate-700"}`}>
                      #{entry.token} {entry.token === myToken && "(You)"}
                    </span>
                  </td>
                  <td>
                    <Badge
                      variant={
                        entry.status === "in-consultation" ? "blue" :
                        entry.status === "waiting" ? "amber" :
                        entry.status === "called" ? "violet" :
                        "slate"
                      }
                      dot
                    >
                      {entry.status === "in-consultation" ? "In Consultation" : entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="text-slate-600">{entry.waitMinutes > 0 ? `${entry.waitMinutes} min` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
