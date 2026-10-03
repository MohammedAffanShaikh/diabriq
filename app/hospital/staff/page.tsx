"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, Filter, Trash2, Edit2, CheckCircle2, UserCheck, Shield } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import { StaffRole, StaffShift, StaffAvailability } from "@/lib/types";

export default function StaffManagementPage() {
  const { staff, addStaffMember, updateStaffMember, deleteStaffMember, notifications, role } = useDataContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [availFilter, setAvailFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "Nurse" as StaffRole,
    department: "OPD Nursing",
    contact: "+91 98200 ",
    email: "",
    shift: "Morning" as StaffShift,
    availability: "On Duty" as StaffAvailability,
    status: "Active" as "Active" | "Inactive",
    hospitalId: "h1",
    hospitalName: "City Diabetes Centre",
  });

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "All" || s.role === roleFilter;
    const matchesShift = shiftFilter === "All" || s.shift === shiftFilter;
    const matchesAvail = availFilter === "All" || s.availability === availFilter;

    return matchesSearch && matchesRole && matchesShift && matchesAvail;
  });

  // Calculate live HRM dashboard stats!
  const totalStaffCount = staff.length;
  const onDutyCount = staff.filter((s) => s.availability === "On Duty" && s.status === "Active").length;
  const availableCount = staff.filter((s) => s.availability === "Available" && s.status === "Active").length;
  const onLeaveCount = staff.filter((s) => s.availability === "On Leave" || s.status === "Inactive").length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;

    addStaffMember({
      ...formData,
      email: formData.email || `${formData.name.toLowerCase().replace(/ /g, ".")}@citydiabetes.org`,
    });

    setShowAddModal(false);
    setFormData({
      name: "",
      role: "Nurse",
      department: "OPD Nursing",
      contact: "+91 98200 ",
      email: "",
      shift: "Morning",
      availability: "On Duty",
      status: "Active",
      hospitalId: "h1",
      hospitalName: "City Diabetes Centre",
    });

    setToastMessage("New staff member added and saved.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role={role === "admin" ? "admin" : "hospital"}
      title="Healthcare Resource & Staff Management (HRM)"
      subtitle="Staff Roster, Shift Allocation & Duty Roster"
      unreadNotifications={unreadNotifications}
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hospital Staff Management (HRM)</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage clinical & administrative personnel, assign shifts, and update availability status
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
          Add Staff Member
        </Button>
      </div>

      {/* DYNAMIC HRM DASHBOARD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Staff</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalStaffCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active personnel</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">On Duty</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{onDutyCount}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Currently active on shift</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">Available</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{availableCount}</p>
          <p className="text-[10px] text-blue-600 mt-0.5">Off-duty / Standby</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">On Leave / Inactive</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{onLeaveCount}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Scheduled leave</p>
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
                placeholder="Search staff name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Technician">Technician</option>
              <option value="Administrator">Administrator</option>
            </select>

            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>

            <select
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Availabilities</option>
              <option value="On Duty">On Duty</option>
              <option value="Available">Available</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* STAFF TABLE */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            Staff Roster ({filteredStaff.length})
          </CardTitle>
          <span className="text-xs text-slate-500">Edit shift or availability directly</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff ID & Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Availability</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                    No staff records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <p className="font-bold text-slate-900 text-xs">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.id}</p>
                    </td>
                    <td>
                      <Badge variant="blue" dot={false} className="text-[10px]">
                        {s.role}
                      </Badge>
                    </td>
                    <td className="text-xs text-slate-700">{s.department}</td>
                    <td>
                      <select
                        value={s.shift}
                        onChange={(e) =>
                          updateStaffMember(s.id, { shift: e.target.value as StaffShift })
                        }
                        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={s.availability}
                        onChange={(e) =>
                          updateStaffMember(s.id, { availability: e.target.value as StaffAvailability })
                        }
                        className={`text-xs font-semibold border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          s.availability === "On Duty"
                            ? "text-emerald-700 border-emerald-300"
                            : s.availability === "Available"
                            ? "text-blue-700 border-blue-300"
                            : "text-amber-700 border-amber-300"
                        }`}
                      >
                        <option value="On Duty">On Duty</option>
                        <option value="Available">Available</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </td>
                    <td className="text-xs text-slate-600">
                      <p>{s.contact}</p>
                      <p className="text-[10px] text-slate-400">{s.email}</p>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteStaffMember(s.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete staff record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold text-slate-900">Add Staff Member</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nurse Sunita Rane"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Technician">Technician</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as StaffShift })}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duty Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as StaffAvailability })}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="On Duty">On Duty</option>
                    <option value="Available">Available</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" icon={<Plus size={15} />}>
                  Save Staff Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
