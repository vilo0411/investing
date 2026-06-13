---
phase: 04-article-layout-wiring-author-profile-pages
plan: 02
subsystem: ui
tags: [astro, jsonld, schema-org, eeat, article-layout]

requires:
  - phase: 04-article-layout-wiring-author-profile-pages
    provides: "Plan 01 backfilled entry.data.keyTakeaways for all 21 articles"
provides:
  - "ArticleLayout.astro renders Breadcrumb -> header -> [ymyl-note] -> KeyTakeaways -> slot -> FAQ -> CitationBox -> editorial-review -> AuthorBox -> ShareBar -> RelatedArticles"
  - "articleSchema.author JSON-LD expanded to full Person object (jobTitle, description, knowsAbout, url -> /author/{slug}/, conditional sameAs) sourced from src/data/authors.ts"
  - "breadcrumbItems const for <Breadcrumb> component, dead .breadcrumb/.source-section CSS removed"
affects: [04-03-author-profile-pages]

tech-stack:
  added: []
  patterns:
    - "JSON-LD Person object expansion pattern: spread conditional fields (sameAs) only when present, sourced from a single authors.ts module"
    - "breadcrumbItems const built once in frontmatter, consumed by both <Breadcrumb> component and (separately, unchanged) breadcrumbSchema JSON-LD"

key-files:
  created: []
  modified:
    - src/layouts/ArticleLayout.astro

key-decisions:
  - "articleSchema.author.url now points to /author/{slug}/ (a page that will be created in Plan 03) instead of /about/, per D-10/T-04-03 — intentional new disclosure surface for E-E-A-T"
  - "Kept .ymyl-note as-is (no Disclaimer component swap) to preserve exact existing copy 'Lưu ý trước khi đọc:' per 04-CONTEXT.md guidance"
  - "Did not pass citations or factCheckedDate to CitationBox (D-04/D-05) — falls back to sources array and updatedDate display"
  - "Dropped .source-section's '/sources-policy/' paragraph text (D-11) — CitationBox has no slot for it; link remains reachable via editorial-policy and footer"

patterns-established:
  - "Person JSON-LD expansion: jobTitle/description/knowsAbout map 1:1 from authors.ts role/bio/expertise; sameAs spread conditionally via array filter + length check"

requirements-completed: [ARTL-01, ARTL-02, EEAT-10]

duration: 15min
completed: 2026-06-13
---

# Phase 04 Plan 02: Article Layout Wiring Summary

**Rewired ArticleLayout.astro to compose Breadcrumb, KeyTakeaways, and CitationBox components in EEAT order, and expanded articleSchema.author JSON-LD to a full schema.org Person sourced from src/data/authors.ts.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2 completed
- **Files modified:** 1

## Accomplishments
- ArticleLayout.astro now renders: Breadcrumb -> header -> ymyl-note -> KeyTakeaways -> article body (slot) -> FAQ -> CitationBox -> editorial-review -> AuthorBox -> ShareBar -> RelatedArticles
- `articleSchema.author` JSON-LD is now a complete Person object: `name`, `url` (-> `/author/{slug}/`), `jobTitle`, `description`, `knowsAbout`, and conditional `sameAs`
- Removed dead `.breadcrumb` CSS (now handled by Breadcrumb.astro's own scoped styles) and `.source-section`-only CSS selectors, while keeping `.editorial-review` styling intact

## Task Commits

1. **Task 1: Add imports, build breadcrumbItems, expand JSON-LD articleSchema.author (D-08, D-10)** - `2a90ca0` (feat)
2. **Task 2: Reorder article body markup and remove dead CSS (D-04, D-05, D-09, D-10, D-11)** - `0ed3f52` (feat)

## Files Created/Modified
- `src/layouts/ArticleLayout.astro` - New imports (Breadcrumb, KeyTakeaways, CitationBox), `breadcrumbItems` const, `sameAs` const, expanded `articleSchema.author`, reordered template (KeyTakeaways before slot, CitationBox replacing source-section after FAQ, AuthorBox before ShareBar), removed `.breadcrumb` and `.source-section`-only CSS rules

## Decisions Made
- See `key-decisions` in frontmatter — all decisions were pre-specified in the plan (D-04, D-05, D-08, D-09, D-10, D-11) and applied as written, no new architectural decisions required.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. `npm run build` passed after both tasks (60 pages built). Verified via dist output:
- `articleSchema.author` JSON-LD on `/dau-tu/co-phieu/co-phieu-la-gi/` contains `jobTitle`, `description`, `knowsAbout`, `url: ".../author/nguyen-viet-loc/"`, and correctly omits `sameAs` (since `author.socialLinks` is `undefined`)
- `/nha-dau-tu/benjamin-graham/` Key Takeaways box renders all 3 bullets including the colon-containing one, verbatim
- Only one "Nguồn tham khảo" `<h2>` heading appears per article (CitationBox), no duplicate from old source-section
- `<Breadcrumb>` renders via `<nav class="breadcrumb"><ol><li>` markup (Breadcrumb.astro's own scoped class), confirming old inline `<nav class="breadcrumb">` flat-span markup was removed

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `articleSchema.author.url` now points to `/author/{slug}/`, which currently 404s — this is expected and resolved by Plan 03 (author profile pages), which must create `src/pages/author/[slug].astro` matching `author.slug = "nguyen-viet-loc"`.
- AuthorBox v2 (already built in Phase 3) is now live in production article pages.

---
*Phase: 04-article-layout-wiring-author-profile-pages*
*Completed: 2026-06-13*
