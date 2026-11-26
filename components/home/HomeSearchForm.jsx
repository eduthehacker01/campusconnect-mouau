"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HomeSearchForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
      <label htmlFor="home-search-input" className="sr-only">
        Search MOUAU Connect
      </label>
      <input
        id="home-search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search laptops, jobs, events, lodges, scholarships, food…"
        className="flex-1 rounded-xl border border-brand-700/80 bg-forest-950/90 px-4 py-3 text-sm text-white placeholder-brand-200/60 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
      />
      <button
        type="submit"
        className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
      >
        Search
      </button>
    </form>
  );
}
