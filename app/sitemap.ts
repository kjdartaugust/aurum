import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/products",
    "/privacy",
    "/terms",
    "/refund",
    "/compliance",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/products" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.4,
  }));
}
