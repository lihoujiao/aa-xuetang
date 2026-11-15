import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const allow = { allow: "/" as const };
  return {
    rules: [
      { userAgent: "*", ...allow },
      { userAgent: "GPTBot", ...allow },
      { userAgent: "OAI-SearchBot", ...allow },
      { userAgent: "ClaudeBot", ...allow },
      { userAgent: "PerplexityBot", ...allow },
      { userAgent: "Google-Extended", ...allow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
