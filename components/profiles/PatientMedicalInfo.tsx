// components/profiles/patient/PatientMedicalInfo.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Droplets, Pill, AlertCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface MedicalInfo {
  bloodType: string;
  height: number;
  weight: number;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
}

interface PatientMedicalInfoProps {
  medicalInfo: MedicalInfo;
  onUpdate: (medicalInfo: MedicalInfo) => void;
  isEditing?: boolean;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function PatientMedicalInfo({ medicalInfo, onUpdate, isEditing = false }: PatientMedicalInfoProps) {
  const [localInfo, setLocalInfo] = useState(medicalInfo);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const updateField = <K extends keyof MedicalInfo>(field: K, value: MedicalInfo[K]) => {
    const updated = { ...localInfo, [field]: value };
    setLocalInfo(updated);
    onUpdate(updated);
  };

  const addItem = (field: 'allergies' | 'chronicConditions' | 'currentMedications', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      const updated = {
        ...localInfo,
        [field]: [...localInfo[field], value.trim()]
      };
      setLocalInfo(updated);
      onUpdate(updated);
      setter('');
      toast.success(`${value} added`);
    }
  };

  const removeItem = (field: 'allergies' | 'chronicConditions' | 'currentMedications', index: number) => {
    const updated = {
      ...localInfo,
      [field]: localInfo[field].filter((_, i) => i !== index)
    };
    setLocalInfo(updated);
    onUpdate(updated);
  };

  const getBadgeVariant = (field: string) => {
    switch (field) {
      case 'allergies': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'chronicConditions': return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'currentMedications': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-teal-600" />
          <CardTitle className="text-2xl font-semibold">Medical Information</CardTitle>
        </div>
        <CardDescription>Your health and medical details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Medical Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-red-500" />
              Blood Type
            </Label>
            {isEditing ? (
              <Select value={localInfo.bloodType} onValueChange={(v) => updateField('bloodType', v)}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-foreground">{localInfo.bloodType || 'Not specified'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Height (cm)</Label>
            {isEditing ? (
              <Input
                type="number"
                value={localInfo.height}
                onChange={(e) => updateField('height', Number(e.target.value))}
                className="bg-muted/50"
              />
            ) : (
              <p>{localInfo.height ? `${localInfo.height} cm` : 'Not specified'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            {isEditing ? (
              <Input
                type="number"
                value={localInfo.weight}
                onChange={(e) => updateField('weight', Number(e.target.value))}
                className="bg-muted/50"
              />
            ) : (
              <p>{localInfo.weight ? `${localInfo.weight} kg` : 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            Allergies
          </Label>
          <div className="flex flex-wrap gap-2">
            {localInfo.allergies.map((allergy, index) => (
              <Badge key={index} className={getBadgeVariant('allergies')}>
                {allergy}
                {isEditing && (
                  <button onClick={() => removeItem('allergies', index)} className="ml-2 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add allergy..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('allergies', newAllergy, setNewAllergy)}
                className="bg-muted/50"
              />
              <Button variant="outline" size="sm" onClick={() => addItem('allergies', newAllergy, setNewAllergy)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Chronic Conditions */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Chronic Conditions
          </Label>
          <div className="flex flex-wrap gap-2">
            {localInfo.chronicConditions.map((condition, index) => (
              <Badge key={index} className={getBadgeVariant('chronicConditions')}>
                {condition}
                {isEditing && (
                  <button onClick={() => removeItem('chronicConditions', index)} className="ml-2 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add condition..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('chronicConditions', newCondition, setNewCondition)}
                className="bg-muted/50"
              />
              <Button variant="outline" size="sm" onClick={() => addItem('chronicConditions', newCondition, setNewCondition)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Current Medications */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-blue-500" />
            Current Medications
          </Label>
          <div className="flex flex-wrap gap-2">
            {localInfo.currentMedications.map((medication, index) => (
              <Badge key={index} className={getBadgeVariant('currentMedications')}>
                {medication}
                {isEditing && (
                  <button onClick={() => removeItem('currentMedications', index)} className="ml-2 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add medication..."
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('currentMedications', newMedication, setNewMedication)}
                className="bg-muted/50"
              />
              <Button variant="outline" size="sm" onClick={() => addItem('currentMedications', newMedication, setNewMedication)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}