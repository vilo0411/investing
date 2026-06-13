---
phase: 05-homepage-category-trust-pages
reviewed: 2026-06-13T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - src/pages/index.astro
  - src/components/CategoryListing.astro
  - src/pages/[category].astro
  - src/pages/dau-tu/[category].astro
  - src/pages/about.astro
  - src/pages/disclaimer.astro
  - src/components/Disclaimer.astro
  - src/pages/editorial-policy.astro
findings:
  critical: 2
  warning: 2
  info: 2
  total: 6
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-06-13
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Reviewed the homepage, category listing routes, and trust pages (about, disclaimer, editorial policy). The overall structure follows existing conventions (categories/`getArticlePath`/`categoryMeta` from `src/data/site.ts`, scoped styles, BaseLayout usage). Two blockers were found: a broken primary CTA link (`/dau-tu/` has no corresponding static page or redirect) and a duplicate `<h1>` on the homepage (SEO/accessibility issue, particularly important for a YMYL site). Additional warnings cover a thumbnail-label inconsistency between the homepage featured card and `ArticleList`, and a content typo in `disclaimer.astro`.

## Critical Issues

### CR-01: Homepage primary CTA links to non-existent `/dau-tu/` route

**File:** `src/pages/index.astro:54` (and `src/pages/index.astro:32`)
**Issue:** The hero's primary call-to-action button links to `/dau-tu/`:
```astro
<a class="primary-action" href="/dau-tu/">Khám phá chủ đề</a>
```
and the first `topicGroups` entry also points to `/dau-tu/`:
```js
{ title: "Đầu tư", href: "/dau-tu/", description: "..." },
```

However, `src/pages/dau-tu/[category].astro` only generates routes for `/dau-tu/{category}/` (e.g. `/dau-tu/co-phieu/`). There is no `src/pages/dau-tu/index.astro`, and `astro.config.mjs` has no redirect entry for `/dau-tu/`. The only redirects defined are old flat category URLs → `/dau-tu/{category}/`, none of which is `/dau-tu/` itself.

This means the most prominent CTA on the homepage ("Khám phá chủ đề" — primary action) and the first card in the "Khám phá theo chủ đề" topic grid both resolve to a 404 in production.

**Fix:** Either:
1. Create `src/pages/dau-tu/index.astro` as a group landing page (listing the 5 "Đầu tư" categories), or
2. Point both links to an existing route, e.g. `/dau-tu/co-phieu/` (first category in the group) or a category overview that already exists.

```astro
<!-- Option 2 (minimal fix) -->
<a class="primary-action" href="/dau-tu/co-phieu/">Khám phá chủ đề</a>
```
```js
{ title: "Đầu tư", href: "/dau-tu/co-phieu/", description: "..." },
```

---

### CR-02: Duplicate `<h1>` elements on homepage

**File:** `src/pages/index.astro:49` and `src/pages/index.astro:157`
**Issue:** The homepage renders two `<h1>` elements:
```astro
<!-- line 49, hero section -->
<h1>Đầu tư dễ hiểu hơn.</h1>
```
```astro
<!-- line 157, featured article card -->
<h1 class="featured-title">{featured.data.title}</h1>
```
A page should have exactly one `<h1>` for both SEO and accessibility (screen-reader document outline). For a YMYL site where E-E-A-T/SEO is the explicit project goal (per CLAUDE.md), this is a meaningful regression — search engines and accessibility tools will see two competing top-level headings, and the featured article's title (which changes per article) effectively becomes a second page title.

**Fix:** Change the featured-card heading to `<h2>` (or `<h3>` if nested under an implicit `<h2>` section), keeping the same `featured-title` class/styles:
```astro
<h2 class="featured-title">{featured.data.title}</h2>
```

## Warnings

### WR-01: Featured-card thumbnail shows full category label instead of abbreviation, inconsistent with ArticleList

**File:** `src/pages/index.astro:144-149`
**Issue:** The featured-article thumbnail renders the full category `label` inside `.featured-thumb-label`:
```astro
const meta = categoryMeta[featured.data.category] ?? { gradientClass: "thumb-stocks", label: featured.data.category };
return (
  <a class="featured-card" href={getArticlePath(featured)}>
    <div class={`featured-thumb ${meta.gradientClass}`}>
      <span class="featured-thumb-label">{meta.label}</span>
    </div>
```
`.featured-thumb-label` uses `font-size: 2rem` (large serif text), the same visual pattern used by `ArticleList.astro`'s `.card-thumb-abbr`, which renders `meta.abbr` (short codes like "CP", "ETF", "KT") rather than the full label ("Cổ phiếu", "Phân tích kỹ thuật"). For a category like "Phân tích kỹ thuật" or "Quỹ đầu tư", a 2rem label rendered in a 16:7 thumbnail box risks overflow/wrapping and is visually inconsistent with every other thumbnail across the site (`ArticleList`, category listings, latest column all rely on `abbr`/gradient + small tag for the label).

**Fix:** Use `meta.abbr` for the large thumbnail glyph, and keep `meta.label` for the small `.article-tag` badge that's already rendered separately:
```astro
const meta = categoryMeta[featured.data.category] ?? { gradientClass: "thumb-stocks", label: featured.data.category, abbr: "?" };
...
<span class="featured-thumb-label">{meta.abbr}</span>
```

---

### WR-02: Typo / missing capitalization in disclaimer.astro content

**File:** `src/pages/disclaimer.astro:16`
**Issue:** Sentence runs together across a period without correct capitalization:
```
dành cho người mới bắt đầu tìm hiểu đầu tư. Nội dung tập trung vào kiến thức nền tảng. giúp người
đọc hiểu cách thị trường vận hành trước khi tự đưa ra quyết định.
```
"giúp người" follows a full stop but is not capitalized, producing a grammatically broken sentence ("...kiến thức nền tảng. giúp người đọc hiểu..."). This is a user-facing legal/disclosure page — clarity and polish matter for trust signals (E-E-A-T).

**Fix:** Replace the period with a comma (the intended sentence is a single clause), or capitalize "Giúp":
```
Nội dung tập trung vào kiến thức nền tảng, giúp người đọc hiểu cách thị trường vận hành
trước khi tự đưa ra quyết định.
```

## Info

### IN-01: Duplicated helper text in CategoryListing.astro

**File:** `src/components/CategoryListing.astro:31` and `:46`
**Issue:** The same hint text "Đọc theo thứ tự để xây dựng nền tảng vững chắc" is rendered twice on the page — once as `.category-meta-hint` in the hero, and again as the `.muted` description under the "Learning path" heading:
```astro
<!-- line 31 -->
{articles.length > 0 && (
  <span class="category-meta-hint">Đọc theo thứ tự để xây dựng nền tảng vững chắc</span>
)}
...
<!-- line 46 -->
<p class="muted">Đọc theo thứ tự để xây dựng nền tảng vững chắc.</p>
```
Not incorrect, but redundant copy that a reader sees twice in quick succession on the same page.

**Fix:** Either remove one occurrence, or differentiate the hero badge with a shorter label (e.g. "Theo lộ trình") and keep the full sentence under "Learning path".

---

### IN-02: IIFE pattern used inline in JSX for featured-card rendering

**File:** `src/pages/index.astro:143-163`
**Issue:** The featured article block uses an inline immediately-invoked arrow function inside the template to compute `meta` and return JSX:
```astro
{featured && (() => {
  const meta = categoryMeta[featured.data.category] ?? { gradientClass: "thumb-stocks", label: featured.data.category };
  return (
    <a class="featured-card" href={getArticlePath(featured)}>
      ...
    </a>
  );
})()}
```
This works but is harder to read than computing `featuredMeta` in the frontmatter script block (top of file), consistent with how `byCategory`/`latest`/`startHere` are already precomputed there.

**Fix:** Hoist the lookup into the frontmatter:
```js
const featuredMeta = featured ? (categoryMeta[featured.data.category] ?? { gradientClass: "thumb-stocks", label: featured.data.category, abbr: "?" }) : null;
```
and reference `featuredMeta` directly in the template without the IIFE wrapper.

---

_Reviewed: 2026-06-13_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
