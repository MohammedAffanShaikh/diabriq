"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Activity, CheckCircle2, ShieldAlert, Users, ChevronRight, AlertCircle } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";

export default function SmartQueuePage() {
  const {
    queue,
    currentToken,
    patientProfile,
    callNextPatient,
    startConsultation,
    completeConsultation,
    skipPatient,
    notifications,
    role,
  } = useDataContext();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const patientQueueEntry = queue.find((q) => q.patientId === patientProfile.id && q.status !== "completed");
  const patientsAhead = patientQueueEntry ? Math.max(0, patientQueueEntry.token - currentToken) : 0;
  const avgConsultDuration = 4; // minutes
  const estimatedWaitMinutes = patientsAhead * avgConsultDuration;

  const handleCallNext = () => {
    callNextPatient();
    setToastMessage("Advanced queue token. Next patient called.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartConsultation = () => {
    startConsultation();
    setToastMessage(`Consultation started for Token #${currentToken}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSkip = () => {
    skipPatient();
    setToastMessage(`Token #${currentToken} skipped.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role={role}
      title="Smart OPD Queue Management"
      subtitle="Live Queue Token Tracker & OPD Flow"
      unreadNotifications={unreadNotifications}
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Smart OPD Live Queue</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            City Diabetes Centre — OPD 02 (Dr. Ayesha Khan)
          </p>
        </div>

        {(role === "doctor" || role === "admin" || role === "hospital") && (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" icon={<Phone size={14} />} onClick={handleCallNext}>
              Call Next Patient
            </Button>
            <Button size="sm" variant="secondary" icon={<Activity size={14} />} onClick={handleStartConsultation}>
              Start Consultation
            </Button>
            <Button size="sm" variant="ghost" className="text-amber-700" onClick={handleSkip}>
              Skip Patient
            </Button>
          </div>
        )}
      </div>

      {/* SECTION 1: LIVE QUEUE STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-5 shadow-md text-center">
          <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Currently Serving</p>
          <p className="text-4xl font-extrabold mt-1">#{currentToken}</p>
          <p className="text-xs text-blue-100 mt-1">Active OPD Room 02</p>
        </div>

        <div className="bg-amber-500 text-white rounded-xl p-5 shadow-md text-center">
          <p className="text-xs text-amber-100 font-semibold uppercase tracking-wider">Your Token</p>
          <p className="text-4xl font-extrabold mt-1">
            #{patientQueueEntry ? patientQueueEntry.token : 18}
          </p>
          <p className="text-xs text-amber-100 mt-1">
            {patientQueueEntry ? patientQueueEntry.status.toUpperCase() : "WAITING"}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Patients Ahead</p>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">{patientsAhead}</p>
          <p className="text-xs text-slate-500 mt-1">In OPD waiting queue</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Estimated Wait</p>
          <p className="text-4xl font-extrabold text-emerald-600 mt-1">~{estimatedWaitMinutes} min</p>
          <p className="text-[11px] text-emerald-800 mt-1 font-medium">Estimated waiting time</p>
        </div>
      </div>

      {/* ESTIMATED WAITING TIME NOTICE */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 mb-6 text-xs text-slate-600 flex items-center gap-2">
        <Clock size={15} className="text-slate-500 shrink-0" />
        <span>
          <strong>Estimated Waiting Time Disclaimer:</strong> Calculated using <code>Patients Ahead × Avg Duration ({avgConsultDuration} min)</code>. This is a frontend estimate and not an exact prediction.
        </span>
      </div>

      {/* SECTION 2: QUEUE TABLE */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Complete OPD Queue List</CardTitle>
          <Badge variant="green" dot>
            {queue.filter((q) => q.status === "waiting" || q.status === "confirmed").length} Patients Waiting
          </Badge>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name & ID</th>
                <th>Slot Time</th>
                <th>Queue Status</th>
                <th>Estimated Wait</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((entry) => {
                const isCurrent = entry.token === currentToken;
                const entryAhead = Math.max(0, entry.token - currentToken);
                const estWait = entryAhead * avgConsultDuration;

                return (
                  <tr
                    key={entry.token}
                    className={`transition-colors ${
                      isCurrent ? "bg-blue-50 font-semibold" : "hover:bg-slate-50"
                    }`}
                  >
                    <td>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          isCurrent
                            ? "bg-blue-600 text-white"
                            : entry.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        #{entry.token}
                      </span>
                    </td>
                    <td>
                      <p className="text-xs font-bold text-slate-900">{entry.patientName}</p>
                      <p className="text-[10px] text-slate-400">{entry.patientId}</p>
                    </td>
                    <td className="text-xs text-slate-600 font-medium">{entry.appointmentTime}</td>
                    <td>
                      <Badge
                        variant={
                          entry.status === "in-consultation"
                            ? "blue"
                            : entry.status === "called"
                            ? "amber"
                            : entry.status === "completed"
                            ? "green"
                            : "slate"
                        }
                        dot
                      >
                        {entry.status === "in-consultation"
                          ? "In Consultation"
                          : entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-xs text-slate-600 font-medium">
                      {entry.status === "completed"
                        ? "Done"
                        : entry.status === "in-consultation"
                        ? "Now"
                        : `${estWait} min`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
