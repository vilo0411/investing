---
phase: 01-design-token-foundation
plan: 02
subsystem: ui
tags: [astro, google-fonts, typography, design-tokens, qa-checklist]

# Dependency graph
requires:
  - phase: 01-design-token-foundation
    provides: Locked typography spec (Source Serif 4 + Inter) from 01-UI-SPEC.md
provides:
  - BaseLayout.astro Google Fonts link updated to Source Serif 4 + Inter (400/500/700)
  - 01-route-audit-checklist.md - 13-route-template manual DSGN-05 audit scaffold
affects: [01-design-token-foundation/03]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created:
    - .planning/phases/01-design-token-foundation/01-route-audit-checklist.md
  modified:
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Used /phan-tich/pe-la-gi/, /dau-tu/co-phieu/co-phieu-la-gi/, and /kien-thuc/co-phieu-la-gi/ as representative article instances for the audit checklist (real existing slugs)"

patterns-established: []

requirements-completed: [DSGN-04, DSGN-05]

# Metrics
duration: 6min
completed: 2026-06-11
---

# Phase 01 Plan 02: Font Swap & Route Audit Checklist Summary

**Swapped BaseLayout.astro Google Fonts link from DM Serif Display + DM Sans to Source Serif 4 + Inter (400/500/700) and produced the 13-route-template DSGN-05 manual audit checklist for Plan 03.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-11T16:11:00Z
- **Completed:** 2026-06-11T16:17:00Z
- **Tasks:** 2 completed
- **Files modified:** 2 (1 modified, 1 created)

## Accomplishments
- BaseLayout.astro now loads Source Serif 4 and Inter at weights 400/500/700 from Google Fonts; DM Serif Display/DM Sans references fully removed; preconnect links unchanged
- Created `01-route-audit-checklist.md` enumerating all 13 page templates x 4 viewport widths (375/768/1024/1440), with Vietnamese diacritic test string, `.eyebrow` legibility checks, and the `--article` 65ch width range check (Pitfall 3) — 61 checkboxes total
- `npx astro check` passes with 0 errors, 0 new warnings

## Task Commits

Each task was committed atomically:

1. **Task 1: Swap Google Fonts link to Source Serif 4 + Inter** - `4b9c9e2` (feat)
2. **Task 2: Create the DSGN-05 route audit checklist** - `1d367bb` (docs)

_Note: TDD tasks may have multiple commits (test → feat → refactor) — not applicable here, both tasks tdd="false"_

## Files Created/Modified
- `src/layouts/BaseLayout.astro` - Google Fonts `<link>` now loads `Source+Serif+4:wght@400;500;700&family=Inter:wght@400;500;700&display=swap`; comment updated; preconnect tags unchanged
- `.planning/phases/01-design-token-foundation/01-route-audit-checklist.md` - New manual QA checklist for Plan 03's DSGN-05 sign-off, 13 route sections + global `--article` width check

## Decisions Made
- Selected representative article slugs for the audit checklist from existing content: `/phan-tich/pe-la-gi/` (non-Đầu tư article), `/dau-tu/co-phieu/co-phieu-la-gi/` (Đầu tư article), `/kien-thuc/co-phieu-la-gi/` (legacy route), `/phan-tich/` and `/dau-tu/co-phieu/` for category listings, `/dau-tu/` for the hub.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 03 can proceed to walk `01-route-audit-checklist.md` via `npm run preview` for the final DSGN-05 manual sign-off once the full design token set (colors, spacing, components) lands.
- BaseLayout.astro font loading is verified building correctly via `astro check` (0 errors).

---
*Phase: 01-design-token-foundation*
*Completed: 2026-06-11*
