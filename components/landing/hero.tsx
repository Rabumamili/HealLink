import Link from 'next/link';
import { HealLinkIcon } from '@/components/icons/healink-icon';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCu3Dcbz9LlXoFe6irgR8Emuyq9YqnhNZqwcUkBZhAl8xwUY4sCafpYiScqLKgyF8vfMrvERPqAo_Y3d5tQpDoTMB5Ee42MzkPGnzG5CEOVj9tC--uy_gkrMcAd1wsx9LxzUg9dpPQzT-fI8WJEUtDOM2ZHiMhWRzOWNPoRgQ2C35_dwEMFLgy5mP6rUH_bJk9vnq0fQgJ3fd4QZ8QJxQQHsXXP1rnEE7fjBBWlaSAnvStR7Fl9JTtnta7cSr_x970-BDIdaxpigJ4';

export function Hero() {
  return (
    <section className="relative min-h-[819px] flex items-center overflow-hidden bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-container-padding grid md:grid-cols-2 gap-8 md:gap-margin-lg items-center relative z-10 w-full">
        <div className="space-y-6 md:space-y-margin-md pt-8 md:pt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-md text-[14px] font-semibold tracking-wide">
            <HealLinkIcon name="verified_user" size={18} />
            Your Health, Reimagined in Ethiopia
          </div>

          <h1 className="font-display-lg text-[40px] md:text-[64px] font-bold text-on-background leading-tight tracking-tight">
            Integrated Care <br />
            <span className="text-primary">Without Boundaries.</span>
          </h1>

          <p className="font-body-lg text-[18px] text-on-surface-variant max-w-lg leading-relaxed">
            HealLink bridges the gap between clinics, specialists, and laboratories to deliver
            clinical precision through modern, patient-centric technology.
          </p>

          <div className="flex flex-wrap gap-base">
            <Link
              href="/register?role=patient"
              className="px-8 py-4 rounded-xl bg-primary text-on-primary font-label-md text-[14px] font-semibold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
            >
              Book an Appointment
            </Link>
            <a
              href="#clinics"
              className="px-8 py-4 rounded-xl border border-primary text-primary font-label-md text-[14px] font-semibold hover:bg-primary/5 transition-all"
            >
              Explore Network
            </a>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            alt="Modern Medical Facility"
            className="w-full h-[600px] object-cover rounded-3xl"
            src={HERO_IMAGE}
          />
        </div>
      </div>
    </section>
  );
}
