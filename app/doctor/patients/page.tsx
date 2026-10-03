"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, User, Droplet, Eye, Stethoscope } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import Link from "next/link";

export default function DoctorPatientsPage() {
  const { patientProfile, notifications } = useDataContext();
  const [searchTerm, setSearchTerm] = useState("");

  // List of patients (using current profile + mock patients)
  const patientList = [
    patientProfile,
    {
      id: "DIA-205134",
      name: "Fatima Shaikh",
      age: 38,
      gender: "Female" as const,
      phone: "+91 91234 56789",
      diabetesType: "Type 2" as const,
      diagnosisYear: 2021,
      heightCm: 162,
      weightKg: 68,
      bmi: 25.9,
      bloodPressure: "128/84",
      hba1c: 7.6,
      medicationInfo: "Metformin 850mg BD",
      connectedHospitals: ["h1"],
      assignedDoctors: ["d1"],
      totalVisits: 4,
      documents: 7,
      language: "Urdu" as const,
    },
    {
      id: "DIA-205890",
      name: "Amit Patil",
      age: 54,
      gender: "Male" as const,
      phone: "+91 99887 76655",
      diabetesType: "Type 1" as const,
      diagnosisYear: 2015,
      heightCm: 175,
      weightKg: 72,
      bmi: 23.5,
      bloodPressure: "120/80",
      hba1c: 6.9,
      medicationInfo: "Insulin Glargine 14u bedtime, Insulin Lispro 6u before meals",
      connectedHospitals: ["h1"],
      assignedDoctors: ["d1"],
      totalVisits: 12,
      documents: 18,
      language: "Marathi" as const,
    },
  ];

  const filteredPatients = patientList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diabetesType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="doctor"
      title="Assigned Patients"
      subtitle="Doctor Patient Directory"
      unreadNotifications={unreadNotifications}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Assigned Patient Roster</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          View patient diabetes classifications, glycemia history, and consultation history
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, ID, or diabetes type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((p) => (
          <Card key={p.id} hover>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.id} · {p.age} yrs · {p.gender}</p>
                  </div>
                </div>
                <Badge variant="blue" className="text-[10px]">
                  {p.diabetesType}
                </Badge>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 grid grid-cols-2 gap-2 text-xs my-3">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">HbA1c</span>
                  <span className="font-bold text-amber-700">{p.hba1c}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">BP</span>
                  <span className="font-semibold text-slate-900">{p.bloodPressure}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">BMI</span>
                  <span className="font-semibold text-slate-900">{p.bmi} kg/m²</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Visits</span>
                  <span className="font-semibold text-slate-900">{p.totalVisits}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 truncate mb-4">
                <strong>Meds:</strong> {p.medicationInfo}
              </p>

              <Link href="/doctor">
                <Button size="xs" className="w-full" icon={<Eye size={13} />}>
                  Open Diabetes Summary & Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
