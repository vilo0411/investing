# Phase 6: QA, CWV & SEO Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-13
**Phase:** 6-QA, CWV & SEO Verification
**Areas discussed:** Visual Regression Strategy, CWV & Performance Auditing Methodology, Structured Data Validation, Sitemap & URL Freeze Verification

---

## Visual Regression Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Option A | A targeted manual checklist covering representative page templates (Homepage, Category Listing, Article Layout, Author Profile, Policy/Trust pages, search). | |
| Option B | Build a custom test script to crawl all build routes and check for HTML/CSS structural completeness. | |
| Option 1 (Custom) | **Selected:** Run local dev server, use Browser Subagent to navigate key templates on both Desktop (1440px) and Mobile (375px) viewports, capturing visual artifacts. | ✓ |

**User's choice:** Option 1 (Custom - Browser Subagent + Desktop/Mobile viewports)
**Notes:** The user agreed to have the agent run a local server and use the Browser Subagent to automatically test pages, capturing screenshots/video on both Desktop and Mobile for crucial templates.

---

## CWV & Performance Auditing Methodology

| Option | Description | Selected |
|--------|-------------|----------|
| Option 1 | **Selected:** Build a script to scan all 62 generated HTML pages in `dist/` to verify that 100% of images (`<img>`) have explicit `width` and `height` attributes to prevent CLS, and check that CSS files use `font-display: swap`. | ✓ |
| Option 2 | Basic check only — verify only the homepage and 1 sample article page. | |
| Option 3 | Manual only — do not build a script; just use browser profiling during the visual inspection. | |

**User's choice:** Option 1 (Automated build-time scan of all pages)
**Notes:** Pre-emptively checks for CLS risks and Font optimization across the entire generated build footprint.

---

## Structured Data (JSON-LD) Validation

| Option | Description | Selected |
|--------|-------------|----------|
| Option 1 | **Selected:** Node script to parse and validate all JSON-LD schemas in `dist/` for required fields, plus exporting clean sample JSON-LD blocks to a file for manual verification in Google's Rich Results Test tool. | ✓ |
| Option 2 | Only write script to check offline syntax and properties. | |
| Option 3 | Manual verification only by copy-pasting code blocks. | |

**User's choice:** Option 1 (Hybrid: automated parsing script + sample exports)
**Notes:** Provides high confidence offline coverage for all 62 pages, combined with easy manual verification on Google's Rich Results Test tool.

---

## Sitemap & URL Freeze Verification

| Option | Description | Selected |
|--------|-------------|----------|
| Option 1 | **Selected:** Build a sitemap-diff script to verify that `dist/sitemap-0.xml` matches expected URLs, crawl all internal links in the build output to detect broken links, and verify redirects compile correctly. | ✓ |
| Option 2 | Only compare sitemap files (old vs new) to check for missing/renamed URLs. | |
| Option 3 | Manual spot check of the sitemaps and redirects. | |

**User's choice:** Option 1 (Automated sitemap diff, broken link crawling, and redirect HTML verification)
**Notes:** Completely automates validation of URL consistency and link health across the entire site.

---

## the agent's Discretion

- Script architecture and programming language choice (Node.js script).
- Concrete criteria/rules used in schema validations.

---

## Deferred Ideas

None — all discussed topics mapped directly to the phase's requirements.
