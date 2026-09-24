"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, ApproveRejectButtons } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Hospital,
  Lock,
  Phone,
  Send,
  Stethoscope,
  User,
  Users,
  XCircle,
  Zap,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { liveQueue, aiRecommendations, patients, visitHistory, recordAccess } from "@/lib/mockData";

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState(aiRecommendations);
  const [approvedRec, setApprovedRec] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApprove = (id: string, msg: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReject = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  };

  const patient = patients.find((p) => p.id === selectedPatient);

  return (
    <DashboardLayout
      role="doctor"
      title="OPD Dashboard"
      subtitle="City Diabetes Centre — OPD 02"
      unreadNotifications={3}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header greeting */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Good morning, Dr. Ayesha</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Today's clinic: City Diabetes Centre — OPD 02 · Thursday, 24 Sep 2026
        </p>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: "Patients Today", value: 42, accent: "text-slate-900", bg: "bg-white" },
          { label: "Waiting", value: 11, accent: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
          { label: "In Consultation", value: 2, accent: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Completed", value: 27, accent: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Cancelled", value: 2, accent: "text-red-600", bg: "bg-red-50 border-red-200" },
          { label: "Avg Wait", value: "18 min", accent: "text-slate-900", bg: "bg-white" },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border border-slate-200 p-4 shadow-sm ${s.bg}`}>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Queue + AI Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Queue */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Live OPD Queue</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Currently serving Token #12</p>
              </div>
              <Badge variant="green" dot>On schedule</Badge>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Appointment</th>
                    <th>Status</th>
                    <th>Wait</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {liveQueue.slice(0, 8).map((entry) => (
                    <tr key={entry.token} className="hover:bg-slate-50 transition-colors">
                      <td>
                        <span
                          className={`queue-token text-sm font-bold ${
                            entry.status === "in-consultation"
                              ? "bg-blue-100 text-blue-700"
                              : entry.status === "called"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          #{entry.token}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium text-slate-900">{entry.patientName}</p>
                          <p className="text-xs text-slate-400">{entry.patientId}</p>
                        </div>
                      </td>
                      <td className="text-slate-600">{entry.appointmentTime}</td>
                      <td>
                        <Badge
                          variant={
                            entry.status === "in-consultation"
                              ? "blue"
                              : entry.status === "called"
                              ? "amber"
                              : entry.status === "waiting"
                              ? "amber"
                              : entry.status === "confirmed"
                              ? "slate"
                              : "green"
                          }
                          dot
                        >
                          {entry.status === "in-consultation"
                            ? "In Consultation"
                            : entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="text-slate-600">
                        {entry.waitMinutes > 0 ? `${entry.waitMinutes} min` : "—"}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedPatient(entry.patientId)}
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* AI Slot Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={16} className="text-violet-500" />
                Smart Slot Suggestions
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                AI-detected operational opportunities — all require human approval
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`rounded-xl border p-4 ${
                    rec.status === "approved"
                      ? "border-emerald-200 bg-emerald-50"
                      : rec.status === "rejected"
                      ? "border-slate-200 bg-slate-50 opacity-60"
                      : "border-violet-200 bg-violet-50/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rec.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{rec.description}</p>
                    </div>
                    {rec.status === "pending" && <AIBadge />}
                    {rec.status === "approved" && (
                      <Badge variant="green" dot>Approved</Badge>
                    )}
                    {rec.status === "rejected" && (
                      <Badge variant="slate" dot>Rejected</Badge>
                    )}
                  </div>

                  <ul className="space-y-1 mb-3">
                    {rec.reason.map((r, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <CheckCircle2 size={11} className="text-violet-500 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>

                  {rec.status === "pending" && (
                    <ApproveRejectButtons
                      onApprove={() =>
                        handleApprove(rec.id, "Patient notified. Slot allocation approved.")
                      }
                      onReject={() => handleReject(rec.id)}
                    />
                  )}
                  {rec.status === "approved" && (
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      Patient notified. Action completed.
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Patient Detail Panel */}
        <div className="space-y-6">
          {selectedPatient && patient ? (
            <PatientDetailPanel
              patient={patient}
              onClose={() => setSelectedPatient(null)}
              onToast={(msg) => {
                setToastMessage(msg);
                setTimeout(() => setToastMessage(null), 3000);
              }}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <User size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Click 'View' on any patient to see their profile</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function PatientDetailPanel({
  patient,
  onClose,
  onToast,
}: {
  patient: (typeof patients)[0];
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Patient Profile</CardTitle>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs">
            ✕ Close
          </button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{patient.name}</p>
              <p className="text-xs text-slate-500">
                {patient.id} · {patient.age} yrs · {patient.gender}
              </p>
              <p className="text-xs text-slate-500">{patient.diabetesType} Diabetes</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-sm font-bold text-slate-900">{patient.connectedHospitals.length}</p>
              <p className="text-[10px] text-slate-500">Facilities</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-sm font-bold text-slate-900">{patient.totalVisits}</p>
              <p className="text-[10px] text-slate-500">Prev. Visits</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-sm font-bold text-slate-900">{patient.documents}</p>
              <p className="text-[10px] text-slate-500">Documents</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1.5 rounded-md mb-4">
            <Lock size={11} />
            Patient has authorized City Diabetes Centre to access previous records from connected facilities
          </div>

          {/* Care Timeline */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">Previous Care Timeline</p>
            <div className="space-y-0">
              {visitHistory.slice(0, 4).map((visit, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot border-blue-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="ml-2">
                    <div className="flex gap-2 flex-wrap items-center">
                      <span className="text-xs font-medium text-slate-900">{visit.hospitalName}</span>
                      <span className="text-[10px] text-slate-400">{visit.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{visit.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Start Consultation", icon: <Activity size={13} />, variant: "primary" as const, onClick: () => onToast("Consultation started. Action logged.") },
              { label: "Call Patient", icon: <Phone size={13} />, variant: "secondary" as const, onClick: () => onToast("Patient called to OPD.") },
              { label: "Mark Waiting", icon: <Clock size={13} />, variant: "outline" as const, onClick: () => onToast("Patient marked as waiting.") },
              { label: "Reschedule", icon: <Calendar size={13} />, variant: "outline" as const, onClick: () => onToast("Reschedule request created.") },
              { label: "Refer to Facility", icon: <Hospital size={13} />, variant: "outline" as const, onClick: () => onToast("Referral initiated. Pending admin approval.") },
              { label: "Request Record", icon: <FileText size={13} />, variant: "outline" as const, onClick: () => onToast("Record request sent to connected facility.") },
              { label: "Add Admin Note", icon: <MessageSquare size={13} />, variant: "outline" as const, onClick: () => onToast("Administrative note added. Logged in audit trail.") },
              { label: "End Visit", icon: <CheckCircle2 size={13} />, variant: "success" as const, onClick: () => onToast("Visit ended. Summary logged.") },
            ].map((action, i) => (
              <Button
                key={i}
                variant={action.variant}
                size="sm"
                icon={action.icon}
                onClick={action.onClick}
                className="justify-start text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">All actions are logged in the audit trail.</p>
        </CardContent>
      </Card>
    </div>
  );
}
