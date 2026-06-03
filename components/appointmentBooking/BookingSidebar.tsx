// components/appointmentBooking/BookingSidebar.tsx
"use client"

import {
  Clock3,
  ShieldCheck,
  MapPin,
  Star,
  CalendarDays,
  BadgeCheck,
  Phone,
  Mail,
  Building2,
  User,
  FlaskConical,
  FileText,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { Service } from "@/types/entities/service.types"

export interface ProviderDetails {
  id: number
  name: string
  type: 'doctor' | 'clinic' | 'diagnostic'
  specialty: string
  rating: number
  reviews: number
  image?: string
  location: string
  locationDetail?: string
  contactPhone: string
  contactEmail: string
  bio?: string
  experience?: string
  education?: string
}

interface BookingSidebarProps {
  service: Service
  provider: ProviderDetails | null
  totalAmount: number
  onPayNow: () => void
  onChapaPayment: () => void
  isLoading?: boolean
}

const ProviderIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'doctor':
      return <User className="h-5 w-5" />
    case 'clinic':
      return <Building2 className="h-5 w-5" />
    case 'diagnostic':
      return <FlaskConical className="h-5 w-5" />
    default:
      return <Building2 className="h-5 w-5" />
  }
}

export function BookingSidebar({
  service,
  provider,
  totalAmount,
  onPayNow,
  isLoading,
}: BookingSidebarProps) {
  return (
    <div className="sticky top-24 h-fit rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-xl shadow-gray-100">
      {/* Header Section - Service Summary */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#006767] via-[#007777] to-[#008282] p-6 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="relative z-10">
          <Badge className="bg-white/10 hover:bg-white/10 text-white border-white/20 rounded-full mb-4">
            Appointment Summary
          </Badge>

          <h2 className="text-2xl font-black leading-tight">
            {service.name}
          </h2>

          {/* Service Type Badge */}
          <Badge className="mt-2 bg-white/20 text-white border-0">
            {service.serviceType}
          </Badge>

          {/* Short Description in Header */}
          {service.description && (
            <p className="text-white/80 text-sm mt-3 leading-relaxed line-clamp-2">
              {service.description}
            </p>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Full Service Description Section */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-[#006767]" />
            <h3 className="font-bold text-[#0b1c30]">Service Description</h3>
          </div>
          
          <p className="text-gray-700 leading-relaxed text-sm">
            {service.description || "Professional healthcare service with experienced providers and modern care facilities. This service is designed to provide you with the best possible care experience."}
          </p>
          
          {/* Key benefits */}
          <div className="mt-4 pt-3 border-t border-blue-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              What to expect:
            </h4>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <BadgeCheck className="h-3.5 w-3.5 text-[#006767]" />
                Professional consultation with experienced provider
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <BadgeCheck className="h-3.5 w-3.5 text-[#006767]" />
                Modern facilities and equipment
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <BadgeCheck className="h-3.5 w-3.5 text-[#006767]" />
                Digital records and follow-up support
              </li>
            </ul>
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#006767]/10 flex items-center justify-center">
              {provider ? (
                <ProviderIcon type={provider.type} />
              ) : (
                <Building2 className="h-5 w-5 text-[#006767]" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-[#0b1c30]">
                  {provider?.name || "Healthcare Provider"}
                </h3>
                {provider && (
                  <Badge className="bg-[#006767]/10 text-[#006767] text-[10px]">
                    {provider.type === 'doctor' ? '👨‍⚕️ Doctor' : provider.type === 'clinic' ? '🏥 Clinic' : '🔬 Diagnostic'}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">{provider?.specialty || "Medical Services"}</p>
            </div>
            {provider && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold">{provider.rating}</span>
                <span className="text-xs text-gray-400">({provider.reviews})</span>
              </div>
            )}
          </div>

          {provider ? (
            <>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#006767] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-600">{provider.location}</p>
                    {provider.locationDetail && (
                      <p className="text-xs text-gray-400">{provider.locationDetail}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-[#006767]" />
                  <a href={`tel:${provider.contactPhone}`} className="text-gray-600 hover:text-[#006767]">
                    {provider.contactPhone}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-[#006767]" />
                  <a href={`mailto:${provider.contactEmail}`} className="text-gray-600 hover:text-[#006767] truncate">
                    {provider.contactEmail}
                  </a>
                </div>
              </div>

              {provider.bio && (
                <p className="mt-3 text-xs text-gray-500 line-clamp-2">
                  {provider.bio}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">
                Provider information will be available upon booking confirmation
              </p>
            </div>
          )}
        </div>

        {/* Service Details Section */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Service Details
              </p>

              <h3 className="font-black text-[#0b1c30] text-lg mt-1">
                {service.serviceType}
              </h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#006767]/10 flex items-center justify-center">
              <CalendarDays className="h-7 w-7 text-[#006767]" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock3 className="h-4 w-4 text-[#006767]" />
              <span>{service.durationMinutes} minutes consultation</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <BadgeCheck className="h-4 w-4 text-[#006767]" />
              <span>Verified healthcare provider</span>
            </div>
          </div>
        </div>

        {/* Preparation Instructions */}
        {service.preparationInstructions && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm mb-1">
                  Preparation Instructions
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  {service.preparationInstructions}
                </p>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* Pricing Section */}
        <div>
          <h4 className="font-bold text-[#0b1c30] mb-4">
            Booking Breakdown
          </h4>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Consultation Fee</span>
              <span className="font-semibold">ETB {totalAmount}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service Charge</span>
              <span className="font-semibold">ETB 0</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platform Fee</span>
              <span className="font-semibold">ETB 0</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>

              <span className="text-3xl font-black text-[#006767]">
                ETB {totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 rounded-2xl bg-[#006767]/5 border border-[#006767]/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#006767] mt-0.5" />

            <div>
              <h4 className="font-semibold text-[#0b1c30] text-sm">
                Secure Healthcare Booking
              </h4>

              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Your booking and payment information are securely encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6">
          <Button
            onClick={onPayNow}
            disabled={isLoading}
            className="h-14 w-full rounded-2xl bg-[#006767] hover:bg-[#008282] text-white font-bold text-base"
          >
            Continue Payment
          </Button>
        </div>
      </div>
    </div>
  )
}