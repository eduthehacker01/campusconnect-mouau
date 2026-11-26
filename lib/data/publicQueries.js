import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  SEED_MARKETPLACE,
  SEED_JOBS,
  SEED_EVENTS,
  SEED_PEOPLE,
  SEED_COMMUNITIES,
  SEED_SERVICES,
  SEED_ACCOMMODATION,
  SEED_OPPORTUNITIES,
  SEED_ARTICLES,
  SEED_LOST_FOUND,
  SEED_BUSINESSES,
} from "@/lib/data/seedCatalog";

function matchesLocation(itemLocation, filterLocation) {
  if (!filterLocation || filterLocation === "All Locations") return true;
  if (!itemLocation) return false;
  return itemLocation.toLowerCase().includes(filterLocation.split(",")[0].toLowerCase());
}

function matchesQuery(fields, q) {
  if (!q || !q.trim()) return true;
  const term = q.trim().toLowerCase();
  return fields.some((f) => f && String(f).toLowerCase().includes(term));
}

async function fetchOrFallback(tableName, fallbackData, options = {}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return fallbackData;
  try {
    let query = supabase.from(tableName).select(options.select || "*");
    if (options.eq) {
      for (const [col, val] of Object.entries(options.eq)) {
        query = query.eq(col, val);
      }
    }
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    }
    const { data, error } = await query;
    if (error || !Array.isArray(data) || data.length === 0) {
      return fallbackData;
    }
    return data;
  } catch {
    return fallbackData;
  }
}

/* =========================== MARKETPLACE =========================== */
export async function getMarketplaceListings({
  q = "",
  category = "All",
  location = "All Locations",
  minPrice = "",
  maxPrice = "",
} = {}) {
  const items = await fetchOrFallback("marketplace_listings", SEED_MARKETPLACE, {
    eq: { status: "published" },
    orderBy: "created_at",
  });

  return items.filter((item) => {
    const catOk = category === "All" || item.category === category;
    const locOk = matchesLocation(item.campus_location, location);
    const qOk = matchesQuery(
      [item.title, item.category, item.description, item.seller_name, item.campus_location],
      q
    );
    const minOk = minPrice === "" || Number(item.price_ngn) >= Number(minPrice);
    const maxOk = maxPrice === "" || Number(item.price_ngn) <= Number(maxPrice);
    return catOk && locOk && qOk && minOk && maxOk;
  });
}

export async function getMarketplaceBySlug(slug) {
  const items = await getMarketplaceListings();
  const item = items.find((i) => i.slug === slug) || null;
  if (!item) return { item: null, related: [] };
  const related = items
    .filter((i) => i.slug !== slug && (i.category === item.category || i.campus_location === item.campus_location))
    .slice(0, 3);
  return { item, related };
}

/* =========================== JOBS =========================== */
export async function getJobs({
  q = "",
  type = "All",
  location = "All Locations",
} = {}) {
  const items = await fetchOrFallback("jobs", SEED_JOBS, {
    eq: { status: "published" },
    orderBy: "created_at",
  });

  return items.filter((job) => {
    const typeOk = type === "All" || job.job_type === type;
    const locOk = matchesLocation(job.campus_location, location);
    const qOk = matchesQuery(
      [job.title, job.employer_name, job.job_type, job.description, job.campus_location],
      q
    );
    return typeOk && locOk && qOk;
  });
}

export async function getJobBySlug(slug) {
  const items = await getJobs();
  const job = items.find((j) => j.slug === slug) || null;
  if (!job) return { job: null, related: [] };
  const related = items.filter((j) => j.slug !== slug).slice(0, 3);
  return { job, related };
}

/* =========================== EVENTS =========================== */
export async function getEvents({
  q = "",
  category = "All",
  location = "All Locations",
} = {}) {
  const items = await fetchOrFallback("events", SEED_EVENTS, {
    eq: { status: "published" },
    orderBy: "starts_at",
    ascending: true,
  });

  return items.filter((ev) => {
    const catOk = category === "All" || ev.category === category;
    const locOk = matchesLocation(ev.campus_location, location);
    const qOk = matchesQuery(
      [ev.title, ev.category, ev.venue, ev.organiser_name, ev.description],
      q
    );
    return catOk && locOk && qOk;
  });
}

export async function getEventBySlug(slug) {
  const items = await getEvents();
  const event = items.find((e) => e.slug === slug) || null;
  if (!event) return { event: null, upcoming: [] };
  const upcoming = items.filter((e) => e.slug !== slug).slice(0, 3);
  return { event, upcoming };
}

/* =========================== PEOPLE =========================== */
export async function getPeople({
  q = "",
  interest = "All",
  location = "All Locations",
} = {}) {
  const items = await fetchOrFallback("public_profiles", SEED_PEOPLE);
  return items.filter((person) => {
    const intOk =
      interest === "All" ||
      (Array.isArray(person.interests) && person.interests.includes(interest));
    const locOk = matchesLocation(person.campus_location, location);
    const qOk = matchesQuery(
      [
        person.full_name,
        person.department,
        person.college,
        person.bio,
        ...(person.interests || []),
      ],
      q
    );
    return intOk && locOk && qOk;
  });
}

export async function getPersonByUsername(username) {
  const people = await getPeople();
  return people.find((p) => p.username === username) || null;
}

/* =========================== COMMUNITIES =========================== */
export async function getCommunities({ q = "", category = "All" } = {}) {
  const items = await fetchOrFallback("communities", SEED_COMMUNITIES, {
    eq: { is_public: true },
  });
  return items.filter((c) => {
    const catOk = category === "All" || c.category === category;
    const qOk = matchesQuery([c.name, c.category, c.description, c.admin_name], q);
    return catOk && qOk;
  });
}

export async function getCommunityBySlug(slug) {
  const items = await getCommunities();
  return items.find((c) => c.slug === slug) || null;
}

/* =========================== SERVICES =========================== */
export async function getServices({
  q = "",
  category = "All",
  location = "All Locations",
} = {}) {
  const items = await fetchOrFallback("services", SEED_SERVICES, {
    eq: { status: "published" },
  });
  return items.filter((sv) => {
    const catOk = category === "All" || sv.category === category;
    const locOk = matchesLocation(sv.campus_location, location);
    const qOk = matchesQuery(
      [sv.title, sv.category, sv.provider_name, sv.description],
      q
    );
    return catOk && locOk && qOk;
  });
}

export async function getServiceBySlug(slug) {
  const items = await getServices();
  return items.find((s) => s.slug === slug) || null;
}

/* =========================== ACCOMMODATION =========================== */
export async function getAccommodations({
  q = "",
  type = "All",
  location = "All Locations",
  minPrice = "",
  maxPrice = "",
} = {}) {
  const items = await fetchOrFallback("accommodations", SEED_ACCOMMODATION, {
    eq: { status: "published" },
  });
  return items.filter((acc) => {
    const typeOk = type === "All" || acc.listing_type === type;
    const locOk = matchesLocation(acc.campus_location, location);
    const qOk = matchesQuery([acc.title, acc.area, acc.description, acc.listing_type], q);
    const minOk = minPrice === "" || Number(acc.price_ngn) >= Number(minPrice);
    const maxOk = maxPrice === "" || Number(acc.price_ngn) <= Number(maxPrice);
    return typeOk && locOk && qOk && minOk && maxOk;
  });
}

export async function getAccommodationBySlug(slug) {
  const items = await getAccommodations();
  return items.find((a) => a.slug === slug) || null;
}

/* =========================== OPPORTUNITIES =========================== */
export async function getOpportunities({ q = "", type = "All" } = {}) {
  const items = await fetchOrFallback("opportunities", SEED_OPPORTUNITIES, {
    eq: { status: "published" },
  });
  return items.filter((op) => {
    const typeOk = type === "All" || op.opportunity_type === type;
    const qOk = matchesQuery(
      [op.title, op.opportunity_type, op.source_name, op.eligibility, op.description],
      q
    );
    return typeOk && qOk;
  });
}

export async function getOpportunityBySlug(slug) {
  const items = await getOpportunities();
  return items.find((o) => o.slug === slug) || null;
}

/* =========================== BLOGGERS & ARTICLES =========================== */
export async function getArticles({ q = "", category = "All", authorUsername = "" } = {}) {
  const items = await fetchOrFallback("blog_articles", SEED_ARTICLES, {
    eq: { status: "published" },
    orderBy: "published_at",
  });
  return items.filter((art) => {
    const catOk = category === "All" || art.category === category;
    const authorOk = !authorUsername || art.author_username === authorUsername;
    const qOk = matchesQuery(
      [art.title, art.category, art.author_name, art.excerpt],
      q
    );
    return catOk && authorOk && qOk;
  });
}

export async function getArticleBySlug(slug) {
  const items = await getArticles();
  const article = items.find((a) => a.slug === slug) || null;
  if (!article) return { article: null, moreArticles: [] };
  const moreArticles = items.filter((a) => a.slug !== slug).slice(0, 2);
  return { article, moreArticles };
}

export async function getBloggers() {
  const people = await getPeople();
  return people.filter((p) => p.is_verified_blogger || p.role === "Blogger");
}

/* =========================== LOST & FOUND =========================== */
export async function getLostFoundItems({
  q = "",
  status = "All",
  location = "All Locations",
} = {}) {
  const items = await fetchOrFallback("lost_and_found_items", SEED_LOST_FOUND, {
    eq: { status: "published" },
  });
  return items.filter((lf) => {
    const stOk = status === "All" || lf.item_status === status;
    const locOk = matchesLocation(lf.campus_location, location);
    const qOk = matchesQuery([lf.title, lf.area_detail, lf.description], q);
    return stOk && locOk && qOk;
  });
}

export async function getLostFoundBySlug(slug) {
  const items = await getLostFoundItems();
  return items.find((l) => l.slug === slug || l.id === slug) || null;
}

/* =========================== FOOD & BUSINESSES =========================== */
export async function getBusinesses({
  q = "",
  type = "All",
  location = "All Locations",
} = {}) {
  const items = await fetchOrFallback("businesses", SEED_BUSINESSES, {
    eq: { status: "published" },
  });
  return items.filter((b) => {
    const typeOk = type === "All" || b.business_type === type;
    const locOk = matchesLocation(b.campus_location, location);
    const qOk = matchesQuery(
      [b.name, b.business_type, b.specialty, b.address, b.description],
      q
    );
    return typeOk && locOk && qOk;
  });
}

export async function getBusinessBySlug(slug) {
  const items = await getBusinesses();
  return items.find((b) => b.slug === slug) || null;
}
