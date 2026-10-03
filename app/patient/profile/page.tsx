"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Edit2,
  Save,
  X,
  Activity,
  Heart,
  Scale,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import { DiabetesType } from "@/lib/types";

export default function PatientProfilePage() {
  const { patientProfile, updatePatientProfile, notifications } = useDataContext();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: patientProfile.name,
    age: patientProfile.age,
    gender: patientProfile.gender,
    diabetesType: patientProfile.diabetesType,
    diagnosisYear: patientProfile.diagnosisYear,
    heightCm: patientProfile.heightCm,
    weightKg: patientProfile.weightKg,
    bloodPressure: patientProfile.bloodPressure,
    hba1c: patientProfile.hba1c,
    medicationInfo: patientProfile.medicationInfo,
    language: patientProfile.language,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" || name === "diagnosisYear" || name === "heightCm" || name === "weightKg" || name === "hba1c"
        ? Number(value)
        : value,
    }));
  };

  const calculatedBmi = (
    formData.weightKg / Math.pow(formData.heightCm / 100, 2)
  ).toFixed(1);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile({
      ...formData,
      diabetesType: formData.diabetesType as DiabetesType,
    });
    setIsEditing(false);
    setToastMessage("Diabetes profile updated and saved to local storage.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancel = () => {
    setFormData({
      name: patientProfile.name,
      age: patientProfile.age,
      gender: patientProfile.gender,
      diabetesType: patientProfile.diabetesType,
      diagnosisYear: patientProfile.diagnosisYear,
      heightCm: patientProfile.heightCm,
      weightKg: patientProfile.weightKg,
      bloodPressure: patientProfile.bloodPressure,
      hba1c: patientProfile.hba1c,
      medicationInfo: patientProfile.medicationInfo,
      language: patientProfile.language,
    });
    setIsEditing(false);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="patient"
      title="Diabetes Profile"
      subtitle={`Patient Records — ${patientProfile.id}`}
      unreadNotifications={unreadNotifications}
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Non-Diagnostic Safety Warning */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-xs text-blue-900">
        <ShieldAlert size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Healthcare Information Notice</p>
          <p className="text-blue-700 mt-0.5 leading-relaxed">
            This profile contains self-reported and clinical tracking records for diabetes management coordination. This software does not provide autonomous treatment or dosage recommendations.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card Header / Avatar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-md mb-4">
                {patientProfile.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{patientProfile.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">ID: {patientProfile.id}</p>
              <Badge variant="blue" className="mt-2 text-xs">
                {patientProfile.diabetesType} Diabetes
              </Badge>

              <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Age & Gender:</span>
                  <span>{patientProfile.age} yrs · {patientProfile.gender}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Diagnosis Year:</span>
                  <span>{patientProfile.diagnosisYear}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Preferred Language:</span>
                  <span>{patientProfile.language}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Last Consultation:</span>
                  <span className="font-semibold text-slate-900">{patientProfile.lastConsultation || "N/A"}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Next Follow-Up:</span>
                  <span className="font-semibold text-blue-700">{patientProfile.nextFollowUp || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Caregiver Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Caregiver Authorization</CardTitle>
            </CardHeader>
            <CardContent>
              {patientProfile.caregiverAccess ? (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p className="font-semibold text-slate-900">{patientProfile.caregiverAccess.name}</p>
                  <p className="text-slate-500">Relationship: {patientProfile.caregiverAccess.relationship}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {patientProfile.caregiverAccess.permissions.map((p) => (
                      <span key={p} className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No caregiver authorized.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Editable Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Medical & Clinical Parameters</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Update your physical measurements and diabetes metrics</p>
              </div>
              {!isEditing ? (
                <Button size="sm" icon={<Edit2 size={14} />} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" icon={<X size={14} />} onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" icon={<Save size={14} />} onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      disabled={!isEditing}
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
                    <select
                      name="gender"
                      disabled={!isEditing}
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Diabetes Classification</label>
                    <select
                      name="diabetesType"
                      disabled={!isEditing}
                      value={formData.diabetesType}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Type 1">Type 1</option>
                      <option value="Type 2">Type 2</option>
                      <option value="Gestational">Gestational</option>
                      <option value="Pre-diabetes">Pre-diabetes</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Diagnosis Year</label>
                    <input
                      type="number"
                      name="diagnosisYear"
                      disabled={!isEditing}
                      value={formData.diagnosisYear}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Language</label>
                    <select
                      name="language"
                      disabled={!isEditing}
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Urdu">Urdu</option>
                    </select>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Measurements */}
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">Vitals & Measurements</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="heightCm"
                      disabled={!isEditing}
                      value={formData.heightCm}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weightKg"
                      disabled={!isEditing}
                      value={formData.weightKg}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Calculated BMI</label>
                    <input
                      type="text"
                      disabled
                      value={`${calculatedBmi} kg/m²`}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-100 font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Pressure (mmHg)</label>
                    <input
                      type="text"
                      name="bloodPressure"
                      disabled={!isEditing}
                      value={formData.bloodPressure}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">HbA1c Level (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="hba1c"
                      disabled={!isEditing}
                      value={formData.hba1c}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-amber-700"
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Medications */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Current Prescribed Medications</label>
                  <textarea
                    name="medicationInfo"
                    rows={3}
                    disabled={!isEditing}
                    value={formData.medicationInfo}
                    onChange={handleChange}
                    className="w-full text-sm border border-slate-200 rounded-lg p-3 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" icon={<Save size={16} />}>
                      Save Profile & Persist
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
