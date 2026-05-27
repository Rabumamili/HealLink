// components/booking/ServiceTypeTabs.tsx
"use client"

import { Stethoscope, FlaskConical, Building2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ServiceType } from "@/types/entities/service.types"

interface ServiceTypeTabsProps {
  activeTab: ServiceType
  onTabChange: (tab: ServiceType) => void
}

const tabs = [
  { id: "Consultation" as ServiceType, label: "Consultations", icon: Stethoscope },
  { id: "Diagnostic" as ServiceType, label: "Diagnostics", icon: FlaskConical },
  { id: "Vaccination" as ServiceType, label: "Vaccinations", icon: Building2 },
  { id: "Procedure" as ServiceType, label: "Procedures", icon: Users },
]

export function ServiceTypeTabs({ activeTab, onTabChange }: ServiceTypeTabsProps) {
  return (
    <div className="bg-white rounded-2xl p-1.5 border border-[#bcc9c8]/30 w-fit shadow-sm">
      <div className="flex gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-6 md:px-8 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-[#006767] text-white shadow-md"
                  : "text-[#515f78] hover:bg-[#d6e3ff]/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}