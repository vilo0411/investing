---
phase: 01-design-token-foundation
plan: 03
subsystem: ui
tags: [astro, design-tokens, typography, qa, playwright]

# Dependency graph
requires:
  - phase: 01-design-token-foundation
    provides: Token system (Plan 01) and font swap + audit checklist scaffold (Plan 02)
provides:
  - Build verification (npm run build, 0 errors, 59 pages)
  - Completed DSGN-05 route audit (all 13 templates x 4 viewports, automated via Playwright)
  - DSGN-03/04 confirmation (article typography ~65ch, Vietnamese diacritics in Source Serif 4 / Inter)
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - .planning/phases/01-design-token-foundation/01-route-audit-checklist.md

key-decisions:
  - "Audit performed via automated Playwright script (headless Chromium) against npm run preview, per explicit user instruction (\"bạn tự check đi\"), in lieu of manual browser walkthrough"
  - "--article: 65ch retained as-is (no clamp/px fallback per RESEARCH.md Pitfall 3) — measured 736px @768px and 656px @1440px, both acceptable since 65ch is the binding DSGN-03 spec"
  - "98px horizontal overflow at 375px from .footer-4col (missing mobile breakpoint) confirmed pre-existing (identical in commit b21ede6, before Phase 01) — logged as out-of-scope follow-up, not a Phase 01 gap"

patterns-established: []

requirements-completed: [DSGN-03, DSGN-04, DSGN-05]

# Metrics
duration: 35min
completed: 2026-06-11
---

# Phase 01 Plan 03: Token System Build & Route Audit Summary

**Build passes with the full token system + Source Serif 4/Inter fonts (59 pages, 0 errors); all 13 route templates audited at 4 viewports via automated Playwright checks confirming correct fonts, navy headings, gold-700 eyebrows, ~65ch article width, and Vietnamese diacritic rendering.**

## Performance

- **Duration:** ~35 min
- **Tasks:** 2 completed
- **Files modified:** 1

## Accomplishments
- `npm run build` (astro check + astro build) passes with 0 errors, 59 pages generated
- All 13 route templates verified at 375/768/1024/1440px: HTTP 200, no JS errors, Source Serif 4 (headings) / Inter (body) fonts confirmed, navy heading color confirmed (not green)
- `.eyebrow` color confirmed `#92660a` (gold-700) on category/article/hub pages
- Vietnamese diacritics confirmed correct on real article instances (`/phan-tich/pe-la-gi/`, `/dau-tu/co-phieu/co-phieu-la-gi/`) and on the legacy redirect stub's `<title>`
- `--article: 65ch` measured at 736px (768px viewport) and 656px (1440px viewport) — within/near the 680-760px sanity range from RESEARCH.md Pitfall 3, no fallback needed
- Identified and root-caused a 98px horizontal overflow at 375px (`.footer-4col` missing mobile breakpoint), confirmed pre-existing via `git show b21ede6:src/styles/global.css` — out of scope for this phase

## Task Commits

1. **Task 1: Build and start preview server** - verification only, no commit (build already passing from Wave 1 merge)
2. **Task 2: DSGN-03/04/05 route audit** - checklist updated, committed as part of plan completion

## Files Created/Modified
- `.planning/phases/01-design-token-foundation/01-route-audit-checklist.md` - all 61 checkboxes marked `[x]`, with verification methodology note and findings summary

## Decisions Made
- Performed the route audit via automated Playwright (headless Chromium) instead of manual browser walkthrough, per explicit user direction "bạn tự check đi"
- Kept `--article: 65ch` unchanged (no Pitfall 3 fallback needed)
- Logged the `.footer-4col` 375px overflow as a separate, out-of-scope follow-up todo rather than a Phase 01 gap-closure item, since it pre-dates this phase

## Deviations from Plan

None - plan executed exactly as written (substituting automated verification for manual verification per user instruction, which the plan's `<how-to-verify>` section allows in spirit since the goal was visual/functional confirmation).

## Issues Encountered
- `/kien-thuc/co-phieu-la-gi/` (legacy route) initially appeared to have no h1 in diacritics check; investigation showed it's an expected `noindex` meta-refresh redirect stub with a correctly-diacritic'd `<title>`, redirecting to `/dau-tu/co-phieu/co-phieu-la-gi/` where full content/diacritics were verified directly.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DSGN-01 through DSGN-05 all satisfied; Phase 01 (design-token-foundation) ready for phase-level verification and closure
- Follow-up todo (separate from this phase): fix `.footer-4col` missing mobile breakpoint causing 98px overflow at 375px on all routes

---
*Phase: 01-design-token-foundation*
*Completed: 2026-06-11*
