import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { UrlFilterBar } from "@/components/filters/UrlFilterBar";
import { ArticleCard } from "@/components/cards/PublicCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { getArticles, getBloggers } from "@/lib/data/publicQueries";
import { initials } from "@/lib/utils/format";

export const metadata = {
  title: "Bloggers & Articles",
  description:
    "Discover campus bloggers and read full public articles on student business, careers, SIWES, food, and campus life around MOUAU and ABSU.",
};

const ARTICLE_CATEGORIES = [
  "All",
  "Business & Campus Gist",
  "Career Development",
  "Lifestyle & Food",
];

export default async function BloggersPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "All";

  const [articles, bloggers] = await Promise.all([
    getArticles({ q, category }),
    getBloggers(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Campus Journalism & Insights"
        title="Bloggers & Public Articles"
        description="Discover verified and popular campus writers, view their public profiles, and read full articles freely without signing up."
      />

      {/* Featured Bloggers Strip */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold text-white">
          Featured Bloggers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bloggers.map((blogger) => (
            <Link
              key={blogger.id}
              href={`/bloggers/${blogger.username}`}
              className="group flex items-center gap-3.5 rounded-2xl border border-brand-800/60 bg-forest-900/90 p-4 shadow-md transition hover:border-brand-500"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 font-black text-white">
                {initials(blogger.full_name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-extrabold text-white group-hover:text-gold-300">
                    {blogger.full_name}
                  </p>
                  {blogger.is_verified_blogger && (
                    <Badge variant="verified">✔</Badge>
                  )}
                </div>
                <p className="truncate text-xs text-brand-200/80">
                  {blogger.department} • {blogger.campus_location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <UrlFilterBar
        initialQ={q}
        initialCategory={category}
        categories={ARTICLE_CATEGORIES}
        showLocation={false}
        searchPlaceholder="Search articles by title, topic, or author…"
      />

      {articles.length === 0 ? (
        <EmptyState
          icon="✍️"
          title="No articles match your filters"
          description="Try clearing your category or search query to read all published articles."
          resetHref="/bloggers"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
