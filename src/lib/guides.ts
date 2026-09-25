export type Guide = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
};

export const guides: Guide[] = [
  {
    slug: "move-out-cleaning-checklist-windermere",
    title: "Move-Out Cleaning Checklist for Windermere, FL Homes (2026)",
    description:
      "Room-by-room Windermere move-out cleaning checklist for deposit photos—kitchens, baths, appliances, garage, and HOA expectations. Book Windermere Cleaning for empty-home resets.",
    datePublished: "2026-09-25",
    dateModified: "2026-09-25",
    keywords: [
      "move-out cleaning checklist Windermere FL",
      "Windermere move-out cleaning",
      "deposit cleaning Windermere",
      "move-in cleaning Dr. Phillips",
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
