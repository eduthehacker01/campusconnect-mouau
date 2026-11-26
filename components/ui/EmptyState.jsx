import Link from "next/link";

export function EmptyState({
  icon = "🔎",
  title = "No matching results found",
  description = "Try adjusting your search keywords or clearing your active filters.",
  resetHref,
  resetLabel = "Clear filters",
}) {
  return (
    <div className="rounded-2xl border border-brand-800/60 bg-forest-900/75 px-6 py-12 text-center shadow-lg">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-950 text-2xl">
        <span aria-hidden="true">{icon}</span>
      </div>
      <h3 className="mt-4 text-base font-extrabold text-white">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-brand-200/80">
        {description}
      </p>
      {resetHref && (
        <div className="mt-5">
          <Link
            href={resetHref}
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-500"
          >
            {resetLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
