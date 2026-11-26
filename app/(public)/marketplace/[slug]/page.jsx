import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { ProductCard } from "@/components/cards/PublicCards";
import { getMarketplaceBySlug } from "@/lib/data/publicQueries";
import { formatNaira, initials } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { item } = await getMarketplaceBySlug(slug);
  if (!item) return { title: "Product Not Found" };
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const { item, related } = await getMarketplaceBySlug(slug);

  if (!item) notFound();

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: item.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Product Information */}
        <article className="space-y-6 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">{item.category}</Badge>
            <Badge variant="subtle">Condition: {item.condition}</Badge>
            <Badge variant="subtle">📍 {item.campus_location}</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              {item.title}
            </h1>
            <p className="mt-3 text-3xl font-black text-gold-400">
              {formatNaira(item.price_ngn)}
            </p>
          </div>

          <div className="border-t border-brand-800/60 pt-5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
              Product Description
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-100/90">
              {item.description}
            </p>
          </div>

          <SafetyBanner
            title="Buy Safely"
            message="Meet the seller in a public campus area, test electronics before paying, and never transfer money before verifying the item."
          />
        </article>

        {/* Sticky Seller & Action Sidebar */}
        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl border border-brand-800/60 bg-forest-900/95 p-6 shadow-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Seller Information
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 font-black text-white">
                {initials(item.seller_name)}
              </div>
              <div>
                <p className="font-extrabold text-white">
                  {item.seller_name}{" "}
                  {item.seller_verified && (
                    <span className="text-emerald-400" title="Verified Seller">
                      ✔
                    </span>
                  )}
                </p>
                <p className="text-xs text-brand-200/80">
                  📍 {item.campus_location}
                </p>
              </div>
            </div>

            {item.seller_username && (
              <Link
                href={`/people/${item.seller_username}`}
                className="mt-3 inline-block text-xs font-bold text-gold-300 hover:underline"
              >
                View seller public profile →
              </Link>
            )}

            <div className="mt-5 space-y-2.5">
              <ProtectedActionButton
                promptTitle="Contact Seller"
                promptMessage="Join MOUAU Connect to connect with sellers, ask questions and discover more opportunities."
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
              >
                💬 Contact Seller
              </ProtectedActionButton>

              <ProtectedActionButton
                promptTitle="Save Product"
                promptMessage="Join MOUAU Connect to save products and come back to them anytime."
                className="w-full rounded-xl border border-brand-700/80 bg-forest-950/80 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
              >
                🔖 Save Product
              </ProtectedActionButton>

              <ProtectedActionButton
                promptTitle="Report This Listing"
                promptMessage="Please log in or create a free account to submit a safety report to our moderation team."
                className="w-full rounded-xl border border-rose-500/35 bg-rose-950/20 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-950/40"
              >
                🚩 Report Listing
              </ProtectedActionButton>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-white">
            Related Products
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <ProductCard key={rel.id} item={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
