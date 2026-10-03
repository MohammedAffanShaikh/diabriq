"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bed,
  CheckCircle2,
  Hospital as HospitalIcon,
  Stethoscope,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import Link from "next/link";

export default function HospitalDashboard() {
  const { hospitals, beds, staff, doctors, appointments, queue, notifications } = useDataContext();

  const [toast, setToast] = useState<string | null>(null);

  // Dynamic metrics for main hospital (h1)
  const h1Beds = beds.filter((b) => b.hospitalId === "h1");
  const availBedsCount = h1Beds.filter((b) => b.status === "available").length;
  const occupiedBedsCount = h1Beds.filter((b) => b.status === "occupied").length;

  const h1Staff = staff.filter((s) => s.hospitalId === "h1");
  const onDutyStaffCount = h1Staff.filter((s) => s.availability === "On Duty").length;

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="hospital"
      title="Hospital Operations & Capacity"
      subtitle="City Diabetes Centre · Bandra West, Mumbai"
      unreadNotifications={unreadNotifications}
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900">City Diabetes Centre</h2>
            <Badge variant="green" dot>Operational</Badge>
          </div>
          <p className="text-sm text-slate-500">Bandra West, Mumbai · Outpatient & Resource Management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/hospital/beds">
            <Button size="sm" variant="outline" icon={<Bed size={15} />}>Manage Beds</Button>
          </Link>
          <Link href="/hospital/staff">
            <Button size="sm" icon={<Users size={15} />}>Manage Staff</Button>
          </Link>
        </div>
      </div>

      {/* DYNAMIC CAPACITY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">OPD Load</p>
            <Activity size={16} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">82%</p>
          <p className="text-xs text-slate-500 mt-0.5">{appointments.length} appointments</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">Available Beds</p>
            <Bed size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{availBedsCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">of {h1Beds.length} tracked beds</p>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">Staff On-Duty</p>
            <Stethoscope size={16} className="text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-700">{onDutyStaffCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">of {h1Staff.length} personnel</p>
        </div>

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">Waiting Queue</p>
            <Users size={16} className="text-violet-600" />
          </div>
          <p className="text-2xl font-bold text-violet-700">
            {queue.filter((q) => q.status === "waiting" || q.status === "confirmed").length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">patients waiting</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">Completed</p>
            <Calendar size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">
            {queue.filter((q) => q.status === "completed").length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">consultations today</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">Avg OPD Wait</p>
            <Clock size={16} className="text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">18 min</p>
          <p className="text-xs text-slate-500 mt-0.5">clinic average</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* BED AVAILABILITY SUMMARY */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bed size={18} className="text-indigo-600" />
              Live Hospital Bed Allocation
            </CardTitle>
            <Link href="/hospital/beds" className="text-xs text-blue-600 font-semibold hover:underline">
              Full Inventory →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bed ID</th>
                  <th>Ward</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {h1Beds.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td className="font-bold text-xs">{b.id}</td>
                    <td className="text-xs">{b.ward}</td>
                    <td><Badge variant="blue" dot={false} className="text-[9px]">{b.bedType}</Badge></td>
                    <td>
                      <Badge variant={b.status === "available" ? "green" : b.status === "occupied" ? "blue" : "amber"} dot>
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* STAFF ON DUTY SUMMARY */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users size={18} className="text-teal-600" />
              Hospital Staff Roster
            </CardTitle>
            <Link href="/hospital/staff" className="text-xs text-blue-600 font-semibold hover:underline">
              Manage Staff →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Shift</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {h1Staff.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td className="font-bold text-xs">{s.name}</td>
                    <td><Badge variant="blue" dot={false} className="text-[9px]">{s.role}</Badge></td>
                    <td className="text-xs">{s.shift}</td>
                    <td>
                      <Badge variant={s.availability === "On Duty" ? "green" : "slate"} dot>
                        {s.availability}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
