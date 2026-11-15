import type { MetadataRoute } from "next";
import {
  allLessons,
  articles,
  events,
  instructors,
  solutions,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const paths = [
  "/",
  "/courses",
  "/learn",
  "/articles",
  "/events",
  "/workshops",
  "/solutions",
  "/membership",
  "/pricing",
  "/login",
  "/about",
  "/demands",
  "/skills",
  "/platform",
  "/enterprise",
  "/extension",
  "/developers",
  "/affiliate",
  "/shop",
  "/shop/redeem",
  "/dashboard",
  "/c",
  "/c/agents",
  "/c/studio",
  "/c/files",
  "/c/learn",
  "/c/profile",
  "/profile/affiliate",
  "/profile/wallet",
  "/profile/redeem",
  "/profile/membership",
  "/group-buys/demo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-15");
  const urls = [
    ...paths,
    ...allLessons().map(({ lesson }) => `/courses/${lesson.slug}`),
    ...allLessons().map(({ lesson }) => `/c/learn/${lesson.slug}`),
    ...articles.map((article) => `/articles/${article.slug}`),
    ...events.map((event) => `/events/${event.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...instructors.map((person) => `/instructors/${person.slug}`),
    ...["terms", "privacy", "credits", "developer"].map((slug) => `/legal/${slug}`),
  ];
  return urls.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));
}
