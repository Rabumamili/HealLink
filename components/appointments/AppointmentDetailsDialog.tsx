// components/appointments/AppointmentDetailsDialog.tsx - Add onReview prop
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, Clock, MapPin, DollarSign, CreditCard, Phone, Mail, User, FileText, Star } from 'lucide-react';
import { AppointmentCardData } from './AppointmentCards';
import { cn } from '@/lib/utils';

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentCardData | null;
  onStart?: (appointment: AppointmentCardData) => void;
  onReschedule?: (appointment: AppointmentCardData) => void;
  onComplete?: (appointment: AppointmentCardData) => void;
  onReview?: (appointment: AppointmentCardData) => void;
  variant?: 'doctor' | 'clinic' | 'diagnostic' | 'patient';
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onStart,
  onReschedule,
  onComplete,
  onReview,
  variant = 'clinic',
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  const formatDateTime = (dateTime: string) => {
    const [date, time] = dateTime.split(' ');
    return { date, time };
  };

  const { date, time } = formatDateTime(appointment.scheduledDateTime);

  const variantColors = {
    doctor: 'bg-teal-50 text-teal-600',
    clinic: 'bg-[#006767]/10 text-[#006767]',
    diagnostic: 'bg-primary/10 text-primary',
    patient: 'bg-primary/10 text-primary',
  };

  const canReview = appointment.status === 'Completed' && !appointment.hasReviewed && onReview;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0b1c30]">Appointment Details</DialogTitle>
          <DialogDescription className="text-[#3d4949]">
            Complete information about this appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient/Provider Info based on variant */}
          <div className="flex items-center gap-4 p-4 bg-[#EFF4FF] rounded-xl">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold", variantColors[variant])}>
              {variant === 'patient' 
                ? appointment.providerName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PR'
                : appointment.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)
              }
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#0b1c30]">
                {variant === 'patient' ? appointment.providerName || 'Provider' : appointment.patientName}
              </h3>
              {variant === 'patient' && appointment.providerSpecialty && (
                <p className="text-sm text-[#6d7979]">{appointment.providerSpecialty}</p>
              )}
              {variant !== 'patient' && appointment.patientId && (
                <p className="text-sm text-[#6d7979]">ID: {appointment.patientId}</p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-3">
            {appointment.serviceName && (
              <DetailRow label="Service" value={appointment.serviceName} />
            )}
            {appointment.serviceDescription && (
              <DetailRow label="Description" value={appointment.serviceDescription} />
            )}
            <DetailRow label="Date & Time" value={`${date} at ${time}`} />
            {appointment.location && <DetailRow label="Location" value={appointment.location} />}
            {appointment.locationDetail && (
              <DetailRow label="Location Detail" value={appointment.locationDetail} />
            )}
            <div className="flex justify-between py-2 border-b border-[#E0E7FF]">
              <span className="text-[#6d7979]">Status</span>
              <StatusBadge status={appointment.status as any} />
            </div>
            {appointment.fee && (
              <DetailRow label="Fee" value={`ETB ${appointment.fee.toLocaleString()}`} />
            )}
            {appointment.paymentStatus && (
              <div className="flex justify-between py-2 border-b border-[#E0E7FF]">
                <span className="text-[#6d7979]">Payment Status</span>
                <StatusBadge status={appointment.paymentStatus as any} variant="payment" />
              </div>
            )}
            {appointment.cardNumber && variant !== 'patient' && (
              <DetailRow label="Card Number" value={appointment.cardNumber} monospace />
            )}
            {appointment.notes && <DetailRow label="Notes" value={appointment.notes} />}
            {variant === 'patient' && appointment.providerPhone && (
              <DetailRow label="Provider Phone" value={appointment.providerPhone} icon={<Phone className="h-4 w-4" />} />
            )}
            {variant === 'patient' && appointment.providerEmail && (
              <DetailRow label="Provider Email" value={appointment.providerEmail} icon={<Mail className="h-4 w-4" />} />
            )}
            {variant !== 'patient' && appointment.patientPhone && (
              <DetailRow label="Patient Phone" value={appointment.patientPhone} icon={<Phone className="h-4 w-4" />} />
            )}
            {variant !== 'patient' && appointment.patientEmail && (
              <DetailRow label="Patient Email" value={appointment.patientEmail} icon={<Mail className="h-4 w-4" />} />
            )}
          </div>

          <DialogFooter className="gap-3 flex-wrap">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Close
            </Button>
            {onReschedule && appointment.status === 'Scheduled' && (
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onReschedule(appointment);
                }}
                className="rounded-xl"
              >
                Reschedule
              </Button>
            )}
            {onStart && (appointment.status === 'Checked-in' || appointment.status === 'Confirmed') && (
              <Button
                onClick={() => {
                  onStart(appointment);
                  onOpenChange(false);
                }}
                className="rounded-xl bg-[#006767] hover:bg-[#008282] text-white"
              >
                Start Consultation
              </Button>
            )}
            {canReview && (
              <Button
                onClick={() => {
                  onReview(appointment);
                  onOpenChange(false);
                }}
                className="rounded-xl bg-[#008282] hover:bg-[#00a0a0] text-white"
              >
                <Star className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value, monospace, icon }: { label: string; value: string; monospace?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-[#E0E7FF]">
      <span className="text-[#6d7979] flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className={cn("font-medium text-[#0b1c30]", monospace && "font-mono text-sm")}>
        {value}
      </span>
    </div>
  );
}