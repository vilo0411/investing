# Project Research Summary

**Project:** ValueInvesting.com.vn — Design system overhaul + EEAT/YMYL content components
**Domain:** Astro 5 static SEO/educational site (Vietnamese personal finance, YMYL)
**Researched:** 2026-06-10
**Confidence:** HIGH

## Executive Summary

This is a presentation-layer redesign of a live, static Astro 5 finance education site, modeled on Investopedia/NerdWallet patterns for E-E-A-T/YMYL credibility. The work splits cleanly into two tracks: (1) a design-token/typography overhaul that re-skins the entire existing site via CSS custom property cascade with zero markup changes, and (2) a set of new presentational components (Key Takeaways, Comparison Table, Citation/Fact-check box, upgraded Author Box + author profile pages) that close E-E-A-T gaps versus competitors.

The recommended approach is strictly additive and convention-preserving: no Tailwind, no UI kit, no MDX migration. Extend `global.css` with a layered token system (`src/styles/tokens/*.css`) while preserving all existing CSS variable names as aliases; add `astro-icon` for icons; extend `src/content.config.ts` with optional/defaulted fields only; introduce Markdown-table + CSS styling for comparison tables (no JS table library); and build new components as standalone `.astro` files following the existing Props+scoped-style convention. A single canonical `src/data/authors.ts` should back AuthorBox, author profile pages, the About page, and JSON-LD — preventing EEAT data drift.

The dominant risks are not technical novelty but **silent regressions on a live SEO asset**: URL/route changes breaking SEO equity, token renames silently breaking "untouched" pages (search.astro, error pages), Core Web Vitals/CLS regressions from new fonts and above-the-fold components, and inconsistent EEAT component rendering across the 21 existing articles if new frontmatter fields aren't optional with graceful fallbacks. Mitigation is procedural: freeze URL structure, full-codebase token-usage audit before any rename, CWV checks on the article template at every phase, and additive/optional schema fields validated against existing content.

## Key Findings

### Recommended Stack

No new framework or styling paradigm is needed. The existing Astro 5.9.3 + TypeScript strict + content collections (Zod) + scoped `<style>` + CSS custom property tokens convention is sufficient and should be extended, not replaced.

**Core technologies:**
- Astro 5.9.3 (existing, unchanged) — static site generation, framework constraint
- CSS custom properties in `src/styles/tokens/*.css` (new layer, imported by `global.css`) — single source of truth for the redesigned design system, zero runtime cost
- `astro-icon` + `@iconify-json/lucide` (new) — accessible, tree-shaken icon system for Key Takeaways, Citation box, badges, comparison tables
- Native `<table>` + W3C-pattern responsive CSS (no JS table library) — comparison tables are small, editorial, static — a JS data-table library would be pure overhead
- Optional: self-hosted variable fonts via Fontsource + Astro's experimental Fonts API — bundle with the typography redesign if typefaces change anyway, to avoid two CLS/perf passes

### Expected Features

**Must have (table stakes / P1 — this milestone):**
- Key Takeaways box (top of article)
- Citation/Fact-check box (end-of-article source list, "verified as of" date)
- Author byline (top, compact) + redesigned AuthorBox (bottom, expanded)
- Structured author data (`src/data/authors.ts`) — foundational dependency
- Author profile pages (`/author/[slug]`)
- Breadcrumb navigation (article + category)
- Comparison table component
- Homepage redesign (hero, category nav grid, featured articles, trust strip)
- Category page redesign (intro copy, redesigned cards, sibling nav)
- About page expansion + Editorial Policy expansion
- Disclaimer/risk-disclosure component

**Should have (P2 — follow-up milestone):**
- Reviewed-by/fact-checked-by block with schema extension (needs author profile infra first)
- Inline citation markers (incremental, new/updated articles only)
- Glossary auto-linking for jargon terms
- "Cập nhật lần cuối" changelog notes

**Defer (v2+ / P3):**
- Pagination on category pages (until article volume justifies it)
- Interactive calculators
- Hover-tooltip glossary
- Extended author "track record" pages

**Explicitly avoid (anti-features):** fake trust badges, popup CTAs on articles, real-time market data widgets, comment sections, full academic-style footnoting across all 21 articles, author pages as heavy CMS content collections.

### Architecture Approach

A 5-layer horizontal build order: (0) design tokens split into `src/styles/tokens/*.css` imported by `global.css`, preserving all existing variable names as aliases — this re-skins the whole site for free; (1) additive Zod schema + `src/data/site.ts` extensions (optional fields only: `reviewedBy`, `factCheckedDate`, `citations`, `authors` map); (2) new standalone components (`KeyTakeaways.astro`, `CitationBox.astro`, `AuthorBox` v2, comparison-table CSS) built against tokens+schema; (3) `ArticleLayout.astro` wiring as the single composition point; (4) page redesigns (homepage, category, about, editorial-policy) which can parallelize once 0-3 are stable. Key Takeaways uses convention-based extraction (CSS `:has()` or remark plugin) over the existing `## Key takeaways` heading — no MDX, no content-format changes.

**Major components:**
1. Token layer (`src/styles/tokens/*.css`) — single source of truth for color/type/space/radius/motion, consumed via CSS cascade by every existing and new component
2. New EEAT components (`KeyTakeaways`, `CitationBox`, `AuthorBox` v2, comparison-table styling) — Props-in/tokens-out, follow existing convention exactly
3. `src/data/authors.ts` + extended `content.config.ts` — canonical EEAT data backing AuthorBox, author profile pages, About page, and JSON-LD
4. `ArticleLayout.astro` — composition/wiring point for all new components into the article render order

### Critical Pitfalls

1. **URL/route changes silently break SEO equity** — freeze URL structure for this milestone; baseline-crawl the sitemap before any change; if a slug must change, add 301 + update anchor-index.
2. **CLS/CWV regression from new fonts and above-the-fold components** — explicit dimensions/min-height for new components (especially Key Takeaways), `font-display: swap` + fallback metrics, Lighthouse check on article template at every phase.
3. **Inconsistent EEAT component rendering across the 21 existing articles** — all new frontmatter fields `.optional()`/`.default()`, components degrade gracefully when data absent, reuse existing `sources` field rather than inventing parallel structures unless necessary.
4. **Token migration silently breaks "untouched" pages** (search.astro, error pages) — full `grep -rn "var(--brand)"` etc. audit before any rename; preserve old variable names as aliases; visual screenshot diff of ALL routes, not just redesigned ones.
5. **Two divergent category route trees** (`[category].astro` vs `dau-tu/[category].astro`) — enumerate and redesign both / extract a shared `CategoryListing` component to avoid an inconsistent-looking "incomplete redesign."

## Implications for Roadmap

### Phase 1: Design Token Foundation
**Rationale:** Zero dependencies, highest leverage — re-skins the entire site via CSS cascade with no markup changes, and unblocks all subsequent component work.
**Delivers:** `src/styles/tokens/*.css` (color, typography, spacing, radius/shadow, motion), refactored thinner `global.css`, new semantic tokens for upcoming EEAT components (`--color-info-bg`, `--color-warning-bg`, `--color-citation-bg`, table tokens).
**Addresses:** Typography/long-form readability redesign (modular type scale, `--measure: 65ch`, `--leading-relaxed`).
**Avoids:** Pitfall 5 (token migration breaks untouched pages) via full-codebase grep audit + name-preserving aliases; Pitfall 2 (CWV/CLS) via font-loading strategy decided here if typefaces change.

### Phase 2: EEAT Data Model & Schema Extensions
**Rationale:** Must complete before component build — components needing `reviewedBy`, `citations`, author credentials are blocked without this; doing it early avoids retrofitting.
**Delivers:** Extended `src/content.config.ts` (additive/optional fields: `citations`, `reviewedBy`, `factCheckedDate`), new `src/data/authors.ts` (canonical author/reviewer profiles), extended `site.ts`.
**Uses:** Astro content collections (Zod), existing `sources` field as fallback.
**Implements:** Layer 1 of architecture — data contract layer feeding AuthorBox, CitationBox, author pages, JSON-LD.
**Avoids:** Pitfall 3 (inconsistent retrofitting) via optional/defaulted fields with graceful fallback rendering.

### Phase 3: New EEAT Components
**Rationale:** Now that tokens (Phase 1) and schema (Phase 2) exist, build the new presentational components in isolation.
**Delivers:** `KeyTakeaways.astro`, `CitationBox.astro`, `ComparisonTable`-equivalent (Markdown table + `.article-content table` CSS), `AuthorBox.astro` v2, `astro-icon` integration, breadcrumb component, disclaimer component.
**Addresses:** Key Takeaways, Citation/Fact-check box, Comparison table, AuthorBox redesign, breadcrumbs, disclaimer (all P1 features).
**Avoids:** Pitfall 2 (CLS) via reserved space for above-the-fold Key Takeaways; Pitfall 4 (superficial EEAT) by wiring icons/badges to real data only.

### Phase 4: Article Layout Wiring + Author Profile Pages
**Rationale:** Compose Phase 3 components into the article render order; build `/author/[slug]` pages now that `authors.ts` exists.
**Delivers:** Updated `ArticleLayout.astro` (Key Takeaways → TOC → Content → CitationBox → AuthorBox v2 → Share/Related), `src/pages/author/[slug].astro`, JSON-LD updates (`Person`, `dateModified`).
**Implements:** Layer 3 (composition point) of architecture.
**Avoids:** Pitfall 4 (superficial EEAT/schema drift) by sourcing JSON-LD from the same `authors.ts` used by AuthorBox; Pitfall 3 by spot-checking across both old and new articles.

### Phase 5: Homepage, Category & Trust Pages Redesign
**Rationale:** Depends on Phases 1-4 being stable so these pages don't need re-touching after components change; can largely parallelize internally.
**Delivers:** Homepage (hero, category nav grid, featured/latest articles, trust strip), category page redesign across BOTH route trees (`[category].astro` and `dau-tu/[category].astro`, ideally via shared `CategoryListing` component), expanded About page, expanded Editorial Policy page with Citation-box cross-link.
**Addresses:** Homepage redesign, category page redesign, About/Editorial Policy expansion (all P1).
**Avoids:** Pitfall 5 (divergent category templates) via explicit route-file inventory and shared component; Pitfall 1 (URL/SEO loss) by keeping route paths frozen while changing only templates.

### Phase 6: QA, CWV & SEO Verification (cross-cutting / final)
**Rationale:** Closes the loop on the "looks done but isn't" risks that span all prior phases — must run after all visual/structural changes are in place.
**Delivers:** Full-route visual regression pass (including `search.astro` and error pages), Lighthouse/CWV check on article + homepage templates (mobile + desktop), Rich Results Test validation of JSON-LD across sample articles, sitemap diff vs. baseline, redirect/anchor-index verification.
**Avoids:** Pitfalls 1, 2, 4, 5 collectively — this is the safety net phase.

### Phase Ordering Rationale

- Tokens first because they have zero dependencies and provide instant whole-site value via CSS cascade (architecture's core enabler).
- Schema/data model before components because CitationBox, AuthorBox v2, and author pages all consume `authors.ts` and new optional frontmatter fields — building components first would mean rework.
- Components before layout wiring/pages because `ArticleLayout.astro` and page redesigns are composition points that depend on the components existing and being visually validated in isolation first.
- Homepage/category/trust pages last among "build" phases because they depend on stable tokens + components + author data (trust strip needs substantive About/Editorial pages).
- QA/CWV/SEO verification is a dedicated final phase because the pitfalls research shows these regressions are silent and cross-cutting — they won't surface from any single phase's own verification.

### Research Flags

Needs research during planning:
- **Phase 3 (New EEAT Components):** The Key Takeaways extraction mechanism (remark plugin vs. CSS `:has()`) needs a concrete decision/spike — architecture research recommends starting with CSS `:has()` as lower-risk but this should be validated against actual existing article markup.
- **Phase 6 (QA/CWV/SEO):** Needs research into current GSC setup, existing redirect config location (`astro.config.mjs` vs `_redirects`/`vercel.json`), and baseline sitemap export tooling.

Phases with standard, well-documented patterns (skip research-phase):
- **Phase 1 (Design Tokens):** Standard CSS custom property refactor, well-documented pattern in ARCHITECTURE.md with code examples.
- **Phase 2 (Schema Extensions):** Astro content collections + Zod additive-field pattern is officially documented and directly demonstrated in research.
- **Phase 4 (Layout Wiring):** Composition pattern is fully specified with example data flow in ARCHITECTURE.md.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Stable, well-trodden Astro/CSS ecosystem area; recommendations directly match existing project conventions; official docs for astro-icon and Astro Fonts API |
| Features | HIGH | Patterns verified against current NerdWallet editorial guidelines and general E-E-A-T/YMYL guidance; cross-checked with project's own schema/content state |
| Architecture | HIGH | Based directly on codebase map (ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, actual file reads of content.config.ts, global.css, AuthorBox.astro, etc.) |
| Pitfalls | MEDIUM-HIGH | General redesign/SEO/EEAT/CWV findings are industry consensus (HIGH); Astro schema-evolution findings are HIGH (official docs); project-specific severity assessments based on codebase audit (MEDIUM) |

**Overall confidence:** HIGH

### Gaps to Address

- **Key Takeaways extraction mechanism** (remark plugin vs. CSS `:has()`): needs a quick spike against real article markup before Phase 3 component build — flagged as a research item for that phase.
- **Whether writing actual `keyTakeaways` content for the 21 existing articles is in-scope** ("structuring existing content" vs. "content rewrite," which PROJECT.md excludes): needs explicit clarification with the user before Phase 3/4 — pitfalls research flags this as an unresolved scope ambiguity that affects whether a content-backfill phase is needed.
- **Location/format of existing redirect configuration** (astro.config.mjs vs. `_redirects`/`vercel.json`): not verified in research; needed for Phase 6 redirect-conflict checks.
- **Current GSC monitoring setup**: unknown whether Google Search Console access exists for post-launch monitoring (Phase 6 dependency).
- **Vietnamese diacritic rendering of any new typeface** (if typography is changed in Phase 1): flagged as needing verification against candidate fonts before finalizing.

## Sources

### Primary (HIGH confidence)
- [Astro Docs — Content Collections](https://docs.astro.build/en/guides/content-collections/) — Zod additive-schema pattern
- [Astro Docs — Experimental Fonts API](https://docs.astro.build/en/reference/experimental-flags/fonts/) and [Font Provider Reference](https://docs.astro.build/en/reference/font-provider-reference/)
- [Astro Icon](https://www.astroicon.dev/) — icon integration pattern
- [W3C WAI Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/) — accessible table semantics
- [web.dev — Cumulative Layout Shift](https://web.dev/articles/cls)
- `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `CONCERNS.md`, `INTEGRATIONS.md` — direct repo analysis
- Direct file reads: `src/content.config.ts`, `src/styles/global.css`, `src/components/AuthorBox.astro`, `src/content/articles/etf-la-gi.md`, `astro.config.mjs`, `package.json`

### Secondary (MEDIUM confidence)
- [NerdWallet Editorial Guidelines](https://www.nerdwallet.com/l/nerdwallet-editorial-guidelines) and [Editorial Team](https://www.nerdwallet.com/l/nerdwallet-editorial-team)
- [Search Engine Land — Site Redesign SEO Checklist](https://searchengineland.com/guide/site-redesign-seo-checklist) and [Site Migration Guide](https://searchengineland.com/guide/ultimate-site-migration-seo-checklist)
- [Smashing Magazine — Accessible Responsive Tables (Parts 1 & 2)](https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part1/) and [How To Fix CLS Issues](https://www.smashingmagazine.com/2021/06/how-to-fix-cumulative-layout-shift-issues/)
- [Semrush — E-E-A-T](https://www.semrush.com/blog/eeat/), [Search Engine Land — YMYL Guide](https://searchengineland.com/guide/ymyl), [Outpace SEO — E-E-A-T & YMYL 2026 Guide](https://outpaceseo.com/article/eeat-seo/)
- [JoseOne — Author & E-E-A-T Schema](https://joseone.com/how-to-add-author-eeat-schema-for-personal-blogs/), [Author Schema Markup](https://joseone.com/author-schema-markup-for-seo-success/), [John Carey SEO — YMYL Schema Guide](https://johncareyseo.co.uk/blog/ymyl-schema-guide)
- [Open Props](https://open-props.style/) — token taxonomy reference
- [Adrian Roselli — Responsive Accessible Table](https://adrianroselli.com/2017/11/a-responsive-accessible-table.html)

### Tertiary (LOW confidence)
- [Align — Top Fonts for Vietnamese](https://www.align.vn/blog/top-fonts-that-perfectly-support-vietnamese-language-design/) — Vietnamese font support, needs hands-on verification if typefaces change

---
*Research completed: 2026-06-10*
*Ready for roadmap: yes*
