'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import {
  Menu,

} from 'lucide-react';

const navLinks = [
  { href: '#clinics', label: 'Clinics' },
  { href: '#doctors', label: 'Doctors' },
  { href: '#diagnostics', label: 'Diagnostics' },
  { href: '#about', label: 'About' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, isAuthenticated, logout, isLoading } = useAuth();
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#071014]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-2xl font-black text-transparent"
        >
          HealLink
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
        
              <Link
                href="/login"
                className="rounded-xl px-5 py-2 text-sm font-semibold text-white/80 transition-all hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register/select-role"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-500/40"
              >
                Join HealLink
              </Link>
          
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#071014]/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5">
              <Link
                href="/login"
                className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white/80"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>

              <Link
                href="/register/select-role"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Join HealLink
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}