import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getAccommodationBySlug } from "@/lib/data/publicQueries";
import { formatNaira } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getAccommodationBySlug(slug);
  if (!item) return { title: "Accommodation Not Found" };
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function AccommodationDetailPage({ params }) {
  const { slug } = await params;
  const item = await getAccommodationBySlug(slug);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Accommodation", href: "/accommodation" },
          { label: item.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <article className="space-y-6 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                item.listing_type.includes("Roommate") ? "gold" : "brand"
              }
            >
              {item.listing_type}
            </Badge>
            <Badge variant="subtle">📍 {item.area}</Badge>
            <Badge variant="subtle">{item.campus_location}</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              {item.title}
            </h1>
            <p className="mt-3 text-2xl font-black text-gold-400">
              {formatNaira(item.price_ngn)}{" "}
              <span className="text-sm font-semibold text-brand-200">
                / {item.price_period}
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Description
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-100/90">
              {item.description}
            </p>
          </div>

          {Array.isArray(item.amenities) && item.amenities.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
                Amenities & Features
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.amenities.map((am) => (
                  <Badge key={am} variant="verified">
                    ✔ {am}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <SafetyBanner
            icon="🏘️"
            title="Inspect Before Paying"
            message="Visit the property in person during daytime, confirm water/electricity arrangements, and verify ownership before making any payment."
          />
        </article>

        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-brand-800/60 bg-forest-900/95 p-6 shadow-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Listed By
            </h2>
            <p className="mt-3 text-base font-extrabold text-white">
              {item.lister_name}{" "}
              {item.lister_verified && (
                <span className="text-emerald-400">✔</span>
              )}
            </p>
            <p className="mt-1 text-xs text-brand-200/80">
              📍 {item.area} • {item.campus_location}
            </p>

            <div className="mt-5 space-y-2.5">
              <ProtectedActionButton
                promptTitle="Contact Caretaker / Roommate"
                promptMessage="Join MOUAU Connect to message the caretaker or prospective roommate and arrange an inspection."
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
              >
                💬 Contact Lister
              </ProtectedActionButton>
              <ProtectedActionButton
                promptTitle="Report Listing"
                promptMessage="Log in or create a free account to report suspicious accommodation listings."
                className="w-full rounded-xl border border-rose-500/35 bg-rose-950/20 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-950/40"
              >
                🚩 Report Listing
              </ProtectedActionButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
