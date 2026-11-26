import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getServiceBySlug } from "@/lib/data/publicQueries";
import { initials } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <article className="space-y-5 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{service.category}</Badge>
            <Badge variant="goldSubtle">
              {service.rating_avg} ★ ({service.review_count} reviews)
            </Badge>
            <Badge variant="subtle">📍 {service.campus_location}</Badge>
          </div>

          <h1 className="text-2xl font-black text-white sm:text-3xl">
            {service.title}
          </h1>

          <p className="text-2xl font-black text-emerald-400">
            {service.price_text}
          </p>

          <div className="border-t border-brand-800/60 pt-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Service Overview
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-100/90">
              {service.description}
            </p>
          </div>
        </article>

        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-brand-800/60 bg-forest-900/95 p-6 shadow-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Service Provider
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 font-black text-white">
                {initials(service.provider_name)}
              </div>
              <div>
                <p className="font-extrabold text-white">
                  {service.provider_name}{" "}
                  {service.provider_verified && (
                    <span className="text-emerald-400">✔</span>
                  )}
                </p>
                <p className="text-xs text-brand-200/80">
                  📍 {service.campus_location}
                </p>
              </div>
            </div>

            {service.provider_username && (
              <Link
                href={`/people/${service.provider_username}`}
                className="mt-3 inline-block text-xs font-bold text-gold-300 hover:underline"
              >
                View provider public profile →
              </Link>
            )}

            <div className="mt-5 space-y-2.5">
              <ProtectedActionButton
                promptTitle="Contact Service Provider"
                promptMessage="Join MOUAU Connect to message service providers, discuss requirements, and book services."
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
              >
                💬 Contact Provider
              </ProtectedActionButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
