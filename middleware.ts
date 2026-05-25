// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/staff-login', '/register', '/forgot-password', '/reset-password'];
const authRoutes = ['/login', '/staff-login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (token && isAuthRoute) {
    const roleRoutes: Record<string, string> = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      clinic_admin: '/clinic-admin/dashboard',
      diagnostic_admin: '/diagnostic-admin/dashboard',
      diagnostic_staff: '/staff/diagnostic-staff/dashboard',
      clinic_staff: '/staff/clinic-staff/dashboard',
      doctor_staff: '/staff/doctor-staff/dashboard',
    };
    return NextResponse.redirect(new URL(roleRoutes[userRole || 'patient'] || '/', request.url));
  }

  if (!token && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};