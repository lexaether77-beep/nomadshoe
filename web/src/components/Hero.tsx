"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { nomadMeta } from "@/lib/specs";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.35, delayChildren: 0.2 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

const markReveal: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(14px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.3, ease: EASE_OUT_EXPO },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center text-center"
      >
        <motion.p
          variants={fadeUp}
          className="font-technical text-xs tracking-[0.35em] text-muted uppercase"
        >
          Lagos &middot; October 2026
        </motion.p>

        <motion.div
          variants={markReveal}
          className="relative mt-8 h-40 w-40 sm:h-48 sm:w-48"
        >
          <Image
            src="/images/brand/mark.jpg"
            alt="KLΘT mark: Nomad, four Nsibidi-inspired glyphs"
            fill
            priority
            sizes="192px"
            className="rounded-xl object-cover"
          />
          {/* Soft breathing presence — a shadow reads as "lit" on paper
              where a blurred glow blob (the dark-theme approach) would not */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            animate={{
              boxShadow: [
                "0 8px 30px -6px rgba(227, 178, 60, 0.25)",
                "0 12px 40px -6px rgba(227, 178, 60, 0.4)",
                "0 8px 30px -6px rgba(227, 178, 60, 0.25)",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gold/60" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-8 font-display text-5xl font-bold tracking-tight sm:text-7xl"
        >
          KLΘT <span className="text-gold-ink">NOMAD</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-4 max-w-md text-muted">
          Victory Through Harmony. A zero-drop, five-toe barefoot shoe,
          designed in Lagos and etched with Nsibidi symbols meaning{" "}
          <span className="text-foreground">
            &ldquo;time is the spirit of God.&rdquo;
          </span>
        </motion.p>

        <motion.a
          variants={fadeUp}
          href="/nomad#buy"
          className="mt-10 rounded-full bg-gold px-8 py-3 font-technical text-sm font-medium tracking-wide text-foreground transition-transform hover:scale-105"
        >
          Preorder the Nomad
        </motion.a>
        <motion.p
          variants={fadeUp}
          className="mt-3 font-technical text-xs text-muted"
        >
          ${nomadMeta.priceUSD} &middot; shipping included
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="font-technical text-[10px] tracking-[0.3em] text-muted uppercase">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-line"
        />
      </motion.div>
    </section>
  );
}
