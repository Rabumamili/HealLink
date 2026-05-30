// components/booking/DateSelection.tsx
"use client"

import { HealLinkIcon } from "@/components/icons/healink-icon"
import { cn } from "@/lib/utils"

export interface DateOption {
  day: string
  date: number
  month: number
  year: number
  fullDate: string
  available: boolean
  active: boolean
}

interface DateSelectionProps {
  dates: DateOption[]
  selectedDate: DateOption
  onDateSelect: (date: DateOption) => void
  title?: string
  variant?: 'default' | 'compact' | 'minimal'
}

export function DateSelection({ 
  dates, 
  selectedDate, 
  onDateSelect, 
  title = "Select Date",
  variant = 'default'
}: DateSelectionProps) {
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
        <HealLinkIcon name="calendar" size={variant === 'default' ? 20 : 16} className="text-[#006767]" />
        {title}
      </h3>
      
      <div className={cn(
        "grid gap-3",
        variant === 'default' && "grid-cols-3 sm:grid-cols-4 md:grid-cols-7",
        variant === 'compact' && "grid-cols-4 sm:grid-cols-7",
        variant === 'minimal' && "grid-cols-3 sm:grid-cols-5 md:grid-cols-7"
      )}>
        {dates.map((date, idx) => (
          <button
            key={idx}
            onClick={() => date.available && onDateSelect(date)}
            disabled={!date.available}
            className={cn(
              "rounded-xl text-center transition-all",
              variant === 'default' && "py-3",
              variant === 'compact' && "py-2",
              variant === 'minimal' && "py-2",
              selectedDate.fullDate === date.fullDate 
                ? "bg-[#006767] text-white shadow-md" 
                : "bg-gray-50 text-[#0b1c30] hover:bg-[#006767]/10 border border-gray-100",
              !date.available && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "font-medium",
              variant === 'default' && "text-xs",
              variant === 'compact' && "text-[10px]",
              variant === 'minimal' && "text-[10px]"
            )}>{date.day}</div>
            <div className={cn(
              "font-bold",
              variant === 'default' && "text-xl",
              variant === 'compact' && "text-base",
              variant === 'minimal' && "text-sm"
            )}>{date.date}</div>
            <div className={cn(
              variant === 'default' && "text-[10px]",
              variant === 'compact' && "text-[8px]",
              variant === 'minimal' && "text-[8px]"
            )}>{date.month}/{date.year}</div>
          </button>
        ))}
      </div>
    </div>
  )
}