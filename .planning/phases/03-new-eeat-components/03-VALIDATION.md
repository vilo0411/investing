---
phase: 3
slug: new-eeat-components
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test runner configured (static Astro site, build-time validated) |
| **Config file** | none — Wave 0 adds the preview page as the test harness |
| **Quick run command** | `npx astro check` |
| **Full suite command** | `npm run build` (= `astro check && astro build`) |
| **Estimated runtime** | ~30-60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx astro check`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** `npm run build` must be green AND manual visual inspection of `/_preview/eeat-components/` (via `npm run dev` or `npm run preview`) covering populated and empty/fallback variants of every component
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-XX | 01 | 0 | EEAT-03..09 | — | N/A | build | `npx astro check` | ❌ W0 | ⬜ pending |
| 03-0X-XX | TBD | TBD | EEAT-03 | — | KeyTakeaways renders list with items, renders nothing with `items=[]` | manual | `npm run build` + visual check on `/_preview/eeat-components/` | ❌ W0 | ⬜ pending |
| 03-0X-XX | TBD | TBD | EEAT-04 | T-3-01 | CitationBox renders all prop combinations (sources/citations/factCheckedDate), uses `{expression}` interpolation (no `set:html`) for citation URLs/titles | manual | `npm run build` + visual check | ❌ W0 | ⬜ pending |
| 03-0X-XX | TBD | TBD | EEAT-05 | — | AuthorBox v2 shows credentials when non-empty, hides when empty; links to `/author/{slug}` | manual | `npm run build` + visual check | ❌ W0 | ⬜ pending |
| 03-0X-XX | TBD | TBD | EEAT-07 | — | Breadcrumb renders for article-style and category-style item lists | manual | `npm run build` + visual check | ❌ W0 | ⬜ pending |
| 03-0X-XX | TBD | TBD | EEAT-08 | — | Disclaimer renders YMYL text with token-based styling | manual | `npm run build` + visual check | ❌ W0 | ⬜ pending |
| 03-0X-XX | TBD | TBD | EEAT-09 | — | ComparisonTable renders columns/rows, wraps in `overflow-x: auto`, header styled with brand color + zebra rows | manual | `npm run build` + visual check | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Planner fills in exact Task IDs/Plan IDs/Waves once plans are written.*

---

## Wave 0 Requirements

- [ ] `src/pages/_preview/eeat-components.astro` (or split into multiple preview pages) — single isolated page importing and rendering all 6 components (KeyTakeaways, CitationBox, AuthorBox v2, Breadcrumb, Disclaimer, ComparisonTable) with both populated and empty/fallback prop sets. This page IS the test harness for this phase.
- [ ] Exclude `/_preview/` route from sitemap via `astro.config.mjs` filter (precedent: existing `kien-thuc` exclusion)
- [ ] No test framework install needed — `astro check` + `astro build` (already in `npm run build`) are sufficient given the static, build-time-validated nature of the project

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual rendering of all 6 components with populated data | EEAT-03,04,05,07,08,09 | No test framework / visual assertions not automated | `npm run dev`, visit `/_preview/eeat-components/`, confirm each component renders per CONTEXT.md visual decisions (D-02, D-06, D-08, D-11, D-12) |
| Empty/fallback state rendering (`items=[]`, no `citations`, no `credentials`, etc.) | EEAT-03,04,05 | No test framework / visual assertions not automated | On same preview page, render each component a second time with empty/fallback props per D-03, D-04/D-05, D-08; confirm graceful fallback (no broken layout, no `undefined` text) |
| Comparison table mobile overflow behavior | EEAT-09 | Requires responsive viewport check | Resize preview to mobile width (or use devtools), confirm table wrapper scrolls horizontally (`overflow-x: auto`) without breaking page layout |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (`astro check` / `npm run build`) or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (preview page harness)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
