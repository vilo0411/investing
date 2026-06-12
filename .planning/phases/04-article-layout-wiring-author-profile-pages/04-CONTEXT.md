# Phase 4: Article Layout Wiring & Author Profile Pages - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 wires the Phase 3 EEAT components (Breadcrumb, KeyTakeaways, CitationBox, AuthorBox v2) into `ArticleLayout.astro` in the order Breadcrumb → Key Takeaways → TOC → Content → Citation box → AuthorBox v2 → Share/Related, builds a static `/author/[slug]` profile page from `src/data/authors.ts`, expands article JSON-LD (Person/Article/dateModified) to be sourced from `authors.ts`, and backfills `keyTakeaways`/citation display data for the 21 existing articles based on their existing body/sources (no body content rewriting beyond relocating the "## Key takeaways" section).

Out of scope for this phase: Homepage/category/trust page redesign (Phase 5), QA/CWV/SEO verification (Phase 6), any new component creation (Phase 3 already built KeyTakeaways/CitationBox/Breadcrumb/Disclaimer/AuthorBox v2/ComparisonTable).

</domain>

<decisions>
## Implementation Decisions

### Key Takeaways backfill (EEAT-10)
- **D-01:** Backfill `keyTakeaways: string[]` frontmatter for all 21 articles by copying the bullet list from each article's existing `## Key takeaways` markdown section into frontmatter (scripted or manual pass — content unchanged, just relocated).
- **D-02:** After copying, **remove** the `## Key takeaways` heading + bullet list from the article body so the bullets don't appear twice (once in the new `<KeyTakeaways>` component, once inline in the body). This is a structural relocation, not a content rewrite — bullet text stays verbatim.
- **D-03 (ArticleLayout wiring):** `ArticleLayout.astro` renders `<KeyTakeaways items={entry.data.keyTakeaways} />` reading directly from frontmatter — no remark plugin or runtime markdown parsing needed.

### Citations backfill (EEAT-10)
- **D-04:** Do NOT convert `sources: string[]` into structured `citations` objects for the 21 existing articles. Wire `entry.data.sources` directly into `<CitationBox sources={...} updatedDate={...} factCheckedDate={...} />`, using the existing `sources` fallback rendering already built in Phase 3 (D-04 of 03-CONTEXT.md). The `citations` structured field remains available for new articles but is not backfilled.
- **D-05:** Do NOT backfill `factCheckedDate` for the 21 articles — leave it empty/undefined so `CitationBox` falls back to displaying `updatedDate` ("Cập nhật lần cuối: ..."), which is accurate (no fact-check pass has actually occurred).

### /author/[slug] page (EEAT-06)
- **D-06:** `/author/[slug]` is a **full credibility/E-E-A-T profile page**, distinct in purpose from `/about/`: shows bio, role, experience, expertise, credentials, education, moneyPerspective, socialLinks, publishedIn — everything available in `src/data/authors.ts`. `/about/` remains the site/brand-story page (why the site exists, editorial mission); the two pages should not read as near-duplicates.
- **D-07:** `/author/[slug]` includes a list/grid of the author's published articles (reuse `ArticleList.astro` or its pattern), filtered to all articles since there is currently a single author — this is the primary EEAT "see everything this person has written" signal and the main substantive content of the page beyond the bio.
- Since there is only one author (`author.slug = "nguyen-viet-loc"`), `getStaticPaths()` for `/author/[slug]` can be a single static path, but should be written generically enough that adding a second author later (array in `authors.ts`) wouldn't require a structural rewrite — Claude's discretion on exact implementation, per Phase 2 D-01/D-02 (single object now, array-friendly naming).

### JSON-LD Person/Article (ARTL-02)
- **D-08:** Expand `articleSchema.author` in `ArticleLayout.astro` from the current minimal `{ "@type": "Person", "name": author.name, "url": "/about/" }` to a full Person object sourced from `authors.ts`:
  - `url` → `/author/{author.slug}` (not `/about/`)
  - `jobTitle` → `author.role`
  - `description` → `author.bio`
  - `knowsAbout` → `author.expertise`
  - `sameAs` → array of defined values from `author.socialLinks` (linkedin/twitter), omitted/empty if `socialLinks` is undefined
  - This should match what AuthorBox v2 displays — same underlying data, no new fields invented.
  - `dateModified` (already present via `updatedDate.toISOString()`) stays as-is — already correct per ARTL-02.

### Article layout reflow & breadcrumb integration
- **D-09:** `<KeyTakeaways items={...} />` renders as the **first child inside `.article-content`**, above `<slot />` (i.e., inside the existing 2-column grid's content column, alongside the TOC sidebar — not full-width above the grid). This is a minimal layout change; on mobile (where the grid collapses to 1 column per existing `@media (max-width: 1080px)` rule) it naturally appears above the body content with TOC hidden.
- **D-10:** Replace the existing inline `<nav class="breadcrumb">...</nav>` markup (and its scoped `.breadcrumb` CSS) in `ArticleLayout.astro`'s header with `<Breadcrumb items={items} />` from Phase 3. Build the `items` array (`Trang chủ → [Đầu tư →] {categoryTitle} → {title}`) using the same logic currently used for the inline nav and for `breadcrumbSchema`. The existing `breadcrumbSchema` JSON-LD block is unaffected — it's a separate, already-correct concern.
- **D-11:** Citation box and AuthorBox v2 wiring order in the article body: `<slot />` (content) → `<CitationBox ... />` → `<AuthorBox />` → `<ShareBar />` / `<RelatedArticles />`, replacing the current inline `.source-section` block (which duplicates what CitationBox now does).

### Claude's Discretion
- Exact script/method for the 21-article frontmatter backfill (D-01/D-02) — manual edits vs a one-off Node script, as long as result is correct per-article `keyTakeaways` arrays and cleaned bodies.
- `/author/[slug]` page markup/styling — follow established box patterns (border-left + `var(--surface)` + radius) from AuthorBox/CitationBox/KeyTakeaways; exact section ordering and headings within the credibility profile.
- `getStaticPaths()` implementation detail for single-author `/author/[slug]` (D-06 note on array-friendliness).
- Whether `.ymyl-note` (existing inline disclosure box in ArticleLayout) should be replaced with the Phase 3 `<Disclaimer />` component — not discussed, but `<Disclaimer />` (D-10ish in 03-CONTEXT.md) already wraps `site.disclosure` with the same visual pattern, so consolidating is reasonable if it doesn't change visible output.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints (giữ Astro, YMYL caution, tiếng Việt, content rewrite out of scope)
- `.planning/REQUIREMENTS.md` — ARTL-01, ARTL-02, EEAT-06, EEAT-10 (Phase 4 requirements)
- `.planning/ROADMAP.md` §Phase 4 — Goal and Success Criteria (4 criteria: component order, /author/[slug], JSON-LD from authors.ts, all 21 articles show backfilled Key Takeaways + Citation box)

### Codebase Maps
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/codebase/STRUCTURE.md`

### Prior Phase Context (data model, tokens, components this phase wires together)
- `.planning/phases/03-new-eeat-components/03-CONTEXT.md` — component props/contracts: KeyTakeaways (`items: string[]`, returns `null` if empty per D-03), CitationBox (`sources?`, `citations?`, `factCheckedDate?`, `updatedDate` per D-04/D-05), Breadcrumb (`items: {label, href?}[]`), AuthorBox v2 (links to `/author/{slug}`, hides credentials section if empty)
- `.planning/phases/02-eeat-data-model-schema-extensions/02-CONTEXT.md` — `src/data/authors.ts` author object shape (D-02: name, slug, role, bio, credentials, experience, expertise, avatar, socialLinks); `content.config.ts` schema (`keyTakeaways`, `citations`, `factCheckedDate`)
- `.planning/phases/01-design-token-foundation/01-CONTEXT.md` — design tokens used by all components (not directly affected by this phase but underlies all visual integration)

### Existing Code
- `src/layouts/ArticleLayout.astro` — primary file being rewired (component order, breadcrumb replacement, JSON-LD expansion, removal of inline `.source-section`)
- `src/components/{KeyTakeaways,CitationBox,Breadcrumb,AuthorBox,Disclaimer}.astro` — Phase 3 components being wired in
- `src/data/authors.ts` — source of truth for `/author/[slug]` page and JSON-LD Person expansion
- `src/components/ArticleList.astro` — pattern to reuse for the article list on `/author/[slug]` (D-07)
- `src/content/articles/*.md` — 21 articles needing `keyTakeaways` frontmatter backfill + body section removal (D-01/D-02); all currently have `sources: string[]` and empty `citations`/`factCheckedDate`/`keyTakeaways`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ArticleList.astro` — listing pattern for `/author/[slug]` article grid (D-07)
- `src/components/{KeyTakeaways,CitationBox,Breadcrumb,AuthorBox}.astro` — already built, prop contracts documented in 03-CONTEXT.md, ready to wire
- `src/data/authors.ts` — has all fields needed for both `/author/[slug]` (D-06) and JSON-LD Person expansion (D-08): bio, role, experience, expertise, credentials, education, moneyPerspective, socialLinks, publishedIn

### Established Patterns
- Box pattern (border-left 4px `var(--color-brand-900)` + `var(--surface)` + `var(--radius-md)`) shared across AuthorBox, CitationBox, KeyTakeaways — `/author/[slug]` sections should follow this for visual consistency
- 2-column grid for article body (`.article-body--toc` with `.article-content` + `.toc-sidebar`), collapses to 1 column under 1080px — KeyTakeaways placement (D-09) works with this existing collapse behavior
- Static frontmatter-driven content collection — no runtime markdown parsing/remark plugins currently in use; D-01/D-03 keep it that way

### Integration Points
- `ArticleLayout.astro` lines ~30-65 (`articleSchema`, `breadcrumbSchema` construction) — `articleSchema.author` expansion (D-08) and `items` array for `<Breadcrumb>` (D-10) both build on the existing `categoryTitle`/`categoryPath`/`isInvestingCategory`/`categoryGroupPath` variables already computed here
- `ArticleLayout.astro` header markup (~line 130) — inline `<nav class="breadcrumb">` replaced by `<Breadcrumb items={items} />` (D-10)
- `ArticleLayout.astro` article body (~line 165-195) — `.source-section` removed, replaced by `<CitationBox>`; `<KeyTakeaways>` inserted before `<slot />`; `<AuthorBox>` already present, position confirmed by D-11
- `src/content/articles/*.md` — all 21 files need: (1) `keyTakeaways:` array added to frontmatter from their `## Key takeaways` section, (2) that section removed from body

</code_context>

<specifics>
## Specific Ideas

- `/author/[slug]` page should feel like a "credibility dossier" — everything needed for E-E-A-T trust signals in one place, plus proof of output (article list).
- JSON-LD Person should mirror exactly what AuthorBox v2 shows — no schema fields invented beyond what's in `authors.ts`.
- Keep backfill changes to the 21 articles purely structural (move Key Takeaways bullets from body to frontmatter, remove the now-redundant section) — wording of bullets stays verbatim, per PROJECT.md "giữ nguyên nội dung" constraint.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Structured `citations` object backfill (beyond `sources` passthrough) and `factCheckedDate` backfill were explicitly decided against for this phase (D-04/D-05) rather than deferred — they remain available as opt-in fields for new articles going forward.

</deferred>

---

*Phase: 4-Article Layout Wiring & Author Profile Pages*
*Context gathered: 2026-06-12*
