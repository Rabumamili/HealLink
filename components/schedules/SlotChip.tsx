// components/schedules/SlotChip.tsx
'use client';

import { Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SlotChipProps {
  slot: any;
  day: string;
  type: 'clinic' | 'doctor' | 'diagnostic';
  onRemove: (day: string, id: string) => void;
}

export function SlotChip({ slot, day, type, onRemove }: SlotChipProps) {
  const [showRemove, setShowRemove] = useState(false);
  
  const start = slot.startTime || slot.start;
  const end = slot.endTime || slot.end;

  const getLabel = () => {
    if (type === 'diagnostic') {
      const sessionType = slot.type === 'morning' ? '🌅 Morning' : slot.type === 'afternoon' ? '☀️ Afternoon' : '🌙 Evening';
      return `${sessionType} • ${start}-${end} • ${slot.maxCapacity || slot.maxPatients || 20} pts`;
    }
    if (type === 'doctor') {
      const slotType = slot.type === 'consultation' ? '💊 Consult' : slot.type === 'break' ? '☕ Break' : '🔄 Shift';
      return `${slotType} • ${start}-${end}`;
    }
    return `${start}-${end}${slot.shift ? ` • ${slot.shift}` : ''}`;
  };

  const getColor = () => {
    if (type === 'clinic') return 'bg-[#008282]/10 border-[#008282]/20 text-[#008282] hover:bg-[#008282]/20';
    if (type === 'doctor') {
      if (slot.type === 'consultation') return 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100';
      if (slot.type === 'break') return 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100';
      return 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100';
    }
    return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:shadow-sm",
        getColor()
      )}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <Clock className="h-3 w-3 opacity-70" />
      <span className="whitespace-nowrap">{getLabel()}</span>

      <button
        onClick={() => onRemove(day, slot.id)}
        className={cn(
          "ml-1 transition-all duration-200 hover:text-red-500 rounded-full p-0.5",
          showRemove ? "opacity-100" : "opacity-0"
        )}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}