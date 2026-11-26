import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="mx-auto my-12 max-w-lg rounded-3xl border border-brand-800/60 bg-forest-900/90 p-8 text-center shadow-2xl">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-950 text-3xl">
          🧭
        </span>
        <h1 className="mt-4 text-2xl font-black text-white">Page Not Found</h1>
        <p className="mt-2 text-sm text-brand-200/80">
          The page or listing you are looking for could not be found. Continue
          exploring MOUAU Connect below.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-500"
          >
            Go to Home
          </Link>
          <Link
            href="/search"
            className="rounded-xl border border-brand-700/80 bg-forest-950 px-5 py-2.5 text-xs font-bold text-brand-100 transition hover:border-gold-400"
          >
            Search Platform
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
