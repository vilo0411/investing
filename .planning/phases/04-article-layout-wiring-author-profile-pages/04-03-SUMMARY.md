---
phase: 04-article-layout-wiring-author-profile-pages
plan: 03
subsystem: ui
tags: [astro, content-collections, eeat, author-profile]

# Dependency graph
requires:
  - phase: 04-article-layout-wiring-author-profile-pages
    provides: AuthorBox.astro v2 with "Xem hồ sơ" link to /author/{slug} (plan 01)
provides:
  - "New static page src/pages/author/[slug].astro generating /author/nguyen-viet-loc/"
  - "getStaticPaths() returning array-friendly single-author-today route"
  - "Full E-E-A-T credibility profile (bio, role, experience, expertise, conditional credentials, moneyPerspective, education, conditional socialLinks, publishedIn)"
  - "Full 21-article list via ArticleList, distinct from about.astro's 6-item slice"
affects: [eeat, navigation, author-credibility]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dynamic single-entry getStaticPaths() with array-friendly comment for future authors[] expansion"
    - "Reuse of about.astro hero/sidebar/profile-card CSS pattern adapted for a distinct content page"

key-files:
  created: ["src/pages/author/[slug].astro"]
  modified: []

key-decisions:
  - "Removed duplicate experience text from bio-section (per plan note to avoid exact duplication); experience appears only in sidebar profile-card 'Kinh nghiệm nội dung'"
  - "Bio-section heading changed to 'Tiểu sử' (vs about.astro's 'Giới thiệu') and 'Bài viết mới' section heading changed to 'Tất cả bài viết' to make the page read as a distinct credibility dossier (D-06), not a near-duplicate of /about/"
  - "Removed about.astro's top-of-hero .profile-links (email/editorial-policy) and .stat-stack sidebar block since they are about.astro-specific brand/mission elements not part of this page's E-E-A-T contract; added a conditional socialLinks profile-card instead per the plan's sidebar spec"

patterns-established:
  - "Conditional sub-sections (credentials, socialLinks) gated with simple JS truthiness/length checks inside Astro template, following existing nullish-coalescing/defensive patterns"

requirements-completed: [EEAT-06]

# Metrics
duration: 12min
completed: 2026-06-13
---

# Phase 04 Plan 03: Author Profile Page Summary

**New `/author/[slug].astro` static page renders a full E-E-A-T credibility profile (bio, role, experience, expertise, moneyPerspective, education, conditional credentials/socialLinks, publishedIn) plus all 21 articles via ArticleList, resolving AuthorBox's previously-dangling "Xem hồ sơ" link.**

## Performance

- **Duration:** ~12 min
- **Tasks:** 1 completed
- **Files modified:** 1 created

## Accomplishments
- Created `src/pages/author/[slug].astro` with `getStaticPaths()` generating `/author/nguyen-viet-loc/`
- Page renders bio, role, experience, expertise, moneyPerspective quote, education, publishedIn, and conditional credentials/socialLinks sections sourced from `src/data/authors.ts`
- Full 21-article list rendered via `<ArticleList articles={articles} />`, sorted by `updatedDate` desc — distinct from `/about/`'s 6-item "latest" list (D-07)
- `npm run build` succeeds and produces `dist/author/nguyen-viet-loc/index.html`

## Task Commits

1. **Task 1: Create src/pages/author/[slug].astro with getStaticPaths, bio/credibility sections, and full article list** - `945ce1d` (feat)

## Files Created/Modified
- `src/pages/author/[slug].astro` - New static author credibility profile page; `getStaticPaths()` returns single-element array `[{ params: { slug: author.slug }, props: { author } }]`; reuses `about.astro`'s hero/sidebar/profile-card CSS adapted with distinct headings and conditional sections

## Decisions Made
- Removed duplicate "experience" text from the bio-section main column — shown only once, in the sidebar `.profile-card` "Kinh nghiệm nội dung", per the plan's anti-duplication note
- Used distinct section headings ("Tiểu sử" instead of "Giới thiệu", "Tất cả bài viết" instead of "Mới nhất từ ...") so the page reads as a separate credibility dossier rather than a near-duplicate of `/about/` (D-06)
- Omitted `about.astro`'s top-bar `.profile-links` (mailto/editorial-policy) and `.stat-stack` (article/category counts, "2026 cập nhật hồ sơ") since those are brand/mission-page elements outside this plan's E-E-A-T sidebar contract (stat-stack, social links, published-in per UI-SPEC); added a conditional `.profile-card` social-links block instead, gated on `profileAuthor.socialLinks !== undefined`

## Deviations from Plan

None - plan executed exactly as written. Conditional sections (`credentials.length > 0`, `socialLinks !== undefined`) both correctly evaluate to "hidden" with current `src/data/authors.ts` data (`credentials: []`, `socialLinks: undefined`), confirmed by reading the source data.

## Issues Encountered

None. `npm run build` completed successfully on first attempt (61 pages built, including `/author/nguyen-viet-loc/index.html`).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- AuthorBox's "Xem hồ sơ" link now resolves to a real page (no more 404)
- `/author/nguyen-viet-loc/` is live in build output and included in sitemap generation (no exclusion pattern matches `/author/*`)
- Manual visual verification (dev server walkthrough comparing `/author/nguyen-viet-loc/` vs `/about/`) is recommended but not blocking — automated build verification (artifact existence) passed

---
*Phase: 04-article-layout-wiring-author-profile-pages*
*Completed: 2026-06-13*
