// components/profiles/patient/PatientEmergencyContact.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Phone, Users } from 'lucide-react';

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface PatientEmergencyContactProps {
  contact: EmergencyContact;
  onUpdate: (contact: EmergencyContact) => void;
  isEditing?: boolean;
}

export function PatientEmergencyContact({ contact, onUpdate, isEditing = false }: PatientEmergencyContactProps) {
  const updateField = <K extends keyof EmergencyContact>(field: K, value: EmergencyContact[K]) => {
    onUpdate({ ...contact, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserPlus className="h-5 w-5 text-teal-600" />
          <CardTitle className="text-2xl font-semibold">Emergency Contact</CardTitle>
        </div>
        <CardDescription>Person to contact in case of emergency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                value={contact.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="bg-muted/50"
              />
            ) : (
              <p>{contact.name || 'Not specified'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Relationship</Label>
            {isEditing ? (
              <Select value={contact.relationship} onValueChange={(v) => updateField('relationship', v)}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p>{contact.relationship || 'Not specified'}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                value={contact.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="bg-muted/50"
              />
            ) : (
              <p>{contact.phone || 'Not specified'}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}