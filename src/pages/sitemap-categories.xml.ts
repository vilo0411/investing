import type { APIRoute } from "astro";
import { categories, getCategoryPath, url } from "@/data/site";
import { absolute, urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";

// Section landings + every category listing page.
export const GET: APIRoute = ({ site }) => {
  const sections = ["/dau-tu/", "/phan-tich/"];

  const urls: SitemapUrl[] = [
    ...sections.map((path) => ({ loc: absolute(site, url(path)) })),
    ...categories.map((category) => ({
      loc: absolute(site, getCategoryPath(category)),
    })),
  ];

  return xmlResponse(urlsetXml(urls));
};
