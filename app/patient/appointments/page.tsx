"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Stethoscope, ChevronRight, Plus } from "lucide-react";
import { appointments } from "@/lib/mockData";

export default function PatientAppointments() {
  const grouped = {
    upcoming: appointments.filter((a) => a.patientId === "DIA-204829" && (a.status === "upcoming" || a.status === "waiting")),
    completed: appointments.filter((a) => a.patientId === "DIA-204829" && a.status === "completed"),
    cancelled: appointments.filter((a) => a.patientId === "DIA-204829" && a.status === "cancelled"),
  };

  const statusVariant = (s: string) => {
    if (s === "completed") return "green" as const;
    if (s === "cancelled") return "red" as const;
    if (s === "waiting") return "amber" as const;
    return "blue" as const;
  };

  return (
    <DashboardLayout role="patient" title="My Appointments" unreadNotifications={3}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Appointments</h2>
          <p className="text-sm text-slate-500 mt-0.5">All appointments across connected hospitals</p>
        </div>
        <Button icon={<Plus size={16} />}>Book Appointment</Button>
      </div>

      {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
        <div key={tab} className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {grouped[tab].length}
            </span>
          </h3>
          <div className="space-y-3">
            {grouped[tab].length === 0 && (
              <p className="text-sm text-slate-400 italic">No {tab} appointments.</p>
            )}
            {grouped[tab].map((apt) => (
              <Card key={apt.id} hover>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Stethoscope size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{apt.doctorName}</p>
                        <p className="text-xs text-slate-500">{apt.specialty} · {apt.hospitalName}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar size={12} />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} />
                            {apt.time}
                          </span>
                          <span className="text-xs text-slate-500">Token #{apt.token}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant={statusVariant(apt.status)} dot>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                      {(apt.status === "upcoming" || apt.status === "waiting") && (
                        <div className="flex gap-1.5">
                          <Button size="xs" variant="outline">Reschedule</Button>
                          <Button size="xs" variant="ghost" className="text-red-500 hover:bg-red-50">Cancel</Button>
                        </div>
                      )}
                      {apt.status === "completed" && (
                        <Button size="xs" variant="ghost">View details</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}
