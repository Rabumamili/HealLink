// // app/(auth)/professional-registration/page.tsx
// 'use client';

// import { useSearchParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { AuthLayout } from '@/components/auth/AuthLayout';
// import { ProfessionalRegistrationForm } from '@/components/auth/ProfessionalRegistrationForm';
// import { useAuthStore } from '@/stores/slices/authSlice';

// export default function ProfessionalRegistrationPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user, isAuthenticated } = useAuthStore();
//   const role = searchParams.get('role') as 'doctor' | 'clinic_admin' | 'diagnostic_admin' | null;
//   const email = searchParams.get('email') || '';
//   const userId = searchParams.get('userId') || '';
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isAuthenticated && !userId) {
//       router.push('/login');
//       return;
//     }
    
//     if (user?.role === 'patient') {
//       router.push('/dashboard');
//       return;
//     }
    
//     // If user already has professional verification submitted
//     if (user?.professional_verification_status === 'submitted') {
//       router.push('/professional-verification-pending');
//       return;
//     }
    
//     setLoading(false);
//   }, [isAuthenticated, user, router, userId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
//       </div>
//     );
//   }

//   const userRole = role || user?.role;
  
//   if (!userRole || userRole === 'patient') {
//     router.push('/dashboard');
//     return null;
//   }

//   return (
//     <AuthLayout 
//       title="Professional Registration" 
//       description="Complete your professional profile for Ministry verification"
//     >
//       <ProfessionalRegistrationForm 
//         userId={userId || user!.id} 
//         role={userRole as any}
//         email={email}
//       />
//     </AuthLayout>
//   );
// }