import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { categoryMeta, getArticlePath } from "@/data/site";

export const GET: APIRoute = async () => {
  const articles = await getCollection("articles");

  const index = articles
    .sort((a, b) => b.data.updatedDate.getTime() - a.data.updatedDate.getTime())
    .map((article) => {
      const meta = categoryMeta[article.data.category] ?? {
        label: article.data.category,
        abbr: "?",
        gradientClass: "thumb-stocks",
      };

      return {
        title: article.data.title,
        description: article.data.description,
        category: article.data.category,
        categoryLabel: meta.label,
        readingTime: article.data.readingTime,
        href: getArticlePath(article),
        tags: article.data.tags,
        // searchable text — pre-normalized
        text: [
          article.data.title,
          article.data.description,
          meta.label,
          ...article.data.tags,
        ]
          .join(" ")
          .toLowerCase(),
      };
    });

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
