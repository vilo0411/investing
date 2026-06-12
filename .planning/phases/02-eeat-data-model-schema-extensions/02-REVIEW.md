---
phase: 02-eeat-data-model-schema-extensions
reviewed: 2026-06-12T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - src/components/AuthorBox.astro
  - src/content.config.ts
  - src/data/authors.ts
  - src/data/site.ts
  - src/layouts/ArticleLayout.astro
  - src/layouts/BaseLayout.astro
  - src/pages/about.astro
  - src/pages/index.astro
findings:
  critical: 0
  warning: 4
  info: 6
  total: 10
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-06-12T00:00:00Z
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

This phase extends `src/content.config.ts` with new fields (`citations`, `keyTakeaways`, `factCheckedDate`) and `src/data/authors.ts` with a richer author profile (`experience`, `moneyPerspective`, `education`, `publishedIn`, `credentials`, `avatar`, `socialLinks`), then wires the author profile into `AuthorBox.astro`, `ArticleLayout.astro`, `BaseLayout.astro`, `about.astro`, and `index.astro` for EEAT signals (schema.org Person/Organization, author box, about page).

No critical/security issues found. The main concerns are: (1) three newly added content-schema fields (`citations`, `keyTakeaways`, `factCheckedDate`) have zero consumers anywhere in the codebase — dead schema additions that exist only as a future contract; (2) three new author fields (`credentials`, `avatar`, `socialLinks`) are likewise defined but never rendered; (3) a duplicate/overlapping concept between `sources` (existing, rendered) and `citations` (new, in JSON-LD schema and unused field) risks future confusion; (4) minor robustness issues around `categoryMeta`/`getCategoryPath` typing and author initials.

## Warnings

### WR-01: New schema fields `citations`, `keyTakeaways`, `factCheckedDate` are unused dead schema additions

**File:** `src/content.config.ts:20-28`
**Issue:** The schema adds `citations` (array of `{title, url?, publisher?, date?}`), `keyTakeaways` (array of strings), and `factCheckedDate` (optional date) — but grep across `src/` shows no `.astro`/`.ts` file reads `entry.data.citations`, `entry.data.keyTakeaways`, or `entry.data.factCheckedDate`. `ArticleLayout.astro` still renders `sources` (the older field) for "Nguồn tham khảo" and has no "Key takeaways" section or fact-checked date display, despite the article markdown files already containing a `## Key takeaways` section in prose (e.g. `blue-chip-la-gi.md`).

This means:
- Any author who populates `citations`/`keyTakeaways`/`factCheckedDate` in frontmatter today gets zero visible/structured-data benefit — the EEAT signal these fields are meant to deliver (fact-check date badges, structured key-takeaway lists, richer citation objects in JSON-LD) does not exist yet.
- `sources: string[]` and `citations: {title, url?, publisher?, date?}[]` are two parallel, semantically overlapping concepts with no defined relationship — risk of content authors populating one, the other, or both inconsistently, and of a future merge becoming a breaking migration.

**Fix:** Either (a) defer adding these fields to content.config.ts until the consuming UI lands in the same phase/PR (schema-first additions without a renderer create a false sense of "done"), or (b) if intentionally building the contract ahead of the UI (per the code comment on `factCheckedDate`), add an explicit code comment near `citations`/`keyTakeaways` documenting their relationship to `sources` and the planned consumer (Phase 3), matching the pattern already used for `factCheckedDate`:
```ts
// Added ahead of Phase 3 UI. Relationship to `sources`: citations will
// eventually supersede `sources` with structured {title, url, publisher, date}.
// Not yet consumed by ArticleLayout.astro.
citations: z.array(z.object({ ... })).default([]),
keyTakeaways: z.array(z.string()).default([]),
```

### WR-02: New author fields `credentials`, `avatar`, `socialLinks` are defined but never rendered

**File:** `src/data/authors.ts:6,11-12`
**Issue:** `credentials: [] as string[]`, `avatar: undefined as string | undefined`, and `socialLinks: undefined as {...} | undefined` are added to the `author` object, but neither `AuthorBox.astro`, `about.astro`, `ArticleLayout.astro`, nor `BaseLayout.astro` reference `author.credentials`, `author.avatar`, or `author.socialLinks`. The avatar continues to be rendered as a generated initial circle (`author.name.split(" ").pop()?.charAt(0)`) in both `AuthorBox.astro:7` and `about.astro:22`/`about.astro:14`, ignoring the new `avatar` field entirely.

EEAT credentials are one of the highest-value trust signals for YMYL content (Google's E-E-A-T guidance explicitly calls out author credentials). Shipping an empty `credentials: []` with no UI to ever populate/display it means this signal is structurally absent from the live site.

**Fix:** Either render these fields conditionally now:
```astro
{author.credentials.length > 0 && (
  <ul class="author-credentials">
    {author.credentials.map((c) => <li>{c}</li>)}
  </ul>
)}
{author.avatar && <img src={author.avatar} alt={author.name} class="author-avatar-img" />}
```
or document (code comment) that these are placeholders for a future phase, consistent with the `factCheckedDate` comment pattern already established in `content.config.ts`.

### WR-03: `categoryMeta` fallback objects in `index.astro` are loosely-typed ad-hoc literals that can drift from `categoryMeta`'s declared type

**File:** `src/pages/index.astro:94,115,141`
**Issue:** Three places construct fallback objects when `categoryMeta[article.data.category]` is missing:
```ts
const meta = categoryMeta[article.data.category] ?? { label: article.data.category, gradientClass: "thumb-stocks", abbr: "?" };
```
and
```ts
const meta = categoryMeta[featured.data.category] ?? { gradientClass: "thumb-stocks", label: featured.data.category };
```
The declared type of `categoryMeta` is `Record<string, { abbr: string; label: string; gradientClass: string }>` (`src/data/site.ts:105`). The fallback at line 115 and 141 omits `abbr`, which is structurally inconsistent (only works because TS infers a union type for `meta` rather than the `categoryMeta` value type, and `abbr` isn't used on those branches — but this is fragile: if a future edit accesses `meta.abbr` on the featured/latest branches, it silently becomes `undefined` rather than a type error, because the union type already permits a shape without `abbr`).

This is pre-existing-pattern-adjacent but was touched/extended in this phase's diff scope (file is in the review list) and is a maintainability risk for the EEAT category-driven trust badges this phase is building toward.

**Fix:** Define a shared fallback constant once and reuse:
```ts
const DEFAULT_CATEGORY_META = { abbr: "?", label: "", gradientClass: "thumb-stocks" } as const;
// ...
const meta = categoryMeta[article.data.category] ?? { ...DEFAULT_CATEGORY_META, label: article.data.category };
```

### WR-04: `AuthorBox.astro` and `about.astro` derive the avatar initial with different, divergent fallback logic

**File:** `src/components/AuthorBox.astro:7`, `src/pages/index.astro` (about.astro line 14 in the about page file)
**Issue:**
- `AuthorBox.astro:7`: `{author.name.split(" ").pop()?.charAt(0)}` — if `author.name` were ever empty string, `.pop()` returns `""`, and `"".charAt(0)` returns `""`, so the avatar renders empty (no fallback).
- `about.astro:14`: `author.name.split(" ").pop()?.charAt(0) ?? author.name.charAt(0)` — has an explicit fallback to the first character of the full name if `.pop()` is falsy.

These two components render conceptually the same "avatar initial" but use inconsistent derivation logic. The `AuthorBox.astro` version has no fallback at all, so for a degenerate `author.name` value it silently renders an empty circle, whereas `about.astro` is more defensive. While `author.name` is currently a hardcoded non-empty string (so this can't fail today), the divergence is a maintainability hazard — if author data becomes dynamic (e.g., multi-author support, which the phase's data-model work is clearly heading toward), one of the two will break silently.

**Fix:** Extract a shared helper in `src/data/authors.ts`:
```ts
export const getAuthorInitial = (name: string) =>
  name.trim().split(/\s+/).pop()?.charAt(0) ?? name.charAt(0) ?? "?";
```
and use `getAuthorInitial(author.name)` in both `AuthorBox.astro` and `about.astro`.

## Info

### IN-01: `ArticleLayout.astro` Props typed as `any`

**File:** `src/layouts/ArticleLayout.astro:11`
**Issue:** `interface Props { entry: any; ... }`. This predates the phase but is directly touched by this diff (the file gains new author/JSON-LD wiring). Using `any` for `entry` means TypeScript provides no checking for `entry.data.faq`, `entry.data.category`, `entry.data.citations`, etc., and the inline type annotations on `.map()` callbacks (`(item: { question: string; answer: string })`) are manually duplicated rather than derived from `CollectionEntry<"articles">`.
**Fix:** `import type { CollectionEntry } from "astro:content";` then `interface Props { entry: CollectionEntry<"articles">; headings?: ...}` — this would have caught, at compile time, that `citations`/`keyTakeaways`/`factCheckedDate` are unused (WR-01) via IDE/type tooling.

### IN-02: `author.credentials` typed via inline cast `[] as string[]`

**File:** `src/data/authors.ts:6`
**Issue:** `credentials: [] as string[]` — the cast is needed only because TS would otherwise infer `never[]` for an empty array literal. This is fine but slightly unusual style versus the rest of the file (e.g., `expertise` uses a non-empty array with inferred `string[]`). Same pattern applies to `avatar: undefined as string | undefined` and `socialLinks: undefined as {...} | undefined`.
**Fix:** No functional issue; consider giving the `author` object an explicit interface (`AuthorProfile`) instead of relying on `typeof author` + inline casts, which would make the empty/undefined defaults self-documenting:
```ts
interface AuthorProfile {
  name: string;
  credentials: string[];
  avatar?: string;
  socialLinks?: { linkedin?: string; twitter?: string; email?: string };
  // ...
}
export const author: AuthorProfile = { ... };
```

### IN-03: `site.email` defined but `socialLinks.email` field added redundantly

**File:** `src/data/authors.ts:12`, `src/data/site.ts:3`
**Issue:** `site.email` (`hello@valueinvesting.com.vn`) already exists and is used for the site-wide contact (`about.astro:25`, `BaseLayout.astro:77`). The new `author.socialLinks` type includes an optional `email?: string`, creating two possible sources of "the author's email" with unclear precedence if both are ever populated.
**Fix:** Either drop `email` from `socialLinks` (defer to `site.email`), or add a comment clarifying that `socialLinks.email` is for a personal/author-specific contact distinct from the site inbox.

### IN-04: Hardcoded year `2026` in `about.astro` stat block

**File:** `src/pages/index.astro` is not the source — this is in `src/pages/about.astro:96`: `<strong>2026</strong> <span>Năm cập nhật hồ sơ</span>`
**Issue:** The "profile updated year" is a magic, hardcoded literal that will silently go stale every year unless someone remembers to bump it. Given the phase is specifically about EEAT/trust signals (freshness is a trust signal), a hardcoded stale year is a quality regression risk.
**Fix:** Derive from a `profileUpdatedDate` constant in `src/data/authors.ts` (e.g., `profileUpdatedDate: "2026-06-12"`) and compute `.getFullYear()` in `about.astro`, or at minimum add a comment `// TODO: update annually` so it's discoverable.

### IN-05: `breadcrumbSchema` and `articleSchema` duplicate `Astro.site` URL construction logic across multiple lines

**File:** `src/layouts/ArticleLayout.astro:24-25, 47, 52, 79-88`
**Issue:** `new URL(..., Astro.site).toString()` is repeated ~7 times with different paths (`/about/`, `/editorial-policy/`, `/dau-tu/`, `categoryPath`, article URL, etc.). Not a bug, but the repetition increases the chance that one of these is updated (e.g., editorial policy URL renamed) while others are missed — a maintainability concern for an EEAT-critical structured-data block where broken JSON-LD URLs directly undermine Google's trust signals.
**Fix:** Extract a small `toAbsoluteUrl(path: string)` helper at the top of the frontmatter:
```ts
const toAbsoluteUrl = (path: string) => new URL(path, Astro.site).toString();
```

### IN-06: `AuthorBox.astro` hardcodes the "Về tác giả" / "Xem hồ sơ" link target as `/about/` instead of using `author.slug`

**File:** `src/components/AuthorBox.astro:13,15`
**Issue:** `src/data/authors.ts:3` defines `slug: "nguyen-viet-loc"` on the author object, presumably anticipating multi-author or per-author profile pages, but `AuthorBox.astro` hardcodes `href="/about/"` rather than something like `href={\`/authors/${author.slug}/\`}` or `/about/`. If `slug` is meant to drive routing in a later phase, that's fine, but currently `slug` is dead data (added but unused), similar to WR-01/WR-02.
**Fix:** No action required if `/about/` is intentionally the single-author profile page for now; otherwise add a comment noting `slug` is reserved for future multi-author routing (Phase 3+).

---

_Reviewed: 2026-06-12T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
