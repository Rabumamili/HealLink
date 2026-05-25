// components/profiles/doctor/DoctorProfessionalInfo.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Stethoscope, Award, Building2, GraduationCap, Clock, DollarSign } from 'lucide-react';

interface ProfessionalInfo {
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  qualifications: string;
  education: string;
  hospital: string;
  bio: string;
}

interface DoctorProfessionalInfoProps {
  info: ProfessionalInfo;
  onUpdate: (info: ProfessionalInfo) => void;
  isEditing?: boolean;
}

export function DoctorProfessionalInfo({ info, onUpdate, isEditing = false }: DoctorProfessionalInfoProps) {
  const updateField = <K extends keyof ProfessionalInfo>(field: K, value: ProfessionalInfo[K]) => {
    onUpdate({ ...info, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Stethoscope className="h-5 w-5 text-teal-600" />
          <CardTitle className="text-2xl font-semibold">Professional Information</CardTitle>
        </div>
        <CardDescription>Your medical credentials and practice details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Specialization
            </Label>
            {isEditing ? (
              <Input
                value={info.specialization}
                onChange={(e) => updateField('specialization', e.target.value)}
                className="bg-muted/50"
              />
            ) : (
              <p>{info.specialization}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              License Number
            </Label>
            {isEditing ? (
              <Input
                value={info.licenseNumber}
                onChange={(e) => updateField('licenseNumber', e.target.value)}
                className="bg-muted/50"
              />
            ) : (
              <p className="font-mono">{info.licenseNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Years of Experience
            </Label>
            {isEditing ? (
              <Input
                type="number"
                value={info.yearsOfExperience}
                onChange={(e) => updateField('yearsOfExperience', Number(e.target.value))}
                className="bg-muted/50"
              />
            ) : (
              <p>{info.yearsOfExperience} years</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Consultation Fee (ETB)
            </Label>
            {isEditing ? (
              <Input
                type="number"
                value={info.consultationFee}
                onChange={(e) => updateField('consultationFee', Number(e.target.value))}
                className="bg-muted/50"
              />
            ) : (
              <p>ETB {info.consultationFee}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Qualifications
            </Label>
            {isEditing ? (
              <Input
                value={info.qualifications}
                onChange={(e) => updateField('qualifications', e.target.value)}
                className="bg-muted/50"
              />
            ) : (
              <p>{info.qualifications}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </Label>
            {isEditing ? (
              <Input
                value={info.education}
                onChange={(e) => updateField('education', e.target.value)}
                className="bg-muted/50"
              />
            ) : (
              <p>{info.education}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Hospital/Clinic Affiliation
            </Label>
            {isEditing ? (
              <Input
                value={info.hospital}
                onChange={(e) => updateField('hospital', e.target.value)}
                className="bg-muted/50"
              />
            ) : (
              <p>{info.hospital}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Biography</Label>
            {isEditing ? (
              <Textarea
                value={info.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                rows={4}
                className="bg-muted/50"
              />
            ) : (
              <p className="text-muted-foreground">{info.bio}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}