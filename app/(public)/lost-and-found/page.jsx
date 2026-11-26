import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { LostFoundCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getLostFoundItems } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Lost & Found",
  description:
    "Browse reported lost and found student ID cards, wallets, gadgets, and keys around MOUAU, ABSU, and Umudike.",
};

const LOST_FOUND_FILTERS = ["All", "LOST", "FOUND"];

export default async function LostAndFoundPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const status = typeof sp.status === "string" ? sp.status : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";

  const items = await getLostFoundItems({ q, status, location });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community Help Board"
        title="Lost & Found"
        description="Search reported lost or found items around campus and surrounding areas, and view public contact instructions."
        action={
          <ProtectedActionButton
            promptTitle="Report a Lost or Found Item"
            promptMessage="Join MOUAU Connect to post a lost or found item alert for the campus community."
            className="rounded-xl bg-gold-500 px-4 py-2.5 text-xs font-extrabold text-forest-950 shadow-md transition hover:bg-gold-400"
          >
            + Report Lost / Found
          </ProtectedActionButton>
        }
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={status}
        categoryParamName="status"
        categories={LOST_FOUND_FILTERS}
        searchPlaceholder="Search ID cards, wallets, earbuds, keys, locations…"
      />

      {items.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No lost or found items match your filters"
          description="Try clearing your status or location filter to view all reported items."
          resetHref="/lost-and-found"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <LostFoundCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
