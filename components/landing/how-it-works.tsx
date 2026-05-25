// components/landing/how-it-works.tsx
"use client"

import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Search, CalendarCheck, CreditCard, CheckCircle, Smartphone, Bell, FileText, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Search & Discover",
    description: "Find doctors, clinics, or diagnostic centers by location, specialty, ratings, or availability.",
    details: "Filter by price, distance, and availability to find the perfect match for your needs.",
    image: "/steps/search-step.jpg"
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Book Appointment",
    description: "Select your preferred time slot from real-time availability. Choose the service you need.",
    details: "See live availability and book instantly without phone calls or waiting.",
    image: "/steps/book-step.jpg"
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Pay Securely",
    description: "Complete your payment securely through Chapa. Receive instant confirmation.",
    details: "Support for Chapa, Telebirr, and other local payment methods.",
    image: "/steps/pay-step.jpg"
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Visit & Track",
    description: "Present your Card number at check-in. Track your result status from your dashboard.",
    details: "Get real-time updates and notifications about your appointment status.",
    image: "/steps/track-step.jpg"
  },
]

const benefits = [
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access HealLink from any device",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss an appointment",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: FileText,
    title: "Digital Records",
    description: "All your health info in one place",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Heart,
    title: "Patient First",
    description: "Designed for your convenience",
    color: "bg-red-100 text-red-600"
  }
]

export function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="secondary" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How HealLink Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Book your healthcare appointment in four simple steps. No phone calls, 
            no waiting—just seamless digital healthcare.
          </p>
        </div>

        {/* Steps with alternating layout */}
        <div className="space-y-16 md:space-y-24 mb-20">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center transition-all duration-700 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image side */}
              <div className="flex-1">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={500}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                </div>
              </div>
              
              {/* Content side */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
                  Step {step.step}
                </div>
                <div className="flex justify-center lg:justify-start mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <step.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg mb-2">
                  {step.description}
                </p>
                <p className="text-sm text-primary/70">
                  {step.details}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits section */}
        <div className="pt-10 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="text-center group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl ${benefit.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}