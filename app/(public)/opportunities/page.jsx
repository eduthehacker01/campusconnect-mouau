import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { OpportunityCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOpportunities } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Opportunities",
  description:
    "Discover verified scholarships, internships, SIWES placements, grants, fellowships, competitions, and tech bootcamps.",
};

const OPPORTUNITY_TYPES = [
  "All",
  "Scholarship",
  "Internship",
  "SIWES",
  "Grant",
  "Fellowship",
  "Competition",
  "Tech Bootcamp",
];

export default async function OpportunitiesPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const type = typeof sp.type === "string" ? sp.type : "All";

  const opportunities = await getOpportunities({ q, type });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic & Career Growth"
        title="Opportunities"
        description="Browse scholarships, internships, SIWES placements, grants, fellowships, competitions, and tech bootcamps with clear eligibility and official sources."
      />

      <UrlFilterBar
        initialQ={q}
        initialCategory={type}
        categoryParamName="type"
        categories={OPPORTUNITY_TYPES}
        showLocation={false}
        searchPlaceholder="Search scholarships, SIWES, grants, bootcamps…"
      />

      {opportunities.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="No opportunities match your filters"
          description="Try selecting a different opportunity type or clearing your search query."
          resetHref="/opportunities"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {opportunities.map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
