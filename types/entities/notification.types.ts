// types/entities/notification.types.ts

import { AppointmentStatus } from './appointment.types';

// ======================================================
// ENUMS & TYPES
// ======================================================

export type NotificationChannel = 'IN_APP';

export type NotificationPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export type NotificationRecipientType =
  | 'patient'
  | 'doctor'
  | 'clinic'
  | 'diagnostic_center'
  | 'staff';

export type NotificationType =
  | 'APPOINTMENT_BOOKED'
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'CHECK_IN_CONFIRMED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'REFUND_PROCESSED'
  | 'PREPARATION_INSTRUCTION'
  | 'RESULT_READY'
  | 'NEW_REVIEW'
  | 'SYSTEM_ALERT';

// ======================================================
// BASE NOTIFICATION
// ======================================================

export interface Notification {
  id: number;

  recipientId: number;

  recipientType: NotificationRecipientType;

  title: string;
  message: string;

  type: NotificationType;
  channel: NotificationChannel;

  priority: NotificationPriority;

  isRead: boolean;

  relatedAppointmentId?: number | null;
  relatedPaymentId?: number | null;
  relatedResultId?: number | null;
  relatedReviewId?: number | null;

  actionUrl?: string | null;

  createdAt: string;
  updatedAt?: string;
  readAt?: string | null;
}

// ======================================================
// CREATE NOTIFICATION
// ======================================================

export interface CreateNotificationDTO {
  recipientId: number;

  recipientType: NotificationRecipientType;

  title: string;
  message: string;

  type: NotificationType;

  priority?: NotificationPriority;

  relatedAppointmentId?: number;
  relatedPaymentId?: number;
  relatedResultId?: number;
  relatedReviewId?: number;

  actionUrl?: string;
}

// ======================================================
// UPDATE NOTIFICATION
// ======================================================

export interface UpdateNotificationDTO {
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  actionUrl?: string;
}

// ======================================================
// MARK AS READ
// ======================================================

export interface MarkNotificationReadDTO {
  notificationId: number;
}

export interface MarkAllNotificationsReadDTO {
  recipientId: number;
}

// ======================================================
// FILTERS
// ======================================================

export interface NotificationFilters {
  recipientId?: number;

  recipientType?: NotificationRecipientType;

  type?: NotificationType | 'all';

  isRead?: boolean;

  priority?: NotificationPriority | 'all';

  startDate?: string;
  endDate?: string;

  searchTerm?: string;
}

// ======================================================
// ENRICHED NOTIFICATION
// ======================================================

export interface EnrichedNotification extends Notification {
  recipientName?: string;

  patientName?: string;
  providerName?: string;

  appointmentStatus?: AppointmentStatus;

  serviceName?: string;

  paymentAmount?: number;

  resultStatus?: string;

  profileImage?: string;
}

// ======================================================
// RESPONSE TYPES
// ======================================================

export interface NotificationResponse {
  success: boolean;
  data?: Notification;
  message?: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  unreadCount: number;
  total: number;
  message?: string;
}

// ======================================================
// STATISTICS
// ======================================================

export interface NotificationStats {
  total: number;

  unread: number;
  read: number;

  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
  urgentPriority: number;

  appointmentNotifications: number;
  paymentNotifications: number;
  diagnosticNotifications: number;
  reviewNotifications: number;
  systemNotifications: number;
}

// ======================================================
// USER PREFERENCES
// ======================================================

export interface NotificationPreferences {
  appointmentBooked: boolean;
  appointmentReminder: boolean;
  appointmentCancelled: boolean;
  appointmentRescheduled: boolean;

  checkInConfirmed: boolean;
  queueUpdates: boolean;

  paymentSuccess: boolean;
  paymentFailed: boolean;
  refundProcessed: boolean;

  preparationInstruction: boolean;
  resultReady: boolean;

  newReview: boolean;

  systemAlerts: boolean;
}

// ======================================================
// NOTIFICATION BADGE
// ======================================================

export interface NotificationBadge {
  unreadCount: number;
  urgentCount: number;
}

// ======================================================
// UI CARD MODEL
// ======================================================

export interface NotificationCardData {
  id: number;

  title: string;
  message: string;

  type: NotificationType;

  priority: NotificationPriority;

  isRead: boolean;

  timestamp: string;

  actionLabel?: string;
  actionUrl?: string;
}

// ======================================================
// DASHBOARD SUMMARY
// ======================================================

export interface NotificationSummary {
  totalNotifications: number;
  unreadNotifications: number;

  latestNotification?: Notification;

  todayNotifications: number;

  urgentNotifications: number;
}

// ======================================================
// HELPER CONFIGS
// ======================================================

export const NotificationTypeLabels: Record<NotificationType, string> = {
  APPOINTMENT_BOOKED: 'Appointment Booked',
  APPOINTMENT_REMINDER: 'Appointment Reminder',
  APPOINTMENT_CANCELLED: 'Appointment Cancelled',
  APPOINTMENT_RESCHEDULED: 'Appointment Rescheduled',
  CHECK_IN_CONFIRMED: 'Check-in Confirmed',
  PAYMENT_SUCCESS: 'Payment Success',
  PAYMENT_FAILED: 'Payment Failed',
  REFUND_PROCESSED: 'Refund Processed',
  PREPARATION_INSTRUCTION: 'Preparation Instruction',
  RESULT_READY: 'Result Ready',
  NEW_REVIEW: 'New Review',
  SYSTEM_ALERT: 'System Alert',
};

export const NotificationPriorityConfig = {
  LOW: {
    label: 'Low',
    color: 'default',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'info',
  },
  HIGH: {
    label: 'High',
    color: 'warning',
  },
  URGENT: {
    label: 'Urgent',
    color: 'error',
  },
} as const;

// ======================================================
// HELPERS
// ======================================================

export const isNotificationUnread = (
  notification: Notification
): boolean => {
  return !notification.isRead;
};

export const canDeleteNotification = (
  notification: Notification
): boolean => {
  return notification.type !== 'SYSTEM_ALERT';
};

export const getUnreadNotifications = (
  notifications: Notification[]
): Notification[] => {
  return notifications.filter((n) => !n.isRead);
};

export const getUnreadCount = (
  notifications: Notification[]
): number => {
  return notifications.filter((n) => !n.isRead).length;
};

export const getUrgentNotifications = (
  notifications: Notification[]
): Notification[] => {
  return notifications.filter(
    (n) => n.priority === 'URGENT'
  );
};