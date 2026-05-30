// components/icons/healink-icon.tsx

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Cake,
  Calendar, // ADD THIS
  CheckCircle,
  ChevronDown,
  CloudUpload,
  Clock,
  CreditCard,
  Dna,
  FlaskConical,
  Globe,
  IdCard,
  Info,
  Lock,
  Mail,
  MailCheck,
  MapPin,
  Menu,
  Network,
  Phone,
  Share2,
  Shield,
  ShieldCheck,
  Star,
  Stethoscope,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** Maps design-template Material Symbol names to Lucide components */
export const healLinkIcons = {
  arrow_forward: ArrowRight,
  badge: IdCard,
  cake: Cake,
  biotech: Dna,
  call: Phone,
  calendar: Calendar, // ADD THIS
  check_circle: CheckCircle,
  clinical_notes: Stethoscope,
  cloud_upload: CloudUpload,
  credit_card: CreditCard,
  domain: Building2,
  expand_more: ChevronDown,
  health_and_safety: Shield,
  hub: Network,
  info: Info,
  lab_research: FlaskConical,
  language: Globe,
  local_hospital: Building2,
  location_on: MapPin,
  lock: Lock,
  mail: Mail,
  map: MapPin,
  mark_email_read: MailCheck,
  medical_services: Stethoscope,
  menu: Menu,
  person: User,
  phone_android: Phone,
  phone_iphone: Phone,
  schedule: Clock,
  science: FlaskConical,
  share: Share2,
  star: Star,
  verified: BadgeCheck,
  verified_user: ShieldCheck,
  wc: Users,
} as const satisfies Record<string, LucideIcon>;

export type HealLinkIconName = keyof typeof healLinkIcons;

export function HealLinkIcon({
  name,
  className,
  size = 18,
}: {
  name: HealLinkIconName;
  className?: string;
  size?: number;
}) {
  const Icon = healLinkIcons[name];
  return <Icon className={className} size={size} strokeWidth={2} aria-hidden />;
}