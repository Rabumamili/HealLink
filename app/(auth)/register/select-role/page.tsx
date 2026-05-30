'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  User,
  Stethoscope,
  Building2,
  FlaskConical,
  ArrowRight,
} from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

const roles = [
  {
    title: 'Patient',
    description:
      'Book appointments, manage prescriptions, access medical records, and connect with healthcare providers.',
    icon: User,
    href: '/register?role=patient',
    gradient: 'from-emerald-500/15 to-teal-500/10',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Doctor',
    description:
      'Manage appointments, consult patients, organize schedules, and streamline clinical workflows.',
    icon: Stethoscope,
    href: '/register?role=doctor',
    gradient: 'from-blue-500/15 to-cyan-500/10',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    title: 'Clinic',
    description:
      'Oversee clinic operations, staff coordination, service management.',
    icon: Building2,
    href: '/register?role=clinic',
    gradient: 'from-violet-500/15 to-purple-500/10',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
  },
  {
    title: 'DiagnosticCenter',
    description:
      'Manage lab operations, diagnostic reports, test scheduling, and healthcare integrations.',
    icon: FlaskConical,
    href: '/register?role=diagnostic_center',
    gradient: 'from-orange-500/15 to-amber-500/10',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
  },
];

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  return (
    <AuthLayout showLoginLink={false} showRegisterLink={false}>
      {/*
        Mobile/tablet: scrollable, full height of parent
        Desktop (xl+): no scroll, natural flex flow centered by AuthLayout
      */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-3 sm:gap-4 xl:gap-5 overflow-y-auto xl:overflow-visible py-3 xl:py-0 px-0.5 xl:px-0">

        {/* ── Title & description ── */}
        <div className="text-center w-full px-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-[2rem] font-black tracking-tight text-white leading-tight">
            Choose how you want to use{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              HealLink
            </span>
          </h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm xl:text-base text-white/65 max-w-lg mx-auto leading-relaxed">
            Select the one which describes you to create the right experience tailored for your healthcare workflow.
          </p>
        </div>

        {/* ── Role cards ──
            mobile:  1 col (stacked, compact)
            sm–lg:   2 col
            xl+:     4 col
        */}
        <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 w-full">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole.title === role.title;

            return (
              <button
                key={role.title}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={[
                  // base
                  'group relative overflow-hidden rounded-2xl border-2 text-left',
                  'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                  // padding — tighter on mobile so cards fit without scroll
                  'p-3.5 sm:p-4 xl:p-4',
                  // state colours
                  isSelected
                    ? 'border-emerald-500 bg-[#e8f5f0]'
                    : 'border-white/10 bg-white/90 hover:border-emerald-500/40',
                ].join(' ')}
              >
                {/* Checkmark badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                {/* Hover gradient — unselected only */}
                {!isSelected && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`mb-2.5 sm:mb-3 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${role.iconBg}`}>
                    <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${role.iconColor}`} />
                  </div>

                  {/* Name */}
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                    {role.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-1 sm:mt-1.5 flex-1 text-[11px] sm:text-xs leading-[1.55] text-gray-500">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Summary banner ── */}
        <div className="w-full rounded-xl bg-[#f0faf6] border border-emerald-200 px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-start gap-2.5 sm:gap-3">
          <span className="text-lg sm:text-xl leading-none mt-0.5 shrink-0">💊</span>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-gray-900">
              You&apos;re signing up as a {selectedRole.title}
            </p>
            <p className="mt-0.5 text-[11px] sm:text-xs text-gray-600 leading-relaxed">
              {selectedRole.description}
            </p>
          </div>
        </div>

        {/* ── CTA — pill, fit content, centered ── */}
        <Link
          href={selectedRole.href}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-semibold text-sm py-2.5 sm:py-3 px-6 sm:px-7 transition-colors duration-200 shadow-md"
        >
          Continue as {selectedRole.title}
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>

        {/* ── Login link ── */}
        <p className="text-xs sm:text-sm text-white/60 pb-1">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
          >
            Log In
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}