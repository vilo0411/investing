# Phase 3: New EEAT Components - Pattern Map

**Mapped:** 2026-06-12
**Files analyzed:** 7 (6 components + 1 preview page; AuthorBox.astro modified in place)
**Analogs found:** 7 / 7

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/KeyTakeaways.astro` | component | request-response (props-in, render-out) | `src/components/AuthorBox.astro` | role-match (box pattern) |
| `src/components/CitationBox.astro` | component | request-response | `src/components/AuthorBox.astro` + `ArticleLayout.astro` `.ymyl-note`/source-section | role-match |
| `src/components/AuthorBox.astro` (MODIFIED) | component | request-response | itself (v1) + `src/data/authors.ts` | exact (additive edit) |
| `src/components/Breadcrumb.astro` | component | transform (data → nav markup) | `src/layouts/ArticleLayout.astro` inline `.breadcrumb` nav | role-match |
| `src/components/Disclaimer.astro` | component | request-response | `src/layouts/ArticleLayout.astro` `.ymyl-note` aside | exact (extraction of existing pattern) |
| `src/components/ComparisonTable.astro` | component | transform | none (new pattern) — closest is `.faq-list`/`source-section` table-less list in ArticleLayout | no analog (new) |
| `src/pages/_preview/eeat-components.astro` | route/page | request-response | `src/pages/about.astro` (static page, no getStaticPaths) | role-match |

## Pattern Assignments

### `src/components/KeyTakeaways.astro` (component, request-response)

**Analog:** `src/components/AuthorBox.astro`

**Imports/Props pattern** (AuthorBox.astro lines 1-3):
```astro
---
import { author } from "@/data/authors";
---
```
New file uses no imports, just:
```astro
---
interface Props {
  items: string[];
}
const { items } = Astro.props;
---
```

**Core box pattern** — copy structure from AuthorBox.astro lines 5, 28-39 (aside + border-left box):
```astro
<aside class="author-box"> ... </aside>
```
```css
.author-box {
  padding: var(--space-6);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  border-left: 4px solid var(--color-brand-900);
}
```
Adapt class names to `.key-takeaways`, `.kt-label` (label styling copied from `.author-label`, lines 70-77):
```css
.author-label {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}
```

**Empty-state pattern (D-03):** wrap entire `<aside>` in `{items.length > 0 && (...)}` so nothing renders for `items = []`. No analog in codebase uses this exact "return null" convention for a component (AuthorBox always renders) — follow RESEARCH.md Pattern 1 example directly.

---

### `src/components/CitationBox.astro` (component, request-response)

**Analog 1 (box shell):** `src/components/AuthorBox.astro` lines 28-39 (same border-left/surface/radius box as above).

**Analog 2 (source list + date pattern):** `src/layouts/ArticleLayout.astro` lines 157-168 and 127:
```astro
<p class="meta">
  ... Cập nhật {updatedDate.toLocaleDateString("vi-VN")} · {readingTime}
</p>
...
{sources?.length ? (
  <section class="source-section">
    <h2>Nguồn tham khảo</h2>
    <ul>
      {sources.map((source: string) => <li>{source}</li>)}
    </ul>
  </section>
) : null}
```
And source-section box styling (lines 260-267, 288-292):
```css
.source-section {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: 18px 20px;
}
.source-section { margin-top: 42px; }
.source-section p { color: var(--muted); font-size: 0.96rem; line-height: 1.65; }
```

**Date formatting (Pitfall 2):** use `.toLocaleDateString("vi-VN")` exactly as `ArticleLayout.astro:127` does for `updatedDate`. `factCheckedDate` is `Date | undefined` per `content.config.ts` — same coercion as `updatedDate`.

**Conditional fallback logic (D-04/D-05):** no direct codebase analog for the citations-vs-sources branching; follow RESEARCH.md Pattern 2 example verbatim (props: `sources = []`, `citations = []`, `factCheckedDate?`, `updatedDate`).

---

### `src/components/AuthorBox.astro` (MODIFIED, component, request-response)

**Analog:** itself (v1), full file already read — `src/components/AuthorBox.astro` (150 lines).

**Changes required:**
1. Lines 13 and 15 — change `href="/about/"` → `href={`/author/${author.slug}`}` (both the name link and "Xem hồ sơ" link). `author.slug` already exists in `src/data/authors.ts:3` (`"nguyen-viet-loc"`).
2. After line 21 (`</div>` closing `.author-expertise`), insert conditional credentials block (D-07/D-08):
```astro
{author.credentials.length > 0 && (
  <div class="author-credentials" aria-label="Chứng chỉ chuyên môn">
    <p class="author-sublabel">Chứng chỉ</p>
    <ul>
      {author.credentials.map((c) => <li>{c}</li>)}
    </ul>
  </div>
)}
<p class="author-experience">{author.experience}</p>
```
3. New styles for `.author-sublabel` (derive from `.author-label` lines 70-77, but `color: var(--muted)` per UI-SPEC) and `.author-experience` (copy `.author-bio`/`.author-note` styling, lines 115-121):
```css
.author-bio,
.author-note {
  margin: var(--space-1) 0 0;
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.6;
}
```

**Data source:** `src/data/authors.ts` — `author.credentials` (currently `[]`), `author.experience` (string, already populated), `author.slug` (`"nguyen-viet-loc"`) — all fields already exist, no schema change needed.

**Important:** Since this file IS wired into `ArticleLayout.astro` (line 178, `<AuthorBox />`) and ships to all 21 live articles, the `/author/{slug}` link will 404 until Phase 4 builds that route (Pitfall 4 — accepted per D-09).

---

### `src/components/Breadcrumb.astro` (component, transform)

**Analog:** `src/layouts/ArticleLayout.astro` lines 110-122 (inline visual breadcrumb, NOT the JSON-LD at lines 74-89 which stays untouched):
```astro
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Trang chủ</a>
  <span aria-hidden="true">›</span>
  {isInvestingCategory && categoryGroupPath ? (
    <>
      <a href={categoryGroupPath}>Đầu tư</a>
      <span aria-hidden="true">›</span>
    </>
  ) : null}
  <a href={categoryPath}>{categoryTitle}</a>
  <span aria-hidden="true">›</span>
  <span aria-current="page">{title}</span>
</nav>
```

**Styling** (lines 191-214):
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.breadcrumb a {
  color: var(--muted);
  transition: color var(--transition);
}
.breadcrumb a:hover {
  color: var(--brand);
  text-decoration: none;
}
.breadcrumb span[aria-current] {
  color: var(--color-neutral-400);
}
```

**Generalization required (per CONTEXT.md/UI-SPEC):** new component takes generic `items: { label: string; href?: string }[]` prop instead of being coupled to `entry`/`categories`/`isInvestingCategory`. Use `var(--brand)` for link color per UI-SPEC (not `var(--muted)` as the inline version does) and `gap: var(--space-2)`, separator "›" per UI-SPEC copy contract. Last item renders as plain text with `aria-current="page"`, no link even if `href` provided.

**No box wrapper** — unlike the other 4 components, this is flush/inline, not a `<aside>` border-left box.

---

### `src/components/Disclaimer.astro` (component, request-response)

**Analog:** `src/layouts/ArticleLayout.astro` lines 139-142 (`.ymyl-note` aside, currently inline):
```astro
<aside class="ymyl-note" aria-label="Lưu ý tài chính">
  <strong>Lưu ý trước khi đọc:</strong>
  <span>{site.disclosure}</span>
</aside>
```

**Styling** (lines 260-280):
```css
.ymyl-note {
  display: grid;
  gap: 4px;
  margin: 28px 0 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  border-left: 4px solid var(--color-brand-900);
  padding: 18px 20px;
}
.ymyl-note strong {
  color: var(--color-brand-900);
}
.ymyl-note span {
  color: var(--muted);
  font-size: 0.96rem;
  line-height: 1.65;
}
```

**Data source:** `src/data/site.ts` lines 12-13 — `site.disclosure`:
```typescript
disclosure:
  "ValueInvesting.com.vn không cung cấp dịch vụ tư vấn đầu tư cá nhân, môi giới chứng khoán hoặc tín hiệu giao dịch. Nội dung chỉ nhằm mục đích giáo dục.",
```
Import: `import { site } from "@/data/site";`

**New component:**
```astro
---
import { site } from "@/data/site";
interface Props {
  text?: string;
}
const { text = site.disclosure } = Astro.props;
---
<aside class="disclaimer" aria-label="Lưu ý tài chính">
  <strong>Lưu ý quan trọng:</strong>
  <span>{text}</span>
</aside>
```
Use `padding: var(--space-6)` (token-based, per UI-SPEC) instead of the legacy hardcoded `18px 20px` in `.ymyl-note`, and class name `.disclaimer` instead of `.ymyl-note`. UI-SPEC heading text is "Lưu ý quan trọng:" (differs from the existing inline "Lưu ý trước khi đọc:" — use the new wording per UI-SPEC copy contract, do not copy verbatim).

---

### `src/components/ComparisonTable.astro` (component, transform)

**No close analog** — first table-based component in the codebase. Build per RESEARCH.md Pattern 3 verbatim:
```astro
---
interface Props {
  columns: string[];
  rows: (string | number)[][];
  caption?: string;
}
const { columns, rows, caption } = Astro.props;
---
<div class="comparison-table-wrap">
  <table class="comparison-table">
    {caption && <caption>{caption}</caption>}
    <thead>
      <tr>{columns.map((col) => <th>{col}</th>)}</tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr>{row.map((cell) => <td>{cell}</td>)}</tr>
      ))}
    </tbody>
  </table>
</div>
```
Token usage follows AuthorBox/ymyl-note conventions for `border`, `border-radius`, `var(--line)`. Header background uses `var(--color-brand-900)` + `#fff` (same accent color as AuthorBox avatar background, AuthorBox.astro line 46: `background: var(--color-brand-900); color: #fff;`). Zebra rows use `var(--surface-alt)` (new token, not previously used in any component — verify exists in `src/styles/tokens/`).

---

### `src/pages/_preview/eeat-components.astro` (route/page, request-response)

**Analog:** any static page under `src/pages/` with no `getStaticPaths` — e.g. `src/pages/about.astro` (uses `BaseLayout`, imports components, renders static content). Structure:
```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import KeyTakeaways from "@/components/KeyTakeaways.astro";
import CitationBox from "@/components/CitationBox.astro";
import AuthorBox from "@/components/AuthorBox.astro";
import Breadcrumb from "@/components/Breadcrumb.astro";
import Disclaimer from "@/components/Disclaimer.astro";
import ComparisonTable from "@/components/ComparisonTable.astro";
---
<BaseLayout title="EEAT Components Preview" description="...">
  <!-- render each component twice: populated + empty/fallback -->
</BaseLayout>
```
Path alias `@/*` → `src/*` per `tsconfig.json`.

**Sitemap exclusion:** add `_preview` path to existing sitemap `filter` in `astro.config.mjs`, same mechanism used for `kien-thuc` exclusion (RESEARCH.md Open Question #2). Inspect `astro.config.mjs` filter function before implementing — not read in this pattern pass, planner should grep for `filter:` and `kien-thuc` in `astro.config.mjs`.

---

## Shared Patterns

### Box/callout shell (border-left accent)
**Source:** `src/components/AuthorBox.astro` lines 28-39 (`.author-box`)
**Apply to:** KeyTakeaways, CitationBox, Disclaimer (all 3 use identical `aside` + border-left-4px + `var(--surface)` + `var(--line)` + `var(--radius-md)` + `var(--space-6)` padding pattern)
```css
border: 1px solid var(--line);
border-radius: var(--radius-md);
background: var(--surface);
border-left: 4px solid var(--color-brand-900);
padding: var(--space-6);
```

### Eyebrow/label styling
**Source:** `src/components/AuthorBox.astro` lines 70-77 (`.author-label`)
**Apply to:** KeyTakeaways (`.kt-label`), CitationBox (`.citation-label`)
```css
font-size: 0.78rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.08em;
color: var(--color-accent);
```

### Date formatting (Vietnamese locale)
**Source:** `src/layouts/ArticleLayout.astro` line 127
**Apply to:** CitationBox (`factCheckedDate`, `updatedDate`)
```typescript
updatedDate.toLocaleDateString("vi-VN")
```

### Brand-color accent (background + white text)
**Source:** `src/components/AuthorBox.astro` line 46 (avatar circle)
**Apply to:** ComparisonTable `<th>` background
```css
background: var(--color-brand-900);
color: #fff;
```

### External link safety
**Source:** RESEARCH.md security guidance (no direct codebase analog — existing site has no `target="_blank"` external links in components read)
**Apply to:** CitationBox citation links
```astro
<a href={c.url} target="_blank" rel="noopener noreferrer">{c.title}</a>
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/components/ComparisonTable.astro` | component | transform | No table-based component exists; build per RESEARCH.md Pattern 3, reusing only color/spacing tokens from AuthorBox |

## Metadata

**Analog search scope:** `src/components/`, `src/layouts/`, `src/data/`, `src/pages/about.astro`
**Files scanned:** `AuthorBox.astro`, `ArticleLayout.astro`, `authors.ts`, `site.ts`
**Pattern extraction date:** 2026-06-12
