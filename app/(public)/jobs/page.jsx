import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { JobCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getJobs } from "@/lib/data/publicQueries";

export const metadata = {
  title: "Jobs",
  description:
    "Discover part-time, full-time, remote, freelance, temporary, and internship opportunities around MOUAU, ABSU, and Umuahia.",
};

const JOB_TYPES = [
  "All",
  "Part-time",
  "Full-time",
  "Remote",
  "Freelance",
  "Temporary",
  "Internship",
];

export default async function JobsPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const type = typeof sp.type === "string" ? sp.type : "All";
  const location = typeof sp.location === "string" ? sp.location : "All Locations";

  const jobs = await getJobs({ q, type, location });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Work, Gigs & Internships"
        title="Jobs & Opportunities"
        description="Explore part-time student jobs, full-time roles, remote contracts, freelance gigs, temporary work, and internships."
        action={
          <ProtectedActionButton
            promptTitle="Post a Job on MOUAU Connect"
            promptMessage="Create a free account to post verified job openings and connect with candidates around MOUAU, ABSU, and Umuahia."
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-500"
          >
            + Post a Job
          </ProtectedActionButton>
        }
      />

      <SafetyBanner
        title="Job Safety Rule"
        message="Never pay anyone money to secure a job or interview. Report any suspicious job advertisement immediately."
      />

      <UrlFilterBar
        initialQ={q}
        initialLocation={location}
        initialCategory={type}
        categoryParamName="type"
        categories={JOB_TYPES}
        searchPlaceholder="Search job titles, employers, skills…"
      />

      {jobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No jobs match your filters"
          description="Try selecting a different job type or clearing your location and keyword filters."
          resetHref="/jobs"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
