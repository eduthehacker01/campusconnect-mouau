import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { EventCard } from "@/components/cards/PublicCards";
import { getEventBySlug } from "@/lib/data/publicQueries";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { event } = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const { event, upcoming } = await getEventBySlug(slug);

  if (!event) notFound();

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <article className="overflow-hidden rounded-3xl border border-brand-800/60 bg-forest-900/90 shadow-xl lg:col-span-8">
          {event.flyer_url && (
            <img
              src={event.flyer_url}
              alt={`${event.title} flyer`}
              className="h-56 w-full object-cover sm:h-72"
            />
          )}

          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">{event.category}</Badge>
              <Badge variant="verified">Entry: {event.entry_fee}</Badge>
            </div>

            <h1 className="text-2xl font-black text-white sm:text-3xl">
              {event.title}
            </h1>

            <div className="grid gap-3 rounded-2xl border border-brand-800/60 bg-forest-950/75 p-4 sm:grid-cols-2 text-xs">
              <div>
                <p className="text-brand-300/70">Date & Time</p>
                <p className="mt-1 font-bold text-white">🗓 {event.date_label}</p>
              </div>
              <div>
                <p className="text-brand-300/70">Venue</p>
                <p className="mt-1 font-bold text-white">
                  📍 {event.venue} ({event.campus_location})
                </p>
              </div>
              <div>
                <p className="text-brand-300/70">Entry Fee</p>
                <p className="mt-1 font-extrabold text-gold-400">
                  {event.entry_fee}
                </p>
              </div>
              <div>
                <p className="text-brand-300/70">Organiser</p>
                <p className="mt-1 font-bold text-white">{event.organiser_name}</p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
                About This Event
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/90">
                {event.description}
              </p>
            </div>
          </div>
        </article>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl border border-brand-800/60 bg-forest-900/95 p-6 shadow-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Attendance & Organiser
            </h2>
            <p className="mt-3 text-sm font-extrabold text-white">
              {event.organiser_name}
            </p>
            <p className="mt-2 text-xs font-bold text-emerald-400">
              ⭐ {event.interested_count} Interested • 🔔 {event.going_count} Going
            </p>

            <div className="mt-5 space-y-2.5">
              <ProtectedActionButton
                promptTitle="Indicate Attendance"
                promptMessage="Join MOUAU Connect to mark yourself as Going and receive automatic event reminders."
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
              >
                🔔 I&apos;m Going ({event.going_count})
              </ProtectedActionButton>

              <ProtectedActionButton
                promptTitle="Mark as Interested"
                promptMessage="Create a free MOUAU Connect account to save events and get updates from organisers."
                className="w-full rounded-xl border border-brand-700/80 bg-forest-950/80 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
              >
                ⭐ I&apos;m Interested ({event.interested_count})
              </ProtectedActionButton>
            </div>
          </div>
        </aside>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-white">
            More Upcoming Events
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
