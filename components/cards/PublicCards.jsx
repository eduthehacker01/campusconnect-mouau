import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { formatNaira, initials } from "@/lib/utils/format";

export function ProductCard({ item }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="gold">{item.category}</Badge>
          <Badge variant="subtle">{item.condition}</Badge>
        </div>

        <Link href={`/marketplace/${item.slug}`} className="group block mt-3">
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {item.title}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-brand-100/80">
          {item.description}
        </p>

        <p className="mt-3 text-xl font-black text-gold-400">
          {formatNaira(item.price_ngn)}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-200/80">
          <span>
            👤 {item.seller_name}{" "}
            {item.seller_verified && (
              <span className="text-emerald-400" title="Verified Seller">
                ✔
              </span>
            )}
          </span>
          <span>📍 {item.campus_location}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/marketplace/${item.slug}`}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          View Product
        </Link>
        <ProtectedActionButton
          promptTitle="Save this product"
          promptMessage="Join MOUAU Connect to save products to your wishlist and get notified of price drops."
          className="rounded-xl border border-brand-700/80 bg-forest-950/70 px-3 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
          title="Save product"
        >
          🔖
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function JobCard({ job }) {
  return (
    <article
      className={`flex flex-col justify-between rounded-2xl border p-5 shadow-lg transition hover:border-brand-500/80 ${
        job.is_featured
          ? "border-gold-400/50 bg-gradient-to-b from-forest-900 to-brand-950/90"
          : "border-brand-800/60 bg-forest-900/90"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand">{job.job_type}</Badge>
          <span className="text-xs font-semibold text-gold-400">
            Deadline: {job.deadline}
          </span>
        </div>

        <Link href={`/jobs/${job.slug}`} className="group block mt-3">
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {job.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs font-semibold text-brand-200">
          🏢 {job.employer_name}{" "}
          {job.employer_verified && (
            <span className="text-emerald-400">✔ Verified</span>
          )}
        </p>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-100/80">
          {job.description}
        </p>

        <div className="mt-3 space-y-1 text-xs text-brand-200/90">
          <p>📍 {job.campus_location} • ⏰ {job.work_hours}</p>
          <p className="font-extrabold text-gold-400">💰 {job.salary_text}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/jobs/${job.slug}`}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          View Job Details
        </Link>
        <ProtectedActionButton
          promptTitle="Apply for this job"
          promptMessage="Create a free MOUAU Connect account to apply for jobs directly through the platform."
          className="rounded-xl border border-brand-700/80 bg-forest-950/70 px-3.5 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
        >
          Apply
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function EventCard({ event }) {
  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-800/60 bg-forest-900/90 shadow-lg transition hover:border-brand-500/80">
      <div>
        {event.flyer_url && (
          <Link href={`/events/${event.slug}`} className="block overflow-hidden">
            <img
              src={event.flyer_url}
              alt={`${event.title} flyer`}
              className="h-36 w-full object-cover transition duration-300 hover:scale-105"
            />
          </Link>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="gold">{event.category}</Badge>
            <span className="text-xs font-extrabold text-emerald-400">
              {event.entry_fee}
            </span>
          </div>

          <Link href={`/events/${event.slug}`} className="group block mt-2.5">
            <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
              {event.title}
            </h3>
          </Link>

          <p className="mt-1 text-xs font-semibold text-brand-200">
            🗓 {event.date_label}
          </p>
          <p className="mt-0.5 text-xs text-brand-300/85">
            📍 {event.venue} • {event.campus_location}
          </p>
          <p className="mt-2 line-clamp-2 text-xs text-brand-100/80">
            {event.description}
          </p>
        </div>
      </div>

      <div className="flex gap-2 px-5 pb-5">
        <Link
          href={`/events/${event.slug}`}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          Event Details
        </Link>
        <ProtectedActionButton
          promptTitle="RSVP to this event"
          promptMessage="Join MOUAU Connect to mark yourself as Interested or Going and receive event reminders."
          className="rounded-xl border border-brand-700/80 bg-forest-950/70 px-3.5 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
        >
          🔔 RSVP ({event.going_count})
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function ServiceCard({ service }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand">{service.category}</Badge>
          <span className="text-xs font-bold text-gold-400">
            {service.rating_avg} ★ ({service.review_count})
          </span>
        </div>

        <Link href={`/services/${service.slug}`} className="group block mt-3">
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {service.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-brand-200">
          Provider: {service.provider_name}{" "}
          {service.provider_verified && <span className="text-emerald-400">✔</span>}
        </p>
        <p className="mt-2 line-clamp-2 text-xs text-brand-100/80">
          {service.description}
        </p>
        <p className="mt-3 text-sm font-black text-emerald-400">
          {service.price_text}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/services/${service.slug}`}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          View Service
        </Link>
        <ProtectedActionButton
          promptTitle="Contact Service Provider"
          promptMessage="Join MOUAU Connect to message service providers, request quotes, and book appointments."
          className="rounded-xl border border-brand-700/80 bg-forest-950/70 px-3.5 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
        >
          Contact
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function ArticleCard({ article }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="verified">✔ {article.author_badge}</Badge>
          {article.is_popular && <Badge variant="goldSubtle">🔥 Popular</Badge>}
        </div>

        <Link
          href={`/bloggers/articles/${article.slug}`}
          className="group block mt-3"
        >
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {article.title}
          </h3>
        </Link>

        <p className="mt-1.5 text-xs text-brand-200/85">
          By{" "}
          <Link
            href={`/bloggers/${article.author_username}`}
            className="font-bold text-gold-300 hover:underline"
          >
            {article.author_name}
          </Link>{" "}
          • {article.read_time_mins} min read •{" "}
          {Number(article.read_count).toLocaleString()} reads
        </p>

        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-brand-100/80">
          {article.excerpt}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/bloggers/articles/${article.slug}`}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          Read Article
        </Link>
        <ProtectedActionButton
          promptTitle={`Follow ${article.author_name}`}
          promptMessage="Join MOUAU Connect to follow campus bloggers and get notified when they publish new articles."
          className="rounded-xl border border-brand-700/80 bg-forest-950/70 px-3 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
        >
          + Follow
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function BusinessCard({ business }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="goldSubtle">{business.business_type}</Badge>
          <span className="text-xs font-bold text-gold-400">
            {business.rating_avg} ★
          </span>
        </div>

        <Link
          href={`/food-and-businesses/${business.slug}`}
          className="group block mt-3"
        >
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {business.name}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-brand-200">
          📍 {business.address} • {business.campus_location}
        </p>
        <p className="mt-1 text-xs text-emerald-400">
          🕒 {business.opening_hours}
        </p>
        <p className="mt-2 line-clamp-2 text-xs text-brand-100/85">
          <strong>Highlights:</strong> {business.specialty}
        </p>
        <p className="mt-2 text-sm font-black text-gold-400">
          {business.price_range}
        </p>
      </div>

      <Link
        href={`/food-and-businesses/${business.slug}`}
        className="mt-4 block w-full rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
      >
        View Profile & Menu
      </Link>
    </article>
  );
}

export function CommunityCard({ community }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="subtle">{community.category}</Badge>
          <span className="text-xs font-bold text-gold-400">
            👥 {Number(community.member_count).toLocaleString()} Members
          </span>
        </div>

        <Link
          href={`/communities/${community.slug}`}
          className="group block mt-3"
        >
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {community.name}
          </h3>
        </Link>

        <p className="mt-0.5 text-xs text-brand-200">
          Admin: {community.admin_name} • {community.campus_location}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-brand-100/80">
          {community.description}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/communities/${community.slug}`}
          className="flex-1 rounded-xl border border-brand-700/80 bg-forest-950/70 py-2.5 text-center text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
        >
          Explore Community
        </Link>
        <ProtectedActionButton
          promptTitle={`Join ${community.name}`}
          promptMessage="Create a free MOUAU Connect account to join communities, publish posts, and reply to discussions."
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          + Join
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function PersonCard({ person }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 font-black text-white">
            {initials(person.full_name)}
          </div>
          <div className="min-w-0">
            <Link
              href={`/people/${person.username}`}
              className="group flex items-center gap-1.5"
            >
              <h3 className="truncate font-extrabold text-white transition group-hover:text-gold-300">
                {person.full_name}
              </h3>
              {person.is_verified && (
                <span className="text-xs text-emerald-400" title="Verified Member">
                  ✔
                </span>
              )}
            </Link>
            <p className="truncate text-xs text-brand-200/85">
              {person.department} {person.level ? `• ${person.level}` : ""}
            </p>
            <p className="text-[11px] font-semibold text-gold-400">
              📍 {person.campus_location}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-brand-100/85">
          {person.bio}
        </p>

        {Array.isArray(person.interests) && person.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {person.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-800/70 bg-forest-950/80 px-2.5 py-0.5 text-[11px] text-brand-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/people/${person.username}`}
          className="flex-1 rounded-xl border border-brand-700/80 bg-forest-950/70 py-2 text-center text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
        >
          View Profile
        </Link>
        <ProtectedActionButton
          promptTitle={`Connect with ${person.full_name}`}
          promptMessage="Join MOUAU Connect to follow people, send direct messages, and build your campus network."
          className="flex-1 rounded-xl bg-brand-600 py-2 text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          + Follow
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function AccommodationCard({ item }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={
              item.listing_type.includes("Roommate") ? "gold" : "brand"
            }
          >
            {item.listing_type}
          </Badge>
          <span className="text-xs text-brand-200">📍 {item.area}</span>
        </div>

        <Link
          href={`/accommodation/${item.slug}`}
          className="group block mt-3"
        >
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {item.title}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-xs text-brand-100/80">
          {item.description}
        </p>

        <p className="mt-3 text-lg font-black text-gold-400">
          {formatNaira(item.price_ngn)}{" "}
          <span className="text-xs font-semibold text-brand-200">
            / {item.price_period}
          </span>
        </p>
        <p className="mt-1 text-xs text-brand-300/80">
          {item.campus_location}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/accommodation/${item.slug}`}
          className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
        >
          View Details
        </Link>
        <ProtectedActionButton
          promptTitle="Contact Lister"
          promptMessage="Join MOUAU Connect to contact caretakers or potential roommates safely."
          className="rounded-xl border border-brand-700/80 bg-forest-950/70 px-3.5 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
        >
          Contact
        </ProtectedActionButton>
      </div>
    </article>
  );
}

export function OpportunityCard({ item }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="verified">{item.opportunity_type}</Badge>
          <Badge variant="goldSubtle">⏳ {item.deadline}</Badge>
        </div>

        <Link
          href={`/opportunities/${item.slug}`}
          className="group block mt-3"
        >
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {item.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-brand-200">
          Source: {item.source_name}
        </p>
        <p className="mt-2 line-clamp-2 text-xs text-brand-100/85">
          <strong>Eligibility:</strong> {item.eligibility}
        </p>
        <p className="mt-2.5 text-sm font-black text-gold-400">
          {item.benefit_text}
        </p>
      </div>

      <Link
        href={`/opportunities/${item.slug}`}
        className="mt-4 block w-full rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
      >
        View Eligibility & Apply Info
      </Link>
    </article>
  );
}

export function LostFoundCard({ item }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-brand-800/60 bg-forest-900/90 p-5 shadow-lg transition hover:border-brand-500/80">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant={item.item_status === "LOST" ? "danger" : "brand"}>
            {item.item_status}
          </Badge>
          <span className="text-xs text-brand-200">{item.reported_label}</span>
        </div>

        <Link
          href={`/lost-and-found/${item.slug}`}
          className="group block mt-3"
        >
          <h3 className="text-base font-extrabold text-white transition group-hover:text-gold-300">
            {item.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs font-semibold text-gold-400">
          📍 {item.area_detail} ({item.campus_location})
        </p>
        <p className="mt-2 line-clamp-2 text-xs text-brand-100/80">
          {item.description}
        </p>
      </div>

      <Link
        href={`/lost-and-found/${item.slug}`}
        className="mt-4 block w-full rounded-xl bg-brand-600 py-2.5 text-center text-xs font-extrabold text-white transition hover:bg-brand-500"
      >
        View Item & Contact Instructions
      </Link>
    </article>
  );
}
