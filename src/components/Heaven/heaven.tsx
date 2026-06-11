"use client";

import { useEffect, useRef } from "react";

const IMAGES: string[] = [
  "/assets/cocunut_palm_trees.avif",
  "/assets/ganpati_festivals_1.avif",
  "/assets/Ganpati_festivals.avif",
  "/assets/ghavne.avif",
  "/assets/Shirvale.avif",
  "/assets/Alphanso_mango.avif",
  "/assets/Road.avif",
  "/assets/beach_of_kokan.avif",
  "/assets/fishThali.avif",
  "/assets/kombdivade.avif",
//   "/assets/cocunut_trees.avif",
//   "/assets/roads_mountains.avif",
//   "/assets/monsoon_muntains.avif",
//   "/assets/goan_devi.avif",
//   "/assets/Sankasur.avif",
//   "/assets/Shimga_home.avif",
//   "/assets/dashavatar.avif",
//   "/assets/river_with_tress.avif",
];


const POOL_SIZE = 14;
const SPAWN_DIST = 70;     // px the cursor must travel before a new image spawns
const REVEAL_DURATION = 600; // clip-path wipe-in
const COLLAPSE_DURATION = 450; // clip-path wipe-out
const HOLD_DURATION = 500;  // visible time before collapsing

export default function MersiHero() {
  const imgIndexRef = useRef(0);
  const lastPosRef = useRef({ x: -999, y: -999 });
  const zRef = useRef(10);
  const poolRef = useRef<Array<{
    el: HTMLDivElement;
    img: HTMLImageElement;
    busy: boolean;
    timeout: ReturnType<typeof setTimeout> | null;
  }>>([]);

  useEffect(() => {
    const pool = poolRef.current;
    for (let i = 0; i < POOL_SIZE; i++) {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 50;
        opacity: 0;
        will-change: transform, opacity;
        border-radius: 1px;
        overflow: hidden;
      `;
      const img = document.createElement("img");
      img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
      img.draggable = false;
      el.appendChild(img);
      document.body.appendChild(el);
      pool.push({ el, img, busy: false, timeout: null });
    }

    function getFree() {
      return pool.find((p) => !p.busy) ?? pool[Math.floor(Math.random() * pool.length)];
    }

    function spawnAt(x: number, y: number, dirX: number, dirY: number) {
      const item = getFree();
      if (item.timeout) clearTimeout(item.timeout);

      // Portrait ratio: narrow width, tall height
      const w = 200 + Math.random() * 40;  // 200–240px wide
      const h = w * 1.4;                    // ~1.4x taller than wide

      const rot = (Math.random() - 0.5) * 18;
      // Trail slightly in the direction of travel so images string behind the cursor
      const offX = dirX * 18 + (Math.random() - 0.5) * 24;
      const offY = dirY * 18 + (Math.random() - 0.5) * 24;

      item.busy = true;
      item.img.src = IMAGES[imgIndexRef.current % IMAGES.length];
      imgIndexRef.current++;

      const el = item.el;
      // Reset to a thin slit clipped from top & bottom, then wipe open
      el.style.transition = "none";
      el.style.opacity = "1";
      el.style.clipPath = "inset(50% 0% 50% 0% round 14px)";
      el.style.width = w + "px";
      el.style.height = h + "px";
      el.style.left = x - w / 2 + offX + "px";
      el.style.top = y - h / 2 + offY + "px";
      el.style.zIndex = String(zRef.current++);
      el.style.transform = `rotate(${rot}deg)`;

      // Force a reflow so the "none" transition + initial clip are applied
      // before we animate to the open state.
      void el.offsetWidth;

      el.style.transition = `clip-path ${REVEAL_DURATION}ms cubic-bezier(0.16,1,0.3,1)`;
      requestAnimationFrame(() => {
        el.style.clipPath = "inset(0% 0% 0% 0% round 14px)";
      });

      item.timeout = setTimeout(() => {
        // Collapse back to a slit and fade away
        el.style.transition =
          `clip-path ${COLLAPSE_DURATION}ms cubic-bezier(0.7,0,0.84,0), ` +
          `opacity ${COLLAPSE_DURATION}ms ease`;
        el.style.clipPath = "inset(50% 0% 50% 0% round 14px)";
        el.style.opacity = "0";
        item.timeout = setTimeout(() => {
          item.busy = false;
        }, COLLAPSE_DURATION);
      }, HOLD_DURATION);
    }

    function onMouseMove(e: MouseEvent) {
      // Don't spawn images while hovering interactive UI (navbar)
      if ((e.target as HTMLElement).closest(".navbar")) return;

      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > SPAWN_DIST) {
        // Normalized travel direction → images trail behind the cursor
        spawnAt(e.clientX, e.clientY, dx / dist, dy / dist);
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      if ((e.target as HTMLElement).closest(".navbar")) return;
      const dx = t.clientX - lastPosRef.current.x;
      const dy = t.clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > SPAWN_DIST) {
        spawnAt(t.clientX, t.clientY, dx / dist, dy / dist);
        lastPosRef.current = { x: t.clientX, y: t.clientY };
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      pool.forEach((p) => { p.el.remove(); if (p.timeout) clearTimeout(p.timeout); });
      poolRef.current = [];
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f0ede4] flex flex-col justify-between p-6 md:p-10 font-mono uppercase text-[11px] tracking-[0.25em] text-black overflow-hidden ">
      <div/>
      {/* Hero */}
      <main className="flex-grow flex items-center justify-center gap-4 sm:gap-8 md:gap-16 relative z-[1]">
        <div className="text-[10px] sm:text-[13px] font-bold whitespace-nowrap">Coming</div>
        <div className="text-[44px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-black tracking-tighter leading-none whitespace-nowrap">
          K🥥KAN🌴
        </div>
        <div className="text-[10px] sm:text-[13px] font-bold whitespace-nowrap">soon</div>
      </main>

      {/* Footer */}
      <footer className="flex flex-wrap gap-y-3 justify-between items-end w-full font-semibold opacity-50 relative z-10">
        <div className="flex gap-5 sm:gap-10">
          <span>News</span>
          <span>निसर्गरम्य ठिकाण</span>
        </div>
        <div>Website by Mahesh Mohite</div>
      </footer>
    </div>
  );
}