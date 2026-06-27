import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { categories, getArticlePath } from "@/data/site";
import { absolute } from "@/lib/sitemap";

// Static markdown sibling for every article: the HTML page at
// /dau-tu/co-phieu/etf-la-gi/ also gets /dau-tu/co-phieu/etf-la-gi.md serving
// the clean source markdown. Agents can fetch the .md URL directly, and nginx
// can serve it on the canonical URL via Accept: text/markdown negotiation.

// Base-free path for an article (the catch-all param must not include `base`,
// Astro prepends it at build). e.g. "dau-tu/co-phieu/etf-la-gi".
const slugFor = (article: CollectionEntry<"articles">) => {
  const category = categories.find((c) => c.slug === article.data.category);
  const path = `${category?.path ?? "/"}${article.slug}`;
  return path.replace(/^\//, "");
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection("articles");
  return articles.map((article) => ({
    params: { slug: slugFor(article) },
    props: { article },
  }));
};

const yamlEscape = (value: string) => `"${value.replace(/"/g, '\\"')}"`;

export const GET: APIRoute = ({ props, site }) => {
  const article = props.article as CollectionEntry<"articles">;
  const { title, description, updatedDate } = article.data;

  // Minimal, predictable frontmatter pointing back at the canonical HTML page.
  const frontmatter = [
    "---",
    `title: ${yamlEscape(title)}`,
    `description: ${yamlEscape(description)}`,
    `url: ${absolute(site, getArticlePath(article))}`,
    `updated: ${updatedDate.toISOString().slice(0, 10)}`,
    "---",
    "",
  ].join("\n");

  // `article.body` is the raw, unrendered markdown source — no lossy HTML round-trip.
  return new Response(frontmatter + article.body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
