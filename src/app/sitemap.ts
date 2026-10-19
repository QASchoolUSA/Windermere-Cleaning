import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { guides } from "@/lib/guides";
import { siteConfig } from "@/lib/site";

// Stable content release date for static pages. Update when content changes.
const CONTENT_LAST_MODIFIED = new Date("2026-09-25T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/services",
    "/guides",
    "/service-area",
    "/about",
    "/book",
  ].map((path) => ({
    url: path ? `${base}${path}` : base,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/book" ? 0.9 : 0.8,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const guideRoutes = guides.map((g) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: new Date(`${g.dateModified}T00:00:00.000Z`),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...serviceRoutes, ...guideRoutes];
}
