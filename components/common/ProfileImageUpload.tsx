// components/profile/ProfileImageUpload.tsx
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileImageUploadProps {
  currentImage?: string;
  name: string;
  onUpload: (file: File) => Promise<string | null>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const ProfileImageUpload = ({
  currentImage,
  name,
  onUpload,
  className,
  size = 'md',
}: ProfileImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await onUpload(file);
    setIsUploading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar className={cn(sizeClasses[size], 'border-2 border-border')}>
        <AvatarImage src={currentImage} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <label
        htmlFor="profile-image-upload"
        className={cn(
          'absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-1 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90',
          size === 'sm' && 'p-0.5',
          size === 'lg' && 'p-1.5'
        )}
      >
        {isUploading ? (
          <Loader2 className={cn('animate-spin', `h-${iconSizes[size]} w-${iconSizes[size]}`)} />
        ) : (
          <Camera className={cn(`h-${iconSizes[size]} w-${iconSizes[size]}`)} />
        )}
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};