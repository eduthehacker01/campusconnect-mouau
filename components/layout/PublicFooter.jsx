import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  PRIMARY_NAV_LINKS,
  EXPLORE_NAV_LINKS,
} from "@/lib/constants/navigation";

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-brand-900/70 bg-forest-950/95 text-brand-200/80">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-brand-200/80">
              “Connecting People. Creating Opportunities. Building Communities.”
              An independent community-driven platform serving students, young
              people, and businesses around MOUAU (Umudike), ABSU (Uturu), and
              surrounding communities.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Platform
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              {PRIMARY_NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/search" className="transition hover:text-white">
                  Global Search
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold-400">
              Explore
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {EXPLORE_NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-brand-900/60 pt-6 text-[11px] text-brand-300/70 sm:flex-row">
          <p>© {new Date().getFullYear()} MOUAU Connect. All rights reserved.</p>
          <p>
            Public browsing enabled — explore freely, create an account only
            when you are ready to connect.
          </p>
        </div>
      </div>
    </footer>
  );
}
