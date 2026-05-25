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
import { Menu, LayoutDashboard, User, Settings, LogOut, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '#clinics', label: 'Clinics' },
  { href: '#doctors', label: 'Doctors' },
  { href: '#diagnostics', label: 'Diagnostics' },
  { href: '#about', label: 'About' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'patient':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'clinic_admin':
        return '/clinicAdmin/dashboard';
      case 'diagnostic_admin':
        return '/diagonsticCenterAdmin/dashboard';
      default:
        return '/login';
    }
  };

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <nav className="flex justify-between items-center h-[72px] px-4 md:px-container-padding max-w-[1440px] mx-auto">
        <Link href="/" className="font-headline-md text-[24px] font-bold text-primary">
          HealLink
        </Link>

        <div className="hidden md:flex items-center gap-margin-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-[14px] font-semibold tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-base">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary-fixed text-primary text-sm font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.first_name} {user?.last_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="text-error cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-2 rounded-xl text-primary font-label-md text-[14px] font-semibold hover:bg-surface-container-low transition-all"
              >
                Login
              </Link>
              
              {/* Get Started with Role Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="px-6 py-2 rounded-xl bg-primary text-on-primary font-label-md text-[14px] font-semibold shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
                >
                  Get Started
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showRoleMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowRoleMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-surface border border-outline-variant rounded-lg shadow-lg z-50 overflow-hidden">
                      <Link
                        href="/register?role=patient"
                        className="block px-4 py-3 text-on-surface hover:bg-surface-container-hover transition-colors"
                        onClick={() => setShowRoleMenu(false)}
                      >
                        <div className="font-semibold">Register as Patient</div>
                        <div className="text-xs text-on-surface-variant">Book appointments with doctors</div>
                      </Link>
                      <div className="border-t border-outline-variant/20" />
                      <Link
                        href="/register?role=doctor"
                        className="block px-4 py-3 text-on-surface hover:bg-surface-container-hover transition-colors"
                        onClick={() => setShowRoleMenu(false)}
                      >
                        <div className="font-semibold">Register as Doctor</div>
                        <div className="text-xs text-on-surface-variant">Manage your practice and patients</div>
                      </Link>
                      <div className="border-t border-outline-variant/20" />
                      <Link
                        href="/register?role=clinic_admin"
                        className="block px-4 py-3 text-on-surface hover:bg-surface-container-hover transition-colors"
                        onClick={() => setShowRoleMenu(false)}
                      >
                        <div className="font-semibold">Register as Clinic Admin</div>
                        <div className="text-xs text-on-surface-variant">Manage clinic operations</div>
                      </Link>
                      <div className="border-t border-outline-variant/20" />
                      <Link
                        href="/register?role=diagnostic_admin"
                        className="block px-4 py-3 text-on-surface hover:bg-surface-container-hover transition-colors rounded-b-lg"
                        onClick={() => setShowRoleMenu(false)}
                      >
                        <div className="font-semibold">Register as Diagnostic Admin</div>
                        <div className="text-xs text-on-surface-variant">Manage diagnostic center</div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden flex items-center justify-center w-10 h-10 text-on-surface"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-md px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-on-surface-variant hover:text-primary font-semibold py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {!isAuthenticated && (
            <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/20">
              <Link 
                href="/login" 
                className="px-4 py-2.5 text-center text-primary font-semibold rounded-xl border border-primary/30 hover:bg-primary/5 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-on-surface-variant px-2 mb-1">Register as:</div>
                <Link
                  href="/register?role=patient"
                  className="block px-4 py-2.5 text-center bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Patient
                </Link>
                <Link
                  href="/register?role=doctor"
                  className="block px-4 py-2.5 text-center bg-primary/90 text-on-primary font-semibold rounded-xl hover:opacity-90 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Doctor
                </Link>
                <Link
                  href="/register?role=clinic_admin"
                  className="block px-4 py-2.5 text-center bg-primary/80 text-on-primary font-semibold rounded-xl hover:opacity-90 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Clinic Admin
                </Link>
                <Link
                  href="/register?role=diagnostic_admin"
                  className="block px-4 py-2.5 text-center bg-primary/70 text-on-primary font-semibold rounded-xl hover:opacity-90 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Diagnostic Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}