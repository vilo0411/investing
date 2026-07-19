import type { APIRoute } from "astro";
import { url } from "@/data/site";
import { author } from "@/data/authors";
import { absolute, urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";

// Homepage, policy/static pages, and author profiles.
// Excludes utility/legacy routes (/api, /preview, /kien-thuc, redirected roots).
export const GET: APIRoute = ({ site }) => {
  const paths = [
    "/",
    "/about/",
    "/contact/",
    "/editorial-policy/",
    "/corrections-policy/",
    "/sources-policy/",
    "/disclaimer/",
    "/so-do-trang/",
    "/search/",
    `/author/${author.slug}/`,
  ];

  const urls: SitemapUrl[] = paths.map((path) => ({
    loc: absolute(site, url(path)),
  }));

  return xmlResponse(urlsetXml(urls));
};
