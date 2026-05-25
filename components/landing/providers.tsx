// components/landing/providers.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  UserRound, 
  Building2, 
  FlaskConical, 
  ArrowRight,
  BarChart3,
  Users,
  Calendar,
  Wallet
} from "lucide-react"

const providerTypes = [
  {
    icon: UserRound,
    title: "For Doctors",
    description: "Manage your practice digitally. Set your availability, track appointments, and grow your patient base.",
    features: [
      "Digital calendar with conflict prevention",
      "Real-time patient queue management",
      "Analytics dashboard for insights",
      "Automated appointment reminders",
    ],
    cta: "Join as Doctor",
    href: "/register?role=doctor"
  },
  {
    icon: Building2,
    title: "For Clinics",
    description: "Streamline clinic operations. Manage staff, services, and patient flow all from one dashboard.",
    features: [
      "Multi-service management",
      "Staff role management",
      "Card number-based check-in",
      "Payment reconciliation",
    ],
    cta: "Join as Clinic",
    href: "/register?role=clinic_admin"
  },
  {
    icon: FlaskConical,
    title: "For Diagnostic Centers",
    description: "Optimize your lab workflow. Schedule tests, update result status, and communicate with patients.",
    features: [
      "Test catalog management",
      "Result status tracking",
      "Automated prep instructions",
      "Workload analytics",
    ],
    cta: "Join as Diagnostic Center",
    href: "/register?role=diagnostic_admin"
  },
]

const benefits = [
  { icon: BarChart3, label: "Detailed Analytics" },
  { icon: Users, label: "Patient Management" },
  { icon: Calendar, label: "Smart Scheduling" },
  { icon: Wallet, label: "Payment Tracking" },
]

export function Providers() {
  return (
    <section id="providers" className="py-16 sm:py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-3 sm:mb-4">Built for You</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Built for Healthcare Providers
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Whether you're an individual doctor, a clinic, or a diagnostic center, 
            HealLink provides the tools you need to deliver better care.
          </p>
        </div>

        {/* Benefits bar */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12 sm:mb-16">
          {benefits.map((benefit) => (
            <div key={benefit.label} className="flex items-center gap-2 rounded-full bg-card px-3 sm:px-4 py-1.5 sm:py-2 border border-border/50">
              <benefit.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">{benefit.label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {providerTypes.map((provider, index) => (
            <div
              key={provider.title}
              className="rounded-xl sm:rounded-2xl bg-card p-6 sm:p-8 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 text-primary">
                <provider.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-foreground">
                {provider.title}
              </h3>
              <p className="mt-1.5 sm:mt-2 text-sm text-muted-foreground">
                {provider.description}
              </p>
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {provider.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 sm:mt-8">
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all text-sm sm:text-base"
                  asChild
                >
                  <Link href={provider.href}>
                    {provider.cta}
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <Button size="lg" asChild className="text-sm sm:text-base px-6 sm:px-8">
            <Link href="/register">
              Join as Provider
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}