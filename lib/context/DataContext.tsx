"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  PatientProfile,
  GlucoseReading,
  GlucoseTimeInRangeStats,
  TimelineEvent,
  Appointment,
  AppointmentStatus,
  QueueEntry,
  HospitalBed,
  StaffMember,
  ConsultationRecord,
  OpdDepartment,
  Notification,
  AuditEvent,
  ResearchMetrics,
  Doctor,
  Hospital,
} from "@/lib/types";

import {
  defaultPatientProfile,
  defaultGlucoseReadings,
  defaultTimelineEvents,
  defaultHospitals,
  defaultDoctors,
  defaultAppointments,
  defaultLiveQueue,
  defaultConsultations,
  defaultBeds,
  defaultStaffMembers,
  defaultOpdDepartments,
  defaultNotifications,
  defaultAuditEvents,
} from "@/lib/mockData";

interface DataContextType {
  // Role
  role: UserRole;
  setRole: (role: UserRole) => void;

  // Patient Profile
  patientProfile: PatientProfile;
  updatePatientProfile: (updated: Partial<PatientProfile>) => void;

  // Glucose
  glucoseReadings: GlucoseReading[];
  addGlucoseReading: (reading: Omit<GlucoseReading, "id" | "patientId" | "createdAt">) => void;
  deleteGlucoseReading: (id: string) => void;
  glucoseStats: GlucoseTimeInRangeStats;

  // Timeline
  timelineEvents: TimelineEvent[];

  // Appointments
  appointments: Appointment[];
  bookAppointment: (data: {
    doctorId: string;
    doctorName: string;
    specialty: string;
    hospitalId: string;
    hospitalName: string;
    department: string;
    date: string;
    time: string;
  }) => { success: boolean; message: string; appointment?: Appointment };
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  // Queue & OPD
  queue: QueueEntry[];
  currentToken: number;
  callNextPatient: () => void;
  startConsultation: () => void;
  completeConsultation: (data: {
    notes: string;
    observations: string;
    followUpDate?: string;
  }) => void;
  skipPatient: () => void;

  // Consultations History
  consultations: ConsultationRecord[];

  // Hospital & Doctors Read/State
  hospitals: Hospital[];
  doctors: Doctor[];

  // Beds Management
  beds: HospitalBed[];
  updateBedStatus: (bedId: string, status: HospitalBed["status"]) => void;

  // HRM / Staff Management
  staff: StaffMember[];
  addStaffMember: (staff: Omit<StaffMember, "id">) => void;
  updateStaffMember: (id: string, data: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;

  // OPD Departments Admin
  opdDepartments: OpdDepartment[];
  updateOpdDepartment: (id: string, data: Partial<OpdDepartment>) => void;

  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: Notification["type"]) => void;

  // Audit Events
  auditEvents: AuditEvent[];

  // Research Metrics
  researchMetrics: ResearchMetrics;
  trackClick: () => void;
  resetAllDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: "diabriq_role",
  PATIENT_PROFILE: "diabriq_patient_profile",
  GLUCOSE_READINGS: "diabriq_glucose_readings",
  TIMELINE_EVENTS: "diabriq_timeline_events",
  APPOINTMENTS: "diabriq_appointments",
  QUEUE: "diabriq_queue",
  CURRENT_TOKEN: "diabriq_current_token",
  CONSULTATIONS: "diabriq_consultations",
  BEDS: "diabriq_beds",
  STAFF: "diabriq_staff",
  OPD_DEPTS: "diabriq_opd_depts",
  NOTIFICATIONS: "diabriq_notifications",
  AUDIT: "diabriq_audit",
  METRICS: "diabriq_metrics",
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- 1. ROLE ---
  const [role, setRoleState] = useState<UserRole>("patient");

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    }
  };

  // --- 2. PATIENT PROFILE ---
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(defaultPatientProfile);

  // --- 3. GLUCOSE READINGS ---
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>(defaultGlucoseReadings);

  // --- 4. TIMELINE EVENTS ---
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(defaultTimelineEvents);

  // --- 5. APPOINTMENTS ---
  const [appointments, setAppointments] = useState<Appointment[]>(defaultAppointments);

  // --- 6. QUEUE ---
  const [queue, setQueue] = useState<QueueEntry[]>(defaultLiveQueue);
  const [currentToken, setCurrentToken] = useState<number>(12);

  // --- 7. CONSULTATIONS ---
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(defaultConsultations);

  // --- 8. HOSPITALS & DOCTORS ---
  const [hospitals, setHospitals] = useState<Hospital[]>(defaultHospitals);
  const [doctors, setDoctors] = useState<Doctor[]>(defaultDoctors);

  // --- 9. BEDS ---
  const [beds, setBeds] = useState<HospitalBed[]>(defaultBeds);

  // --- 10. STAFF ---
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaffMembers);

  // --- 11. OPD DEPTS ---
  const [opdDepartments, setOpdDepartments] = useState<OpdDepartment[]>(defaultOpdDepartments);

  // --- 12. NOTIFICATIONS ---
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  // --- 13. AUDIT EVENTS ---
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(defaultAuditEvents);

  // --- 14. METRICS ---
  const [researchMetrics, setResearchMetrics] = useState<ResearchMetrics>({
    appointmentBookCount: 0,
    glucoseAddCount: 0,
    queueActionsCount: 0,
    consultationCount: 0,
    clicksCount: 0,
  });

  // --- LOAD FROM LOCAL STORAGE ON MOUNT ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole;
      if (savedRole && ["patient", "doctor", "hospital", "admin"].includes(savedRole)) {
        setRoleState(savedRole);
      }

      const savedProfile = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
      if (savedProfile) setPatientProfile(JSON.parse(savedProfile));

      const savedGlucose = localStorage.getItem(STORAGE_KEYS.GLUCOSE_READINGS);
      if (savedGlucose) setGlucoseReadings(JSON.parse(savedGlucose));

      const savedTimeline = localStorage.getItem(STORAGE_KEYS.TIMELINE_EVENTS);
      if (savedTimeline) setTimelineEvents(JSON.parse(savedTimeline));

      const savedApts = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (savedApts) setAppointments(JSON.parse(savedApts));

      const savedQueue = localStorage.getItem(STORAGE_KEYS.QUEUE);
      if (savedQueue) setQueue(JSON.parse(savedQueue));

      const savedToken = localStorage.getItem(STORAGE_KEYS.CURRENT_TOKEN);
      if (savedToken) setCurrentToken(Number(savedToken));

      const savedConsultations = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      if (savedConsultations) setConsultations(JSON.parse(savedConsultations));

      const savedBeds = localStorage.getItem(STORAGE_KEYS.BEDS);
      if (savedBeds) setBeds(JSON.parse(savedBeds));

      const savedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (savedStaff) setStaff(JSON.parse(savedStaff));

      const savedOpd = localStorage.getItem(STORAGE_KEYS.OPD_DEPTS);
      if (savedOpd) setOpdDepartments(JSON.parse(savedOpd));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (savedAudit) setAuditEvents(JSON.parse(savedAudit));

      const savedMetrics = localStorage.getItem(STORAGE_KEYS.METRICS);
      if (savedMetrics) setResearchMetrics(JSON.parse(savedMetrics));
    } catch (e) {
      console.error("Error loading data from LocalStorage:", e);
    }
  }, []);

  // --- SAVE HELPERS ---
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const trackClick = () => {
    setResearchMetrics((prev) => {
      const updated = { ...prev, clicksCount: prev.clicksCount + 1 };
      saveToStorage(STORAGE_KEYS.METRICS, updated);
      return updated;
    });
  };

  const addNotification = (title: string, message: string, type: Notification["type"] = "info") => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  };

  const addAuditEvent = (action: string, details?: string, status: AuditEvent["status"] = "completed") => {
    const newAudit: AuditEvent = {
      id: `au-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      user: role === "patient" ? patientProfile.name : role === "doctor" ? "Dr. Ayesha Khan" : "Hospital Admin",
      userRole: role,
      action,
      facility: "City Diabetes Centre",
      patientId: patientProfile.id,
      status,
      details,
    };
    setAuditEvents((prev) => {
      const updated = [newAudit, ...prev];
      saveToStorage(STORAGE_KEYS.AUDIT, updated);
      return updated;
    });
  };

  // --- PATIENT PROFILE ACTIONS ---
  const updatePatientProfile = (updatedData: Partial<PatientProfile>) => {
    setPatientProfile((prev) => {
      const height = updatedData.heightCm ?? prev.heightCm;
      const weight = updatedData.weightKg ?? prev.weightKg;
      const calcBmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));

      const updated = {
        ...prev,
        ...updatedData,
        bmi: calcBmi,
      };

      saveToStorage(STORAGE_KEYS.PATIENT_PROFILE, updated);
      addNotification("Profile Updated", "Your diabetes profile details were saved successfully.", "success");
      addAuditEvent("Updated Diabetes Profile details", `BMI re-calculated to ${calcBmi}`);

      // Timeline event
      const timelineItem: TimelineEvent = {
        id: `tl-${Date.now()}`,
        patientId: prev.id,
        date: "Today",
        timestamp: new Date().toISOString(),
        title: "Diabetes Profile Updated",
        description: `HbA1c: ${updated.hba1c}%, BP: ${updated.bloodPressure}, Weight: ${updated.weightKg}kg (BMI: ${calcBmi})`,
        type: "profile_updated",
      };
      setTimelineEvents((tPrev) => {
        const tUpdated = [timelineItem, ...tPrev];
        saveToStorage(STORAGE_KEYS.TIMELINE_EVENTS, tUpdated);
        return tUpdated;
      });

      return updated;
    });
  };

  // --- GLUCOSE READINGS ACTIONS ---
  const addGlucoseReading = (readingData: Omit<GlucoseReading, "id" | "patientId" | "createdAt">) => {
    const newReading: GlucoseReading = {
      id: `gl-${Date.now()}`,
      patientId: patientProfile.id,
      ...readingData,
      createdAt: new Date().toISOString(),
    };

    setGlucoseReadings((prev) => {
      const updated = [newReading, ...prev];
      saveToStorage(STORAGE_KEYS.GLUCOSE_READINGS, updated);
      return updated;
    });

    // Update patient profile's last reading summary
    addNotification(
      "Glucose Reading Saved",
      `${readingData.readingType} reading of ${readingData.value} mg/dL logged.`,
      "success"
    );
    addAuditEvent(`Added Glucose Reading: ${readingData.value} mg/dL (${readingData.readingType})`);

    // Add Timeline event
    const timelineItem: TimelineEvent = {
      id: `tl-gl-${Date.now()}`,
      patientId: patientProfile.id,
      date: "Today",
      timestamp: new Date().toISOString(),
      title: "Glucose Reading Recorded",
      description: `${readingData.readingType}: ${readingData.value} mg/dL ${
        readingData.notes ? `(${readingData.notes})` : ""
      }`,
      type: "glucose_reading",
    };

    setTimelineEvents((prev) => {
      const updated = [timelineItem, ...prev];
      saveToStorage(STORAGE_KEYS.TIMELINE_EVENTS, updated);
      return updated;
    });

    setResearchMetrics((prev) => {
      const updated = { ...prev, glucoseAddCount: prev.glucoseAddCount + 1 };
      saveToStorage(STORAGE_KEYS.METRICS, updated);
      return updated;
    });
  };

  const deleteGlucoseReading = (id: string) => {
    setGlucoseReadings((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveToStorage(STORAGE_KEYS.GLUCOSE_READINGS, updated);
      return updated;
    });
    addNotification("Glucose Reading Removed", "Selected reading was deleted.", "info");
  };

  // Calculated Time-In-Range Stats
  const calculateGlucoseStats = (): GlucoseTimeInRangeStats => {
    if (glucoseReadings.length === 0) {
      return {
        inRangePercent: 0,
        aboveRangePercent: 0,
        belowRangePercent: 0,
        averageGlucose: 0,
        minGlucose: 0,
        maxGlucose: 0,
        readingCount: 0,
        fastingAvg: 0,
        postMealAvg: 0,
      };
    }

    const values = glucoseReadings.map((r) => r.value);
    const count = values.length;

    const inRange = values.filter((v) => v >= 70 && v <= 180).length;
    const aboveRange = values.filter((v) => v > 180).length;
    const belowRange = values.filter((v) => v < 70).length;

    const fastingVals = glucoseReadings.filter((r) => r.readingType === "Fasting").map((r) => r.value);
    const postMealVals = glucoseReadings.filter((r) => r.readingType === "After Meal").map((r) => r.value);

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / count);

    const fastingAvg = fastingVals.length > 0 ? Math.round(fastingVals.reduce((a, b) => a + b, 0) / fastingVals.length) : 0;
    const postMealAvg = postMealVals.length > 0 ? Math.round(postMealVals.reduce((a, b) => a + b, 0) / postMealVals.length) : 0;

    return {
      inRangePercent: Math.round((inRange / count) * 100),
      aboveRangePercent: Math.round((aboveRange / count) * 100),
      belowRangePercent: Math.round((belowRange / count) * 100),
      averageGlucose: avg,
      minGlucose: Math.min(...values),
      maxGlucose: Math.max(...values),
      readingCount: count,
      fastingAvg,
      postMealAvg,
    };
  };

  // --- APPOINTMENTS ACTIONS ---
  const bookAppointment = (data: {
    doctorId: string;
    doctorName: string;
    specialty: string;
    hospitalId: string;
    hospitalName: string;
    department: string;
    date: string;
    time: string;
  }) => {
    // Prevent duplicate booking for same doctor & date & time
    const existing = appointments.find(
      (a) =>
        a.patientId === patientProfile.id &&
        a.doctorId === data.doctorId &&
        a.date === data.date &&
        a.time === data.time &&
        a.status !== "cancelled"
    );

    if (existing) {
      return {
        success: false,
        message: "You already have an active appointment with this doctor at the selected date and slot.",
      };
    }

    const nextToken = Math.max(...queue.map((q) => q.token), 20) + 1;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patientProfile.id,
      patientName: patientProfile.name,
      ...data,
      token: nextToken,
      status: "waiting",
      type: "regular",
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => {
      const updated = [newAppointment, ...prev];
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });

    // Add to Live Queue if for today or next active day
    const newQueueEntry: QueueEntry = {
      token: nextToken,
      patientId: patientProfile.id,
      patientName: patientProfile.name,
      appointmentTime: data.time,
      doctorId: data.doctorId,
      status: "waiting",
      waitMinutes: (nextToken - currentToken) * 4,
      appointmentId: newAppointment.id,
    };

    setQueue((prev) => {
      const updated = [...prev, newQueueEntry];
      saveToStorage(STORAGE_KEYS.QUEUE, updated);
      return updated;
    });

    addNotification(
      "Appointment Booked",
      `Confirmed with ${data.doctorName} at ${data.hospitalName} on ${data.date} at ${data.time}. Token #${nextToken}.`,
      "success"
    );

    addAuditEvent(
      `Booked Appointment with ${data.doctorName}`,
      `${data.hospitalName} · Token #${nextToken}`
    );

    // Timeline event
    const timelineItem: TimelineEvent = {
      id: `tl-apt-${Date.now()}`,
      patientId: patientProfile.id,
      date: "Today",
      timestamp: new Date().toISOString(),
      title: "Appointment Booked",
      description: `${data.doctorName} (${data.specialty}) at ${data.hospitalName} for ${data.date} ${data.time} (Token #${nextToken})`,
      type: "appointment_booked",
    };

    setTimelineEvents((prev) => {
      const updated = [timelineItem, ...prev];
      saveToStorage(STORAGE_KEYS.TIMELINE_EVENTS, updated);
      return updated;
    });

    setResearchMetrics((prev) => {
      const updated = { ...prev, appointmentBookCount: prev.appointmentBookCount + 1 };
      saveToStorage(STORAGE_KEYS.METRICS, updated);
      return updated;
    });

    return {
      success: true,
      message: `Appointment booked successfully! Token #${nextToken}`,
      appointment: newAppointment,
    };
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as AppointmentStatus } : a));
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });

    setQueue((prev) => {
      const updated = prev.filter((q) => q.appointmentId !== id);
      saveToStorage(STORAGE_KEYS.QUEUE, updated);
      return updated;
    });

    addNotification("Appointment Cancelled", "Your appointment has been cancelled.", "warning");
    addAuditEvent("Cancelled Appointment", `Appointment ID: ${id}`);
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) => {
      const updated = prev.map((a) =>
        a.id === id ? { ...a, date: newDate, time: newTime, status: "rescheduled" as AppointmentStatus } : a
      );
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });

    addNotification("Appointment Rescheduled", `Rescheduled to ${newDate} at ${newTime}.`, "info");
    addAuditEvent("Rescheduled Appointment", `Appointment ID: ${id} to ${newDate} ${newTime}`);
  };

  // --- QUEUE ACTIONS ---
  const callNextPatient = () => {
    const waitingList = queue.filter((q) => q.status === "waiting" || q.status === "confirmed" || q.status === "called");
    if (waitingList.length === 0) return;

    const nextEntry = waitingList[0];
    const nextTokenNum = nextEntry.token;

    setCurrentToken(nextTokenNum);
    saveToStorage(STORAGE_KEYS.CURRENT_TOKEN, nextTokenNum);

    setQueue((prev) => {
      const updated = prev.map((q) => {
        if (q.token === nextTokenNum) return { ...q, status: "called" as const };
        return q;
      });
      saveToStorage(STORAGE_KEYS.QUEUE, updated);
      return updated;
    });

    addNotification(
      "Queue Token Called",
      `Token #${nextTokenNum} (${nextEntry.patientName}) called to OPD.`,
      "info"
    );
    addAuditEvent(`Called Next Token: #${nextTokenNum} (${nextEntry.patientName})`);
  };

  const startConsultation = () => {
    setQueue((prev) => {
      const updated = prev.map((q) => {
        if (q.token === currentToken) return { ...q, status: "in-consultation" as const };
        return q;
      });
      saveToStorage(STORAGE_KEYS.QUEUE, updated);
      return updated;
    });

    setAppointments((prev) => {
      const updated = prev.map((a) => {
        if (a.token === currentToken && a.status !== "completed") return { ...a, status: "in-consultation" as AppointmentStatus };
        return a;
      });
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });

    addNotification("Consultation Started", `Token #${currentToken} entered consultation room.`, "info");
    addAuditEvent(`Started Consultation for Token #${currentToken}`);
  };

  const completeConsultation = ({
    notes,
    observations,
    followUpDate,
  }: {
    notes: string;
    observations: string;
    followUpDate?: string;
  }) => {
    const currentQueueEntry = queue.find((q) => q.token === currentToken) || queue[0];
    if (!currentQueueEntry) return;

    const newConsultation: ConsultationRecord = {
      id: `c-${Date.now()}`,
      appointmentId: currentQueueEntry.appointmentId || `apt-${Date.now()}`,
      patientId: currentQueueEntry.patientId,
      patientName: currentQueueEntry.patientName,
      doctorId: "d1",
      doctorName: "Dr. Ayesha Khan",
      hospitalId: "h1",
      hospitalName: "City Diabetes Centre",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes,
      observations,
      followUpDate,
      createdAt: new Date().toISOString(),
    };

    // 1. Save consultation record
    setConsultations((prev) => {
      const updated = [newConsultation, ...prev];
      saveToStorage(STORAGE_KEYS.CONSULTATIONS, updated);
      return updated;
    });

    // 2. Mark appointment as completed
    setAppointments((prev) => {
      const updated = prev.map((a) =>
        a.token === currentToken || a.id === currentQueueEntry.appointmentId
          ? { ...a, status: "completed" as AppointmentStatus }
          : a
      );
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });

    // 3. Update queue entry to completed
    setQueue((prev) => {
      const updated = prev.map((q) => (q.token === currentToken ? { ...q, status: "completed" as const } : q));
      saveToStorage(STORAGE_KEYS.QUEUE, updated);
      return updated;
    });

    // 4. Update Patient profile last consultation & next follow-up
    if (currentQueueEntry.patientId === patientProfile.id) {
      setPatientProfile((prev) => {
        const updated = {
          ...prev,
          lastConsultation: newConsultation.date,
          nextFollowUp: followUpDate || prev.nextFollowUp,
        };
        saveToStorage(STORAGE_KEYS.PATIENT_PROFILE, updated);
        return updated;
      });

      // Add timeline event
      const timelineItem: TimelineEvent = {
        id: `tl-c-${Date.now()}`,
        patientId: currentQueueEntry.patientId,
        date: "Today",
        timestamp: new Date().toISOString(),
        title: "Doctor Consultation Completed",
        description: `Dr. Ayesha Khan · ${notes.slice(0, 75)}... ${followUpDate ? `(Follow-up: ${followUpDate})` : ""}`,
        type: "consultation",
      };

      setTimelineEvents((prev) => {
        const updated = [timelineItem, ...prev];
        saveToStorage(STORAGE_KEYS.TIMELINE_EVENTS, updated);
        return updated;
      });
    }

    // 5. Advance Token automatically
    const remainingWaiting = queue.filter((q) => q.token > currentToken && (q.status === "waiting" || q.status === "confirmed"));
    if (remainingWaiting.length > 0) {
      setCurrentToken(remainingWaiting[0].token);
      saveToStorage(STORAGE_KEYS.CURRENT_TOKEN, remainingWaiting[0].token);
    }

    addNotification(
      "Consultation Completed",
      `Saved notes for Token #${currentToken} (${currentQueueEntry.patientName}). Appointment marked completed.`,
      "success"
    );

    addAuditEvent(
      `Completed Consultation for Token #${currentToken}`,
      `Follow-up date: ${followUpDate || "None"}`
    );

    setResearchMetrics((prev) => {
      const updated = { ...prev, consultationCount: prev.consultationCount + 1, queueActionsCount: prev.queueActionsCount + 1 };
      saveToStorage(STORAGE_KEYS.METRICS, updated);
      return updated;
    });
  };

  const skipPatient = () => {
    setQueue((prev) => {
      const updated = prev.map((q) => (q.token === currentToken ? { ...q, status: "skipped" as const } : q));
      saveToStorage(STORAGE_KEYS.QUEUE, updated);
      return updated;
    });

    const nextWaiting = queue.find((q) => q.token > currentToken && q.status === "waiting");
    if (nextWaiting) {
      setCurrentToken(nextWaiting.token);
      saveToStorage(STORAGE_KEYS.CURRENT_TOKEN, nextWaiting.token);
    }

    addNotification("Patient Skipped", `Token #${currentToken} marked skipped in OPD queue.`, "warning");
    addAuditEvent(`Skipped Patient Token #${currentToken}`);
  };

  // --- BEDS MANAGEMENT ---
  const updateBedStatus = (bedId: string, status: HospitalBed["status"]) => {
    setBeds((prevBeds) => {
      const updatedBeds = prevBeds.map((b) => (b.id === bedId ? { ...b, status, updatedAt: new Date().toISOString() } : b));
      saveToStorage(STORAGE_KEYS.BEDS, updatedBeds);

      // Recalculate hospital bed stats
      const h1Beds = updatedBeds.filter((b) => b.hospitalId === "h1");
      const generalCount = h1Beds.filter((b) => b.bedType === "General" && b.status === "available").length;
      const icuCount = h1Beds.filter((b) => b.bedType === "ICU" && b.status === "available").length;
      const obsCount = h1Beds.filter((b) => b.bedType === "Observation" && b.status === "available").length;

      const occupiedCount = h1Beds.filter((b) => b.status === "occupied").length;
      const reservedCount = h1Beds.filter((b) => b.status === "reserved").length;
      const maintCount = h1Beds.filter((b) => b.status === "maintenance").length;

      setHospitals((prevH) =>
        prevH.map((h) =>
          h.id === "h1"
            ? {
                ...h,
                bedsAvailable: {
                  general: generalCount,
                  icu: icuCount,
                  observation: obsCount,
                  total: h1Beds.length,
                  occupied: occupiedCount,
                  reserved: reservedCount,
                  maintenance: maintCount,
                },
              }
            : h
        )
      );

      return updatedBeds;
    });

    addNotification("Bed Status Changed", `Bed ${bedId} status changed to '${status}'.`, "info");
    addAuditEvent(`Changed Bed Status`, `Bed ${bedId} set to ${status}`);
  };

  // --- HRM / STAFF MANAGEMENT ---
  const addStaffMember = (newStaffData: Omit<StaffMember, "id">) => {
    const newStaff: StaffMember = {
      id: `STF-${Date.now()}`,
      ...newStaffData,
    };

    setStaff((prev) => {
      const updated = [newStaff, ...prev];
      saveToStorage(STORAGE_KEYS.STAFF, updated);
      return updated;
    });

    addNotification("Staff Member Added", `${newStaff.name} added as ${newStaff.role}.`, "success");
    addAuditEvent(`Added Staff Member`, `${newStaff.name} (${newStaff.role})`);
  };

  const updateStaffMember = (id: string, data: Partial<StaffMember>) => {
    setStaff((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
      saveToStorage(STORAGE_KEYS.STAFF, updated);
      return updated;
    });

    addNotification("Staff Info Updated", "Staff details updated successfully.", "info");
    addAuditEvent(`Updated Staff Member`, `Staff ID: ${id}`);
  };

  const deleteStaffMember = (id: string) => {
    setStaff((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveToStorage(STORAGE_KEYS.STAFF, updated);
      return updated;
    });

    addNotification("Staff Member Removed", "Staff record deleted.", "warning");
    addAuditEvent(`Removed Staff Member`, `Staff ID: ${id}`);
  };

  // --- OPD DEPARTMENTS ADMIN ---
  const updateOpdDepartment = (id: string, data: Partial<OpdDepartment>) => {
    setOpdDepartments((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, ...data } : d));
      saveToStorage(STORAGE_KEYS.OPD_DEPTS, updated);
      return updated;
    });

    addNotification("OPD Department Updated", "OPD configurations updated.", "success");
    addAuditEvent("Updated OPD Department Config", `Department ID: ${id}`);
  };

  // --- RESET ALL DATA ---
  const resetAllDemoData = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setRoleState("patient");
    setPatientProfile(defaultPatientProfile);
    setGlucoseReadings(defaultGlucoseReadings);
    setTimelineEvents(defaultTimelineEvents);
    setAppointments(defaultAppointments);
    setQueue(defaultLiveQueue);
    setCurrentToken(12);
    setConsultations(defaultConsultations);
    setBeds(defaultBeds);
    setStaff(defaultStaffMembers);
    setOpdDepartments(defaultOpdDepartments);
    setNotifications(defaultNotifications);
    setAuditEvents(defaultAuditEvents);
    setResearchMetrics({
      appointmentBookCount: 0,
      glucoseAddCount: 0,
      queueActionsCount: 0,
      consultationCount: 0,
      clicksCount: 0,
    });
  };

  return (
    <DataContext.Provider
      value={{
        role,
        setRole,
        patientProfile,
        updatePatientProfile,
        glucoseReadings,
        addGlucoseReading,
        deleteGlucoseReading,
        glucoseStats: calculateGlucoseStats(),
        timelineEvents,
        appointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        queue,
        currentToken,
        callNextPatient,
        startConsultation,
        completeConsultation,
        skipPatient,
        consultations,
        hospitals,
        doctors,
        beds,
        updateBedStatus,
        staff,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        opdDepartments,
        updateOpdDepartment,
        notifications,
        markNotificationAsRead,
        addNotification,
        auditEvents,
        researchMetrics,
        trackClick,
        resetAllDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
