"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ExploreDropdown } from "@/components/layout/ExploreDropdown";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { PRIMARY_NAV_LINKS } from "@/lib/constants/navigation";
import { useAuthGate } from "@/components/auth/AuthGateProvider";

export function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuthGate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-brand-800/60 bg-forest-950/95 backdrop-blur-md shadow-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          {/* Brand */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation: Home, Marketplace, Jobs, Events, Explore (dropdown) */}
          <nav
            aria-label="Main Public Navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {PRIMARY_NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-brand-100/90 hover:bg-brand-900/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <ExploreDropdown />
          </nav>

          {/* Desktop Search + Auth Entry Points */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                aria-label="Search MOUAU Connect"
                className="w-44 xl:w-56 rounded-full border border-brand-800/70 bg-forest-900/90 py-1.5 pl-3.5 pr-9 text-xs text-white placeholder-brand-200/60 transition focus:w-64 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-300 hover:text-white"
              >
                🔍
              </button>
            </form>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="max-w-[140px] truncate rounded-full border border-brand-700/70 bg-forest-900 px-3 py-1.5 text-xs font-bold text-brand-100">
                  {user?.user_metadata?.full_name || user?.email || "Member"}
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-xl border border-brand-700/80 px-3 py-2 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl border border-brand-700/80 bg-forest-900/80 px-3.5 py-2 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-800/70 bg-forest-900 text-sm text-brand-100 hover:border-brand-500"
            >
              🔍
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-800/70 bg-forest-900 text-lg font-bold text-white hover:border-brand-500"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={closeMobile}
        isAuthenticated={isAuthenticated}
        user={user}
        onSignOut={signOut}
      />
    </>
  );
}
