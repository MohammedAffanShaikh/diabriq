"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, FileText, List, History } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";

export default function ConsultationHistoryPage() {
  const { consultations, notifications } = useDataContext();
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="patient"
      title="Consultation History"
      subtitle="Doctor Clinical Notes & Observations"
      unreadNotifications={unreadNotifications}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Patient Consultation History</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review detailed notes, observations, and follow-up recommendations from your doctors
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={14} />
            List / Table View
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              viewMode === "timeline" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History size={14} />
            Timeline View
          </button>
        </div>
      </div>

      {consultations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400 italic">
            No completed consultation records found.
          </CardContent>
        </Card>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {consultations.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 border-b border-slate-100 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{c.doctorName}</p>
                      <p className="text-xs text-slate-500">{c.hospitalName}</p>
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <Badge variant="green" dot>
                      Consultation Completed
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {c.date} · {c.time}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-1">Doctor Consultation Notes:</p>
                    <p className="text-slate-700 leading-relaxed">{c.notes}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-1">Observations & Measurements:</p>
                    <p className="text-slate-700 leading-relaxed">{c.observations}</p>
                  </div>
                </div>

                {c.followUpDate && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
                    <Calendar size={14} className="text-blue-600" />
                    <span className="text-slate-600">Scheduled Follow-up Date:</span>
                    <span className="font-bold text-blue-700">{c.followUpDate}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="relative pl-6 border-l-2 border-emerald-300 space-y-6">
              {consultations.map((c) => (
                <div key={c.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700">
                    <Stethoscope size={12} />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {c.date}
                      </span>
                      <span className="text-xs text-slate-500">{c.hospitalName}</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{c.doctorName}</p>
                    <p className="text-xs text-slate-700 mt-1 font-medium">Notes: {c.notes}</p>
                    <p className="text-xs text-slate-600 mt-1">Observations: {c.observations}</p>
                    {c.followUpDate && (
                      <p className="text-xs font-semibold text-blue-600 mt-2">
                        Next Follow-Up: {c.followUpDate}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
