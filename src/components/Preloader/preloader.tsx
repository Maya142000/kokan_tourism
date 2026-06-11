"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DURATION = 5000; // 5 seconds

// Persists across client-side navigation; resets on a full page reload (a real visit).
let hasPlayed = false;

export default function Preloader() {
  const [progress, setProgress] = useState(hasPlayed ? 100 : 0);
  const [done, setDone] = useState(hasPlayed);

  useEffect(() => {
    if (hasPlayed) return;

    document.body.style.overflow = "hidden";
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / DURATION, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        hasPlayed = true;
        document.body.style.overflow = "";
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[999]">
          {/* two-panel split — top slides up, bottom slides down, on exit */}
          <div className="absolute inset-0 flex flex-col">
            <motion.div className="w-full flex-1 bg-[#0e0e0e]" exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: EASE }} />
            <motion.div className="w-full flex-1 bg-[#0e0e0e]" exit={{ y: "100%" }} transition={{ duration: 0.9, ease: EASE }} />
          </div>

          {/* content (fades out, then the shutters reveal the page) */}
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col justify-between px-6 md:px-10 py-10 text-[#f4f1ea]"
          >
            {/* top meta */}
            <div className="flex justify-between uppercase text-[10px] tracking-[0.3em] font-bold opacity-70">
              <span>Est. 2026</span>
            </div>

            {/* center brand */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="text-center"
            >
              <p className="uppercase text-[10px] tracking-[0.4em] font-bold opacity-60 mb-6">निसर्गरम्य कोकण</p>
              <h1 className="font-serif text-[clamp(3.5rem,14vw,10rem)] leading-none tracking-tight">
                कोकण<span className="text-emerald-400">.</span>
              </h1>
              <p className="mt-5 font-mono text-[12px] tracking-wide opacity-60">Where the Sahyadris meet the sea</p>
            </motion.div>

            {/* bottom progress */}
            <div>
              <div className="mb-3 flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                <span>Loading the coast…</span>
                <span className="tabular-nums">{String(progress).padStart(3, "0")}%</span>
              </div>
              <div className="h-px w-full bg-white/15">
                <div className="h-full bg-emerald-400" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
