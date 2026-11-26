import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { BusinessCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getBusinesses } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Food & Businesses",
  description:
    "Discover restaurants, food vendors, cafes, grooming lounges, and local businesses around MOUAU, ABSU, Umudike, and Umuahia.",
};

const BUSINESS_TYPES = [
  "All",
  "Restaurant",
  "Food Vendor",
  "Cafe & Bakery",
  "Workspace & Tech",
  "Beauty & Grooming",
];

export default async function FoodAndBusinessesPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const type = typeof sp.type === "string" ? sp.type : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";

  const businesses = await getBusinesses({ q, type, location });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Campus Dining & Local Brands"
        title="Food & Businesses"
        description="Discover restaurants, food vendors, co-working hubs, and local businesses. View opening hours, profiles, menus, and services publicly."
        action={
          <ProtectedActionButton
            promptTitle="Promote Your Business"
            promptMessage="Create a free MOUAU Connect account to list your restaurant or business and reach students around MOUAU and ABSU."
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
          >
            + List Your Business
          </ProtectedActionButton>
        }
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={type}
        categoryParamName="type"
        categories={BUSINESS_TYPES}
        searchPlaceholder="Search restaurants, shawarma, jollof, barbers, tech hubs…"
      />

      {businesses.length === 0 ? (
        <EmptyState
          icon="🍲"
          title="No businesses match your filters"
          description="Try clearing your category or location filter to browse all local restaurants and businesses."
          resetHref="/food-and-businesses"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      )}
    </div>
  );
}
