import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { PersonCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPeople } from "@/lib/data/publicQueries";

export const metadata = {
  title: "People",
  description:
    "Discover public profiles of students, creatives, founders, and community members around MOUAU, ABSU, and Umuahia.",
};

const INTEREST_FILTERS = [
  "All",
  "Programming",
  "Entrepreneurship",
  "Football",
  "UI/UX Design",
  "Photography",
  "Blogging",
  "Agribusiness",
];

export default async function PeoplePage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const interest = typeof sp.interest === "string" ? sp.interest : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";

  const people = await getPeople({ q, interest, location });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Social Discovery"
        title="People Around MOUAU, ABSU & Umuahia"
        description="Browse public profiles by campus, department, or shared interests. Create an account when you are ready to follow or send a message."
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={interest}
        categoryParamName="interest"
        categories={INTEREST_FILTERS}
        searchPlaceholder="Search people by name, department, college, or interest…"
      />

      {people.length === 0 ? (
        <EmptyState
          icon="🤝"
          title="No public profiles match your search"
          description="Try clearing your interest or location filter to browse all public profiles."
          resetHref="/people"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
