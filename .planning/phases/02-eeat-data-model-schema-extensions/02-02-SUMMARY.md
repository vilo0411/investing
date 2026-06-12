---
phase: 02-eeat-data-model-schema-extensions
plan: 02
subsystem: data
tags: [astro, typescript, content-model, eeat]

# Dependency graph
requires:
  - phase: 02-eeat-data-model-schema-extensions (plan 01)
    provides: schema/content model groundwork
provides:
  - "src/data/authors.ts: single canonical author object with full D-02 + A1 field set"
  - "exported `Author` type for downstream consumers"
affects: [02-03 (call-site migration of AuthorBox/about/ArticleLayout/BaseLayout/index), phase-3 (AuthorBox v2), phase-4 (/author/[slug], JSON-LD Person)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single config object + named export + co-located `typeof` type (mirrors src/data/site.ts pattern)"

key-files:
  created: [src/data/authors.ts]
  modified: []

key-decisions:
  - "experience field is a single string (per D-02), merged from the two-item site.authorProfile.experience array into one sentence — about.astro's .map() rendering will be updated in plan 02-03"
  - "credentials left as empty array and avatar/socialLinks left undefined per RESEARCH.md Open Question 2 (no fabricated YMYL credentials)"

patterns-established:
  - "src/data/authors.ts as single source of truth for author/reviewer profile data, to be consumed via `import { author } from \"@/data/authors\"`"

requirements-completed: [EEAT-02]

# Metrics
duration: 8min
completed: 2026-06-12
---

# Phase 02 Plan 02: Author Data Model Summary

**Created `src/data/authors.ts` exporting a single canonical `author` object (D-02 + A1 field set: name, slug, role, bio, credentials, experience, expertise, avatar, socialLinks, moneyPerspective, education, publishedIn) and `Author` type, with all string values matching current rendered output byte-for-byte.**

## Performance

- **Duration:** ~8 min
- **Tasks:** 1 completed
- **Files modified:** 1 created

## Accomplishments
- New `src/data/authors.ts` module created, mirroring the `src/data/site.ts` "config object + named export + co-located type" pattern
- All 12 fields populated with values copied verbatim from `site.ts` (`authorProfile.*`), `site.author`, and `AuthorBox.astro`'s hardcoded bio
- `experience` resolved to a single string per D-02 (merging the two array items from `site.authorProfile.experience`), with an explanatory comment for the next plan
- `npx astro check` passes with 0 errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/data/authors.ts with full D-02 + A1 field set** - `37d4f48` (feat)

## Files Created/Modified
- `src/data/authors.ts` - New canonical author/reviewer profile data module; exports `author` object and `Author` type

## Decisions Made
- `experience` is a single string per D-02, combining `site.authorProfile.experience[0]` and `[1]` into one sentence: "Xây dựng nội dung giáo dục tài chính cho nhà đầu tư cá nhân, biên tập theo hướng có nguồn, rõ rủi ro và không khuyến nghị mua bán." A code comment flags that `about.astro`'s `.map()` rendering of `experience` must be updated to a single `<p>` in plan 02-03.
- `credentials: []`, `avatar: undefined`, `socialLinks: undefined` left empty/undefined per RESEARCH.md Open Question 2 — no fabricated credentials for a YMYL author.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `src/data/authors.ts` is ready for plan 02-03 to wire `AuthorBox.astro`, `ArticleLayout.astro`, `BaseLayout.astro`, `about.astro`, and `index.astro` to `import { author } from "@/data/authors"`.
- Plan 02-03 must update `about.astro`'s rendering of `experience` from `.map()`-over-array to a single paragraph, per the comment left in `authors.ts`.
- No blockers.

---
*Phase: 02-eeat-data-model-schema-extensions*
*Completed: 2026-06-12*
