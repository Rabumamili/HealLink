// components/appointments/RescheduleDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppointmentCardData } from './AppointmentCards';
import { cn } from '@/lib/utils';

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentCardData | null;
  onConfirm: (appointment: AppointmentCardData, date: string, time: string) => Promise<void>;
}

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

export function RescheduleDialog({ open, onOpenChange, appointment, onConfirm }: RescheduleDialogProps) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!appointment) return null;

  const formatDateTime = (dateTime: string) => {
    const [date, time] = dateTime.split(' ');
    return { date, time };
  };

  const { date: currentDate, time: currentTime } = formatDateTime(appointment.scheduledDateTime);

  const handleConfirm = async () => {
    if (!newDate || !newTime) return;
    setIsLoading(true);
    await onConfirm(appointment, newDate, newTime);
    setIsLoading(false);
    onOpenChange(false);
    setNewDate('');
    setNewTime('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0b1c30]">Reschedule Appointment</DialogTitle>
          <DialogDescription className="text-[#3d4949]">
            Select a new date and time for this appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-[#EFF4FF] rounded-xl space-y-1">
            <p className="text-sm text-[#6d7979]">
              Patient: <span className="font-medium text-[#0b1c30]">{appointment.patientName}</span>
            </p>
            {appointment.serviceName && (
              <p className="text-sm text-[#6d7979]">
                Service: <span className="font-medium text-[#0b1c30]">{appointment.serviceName}</span>
              </p>
            )}
            <p className="text-sm text-[#6d7979]">
              Current: <span className="font-medium text-[#0b1c30]">{currentDate} at {currentTime}</span>
            </p>
          </div>

          <div>
            <Label className="text-[#3d4949]">New Date</Label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-1 rounded-xl border-[#E0E7FF] focus:ring-[#006767]"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label className="text-[#3d4949]">New Time</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={newTime === time ? "default" : "outline"}
                  className={cn(
                    "rounded-xl",
                    newTime === time && "bg-[#006767] hover:bg-[#008282]"
                  )}
                  onClick={() => setNewTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl"
            onClick={handleConfirm}
            disabled={!newDate || !newTime || isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Reschedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}