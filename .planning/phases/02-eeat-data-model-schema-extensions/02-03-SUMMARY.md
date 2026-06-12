---
phase: 02-eeat-data-model-schema-extensions
plan: 03
subsystem: ui
tags: [astro, content-collections, eeat, data-model]

# Dependency graph
requires:
  - phase: 02-eeat-data-model-schema-extensions
    provides: src/data/authors.ts canonical author module (plan 02-02)
provides:
  - All author-data call sites (AuthorBox, ArticleLayout, BaseLayout, about.astro, index.astro) now read from src/data/authors.ts
  - src/data/site.ts free of duplicated author/authorProfile fields
affects: [03-authorbox-v2, 04-author-pages-jsonld]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Author profile data centralized in src/data/authors.ts; site.ts retains only org-level config (editorialReviewer, disclosure, trustStats)"

key-files:
  created: []
  modified:
    - src/components/AuthorBox.astro
    - src/layouts/ArticleLayout.astro
    - src/layouts/BaseLayout.astro
    - src/pages/about.astro
    - src/pages/index.astro
    - src/data/site.ts

key-decisions:
  - "about.astro 'Kinh nghiệm nội dung' section changed from <ul>/.map() over string[] to single <p>{author.experience}</p>, matching the string type of author.experience in authors.ts (D-02); existing .profile-card p CSS rule covers styling, no new styles needed."
  - "No derived alias added to site.ts for author — all 5 known consumers migrated directly to @/data/authors per RESEARCH.md Open Question 1 recommendation."

patterns-established:
  - "Pattern: import { author } from '@/data/authors' alongside existing site import where site.ts fields (editorialReviewer, name, email, disclosure, trustStats) are still needed."

requirements-completed: [EEAT-02]

duration: 15min
completed: 2026-06-12
---

# Phase 02 Plan 03: Migrate author call sites to authors.ts Summary

**All 5 author-data consumers (AuthorBox, ArticleLayout, BaseLayout, about.astro, index.astro) now read from the new `src/data/authors.ts` module, and `site.author`/`site.authorProfile` were removed from `src/data/site.ts` with zero duplication remaining.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2 completed
- **Files modified:** 6

## Accomplishments
- `AuthorBox.astro` now sources author name, role, bio, expertise from `@/data/authors`, with markup/styles byte-identical to before (D-06)
- `ArticleLayout.astro` and `BaseLayout.astro` JSON-LD Person/founder/author fields and byline now resolve from `author.name`; `site.editorialReviewer` untouched (Pitfall 2)
- `about.astro` and `index.astro` render all author profile fields (name, role, expertise, moneyPerspective, experience, education, publishedIn) from `@/data/authors`
- `src/data/site.ts` no longer defines `author`/`authorProfile`; `editorialReviewer` and all other fields unchanged
- `npx astro check` (0 errors, 0 warnings) and `npx astro build` (59 pages, 0 errors) both pass
- `grep -rn "site\.author\|authorProfile" src/` returns 0 matches

## Task Commits

1. **Task 1: Migrate AuthorBox.astro and the two layouts (ArticleLayout, BaseLayout) to authors.ts** - `1fb6dc0` (feat)
2. **Task 2: Migrate about.astro and index.astro to authors.ts, then remove author/authorProfile from site.ts** - `3a0fdb8` (feat)

## Files Created/Modified
- `src/components/AuthorBox.astro` - imports `{ author }` from `@/data/authors`; `.author-bio` now renders `{author.bio}`; style block unchanged
- `src/layouts/ArticleLayout.astro` - adds `import { author }`; JSON-LD `articleSchema.author.name`, `articleMeta.author`, byline use `author.name`; `reviewedBy` still uses `site.editorialReviewer`
- `src/layouts/BaseLayout.astro` - adds `import { author }`; Organization `founder.name` and `<meta name="author">` use `author.name`
- `src/pages/about.astro` - adds `import { author }`; all profile fields sourced from `author`; "Kinh nghiệm nội dung" now `<p>{author.experience}</p>`
- `src/pages/index.astro` - adds `import { author }`; homepage author section heading uses `author.name`
- `src/data/site.ts` - removed `author` and `authorProfile` fields; `editorialReviewer` and other fields unchanged

## Decisions Made
- See `key-decisions` in frontmatter above.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `src/data/authors.ts` is now the single source of truth for author/reviewer profile data with zero duplication in `site.ts`.
- EEAT-02 fully satisfied; Phase 3 (AuthorBox v2) and Phase 4 (`/author/[slug]`, full JSON-LD Person) can build on this without further data-source changes.
- No blockers.

---
*Phase: 02-eeat-data-model-schema-extensions*
*Completed: 2026-06-12*
