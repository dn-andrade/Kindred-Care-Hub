export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  conditions: string[];
  allergies: string[];
  lastVisit?: string;
  nextAppointment?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'consultation' | 'follow-up' | 'procedure' | 'check-up';
  status: 'scheduled' | 'in-progress' | 'completed' | 'canceled' | 'no-show';
  notes?: string;
  provider: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  title: string;
  content: string;
  author: string;
  type: 'progress' | 'encounter' | 'procedure' | 'general';
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  notes?: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  date: string;
  status: 'pending' | 'completed' | 'reviewed';
  results?: string;
  normalRange?: string;
  interpretation?: 'normal' | 'abnormal' | 'critical';
  orderedBy: string;
}

export interface PatientFile {
  id: string;
  patientId: string;
  name: string;
  type: 'lab' | 'prescription' | 'report' | 'imaging' | 'other';
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  url: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  type: 'visit' | 'note' | 'file' | 'prescription' | 'lab';
  title: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface CarePlan {
  id: string;
  patientId: string;
  goals: string[];
  treatments: string[];
  recommendations: string[];
  followUps: {
    date: string;
    reason: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'file' | 'lab' | 'message' | 'reminder';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}
