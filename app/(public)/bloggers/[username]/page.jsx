import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { ArticleCard } from "@/components/cards/PublicCards";
import { getPersonByUsername, getArticles } from "@/lib/data/publicQueries";
import { initials } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const blogger = await getPersonByUsername(username);
  if (!blogger) return { title: "Blogger Not Found" };
  return {
    title: `${blogger.full_name} — Blogger Profile`,
    description: blogger.bio,
  };
}

export default async function BloggerProfilePage({ params }) {
  const { username } = await params;
  const blogger = await getPersonByUsername(username);
  if (!blogger) notFound();

  const articles = await getArticles({ authorUsername: blogger.username });

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bloggers", href: "/bloggers" },
          { label: blogger.full_name },
        ]}
      />

      <section className="rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-xl font-black text-white">
              {initials(blogger.full_name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {blogger.full_name}
                </h1>
                {blogger.is_verified_blogger && (
                  <Badge variant="verified">✔ Verified Blogger</Badge>
                )}
                {blogger.is_popular_blogger && (
                  <Badge variant="goldSubtle">🔥 Popular</Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-brand-200">
                {blogger.department} • {blogger.campus_location}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-100/90">
                {blogger.bio}
              </p>
            </div>
          </div>

          <ProtectedActionButton
            promptTitle={`Follow ${blogger.full_name}`}
            promptMessage="Join MOUAU Connect to follow bloggers and get notified whenever new articles are published."
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-500"
          >
            + Follow Blogger
          </ProtectedActionButton>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-extrabold text-white">
          Articles by {blogger.full_name} ({articles.length})
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
