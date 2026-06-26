import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getArticlePath } from "@/data/site";
import { absolute, urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";

// All published article detail pages.
export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection("articles");

  const urls: SitemapUrl[] = articles.map((article) => ({
    loc: absolute(site, getArticlePath(article)),
    lastmod: article.data.updatedDate.toISOString().slice(0, 10),
  }));

  return xmlResponse(urlsetXml(urls));
};
