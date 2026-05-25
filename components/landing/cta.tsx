// components/landing/cta.tsx
"use client"

import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, Clock, Users, Award, CheckCircle2 } from "lucide-react"

export function CTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative">
        <div 
          ref={ref}
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex justify-center mb-6 animate-bounce">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm shadow-lg">
              <Heart className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
            Ready to Transform Your Healthcare Experience?
          </h2>
          
          <p className="mt-6 text-lg text-primary-foreground/90 max-w-xl mx-auto">
            Join thousands of patients and providers who are already using HealLink 
            to make healthcare more accessible, efficient, and convenient.
          </p>
          
          {/* Benefits grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 mb-10">
            <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">Free for Patients</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">Secure Platform</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="w-full sm:w-auto text-base px-8 shadow-lg hover:shadow-xl transition-all group"
            >
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="w-full sm:w-auto text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70">
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 14-day provider trial</span>
          </div>
        </div>
      </div>
    </section>
  )
}