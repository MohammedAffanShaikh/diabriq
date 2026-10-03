"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Search, Filter, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import { BedStatus } from "@/lib/types";

export default function BedManagementPage() {
  const { beds, updateBedStatus, hospitals, notifications, role } = useDataContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const wards = Array.from(new Set(beds.map((b) => b.ward)));
  const types = Array.from(new Set(beds.map((b) => b.bedType)));

  const filteredBeds = beds.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.patientName && b.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesWard = selectedWard === "All" || b.ward === selectedWard;
    const matchesType = selectedType === "All" || b.bedType === selectedType;
    const matchesStatus = selectedStatus === "All" || b.status === selectedStatus;

    return matchesSearch && matchesWard && matchesType && matchesStatus;
  });

  // Calculate live dynamic counts from current beds state!
  const totalBedsCount = beds.length;
  const availableCount = beds.filter((b) => b.status === "available").length;
  const occupiedCount = beds.filter((b) => b.status === "occupied").length;
  const reservedCount = beds.filter((b) => b.status === "reserved").length;
  const maintenanceCount = beds.filter((b) => b.status === "maintenance").length;

  const handleStatusChange = (bedId: string, newStatus: BedStatus) => {
    updateBedStatus(bedId, newStatus);
    setToastMessage(`Bed ${bedId} status updated to '${newStatus}'. Counts recalculated instantly.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role={role === "admin" ? "admin" : "hospital"}
      title="Bed Availability & Resource Management"
      subtitle="Operational Bed Capacity Tracker"
      unreadNotifications={unreadNotifications}
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Bed Availability & Allocation</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage individual bed statuses across wards, update occupancy, and track real-time capacity statistics
        </p>
      </div>

      {/* DYNAMIC CALCULATED STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Beds</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalBedsCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Tracked in system</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Available ✓</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{availableCount}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Ready for admission</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">Occupied ●</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{occupiedCount}</p>
          <p className="text-[10px] text-blue-600 mt-0.5">Active patients</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">Reserved ⚑</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{reservedCount}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Incoming transfers</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-red-800 uppercase tracking-wider">Maintenance ⚠</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{maintenanceCount}</p>
          <p className="text-[10px] text-red-600 mt-0.5">Sanitization / Service</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-4 gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Bed ID or ward..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Wards</option>
              {wards.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Bed Types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="available">Available ✓</option>
              <option value="occupied">Occupied ●</option>
              <option value="reserved">Reserved ⚑</option>
              <option value="maintenance">Maintenance ⚠</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* BEDS TABLE */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bed size={18} className="text-blue-600" />
            Hospital Bed Inventory ({filteredBeds.length})
          </CardTitle>
          <span className="text-xs text-slate-500">Change status dropdown to trigger live count recalculation</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bed ID</th>
                <th>Hospital</th>
                <th>Ward & Floor</th>
                <th>Type</th>
                <th>Status</th>
                <th>Occupant Info</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                    No beds match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBeds.map((bed) => (
                  <tr key={bed.id} className="hover:bg-slate-50 transition-colors">
                    <td className="font-bold text-slate-900 text-xs">{bed.id}</td>
                    <td className="text-xs text-slate-700">{bed.hospitalName}</td>
                    <td className="text-xs text-slate-600">
                      {bed.ward} ({bed.floor})
                    </td>
                    <td>
                      <Badge variant="blue" dot={false} className="text-[10px]">
                        {bed.bedType}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          bed.status === "available"
                            ? "green"
                            : bed.status === "occupied"
                            ? "blue"
                            : bed.status === "reserved"
                            ? "amber"
                            : "red"
                        }
                        dot
                      >
                        {bed.status === "available"
                          ? "Available ✓"
                          : bed.status === "occupied"
                          ? "Occupied ●"
                          : bed.status === "reserved"
                          ? "Reserved ⚑"
                          : "Maintenance ⚠"}
                      </Badge>
                    </td>
                    <td className="text-xs text-slate-600">
                      {bed.patientName ? `${bed.patientName} (${bed.patientId})` : "—"}
                    </td>
                    <td>
                      <select
                        value={bed.status}
                        onChange={(e) => handleStatusChange(bed.id, e.target.value as BedStatus)}
                        className="text-xs font-semibold border border-slate-300 rounded px-2 py-1 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="available">Available ✓</option>
                        <option value="occupied">Occupied ●</option>
                        <option value="reserved">Reserved ⚑</option>
                        <option value="maintenance">Maintenance ⚠</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
