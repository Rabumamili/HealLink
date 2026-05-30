// components/booking/TimeSelection.tsx
"use client"

import { HealLinkIcon } from "@/components/icons/healink-icon"
import { cn } from "@/lib/utils"

interface TimeSelectionProps {
  timeSlots: string[]
  selectedTime: string
  onTimeSelect: (time: string) => void
  title?: string
  variant?: 'default' | 'compact' | 'minimal'
  columns?: 4 | 5 | 6
}

export function TimeSelection({ 
  timeSlots, 
  selectedTime, 
  onTimeSelect, 
  title = "Select Time",
  variant = 'default',
  columns = 6
}: TimeSelectionProps) {
  const columnClasses = {
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
    6: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
  }

  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-200 shadow-sm",
      variant === 'default' && "p-6",
      variant === 'compact' && "p-4",
      variant === 'minimal' && "p-0 border-0 shadow-none"
    )}>
      <h3 className={cn(
        "font-bold text-[#0b1c30] mb-4 flex items-center gap-2",
        variant === 'default' && "text-lg",
        variant === 'compact' && "text-base",
        variant === 'minimal' && "text-sm"
      )}>
        <HealLinkIcon name="schedule" size={variant === 'default' ? 20 : 16} className="text-[#006767]" />
        {title}
      </h3>
      
      <div className={cn(
        "grid gap-2",
        columnClasses[columns],
        variant === 'compact' && "gap-1.5"
      )}>
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={cn(
              "rounded-lg text-center transition-all",
              variant === 'default' && "py-2 px-3 text-sm",
              variant === 'compact' && "py-1.5 px-2 text-xs",
              variant === 'minimal' && "py-1.5 px-2 text-xs",
              selectedTime === time 
                ? "bg-[#006767] text-white" 
                : "bg-gray-50 text-[#0b1c30] hover:bg-[#006767]/10 border border-gray-100"
            )}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}