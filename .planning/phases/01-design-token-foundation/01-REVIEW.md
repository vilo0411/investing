---
phase: 01-design-token-foundation
reviewed: 2026-06-11T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - src/styles/tokens/colors.css
  - src/styles/tokens/typography.css
  - src/styles/tokens/spacing.css
  - src/styles/tokens/effects.css
  - src/styles/tokens/aliases-legacy.css
  - src/styles/global.css
  - src/layouts/BaseLayout.astro
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: fixed
---

# Phase 01: Code Review Report

**Reviewed:** 2026-06-11T00:00:00Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

This phase splits the previous monolithic `:root` token block in `global.css` into five layered files (`colors.css`, `typography.css`, `spacing.css`, `effects.css`, `aliases-legacy.css`), introduces a navy/neutral/gold primitive palette + semantic tokens, applies a fluid type scale to headings/`.prose`, and swaps Google Fonts from DM Serif Display + DM Sans to Source Serif 4 + Inter.

The token restructuring itself is clean and the legacy alias layer correctly preserves all `--color-brand-*`, `--color-accent*`, `--color-neutral-950/0`, and `--transition` names that are consumed across ~20 downstream files (verified via repo-wide grep — all legacy names referenced by components/pages resolve through `aliases-legacy.css` to a defined primitive). No broken token references were found.

Two issues are worth fixing: (1) a hardcoded color in `about.astro` that was tuned for the old green palette now visually clashes with the new navy `--color-brand-700/900` values it's gradient-blended with, and (2) the new Google Fonts URL only loads weights 400/500/700 for both families, but the codebase uses `font-weight: 600` and `800` in several places, meaning those elements will render with browser-synthesized (faux) bold instead of the actual font weight. Neither is a build-breaking issue, but both are visual regressions introduced or left unaddressed by this phase's color/font changes.

## Warnings

### WR-01: Hardcoded green halo color now clashes with new navy gradient stops

**File:** `src/pages/about.astro:148,155`
**Issue:** The author avatar's radial gradient hardcodes `#f3fff6` (a pale green, matched to the old brand green palette: `--color-brand-900: #006b2c`, `--color-brand-700: #00ae4d`) as the inner "halo" color, then blends into `var(--color-brand-700)` and `var(--color-brand-900)` — which now alias to navy (`--color-navy-600: #2c5282` and `--color-navy-800: #163050`) per `aliases-legacy.css`. The result is a gradient that goes from pale mint-green directly into navy blue, an unintended and jarring color combination that this phase's color-token swap introduced. The accompanying `box-shadow: 0 10px 28px rgba(0, 107, 44, 0.18)` on line 155 is also a hardcoded green shadow color (the old `--color-brand-900` value `#006b2c` baked in as rgba), which will look out of place against the new navy avatar.
**Fix:** Update both hardcoded values to match the new navy palette, e.g.:
```css
.author-avatar-large {
  background: radial-gradient(circle at 32% 26%, var(--color-neutral-50) 0 0, var(--color-neutral-50) 18%, var(--color-brand-700) 19%, var(--color-brand-900) 72%);
  box-shadow: 0 10px 28px rgba(10, 37, 64, 0.18);
}
```

### WR-02: Google Fonts URL omits weight 600/800 used elsewhere in the codebase

**File:** `src/layouts/BaseLayout.astro:59`
**Issue:** The new font URL requests only `wght@400;500;700` for both `Source Serif 4` and `Inter`:
```
https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;700&family=Inter:wght@400;500;700&display=swap
```
However, a repo-wide grep for `font-weight:` finds usages of `600` and `800` in component/page styles (e.g. nav/footer headings, badges). Since only 400/500/700 are downloaded, the browser will fall back to faux/synthetic bold for any element styled with `font-weight: 600` or `800` while using `var(--font-serif)` / `var(--font-sans)` — this produces visibly different (often heavier, less crisp) glyphs than the real font weight, especially noticeable for serif headings.
**Fix applied (partial):** Per D-08 (only 400/500/700 may be used), normalized the occurrences directly tied to this review's findings: `src/components/AuthorBox.astro` (2x `800`→`700`) and `src/layouts/ArticleLayout.astro` (2x `600`→`500`, 1x `800`→`700`).
**Remaining (follow-up todo, out of phase 01 scope):** A broader repo-wide grep found additional `font-weight: 600`/`800` usages in `src/pages/about.astro` (2x), `src/pages/search.astro` (1x), `src/pages/index.astro` (5x), `src/pages/[category].astro` (1x), `src/pages/dau-tu.astro` (1x), and `src/pages/dau-tu/[category].astro` (1x) — these predate Phase 01 and were not part of this phase's file scope (`files_modified` in 01-01/01-02-PLAN.md). Tracked as a separate follow-up sweep to normalize all remaining `font-weight: 600/800` declarations to 500/700 per D-08, or to add those weights to the Google Fonts URL if synthesis is deemed acceptable.

## Info

### IN-01: Several primitive color steps defined but never referenced

**File:** `src/styles/tokens/colors.css:7-11,13,32,34,36`
**Issue:** `--color-navy-100` through `--color-navy-500`, `--color-navy-700`, `--color-gold-300`, `--color-gold-600`, and `--color-gold-900` are defined in the primitive scale but no current file in the codebase references them (verified via grep across `src/`). This is plausibly intentional ("seed the full scale for future phases"), similar to `--destructive` which is explicitly commented as "Reserved for future phases" — but these other unused steps lack that annotation, making it ambiguous to future readers whether they're dead tokens or scale placeholders.
**Fix:** Either add a short comment noting these are reserved for future use (consistent with `--destructive`), or trim the scale to only the steps actually consumed plus `--destructive`, expanding later as needed.

### IN-02: `--transition` legacy alias has no plural/singular naming guidance for new code

**File:** `src/styles/tokens/aliases-legacy.css:20-22`
**Issue:** The file header comment says "compatibility shim, do not extend," and `--transition` (singular, aliasing `--transition-base`) is kept for backward compatibility while `effects.css` introduces the new three-tier `--transition-fast/base/slow`. Since `--transition` is still widely used across `global.css` and components (verified via grep), there's a risk new code continues to reach for `--transition` instead of the new tiered tokens, defeating the purpose of the new scale.
**Fix:** Consider a brief comment in `effects.css` or the project style guide pointing new code at `--transition-base` (or fast/slow as appropriate) instead of the legacy `--transition` alias, to steer future contributions toward the new tiered system.

### IN-03: `--surface-alt` semantic mapping changed palette family without an explicit rationale comment

**File:** `src/styles/tokens/colors.css:41`
**Issue:** Previously `--surface-alt: var(--color-brand-100)` (a pale green tint, `#e8f8ee`). Now it's `--surface-alt: var(--color-navy-50)` (`#eef3f9`, pale blue tint). This is a deliberate part of the navy rebrand and is almost certainly correct, but `colors.css` doesn't carry any inline rationale (unlike `aliases-legacy.css` which references decision IDs like D-04). Given `--surface-alt` is used for `.band` sections (visible page backgrounds), a one-line comment tying this choice to the relevant design decision would help future maintainers confirm it's intentional rather than a stray.
**Fix:** Add a short comment, e.g. `--surface-alt: var(--color-navy-50); /* D-0X: pale navy tint replaces legacy green band background */`.

---

_Reviewed: 2026-06-11T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
