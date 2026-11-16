import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const siteUrl = SITE_URL;
export const siteName = SITE_NAME;

export function absoluteUrl(path: string) {
  if (path === "/") return `${siteUrl}/`;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title}｜${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale: "zh_CN",
      type,
    },
  };
}
