---
phase: 5
slug: homepage-category-trust-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-13
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — no test framework detected in repo (confirmed: "No test framework, test files, or test config found" per project tech-stack notes) |
| **Config file** | none |
| **Quick run command** | `npx astro check` |
| **Full suite command** | `npm run build` (runs `astro check && astro build`) |
| **Estimated runtime** | ~30-60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx astro check`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** `npm run build` must be green + manual visual checklist below
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-xx | TBD | TBD | HOME-02 | — | Trust strip renders with links to `/about/`, `/editorial-policy/`, `/disclaimer/` | manual + build | `npm run build`, grep `dist/index.html` for the three hrefs | ❌ W0 | ⬜ pending |
| 05-02-xx | TBD | TBD | CATG-01 | — | `[category].astro` and `dau-tu/[category].astro` render via shared `CategoryListing` | build + visual | `npm run build` then structural diff of `dist/co-phieu/index.html` vs `dist/dau-tu/co-phieu/index.html` | ❌ W0 | ⬜ pending |
| 05-03-xx | TBD | TBD | TRST-01 | — | `/about/` renders mission/process/preview-card/stats without full author dossier | manual + build | `npm run build`, inspect `dist/about/index.html` | ❌ W0 | ⬜ pending |
| 05-04-xx | TBD | TBD | TRST-02 | — | `/editorial-policy/` has new fact-check + CitationBox-reference sections | manual + build | `npm run build`, inspect `dist/editorial-policy/index.html` for new `<h2>` text | ❌ W0 | ⬜ pending |
| 05-05-xx | TBD | TBD | TRST-03 | — | `/disclaimer/` page exists; `Disclaimer.astro` links to it | build + manual | `npm run build`, check `dist/disclaimer/index.html` exists; grep `Disclaimer.astro` usages for `href="/disclaimer/"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No automated test files exist for this phase or project (out of scope — QASE-01..04 belong to Phase 6). Wave 0 gaps are manual verification checklist items, not missing test files:

- [ ] Manual: `/disclaimer/` page builds and is reachable
- [ ] Manual: trust-strip on `/` links to all 3 of `/about/`, `/editorial-policy/`, `/disclaimer/`
- [ ] Manual: `[category].astro` and `dau-tu/[category].astro` visually identical except breadcrumb depth
- [ ] Manual: `/about/` no longer shows full author dossier (credentials/expertise/moneyPerspective/education lists)
- [ ] Manual: `Disclaimer.astro`'s existing usages (e.g., on article pages from Phase 3/4) still render correctly with the new link added

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Trust strip visual presentation and copy quality | HOME-02 | No visual regression tooling (Phase 6 scope) | Build site, view `/`, confirm trust strip renders with 3-4 cards and correct links |
| Category listing visual consistency across route trees | CATG-01 | Structural diff only catches gross mismatches | Build site, view `/co-phieu/` and `/dau-tu/co-phieu/`, confirm consistent layout except breadcrumb depth |
| About/Editorial Policy/Disclaimer copy quality (anti-AI, YMYL compliance) | TRST-01, TRST-02, TRST-03 | Content tone/compliance requires human judgment per `.antigravity/rules/content-anti-ai.md` | Read rendered pages, confirm no personalized-advice language, confirm tone matches brand profile |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
