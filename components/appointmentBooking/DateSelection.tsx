// components/booking/DateSelection.tsx
"use client"

import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateOption {
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
}

export function DateSelection({ dates, selectedDate, onDateSelect }: DateSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl text-[#0b1c30]">Select Date</h3>
        <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2 rounded-xl border border-[#bcc9c8]/20">
          <Calendar className="h-4 w-4 text-[#006767]" />
          <span className="text-sm font-bold">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, idx) => (
          <button
            key={idx}
            disabled={!date.available}
            onClick={() => onDateSelect(date)}
            className={cn(
              "py-3 rounded-xl text-sm font-bold transition-all text-center space-y-1",
              selectedDate?.date === date.date && selectedDate?.month === date.month
                ? "bg-[#006767] text-white shadow-lg shadow-[#006767]/20"
                : date.available
                ? "hover:bg-[#e5eeff] text-[#0b1c30] border border-transparent"
                : "opacity-40 cursor-not-allowed text-[#6d7979]"
            )}
          >
            <div className="text-xs font-bold">{date.day}</div>
            <div className="text-base">{date.date}</div>
          </button>
        ))}
      </div>
    </div>
  )
}