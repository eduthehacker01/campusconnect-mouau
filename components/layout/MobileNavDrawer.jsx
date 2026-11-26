"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PRIMARY_NAV_LINKS,
  EXPLORE_NAV_LINKS,
} from "@/lib/constants/navigation";

export function MobileNavDrawer({ open, onClose, isAuthenticated, user, onSignOut }) {
  const pathname = usePathname();
  const router = useRouter();
  const [exploreOpen, setExploreOpen] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!open) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    onClose();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <div
      className="fixed inset-0 z-[65] bg-forest-950/80 backdrop-blur-sm lg:hidden"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto border-r border-brand-800/70 bg-forest-900 p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-brand-800/60 pb-4">
          <span className="text-base font-extrabold text-white">
            Explore MOUAU Connect
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-brand-200 hover:bg-brand-950 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search MOUAU Connect…"
              aria-label="Search public content"
              className="w-full rounded-xl border border-brand-800/70 bg-forest-950 px-3 py-2 text-xs text-white placeholder-brand-200/60 focus:border-brand-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white"
            >
              Go
            </button>
          </div>
        </form>

        {/* Primary Links */}
        <nav aria-label="Mobile Primary Navigation" className="mt-4 space-y-1">
          {PRIMARY_NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`block rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-brand-600 text-white"
                    : "text-brand-100 hover:bg-brand-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Explore Accordion */}
        <div className="mt-4 border-t border-brand-800/60 pt-4">
          <button
            type="button"
            onClick={() => setExploreOpen((v) => !v)}
            aria-expanded={exploreOpen}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-gold-400"
          >
            <span>Explore</span>
            <span>{exploreOpen ? "▴" : "▾"}</span>
          </button>
          {exploreOpen && (
            <div className="mt-1 space-y-1">
              {EXPLORE_NAV_LINKS.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-brand-600/30 text-white"
                        : "text-brand-100/90 hover:bg-brand-950"
                    }`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Auth Links */}
        <div className="mt-auto border-t border-brand-800/60 pt-4">
          {isAuthenticated ? (
            <div className="space-y-2">
              <p className="truncate text-xs text-brand-200">
                Signed in as{" "}
                <strong className="text-white">{user?.email || "Member"}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full rounded-xl border border-brand-700 py-2.5 text-xs font-bold text-brand-100 hover:border-gold-400"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-xl border border-brand-700/80 bg-forest-950 py-2.5 text-center text-xs font-bold text-brand-100 hover:border-gold-400"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white hover:bg-brand-500"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
