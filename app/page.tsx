import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { ClinicsSection } from '@/components/landing/clinics-section';
import { DoctorsSection } from '@/components/landing/doctors-section';
import { DiagnosticsSection } from '@/components/landing/diagnostics-section';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <Hero />
        <Features />
        <ClinicsSection />
        <DoctorsSection />
        <DiagnosticsSection />
      </main>
      <Footer />
    </div>
  );
}
