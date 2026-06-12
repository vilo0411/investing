# Roadmap: ValueInvesting.com.vn — Redesign & EEAT Upgrade

## Overview

This milestone takes ValueInvesting.com.vn from its current navy/serif identity to a redesigned, EEAT-strengthened presentation layer — without changing URLs, content, or the underlying Astro/content-collection architecture. The work proceeds horizontally: a new design token layer re-skins the entire site first, then the EEAT data model (authors, citations, key takeaways schema) is extended, then new presentational components (Key Takeaways, Citation box, AuthorBox v2, breadcrumbs, disclaimer, comparison table) are built against that data, then wired into the article template and author profile pages, then the homepage/category/trust pages are redesigned on top of the now-stable component set, and finally a dedicated QA/CWV/SEO pass verifies nothing broke across the full route surface.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Design Token Foundation** - New token system re-skins the entire site via CSS cascade with zero markup changes (completed 2026-06-11)
- [x] **Phase 2: EEAT Data Model & Schema Extensions** - Canonical author data and additive content schema fields back all upcoming EEAT components (completed 2026-06-12)
- [ ] **Phase 3: New EEAT Components** - Key Takeaways, Citation box, AuthorBox v2, breadcrumb, disclaimer, comparison table built and validated in isolation
- [ ] **Phase 4: Article Layout Wiring & Author Profile Pages** - Article template composes new components in EEAT order; author profile pages and JSON-LD go live
- [ ] **Phase 5: Homepage, Category & Trust Pages** - Homepage, category listings, About, and Editorial Policy redesigned on the new system
- [ ] **Phase 6: QA, CWV & SEO Verification** - Full-site visual regression, Core Web Vitals, structured data, and URL-contract verification

## Phase Details

### Phase 1: Design Token Foundation

**Goal**: The entire site runs on a new, professional design token system (color, typography, spacing, radius/shadow, motion) without any page visually breaking, and long-form article reading is materially more comfortable.
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05
**Success Criteria** (what must be TRUE):

  1. New design tokens live in `src/styles/tokens/*.css` and are imported by `global.css`, replacing the previous ad-hoc token set
  2. All pre-existing CSS variable names (`--brand`, `--surface`, `--line`, `--muted`, `--space-*`, `--font-serif`, etc.) still resolve to valid values, so existing components render unchanged unless intentionally restyled
  3. Article pages display body text with a visually distinct type scale, ~1.7 line-height, and content width capped around 65ch
  4. The new brand font(s) render correctly with Vietnamese diacritics across major browsers
  5. Every route in the site (including `search.astro` and error pages) has been visually checked and shows no broken layout after the token swap

**Plans**: 3 plans
Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Build layered token system (colors/typography/spacing/effects/aliases) and restructure global.css imports + type-scale edits
- [x] 01-02-PLAN.md — Swap Google Fonts to Source Serif 4 + Inter and create DSGN-05 route audit checklist

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-03-PLAN.md — Build verification + manual DSGN-03/04/05 route and typography audit (checkpoint)

### Phase 2: EEAT Data Model & Schema Extensions

**Goal**: A single canonical source of author/reviewer data and an extended, backward-compatible content schema exist, ready to back every EEAT component built in later phases.
**Depends on**: Phase 1
**Requirements**: EEAT-01, EEAT-02
**Success Criteria** (what must be TRUE):

  1. `src/content.config.ts` accepts new optional fields (`citations`, `reviewedBy`, `factCheckedDate`, `keyTakeaways`, etc.) and all 21 existing articles still build successfully without supplying them
  2. `src/data/authors.ts` exists as the single source of author/reviewer profile data (name, credentials, experience, bio, slug)
  3. Existing `AuthorBox` and any current author references can resolve their data from `src/data/authors.ts` without duplication

**Plans**: 3 plans
Plans:
**Wave 1**

- [x] 02-01-PLAN.md — Extend content.config.ts schema with citations, keyTakeaways, factCheckedDate (EEAT-01)
- [x] 02-02-PLAN.md — Create src/data/authors.ts as single source of author/reviewer profile data (EEAT-02)

**Wave 2** *(depends on 02-02)*

- [x] 02-03-PLAN.md — Migrate AuthorBox, ArticleLayout, BaseLayout, about.astro, index.astro, site.ts to authors.ts (EEAT-02)

### Phase 3: New EEAT Components

**Goal**: All new presentational EEAT components exist as standalone, token-driven components and render correctly in isolation against both populated and empty/fallback data.
**Depends on**: Phase 2
**Requirements**: EEAT-03, EEAT-04, EEAT-05, EEAT-07, EEAT-08, EEAT-09
**Success Criteria** (what must be TRUE):

  1. A "Key Takeaways" component renders a summary box from either an existing `## Key takeaways` section or a frontmatter field, with reserved space to avoid layout shift
  2. A "Citation/Fact-check box" component renders a source list and last-updated date, sourced from existing `sources` data or new `citations`/`factCheckedDate` fields
  3. AuthorBox v2 displays author expertise, experience, and a link to the author's profile page, sourced from `src/data/authors.ts`
  4. A breadcrumb navigation component renders correctly for both article and category page contexts
  5. A disclaimer/risk-disclosure component and a consistently styled comparison table are available for use in financial-decision content

**Plans**: TBD

### Phase 4: Article Layout Wiring & Author Profile Pages

**Goal**: Readers see all new EEAT components composed into the article reading experience in a coherent order, can navigate to author profile pages, and structured data on article pages reflects real author/citation data.
**Depends on**: Phase 3
**Requirements**: ARTL-01, ARTL-02, EEAT-06, EEAT-10
**Success Criteria** (what must be TRUE):

  1. Article pages render, top to bottom: Breadcrumb → Key Takeaways → TOC → Content → Citation box → AuthorBox v2 → Share/Related
  2. Visiting `/author/[slug]` shows a profile page with the author's expertise, experience, and credentials from `src/data/authors.ts`
  3. JSON-LD on article pages (Person, Article, dateModified) is generated from `src/data/authors.ts`, matching what AuthorBox displays
  4. All 21 existing articles display Key Takeaways and Citation box content backfilled from their existing body/sources, without any rewritten body content

**Plans**: TBD

### Phase 5: Homepage, Category & Trust Pages

**Goal**: A visitor landing on the homepage, a category page, the About page, or the Editorial Policy page immediately perceives a professional, trustworthy financial publication with clear navigation and credibility signals.
**Depends on**: Phase 4
**Requirements**: HOME-01, HOME-02, CATG-01, TRST-01, TRST-02, TRST-03
**Success Criteria** (what must be TRUE):

  1. The homepage shows a hero section, a navigation grid to categories, and a list of featured/latest articles
  2. The homepage includes a "trust strip" linking to Editorial Policy and About
  3. Both category route trees (`[category].astro` and `dau-tu/[category].astro`) render a consistent redesigned listing, ideally via a shared `CategoryListing` component
  4. The About page presents detailed author/team expertise, experience, and credentials sourced from `src/data/authors.ts`
  5. The Editorial Policy page describes the fact-check process in detail and links to the Citation box concept used on articles
  6. A dedicated Disclaimer page/section explains the content's limitations and that it is not personalized financial advice

**Plans**: TBD

**UI hint**: yes

### Phase 6: QA, CWV & SEO Verification

**Goal**: After all visual and structural changes, the site is verified to have no regressions in layout, performance, structured data, or URL structure across the entire route surface.
**Depends on**: Phase 5
**Requirements**: QASE-01, QASE-02, QASE-03, QASE-04
**Success Criteria** (what must be TRUE):

  1. Every existing route (including non-redesigned pages) has been visually checked for regressions after the full token/component rollout
  2. Lighthouse/Core Web Vitals (especially CLS) on article and homepage templates meet acceptable thresholds on both mobile and desktop
  3. JSON-LD on sample article pages passes Google's Rich Results Test
  4. A sitemap diff confirms the URL structure is unchanged from before the redesign (frozen URL contract)

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design Token Foundation | 3/3 | Complete    | 2026-06-11 |
| 2. EEAT Data Model & Schema Extensions | 3/3 | Complete   | 2026-06-12 |
| 3. New EEAT Components | 0/TBD | Not started | - |
| 4. Article Layout Wiring & Author Profile Pages | 0/TBD | Not started | - |
| 5. Homepage, Category & Trust Pages | 0/TBD | Not started | - |
| 6. QA, CWV & SEO Verification | 0/TBD | Not started | - |
</content>
