// components/schedules/schedule-settings.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface ScheduleSettingsProps {
  settings: {
    slotDuration?: string;
    bufferTime?: string;
    maxAppointmentsPerDay?: string;
    maxDailyPatients?: string;
    resultTurnaroundTime?: string;
    walkInAllowed?: boolean;
    requireAppointment?: boolean;
    breakDuration?: string;
    defaultSlotDuration?: string;
  };
  onSettingChange: (key: string, value: any) => void;
  type: 'clinic' | 'diagnostic' | 'doctor';
}

export function ScheduleSettings({ settings, onSettingChange, type }: ScheduleSettingsProps) {
  const isDiagnostic = type === 'diagnostic';
  const isDoctor = type === 'doctor';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-teal-600" />
          {isDoctor ? 'Global Settings' : isDiagnostic ? 'Center Settings' : 'Global Settings'}
        </CardTitle>
        <CardDescription>
          {isDoctor 
            ? 'Configure default settings for all appointments'
            : isDiagnostic
            ? 'Configure diagnostic center operating parameters'
            : 'Configure default settings for all appointments'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slot Duration - Common for all */}
        <div className="space-y-2">
          <Label>{isDiagnostic ? 'Default Test Slot Duration' : 'Slot Duration'}</Label>
          <Select 
            value={settings.slotDuration || settings.defaultSlotDuration || "30"} 
            onValueChange={(v) => onSettingChange(isDiagnostic ? 'defaultSlotDuration' : 'slotDuration', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buffer Time */}
        <div className="space-y-2">
          <Label>{isDiagnostic ? 'Buffer Between Tests' : 'Buffer Time'}</Label>
          <Select 
            value={settings.bufferTime || "5"} 
            onValueChange={(v) => onSettingChange('bufferTime', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 minutes</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max Appointments/Patients */}
        <div className="space-y-2">
          <Label>{isDiagnostic ? 'Maximum Daily Patients' : 'Max Appointments Per Day'}</Label>
          <Input 
            type="number" 
            value={settings.maxAppointmentsPerDay || settings.maxDailyPatients || "16"}
            onChange={(e) => onSettingChange(isDiagnostic ? 'maxDailyPatients' : 'maxAppointmentsPerDay', e.target.value)}
          />
        </div>

        {/* Doctor-specific: Break Duration */}
        {isDoctor && (
          <div className="space-y-2">
            <Label>Break Duration</Label>
            <Select 
              value={settings.breakDuration || "30"} 
              onValueChange={(v) => onSettingChange('breakDuration', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Diagnostic-specific */}
        {isDiagnostic && (
          <>
            <div className="space-y-2">
              <Label>Result Turnaround Time (hours)</Label>
              <Input
                type="number"
                value={settings.resultTurnaroundTime || "24"}
                onChange={(e) => onSettingChange('resultTurnaroundTime', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Allow Walk-ins</Label>
              <Switch
                checked={settings.walkInAllowed ?? true}
                onCheckedChange={(v) => onSettingChange('walkInAllowed', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require Appointment</Label>
              <Switch
                checked={settings.requireAppointment ?? false}
                onCheckedChange={(v) => onSettingChange('requireAppointment', v)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}