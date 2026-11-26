import Link from "next/link";

export function Logo({ asLink = true }) {
  const inner = (
    <div className="leading-tight">
      <p className="text-lg font-extrabold tracking-tight text-white">
        MOUAU Connect
      </p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-400">
        MOUAU • ABSU • UMUDIKE
      </p>
    </div>
  );

  if (!asLink) return inner;

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
      aria-label="MOUAU Connect Home"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-black text-white shadow-md shadow-forest-950/60"
      >
        MC
      </span>
      {inner}
    </Link>
  );
}
