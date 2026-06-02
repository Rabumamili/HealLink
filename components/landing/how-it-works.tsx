"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Search & Discover",
    description:
      "Browse verified clinics, diagnostic centers, and specialist doctors filtered by location, specialty, or availability.",
  },
  {
    number: "2",
    title: "Review Profiles",
    description:
      "See full provider profiles: services offered, ratings from real patients, qualifications, and available time slots.",
  },
  {
    number: "3",
    title: "Book & Attend",
    description:
      "Confirm your appointment instantly. Get reminders, navigate with maps, and manage everything from your dashboard.",
  },
];

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const stepDelay = 0.68;

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

function StepNode({
  number,
  title,
  description,
  index,
  active,
}: {
  number: string;
  title: string;
  description: string;
  index: number;
  active: boolean;
}) {
  const delay = 0.24 + index * stepDelay;

  return (
    <motion.div
      className="relative z-10 text-center"
      initial="hidden"
      animate={active ? "show" : "hidden"}
    >
      <motion.div
        className="mx-auto flex h-[104px] w-[104px] items-center justify-center rounded-full border-2 border-dashed border-primary-fixed-dim bg-white"
        initial={{ scale: 0.8, opacity: 0.35 }}
        animate={
          active
            ? {
                scale: 1,
                opacity: 1,
                boxShadow: [
                  "0 0 0 0 rgba(0, 103, 103, 0.24)",
                  "0 0 0 18px rgba(0, 103, 103, 0)",
                  "0 0 0 0 rgba(0, 103, 103, 0)",
                ],
              }
            : { scale: 0.8, opacity: 0.35, boxShadow: "0 0 0 0 rgba(0, 103, 103, 0)" }
        }
        transition={{
          scale: { delay, duration: 0.58, ease: easeOutExpo },
          opacity: { delay, duration: 0.42, ease: easeOutExpo },
          boxShadow: { delay: delay + 0.2, duration: 1.15, ease: easeOutExpo },
        }}
      >
        <motion.div
          className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-primary text-[34px] font-black text-white shadow-xl shadow-primary/25"
          initial={{ scale: 0.74, backgroundColor: "#ffffff", color: "#006767" }}
          animate={
            active
              ? { scale: [0.74, 1.1, 1], backgroundColor: "#006767", color: "#ffffff" }
              : { scale: 0.74, backgroundColor: "#ffffff", color: "#006767" }
          }
          transition={{ delay: delay + 0.08, duration: 0.62, ease: easeOutExpo }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.75 }}
            animate={active ? { opacity: 1, y: [10, -4, 0], scale: [0.75, 1.18, 1] } : {}}
            transition={{ delay: delay + 0.16, duration: 0.58, ease: easeOutExpo }}
          >
            {number}
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: delay + 0.28, duration: 0.64, ease: easeOutExpo }}
      >
        <h3 className="mt-7 text-[21px] font-black text-[#111827]">{title}</h3>
        <p className="mx-auto mt-3 max-w-[350px] text-[16px] font-medium leading-7 text-[#536274]">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

function EnergyLine({
  active,
  delay,
  className,
}: {
  active: boolean;
  delay: number;
  className: string;
}) {
  return (
    <div className={`overflow-hidden rounded-full bg-[#d8efec] ${className}`}>
      <motion.div
        className="relative h-full w-full origin-left rounded-full bg-primary"
        initial={{ scaleX: 0 }}
        animate={active ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay, duration: 0.68, ease: easeOutExpo }}
      >
        <motion.div
          className="absolute inset-y-0 -left-16 w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent"
          animate={active ? { x: ["0%", "420%"] } : { x: "0%" }}
          transition={{
            delay: delay + 0.05,
            duration: 0.75,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section ref={sectionRef} id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1180px] px-4 text-center md:px-8">
        <motion.div initial="hidden" animate={inView ? "show" : "hidden"} variants={headingVariants}>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">How It Works</p>
          <h2 className="mt-4 text-[36px] font-black leading-tight tracking-normal text-[#111827] sm:text-[50px]">
            Quality care in three steps
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[18px] font-medium leading-8 text-[#536274]">
            We&apos;ve made finding and booking healthcare in Ethiopia simple, transparent, and fast.
          </p>
        </motion.div>

        <div className="relative mt-16 hidden md:block">
          <EnergyLine
            active={inView}
            delay={0.74}
            className="absolute left-[17%] right-1/2 top-[52px] h-[3px]"
          />
          <EnergyLine
            active={inView}
            delay={1.42}
            className="absolute left-1/2 right-[17%] top-[52px] h-[3px]"
          />

          <div className="grid grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <StepNode key={step.number} {...step} index={index} active={inView} />
            ))}
          </div>
        </div>

        <div className="relative mt-14 space-y-10 text-left md:hidden">
          <div className="absolute bottom-16 left-[48px] top-8 w-[3px] overflow-hidden rounded-full bg-[#d8efec]">
            <motion.div
              className="relative h-full w-full origin-top rounded-full bg-primary"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: 0.72, duration: 1.45, ease: easeOutExpo }}
            >
              <motion.div
                className="absolute -top-16 inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/80 to-transparent"
                animate={inView ? { y: ["0%", "520%"] } : { y: "0%" }}
                transition={{ delay: 0.75, duration: 1.4, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {steps.map((step, index) => {
            const delay = 0.24 + index * stepDelay;

            return (
              <motion.div
                key={step.number}
                className="relative grid grid-cols-[96px_1fr] items-start gap-4"
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: delay + 0.24, duration: 0.6, ease: easeOutExpo }}
              >
                <motion.div
                  className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-primary-fixed-dim bg-white"
                  initial={{ scale: 0.8 }}
                  animate={
                    inView
                      ? {
                          scale: [0.8, 1.08, 1],
                          boxShadow: [
                            "0 0 0 0 rgba(0, 103, 103, 0.24)",
                            "0 0 0 16px rgba(0, 103, 103, 0)",
                            "0 0 0 0 rgba(0, 103, 103, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ delay, duration: 0.72, ease: easeOutExpo }}
                >
                  <motion.div
                    className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-primary text-[30px] font-black text-white shadow-xl shadow-primary/25"
                    initial={{ scale: 0.75 }}
                    animate={inView ? { scale: [0.75, 1.12, 1] } : {}}
                    transition={{ delay: delay + 0.08, duration: 0.62, ease: easeOutExpo }}
                  >
                    {step.number}
                  </motion.div>
                </motion.div>

                <div className="pt-3">
                  <h3 className="text-[21px] font-black text-[#111827]">{step.title}</h3>
                  <p className="mt-2 text-[16px] font-medium leading-7 text-[#536274]">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
