"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Clock, Plus, CheckCircle2, Stethoscope, Power, Edit2, Save } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";

export default function OpdManagementPage() {
  const { opdDepartments, updateOpdDepartment, notifications, role } = useDataContext();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editHours, setEditHours] = useState("");
  const [editSlotDuration, setEditSlotDuration] = useState(15);
  const [editMaxPatients, setEditMaxPatients] = useState(1);

  const toggleOpdStatus = (id: string, currentIsOpen: boolean) => {
    updateOpdDepartment(id, { isOpen: !currentIsOpen });
    setToastMessage(`OPD department status updated to ${!currentIsOpen ? "Open" : "Closed"}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartEdit = (dept: (typeof opdDepartments)[0]) => {
    setEditingDeptId(dept.id);
    setEditHours(dept.workingHours);
    setEditSlotDuration(dept.slotDurationMinutes);
    setEditMaxPatients(dept.maxPatientsPerSlot);
  };

  const handleSaveEdit = (id: string) => {
    updateOpdDepartment(id, {
      workingHours: editHours,
      slotDurationMinutes: editSlotDuration,
      maxPatientsPerSlot: editMaxPatients,
    });
    setEditingDeptId(null);
    setToastMessage("OPD Working hours & Slot capacity saved.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role={role === "admin" ? "admin" : "hospital"}
      title="OPD Management & Slot Configuration"
      subtitle="Outpatient Clinic Operations & Department Schedules"
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
          <h2 className="text-xl font-bold text-slate-900">Outpatient Department (OPD) Configuration</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure working hours, slot durations, maximum capacity per slot, and toggle department availability
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {opdDepartments.map((dept) => {
          const isEditing = editingDeptId === dept.id;

          return (
            <Card key={dept.id}>
              <CardHeader className="flex-row items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{dept.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Stethoscope size={12} /> Assigned Specialist: <strong>{dept.doctorName}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={dept.isOpen ? "green" : "red"} dot>
                    {dept.isOpen ? "OPD Open" : "OPD Closed"}
                  </Badge>

                  <Button
                    size="xs"
                    variant={dept.isOpen ? "outline" : "primary"}
                    icon={<Power size={13} />}
                    onClick={() => toggleOpdStatus(dept.id, dept.isOpen)}
                  >
                    {dept.isOpen ? "Close OPD" : "Open OPD"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Working Hours
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editHours}
                        onChange={(e) => setEditHours(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                      />
                    ) : (
                      <span className="font-bold text-slate-900 text-sm">{dept.workingHours}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Slot Duration (Minutes)
                    </span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editSlotDuration}
                        onChange={(e) => setEditSlotDuration(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                      />
                    ) : (
                      <span className="font-bold text-blue-700 text-sm">{dept.slotDurationMinutes} min per patient</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Max Patients / Slot
                    </span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editMaxPatients}
                        onChange={(e) => setEditMaxPatients(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                      />
                    ) : (
                      <span className="font-bold text-slate-900 text-sm">{dept.maxPatientsPerSlot} patient</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Configured Appointment Slots:</p>
                  <div className="flex flex-wrap gap-2">
                    {dept.slots.map((slot, i) => (
                      <span
                        key={i}
                        className="bg-white border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium shadow-2xs"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  {!isEditing ? (
                    <Button size="xs" variant="outline" icon={<Edit2 size={13} />} onClick={() => handleStartEdit(dept)}>
                      Configure Schedule & Capacity
                    </Button>
                  ) : (
                    <Button size="xs" icon={<Save size={13} />} onClick={() => handleSaveEdit(dept.id)}>
                      Save Configuration
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
