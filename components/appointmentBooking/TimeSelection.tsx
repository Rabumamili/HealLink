// components/booking/TimeSelection.tsx
"use client"

import { cn } from "@/lib/utils"

interface TimeSelectionProps {
  timeSlots: string[]
  selectedTime: string
  onTimeSelect: (time: string) => void
}

export function TimeSelection({ timeSlots, selectedTime, onTimeSelect }: TimeSelectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-2xl text-[#0b1c30]">Select Time</h3>
      <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={cn(
              "py-3 rounded-xl text-sm font-bold transition-all border",
              selectedTime === time
                ? "border-2 border-[#006767] bg-[#006767]/5 text-[#006767]"
                : "border-[#bcc9c8]/30 hover:border-[#006767] hover:text-[#006767]"
            )}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}