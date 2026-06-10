# Coding Conventions

**Analysis Date:** 2026-06-10

## Naming Patterns

**Files:**
- Astro components/layouts: PascalCase, `.astro` extension — `src/components/ArticleList.astro`, `src/layouts/BaseLayout.astro`
- Pages: lowercase, kebab-case, dynamic route params in brackets — `src/pages/[category]/[slug].astro`, `src/pages/dau-tu/[category]/[slug].astro`
- Data/utility modules: lowercase, `.ts` — `src/data/site.ts`, `src/content.config.ts`
- Content articles: kebab-case slugs in Vietnamese, descriptive of the topic question — `src/content/articles/etf-la-gi.md`, `roa-la-gi.md`, `warren-buffett.md`

**Functions:**
- camelCase, descriptive verb-noun — `getCategoryPath`, `getArticlePath` (`src/data/site.ts`)

**Variables:**
- camelCase for values/arrays — `categoryMeta`, `investCategories`, `phanTichCategories`
- Constants exported in camelCase even for config-like objects — `export const site = {...}`, `export const categories = [...]`

**Types:**
- PascalCase, derived via `typeof` from data arrays — `export type Category = (typeof categories)[number];` (`src/data/site.ts:113`)
- Astro Props interfaces named `Props` inside each component frontmatter — `interface Props { articles: CollectionEntry<"articles">[]; }` (`src/components/ArticleList.astro:5`)

## Code Style

**Formatting:**
- No Prettier/ESLint config present in repo. Formatting follows Astro defaults (2-space indentation, double quotes for strings, trailing commas in multiline objects/arrays).
- TypeScript strict mode enabled via `tsconfig.json` extending `astro/tsconfigs/strict`.

**Linting:**
- No ESLint config detected. Type-checking enforced at build time via `astro check` (part of `npm run build`).

**Path Aliases:**
- `@/*` maps to `src/*` (`tsconfig.json`) — used as `import { site } from "@/data/site"`, `import ArticleLayout from "@/layouts/ArticleLayout.astro"`.

## Import Organization

**Order observed in `.astro` frontmatter:**
1. Astro/framework imports — `import { SEO } from "astro-seo"`, `import { getCollection, render } from "astro:content"`
2. Local data/types — `import { categories, site } from "@/data/site"`
3. Local components/layouts — `import ArticleLayout from "@/layouts/ArticleLayout.astro"`
4. Stylesheets last — `import "@/styles/global.css"`

## Astro Component Structure

**Pattern (consistent across all `.astro` files):**
```astro
---
// 1. Imports
import type { CollectionEntry } from "astro:content";
import { categoryMeta, getArticlePath } from "@/data/site";

// 2. Props interface
interface Props {
  articles: CollectionEntry<"articles">[];
}

// 3. Destructure props
const { articles } = Astro.props;

// 4. Derived/computed values
---

<!-- 5. Template markup -->
<div class="card-grid">
  {articles.map((article) => { ... })}
</div>

<!-- 6. Scoped <style> block at end of file -->
<style> ... </style>
```

## Dynamic Routes (`getStaticPaths`)

**Pattern** (`src/pages/[category]/[slug].astro`):
```astro
export async function getStaticPaths() {
  const rootCategorySlugs = categories
    .filter((category) => category.group !== "Đầu tư")
    .map((category) => category.slug);
  const articles = await getCollection("articles");
  return articles
    .filter((entry) => rootCategorySlugs.includes(entry.data.category))
    .map((entry) => ({
      params: { category: entry.data.category, slug: entry.slug },
      props: { entry },
    }));
}
```
- Filter `categories` (from `src/data/site.ts`) to determine which articles belong on which route tree.
- Always pass the full `entry` as `props`, then `await render(entry)` to get `Content` and `headings`.

## Content Collections (Astro Content Layer)

**Schema location:** `src/content.config.ts` — single `articles` collection, `type: "content"`, Zod schema.

**Required frontmatter fields** (enforced by Zod schema):
```yaml
title: string
description: string
category: string
publishDate: "YYYY-MM-DD"   # z.coerce.date()
updatedDate: "YYYY-MM-DD"   # z.coerce.date()
readingTime: string          # e.g. "4 phút đọc"
featured: boolean (default false)
order: number (default 100)
tags: string[] (default [])
faq: { question, answer }[] (default [])
sources: string[] (default [])
```
- New articles MUST conform to this schema or `astro check`/build will fail.
- Articles live in `src/content/articles/*.md`, written in Vietnamese with sections: `## Key takeaways`, body sections (H2), `## FAQ` with `### Question` subsections matching `faq` frontmatter.

## Data/Config Module Pattern (`src/data/site.ts`)

- Single source of truth for site-wide config: `site` (brand info), `navigation`, `categories`, `categoryMeta` (lookup map keyed by category slug).
- Helper functions co-located with the data they operate on: `getCategoryPath(category)`, `getArticlePath(article)`.
- Lookup maps typed as `Record<string, {...}>` keyed by slug — follow this pattern for any new category-keyed metadata (e.g., `categoryMeta`).

## Error Handling

**Patterns:**
- Defensive fallback via nullish coalescing for missing lookups:
  ```ts
  const meta = categoryMeta[article.data.category] ?? { abbr: "?", label: article.data.category, gradientClass: "thumb-stocks" };
  ```
  ```ts
  return categoryMeta?.path ?? "/";
  ```
- No try/catch blocks observed — content is statically validated at build time via Zod schema (`src/content.config.ts`) and Astro's type checker (`astro check`).
- Filter arrays with `.filter((x): x is NonNullable<typeof x> => x !== null)` to type-narrow optional values (`src/layouts/BaseLayout.astro`).

## Logging

**Framework:** None. No console logging conventions found (static site, build-time generation only).

## Comments

**When to Comment:**
- Section-divider comments in `.astro` frontmatter and templates to label structural blocks, e.g. `<!-- Organization + WebSite schema (all pages) -->`, `<!-- Google Fonts: DM Serif Display + DM Sans -->` (`src/layouts/BaseLayout.astro`).
- CSS sections commented by purpose, e.g. `/* Gradient thumbnails */` (`src/components/ArticleList.astro:66`).

**JSDoc/TSDoc:** Not used.

## Function Design

**Size:** Small, single-purpose helper functions (1-3 lines) — `getCategoryPath`, `getArticlePath`.

**Parameters:** Accept union types where flexible input is useful, e.g. `getCategoryPath = (category: Category | string) => {...}`.

**Return Values:** Always return a usable default (string path `"/"`, fallback object) rather than `undefined`/`null`.

## Module Design

**Exports:** Named exports only (`export const`, `export type`, `export function`) — no default exports for data modules.

**Barrel Files:** Not used. Each module imported directly by path via `@/` alias.

## Styling Conventions

- All component-level styles live in scoped `<style>` blocks at the bottom of `.astro` files.
- Global design tokens (CSS custom properties) defined in `src/styles/global.css` and referenced via `var(--brand)`, `var(--surface)`, `var(--line)`, `var(--muted)`, `var(--radius-lg)`, `var(--transition)`, `var(--font-serif)`, etc.
- Responsive breakpoints via `@media (max-width: 900px)` and `@media (max-width: 580px)`, mobile-first reduction of grid columns (3 → 2 → 1).
- Category-specific color/gradient classes follow `thumb-{category-slug}` and `tag-{category-slug}` naming, defined per category in `categoryMeta` (`src/data/site.ts`) and styled in `ArticleList.astro`.

---

*Convention analysis: 2026-06-10*
