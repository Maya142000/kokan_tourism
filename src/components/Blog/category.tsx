"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";

const categories = ["Beach", "Temple", "Food", "Hills"];

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `hover:opacity-50 transition ${
      pathname === path ? "border-b border-current pb-1" : ""
    }`;

  // detect if we're on any blog page
  const isBlogPage = pathname === "/blog" || pathname.startsWith("/blog/");

  // detect active category
  const activeSlug = pathname.startsWith("/blog/") ? pathname.split("/")[2] : null;
  const activeCategory = categories.find((c) => c.toLowerCase() === activeSlug) ?? null;

  return (
    <nav
      ref={navRef}
      className="navbar absolute top-0 w-full px-8 py-8 z-50 flex justify-between items-center mix-blend-difference text-white"
    >
      {/* LOGO */}
      <button
        onClick={() => router.push("/")}
        className="font-bold tracking-tighter text-3xl uppercase cursor-pointer"
      >
        ꀘꄲꀘꋬꋊ
      </button>

      {/* CENTER: category tabs — only on blog pages */}
      {isBlogPage ? (
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => router.push(`/blog/${cat.toLowerCase()}`)}
              style={{
                padding: "4px 16px",
                fontSize: "0.62rem",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                borderRadius: "100px",
                border: "1px solid currentColor",
                cursor: "pointer",
                background: activeCategory === cat ? "white" : "transparent",
                color: activeCategory === cat ? "#000" : "inherit",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : (
        /* NORMAL NAV LINKS — all other pages */
        <div className="hidden md:flex gap-8 uppercase text-[10px] tracking-[0.3em] font-bold">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/about" className={linkClass("/about")}>About</Link>
          <Link href="/kokandiaries" className={linkClass("/kokandiaries")}>Kokan Diaries</Link>
          <Link href="/heaven" className={linkClass("/heaven")}>Heaven</Link>
          <Link href="/blog" className={linkClass("/blog")}>Blog</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>
      )}

      {/* RIGHT: always show these links */}
      <div className="hidden md:flex gap-8 uppercase text-[10px] tracking-[0.3em] font-bold">
        {isBlogPage ? (
          <>
            <Link href="/blog" className="hover:opacity-50 transition">All</Link>
            <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}