"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

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
      {/* Ambient stage glow, breathing slowly behind the mark */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-20 blur-[120px]"
        animate={{ opacity: [0.14, 0.24, 0.14] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

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
          <div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background:
                "radial-gradient(ellipse 70% 70% at center, transparent 0%, var(--void) 92%)",
              mixBlendMode: "multiply",
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gold/40" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-8 font-display text-5xl font-bold tracking-tight sm:text-7xl"
        >
          KLΘT <span className="text-gold">NOMAD</span>
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
          className="mt-10 rounded-full bg-gold px-8 py-3 font-technical text-sm font-medium tracking-wide text-void transition-transform hover:scale-105"
        >
          Preorder the Nomad
        </motion.a>
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
