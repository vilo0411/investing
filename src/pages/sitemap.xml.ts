import type { APIRoute } from "astro";
import { url } from "@/data/site";
import { absolute, sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

// Sitemap index — points to the per-section child sitemaps.
export const GET: APIRoute = ({ site }) => {
  const children = [
    "/sitemap-articles.xml",
    "/sitemap-categories.xml",
    "/sitemap-pages.xml",
  ].map((path) => absolute(site, url(path)));

  return xmlResponse(sitemapIndexXml(children));
};
