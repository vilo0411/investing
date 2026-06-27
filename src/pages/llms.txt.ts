import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { site as siteInfo, categories, getArticlePath } from "@/data/site";
import { absolute } from "@/lib/sitemap";

// /llms.txt — a curated, agent-friendly markdown index of the site.
// Follows the llmstxt.org convention: H1 title, a blockquote summary, then
// one H2 section per category listing every article as `- [title](url): desc`.
export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection("articles");

  // Group articles by their category slug.
  const byCategory = new Map<string, CollectionEntry<"articles">[]>();
  for (const article of articles) {
    const list = byCategory.get(article.data.category) ?? [];
    list.push(article);
    byCategory.set(article.data.category, list);
  }

  // Lowest `order` first, then alphabetical by title (Vietnamese locale).
  const sortArticles = (list: CollectionEntry<"articles">[]) =>
    list.sort(
      (a, b) =>
        a.data.order - b.data.order ||
        a.data.title.localeCompare(b.data.title, "vi"),
    );

  // One list entry per article. The primary link is the canonical HTML page;
  // a `.md` link to the clean markdown source is appended for agents.
  const entryLine = (article: CollectionEntry<"articles">) => {
    const htmlLoc = absolute(site, getArticlePath(article));
    const mdLoc = `${htmlLoc.replace(/\/$/, "")}.md`;
    return `- [${article.data.title}](${htmlLoc}): ${article.data.description} ([Markdown](${mdLoc}))`;
  };

  const lines: string[] = [];
  lines.push(`# ${siteInfo.name}`);
  lines.push("");
  lines.push(`> ${siteInfo.description}`);
  lines.push("");
  lines.push(siteInfo.disclosure);
  lines.push("");
  lines.push(
    "Mỗi bài có bản markdown sạch: thêm `.md` vào URL, hoặc gửi header `Accept: text/markdown`.",
  );
  lines.push("");

  // One section per category, in the canonical taxonomy order.
  const rendered = new Set<string>();
  for (const category of categories) {
    const list = byCategory.get(category.slug);
    if (!list || list.length === 0) continue;
    rendered.add(category.slug);

    lines.push(`## ${category.title}`);
    lines.push("");
    for (const article of sortArticles(list)) {
      lines.push(entryLine(article));
    }
    lines.push("");
  }

  // Safety net: surface any article whose category is not in the taxonomy so it
  // is never silently dropped from the index.
  const orphans = articles.filter((a) => !rendered.has(a.data.category));
  if (orphans.length > 0) {
    lines.push("## Khác");
    lines.push("");
    for (const article of sortArticles(orphans)) {
      lines.push(entryLine(article));
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
