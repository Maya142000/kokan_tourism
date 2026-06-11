"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
   Data
   ──────────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Dest = {
  id: string;
  name: string;
  marathi: string;
  region: string;
  category: string;
  image: string;
  tagline: string;
  about: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  distance: string;
  itinerary: { day: string; title: string; detail: string }[];
};

const DESTINATIONS: Dest[] = [
  {
    id: "tarkarli",
    name: "Tarkarli",
    marathi: "तारकर्ली",
    region: "Sindhudurg",
    category: "Beaches",
    image: "/assets/beach_of_kokan.avif",
    tagline: "Crystal backwaters & scuba diving",
    about:
      "A spit of white sand where the Karli river meets the Arabian Sea. Tarkarli's clear, shallow waters make it the Konkan's snorkelling and scuba capital.",
    highlights: ["Scuba & snorkelling", "Backwater kayaking", "Dolphin boat rides", "Tsunami island sandbar"],
    bestTime: "Nov – May",
    duration: "2–3 days",
    distance: "540 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Arrive & unwind", detail: "Settle into a beachfront homestay, sunset on the sandbar." },
      { day: "Day 2", title: "Into the water", detail: "Morning scuba, afternoon backwater kayaking and dolphin spotting." },
      { day: "Day 3", title: "Sindhudurg Fort", detail: "Boat across to the sea fort before the journey home." },
    ],
  },
  {
    id: "amboli",
    name: "Amboli Ghat",
    marathi: "आंबोली",
    region: "Sindhudurg",
    category: "Nature",
    image: "/assets/monsoon_muntains.avif",
    tagline: "Misty waterfalls in the Sahyadris",
    about:
      "A hill station on the lip of the Western Ghats that turns into a world of cloud and cascade through the monsoon — a biodiversity hotspot of frogs, hornbills and orchids.",
    highlights: ["Amboli & Nangarta falls", "Sunset point", "Monsoon trekking", "Rare wildlife"],
    bestTime: "Jun – Oct",
    duration: "1–2 days",
    distance: "490 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Chase the falls", detail: "Amboli waterfall, hiranyakeshi temple and the misty viewpoints." },
      { day: "Day 2", title: "Forest morning", detail: "Guided walk for amphibians and birds, then descend to the coast." },
    ],
  },
  {
    id: "ganpatipule",
    name: "Ganpatipule",
    marathi: "गणपतीपुळे",
    region: "Ratnagiri",
    category: "Temples",
    image: "/assets/cocunut_palm_trees.avif",
    tagline: "A seaside Ganesh temple town",
    about:
      "A 400-year-old swayambhu Ganpati temple sits right where the palms meet a clean, curving beach — the Konkan's most beloved pilgrimage by the sea.",
    highlights: ["Swayambhu Ganpati temple", "Pradakshina hill walk", "Quiet golden beach", "Prachin Konkan museum"],
    bestTime: "Oct – Mar",
    duration: "1–2 days",
    distance: "375 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Darshan & shore", detail: "Early temple darshan, then a slow beach afternoon." },
      { day: "Day 2", title: "Konkan heritage", detail: "Prachin Konkan museum and Jaigad fort nearby." },
    ],
  },
  {
    id: "vijaydurg",
    name: "Vijaydurg",
    marathi: "विजयदुर्ग",
    region: "Sindhudurg",
    category: "Heritage",
    image: "/assets/river_with_tress.avif",
    tagline: "Sea fort & still backwaters",
    about:
      "The 'Victory Fort' — a Maratha naval stronghold guarding a deep tidal creek, ringed by some of the calmest backwaters on the coast.",
    highlights: ["Vijaydurg sea fort", "Backwater boat rides", "Old wada villages", "Sunset ramparts"],
    bestTime: "Nov – Apr",
    duration: "1–2 days",
    distance: "485 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Walk the ramparts", detail: "Explore the triple-walled fort and its hidden tunnels." },
      { day: "Day 2", title: "On the water", detail: "Drift through the creek and visit riverside hamlets." },
    ],
  },
  {
    id: "sawantwadi",
    name: "Sawantwadi",
    marathi: "सावंतवाडी",
    region: "Sindhudurg",
    category: "Culture",
    image: "/assets/dashavatar.avif",
    tagline: "Ganjifa art & Dashavatar theatre",
    about:
      "A former princely town that keeps the old crafts alive — hand-painted Ganjifa playing cards, lacquered wooden toys, and night-long Dashavatar folk theatre.",
    highlights: ["Ganjifa card painting", "Lacquerware bazaar", "Dashavatar performance", "Moti Talav lake"],
    bestTime: "Oct – Mar",
    duration: "1 day",
    distance: "540 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Crafts & theatre", detail: "Artisan workshops by day, a Dashavatar night under oil lamps." },
    ],
  },
  {
    id: "devgad",
    name: "Devgad",
    marathi: "देवगड",
    region: "Sindhudurg",
    category: "Food",
    image: "/assets/Alphanso_mango.avif",
    tagline: "Home of the Alphonso mango",
    about:
      "A breezy port town whose volcanic-soil orchards grow the world's most prized Alphonso. In season the whole coast smells of ripening mango.",
    highlights: ["Alphonso orchard visits", "Devgad windmill cliffs", "Lighthouse & fort", "Coastal seafood"],
    bestTime: "Mar – May (mango)",
    duration: "1–2 days",
    distance: "445 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Orchard trail", detail: "Walk the hapus orchards, taste straight from the tree." },
      { day: "Day 2", title: "Cliffs & coast", detail: "Windmill viewpoints, the fort lighthouse and a seafood thali." },
    ],
  },
  {
    id: "malvan",
    name: "Malvan",
    marathi: "मालवण",
    region: "Sindhudurg",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=70",
    tagline: "Sindhudurg fort & Malvani feasts",
    about:
      "The heart of the Malvan coast — a sea fort built by Shivaji, world-class scuba over coral reefs, and the fiery cuisine that carries the region's name.",
    highlights: ["Sindhudurg sea fort", "Scuba diving", "Rock garden", "Malvani thali"],
    bestTime: "Oct – May",
    duration: "2 days",
    distance: "525 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Fort & reef", detail: "Boat to Sindhudurg fort, then scuba over the reefs." },
      { day: "Day 2", title: "Coast & kitchen", detail: "Rock garden sunrise and a long Malvani lunch." },
    ],
  },
  {
    id: "ratnagiri",
    name: "Ratnagiri",
    marathi: "रत्नागिरी",
    region: "Ratnagiri",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=70",
    tagline: "Thibaw Palace & black-sand coves",
    about:
      "A historic port town of black-sand coves, the exiled Burmese king's palace, and the birthplace of Lokmanya Tilak.",
    highlights: ["Thibaw Palace", "Bhatye beach", "Ratnadurg fort", "Tilak's birthplace"],
    bestTime: "Oct – Mar",
    duration: "1–2 days",
    distance: "330 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Town & fort", detail: "Thibaw Palace, the museum, and sunset at Ratnadurg." },
    ],
  },
  {
    id: "guhagar",
    name: "Guhagar",
    marathi: "गुहागर",
    region: "Ratnagiri",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70",
    tagline: "A single, perfect sweep of sand",
    about:
      "One long, clean, casuarina-lined beach runs the length of the town — among the quietest stretches of the entire Konkan.",
    highlights: ["6 km beach", "Vyadeshwar temple", "Anjanvel lighthouse", "Betel-nut groves"],
    bestTime: "Oct – May",
    duration: "1–2 days",
    distance: "300 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Slow shore", detail: "Walk the full beach, temple darshan, lighthouse at dusk." },
    ],
  },
  {
    id: "velneshwar",
    name: "Velneshwar",
    marathi: "वेळणेश्वर",
    region: "Ratnagiri",
    category: "Temples",
    image: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?auto=format&fit=crop&w=1200&q=70",
    tagline: "A Shiva temple at the water's edge",
    about:
      "A serene, palm-fringed beach with an ancient Shiva temple right beside the surf — safe, shallow waters and almost no crowds.",
    highlights: ["Velneshwar Shiva temple", "Safe swimming beach", "Mahashivratri fair", "Coconut groves"],
    bestTime: "Oct – Mar",
    duration: "1 day",
    distance: "310 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Temple & tide", detail: "Morning darshan, a long swim, and coconut water in the shade." },
    ],
  },
  {
    id: "harihareshwar",
    name: "Harihareshwar",
    marathi: "हरिहरेश्वर",
    region: "Raigad",
    category: "Temples",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=70",
    tagline: "The 'Kashi of the South'",
    about:
      "A revered Kalbhairav temple set between four hills and the sea, with a famous rocky pradakshina route washed by the waves.",
    highlights: ["Kalbhairav temple", "Seaside pradakshina", "Harihareshwar beach", "Shrivardhan nearby"],
    bestTime: "Oct – Mar",
    duration: "1 day",
    distance: "200 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Rock circuit", detail: "Temple darshan and the wave-washed pradakshina around the headland." },
    ],
  },
  {
    id: "dajipur",
    name: "Dajipur",
    marathi: "दाजीपूर",
    region: "Kolhapur",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=70",
    tagline: "Bison country in the Sahyadris",
    about:
      "A wild, forested plateau where the Konkan climbs into the ghats — a bison sanctuary of dense jungle, lakes and cool mountain air.",
    highlights: ["Gaur (bison) safari", "Radhanagari lake", "Dense Sahyadri forest", "Birding trails"],
    bestTime: "Oct – Feb",
    duration: "1–2 days",
    distance: "400 km from Mumbai",
    itinerary: [
      { day: "Day 1", title: "Into the jungle", detail: "Dawn safari for gaur and a walk to the Radhanagari backwaters." },
    ],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(DESTINATIONS.map((d) => d.category)))];

type Trip = { id: string; title: string; days: string; image: string; priceFrom: string; tag: string; highlights: string[] };
const TRIPS: Trip[] = [
  { id: "coast", title: "The Coastal Trail", days: "3 Days · 2 Nights", image: "/assets/cocunut_palm_trees.avif", priceFrom: "₹8,900", tag: "Beaches", highlights: ["Tarkarli", "Malvan", "Sindhudurg Fort"] },
  { id: "festival", title: "Festival Journey", days: "4 Days · 3 Nights", image: "/assets/Ganpati_festivals.avif", priceFrom: "₹12,500", tag: "Culture", highlights: ["Ganeshotsav", "Dashavatar", "Temple towns"] },
  { id: "food", title: "Food & Orchard Trail", days: "2 Days · 1 Night", image: "/assets/fishThali.avif", priceFrom: "₹6,400", tag: "Food", highlights: ["Malvani thali", "Alphonso orchards", "Kombdi vade"] },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ─────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────── */
export default function KokanDiaries() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<Dest | null>(null);

  const filtered = active === "All" ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === active);

  return (
    <div className="bg-[#f0ede4] text-[#1a1a1a]">
      {/* ── HERO SLIDER ───────────────────────────────────────────────── */}
      <HeroSlider onOpen={setSelected} />

      {/* ── EXPLORER ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-20 md:pt-28 pb-10">
        <div className="max-w-[1300px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 mb-8">
            <span className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-50">Explore</span>
            <span className="h-px w-10 bg-black/30" />
            <span className="font-mono text-[11px] opacity-40">कोकण भ्रमंती</span>
          </motion.div>

          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 mb-10">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.02] tracking-tight">
              Every diary needs a <span className="italic text-emerald-700">destination.</span>
            </motion.h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-40">
              {String(filtered.length).padStart(2, "0")} places
            </span>
          </div>

          {/* filter pills — sliding active indicator + counts */}
          <div className="flex flex-wrap gap-2.5 mb-12">
            {CATEGORIES.map((cat) => {
              const on = active === cat;
              const count = cat === "All" ? DESTINATIONS.length : DESTINATIONS.filter((d) => d.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className="relative overflow-hidden rounded-full border border-[#1a1a1a]/80 px-5 py-2.5 cursor-pointer"
                >
                  {on && (
                    <motion.span
                      layoutId="kdFilter"
                      className="absolute inset-0 bg-[#1a1a1a]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={`relative flex items-center gap-1.5 text-[0.72rem] tracking-[0.13em] uppercase transition-colors duration-300 ${on ? "text-[#f0ede4]" : "text-[#1a1a1a]"}`}>
                    {cat}
                    <span className="text-[9px] opacity-60">{String(count).padStart(2, "0")}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* expanding-panel destinations — hover/tap to expand */}
          <ExpandingPanels key={active} items={filtered} onOpen={setSelected} />
        </div>
      </section>

      {/* ── TRIPS ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 md:py-28 bg-[#e5e2da]">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex justify-between items-end mb-12 uppercase text-[10px] tracking-[0.3em] font-bold">
            <h2 className="text-[13px]">Curated Trips</h2>
            <span className="opacity-50">{TRIPS.length} Journeys</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TRIPS.map((t, i) => (
              <TripCard key={t.id} trip={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-28 md:py-36 flex flex-col items-center text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-50 mb-8">Write your own diary</p>
          <Link href="/contact" className="group font-serif italic text-[40px] md:text-[80px] leading-none hover:opacity-60 transition-opacity">
            Plan my journey
            <span className="inline-block ml-3 transition-transform group-hover:translate-x-3">→</span>
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-10 flex justify-between items-end w-full uppercase text-[10px] tracking-[0.3em] font-semibold opacity-50 border-t border-black/10">
        <div className="flex gap-6 md:gap-10">
          <Link href="/blog" className="hover:opacity-50">Journal</Link>
          <Link href="/about" className="hover:opacity-50">About</Link>
        </div>
        <div>Website by Mahesh Mohite</div>
      </footer>

      {/* ── DETAIL MODAL ─────────────────────────────────────────────── */}
      <DestModal dest={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ── Hero slider: autoplay + drag + prev/next + indicators ───────────── */
const slideV: Variants = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

function HeroSlider({ onOpen }: { onOpen: (d: Dest) => void }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const i = ((index % DESTINATIONS.length) + DESTINATIONS.length) % DESTINATIONS.length;
  const dest = DESTINATIONS[i];

  const go = useCallback((d: number) => setState(([idx]) => [idx + d, d]), []);

  useEffect(() => {
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [index, go]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-[#f4f1ea]">
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={index}
          custom={dir}
          variants={slideV}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { duration: 0.8, ease: EASE }, opacity: { duration: 0.4 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) go(1);
            else if (info.offset.x > 80) go(-1);
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image src={dest.image} alt={dest.name} fill priority sizes="100vw" className="object-cover pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* slide content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-10 pb-16 md:pb-20 pointer-events-none">
        <div className="max-w-[1300px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: EASE }}>
              <div className="flex items-center gap-4 uppercase text-[10px] tracking-[0.3em] font-bold mb-5">
                <span className="text-emerald-400">{dest.category}</span>
                <span className="h-px w-8 bg-white/40" />
                <span className="opacity-80">{dest.region}</span>
              </div>
              <h1 className="font-serif text-[clamp(3rem,11vw,9rem)] leading-[0.9] tracking-tight">
                {dest.name}
                <span className="ml-4 align-middle font-sans text-[clamp(1rem,3vw,2rem)] opacity-70">{dest.marathi}</span>
              </h1>
              <p className="mt-4 max-w-[44ch] font-mono text-[13px] md:text-sm opacity-80">{dest.tagline}</p>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 pointer-events-auto">
                <button onClick={() => onOpen(dest)} className="group inline-flex items-center gap-3 rounded-full bg-[#f4f1ea] text-black px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-colors">
                  View details <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
                <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.18em] opacity-80">
                  <span>◷ {dest.duration}</span>
                  <span className="hidden sm:inline">☼ {dest.bestTime}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* controls */}
          <div className="mt-12 flex items-center justify-between pointer-events-auto">
            <div className="flex gap-2">
              {DESTINATIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setState(([cur]) => [cur + (idx - i), idx > i ? 1 : -1])}
                  aria-label={`Slide ${idx + 1}`}
                  className="h-1.5 rounded-full bg-white/40 transition-all duration-300 hover:bg-white"
                  style={{ width: idx === i ? 28 : 7, backgroundColor: idx === i ? "#fff" : undefined }}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => go(-1)} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-white/40 text-lg hover:bg-white hover:text-black transition-colors">‹</button>
              <button onClick={() => go(1)} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-white/40 text-lg hover:bg-white hover:text-black transition-colors">›</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Expanding panels: hover/tap a panel to grow it, others shrink ────── */
function ExpandingPanels({ items, onOpen }: { items: Dest[]; onOpen: (d: Dest) => void }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex gap-2.5 md:gap-3 h-[440px] md:h-[560px] overflow-x-auto [scrollbar-width:none]">
      {items.map((d, idx) => {
        const isOpen = open === idx;
        return (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: idx * 0.06 }}
            onMouseEnter={() => setOpen(idx)}
            onFocus={() => setOpen(idx)}
            onClick={() => (isOpen ? onOpen(d) : setOpen(idx))}
            style={{ flexGrow: isOpen ? 6 : 1 }}
            aria-label={d.name}
            className="group relative h-full basis-0 min-w-[46px] overflow-hidden rounded-2xl border border-white/10 text-left transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
          >
            <Image
              src={d.image}
              alt={d.name}
              fill
              sizes="(max-width:768px) 70vw, 40vw"
              className={`object-cover transition-transform duration-700 ${isOpen ? "scale-100" : "scale-110"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

            {/* collapsed: vertical name label */}
            <span
              className={`pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-lg text-[#f4f1ea] [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300 ${
                isOpen ? "opacity-0" : "opacity-90"
              }`}
            >
              {d.name}
            </span>

            {/* expanded: full content */}
            <div className={`absolute inset-0 flex flex-col justify-between p-5 md:p-7 transition-opacity duration-500 ${isOpen ? "opacity-100 delay-150" : "opacity-0"}`}>
              <div className="flex items-center justify-between text-[#f4f1ea]">
                <span className="rounded-full bg-white/15 backdrop-blur-sm uppercase text-[9px] tracking-[0.2em] font-bold px-3 py-1.5">{d.category}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">{d.region}</span>
              </div>
              <div className="max-w-[36ch] text-[#f4f1ea]">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">{d.bestTime} · {d.duration}</div>
                <h3 className="font-serif text-3xl md:text-5xl leading-none tracking-tight">
                  {d.name}
                  <span className="ml-2 align-middle font-mono text-xs opacity-60">{d.marathi}</span>
                </h3>
                <p className="mt-3 font-mono text-[12.5px] leading-relaxed text-white/85">{d.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                  View details <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── Trip card (travel "ticket" style) ────────────────────────────────── */
function TripCard({ trip, index }: { trip: Trip; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#f0ede4] shadow-[0_20px_40px_-28px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_32px_56px_-30px_rgba(0,0,0,0.55)]">
        {/* top: image stub */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={trip.image} alt={trip.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          <span className="absolute top-4 left-4 rounded-full bg-[#f0ede4]/90 backdrop-blur-sm uppercase text-[9px] tracking-[0.2em] font-bold px-3 py-1.5">{trip.tag}</span>
          <span className="absolute top-2 right-4 font-serif text-6xl leading-none text-white/85">{String(index + 1).padStart(2, "0")}</span>
          <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#f4f1ea]">{trip.days}</span>
        </div>

        {/* perforated tear line with notch cut-outs */}
        <div className="relative h-0">
          <span className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[#e5e2da]" />
          <span className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[#e5e2da]" />
          <div className="absolute left-5 right-5 top-0 border-t border-dashed border-black/25" />
        </div>

        {/* body: itinerary stub */}
        <div className="px-6 pt-7 pb-6">
          <h3 className="font-serif text-2xl tracking-tight mb-4">{trip.title}</h3>

          {/* route */}
          <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] opacity-65">
            {trip.highlights.map((h, i) => (
              <span key={h} className="flex items-center gap-2">
                {i > 0 && <span className="text-emerald-700">→</span>}
                {h}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">From </span>
              <span className="font-serif text-xl">{trip.priceFrom}</span>
            </div>
            <Link href="/contact" className="group/btn inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] text-[#f0ede4] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors">
              Enquire <span className="inline-block transition-transform group-hover/btn:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Destination detail modal ─────────────────────────────────────────── */
function DestModal({ dest, onClose }: { dest: Dest | null; onClose: () => void }) {
  useEffect(() => {
    if (!dest) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dest, onClose]);

  return (
    <AnimatePresence>
      {dest && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-stretch md:items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-10 w-full max-w-5xl max-h-screen md:max-h-[88vh] overflow-y-auto bg-[#f0ede4] text-[#1a1a1a] rounded-none md:rounded-sm grid md:grid-cols-2"
          >
            {/* image side */}
            <div className="relative h-64 md:h-auto md:min-h-[560px]">
              <Image src={dest.image} alt={dest.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-5 left-5 text-[#f4f1ea]">
                <div className="uppercase text-[9px] tracking-[0.3em] font-bold text-emerald-300 mb-2">{dest.category} · {dest.region}</div>
                <div className="font-serif text-4xl md:text-5xl leading-none">{dest.name}</div>
                <div className="mt-1 font-mono text-[11px] tracking-[0.3em]">{dest.marathi}</div>
              </div>
            </div>

            {/* details side */}
            <div className="p-6 md:p-10">
              <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/5 hover:bg-black/10 transition-colors text-lg">✕</button>

              <p className="font-mono text-[13px] leading-relaxed opacity-70 mb-8 mt-2">{dest.about}</p>

              {/* facts */}
              <div className="grid grid-cols-3 gap-4 mb-8 border-y border-black/10 py-5">
                <Fact label="Best time" value={dest.bestTime} />
                <Fact label="Duration" value={dest.duration} />
                <Fact label="Reach" value={dest.distance.replace(" from Mumbai", "")} />
              </div>

              {/* highlights */}
              <p className="uppercase text-[10px] tracking-[0.25em] font-bold opacity-50 mb-3">Highlights</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {dest.highlights.map((h) => (
                  <span key={h} className="rounded-full border border-black/15 px-3.5 py-1.5 font-mono text-[11px]">{h}</span>
                ))}
              </div>

              {/* itinerary */}
              <p className="uppercase text-[10px] tracking-[0.25em] font-bold opacity-50 mb-4">Suggested plan</p>
              <ol className="space-y-4 mb-8">
                {dest.itinerary.map((it) => (
                  <li key={it.day} className="flex gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] opacity-40 w-12 shrink-0 pt-1">{it.day}</span>
                    <div>
                      <div className="font-serif text-lg leading-tight">{it.title}</div>
                      <div className="font-mono text-[12px] opacity-60">{it.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>

              <Link href="/contact" className="group inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] text-[#f0ede4] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors">
                Plan this trip <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="uppercase text-[9px] tracking-[0.2em] font-bold opacity-40 mb-1">{label}</div>
      <div className="font-serif text-sm md:text-base leading-tight">{value}</div>
    </div>
  );
}
