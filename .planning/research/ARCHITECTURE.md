# Architecture Research

**Domain:** Astro 5 static SEO/educational site (Vietnamese personal finance, YMYL) — design-system overhaul + EEAT content components
**Researched:** 2026-06-10
**Confidence:** HIGH (based directly on the existing codebase map: `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `src/content.config.ts`, `src/styles/global.css`, `astro.config.mjs`, `package.json`)

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                     LAYER 0 — Design Tokens                          │
│  src/styles/tokens/*.css  (new)  →  imported by global.css           │
│  ┌──────────┐ ┌───────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │ color.css│ │type.css   │ │space.css│ │radius/ │ │ elevation.css│  │
│  │          │ │(font/scale)│ │         │ │shadow  │ │              │  │
│  └──────────┘ └───────────┘ └────────┘ └────────┘ └──────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│              LAYER 1 — Content Schema (data contract)                │
│  src/content.config.ts (Zod)  — additive, optional fields only       │
│  src/data/site.ts — categories, authors, brand config                │
├──────────────────────────────────────────────────────────────────────┤
│            LAYER 2 — Reusable EEAT Components (presentational)       │
│  ┌───────────┐ ┌────────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │KeyTakeaways│ │ComparisonTable │ │CitationBox /  │ │AuthorBox v2  │ │
│  │.astro      │ │.astro          │ │FactCheckBox   │ │.astro        │ │
│  └───────────┘ └────────────────┘ └──────────────┘ └──────────────┘ │
│  All consume only: design tokens (CSS vars) + typed Props/content    │
├──────────────────────────────────────────────────────────────────────┤
│        LAYER 3 — Content Authoring Surface (Markdown body)           │
│  src/content/articles/*.md                                            │
│  - "## Key takeaways" section → auto-rendered via remark/rehype      │
│    plugin into <KeyTakeaways> (NOT raw component embedding)          │
│  - Comparison tables → standard Markdown tables, restyled via CSS    │
│    + optional remark plugin to wrap tables in <ComparisonTable>      │
│  - sources/citations → frontmatter `sources` (extended shape)        │
│    rendered by <CitationBox> in layout, not inline in body           │
├──────────────────────────────────────────────────────────────────────┤
│         LAYER 4 — Layouts & Pages (composition / wiring)              │
│  src/layouts/{Base,Article}Layout.astro                                │
│  src/pages/**/*.astro (homepage, category, article, about, policy)    │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Design token layer (`src/styles/tokens/*.css`) | Single source of truth for color, type, spacing, radius, shadow, motion primitives | Plain CSS custom properties under `:root`, split by concern, imported into `global.css` |
| `global.css` (post-refactor) | Resets, base element styles, utility classes, imports tokens | Stays as the single stylesheet imported in `BaseLayout.astro`; becomes thinner |
| `KeyTakeaways.astro` | Renders a styled "tóm tắt ý chính" box from a list of bullet strings | Astro component, `Props: { items: string[] }`, scoped `<style>` |
| `ComparisonTable.astro` | Renders a styled, responsive data table for product/feature comparisons | Astro component, `Props: { caption?: string; columns: string[]; rows: (string\|number)[][] }` |
| `CitationBox.astro` (Fact-check/Citation) | Displays sources, last-reviewed date, fact-check note at end of article | Astro component, `Props: { sources: Source[]; updatedDate: Date; reviewedBy?: string }` |
| `AuthorBox.astro` v2 | Expanded author credibility block (credentials, experience, links) | Existing component extended with new `site.authorProfile` fields; same Props shape |
| Remark/rehype plugin (`scripts/remark-key-takeaways.mjs` or similar) | Detects `## Key takeaways` heading + following list in Markdown AST, replaces with component-equivalent HTML structure | Unified/remark plugin registered in `astro.config.mjs` `markdown.remarkPlugins` |
| `src/content.config.ts` | Validates frontmatter; gains optional EEAT fields | Zod schema, additive `.optional()`/`.default()` fields only |

## Recommended Project Structure

```
src/
├── styles/
│   ├── tokens/                    # NEW — design token layer, split by concern
│   │   ├── colors.css             # --color-*, semantic aliases (--brand, --surface, --text...)
│   │   ├── typography.css         # --font-*, --text-* scale, line-height, letter-spacing
│   │   ├── spacing.css            # --space-* scale
│   │   ├── radius-shadow.css      # --radius-*, --shadow-*
│   │   └── motion.css             # --transition*, easing tokens
│   ├── global.css                 # @import tokens/*.css ; resets ; base element styles ; utilities
│   └── components.css (optional)  # shared cross-component utility classes (e.g. .card, .eyebrow)
├── content.config.ts              # extended Zod schema (additive fields)
├── content/articles/*.md          # UNCHANGED authoring format (plain Markdown + frontmatter)
├── data/
│   └── site.ts                    # extended: authorProfile credentials, editorial policy links
├── components/
│   ├── ArticleList.astro          # existing — restyle with new tokens only
│   ├── AuthorBox.astro            # existing — extend Props/markup for credentials
│   ├── RelatedArticles.astro      # existing — restyle with new tokens only
│   ├── ShareBar.astro             # existing — restyle with new tokens only
│   ├── TOC.astro                  # existing — restyle with new tokens only
│   ├── KeyTakeaways.astro         # NEW
│   ├── ComparisonTable.astro      # NEW
│   └── CitationBox.astro          # NEW (Fact-check/Citation)
├── layouts/
│   ├── BaseLayout.astro           # imports global.css; header/footer restyle
│   └── ArticleLayout.astro        # wires KeyTakeaways/CitationBox/AuthorBoxv2 around <Content />
└── pages/
    ├── index.astro                # homepage redesign
    ├── [category].astro / dau-tu/[category].astro       # listing redesign
    ├── [category]/[slug].astro / dau-tu/[category]/[slug].astro  # article redesign
    ├── about.astro                # EEAT-upgraded
    └── editorial-policy.astro     # EEAT-upgraded

astro.config.mjs                   # add remark plugin for Key Takeaways detection (optional)
```

### Structure Rationale

- **`src/styles/tokens/`:** Splitting `global.css`'s `:root` block into focused token files makes the redesign reviewable in isolated PRs/phases (color separate from spacing separate from type), and lets the new design system be authored and validated (e.g., contrast checks) before any component consumes it. `global.css` keeps importing them so **every existing component that uses `var(--brand)`, `var(--surface)`, etc. keeps working unchanged** as long as variable *names* are preserved or aliased.
- **`src/components/` flat structure (no subfolders):** Matches existing convention (`ArticleList.astro`, `AuthorBox.astro` sit flat). Adding `KeyTakeaways.astro`, `ComparisonTable.astro`, `CitationBox.astro` alongside them keeps the `@/components/Name.astro` import pattern intact — no new aliasing rules needed.
- **No new content directory / no MDX migration:** `src/content/articles/*.md` stays `type: "content"` Markdown. Introducing MDX would require (a) adding `@astrojs/mdx`, (b) renaming every existing `.md` to `.mdx` or running a dual-collection setup, and (c) rewriting the content-production pipeline (`/approve` workflow in `CLAUDE.md`) to emit component imports — high blast radius for a "redesign, don't rewrite content" milestone. Keep Markdown; render new components via **layout wiring + AST transforms**, not inline JSX-like tags in article bodies.

## Architectural Patterns

### Pattern 1: Token-layer refactor with name preservation

**What:** Reorganize `:root` custom properties from one block in `global.css` into `src/styles/tokens/*.css`, imported via `@import` at the top of `global.css`. Preserve all currently-referenced variable names (`--brand`, `--surface`, `--text`, `--muted`, `--line`, `--radius-lg`, `--font-serif`, `--space-*`, etc.) as semantic aliases even if underlying raw values (`--color-brand-900`, etc.) change.

**When to use:** Phase 1 of the rollout (Horizontal Layer 0), before any component work begins.

**Trade-offs:**
- Pro: Zero changes required to any `.astro` file's `<style>` block in this phase — visual refresh happens "for free" across the whole site by changing token *values* only.
- Pro: New components (Key Takeaways, etc.) can immediately use the new tokens since they don't exist yet.
- Con: If the new design requires *new* semantic categories (e.g., a dedicated "alert/warning" color for fact-check boxes, or a distinct "table" border color), those must be added as *new* variables, not overloads of existing ones — avoids accidentally reskinning unrelated UI.

**Example:**
```css
/* src/styles/tokens/colors.css */
:root {
  --color-brand-900: #0a3d62;   /* new navy/professional palette */
  --color-brand-700: #1e5f8c;
  --color-accent: #c9a227;       /* new gold accent for EEAT badges */

  /* Preserve semantic aliases used across existing components */
  --brand: var(--color-brand-900);
  --brand-strong: var(--color-brand-700);
  --surface: var(--color-neutral-0);
  --text: var(--color-neutral-950);
  --muted: var(--color-neutral-700);
  --line: #dde3ea;

  /* New tokens for new components */
  --color-warning-bg: #fff8e1;
  --color-warning-border: #f0c14b;
  --color-info-bg: #eef4fb;
}
```

```css
/* src/styles/global.css */
@import "./tokens/colors.css";
@import "./tokens/typography.css";
@import "./tokens/spacing.css";
@import "./tokens/radius-shadow.css";
@import "./tokens/motion.css";

/* ─── Reset ─── (unchanged) */
```

### Pattern 2: New component as self-contained Astro island (Props-in, tokens-out)

**What:** Each new EEAT component (`KeyTakeaways.astro`, `ComparisonTable.astro`, `CitationBox.astro`) follows the exact existing convention: typed `Props` interface, destructure at top, scoped `<style>` block at bottom referencing only design tokens (`var(--...)`), no hardcoded colors/spacing.

**When to use:** Phase 2 (Horizontal Layer — components), after tokens are stable.

**Trade-offs:**
- Pro: Components are independently testable/visually-reviewable in isolation (e.g., a temporary `/dev/components` preview page) before wiring into `ArticleLayout.astro`.
- Pro: Matches `CONVENTIONS.md` exactly — no new patterns for future contributors to learn.
- Con: Components that need data not yet in frontmatter (e.g., `reviewedBy`, structured `sources`) are blocked until Layer 1 (schema) is extended — sequence schema changes *before* or *alongside* the components that need them, not after.

**Example:**
```astro
---
// src/components/KeyTakeaways.astro
interface Props {
  items: string[];
  title?: string;
}
const { items, title = "Tóm tắt nhanh" } = Astro.props;
---
<aside class="key-takeaways" role="note" aria-label={title}>
  <p class="kt-label">{title}</p>
  <ul>
    {items.map((item) => <li>{item}</li>)}
  </ul>
</aside>

<style>
  .key-takeaways {
    background: var(--color-info-bg);
    border-left: 4px solid var(--brand);
    border-radius: var(--radius-md);
    padding: var(--space-4) var(--space-6);
    margin: var(--space-8) 0;
  }
  .kt-label {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 0.78rem;
    color: var(--brand);
    margin: 0 0 var(--space-2);
  }
</style>
```

### Pattern 3: Markdown-body components via remark AST transform (no MDX)

**What:** For "Key Takeaways" — which already exists as a `## Key takeaways` H2 + bullet list convention in every article body (per `src/content/articles/etf-la-gi.md`) — write a small **remark plugin** registered in `astro.config.mjs` (`markdown.remarkPlugins`) that:
1. Finds the heading matching `/^key takeaways$/i` (or a Vietnamese variant `Tóm tắt nhanh` / `Điểm chính`)
2. Captures the immediately-following list
3. Removes both nodes from the tree and stashes the items
4. `ArticleLayout.astro` reads the stashed items (via `remarkPluginFrontmatter` / a custom AST data field exposed through `render(entry)`) and renders `<KeyTakeaways items={items} />` in a fixed position (top of article, after the H1/intro)

For **Comparison Tables**, the simplest and lowest-risk approach: keep authoring as **standard Markdown tables** (GFM, already supported by Astro's Markdown renderer) and apply `ComparisonTable`-equivalent styling via a `:global(table)` CSS rule scoped to the article content wrapper — i.e., **style the rendered `<table>` element directly**, rather than requiring a special component syntax. Promote to a true `ComparisonTable.astro` component **only if/when** MDX is later adopted; until then, CSS-targeting `.article-content table` achieves the same visual outcome with zero changes to the content pipeline.

**When to use:** Phase 2-3, once `KeyTakeaways.astro` exists and tokens are final. This is the **highest-risk-of-overengineering** piece — default to the CSS-only table styling path unless a comparison table genuinely needs interactive features (sorting, sticky headers) that plain CSS can't deliver.

**Trade-offs:**
- Pro: Zero changes to `src/content/articles/*.md` files or the `/approve` content workflow — existing 12+ articles with `## Key takeaways` "just work" once the plugin ships.
- Pro: Avoids MDX migration entirely (no new Astro integration, no schema duality).
- Con: Remark plugin adds a build-time dependency (`unist-util-visit` etc., often already transitive deps of `astro`/`@astrojs/markdown-remark` — verify via `npm ls unist-util-visit` before adding explicitly).
- Con: Heading-text matching is fragile to typos/variants — mitigate by checking both English and Vietnamese variants and falling back gracefully (if no match, article renders as before, just without the styled box).

**Fallback if remark plugin proves too fragile:** `ArticleLayout.astro` can instead post-process the rendered `headings` array (already available from `render(entry)` for TOC) to detect a "Key takeaways" heading and use **CSS-only styling** of the existing `<h2>## Key takeaways</h2>` + `<ul>` via `:global()` selectors targeting `h2:has(+ ul)` where the heading text matches — CSS `:has()` is supported in all current evergreen browsers (2023+). This is the **lowest-risk option** and should be the Phase 2 default; the remark-plugin approach is an optional Phase 3+ enhancement if more control (e.g., reordering the box to the top of the article) is needed.

## Data Flow

### Request Flow (Article Build)

```
astro build
    ↓
getStaticPaths() in [category]/[slug].astro
    ↓
getCollection("articles")  →  Zod-validated against content.config.ts (extended schema)
    ↓
render(entry)  →  { Content, headings, remarkPluginFrontmatter? }
    ↓
ArticleLayout.astro receives: entry (frontmatter incl. new EEAT fields), headings, Content
    ↓
ArticleLayout renders, in order:
  1. BaseLayout (head/nav/footer — new tokens applied globally)
  2. Article header (title, dates, author byline using site.authorProfile)
  3. KeyTakeaways (from remark-extracted items OR CSS-styled existing <h2>+<ul>)
  4. TOC
  5. <Content />  — body markdown, tables styled via .article-content table CSS
  6. CitationBox (from entry.data.sources, entry.data.updatedDate, entry.data.reviewedBy)
  7. AuthorBox v2 (from site.authorProfile, extended)
  8. ShareBar, RelatedArticles
  9. FAQ/Article JSON-LD (existing, unchanged)
    ↓
dist/{...}/index.html
```

### Token Cascade (Design System Flow)

```
src/styles/tokens/*.css  (new values defined here)
    ↓ @import
src/styles/global.css  (resets/base elements consume tokens)
    ↓ imported once
src/layouts/BaseLayout.astro  (<link>/import global.css — every page)
    ↓ inherited via CSS cascade (no JS, no props)
ALL src/components/*.astro <style> blocks  (var(--token-name))
ALL src/pages/*.astro inline <style> blocks
```
No component receives tokens as props — this is pure CSS cascade, meaning Phase 1 (token redesign) can ship and visually affect the *entire* site before any component-level work (Phase 2+) begins. This is the core enabler of the Horizontal Layers approach.

### Key Data Flows

1. **Token redesign → instant whole-site reskin:** Changing values in `src/styles/tokens/colors.css` / `typography.css` propagates to every page and every existing component (`AuthorBox`, `ArticleList`, `TOC`, etc.) without touching their markup or `<style>` blocks, because they all reference the same CSS custom property names. This is why tokens-first is both feasible and high-leverage.
2. **Frontmatter → CitationBox / AuthorBox v2:** New optional fields (`sources` restructured, `reviewedBy`, `factCheckedDate`, `authorProfile` extensions in `site.ts`) flow from `content.config.ts` (validation) → `entry.data` (page props) → `ArticleLayout.astro` → `CitationBox`/`AuthorBox` props. Because new fields are `.optional()`/`.default()`, **existing articles that lack them render with sensible fallbacks** (e.g., `sources` defaults to `[]`, CitationBox renders nothing or a generic "xem chính sách biên tập" link if empty).
3. **Markdown body → KeyTakeaways:** Either (a) remark plugin extracts `## Key takeaways` + list at build time and passes it via `render()`'s metadata channel to the layout, or (b) the heading+list renders inline as part of `<Content />` and is restyled in place via `:has()` CSS. Both require **zero changes to the 12+ existing article `.md` files**.
4. **Comparison data → ComparisonTable:** Authors write a standard GFM Markdown table inside the article body; `<Content />` renders it as `<table>`; `.article-content table` CSS (defined alongside `ComparisonTable.astro` styles, scoped via a shared class on the article wrapper) applies the new design. No frontmatter or schema changes needed for this feature.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (~dozens of articles, static site) | Token-first CSS cascade + a handful of new `.astro` components is sufficient. No build-time perf concerns — `astro check && astro build` remains fast. |
| 100s of articles | If `## Key takeaways` heading-matching via remark/`:has()` becomes inconsistent across many authors, consider promoting `keyTakeaways: string[]` to an explicit (optional) frontmatter field in `content.config.ts` — more robust than text-matching, and the content-production pipeline (`/approve` workflow) can be updated once to populate it. |
| 1000s of articles / multiple authors | Consider MDX adoption *only if* comparison tables need to become truly interactive (sortable/filterable) — at that point a dual-path (`.md` for simple articles, `.mdx` for data-heavy comparison/review articles) is more justifiable. Not needed for this milestone. |

### Scaling Priorities

1. **First "bottleneck":** Heading-text matching for Key Takeaways (Pattern 3) is a *content convention*, not a hard schema contract — as article volume grows, drift (typos, missing sections) will silently degrade EEAT presentation. Mitigation: document the `## Key takeaways` convention explicitly in `.antigravity/rules/seo-formatting.md` (already part of the content pipeline) so new articles keep using it; add it as an optional Zod field only if drift becomes a recurring QA finding.
2. **Second "bottleneck":** `src/data/site.ts` currently models a single author (`site.author`, `site.authorProfile`). If the EEAT upgrade introduces multiple author/reviewer profiles (common Investopedia/NerdWallet pattern: "Reviewed by X"), `site.ts` will need an `authors: Record<string, AuthorProfile>` map plus an optional `author`/`reviewedBy` field on the content schema referencing author IDs. This is a **schema + data-module change**, sequence it in Phase 1/2 (alongside token work) since `AuthorBox v2` and `CitationBox` both depend on it.

## Anti-Patterns

### Anti-Pattern 1: Introducing MDX or custom Markdown component syntax for this milestone

**What people do:** Reach for `@astrojs/mdx` so authors can write `<KeyTakeaways items={[...]} />` or `<ComparisonTable />` directly inside article Markdown, treating it as the "proper" way to embed components in content.

**Why it's wrong:** Requires renaming/migrating all `src/content/articles/*.md` → `.mdx` (or maintaining two collections), updating `src/content.config.ts` collection `type`, and — critically — rewriting the content-production pipeline's `/approve` workflow (defined in root `CLAUDE.md`) to emit JSX-like component tags. This is a major cross-cutting change explicitly **out of scope** ("Viết lại nội dung các bài viết hiện có" is out of scope, and a schema/format migration risks exactly that). It also couples the YMYL content authoring process (currently pure Markdown, reviewed by non-developers) to component APIs.

**Do this instead:** Use convention-based extraction (remark plugin or `:has()` CSS) for Key Takeaways, plain GFM tables + CSS for Comparison Tables, and frontmatter-driven props for CitationBox/AuthorBox. All three new "components" attach to the *existing* authoring surface without changing the `.md` format.

### Anti-Pattern 2: Renaming or removing existing CSS custom property names during token refactor

**What people do:** While reorganizing tokens into `src/styles/tokens/*.css`, rename `--brand` → `--color-primary`, `--surface` → `--bg-card`, etc., to "clean up" naming, then forget that 5 components and N article-page inline styles still reference the old names.

**Why it's wrong:** Every existing component (`AuthorBox.astro`, `ArticleList.astro`, `TOC.astro`, `ShareBar.astro`, `RelatedArticles.astro`, plus `BaseLayout`/`ArticleLayout`) references the current variable names directly in scoped `<style>` blocks (confirmed: `var(--brand)`, `var(--surface)`, `var(--line)`, `var(--muted)`, `var(--radius-lg)`, `var(--font-serif)`, `var(--space-*)`, `var(--color-brand-900)`, `var(--color-accent)`). Renaming breaks all of them silently (CSS custom properties fail silently — no build error, just visually broken/unstyled output), and `astro check` won't catch CSS variable typos.

**Do this instead:** Phase 1 changes token *values* and *organization* (which file defines what), but preserves all currently-referenced variable *names* as the public API of the token layer. Add new variables for new needs (e.g., `--color-warning-bg` for fact-check boxes); don't repurpose or rename existing ones. If a rename is truly desired, do it as a dedicated find-and-replace pass across all `.astro` files in the same commit, with a full `astro build` + visual diff as verification.

### Anti-Pattern 3: Making new content-schema fields required

**What people do:** Add `sources: z.array(z.object({ title: z.string(), url: z.string(), publisher: z.string() }))` (required, restructured) to support the richer `CitationBox`, replacing the current `sources: z.array(z.string()).default([])`.

**Why it's wrong:** `astro check`/`astro build` will fail for **every existing article** that has `sources: ["Investopedia", "..."]` (plain strings) because the shape no longer matches. This breaks the build for the whole site over a presentational change — directly violating the constraint "Schema changes... không phá build các bài viết hiện có."

**Do this instead:** Use a Zod union or a separate optional field:
```typescript
// Keep existing field working:
sources: z.array(z.string()).default([]),

// Add new optional richer field for new/updated articles:
citations: z.array(z.object({
  title: z.string(),
  url: z.string().url().optional(),
  publisher: z.string().optional(),
})).default([]).optional(),

// New EEAT metadata, all optional with sensible defaults:
reviewedBy: z.string().optional(),
factCheckedDate: z.coerce.date().optional(),
```
`CitationBox.astro` then renders `citations` if present, falling back to rendering the legacy `sources: string[]` as plain-text badges if `citations` is empty — both paths supported simultaneously, no existing article breaks, and articles can be incrementally upgraded to the richer `citations` shape over time (outside this milestone's scope, or as a fast-follow).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google Fonts (DM Serif Display, DM Sans) | `<link>` in `BaseLayout.astro` head | If the redesign changes typography (per `--font-serif`/`--font-sans` tokens), update font imports in `BaseLayout.astro` *and* `tokens/typography.css` together — both must agree on font-family names. |
| `astro-seo` | Used in `BaseLayout.astro` for meta tags | Unaffected by design-system/component changes; only touch if `description`/schema fields change due to new frontmatter. |
| `@astrojs/sitemap` | `astro.config.mjs` integration with custom `filter` | Unaffected unless new pages are added (e.g., a dedicated "Editorial Process" sub-page) — add to filter logic if new routes shouldn't be indexed yet. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `src/styles/tokens/*` ↔ all components | CSS custom property cascade (no imports/props) | Phase 1 work is isolated here; no `.astro` file frontmatter/markup needs to change for the token refresh to take visual effect. |
| `src/content.config.ts` ↔ content-production pipeline (`.agents/workflows/approve.md`, `CLAUDE.md`) | Shared frontmatter contract | Any new fields added to the Zod schema (even optional ones intended for EEAT) should be mirrored in the "Astro frontmatter bắt buộc" spec in `CLAUDE.md` so future `/approve`-generated articles can populate them — but existing articles must not be required to. |
| `src/data/site.ts` (`authorProfile`) ↔ `AuthorBox.astro` / `CitationBox.astro` | Direct import, module-level singleton | Both new/extended components should read author/credential data from `site.ts`, not duplicate it — keeps "single source of truth" per existing convention (`categoryMeta` pattern). |
| `ArticleLayout.astro` ↔ new components (`KeyTakeaways`, `CitationBox`) | Props passed from layout, derived from `entry.data` + `render(entry)` output | `ArticleLayout.astro` is the **composition point** — it's the only file that needs to "wire" all three new components together; individual components stay decoupled from each other. |
| Two parallel category route trees (`[category]/[slug].astro` vs `dau-tu/[category]/[slug].astro`) | Both call the same `ArticleLayout.astro` | New components only need to be wired into `ArticleLayout.astro` once — the existing duplicated-route anti-pattern (noted in codebase ARCHITECTURE.md) does NOT need fixing for this milestone, but be aware both route trees will pick up the new layout automatically since both delegate rendering to the same layout file. |

## Suggested Build Order (Horizontal Layers)

1. **Layer 0 — Design Tokens** (`src/styles/tokens/*.css`, refactored `global.css`)
   - Split and redefine color/typography/spacing/radius/shadow/motion tokens with new "professional YMYL" palette and type scale.
   - Preserve all existing variable names as aliases; add new tokens for upcoming components (warning/info backgrounds for CitationBox/KeyTakeaways).
   - Verify: full site visually reskins via `astro build` + manual review of homepage, category, article, about, editorial-policy — zero markup changes needed.

2. **Layer 1 — Content Schema & Data Extensions** (`src/content.config.ts`, `src/data/site.ts`)
   - Add optional fields: `reviewedBy`, `factCheckedDate`, `citations` (richer source objects), extended `authorProfile`/`authors` map in `site.ts`.
   - Verify: `astro check` passes with zero changes to existing `.md` files (all new fields optional/defaulted).

3. **Layer 2 — New Reusable Components** (`src/components/KeyTakeaways.astro`, `ComparisonTable`-equivalent CSS, `CitationBox.astro`, `AuthorBox.astro` v2)
   - Build each component against the new tokens (Layer 0) and new schema fields (Layer 1).
   - Build Key Takeaways extraction (remark plugin or `:has()` CSS — start with CSS, the lower-risk path).
   - Style `.article-content table` for comparison tables.
   - Verify: components render correctly with both populated and empty/default data (test against an existing article that lacks new fields).

4. **Layer 3 — Layout Wiring** (`src/layouts/ArticleLayout.astro`)
   - Compose KeyTakeaways, CitationBox, AuthorBox v2 into the article rendering order.
   - Verify against multiple existing articles across both route trees (`[category]/[slug]` and `dau-tu/[category]/[slug]`).

5. **Layer 4 — Page Redesigns** (homepage, category listing, about, editorial-policy)
   - Apply new tokens + any new shared components (e.g., trust badges on homepage, editorial process timeline on editorial-policy).
   - These pages are largely independent of each other — can be parallelized once Layers 0-3 are stable.

**Sequencing rationale:** Tokens (0) underpin everything visually and have zero dependencies. Schema (1) can technically run in parallel with tokens but must complete *before* Layer 2 components that need new fields (CitationBox, AuthorBox v2). Layer 2 components must exist before Layer 3 wiring. Layer 4 page redesigns depend on Layers 0-3 being stable so pages don't need re-touching after components change.

## Sources

- `.planning/codebase/ARCHITECTURE.md` (codebase map, 2026-06-10) — HIGH confidence, direct repo analysis
- `.planning/codebase/STRUCTURE.md` (codebase map, 2026-06-10) — HIGH confidence
- `.planning/codebase/CONVENTIONS.md` (codebase map, 2026-06-10) — HIGH confidence
- `src/content.config.ts`, `src/styles/global.css`, `src/components/AuthorBox.astro`, `src/content/articles/etf-la-gi.md`, `astro.config.mjs`, `package.json` — direct file reads, HIGH confidence
- `.planning/PROJECT.md` (milestone scope/constraints) — HIGH confidence

---
*Architecture research for: Astro static SEO site design-system overhaul + EEAT content components*
*Researched: 2026-06-10*
