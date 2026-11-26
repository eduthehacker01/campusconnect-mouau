import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { getCommunityBySlug } from "@/lib/data/publicQueries";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community) return { title: "Community Not Found" };
  return {
    title: community.name,
    description: community.description,
  };
}

export default async function CommunityDetailPage({ params }) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Communities", href: "/communities" },
          { label: community.name },
        ]}
      />

      <section className="rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">{community.category}</Badge>
              <Badge variant="goldSubtle">
                👥 {Number(community.member_count).toLocaleString()} Members
              </Badge>
              <Badge variant="subtle">📍 {community.campus_location}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {community.name}
            </h1>
            <p className="mt-1 text-xs font-semibold text-brand-200">
              Community Admin: {community.admin_name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-brand-100/90">
              {community.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <ProtectedActionButton
              promptTitle={`Join ${community.name}`}
              promptMessage="Create a free MOUAU Connect account to join communities, publish posts, and comment on discussions."
              className="rounded-xl bg-brand-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg transition hover:bg-brand-500"
            >
              + Join Community
            </ProtectedActionButton>
            <ProtectedActionButton
              promptTitle="Publish a Community Post"
              promptMessage="Sign up or log in to publish posts and engage with community members."
              className="rounded-xl border border-brand-700/80 bg-forest-950/80 px-4 py-3 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
            >
              ✍️ Publish Post
            </ProtectedActionButton>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-brand-800/70 bg-forest-950/80 p-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
            Pinned Public Discussion Preview
          </h2>
          <p className="mt-2 text-sm text-emerald-300">
            📌 {community.latest_post_preview}
          </p>
          <div className="mt-4">
            <ProtectedActionButton
              promptTitle="Comment on Discussion"
              promptMessage="Join MOUAU Connect to write comments and reply to community discussions."
              className="rounded-xl border border-brand-700/80 bg-forest-900 px-4 py-2 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
            >
              💬 Write a Comment
            </ProtectedActionButton>
          </div>
        </div>
      </section>
    </div>
  );
}
