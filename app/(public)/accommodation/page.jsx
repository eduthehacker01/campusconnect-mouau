import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { AccommodationCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getAccommodations } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Accommodation",
  description:
    "Browse available rooms, hostels, self-contained apartments, shared apartments, and roommate opportunities around MOUAU, ABSU, and Umudike.",
};

const ACCOMMODATION_TYPES = [
  "All",
  "Room",
  "Hostel",
  "Self-Contained",
  "Shared Apartment",
  "Roommate Needed",
];

export default async function AccommodationPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const type = typeof sp.type === "string" ? sp.type : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";
  const minPrice = typeof sp.minPrice === "string" ? sp.minPrice : "";
  const maxPrice = typeof sp.maxPrice === "string" ? sp.maxPrice : "";

  const listings = await getAccommodations({
    q,
    type,
    location,
    minPrice,
    maxPrice,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lodges, Hostels & Roommates"
        title="Accommodation"
        description="Find available rooms, hostels, self-contained apartments, shared apartments, and roommate opportunities around MOUAU, ABSU, 82 Bus Stop, Ndoro, and Ahiaeke."
        action={
          <ProtectedActionButton
            promptTitle="Post an Accommodation Listing"
            promptMessage="Join MOUAU Connect to list available rooms, lodges, or find a compatible roommate."
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
          >
            + Post Listing
          </ProtectedActionButton>
        }
      />

      <SafetyBanner
        icon="🏘️"
        title="Accommodation Anti-Scam Notice"
        message="Always physically inspect any room or lodge and verify the caretaker or landlord before paying rent."
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={type}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
        categoryParamName="type"
        categories={ACCOMMODATION_TYPES}
        showPriceRange
        searchPlaceholder="Search by area (82 Bus Stop, Ndoro, Ahiaeke, Uturu)…"
      />

      {listings.length === 0 ? (
        <EmptyState
          icon="🏘️"
          title="No accommodation listings match your filters"
          description="Try adjusting your budget range, listing type, or campus location."
          resetHref="/accommodation"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item) => (
            <AccommodationCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
