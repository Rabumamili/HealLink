// components/appointmentBooking/ServiceCard.tsx
"use client"

import { motion } from "framer-motion"
import { ChevronRight, Clock3, Sparkles, FileText, Stethoscope, Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Service } from "@/types/entities/service.types"

type ProviderType = "doctor" | "clinic" | "diagnostic"

interface ServiceCardProps {
  service: Service
  providerType: ProviderType
  providerName?: string
  providerAvatar?: string
  isSelected?: boolean
  onClick?: (service: Service) => void
  variant?: "default" | "compact" | "expanded"
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function ServiceCard({ service, providerType, providerName, providerAvatar, isSelected = false, onClick, variant = "expanded" }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.(service)}
      className={cn(
        "group relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-white cursor-pointer transition-all",
        isSelected
          ? "border-[#006767] ring-2 sm:ring-4 ring-[#006767]/10"
          : "border-gray-200 hover:border-[#006767]/30 hover:shadow-xl sm:hover:shadow-2xl"
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[#006767]/5 to-transparent" />

      <div className="relative p-4 sm:p-6">
        {/* First line: Provider name and avatar */}
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          {providerAvatar ? (
            <img
              src={providerAvatar}
              alt={providerName || "Provider"}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#006767]/10"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#006767]/10 to-[#008282]/10 flex items-center justify-center text-[#006767] font-black text-sm sm:text-base">
              {getInitials(providerName || "Provider")}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-[#0b1c30] truncate">{providerName || "Healthcare Provider"}</h4>
            <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs sm:text-sm text-gray-600">4.8</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs sm:text-sm text-gray-600 capitalize">{providerType}</span>
            </div>
          </div>
        </div>

        {/* Second line: Service name and description */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-black text-[#0b1c30] leading-tight mb-1 sm:mb-2">{service.name}</h3>
          <p className="text-gray-600 leading-relaxed line-clamp-2 text-xs sm:text-sm min-h-[32px] sm:min-h-[40px]">
            {service.description || "Professional healthcare service with experienced providers and modern care facilities."}
          </p>
        </div>

        {/* Service details */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">
            <Clock3 className="h-3 w-3 sm:h-4 sm:w-4 text-[#006767]" />
            {service.durationMinutes} mins
          </div>
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-[#006767]" />
            {service.location}
          </div>
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-[#006767]/5 border border-[#006767]/20 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#006767]">
            <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" />
            ETB {service.standardFee}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100 border-0 text-[10px] sm:text-xs">
              Available
            </Badge>
          </div>
          <button className="h-8 sm:h-10 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-[#006767] text-white font-semibold inline-flex items-center gap-1 sm:gap-2 hover:bg-[#008282] transition-all shadow-lg shadow-[#006767]/20 text-xs sm:text-sm">
            Book Now
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}