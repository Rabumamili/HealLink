"use client";

import Link from 'next/link';
import { HealLinkIcon } from '@/components/icons/healink-icon';
import { ArrowRight, Building2, Stethoscope, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_IMAGE =
  '/hero.png';

export function Hero() {
  return (
    <section className="relative flex min-h-[720px] items-center overflow-hidden bg-[#f5fffc] pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(140,243,243,0.36),transparent_32%),linear-gradient(180deg,#f5fffc_0%,#ffffff_84%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-12 px-4 py-4 md:grid-cols-[0.92fr_1.08fr] md:px-container-padding lg:gap-14">
        <motion.div
          className="space-y-7"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-fixed-dim bg-white/70 px-5 py-2 text-[13px] font-bold tracking-wide text-primary shadow-sm shadow-primary/5 backdrop-blur">
            <HealLinkIcon name="verified_user" size={18} />
            Your Health, Closer Than You Think
          </div>

          <h1 className="max-w-[680px] text-[44px] font-black leading-[0.98] tracking-normal text-[#111827] sm:text-[58px] lg:text-[72px]">
            Ethiopia&apos;s Healthcare,
            <br />
            <span className="font-serif italic font-bold text-primary">Connected for You.</span>
          </h1>

          <p className="max-w-xl text-[18px] leading-8 text-[#647184] sm:text-[20px]">
            Find verified clinics, book specialist consultations, and access diagnostic labs from
            one trusted digital healthcare platform built for Ethiopians.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/register?role=patient"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-[15px] font-bold text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/30"
            >
              Book an Appointment <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#clinics"
              className="inline-flex items-center justify-center rounded-lg border border-[#d9e2e1] bg-white px-8 py-4 text-[15px] font-bold text-[#202936] shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
            >
              Explore the Network
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 36, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-6 rounded-[36px] bg-primary/10 blur-3xl" />
          <motion.img
            alt="Unified digital healthcare platform connecting patients, doctors, and clinics"
            className="relative aspect-[1.45/1] w-full rounded-[28px] object-cover shadow-2xl shadow-primary/15 ring-1 ring-white/70"
            src={HERO_IMAGE}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-7 left-4 rounded-xl bg-white px-6 py-4 shadow-2xl shadow-primary/10 ring-1 ring-black/5 sm:left-8"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[32px] font-black leading-none text-primary">98%</div>
            <div className="mt-1 text-sm font-semibold text-[#748090]">Patient Satisfaction</div>
          </motion.div>
          <motion.div
            className="absolute -bottom-8 right-3 rounded-xl bg-white px-5 py-4 shadow-2xl shadow-primary/10 ring-1 ring-black/5 sm:right-8"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-2 flex items-center justify-center gap-3 text-primary">
              <Stethoscope className="h-5 w-5" />
              <span className="h-px w-5 bg-primary/40" />
              <Users className="h-5 w-5" />
              <span className="h-px w-5 bg-primary/40" />
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-center text-sm font-black text-[#202936]">Doctors - Clinics- Diagonistics </div>
            <div className="mt-1 text-center text-xs font-semibold text-[#748090]">All in one platform</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
