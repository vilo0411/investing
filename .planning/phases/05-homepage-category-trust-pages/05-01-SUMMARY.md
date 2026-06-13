---
phase: 05-homepage-category-trust-pages
plan: 01
subsystem: ui
tags: [astro, homepage, eeat, trust-signals]

requires:
  - phase: 03-new-eeat-components
    provides: design tokens (--line, --surface, --color-brand-100, --shadow-md, --radius-md) used for trust-card styling
provides:
  - Homepage trust-strip section between hero and topic grid
  - Closed EEAT link loop from homepage to /about/, /editorial-policy/, /disclaimer/
affects: [homepage, trust pages]

tech-stack:
  added: []
  patterns:
    - "trust-card link pattern: anchor wrapping h3+p, mirrors existing .topic-card styling"

key-files:
  created: []
  modified:
    - src/pages/index.astro

key-decisions:
  - "Plan referenced non-existent design tokens (--space-2/4/6, --shadow-sm); substituted existing literal px values (16px gap, 20px padding, 8px margin) and --shadow-md, matching .topic-card conventions already in this file"

patterns-established:
  - "trust-strip-section: additive homepage section reusing .section/.section-header/.section-title conventions with its own grid+card classes"

requirements-completed: [HOME-01, HOME-02]

duration: 15min
completed: 2026-06-13
---

# Phase 5 Plan 1: Homepage Trust Strip Summary

**Added a 4-card trust-strip section to the homepage linking to /editorial-policy/, /disclaimer/, and /about/, closing the EEAT link loop (HOME-02) without touching any existing homepage section (HOME-01 unaffected).**

## Performance

- **Duration:** ~15 min
- **Tasks:** 1 completed
- **Files modified:** 1

## Accomplishments
- New `.trust-strip-section` inserted between `.home-hero` and `.topic-section`, with its own eyebrow ("Vì sao tin chúng tôi") and heading ("Nguyên tắc xây dựng nội dung")
- 4 `.trust-card` links with exact copy from UI-SPEC, covering all three trust pages (about x1, editorial-policy x2, disclaimer x1)
- Scoped styles added (`.trust-strip`, `.trust-card`, `.trust-card:hover`, `.trust-card h3`, `.trust-card p`) with responsive collapse at 860px (2-col) and 640px (1-col)
- `npx astro check` exits 0, `npm run build` exits 0, `dist/index.html` contains `trust-strip-section` and 4 `trust-card` occurrences

## Task Commits

1. **Task 1: Insert homepage trust-strip section (HOME-02, D-04, D-05, D-06)** - `9fc5100` (feat)

**Plan metadata:** (pending — committed by orchestrator in worktree mode per instructions)

## Files Created/Modified
- `src/pages/index.astro` - Added `.trust-strip-section` markup (4 trust-card links) and scoped CSS between `.home-hero` and `.topic-section`

## Decisions Made
- Substituted non-existent `--space-*` tokens and `--shadow-sm` (referenced in plan) with existing literal px values and `--shadow-md`, matching the established `.topic-card` pattern in the same file (gap: 16px, padding: 20px, margin: 8px). This keeps the new section visually consistent with existing card-grid sections.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan referenced non-existent CSS custom properties**
- **Found during:** Task 1
- **Issue:** Plan's `<action>` specified `var(--space-4)`, `var(--space-6)`, `var(--space-2)`, and `var(--shadow-sm)` for the new `.trust-strip`/`.trust-card` rules, but none of these tokens exist in `src/styles/global.css` (only `--shadow-md`/`--shadow-lg` and no `--space-*` scale). Using undefined custom properties would silently resolve to `initial`/unset values, breaking the intended layout (no gap, no padding).
- **Fix:** Replaced with literal px values mirroring the adjacent `.topic-card`/`.topic-grid` rules (`gap: 16px`, `padding: 20px`, `margin: 0 0 8px`) and used `--shadow-md` (the closest existing token to the spec's "sm" intent) for hover shadow.
- **Files modified:** src/pages/index.astro
- **Verification:** `npx astro check` (0 errors), `npm run build` (exits 0, 61 pages built)
- **Committed in:** 9fc5100 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix — undefined CSS tokens)
**Impact on plan:** Necessary for correct visual rendering; no scope creep. Visual outcome matches UI-SPEC intent using existing design tokens/conventions.

## Issues Encountered
None beyond the token substitution documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Homepage now links to all three trust pages (/about/, /editorial-policy/, /disclaimer/), satisfying D-04/D-05/D-06 link-loop requirements for this plan's scope
- No blockers for subsequent plans in this phase (category pages, trust page content expansion)

---
*Phase: 05-homepage-category-trust-pages*
*Completed: 2026-06-13*
