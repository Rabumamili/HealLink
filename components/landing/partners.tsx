// components/landing/partners.tsx (with actual image URLs)
"use client"

import Image from "next/image"
import { useInView } from "react-intersection-observer"

const partners = [
  { name: "Ethiopian Hospital", logo: "https://placehold.co/120x60/006B5E/white?text=Hospital" },
  { name: "Chapa", logo: "https://placehold.co/120x60/006B5E/white?text=Chapa" },
  { name: "Ministry of Health", logo: "https://placehold.co/120x60/006B5E/white?text=MOH" },
  { name: "Medical Association", logo: "https://placehold.co/120x60/006B5E/white?text=Medical+Assoc" },
  { name: "Diagnostic Center", logo: "https://placehold.co/120x60/006B5E/white?text=Diagnostic" },
  { name: "Clinic Network", logo: "https://placehold.co/120x60/006B5E/white?text=Clinic+Network" },
]

export function Partners() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-12 border-y border-border/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading healthcare institutions</p>
        <div 
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}