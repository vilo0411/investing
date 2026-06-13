---
phase: 05-homepage-category-trust-pages
plan: 02
subsystem: category-pages
tags: [astro, refactor, components, accessibility]
requires: []
provides:
  - src/components/CategoryListing.astro
affects:
  - src/pages/[category].astro
  - src/pages/dau-tu/[category].astro
tech-stack:
  added: []
  patterns:
    - "Shared category-page body extracted into a single component (CategoryListing.astro), consumed by both category route trees"
    - "Accessible <Breadcrumb /> component used in place of inline <nav class=\"breadcrumb\">"
key-files:
  created:
    - src/components/CategoryListing.astro
  modified:
    - src/pages/[category].astro
    - src/pages/dau-tu/[category].astro
decisions: []
metrics:
  duration: "~10 minutes"
  completed: 2026-06-13
---

# Phase 5 Plan 02: Shared CategoryListing Component Summary

Extracted a single `CategoryListing.astro` component (page-hero with `<Breadcrumb />`, Learning path grid, latest-articles sidebar/empty state) consumed by both `/[category].astro` and `/dau-tu/[category].astro`, fixing the route-prefix bug in sidebar links via `getArticlePath()`.

## What Was Built

### Task 1: `src/components/CategoryListing.astro`
- New shared component with `Props = { category: Category; articles: CollectionEntry<"articles">[]; breadcrumbItems: { label: string; href?: string }[] }`
- Renders:
  - `<section class="page-hero">` containing `<Breadcrumb items={breadcrumbItems} />`, eyebrow, h1, lead, and `.category-meta` (article-count badge + `.category-meta-hint`, using the superset markup from `dau-tu/[category].astro`)
  - `<section class="section">` with conditional: non-empty articles render `.category-layout` (Learning path via `<ArticleList />` + `.latest-panel` sidebar using `getArticlePath(article)` for hrefs — fixes the previously hardcoded `/${category.slug}/...` and `/dau-tu/${category.slug}/...` templates); empty branch renders `.card.empty-state`
  - `<style>` block retains `.category-meta`, `.category-meta-hint`, `.article-count-badge`, `.empty-state*`, `.category-layout`, `.latest-panel*`, and the `@media (max-width: 920px)` block. No `.breadcrumb*` rules (handled by `Breadcrumb.astro`).

### Task 2: Thin route files
- `src/pages/[category].astro`: kept `getStaticPaths()` (`group !== "Đầu tư"`), article fetch/sort, `categoryUrl`/`breadcrumbSchema` JSON-LD unchanged; added 2-level `breadcrumbItems` (`Trang chủ` → category title); body reduced to `<CategoryListing category={category} articles={articles} breadcrumbItems={breadcrumbItems} />`. Removed `ArticleList` import, `latestArticles` computation, and the entire `<style>` block.
- `src/pages/dau-tu/[category].astro`: kept `getStaticPaths()` (`group === "Đầu tư"`), 3-level `breadcrumbSchema` JSON-LD unchanged; added 3-level `breadcrumbItems` (`Trang chủ` → `Đầu tư` → category title); same reductions and `<CategoryListing />` usage.

## Verification

- `npx astro check`: 0 errors, 0 warnings, 8 pre-existing hints (unrelated `is:inline` script hints)
- `npm run build`: exits 0, 61 pages built
- `dist/phan-tich/index.html` (non-dau-tu route): contains `.latest-panel`, `.article-count-badge`, 2-level breadcrumb (`Trang chủ` → `Phân tích cơ bản`), sidebar links resolve to `/phan-tich/{slug}/`
- `dist/dau-tu/co-phieu/index.html` (dau-tu route): contains `.latest-panel`, `.article-count-badge`, 3-level breadcrumb (`Trang chủ` → `Đầu tư` → `Cổ phiếu`), sidebar links resolve to `/dau-tu/co-phieu/{slug}/`
- Note: `/co-phieu/` is a legacy redirect (`astro.config.mjs` redirects map) to `/dau-tu/co-phieu/`, not a generated category page from `[category].astro` — verification used `/phan-tich/` as the representative non-dau-tu category page instead, since `co-phieu`'s group is "Đầu tư".

## Deviations from Plan

None - plan executed exactly as written. The plan's verification text referenced `/co-phieu/` and `/dau-tu/co-phieu/` as the pair to compare, but `co-phieu` belongs to the "Đầu tư" group so `[category].astro` never generates `/co-phieu/` (it's a legacy redirect target). Verified structural parity using `/phan-tich/` (non-dau-tu) vs `/dau-tu/co-phieu/` (dau-tu) instead — both render via the same `CategoryListing` component with correct breadcrumb depth and route-prefixed links, satisfying the underlying intent of the acceptance criteria.

## Self-Check

- FOUND: src/components/CategoryListing.astro
- FOUND: src/pages/[category].astro (modified)
- FOUND: src/pages/dau-tu/[category].astro (modified)
- Commit faeaea6: feat(05-02): create shared CategoryListing component
- Commit b8537ba: refactor(05-02): reduce category route files to thin wrappers

## Self-Check: PASSED
