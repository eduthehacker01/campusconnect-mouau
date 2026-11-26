import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { AdminBlockWatermark } from "@/components/home/AdminBlockWatermark";
import { CampusSlideVideoPlayer } from "@/components/home/CampusSlideVideoPlayer";
import { HomeSearchForm } from "@/components/home/HomeSearchForm";
import { EXPLORE_NAV_LINKS } from "@/lib/constants/navigation";
import {
  getMarketplaceListings,
  getJobs,
  getEvents,
  getServices,
  getArticles,
  getBusinesses,
  getCommunities,
} from "@/lib/data/publicQueries";
import {
  ProductCard,
  JobCard,
  EventCard,
  ServiceCard,
  ArticleCard,
  BusinessCard,
  CommunityCard,
} from "@/components/cards/PublicCards";

function SectionHeading({ eyebrow, title, href, linkLabel = "View all →" }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        {eyebrow && (
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gold-400">
            {eyebrow}
          </span>
        )}
        <h2 className="text-xl font-extrabold text-white sm:text-2xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs font-extrabold text-gold-300 transition hover:text-white"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [
    products,
    jobs,
    events,
    services,
    articles,
    businesses,
    communities,
  ] = await Promise.all([
    getMarketplaceListings(),
    getJobs(),
    getEvents(),
    getServices(),
    getArticles(),
    getBusinesses(),
    getCommunities(),
  ]);

  const featuredProducts = products.slice(0, 3);
  const latestJobs = jobs.slice(0, 2);
  const upcomingEvents = events.slice(0, 3);
  const popularServices = services.slice(0, 3);
  const latestArticles = articles.slice(0, 3);
  const featuredBusinesses = businesses.slice(0, 3);
  const featuredCommunities = communities.slice(0, 2);

  return (
    <PublicShell>
      <div className="space-y-12">
        {/* 1. Hero Introduction & Global Search */}
        <section className="relative overflow-hidden rounded-3xl border border-brand-700/60 bg-gradient-to-r from-forest-950/95 via-brand-950/90 to-forest-900/95 p-6 sm:p-8 shadow-2xl">
          <AdminBlockWatermark opacity="opacity-[0.18]" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-500/15 px-3 py-1 text-xs font-extrabold text-gold-300">
                🌟 MOUAU • ABSU • Umudike • Umuahia
              </span>

              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Connecting People.{" "}
                <span className="text-brand-400">Creating Opportunities.</span>{" "}
                Building Communities.
              </h1>

              <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-brand-100/85">
                Discover products, part-time & remote jobs, campus events,
                student services, lodges, scholarships, bloggers, and local
                businesses around Michael Okpara University of Agriculture,
                Umudike (MOUAU), Abia State University (ABSU), and surrounding
                communities.
              </p>

              <HomeSearchForm />

              <div className="mt-4 flex flex-wrap gap-2.5 text-xs">
                <Link
                  href="/marketplace"
                  className="rounded-xl border border-brand-700/70 bg-forest-950/75 px-3.5 py-2 font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
                >
                  🛒 Marketplace
                </Link>
                <Link
                  href="/jobs"
                  className="rounded-xl border border-brand-700/70 bg-forest-950/75 px-3.5 py-2 font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
                >
                  💼 Jobs & Internships
                </Link>
                <Link
                  href="/events"
                  className="rounded-xl border border-brand-700/70 bg-forest-950/75 px-3.5 py-2 font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
                >
                  🎉 Upcoming Events
                </Link>
                <Link
                  href="/opportunities"
                  className="rounded-xl border border-brand-700/70 bg-forest-950/75 px-3.5 py-2 font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
                >
                  🎓 Scholarships & SIWES
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CampusSlideVideoPlayer />
            </div>
          </div>
        </section>

        {/* 2. Explore Categories */}
        <section>
          <SectionHeading
            eyebrow="Explore Freely"
            title="Explore Categories"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORE_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-brand-800/60 bg-forest-900/85 p-4 shadow-md transition hover:border-brand-500 hover:bg-forest-900"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-950 text-xl transition group-hover:bg-brand-600"
                >
                  {item.icon}
                </span>
                <h3 className="mt-3 text-sm font-extrabold text-white group-hover:text-gold-300">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs text-brand-200/80">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Featured Marketplace Products */}
        <section>
          <SectionHeading
            eyebrow="Campus Commerce"
            title="Featured Marketplace Products"
            href="/marketplace"
            linkLabel="Browse all products →"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 4. Latest Job Opportunities */}
        <section>
          <SectionHeading
            eyebrow="Work & Internships"
            title="Latest Job Opportunities"
            href="/jobs"
            linkLabel="Browse all jobs →"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* 5. Upcoming Events */}
        <section>
          <SectionHeading
            eyebrow="Happening Around Campus"
            title="Upcoming Events"
            href="/events"
            linkLabel="See all events →"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* 6. Popular Services */}
        <section>
          <SectionHeading
            eyebrow="Skills & Local Talent"
            title="Popular Services"
            href="/services"
            linkLabel="Explore services →"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* 7. Latest Blogger Articles */}
        <section>
          <SectionHeading
            eyebrow="Campus Journalism & Guides"
            title="Latest Blogger Articles"
            href="/bloggers"
            linkLabel="Read all articles →"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* 8. Featured Businesses */}
        <section>
          <SectionHeading
            eyebrow="Dining & Local Brands"
            title="Featured Food & Businesses"
            href="/food-and-businesses"
            linkLabel="Explore businesses →"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>

        {/* 9. Community Discovery */}
        <section>
          <SectionHeading
            eyebrow="Interest Hubs"
            title="Discover Communities"
            href="/communities"
            linkLabel="Explore all communities →"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {featuredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </section>

        {/* 10. Registration Call-To-Action */}
        <section className="rounded-3xl border border-gold-400/40 bg-gradient-to-r from-brand-950 via-forest-900 to-brand-950 p-6 sm:p-10 text-center shadow-2xl">
          <span className="inline-flex rounded-full bg-gold-500/15 border border-gold-400/40 px-3 py-1 text-xs font-extrabold text-gold-300">
            Free Community Account
          </span>
          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            Ready to Connect, Sell, Apply, or Join Communities?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-brand-100/85">
            Browsing MOUAU Connect is always open to everyone. Create a free
            account when you want to message sellers, apply for jobs, RSVP to
            events, follow bloggers, or publish your own listings.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-brand-700/80 bg-forest-950 px-6 py-3 text-sm font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
            >
              Log In
            </Link>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
