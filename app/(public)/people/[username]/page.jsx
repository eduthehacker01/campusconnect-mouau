import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { ArticleCard } from "@/components/cards/PublicCards";
import { getPersonByUsername, getArticles } from "@/lib/data/publicQueries";
import { initials } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const person = await getPersonByUsername(username);
  if (!person) return { title: "Profile Not Found" };
  return {
    title: `${person.full_name} — Public Profile`,
    description: person.bio,
  };
}

export default async function PersonDetailPage({ params }) {
  const { username } = await params;
  const person = await getPersonByUsername(username);
  if (!person) notFound();

  const articles = await getArticles({ authorUsername: person.username });

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "People", href: "/people" },
          { label: person.full_name },
        ]}
      />

      <section className="rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 text-xl font-black text-white shadow-lg">
              {initials(person.full_name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {person.full_name}
                </h1>
                {person.is_verified && (
                  <Badge variant="verified">✔ Verified</Badge>
                )}
                <Badge variant="subtle">{person.role}</Badge>
              </div>
              <p className="mt-1 text-sm text-brand-200">
                {person.college} • {person.department}{" "}
                {person.level ? `(${person.level})` : ""}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-gold-400">
                📍 {person.campus_location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <ProtectedActionButton
              promptTitle={`Follow ${person.full_name}`}
              promptMessage="Join MOUAU Connect to follow people, build your network, and see their updates."
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-500"
            >
              + Follow
            </ProtectedActionButton>
            <ProtectedActionButton
              promptTitle={`Message ${person.full_name}`}
              promptMessage="Create a free MOUAU Connect account to send direct messages safely."
              className="rounded-xl border border-brand-700/80 bg-forest-950/80 px-5 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
            >
              💬 Message
            </ProtectedActionButton>
          </div>
        </div>

        <div className="mt-6 border-t border-brand-800/60 pt-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
            About
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-100/90">
            {person.bio}
          </p>
        </div>

        {Array.isArray(person.interests) && person.interests.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Interests
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {person.interests.map((tag) => (
                <Badge key={tag} variant="subtle">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </section>

      {articles.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-white">
            Published Articles by {person.full_name}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
