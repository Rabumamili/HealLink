import {
  Mail,
  Phone,
  Building2,
  Clock,
  MapPin,
  Cake,
  Users,
  Shield,
  Badge,
  Verified,
} from 'lucide-react';

const iconMap = {
  mail: Mail,
  call: Phone,
  domain: Building2,
  schedule: Clock,
  location: MapPin,
  badge: Badge,
  verified: Verified,

  // 👇 ADD THESE (you are using them)
  cake: Cake,
  wc: Users,
  health_and_safety: Shield,
} as const;

type UIIconName = keyof typeof iconMap;

export function InputFieldIcon({
  name,
  className,
}: {
  name: UIIconName;
  className?: string;
}) {
  const Icon = iconMap[name];

  // safety guard (prevents crashes)
  if (!Icon) return null;

  return (
    <Icon
      className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${className ?? ''}`}
    />
  );
}