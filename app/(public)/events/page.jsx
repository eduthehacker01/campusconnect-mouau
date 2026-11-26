import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { EventCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getEvents } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Events",
  description:
    "Discover upcoming campus events, tech conferences, social nights, fellowships, and departmental programmes around MOUAU and ABSU.",
};

const EVENT_CATEGORIES = [
  "All",
  "Social & Awards",
  "Tech Conference",
  "Departmental Event",
  "Fellowship & Faith",
];

export default async function EventsPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";

  const events = await getEvents({ q, category, location });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Campus & Community Calendar"
        title="Upcoming Events"
        description="Explore upcoming conferences, social nights, fellowships, workshops, and departmental programmes around MOUAU, ABSU, and Umuahia."
        action={
          <ProtectedActionButton
            promptTitle="Create an Event"
            promptMessage="Join MOUAU Connect to publish campus events, upload flyers, and track RSVPs."
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
          >
            + Create Event
          </ProtectedActionButton>
        }
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={category}
        categories={EVENT_CATEGORIES}
        searchPlaceholder="Search events, venues, organisers…"
      />

      {events.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="No upcoming events match your filters"
          description="Try clearing your category or location filter to browse all campus events."
          resetHref="/events"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
