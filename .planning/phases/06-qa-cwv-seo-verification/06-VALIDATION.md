---
phase: 6
slug: qa-cwv-seo-verification
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-13
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js (native test runner / scripts) |
| **Config file** | none |
| **Quick run command** | `node scripts/run-verification.mjs` |
| **Full suite command** | `node scripts/run-verification.mjs` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node scripts/run-verification.mjs`
- **After every plan wave:** Run `node scripts/run-verification.mjs`
- **Before `/gsd-verify-work`:** Script must pass with zero errors, and manual visual check must be completed
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | QASE-02, QASE-03, QASE-04 | — | Verification script parses build output correctly | integration | `node scripts/run-verification.mjs` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | QASE-03 | — | Export `sample-schemas.json` containing correct JSON-LD examples | integration | `node scripts/run-verification.mjs` (includes schema verification) | ❌ W0 | ⬜ pending |
| 06-01-03 | 01 | 1 | QASE-01 | — | Templates audited across viewports for visual regressions | visual | manual check via Browser Subagent | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Wave 0 establishes the verification infrastructure that runs during subsequent task checks:

- [ ] `scripts/run-verification.mjs` — Central Node verification script

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual regression and layout checks on critical templates | QASE-01 | Requires visual and layout rendering check (responsive behavior, layout shifts) | Build site, view pages: `/`, `/dau-tu/co-phieu/`, `/dau-tu/co-phieu/co-phieu-la-gi/`, `/author/nguyen-viet-loc/`, `/editorial-policy/`, `/disclaimer/`, `/search/` on 1440px and 375px viewports. Verify components look clean. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
