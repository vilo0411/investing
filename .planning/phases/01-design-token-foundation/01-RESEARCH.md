# Phase 1: Design Token Foundation - Research

**Researched:** 2026-06-11
**Domain:** CSS design tokens / Astro static site theming / Web typography (Vietnamese)
**Confidence:** HIGH

## Summary

This phase is a pure CSS/typography refactor with zero new dependencies, zero new components, and zero markup changes. The work is: (1) split the existing monolithic `:root` token block in `src/styles/global.css` into layered token files under `src/styles/tokens/` (primitives → semantics), (2) swap the brand palette from green to a navy-dominant finance palette with full 50-900 scales for navy, neutral (tinted-navy gray), and gold accent, while deciding the fate of the existing green, (3) swap fonts from DM Serif Display + DM Sans to Source Serif 4 + Inter (both verified to have full Vietnamese glyph coverage at 400/500/700), (4) introduce a fluid `clamp()`-based type scale tuned for ~65ch / 1.7 line-height article reading, (5) expand `--transition` into three duration tokens, and (6) preserve every existing CSS custom property name via a `aliases-legacy.css` mapping layer so that none of the ~37 distinct `var(--...)` references across components/layouts break.

The codebase grep found 37 distinct custom-property names in active use across `src/components/*.astro`, `src/layouts/*.astro`, and `src/styles/global.css`. All of these must resolve to valid values after the swap — this is the hard constraint (DSGN-02). Because there are no automated visual regression tools in this repo, DSGN-05's full-route audit must be a manual checklist (13 distinct page templates, several with dynamic params).

**Primary recommendation:** Build the token system as primitives (`colors.css`, `typography.css`, `spacing.css`, `effects.css`) that define new `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--transition-*` variables, then a separate `aliases-legacy.css` that maps every pre-existing name (`--brand`, `--surface`, `--line`, `--muted`, `--bg`, `--text`, `--accent`, `--brand-strong`, `--surface-alt`, `--font-serif`, `--font-sans`, `--max`, `--article`, plus all `--color-*`/`--space-*`/`--radius-*`/`--shadow-*`/`--transition` names) onto the new primitives/semantics. `global.css` imports tokens first, then aliases, then keeps its existing reset/component CSS unchanged (only the `--transition` → `--transition-base` rename inside `global.css`'s own rules needs updating, or simply alias `--transition` to `--transition-base` so existing usages keep working verbatim).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Color/typography/spacing/effects tokens | CDN/Static (build-time CSS) | — | Pure CSS custom properties, compiled into static `dist/` assets, no runtime logic |
| Legacy variable name compatibility | CDN/Static (build-time CSS) | — | Alias layer is just additional CSS custom property declarations in `:root` |
| Font loading (Google Fonts) | Frontend Server (SSR/SSG head) | Browser | `<link>` tags emitted in `BaseLayout.astro` `<head>`, fetched by browser at render time |
| Article typography (clamp scale, 65ch, 1.7 lh) | CDN/Static (build-time CSS) | Browser (rendering) | Defined in `typography.css`/`prose` rules, browser computes `clamp()` per viewport |
| Route-by-route visual audit | Browser (manual QA) | — | No automated visual regression tooling exists in repo; must be human-driven checklist |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Source Serif 4 (Google Fonts) | variable, weights 400/500/700 | Heading/display serif | Editorial "financial journalism" feel; Adobe-designed, full Vietnamese subset `[VERIFIED: fonts.googleapis.com CSS API]` |
| Inter (Google Fonts) | variable, weights 400/500/700 | Body/UI sans-serif | Industry-standard UI sans, excellent screen legibility, full Vietnamese subset `[VERIFIED: fonts.googleapis.com CSS API]` |

No new npm packages are required for this phase — fonts are loaded via `<link>` to `fonts.googleapis.com` exactly as the current DM Serif Display + DM Sans setup does in `BaseLayout.astro`.

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | — | — | This phase introduces no new libraries — CSS custom properties + plain `@import` only, per existing convention |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Source Serif 4 + Inter | Lora + IBM Plex Sans | Both also have Vietnamese subsets, but not needed — D-08a verification (below) confirms primary pair has full coverage. Keep as documented fallback only if a future audit finds a rendering bug in a specific browser. |
| Plain CSS `@import` for token files | PostCSS `@import` inlining / bundler | Astro already inlines `@import`-ed CSS at build time when referenced from a component import; no extra tooling needed, and project explicitly avoids adding build dependencies (CLAUDE.md: no Tailwind/UI kit, minimal deps) |

**Installation:**
No installation needed — this phase only adds/edits `.css` files and updates the `<link>` tag in `BaseLayout.astro`. Confirmed no `package.json` changes required.

**Version verification:** N/A — no npm/pip/cargo packages introduced. Font versions are served live by Google Fonts CDN (`fonts.gstatic.com`); the CSS API response observed during this research returned `Inter v20` and `Source Serif 4 v14` static `.woff2`/`.ttf` files with the Vietnamese unicode-range subset present at all three target weights (400/500/700) `[VERIFIED: fonts.googleapis.com/css2 response, fetched 2026-06-11]`.

## Package Legitimacy Audit

**Not applicable** — this phase installs zero npm/pip/cargo packages. Only Google Fonts CDN links (already an established pattern in `BaseLayout.astro` for DM Serif Display/DM Sans) are added.

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## D-08a: Vietnamese Glyph Coverage Verification (CRITICAL)

Fetched the live Google Fonts CSS API (`https://fonts.googleapis.com/css2?family=...`) for both fonts at weights 400/500/700 `[VERIFIED: fonts.googleapis.com, fetched 2026-06-11]`. Both **Source Serif 4** and **Inter** emit an identical dedicated Vietnamese `@font-face` block at every one of the three weights:

```css
unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1,
                U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329,
                U+1EA0-1EF9, U+20AB;
```

**What this covers:**
- `U+0102-0103` (Ă/ă), `U+0110-0111` (Đ/đ), `U+01A0-01A1` (Ơ/ơ), `U+01AF-01B0` (Ư/ư) — all Vietnamese-specific base letters with breve/horn
- `U+1EA0-1EF9` — the full Latin Extended Additional block, which contains **every precomposed Vietnamese vowel+tone-mark combination** (ấ, ầ, ẩ, ẫ, ậ, ắ, ằ, ẳ, ẵ, ặ, ế, ề, ể, ễ, ệ, ố, ồ, ổ, ỗ, ộ, ớ, ờ, ở, ỡ, ợ, ứ, ừ, ử, ữ, ự, ỳ, ỵ, ỷ, ỹ, etc.) — i.e., dấu sắc/huyền/hỏi/ngã/nặng combined with â/ă/ê/ô/ơ/ư
- `U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329` — combining diacritical marks (for any decomposed-form fallback)
- `U+20AB` — the Vietnamese đồng currency symbol (₫)

**Conclusion:** Both fonts have **complete, verified Vietnamese diacritic coverage** at all three required weights (400/500/700). No fallback font is needed. D-05/D-08 (Source Serif 4 + Inter, weights 400/500/700) is confirmed safe to lock in as-is.

**Fallback (documented for completeness, not required):** If a future browser-specific rendering issue surfaces, Lora (serif) and IBM Plex Sans (sans) both also ship Google Fonts Vietnamese subsets `[ASSUMED — not independently verified this session, would need same CSS-API check before use]`.

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│ BaseLayout.astro <head>                                            │
│  - <link> Google Fonts: Source Serif 4 + Inter (400/500/700)      │
│  - import "@/styles/global.css"                                    │
└───────────────────────────┬────────────────────────────────────────┘
                             │ @import chain (build-time, Astro inlines)
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ src/styles/global.css                                              │
│  @import "./tokens/colors.css";                                    │
│  @import "./tokens/typography.css";                                │
│  @import "./tokens/spacing.css";                                   │
│  @import "./tokens/effects.css";                                   │
│  @import "./tokens/aliases-legacy.css";                            │
│  /* existing reset + component rules, UNCHANGED */                 │
└───────────────────────────┬────────────────────────────────────────┘
                             │
        ┌────────────────────┼─────────────────────┐
        ▼                    ▼                      ▼
┌───────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│ tokens/colors  │  │ tokens/typography │  │ tokens/spacing/effects│
│ --color-navy-* │  │ --font-serif/sans │  │ --space-1..24         │
│ --color-gold-* │  │ --type-h1..body   │  │ --radius-*            │
│ --color-neutral│  │ (clamp() scale)   │  │ --shadow-*            │
│ -*  (50-900)   │  │                   │  │ --transition-fast/    │
└───────┬────────┘  └─────────┬─────────┘  │   base/slow           │
        │                     │            └──────────┬────────────┘
        ▼                     ▼                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ tokens/aliases-legacy.css                                          │
│  --brand, --surface, --line, --muted, --bg, --text, --accent,     │
│  --brand-strong, --surface-alt, --font-serif, --font-sans,        │
│  --max, --article, --transition  → mapped to new primitives        │
└───────────────────────────┬────────────────────────────────────────┘
                             │ resolved at render time by browser
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ Existing components/layouts (UNCHANGED markup)                     │
│  ArticleList, AuthorBox, ShareBar, RelatedArticles, TOC,           │
│  ArticleLayout, BaseLayout — all reference var(--brand) etc.       │
│  → resolve through alias layer to new navy/gold values             │
└──────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
src/styles/
├── global.css              # imports tokens + aliases, keeps existing reset/component CSS
└── tokens/
    ├── colors.css           # primitives (--color-navy-50..900, --color-gold-50..900,
    │                         #            --color-neutral-50..900) + semantics (--brand, --text, etc. — NEW names)
    ├── typography.css        # --font-serif/--font-sans + clamp() type scale (--text-h1..--text-body)
    ├── spacing.css            # --space-1..--space-24 (unchanged values, just relocated)
    ├── effects.css            # --radius-*, --shadow-*, --transition-fast/base/slow
    └── aliases-legacy.css     # OLD name → NEW token mapping (DSGN-02 compatibility layer)
```

### Pattern 1: Two-Layer Token Architecture (Primitive → Semantic)
**What:** Primitives hold raw hex/rem/ms values (`--color-navy-700: #1e3a5f`). Semantics point to primitives (`--brand: var(--color-navy-700)`). Legacy aliases point to semantics or primitives (`--brand` already IS the semantic name in this case — see note below).

**When to use:** Always, per D-12. This is the standard design-token pattern (used by Tailwind, Radix, Material) — enables future re-theming by only touching the primitive layer.

**Important naming collision to resolve during planning:** The CURRENT `global.css` already uses `--brand`, `--surface`, etc. as ITS semantic layer, AND ALSO defines primitives like `--color-brand-900`, `--color-neutral-950`. The NEW system (D-12) will define NEW primitives `--color-navy-50..900`, `--color-gold-50..900`, `--color-neutral-50..900` (Tailwind-style full scales) and NEW semantics. The `aliases-legacy.css` file's job is to make OLD names (`--brand`, `--color-brand-900`, `--color-neutral-950`, etc.) resolve to the NEW primitive/semantic values — e.g. `--brand: var(--color-navy-800)` and `--color-brand-900: var(--color-navy-800)` (for any code that might still reference the old primitive name directly, though grep found none in components — only in `global.css`'s own `:root` which will be replaced).

**Example:**
```css
/* Source: tokens/colors.css (primitives) */
:root {
  --color-navy-50:  #eef3f9;
  --color-navy-100: #d9e6f5;
  --color-navy-500: #2c5282;
  --color-navy-700: #1e3a5f;
  --color-navy-900: #0a2540;

  --color-gold-50:  #fdf8ec;
  --color-gold-500: #c9952c;
  --color-gold-700: #92660a;

  --color-neutral-50:  #f7f8fa;  /* tinted navy-gray */
  --color-neutral-100: #eef1f5;
  --color-neutral-400: #94a3b8;
  --color-neutral-700: #475569;
  --color-neutral-900: #1a2330;

  /* Semantics */
  --brand: var(--color-navy-800, #163050);
  --brand-strong: var(--color-navy-600, #2c5282);
  --text: var(--color-neutral-900);
  --muted: var(--color-neutral-700);
  --surface: #ffffff;
  --bg: var(--color-neutral-50);
  --line: var(--color-neutral-100);
  --accent: var(--color-gold-500);  /* or green, see Open Questions */
}
```

```css
/* Source: tokens/aliases-legacy.css */
:root {
  /* Old primitive names referenced nowhere in components, but kept for safety
     in case global.css itself or a future diff still references them */
  --color-brand-900: var(--color-navy-800);
  --color-brand-700: var(--color-navy-600);
  --color-brand-100: var(--color-navy-50);
  --color-accent: var(--color-gold-500);
  --color-accent-soft: var(--color-gold-50);
  --color-neutral-950: var(--color-neutral-900);
  --color-neutral-0: #ffffff;

  /* --transition (singular, old name) -> base duration */
  --transition: var(--transition-base);
}
```

### Pattern 2: Fluid Type Scale with `clamp()`
**What:** Each heading/body size is defined as `clamp(min, preferred, max)` so it scales smoothly between mobile and desktop viewports without breakpoint-specific overrides.

**When to use:** All heading levels (h1-h3) and the article body (`.prose p`, `.prose li`). Per D-07, this replaces the current mixed approach (h1/h2 already use clamp, h3 and `.prose` do not).

**Formula basis** `[CITED: css-tricks.com/simplified-fluid-typography, moderncss.dev]`: `clamp(MIN_REM, MIN_REM + (MAX_REM - MIN_REM) * ((100vw - MIN_VW) / (MAX_VW - MIN_VW)) * 16, MAX_REM)` simplifies in practice to `clamp(MIN_REM, CALC_VW_TERM + REM_OFFSET, MAX_REM)`. Using a 320px→1280px viewport range (20rem→80rem):

```css
/* Source: tokens/typography.css — concrete clamp() values for this phase */
:root {
  /* Article body: ~1.05rem mobile -> ~1.125rem desktop, 1.7 line-height */
  --text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --leading-body: 1.7;

  /* Heading scale */
  --text-h1: clamp(2.25rem, 1.8rem + 2.25vw, 3.5rem);
  --text-h2: clamp(1.5rem, 1.3rem + 1vw, 2.25rem);
  --text-h3: clamp(1.15rem, 1.05rem + 0.5vw, 1.5rem);

  /* Article reading width (D-03 in REQUIREMENTS, already exists as --article) */
  --article: 65ch;
}
```

```css
/* Source: typography applied in global.css .prose rules */
.prose {
  font-size: var(--text-body);
}
.prose p,
.prose li {
  line-height: var(--leading-body); /* 1.7, was 1.8 */
}
.article-container {
  width: min(100% - 32px, var(--article)); /* 65ch ~ 720-740px depending on font metrics */
}
```

**Note on `--article`:** current value is `760px` (a fixed px). D-03/REQUIREMENTS asks for "~65ch". `65ch` in Inter at `1.0625rem` (~17px) is roughly 700-740px depending on the `0` glyph width — close enough to the existing 760px that switching the unit to `65ch` is a safe, intentional improvement, not a breaking change. Keep `--article` as the alias name (DSGN-02 lists it implicitly via `.article-container` usage), just change its value/unit.

### Pattern 3: Google Fonts Loading (unchanged mechanism, new font names)
**What:** Same `<link rel="preconnect">` + single `<link>` to `fonts.googleapis.com/css2` pattern already in `BaseLayout.astro`, just swap font family names and weight list.

**Example:**
```html
<!-- Source: src/layouts/BaseLayout.astro — REPLACE existing DM Serif Display + DM Sans link -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,700&family=Inter:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```
Note: Source Serif 4 is a variable font with an `opsz` (optical size) axis; including `opsz,wght@8..60,400` etc. lets the browser pick the optical size automatically, matching Google Fonts' recommended embed for this family. If the planner prefers the simpler non-variable request (`family=Source+Serif+4:wght@400;500;700`), that also works and was the form verified in this research — both return the same Vietnamese-covering `@font-face` blocks `[VERIFIED: fonts.googleapis.com response]`.

### Anti-Patterns to Avoid
- **Renaming variables in component files:** DSGN-02 explicitly forbids this. All 37 grep-found `var(--...)` names must continue to resolve. Do NOT touch `.astro` component/layout files in this phase except `BaseLayout.astro`'s font `<link>`.
- **Tinted shadows (rejected by D-13):** Keep `--shadow-sm/md/lg` as neutral black/gray rgba — do not switch to navy-tinted shadows even though the brand color changed.
- **New hover effects (rejected by D-15):** Do not add `transform: scale()`/lift effects to `.card:hover` etc. — only color/underline changes, to protect CLS (QASE-02, future phase but constraint applies now).
- **Hardcoding `--article` width changes inside component `<style>` blocks:** Change only the token value in `tokens/typography.css`; `.article-container` in `global.css` already references `var(--article)`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Vietnamese font subsetting | Custom `@font-face` + manual `unicode-range` declarations, self-hosted font files | Google Fonts `css2` API (existing pattern) | Google's CDN already serves the correct Vietnamese subset per-weight with optimal caching; self-hosting adds build complexity and risk of missing glyphs |
| Fluid type scale math | Ad-hoc per-element `clamp()` values guessed by eye | A small set of shared `--text-*` tokens computed once with a consistent min/max viewport pair (320px/1280px) | Consistency across h1/h2/h3/body; easier to audit DSGN-05 if all headings derive from the same scale ratio |
| Color contrast checking | Manual eyeballing | WCAG contrast ratio formula (relative luminance) — verified computationally in this research for proposed navy/gold/neutral combos | YMYL site — text legibility is both an accessibility and trust signal |

**Key insight:** Everything in this phase is achievable with plain CSS custom properties and the existing Google Fonts `<link>` pattern — there is no library to "not hand-roll" beyond avoiding self-hosted font subsetting and avoiding ad-hoc per-component clamp() values.

## Color Palette Recommendation (D-01/D-02/D-03/D-04/D-12)

All values below pass WCAG AA for normal text (4.5:1) where used as text-on-background; verified via relative-luminance contrast computation in this session `[VERIFIED: computed contrast ratios, see table]`.

### Navy primitive scale (`--color-navy-50..900`) — primary brand
| Step | Hex | Notes |
|------|-----|-------|
| 50 | `#eef3f9` | Light tinted backgrounds (e.g. `--surface-alt`) |
| 100 | `#d9e6f5` | Hover backgrounds, subtle highlights |
| 200 | `#b8cfe8` | Borders on dark sections |
| 300 | `#8fb3d9` | Disabled/muted accents |
| 400 | `#5f8fc4` | Secondary interactive elements |
| 500 | `#3d6fa8` | Mid-tone accents |
| 600 | `#2c5282` | `--brand-strong` — link hover, contrast 7.97:1 on white `[VERIFIED]` |
| 700 | `#1e3a5f` | Strong text/borders, contrast 11.50:1 on white `[VERIFIED]` |
| 800 | `#163050` | `--brand` primary — headings, nav, contrast >12:1 on white |
| 900 | `#0a2540` | Darkest — footer background, contrast 15.54:1 on white `[VERIFIED]` |

### Tinted neutral scale (`--color-neutral-50..900`) — text/background, navy-tinted gray (D-02)
| Step | Hex | Notes |
|------|-----|-------|
| 50 | `#f7f8fa` | `--bg` page background |
| 100 | `#eef1f5` | `--line` borders, replaces `#e2e8f0` |
| 200 | `#dde2ea` | Card borders |
| 300 | `#c3cbd6` | Disabled text |
| 400 | `#94a3b8` | Placeholder text |
| 500 | `#6b7a90` | Secondary text |
| 600 | `#5a677a` | — |
| 700 | `#475569` | `--muted` body-secondary text, contrast 7.58:1 on white `[VERIFIED]` |
| 800 | `#2e3947` | Strong muted |
| 900 | `#1a2330` | `--text` primary text (this hex already exists as `.prose p/li` color in current `global.css` — reuse it), contrast >12:1 on white |

### Gold/premium accent scale (`--color-gold-50..900`) — D-04
| Step | Hex | Notes |
|------|-----|-------|
| 50 | `#fdf8ec` | Badge background ("Editor's pick" tint) |
| 100 | `#faedc7` | Hover background for gold elements |
| 300 | `#edcb7a` | Decorative borders |
| 500 | `#c9952c` | Default gold accent (badges, icons) |
| 600 | `#ad7d1f` | — |
| 700 | `#92660a` | Text-on-white gold (e.g. "Premium" label text), contrast 5.09:1 on white — passes AA `[VERIFIED]` |
| 900 | `#5c4108` | Darkest, for text on light-gold backgrounds |

**WARNING:** Gold-500 (`#c9952c`) on white has insufficient contrast for body text (~2.8:1, fails AA) — use only for icons, borders, badge backgrounds with dark text on top, or large decorative text (≥24px bold, AA-large threshold 3:1). For any gold *text* on white/light backgrounds, use gold-700 or darker.

### Existing green (`#006b2c`) — placement decision (Claude's discretion per CONTEXT.md)
- `#006b2c` on white = 6.69:1 contrast `[VERIFIED]` — still AA-compliant if kept.
- **Recommendation:** Demote to a tertiary/secondary accent — e.g., map old `--color-accent`/`--color-accent-soft` (used for `.eyebrow` text and footer link hover) to a muted green token (`--color-green-700: #006b2c`, `--color-green-50: #eafaf0`) retained ONLY in `aliases-legacy.css`, not promoted into the new primitive palette. This avoids a "three primary brand colors" look (navy + gold + green all competing) while not deleting a working AA-compliant color outright. Final call belongs to planner/user once full palette is visualized — flagged as Open Question below.

## Common Pitfalls

### Pitfall 1: `@import` ordering breaks cascade / token resolution
**What goes wrong:** If `aliases-legacy.css` is `@import`-ed BEFORE the primitive/semantic token files, `var()` references inside it may resolve to nothing (CSS custom properties don't have a "not yet defined" forward-reference problem at parse time since they're resolved at computed-value time, but specificity/declaration-order for the SAME property name on `:root` still follows last-wins) — if both `colors.css` and `aliases-legacy.css` declare `--brand` with different values, the later `@import` wins.
**Why it happens:** CSS custom properties on the same selector (`:root`) are not merged additively across `@import`s in a "first wins" sense — last declaration of the same property wins.
**How to avoid:** Ensure NEW semantic names (`--brand`, `--text`, etc.) are defined exactly ONCE — either in `colors.css` (as the canonical semantic layer, since D-12 says semantics point to primitives) OR in `aliases-legacy.css` (if aliases ARE the semantic layer). Recommended: define semantics in `colors.css` directly alongside primitives (Pattern 1 above), and let `aliases-legacy.css` ONLY contain names that do NOT already exist as new semantics (i.e., truly legacy-only names like `--color-brand-900`, `--color-neutral-950`, `--color-accent`, `--transition`).
**Warning signs:** A component renders with browser-default colors (black text, no brand color) — inspect computed `--brand` value in devtools, check for duplicate `:root` declarations across token files.

### Pitfall 2: `astro check` / build doesn't catch CSS variable typos
**What goes wrong:** A typo in `aliases-legacy.css` (e.g., `--font-serfi` instead of `--font-serif`) silently falls back to the browser default font with NO build error — `astro check` only validates TypeScript/Astro syntax, not CSS custom property names.
**Why it happens:** CSS custom properties are inherently dynamic; there's no static analysis for `var(--name)` usage vs. declaration in this stack (no stylelint configured).
**How to avoid:** Build the alias map directly from the grep output in this research (37 names enumerated below) — treat it as a checklist. After implementation, grep `src/styles/tokens/*.css` for each of the 37 names to confirm each is declared at least once.
**Warning signs:** Visual diff shows system-default serif/sans-serif font (e.g., Times New Roman) on headings — means `--font-serif` resolution failed.

### Pitfall 3: `--article` unit change (`760px` → `65ch`) shifts layout width unexpectedly
**What goes wrong:** `ch` unit is based on the width of the `0` (zero) glyph in the CURRENT font. Since this phase ALSO changes the body font from DM Sans to Inter, `65ch` will compute to a different pixel width than it would have under DM Sans. Combined with the line-height change (1.8 → 1.7) and font-size change (1.05rem → fluid clamp), the article column width AND the apparent line length will both shift simultaneously.
**Why it happens:** Three interacting variables (font family, font size, content width unit) all change in the same phase.
**How to avoid:** After implementing, measure the actual rendered article column width in a browser at common viewport widths (375px, 768px, 1280px, 1920px) and confirm it lands in the ~680-760px range (typical "65ch" target for body text ~16-18px). If `65ch` computes too wide/narrow with Inter, it's acceptable to use a `ch`-based `clamp()` or a fixed px fallback with a comment explaining the ch-equivalent target.
**Warning signs:** Article body text lines feel noticeably longer or shorter than ~65-75 characters per line when visually scanned.

### Pitfall 4: Variable font weight requests pulling in unintended weights
**What goes wrong:** Requesting `family=Source+Serif+4:wght@400;500;700` via the `css2` API is correct, but if a component CSS uses `font-weight: 600` (semi-bold) anywhere, the browser will synthesize/fake-bold from 700, OR (worse) some browsers fetch the nearest available weight from the variable font's full range anyway, partially defeating the "minimize font weights for CWV" goal (D-08).
**Why it happens:** `font-weight: 600` doesn't match any of the three requested static weights (400/500/700).
**How to avoid:** Grep all `.astro` `<style>` blocks for `font-weight:` values after the swap and ensure only 400/500/700 (or `normal`/`bold` which map to 400/700) are used. Current `global.css` already has a `font-weight: 600` on `.mega-item-title` — flag this for the planner to either change to 500/700 or leave as a known minor exception.
**Warning signs:** `.mega-item-title` (font-weight: 600) and any other 600-weight usages found via grep.

## Code Examples

### Complete `--transition-*` expansion (D-14)
```css
/* Source: tokens/effects.css */
:root {
  --transition-fast: 100ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 350ms ease;

  /* legacy alias for any missed `var(--transition)` usage */
  --transition: var(--transition-base);
}
```
Current usages of `var(--transition)` (4 found in `global.css`: `.nav-links a`, `.nav-link-mega`, `.mega-item`, `.card`, `.footer-col a`) are all hover/color transitions — `--transition-base` (200ms) is the correct default mapping, matching the existing `150ms` value closely enough to be visually unnoticeable while standardizing on a round number.

### Full alias map (DSGN-02) — all 37 grep-found custom property names
```
Existing names that need to keep resolving (grouped by token file destination):

COLORS (-> tokens/colors.css semantics + aliases-legacy.css for old primitives):
  --brand, --brand-strong, --accent, --surface, --surface-alt, --bg, --text, --muted, --line
  --color-brand-900, --color-brand-700, --color-brand-100   (legacy primitives, alias-only)
  --color-neutral-950, --color-neutral-700, --color-neutral-400, --color-neutral-100, --color-neutral-0  (legacy primitives, alias-only)
  --color-accent, --color-accent-soft   (legacy primitives, alias-only — map to gold or green per Open Question)

TYPOGRAPHY (-> tokens/typography.css):
  --font-serif, --font-sans

SPACING (-> tokens/spacing.css, values UNCHANGED per D-11):
  --space-1, --space-2, --space-3, --space-4, --space-6, --space-8, --space-12, --space-16
  (note: --space-24 defined in current global.css but NOT found referenced anywhere via grep —
   keep it defined anyway for forward-compatibility, no harm)

EFFECTS (-> tokens/effects.css):
  --radius-sm, --radius-md, --radius-lg   (--radius-xl defined but not grep-referenced — keep anyway)
  --shadow-sm, --shadow-md, --shadow-lg
  --transition

LAYOUT (-> tokens/typography.css or a small layout section in spacing.css):
  --max, --article
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Single flat `:root` block with ~30 mixed-purpose tokens | Layered token files: primitives → semantics → legacy aliases | This phase (D-09/D-10/D-12) | Easier to re-theme; clearer ownership; slightly more files to navigate |
| 3-4 shade colors (`--color-brand-900/700/100`) | Full 50-900 Tailwind-style scales per color family | This phase (D-03) | More granular control for future components (badges, hover states, dark sections) |
| Fixed `760px` article width | `~65ch` fluid width | This phase (D-03/DSGN-03) | Width now adapts to font metrics; minor visual width shift expected (Pitfall 3) |
| DM Serif Display + DM Sans | Source Serif 4 + Inter | This phase (D-05/D-08a) | Both verified Vietnamese-complete; more "editorial finance" tone per Investopedia/NerdWallet reference |
| Single `--transition: 150ms ease` | `--transition-fast/base/slow` (100/200/350ms) | This phase (D-14) | More expressive motion vocabulary; `--transition` aliased to `--transition-base` for backward compat |

**Deprecated/outdated:**
- `--color-brand-*` (green-based primitives): superseded by `--color-navy-*`, kept only as aliases for backward compatibility, candidates for removal in a future cleanup phase once `aliases-legacy.css` usage is audited.
- DM Serif Display / DM Sans Google Fonts `<link>`: removed entirely, replaced by Source Serif 4 / Inter `<link>`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Lora + IBM Plex Sans as fallback fonts have full Vietnamese coverage | D-08a / Standard Stack | Low — fallback not needed since primary pair verified; only matters if a future browser bug forces a font swap |
| A2 | Specific hex values for navy/gold/neutral 50-900 scales are aesthetically appropriate for "Investopedia/NerdWallet" tone | Color Palette Recommendation | Medium — contrast math is verified, but exact hue/saturation choices are a design judgment call; planner should treat hex values as a strong starting point, adjustable by ±a few % lightness without breaking contrast significantly |
| A3 | `65ch` in Inter at the proposed font sizes will land near the previous `760px` width | Pattern 2 / Pitfall 3 | Medium — if it computes very differently, DSGN-03's "~65ch" requirement is still met (it's the source of truth), but visual continuity with current layout may shift more than expected; needs visual check during execution |
| A4 | `.mega-item-title`'s existing `font-weight: 600` is the only non-400/500/700 weight in the codebase | Pitfall 4 | Low — should be confirmed via grep during planning/execution; if more exist, they need similar handling |

## Open Questions

1. **Final placement of existing green (`#006b2c`)**
   - What we know: It's AA-compliant (6.69:1 on white), currently used for `.eyebrow` text, footer link hover, and the header gradient accent line.
   - What's unclear: Whether to keep it as a named "green" accent in the new token system (tertiary accent) or fully retire it to alias-only status.
   - Recommendation: Planner should present both options with a quick visual mock (navy + gold + green vs. navy + gold only) — defer final pixel-perfect decision to execution/visual-check step (DSGN-05 audit will reveal if removing green leaves any element looking bare, e.g., `.eyebrow` and the header top accent line).

2. **Exact `clamp()` viewport range (320px-1280px assumed)**
   - What we know: The formula approach and concrete starting values are documented above (Pattern 2).
   - What's unclear: Whether 1280px is the right "max" viewport for this site's actual traffic (could check analytics, but none referenced in planning docs).
   - Recommendation: Use 1280px as a sensible default (common desktop content-width breakpoint); planner can adjust the `vw` coefficients without changing the overall architecture.

3. **`--space-24` and `--radius-xl`** — defined in current tokens but not found via grep in any `.astro` file.
   - What we know: They exist in the current `:root` but appear unused.
   - What's unclear: Whether they're used in some file not covered by the grep pattern (e.g., inline styles, or a file type not scanned).
   - Recommendation: Keep them defined in the new token files regardless (zero cost, avoids any edge-case breakage) — do not spend planning effort hunting for usages.

## Environment Availability

Skipped — this phase is pure CSS/config changes within the existing Astro project. No new external tools, services, or runtimes are required. The existing `npm run dev` / `npm run build` / `astro check` toolchain (already verified working per `.planning/codebase/STRUCTURE.md`) is sufficient.

## Validation Architecture

> No automated test framework exists in this repo (`.planning/codebase/STRUCTURE.md`: "Testing: Not detected"). `workflow.nyquist_validation` config was not found set to `false`, so this section documents the manual/visual validation approach appropriate for a CSS-only phase.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none — manual visual verification + `astro check` for build-time type/schema validation |
| Config file | none — see Wave 0 |
| Quick run command | `npx astro check` (TypeScript/content schema validation — won't catch CSS issues but confirms build doesn't break) |
| Full suite command | `npm run build` (runs `astro check && astro build`, then manually preview `dist/` or `npm run preview`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-01 | New token files exist and are imported by `global.css` | smoke | `npm run build` (fails if `@import` path wrong) | N/A — created this phase |
| DSGN-02 | All legacy `var(--...)` names resolve to valid values | manual + smoke | `npm run build` succeeds + manual devtools inspection of computed styles on a sample page | ❌ Wave 0 — needs a checklist file |
| DSGN-03 | Article body: distinct type scale, ~1.7 line-height, ~65ch width | manual | Visual inspection on `[category]/[slug]` and `dau-tu/[category]/[slug]` pages at 375/768/1280/1920px | ❌ Wave 0 |
| DSGN-04 | Vietnamese diacritics render correctly in new fonts | manual | Visual inspection of a Vietnamese-heavy heading/paragraph (e.g., "Phân tích cơ bản: Định giá cổ phiếu") in Chrome/Firefox/Safari | ❌ Wave 0 |
| DSGN-05 | Every route audited, no broken layout | manual | Full route checklist (see below) — visit each route in dev/preview, screenshot or eyeball | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx astro check` (catches schema/type regressions, fast)
- **Per wave merge:** `npm run build` + manual spot-check of 2-3 representative pages (homepage, one article, search)
- **Phase gate:** Full DSGN-05 route checklist (below) walked manually before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] A markdown checklist file (e.g., `01-route-audit-checklist.md` in the phase dir, or inline in the plan) enumerating all 13 route templates + their dynamic instances for DSGN-05 — see full route inventory below
- [ ] No automated visual regression tooling exists; Wave 0 should NOT attempt to introduce one (out of scope per PROJECT.md constraints — no new build dependencies) — manual checklist is the correct sampling strategy for this phase
- [ ] Framework install: none required

## DSGN-05: Full Route Inventory for Audit Checklist

13 distinct page templates found under `src/pages/`:

| # | File | Route pattern | Dynamic instances | Notes |
|---|------|----------------|---------------------|-------|
| 1 | `src/pages/index.astro` | `/` | 1 (homepage) | Hero, featured grid |
| 2 | `src/pages/[category].astro` | `/{category}/` | per non-Đầu-tư category (phan-tich, reviews, nha-dau-tu, etc.) | Listing page, uses `.grid`/`.card`/`.article-list` |
| 3 | `src/pages/[category]/[slug].astro` | `/{category}/{slug}/` | per article in non-Đầu-tư categories | Article detail — `.prose`, TOC, AuthorBox |
| 4 | `src/pages/dau-tu.astro` | `/dau-tu/` | 1 | Đầu tư hub/landing |
| 5 | `src/pages/dau-tu/[category].astro` | `/dau-tu/{category}/` | per Đầu tư category (co-phieu, etf, quy-dau-tu, trai-phieu, phai-sinh) | Listing page |
| 6 | `src/pages/dau-tu/[category]/[slug].astro` | `/dau-tu/{category}/{slug}/` | per article in Đầu tư categories | Article detail |
| 7 | `src/pages/kien-thuc/[slug].astro` | `/kien-thuc/{slug}/` | per legacy article | Legacy route, excluded from sitemap but still built — must not visually break |
| 8 | `src/pages/search.astro` | `/search/` | 1 | Client-side search — check input/result card styling |
| 9 | `src/pages/about.astro` | `/about/` | 1 | Static policy page |
| 10 | `src/pages/contact.astro` | `/contact/` | 1 | Static policy page |
| 11 | `src/pages/editorial-policy.astro` | `/editorial-policy/` | 1 | Static policy page |
| 12 | `src/pages/corrections-policy.astro` | `/corrections-policy/` | 1 | Static policy page |
| 13 | `src/pages/sources-policy.astro` | `/sources-policy/` | 1 | Static policy page |

**No dedicated 404/error page exists** — `src/pages/404.astro` was not found. DSGN-05's "error pages" wording in the success criteria likely refers to ensuring the (currently default Astro 404) doesn't visually break — but since no custom 404 page exists, there is nothing to audit beyond confirming the default Astro 404 still inherits `global.css` correctly (it does, since Astro's default 404 uses no special layout — actually Astro's built-in 404 does NOT import `global.css` at all, so this is likely a non-issue / N/A for this phase). **Flag for planner:** confirm whether a custom `404.astro` should be created in this phase or deferred — currently out of the 5 success criteria's literal scope (no 404.astro file exists to "break").

**Audit approach recommendation:** For each of the 13 templates, visit ONE representative instance (e.g., one article from `[category]/[slug]`, one from `dau-tu/[category]/[slug]`, one category listing from each tree) at 4 viewport widths (375px, 768px, 1024px, 1440px) in `npm run dev` or `npm run preview`. Total: ~13 templates × 1 instance × 4 viewports = manageable manual checklist (~52 checks), not 21 articles × 13 templates.

## Security Domain

Not applicable — this is a static CSS/typography phase with no user input, authentication, data handling, or external API calls. `security_enforcement` considerations (ASVS categories) do not apply to CSS custom property changes on a static site. Confirmed no `.env`, secrets, or runtime config touched.

## Sources

### Primary (HIGH confidence)
- `fonts.googleapis.com/css2` API responses (fetched live 2026-06-11) — confirmed Vietnamese unicode-range subset for Source Serif 4 and Inter at weights 400/500/700
- Codebase grep of `src/components/*.astro`, `src/layouts/*.astro`, `src/styles/global.css` — complete enumeration of 37 active CSS custom property names
- `src/styles/global.css`, `src/layouts/BaseLayout.astro` — full read of existing token block and font-loading pattern
- `.planning/phases/01-design-token-foundation/01-CONTEXT.md` — locked decisions D-01 through D-15
- `.planning/codebase/{ARCHITECTURE,CONVENTIONS,STRUCTURE}.md` — project conventions and route inventory cross-check

### Secondary (MEDIUM confidence)
- WCAG contrast ratios computed via standard relative-luminance formula (Python script, this session) for proposed navy/gold/neutral hex values
- CSS-Tricks / ModernCSS.dev `clamp()` fluid typography formula references `[CITED]`

### Tertiary (LOW confidence)
- Tailwind default blue scale hex values (general training knowledge, used only as a sanity reference for "Tailwind-style scale" shape — actual proposed hex values in this research are custom navy/gold/neutral, not copied from Tailwind defaults)
- Lora/IBM Plex Sans Vietnamese coverage as fallback fonts — not independently verified this session

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, font Vietnamese coverage independently verified via live API
- Architecture: HIGH — token layering pattern is standard, full alias map derived from exhaustive grep
- Pitfalls: MEDIUM — pitfalls are derived from reasoning about CSS cascade/clamp/font interactions, not from observed bugs in this specific codebase

**Research date:** 2026-06-11
**Valid until:** 2026-12-11 (CSS custom properties and Google Fonts subsets are stable; re-verify font unicode-ranges if Google updates font versions significantly, e.g. Inter v21+ or Source Serif 4 v15+)
