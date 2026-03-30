/**
 * MetroFlex Events 2026 Configuration
 *
 * Central configuration for all 2026 NPC events including
 * venues, dates, ticket pricing, and registration URLs.
 */

export interface EventConfig {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  date: string;
  dateFormatted: string;
  year: number;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
  };
  tickets: {
    morning: number;
    evening: number;
    allDay: number;
    reserved?: number;
    kidsUnderFree: number;
  };
  urls: {
    ticketSpice: string;
    ticketSpicePageId: string;
    muscleware: string;
    vendorRegfox: string;
  };
  description: string;
  shortDescription: string;
  sanctioningBody: string;
  divisions: string[];
  featured: boolean;
}

export const EVENTS_2026: EventConfig[] = [
  {
    id: "better-bodies-classic-2026",
    slug: "better-bodies-classic-2026",
    name: "Better Bodies Classic",
    fullName: "NPC Better Bodies Classic 2026",
    date: "2026-04-11",
    dateFormatted: "April 11, 2026",
    year: 2026,
    venue: {
      name: "Dallas Market Hall",
      address: "2200 N Stemmons FWY",
      city: "Dallas",
      state: "TX",
      zip: "75207",
      fullAddress: "2200 N Stemmons FWY, Dallas, TX 75207",
    },
    tickets: {
      morning: 35,
      evening: 50,
      allDay: 75,
      reserved: 75,
      kidsUnderFree: 5,
    },
    urls: {
      ticketSpice: "https://metroflexevents.ticketspice.com/npc-better-bodies-classic-2026",
      ticketSpicePageId: "966056",
      muscleware: "https://www.muscleware.com/contests/2026-TXLG-CHAM/register",
      vendorRegfox: "https://metroflexevents.regfox.com/npc-better-bodies-classic-2026",
    },
    description: "The NPC Better Bodies Classic kicks off the 2026 Texas competition season at the iconic Dallas Market Hall. This national qualifier features all NPC divisions including bodybuilding, physique, bikini, figure, wellness, and classic physique. Compete where legends have taken the stage.",
    shortDescription: "National qualifier featuring all NPC divisions at Dallas Market Hall. Kick off the 2026 Texas competition season.",
    sanctioningBody: "NPC",
    divisions: [
      "Men's Bodybuilding",
      "Men's Physique",
      "Classic Physique",
      "Women's Bodybuilding",
      "Figure",
      "Bikini",
      "Wellness",
      "Women's Physique",
    ],
    featured: true,
  },
  {
    id: "ronnie-coleman-classic-2026",
    slug: "ronnie-coleman-classic-2026",
    name: "Ronnie Coleman Classic",
    fullName: "NPC Ronnie Coleman Classic 2026",
    date: "2026-05-16",
    dateFormatted: "May 16, 2026",
    year: 2026,
    venue: {
      name: "Round Up Inn",
      address: "3401 W Lancaster Ave",
      city: "Fort Worth",
      state: "TX",
      zip: "76107",
      fullAddress: "3401 W Lancaster Ave, Fort Worth, TX 76107",
    },
    tickets: {
      morning: 35,
      evening: 50,
      allDay: 75,
      reserved: 75,
      kidsUnderFree: 5,
    },
    urls: {
      ticketSpice: "https://metroflexevents.ticketspice.com/npc-ronnie-coleman-classic-2026",
      ticketSpicePageId: "966062",
      muscleware: "https://www.muscleware.com/contests/2026-RNCL-CLS/register",
      vendorRegfox: "https://metroflexevents.regfox.com/npc-ronnie-coleman-classic-2026-vendor",
    },
    description: "Named after the 8x Mr. Olympia himself, the NPC Ronnie Coleman Classic brings elite competition to Fort Worth's historic Round Up Inn. Experience the energy of one of Texas's most celebrated bodybuilding events with all NPC divisions represented.",
    shortDescription: "Named after the 8x Mr. Olympia. Elite NPC competition at Fort Worth's historic Round Up Inn.",
    sanctioningBody: "NPC",
    divisions: [
      "Men's Bodybuilding",
      "Men's Physique",
      "Classic Physique",
      "Women's Bodybuilding",
      "Figure",
      "Bikini",
      "Wellness",
      "Women's Physique",
    ],
    featured: false,
  },
  {
    id: "branch-warren-classic-2026",
    slug: "branch-warren-classic-2026",
    name: "Branch Warren Classic",
    fullName: "NPC Branch Warren Classic 2026",
    date: "2026-06-20",
    dateFormatted: "June 20, 2026",
    year: 2026,
    venue: {
      name: "George R. Brown Convention Center",
      address: "1001 Avenida De Las Americas",
      city: "Houston",
      state: "TX",
      zip: "77010",
      fullAddress: "1001 Avenida De Las Americas, Houston, TX 77010",
    },
    tickets: {
      morning: 35,
      evening: 50,
      allDay: 75,
      reserved: 75,
      kidsUnderFree: 5,
    },
    urls: {
      ticketSpice: "https://metroflexevents.ticketspice.com/npc-branch-warren-classic-2026",
      ticketSpicePageId: "966067",
      muscleware: "https://www.muscleware.com/contests/2026-BCHW-CLS/register",
      vendorRegfox: "https://metroflexevents.regfox.com/npc-branch-warren-classic-2026",
    },
    description: "The NPC Branch Warren Classic takes over Houston's world-class George R. Brown Convention Center. Named after IFBB Pro Branch Warren, this prestigious event draws top competitors from across Texas and beyond. All NPC divisions compete for national qualification.",
    shortDescription: "Prestigious national qualifier at Houston's George R. Brown Convention Center. Named after IFBB Pro Branch Warren.",
    sanctioningBody: "NPC",
    divisions: [
      "Men's Bodybuilding",
      "Men's Physique",
      "Classic Physique",
      "Women's Bodybuilding",
      "Figure",
      "Bikini",
      "Wellness",
      "Women's Physique",
    ],
    featured: false,
  },
  {
    id: "branch-warren-classic-denver-2026",
    slug: "branch-warren-classic-denver-2026",
    name: "Branch Warren Classic Denver",
    fullName: "NPC Branch Warren Classic Denver",
    date: "2026-07-01", // Placeholder date for sorting, display will override
    dateFormatted: "Coming 2026",
    year: 2026,
    venue: {
      name: "TBD",
      address: "",
      city: "Denver",
      state: "CO",
      zip: "",
      fullAddress: "Denver, Colorado",
    },
    tickets: {
      morning: 35,
      evening: 50,
      allDay: 75,
      reserved: 75,
      kidsUnderFree: 5,
    },
    urls: {
      ticketSpice: "#",
      ticketSpicePageId: "",
      muscleware: "#",
      vendorRegfox: "#",
    },
    description: "The legendary Branch Warren Classic expands to Colorado. Bringing elite level NPC competition to the Rocky Mountain region. Stay tuned for venue and date details.",
    shortDescription: "The legendary Branch Warren Classic expands to Colorado. Bringing elite level NPC competition to the Rocky Mountain region.",
    sanctioningBody: "NPC",
    divisions: [
      "Men's Bodybuilding",
      "Men's Physique",
      "Classic Physique",
      "Women's Bodybuilding",
      "Figure",
      "Bikini",
      "Wellness",
      "Women's Physique",
    ],
    featured: false,
  },
];

// Helper functions
export function getEventBySlug(slug: string): EventConfig | undefined {
  return EVENTS_2026.find(event => event.slug === slug);
}

export function getEventById(id: string): EventConfig | undefined {
  return EVENTS_2026.find(event => event.id === id);
}

export function getFeaturedEvent(): EventConfig | undefined {
  return EVENTS_2026.find(event => event.featured);
}

export function getUpcomingEvents(): EventConfig[] {
  const today = new Date();
  return EVENTS_2026.filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function formatTicketPrice(price: number): string {
  return `$${price.toFixed(0)}`;
}

// Ticket pricing display helper
export function getTicketPricingDisplay(event: EventConfig): string {
  return `Morning $${event.tickets.morning} | Evening $${event.tickets.evening} | All Day $${event.tickets.allDay}`;
}
