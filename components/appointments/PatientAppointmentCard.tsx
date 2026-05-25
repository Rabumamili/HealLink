// components/appointment/PatientAppointmentCard.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, MapPin, CreditCard, Phone, X, Calendar, Star, Award, GraduationCap, Stethoscope, Building2, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types/entities/appointment.types';

const statusConfig: Record<string, { label: string; className: string }> = {
  "Scheduled": { label: "SCHEDULED", className: "bg-blue-100 text-blue-700" },
  "Checked-in": { label: "CHECKED IN", className: "bg-green-100 text-green-700" },
  "In Progress": { label: "IN PROGRESS", className: "bg-purple-100 text-purple-700" },
  "Completed": { label: "COMPLETED", className: "bg-gray-100 text-gray-600" },
  "Cancelled": { label: "CANCELLED", className: "bg-red-50 text-red-600" },
  "No-show": { label: "NO-SHOW", className: "bg-red-50 text-red-600" },
};

const providerIcons = {
  doctor: Stethoscope,
  clinic: Building2,
  diagnostic: FlaskConical,
};

const providerTypeLabels = {
  doctor: "Specialist",
  clinic: "Medical Center",
  diagnostic: "Diagnostic Lab",
};

interface PatientAppointmentCardProps {
  appointment: Appointment;
  isPast?: boolean;
  onCancel?: () => void;
  onContact?: () => void;
}

export const PatientAppointmentCard = ({
  appointment,
  isPast = false,
  onCancel,
  onContact,
}: PatientAppointmentCardProps) => {
  const status = statusConfig[appointment.status] || statusConfig["Scheduled"];
  const initials = appointment.patientName.split(" ").map(n => n[0]).join("");

  return (
    <div className="bg-white rounded-2xl border border-[#E0E7FF] shadow-[0_4px_20px_rgba(0,139,139,0.05)] hover:shadow-md transition-all p-5 md:p-6">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-2xl">
            <AvatarImage src={appointment.providerImage} alt={appointment.providerName} className="object-cover" />
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
                <h3 className="text-xl font-bold text-[#0b1c30]">{appointment.providerName || appointment.serviceName}</h3>
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase", status.className)}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#3d4949] mt-1">
                <span className="text-sm">{appointment.serviceName}</span>
                <span className="text-xs text-[#6d7979]">• {appointment.providerType === 'doctor' ? 'Specialist' : appointment.providerType === 'clinic' ? 'Medical Center' : 'Diagnostic Lab'}</span>
              </div>
            </div>
            {appointment.rating && (
              <div className="flex items-center gap-1 bg-[#EFF4FF] px-3 py-1.5 rounded-full self-start md:self-center">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-semibold text-[#0b1c30]">{appointment.rating}</span>
                <span className="text-xs text-[#6d7979]">({appointment.reviews} reviews)</span>
              </div>
            )}
          </div>

          {/* Provider Description */}
          {appointment.description && (
            <div className="bg-[#F8F9FF] rounded-xl p-4 space-y-2">
              <p className="text-sm text-[#3d4949] leading-relaxed">{appointment.description}</p>
              {appointment.specialization && (
                <div className="flex items-center gap-2 text-xs text-primary mt-2 pt-2 border-t border-[#E0E7FF]">
                  <Award className="h-3 w-3" />
                  <span className="font-semibold">Specialization:</span>
                  <span>{appointment.specialization}</span>
                </div>
              )}
              {appointment.experience && (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Clock className="h-3 w-3" />
                  <span className="font-semibold">Experience:</span>
                  <span>{appointment.experience}</span>
                </div>
              )}
              {appointment.education && (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <GraduationCap className="h-3 w-3" />
                  <span className="font-semibold">Education:</span>
                  <span className="truncate">{appointment.education}</span>
                </div>
              )}
            </div>
          )}

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
              <div>
                <p className="text-[11px] font-semibold text-[#6d7979] uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-[#0b1c30]">{appointment.location}</p>
                {appointment.locationDetail && (
                  <p className="text-xs text-[#6d7979]">{appointment.locationDetail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {!isPast && appointment.cardNumber && (
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6" asChild>
                <Link href={`/patient/card-numbers?appointment=${appointment.id}`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  View Card
                </Link>
              </Button>
            )}
            
            <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5" onClick={onContact}>
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </Button>

            {!isPast && appointment.status !== "Cancelled" && appointment.status !== "Completed" && appointment.status !== "No-show" && (
              <>
                <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5">
                  <Calendar className="mr-2 h-4 w-4" />
                  Reschedule
                </Button>
                <Button variant="ghost" className="rounded-xl text-red-600 hover:bg-red-50" onClick={onCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};