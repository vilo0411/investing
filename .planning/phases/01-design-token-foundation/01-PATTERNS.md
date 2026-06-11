# Phase 1: Design Token Foundation - Pattern Map

**Mapped:** 2026-06-11
**Files analyzed:** 6 (5 new + 1 modified, BaseLayout edit limited to font `<link>`)
**Analogs found:** 6 / 6 (all analogs are within the existing `src/styles/global.css` and `BaseLayout.astro` — no other component files are touched per DSGN-02)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `src/styles/tokens/colors.css` | config (CSS tokens) | transform (primitive → semantic) | `src/styles/global.css` `:root` block lines 1-30 | exact (same file, being split) |
| `src/styles/tokens/typography.css` | config (CSS tokens) | transform | `src/styles/global.css` lines 32-34, 250-272, 393-415 | exact |
| `src/styles/tokens/spacing.css` | config (CSS tokens) | transform (relocate, no value change) | `src/styles/global.css` lines 36-45 | exact |
| `src/styles/tokens/effects.css` | config (CSS tokens) | transform | `src/styles/global.css` lines 47-59 | exact |
| `src/styles/tokens/aliases-legacy.css` | config (compatibility shim) | transform (name mapping) | `src/styles/global.css` lines 1-30 (old names being retired) | exact |
| `src/styles/global.css` (modified) | config | transform | itself — restructure `:root` into `@import`s + targeted rule edits | exact |
| `src/layouts/BaseLayout.astro` (modified, lines 55-61 only) | layout | request-response (head `<link>` tags) | itself, lines 55-61 (Google Fonts `<link>` block) | exact |

## Pattern Assignments

### `src/styles/tokens/colors.css` (config, transform)

**Analog:** `src/styles/global.css` lines 1-30 (current `:root` color block)

**Current pattern to replace** (lines 1-30):
```css
:root {
  color-scheme: light;

  /* Brand — green */
  --color-brand-900: #006b2c;
  --color-brand-700: #00ae4d;
  --color-brand-100: #e8f8ee;

  /* Neutral */
  --color-neutral-950: #0d0d0d;
  --color-neutral-700: #4b5563;
  --color-neutral-400: #9ca3af;
  --color-neutral-100: #f6f8f6;
  --color-neutral-0:   #ffffff;

  /* Accent — green-light */
  --color-accent:      #8dc63f;
  --color-accent-soft: #f0fdf4;

  /* Semantic aliases (used throughout) */
  --bg:       var(--color-neutral-100);
  --surface:  var(--color-neutral-0);
  --surface-alt: var(--color-brand-100);
  --text:     var(--color-neutral-950);
  --muted:    var(--color-neutral-700);
  --line:     #e2e8f0;
  --brand:    var(--color-brand-900);
  --brand-strong: var(--color-brand-700);
  --accent:   var(--color-accent);
```

**New pattern (write into `colors.css`):** Define `:root { color-scheme: light; ... }` containing the FULL navy/neutral/gold 50-900 primitive scales (hex values are locked in `01-UI-SPEC.md` "Color Tokens" section — copy verbatim) PLUS the new semantics defined exactly once:
```css
:root {
  --bg: var(--color-neutral-50);
  --surface: #ffffff;
  --surface-alt: var(--color-navy-50);
  --text: var(--color-neutral-900);
  --muted: var(--color-neutral-700);
  --line: var(--color-neutral-100);
  --brand: var(--color-navy-800);
  --brand-strong: var(--color-navy-600);
  --accent: var(--color-gold-700);
}
```
Keep `color-scheme: light;` at the top of this file's `:root` (it was previously declared in the same `:root` block — preserve it here since this is the first-imported token file).

**Pitfall to avoid (Pitfall 1 from RESEARCH.md):** Do NOT redeclare `--brand`, `--text`, `--bg`, etc. again in `aliases-legacy.css` — last `@import` wins on `:root` custom properties, so duplicate declarations of the SAME semantic name across files will silently override these.

---

### `src/styles/tokens/typography.css` (config, transform)

**Analog:** `src/styles/global.css` lines 32-34 (font vars), 250-272 (`h1,h2,h3` + clamp usage), 393-415 (`.prose` rules)

**Current font vars** (lines 32-34):
```css
  /* Typography */
  --font-serif: 'DM Serif Display', 'Georgia', serif;
  --font-sans:  'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
```

**Current heading pattern** (lines 250-272) — note h1/h2 already use `clamp()`, h3 does not:
```css
h1,
h2,
h3 {
  font-family: var(--font-serif);
  line-height: 1.18;
  letter-spacing: -0.01em;
  color: var(--brand);
}

h1 {
  font-size: clamp(2.2rem, 5.5vw, 4.5rem);
  margin: 12px 0 18px;
}

h2 {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  margin: 0 0 16px;
}

h3 {
  font-size: 1.15rem;
  margin: 0 0 8px;
}
```

**Current `.prose` body pattern** (lines 393-406) — the lines that must change:
```css
.prose {
  font-size: 1.05rem;
  padding-bottom: 56px;
}

.prose h2 {
  margin-top: 42px;
}

.prose p,
.prose li {
  color: #1a2330;
  line-height: 1.8;
}
```

**New pattern for `typography.css`:**
```css
:root {
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;

  --text-h1: clamp(2.25rem, 1.8rem + 2.25vw, 3.5rem);
  --text-h2: clamp(1.5rem, 1.3rem + 1vw, 2.25rem);
  --text-h3: clamp(1.15rem, 1.05rem + 0.5vw, 1.5rem);
  --text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --leading-body: 1.7;

  --max: 1120px;
  --article: 65ch;
}
```
**Note:** `--max` and `--article` were previously under "Layout" (lines 61-63 of old global.css) — UI-SPEC groups `--article` with typography since it interacts with the type scale; `--max` can live here too for simplicity (single layout-vars location).

**global.css edits required (NOT in typography.css — these stay in global.css's existing rule blocks):**
- `h1 { font-size: var(--text-h1); }`, `h2 { font-size: var(--text-h2); }`, `h3 { font-size: var(--text-h3); }` (replace the three `clamp(...)`/`1.15rem` literals shown above, keep `margin`/`line-height`/etc. as-is)
- `.prose { font-size: var(--text-body); ... }` (keep `padding-bottom: 56px`)
- `.prose p, .prose li { line-height: var(--leading-body); }` — also note current hardcoded `color: #1a2330` matches new `--color-neutral-900` exactly; can leave as literal or switch to `var(--text)` (both resolve identically per UI-SPEC) — prefer `var(--text)` for consistency with token system

---

### `src/styles/tokens/spacing.css` (config, transform — values UNCHANGED per D-11)

**Analog:** `src/styles/global.css` lines 36-45

**Pattern to relocate verbatim:**
```css
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
```
Wrap in `:root { ... }`. No value changes. Per Open Q3, `--space-24` has no current usage but must remain defined.

---

### `src/styles/tokens/effects.css` (config, transform)

**Analog:** `src/styles/global.css` lines 47-59

**Current pattern:**
```css
  /* Radius */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  20px;

  /* Shadow */
  --shadow-sm: 0 1px 3px rgba(10, 37, 64, .08);
  --shadow-md: 0 4px 12px rgba(10, 37, 64, .10);
  --shadow-lg: 0 8px 24px rgba(10, 37, 64, .12);

  /* Transition */
  --transition: 150ms ease;
```

**New pattern for `effects.css`:** Radius and shadow values UNCHANGED (D-13 — already neutral rgba). Transition expands to three durations; the singular `--transition` legacy name does NOT get declared here — it goes in `aliases-legacy.css` to avoid the Pitfall-1 double-declaration issue.
```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;

  --shadow-sm: 0 1px 3px rgba(10, 37, 64, .08);
  --shadow-md: 0 4px 12px rgba(10, 37, 64, .10);
  --shadow-lg: 0 8px 24px rgba(10, 37, 64, .12);

  --transition-fast: 100ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 350ms ease;
}
```

---

### `src/styles/tokens/aliases-legacy.css` (config, compatibility shim)

**Analog:** Old primitive names from `src/styles/global.css` lines 1-30 that are NOT promoted to new semantics (per UI-SPEC "Token Architecture" rule: this file contains ONLY names that don't already exist as new semantics).

**Names this file must declare** (each maps old name → new token), based on UI-SPEC "Implementation Checklist" item 5 and RESEARCH.md "Full alias map":
```css
:root {
  /* Legacy primitives (no longer used as primary palette, kept for safety) */
  --color-brand-900: var(--color-navy-800);
  --color-brand-700: var(--color-navy-600);
  --color-brand-100: var(--color-navy-50);

  --color-neutral-950: var(--color-neutral-900);
  --color-neutral-700: var(--color-neutral-700); /* same scale step, no remap needed but keep for explicitness if old name differs */
  --color-neutral-400: var(--color-neutral-400);
  --color-neutral-100: var(--color-neutral-100);
  --color-neutral-0: #ffffff;

  /* Legacy accent names -> gold (D-04, UI-SPEC "Legacy Green" decision) */
  --color-accent: var(--color-gold-700);   /* text usage — AA pass at 5.09:1 */
  --color-accent-soft: var(--color-gold-50);

  /* Retired green, alias-only, NOT promoted to primitive palette */
  --color-green-700: #006b2c;
  --color-green-50: #eafaf0;

  /* Singular legacy transition name */
  --transition: var(--transition-base);
}
```
**Caution:** `--color-neutral-700`, `--color-neutral-400`, `--color-neutral-100` are ALSO new primitive names (same scale, same step in the new neutral scale per UI-SPEC table — e.g. new `--color-neutral-700: #475569` equals old `--color-neutral-700` semantic role of `--muted`). If `colors.css` already defines `--color-neutral-700` etc. as part of the new primitive scale with the SAME hex as required, do NOT redeclare them here (Pitfall 1) — only include alias entries for names whose value/scale-position genuinely differs (`--color-neutral-950` → `--color-neutral-900`, `--color-neutral-0` is not part of new scale). Verify against the full 37-name list in RESEARCH.md before finalizing.

---

### `src/styles/global.css` (modified — restructure)

**Analog:** itself, current structure

**New top-of-file pattern** (replaces lines 1-64 `:root` block):
```css
/* ─── Design Tokens ─────────────────────────────────────────────────────── */
@import "./tokens/colors.css";
@import "./tokens/typography.css";
@import "./tokens/spacing.css";
@import "./tokens/effects.css";
@import "./tokens/aliases-legacy.css";

/* ─── Reset ──────────────────────────────────────────────────────────────── */
* {
  box-sizing: border-box;
}
/* ... rest of file (lines 66-509) UNCHANGED except the targeted edits below */
```

**Targeted edits within the unchanged body (UI-SPEC Implementation Checklist item 6):**
1. `.mega-item-title` (line 232-236): change `font-weight: 600;` → `font-weight: 500;`
2. `h1`, `h2`, `h3` font-size declarations (lines 259-271): replace literal `clamp(...)`/`1.15rem` with `var(--text-h1)`, `var(--text-h2)`, `var(--text-h3)`
3. `.prose` (lines 393-396): add/replace `font-size: 1.05rem;` → `font-size: var(--text-body);`
4. `.prose p, .prose li` (lines 402-406): `line-height: 1.8;` → `line-height: var(--leading-body);`

**Error handling / fallback pattern:** N/A — pure CSS, no runtime errors. Build validation is `astro check` + `npm run build` (per RESEARCH.md Validation Architecture).

---

### `src/layouts/BaseLayout.astro` (modified, lines 55-61 only)

**Analog:** itself, lines 55-61 (current Google Fonts `<link>` block)

**Current pattern** (lines 55-61):
```astro
    <!-- Google Fonts: DM Serif Display + DM Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
      rel="stylesheet"
    />
```

**New pattern (replace verbatim, locked in UI-SPEC):**
```astro
    <!-- Google Fonts: Source Serif 4 + Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;700&family=Inter:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
```

**Constraint:** This is the ONLY edit permitted to `BaseLayout.astro` (and the only `.astro` file touched in this phase) — DSGN-02 forbids touching any other component/layout markup or styles.

---

## Shared Patterns

### CSS Custom Property Cascade (Pitfall 1)
**Source:** `src/styles/global.css` (current single `:root` block, being split)
**Apply to:** All 5 token files
- Each NEW semantic name (`--brand`, `--text`, `--bg`, `--surface`, `--surface-alt`, `--muted`, `--line`, `--accent`, `--brand-strong`, `--font-serif`, `--font-sans`, `--article`, `--max`) must be declared **exactly once**, in `colors.css`/`typography.css` as appropriate.
- `aliases-legacy.css` contains ONLY names absent from the new semantic set (legacy primitives + `--transition`).
- `@import` order is load-bearing: colors → typography → spacing → effects → aliases-legacy → reset/component CSS.

### Font Loading Pattern
**Source:** `src/layouts/BaseLayout.astro` lines 55-61
**Apply to:** `BaseLayout.astro` only — same `preconnect` + single `css2` `<link>` mechanism, just new family names/weights (400/500/700 only, no 300/600 per D-08).

### Transition Token Migration
**Source:** `src/styles/global.css` — 5 current usages of `var(--transition)`: `.nav-links a` (line 155), `.nav-link-mega` (line 188), `.mega-item` (line 223), `.card` (line 341), `.footer-col a` (line 461)
**Apply to:** No edits needed to these 5 lines — `--transition` stays as a literal `var(--transition)` reference in global.css's existing rules, resolved via `aliases-legacy.css`'s `--transition: var(--transition-base);` mapping. Zero-touch compatibility.

## No Analog Found

None — this is a pure refactor of one existing file (`global.css`) plus a 7-line edit to `BaseLayout.astro`. Every new token file has a direct 1:1 source section in the current `global.css` `:root` block.

## Metadata

**Analog search scope:** `src/styles/global.css`, `src/layouts/BaseLayout.astro` (only files relevant — DSGN-02 forbids touching `src/components/*.astro` or other layouts)
**Files scanned:** 2 (both fully read)
**Pattern extraction date:** 2026-06-11
