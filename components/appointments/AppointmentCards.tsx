// components/appointments/AppointmentCard.tsx
'use client';

import { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, Clock, MapPin, DollarSign, CreditCard, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AppointmentCardData {
  id: number;
  patientName: string;
  patientId?: number;
  serviceName?: string;
  type?: string;
  scheduledDateTime: string;
  status: string;
  checkInTime?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  estimatedWaitMinutes?: number | null;
  notes?: string | null;
  fee?: number;
  paymentStatus?: string;
  cardNumber?: string | null;
  location?: string;
  locationDetail?: string;
  patientEmail?: string;
  patientPhone?: string;
  providerName?: string;
}

interface AppointmentCardProps {
  appointment: AppointmentCardData;
  variant?: 'doctor' | 'clinic' | 'diagnostic' | 'patient';
  isPast?: boolean;
  showCheckin?: boolean;
  showConfirm?: boolean; // Add showConfirm prop
  onView?: (appointment: AppointmentCardData) => void;
  onReschedule?: (appointment: AppointmentCardData) => void;
  onCancel?: (appointment: AppointmentCardData) => void;
  onStart?: (appointment: AppointmentCardData) => void;
  onCheckIn?: (appointment: AppointmentCardData) => void;
  onConfirm?: (appointment: AppointmentCardData) => void; // Add onConfirm prop
  onContact?: (appointment: AppointmentCardData) => void;
  actions?: ReactNode;
}

const variantColors = {
  doctor: {
    avatarBg: 'bg-teal-50 text-teal-600',
    buttonBg: 'bg-teal-600 hover:bg-teal-700',
    confirmBg: 'bg-emerald-600 hover:bg-emerald-700',
  },
  clinic: {
    avatarBg: 'bg-[#006767]/10 text-[#006767]',
    buttonBg: 'bg-[#006767] hover:bg-[#008282]',
    confirmBg: 'bg-emerald-600 hover:bg-emerald-700',
  },
  diagnostic: {
    avatarBg: 'bg-primary/10 text-primary',
    buttonBg: 'bg-primary hover:bg-primary/90',
    confirmBg: 'bg-emerald-600 hover:bg-emerald-700',
  },
  patient: {
    avatarBg: 'bg-primary/10 text-primary',
    buttonBg: 'bg-primary hover:bg-primary/90',
    confirmBg: 'bg-emerald-600 hover:bg-emerald-700',
  },
};

export function AppointmentCard({
  appointment,
  variant = 'clinic',
  isPast = false,
  showCheckin = false,
  showConfirm = false, // Add showConfirm prop
  onView,
  onReschedule,
  onCancel,
  onStart,
  onCheckIn,
  onConfirm, // Add onConfirm prop
  onContact,
  actions,
}: AppointmentCardProps) {
  const colors = variantColors[variant];
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDateTime = (dateTime: string) => {
    const [date, time] = dateTime.split(' ');
    return { date, time };
  };

  const { date, time } = formatDateTime(appointment.scheduledDateTime);

  return (
    <div className="bg-white rounded-2xl border border-[#E0E7FF] shadow-[0_4px_20px_rgba(0,139,139,0.05)] hover:shadow-md transition-all p-5 md:p-6">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-16 h-16 md:w-20 md:h-20 rounded-2xl">
            <AvatarFallback className={cn("rounded-2xl text-base font-bold", colors.avatarBg)}>
              {getInitials(appointment.patientName)}
            </AvatarFallback>
          </Avatar>
          {!isPast && appointment.status === 'Confirmed' && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
              <div className="h-2 w-2 rounded-full" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-3">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">{appointment.patientName}</h3>
              <p className="text-sm text-[#6d7979]">
                {appointment.serviceName || appointment.type || 'Consultation'}
              </p>
            </div>
            <StatusBadge status={appointment.status as any} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-y border-[#E0E7FF]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#006767]" />
              <span className="text-sm text-[#3d4949]">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#006767]" />
              <span className="text-sm text-[#3d4949]">{time}</span>
            </div>
            {appointment.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#006767]" />
                <span className="text-sm text-[#3d4949] truncate">{appointment.location}</span>
              </div>
            )}
            {appointment.fee && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#006767]" />
                <span className="text-sm font-semibold text-[#006767]">ETB {appointment.fee}</span>
              </div>
            )}
            {appointment.paymentStatus && (
              <div className="flex items-center gap-2">
                <StatusBadge status={appointment.paymentStatus as any} variant="payment" />
              </div>
            )}
            {appointment.estimatedWaitMinutes && appointment.status === 'Checked-in' && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600">Wait: {appointment.estimatedWaitMinutes} min</span>
              </div>
            )}
            {appointment.cardNumber && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#006767]" />
                <span className="text-sm text-[#3d4949]">Card: {appointment.cardNumber}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {actions ? (
            actions
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              {onView && (
                <Button variant="outline" size="sm" onClick={() => onView(appointment)} className="rounded-xl">
                  View Details
                </Button>
              )}
              {!isPast && onReschedule && appointment.status === 'Confirmed' && (
                <Button variant="outline" size="sm" onClick={() => onReschedule(appointment)} className="rounded-xl">
                  Reschedule
                </Button>
              )}
              {!isPast && onCancel && appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                <Button variant="ghost" size="sm" onClick={() => onCancel(appointment)} className="rounded-xl text-red-600 hover:bg-red-50">
                  Cancel
                </Button>
              )}
              {showConfirm && onConfirm && appointment.status === 'Scheduled' && appointment.paymentStatus === 'Paid' && (
                <Button size="sm" onClick={() => onConfirm(appointment)} className={cn("rounded-xl text-white", colors.confirmBg)}>
                  Confirm & Generate Card
                </Button>
              )}
              {showCheckin && onCheckIn && appointment.status === 'Confirmed' && (
                <Button size="sm" onClick={() => onCheckIn(appointment)} className={cn("rounded-xl text-white", colors.buttonBg)}>
                  Check In
                </Button>
              )}
              {!isPast && onStart && (appointment.status === 'Checked-in' || appointment.status === 'In Progress') && (
                <Button size="sm" onClick={() => onStart(appointment)} className={cn("rounded-xl text-white", colors.buttonBg)}>
                  {appointment.status === 'In Progress' ? 'Continue' : 'Start Consultation'}
                </Button>
              )}
              {onContact && (
                <Button variant="outline" size="sm" onClick={() => onContact(appointment)} className="rounded-xl">
                  Contact
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}