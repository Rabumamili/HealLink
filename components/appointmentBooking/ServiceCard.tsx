// components/booking/ServiceCard.tsx
"use client"

import { Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Service } from "@/types/entities/service.types"

interface ServiceCardProps {
  service: Service
  isSelected: boolean
  onSelect: (service: Service) => void
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border transition-all cursor-pointer group hover:shadow-lg",
        isSelected
          ? "border-2 border-[#006767] bg-[#f0fdfa] shadow-lg"
          : "border border-[#bcc9c8]/30 hover:border-[#006767]/50"
      )}
      onClick={() => onSelect(service)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-[#0b1c30]">{service.name}</h4>
          <p className="text-sm text-[#6d7979] mt-1 line-clamp-2">{service.description}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#006767]" />
              <span>{service.durationMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#006767]" />
              <span>In-person</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#006767]">ETB {service.standardFee}</p>
          <Button
            variant="ghost"
            size="sm"
            className={cn("mt-2", isSelected ? "text-[#006767]" : "text-[#515f78]")}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </div>
      </div>
    </div>
  )
}