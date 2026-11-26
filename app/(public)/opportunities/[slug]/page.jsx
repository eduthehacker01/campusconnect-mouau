import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getOpportunityBySlug } from "@/lib/data/publicQueries";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getOpportunityBySlug(slug);
  if (!item) return { title: "Opportunity Not Found" };
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function OpportunityDetailPage({ params }) {
  const { slug } = await params;
  const item = await getOpportunityBySlug(slug);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Opportunities", href: "/opportunities" },
          { label: item.title },
        ]}
      />

      <article className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="verified">{item.opportunity_type}</Badge>
          <Badge variant="goldSubtle">⏳ {item.deadline}</Badge>
          <Badge variant="subtle">Source: {item.source_name}</Badge>
        </div>

        <h1 className="text-2xl font-black text-white sm:text-3xl">
          {item.title}
        </h1>

        <p className="text-lg font-black text-gold-400">
          Award / Benefit: {item.benefit_text}
        </p>

        <div className="space-y-4 border-t border-brand-800/60 pt-5">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Overview
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-100/90">
              {item.description}
            </p>
          </div>

          <div className="rounded-2xl border border-brand-700/60 bg-forest-950/80 p-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Eligibility Requirements
            </h2>
            <p className="mt-1.5 text-sm text-brand-100/90">
              {item.eligibility}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={item.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
          >
            Visit Official Application Portal ↗
          </a>
          <ProtectedActionButton
            promptTitle="Save Opportunity & Get Deadline Alerts"
            promptMessage="Join MOUAU Connect to bookmark scholarships, SIWES, and grants and get reminded before deadlines close."
            className="rounded-xl border border-brand-700/80 bg-forest-950/80 px-5 py-3 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
          >
            🔖 Save Opportunity
          </ProtectedActionButton>
        </div>
      </article>
    </div>
  );
}
