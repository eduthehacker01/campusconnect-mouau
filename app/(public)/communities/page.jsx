import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { CommunityCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getCommunities } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Communities",
  description:
    "Discover student and local communities across technology, entrepreneurship, sports, and careers around MOUAU and ABSU.",
};

const COMMUNITY_CATEGORIES = ["All", "Technology", "Business", "Sports", "Career"];

export default async function CommunitiesPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "All";

  const communities = await getCommunities({ q, category });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interest-Based Hubs"
        title="Campus & Local Communities"
        description="Explore public community groups, see what members are discussing, and join when you create your free account."
        action={
          <ProtectedActionButton
            promptTitle="Publish a Community Post"
            promptMessage="Join MOUAU Connect to join communities, publish posts, and participate in discussions."
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
          >
            + Start a Discussion
          </ProtectedActionButton>
        }
      />

      <UrlFilterBar
        initialQ={q}
        initialCategory={category}
        categories={COMMUNITY_CATEGORIES}
        showLocation={false}
        searchPlaceholder="Search communities by topic, name, or admin…"
      />

      {communities.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No communities match your filters"
          description="Try clearing your category or search query to view all public communities."
          resetHref="/communities"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
    </div>
  );
}
