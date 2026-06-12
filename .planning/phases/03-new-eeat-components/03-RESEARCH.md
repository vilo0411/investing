# Phase 3: New EEAT Components - Research

**Researched:** 2026-06-12
**Domain:** Astro component development (presentational, token-driven, standalone)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Key Takeaways component**
- D-01: Component chỉ nhận props (`items: string[]`) — không tự parse `## Key takeaways` từ markdown body. Việc extract (remark plugin hoặc cách khác) là việc của Phase 4/ARTL-01. Phase 3 chỉ test component với `items` đầy và `items = []`.
- D-02: Visual style: box viền màu (border-left accent, theo pattern AuthorBox hiện có với `border-left: 4px solid var(--color-brand-900)`, nền `var(--surface)`), title "Tóm tắt nội dung chính" hoặc tương đương, mỗi item có icon checklist (✓) phía trước.
- D-03: Empty state (`items = []`): component trả về `null` — không render gì, không reserve placeholder. (Lưu ý: điều này khác nhẹ với cách diễn đạt "reserved space to avoid layout shift" trong ROADMAP Success Criteria #1 của Phase 3 — planner nên xác nhận cách diễn giải "reserved space" là tránh CLS ở mức tổng thể trang khi backfill Phase 4 thêm component vào, không phải placeholder rỗng hiển thị ở Phase 3.)

**Citation/Fact-check box**
- D-04: Component nhận cả 2 props optional: `sources?: string[]` (legacy, 21 bài hiện có) và `citations?: { title, url?, publisher?, date? }[]` (mới, Phase 2). Khi chỉ có `sources`, render mỗi string như một dòng trong danh sách nguồn tham khảo (không link/publisher/date). Khi có `citations`, render đầy đủ title/publisher/date/link nếu có.
- D-05: `factCheckedDate` prop optional. Nếu có giá trị → hiển thị "Kiểm tra nguồn lần cuối: {factCheckedDate}". Nếu rỗng (mặc định cho 21 bài hiện tại) → fallback hiển thị "Cập nhật lần cuối: {updatedDate}" (component cần nhận thêm `updatedDate` prop cho fallback này).
- D-06: Style/vị trí: box riêng theo pattern AuthorBox hiện có (border-left màu accent + `var(--surface)` + radius), không phải dải ngang mỏng. Đặt cuối content, trước AuthorBox v2 — phù hợp thứ tự EEAT của Phase 4 (Content → Citation box → AuthorBox v2).

**AuthorBox v2**
- D-07: Thêm hiển thị `credentials: string[]` và `experience: string` (cả hai đã có trong `src/data/authors.ts` từ Phase 2; `credentials` hiện đang `[]`). Đổi link "Xem hồ sơ" từ `/about/` sang `/author/{slug}`.
- D-08: Khi `credentials = []` (trạng thái hiện tại) — ẩn hoàn toàn khu vực/heading credentials, không hiển thị fallback text. Layout co gọn tự nhiên.
- D-09: Link "Xem hồ sơ" trỏ thẳng tới `/author/{slug}` theo thiết kế cuối cùng, dù trang đó chưa tồn tại (Phase 4 mới build) — chấp nhận 404 tạm thời trong giai đoạn Phase 3 (component-isolation, chưa wire vào layout thật/deploy).
- Giữ nguyên các phần đã có ở v1: avatar/initial, name, role, bio, expertise tags — chỉ bổ sung thêm, không redesign toàn bộ layout.

**Comparison table**
- D-10: Component Astro với structured props (ví dụ `<ComparisonTable columns={[...]} rows={[...]} />`), không phải CSS style cho markdown table thô.
  - Research flag: Bài viết hiện tại dùng content collection `type: "content"` (`.md`), không phải MDX — cần xác nhận liệu component Astro có thể được dùng/render trong nội dung `.md` của content collection hiện tại, hoặc liệu cần đổi sang MDX cho các bài có comparison table (ảnh hưởng schema/build, cần research trước khi plan).
- D-11: Bảng rộng trên mobile: bọc trong wrapper `overflow-x: auto`, giữ cấu trúc `<table>` nguyên vẹn (không stack thành card).
- D-12: Visual style: header row nổi bật với nền `var(--color-brand-900)`/chữ trắng (đồng bộ màu brand), kèm zebra striping cho các row — phong cách rõ ràng, data-heavy phù hợp so sánh sản phẩm tài chính.

### Claude's Discretion

Breadcrumb navigation và Disclaimer/risk-disclosure component không được thảo luận sâu — implement theo design tokens hiện có (Phase 1), markup/style nhất quán với AuthorBox/Citation box pattern (border/surface/radius). Breadcrumb cần hoạt động cho cả ngữ cảnh article và category page (theo Success Criteria #4). Nội dung text cụ thể cho Disclaimer (wording rủi ro tài chính) — Claude soạn nội dung phù hợp YMYL theo `.antigravity/rules/content-anti-ai.md`, user review sau.

Tên prop chính xác, cấu trúc file (`src/components/*.astro`), và chi tiết CSS — theo conventions hiện có trong codebase (scoped `<style>`, var(--space-*) tokens).

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope. Việc wire components vào ArticleLayout, build `/author/[slug]`, JSON-LD đầy đủ từ `authors.ts`, và backfill 21 bài (EEAT-10) đã thuộc Phase 4 theo roadmap, không phải deferred mới.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EEAT-03 | Component "Key Takeaways" hiển thị box tóm tắt ý chính đầu bài viết, lấy dữ liệu từ section `## Key takeaways` hiện có hoặc field mới trong frontmatter | `KeyTakeaways.astro` built per Pattern 1 (border-left box), `items: string[]` prop, `items=[]` → render `null` (D-01/D-03). Markdown-section extraction explicitly deferred to Phase 4/ARTL-01. |
| EEAT-04 | Component "Citation/Fact-check box" hiển thị danh sách nguồn tham khảo và ngày cập nhật cuối cùng ở cuối bài viết | `CitationBox.astro` per Pattern 2, consuming `sources?`, `citations?`, `factCheckedDate?`, `updatedDate` exactly as typed in `content.config.ts`; date formatting via `.toLocaleDateString("vi-VN")` (Pitfall 2). |
| EEAT-05 | AuthorBox được nâng cấp (v2): hiển thị chuyên môn, kinh nghiệm, link đến trang hồ sơ tác giả | AuthorBox v2 extends `AuthorBox.astro` per Code Examples section, reading `author.credentials`/`author.experience`/`author.slug` from `src/data/authors.ts` (Phase 2 output), conditional credentials rendering (D-08), link to `/author/{slug}` (D-09, see Pitfall 4 for sequencing note). |
| EEAT-07 | Component breadcrumb navigation hiển thị trên trang bài viết và trang danh mục | New `Breadcrumb.astro` with generic `items: {label, href?}[]` prop (Anti-Patterns section) — decoupled from `entry`/`categories` so it works for both article and category contexts; does not duplicate existing JSON-LD BreadcrumbList in `ArticleLayout.astro`. |
| EEAT-08 | Component disclaimer/risk-disclosure hiển thị trên các bài viết liên quan đến quyết định tài chính | New `Disclaimer.astro` per Code Examples section, reusing/aligning with existing `.ymyl-note` pattern and `site.disclosure` copy (A2), styled per Pattern 1. |
| EEAT-09 | Component bảng so sánh (comparison table) được style nhất quán cho các bài so sánh sản phẩm tài chính | New `ComparisonTable.astro` per Pattern 3 — `columns: string[]` / `rows: (string|number)[][]` structured props, `overflow-x: auto` wrapper (D-11), brand-color header + zebra rows (D-12). MDX/in-body-invocation question explicitly deferred (see Open Questions #1, D-10 resolution in Summary). |

</phase_requirements>

## Summary

Phase 3 is a pure component-authoring phase: build 6 standalone, token-driven `.astro` presentational components (Key Takeaways, Citation/Fact-check box, AuthorBox v2, Breadcrumb, Disclaimer, Comparison table) that consume props matching the Phase 2 schema, render correctly with both populated and empty/fallback data, and follow the existing `AuthorBox.astro` visual pattern (border-left accent + `var(--surface)` + `var(--radius-md)`). No wiring into `ArticleLayout.astro`, no new routes, no markdown parsing.

The codebase already has everything Phase 3 needs as inputs: Phase 1 delivered a complete design token system (`src/styles/tokens/*.css`), Phase 2 delivered the exact schema shapes (`citations`, `keyTakeaways`, `factCheckedDate`, `sources`, `updatedDate` in `content.config.ts`, and `credentials`/`experience`/`slug` in `authors.ts`). The `AuthorBox.astro` component is the canonical visual reference — every new box-style component (Key Takeaways, Citation box, Disclaimer) should structurally mirror its `<aside>` + border-left + `var(--surface)` + scoped `<style>` pattern.

**The critical MDX question (D-10) is resolved with HIGH confidence:** the `articles` collection is `type: "content"` and parses `.md` files as plain Markdown. Astro component syntax (`<ComparisonTable ... />`) written inside `.md` body text is NOT interpreted as a component — it renders as literal text or is stripped, because plain Markdown collections do not evaluate JSX/component tags. Enabling that requires either migrating to MDX (`@astrojs/mdx`, changing file extensions to `.mdx` and/or configuring `.md` files to be parsed as MDX) — which is **explicitly listed as Out of Scope in REQUIREMENTS.md** ("Migrate sang MDX | Không cần thiết cho các component mới (dùng convention-based extraction); tránh phá vỡ pipeline `/approve` hiện có"). Therefore: **Phase 3 builds `ComparisonTable.astro` as a pure presentational component with structured props, tested via an isolated preview page. The question of how it gets invoked from real article content (MDX migration, or a different rendering strategy) is explicitly deferred — most likely beyond Phase 4, since Phase 4 scope (per its description) is "wire EXISTING components into ArticleLayout," and ArticleLayout-level wiring does not solve the in-body-content problem for ComparisonTable.** The planner should flag this as an open question for a later phase or for `/gsd-discuss-phase` on Phase 4/5, not block Phase 3 — Phase 3's acceptance criterion is "component renders correctly in isolation," which is fully achievable today.

**Primary recommendation:** Build all 6 components as `src/components/*.astro` following the `AuthorBox.astro` pattern exactly (scoped styles, `interface Props`, design tokens only, defensive `?.length` / fallback rendering for empty data). Create one isolated preview page (e.g. `src/pages/_preview/eeat-components.astro` or similar non-indexed path) that renders each component twice — once with realistic populated props, once with empty/fallback props — as the verification target since there is no test framework.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Key Takeaways box (EEAT-03) | Layout/Presentation (`src/components/`) | — | Pure presentational component, props-driven, no data fetching |
| Citation/Fact-check box (EEAT-04) | Layout/Presentation (`src/components/`) | — | Same — consumes `citations`/`sources`/`factCheckedDate`/`updatedDate` props |
| AuthorBox v2 (EEAT-05) | Layout/Presentation (`src/components/`) | Data/Content Layer (`src/data/authors.ts`) | Component renders; data already centralized in `authors.ts` from Phase 2 |
| Breadcrumb navigation (EEAT-07) | Layout/Presentation (`src/components/`) | Data/Content Layer (`src/data/site.ts` for category paths) | Visual breadcrumb only — JSON-LD BreadcrumbList remains in `ArticleLayout.astro` (no change in Phase 3) |
| Disclaimer/risk-disclosure (EEAT-08) | Layout/Presentation (`src/components/`) | — | Static/near-static content component, YMYL text per anti-AI rules |
| Comparison table (EEAT-09) | Layout/Presentation (`src/components/`) | Content Layer (future — MDX/body invocation deferred) | Component built now; invocation-from-markdown mechanism is a separate, deferred concern |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.18.2 (installed; `^5.9.3` in package.json) [VERIFIED: package-lock.json] | Component framework — `.astro` SFC components | Already the project's framework; no new dependency needed |
| TypeScript | 5.8.3 [VERIFIED: package.json] | `interface Props` typing in component frontmatter | Existing strict-mode convention |

### Supporting
No new libraries needed. Phase 3 introduces zero new npm dependencies — all 6 components are built with native Astro syntax + existing CSS custom properties.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure `.astro` presentational components | React/Vue/Svelte islands | Unnecessary — adds framework integration (`@astrojs/react` etc.), violates "no new dependencies," all data is build-time/static |
| Isolated preview page under `src/pages/` | Storybook / Ladle | Massive overkill for 6 components in a project with no test framework; a single Astro page satisfies "renders correctly in isolation" |

**Installation:**
No installation needed — zero new packages for Phase 3.

## Package Legitimacy Audit

**Not applicable.** Phase 3 introduces no new external packages. All components are built with Astro's built-in templating and the project's existing CSS token system.

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  Phase 3 scope: standalone component authoring                     │
│                                                                      │
│  src/data/authors.ts ──┐                                            │
│  (credentials,         │                                            │
│   experience, slug)    ▼                                            │
│                  AuthorBox.astro (v2)                               │
│                  [props: author fields]                             │
│                                                                      │
│  src/content.config.ts shapes ──┐                                   │
│  (citations, sources,           │                                   │
│   factCheckedDate, updatedDate, ▼                                   │
│   keyTakeaways)          KeyTakeaways.astro [props: items: string[]]│
│                           CitationBox.astro [props: sources?,        │
│                              citations?, factCheckedDate?,           │
│                              updatedDate]                            │
│                                                                       │
│  src/data/site.ts ───────────► Breadcrumb.astro [props: items:       │
│  (category paths)                {label, href?}[]]                  │
│                                                                       │
│  (static YMYL copy) ──────────► Disclaimer.astro [props: variant?]   │
│                                                                       │
│  caller-provided data ────────► ComparisonTable.astro [props:        │
│                                    columns: string[],                │
│                                    rows: (string|number)[][]]        │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │ src/pages/_preview/eeat-components.astro (NEW, isolated)   │     │
│  │  - imports all 6 components                                 │     │
│  │  - renders each with populated props AND empty/fallback     │     │
│  │  - serves as the manual + build-time verification target    │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                       │
│  NOT in Phase 3 scope (deferred):                                    │
│   - ArticleLayout.astro wiring (Phase 4)                             │
│   - /author/[slug] page (Phase 4)                                    │
│   - ## Key takeaways markdown parsing (Phase 4 / ARTL-01)            │
│   - MDX migration for in-body ComparisonTable usage (open question)  │
└──────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
src/components/
├── AuthorBox.astro          # MODIFIED (v2): + credentials, experience, link to /author/{slug}
├── KeyTakeaways.astro        # NEW (EEAT-03)
├── CitationBox.astro         # NEW (EEAT-04)
├── Breadcrumb.astro          # NEW (EEAT-07) — visual only
├── Disclaimer.astro          # NEW (EEAT-08)
├── ComparisonTable.astro     # NEW (EEAT-09)
├── ArticleList.astro         # unchanged
├── RelatedArticles.astro     # unchanged
├── ShareBar.astro            # unchanged
└── TOC.astro                 # unchanged

src/pages/
└── _preview/                 # NEW — isolated, non-nav preview route(s)
    └── eeat-components.astro # renders all 6 with populated + empty data
```

Naming rationale: PascalCase `.astro`, single-word-or-compound names matching existing convention (`AuthorBox`, `ArticleList`, `RelatedArticles`, `ShareBar`, `TOC`). `KeyTakeaways`, `CitationBox`, `Breadcrumb`, `Disclaimer`, `ComparisonTable` all follow this exactly. `_preview/` prefix with underscore is a common Astro convention to signal "not part of public navigation" — still gets built and routable (acceptable per D-strategy below), but excluded from sitemap if needed via `astro.config.mjs` filter (existing precedent: `kien-thuc` exclusion).

### Pattern 1: Box component with border-left accent (AuthorBox pattern)
**What:** `<aside>` wrapper, `border-left: 4px solid var(--color-brand-900)`, `background: var(--surface)`, `border: 1px solid var(--line)`, `border-radius: var(--radius-md)`, padding `var(--space-6)`, scoped `<style>` at file end.
**When to use:** Key Takeaways, Citation/Fact-check box, Disclaimer — any "callout" style component.
**Example:**
```astro
---
// Source: src/components/AuthorBox.astro (existing pattern)
interface Props {
  items: string[];
}
const { items } = Astro.props;
---
{items.length > 0 && (
  <aside class="key-takeaways" aria-label="Tóm tắt nội dung chính">
    <p class="kt-label">Tóm tắt nội dung chính</p>
    <ul>
      {items.map((item) => <li>✓ {item}</li>)}
    </ul>
  </aside>
)}

<style>
  .key-takeaways {
    padding: var(--space-6);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    background: var(--surface);
    border-left: 4px solid var(--color-brand-900);
  }
  .kt-label {
    margin: 0 0 var(--space-2);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-accent);
  }
  .key-takeaways ul {
    margin: 0;
    padding-left: 0;
    list-style: none;
    display: grid;
    gap: var(--space-2);
  }
</style>
```

### Pattern 2: Defensive empty/fallback rendering
**What:** Components return `null` (render nothing) when their primary data is empty (D-03 for Key Takeaways), or render alternate fallback content (D-05 for Citation box: `factCheckedDate` missing → fall back to `updatedDate`).
**When to use:** Every component that takes optional array/date props — Key Takeaways, Citation box, AuthorBox v2 (credentials).
**Example:**
```astro
---
// Source: pattern derived from src/layouts/BaseLayout.astro nullish-coalescing convention
interface Props {
  sources?: string[];
  citations?: { title: string; url?: string; publisher?: string; date?: string }[];
  factCheckedDate?: Date;
  updatedDate: Date;
}
const { sources = [], citations = [], factCheckedDate, updatedDate } = Astro.props;
const hasAny = sources.length > 0 || citations.length > 0;
---
{hasAny && (
  <aside class="citation-box" aria-label="Nguồn tham khảo và kiểm tra">
    <p class="citation-label">
      {factCheckedDate
        ? `Kiểm tra nguồn lần cuối: ${factCheckedDate.toLocaleDateString("vi-VN")}`
        : `Cập nhật lần cuối: ${updatedDate.toLocaleDateString("vi-VN")}`}
    </p>
    <ul>
      {citations.map((c) => (
        <li>
          {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.title}</a> : c.title}
          {c.publisher ? ` — ${c.publisher}` : ""}
          {c.date ? ` (${c.date})` : ""}
        </li>
      ))}
      {citations.length === 0 && sources.map((s) => <li>{s}</li>)}
    </ul>
  </aside>
)}
```

### Pattern 3: Comparison table — pure structured-props component
**What:** Accepts `columns: string[]` and `rows: (string | number)[][]` (or `rows: Record<string,string|number>[]` — either works; array-of-arrays is simpler and matches "columns + rows" framing in D-10). Wraps `<table>` in `<div class="table-scroll" style="overflow-x:auto">` per D-11. Header row uses `background: var(--color-brand-900)` + white text; body rows use zebra striping via `:nth-child(even)`.
**When to use:** ComparisonTable.astro only.
**Example:**
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

<style>
  .comparison-table-wrap {
    overflow-x: auto;
    margin: var(--space-6) 0;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
  }
  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92rem;
  }
  .comparison-table th {
    background: var(--color-brand-900);
    color: #fff;
    text-align: left;
    padding: var(--space-3) var(--space-4);
    white-space: nowrap;
  }
  .comparison-table td {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--line);
  }
  .comparison-table tbody tr:nth-child(even) {
    background: var(--surface-alt);
  }
</style>
```

### Anti-Patterns to Avoid
- **Embedding `<ComponentName ... />` syntax inside `.md` article bodies expecting it to render:** Plain Markdown collections (`type: "content"`) do not evaluate component tags — they pass through as literal text or get stripped by the Markdown renderer. This is the root of D-10's MDX question; do NOT attempt this in Phase 3 or assume it "just works."
- **Adding default placeholder text when data is empty (contradicts D-03/D-08):** Key Takeaways with `items=[]` must render nothing (`null`), not an empty box or "Chưa có nội dung". AuthorBox v2 with `credentials=[]` must hide the whole credentials section, not show "Chưa cập nhật chứng chỉ."
- **Hardcoding colors instead of tokens:** Every new component must reference `var(--color-brand-900)`, `var(--surface)`, `var(--surface-alt)`, `var(--line)`, `var(--muted)`, `var(--space-*)`, `var(--radius-*)` — never literal hex values (except where AuthorBox already uses `#fff` for avatar text, which is an accepted existing exception).
- **Duplicating the JSON-LD BreadcrumbList logic into the new visual Breadcrumb component:** `ArticleLayout.astro` already emits `BreadcrumbList` JSON-LD (lines 74-89) and a basic visual breadcrumb (`.breadcrumb` nav, lines 110-122). The new `Breadcrumb.astro` component is a *replacement candidate* for that inline visual markup (for Phase 4 wiring) but in Phase 3 it should be built as a standalone component with its own `items: {label: string; href?: string}[]` prop — not coupled to `entry`/`categories` data directly, so it works for both article and category page contexts (per Claude's Discretion note in CONTEXT.md).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date formatting (Vietnamese locale) | Custom date formatter | `date.toLocaleDateString("vi-VN")` (already used in `ArticleLayout.astro:127`) | Built into JS, zero deps, matches existing convention |
| Responsive table scrolling | JS-based table-to-card stacking | CSS `overflow-x: auto` wrapper (D-11) | Simpler, no JS, preserves table semantics for accessibility/SEO |
| Component preview/testing harness | Storybook, custom test runner | A single Astro page under `src/pages/_preview/` | Project has no test framework; a real rendered page IS the verification (build succeeds + visual check) |

**Key insight:** Every "problem" in this phase has a near-zero-dependency native solution because the component surface is small (6 presentational components) and the project deliberately avoids adding frameworks/build complexity (per PROJECT.md constraints and REQUIREMENTS.md Out-of-Scope list).

## Common Pitfalls

### Pitfall 1: Building ComparisonTable assuming MDX already works
**What goes wrong:** Developer builds `<ComparisonTable columns={...} rows={...} />` and tries to drop it into an existing `.md` article to "test it for real," then discovers it renders as raw text/nothing, and concludes the component is broken.
**Why it happens:** Confusion between "component exists and works when imported/rendered from `.astro`" vs. "component can be invoked from inside markdown body content" — these are two different problems, and only the first is in Phase 3 scope.
**How to avoid:** Test exclusively via the isolated preview `.astro` page where the component is imported and used with JSX-like Astro syntax directly in the page template (this always works — it's standard Astro component composition, unrelated to MDX). Do not test by editing `.md` article files.
**Warning signs:** Any task description that says "add ComparisonTable to an existing article" — this is out of scope and should be flagged.

### Pitfall 2: `factCheckedDate` type is `Date | undefined`, not `string`
**What goes wrong:** `factCheckedDate` is `z.coerce.date().optional()` (per `content.config.ts`), so when present it's a JS `Date` object, not a string. Calling `.toLocaleDateString("vi-VN")` is required (matches `updatedDate` usage in `ArticleLayout.astro:127`); passing it straight to a template as `{factCheckedDate}` would render an ISO-ish `Date.toString()`.
**Why it happens:** Easy to assume frontmatter dates stay as strings; Zod's `.coerce.date()` converts them at parse time.
**How to avoid:** In `CitationBox.astro`, type `factCheckedDate?: Date` and `updatedDate: Date`, and always call `.toLocaleDateString("vi-VN")` before rendering, exactly as `ArticleLayout.astro` does for `updatedDate`.
**Warning signs:** Date displaying as `Wed Jun 10 2026 00:00:00 GMT+0000...` instead of `10/6/2026`.

### Pitfall 3: Forgetting `astro check` will fail on unused/missing Props types
**What goes wrong:** Project's `npm run build` = `astro check && astro build`. TypeScript strict mode means `interface Props` mismatches (e.g., passing `items` but declaring `takeaways`) fail the build, not just at runtime.
**Why it happens:** Astro component prop typing is checked statically; the preview page must pass props matching each component's exact `interface Props`.
**How to avoid:** Keep prop names consistent across component definition and preview page usage; run `astro check` (or full `npm run build`) as the verification step for each component, per Phase 3's acceptance criteria ("render correctly... build passes").
**Warning signs:** `astro check` errors referencing `src/pages/_preview/...` or the new component files.

### Pitfall 4: AuthorBox v2 link to `/author/{slug}` causes broken internal link / sitemap entry before Phase 4
**What goes wrong:** D-09 says link to `/author/{slug}` even though the page doesn't exist yet (accepted 404 per CONTEXT.md). If AuthorBox v2 is used on the isolated preview page only (per Phase 3 scope: "does NOT wire into ArticleLayout/real pages"), this is harmless. But if a developer also updates the *existing* `AuthorBox.astro` (which IS wired into `ArticleLayout.astro` and ships to all 21 live articles), every live article now links to a 404.
**Why it happens:** D-07 says "AuthorBox v2" extends from `AuthorBox.astro` — ambiguous whether this means (a) modify the existing file in place, or (b) create a new file and leave the old one wired.
**How to avoid:** Per D-07's literal wording ("Đổi link... Xem hồ sơ từ /about/ sang /author/{slug}") and D-08/the broader v1-element-preservation note, the planner should decide explicitly: **modifying `AuthorBox.astro` in place is acceptable IF the `/author/{slug}` 404 is considered tolerable for the gap between Phase 3 and Phase 4 merges** (likely fine since Phase 4 is the very next phase and builds `/author/[slug]`). If sequencing risk is a concern, the planner can note this in the plan but it does not block Phase 3 — flag as a planning decision, not a research gap.
**Warning signs:** None at build time (404s are runtime/deploy concerns for a static site, and `astro check`/`astro build` won't catch a dead internal link unless link-checking is added — none exists currently).

## Code Examples

### AuthorBox v2 — credentials + experience addition (extends existing pattern)
```astro
---
// Source: src/components/AuthorBox.astro (existing) + src/data/authors.ts (Phase 2 fields)
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
        <a class="author-name" href={`/author/${author.slug}`}>{author.name}</a>
      </div>
      <a class="author-profile-link" href={`/author/${author.slug}`}>Xem hồ sơ</a>
    </div>
    <p class="author-role">{author.role}</p>
    <p class="author-bio">{author.bio}</p>
    <div class="author-expertise" aria-label="Chuyên môn tác giả">
      {author.expertise.map((item) => <span>{item}</span>)}
    </div>
    {author.credentials.length > 0 && (
      <div class="author-credentials" aria-label="Chứng chỉ chuyên môn">
        <p class="author-sublabel">Chứng chỉ</p>
        <ul>
          {author.credentials.map((c) => <li>{c}</li>)}
        </ul>
      </div>
    )}
    <p class="author-experience">{author.experience}</p>
    <p class="author-note">
      Nội dung được viết cho mục đích giáo dục tài chính, ưu tiên nguồn chính thống và tiếp nhận phản hồi đính chính qua email công khai.
    </p>
  </div>
</aside>
```
Note: `author.credentials` is currently `[]` (per `src/data/authors.ts:6`), so the `author-credentials` block will not render today — this exercises D-08's empty-state path automatically without needing a separate "empty" preview fixture for AuthorBox (though the preview page should still pass a populated mock author object with non-empty `credentials` to exercise the populated path, since `authors.ts` itself can't be mutated for testing).

### Disclaimer component — YMYL copy pattern
```astro
---
// Source: site.disclosure usage in src/layouts/ArticleLayout.astro:139-142 (existing ymyl-note pattern)
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

<style>
  .disclaimer {
    display: grid;
    gap: var(--space-1);
    padding: var(--space-6);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    background: var(--surface);
    border-left: 4px solid var(--color-brand-900);
  }
  .disclaimer strong {
    color: var(--color-brand-900);
  }
  .disclaimer span {
    color: var(--muted);
    font-size: 0.96rem;
    line-height: 1.65;
  }
</style>
```
Check `src/data/site.ts` for the existing `site.disclosure` string (referenced in `ArticleLayout.astro:141`) — reuse it as the default Disclaimer text so the new standalone component is consistent with the inline `.ymyl-note` already shown on every article. The planner should verify whether `site.disclosure` content meets YMYL tone requirements per `.antigravity/rules/content-anti-ai.md`, or whether new dedicated Disclaimer copy is warranted (per CONTEXT.md Claude's Discretion: "Claude soạn nội dung phù hợp YMYL... user review sau").

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| AuthorBox v1: avatar + name + role + bio + expertise tags, link to `/about/` | AuthorBox v2: + credentials list (conditional), + experience text, link to `/author/{slug}` | Phase 3 (this phase) | Existing v1 markup/styles preserved; additive only |
| `site.author`/`site.authorProfile` as data source | `src/data/authors.ts` single source of truth | Phase 2 (completed) | Phase 3 components import from `authors.ts`, not `site.ts` |

**Deprecated/outdated:**
- `/about/` as the AuthorBox profile link target — superseded by `/author/{slug}` per D-09 (though `/author/[slug]` page itself is Phase 4; Phase 3 just updates the link target in isolation/preview).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Plain `.md` content collections (`type: "content"`) do not evaluate Astro component tags written in body text — confirmed via Astro official docs search but not tested live in this repo | Summary, Anti-Patterns | If wrong (e.g., some Astro 5.x feature allows partial component evaluation in `.md`), the MDX-deferral framing could be revisited — but REQUIREMENTS.md already independently rules out MDX migration for Phase 3, so the *scope decision* (build component standalone, defer invocation mechanism) holds regardless |
| A2 | `site.disclosure` exists as a string in `src/data/site.ts` and is suitable as default Disclaimer text | Code Examples (Disclaimer) | If `site.disclosure` doesn't exist or has wrong tone, planner/implementer writes new YMYL copy per CONTEXT.md Claude's Discretion — low risk, already anticipated |
| A3 | `_preview/` prefix convention is acceptable for an isolated, non-nav preview page and Astro will build it without requiring sitemap/nav registration | Recommended Project Structure | If the planner prefers a different location (e.g., outside `src/pages/` entirely isn't possible in Astro — pages must be under `src/pages/` to be routable/buildable), low risk — any subdirectory name works identically; `_preview/` is just a naming suggestion |

## Open Questions (RESOLVED)

1. **How will ComparisonTable (and potentially other components) eventually be invoked from within real article markdown body content?**
   - What we know: Plain `.md` collections don't support component tags in body; MDX migration is explicitly out of scope per REQUIREMENTS.md; Phase 3 only needs the component to exist and render correctly via direct `.astro` import (which always works).
   - What's unclear: Whether a future phase will (a) migrate to MDX selectively for comparison-heavy articles, (b) use a remark/rehype plugin to transform a custom markdown syntax into the component, or (c) handle comparison tables entirely outside the markdown body (e.g., as a frontmatter-driven section rendered by `ArticleLayout.astro` before/after `<Content />`, similar to how `sources`/`faq` are handled today).
   - Recommendation: Phase 3 should NOT attempt to resolve this — build `ComparisonTable.astro` with clean, generic `columns`/`rows` props (option c above is actually quite feasible: a `comparisonTable` frontmatter field + schema addition could let `ArticleLayout.astro` render it without any markdown-body component syntax at all, avoiding MDX entirely). Flag this as a design question for whoever scopes the Phase 4/5 wiring work or a future `/gsd-discuss-phase`.
   - RESOLVED: Out of scope for Phase 3 by design — REQUIREMENTS.md and CONTEXT.md already scope MDX/markdown-body invocation to a future phase. Phase 3 delivers `ComparisonTable.astro` with clean, generic `columns`/`rows` props (option c, frontmatter-driven rendering via `ArticleLayout.astro`, is the leading candidate) and defers the invocation-mechanism decision to whoever scopes Phase 4/5 wiring or a future `/gsd-discuss-phase`. No action needed in this phase.

2. **Should the isolated preview page be route-addressable in the built site, or excluded?**
   - What we know: Astro requires pages to live under `src/pages/` to be built/routable. The project excludes `kien-thuc/*` from the sitemap via a custom filter in `astro.config.mjs`, establishing precedent for "buildable but not in sitemap."
   - What's unclear: Whether the planner wants the preview page excluded from `sitemap-index.xml` (consistent with `kien-thuc` precedent) or simply left unlinked (orphan page, still technically reachable by URL).
   - Recommendation: Add the preview page path to the existing sitemap `filter` function in `astro.config.mjs` (same mechanism as `kien-thuc`), and do not link it from any nav. This is a one-line addition the planner can include as a task.
   - RESOLVED: 03-03-PLAN.md Task 2 adds the preview page path to the existing sitemap `filter` function in `astro.config.mjs` (same mechanism as `kien-thuc`) and leaves it unlinked from nav — buildable but excluded from `sitemap-index.xml`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Astro | All component authoring | Yes | 5.18.2 (installed) [VERIFIED: package-lock.json] | — |
| TypeScript | `interface Props`, `astro check` | Yes | 5.8.3 [VERIFIED: package.json] | — |
| Node.js | Build/dev | Yes | v25.9.0 (per ARCHITECTURE notes) | — |

No missing dependencies. Phase 3 requires zero new tooling.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — no test runner configured (confirmed in `.planning/codebase/STRUCTURE.md`) |
| Config file | none |
| Quick run command | `npx astro check` (TypeScript/prop-type validation for new components) |
| Full suite command | `npm run build` (= `astro check && astro build`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EEAT-03 | KeyTakeaways renders list with items, renders nothing with `items=[]` | manual via preview page | `npm run build` (build succeeds) + visual check on `/_preview/eeat-components/` | ❌ Wave 0 |
| EEAT-04 | CitationBox renders citations/sources/fact-check date with all prop combinations (sources only, citations only, both, neither, with/without factCheckedDate) | manual via preview page | `npm run build` + visual check | ❌ Wave 0 |
| EEAT-05 | AuthorBox v2 shows credentials when non-empty, hides when empty; links to `/author/{slug}` | manual via preview page | `npm run build` + visual check | ❌ Wave 0 |
| EEAT-07 | Breadcrumb renders for article-style and category-style item lists | manual via preview page | `npm run build` + visual check | ❌ Wave 0 |
| EEAT-08 | Disclaimer renders YMYL text with token-based styling | manual via preview page | `npm run build` + visual check | ❌ Wave 0 |
| EEAT-09 | ComparisonTable renders columns/rows, wraps in `overflow-x: auto`, header styled with brand color + zebra rows | manual via preview page | `npm run build` + visual check | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx astro check` (fast type-check, catches Props mismatches)
- **Per wave merge:** `npm run build` (full check + build, confirms preview page + all components compile and produce output)
- **Phase gate:** `npm run build` green + manual visual inspection of `/_preview/eeat-components/` (or equivalent) in `npm run dev` / `npm run preview`, covering both populated and empty-data variants of every component, before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/pages/_preview/eeat-components.astro` (or split into multiple preview pages) — single isolated page importing and rendering all 6 components with both populated and empty/fallback prop sets; this IS the test harness for this phase
- [ ] No test framework install needed — `astro check` + `astro build` (already in `npm run build`) are sufficient given the static, build-time-validated nature of the project

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Static site, no auth |
| V3 Session Management | No | Static site, no sessions |
| V4 Access Control | No | All content public |
| V5 Input Validation | Yes (limited) | Component props are build-time only (no user input); Zod schema (`content.config.ts`) is the validation boundary for any data eventually feeding these components — Phase 3 itself adds no new untrusted input paths |
| V6 Cryptography | No | Not applicable |

### Known Threat Patterns for {stack}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via `set:html` with citation URLs/titles from frontmatter | Tampering/Information Disclosure | Use Astro's default expression interpolation (`{value}`, auto-escaped) for all citation/source text and URLs — do NOT use `set:html` for any user/content-author-supplied string in the new components. For `<a href={c.url}>`, ensure `url` values come only from build-time-validated frontmatter (Zod `z.string()`), not runtime user input. Add `rel="noopener noreferrer"` and `target="_blank"` for external citation links (shown in Code Examples) as a defense-in-depth measure against `window.opener` issues. |

This is a low-risk static-site phase; the main control is "don't introduce `set:html` for content-author-controlled strings" — all 6 components should use standard `{expression}` interpolation, which Astro auto-escapes.

## Sources

### Primary (HIGH confidence)
- `src/components/AuthorBox.astro` — canonical visual/structural pattern for box-style components [VERIFIED: codebase read]
- `src/content.config.ts` — exact Zod shapes for `citations`, `keyTakeaways`, `factCheckedDate`, `sources`, `updatedDate` [VERIFIED: codebase read]
- `src/data/authors.ts` — exact shape of `author.credentials`, `author.experience`, `author.slug` [VERIFIED: codebase read]
- `src/styles/tokens/{colors,spacing,effects}.css` and `aliases-legacy.css` — exact CSS custom property names available [VERIFIED: codebase read]
- `src/layouts/ArticleLayout.astro` — existing JSON-LD BreadcrumbList + visual breadcrumb implementation, `.ymyl-note` pattern, `updatedDate.toLocaleDateString("vi-VN")` usage [VERIFIED: codebase read]
- `package-lock.json` — Astro 5.18.2 installed [VERIFIED: package-lock.json]

### Secondary (MEDIUM confidence)
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) — `render()` returns `Content` + `headings`; component-in-markdown requires MDX [CITED: docs.astro.build]
- [Astro MDX integration docs](https://docs.astro.build/en/guides/integrations-guide/mdx/) — MDX enables component/JSX usage in content; `.md` files can be configured to parse as MDX, but this is itself a migration step [CITED: docs.astro.build]
- [Markdown in Astro docs](https://docs.astro.build/en/guides/markdown-content/) — plain Markdown rendering behavior [CITED: docs.astro.build]

### Tertiary (LOW confidence)
- None — all claims either verified against the codebase directly or cited from official Astro docs.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all verified against installed `package-lock.json`
- Architecture: HIGH - directly derived from existing `AuthorBox.astro`/`ArticleLayout.astro` patterns and Phase 1/2 completed schema
- Pitfalls: HIGH - derived from direct schema/type inspection (e.g., `factCheckedDate` is `Date`, not `string`) and explicit REQUIREMENTS.md Out-of-Scope constraints
- MDX/D-10 question: HIGH (for the scope decision) - REQUIREMENTS.md explicitly rules out MDX migration, and Astro docs confirm plain `.md` does not evaluate component tags; MEDIUM for the *future* invocation mechanism (genuinely open, correctly flagged as Open Question)

**Research date:** 2026-06-12
**Valid until:** 2026-07-12 (30 days — Astro/tooling stable, no fast-moving dependencies in this phase)
