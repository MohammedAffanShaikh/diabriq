// Types for Diabriq - Connected Diabetes Care Network

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  diabetesType: 'Type 1' | 'Type 2' | 'Gestational' | 'Pre-diabetes';
  connectedHospitals: string[];
  assignedDoctors: string[];
  totalVisits: number;
  documents: number;
  caregiverAccess?: CaregiverAccess;
  language: 'English' | 'Hindi' | 'Marathi' | 'Urdu';
}

export interface CaregiverAccess {
  name: string;
  relationship: string;
  permissions: ('appointments' | 'queue' | 'notifications' | 'documents')[];
  authorized: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  opdRoom: string;
  available: boolean;
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
  bedsAvailable: BedAvailability;
  doctorsAvailable: number;
  doctorsTotal: number;
  appointmentsToday: number;
  walkIns: number;
  cancelledSlots: number;
  availableSlots: number;
  avgWaitMinutes: number;
  lat?: number;
  lng?: number;
}

export interface BedAvailability {
  general: number;
  icu: number;
  observation: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  time: string;
  token: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled' | 'waiting' | 'in-consultation';
  type: 'regular' | 'follow-up' | 'walk-in' | 'referral';
}

export interface QueueEntry {
  token: number;
  patientId: string;
  patientName: string;
  appointmentTime: string;
  status: 'waiting' | 'in-consultation' | 'confirmed' | 'called' | 'completed';
  waitMinutes: number;
  fromHospital?: string;
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
  userRole: 'patient' | 'doctor' | 'hospital-admin' | 'network-admin';
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

export interface VisitRecord {
  date: string;
  year: number;
  hospitalId: string;
  hospitalName: string;
  type: 'OPD Visit' | 'Uploaded document' | 'Follow-up scheduled' | 'Discharge document' | 'Consultation record' | 'Referral';
  doctorName?: string;
  notes?: string;
}

export interface RecordAccess {
  by: string;
  role: string;
  facility: string;
  timestamp: string;
  authorized: boolean;
}
