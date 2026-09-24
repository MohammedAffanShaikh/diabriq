"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hospitals } from "@/lib/mockData";
import { MapPin, Clock, Calendar, Bed, Stethoscope } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";

export default function PatientHospitals() {
  return (
    <DashboardLayout role="patient" title="Hospital Network" unreadNotifications={3}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Connected Hospitals</h2>
        <p className="text-sm text-slate-500 mt-0.5">Facilities in the Diabriq network near you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
                  {h.status === "operational" ? "OPD Available" : "High Load"}
                </Badge>
              </div>

              <ProgressBar
                value={h.opdCapacityPercent}
                label="OPD Capacity"
                showPercent
                colorByValue
                className="mb-3"
              />

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-sm font-bold text-slate-900">{h.availableSlots}</p>
                  <p className="text-[10px] text-slate-500">Slots</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-sm font-bold text-slate-900">
                    {h.bedsAvailable.general + h.bedsAvailable.icu + h.bedsAvailable.observation}
                  </p>
                  <p className="text-[10px] text-slate-500">Beds</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-sm font-bold text-slate-900">{h.doctorsAvailable}</p>
                  <p className="text-[10px] text-slate-500">Doctors</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-sm font-bold text-slate-900">{h.avgWaitMinutes}m</p>
                  <p className="text-[10px] text-slate-500">Wait</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
