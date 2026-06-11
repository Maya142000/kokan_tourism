"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import aboutImg from "@/src/assets/khadi.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────
   Data
   ──────────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATS = [
  { target: 720, suffix: " km", label: "Untouched coastline" },
  { target: 50, suffix: "+", label: "Pristine beaches" },
  { target: 100, suffix: "+", label: "Living festivals" },
  { target: 2026, suffix: "", label: "Established" },
];

type Offering = { name: string; marathi: string; blurb: string; src: string };
const OFFERINGS: Offering[] = [
  { name: "Coastal Stays", marathi: "समुद्रकिनारी निवास", blurb: "Beachfront homestays in quiet fishing hamlets.", src: "/assets/beach_of_kokan.avif" },
  { name: "Culinary Trails", marathi: "कोकणी खाद्ययात्रा", blurb: "Malvani thalis, sol kadhi and fresh catch.", src: "/assets/fishThali.avif" },
  { name: "Festival Journeys", marathi: "सण उत्सव", blurb: "Ganeshotsav, Shimga and night-long folk theatre.", src: "/assets/Ganpati_festivals.avif" },
  { name: "Nature Escapes", marathi: "निसर्ग भ्रमंती", blurb: "Monsoon ghats, waterfalls and sacred groves.", src: "/assets/monsoon_muntains.avif" },
  { name: "Cultural Immersion", marathi: "सांस्कृतिक अनुभव", blurb: "Dashavatar, temple towns and coastal craft.", src: "/assets/dashavatar.avif" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ─────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────── */
export default function OnelifeReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cardAutoTl = gsap.timeline({ paused: true });
      cardAutoTl
        .to(cardRef.current, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "power4.out" })
        .to(cardContentRef.current, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, "-=0.15");

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            // card appears once the image is fully revealed (during the hold)
            if (self.progress >= 0.72) cardAutoTl.play();
            else cardAutoTl.reverse();
          },
        },
      });

      // 1) reveal the image over the first ~60% of the pinned scroll
      mainTl.to(textGroupRef.current, { opacity: 0, duration: 0.5 }, 0);
      mainTl.to(frameRef.current, { opacity: 0, ease: "none", duration: 0.3 }, 0);
      mainTl.fromTo(
        imageWrapperRef.current,
        { clipPath: "inset(10% 30% 40% 30%)", scale: 0.8 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "none", duration: 1.5 },
        0,
      );

      // 2) HOLD — keep the fully-revealed image on screen for a beat before the
      //    pin releases, so the page doesn't jump straight into the next section.
      //    Re-tween the wrapper to its already-final values: no visual change,
      //    but it reliably adds scroll length where the image just sits.
      mainTl.to(imageWrapperRef.current, { scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1 });
    },
    { scope: containerRef },
  );

  return (
    <div className="bg-[#f0ede4] text-[#1a1a1a]">
      {/* ── HERO — pinned scroll reveal ─────────────────────────────── */}
      <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#f0ede4]">
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div
            ref={imageWrapperRef}
            className="relative w-full h-full flex items-start justify-center"
            style={{ clipPath: "inset(10% 30% 40% 30%)" }}
          >
            <div
              ref={frameRef}
              className="absolute z-10 pointer-events-none"
              style={{
                top: "10%", left: "30%", right: "30%", bottom: "40%",
                border: "3px solid #f5f2eb",
                boxShadow: "inset 0 0 0 8px #ccc4b3, inset 0 0 0 10px #d8d3c8",
              }}
            />
            <div className="relative w-full h-full p-6 bg-black border border-neutral-200 shadow-xl">
              <Image src={aboutImg} alt="Vision" fill className="object-cover" priority />
            </div>
          </div>
        </div>

        <div ref={textGroupRef} className="absolute inset-0 flex flex-col items-center justify-end pb-20 z-10 text-center">
          <h1 className="text-[18vw] sm:text-[100px] md:text-[150px] font-serif italic text-black leading-none uppercase mb-4">
            Vision
          </h1>
          <div className="space-y-4 text-neutral-800 px-6">
            <h2 className="text-base md:text-xl font-serif italic mb-12 md:mb-25">
              &ldquo;To be a credible destination...&rdquo;
            </h2>
            {/* <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-neutral-400 mb-4">
              Company Profile
            </p> */}
          </div>
        </div>

        <div className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] px-6">
          <div ref={cardRef} className="bg-[#f0ede4] shadow-2xl overflow-hidden opacity-0" style={{ clipPath: "inset(10% 30% 40% 30%)" }}>
            <div ref={cardContentRef} className="px-10 py-12 flex flex-col items-center text-center" style={{ opacity: 0, transform: "translateY(20px)" }}>
              <span className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-3 font-medium">Strategic Vision</span>
              <h2 className="text-xl md:text-3xl font-serif italic text-black leading-tight">Kokan Tourism</h2>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO — statement + mouse-parallax image ────────────────── */}
      <Intro />

      {/* ── STATS — count up on scroll ──────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-y border-black/10">
        <div className="max-w-[1300px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── WHAT WE OFFER — interactive hover selector ──────────────── */}
      <Offerings />

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-28 md:py-36 flex flex-col items-center text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-50 mb-8">Travel with us</p>
          <Link
            href="/contact"
            className="group font-serif italic text-[40px] md:text-[80px] leading-none hover:opacity-60 transition-opacity"
          >
            Start your journey
            <span className="inline-block ml-3 transition-transform group-hover:translate-x-3">→</span>
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-10 flex justify-between items-end w-full uppercase text-[10px] tracking-[0.3em] font-semibold opacity-50">
        <div className="flex gap-6 md:gap-10">
          <Link href="/blog" className="hover:opacity-50">News</Link>
          <Link href="/heaven" className="hover:opacity-50">Heaven</Link>
        </div>
        <div>Website by Mahesh Mohite</div>
      </footer>

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; overflow-x: hidden; margin: 0; }
      `}</style>
    </div>
  );
}

/* ── Intro: word reveal + image that smoothly glides with the cursor ── */
const ACCENT = new Set(["storytellers", "beaches", "festivals", "forests", "flavours"]);

function Intro() {
  const words = "We are storytellers of the Konkan coast — connecting curious travellers with its beaches, festivals, forests and flavours.".split(" ");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // soft, low-stiffness spring → the image lags then glides in, mersi-style
  const spring = { stiffness: 45, damping: 22, mass: 0.8 } as const;
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const tx = useTransform(sx, [-0.5, 0.5], [-55, 55]);
  const ty = useTransform(sy, [-0.5, 0.5], [-55, 55]);
  const scale = useSpring(1, spring);

  // track the cursor across the whole section so the image glides as you move
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onEnter() { scale.set(1.06); }
  function onLeave() {
    mx.set(0);
    my.set(0);
    scale.set(1);
  }

  return (
    <section
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="px-6 md:px-10 py-24 md:py-32"
    >
      <div className="max-w-[1300px] mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-center">
        <div>
          {/* numbered eyebrow */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="font-mono text-[11px] opacity-40">(01)</span>
            <span className="h-px w-10 bg-black/30" />
            <span className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-50">Who We Are</span>
          </motion.div>

          {/* statement — key words lift into the emerald accent */}
          <p className="font-serif text-[24px] sm:text-[32px] md:text-[40px] leading-[1.3] flex flex-wrap gap-x-[0.3em]">
            {words.map((w, i) => {
              const accent = ACCENT.has(w.toLowerCase().replace(/[^a-z]/g, ""));
              return (
                <span key={i} className="overflow-hidden inline-flex">
                  <motion.span
                    initial={{ y: "110%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.03 }}
                    className={`inline-block ${accent ? "italic text-emerald-700" : ""}`}
                  >
                    {w}
                  </motion.span>
                </span>
              );
            })}
          </p>

          {/* supporting copy */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 max-w-[48ch] font-mono text-[13px] leading-relaxed opacity-60"
          >
            Born on the Konkan coast, we craft journeys that move at the pace of
            the tide — rooted in the people, rituals and landscapes that make
            this shoreline unlike anywhere else.
          </motion.p>

          {/* link + meta */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <Link
              href="/heaven"
              className="group inline-flex items-center gap-2 font-serif italic text-lg md:text-xl hover:opacity-60 transition-opacity"
            >
              Explore the coast
              <span className="inline-block transition-transform group-hover:translate-x-1.5">→</span>
            </Link>
            <span className="uppercase text-[10px] tracking-[0.3em] font-bold opacity-40">
              Est. 2026 · Konkan, India
            </span>
          </motion.div>
        </div>

        {/* framed, captioned image with a clip-reveal entrance */}
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative w-full aspect-[4/5] overflow-hidden rounded-sm"
        >
          <motion.div className="absolute inset-[-14%] will-change-transform" style={{ x: tx, y: ty, scale }}>
            <Image src="/assets/river_with_tress.avif" alt="Konkan" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </motion.div>

          {/* legibility veil */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {/* thin inset frame echoing the hero */}
          <div className="pointer-events-none absolute inset-3 border border-white/25" />

          {/* caption */}
          <div className="pointer-events-none absolute bottom-5 left-5 text-[#f5f2ed]">
            <div className="font-serif italic text-xl leading-none">River of the Sahyadris</div>
            <div className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">निसर्गरम्य कोकण</div>
          </div>

          {/* vertical label */}
          <div className="pointer-events-none absolute top-5 right-5 font-mono text-[10px] tracking-[0.3em] uppercase text-[#f5f2ed] opacity-80 [writing-mode:vertical-rl]">
            Est. 2026
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Stat: counts up when it scrolls into view ──────────────────────── */
function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let startTime = 0;
    const dur = 1600;
    const tick = (t: number) => {
      if (!startTime) startTime = t;
      const p = Math.min((t - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center lg:text-left">
      <div className="font-serif text-5xl md:text-7xl leading-none tabular-nums">
        {n}
        <span className="text-2xl md:text-4xl align-baseline">{suffix}</span>
      </div>
      <div className="mt-3 uppercase text-[10px] tracking-[0.25em] font-bold opacity-60">{label}</div>
    </div>
  );
}

/* ── Offerings: hover a row → its image crossfades in ───────────────── */
function Offerings() {
  const [active, setActive] = useState(0);

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 bg-[#e5e2da]">
      <div className="max-w-[1300px] mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-between items-end mb-12 uppercase text-[10px] tracking-[0.3em] font-bold"
        >
          <h2 className="text-[13px]">What We Offer</h2>
          <span className="opacity-50">{OFFERINGS.length} Experiences</span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <ul className="order-2 md:order-1">
            {OFFERINGS.map((o, i) => {
              const isActive = i === active;
              return (
                <li
                  key={o.name}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group border-b border-black/10 py-5 md:py-6 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] opacity-40">{String(i + 1).padStart(2, "0")}</span>
                      <motion.span
                        animate={{ x: isActive ? 16 : 0, opacity: isActive ? 1 : 0.55 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="font-serif text-2xl md:text-4xl italic"
                      >
                        {o.name}
                      </motion.span>
                    </div>
                    <motion.span
                      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="font-serif text-lg hidden sm:block"
                    >
                      {o.marathi}
                    </motion.span>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 0.6, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="ml-9 mt-2 text-[13px] tracking-wide overflow-hidden"
                      >
                        {o.blurb}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="order-1 md:order-2 relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={OFFERINGS[active].src}
                  alt={OFFERINGS[active].name}
                  fill
                  sizes="(max-width:768px) 100vw, 45vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 left-4 text-[#f5f2ed] font-serif italic text-xl mix-blend-difference">
              {OFFERINGS[active].marathi}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
