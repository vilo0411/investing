# Phase 2: EEAT Data Model & Schema Extensions - Pattern Map

**Mapped:** 2026-06-12
**Files analyzed:** 7
**Analogs found:** 7 / 7

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `src/content.config.ts` | config (Zod schema) | CRUD (validate) | `src/content.config.ts` (itself, additive) | exact |
| `src/data/authors.ts` | config/data module | request-response (static lookup) | `src/data/site.ts` | exact (same module pattern) |
| `src/data/site.ts` | config | request-response | itself | exact |
| `src/components/AuthorBox.astro` | component | request-response (render) | itself (data-source swap only) | exact |
| `src/layouts/ArticleLayout.astro` | layout | request-response | itself | exact |
| `src/layouts/BaseLayout.astro` | layout | request-response | itself | exact |
| `src/pages/about.astro`, `src/pages/index.astro` | route/page | request-response | themselves | exact |

## Pattern Assignments

### `src/content.config.ts` (config, additive Zod schema)

**Analog:** itself — existing `tags`/`faq`/`sources` fields (lines 14-19)

```typescript
tags: z.array(z.string()).default([]),
faq: z.array(z.object({
  question: z.string(),
  answer: z.string(),
})).default([]),
sources: z.array(z.string()).default([]),
```

**Add (per D-03/D-04/D-05):**
```typescript
citations: z.array(z.object({
  title: z.string(),
  url: z.string().optional(),
  publisher: z.string().optional(),
  date: z.string().optional(),
})).default([]),
keyTakeaways: z.array(z.string()).default([]),
factCheckedDate: z.coerce.date().optional(),
```
`factCheckedDate` mirrors `publishDate`/`updatedDate` (`z.coerce.date()`, line 9-10) but stays `.optional()` with no default — first `.optional()`-without-default field in this schema. Add a comment noting `Date | undefined` type for downstream consumers.

---

### `src/data/authors.ts` (NEW — config/data module)

**Analog:** `src/data/site.ts` lines 1-24 (`site` object + `authorProfile` sub-object)

```typescript
export const site = {
  name: "ValueInvesting.com.vn",
  author: "Nguyễn Viết Lộc",
  ...
  authorProfile: {
    role: "Người phụ trách nội dung",
    expertise: [...],
    moneyPerspective: "...",
    experience: [...],
    education: "...",
    publishedIn: [...],
  },
};
```

**New module pattern (D-01/D-02 + A1 — retain `moneyPerspective`/`education`/`publishedIn`):**
```typescript
export const author = {
  name: "Nguyễn Viết Lộc",
  slug: "nguyen-viet-loc",
  role: "Người phụ trách nội dung",
  bio: "Phụ trách nội dung tại ValueInvesting.com.vn — tập trung giải thích khái niệm đầu tư bằng ngôn ngữ rõ ràng, có nguồn tham khảo, không khuyến nghị mua bán.",
  credentials: [] as string[],
  experience: "...", // D-02: single descriptive string (note: site.ts authorProfile.experience is string[] today — about.astro line 103 maps it; decide whether to keep array or convert to string per D-02, see about.astro section below)
  expertise: ["Đầu tư giá trị", "Phân tích cơ bản", "Sản phẩm đầu tư cho người mới"],
  avatar: undefined as string | undefined,
  socialLinks: undefined as { linkedin?: string; twitter?: string; email?: string } | undefined,
  // retained from site.authorProfile (A1, about.astro consumers):
  moneyPerspective: "Đầu tư nên bắt đầu từ hiểu doanh nghiệp, hiểu rủi ro và biết giới hạn của chính mình trước khi nhìn vào lợi nhuận kỳ vọng.",
  education: "Thông tin học vấn và chứng chỉ chuyên môn sẽ được cập nhật khi có hồ sơ xác thực công khai.",
  publishedIn: ["ValueInvesting.com.vn"],
};

export type Author = typeof author;
```

Note: `about.astro:103` iterates `site.authorProfile.experience` as an array (`.map`). D-02 describes `experience` as a single descriptive string. Resolve conflict in plan: either keep `experience` as `string[]` (matches current rendering, simplest migration) or convert to string and adjust `about.astro:103` rendering. Recommend keeping `string[]` to avoid `about.astro` markup changes (lowest risk, D-06 says markup/style frozen for AuthorBox specifically; about.astro is in-scope per research but minimal-diff preferred).

---

### `src/components/AuthorBox.astro` (component, data-source swap only — D-06)

**Analog:** itself, current lines 1-29

```astro
---
import { site } from "@/data/site";
---
<aside class="author-box">
  <div class="author-avatar" aria-hidden="true">
    {site.author.split(" ").pop()?.charAt(0)}
  </div>
  ...
        <a class="author-name" href="/about/">{site.author}</a>
  ...
    <p class="author-role">{site.authorProfile.role}</p>
    <p class="author-bio">
      Phụ trách nội dung tại ValueInvesting.com.vn — ... (hardcoded, NOT from site.ts)
    </p>
    <div class="author-expertise" aria-label="Chuyên môn tác giả">
      {site.authorProfile.expertise.map((item) => <span>{item}</span>)}
    </div>
```

**Refactor mapping:**
- `import { site } from "@/data/site"` → `import { author } from "@/data/authors"`
- `site.author` → `author.name` (lines 7, 13)
- `site.authorProfile.role` → `author.role` (line 17)
- hardcoded `.author-bio` text → `author.bio` (must be byte-identical string per research note)
- `site.authorProfile.expertise` → `author.expertise` (line 23)
- Styles (`<style>` block, lines 31-153) — **unchanged, do not touch**

---

### `src/layouts/ArticleLayout.astro` (layout)

**Analog:** itself

**Refs to migrate (D-06):**
```
line 45: "name": site.author,           → author.name   (JSON-LD Person)
line 50: "name": site.editorialReviewer → LEAVE UNCHANGED (Organization, not author — Pitfall 2)
line 98: author: site.author,           → author.name
line 126: <a href="/about/">{site.author}</a> → <a href="/about/">{author.name}</a>
```
Add `import { author } from "@/data/authors"` alongside existing `import { site } from "@/data/site"` (site import stays, for `site.editorialReviewer`, `site.name`, etc.)

---

### `src/layouts/BaseLayout.astro` (layout)

**Analog:** itself

```
line 79:  "name": site.author,                    → author.name  (JSON-LD)
line 138: { name: "author", content: site.author } → author.name (meta tag)
```
Add `import { author } from "@/data/authors"`.

---

### `src/pages/about.astro` (page)

**Analog:** itself

**Refs to migrate (lines 13, 27, 28, 35, 46, 52, 66, 103, 109, 115):**
```
line 13:  site.author.split(" ").pop()?.charAt(0) ?? site.author.charAt(0)
              → author.name.split(" ").pop()?.charAt(0) ?? author.name.charAt(0)
line 27:  <h1>{site.author}</h1>                    → {author.name}
line 28:  {site.authorProfile.role}                 → {author.role}
line 35:  {site.authorProfile.expertise.map(...)}   → {author.expertise.map(...)}
line 46:  {site.authorProfile.moneyPerspective}      → {author.moneyPerspective}
line 52:  {site.author} phụ trách nội dung...        → {author.name} phụ trách nội dung...
line 66:  Mới nhất từ {site.author.split(" ").pop()} → Mới nhất từ {author.name.split(" ").pop()}
line 103: {site.authorProfile.experience.map(...)}   → {author.experience.map(...)} (keep array shape, see authors.ts note)
line 109: {site.authorProfile.education}             → {author.education}
line 115: {site.authorProfile.publishedIn.map(...)}  → {author.publishedIn.map(...)}
```
Add `import { author } from "@/data/authors"`. `site` import retained for `site.name` (line 52) etc.

---

### `src/pages/index.astro` (page)

**Analog:** itself

```
line 176: <h2 class="section-title">{site.author}</h2> → {author.name}
```
Add `import { author } from "@/data/authors"`.

---

### `src/data/site.ts` (config, modify — remove duplication per D-06)

**Analog:** itself

Remove `author` (line 3) and `authorProfile` (lines 15-23) fields once all 5 call sites migrated. Per Open Question 1 / A3: re-grep at execution time to confirm no other consumer needs `site.author`. If any non-author-data consumer needs a plain name string, keep as derived alias:
```typescript
import { author } from "./authors";
export const site = {
  ...
  author: author.name, // alias, single source of truth in authors.ts
  ...
};
```
`site.editorialReviewer` (line 7) stays untouched (Pitfall 2 — different concept, Organization not Person).

## Shared Patterns

### Additive Optional Zod Fields
**Source:** `src/content.config.ts` lines 14-19 (existing `tags`/`faq`/`sources`)
**Apply to:** New `citations`, `keyTakeaways`, `factCheckedDate` fields — `.default([])` for arrays, `.optional()` (no default) only for `factCheckedDate`.

### Data/Config Module — Single Source of Truth
**Source:** `src/data/site.ts` (whole-file pattern: exported const object + co-located types/helpers)
**Apply to:** `src/data/authors.ts` — export `author` object + `export type Author = typeof author`.

### Defensive Fallback for Lookups
**Source:** `src/data/site.ts` `getCategoryPath` (lines 127-134): `categoryMeta?.path ?? "/"`
**Apply to:** Any optional `authors.ts` field access in layouts (e.g., `author.avatar ?? <default>`).

## No Analog Found

None — all 7 files are modifications/additions to existing files following established in-repo patterns.

## Metadata

**Analog search scope:** `src/content.config.ts`, `src/data/site.ts`, `src/components/AuthorBox.astro`, `src/layouts/ArticleLayout.astro`, `src/layouts/BaseLayout.astro`, `src/pages/about.astro`, `src/pages/index.astro`
**Files scanned:** 7
**Pattern extraction date:** 2026-06-12
