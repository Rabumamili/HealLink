// types/entities/result.types.ts (updated)

import { DiagnosticCenterProfile, StaffProfile } from "./profile.types";

export type ResultStatus = 
  | 'Pending'
  | 'in progress'
  | 'Ready'
  | 'Collected';

export interface Result {
  id: number;
  result_id: number;           
  changed_by_staff_id: number; 
  changed_at: string;         
  status: ResultStatus;
  appointment_id?: number;     
  patient_id?: number;         
}

export interface CreateResultDTO {
  appointment_id: number;
  changed_by_staff_id: number;
  status: ResultStatus;
  changed_at?: string;         // Optional, defaults to current timestamp
}

export interface UpdateResultDTO {
  status?: ResultStatus;
  changed_by_staff_id?: number;
  changed_at?: string;
}


export interface ResultFilters {
  appointment_id?: number;
  status?: ResultStatus | 'all';
  changed_by_staff_id?: number;
  diagnostic_center_id?: number;
  staff_id?: number;
  patient_id?: number;  // Add patient_id filter
  startDate?: string;
  endDate?: string;
}


export interface ResultWithDetails extends Result {
  appointment?: {
    id: number;
    patientName: string;
    patientId: number;
    scheduledDateTime: string;
    serviceName?: string;
    serviceType?: string;
  };
  changedByStaff?: StaffProfile & {
    employer?: DiagnosticCenterProfile;
  };
  patient?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}
export interface ResultHistoryResponse {
  results: Result[];
  total: number;
  currentStatus: ResultStatus | null;
  lastUpdated: string | null;
}

export interface ResultStats {
  total: number;
  pending: number;
  inProgress: number;
  ready: number;
  collected: number;
  averageProcessingTimeMinutes: number; // Time from appointment completion to result ready
  byDiagnosticCenter: {
    diagnosticCenterId: number;
    diagnosticCenterName: string;
    pending: number;
    inProgress: number;
    ready: number;
    collected: number;
  }[];
}