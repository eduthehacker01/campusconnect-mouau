import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { AdminBlockWatermark } from "@/components/home/AdminBlockWatermark";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 sm:py-12">
      <AdminBlockWatermark opacity="opacity-[0.16]" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="rounded-xl border border-brand-700/80 bg-forest-900/90 px-3.5 py-2 text-xs font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
          >
            ← Back to Exploring
          </Link>
        </div>

        <div className="pop-in overflow-hidden rounded-3xl border border-brand-700/60 bg-forest-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {children}
        </div>

        <p className="mt-4 text-center text-[11px] text-brand-200/75">
          Independent platform serving MOUAU, ABSU & surrounding communities.
        </p>
      </div>
    </div>
  );
}
