"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LOCATIONS } from "@/lib/constants/locations";
import { INPUT_CLASS } from "@/lib/utils/format";

export function UrlFilterBar({
  initialQ = "",
  initialLocation = "All Locations",
  initialCategory = "All",
  initialMinPrice = "",
  initialMaxPrice = "",
  categoryParamName = "category",
  categories = [],
  showLocation = true,
  showPriceRange = false,
  searchPlaceholder = "Search listings…",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initialQ);
  const [location, setLocation] = useState(initialLocation);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  const pushParams = (overrides = {}) => {
    const params = new URLSearchParams();
    const nextQ = overrides.q !== undefined ? overrides.q : q;
    const nextLoc = overrides.location !== undefined ? overrides.location : location;
    const nextCat =
      overrides.category !== undefined ? overrides.category : initialCategory;
    const nextMin =
      overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
    const nextMax =
      overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;

    if (nextQ && nextQ.trim()) params.set("q", nextQ.trim());
    if (showLocation && nextLoc && nextLoc !== "All Locations") {
      params.set("location", nextLoc);
    }
    if (nextCat && nextCat !== "All") {
      params.set(categoryParamName, nextCat);
    }
    if (showPriceRange && nextMin !== "") params.set("minPrice", nextMin);
    if (showPriceRange && nextMax !== "") params.set("maxPrice", nextMax);

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    pushParams();
  };

  const hasActiveFilters =
    Boolean(initialQ) ||
    (showLocation && initialLocation !== "All Locations") ||
    initialCategory !== "All" ||
    Boolean(initialMinPrice) ||
    Boolean(initialMaxPrice);

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-brand-800/60 bg-forest-900/80 p-4 shadow-md"
      >
        <div className="grid gap-3 md:grid-cols-12">
          <div className={showLocation ? "md:col-span-5" : "md:col-span-9"}>
            <label htmlFor="filter-q" className="sr-only">
              Search
            </label>
            <input
              id="filter-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              className={INPUT_CLASS}
            />
          </div>

          {showLocation && (
            <div className="md:col-span-4">
              <label htmlFor="filter-location" className="sr-only">
                Filter by location
              </label>
              <select
                id="filter-location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  pushParams({ location: e.target.value });
                }}
                className={INPUT_CLASS}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 md:col-span-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-500"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setLocation("All Locations");
                  setMinPrice("");
                  setMaxPrice("");
                  router.push(pathname);
                }}
                className="rounded-xl border border-brand-700/80 bg-forest-950 px-3 py-2.5 text-xs font-bold text-brand-200 hover:border-gold-400 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {showPriceRange && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="filter-min-price"
                className="mb-1 block text-[11px] font-semibold text-brand-200/80"
              >
                Min Price (₦)
              </label>
              <input
                id="filter-min-price"
                type="number"
                min="0"
                step="500"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="e.g. 5000"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label
                htmlFor="filter-max-price"
                className="mb-1 block text-[11px] font-semibold text-brand-200/80"
              >
                Max Price (₦)
              </label>
              <input
                id="filter-max-price"
                type="number"
                min="0"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 250000"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        )}
      </form>

      {categories.length > 0 && (
        <div
          className="no-scrollbar flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Category filter"
        >
          {categories.map((cat) => {
            const active = initialCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => pushParams({ category: cat })}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "border border-brand-800/70 bg-forest-900 text-brand-100 hover:border-brand-500"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
