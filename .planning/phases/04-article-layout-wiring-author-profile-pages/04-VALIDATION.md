---
phase: 04
slug: article-layout-wiring-author-profile-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-13
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test framework in repo; build-time checks only |
| **Config file** | none — Wave 0 installs `gray-matter` as devDependency for the backfill script |
| **Quick run command** | `npm run build` (runs `astro check && astro build` — type-checks frontmatter against Zod schema, builds all pages) |
| **Full suite command** | `npm run build` (same — only automated check in the repo) |
| **Estimated runtime** | ~30-60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual visual check of 2-3 representative articles (one with TOC, one without, plus `benjamin-graham.md` for the colon-bullet edge case)
- **Before `/gsd-verify-work`:** Full `npm run build` green + manual spot-check of `/author/nguyen-viet-loc/` + manual JSON-LD spot-check via browser devtools on at least one article
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 0 | EEAT-10 | — | N/A | script | `npm install --save-dev gray-matter` then run backfill script | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 0 | EEAT-10 | — | N/A | script + build | `grep -L "keyTakeaways" src/content/articles/*.md` → empty; `grep -l "## Key takeaways" src/content/articles/*.md` → empty; `npm run build` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 1 | ARTL-01, ARTL-02, EEAT-10 | T-04-01 | JSON-LD escaped via `JSON.stringify()` (existing pattern, no change) | build + manual | `npm run build`; manual visual check on `/co-phieu/co-phieu-la-gi/` and a non-TOC article | ✅ | ⬜ pending |
| 04-03-01 | 03 | 1 | EEAT-06 | — | N/A | build + manual | `npm run build`; manual visit `/author/nguyen-viet-loc/` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install --save-dev gray-matter` — required before the 21-article migration script can run
- [ ] `scripts/backfill-key-takeaways.mjs` (or similar) — migration script for EEAT-10, with a self-check summary (21/21 processed, bullet counts)

*Wave 0 is required — EEAT-10 has no existing infrastructure to backfill `keyTakeaways` frontmatter.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Article pages render components in order Breadcrumb → KeyTakeaways → TOC → Content → CitationBox → AuthorBox → Share/Related | ARTL-01 | No visual regression tooling in repo (QASE-01 is Phase 6) | `npm run dev`, visit `/co-phieu/co-phieu-la-gi/` (has TOC) and a non-TOC article, confirm visual order top to bottom |
| JSON-LD `author` Person object matches `authors.ts` fields and AuthorBox display | ARTL-02 | No JSON-LD schema test tooling (QASE-03 is Phase 6) | View page source, inspect `<script type="application/ld+json">`, compare fields (`jobTitle`, `description`, `knowsAbout`, `sameAs`, `url`) against `src/data/authors.ts` and AuthorBox output |
| `/author/[slug]` profile page shows bio, role, experience, expertise, credentials, education, moneyPerspective, socialLinks, publishedIn, and article list | EEAT-06 | New page, no automated content-assertion tooling | `npm run dev`, visit `/author/nguyen-viet-loc/`, confirm all sections render with data from `authors.ts` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
