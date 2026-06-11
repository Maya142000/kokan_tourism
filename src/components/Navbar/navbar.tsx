"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/kokandiaries", label: "Kokan Diaries" },
  { href: "/heaven", label: "Heaven" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = (path: string) =>
    `hover:opacity-50 transition ${pathname === path ? "border-b border-current pb-1" : ""}`;

  return (
    <>
      <nav className="navbar absolute top-0 w-full px-6 md:px-8 py-6 md:py-8 z-50 flex justify-between items-center mix-blend-difference text-white">
        {/* LOGO */}
        <button
          onClick={() => router.push("/")}
          className="font-bold tracking-tighter text-2xl md:text-3xl uppercase cursor-pointer"
        >
          कोकण
        </button>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 uppercase text-[10px] tracking-[0.3em] font-bold">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden flex flex-col gap-[5px] w-7 h-7 items-center justify-center cursor-pointer"
        >
          <span className={`block h-[2px] w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-[2px] w-6 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div
        style={{ mixBlendMode: "normal" }}
        className={`md:hidden fixed inset-0 z-40 bg-[#111] text-[#f0ede4] flex flex-col justify-center px-8 transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-6">
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`font-serif text-4xl transition-all duration-500 ${
                  pathname === l.href ? "opacity-100" : "opacity-70"
                } ${open ? "translate-y-0 opacity-100" : "translate-y-4"}`}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-10 left-8 uppercase text-[10px] tracking-[0.3em] font-bold opacity-50">
          निसर्गरम्य कोकण
        </div>
      </div>
    </>
  );
}
