"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Hospital,
  Users,
  ChevronRight,
  Lock,
  ArrowRight,
  Activity,
  Stethoscope,
  Droplet,
  Plus,
  History,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Bed,
} from "lucide-react";
import Link from "next/link";
import { useDataContext } from "@/lib/context/DataContext";
import { useState } from "react";

export default function PatientDashboard() {
  const {
    patientProfile,
    glucoseReadings,
    glucoseStats,
    appointments,
    queue,
    currentToken,
    hospitals,
    timelineEvents,
    notifications,
    cancelAppointment,
  } = useDataContext();

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Next upcoming or waiting appointment
  const nextAppointment = appointments.find(
    (a) => a.patientId === patientProfile.id && (a.status === "upcoming" || a.status === "waiting" || a.status === "in-consultation")
  );

  // Queue status for patient's token
  const patientQueueEntry = queue.find((q) => q.patientId === patientProfile.id && q.status !== "completed");
  const patientsAhead = patientQueueEntry
    ? Math.max(0, patientQueueEntry.token - currentToken)
    : 0;
  const estimatedWaitMinutes = patientsAhead * 4;

  // Bed stats summary
  const totalBeds = hospitals.reduce((acc, h) => acc + h.bedsAvailable.total, 0);
  const availableBeds = hospitals.reduce((acc, h) => acc + h.bedsAvailable.general + h.bedsAvailable.icu + h.bedsAvailable.observation, 0);
  const occupiedBeds = hospitals.reduce((acc, h) => acc + h.bedsAvailable.occupied, 0);
  const reservedBeds = hospitals.reduce((acc, h) => acc + h.bedsAvailable.reserved, 0);
  const icuAvailable = hospitals.reduce((acc, h) => acc + h.bedsAvailable.icu, 0);

  const latestReading = glucoseReadings[0];

  return (
    <DashboardLayout
      role="patient"
      title="Patient Diabetes Portal"
      subtitle={`${patientProfile.name} — ${patientProfile.id}`}
      unreadNotifications={unreadNotifications}
    >
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {patientProfile.name.split(" ")[0]} 👋</h2>
          <p className="text-sm text-slate-500 mt-1">
            {patientProfile.diabetesType} Diabetes Care Plan · Diagnostic Year {patientProfile.diagnosisYear}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/patient/glucose">
            <Button size="sm" icon={<Plus size={15} />}>
              Record Glucose
            </Button>
          </Link>
          <Link href="/patient/appointments">
            <Button size="sm" variant="outline" icon={<Calendar size={15} />}>
              Book OPD Slot
            </Button>
          </Link>
          <Link href="/patient/profile">
            <Button size="sm" variant="ghost" icon={<Users size={15} />}>
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* SECTION 1: DIABETES HEALTH SUMMARY BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg mb-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Diabetes Health Summary</h3>
              <p className="text-xs text-blue-200">Real-time parameters derived from recent patient logs</p>
            </div>
          </div>
          <Link
            href="/patient/profile"
            className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            Full Medical Profile <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
            <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Diabetes Type</p>
            <p className="text-lg font-bold text-white mt-1">{patientProfile.diabetesType}</p>
            <p className="text-[10px] text-blue-300">Diagnosed {patientProfile.diagnosisYear}</p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
            <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Latest Glucose</p>
            <p className="text-lg font-bold text-emerald-300 mt-1">
              {latestReading ? `${latestReading.value} mg/dL` : "No data"}
            </p>
            <p className="text-[10px] text-blue-300">
              {latestReading ? `${latestReading.readingType} · ${latestReading.time}` : "Record reading"}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
            <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Latest HbA1c</p>
            <p className="text-lg font-bold text-amber-300 mt-1">{patientProfile.hba1c}%</p>
            <p className="text-[10px] text-blue-300">Target &lt; 7.0%</p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
            <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Blood Pressure</p>
            <p className="text-lg font-bold text-white mt-1">{patientProfile.bloodPressure}</p>
            <p className="text-[10px] text-emerald-300">Normal Range</p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
            <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Weight & BMI</p>
            <p className="text-lg font-bold text-white mt-1">{patientProfile.weightKg} kg</p>
            <p className="text-[10px] text-blue-300">BMI {patientProfile.bmi} kg/m²</p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
            <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Next Follow-Up</p>
            <p className="text-lg font-bold text-teal-300 mt-1">
              {patientProfile.nextFollowUp || "Not scheduled"}
            </p>
            <p className="text-[10px] text-blue-300">
              Last: {patientProfile.lastConsultation || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: TOP CARDS - APPOINTMENT, OPD QUEUE, BEDS & GLUCOSE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Next Appointment Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                Next Appointment
              </span>
              <Calendar size={18} className="text-blue-200" />
            </div>
            {nextAppointment ? (
              <>
                <p className="text-lg font-bold">{nextAppointment.doctorName}</p>
                <p className="text-xs text-blue-100 mt-0.5">{nextAppointment.specialty}</p>
                <p className="text-xs text-blue-200 mt-1 font-medium">{nextAppointment.hospitalName}</p>
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold">{nextAppointment.date} · {nextAppointment.time}</p>
                    <p className="text-[10px] text-blue-200">Appointment ID: {nextAppointment.id}</p>
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Token #{nextAppointment.token}
                  </span>
                </div>
              </>
            ) : (
              <div className="py-4">
                <p className="text-sm font-semibold text-blue-100">No upcoming appointment</p>
                <p className="text-xs text-blue-200 mt-1">Book an OPD slot with your specialist.</p>
                <Link href="/patient/appointments" className="mt-3 inline-block">
                  <Button size="xs" variant="secondary">Book Now</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Live OPD Queue Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Live OPD Queue
              </span>
              <Clock size={18} className="text-blue-600" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <p className="text-2xl font-bold text-slate-900">#{currentToken}</p>
                <p className="text-xs text-slate-500">Currently Serving</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-amber-600">
                  #{patientQueueEntry ? patientQueueEntry.token : patientProfile.caregiverAccess ? 18 : "N/A"}
                </p>
                <p className="text-xs text-slate-500">Your Token</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">{patientsAhead} patients ahead</span>
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ~{estimatedWaitMinutes} min wait
            </span>
          </div>
        </div>

        {/* Network Bed Availability Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Hospital Beds
              </span>
              <Bed size={18} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{availableBeds} <span className="text-xs text-slate-400 font-normal">/ {totalBeds} total available</span></p>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
              <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded font-medium">
                {availableBeds} Gen.
              </div>
              <div className="bg-blue-50 text-blue-800 p-1.5 rounded font-medium">
                {icuAvailable} ICU
              </div>
              <div className="bg-slate-100 text-slate-700 p-1.5 rounded font-medium">
                {occupiedBeds} Occ.
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live network capacity tracker
          </div>
        </div>

        {/* Glucose Analytics Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Glucose Analytics
              </span>
              <Droplet size={18} className="text-red-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {glucoseStats.averageGlucose > 0 ? `${glucoseStats.averageGlucose} mg/dL` : "No Data"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Average across {glucoseStats.readingCount} readings</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                TIR {glucoseStats.inRangePercent}%
              </span>
              <span className="text-xs text-slate-500">Fasting: {glucoseStats.fastingAvg || "N/A"}</span>
            </div>
          </div>
          <div className="mt-3">
            <Link
              href="/patient/glucose"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View Glucose Dashboard <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 3: MAIN GRID - QUEUE & APPOINTMENTS (LEFT), TIMELINE & EDUCATION (RIGHT) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Queue Progress */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Live OPD Queue Status</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">City Diabetes Centre — OPD 02 (Dr. Ayesha Khan)</p>
              </div>
              <Badge variant="green" dot>Active Clinic</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-500 mb-2 uppercase font-semibold tracking-wider">Currently Serving</p>
                  <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-500 flex items-center justify-center mx-auto shadow-sm">
                    <span className="text-lg font-bold text-blue-700">#{currentToken}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                </div>

                <div className="text-center flex-1">
                  <p className="text-xs text-slate-500 mb-2 uppercase font-semibold tracking-wider">Your Token</p>
                  <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-500 flex items-center justify-center mx-auto shadow-sm">
                    <span className="text-lg font-bold text-amber-700">#18</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div>
                  <p className="text-xl font-bold text-slate-900">{patientsAhead}</p>
                  <p className="text-xs text-slate-500">patients ahead</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">~{estimatedWaitMinutes} min</p>
                  <p className="text-xs text-slate-500">estimated wait time</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">On Schedule</p>
                  <p className="text-xs text-slate-500">queue status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>My Appointments</CardTitle>
              <Link href="/patient/appointments" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                Manage all <ChevronRight size={12} />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {appointments.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Stethoscope size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{apt.doctorName}</p>
                        <p className="text-xs text-slate-500">{apt.specialty} · {apt.hospitalName}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                          <span className="font-medium">{apt.date}</span>
                          <span>•</span>
                          <span>{apt.time}</span>
                          <span>•</span>
                          <span className="font-bold text-blue-700">Token #{apt.token}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge
                        variant={
                          apt.status === "completed"
                            ? "green"
                            : apt.status === "cancelled"
                            ? "red"
                            : apt.status === "in-consultation"
                            ? "blue"
                            : "amber"
                        }
                        dot
                      >
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                      {(apt.status === "waiting" || apt.status === "upcoming") && (
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* Diabetes Care Timeline Preview */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History size={16} className="text-blue-600" />
                Diabetes Care Timeline
              </CardTitle>
              <Link href="/patient/timeline" className="text-xs text-blue-600 font-medium hover:underline">
                View Timeline
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="relative pl-5 border-l-2 border-blue-200">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {event.date}
                    </span>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">{event.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Diabetes Education Shortcut */}
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-900 text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" />
                Patient Diabetes Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-teal-800 leading-relaxed mb-3">
                Learn non-diagnostic self-care best practices for blood glucose monitoring, nutrition, medication safety, and appointment preparation.
              </p>
              <Link href="/patient/education">
                <Button size="xs" variant="outline" className="border-teal-300 text-teal-800 hover:bg-teal-100">
                  Read Patient Educational Guide
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
