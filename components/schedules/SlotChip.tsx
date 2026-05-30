'use client';

import { Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SlotChip({
  slot,
  day,
  type,
  onRemove,
}: {
  slot: any;
  day: string;
  type: 'clinic' | 'doctor' | 'diagnostic';
  onRemove: (day: string, id: string) => void;
}) {
  const start = slot.startTime || slot.start;
  const end = slot.endTime || slot.end;

  const label =
    type === 'diagnostic'
      ? `${slot.type} • ${start}-${end} • ${slot.maxPatients ?? 0}`
      : type === 'doctor'
      ? `${slot.type} • ${start}-${end}`
      : `${start}-${end}`;

  const color =
    type === 'clinic'
      ? 'bg-teal-50 border-teal-200 text-teal-700'
      : type === 'doctor'
      ? 'bg-purple-50 border-purple-200 text-purple-700'
      : 'bg-blue-50 border-blue-200 text-blue-700';

  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition hover:shadow-sm",
        color
      )}
    >
      <Clock className="h-3.5 w-3.5 opacity-70" />
      <span className="whitespace-nowrap">{label}</span>

      <button
        onClick={() => onRemove(day, slot.id)}
        className="opacity-0 group-hover:opacity-100 transition hover:text-red-500"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}