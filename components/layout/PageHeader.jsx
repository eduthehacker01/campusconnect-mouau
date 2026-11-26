export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="rounded-3xl border border-brand-800/60 bg-gradient-to-r from-forest-900/95 via-brand-950/90 to-forest-900/95 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow && (
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gold-400">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-brand-100/85">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}
