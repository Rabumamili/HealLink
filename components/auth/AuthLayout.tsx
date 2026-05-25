'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { HealLinkIcon } from '@/components/icons/healink-icon';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="auth-layout relative text-on-surface font-body-md selection:bg-primary-fixed-dim h-screen flex flex-col overflow-hidden">
      {/* Teal gradient background — must sit behind content, not under an opaque parent */}
      <div className="glass-background" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <header className="relative z-10 h-[52px] md:h-[64px] flex items-center justify-between px-4 md:px-margin-lg bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20 shrink-0">
        <div className="flex items-center gap-2">

          <Link href="/" className="text-headline-md font-bold text-primary text-[18px]">
            HealLink
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-container/50 border border-outline-variant/20 scale-90 md:scale-100">
            <img
              alt="EN"
              className="w-4 h-3 rounded-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYGRKv5WeozOM7zHKHZBNiUFU6jqH-RPBOIAzTzMDp0AT9gQXgYkxfR85WMqojgJF9dnWGgS32Zv4TUwmL-o0e-NL01-3nDmbeLgkInepcY-JVLPZxBHRchD_WGP1Kboqy1LYELcMV_srq93VzLaYYjwSqCRL98aGoy8FjKtn3hrdV7Fe9rorjcFobAc3dM3utVco0nGW1D064a-VC3Q5NWFI_eKbwjk3Z2R72IZ1rwQA-rqjljvqEWYPYjhaQ9a2qiN3wvm_CzYw"
            />
            <span className="text-[12px] text-on-surface font-semibold">En</span>
            <HealLinkIcon name="expand_more" size={14} />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-hidden flex flex-col p-3 md:p-6 lg:p-12 min-h-0">
        <div className="w-full max-w-4xl mx-auto flex-1 min-h-0 flex flex-col">
          {children}
        </div>
      </main>

      <footer className="relative z-10 w-full py-2 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-md border-t border-outline-variant/20 shrink-0">
        <div className="container mx-auto px-4 flex items-center justify-between opacity-70 w-full max-w-4xl">
          <p className="text-[11px] text-secondary">© 2024 HealLink.</p>
          <div className="flex gap-3">
            <a className="text-[11px] text-on-surface-variant hover:text-primary transition-all" href="#">
              Privacy
            </a>
            <a className="text-[11px] text-on-surface-variant hover:text-primary transition-all" href="#">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
