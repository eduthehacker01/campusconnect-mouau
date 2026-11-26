import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { ProductCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getMarketplaceListings } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Marketplace",
  description:
    "Browse student and community marketplace products around MOUAU, ABSU, Umudike, and Umuahia.",
};

const MARKETPLACE_CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Home Appliances",
  "Books",
  "Fashion",
  "Food",
  "Beauty",
];

export default async function MarketplacePage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";
  const minPrice = typeof sp.minPrice === "string" ? sp.minPrice : "";
  const maxPrice = typeof sp.maxPrice === "string" ? sp.maxPrice : "";

  const products = await getMarketplaceListings({
    q,
    category,
    location,
    minPrice,
    maxPrice,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Campus & Community Commerce"
        title="Marketplace"
        description="Browse gadgets, furniture, textbooks, appliances, and fashion from students and local vendors around MOUAU, ABSU, and Umuahia."
        action={
          <ProtectedActionButton
            promptTitle="Publish a Product on MOUAU Connect"
            promptMessage="Create a free MOUAU Connect account to list items for sale in the campus marketplace."
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
          >
            + Publish Product
          </ProtectedActionButton>
        }
      />

      <SafetyBanner
        title="Marketplace Safety Tip"
        message="Always inspect items physically in a well-lit public location (such as MOUAU Main Gate, SUB Complex, or ABSU Gate) before paying."
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={category}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
        categories={MARKETPLACE_CATEGORIES}
        showPriceRange
        searchPlaceholder="Search laptops, fans, mattresses, books, fashion…"
      />

      {products.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="No marketplace products match your filters"
          description="Try widening your price range, changing the category, or searching with different keywords."
          resetHref="/marketplace"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
