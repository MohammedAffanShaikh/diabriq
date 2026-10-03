"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Droplet,
  Stethoscope,
  Calendar,
  UserCheck,
  FileText,
  Clock,
} from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";

export default function DiabetesTimelinePage() {
  const { timelineEvents, notifications } = useDataContext();

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const getEventIcon = (type: string) => {
    switch (type) {
      case "glucose_reading":
        return <Droplet size={16} className="text-red-500" />;
      case "hba1c_update":
        return <FileText size={16} className="text-amber-500" />;
      case "appointment_booked":
        return <Calendar size={16} className="text-blue-500" />;
      case "consultation":
        return <Stethoscope size={16} className="text-emerald-600" />;
      case "profile_updated":
        return <UserCheck size={16} className="text-indigo-500" />;
      default:
        return <History size={16} className="text-slate-500" />;
    }
  };

  return (
    <DashboardLayout
      role="patient"
      title="Diabetes Care Timeline"
      subtitle="Chronological Medical & Care Journey"
      unreadNotifications={unreadNotifications}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Diabetes Care Timeline</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Unified chronological timeline combining glucose logs, HbA1c tests, appointments, and doctor consultations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History size={18} className="text-blue-600" />
            Care Journey Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timelineEvents.length === 0 ? (
            <p className="text-slate-400 italic text-center py-12">No timeline events recorded yet.</p>
          ) : (
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-8 my-2">
              {timelineEvents.map((event) => (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center shadow-sm transition-colors">
                    {getEventIcon(event.type)}
                  </div>

                  {/* Content Box */}
                  <div className="bg-slate-50 hover:bg-slate-100/80 rounded-xl p-4 border border-slate-200 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {event.date}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">{event.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
