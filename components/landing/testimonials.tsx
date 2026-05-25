// components/landing/testimonials.tsx
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const testimonials = [
  {
    name: "Abebe Kebede",
    role: "Patient",
    location: "Addis Ababa",
    content: "HealLink made booking my annual checkup so easy. I found a great doctor near my home, booked online, and paid instantly. The Card number system for check-in was very convenient!",
    rating: 5,
  },
  {
    name: "Dr. Sara Tesfaye",
    role: "Cardiologist",
    location: "Bahir Dar",
    content: "As a doctor, HealLink has transformed how I manage my practice. The digital calendar prevents double-bookings, and the patient queue system helps me stay organized throughout the day.",
    rating: 5,
  },
  {
    name: "Meron Haile",
    role: "Patient",
    location: "Hawassa",
    content: "I was able to track my lab results status right from my phone. No more calling the lab multiple times—I got notified as soon as my results were ready. Highly recommend!",
    rating: 5,
  },
  {
    name: "Kidist Alemayehu",
    role: "Clinic Administrator",
    location: "Dire Dawa",
    content: "Managing our clinic has never been easier. From staff scheduling to payment reconciliation, HealLink gives us everything we need. Our patient satisfaction has improved significantly.",
    rating: 5,
  },
  {
    name: "Yohannes Girma",
    role: "Patient",
    location: "Mekelle",
    content: "The preparation instructions for my MRI were sent automatically after booking. I knew exactly what to do before the test. The whole experience was professional and stress-free.",
    rating: 5,
  },
  {
    name: "Dr. Tigist Bekele",
    role: "Lab Director",
    location: "Adama",
    content: "Our diagnostic center processes hundreds of tests daily. HealLink helps us manage the workflow efficiently and keeps patients informed about their result status automatically.",
    rating: 5,
  },
]

export function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)
  
  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-3 sm:mb-4">Testimonials</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Trusted by Thousands
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            See what patients and healthcare providers across Ethiopia are saying about HealLink.
          </p>
        </div>

        <div className="relative">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative rounded-xl sm:rounded-2xl bg-card p-5 sm:p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <Quote className="absolute top-4 sm:top-6 right-4 sm:right-6 h-6 w-6 sm:h-8 sm:w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base relative z-10">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="mt-5 sm:mt-6 flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs sm:text-sm">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8 sm:mt-10">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-colors text-sm ${
                    currentPage === i
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}