# Phase 2: EEAT Data Model & Schema Extensions - Research

**Researched:** 2026-06-12
**Domain:** Astro content collections (Zod schema extension) + data-module refactor (single source of truth for author data)
**Confidence:** HIGH

## Summary

This phase is a pure data-model/schema phase with no new UI surface. Two changes are required: (1) additive, optional fields on the existing `articles` Zod schema in `src/content.config.ts` (`citations`, `keyTakeaways`, `factCheckedDate`), and (2) extraction of author data currently scattered across `src/data/site.ts` (`author` string + `authorProfile` object) into a new single-source-of-truth module `src/data/authors.ts`, with every consuming file (`AuthorBox.astro`, `ArticleLayout.astro`, `BaseLayout.astro`, **and `about.astro` + `index.astro`**, which were not in the originally-flagged call-site list) refactored to read from it.

Both changes follow patterns already established in this exact codebase: `content.config.ts` already uses `.default([])` for optional array fields (`tags`, `faq`, `sources`), and `src/data/site.ts` already follows the "single config object + named export + helper functions" pattern that `authors.ts` should mirror. Because Zod's `.optional()` and `.default()` fields do not require existing frontmatter to supply them, all 21 existing articles will continue to validate without modification — confirmed by running `astro check` against the current schema (0 errors, 0 warnings related to schema). The author refactor is larger in surface area than the phase description suggested: **5 files** reference `site.author`/`site.authorProfile`/`site.editorialReviewer`, not 3.

**Primary recommendation:** Extend `src/content.config.ts` with three new `.optional()`/`.default()` Zod fields following the exact pattern of `tags`/`faq`/`sources`; create `src/data/authors.ts` exporting a single named `author` object per D-01/D-02; refactor all 5 call sites (`AuthorBox.astro`, `ArticleLayout.astro`, `BaseLayout.astro`, `about.astro`, `index.astro`) to import from `authors.ts`, keeping `site.author` as a re-exported alias from `authors.ts` only if any non-refactored consumer still needs the plain string (verify after refactor — likely none remain).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Content frontmatter schema (citations, keyTakeaways, factCheckedDate) | Data/Content Layer (`src/content.config.ts`) | — | Zod schema is the single validation boundary for all article frontmatter; build-time only, no runtime tier |
| Author/reviewer profile data | Data/Content Layer (`src/data/authors.ts`) | — | New config singleton module, same tier as `src/data/site.ts`, consumed by layouts/components/pages at build time |
| AuthorBox rendering | Layout/Presentation Layer (`src/components/AuthorBox.astro`) | — | Reads from `authors.ts`; markup/styles frozen per D-06, only data source changes |
| JSON-LD Person/Article author fields | Layout/Presentation Layer (`ArticleLayout.astro`, `BaseLayout.astro`) | Data/Content Layer | Schema.org JSON-LD built inline in layouts but must source values from `authors.ts` (ARTL-02 groundwork) |
| Author profile page content | Routing/Page Layer (`src/pages/about.astro`) | Data/Content Layer | Page-level component consuming `authors.ts` directly; full profile page is Phase 4 (EEAT-06) but `about.astro` already exists and uses the same data today |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 5.9.3 (current, installed) | Content collections + Zod schema validation | Already the project's framework — `defineCollection`/`z.object` is the established pattern in `src/content.config.ts` [VERIFIED: codebase] |
| zod | bundled with `astro:content` (no separate install) | Schema definition for new optional fields | `z` is imported from `"astro:content"`, not a standalone `zod` package dependency — confirmed in `src/content.config.ts:1` [VERIFIED: codebase] |

### Supporting
No new libraries needed. This phase is additive TypeScript/Zod + Astro component refactor only.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `z.array(z.object({...}))` for `citations` | Reuse `sources: z.array(z.string())` shape | Rejected per D-03 — structured objects needed for Phase 3 Citation box (title/url/publisher/date), `sources` stays untouched |
| Single `authors.ts` object export | Array of authors (`authors: Author[]`) | D-01 explicitly chose single object (solo blog); but per Claude's Discretion, name the export so Phase 4 can extend to array without a breaking rename (e.g., export both `author` and a derived `authors = [author]` if useful) |

**Installation:**
No new packages required — `npm install` not needed for this phase.

**Version verification:** Not applicable — no new dependencies. Existing `astro` 5.9.3 and bundled `astro:content` Zod confirmed via `src/content.config.ts` and successful `astro check` run during this research session [VERIFIED: local build].

## Package Legitimacy Audit

Not applicable — this phase installs no external packages. No legitimacy gate required.

## Architecture Patterns

### System Architecture Diagram

```
Article frontmatter (.md files, 21 existing + future)
        │
        ▼
src/content.config.ts (Zod schema)
  ├─ existing required fields (title, description, category, ...)
  ├─ existing optional/default fields (tags[], faq[], sources[], featured, order)
  └─ NEW optional/default fields:
       ├─ citations: { title, url?, publisher?, date? }[]  (default [])
       ├─ keyTakeaways: string[]                            (default [])
       └─ factCheckedDate: Date | undefined                 (optional, no default)
        │
        ▼ (getCollection("articles") — validated entries)
src/pages/**/*.astro (getStaticPaths)
        │
        ▼ (entry passed as prop)
src/layouts/ArticleLayout.astro ──► src/layouts/BaseLayout.astro
        │                                    │
        │  reads entry.data.{citations,      │ JSON-LD Person/Organization
        │  keyTakeaways, factCheckedDate}     │ author fields
        │  (Phase 3 will render these;        │
        │   Phase 2 just makes them           │
        │   available — no rendering yet)     │
        ▼                                    ▼
src/components/AuthorBox.astro      JSON-LD <script> blocks
        │                                    │
        └──────────────┬─────────────────────┘
                        ▼
              src/data/authors.ts (NEW — single source of truth)
                ├─ name, slug, role, bio
                ├─ credentials[], experience, expertise[]
                └─ avatar?, socialLinks?
                        ▲
                        │ also consumed by
              src/pages/about.astro  (existing author profile page)
              src/pages/index.astro  (homepage author section heading)
              src/data/site.ts       (author string kept as alias, if needed)
```

### Recommended Project Structure
```
src/
├── content.config.ts        # MODIFY: add citations, keyTakeaways, factCheckedDate to schema
├── data/
│   ├── site.ts               # MODIFY: remove/alias author + authorProfile, import from authors.ts if alias kept
│   └── authors.ts            # NEW: single author object (D-01/D-02)
├── components/
│   └── AuthorBox.astro       # MODIFY: data source only — read from authors.ts, markup/styles unchanged (D-06)
├── layouts/
│   ├── ArticleLayout.astro   # MODIFY: site.author → authors.ts in JSON-LD + byline (lines 45, 98, 126)
│   └── BaseLayout.astro      # MODIFY: site.author → authors.ts in JSON-LD + meta (lines 79, 138)
└── pages/
    ├── about.astro            # MODIFY: site.authorProfile.* → authors.ts (lines 13, 27, 28, 35, 46, 52, 66, 103, 109, 115)
    └── index.astro             # MODIFY: site.author → authors.ts (line 176)
```

### Pattern 1: Additive Optional Zod Fields with `.default()`
**What:** Add new fields to the `articles` collection schema using `.optional()` or `.default(...)` so existing content entries that don't supply the field still validate successfully.
**When to use:** Any time a new frontmatter field is added to a content collection that already has published entries.
**Example:**
```typescript
// Source: src/content.config.ts (existing pattern, lines 14-19)
const articles = defineCollection({
  type: "content",
  schema: z.object({
    // ...existing required fields...
    tags: z.array(z.string()).default([]),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    sources: z.array(z.string()).default([]),

    // NEW fields for Phase 2 — follow the exact same additive pattern:
    citations: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      publisher: z.string().optional(),
      date: z.string().optional(),
    })).default([]),
    keyTakeaways: z.array(z.string()).default([]),
    factCheckedDate: z.coerce.date().optional(),
  }),
});
```
**Note on `factCheckedDate`:** Unlike `citations`/`keyTakeaways`, this has no `.default()` — it resolves to `undefined` when absent (not a sentinel date). Any consumer (Phase 3) must handle `entry.data.factCheckedDate === undefined` explicitly. This matches the existing pattern for genuinely-optional fields — no precedent field in the current schema is `.optional()` without `.default()`, so this is a new but Zod-idiomatic addition. `z.coerce.date()` mirrors `publishDate`/`updatedDate` which are also `z.coerce.date()` (required, no default) — coercion from `"YYYY-MM-DD"` string works identically.

### Pattern 2: Data/Config Module — Single Source of Truth
**What:** A `src/data/*.ts` module exporting a named const config object, consumed via `@/data/*` path alias across pages/layouts/components.
**When to use:** Any site-wide data that multiple templates need (categories, navigation, author profile).
**Example:**
```typescript
// Source: src/data/site.ts (existing pattern, lines 1-24) — authors.ts should mirror this shape
export const site = {
  name: "ValueInvesting.com.vn",
  author: "Nguyễn Viết Lộc",
  // ...
};

// NEW: src/data/authors.ts (per D-01/D-02)
export const author = {
  name: "Nguyễn Viết Lộc",
  slug: "nguyen-viet-loc",
  role: "Người phụ trách nội dung",
  bio: "Phụ trách nội dung tại ValueInvesting.com.vn — tập trung giải thích khái niệm đầu tư bằng ngôn ngữ rõ ràng, có nguồn tham khảo, không khuyến nghị mua bán.",
  credentials: [] as string[],       // placeholder — user fills later (Claude's Discretion)
  experience: "Xây dựng nội dung giáo dục tài chính cho nhà đầu tư cá nhân, biên tập theo hướng có nguồn và không khuyến nghị mua bán.",
  expertise: ["Đầu tư giá trị", "Phân tích cơ bản", "Sản phẩm đầu tư cho người mới"],
  avatar: undefined as string | undefined,        // optional, placeholder
  socialLinks: undefined as { linkedin?: string; twitter?: string; email?: string } | undefined,
};

export type Author = typeof author;
```
**Naming for Phase 4 extensibility:** Per Claude's Discretion in CONTEXT.md, export name should not block future array conversion. `export const author = {...}` plus, if useful, `export const authors = [author] as const;` gives Phase 4 (`/author/[slug]`) an iterable without a breaking rename — but only add `authors[]` if Phase 4 research confirms it's needed; do not over-engineer Phase 2.

### Pattern 3: Defensive Fallback for Lookups (existing convention)
**What:** Nullish coalescing for any optional/missing data.
**When to use:** When refactoring `about.astro`'s `site.authorProfile.education`/`publishedIn` etc. — D-02's `authors.ts` field set does NOT include `education` or `publishedIn` or `moneyPerspective`. These three fields exist in current `site.authorProfile` and ARE rendered on `about.astro` today (lines 46, 109, 115) but are NOT in the D-02 field list (`name, slug, role, bio, credentials, experience, expertise, avatar?, socialLinks?`).
**Example:**
```typescript
// Existing pattern, src/data/site.ts / consuming components
const meta = categoryMeta[article.data.category] ?? { abbr: "?", label: article.data.category, gradientClass: "thumb-stocks" };
```

### Anti-Patterns to Avoid
- **Duplicating author data across `site.ts` and `authors.ts`:** D-06 requires single source of truth. If `site.author` is kept as a string alias for backward compat, it MUST be derived (`export const site = { ..., author: author.name }`) by importing from `authors.ts`, not hand-duplicated.
- **Making `citations`/`keyTakeaways` required or non-defaulted:** Would break all 21 existing articles at build time — `astro check`/`astro build` would throw Zod validation errors immediately.
- **Changing `AuthorBox.astro` markup/CSS while doing the data refactor:** Per D-06 and 02-UI-SPEC.md, only the data source changes — DOM structure, classes, computed styles must remain byte-identical.
- **Dropping `moneyPerspective`/`education`/`publishedIn` from `about.astro` silently:** These fields are used today (about.astro lines 46, 109, 115) but are not part of D-02's `authors.ts` shape. The refactor must either (a) add these as additional fields on the `authors.ts` object beyond the D-02 minimum (allowed — D-02 says "đủ chi tiết... không cần thêm field mới", implying the listed fields are a floor, not a ceiling), or (b) explicitly decide to drop/move this content. Silently deleting rendered content during a "no visual change" data refactor would violate the phase boundary. **Recommendation: add these fields to `authors.ts` as additional properties alongside the D-02 set** — `moneyPerspective`, `education`, `publishedIn` — since they are author-profile data that belongs in the single source of truth, and Phase 4's `/author/[slug]` page will need them anyway.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Optional frontmatter field validation | Custom runtime checks in layouts (`if (entry.data.citations) ...`) for *schema* validity | Zod `.default([])` / `.optional()` in `content.config.ts` | Zod already handles missing-field defaulting at build time; layouts just consume typed, defaulted values |
| Date coercion from `"YYYY-MM-DD"` strings | Manual `new Date(string)` parsing | `z.coerce.date()` (same as existing `publishDate`/`updatedDate`) | Already proven in this schema; consistent behavior |

**Key insight:** This phase requires zero new tooling — it is 100% reuse of patterns already present in `content.config.ts` and `site.ts`. The only "new" pattern is the `authors.ts` module shape, which is itself a copy of the `site.ts` module pattern.

## Common Pitfalls

### Pitfall 1: Missing call sites during the `site.author`/`authorProfile` refactor
**What goes wrong:** Only `AuthorBox.astro`, `ArticleLayout.astro`, `BaseLayout.astro` get refactored (as the phase description's "additional_context" suggested), leaving `about.astro` and `index.astro` still importing `site.author`/`site.authorProfile` from `site.ts`. If `site.ts`'s `author`/`authorProfile` fields are then removed (rather than aliased), these two files break at build time with TypeScript errors (`Property 'author' does not exist on type...`).
**Why it happens:** The 5 call sites are not co-located — `about.astro` and `index.astro` are pages, not the layouts/components the phase description focused on.
**How to avoid:** Grep-confirmed full call-site list (this research): `src/components/AuthorBox.astro` (lines 7,13,17,23), `src/layouts/ArticleLayout.astro` (lines 45,50,98,126 — note line 50 is `site.editorialReviewer`, NOT author data, leave as-is or migrate separately), `src/layouts/BaseLayout.astro` (lines 79,138), `src/pages/about.astro` (lines 13,27,28,35,46,52,66,103,109,115), `src/pages/index.astro` (line 176). All 5 files with author-data references must be updated in the same plan/wave.
**Warning signs:** `astro check` reports `Property 'authorProfile' does not exist on type` after removing fields from `site.ts`.

### Pitfall 2: `site.editorialReviewer` confused with author refactor
**What goes wrong:** `ArticleLayout.astro:50` uses `site.editorialReviewer` (a separate field: `"Ban biên tập ValueInvesting.com.vn"`) for the `reviewedBy` JSON-LD field. D-05 explicitly says **no `reviewedBy` field** is being added to content schema for solo-blog reasons, but this is a *different* `editorialReviewer` — an existing `site.ts` field used in JSON-LD `reviewedBy.@type: Organization`. This field is NOT part of the author refactor scope and should NOT be moved into `authors.ts` (it's an organization, not the author/person).
**Why it happens:** Naming similarity (`reviewedBy` JSON-LD key vs. D-05's rejected `reviewedBy` schema field) could cause confusion during planning.
**How to avoid:** Leave `site.editorialReviewer` untouched in `site.ts`. It is out of scope for Phase 2.

### Pitfall 3: `factCheckedDate` with no default — type is `Date | undefined`
**What goes wrong:** If a Phase 3 component (or accidentally a Phase 2 verification script) does `entry.data.factCheckedDate.toLocaleDateString(...)` without an undefined check, TypeScript strict mode (already enabled per `tsconfig.json` extends `astro/tsconfigs/strict`) will flag it, OR if checks are loose, it throws at runtime/build for the 21 articles lacking this field.
**Why it happens:** `.optional()` without `.default()` is a new pattern in this schema — all current optional-ish fields (`tags`, `faq`, `sources`, `featured`, `order`) use `.default(...)`, so there's no existing precedent for `undefined`-handling in this codebase's content consumers.
**How to avoid:** Phase 2 itself does not need to render `factCheckedDate` anywhere (no UI surface per 02-UI-SPEC.md). Just ensure the Zod field compiles and 21 articles build. Document the `Date | undefined` type clearly in `content.config.ts` comments for Phase 3's benefit.
**Warning signs:** `astro check` TS errors referencing `factCheckedDate` if any Phase 2 code accidentally touches it.

### Pitfall 4: `astro check` caching / `.astro/collections` stale types
**What goes wrong:** After editing `content.config.ts`, Astro's generated content types (`.astro/types.d.ts` / `.astro/collections`) may be stale, causing phantom type errors or, conversely, masking real ones.
**Why it happens:** Astro caches content collection types and regenerates them on `astro sync`/`astro dev`/`astro check`.
**How to avoid:** Run `astro check` (which triggers a sync) after schema changes; if errors seem unrelated to the actual edit, run `astro sync` explicitly first, then `astro check` again.
**Warning signs:** Type errors mentioning fields that were never touched, or errors persisting after a correct fix.

## Code Examples

### Verifying all 21 articles still build after schema extension
```bash
# Source: package.json build script ("astro check && astro build")
npx astro check   # type-checks content collections against new Zod schema
npx astro build   # full static build — fails if any of the 21 articles fail Zod validation
```
Baseline confirmed during this research session: `npx astro check` on the current (pre-Phase-2) schema returns **0 errors, 0 warnings** (8 unrelated hints about `is:inline` scripts in pages outside this phase's scope). Any new errors after the schema edit are attributable to the Phase 2 change.

### `authors.ts` consumption in AuthorBox.astro (data-source-only refactor)
```astro
---
// Source: pattern derived from src/components/AuthorBox.astro (existing) + src/data/authors.ts (new)
import { author } from "@/data/authors";
---

<aside class="author-box">
  <div class="author-avatar" aria-hidden="true">
    {author.name.split(" ").pop()?.charAt(0)}
  </div>
  <div class="author-info">
    <div class="author-heading">
      <div>
        <p class="author-label">Về tác giả</p>
        <a class="author-name" href="/about/">{author.name}</a>
      </div>
      <a class="author-profile-link" href="/about/">Xem hồ sơ</a>
    </div>
    <p class="author-role">{author.role}</p>
    <p class="author-bio">{author.bio}</p>
    <div class="author-expertise" aria-label="Chuyên môn tác giả">
      {author.expertise.map((item) => <span>{item}</span>)}
    </div>
    <p class="author-note">
      Nội dung được viết cho mục đích giáo dục tài chính, ưu tiên nguồn chính thống và tiếp nhận phản hồi đính chính qua email công khai.
    </p>
  </div>
</aside>
<!-- styles unchanged per D-06 -->
```
Note: `author.bio` must equal the exact existing hardcoded string (per 02-UI-SPEC.md Copywriting Contract) so output is byte-identical.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| N/A | N/A | N/A | No ecosystem shifts relevant — this is an internal data-model refactor using existing, current-version tooling (Astro 5.9.3, bundled Zod) |

**Deprecated/outdated:** None applicable.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `authors.ts` should additionally retain `moneyPerspective`, `education`, `publishedIn` fields beyond D-02's listed set, to avoid dropping content currently rendered in `about.astro` | Anti-Patterns / Pattern 3 | If the planner instead drops this content per a strict reading of D-02, `about.astro` loses rendered sections (moneyPerspective quote, education line, publishedIn tags) — a visual regression not flagged by 02-UI-SPEC.md (which only covers `AuthorBox.astro`). Low risk if confirmed with user during planning; D-02 itself says the field list should be "đủ chi tiết... không cần thêm field mới" implying floor not ceiling. |
| A2 | `export const author = {...}` (singular, named `author`) is the correct export name, with no `authors[]` array needed in Phase 2 | Pattern 2 | If Phase 4 strictly requires array-based iteration for `/author/[slug]` `getStaticPaths`, a rename/wrap will be needed then — low risk, trivial to add `export const authors = [author]` later without breaking `author` import |
| A3 | `site.author` and `site.authorProfile` can be fully removed from `site.ts` once all 5 call sites are migrated (no external/unknown consumers) | Pitfall 1 | If some other untracked file (e.g. a `.astro` page not grepped, or content-engine markdown referencing this programmatically — unlikely since content engine is pure markdown) references `site.author`, build breaks. Grep was comprehensive (`src/**/*.astro`, `src/**/*.ts`) — risk is low. |

## Open Questions

1. **Should `site.author` remain as a re-exported alias string in `site.ts` for any reason?**
   - What we know: Grep found 5 files referencing `site.author`/`authorProfile`/`editorialReviewer`; all 5 are in-scope for this phase's refactor per D-06's broadened understanding.
   - What's unclear: Whether removing `author`/`authorProfile` from `site.ts` entirely (vs. keeping `author: author.name` as a derived alias) causes friction with any future phase that imports `site` for unrelated reasons and also expects `.author`.
   - Recommendation: Planner should have the executing task grep again at refactor time (cheap, ~5s) to confirm no new references were added since this research, then decide alias-vs-remove based on whether any remaining `site.ts` consumer needs a plain author-name string for non-author-data purposes (e.g., copyright line in `BaseLayout.astro` footer — check `site.disclosure`/footer usage, which currently does NOT use `site.author` directly based on the BaseLayout read above, only `site.name` and `site.disclosure`).

2. **Exact placeholder values for `credentials`, `avatar`, `socialLinks` (Claude's Discretion per CONTEXT.md)**
   - What we know: D-02 lists these as optional/placeholder fields; user can fill in later.
   - What's unclear: Whether to use empty arrays/`undefined`, or illustrative placeholder text (e.g., `credentials: []`, `avatar: undefined`, `socialLinks: undefined`).
   - Recommendation: Use empty/undefined values (`credentials: []`, `avatar: undefined`, `socialLinks: undefined`) rather than fabricated placeholder text — per CLAUDE.md's YMYL caution, inventing fake credentials for a financial-content author is a trust/EEAT risk if accidentally shipped. Empty/absent is safer than fictional.

## Environment Availability

Not applicable — this phase has no external tool/service dependencies beyond the already-installed Astro toolchain (confirmed working via `npx astro check` during this research session).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — no test framework configured (confirmed in CONVENTIONS.md and STRUCTURE.md: "Not detected — no test framework, test files, or test scripts in package.json") |
| Config file | none |
| Quick run command | `npx astro check` |
| Full suite command | `npx astro check && npx astro build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|---------------------|-------------|
| EEAT-01 | `content.config.ts` accepts new optional fields; 21 existing articles build without supplying them | build/type-check | `npx astro check && npx astro build` | ✅ (build pipeline exists; no dedicated test file) |
| EEAT-02 | `src/data/authors.ts` exists and is the single source for author data; `AuthorBox`/layouts resolve from it without duplication | type-check + manual grep | `npx astro check` + `grep -rn "site\.author\|authorProfile" src/` (expect 0 or only intentional alias) | ✅ |

### Sampling Rate
- **Per task commit:** `npx astro check` (fast type/schema validation, < 30s)
- **Per wave merge:** `npx astro check && npx astro build` (full build, validates all 21 articles + JSON-LD generation)
- **Phase gate:** Full build green, plus manual grep confirming no stale `site.author`/`site.authorProfile` references remain (except any deliberate, documented alias)

### Wave 0 Gaps
- No test framework exists. Recommend adding a lightweight Wave 0 task: a manual verification script or checklist step (not a test file) that runs `npx astro build` and asserts exit code 0, plus a `grep` assertion for stale references. No new test framework should be introduced in this phase (out of scope, would be a separate infrastructure decision).
- `.astro/` content type cache: if schema edits produce confusing type errors, run `npx astro sync` before `npx astro check` (documented in Pitfall 4).

*(No automated test files needed for this phase — build-time Zod validation IS the test, consistent with the project's existing "no test framework" reality per CONVENTIONS.md.)*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | Static site, no auth |
| V3 Session Management | No | Static site, no sessions |
| V4 Access Control | No | Public content, no access control |
| V5 Input Validation | Yes | Zod schema in `content.config.ts` IS the input validation layer for all article frontmatter — new `citations`/`keyTakeaways`/`factCheckedDate` fields must use the same Zod-based validation as existing fields (no hand-rolled validation) |
| V6 Cryptography | No | No crypto operations in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Malformed/oversized `citations[].url` injected into JSON-LD or rendered `<a href>` (Phase 3 will render these) | Tampering / Information Disclosure | Zod `.optional()` string validation at build time (this phase) is the first gate; Phase 3 should additionally ensure `url` values are rendered as `href` attributes (Astro auto-escapes), not `set:html`. Phase 2 itself does not render `citations` anywhere, so no immediate XSS surface — but the schema shape chosen here (D-03: `url` as plain `z.string()`, not `z.string().url()`) means Phase 3 inherits responsibility for safe rendering. **Recommendation for planner:** consider `z.string().url().optional()` instead of `z.string().optional()` for `citations[].url` to reject malformed URLs at build time — this is a minor schema-strictness improvement over D-03's literal spec and should be raised as a discussion point, not silently changed (D-03 is a locked decision; if `.url()` is desired, confirm with user since it's stricter than what was decided). |
| Author data (`authors.ts`) used in JSON-LD `Person`/`Organization` blocks | Spoofing / Information Disclosure | Since `authors.ts` is static, build-time-only data (no user input), there's no injection vector — but ensure no PII beyond what's intentionally public (email, social links) is added as placeholder data (ties to Open Question 2 / Assumption — avoid fabricated credentials). |

