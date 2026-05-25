// components/appointment/AppointmentStatsCards.tsx
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CalendarDays, CalendarPlus, CheckCircle, Wallet, Activity, DollarSign, Users, Stethoscope } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
}

interface AppointmentStatsCardsProps {
  stats: StatCard[];
  variant?: 'patient' | 'provider' | 'clinic' | 'diagnostic';
}

const iconMap = {
  patient: {
    'Total': CalendarDays,
    'Upcoming': CalendarPlus,
    'Completed': CheckCircle,
    'Total Spent': Wallet,
  },
  provider: {
    'Total Appointments': CalendarDays,
    "Today's Appointments": Activity,
    'Completed': CheckCircle,
    'Revenue': DollarSign,
  },
  clinic: {
    'Total Appointments': CalendarDays,
    "Today's Appointments": Activity,
    'Completed': CheckCircle,
    'Revenue': DollarSign,
  },
  diagnostic: {
    'Total Appointments': CalendarDays,
    "Today's Appointments": Activity,
    'Completed': CheckCircle,
    'Revenue': DollarSign,
  },
};

export const AppointmentStatsCards = ({ stats, variant = 'patient' }: AppointmentStatsCardsProps) => {
  const icons = iconMap[variant];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => {
        const Icon = icons[stat.title as keyof typeof icons] || CalendarDays;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-[#E0E7FF] shadow-[0_4px_20px_rgba(0,139,139,0.05)] hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-semibold text-[#3d4949] uppercase tracking-wider">
                  {stat.title}
                </span>
                <p className="text-xs text-[#6d7979] mt-0.5">{stat.description}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl md:text-3xl font-bold text-[#0b1c30]">{stat.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};