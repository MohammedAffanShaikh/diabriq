"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bed,
  Users,
  Stethoscope,
  Clock,
  CheckCircle2,
  Shield,
  Hospital as HospitalIcon,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import Link from "next/link";

export default function AdminDashboard() {
  const {
    hospitals,
    doctors,
    appointments,
    queue,
    beds,
    staff,
    auditEvents,
    notifications,
  } = useDataContext();

  // DYNAMIC AGGREGATED STATS
  const totalBeds = beds.length;
  const availableBeds = beds.filter((b) => b.status === "available").length;
  const occupiedBeds = beds.filter((b) => b.status === "occupied").length;
  const reservedBeds = beds.filter((b) => b.status === "reserved").length;

  const totalStaff = staff.length;
  const onDutyStaff = staff.filter((s) => s.availability === "On Duty").length;
  const availableStaff = staff.filter((s) => s.availability === "Available").length;
  const onLeaveStaff = staff.filter((s) => s.availability === "On Leave").length;

  const activeDoctorsCount = doctors.filter((d) => d.available).length;
  const totalAppointmentsCount = appointments.length;
  const waitingPatientsCount = queue.filter((q) => q.status === "waiting" || q.status === "confirmed").length;
  const completedConsultationsCount = queue.filter((q) => q.status === "completed").length;

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="admin"
      title="Diabriq Network Command Center"
      subtitle="Mumbai Metropolitan Healthcare Operations"
      unreadNotifications={unreadNotifications}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hospital Operations & Command Center</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time operational summary aggregated from central shared state
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/analytics">
            <Button size="sm" variant="outline" icon={<BarChart3 size={15} />}>
              Operational Analytics
            </Button>
          </Link>
          <Link href="/admin/staff">
            <Button size="sm" icon={<Users size={15} />}>
              Manage HRM Staff
            </Button>
          </Link>
        </div>
      </div>

      {/* AGGREGATED TOP STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Connected Clinics</p>
            <HospitalIcon size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{hospitals.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Mumbai Metro Network</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Today's Appointments</p>
            <Calendar size={16} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalAppointmentsCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{waitingPatientsCount} currently waiting</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Available Beds</p>
            <Bed size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{availableBeds}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">of {totalBeds} total beds</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">On-Duty Staff</p>
            <Users size={16} className="text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-600">{onDutyStaff}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">of {totalStaff} total personnel</p>
        </div>
      </div>

      {/* FOUR OPERATIONAL PANELS: OPD, BEDS, STAFF, PATIENT FLOW */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* PANEL 1: OPD OPERATIONS */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity size={16} className="text-blue-600" /> OPD Operations
              </span>
              <Link href="/admin/opd" className="text-[11px] text-blue-600 font-semibold hover:underline">Config</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Today's Appointments:</span>
              <span className="font-bold text-slate-900">{totalAppointmentsCount}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Waiting Patients:</span>
              <span className="font-bold text-amber-600">{waitingPatientsCount}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Completed Consultations:</span>
              <span className="font-bold text-emerald-600">{completedConsultationsCount}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">OPD Capacity Load:</span>
              <span className="font-bold text-blue-700">82% Avg</span>
            </div>
          </CardContent>
        </Card>

        {/* PANEL 2: BEDS STATUS */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Bed size={16} className="text-indigo-600" /> Bed Allocation
              </span>
              <Link href="/admin/beds" className="text-[11px] text-blue-600 font-semibold hover:underline">Manage</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Tracked Beds:</span>
              <span className="font-bold text-slate-900">{totalBeds}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Available:</span>
              <span className="font-bold text-emerald-600">{availableBeds}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Occupied:</span>
              <span className="font-bold text-blue-700">{occupiedBeds}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Reserved:</span>
              <span className="font-bold text-amber-600">{reservedBeds}</span>
            </div>
          </CardContent>
        </Card>

        {/* PANEL 3: STAFF & HRM */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users size={16} className="text-teal-600" /> HRM / Staff Status
              </span>
              <Link href="/admin/staff" className="text-[11px] text-blue-600 font-semibold hover:underline">Roster</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Staff Personnel:</span>
              <span className="font-bold text-slate-900">{totalStaff}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">On Duty:</span>
              <span className="font-bold text-emerald-600">{onDutyStaff}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Available (Off-duty):</span>
              <span className="font-bold text-blue-700">{availableStaff}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">On Leave / Inactive:</span>
              <span className="font-bold text-amber-600">{onLeaveStaff}</span>
            </div>
          </CardContent>
        </Card>

        {/* PANEL 4: PATIENT FLOW */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Stethoscope size={16} className="text-emerald-600" /> Doctor Roster
              </span>
              <Link href="/admin/doctors" className="text-[11px] text-blue-600 font-semibold hover:underline">View</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Specialists:</span>
              <span className="font-bold text-slate-900">{doctors.length}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Active On-Duty:</span>
              <span className="font-bold text-emerald-600">{activeDoctorsCount}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Avg OPD Wait Time:</span>
              <span className="font-bold text-amber-600">18 min</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Cross-Hospital Referrals:</span>
              <span className="font-bold text-blue-700">3 Pending</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: AUDIT TRAIL LOGS */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield size={18} className="text-slate-700" />
            Live Network Audit Trail & Log
          </CardTitle>
          <Badge variant="blue" dot={false}>Accountability Trail</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {auditEvents.map((event) => (
              <div key={event.id} className="p-3.5 flex items-start justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] text-slate-400">{event.timestamp}</span>
                    <span className="font-bold text-slate-900">{event.user}</span>
                    <Badge variant="slate" dot={false} className="text-[9px]">{event.userRole}</Badge>
                  </div>
                  <p className="text-slate-700 font-medium">{event.action}</p>
                  {event.details && <p className="text-[11px] text-slate-500 mt-0.5">{event.details}</p>}
                </div>
                <Badge variant={event.status === "completed" ? "green" : "blue"} dot className="text-[9px]">
                  {event.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
