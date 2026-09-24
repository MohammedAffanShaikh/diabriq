"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, FileText, Activity, Calendar } from "lucide-react";
import { visitHistory, recordAccess } from "@/lib/mockData";

export default function PatientRecords() {
  return (
    <DashboardLayout role="patient" title="Connected Health Record" unreadNotifications={3}>
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Connected Health Record</h2>
            <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">
              Administrative continuity timeline — authorized doctors across connected facilities can access relevant previous records, reducing repeated paperwork.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0">
            <Lock size={12} />
            Consent-based Authorized Access
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visit History Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Group by year */}
              {[2026, 2025].map((year) => {
                const yearVisits = visitHistory.filter((v) => v.year === year);
                return (
                  <div key={year} className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-bold text-slate-700">{year}</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <div className="space-y-0">
                      {yearVisits.map((visit, i) => (
                        <div key={i} className="timeline-item">
                          <div className="timeline-dot border-blue-300">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                          <div className="ml-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-900">
                                {visit.hospitalName}
                              </span>
                              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {visit.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="blue" dot={false} className="text-[10px]">
                                {visit.type}
                              </Badge>
                              {visit.doctorName && (
                                <span className="text-xs text-slate-500">{visit.doctorName}</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Records from {visit.hospitalName} accessible to authorized providers across the network.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={15} />
                Record Access History
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Every access to your records is logged for your review.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {recordAccess.map((access, i) => (
                <div key={i} className="px-5 py-3.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-start gap-2">
                    <Lock size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{access.by}</p>
                      <p className="text-[10px] text-slate-500">{access.role} · {access.facility}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{access.timestamp}</p>
                    </div>
                    <Badge variant="green" dot className="ml-auto text-[9px]">Authorized</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-slate-900">12</p>
                  <p className="text-xs text-slate-500">Documents</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-slate-900">7</p>
                  <p className="text-xs text-slate-500">Visits</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-slate-900">3</p>
                  <p className="text-xs text-slate-500">Facilities</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-slate-900">2</p>
                  <p className="text-xs text-slate-500">Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
