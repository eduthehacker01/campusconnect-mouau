import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getLostFoundBySlug } from "@/lib/data/publicQueries";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getLostFoundBySlug(slug);
  if (!item) return { title: "Item Not Found" };
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function LostFoundDetailPage({ params }) {
  const { slug } = await params;
  const item = await getLostFoundBySlug(slug);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Lost & Found", href: "/lost-and-found" },
          { label: item.title },
        ]}
      />

      <article className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.item_status === "LOST" ? "danger" : "brand"}>
            {item.item_status}
          </Badge>
          <Badge variant="subtle">{item.reported_label}</Badge>
          <Badge variant="subtle">📍 {item.campus_location}</Badge>
        </div>

        <h1 className="text-2xl font-black text-white sm:text-3xl">
          {item.title}
        </h1>

        <p className="text-sm font-semibold text-gold-400">
          Location Details: {item.area_detail}
        </p>

        <div className="border-t border-brand-800/60 pt-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
            Item Description
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-100/90">
            {item.description}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-700/60 bg-forest-950/80 p-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
            Contact Instructions
          </h2>
          <p className="mt-1.5 text-sm text-brand-100/90">
            {item.contact_instructions}
          </p>
        </div>

        <ProtectedActionButton
          promptTitle="Contact Owner or Finder"
          promptMessage="Join MOUAU Connect to message the owner or finder directly and arrange a safe handover."
          className="w-full sm:w-auto rounded-xl bg-brand-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
        >
          💬 Contact Owner / Finder
        </ProtectedActionButton>
      </article>
    </div>
  );
}
