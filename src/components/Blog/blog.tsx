"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
   Data
   ──────────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Post = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  read: string;
  tags: string[];
};

const POSTS: Post[] = [
  { id: 1, title: "Where the Sahyadris Meet the Sea", excerpt: "A monsoon drive down the ghats, where waterfalls spill onto the road and the coast appears in a haze of green.", category: "Nature", image: "/assets/monsoon_muntains.avif", date: "12 May 2026", read: "6 min", tags: ["Monsoon", "Ghats", "Drive"] },
  { id: 2, title: "A Morning on Tarkarli's Sands", excerpt: "Before the boats set out, the beach belongs to fishermen and the tide. Dawn, watching the Konkan wake up.", category: "Beaches", image: "/assets/beach_of_kokan.avif", date: "28 Apr 2026", read: "5 min", tags: ["Dawn", "Fishing", "Beach"] },
  { id: 3, title: "Ganeshotsav: Ten Days of Devotion", excerpt: "How an entire coastline comes home for the festival — the drums, the modaks, and the night of the visarjan.", category: "Festivals", image: "/assets/Ganpati_festivals.avif", date: "15 Apr 2026", read: "8 min", tags: ["Ganpati", "Tradition", "Night"] },
  { id: 4, title: "The Malvani Thali, Course by Course", excerpt: "Sol kadhi to fresh pomfret — a guide to eating your way through a coastal kitchen, the way locals do.", category: "Food", image: "/assets/fishThali.avif", date: "2 Apr 2026", read: "7 min", tags: ["Seafood", "Sol kadhi", "Recipe"] },
  { id: 5, title: "Dashavatar: Theatre Under the Stars", excerpt: "A night-long folk performance retelling the ten avatars — painted faces, oil lamps, and a village awake.", category: "Culture", image: "/assets/dashavatar.avif", date: "20 Mar 2026", read: "6 min", tags: ["Folk", "Theatre", "Night"] },
  { id: 6, title: "Kombdi Vade: A Konkani Sunday", excerpt: "The spiced chicken curry and pillowy vade that anchor every coastal feast — made by hand, as ever.", category: "Food", image: "/assets/kombdivade.avif", date: "9 Mar 2026", read: "4 min", tags: ["Curry", "Family", "Recipe"] },
  { id: 7, title: "Alphonso Season on the Coast", excerpt: "For two short months the air turns sweet. Inside the orchards of Devgad, where the king of mangoes ripens.", category: "Food", image: "/assets/Alphanso_mango.avif", date: "24 Feb 2026", read: "5 min", tags: ["Mango", "Orchards", "Devgad"] },
  { id: 8, title: "Shimga: The Coast's Spring Carnival", excerpt: "Palkhis, folk songs and colour — the Konkan's own take on Holi, carried from village to village.", category: "Festivals", image: "/assets/Shimga_home.avif", date: "11 Feb 2026", read: "6 min", tags: ["Holi", "Palkhi", "Colour"] },
  { id: 9, title: "Backwaters & Sacred Groves", excerpt: "Paddling past mangroves into the devrai — the protected forests the coast has kept wild for centuries.", category: "Nature", image: "/assets/river_with_tress.avif", date: "30 Jan 2026", read: "7 min", tags: ["Mangroves", "Devrai", "Kayak"] },
];

const CATEGORIES = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];

const PROCESS = [
  { t: "Listen", d: "We begin with what you're dreaming of — a beach, a festival, a table of food." },
  { t: "Shape the route", d: "A journey designed around the coast, the tides and the season." },
  { t: "Local hosts", d: "Homestays, guides and the people who know the Konkan best." },
  { t: "On the road", d: "You travel; we stay on call from the first mile to the last." },
  { t: "Stories home", d: "Photographs, recipes and a coast that stays with you." },
];

/* rotating Marathi headlines */
const HEADLINES = [
  "येवा कोकण आपलोच असा",
  "निसर्गरम्य कोकण",
  "स्वर्ग म्हणजे कोकण",
  "माझा सुंदर कोकण",
  "कोकण — जिथे निसर्ग बोलतो",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ─────────────────────────────────────────────────────────────────────
   Page — work/portfolio-style grid
   ──────────────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? POSTS : POSTS.filter((p) => p.category === active);

  // auto-rotate the Marathi headline
  const [hi, setHi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHi((p) => (p + 1) % HEADLINES.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0ede4] text-[#1a1a1a]">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-32 md:pt-40 pb-14 border-b border-black/10">
        <div className="max-w-[1300px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-4 mb-8">
            <span className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-50">Journal</span>
            <span className="h-px w-10 bg-black/30" />
            <span className="font-mono text-[11px] opacity-40">कोकण कथा</span>
          </motion.div>

          <h1 className="font-sans font-black tracking-tight leading-[1.14] text-[clamp(2.2rem,7.5vw,6rem)] min-h-[1.3em] flex items-start">
            <AnimatePresence mode="wait">
              <motion.span
                key={hi}
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-40%", opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="block"
              >
                {HEADLINES[hi]}
                <span className="text-emerald-700"> !</span>
              </motion.span>
            </AnimatePresence>
          </h1>

          <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-20 items-end">
            <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.4 }} className="font-mono text-[13px] leading-relaxed opacity-65 max-w-[52ch]">
              Dispatches from India&rsquo;s Konkan coast — its beaches, festivals, forests
              and kitchens, told by the people who live them.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── FILTER + GRID ────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-14 md:py-20">
        <div className="max-w-[1300px] mx-auto">
          {/* filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => {
                const on = active === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className="relative overflow-hidden rounded-full border border-[#1a1a1a]/80 px-5 py-2 cursor-pointer"
                  >
                    {on && <motion.span layoutId="blogFilter" className="absolute inset-0 bg-[#1a1a1a]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                    <span className={`relative text-[0.72rem] tracking-[0.13em] uppercase transition-colors duration-300 ${on ? "text-[#f0ede4]" : "text-[#1a1a1a]"}`}>{cat}</span>
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-40">{String(filtered.length).padStart(2, "0")} Stories</span>
          </div>

          {/* grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              {filtered.map((p) => (
                <WorkCard key={p.id} post={p} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── PROCESS (5 phases) ───────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-t border-black/10">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 mb-6">
                <span className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-50">How We Travel</span>
                <span className="h-px w-10 bg-black/30" />
                <span className="font-mono text-[11px] opacity-40">कार्यपद्धत</span>
              </motion.div>
              <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.02] tracking-tight">
                From idea to <span className="italic text-emerald-700">journey.</span>
              </h2>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-40">05 Steps</span>
          </div>

          <div className="border-t border-black/10">
            {PROCESS.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                className="group grid md:grid-cols-[auto_1.2fr_2fr] gap-3 md:gap-10 items-baseline border-b border-black/10 py-7 md:py-9"
              >
                <span className="font-mono text-[11px] opacity-40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-2xl md:text-4xl tracking-tight transition-colors duration-300 group-hover:text-emerald-700">{s.t}</h3>
                <p className="font-mono text-[12.5px] leading-relaxed opacity-60 max-w-[44ch]">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 md:py-32 border-t border-black/10">
        <div className="max-w-[1300px] mx-auto flex flex-col items-center text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-sans font-black uppercase tracking-tighter leading-[0.92] text-[clamp(2.4rem,7vw,6rem)]"
          >
            Want to see
            <br />
            it yourself<span className="text-emerald-700">?</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-6 font-mono text-[13px] leading-relaxed opacity-65 max-w-[46ch]">
            From a quiet beach to a festival night — we&rsquo;ll shape the journey around you.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link href="/contact" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#1a1a1a] text-[#f0ede4] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors">
              Start your trip
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-10 flex justify-between items-end w-full uppercase text-[10px] tracking-[0.3em] font-semibold opacity-50 border-t border-black/10">
        <div className="flex gap-6 md:gap-10">
          <Link href="/about" className="hover:opacity-50">About</Link>
          <Link href="/kokandiaries" className="hover:opacity-50">Kokan Diaries</Link>
        </div>
        <div>Website by Mahesh Mohite</div>
      </footer>
    </div>
  );
}

/* ── Overlay tile card: image fills, content on top, tags reveal on hover ─ */
function WorkCard({ post }: { post: Post }) {
  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
      className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
    >
      <Link href="#" className="block h-full w-full">
        <Image src={post.image} alt={post.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

        {/* top row */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[#f4f1ea]">
          <span className="rounded-full bg-white/15 backdrop-blur-sm uppercase text-[9px] tracking-[0.2em] font-bold px-3 py-1.5">{post.category}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-80">{post.date}</span>
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-[#f4f1ea]">
          <h3 className="font-sans font-bold text-xl md:text-2xl leading-tight tracking-tight">{post.title}</h3>

          {/* reveal on hover — tags + read */}
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="overflow-hidden">
              <div className="pt-3 flex flex-wrap items-center gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/30 px-3 py-1 font-mono text-[10px] tracking-wide">{t}</span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                Read story <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
