# Phase 5: Homepage, Category & Trust Pages - Context

**Gathered:** 2026-06-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 redesigns the visitor-facing "trust" surfaces of the site on top of the Phase 1 design tokens and Phase 3 EEAT components: the homepage (hero + navigation grid + featured/latest articles + new trust strip), a shared `CategoryListing` component used by both category route trees (`[category].astro` and `dau-tu/[category].astro`), a rewritten `/about/` page (brand/mission story, distinct from the Phase 4 `/author/[slug]/` credibility profile), an expanded `/editorial-policy/` page, and a new standalone `/disclaimer/` page.

Out of scope: QA/CWV/SEO verification (Phase 6), any new reusable component beyond `CategoryListing` (Phase 3 already built Breadcrumb/Disclaimer/CitationBox/KeyTakeaways/AuthorBox/ComparisonTable — this phase wires/reuses them), rewriting article body content, `/author/[slug]/` changes (already complete in Phase 4).

</domain>

<decisions>
## Implementation Decisions

### `/about/` — brand/mission story (TRST-01)
- **D-01:** Rewrite `/about/` from its current near-duplicate of `/author/[slug]/` (same `author-hero`/`author-layout` markup) into a distinct brand/mission story page. `/author/[slug]/` remains the full credibility dossier (bio, credentials, experience, expertise, articles list); `/about/` becomes the "why this site exists" page.
- **D-02:** `/about/` content must cover all of the following (all selected by user, no "pick one"):
  1. **Mission/audience statement** — why ValueInvesting.com.vn exists, who it's for (người mới bắt đầu), how it differs from other sources (giáo dục, có nguồn, không khuyến nghị mua/bán, không room/tín hiệu giao dịch).
  2. **Summarized editorial process** — 2-3 step overview of the fact-check/review process, with a link to `/editorial-policy/` for full detail (don't duplicate the full policy text).
  3. **Author preview card** — small card (avatar/initial, name, role, 1-line bio) with a "Xem hồ sơ đầy đủ" CTA linking to `/author/{author.slug}/` — replaces the full `author-hero`/`author-layout` sections currently duplicated from the profile page.
  4. **Site stats** — keep the existing stat-stack (article count, category count, etc.) but reframe it as evidence supporting the brand-story narrative (e.g., "Quy mô nội dung") rather than as part of an author profile.
- **D-03:** Source author preview data from `src/data/authors.ts` (already the source of truth per Phase 2/4) — no new data file needed.

### Homepage trust strip (HOME-02)
- **D-04:** Trust strip is a **new, distinct section** placed after the hero section — not a modification of the existing `hero-trust-panel`/`trustStats` (which stays as-is in the hero). The strip is a horizontal row of 3-4 trust signals (e.g., "Có nguồn tham khảo", "Quy trình biên tập rõ ràng", "Không khuyến nghị mua/bán", "Cập nhật thường xuyên").
- **D-05:** Each trust-strip item links to one of the three TRST pages being built/expanded in this same phase: `/about/`, `/editorial-policy/`, `/disclaimer/`. All three pages must be linked from the strip (not just About + Editorial Policy) — creates a closed EEAT link loop from the homepage.
- **D-06:** Existing `hero-trust-panel`/`site.trustStats` content is untouched by this decision — the new strip is additive.

### Shared `CategoryListing` component (CATG-01)
- **D-07:** Extract a single `src/components/CategoryListing.astro` (or under a `src/layouts/` location if more layout-like — Claude's discretion on exact path) that takes `category` + `articles` props and renders the **entire page body**: hero (eyebrow/title/lead/article-count), breadcrumb, "Learning path" listing/grid, and sidebar. Both `[category].astro` and `dau-tu/[category].astro` reduce to `getStaticPaths()` + data fetching + rendering this one component — guarantees the two route trees are visually identical.
- **D-08:** While extracting, apply a light redesign pass: replace the current inline `<nav class="breadcrumb">` with the Phase 3 `<Breadcrumb items={...} />` component (same pattern as ArticleLayout D-10 in Phase 4), and ensure visual tokens match the Phase 1 design system (current category pages may still reference pre-redesign styling in places).
- **D-09:** Each route file's `getStaticPaths()` continues to determine which categories belong to which route tree (no change to the `group !== "Đầu tư"` vs `group === "Đầu tư"` filtering logic) — only the rendered body is shared.

### `/disclaimer/` page (TRST-03)
- **D-10:** Create a standalone `src/pages/disclaimer.astro`, styled consistently with the existing policy pages (`editorial-policy.astro`, `corrections-policy.astro` — `.article-header` + `.article-container.prose` pattern). Content expands on `site.disclosure` into a fuller explanation: educational-only scope, not personalized financial advice, no buy/sell recommendations, YMYL caution per `.antigravity/rules/`.
- **D-11:** The existing `<Disclaimer />` component (Phase 3, used inline on articles/other pages) is **not restructured** — it continues showing the short `site.disclosure` text. Add a "Xem chi tiết" / "Tìm hiểu thêm" link inside `<Disclaimer />` (or immediately adjacent to it) pointing to `/disclaimer/`, so the short inline notice and the full standalone page are connected.
- **D-12:** `/disclaimer/` is one of the three pages linked from the homepage trust strip (D-05).

### Editorial Policy expansion (TRST-02)
- **D-13:** Expand `/editorial-policy/` (currently 3 short sections: Nguyên tắc cốt lõi, Quy trình rà soát, Độc lập biên tập) with more detail on the fact-check process, and add an explicit reference to how the Citation/Fact-check box on articles (`<CitationBox />`, Phase 3) implements that process — i.e., describe what readers see on article pages (sources list + "Cập nhật lần cuối" date) and tie it back to the policy described here.
- This page is also one of the three trust-strip targets (D-05) and the target of the "Quy trình biên tập" summary link from `/about/` (D-02.2).

### Claude's Discretion
- Exact file location/name for the shared category component (`src/components/CategoryListing.astro` vs a layout file) — follow whichever matches existing conventions better once researcher/planner inspect the current `[category].astro` structure in detail.
- Exact wording/copy for `/about/` mission statement, trust-strip item labels, and `/disclaimer/` full text — must follow `.antigravity/rules/content-anti-ai.md` and YMYL caution; user reviews after.
- Visual treatment of the trust strip (icon style, card vs plain row) — follow established box/section patterns from Phase 1 tokens and Phase 3 components.
- Whether the homepage "featured/latest articles" sections (already largely present per ROADMAP Success Criteria #1) need any changes beyond what's already implemented — research should confirm current state against the 6 success criteria and flag any gaps.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints (giữ Astro, YMYL caution, tiếng Việt, content rewrite out of scope)
- `.planning/REQUIREMENTS.md` — HOME-01, HOME-02, CATG-01, TRST-01, TRST-02, TRST-03 (Phase 5 requirements)
- `.planning/ROADMAP.md` §Phase 5 — Goal and 6 Success Criteria

### Codebase Maps
- `.planning/codebase/STRUCTURE.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`

### Prior Phase Context (components/data this phase reuses)
- `.planning/phases/04-article-layout-wiring-author-profile-pages/04-CONTEXT.md` — `/author/[slug]/` page shape (D-06/D-07), Breadcrumb integration pattern (D-10), `src/data/authors.ts` field shapes used by `/about/` author preview card
- `.planning/phases/03-new-eeat-components/03-CONTEXT.md` — `<Breadcrumb items={...} />` (D-x), `<Disclaimer text?={...} />` prop contract, `<CitationBox sources?/citations?/factCheckedDate?/updatedDate />` for Editorial Policy reference
- `.planning/phases/02-eeat-data-model-schema-extensions/02-CONTEXT.md` — `src/data/authors.ts` author object shape (name, slug, role, bio, expertise, credentials, experience)
- `.planning/phases/01-design-token-foundation/01-CONTEXT.md` — design tokens (`src/styles/tokens/`) all new sections/pages must use

### Existing Code
- `src/pages/index.astro` — homepage; already has hero, `hero-trust-panel`/`trustStats`, topic grid, "Bắt đầu từ đâu", per-category sections, featured/latest articles
- `src/pages/about.astro` — current near-duplicate of `/author/[slug]/`, to be rewritten per D-01/D-02
- `src/pages/author/[slug].astro` — Phase 4 credibility profile page, source of preview-card pattern for `/about/`
- `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro` — both to be refactored onto shared `CategoryListing` (D-07–D-09)
- `src/pages/editorial-policy.astro` — to be expanded per D-13
- `src/pages/corrections-policy.astro`, `src/pages/sources-policy.astro` — style reference (`.article-header` + `.article-container.prose`) for new `/disclaimer/` page (D-10)
- `src/components/{Breadcrumb,Disclaimer,CitationBox}.astro` — reused per D-08/D-11/D-13
- `src/data/authors.ts` — source for `/about/` author preview card (D-03)
- `src/data/site.ts` — `site.disclosure`, `site.trustStats`, `categories`, `getCategoryPath`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/{Breadcrumb,Disclaimer,CitationBox,AuthorBox}.astro` — Phase 3 components ready to wire into category listing, disclaimer page, editorial policy, about page
- `src/pages/author/[slug].astro` — preview-card content (avatar initial, name, role, bio) can be extracted/reused for the `/about/` author preview card
- `src/pages/corrections-policy.astro` / `sources-policy.astro` — established policy-page pattern for the new `/disclaimer/` page

### Established Patterns
- Box pattern (border-left 4px `var(--color-brand-900)` + `var(--surface)` + `var(--radius-md)`) — used across AuthorBox/CitationBox/KeyTakeaways/Disclaimer, should extend to trust-strip items and about-page preview card
- `.article-header` + `.article-container.prose` — pattern for static policy pages, to be reused for `/disclaimer/`
- `getStaticPaths()` filtering by `category.group !== "Đầu tư"` vs `=== "Đầu tư"` — existing split between the two category route trees, preserved per D-09

### Integration Points
- `src/pages/index.astro` — insert new trust-strip section after the hero section, before/around the existing topic-grid section
- `[category].astro` / `dau-tu/[category].astro` — both reduce to `getStaticPaths()` + data fetch + `<CategoryListing category={category} articles={articles} />`
- `src/components/Disclaimer.astro` — add link to `/disclaimer/` (D-11) without changing its `text` prop contract
- `src/pages/editorial-policy.astro` — add new section(s) describing fact-check process + CitationBox reference, alongside existing 3 sections

</code_context>

<specifics>
## Specific Ideas

- `/about/` should read as "why this site exists / who it's for" — not a second author bio page. The author preview card on `/about/` is a small CTA card, not the full `author-hero`/`author-layout` treatment.
- Trust strip is a horizontal row of 3-4 short trust signals (e.g., "Có nguồn tham khảo", "Quy trình biên tập rõ ràng", "Không khuyến nghị mua/bán", "Cập nhật thường xuyên"), each linking to `/about/`, `/editorial-policy/`, or `/disclaimer/` — forms a closed EEAT link loop from the homepage.
- `/disclaimer/` follows the same visual pattern as `corrections-policy.astro`/`sources-policy.astro` (`.article-header` + `.article-container.prose`).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. All four discussed areas (About vs Author profile, Trust strip, CategoryListing component, Disclaimer page) map directly to TRST-01/02/03, HOME-02, and CATG-01.

</deferred>
