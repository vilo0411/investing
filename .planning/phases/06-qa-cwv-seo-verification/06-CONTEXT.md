# Phase 6: QA, CWV & SEO Verification - Context

**Gathered:** 2026-06-13
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the QA, CWV, and SEO verification checks for the redesigned ValueInvesting.com.vn. It validates that none of the 62 static routes are visually broken (no layout shifts, responsive across desktop/mobile), that Core Web Vitals (CLS/LCP/FCP) are safeguarded at the HTML level (image sizes, font swap), that JSON-LD structured data is structurally correct and complete, and that the URL sitemap remains identical to the frozen URL contract with redirects correctly mapped.

Out of scope: Editing article contents, rewriting stylesheets, changing site routing or structural features. This is a verification-only phase.

</domain>

<decisions>
## Implementation Decisions

### Visual Regression (QASE-01)
- **D-01:** Run local dev server and use the Browser Subagent to automatically navigate, inspect, and record/screenshot critical page templates:
  - Homepage (`/`)
  - Category Listing (`/dau-tu/co-phieu/`)
  - Article Page (`/dau-tu/co-phieu/co-phieu-la-gi/`)
  - Author Profile (`/author/nguyen-viet-loc/`)
  - Editorial Policy (`/editorial-policy/`)
  - Disclaimer (`/disclaimer/`)
  - Search Page (`/search/`)
- **D-02:** Conduct visual inspections on both **Desktop** (1440px) and **Mobile** (375px) viewports to verify responsive behavior of the new EEAT components (Breadcrumbs, KeyTakeaways, CitationBox, ComparisonTable).

### CWV & Performance (QASE-02)
- **D-03:** Build a script to scan all 62 generated HTML pages in `dist/` to verify that 100% of images (`<img>`) have explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS), and check that CSS files use `font-display: swap`.

### Structured Data (JSON-LD) Validation (QASE-03)
- **D-04:** Build an offline Node validator script to parse JSON-LD schemas across all built HTML files, running assertions to confirm Google compliance (required fields for Article, Person, BreadcrumbList, WebSite, Organization, and FAQPage).
- **D-05:** Export sample JSON-LD blocks for an article page and the author profile page to a separate JSON file (`sample-schemas.json`) to allow easy copy-pasting into Google's Rich Results Test tool.

### Sitemap & URL Freeze (QASE-04)
- **D-06:** Build a script to parse `dist/sitemap-0.xml` and compare it against the original URL structure to guarantee no URLs are missing or renamed.
- **D-07:** The script must crawl all internal links in built HTML files to detect broken links (404s) and check that redirects in `astro.config.mjs` (e.g. `/co-phieu/` redirects) correctly generate redirect index files.

### the agent's Discretion
- The implementation of verifier scripts (JavaScript/TypeScript) in the codebase.
- The precise structure of validation assertions (e.g., fields checked, warning logs).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints
- `.planning/REQUIREMENTS.md` — QASE-01, QASE-02, QASE-03, QASE-04
- `.planning/ROADMAP.md` §Phase 6 — Goal and Success Criteria

### Codebase & Configurations
- `astro.config.mjs` — Redirect rules and sitemap configuration
- `public/robots.txt` — Robots and sitemap declaration
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/CONVENTIONS.md`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Node script templates or standard JS libraries (like `fs`, `path`, `jsdom` or regex parsers) to run validation checks.
- Browser subagent tooling to perform automated browser interaction.

### Established Patterns
- Astro static site builds to the `dist/` directory.
- `astro.config.mjs` redirects map directly to HTML files containing redirect metadata in `dist/`.

### Integration Points
- `dist/sitemap-0.xml` and `dist/sitemap-index.xml` as sources of sitemap truth.
- `dist/**/*.html` containing JSON-LD scripts, images, and anchors.

</code_context>

<specifics>
## Specific Ideas

- Save the sample schemas under `.planning/phases/06-qa-cwv-seo-verification/sample-schemas.json` so they are readily available for Google Rich Results Test verification.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 6-QA, CWV & SEO Verification*
*Context gathered: 2026-06-13*
