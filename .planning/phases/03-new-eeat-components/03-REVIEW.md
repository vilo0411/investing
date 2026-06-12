---
phase: 03-new-eeat-components
reviewed: 2026-06-12T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - astro.config.mjs
  - src/components/AuthorBox.astro
  - src/components/Breadcrumb.astro
  - src/components/CitationBox.astro
  - src/components/ComparisonTable.astro
  - src/components/Disclaimer.astro
  - src/components/KeyTakeaways.astro
  - src/pages/preview/eeat-components.astro
findings:
  critical: 1
  warning: 3
  info: 2
  total: 6
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-06-12T00:00:00Z
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

This phase introduces several new EEAT components (AuthorBox enhancements, Breadcrumb, CitationBox, ComparisonTable, Disclaimer, KeyTakeaways) plus a preview page and a sitemap filter tweak. The components themselves are simple, mostly presentational, and follow existing conventions (scoped styles, `var(--token)` usage, `Props` interface naming).

The most significant issue is that `AuthorBox.astro` — which is rendered on **every published article page** via `ArticleLayout.astro` — was changed to link to `/author/${author.slug}`, a route that does not exist anywhere in `src/pages`. Previously it linked to the valid `/about/` page. This silently turns a working link into a site-wide 404 across all production article pages, not just the preview. The preview page documents this as an "accepted" decision (D-09) for the *preview* component, but the change also affects the live `ArticleLayout.astro` usage, which is in scope and shipping today.

Other findings are minor: a `CitationBox` date-formatting edge case if `factCheckedDate`/`updatedDate` arrive as non-Date values, a missing `key`/uniqueness concern is not applicable (no `.map` index reuse issues), and small consistency/documentation notes.

## Critical Issues

### CR-01: AuthorBox now links to a non-existent `/author/{slug}` route on every live article page

**File:** `src/components/AuthorBox.astro:13,15`
**Issue:** The author name link and "Xem hồ sơ" link were changed from `/about/` (a real, existing page) to `/author/${author.slug}` (i.e. `/author/nguyen-viet-loc`). No route exists under `src/pages/author/` or `src/pages/author/[slug].astro`. `AuthorBox` is rendered unconditionally in `src/layouts/ArticleLayout.astro:178`, which means **every article page in production will now contain two links to a 404 page**. This is a real regression for E-E-A-T/SEO (broken internal links, 404s reported by Search Console) and for users clicking "Xem hồ sơ".

The preview page (`src/pages/preview/eeat-components.astro:79-80`) explicitly documents this as an accepted tradeoff for the *preview*, citing "Phase 4 sẽ dựng route này (D-09, đã chấp nhận)" — but that acknowledgment does not change the fact that `ArticleLayout.astro` ships this broken link to production today, before Phase 4 exists.

**Fix:** Either:
1. Defer this change until the `/author/[slug]` route is built in Phase 4 (keep `href="/about/"` for now), or
2. Add a minimal `src/pages/author/[slug].astro` route in this phase so the link resolves, or
3. Conditionally fall back to `/about/` if no author profile route exists yet:
```astro
<a class="author-name" href={`/author/${author.slug}`}>{author.name}</a>
```
should remain `href="/about/"` until the target route ships, e.g.:
```astro
<a class="author-name" href="/about/">{author.name}</a>
...
<a class="author-profile-link" href="/about/">Xem hồ sơ</a>
```

## Warnings

### WR-01: `CitationBox` calls `.toLocaleDateString()` without validating the prop is a `Date`

**File:** `src/components/CitationBox.astro:17-18`
**Issue:** `factCheckedDate` and `updatedDate` are typed as `Date` in `Props`, and `.toLocaleDateString("vi-VN")` is called directly. If an article's frontmatter date is passed through as a string (which is easy to do accidentally, since Astro content collection `z.date()` schema fields can sometimes resolve to `Date` but callers might pass `entry.data.updatedDate` directly without coercion, or a future caller passes a raw string), this throws `TypeError: date.toLocaleDateString is not a function` at build time, breaking the entire static build for any page using this component.

There's no runtime guard or `instanceof Date` check, and no fallback if `updatedDate` is `undefined`/invalid (note `updatedDate` is required in `Props` but Astro does not enforce this at runtime — a caller could still pass `undefined`).

**Fix:**
```ts
const factChecked = factCheckedDate instanceof Date ? factCheckedDate : undefined;
const updated = updatedDate instanceof Date ? updatedDate : new Date(updatedDate as unknown as string);
```
or, more defensively, wrap with a small formatter helper that handles invalid/missing dates gracefully and document the expected input type at the call site (e.g., article pages must pass `entry.data.updatedDate`, which Zod's `z.date()` returns as a `Date`).

### WR-02: `astro.config.mjs` sitemap filter excludes `/preview/` pages but the exclusion list pattern is fragile and untyped

**File:** `astro.config.mjs:8-16`
**Issue:** The sitemap `filter` function now has three different exclusion mechanisms layered together: a substring check (`/kien-thuc/`), an exact-match array (`["https://valueinvesting.com.vn/co-phieu/", ...]`), and another substring check (`/preview/`). This works for the current single preview page, but as more `src/pages/preview/*.astro` pages are added (likely, given this is an "EEAT components preview" page meant for iterative review), each will be silently caught by `/preview/` — which is correct — but the inconsistency between exact-match exclusions (legacy category roots) and substring exclusions (`kien-thuc`, `preview`) makes this filter function harder to reason about and easy to get wrong when adding new exclusions (e.g., a future page literally named `/dau-tu/preview-strategies/` would also be excluded unintentionally).

**Fix:** Consolidate to a single pattern-based exclusion list using consistent matching, e.g.:
```js
const excludedPathPrefixes = ["/kien-thuc/", "/preview/"];
const excludedExactPaths = [
  "https://valueinvesting.com.vn/co-phieu/",
  "https://valueinvesting.com.vn/etf/",
  "https://valueinvesting.com.vn/quy-dau-tu/",
  "https://valueinvesting.com.vn/trai-phieu/",
];

sitemap({
  filter: (page) =>
    !excludedExactPaths.includes(page) &&
    !excludedPathPrefixes.some((prefix) => new URL(page).pathname.startsWith(prefix)),
});
```
This avoids accidental false-positive substring matches on unrelated paths containing "preview".

### WR-03: `Breadcrumb.astro` renders the separator for the last non-final item even when `href` is undefined for intermediate items

**File:** `src/components/Breadcrumb.astro:11-22`
**Issue:** The component assumes every item except the last has a valid `href` and renders `<a href={item.href}>`. If an intermediate item is passed without `href` (the `Props` type allows `href?: string`), Astro will render `<a href="undefined">...</a>` (literal string "undefined" in some cases) or an empty/missing `href` attribute depending on Astro's serialization — producing a broken/invalid link in the middle of the breadcrumb trail, with no visual or semantic distinction from a working link. There's no runtime guard verifying intermediate items have `href` set.

**Fix:** Add a type-level guard or runtime fallback for intermediate items without `href`, e.g. render as plain `<span>` if `href` is missing:
```astro
{items.map((item, index) => (
  index === items.length - 1 ? (
    <li><span aria-current="page">{item.label}</span></li>
  ) : item.href ? (
    <li>
      <a href={item.href}>{item.label}</a>
      <span class="separator" aria-hidden="true">›</span>
    </li>
  ) : (
    <li>
      <span>{item.label}</span>
      <span class="separator" aria-hidden="true">›</span>
    </li>
  )
))}
```

## Info

### IN-01: `CitationBox` falls back to rendering raw `sources` strings as bare `<li>{s}</li>` with no link, while `citations` get richer markup

**File:** `src/components/CitationBox.astro:22-34`
**Issue:** The component supports two mutually-exclusive data shapes (`sources: string[]` vs `citations: {...}[]`), with `citations` taking precedence if both are non-empty (`citations.length > 0 ? ... : sources...`). This dual-shape design is reasonable for a migration period, but there's no inline comment explaining why both exist or which one new articles should use going forward — future authors may not know `sources` is effectively a legacy/simple fallback path. This isn't a bug, but it's a maintainability gap given this is a new component being introduced.

**Fix:** Add a short comment above the `Props` interface clarifying the intended usage, e.g.:
```ts
interface Props {
  // Legacy/simple form: plain source names, rendered without links.
  // Prefer `citations` for new articles — provides title/url/publisher/date.
  sources?: string[];
  citations?: { title: string; url?: string; publisher?: string; date?: string }[];
  factCheckedDate?: Date;
  updatedDate: Date;
}
```

### IN-02: `AuthorBox.astro` avatar initial derivation uses `.split(" ").pop()?.charAt(0)` which silently renders nothing for single-word names

**File:** `src/components/AuthorBox.astro:7`
**Issue:** `author.name.split(" ").pop()?.charAt(0)` extracts the first character of the last word of the author's name (e.g., "Lộc" from "Nguyễn Viết Lộc" → "L"). If `author.name` were ever a single word (or empty string), `.pop()` still returns that string and `.charAt(0)` returns the first char, so this specific case is actually safe — but if `author.name` is an empty string `""`, `.split(" ")` returns `[""]`, `.pop()` returns `""`, and `.charAt(0)` returns `""` (empty string), rendering an empty avatar circle with no visible initial and no `alt`/fallback text. Currently `author.name` is a non-empty hardcoded constant so this won't trigger today, but there's no defensive fallback if `authors.ts` is later edited to have an empty name.

**Fix:** Minor — not urgent given current static data, but consider a fallback:
```astro
{author.name.split(" ").pop()?.charAt(0) || "?"}
```

---

_Reviewed: 2026-06-12T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
