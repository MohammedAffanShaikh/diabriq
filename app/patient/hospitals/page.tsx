"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Hospital, MapPin, Bed, Activity, Clock, Stethoscope, Filter } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import Link from "next/link";

export default function HospitalDirectoryPage() {
  const { hospitals, notifications } = useDataContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bedsOnlyFilter, setBedsOnlyFilter] = useState(false);

  // Extract unique departments across hospitals
  const allDepts = Array.from(
    new Set(hospitals.flatMap((h) => h.departments || []))
  );

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDept === "All" || (h.departments && h.departments.includes(selectedDept));

    const matchesStatus = statusFilter === "All" || h.status === statusFilter;

    const totalAvailableBeds =
      h.bedsAvailable.general + h.bedsAvailable.icu + h.bedsAvailable.observation;
    const matchesBeds = !bedsOnlyFilter || totalAvailableBeds > 0;

    return matchesSearch && matchesDept && matchesStatus && matchesBeds;
  });

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="patient"
      title="Hospital Directory"
      subtitle="Connected Network Facilities & Capacity"
      unreadNotifications={unreadNotifications}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Hospital Directory</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Search connected diabetes centres, check real-time OPD availability and bed capacity
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital name or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Departments</option>
              {allDepts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* OPD Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All OPD Statuses</option>
              <option value="operational">Operational</option>
              <option value="high-load">High Load</option>
              <option value="critical">Critical</option>
            </select>

            {/* Beds Filter Checkbox */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={bedsOnlyFilter}
                onChange={(e) => setBedsOnlyFilter(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Beds Available Only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Cards List */}
      <div className="grid md:grid-cols-2 gap-5">
        {filteredHospitals.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 italic">
            No hospitals match your search criteria.
          </div>
        ) : (
          filteredHospitals.map((h) => {
            const availBedsTotal =
              h.bedsAvailable.general + h.bedsAvailable.icu + h.bedsAvailable.observation;

            return (
              <Card key={h.id} hover className="flex flex-col justify-between">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Hospital size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{h.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} />
                          {h.area}, {h.city}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        h.status === "operational"
                          ? "green"
                          : h.status === "high-load"
                          ? "amber"
                          : "red"
                      }
                      dot
                    >
                      {h.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 text-center my-4 border border-slate-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{h.opdCapacityPercent}%</p>
                      <p className="text-[10px] text-slate-500">OPD Load</p>
                    </div>
                    <div>
                      <p className="font-bold text-blue-600">{h.availableSlots} Slots</p>
                      <p className="text-[10px] text-slate-500">Available Today</p>
                    </div>
                    <div>
                      <p className="font-bold text-emerald-600">{availBedsTotal} Beds</p>
                      <p className="text-[10px] text-slate-500">Beds Available</p>
                    </div>
                  </div>

                  {h.departments && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {h.departments.map((dept) => (
                        <span
                          key={dept}
                          className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-medium"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      Avg wait: {h.avgWaitMinutes} min
                    </span>
                    <Link href="/patient/appointments">
                      <Button size="xs">Book OPD Slot</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
