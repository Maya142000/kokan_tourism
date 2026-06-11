"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
   Config
   ──────────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EMAIL = "mohitemahesh210@gmail.com";
const PHONE = "+91 91582 57831";
const INTERESTS = ["Coastal Stays", "Festival Journeys", "Culinary Trails", "Something else"];
const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ─────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────── */
export default function ContactSection() {
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  const valid =
    form.name.trim() !== "" &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.message.trim() !== "";

  // live Konkan (IST) clock
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function copyEmail() {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status !== "idle") return;
    setStatus("sending");
    // no backend wired — acknowledge with an animated success state
    setTimeout(() => setStatus("sent"), 1400);
  }

  function reset() {
    setForm({ name: "", email: "", message: "" });
    setInterest(INTERESTS[0]);
    setStatus("idle");
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f0ede4] text-[#1a1a1a] overflow-hidden">
      {/* faint oversized word in the background */}
      <div className="pointer-events-none absolute -bottom-10 -right-6 select-none font-sans font-black uppercase leading-none tracking-tighter text-black/[0.035] text-[26vw]">
        Konkan
      </div>

      <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20">
        {/* ── LEFT: heading + form ──────────────────────────────────── */}
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-4 mb-8">
            <span className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-50">Contact</span>
            <span className="h-px w-10 bg-black/30" />
            <span className="font-mono text-[11px] opacity-40">संपर्क</span>
          </motion.div>

          <h1 className="font-serif text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[0.98] tracking-tight">
            <span className="block overflow-hidden">
              <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease: EASE, delay: 0.1 }}>
                Let&rsquo;s plan your
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block italic" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease: EASE, delay: 0.18 }}>
                Konkan escape<span className="text-emerald-700">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.4 }} className="mt-8 max-w-[46ch] font-mono text-[13px] leading-relaxed opacity-60">
            Tell us what you&rsquo;re dreaming of — a quiet beach, a festival night, a
            table full of Malvani food — and we&rsquo;ll shape the journey around it.
          </motion.p>

          {/* form / success swap */}
          <div className="mt-12 min-h-[420px]">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex flex-col items-start gap-6 py-10"
                >
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
                    <motion.circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }} />
                    <motion.path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.5 }} />
                  </svg>
                  <div>
                    <h3 className="font-serif text-3xl italic mb-2">Message received.</h3>
                    <p className="font-mono text-[13px] opacity-60 max-w-[42ch]">
                      Thank you, {form.name.split(" ")[0] || "traveller"}. We&rsquo;ll be in touch about your{" "}
                      <span className="text-emerald-700">{interest.toLowerCase()}</span> within a day or two.
                    </p>
                  </div>
                  <button onClick={reset} className="group inline-flex items-center gap-2 font-serif italic text-lg hover:opacity-60 transition-opacity">
                    Send another
                    <span className="inline-block transition-transform group-hover:translate-x-1.5">→</span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  {/* interest chips */}
                  <div>
                    <p className="font-mono uppercase tracking-[0.2em] text-[10px] opacity-50 mb-4">I&rsquo;m interested in</p>
                    <div className="flex flex-wrap gap-3">
                      {INTERESTS.map((it) => {
                        const on = interest === it;
                        return (
                          <button
                            key={it}
                            type="button"
                            onClick={() => setInterest(it)}
                            className={`relative px-5 py-2.5 rounded-full border text-[0.72rem] tracking-[0.1em] uppercase transition-colors duration-200 ${
                              on ? "text-[#f0ede4] border-[#1a1a1a]" : "text-[#1a1a1a] border-black/25 hover:border-[#1a1a1a]"
                            }`}
                          >
                            {on && (
                              <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-[#1a1a1a]" transition={{ duration: 0.4, ease: EASE }} />
                            )}
                            <span className="relative">{it}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Your name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                  <Field label="Email address" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
                  <Field label="Tell us about your trip" textarea value={form.message} onChange={(v) => setForm((f) => ({ ...f, message: v }))} />

                  <MagneticSubmit disabled={!valid} status={status} />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: visual + details ───────────────────────────────── */}
        <div className="flex flex-col gap-10">
          <ParallaxImage />

          {/* email with copy */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="font-mono uppercase tracking-[0.2em] text-[10px] opacity-50 mb-3">Email us</p>
            <button onClick={copyEmail} className="group flex items-center gap-3 text-left">
              <span className="font-serif text-xl md:text-2xl italic group-hover:text-emerald-700 transition-colors">{EMAIL}</span>
              <span className="relative font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
                <AnimatePresence mode="wait">
                  <motion.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="inline-block">
                    {copied ? "Copied!" : "Copy"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </motion.div>

          {/* phone + address grid */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 gap-8">
            <Detail label="Call">
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-emerald-700 transition-colors">{PHONE}</a>
            </Detail>
            <Detail label="Konkan time">
              <span className="tabular-nums">{time}</span>
            </Detail>
            <Detail label="Studio">Khed, Maharashtra</Detail>
            <Detail label="On the coast">MH 08 · Ratnagiri</Detail>
          </motion.div>

          {/* socials */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="font-mono uppercase tracking-[0.2em] text-[10px] opacity-50 mb-3">Follow</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {SOCIALS.map((s) => (
                <Link key={s.label} href={s.href} className="group inline-flex items-center gap-1.5 font-serif text-lg italic hover:opacity-60 transition-opacity">
                  {s.label}
                  <span className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="relative px-6 md:px-10 pb-8 flex justify-between items-end text-[9px] uppercase tracking-[0.3em] font-bold opacity-40">
        <div className="font-black">निसर्गरम्य ठिकाण</div>
        <div className="hidden md:block">Website by Mahesh Mohite</div>
      </footer>
    </div>
  );
}

/* ── Animated form field with floating label + emerald focus underline ─ */
function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const lifted = focus || value.length > 0;

  return (
    <div className="relative pt-6">
      <label
        className={`pointer-events-none absolute left-0 font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
          lifted ? "top-0 text-[9px] opacity-50" : "top-8 text-[12px] opacity-40"
        }`}
      >
        {label}
      </label>

      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full resize-none bg-transparent pt-2 pb-3 text-[15px] outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full bg-transparent pt-2 pb-3 text-[15px] outline-none"
        />
      )}

      <span className="absolute bottom-0 left-0 h-px w-full bg-black/15" />
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-emerald-700"
        animate={{ scaleX: focus ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
    </div>
  );
}

/* ── Magnetic submit button with sending/idle states ──────────────────── */
function MagneticSubmit({ disabled, status }: { disabled: boolean; status: "idle" | "sending" | "sent" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function move(e: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  }
  function leave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="submit"
      disabled={disabled || status !== "idle"}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex items-center gap-3 rounded-full px-9 py-4 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 ${
        disabled
          ? "cursor-not-allowed border border-black/15 text-black/30"
          : "bg-[#1a1a1a] text-[#f0ede4] hover:bg-emerald-700"
      }`}
    >
      <span>{status === "sending" ? "Sending" : "Send message"}</span>
      {status === "sending" ? (
        <motion.span className="inline-block h-3 w-3 rounded-full border border-current border-t-transparent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }} />
      ) : (
        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      )}
    </motion.button>
  );
}

/* ── Small labelled detail ────────────────────────────────────────────── */
function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono uppercase tracking-[0.2em] text-[10px] opacity-50 mb-2">{label}</p>
      <p className="font-serif text-base md:text-lg">{children}</p>
    </div>
  );
}

/* ── Interactive gallery: 3D cursor-tilt + auto-cycling clip-wipe slides ─ */
const GALLERY = [
  { src: "/assets/beach_of_kokan.avif", title: "Tarkarli Shore", marathi: "कोकण किनारा" },
  { src: "/assets/monsoon_muntains.avif", title: "Sahyadri Ghats", marathi: "सह्याद्री" },
  { src: "/assets/Ganpati_festivals.avif", title: "Ganeshotsav", marathi: "गणेशोत्सव" },
  { src: "/assets/river_with_tress.avif", title: "The Backwaters", marathi: "निसर्ग" },
];

function ParallaxImage() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  // normalized cursor (-0.5 … 0.5) → 3D tilt + layered depth parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 120, damping: 16, mass: 0.5 } as const;
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), spring);
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), spring);
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-16, 16]), spring);

  // auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setI((p) => (p + 1) % GALLERY.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function leave() {
    mx.set(0);
    my.set(0);
  }
  function goTo(target: number) {
    setDir(target > i ? 1 : -1);
    setI(target);
  }

  const item = GALLERY[i];

  return (
    <motion.div
      onMouseMove={move}
      onMouseLeave={leave}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EASE }}
      className="relative w-full aspect-[5/4]"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-sm shadow-xl"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* slides — clip-wipe between Konkan images */}
        <AnimatePresence initial={false}>
          <motion.div
            key={i}
            initial={{ clipPath: dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0"
          >
            <motion.div className="absolute inset-[-12%]" style={{ x: tx, y: ty }}>
              <Image src={item.src} alt={item.title} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" priority />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-3 border border-white/25" />

        {/* caption — swaps per slide */}
        <div className="pointer-events-none absolute bottom-4 left-4 text-[#f5f2ed]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="font-serif italic text-lg leading-none">{item.title}</div>
              <div className="mt-1.5 font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">{item.marathi}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* indicators */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {GALLERY.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`View ${GALLERY[idx].title}`}
              className="h-1.5 rounded-full bg-white/50 transition-all duration-300 hover:bg-white"
              style={{ width: idx === i ? 22 : 6, backgroundColor: idx === i ? "#fff" : undefined }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
