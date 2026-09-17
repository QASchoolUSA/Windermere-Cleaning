export type ServiceSlug =
  | "house-cleaning"
  | "apartment-cleaning"
  | "move-out-move-in-cleaning"
  | "post-construction-cleaning"
  | "deep-cleaning"
  | "event-cleaning";

export type Service = {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  headline: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  includes: string[];
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "house-cleaning",
    name: "House Cleaning",
    shortName: "House",
    headline: "House cleaning for Windermere homes",
    summary:
      "Weekly or one-time house cleaning for Windermere residences—kitchens, baths, living spaces, and the quiet detail that keeps an estate feeling settled.",
    description:
      "We clean single-family homes and estates in Windermere, FL. Teams know how to treat stone, wood, and designer fixtures without rushing through open living spaces. Choose weekly, bi-weekly, monthly, or a one-time visit.",
    image: "/images/house-cleaning.jpg",
    imageAlt: "Bright kitchen in a Windermere home after cleaning",
    keywords: [
      "house cleaning Windermere FL",
      "home cleaning Windermere",
      "luxury house cleaning Orange County FL",
    ],
    includes: [
      "Kitchen surfaces, sinks, and appliance exteriors",
      "Bathrooms detailed including fixtures and glass",
      "Dusting of reachable surfaces and fixtures",
      "Floors vacuumed and mopped",
      "Beds made; trash emptied",
    ],
    faqs: [
      {
        question: "How much does house cleaning cost in Windermere, FL?",
        answer:
          "Price depends on bedrooms, bathrooms, and square footage. Use the free quote form for an estimate; we confirm the final total when you book.",
      },
      {
        question: "Do you clean luxury and estate homes?",
        answer:
          "Yes. Most of our work is in Windermere and nearby estate communities. We schedule discreetly and take care with premium finishes.",
      },
    ],
  },
  {
    slug: "apartment-cleaning",
    name: "Apartment Cleaning",
    shortName: "Apartment",
    headline: "Apartment and condo cleaning near Windermere",
    summary:
      "Thorough apartment and condo cleaning for Windermere-area residences—built for busy schedules and smaller footprints.",
    description:
      "We clean condos, townhomes, and apartments near Windermere, FL. Compact spaces get the same care as larger homes: kitchens, baths, floors, and living areas finished so the place feels ready when you walk in.",
    image: "/images/apartment-cleaning.jpg",
    imageAlt: "Living room in a condo near Windermere after cleaning",
    keywords: [
      "apartment cleaning Windermere FL",
      "condo cleaning Windermere",
      "apartment cleaners Orange County FL",
    ],
    includes: [
      "Full kitchen and bath detail",
      "Living areas dusted and floors finished",
      "Balcony door glass interiors as reachable",
      "Flexible scheduling for building access rules",
    ],
    faqs: [
      {
        question: "Can you clean apartments with building access rules?",
        answer:
          "Yes. Share gate codes, parking notes, and quiet hours when you book so the team arrives prepared and stays discreet.",
      },
    ],
  },
  {
    slug: "move-out-move-in-cleaning",
    name: "Move Out / Move In Cleaning",
    shortName: "Move-In / Out",
    headline: "Move-in and move-out cleaning in Windermere",
    summary:
      "Empty-home cleaning for Windermere moves—cabinets, appliances, baseboards, and floors so the property is ready for walkthroughs or new keys.",
    description:
      "Move-out and move-in cleaning prepares Windermere homes and apartments for new occupants or landlord walkthroughs. We focus on empty spaces: inside cabinets, appliances, closets, baseboards, and corners that regular visits skip.",
    image: "/images/move-in-out.jpg",
    imageAlt: "Empty room ready for move-out cleaning in Windermere",
    keywords: [
      "move out cleaning Windermere FL",
      "move in cleaning Windermere",
      "end of lease cleaning Orange County FL",
    ],
    includes: [
      "Inside cabinets, drawers, and closets",
      "Appliance interiors (oven, fridge, microwave)",
      "Baseboards, doors, and light switches",
      "Full floor care throughout",
    ],
    faqs: [
      {
        question: "Should the home be empty before move-out cleaning?",
        answer:
          "Yes—empty or nearly empty homes let us clean cabinets, closets, and floors properly. Share keys or access details when you book.",
      },
    ],
  },
  {
    slug: "post-construction-cleaning",
    name: "Post Construction Cleaning",
    shortName: "Post-Construction",
    headline: "Post-construction cleaning after Windermere renovations",
    summary:
      "Cleaning after renovations and new builds—fine dust, adhesive residue, and debris cleared so the home can be lived in or listed.",
    description:
      "After contractors finish in Windermere, FL, fine dust and residue linger on surfaces, fixtures, floors, and glass. We clean to a move-in or listing standard once the heavy construction work is done.",
    image: "/images/post-construction.jpg",
    imageAlt: "Renovated room ready for post-construction cleaning",
    keywords: [
      "post construction cleaning Windermere FL",
      "renovation cleaning Windermere",
      "construction cleanup Orange County FL",
    ],
    includes: [
      "Fine dust removal from surfaces and fixtures",
      "Window and glass detailing (as scoped)",
      "Floor care suited to new finishes",
      "Fixture and hardware wipe-down",
    ],
    faqs: [
      {
        question: "When should post-construction cleaning be scheduled?",
        answer:
          "Book after major construction is finished and debris is hauled out. Tell us if a rough clean already happened so we can plan a final detail pass.",
      },
    ],
  },
  {
    slug: "deep-cleaning",
    name: "Deep Cleaning",
    shortName: "Deep Clean",
    headline: "Deep cleaning when Windermere homes need a reset",
    summary:
      "A deeper visit for Windermere homes that need more than maintenance—baseboards, vents, bathroom detail, and kitchen buildup.",
    description:
      "Deep cleaning goes beyond a regular visit. We spend extra time on buildup: baseboards, reachable light fixtures, vents, bathrooms, and kitchen surfaces. Useful seasonally, before guests, or after a long gap between cleans.",
    image: "/images/deep-cleaning.jpg",
    imageAlt: "Kitchen after a deep clean in a Windermere home",
    keywords: [
      "deep cleaning Windermere FL",
      "deep clean house Windermere",
      "detailed home cleaning Orange County FL",
    ],
    includes: [
      "Extended kitchen and bath detail",
      "Baseboards and reachable trim",
      "Light fixtures and vents within reach",
      "Extra attention to buildup areas",
    ],
    faqs: [
      {
        question: "How is deep cleaning different from regular house cleaning?",
        answer:
          "Deep cleaning adds time for buildup—baseboards, vents, detailed bathrooms and kitchens. Regular visits keep an already clean home in good shape.",
      },
    ],
  },
  {
    slug: "event-cleaning",
    name: "Cleaning After Events / Celebrations",
    shortName: "After Events",
    headline: "After-event cleaning for Windermere gatherings",
    summary:
      "Post-party cleanup for Windermere homes—living spaces reset, kitchens cleared, and the house calm again by morning.",
    description:
      "Hosting should not end with a sink full of dishes. After parties, holidays, and celebrations we reset living rooms, kitchens, dining areas, and baths so you wake up to order instead of leftovers.",
    image: "/images/event-cleaning.jpg",
    imageAlt: "Dining room after post-event cleaning in Windermere",
    keywords: [
      "event cleaning Windermere FL",
      "party cleanup Windermere",
      "after party cleaning Orange County FL",
    ],
    includes: [
      "Kitchen reset and surface cleaning",
      "Living and dining area refresh",
      "Trash and recycling removal (as scoped)",
      "Bathrooms refreshed for guests or next day",
    ],
    faqs: [
      {
        question: "Can you clean the same night as our event?",
        answer:
          "Often yes—tell us when the event ends when you request a quote. Same-night and next-morning windows both work, depending on the calendar.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const homeFaqs = [
  {
    question: "What areas does Windermere Cleaning serve?",
    answer:
      "We serve Windermere, FL and nearby Orange County communities including Lake Butler, Bay Hill, Dr. Phillips, Winter Garden, Horizon West, and surrounding neighborhoods.",
  },
  {
    question: "How do I get a free cleaning quote?",
    answer:
      "Use the online quote form to pick your service, property details, and add-ons. You get an estimate right away, then you can book if you are ready.",
  },
  {
    question: "Can I book cleaning online after getting a quote?",
    answer:
      "Yes. After your estimate, fill in the booking form with your preferred date and address. We confirm the appointment once we review your request.",
  },
  {
    question: "What cleaning services do you offer?",
    answer:
      "We offer house cleaning, apartment cleaning, move-out and move-in cleaning, post-construction cleaning, deep cleaning, and cleaning after events or celebrations.",
  },
];
