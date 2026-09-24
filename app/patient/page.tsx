"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  FileText,
  Hospital,
  Users,
  Bell,
  ChevronRight,
  Lock,
  MapPin,
  ArrowRight,
  User,
  Activity,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { hospitals, visitHistory, recordAccess, notifications } from "@/lib/mockData";

const unread = notifications.filter((n) => !n.read).length;

export default function PatientDashboard() {
  return (
    <DashboardLayout
      role="patient"
      title="Patient Dashboard"
      subtitle="Rahul Sharma — DIA-204829"
      unreadNotifications={unread}
    >
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Good morning, Rahul</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          You have an appointment today at 10:30 AM — Token #18
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Next Appointment</p>
              <p className="text-lg font-bold mt-1">Dr. Ayesha Khan</p>
            </div>
            <Calendar size={20} className="text-blue-300" />
          </div>
          <p className="text-sm text-blue-100">Endocrinology</p>
          <p className="text-xs text-blue-200 mt-0.5">City Diabetes Centre</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold">10:30 AM · Token #18</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Today</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Queue</p>
            <Clock size={16} className="text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">6</p>
          <p className="text-xs text-slate-500 mt-0.5">patients ahead</p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">~24 min wait</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Care Network</p>
            <Hospital size={16} className="text-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">3</span>
              <span className="text-xs text-slate-500">hospitals connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">2</span>
              <span className="text-xs text-slate-500">doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">7</span>
              <span className="text-xs text-slate-500">previous visits</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Documents</p>
            <FileText size={16} className="text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">12</p>
          <p className="text-xs text-slate-500 mt-0.5">records available</p>
          <div className="mt-3">
            <Link href="/patient/records" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Queue */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Live OPD Queue</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">City Diabetes Centre — OPD 02</p>
              </div>
              <Badge variant="green" dot>On schedule</Badge>
            </CardHeader>
            <CardContent>
              {/* Queue visualization */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-500 mb-2 uppercase font-medium tracking-wider">Currently Serving</p>
                  <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-500 flex items-center justify-center mx-auto">
                    <span className="text-lg font-bold text-blue-700">#12</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                </div>

                <div className="text-center flex-1">
                  <p className="text-xs text-slate-500 mb-2 uppercase font-medium tracking-wider">Your Token</p>
                  <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-500 flex items-center justify-center mx-auto">
                    <span className="text-lg font-bold text-amber-700">#18</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 rounded-lg p-4">
                <div>
                  <p className="text-xl font-bold text-slate-900">6</p>
                  <p className="text-xs text-slate-500">patients ahead</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">24 min</p>
                  <p className="text-xs text-slate-500">estimated wait</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">Live</p>
                  <p className="text-xs text-slate-500">real-time status</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Clinic is currently operating normally.
              </p>
            </CardContent>
          </Card>

          {/* My Appointments */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>My Appointments</CardTitle>
              <Link href="/patient/appointments" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  {
                    doctor: "Dr. Ayesha Khan",
                    specialty: "Endocrinology",
                    hospital: "City Diabetes Centre",
                    date: "Today, 24 Sep 2026",
                    time: "10:30 AM",
                    token: 18,
                    status: "waiting",
                  },
                  {
                    doctor: "Dr. Priya Mehta",
                    specialty: "Internal Medicine",
                    hospital: "Metro Hospital",
                    date: "10 Sep 2026",
                    time: "11:00 AM",
                    token: 8,
                    status: "completed",
                  },
                  {
                    doctor: "Dr. Ayesha Khan",
                    specialty: "Endocrinology",
                    hospital: "City Diabetes Centre",
                    date: "15 Jul 2026",
                    time: "10:00 AM",
                    token: 12,
                    status: "cancelled",
                  },
                ].map((apt, i) => (
                  <div key={i} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Stethoscope size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{apt.doctor}</p>
                        <p className="text-xs text-slate-500">{apt.specialty} · {apt.hospital}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{apt.date} · {apt.time} · Token #{apt.token}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge
                        variant={apt.status === "completed" ? "green" : apt.status === "cancelled" ? "red" : "amber"}
                        dot
                      >
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                      {apt.status !== "completed" && apt.status !== "cancelled" && (
                        <Button size="xs" variant="outline">Reschedule</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Record Timeline */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>My Connected Health Record</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Administrative continuity — authorized doctors can access relevant records
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                <Lock size={11} />
                Authorized Access
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {visitHistory.slice(0, 5).map((visit, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot border-blue-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-900">{visit.hospitalName}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">{visit.date}</span>
                      </div>
                      <Badge variant="blue" dot={false} className="mt-1 text-[10px]">{visit.type}</Badge>
                      {visit.doctorName && (
                        <p className="text-xs text-slate-500 mt-0.5">{visit.doctorName}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Access History */}
              <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Activity size={13} />
                  Access History
                </p>
                <div className="space-y-2">
                  {recordAccess.map((access, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Lock size={11} className="text-emerald-600" />
                        <span className="text-slate-700 font-medium">{access.by}</span>
                        <span className="text-slate-400">{access.facility}</span>
                      </div>
                      <span className="text-slate-400">{access.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Find slot */}
          <Card>
            <CardHeader>
              <CardTitle>Find Available Slot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Hospital / Area</label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
                    <option>City Diabetes Centre</option>
                    <option>Metro Hospital</option>
                    <option>Community Health Centre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Doctor</label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
                    <option>Dr. Ayesha Khan</option>
                    <option>Dr. Rajesh Sharma</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Date</label>
                  <input
                    type="date"
                    defaultValue="2026-09-24"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                  />
                </div>
              </div>

              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-emerald-700 mb-2">Available Today</p>
                <div className="space-y-2">
                  {["10:30 AM", "11:15 AM", "12:00 PM"].map((slot, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between text-sm bg-white border border-emerald-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
                    >
                      <span className="font-medium">{slot}</span>
                      <span className="text-xs text-emerald-600">Book</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Caregiver Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Caregiver Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-800">Vikram Desai</span>
                  <Badge variant="green" dot className="text-[10px]">Authorized</Badge>
                </div>
                <p className="text-xs text-blue-700">Relationship: Son</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Appointments", "Queue", "Notifications"].map((p) => (
                    <span key={p} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Caregiver access requires patient authorization. Access is limited to permitted sections only.
              </p>
            </CardContent>
          </Card>

          {/* Hospital Network */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Hospital Network</CardTitle>
              <Link href="/patient/hospitals" className="text-xs text-blue-600 font-medium hover:underline">
                View map
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {hospitals.slice(0, 4).map((h) => (
                  <div key={h.id} className="px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{h.name}</p>
                      <p className="text-xs text-slate-500">{h.area}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={h.status === "operational" ? "green" : h.status === "high-load" ? "amber" : "red"}
                        dot
                      >
                        {h.availableSlots > 0 ? `${h.availableSlots} slots` : "Full"}
                      </Badge>
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
