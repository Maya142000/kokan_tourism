"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

/* ── shared easing / variants ───────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const riseUp: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1, ease: EASE, delay: 0.15 + i * 0.08 },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const TAGLINE = ["A coast", "shaped by", "living", "traditions"];

/* ─────────────────────────────────────────────────────────────────────
   Home hero
   ──────────────────────────────────────────────────────────────────── */
export default function HomeHero() {
  return (
    <div className="relative text-[#1a1a1a] font-mono">
      {/* fixed background image with a cream veil */}
      <div className="fixed inset-0 -z-10 bg-[#f0ede4]">
        <Image src="/assets/monsoon_muntains.avif" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0ede4] via-[#f0ede4]/55 to-[#f0ede4]/55" />
      </div>

      {/* hero */}
      <section className="min-h-screen flex flex-col justify-between px-6 md:px-10 pt-32 pb-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex justify-between items-start uppercase text-[10px] tracking-[0.3em] font-bold opacity-60"
        >
          <span className="hidden md:block">निसर्गरम्य कोकण</span>
          <span>Est. 2026</span>
        </motion.div>

        {/* big tagline — staggered word rise */}
        <h1 className="font-sans font-black tracking-tighter leading-[0.95] text-[44px] sm:text-[64px] md:text-[96px] lg:text-[120px] uppercase max-w-[14ch]">
          {TAGLINE.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span className="block" variants={riseUp} custom={i} initial="hidden" animate="show">
                {line}
                {i === TAGLINE.length - 1 && <span className="text-emerald-700">.</span>}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.7 }}
          className="flex justify-between items-end uppercase text-[10px] tracking-[0.3em] font-bold"
        >
          <p className="max-w-[28ch] opacity-70 normal-case tracking-normal text-[12px] leading-relaxed">
            Discover the untouched beaches, living festivals and coastal cuisine of India&rsquo;s Konkan region.
          </p>
          <span className="hidden md:block animate-pulse">Scroll ↓</span>
        </motion.div>
      </section>
    </div>
  );
}
