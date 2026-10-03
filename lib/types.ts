// Types for DiabetesCareFlow - Integrated Diabetes Care & Hospital Operations Platform

export type UserRole = 'patient' | 'doctor' | 'hospital' | 'admin';

export type DiabetesType = 'Type 1' | 'Type 2' | 'Gestational' | 'Pre-diabetes' | 'Other';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  diabetesType: DiabetesType;
  diagnosisYear: number;
  heightCm: number;
  weightKg: number;
  bmi: number; // Calculated: weight / (height/100)^2
  bloodPressure: string; // e.g., "124/82"
  hba1c: number; // e.g., 7.2
  medicationInfo: string;
  lastConsultation?: string;
  nextFollowUp?: string;
  connectedHospitals: string[];
  assignedDoctors: string[];
  totalVisits: number;
  documents: number;
  language: 'English' | 'Hindi' | 'Marathi' | 'Urdu';
  caregiverAccess?: CaregiverAccess;
}

export interface CaregiverAccess {
  name: string;
  relationship: string;
  permissions: ('appointments' | 'queue' | 'notifications' | 'documents')[];
  authorized: boolean;
}

export type GlucoseReadingType = 'Fasting' | 'Before Meal' | 'After Meal' | 'Random';

export interface GlucoseReading {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  value: number; // mg/dL
  readingType: GlucoseReadingType;
  notes?: string;
  createdAt: string;
}

export interface GlucoseTimeInRangeStats {
  inRangePercent: number; // 70 - 180 mg/dL
  aboveRangePercent: number; // > 180 mg/dL
  belowRangePercent: number; // < 70 mg/dL
  averageGlucose: number;
  minGlucose: number;
  maxGlucose: number;
  readingCount: number;
  fastingAvg: number;
  postMealAvg: number;
}

export type TimelineEventType = 
  | 'glucose_reading'
  | 'hba1c_update'
  | 'appointment_booked'
  | 'appointment_completed'
  | 'consultation'
  | 'followup_scheduled'
  | 'profile_updated';

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string; // Display date e.g. "03 Oct 2026"
  timestamp: string;
  title: string;
  description: string;
  type: TimelineEventType;
  iconType?: string;
  metadata?: Record<string, any>;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  opdRoom: string;
  available: boolean;
  availableDays: string[];
  availableHours: string;
  experienceYears: number;
  patientsToday: number;
  waitingPatients: number;
  inConsultation: number;
  completed: number;
  cancelled: number;
  avgWaitMinutes: number;
  qualifications: string;
}

export interface Hospital {
  id: string;
  name: string;
  area: string;
  city: string;
  status: 'operational' | 'high-load' | 'critical';
  opdCapacityPercent: number;
  bedsAvailable: BedAvailabilityStats;
  doctorsAvailable: number;
  doctorsTotal: number;
  appointmentsToday: number;
  walkIns: number;
  cancelledSlots: number;
  availableSlots: number;
  avgWaitMinutes: number;
  departments: string[];
  lat?: number;
  lng?: number;
}

export interface BedAvailabilityStats {
  general: number;
  icu: number;
  observation: number;
  total: number;
  occupied: number;
  reserved: number;
  maintenance: number;
}

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type BedType = 'General' | 'ICU' | 'Observation' | 'Emergency';

export interface HospitalBed {
  id: string;
  hospitalId: string;
  hospitalName: string;
  ward: string;
  floor: string;
  bedType: BedType;
  status: BedStatus;
  patientName?: string;
  patientId?: string;
  updatedAt: string;
}

export type StaffRole = 'Doctor' | 'Nurse' | 'Receptionist' | 'Technician' | 'Administrator';
export type StaffShift = 'Morning' | 'Evening' | 'Night';
export type StaffAvailability = 'On Duty' | 'Available' | 'On Leave';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  department: string;
  contact: string;
  email: string;
  shift: StaffShift;
  availability: StaffAvailability;
  status: 'Active' | 'Inactive';
  hospitalId: string;
  hospitalName: string;
}

export type AppointmentStatus = 
  | 'upcoming' 
  | 'confirmed' 
  | 'waiting' 
  | 'in-consultation' 
  | 'completed' 
  | 'cancelled' 
  | 'rescheduled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  date: string;
  time: string;
  token: number;
  status: AppointmentStatus;
  type: 'regular' | 'follow-up' | 'walk-in' | 'referral';
  createdAt: string;
}

export interface QueueEntry {
  token: number;
  patientId: string;
  patientName: string;
  appointmentTime: string;
  doctorId: string;
  status: 'waiting' | 'called' | 'in-consultation' | 'completed' | 'skipped' | 'confirmed';
  waitMinutes: number;
  fromHospital?: string;
  appointmentId?: string;
}

export interface ConsultationRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  date: string; // YYYY-MM-DD
  time: string;
  notes: string;
  observations: string;
  followUpDate?: string; // YYYY-MM-DD
  createdAt: string;
}

export interface OpdDepartment {
  id: string;
  hospitalId: string;
  name: string;
  doctorId: string;
  doctorName: string;
  workingHours: string;
  slotDurationMinutes: number;
  maxPatientsPerSlot: number;
  isOpen: boolean;
  slots: string[];
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  userRole: UserRole;
  action: string;
  facility: string;
  patientId?: string;
  status: 'completed' | 'pending' | 'approved' | 'rejected';
  details?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'slot-fill' | 'reroute' | 'notify' | 'bottleneck';
  title: string;
  description: string;
  reason: string[];
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface NetworkStats {
  connectedHospitals: number;
  activeDoctors: number;
  totalPatients: number;
  appointmentsToday: number;
  avgWaitMinutes: number;
  availableBeds: number;
  utilizationPercent: number;
}

export interface RecordAccess {
  by: string;
  role: string;
  facility: string;
  timestamp: string;
  authorized: boolean;
}

export interface VisitRecord {
  date: string;
  year: number;
  hospitalId: string;
  hospitalName: string;
  type: 'OPD Visit' | 'Uploaded document' | 'Follow-up scheduled' | 'Discharge document' | 'Consultation record' | 'Referral';
  doctorName?: string;
  notes?: string;
}

export interface ResearchMetrics {
  appointmentBookCount: number;
  glucoseAddCount: number;
  queueActionsCount: number;
  consultationCount: number;
  clicksCount: number;
}
