"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Stethoscope, Plus, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";

export default function PatientAppointmentsPage() {
  const {
    appointments,
    hospitals,
    doctors,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    notifications,
  } = useDataContext();

  const [showBookModal, setShowBookModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Booking Form State
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || "h1");
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "d1");
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookingTime, setBookingTime] = useState("10:30 AM");

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);
  const availableDoctorsForHosp = doctors.filter((d) => d.hospitalId === selectedHospitalId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    const res = bookAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      hospitalId: selectedHospitalId,
      hospitalName: selectedHospital?.name || "City Diabetes Centre",
      department: selectedDoctor.specialty,
      date: bookingDate,
      time: bookingTime,
    });

    if (!res.success) {
      setFormError(res.message);
      return;
    }

    setFormError(null);
    setShowBookModal(false);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const grouped = {
    upcoming: appointments.filter((a) => a.status === "upcoming" || a.status === "waiting" || a.status === "in-consultation"),
    completed: appointments.filter((a) => a.status === "completed"),
    cancelled: appointments.filter((a) => a.status === "cancelled"),
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="patient"
      title="My Appointments & OPD Slots"
      subtitle="Appointment Management"
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
          <h2 className="text-xl font-bold text-slate-900">My Appointments</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Book, reschedule, or cancel OPD appointments across connected network clinics
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowBookModal(true)}>
          Book OPD Slot
        </Button>
      </div>

      {/* Grouped Appointments */}
      {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
        <div key={tab} className="mb-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Appointments
            <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {grouped[tab].length}
            </span>
          </h3>

          <div className="space-y-3">
            {grouped[tab].length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border border-slate-200">
                No {tab} appointments.
              </p>
            ) : (
              grouped[tab].map((apt) => (
                <Card key={apt.id} hover>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Stethoscope size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{apt.doctorName}</p>
                          <p className="text-xs text-slate-500">
                            {apt.specialty} · {apt.hospitalName}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar size={13} className="text-blue-600" />
                              {apt.date}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Clock size={13} className="text-blue-600" />
                              {apt.time}
                            </span>
                            <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                              Token #{apt.token}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          variant={
                            apt.status === "completed"
                              ? "green"
                              : apt.status === "cancelled"
                              ? "red"
                              : apt.status === "in-consultation"
                              ? "blue"
                              : "amber"
                          }
                          dot
                        >
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>

                        {(apt.status === "upcoming" || apt.status === "waiting") && (
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              size="xs"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => cancelAppointment(apt.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ))}

      {/* BOOK APPOINTMENT MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} />
                <h3 className="text-base font-bold text-slate-900">Book OPD Appointment Slot</h3>
              </div>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">1. Select Hospital</label>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.area} ({h.availableSlots} slots available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">2. Select Specialist Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableDoctorsForHosp.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty}) — OPD Room: {d.opdRoom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">3. Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">4. Select Available Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-900 text-[11px]">
                <p className="font-bold">Booking Details Summary:</p>
                <p className="mt-0.5">Doctor: {selectedDoctor?.name || "Dr. Ayesha Khan"} ({selectedDoctor?.specialty})</p>
                <p>Clinic: {selectedHospital?.name}</p>
                <p className="font-semibold text-blue-700 mt-1">Automatic Token Number will be generated on confirmation.</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setShowBookModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" icon={<Plus size={15} />}>
                  Confirm & Reserve Slot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
