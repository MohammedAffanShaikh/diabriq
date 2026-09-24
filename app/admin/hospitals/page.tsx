"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { hospitals } from "@/lib/mockData";
import { MapPin, Bed, Activity, Stethoscope } from "lucide-react";

export default function AdminHospitals() {
  return (
    <DashboardLayout role="admin" title="Hospitals" unreadNotifications={4}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Connected Hospitals</h2>
        <p className="text-sm text-slate-500 mt-0.5">All facilities in the Diabriq network</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {hospitals.map((h) => (
          <Card key={h.id} hover>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{h.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} />
                    {h.area}, {h.city}
                  </p>
                </div>
                <Badge
                  variant={h.status === "operational" ? "green" : h.status === "high-load" ? "amber" : "red"}
                  dot
                >
                  {h.status === "operational" ? "Operational" : "High Load"}
                </Badge>
              </div>

              <ProgressBar
                value={h.opdCapacityPercent}
                label="OPD Capacity"
                showPercent
                colorByValue
                className="mb-4"
              />

              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Activity size={13} />, label: "Appointments", value: h.appointmentsToday },
                  { icon: <Stethoscope size={13} />, label: "Doctors", value: `${h.doctorsAvailable}/${h.doctorsTotal}` },
                  { icon: <Bed size={13} />, label: "Beds (Gen/ICU/Obs)", value: `${h.bedsAvailable.general}/${h.bedsAvailable.icu}/${h.bedsAvailable.observation}` },
                  { icon: null, label: "Avg Wait", value: `${h.avgWaitMinutes} min` },
                ].map((m, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                      {m.icon}
                      <span className="text-[10px]">{m.label}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{m.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
