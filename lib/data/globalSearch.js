import {
  getMarketplaceListings,
  getJobs,
  getEvents,
  getPeople,
  getCommunities,
  getServices,
  getAccommodations,
  getOpportunities,
  getArticles,
  getLostFoundItems,
  getBusinesses,
} from "@/lib/data/publicQueries";

export async function runGlobalSearch({
  q = "",
  location = "All Locations",
  category = "all",
} = {}) {
  const [
    marketplace,
    jobs,
    events,
    people,
    communities,
    services,
    accommodation,
    opportunities,
    articles,
    lostFound,
    businesses,
  ] = await Promise.all([
    getMarketplaceListings({ q, location }),
    getJobs({ q, location }),
    getEvents({ q, location }),
    getPeople({ q, location }),
    getCommunities({ q }),
    getServices({ q, location }),
    getAccommodations({ q, location }),
    getOpportunities({ q }),
    getArticles({ q }),
    getLostFoundItems({ q, location }),
    getBusinesses({ q, location }),
  ]);

  const groups = [
    { key: "marketplace", label: "Marketplace", href: "/marketplace", items: marketplace },
    { key: "jobs", label: "Jobs", href: "/jobs", items: jobs },
    { key: "events", label: "Events", href: "/events", items: events },
    { key: "services", label: "Services", href: "/services", items: services },
    { key: "accommodation", label: "Accommodation", href: "/accommodation", items: accommodation },
    { key: "opportunities", label: "Opportunities", href: "/opportunities", items: opportunities },
    { key: "articles", label: "Articles & Bloggers", href: "/bloggers", items: articles },
    { key: "businesses", label: "Food & Businesses", href: "/food-and-businesses", items: businesses },
    { key: "people", label: "People", href: "/people", items: people },
    { key: "communities", label: "Communities", href: "/communities", items: communities },
    { key: "lost-and-found", label: "Lost & Found", href: "/lost-and-found", items: lostFound },
  ];

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);
  const filteredGroups =
    category === "all" ? groups : groups.filter((g) => g.key === category);

  return {
    groups,
    filteredGroups,
    totalCount,
  };
}
