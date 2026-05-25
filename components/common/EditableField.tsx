// components/common/EditableField.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function EditableField({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
  disabled = false,
  className
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (disabled) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-muted-foreground">{label}</Label>
        <p className="text-foreground">{value || 'Not provided'}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>{label}</Label>
        {type === 'textarea' ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
          />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} variant="default">
            <Save className="h-3 w-3 mr-1" /> Save
          </Button>
          <Button size="sm" onClick={handleCancel} variant="outline">
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 group", className)}>
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center justify-between">
        <p className="text-foreground">{value || 'Not provided'}</p>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}