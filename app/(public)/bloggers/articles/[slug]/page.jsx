import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProtectedActionButton } from "@/components/auth/ProtectedActionButton";
import { ArticleCard } from "@/components/cards/PublicCards";
import { getArticleBySlug } from "@/lib/data/publicQueries";
import { formatDateShort } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { article } = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function BlogArticleDetailPage({ params }) {
  const { slug } = await params;
  const { article, moreArticles } = await getArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = Array.isArray(article.content)
    ? article.content
    : String(article.content || "")
        .split("\n\n")
        .filter(Boolean);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bloggers", href: "/bloggers" },
          { label: article.title },
        ]}
      />

      <article className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-brand-800/60 bg-forest-900/90 p-6 sm:p-10 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="gold">{article.category}</Badge>
          <Badge variant="verified">✔ {article.author_badge}</Badge>
          <span className="text-xs text-brand-200/80">
            {article.read_time_mins} min read •{" "}
            {Number(article.read_count).toLocaleString()} reads
          </span>
        </div>

        <h1 className="text-2xl font-black leading-tight text-white sm:text-4xl">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-brand-800/60 py-4 text-xs">
          <div>
            <p className="text-brand-200">
              Written by{" "}
              <Link
                href={`/bloggers/${article.author_username}`}
                className="font-extrabold text-gold-300 hover:underline"
              >
                {article.author_name}
              </Link>
            </p>
            <p className="mt-0.5 text-brand-300/70">
              Published {formatDateShort(article.published_at)}
            </p>
          </div>
          <ProtectedActionButton
            promptTitle={`Follow ${article.author_name}`}
            promptMessage="Join MOUAU Connect to follow campus bloggers and never miss an article."
            className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-brand-500"
          >
            + Follow Author
          </ProtectedActionButton>
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-brand-100/90">
          {paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        <div className="border-t border-brand-800/60 pt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-brand-200/80">
            Have thoughts on this article?
          </p>
          <ProtectedActionButton
            promptTitle="Comment on This Article"
            promptMessage="Create a free MOUAU Connect account to write comments and join the conversation."
            className="rounded-xl border border-brand-700/80 bg-forest-950/80 px-4 py-2 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
          >
            💬 Write a Comment
          </ProtectedActionButton>
        </div>
      </article>

      {moreArticles.length > 0 && (
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-xl font-extrabold text-white">
            More Public Articles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {moreArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
