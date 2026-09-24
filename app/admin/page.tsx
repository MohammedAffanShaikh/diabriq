"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, ApproveRejectButtons } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  Bed,
  CheckCircle2,
  Hospital,
  Network,
  Shield,
  Users,
  Zap,
  Clock,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Stethoscope,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  Sankey,
  Rectangle,
} from "recharts";
import {
  networkStats,
  networkHospitalTable,
  auditEvents,
  aiRecommendations,
  capacityTrend,
  flowData,
  hospitals,
} from "@/lib/mockData";
import { getCapacityColor } from "@/lib/utils";

export default function AdminDashboard() {
  const [recs, setRecs] = useState(aiRecommendations);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <DashboardLayout
      role="admin"
      title="Diabriq Network Command Center"
      subtitle="Mumbai Metropolitan Network · 24 Sep 2026"
      unreadNotifications={4}
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Network Command Center</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Real-time operational overview of the Diabriq diabetes care network
        </p>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          {
            label: "Connected Hospitals",
            value: networkStats.connectedHospitals,
            icon: <Hospital size={18} />,
            color: "text-blue-600 bg-blue-50 border-blue-200",
          },
          {
            label: "Active Doctors",
            value: networkStats.activeDoctors,
            icon: <Stethoscope size={18} />,
            color: "text-teal-600 bg-teal-50 border-teal-200",
          },
          {
            label: "Total Patients",
            value: networkStats.totalPatients.toLocaleString(),
            icon: <Users size={18} />,
            color: "text-violet-600 bg-violet-50 border-violet-200",
          },
          {
            label: "Appointments Today",
            value: networkStats.appointmentsToday.toLocaleString(),
            icon: <Activity size={18} />,
            color: "text-indigo-600 bg-indigo-50 border-indigo-200",
          },
          {
            label: "Avg OPD Wait",
            value: `${networkStats.avgWaitMinutes} min`,
            icon: <Clock size={18} />,
            color: "text-amber-600 bg-amber-50 border-amber-200",
          },
          {
            label: "Available Beds",
            value: networkStats.availableBeds,
            icon: <Bed size={18} />,
            color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border p-4 shadow-sm ${s.color}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium opacity-70">{s.label}</p>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Hospitals Table + Network Flow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hospital Table */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Hospital Network Status</CardTitle>
              <Badge variant="green" dot>27 Facilities Connected</Badge>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hospital</th>
                    <th>OPD Load</th>
                    <th>Slots</th>
                    <th>Beds</th>
                    <th>Doctors</th>
                    <th>Avg Wait</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {networkHospitalTable.map((h, i) => (
                    <tr key={i}>
                      <td>
                        <p className="font-medium text-slate-900 text-xs">{h.name}</p>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-16">
                            <ProgressBar value={h.opdLoad} colorByValue size="sm" />
                          </div>
                          <span className="text-xs text-slate-600 font-medium w-8">{h.opdLoad}%</span>
                        </div>
                      </td>
                      <td className="font-semibold text-sm">{h.slots}</td>
                      <td className="font-semibold text-sm">{h.beds}</td>
                      <td className="font-semibold text-sm">{h.doctors}</td>
                      <td className="text-sm text-slate-600">{h.wait} min</td>
                      <td>
                        <Badge
                          variant={
                            h.status === "operational" ? "green" : h.status === "high-load" ? "amber" : "red"
                          }
                          dot
                        >
                          {h.status === "operational" ? "OK" : h.status === "high-load" ? "High Load" : "Critical"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Patient Flow Monitor */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Flow Monitor — Today</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time patient movement across the network
              </p>
            </CardHeader>
            <CardContent>
              <PatientFlowVisualization />
            </CardContent>
          </Card>

          {/* Network Wide Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Network Capacity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={capacityTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Line type="monotone" dataKey="capacity" stroke="#3b82f6" strokeWidth={2} dot={false} name="Capacity %" />
                  <Line type="monotone" dataKey="wait" stroke="#f59e0b" strokeWidth={2} dot={false} name="Avg Wait (min)" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-0.5 bg-blue-500 inline-block" />
                  Capacity %
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-0.5 bg-amber-500 inline-block" />
                  Avg Wait (min)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — AI Recommendations + Audit */}
        <div className="space-y-6">
          {/* Network Bottleneck AI */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={16} className="text-violet-500" />
                Network Operational Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recs.map((rec) => (
                <div
                  key={rec.id}
                  className={`rounded-xl border p-3.5 ${
                    rec.status === "approved"
                      ? "border-emerald-200 bg-emerald-50"
                      : rec.status === "rejected"
                      ? "border-slate-200 bg-slate-50 opacity-60"
                      : "border-violet-200 bg-violet-50/30"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-900 mb-1">{rec.title}</p>
                  <p className="text-xs text-slate-600 mb-2">{rec.description}</p>
                  {rec.status === "pending" && (
                    <>
                      <AIBadge className="mb-2 text-[10px]" />
                      <ApproveRejectButtons
                        onApprove={() => {
                          setRecs((prev) =>
                            prev.map((r) => (r.id === rec.id ? { ...r, status: "approved" } : r))
                          );
                          showToast("Action approved. Logged in audit trail.");
                        }}
                        onReject={() =>
                          setRecs((prev) =>
                            prev.map((r) => (r.id === rec.id ? { ...r, status: "rejected" } : r))
                          )
                        }
                      />
                    </>
                  )}
                  {rec.status === "approved" && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Approved and logged.
                    </p>
                  )}
                  {rec.status === "rejected" && (
                    <p className="text-xs text-slate-500">Override: Action rejected.</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield size={15} className="text-slate-500" />
                Audit Trail
              </CardTitle>
              <Badge variant="blue" dot={false}>Live</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {auditEvents.map((event) => (
                  <div key={event.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                            {event.timestamp}
                          </span>
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
                            dot
                            className="text-[9px]"
                          >
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs font-medium text-slate-900 truncate">{event.action}</p>
                        <p className="text-[10px] text-slate-500">{event.user} · {event.facility}</p>
                        {event.details && (
                          <p className="text-[10px] text-violet-600 mt-0.5">{event.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PatientFlowVisualization() {
  const steps = [
    { label: "Appointments", value: 184, color: "bg-blue-500", textColor: "text-blue-600" },
    { label: "Arrived", value: 167, color: "bg-blue-400", textColor: "text-blue-500" },
    { label: "Waiting", value: 11, color: "bg-amber-500", textColor: "text-amber-600" },
    { label: "Consultation", value: 4, color: "bg-violet-500", textColor: "text-violet-600" },
    { label: "Completed", value: 148, color: "bg-emerald-500", textColor: "text-emerald-600" },
    { label: "Delayed", value: 4, color: "bg-red-400", textColor: "text-red-500" },
  ];

  const max = Math.max(...steps.map((s) => s.value));

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-20 shrink-0 text-right">
            <span className={`text-xs font-medium ${step.textColor}`}>{step.label}</span>
          </div>
          <div className="flex-1 bg-slate-100 rounded-full h-5 relative overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${step.color}`}
              style={{ width: `${(step.value / max) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center px-3 text-xs font-bold text-white mix-blend-multiply">
              {step.value}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="absolute left-[7.25rem] text-slate-300">↓</div>
          )}
        </div>
      ))}
      <p className="text-xs text-slate-500 mt-2">
        184 appointments today · 167 arrived · 4 currently in consultation
      </p>
    </div>
  );
}
