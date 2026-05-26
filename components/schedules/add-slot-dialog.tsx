// components/schedules/add-slot-dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (slotData: any) => void;
  dayName?: string;
  type: 'clinic' | 'diagnostic' | 'doctor';
}

export function AddSlotDialog({ open, onOpenChange, onAdd, dayName, type }: AddSlotDialogProps) {
  const [slotData, setSlotData] = useState({
    startTime: "09:00",
    endTime: type === 'clinic' ? "17:00" : "17:00",
    shift: "Full Day",
    type: type === 'diagnostic' ? "morning" : "shift",
    maxPatients: type === 'diagnostic' ? 20 : 1
  });

  const handleAdd = () => {
    const slot = {
      id: Date.now().toString(),
      ...slotData
    };
    
    if (type === 'clinic') {
      onAdd({
        startTime: slotData.startTime,
        endTime: slotData.endTime,
        shift: slotData.shift
      });
    } else if (type === 'diagnostic') {
      onAdd({
        start: slotData.startTime,
        end: slotData.endTime,
        type: slotData.type,
        maxPatients: slotData.maxPatients
      });
    } else {
      onAdd({
        start: slotData.startTime,
        end: slotData.endTime,
        type: slotData.type
      });
    }
    
    setSlotData({
      startTime: "09:00",
      endTime: type === 'clinic' ? "17:00" : "17:00",
      shift: "Full Day",
      type: type === 'diagnostic' ? "morning" : "shift",
      maxPatients: type === 'diagnostic' ? 20 : 1
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Time Slot - {dayName}</DialogTitle>
          <DialogDescription>
            {type === 'clinic' 
              ? 'Add operating hours for this day'
              : type === 'diagnostic'
              ? 'Add a new time slot for this day'
              : 'Add a new time slot for this day'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={slotData.startTime}
                onChange={(e) => setSlotData({ ...slotData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={slotData.endTime}
                onChange={(e) => setSlotData({ ...slotData, endTime: e.target.value })}
              />
            </div>
          </div>

          {/* Shift Name for Clinic */}
          {type === 'clinic' && (
            <div className="space-y-2">
              <Label>Shift Name (Optional)</Label>
              <Input 
                placeholder="e.g., Morning Shift, Full Day"
                value={slotData.shift}
                onChange={(e) => setSlotData({ ...slotData, shift: e.target.value })}
              />
            </div>
          )}

          {/* Time Period Type for Diagnostic */}
          {type === 'diagnostic' && (
            <>
              <div className="space-y-2">
                <Label>Time Period Type</Label>
                <Select value={slotData.type} onValueChange={(v) => setSlotData({ ...slotData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning Session</SelectItem>
                    <SelectItem value="afternoon">Afternoon Session</SelectItem>
                    <SelectItem value="evening">Evening Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Maximum Patients</Label>
                <Input
                  type="number"
                  value={slotData.maxPatients}
                  onChange={(e) => setSlotData({ ...slotData, maxPatients: parseInt(e.target.value) })}
                />
              </div>
            </>
          )}

          {/* Slot Type for Doctor */}
          {type === 'doctor' && (
            <div className="space-y-2">
              <Label>Slot Type</Label>
              <Select value={slotData.type} onValueChange={(v) => setSlotData({ ...slotData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shift">Shift</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="consultation">Consultation Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAdd}>
            Add Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}