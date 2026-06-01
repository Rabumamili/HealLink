'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { HealLinkIcon } from '@/components/icons/healink-icon';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showLoginLink?: boolean;
  showRegisterLink?: boolean;
}

export const AuthLayout = ({
  children,
  title,
  description,
  showLoginLink,
  showRegisterLink,
}: AuthLayoutProps) => {
  return (
    <div className="auth-layout relative text-on-surface font-body-md selection:bg-primary-fixed-dim h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="glass-background" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      {/* Header */}
      <header className="relative z-10 h-[52px] md:h-[64px] flex items-center justify-between px-4 md:px-margin-lg bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20 shrink-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-headline-md font-bold text-primary text-[18px]"
          >
            HealLink
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 overflow-hidden flex flex-col p-3 md:p-6 lg:p-12 min-h-0">
        <div className="w-full max-w-4xl mx-auto flex-1 min-h-0 flex flex-col items-center justify-center">
          
          {(title || description) && (
            <div className="text-center mb-6">
              {title && (
                <h1 className="text-3xl font-bold text-on-surface">
                  {title}
                </h1>
              )}

              {description && (
                <p className="text-on-surface-variant mt-2">
                  {description}
                </p>
              )}
            </div>
          )}

          {children}

          {/* Optional Auth Links */}
          {showLoginLink && (
            <p className="mt-6 text-sm text-center">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          )}

          {showRegisterLink && (
            <p className="mt-6 text-sm text-center">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          )}
        </div>
      </main>

      {/* Footer - Fixed visibility */}
      <footer className="relative z-10 w-full py-3 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg shrink-0">
        <div className="container mx-auto px-4 flex items-center justify-between w-full max-w-4xl">
          <p className="text-xs text-gray-700 font-medium">
            © 2024 HealLink. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              className="text-xs text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium"
              href="#"
            >
              Privacy Policy
            </a>

            <a
              className="text-xs text-gray-600 hover:text-teal-600 transition-colors duration-200 font-medium"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};