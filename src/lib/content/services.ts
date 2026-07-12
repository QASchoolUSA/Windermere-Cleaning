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
    headline: "Estate-level house cleaning in Windermere",
    summary:
      "Recurring and one-time house cleaning tailored to luxury Windermere residences—kitchens, baths, living spaces, and quiet attention to detail.",
    description:
      "Windermere Cleaning provides professional house cleaning for single-family homes and estates in Windermere, FL. Our teams follow a meticulous checklist designed for high-end finishes: stone and wood surfaces, designer fixtures, and open living spaces. Choose weekly, bi-weekly, monthly, or one-time service.",
    image: "/images/house-cleaning.jpg",
    imageAlt:
      "Bright luxury Windermere FL home kitchen ready for professional house cleaning",
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
          "House cleaning in Windermere typically starts based on bedrooms, bathrooms, and square footage. Use our free quote calculator for an instant estimate; final pricing is confirmed when you book.",
      },
      {
        question: "Do you clean luxury and estate homes?",
        answer:
          "Yes. We specialize in Windermere and nearby estate communities, with discreet scheduling and care for premium finishes.",
      },
    ],
  },
  {
    slug: "apartment-cleaning",
    name: "Apartment Cleaning",
    shortName: "Apartment",
    headline: "Precise apartment cleaning, condo-ready",
    summary:
      "Efficient, thorough apartment and condo cleaning for Windermere-area residences—ideal for busy professionals and seasonal homes.",
    description:
      "Apartment cleaning from Windermere Cleaning covers condos, townhomes, and apartment residences near Windermere, FL. We work efficiently in compact footprints without sacrificing detail—kitchens, baths, floors, and living areas left hotel-fresh.",
    image: "/images/apartment-cleaning.jpg",
    imageAlt:
      "Modern apartment living space prepared for professional apartment cleaning near Windermere FL",
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
          "Yes. Share gate codes, parking instructions, and quiet hours when you book so our team arrives prepared and discreet.",
      },
    ],
  },
  {
    slug: "move-out-move-in-cleaning",
    name: "Move Out / Move In Cleaning",
    shortName: "Move-In / Out",
    headline: "Move-ready homes, deposit-minded detail",
    summary:
      "Thorough move-out and move-in cleaning so Windermere properties show pristine—empty cabinets, appliances, baseboards, and floors.",
    description:
      "Our move-out and move-in cleaning prepares Windermere homes and apartments for new occupants or landlord walkthroughs. We focus on empty spaces: inside cabinets, appliances, closets, baseboards, and corners that everyday cleaning skips.",
    image: "/images/move-in-out.jpg",
    imageAlt:
      "Empty bright residential room prepared for move-out move-in cleaning in Windermere FL",
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
          "Yes—empty or nearly empty homes allow us to clean cabinets, closets, and floors thoroughly. Share your keys or access plan when booking.",
      },
    ],
  },
  {
    slug: "post-construction-cleaning",
    name: "Post Construction Cleaning",
    shortName: "Post-Construction",
    headline: "From job-site dust to show-ready",
    summary:
      "Post-construction and renovation cleaning that removes fine dust, adhesive residue, and debris so Windermere projects can be lived in or listed.",
    description:
      "Post-construction cleaning in Windermere, FL addresses the fine dust and residue left after renovations and new builds. We clean surfaces, fixtures, floors, and glass to a move-in or listing standard after your contractors finish.",
    image: "/images/post-construction.jpg",
    imageAlt:
      "Renovated interior space ready for post-construction cleaning in Windermere Florida",
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
          "Book after major construction work is complete and debris is removed. Tell us if a rough clean already happened so we can scope a final detail clean.",
      },
    ],
  },
  {
    slug: "deep-cleaning",
    name: "Deep Cleaning",
    shortName: "Deep Clean",
    headline: "A reset for overlooked details",
    summary:
      "Deep cleaning for Windermere homes that need more than maintenance—baseboards, vents, grout-adjacent detail, and appliance exteriors.",
    description:
      "Deep cleaning goes beyond a standard visit. Windermere Cleaning focuses on buildup areas: baseboards, light fixtures within reach, vents, bathroom detail, and kitchen surfaces. Ideal seasonally, before guests, or after a long gap between cleans.",
    image: "/images/deep-cleaning.jpg",
    imageAlt:
      "Pristine modern kitchen after a professional deep cleaning in a Windermere FL home",
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
          "Deep cleaning adds time and focus for buildup areas—baseboards, vents, detailed bathrooms, and kitchens—while regular visits maintain an already clean home.",
      },
    ],
  },
  {
    slug: "event-cleaning",
    name: "Cleaning After Events / Celebrations",
    shortName: "After Events",
    headline: "After the celebration, calm restored",
    summary:
      "Post-event and celebration cleaning for Windermere gatherings—living spaces reset, kitchens cleared, and homes ready for the next morning.",
    description:
      "Hosting in Windermere should end with ease. Our after-event cleaning resets living rooms, kitchens, dining areas, and baths after parties, holidays, and celebrations so you wake up to order—not leftovers and clutter.",
    image: "/images/event-cleaning.jpg",
    imageAlt:
      "Elegant living and dining space prepared for post-event cleaning in Windermere FL",
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
          "Often yes—share your event end time when you request a quote. Same-night and next-morning windows are both available based on schedule.",
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
      "Use our online quote calculator to select your service, property details, and add-ons. You’ll see an estimated quote instantly, then you can book if you’re ready.",
  },
  {
    question: "Can I book cleaning online after getting a quote?",
    answer:
      "Yes. After your estimate, complete the booking form with your preferred date and address. Your request is sent to our booking system for confirmation.",
  },
  {
    question: "What cleaning services do you offer?",
    answer:
      "We offer house cleaning, apartment cleaning, move-out and move-in cleaning, post-construction cleaning, deep cleaning, and cleaning after events or celebrations.",
  },
];
