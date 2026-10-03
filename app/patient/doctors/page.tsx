"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Stethoscope, Calendar, Clock, Hospital, Award } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import Link from "next/link";

export default function DoctorDirectoryPage() {
  const { doctors, hospitals, notifications } = useDataContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedHospital, setSelectedHospital] = useState("All");

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === "All" || d.specialty === selectedSpecialty;
    const matchesHospital = selectedHospital === "All" || d.hospitalId === selectedHospital;

    return matchesSearch && matchesSpecialty && matchesHospital;
  });

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="patient"
      title="Doctor Directory"
      subtitle="Diabetes Specialists & Endocrinologists"
      unreadNotifications={unreadNotifications}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Specialist Doctor Directory</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Find experienced endocrinologists, diabetologists, and internal medicine doctors across the network
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Specialties</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Hospital Filter */}
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Hospitals</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Cards Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 italic">
            No doctors match your search query.
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <Card key={doc.id} hover className="flex flex-col justify-between">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                      {doc.name.replace("Dr. ", "").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                      <p className="text-xs font-semibold text-blue-600">{doc.specialty}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Hospital size={12} />
                        {doc.hospitalName} ({doc.opdRoom})
                      </p>
                    </div>
                  </div>
                  <Badge variant={doc.available ? "green" : "amber"} dot>
                    {doc.available ? "Available Today" : "Off Duty"}
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs my-4">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <Award size={13} /> Experience:
                    </span>
                    <span className="font-bold text-slate-900">{doc.experienceYears} Years</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <Calendar size={13} /> OPD Days:
                    </span>
                    <span className="font-medium text-slate-800">{doc.availableDays.join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <Clock size={13} /> Hours:
                    </span>
                    <span className="font-medium text-slate-800">{doc.availableHours}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Qualifications:</span>
                    <span className="font-semibold text-slate-700">{doc.qualifications}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Avg OPD wait: {doc.avgWaitMinutes} min
                  </span>
                  <Link href="/patient/appointments">
                    <Button size="xs">Book Appointment</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
