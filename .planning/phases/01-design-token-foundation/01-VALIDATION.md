---
phase: 1
slug: design-token-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-11
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — manual visual verification + `astro check` for build-time type/schema validation |
| **Config file** | none — see Wave 0 |
| **Quick run command** | `npx astro check` |
| **Full suite command** | `npm run build` (runs `astro check && astro build`), then `npm run preview` for manual route audit |
| **Estimated runtime** | ~30s (`astro check`), ~2 min (`npm run build`) |

---

## Sampling Rate

- **After every task commit:** Run `npx astro check`
- **After every plan wave:** Run `npm run build` + manual spot-check of 2-3 representative pages (homepage, one article, search)
- **Before `/gsd-verify-work`:** Full DSGN-05 route checklist (below) walked manually in `npm run preview`
- **Max feedback latency:** ~30s (astro check) for per-task; ~2 min for per-wave build

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | DSGN-05 | — | N/A | manual checklist | n/a — checklist file | ❌ W0 | ⬜ pending |
| 01-0x-0x | TBD | 1 | DSGN-01 | — | New token files exist and import cleanly | smoke | `npm run build` | N/A — created this phase | ⬜ pending |
| 01-0x-0x | TBD | 1 | DSGN-02 | — | All legacy `var(--...)` names resolve via `aliases-legacy.css` | manual + smoke | `npm run build` + devtools computed-style inspection | ❌ W0 | ⬜ pending |
| 01-0x-0x | TBD | 1-2 | DSGN-03 | — | Article body: distinct type scale, ~1.7 line-height, ~65ch | manual | Visual inspection of `[category]/[slug]` and `dau-tu/[category]/[slug]` at 375/768/1024/1440px | ❌ W0 | ⬜ pending |
| 01-0x-0x | TBD | 1 | DSGN-04 | — | Vietnamese diacritics render correctly (Source Serif 4 + Inter) | manual | Visual inspection of Vietnamese heading/paragraph in Chrome/Firefox/Safari | ❌ W0 | ⬜ pending |
| 01-0x-0x | TBD | final | DSGN-05 | — | Every route audited, no broken layout | manual | Walk 13-template route checklist at 4 viewports in `npm run preview` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Plan IDs and exact task IDs to be filled in by the planner; rows above are placeholders mapping requirements to verification approach.*

---

## Wave 0 Requirements

- [ ] `01-route-audit-checklist.md` (phase dir) — markdown checklist enumerating all 13 route templates from RESEARCH.md "DSGN-05: Full Route Inventory" at 4 viewports (375/768/1024/1440px) — used for final DSGN-05 sign-off
- [ ] No test framework install needed — explicitly out of scope (no new build dependencies per PROJECT.md constraints)

*No automated test framework exists in this repo (per `.planning/codebase/STRUCTURE.md`). This is a CSS-only phase; manual visual checklist is the correct sampling strategy.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Article body type scale (~1.7 line-height, ~65ch) renders correctly | DSGN-03 | No visual regression tooling in repo (out of scope to add) | Open an article page in `npm run preview` at 375/768/1024/1440px, confirm line-height ≈1.7 and content column ≈65ch |
| Vietnamese diacritics render correctly in Source Serif 4 (heading) + Inter (body) | DSGN-04 | Font rendering requires visual check across browsers | Open a page with Vietnamese text containing tone marks + â/ă/ê/ô/ơ/ư (e.g. "Phân tích cơ bản: Định giá cổ phiếu") in Chrome, Firefox, Safari |
| All 37 legacy `var(--...)` names resolve through `aliases-legacy.css` | DSGN-02 | No automated CSS variable resolution test exists | `npm run build` succeeds + devtools computed-style spot-check of 3-4 components on a sample page |
| Every route renders without broken layout after token swap | DSGN-05 | Full visual audit across 13 templates × 4 viewports | Walk `01-route-audit-checklist.md` in `npm run preview` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (route audit checklist)
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
