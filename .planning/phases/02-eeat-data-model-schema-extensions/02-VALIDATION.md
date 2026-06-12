---
phase: 2
slug: eeat-data-model-schema-extensions
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test framework configured (confirmed in CONVENTIONS.md/STRUCTURE.md). Build-time Zod validation via `astro check`/`astro build` IS the test for this phase. |
| **Config file** | none |
| **Quick run command** | `npx astro check` |
| **Full suite command** | `npx astro check && npx astro build` |
| **Estimated runtime** | ~30-60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx astro check`
- **After every plan wave:** Run `npx astro check && npx astro build`
- **Before `/gsd-verify-work`:** Full suite must be green (0 errors), plus `grep -rn "site\.author\|authorProfile" src/` confirms no stale references remain (except documented alias)
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | EEAT-01 | — | `content.config.ts` accepts `citations`, `factCheckedDate`, `keyTakeaways` as optional/defaulted fields; 21 existing articles build without supplying them | build/type-check | `npx astro check && npx astro build` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | EEAT-02 | — | `src/data/authors.ts` exists as single source of author data | type-check | `npx astro check` | ✅ | ⬜ pending |
| 02-02-02 | 02 | 2 | EEAT-02 | — | `AuthorBox.astro`, `ArticleLayout.astro`, `BaseLayout.astro`, `about.astro`, `index.astro` resolve author data from `authors.ts` without duplication | type-check + manual grep | `npx astro check` + `grep -rn "site\.author\|authorProfile" src/` (expect 0, or only intentional alias) | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Build-time Zod schema validation (`npx astro check && npx astro build`) is the validation mechanism — no new test framework or test files are introduced in this phase (would be a separate infrastructure decision, out of scope per CONTEXT.md).

Note for executors: if schema edits produce confusing type errors from the `.astro/` content type cache, run `npx astro sync` before `npx astro check` (per RESEARCH.md Pitfall 4).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No stale `site.author`/`site.authorProfile` references remain after refactor | EEAT-02 | Build/type-check alone won't catch a leftover reference if it still type-checks against a kept-for-compat alias | Run `grep -rn "site\.author\|authorProfile" src/` and confirm 0 matches, or only the documented `site.author` alias (if D-06's optional alias is implemented) |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify (build/type-check commands)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none — existing infra sufficient)
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-12
