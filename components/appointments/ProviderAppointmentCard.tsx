// components/appointment/ProviderAppointmentCard.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, MapPin, CreditCard, Eye, CalendarPlus, UserCheck, DollarSign, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types/entities/appointment.types';

const statusConfig: Record<string, { label: string; className: string }> = {
  "Scheduled": { label: "SCHEDULED", className: "bg-yellow-100 text-yellow-700" },
  "Checked-in": { label: "CHECKED IN", className: "bg-green-100 text-green-700" },
  "In Progress": { label: "IN PROGRESS", className: "bg-blue-100 text-blue-700" },
  "Completed": { label: "COMPLETED", className: "bg-gray-100 text-gray-600" },
  "Cancelled": { label: "CANCELLED", className: "bg-red-50 text-red-600" },
  "No-show": { label: "NO-SHOW", className: "bg-red-50 text-red-600" },
};

interface ProviderAppointmentCardProps {
  appointment: Appointment;
  isPast?: boolean;
  onView?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  onStart?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  showCheckin?: boolean;
}

export const ProviderAppointmentCard = ({
  appointment,
  isPast = false,
  onView,
  onReschedule,
  onStart,
  onCancel,
  showCheckin = false,
}: ProviderAppointmentCardProps) => {
  const status = statusConfig[appointment.status] || statusConfig["Scheduled"];
  const initials = appointment.patientName.split(" ").map(n => n[0]).join("");

  return (
    <div className="bg-white rounded-2xl border border-[#E0E7FF] shadow-[0_4px_20px_rgba(0,139,139,0.05)] hover:shadow-md transition-all p-5 md:p-6">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-2xl">
            <AvatarImage src={appointment.providerImage} alt={appointment.patientName} className="object-cover" />
            <AvatarFallback className="rounded-2xl bg-primary/10 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isPast && appointment.status === "Checked-in" && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-[#0b1c30]">{appointment.patientName}</h3>
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase", status.className)}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#3d4949] mt-1">
                <span className="text-sm">{appointment.serviceName}</span>
                <span className="text-xs text-[#6d7979]">• ID: {appointment.patientId}</span>
              </div>
            </div>
            {appointment.rating && (
              <div className="flex items-center gap-1 bg-[#EFF4FF] px-3 py-1.5 rounded-full self-start md:self-center">
                <span className="text-sm font-semibold text-[#0b1c30]">{appointment.rating}</span>
                <span className="text-xs text-[#6d7979]">({appointment.reviews} reviews)</span>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-[#E0E7FF]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-primary">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6d7979] uppercase tracking-wider">Date</p>
                <p className="text-sm font-semibold text-[#0b1c30]">{appointment.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6d7979] uppercase tracking-wider">Time</p>
                <p className="text-sm font-semibold text-[#0b1c30]">{appointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-primary">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button 
              variant="outline" 
              className="rounded-xl border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5"
              onClick={() => onView?.(appointment)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            
            {!isPast && onReschedule && appointment.status === "Scheduled" && (
              <Button 
                variant="outline" 
                className="rounded-xl border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5"
                onClick={() => onReschedule(appointment)}
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
            )}
            
            {!isPast && showCheckin && appointment.status === "Checked-in" && onStart && (
              <Button 
                className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl"
                onClick={() => onStart(appointment)}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Start Consultation
              </Button>
            )}
            
            {!isPast && appointment.status === "Scheduled" && onCancel && (
              <Button 
                variant="ghost" 
                className="rounded-xl text-red-600 hover:bg-red-50"
                onClick={() => onCancel?.(appointment)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            
            {!isPast && appointment.cardNumber && (
              <Button 
                variant="outline" 
                className="rounded-xl border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5"
                asChild
              >
                <Link href={`/patient/card-numbers?appointment=${appointment.id}`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  View Card
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};