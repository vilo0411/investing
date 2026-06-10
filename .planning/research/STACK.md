# Stack Research

**Domain:** Design system + content-heavy UI components for a Vietnamese YMYL finance editorial site (Astro 5 static, scoped CSS, no Tailwind)
**Researched:** 2026-06-10
**Confidence:** HIGH (this is a stable, well-trodden area of the Astro/CSS ecosystem; no exotic dependencies needed)

## Context Recap (from codebase research)

The site is **Astro 5.9.3, TypeScript strict, content collections (Zod), no Tailwind/ESLint, scoped `<style>` blocks per `.astro` file, design tokens in `src/styles/global.css` as CSS custom properties** (`--brand`, `--surface`, `--line`, `--muted`, `--radius-lg`, `--font-serif`, `--font-sans`, etc.). Fonts currently loaded via Google Fonts `<link>` (DM Serif Display + DM Sans), per `BaseLayout.astro` comments.

The single most important stack decision for this milestone is: **do not introduce a CSS framework or component library**. Everything needed (design tokens, typography scale, accessible tables, key-takeaways/citation/author boxes, icons) can be built with vanilla CSS custom properties + scoped Astro components, which is exactly the existing convention. Adding Tailwind, a UI kit, or a JS table library would be a net-negative architecture change for a 5-component, presentation-only milestone.

## Recommended Stack

### Core Technologies (already in place — no change)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 5.9.3 (existing) | Static site generation | Already the project's framework; constraint says don't change it |
| CSS Custom Properties | native | Design tokens (color, type, spacing, radius, shadow) | Matches existing `global.css` convention exactly; zero new dependency; full browser support in 2025 |
| Scoped `<style>` in `.astro` | native | Component-level styling | Existing convention for all components; keep it |

### Supporting Libraries (new additions for this milestone)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `astro-icon` + `@iconify-json/lucide` | `astro-icon@^1.1`, `@iconify-json/lucide@^1` | Icon system for Key Takeaways, citation/fact-check box, author credentials, comparison tables (checkmarks, badges) | Use for ALL icons site-wide. Replaces ad-hoc inline SVGs/emoji. Tree-shaken — only icons referenced are bundled into the static output, so adding the package has zero runtime cost on a static build. |
| `@fontsource-variable/source-serif-4` and/or `@fontsource-variable/inter` (or keep Google Fonts `<link>` + adopt Astro's experimental Fonts API) | latest | Self-hosted variable fonts for long-form reading typography | Use if you want to drop the Google Fonts CDN dependency for performance/privacy (recommended for EEAT — faster, no third-party request). Variable fonts give you one file covering all weights (400–700) for both heading and body, reducing FOUT/CLS. |
| Astro experimental Fonts API (`astro:assets` fonts config, Astro ≥5.7) | built-in (5.9.3 already supports it) | Optimized font loading, preloads, fallback metric matching | Use instead of manual `<link>` Google Fonts tags if migrating to self-hosted/Fontsource fonts. Set `experimental: { fonts: [...] }` in `astro.config.mjs`. Optional — current `<link>` approach still works fine, this is a "nice to have" perf upgrade, not required for the component milestone. |

### Design Token / Typography Approach (no library — extend existing tokens)

| Approach | Purpose | When to Use |
|----------|---------|-------------|
| Extend `global.css` `:root` tokens with a **typographic scale** (e.g. `--text-xs` … `--text-4xl` using a modular scale like 1.25 ratio), **line-height tokens** (`--leading-tight`, `--leading-relaxed` ~1.7-1.8 for long-form body), and **measure tokens** (`--measure: 65ch` for optimal article line length) | Long-form reading typography for article body | Apply to `ArticleLayout.astro` body content; this is the single highest-impact typography change for EEAT/readability |
| Add **semantic color tokens for trust/EEAT components**: `--color-info-bg`, `--color-info-border` (Key Takeaways), `--color-citation-bg`/`--color-citation-text` (fact-check box), `--color-table-header-bg`, `--color-table-row-alt` (zebra striping for comparison tables) | New component styling without polluting brand palette | Add alongside existing `--surface-alt`, `--accent` tokens |
| Optional: **Open Props** (`open-props` npm package, just CSS custom properties, ~latest v1.x) as a *reference/source* for naming and scale values (not necessarily installed) | Inspiration for a complete, battle-tested token taxonomy (spacing scale, shadows, easing, sizes) | Use as a design reference to fill gaps in the current token set (e.g. shadow elevation steps, animation easings) rather than installing it as a dependency — installing it would create two token systems running in parallel, which conflicts with the existing single-source `global.css` convention |

### Accessible Tables (no library — semantic HTML + CSS)

| Approach | Purpose | When to Use |
|----------|---------|-------------|
| Native `<table>` + `<thead>`/`<tbody>` + `<th scope="col">`/`<th scope="row">` with a wrapping `<div class="table-scroll" style="overflow-x:auto">` | Comparison/data tables for financial product comparisons | This is the W3C/WAI-recommended pattern and is what NerdWallet/Investopedia effectively render under the hood for simple comparison grids. No JS table library (e.g. AG Grid, TanStack Table) is needed — these tables are small, static, and editorially authored, not user-sortable datasets. |
| CSS-only "responsive card" fallback for narrow viewports (`@media (max-width: 580px)`: convert rows to stacked key/value cards using `display: block` + `data-label` attributes via `::before { content: attr(data-label) }`) | Mobile comparison table readability | Apply when comparison tables have 4+ columns; for 2-3 column tables, horizontal scroll is sufficient and simpler |

## Installation

```bash
# Icons
npm install astro-icon @iconify-json/lucide

# Optional: self-hosted variable fonts (if migrating off Google Fonts CDN)
npm install @fontsource-variable/inter @fontsource-variable/source-serif-4
```

No dev dependencies needed beyond what already exists (`@astrojs/check`, `typescript`).

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| `astro-icon` + Iconify (Lucide set) | Heroicons / Phosphor / Tabler via separate npm packages, or hand-copied inline SVGs | Use a different Iconify set (e.g. `@iconify-json/tabler` or `@iconify-json/heroicons`) if the brand redesign settles on a different icon style — `astro-icon` supports any `@iconify-json/*` package interchangeably, so the choice of icon *set* is a design decision, not a stack decision. Hand-copied SVGs are fine for 2-3 one-off icons but don't scale to a full credibility/citation UI with 10-20 icons. |
| Vanilla CSS custom properties (extend `global.css`) | Tailwind CSS | Tailwind would be reasonable if this were a greenfield project or if the team wanted utility-first velocity across many new pages. Here it would mean maintaining two styling paradigms (existing scoped CSS + new utility classes) for a 5-component milestone — not worth the churn/risk. If a FUTURE milestone involves building many new page templates from scratch, Tailwind could be reconsidered project-wide at that point. |
| Self-hosted Fontsource variable fonts + Astro Fonts API | Keep current Google Fonts `<link>` (DM Serif Display + DM Sans) | Keep current approach if the redesign keeps the same typeface family — switching fonts AND switching loading mechanism in the same milestone increases risk. If the design system redesign changes typefaces anyway (likely, since "làm lại design system" includes typography), bundling the font swap with a move to self-hosted Fontsource fonts is efficient — one CLS/perf pass instead of two. |
| Native `<table>` + CSS responsive patterns | TanStack Table / AG Grid / DataTables.js | Only reconsider if a future milestone needs user-driven sorting/filtering of large datasets (e.g. an interactive stock screener). For editorially-curated comparison tables (3-8 rows, 3-6 columns), a JS table library is pure overhead on a static site and would introduce client-side JS bundle weight and hydration complexity that conflicts with the "static, no backend" constraint. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Tailwind CSS / UnoCSS | Introduces a second styling paradigm alongside existing scoped `<style>` + CSS vars; large refactor surface for a presentation-focused milestone; conflicts with "Constraints: keep existing tech stack" spirit | Extend `global.css` design tokens + scoped component styles (existing convention) |
| Component libraries (shadcn/ui, DaisyUI, Bootstrap, MUI, Radix) | These are React/Vue/Svelte-oriented or assume a utility CSS layer; pulling in a UI kit for 5 presentational components is massive overkill and would fight Astro's island-free static rendering model | Hand-built `.astro` components following existing `Props` interface + scoped style pattern |
| Font Awesome / icon font files | Icon fonts are an outdated 2015-era pattern — accessibility issues (icons read as garbled text by screen readers without careful `aria-hidden`), poor tree-shaking, larger payload than inline SVG | `astro-icon` with Iconify SVG sets (inlined, tree-shaken, accessible by default) |
| JS data-table libraries (AG Grid, TanStack Table, DataTables.js) | Static comparison tables don't need client-side sort/filter/virtualization; adding any of these means shipping a JS bundle + hydration for what should be zero-JS static HTML | Semantic `<table>` + CSS responsive patterns (W3C WAI tables tutorial pattern) |
| CSS-in-JS (styled-components, Emotion, vanilla-extract) | Astro's scoped `<style>` already provides component-scoped CSS at zero runtime cost; CSS-in-JS adds a JS runtime/build step with no benefit on a static site | Scoped `<style>` blocks (existing convention) |
| New global CSS reset/framework (e.g. Pico.css, normalize.css as a dependency) | `global.css` already has a working reset + token system; layering another reset risks specificity conflicts | Extend the existing `global.css` reset section directly |

## Stack Patterns by Variant

**For the 4 new content components (Key Takeaways, Comparison Table, Citation/Fact-check box, upgraded Author Box):**
- Build each as a standalone `.astro` component in `src/components/`, following the existing `Props` interface + scoped `<style>` pattern (per `CONVENTIONS.md`)
- Each component consumes new/extended Zod schema fields where needed (e.g. `keyTakeaways: string[]`, `lastFactChecked: date`, author `credentials: string[]`) — extend `src/content.config.ts` additively (all new fields with `.default()` to avoid breaking existing articles, per project constraint)
- Use `astro-icon`'s `<Icon name="lucide:check-circle" />` for checkmarks/badges in Key Takeaways and citation boxes
- Use new semantic CSS tokens (`--color-info-bg`, `--color-citation-bg`, etc.) defined in `global.css`, consumed via `var(--token)` in each component's scoped styles — exactly like existing components reference `var(--brand)`, `var(--surface)`

**For the typography/design-token redesign (global.css overhaul):**
- Define a modular type scale (`--text-sm` through `--text-4xl`) and apply `--leading-relaxed` (1.7) + `--measure` (65ch max-width) to the article body for long-form readability — this single change typically has the largest perceived "redesign" impact
- If swapping typefaces, do it as part of this same pass and consider self-hosting via Fontsource + Astro's experimental Fonts API for performance (avoids a second font-loading refactor later)

**If Vietnamese diacritics rendering needs verification:**
- Test any candidate typeface (especially serif display faces) against Vietnamese strings with all diacritic combinations (e.g. "ề", "ặ", "ữ", "ỗ") — not all "supports Vietnamese" Google Fonts render combining diacritics cleanly at small sizes. Prefer fonts explicitly listing the Vietnamese subset (e.g. Be Vietnam Pro, Inter, Source Sans 3, Noto Sans/Serif) over fonts where Vietnamese support is an afterthought.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| `astro-icon@^1.x` | Astro 5.9.3 | astro-icon 1.x targets Astro 4/5; verify `^1.1.0` or later for Astro 5 content-layer compatibility |
| `@iconify-json/lucide` | `astro-icon@^1.x` | Any `@iconify-json/*` package works as a drop-in icon set; package size doesn't matter for static builds (only used icons are inlined) |
| `@fontsource-variable/*` | Astro 5.7+ experimental Fonts API | Astro 5.9.3 already supports the experimental fonts config; if not using the Fonts API, Fontsource packages can still be imported as static CSS (`import '@fontsource-variable/inter'`) without any experimental flag |
| CSS custom properties / `light-dark()` / `:has()` | All evergreen browsers (2023+) | Safe to use modern CSS features (container queries, `:has()`, `light-dark()`) given a finance-education audience is overwhelmingly on modern browsers; no PostCSS/autoprefixer currently configured, so avoid bleeding-edge features without manual fallback |

## Sources

- [Astro Icon official site](https://www.astroicon.dev/) — confirmed `astro-icon` + Iconify integration pattern, MEDIUM-HIGH confidence (official docs)
- [astro-icon npm package](https://www.npmjs.com/package/astro-icon) — package details, MEDIUM confidence
- [Open Props](https://open-props.style/) and [GitHub](https://github.com/argyleink/open-props) — design token taxonomy reference, MEDIUM confidence
- [W3C WAI Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/) — accessible table semantics (`scope`, `<th>`, `<thead>`), HIGH confidence (W3C standard)
- [Smashing Magazine — Accessible Front-End Patterns For Responsive Tables (Parts 1 & 2)](https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part1/) — responsive table patterns, MEDIUM-HIGH confidence
- [Adrian Roselli — A Responsive Accessible Table](https://adrianroselli.com/2017/11/a-responsive-accessible-table.html) — card-fallback pattern for narrow viewports, MEDIUM confidence
- [Astro Docs — Experimental Fonts API](https://docs.astro.build/en/reference/experimental-flags/fonts/) — Astro 5.7+ font loading, HIGH confidence (official docs)
- [Astro Font Provider API Docs](https://docs.astro.build/en/reference/font-provider-reference/) — Fontsource/Google/Bunny provider config, HIGH confidence (official docs)
- [Google Fonts Vietnamese subset browser](https://fonts.google.com/?subset=vietnamese) and [Align — Top Fonts for Vietnamese](https://www.align.vn/blog/top-fonts-that-perfectly-support-vietnamese-language-design/) — Vietnamese diacritic font support, MEDIUM confidence

---
*Stack research for: Astro 5 design system + content UI components, Vietnamese YMYL finance site*
*Researched: 2026-06-10*
