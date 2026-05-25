// components/common/ProfileImageUpload.tsx
'use client';

import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileImageUploadProps {
  imageUrl?: string | null;
  name: string;
  onImageUpload: (file: File) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40'
};

export function ProfileImageUpload({
  imageUrl,
  name,
  onImageUpload,
  size = 'lg',
  editable = true,
  className
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className={cn(sizeClasses[size], "ring-4 ring-background shadow-lg")}>
        <AvatarImage src={imageUrl || undefined} />
        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      {editable && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all hover:scale-105"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}