import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { JobCard } from "@/components/cards/PublicCards";
import { getJobBySlug } from "@/lib/data/publicQueries";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { job } = await getJobBySlug(slug);
  if (!job) return { title: "Job Not Found" };
  return {
    title: `${job.title} — ${job.employer_name}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const { job, related } = await getJobBySlug(slug);

  if (!job) notFound();

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Jobs", href: "/jobs" },
          { label: job.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <article className="space-y-6 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{job.job_type}</Badge>
            <Badge variant="goldSubtle">Deadline: {job.deadline}</Badge>
            <Badge variant="subtle">📍 {job.campus_location}</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              {job.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-brand-200">
              🏢 {job.employer_name}{" "}
              {job.employer_verified && (
                <span className="text-emerald-400">✔ Verified Employer</span>
              )}
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-brand-800/60 bg-forest-950/75 p-4 sm:grid-cols-3 text-xs">
            <div>
              <p className="text-brand-300/70">Compensation</p>
              <p className="mt-1 font-extrabold text-gold-400">
                {job.salary_text}
              </p>
            </div>
            <div>
              <p className="text-brand-300/70">Work Hours</p>
              <p className="mt-1 font-bold text-white">{job.work_hours}</p>
            </div>
            <div>
              <p className="text-brand-300/70">Location</p>
              <p className="mt-1 font-bold text-white">{job.campus_location}</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
              Role Description
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-100/90">
              {job.description}
            </p>
          </div>

          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold-400">
                Requirements
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-brand-100/90">
                {job.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.application_instructions && (
            <div className="rounded-2xl border border-brand-700/60 bg-brand-950/70 p-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
                Application Instructions
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-100/90">
                {job.application_instructions}
              </p>
            </div>
          )}

          <SafetyBanner
            title="Anti-Scam Reminder"
            message="Legitimate employers on MOUAU Connect never charge application or interview fees."
          />
        </article>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl border border-brand-800/60 bg-forest-900/95 p-6 shadow-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Employer & Application
            </h2>
            <p className="mt-3 text-base font-extrabold text-white">
              {job.employer_name}
            </p>
            <p className="mt-1 text-xs text-brand-200/80">
              📍 {job.campus_location}
            </p>

            <div className="mt-5 space-y-2.5">
              <ProtectedActionButton
                promptTitle="Apply for This Job"
                promptMessage="Join MOUAU Connect to submit your application through the platform and message employers."
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
              >
                Apply via MOUAU Connect
              </ProtectedActionButton>

              <ProtectedActionButton
                promptTitle="Report Job Listing"
                promptMessage="Log in or create a free account to report suspicious job postings to our Trust & Safety team."
                className="w-full rounded-xl border border-rose-500/35 bg-rose-950/20 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-950/40"
              >
                🚩 Report Listing
              </ProtectedActionButton>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-white">
            More Job Opportunities
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((rel) => (
              <JobCard key={rel.id} job={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
