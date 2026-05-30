// components/appointmentBooking/ServiceCard.tsx
"use client"

import { motion } from "framer-motion"
import { ChevronRight, Clock3, Sparkles, FileText, Stethoscope, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Service } from "@/types/entities/service.types"

type ProviderType = "doctor" | "clinic" | "diagnostic"

interface ServiceCardProps {
  service: Service
  providerType: ProviderType
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

export function ServiceCard({ service, providerType, isSelected = false, onClick, variant = "expanded" }: ServiceCardProps) {
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
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div className="flex gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#006767]/10 to-[#008282]/10 flex items-center justify-center shadow-inner text-[#006767] font-black text-base sm:text-lg">
              {getInitials(service.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Badge className="rounded-full bg-[#006767]/10 text-[#006767] hover:bg-[#006767]/10 border-0 text-[10px] sm:text-xs">
                  Verified
                </Badge>
                <Badge variant="secondary" className="rounded-full text-[10px] sm:text-xs">
                  Available
                </Badge>
              </div>
              <h3 className="text-base sm:text-xl font-black text-[#0b1c30] leading-tight">{service.name}</h3>
              <p className="text-[#006767] font-semibold mt-0.5 sm:mt-1 text-xs sm:text-sm">{service.serviceType}</p>
            </div>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-[#006767]" />
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</span>
          </div>
          <p className="text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm min-h-[40px] sm:min-h-[72px]">
            {service.description || "Professional healthcare service with experienced providers and modern care facilities."}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-5">
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">
            <Clock3 className="h-3 w-3 sm:h-4 sm:w-4 text-[#006767]" />
            {service.durationMinutes} mins
          </div>
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#006767]" />
            Same Day
          </div>
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-[#006767]/5 border border-[#006767]/20 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#006767]">
            <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" />
            ETB {service.standardFee}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500">Status</p>
            <h5 className="font-bold text-[#0b1c30] text-sm sm:text-base">Ready for Booking</h5>
          </div>
          <button className="h-9 sm:h-12 px-3 sm:px-5 rounded-xl sm:rounded-2xl bg-[#006767] text-white font-semibold inline-flex items-center gap-1 sm:gap-2 hover:bg-[#008282] transition-all shadow-lg shadow-[#006767]/20 text-xs sm:text-sm">
            Select
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}