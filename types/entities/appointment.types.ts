// types/appointment.types.ts
export type AppointmentStatus = 'Scheduled' | 'Checked-in' | 'In Progress' | 'Completed' | 'Cancelled' | 'No-show';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';
export type ProviderType = 'doctor' | 'clinic' | 'diagnostic';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  location: string;
  locationDetail?: string;
  status: AppointmentStatus;
  fee: number;
  paymentStatus: PaymentStatus;
  cardNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  providerId?: string;
  providerName?: string;
  providerType?: ProviderType;
  providerImage?: string;
  rating?: number;
  reviews?: number;
  contactPhone?: string;
  contactEmail?: string;
  description?: string;
  specialization?: string;
  experience?: string;
  education?: string;
  testType?: string;
}

export interface AppointmentFilters {
  searchTerm?: string;
  status?: AppointmentStatus | 'all';
  date?: string;
  providerId?: string;
  patientId?: string;
}

export interface AppointmentStats {
  total: number;
  today: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: number;
  upcoming: number;
}

export interface CheckedInPatient {
  id: string;
  patientName: string;
  patientId: string;
  serviceName: string;
  checkInTime: string;
  appointmentTime: string;
  status: 'waiting' | 'in-progress' | 'completed';
  queueNumber: number;
  cardNumber: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  shift: string;
}

export interface DaySchedule {
  day: string;
  isActive: boolean;
  slots: TimeSlot[];
  note?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  standardFee: number;
  status: 'Active' | 'Inactive';
  serviceType: string;
  preparationInstructions?: string;
}