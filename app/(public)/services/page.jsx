import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { ServiceCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getServices } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Services",
  description:
    "Discover student and local services including web design, laundry, hairdressing, tutoring, and tech repairs around MOUAU and ABSU.",
};

const SERVICE_CATEGORIES = [
  "All",
  "Website Development",
  "Laundry",
  "Hairdressing & Makeup",
  "Private Tutoring",
  "Phone & Laptop Repairs",
];

export default async function ServicesPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";

  const services = await getServices({ q, category, location });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Skills & Local Services"
        title="Services Directory"
        description="Browse trusted student and local service providers around MOUAU, ABSU, Umudike, and Umuahia."
        action={
          <ProtectedActionButton
            promptTitle="Advertise a Service"
            promptMessage="Create a free MOUAU Connect account to list your skills and advertise your services to the community."
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
          >
            + Advertise a Service
          </ProtectedActionButton>
        }
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={category}
        categories={SERVICE_CATEGORIES}
        searchPlaceholder="Search web design, laundry, tutoring, repairs, hair…"
      />

      {services.length === 0 ? (
        <EmptyState
          icon="🛠️"
          title="No services match your filters"
          description="Try clearing your category or location filter to browse all available services."
          resetHref="/services"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
