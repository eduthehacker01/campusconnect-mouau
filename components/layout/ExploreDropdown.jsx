"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXPLORE_NAV_LINKS } from "@/lib/constants/navigation";

export function ExploreDropdown() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef(null);

  const isExploreActive = EXPLORE_NAV_LINKS.some((item) =>
    pathname?.startsWith(item.href)
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
          isExploreActive || open
            ? "bg-brand-600/25 text-white ring-1 ring-brand-500/50"
            : "text-brand-100/90 hover:bg-brand-900/60 hover:text-white"
        }`}
      >
        <span>Explore</span>
        <span
          aria-hidden="true"
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Explore MOUAU Connect"
          className="pop-in absolute left-0 top-12 z-50 w-[440px] rounded-2xl border border-brand-700/70 bg-forest-900/95 p-3 shadow-2xl backdrop-blur-md"
        >
          <div className="grid grid-cols-2 gap-1.5">
            {EXPLORE_NAV_LINKS.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-2.5 rounded-xl p-2.5 transition ${
                    active
                      ? "bg-brand-600/25 ring-1 ring-brand-500/50"
                      : "hover:bg-brand-950/90"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-950 text-base"
                  >
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-white">
                      {item.label}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-brand-200/75">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
