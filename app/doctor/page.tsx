"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Hospital,
  Phone,
  Stethoscope,
  User,
  Users,
  Calendar,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  History,
  Droplet,
  Save,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useDataContext } from "@/lib/context/DataContext";
import { PatientProfile } from "@/lib/types";

export default function DoctorDashboard() {
  const {
    queue,
    currentToken,
    callNextPatient,
    startConsultation,
    completeConsultation,
    skipPatient,
    patientProfile,
    glucoseReadings,
    glucoseStats,
    timelineEvents,
    consultations,
    notifications,
  } = useDataContext();

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patientProfile.id);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Consultation Form State
  const [notes, setNotes] = useState("");
  const [observations, setObservations] = useState("");
  const [followUpDate, setFollowUpDate] = useState("2026-10-20");

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const currentQueueEntry = queue.find((q) => q.token === currentToken) || queue[0];

  const handleCallNext = () => {
    callNextPatient();
    setToastMessage(`Called next patient token.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartConsultation = () => {
    startConsultation();
    setToastMessage(`Started consultation for Token #${currentToken}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenConsultationModal = () => {
    setShowConsultationModal(true);
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes) return;

    completeConsultation({
      notes,
      observations,
      followUpDate,
    });

    setShowConsultationModal(false);
    setNotes("");
    setObservations("");
    setToastMessage("Consultation completed, notes saved, and timeline updated!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Prepare chart data for patient summary
  const chartData = [...glucoseReadings]
    .reverse()
    .map((r) => ({
      date: `${r.date.slice(5)}`,
      value: r.value,
    }));

  return (
    <DashboardLayout
      role="doctor"
      title="Doctor OPD & Patient Workflow"
      subtitle="City Diabetes Centre — OPD 02 (Dr. Ayesha Khan)"
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
          <h2 className="text-xl font-bold text-slate-900">Good Morning, Dr. Ayesha Khan</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Endocrinology Outpatient Clinic · Today's Token In-Room: <strong className="text-blue-700 font-bold">#{currentToken}</strong>
          </p>
        </div>

        {/* Doctor Queue Quick Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" icon={<Phone size={14} />} onClick={handleCallNext}>
            Call Next (#)
          </Button>
          <Button size="sm" variant="secondary" icon={<Activity size={14} />} onClick={handleStartConsultation}>
            Start Consultation
          </Button>
          <Button size="sm" icon={<CheckCircle2 size={14} />} onClick={handleOpenConsultationModal}>
            Complete Visit
          </Button>
        </div>
      </div>

      {/* OPD Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Patients Today</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{queue.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">Waiting</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {queue.filter((q) => q.status === "waiting" || q.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">In Consultation</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {queue.filter((q) => q.status === "in-consultation" || q.status === "called").length}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {queue.filter((q) => q.status === "completed").length}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Avg Consultation</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">12 min</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Est. Clinic End</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">01:30 PM</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Live Queue Table */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Today's OPD Queue</CardTitle>
              <Badge variant="blue" dot>OPD 02</Badge>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((entry) => {
                    const isCurrent = entry.token === currentToken;
                    return (
                      <tr
                        key={entry.token}
                        className={`transition-colors ${
                          isCurrent ? "bg-blue-50/90 font-semibold" : "hover:bg-slate-50"
                        }`}
                      >
                        <td>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
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
                          <p className="text-xs font-semibold text-slate-900">{entry.patientName}</p>
                          <p className="text-[10px] text-slate-400">{entry.appointmentTime}</p>
                        </td>
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
                            className="text-[9px]"
                          >
                            {entry.status}
                          </Badge>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedPatientId(entry.patientId)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 font-semibold"
                          >
                            <Eye size={12} /> Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (2 cols): DOCTOR DIABETES SUMMARY & CONSULTATION WORKFLOW */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Doctor Diabetes Patient Summary
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete clinical history view for active consultation
                </p>
              </div>
              <Button size="sm" icon={<Plus size={14} />} onClick={handleOpenConsultationModal}>
                Complete Visit Notes
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              {/* Patient Demographics Banner */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Patient</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{patientProfile.name}</p>
                  <p className="text-slate-500">{patientProfile.id} · {patientProfile.age} yrs · {patientProfile.gender}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Diabetes Type</p>
                  <p className="text-sm font-bold text-blue-700 mt-0.5">{patientProfile.diabetesType}</p>
                  <p className="text-slate-500">Diagnosed {patientProfile.diagnosisYear}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Vitals</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">BP: {patientProfile.bloodPressure}</p>
                  <p className="text-slate-500">BMI: {patientProfile.bmi} kg/m² ({patientProfile.weightKg} kg)</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Glycemia</p>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">HbA1c: {patientProfile.hba1c}%</p>
                  <p className="text-emerald-700 font-semibold">TIR: {glucoseStats.inRangePercent}%</p>
                </div>
              </div>

              {/* Glucose Trend Chart */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-blue-600" /> Glucose Trend Chart
                </h4>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[50, 220]} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="Glucose mg/dL" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Readings Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Droplet size={14} className="text-red-500" /> Recent Glucose Logs
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Value</th>
                        <th>Type</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {glucoseReadings.slice(0, 4).map((r) => (
                        <tr key={r.id}>
                          <td className="text-xs text-slate-900 font-medium">{r.date} {r.time}</td>
                          <td className="text-xs font-bold text-slate-900">{r.value} mg/dL</td>
                          <td><Badge variant="blue" dot={false} className="text-[9px]">{r.readingType}</Badge></td>
                          <td className="text-xs text-slate-500">{r.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Diabetes Care Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <History size={14} className="text-blue-600" /> Diabetes Care Timeline
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 max-h-48 overflow-y-auto">
                  {timelineEvents.slice(0, 5).map((e) => (
                    <div key={e.id} className="text-xs border-l-2 border-blue-400 pl-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{e.date}</span>
                      <p className="font-semibold text-slate-900">{e.title}</p>
                      <p className="text-slate-600 text-[11px]">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previous Consultations History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <FileText size={14} className="text-emerald-600" /> Previous Consultations History
                </h4>
                <div className="space-y-2">
                  {consultations.map((c) => (
                    <div key={c.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <div className="flex justify-between font-semibold text-slate-900 mb-1">
                        <span>{c.date} · {c.doctorName}</span>
                        <span className="text-blue-600">{c.hospitalName}</span>
                      </div>
                      <p className="text-slate-600">Notes: {c.notes}</p>
                      <p className="text-slate-500 mt-0.5">Observations: {c.observations}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DOCTOR CONSULTATION FORM MODAL */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="text-blue-600" size={20} />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Doctor Consultation Notes</h3>
                  <p className="text-xs text-slate-500">Token #{currentToken} — {currentQueueEntry.patientName}</p>
                </div>
              </div>
              <button onClick={() => setShowConsultationModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConsultation} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Notes & Treatment Plan</label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Adjusted Metformin timing. Advised 30 min evening walk and carbohydrate control."
                  className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physical Observations & Exam Findings</label>
                <input
                  type="text"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="e.g., BP 124/82, Foot exam normal, no neuropathy signs."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Next Follow-Up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 text-[11px]">
                <p className="font-bold">Workflow Actions on Completion:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-emerald-700">
                  <li>Appointment status set to Completed</li>
                  <li>Queue token advances automatically</li>
                  <li>Follow-up date & timeline saved to LocalStorage</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setShowConsultationModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" icon={<Save size={15} />}>
                  Complete Consultation & Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
