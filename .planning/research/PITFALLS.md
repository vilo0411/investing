# Pitfalls Research

**Domain:** Redesign + EEAT upgrade of a live Astro SEO/educational finance site (YMYL, Vietnamese)
**Researched:** 2026-06-10
**Confidence:** MEDIUM-HIGH (general redesign/SEO/EEAT findings are well-documented industry consensus — HIGH; Astro-specific schema-evolution findings are HIGH from official docs; project-specific severity assessments are based on codebase audit — MEDIUM)

## Critical Pitfalls

### Pitfall 1: URL/route changes during redesign silently break SEO equity

**What goes wrong:**
A redesign that reorganizes navigation, renames categories, or changes the `[category]/[slug]` route structure changes URLs. Even with 301 redirects in place, sites commonly see a 10-25% traffic dip in the first 30 days post-launch, and full recovery can take 2-8 months. If redirects are missed, mapped wrong (302 instead of 301, or redirect chains/loops), or category slugs change without updating `src/data/site.ts` + redirect rules + sitemap, rankings for the affected pages can drop sharply and sometimes never fully recover.

**Why it happens:**
Redesign work focuses on visuals/layout and treats URL structure as "just routing," not realizing that the existing site already has `astro-seo`, `@astrojs/sitemap`, and redirects-for-old-URLs configured (per PROJECT.md context). A "redesign" that touches `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro`, or `src/data/site.ts` category slugs can inadvertently change live URLs even when the intent was purely visual.

**How to avoid:**
- Treat URL structure as **frozen** for this milestone unless explicitly redesigning IA. The PROJECT.md scope is visual/component redesign, not restructuring — enforce that boundary.
- Before any change, crawl/export the full current sitemap (21 articles + category pages + static pages) as a baseline.
- If any slug *must* change (e.g., category renamed for clarity), add a 301 redirect entry AND update internal links/anchor-index, not just the route file.
- Verify `robots.txt` and `sitemap-index.xml` still reference the correct production domain after any route changes.

**Warning signs:**
- Diff of generated `dist/` route list before/after a phase shows new or removed paths that weren't explicitly planned.
- `astro build` produces fewer or more HTML files than expected (currently 21 articles + N category/static pages).
- Internal links (anchor-index in `knowledge/3-pipeline/`) point to URLs that no longer resolve.

**Phase to address:**
Foundation/setup phase — establish a "frozen URL contract" and baseline crawl before any component or layout work begins. Re-verify in the final QA phase before any deploy.

---

### Pitfall 2: Core Web Vitals regression from new design system (CLS, font swap, larger CSS)

**What goes wrong:**
Adding new components (Key Takeaways box, Comparison Table, Citation/Fact-check box, upgraded Author Box) plus a full design token overhaul commonly introduces Cumulative Layout Shift — the most common causes are images/embeds without explicit `width`/`height`, web fonts swapping in with different metrics (FOUT/FOIT), late-injected banners/boxes shifting content below them, and CSS that animates layout-triggering properties (`top`, `width`, `margin`) instead of `transform`. A "redesign" can also balloon the global CSS bundle if old `global.css` tokens aren't fully removed and new ones are added on top.

**Why it happens:**
The existing brand uses `--font-serif` custom properties in `global.css` (per PROJECT.md). A new typography system means new font files/families. If the new fonts aren't preloaded with proper `font-display` and fallback metrics, every article page (the highest-traffic template) will reflow on load. New components inserted above-the-fold (Key Takeaways box at top of articles) without reserved space cause CLS the moment they render.

**How to avoid:**
- Define explicit dimensions/aspect-ratio or min-height placeholders for every new component (especially Key Takeaways, which sits at the very top of article content — highest CLS risk).
- Use `font-display: swap` with size-matched fallback fonts (use a font-metric-matching tool, e.g. Capsize or `next/font`-style fallback generation, even though this is Astro) to minimize font-swap shift.
- Audit and remove old design tokens from `global.css` rather than layering new tokens on top — PROJECT.md already flags `global.css` tokens "will be replaced," so do a clean replacement, not an addition.
- Run Lighthouse/PageSpeed on the article template (highest-traffic page type) before and after each major component addition, not just at the end.

**Warning signs:**
- Lighthouse CLS score climbs above 0.1 on article pages after adding a new component.
- `global.css` (or new equivalent) grows significantly larger without old rules being removed — check via build output CSS size.
- New web fonts added without corresponding `<link rel="preload">` or fallback font-family stack.

**Phase to address:**
Design system / token foundation phase (establish new tokens + typography with CWV budget) and again in the article-redesign phase (where Key Takeaways/Citation box are inserted above the fold). Add a CWV check to the QA/finalize phase for every phase that touches the article template.

---

### Pitfall 3: Retrofitting EEAT components into 21 existing articles via manual editing (scope creep + inconsistency)

**What goes wrong:**
PROJECT.md explicitly scopes this milestone as "giữ nguyên nội dung bài viết hiện có" (keep existing content unchanged) — only presentation changes. But adding **Key Takeaways**, **Citation/Fact-check box**, and **Comparison Table** components requires *some* per-article data (a takeaways list, inline citations mapped to the existing `sources` field, comparison data for relevant articles). If this is done by manually editing each of the 21 markdown files by hand, it risks (a) inconsistent quality/format across articles, (b) accidental content rewrites that violate the "no content rewrite" constraint and trigger anti-AI/content rules, and (c) schema drift where some articles have the new fields and others don't, causing component rendering to silently degrade or throw at build time.

**Why it happens:**
New components need structured data that doesn't exist yet (a `keyTakeaways: string[]` field, structured `citations` beyond the existing `sources` array). Teams under-scope this as "just add a component" without realizing the component needs new frontmatter fields across every existing article, which is itself a content-pipeline change, not just a UI change.

**How to avoid:**
- Make every new EEAT-related frontmatter field **optional with sensible fallback rendering** in the Zod schema (`.optional()`), per Astro's documented best practice for evolving content collection schemas without breaking existing entries.
- Design components to **degrade gracefully**: if `keyTakeaways` is absent, don't render the box (or auto-generate a minimal version from the existing `description`/intro paragraph as a stopgap) rather than failing the build.
- For the Citation/Fact-check box, reuse the existing `sources` array (already in schema per PROJECT.md) as the data source — don't invent a parallel citations field unless genuinely needed. This avoids touching all 21 files at all.
- If new fields are genuinely required (e.g., `keyTakeaways`), write a **one-time migration script** (Node script using `gray-matter` to parse/rewrite frontmatter) that runs across `src/content/articles/*.md`, rather than 21 manual edits — but flag this as a separate, explicit phase with its own review, since it touches content files and brushes against the "no content rewrite" constraint.
- Clarify with the user/PM early: is adding `keyTakeaways` content itself "content" (out of scope) or "structuring existing content" (in scope)? This ambiguity should be resolved before the phase that builds the Key Takeaways component.

**Warning signs:**
- New component renders correctly on 1-2 test articles but breaks/looks empty on others because frontmatter field is missing.
- `astro check` passes (because field is optional) but visual QA reveals inconsistent component presence across the 21 articles.
- Scope discussion reveals "we need to write takeaways for each article" — this is content work, needs separate tracking/approval per `.antigravity/rules/content-anti-ai.md`.

**Phase to address:**
Schema/data-modeling phase (define optional fields with graceful fallbacks) before component-build phases. A dedicated "content data backfill" phase (or explicit sub-task) if new structured fields are required, separate from pure component/visual phases.

---

### Pitfall 4: EEAT schema markup and Author/About content done superficially ("checkbox EEAT")

**What goes wrong:**
Common EEAT implementation mistakes for YMYL content: (1) generic/duplicate `Person`/`Organization` schema copy-pasted across all pages instead of per-author data, (2) author bio links pointing to broken or unpublished profile pages, (3) credentials stated in prose but not reflected in structured data (`Person.hasCredential`, `jobTitle`, `worksFor`), (4) generic legal-style disclaimers ("Đây không phải lời khuyên đầu tư") that read as boilerplate rather than genuine editorial-independence statements, and (5) Editorial Policy / About pages that describe a process but don't link back to it from articles (no "reviewed by," "last updated," or fact-check provenance visible on the article itself).

**Why it happens:**
EEAT is treated as a content-writing task ("add an About page") rather than a structured-data + cross-linking task. Schema markup for `Article`/`NewsArticle` + `Person` (author) + `Organization` (publisher) needs to be wired consistently across the `ArticleLayout.astro` (which already builds `articleSchema` per CONCERNS.md), the upgraded `AuthorBox.astro`, and the About page — but these are three separate files that can drift independently.

**How to avoid:**
- Define ONE canonical author/reviewer data source (e.g., `src/data/authors.ts`) used by: `AuthorBox.astro`, the About page, AND the JSON-LD `articleSchema` in `ArticleLayout.astro`. Single source of truth prevents the "duplicate/inconsistent schema" mistake.
- For each author entry, include real, verifiable fields: `jobTitle`, `description` (real bio with actual experience/credentials, in Vietnamese, no fabricated certifications), `url` (link to About/team page or real profile), `sameAs` (real social/professional profiles if they exist — omit field entirely if none, don't fake it).
- Editorial Policy page should describe a **specific, followable process** (who writes, who reviews, what sources are used, update cadence) — and the Citation/Fact-check box on articles should link back to this page, closing the loop Google's raters look for.
- Add `dateModified` (already likely have `updatedDate` per content schema) to JSON-LD and surface it visibly in the Citation box — "last updated" dates are a concrete, low-effort EEAT signal frequently missing.
- Validate all JSON-LD with Google's Rich Results Test / Schema.org validator as part of QA — not just "it builds."

**Warning signs:**
- Same `Person` JSON-LD block (name, credentials) appears identical across articles by different authors, or a single generic "ValueInvesting Team" author with no real bio.
- About page makes claims (e.g., "đội ngũ chuyên gia tài chính") not reflected anywhere in structured data or individual author pages.
- Citation box shows source URLs but no link to the Editorial Policy explaining methodology.
- Disclaimer text is identical boilerplate pasted on every page with no contextual relevance.

**Phase to address:**
Author/About/Editorial Policy upgrade phase, done in coordination with (not after) the JSON-LD schema work in `ArticleLayout.astro` and the new Citation/Fact-check box component — these should be designed together so the data model is shared.

---

### Pitfall 5: Design token migration breaks existing pages not in the redesign's "visible scope"

**What goes wrong:**
The codebase has large monolithic page files with inline `<style>` blocks (`index.astro` 686 lines, `about.astro` 421 lines, `ArticleLayout.astro` 353 lines, `search.astro` 261 lines, `dau-tu/[category].astro` 247 lines) per CONCERNS.md. If the redesign replaces global CSS custom properties (`--brand`, `--surface`, `--line`, `--muted`, `--radius-lg`, `--font-serif`) with new token names/values, any page with hardcoded color values or references to old token names that isn't explicitly part of the redesign scope (e.g., `search.astro`, error pages, FAQ schema rendering) will visually break — wrong colors, broken contrast, or unstyled elements — without failing the build (CSS errors are silent).

**Why it happens:**
"Redesign the homepage, category, article, about/editorial pages" (per PROJECT.md Active list) doesn't explicitly include `search.astro` or any 404/error page. If old tokens are removed from `global.css` as part of the new design system, every page still referencing `var(--brand)` etc. silently falls back to browser defaults (transparent/black), which is a visual regression invisible to `astro check` or `astro build` (no type system for CSS).

**How to avoid:**
- Before removing any old CSS custom property, grep the entire `src/` for every usage (`grep -rn "var(--brand)"` etc.) and produce a checklist of every file that references old tokens.
- Either (a) migrate ALL pages in the same phase that introduces new tokens (even if their layout isn't "redesigned," update their token references), or (b) keep old token names as aliases pointing to new values during a transition period, removing them only after all consumers are migrated.
- Explicitly add `search.astro` and any utility/error pages to the redesign checklist even though PROJECT.md doesn't name them — they will break silently otherwise.
- Visual regression check: build and screenshot every route (not just the "redesigned" ones) before/after the token swap.

**Warning signs:**
- `grep -r "var(--brand)\|var(--surface)\|var(--line)\|var(--muted)\|var(--radius-lg)\|var(--font-serif)"` returns hits in files outside the planned redesign scope.
- Visual diff of `search.astro` or other "untouched" pages shows broken styling after a design token phase.
- No CSS lint/stylelint configured to catch undefined custom property references (confirm — likely absent given no test tooling per CONCERNS.md).

**Phase to address:**
Design token foundation phase — must include a full-codebase token-usage audit, not just the pages explicitly listed for redesign. Add to phase success criteria: "all pages render without missing-token visual regressions."

---

### Pitfall 6: Category/route hardcoding in `src/data/site.ts` causes redesign to miss or duplicate categories

**What goes wrong:**
Per CONCERNS.md, category metadata and route generation are scattered across `src/data/site.ts` (139 lines), `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro`, and `src/pages/dau-tu.astro`, with no single source of truth and a fallback pattern (`categoryMeta` fallback) duplicated in `search.astro` and `ArticleList.astro`. A redesign of "category/listing pages" that updates the visual template in one route file but not the other (`[category].astro` vs `dau-tu/[category].astro`) produces two visually inconsistent category page styles in production — looking like an incomplete redesign to users and to Google (inconsistent UX signals hurt EEAT/quality perception).

**Why it happens:**
The redesign brief says "Redesign trang danh mục/listing (category pages)" as if it's one template, but the codebase actually has at least two separate route files implementing category listings with independent layouts.

**How to avoid:**
- Phase planning must explicitly enumerate ALL route files that render "category page" UI (`[category].astro` AND `dau-tu/[category].astro`, plus `dau-tu.astro` if it's a group landing page) and ensure the new design is applied to all of them, ideally by extracting a shared `CategoryListing` component used by both routes.
- Use this redesign as the opportunity to consolidate the duplicated `categoryMeta` fallback logic into a single `resolveCategoryMeta()` helper in `src/data/site.ts` (already recommended in CONCERNS.md) — reduces future drift.

**Warning signs:**
- After redesign, `/dau-tu/co-phieu` (or similar) and `/kien-thuc` (top-level category) look visually different despite both being "category pages."
- Grep for `categoryMeta` usage shows 3+ independent implementations still present after the redesign phase.

**Phase to address:**
Category/listing redesign phase — scope must include a route-file inventory step before design work starts.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Layer new design tokens on top of old `global.css` instead of clean replacement | Faster, less risk of breaking untouched pages immediately | CSS bloat, specificity conflicts, two token systems coexisting indefinitely | Never for this project — PROJECT.md already commits to full token replacement; do it cleanly with a usage audit |
| Make Key Takeaways/Citation components silently no-op when frontmatter data missing | Avoids touching all 21 articles immediately | Inconsistent EEAT signal across articles — some have boxes, some don't, looks unfinished to users/Google | Acceptable as a *temporary* MVP state only if followed by an explicit content-backfill phase; never as the final state |
| Skip visual regression testing on "untouched" pages (search, 404) | Faster phase completion | Silent breakage on pages outside redesign scope (Pitfall 5) | Never — minimal cost (manual screenshot pass) vs. high cost of silent prod breakage |
| Reuse existing `sources` array as-is for new Citation box without validating URLs/format | No schema change needed | Citation box may render dead links or inconsistent formats degrading EEAT instead of enhancing it | Acceptable for MVP if combined with a quick link-validation pass before launch |
| Hand-edit a few articles to test new components, defer the rest | Quick visual validation | Creates exactly the inconsistency described in Pitfall 3 if "defer" becomes permanent | Acceptable only as a prototyping step within a phase, with backfill explicitly tracked as next task |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `astro-seo` package | Assuming it auto-updates for new JSON-LD/EEAT schema needs (Person, Organization, dateModified) | `astro-seo` handles basic meta tags; EEAT-specific JSON-LD (`Article`, `Person`, `Organization` with credentials) likely needs hand-rolled `<script type="application/ld+json">` in `ArticleLayout.astro` — verify what `astro-seo` does vs. doesn't cover before assuming coverage |
| `@astrojs/sitemap` | Forgetting that sitemap regenerates from route output — if route structure changes even slightly (e.g., trailing slash behavior, new pages added), sitemap silently includes/excludes pages without an alert | After any route-level change, regenerate and diff `sitemap-index.xml` against the previous build's sitemap |
| Existing redirects for old URLs | Adding NEW redirects for this redesign without checking they don't conflict with or shadow the existing legacy redirect rules | Audit the full redirects config (likely `astro.config.mjs` or `_redirects`/`vercel.json` equivalent) for rule ordering/conflicts before adding new entries |
| Content collection Zod schema (`src/content.config.ts`) | Adding required new fields (e.g., `keyTakeaways: z.array(z.string())` without `.optional()`) | All new EEAT-related fields must be `.optional()` (or `.default()`) so the 21 existing articles don't fail `astro check`/build immediately; backfill data separately |
| Google Search Console | Not monitoring GSC during/after redesign, missing early signals of indexation drops or new crawl errors | Set up daily GSC checks for weeks 1-2 post-redesign-deploy, weekly through month 2-3 (per industry-standard migration monitoring) |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| New web fonts without preload/fallback metrics | High CLS/FOUT on article pages, Lighthouse flags "Ensure text remains visible during webfont load" | `font-display: swap` + size-adjusted fallback font stack; preload critical font files | Immediately on first article page load with new fonts |
| Comparison Table component with large datasets, no virtualization | Slow initial render/large DOM on comparison-heavy articles | Keep tables server-rendered (Astro static, no client JS needed for static comparison data); avoid client-side hydration for what's fundamentally static content | If comparison tables grow beyond a handful of rows per table — unlikely at current scale but design statically regardless |
| Client-side search index growth (existing issue per CONCERNS.md) | Inline JSON payload to browser grows linearly with article count | Already flagged — fine at 21 articles, revisit at ~200; redesign of search UI shouldn't make this worse (don't add more fields to the index without checking payload size) | ~200 articles |
| New components add client-side JS (e.g., interactive comparison table sorting, citation tooltips) | Increased JS bundle on article pages, hurts INP/TBT | Default to zero-JS Astro components; only add `client:` directives where genuinely interactive, and prefer `client:visible` over `client:load` | As soon as 2-3 components each ship their own hydration island |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Adding external embeds/widgets for Comparison Table data (e.g., live rate widgets from financial APIs) | Introduces third-party scripts that can hurt CWV and create CSP/privacy concerns on a previously fully-static site | If "comparison table" needs live data, keep it build-time fetched (Astro static fetch at build) rather than client-side third-party scripts — preserves the "no external API calls at runtime" architecture noted in INTEGRATIONS.md |
| Author bio "sameAs" / social links pointing to placeholder or fake profiles to "look more credible" | Directly contradicts EEAT goals if discovered (fake credentials = trust violation, potential manual action risk for YMYL sites) | Only include real, verifiable links; omit fields entirely rather than fabricate |
| New Editorial Policy / About content making unverifiable claims (team size, credentials, years of experience) | YMYL credibility risk; if later challenged, damages site trust score | Cross-check all factual claims in About/Editorial Policy with actual team composition before publishing — treat as content requiring the same anti-AI/fact rigor as articles |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Key Takeaways box pushes the actual article title/intro far below the fold | Users scroll past what they came for, increased bounce on mobile | Keep Key Takeaways compact (3-5 bullets, collapsible on mobile) and positioned after a brief intro, not replacing it |
| Citation/Fact-check box style doesn't match Vietnamese reading conventions (overly dense, English-style footnote numbering) | Confusing for the target audience, reduces perceived trust rather than increasing it | Localize citation presentation — Vietnamese readers may respond better to named-source inline mentions ("Theo Ngân hàng Nhà nước...") + a clean source list at the end, vs. academic footnote numbers |
| Comparison Table not responsive — wide tables on mobile (majority of VN traffic) | Horizontal scroll or unreadable squished tables on the device most users use | Design comparison table mobile-first: card-based stacking on small screens, full table on desktop |
| New Author Box adds many credentials/links that clutter every article | Visual noise, distracts from content, especially repeated on every article in a series | Compact author box on article (name, photo, 1-line credential, link to full profile) with full bio detail only on the About/team page |

## "Looks Done But Isn't" Checklist

- [ ] **301 redirects:** Often verified only for the "main" pages tested manually — verify EVERY existing indexed URL (cross-check against GSC's indexed pages list, not just the sitemap) still resolves (200 or proper 301), including old category URLs already in the existing redirect config.
- [ ] **JSON-LD validation:** Build succeeds and page "looks right," but JSON-LD `Person`/`Article`/`Organization` schema often has missing required fields (`url`, `image`, `datePublished`/`dateModified`) — validate every article template output with Google's Rich Results Test, not just visually.
- [ ] **New components on ALL 21 articles:** A component looks complete after testing on 2-3 sample articles, but renders empty/broken on articles missing the optional frontmatter field — spot-check across the full set, especially older articles with different schema history.
- [ ] **Mobile Core Web Vitals:** Desktop Lighthouse score looks great post-redesign, but mobile (majority of VN traffic) CLS/LCP often regresses due to font loading and image sizing differences — always test mobile throttled profile separately.
- [ ] **Search page (`search.astro`) and other "non-redesigned" pages:** Look fine in a quick click-through, but token migration (Pitfall 5) often leaves subtle broken styling (wrong colors, missing radius/spacing) that's only visible on close inspection or in production with real data.
- [ ] **Editorial Policy ↔ Citation box link-back:** Citation box is built, Editorial Policy page is rewritten, but nothing actually links them together — the EEAT "trust loop" (article → sources → editorial process → about) is incomplete without explicit cross-links.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|-----------------|
| URL/redirect breakage post-launch (Pitfall 1) | MEDIUM | Identify broken/missing redirects via GSC Coverage report + 404 logs; add missing 301 rules; request re-indexing via GSC URL Inspection for affected pages; monitor for 4-8 weeks |
| CWV regression from new design (Pitfall 2) | LOW-MEDIUM | Run Lighthouse/PageSpeed on affected templates; address top offenders (usually font-loading and a missing `width`/`height` or `aspect-ratio`); re-deploy and re-measure — fixes are usually CSS-only, no architecture change needed |
| Inconsistent EEAT components across articles (Pitfall 3) | MEDIUM | Run a backfill script auditing which articles have/lack new frontmatter fields; either add fallback rendering immediately (quick fix) or schedule a content-data pass to populate missing fields (proper fix) |
| Token migration breaks "untouched" pages (Pitfall 5) | LOW | Grep for old token references, patch remaining usages with new token equivalents (or add temporary alias mappings in the new token file) |
| Two divergent category page templates (Pitfall 6) | MEDIUM | Extract shared `CategoryListing` component retroactively, refactor both route files to use it — same work as doing it right the first time, just delayed |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|---------------|
| URL/redirect SEO loss (Pitfall 1) | Foundation/setup phase (baseline crawl + frozen URL contract) | Pre/post-launch sitemap diff is empty (or all changes have matching 301s); GSC coverage report shows no new errors after 2 weeks |
| CWV regression (Pitfall 2) | Design token & typography foundation phase + Article template redesign phase | Lighthouse CLS < 0.1 and LCP within budget on article template, mobile and desktop, before/after comparison documented |
| Inconsistent EEAT component retrofitting (Pitfall 3) | Schema/data-modeling phase (optional fields + fallbacks) before component build phases | All 21 articles render new components (or graceful fallback) without build errors; visual spot-check across oldest and newest articles |
| Superficial EEAT schema/Author/About (Pitfall 4) | Author/About/Editorial Policy phase, coordinated with Article schema (JSON-LD) work | Rich Results Test passes for `Article`, `Person`, `Organization` on sample articles; Editorial Policy linked from Citation box |
| Design token migration breaks untouched pages (Pitfall 5) | Design token foundation phase | Full-site grep for old token vars returns zero results; visual screenshot diff of ALL routes (not just redesigned ones) shows no unintended regressions |
| Divergent category page templates (Pitfall 6) | Category/listing redesign phase | Both `[category].astro` and `dau-tu/[category].astro` (and any other category-rendering routes) use a shared component; visual consistency confirmed across all category URLs |

## Sources

- [Site redesign checklist to preserve SEO & improve visibility - Search Engine Land](https://searchengineland.com/guide/site-redesign-seo-checklist)
- [Site Migration SEO Guide: Preserve Rankings & Traffic - Search Engine Land](https://searchengineland.com/guide/ultimate-site-migration-seo-checklist)
- [SEO Migration Checklist: How to Redesign Your Website Without Losing Rankings - Brand Vision](https://www.brandvm.com/post/seo-migration-checklist)
- [How to launch a new website without losing rankings: 8 tips - Morningscore](https://morningscore.io/how-to-launch-new-website-without-losing-rankings/)
- [Cumulative Layout Shift (CLS) - web.dev](https://web.dev/articles/cls)
- [How To Fix Cumulative Layout Shift (CLS) Issues - Smashing Magazine](https://www.smashingmagazine.com/2021/06/how-to-fix-cumulative-layout-shift-issues/)
- [Content collections - Astro Docs](https://docs.astro.build/en/guides/content-collections/)
- [E-E-A-T & YMYL SEO: The Complete 2026 Trust & Quality Guide - Outpace SEO](https://outpaceseo.com/article/eeat-seo/)
- [Enhancing YMYL Content with Schema: A Practical Guide - John Carey SEO](https://johncareyseo.co.uk/blog/ymyl-schema-guide)
- [How to Add Author & EEAT Schema for Personal Blogs - JoseOne](https://joseone.com/how-to-add-author-eeat-schema-for-personal-blogs/)
- [Author Schema Markup for SEO Success - JoseOne](https://joseone.com/author-schema-markup-for-seo-success/)
- Project codebase audit: `.planning/codebase/CONCERNS.md`, `.planning/codebase/INTEGRATIONS.md`, `.planning/PROJECT.md` (2026-06-10)

---
*Pitfalls research for: Astro YMYL finance content site redesign + EEAT upgrade*
*Researched: 2026-06-10*
