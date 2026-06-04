/**
 * TypeScript Type Definitions
 * Defines the shape of all data structures in the app
 */

// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_type: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  date_of_birth?: string;
  national_id?: string;
  created_at: string;
}

// Health Facility
export interface HealthFacility {
  id: number;
  name: string;
  facility_type: 'HOSPITAL' | 'CLINIC' | 'PHARMACY';
  location: string;
  phone: string;
  email: string;
}

// Doctor
export interface Doctor {
  id: number;
  user: User;
  facility: HealthFacility;
  license_number: string;
  specialization: string;
  verified: boolean;
}

// Medical Record
export interface MedicalRecord {
  id: number;
  patient: User;
  doctor: Doctor;
  facility: HealthFacility;
  visit_date: string;
  chief_complaint: string;
  diagnosis: string;
  treatment_plan: string;
  blood_pressure?: string;
  heart_rate?: number;
  temperature?: number;
  weight?: number;
  medications_prescribed: Medication[];
  doctor_notes: string;
  created_at: string;
  updated_at: string;
}

// Medication
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Allergy
export interface Allergy {
  id: number;
  allergen: string;
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  diagnosed_date: string;
}

// Chronic Condition
export interface ChronicCondition {
  id: number;
  condition_name: string;
  diagnosed_date: string;
  status: 'ACTIVE' | 'MANAGED' | 'RESOLVED';
  notes: string;
}

// Payment
export interface Payment {
  id: number;
  patient: User;
  doctor: Doctor;
  facility: HealthFacility;
  medical_record: number; // ID
  amount: number;
  currency: string;
  payment_method: 'MTN_MOMO' | 'AIRTEL_MONEY';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transaction_id: string;
  requested_at: string;
  completed_at?: string;
  receipt_number: string;
  receipt_url?: string;
}

// Health Alert
export interface HealthAlert {
  id: number;
  patient: User;
  alert_type: 'VITAL_TREND' | 'REPEATED_VISIT' | 'MEDICATION_RISK' | 'MISSED_FOLLOWUP';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  alert_data: any; // JSON data
  created_at: string;
  acknowledged_by?: Doctor;
  acknowledged_at?: string;
  dismissed: boolean;
}

// QR Code
export interface QRCode {
  id: number;
  patient: number; // Patient ID
  qr_code_data: string;
  qr_code_image: string; // URL to image
  generated_at: string;
}

// Access Log
export interface AccessLog {
  id: number;
  patient: User;
  doctor: Doctor;
  facility: HealthFacility;
  accessed_at: string;
  access_granted: boolean;
  reason?: string;
}

// Dashboard Stats (Patient)
export interface PatientDashboardStats {
  total_visits: number;
  active_medications: number;
  chronic_conditions: number;
  recent_alerts: number;
  last_visit_date?: string;
  next_appointment?: string;
}

// Dashboard Stats (Doctor)
export interface DoctorDashboardStats {
  patients_today: number;
  total_patients: number;
  pending_payments: number;
  earnings_today: number;
  earnings_month: number;
}