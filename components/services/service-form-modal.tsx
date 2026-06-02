// components/services/service-form-modal.tsx
'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateServiceDTO, SERVICE_TYPE, ServiceType } from '@/types/entities/service.types';

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateServiceDTO) => void;
  initialData?: CreateServiceDTO | null;
  title: string;
  description: string;
  showTypeField?: boolean;
  typeOptions?: { value: ServiceType; label: string }[];
  typeFieldLabel?: string;
  isLoading?: boolean;
}

const defaultTypeOptions: { value: ServiceType; label: string }[] = [
  { value: SERVICE_TYPE.CONSULTATION, label: 'Consultation' },
  { value: SERVICE_TYPE.DIAGNOSTIC, label: 'Diagnostic tests' },
  { value: SERVICE_TYPE.ClinicServices, label: 'Clinic services' },
];

interface FormErrors {
  name?: string;
  standardFee?: string;
  durationMinutes?: string;
}

export function ServiceFormModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  title,
  description,
  showTypeField = true,
  typeOptions = defaultTypeOptions,
  typeFieldLabel = 'Service Type',
  isLoading = false
}: ServiceFormModalProps) {
  const [formData, setFormData] = useState<CreateServiceDTO>({
    name: '',
    description: '',
    durationMinutes: 30,
    standardFee: 0,
    serviceType: 'Consultation',
    status: 'Active',
    preparationInstructions: '',
    location: 'Addis Ababa'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        durationMinutes: 30,
        standardFee: 0,
        serviceType: 'Consultation',
        status: 'Active',
        preparationInstructions: '',
        location: 'Addis Ababa'
      });
    }
    // Reset errors and touched when modal opens/closes
    setErrors({});
    setTouched({});
  }, [open]);

  const validateField = (field: keyof FormErrors, value: any): string | undefined => {
    switch (field) {
      case 'name':
        if (!value || value.trim() === '') return 'Service name is required';
        if (value.length < 3) return 'Service name must be at least 3 characters';
        return undefined;
      case 'standardFee':
        if (!value || value <= 0) return 'Fee is required and must be greater than 0';
        if (value > 100000) return 'Fee cannot exceed 100,000 ETB';
        return undefined;
      case 'durationMinutes':
        if (!value || value <= 0) return 'Duration is required and must be greater than 0';
        if (value > 480) return 'Duration cannot exceed 480 minutes (8 hours)';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof CreateServiceDTO, value: any) => {
    setFormData({ ...formData, [field]: value });
    
    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field as keyof FormErrors, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;
    
    const feeError = validateField('standardFee', formData.standardFee);
    if (feeError) newErrors.standardFee = feeError;
    
    const durationError = validateField('durationMinutes', formData.durationMinutes);
    if (durationError) newErrors.durationMinutes = durationError;
    
    setErrors(newErrors);
    setTouched({ name: true, standardFee: true, durationMinutes: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (validateForm()) {
        onSave(formData);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] flex flex-col p-0">
        {/* Header - Fixed */}
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">{title}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Service Name */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Service Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g., Specialized Consultation"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              onKeyDown={handleKeyDown}
              className={cn(
                "bg-[#F1F5F9] border-none focus:ring-2 focus:ring-primary rounded-xl",
                errors.name && touched.name && "ring-2 ring-red-500 bg-red-50"
              )}
            />
            {errors.name && touched.name && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Description
            </Label>
            <Textarea
              placeholder="Describe the service..."
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="bg-[#F1F5F9] border-none focus:ring-2 focus:ring-primary rounded-xl"
              rows={2}
            />
          </div>

          {/* Duration and Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Duration (minutes) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="30"
                value={formData.durationMinutes}
                onChange={(e) => handleFieldChange('durationMinutes', parseInt(e.target.value) || 0)}
                onBlur={() => handleBlur('durationMinutes')}
                className={cn(
                  "bg-[#F1F5F9] border-none focus:ring-2 focus:ring-primary rounded-xl",
                  errors.durationMinutes && touched.durationMinutes && "ring-2 ring-red-500 bg-red-50"
                )}
              />
              {errors.durationMinutes && touched.durationMinutes && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.durationMinutes}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Fee (ETB) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="500"
                value={formData.standardFee}
                onChange={(e) => handleFieldChange('standardFee', parseInt(e.target.value) || 0)}
                onBlur={() => handleBlur('standardFee')}
                className={cn(
                  "bg-[#F1F5F9] border-none focus:ring-2 focus:ring-primary rounded-xl",
                  errors.standardFee && touched.standardFee && "ring-2 ring-red-500 bg-red-50"
                )}
              />
              {errors.standardFee && touched.standardFee && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.standardFee}
                </p>
              )}
            </div>
          </div>

          {/* Service Type and Location */}
          <div className="grid grid-cols-2 gap-4">
            {showTypeField && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  {typeFieldLabel}
                </Label>
                <Select 
                  value={formData.serviceType} 
                  onValueChange={(value) => handleFieldChange('serviceType', value as ServiceType)}
                >
                  <SelectTrigger className="bg-[#F1F5F9] border-none focus:ring-2 focus:ring-primary rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Location
              </Label>
              <Input
                placeholder="e.g., Addis Ababa"
                value={formData.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="bg-[#F1F5F9] border-none focus:ring-2 focus:ring-primary rounded-xl"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Status
            </Label>
            <div className="flex items-center justify-between bg-[#F1F5F9] rounded-xl p-3">
              <span className="text-sm font-medium text-foreground">
                {formData.status === 'Active' ? 'Active' : 'Inactive'}
              </span>
              <Switch 
                checked={formData.status === 'Active'}
                onCheckedChange={(checked) => handleFieldChange('status', checked ? 'Active' : 'Inactive')}
              />
            </div>
          </div>

          {/* Preparation Instructions */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Preparation Instructions (Optional)
            </Label>
            <Textarea
              placeholder="e.g., Fast for 8 hours before the test"
              value={formData.preparationInstructions || ''}
              onChange={(e) => handleFieldChange('preparationInstructions', e.target.value)}
              className="bg-[#F1F5F9] border-none focus:ring-2 focus:ring-primary rounded-xl"
              rows={2}
            />
          </div>
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="p-6 pt-4 border-t">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 py-5 text-base font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 py-5 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? 'Editing...' : 'Creating...'}
                </>
              ) : (
                initialData ? 'Edit Service' : 'Create Service'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}