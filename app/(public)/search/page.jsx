import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { runGlobalSearch } from "@/lib/data/globalSearch";
import {
  ProductCard,
  JobCard,
  EventCard,
  ServiceCard,
  ArticleCard,
  BusinessCard,
  CommunityCard,
  PersonCard,
  AccommodationCard,
  OpportunityCard,
  LostFoundCard,
} from "@/components/cards/PublicCards";

export const metadata = {
  title: "Search",
  description:
    "Search across marketplace products, jobs, events, people, communities, services, accommodation, opportunities, articles, lost & found, and local businesses.",
};

const CATEGORY_TABS = [
  { key: "all", label: "All Results" },
  { key: "marketplace", label: "Marketplace" },
  { key: "jobs", label: "Jobs" },
  { key: "events", label: "Events" },
  { key: "services", label: "Services" },
  { key: "accommodation", label: "Accommodation" },
  { key: "opportunities", label: "Opportunities" },
  { key: "articles", label: "Articles" },
  { key: "businesses", label: "Food & Businesses" },
  { key: "people", label: "People" },
  { key: "communities", label: "Communities" },
  { key: "lost-and-found", label: "Lost & Found" },
];

export default async function GlobalSearchPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";
  const category = typeof sp.category === "string" ? sp.category : "all";

  const { groups, filteredGroups, totalCount } = await runGlobalSearch({
    q,
    location,
    category,
  });

  const nonEmptyGroups = filteredGroups.filter((g) => g.items.length > 0);

  const buildTabHref = (catKey) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location && location !== "All Locations") params.set("location", location);
    if (catKey !== "all") params.set("category", catKey);
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Global Search"
        title={q ? `Search Results for “${q}”` : "Search MOUAU Connect"}
        description={`Showing ${totalCount} public ${
          totalCount === 1 ? "result" : "results"
        } across Marketplace, Jobs, Events, Explore directories, and Bloggers.`}
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={category}
        categoryParamName="category"
        searchPlaceholder="Search across products, jobs, events, people, services, articles…"
      />

      {/* Category tabs with counts */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? totalCount
              : groups.find((g) => g.key === tab.key)?.items.length || 0;
          const active = category === tab.key;
          return (
            <Link
              key={tab.key}
              href={buildTabHref(tab.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                active
                  ? "bg-brand-600 text-white"
                  : "border border-brand-800/70 bg-forest-900 text-brand-100 hover:border-brand-500"
              }`}
            >
              {tab.label} ({count})
            </Link>
          );
        })}
      </div>

      {nonEmptyGroups.length === 0 ? (
        <EmptyState
          title="No matching public content found"
          description={
            q
              ? `We couldn't find anything matching "${q}". Try a broader keyword or clear your location/category filters.`
              : "No results match the selected filters."
          }
          resetHref="/search"
          resetLabel="Reset Search"
        />
      ) : (
        <div className="space-y-10">
          {nonEmptyGroups.map((group) => (
            <section key={group.key}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white">
                  {group.label}{" "}
                  <span className="text-xs font-semibold text-gold-400">
                    ({group.items.length})
                  </span>
                </h2>
                <Link
                  href={group.href}
                  className="text-xs font-bold text-gold-300 hover:text-white"
                >
                  Open {group.label} →
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.slice(0, 6).map((item) => {
                  switch (group.key) {
                    case "marketplace":
                      return <ProductCard key={item.id} item={item} />;
                    case "jobs":
                      return <JobCard key={item.id} job={item} />;
                    case "events":
                      return <EventCard key={item.id} event={item} />;
                    case "services":
                      return <ServiceCard key={item.id} service={item} />;
                    case "accommodation":
                      return <AccommodationCard key={item.id} item={item} />;
                    case "opportunities":
                      return <OpportunityCard key={item.id} item={item} />;
                    case "articles":
                      return <ArticleCard key={item.id} article={item} />;
                    case "businesses":
                      return <BusinessCard key={item.id} business={item} />;
                    case "people":
                      return <PersonCard key={item.id} person={item} />;
                    case "communities":
                      return <CommunityCard key={item.id} community={item} />;
                    case "lost-and-found":
                      return <LostFoundCard key={item.id} item={item} />;
                    default:
                      return null;
                  }
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
