// components/appointments/AppointmentCard.tsx
'use client';

import { ReactNode, useMemo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, StatusType } from '@/components/common/StatusBadge';
import {
  CalendarDays,
  Clock3,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  Clock,
  ChevronRight,
  TimerReset,
  CircleDollarSign,
  FileText,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AppointmentCardData {
  id: number;
  patientName: string;
  patientId?: number;
  serviceName?: string;
  serviceDescription?: string;
  serviceDuration?: number;
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
  providerType?: string;
  providerEmail?: string;
  providerPhone?: string;
  providerSpecialty?: string;
  queuePosition?: number;
}

interface AppointmentCardProps {
  appointment: AppointmentCardData;
  variant?: 'doctor' | 'clinic' | 'diagnostic' | 'patient';
  isPast?: boolean;
  compact?: boolean;
  showCheckin?: boolean;
  showConfirm?: boolean;
  onView?: (appointment: AppointmentCardData) => void;
  onReschedule?: (appointment: AppointmentCardData) => void;
  onCancel?: (appointment: AppointmentCardData) => void;
  onStart?: (appointment: AppointmentCardData) => void;
  onComplete?: (appointment: AppointmentCardData) => void;
  onCheckIn?: (appointment: AppointmentCardData) => void;
  onConfirm?: (appointment: AppointmentCardData) => void;
  onContact?: (appointment: AppointmentCardData) => void;
  actions?: ReactNode;
}

const variantStyles: Record<string, { accent: string; soft: string; button: string; bgLight: string; borderLight: string }> = {
  doctor: {
    accent: 'from-[#008282] to-[#00a0a0]',
    soft: 'bg-[#008282]/10 text-[#008282] border-[#008282]/20',
    button: 'bg-[#008282] hover:bg-[#00a0a0]',
    bgLight: 'bg-[#008282]/5',
    borderLight: 'border-[#008282]/10',
  },
  clinic: {
    accent: 'from-[#008282] to-[#00a0a0]',
    soft: 'bg-[#008282]/10 text-[#008282] border-[#008282]/20',
    button: 'bg-[#008282] hover:bg-[#00a0a0]',
    bgLight: 'bg-[#008282]/5',
    borderLight: 'border-[#008282]/10',
  },
  diagnostic: {
    accent: 'from-[#008282] to-[#00a0a0]',
    soft: 'bg-[#008282]/10 text-[#008282] border-[#008282]/20',
    button: 'bg-[#008282] hover:bg-[#00a0a0]',
    bgLight: 'bg-[#008282]/5',
    borderLight: 'border-[#008282]/10',
  },
  patient: {
    accent: 'from-[#008282] to-[#00a0a0]',
    soft: 'bg-[#008282]/10 text-[#008282] border-[#008282]/20',
    button: 'bg-[#008282] hover:bg-[#00a0a0]',
    bgLight: 'bg-[#008282]/5',
    borderLight: 'border-[#008282]/10',
  },
};

const statusConfig: Record<string, { ring: string; glow: string }> = {
  Scheduled: { ring: 'ring-amber-100', glow: 'shadow-amber-100/40' },
  Confirmed: { ring: 'ring-emerald-100', glow: 'shadow-emerald-100/40' },
  'Checked-in': { ring: 'ring-blue-100', glow: 'shadow-blue-100/40' },
  'In Progress': { ring: 'ring-violet-100', glow: 'shadow-violet-100/40' },
  Completed: { ring: 'ring-slate-100', glow: 'shadow-slate-100/40' },
  Cancelled: { ring: 'ring-red-100', glow: 'shadow-red-100/40' },
};

export function AppointmentCard({
  appointment,
  variant = 'patient',
  isPast = false,
  compact = false,
  showCheckin = false,
  showConfirm = false,
  onView,
  onReschedule,
  onCancel,
  onStart,
  onComplete,
  onCheckIn,
  onConfirm,
  onContact,
  actions,
}: AppointmentCardProps) {
  const style = variantStyles[variant] || variantStyles.patient;
  const appointmentStatus = statusConfig[appointment.status] || statusConfig.Scheduled;

  const initials = useMemo(() => {
    const primaryName = variant === 'patient' ? appointment.providerName : appointment.patientName;
    if (!primaryName) return variant === 'patient' ? 'PR' : 'PT';
    return primaryName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  }, [appointment.patientName, appointment.providerName, variant]);

  const parsedDate = useMemo(() => {
    const date = new Date(appointment.scheduledDateTime);
    return {
      full: date,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }, [appointment.scheduledDateTime]);

  const showActions = !isPast && appointment.status !== 'Completed' && appointment.status !== 'Cancelled';
  const paymentPending = appointment.paymentStatus === 'PENDING' || appointment.paymentStatus === 'FAILED';
  const isPatientView = variant === 'patient';
  const isProviderView = variant !== 'patient';
  const showCardNumber = !isPatientView && appointment.cardNumber;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300',
        'border-slate-200/80 shadow-md hover:shadow-xl',
        'hover:-translate-y-1',
        appointmentStatus.ring,
        compact ? 'p-4' : 'p-5'
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', style.accent)} />
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#008282]/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-14 w-14 rounded-xl border border-white shadow-md">
                <AvatarFallback className={cn('rounded-xl text-base font-bold', style.soft)}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              {appointment.status === 'Confirmed' && (
                <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-emerald-500 p-0.5">
                  <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              {appointment.status === 'Cancelled' && (
                <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-red-500 p-0.5">
                  <AlertCircle className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  {isPatientView ? appointment.providerName || 'Provider' : appointment.patientName}
                </h3>
                <div className="text-xs text-slate-500">
                  {isPatientView && appointment.providerSpecialty && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {appointment.providerSpecialty}
                    </span>
                  )}
                  {isProviderView && appointment.patientId && (
                    <span>ID: {appointment.patientId}</span>
                  )}
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className={cn('rounded-full border text-xs font-medium px-2 py-0.5', style.soft)}>
                    {appointment.serviceName || appointment.type || 'Consultation'}
                  </Badge>
                  {appointment.serviceDuration && (
                    <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-slate-600 text-xs px-2 py-0.5">
                      <Clock className="mr-1 h-2.5 w-2.5" />
                      {appointment.serviceDuration} min
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={appointment.status as StatusType} />
            {appointment.paymentStatus && (
              <StatusBadge status={appointment.paymentStatus as StatusType} variant="payment" />
            )}
          </div>
        </div>

        {/* SERVICE DESCRIPTION */}
        {appointment.serviceDescription && (
          <div className={cn('rounded-xl p-3', style.bgLight, style.borderLight, 'border')}>
            <div className="flex items-start gap-2">
              <Sparkles className={cn('h-4 w-4 mt-0.5', 'text-[#008282]')} />
              <div>
                <p className="text-xs font-medium text-slate-700">Service Description</p>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{appointment.serviceDescription}</p>
              </div>
            </div>
          </div>
        )}

        {/* BODY - Info Cards */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <ModernInfoCard icon={<CalendarDays className="h-3.5 w-3.5" />} label="Date" value={parsedDate.date} />
          <ModernInfoCard icon={<Clock3 className="h-3.5 w-3.5" />} label="Time" value={parsedDate.time} />
          <ModernInfoCard icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={appointment.location?.split(' ').slice(0, 2).join(' ') || 'Online'} />
          <ModernInfoCard 
            icon={<CircleDollarSign className="h-3.5 w-3.5" />} 
            label="Fee" 
            value={appointment.fee ? `ETB ${appointment.fee.toLocaleString()}` : 'N/A'}
            danger={paymentPending}
          />
        </div>

        {/* Queue Position */}
        {appointment.queuePosition && appointment.status === 'Checked-in' && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 p-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
              <span className="text-sm font-bold text-amber-700">#{appointment.queuePosition}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-800">Queue Position</p>
              <p className="text-xs text-amber-600">~{appointment.estimatedWaitMinutes || 15} min wait</p>
            </div>
          </div>
        )}

        {/* CONTACT INFO */}
        <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          {isPatientView && (
            <div className="flex flex-wrap gap-2">
              {appointment.providerPhone && (
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm flex-1 min-w-[140px]">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Phone</p>
                    <p className="text-xs font-medium text-slate-700">{appointment.providerPhone}</p>
                  </div>
                </div>
              )}
              {appointment.providerEmail && (
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm flex-1 min-w-[140px]">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Email</p>
                    <p className="text-xs font-medium text-slate-700 truncate">{appointment.providerEmail}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {isProviderView && (
            <div className="flex flex-wrap gap-2">
              {appointment.patientPhone && (
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm flex-1 min-w-[140px]">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Patient Phone</p>
                    <p className="text-xs font-medium text-slate-700">{appointment.patientPhone}</p>
                  </div>
                </div>
              )}
              {appointment.patientEmail && (
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm flex-1 min-w-[140px]">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Email</p>
                    <p className="text-xs font-medium text-slate-700 truncate">{appointment.patientEmail}</p>
                  </div>
                </div>
              )}
              
              {showCardNumber && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 border border-amber-100 flex-1">
                  <CreditCard className="h-3 w-3 text-amber-500" />
                  <div>
                    <p className="text-[10px] text-amber-600 font-medium">Check-in Card</p>
                    <p className="text-xs font-mono font-semibold text-amber-800">{appointment.cardNumber}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        {actions ? (
          actions
        ) : (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(appointment)} className="rounded-xl border-slate-200 bg-white text-sm h-8 px-3">
                View
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            {showActions && onReschedule && ['Scheduled', 'Confirmed'].includes(appointment.status) && (
              <Button variant="outline" size="sm" onClick={() => onReschedule(appointment)} className="rounded-xl border-slate-200 text-sm h-8 px-3">
                <TimerReset className="mr-1 h-3 w-3" />
                Reschedule
              </Button>
            )}
            {showActions && onCancel && appointment.status !== 'Completed' && (
              <Button variant="ghost" size="sm" onClick={() => onCancel(appointment)} className="rounded-xl text-red-600 hover:bg-red-50 text-sm h-8 px-3">
                Cancel
              </Button>
            )}
            {showConfirm && onConfirm && appointment.status === 'Scheduled' && appointment.paymentStatus === 'SUCCESS' && (
              <Button size="sm" onClick={() => onConfirm(appointment)} className={cn('rounded-xl text-white shadow-md text-sm h-8 px-3', style.button)}>
                Confirm
              </Button>
            )}
            {showCheckin && onCheckIn && appointment.status === 'Confirmed' && (
              <Button size="sm" onClick={() => onCheckIn(appointment)} className={cn('rounded-xl text-white shadow-md text-sm h-8 px-3', style.button)}>
                Check In
              </Button>
            )}
            {showActions && onStart && appointment.status === 'Checked-in' && (
              <Button size="sm" onClick={() => onStart(appointment)} className={cn('rounded-xl text-white shadow-md text-sm h-8 px-3', style.button)}>
                Start
              </Button>
            )}
            {showActions && onComplete && appointment.status === 'In Progress' && (
              <Button size="sm" onClick={() => onComplete(appointment)} className={cn('rounded-xl text-white shadow-md text-sm h-8 px-3', style.button)}>
                Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ModernInfoCard({ icon, label, value, danger }: { icon: React.ReactNode; label: string; value: string; danger?: boolean }) {
  return (
    <div className={cn('rounded-xl p-2.5 transition-all', danger ? 'bg-amber-50' : 'bg-slate-50/80')}>
      <div className="flex items-center gap-1.5 mb-1">
        <div className={cn('text-slate-400', danger && 'text-amber-500')}>{icon}</div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      </div>
      <p className={cn('text-xs font-semibold text-slate-800', danger && 'text-amber-700')}>{value}</p>
    </div>
  );
}