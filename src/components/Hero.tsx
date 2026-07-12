"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-navy">
      <Image
        src="/images/hero-estate.jpg"
        alt="Luxury Windermere Florida estate home exterior at golden hour"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/25" />

      <div className="relative container-site flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:pb-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-[clamp(2.75rem,8vw,5.75rem)] leading-[0.95] tracking-tight text-ivory">
            Windermere Cleaning
          </p>
        </motion.div>

        <motion.p
          className="mt-5 max-w-xl text-lg text-limestone/90 md:text-xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Discreet estate care for Windermere homes—precise cleaning, calm
          scheduling, and a free online quote.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
        >
          <Link href="/book" className="btn-brass">
            Get a free quote
          </Link>
          <Link href="/book" className="btn-ghost">
            Book cleaning
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
