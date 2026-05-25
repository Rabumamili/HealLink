import Link from 'next/link';
import { HealLinkIcon } from '@/components/icons/healink-icon';

export function Footer() {
  return (
    <footer className="bg-on-background border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-container-padding max-w-[1440px] mx-auto py-margin-lg gap-base">
        <div className="space-y-4 text-center md:text-left">
          <div className="font-headline-md text-[24px] font-bold text-primary-fixed">HealLink</div>
          <p className="text-inverse-on-surface/80 font-body-md text-[16px] max-w-xs">
            © 2024 HealLink Ethiopia. Clinical precision, modern care.
          </p>
        </div>

        <div className="flex gap-6 md:gap-margin-md flex-wrap justify-center">
          <Link href="#" className="text-inverse-on-surface/80 hover:text-inverse-on-surface hover:underline transition-all text-[14px]">
            Privacy Policy
          </Link>
          <Link href="#" className="text-inverse-on-surface/80 hover:text-inverse-on-surface hover:underline transition-all text-[14px]">
            Terms of Service
          </Link>
          <Link href="#" className="text-inverse-on-surface/80 hover:text-inverse-on-surface hover:underline transition-all text-[14px]">
            Contact Us
          </Link>
          <Link href="#" className="text-inverse-on-surface/80 hover:text-inverse-on-surface hover:underline transition-all text-[14px]">
            Careers
          </Link>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-inverse-on-surface/20 flex items-center justify-center text-primary-fixed hover:bg-primary-fixed/10 cursor-pointer transition-all"
            aria-label="Share"
          >
            <HealLinkIcon name="share" size={20} />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-inverse-on-surface/20 flex items-center justify-center text-primary-fixed hover:bg-primary-fixed/10 cursor-pointer transition-all"
            aria-label="Language"
          >
            <HealLinkIcon name="language" size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}
