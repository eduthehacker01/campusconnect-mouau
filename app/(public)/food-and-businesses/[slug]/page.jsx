import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getBusinessBySlug } from "@/lib/data/publicQueries";
import { formatNaira } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: "Business Not Found" };
  return {
    title: business.name,
    description: business.description,
  };
}

export default async function BusinessDetailPage({ params }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Food & Businesses", href: "/food-and-businesses" },
          { label: business.name },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <article className="space-y-6 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">{business.business_type}</Badge>
            <Badge variant="verified">★ {business.rating_avg}</Badge>
            {business.verified && <Badge variant="verified">✔ Verified</Badge>}
          </div>

          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              {business.name}
            </h1>
            <p className="mt-2 text-sm text-brand-200">
              📍 {business.address} • {business.campus_location}
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-400">
              🕒 {business.opening_hours} • Typical range: {business.price_range}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-brand-100/90">
            {business.description}
          </p>

          {/* Menu / Available Services */}
          {Array.isArray(business.menu_items) && business.menu_items.length > 0 && (
            <div className="border-t border-brand-800/60 pt-5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
                Menu & Available Services
              </h2>
              <div className="mt-3 divide-y divide-brand-800/60 rounded-2xl border border-brand-800/60 bg-forest-950/75">
                {business.menu_items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start justify-between gap-4 p-4"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-white">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-brand-200/80">
                          {item.description}
                        </p>
                      )}
                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-brand-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="shrink-0 text-sm font-black text-gold-400">
                      {formatNaira(item.price_ngn)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-brand-800/60 bg-forest-900/95 p-6 shadow-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Connect With Business
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-brand-200/85">
              Specialties: {business.specialty}
            </p>
            <div className="mt-5 space-y-2.5">
              <ProtectedActionButton
                promptTitle={`Message ${business.name}`}
                promptMessage="Join MOUAU Connect to message local businesses, place inquiries, and save your favourite spots."
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
              >
                💬 Contact Business
              </ProtectedActionButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
