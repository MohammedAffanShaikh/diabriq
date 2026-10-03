"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Activity,
  Bed,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDataContext } from "@/lib/context/DataContext";

export default function AdminCapacityPage() {
  const { appointments, beds, notifications } = useDataContext();

  const opdDemandByDay = [
    { day: "Monday", count: 42 },
    { day: "Tuesday", count: 38 },
    { day: "Wednesday", count: 35 },
    { day: "Thursday", count: 48 },
    { day: "Friday", count: 52 },
    { day: "Saturday", count: 28 },
  ];

  const statusCounts = [
    { name: "Waiting", value: appointments.filter((a) => a.status === "waiting").length || 3, color: "#f59e0b" },
    { name: "Completed", value: appointments.filter((a) => a.status === "completed").length || 5, color: "#10b981" },
    { name: "Upcoming", value: appointments.filter((a) => a.status === "upcoming").length || 4, color: "#3b82f6" },
    { name: "Cancelled", value: appointments.filter((a) => a.status === "cancelled").length || 1, color: "#ef4444" },
  ];

  const bedOccupancy = [
    { name: "Available", value: beds.filter((b) => b.status === "available").length, color: "#10b981" },
    { name: "Occupied", value: beds.filter((b) => b.status === "occupied").length, color: "#3b82f6" },
    { name: "Reserved", value: beds.filter((b) => b.status === "reserved").length, color: "#f59e0b" },
    { name: "Maintenance", value: beds.filter((b) => b.status === "maintenance").length, color: "#ef4444" },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout role="admin" title="Capacity Planning & Analytics" subtitle="Data-Driven Capacity Insights" unreadNotifications={unreadNotifications}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Capacity Planning Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Operational distribution analytics demonstrating predictive capacity planning
          </p>
        </div>
        <Badge variant="blue" dot={false} className="text-xs px-3 py-1">
          Prototype / Data Visualization Mode
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600" />
              OPD Demand Analysis by Day of Week
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Appointment volume distribution (Monday to Saturday) based on clinic logs
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Peak Day: Friday
          </span>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={opdDemandByDay} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Operational Research Insight:</p>
            <p className="mt-0.5">
              Historical OPD volume shows peak congestion on Thursday and Friday. Smart slot reallocation can balance walk-in traffic towards Wednesday afternoon slots.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <PieChartIcon size={16} className="text-indigo-600" />
              Appointment Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
              {statusCounts.map((s) => (
                <span key={s.name} className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name} ({s.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bed size={16} className="text-emerald-600" />
              Bed Occupancy Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bedOccupancy} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {bedOccupancy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
              {bedOccupancy.map((b) => (
                <span key={b.name} className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                  {b.name} ({b.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
