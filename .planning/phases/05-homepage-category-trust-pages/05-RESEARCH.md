# Phase 5: Homepage, Category & Trust Pages - Research

**Researched:** 2026-06-13
**Domain:** Astro 5 static site — page composition, component extraction, content pages (no new deps)
**Confidence:** HIGH

## Summary

Phase 5 is a pure refactor/composition phase on an existing Astro 5 codebase. No new libraries, no new design tokens, no new architectural patterns are needed — every piece of UI required by HOME-01/02, CATG-01, and TRST-01/02/03 can be built from primitives that already exist in `global.css`, `src/styles/tokens/*`, and the Phase 3 EEAT components (`Breadcrumb`, `Disclaimer`, `CitationBox`). The 05-UI-SPEC.md (already approved) is extremely detailed and effectively pre-decides almost every visual question; this research focuses on confirming the **current code state** so the planner can write precise, low-risk diffs.

The main engineering work is: (1) add a new `<section class="trust-strip">` to `src/pages/index.astro` after `.home-hero`; (2) extract a new `src/components/CategoryListing.astro` that both `src/pages/[category].astro` and `src/pages/dau-tu/[category].astro` will call, swapping their inline `<nav class="breadcrumb">` for the existing `<Breadcrumb />` component; (3) rewrite `src/pages/about.astro` to drop the `.author-hero`/`.author-layout` full-dossier markup (which is now duplicated by `/author/[slug].astro` from Phase 4) in favor of a mission/process/preview-card/stats structure; (4) create `src/pages/disclaimer.astro` following the `corrections-policy.astro` pattern; (5) add a "Tìm hiểu thêm" link to `src/components/Disclaimer.astro`; (6) append two new `<h2>` sections to `src/pages/editorial-policy.astro`.

**Primary recommendation:** Treat this phase as five independent, narrowly-scoped diffs against existing files — no new dependencies, no new design tokens, no new shared components beyond `CategoryListing.astro`. Reuse `.page-hero`/`.section`/`.container`/`.card`/`.topic-card`/`.profile-card`/`.stat-stack`/`.article-header`/`.prose`/`.lead`/`.eyebrow` classes verbatim wherever the UI-SPEC calls for "existing pattern."

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Homepage hero/topic grid/featured+latest articles | Content layer (build-time) | Page layer | Already implemented in `index.astro`; data comes from `getCollection("articles")` + `src/data/site.ts` at build time, rendered to static HTML |
| Homepage trust strip | Page layer (`index.astro`) | Content layer (`site.ts` could hold copy, but UI-SPEC hardcodes copy) | New static section, no data dependency beyond hrefs to `/about/`, `/editorial-policy/`, `/disclaimer/` |
| Category listing (`CategoryListing`) | Component layer (`src/components/`) | Page layer (`getStaticPaths` + data fetch stays in route files) | Presentational component takes `category`+`articles`(+`breadcrumbItems`) props; route files retain routing/filtering responsibility per D-09 |
| `/about/` brand story | Page layer (`src/pages/about.astro`) | Content layer (`src/data/authors.ts` for preview card) | Static page reading from `authors.ts` and `getCollection("articles")` for stats |
| `/editorial-policy/`, `/disclaimer/`, `/corrections-policy/` | Page layer | — | Pure static `.prose` content pages, no data dependencies |
| `Disclaimer` component link to `/disclaimer/` | Component layer (`src/components/Disclaimer.astro`) | — | Prop-contract-preserving addition (D-11) |

## Standard Stack

### Core
No new libraries. This phase uses only what's already installed:

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 5.9.3 (installed, confirmed via package.json in prior phases) | SSG framework, content collections, `getStaticPaths` | Already the project framework — no alternative considered |

### Supporting
None — zero new dependencies per UI-SPEC ("This phase adds zero new dependencies").

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-built scoped `<style>` per page | Tailwind / shadcn | Explicitly out of scope (REQUIREMENTS.md "Out of Scope": Tailwind/UI kit goes against CSS-custom-property convention) |
| `CategoryListing.astro` as a component | A new layout in `src/layouts/` | UI-SPEC resolves this in favor of `src/components/` to match `ArticleList`/`AuthorBox`/`Breadcrumb` convention — component, not layout shell |

**Installation:** None — no `npm install` needed for this phase.

## Package Legitimacy Audit

> Not applicable — this phase installs zero external packages. Skipping the Package Legitimacy Gate per its own scope condition ("whenever this phase installs external packages").

**Packages removed due to [SLOP] verdict:** none (n/a — no packages evaluated)
**Packages flagged as suspicious [SUS]:** none (n/a)

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Trang chủ redesign với hero, grid điều hướng danh mục, danh sách bài viết nổi bật/mới nhất | **Already implemented** in `src/pages/index.astro` (hero, `.topic-grid`, `.start-list`, featured+latest `.top-section`, per-category sections). Research confirms current state satisfies Success Criteria #1 — no changes required beyond the trust strip addition (HOME-02). |
| HOME-02 | Trang chủ có "trust strip" liên kết Editorial Policy, About (+ Disclaimer per D-05) | New `<section class="trust-strip">` inserted between `.home-hero` and `.topic-section` in `index.astro`. Grid/card/copy fully specified in 05-UI-SPEC.md §"Component & Layout Notes #1". Existing `.topic-card` CSS pattern provides the hover/border/shadow reference. |
| CATG-01 | `[category].astro` và `dau-tu/[category].astro` redesign đồng bộ qua `CategoryListing` | New `src/components/CategoryListing.astro` extracted from the near-identical bodies of both route files (lines ~51-107 of `[category].astro`, ~57-118 of `dau-tu/[category].astro`). Both route files keep `getStaticPaths()`+fetch, pass `category`, `articles`, `breadcrumbItems` props. Swap inline `<nav class="breadcrumb">` for `<Breadcrumb items={...} />` (already exists, `src/components/Breadcrumb.astro`). |
| TRST-01 | `/about/` mở rộng dựa trên `src/data/authors.ts` | Rewrite `src/pages/about.astro`: drop `.author-hero`/`.author-layout`/`.author-sidebar` (now duplicated at `/author/[slug].astro`), add mission hero, 2-3 step editorial process summary, author preview card (from `author` object in `src/data/authors.ts`), reframed `.stat-stack` ("Quy mô nội dung"). |
| TRST-02 | `/editorial-policy/` mở rộng, liên kết CitationBox | Append two `<h2>` sections to existing `.prose` block in `src/pages/editorial-policy.astro`: detailed fact-check process, and a CitationBox cross-reference section describing the rendered `<CitationBox />` UI (sources list + "Cập nhật lần cuối"/"Kiểm tra nguồn lần cuối" date). |
| TRST-03 | `/disclaimer/` trang riêng | New `src/pages/disclaimer.astro` following `corrections-policy.astro`'s `.article-header` + `.article-container.prose` pattern. Also: add "Tìm hiểu thêm" link to `src/components/Disclaimer.astro` (D-11) without changing its `text` prop contract. |
</phase_requirements>

## Architecture Patterns

### System Architecture Diagram

```
                          BUILD TIME (astro build)
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  src/content/articles/*.md ──► getCollection("articles") ──┐               │
│  src/data/site.ts (categories, trustStats, disclosure) ─────┤               │
│  src/data/authors.ts (author) ──────────────────────────────┤               │
│                                                               │               │
│                                                               ▼               │
│  ┌─────────────────────────────┐   ┌──────────────────────────────────┐    │
│  │ src/pages/index.astro        │   │ src/pages/[category].astro       │    │
│  │  - hero                      │   │ src/pages/dau-tu/[category].astro│    │
│  │  - NEW: trust-strip ─────────┼──►│  getStaticPaths() (unchanged)    │    │
│  │  - topic grid                │   │  fetch+sort articles             │    │
│  │  - start-section             │   │  build breadcrumbItems           │    │
│  │  - featured+latest           │   │       │                          │    │
│  │  - trust-band (existing)     │   │       ▼                          │    │
│  │  - author-home → /about/     │   │  <CategoryListing                │    │
│  │  - per-category sections     │   │     category={category}          │    │
│  └───────────────┬───────────────┘   │     articles={articles}          │    │
│                  │ links to            │     breadcrumbItems={...} />    │    │
│                  ▼                    └──────────────┬────────────────────┘    │
│  trust-strip links ──► /about/, /editorial-policy/, /disclaimer/               │
│                  │                                     │                        │
│                  ▼                                     ▼                        │
│  ┌─────────────────────────┐   ┌──────────────────────────────────────┐       │
│  │ src/pages/about.astro    │   │ src/components/CategoryListing.astro  │       │
│  │  - NEW mission hero       │   │  - page-hero (Breadcrumb + eyebrow    │       │
│  │  - NEW editorial summary  │   │    + h1 + lead + count badge)         │       │
│  │    → links /editorial-    │   │  - .section: category-layout grid     │       │
│  │      policy/              │   │    (ArticleList + latest-panel)       │       │
│  │  - NEW author preview card│   │    OR empty-state card                │       │
│  │    (from authors.ts)      │   │  Uses: <Breadcrumb items={...} />     │       │
│  │    → /author/{slug}/      │   └────────────────────────────────────────┘       │
│  │  - stat-stack (reframed)  │                                                     │
│  └───────────────────────────┘                                                     │
│                                                                                      │
│  ┌──────────────────────────┐   ┌───────────────────────────┐                     │
│  │ src/pages/                │   │ src/pages/disclaimer.astro │ NEW                │
│  │  editorial-policy.astro   │   │  .article-header +         │                     │
│  │  - existing 3 sections     │   │  .article-container.prose  │                     │
│  │  - NEW: fact-check detail  │   │  (mirrors corrections-      │                     │
│  │  - NEW: CitationBox cross-  │   │  policy.astro structure)   │                     │
│  │    reference section       │   └───────────────┬─────────────┘                     │
│  └────────────────────────────┘                   ▲                                    │
│                                                      │ "Tìm hiểu thêm" link               │
│                                       ┌──────────────┴───────────────┐                   │
│                                       │ src/components/Disclaimer.astro│ MODIFIED         │
│                                       │  unchanged text prop +          │                   │
│                                       │  new inline link to /disclaimer/│                   │
│                                       └──────────────────────────────────┘                   │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                              dist/ (static HTML output)
```

### Recommended Project Structure

No new directories. Files touched/added:
```
src/
├── components/
│   ├── CategoryListing.astro   # NEW — extracted shared category page body
│   └── Disclaimer.astro         # MODIFIED — add "Tìm hiểu thêm" link to /disclaimer/
├── pages/
│   ├── index.astro              # MODIFIED — insert trust-strip section
│   ├── about.astro               # REWRITTEN — mission/process/preview-card/stats
│   ├── disclaimer.astro          # NEW — standalone disclaimer page
│   ├── editorial-policy.astro    # MODIFIED — append 2 new <h2> sections
│   ├── [category].astro          # MODIFIED — reduce to getStaticPaths + <CategoryListing />
│   └── dau-tu/
│       └── [category].astro      # MODIFIED — reduce to getStaticPaths + <CategoryListing />
```

### Pattern 1: Shared presentational component with route-supplied breadcrumb
**What:** `CategoryListing.astro` takes `category`, `articles`, and `breadcrumbItems` as props; it does NOT compute breadcrumb depth itself. Each route file (`[category].astro` 2-level, `dau-tu/[category].astro` 3-level) builds its own `breadcrumbItems` array and passes it down.
**When to use:** Whenever two route trees share 95% of body markup but differ in breadcrumb depth/labels.
**Example:**
```astro
// Source: existing src/components/Breadcrumb.astro (Phase 3) + UI-SPEC §2
---
interface Props {
  category: Category;
  articles: CollectionEntry<"articles">[];
  breadcrumbItems: { label: string; href?: string }[];
}
const { category, articles, breadcrumbItems } = Astro.props;
const latestArticles = articles
  .toSorted((a, b) => b.data.updatedDate.getTime() - a.data.updatedDate.getTime())
  .slice(0, 3);
---
<section class="page-hero">
  <div class="container">
    <Breadcrumb items={breadcrumbItems} />
    <div class="eyebrow">{category.group}</div>
    <h1>{category.title}</h1>
    <p class="lead">{category.description}</p>
    <div class="category-meta">
      <span class="article-count-badge">{articles.length} bài viết</span>
    </div>
  </div>
</section>
<!-- .section with category-layout grid or empty-state, unchanged from current [category].astro -->
```
Each route file then becomes:
```astro
---
import CategoryListing from "@/components/CategoryListing.astro";
// ... getStaticPaths(), article fetch/sort unchanged ...
const breadcrumbItems = [
  { label: "Trang chủ", href: "/" },
  { label: category.title },
];
---
<BaseLayout title={category.title} description={category.description}>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
  </Fragment>
  <CategoryListing category={category} articles={articles} breadcrumbItems={breadcrumbItems} />
</BaseLayout>
```
For `dau-tu/[category].astro`, `breadcrumbItems` becomes a 3-item array including `{ label: "Đầu tư", href: "/dau-tu/" }`. The route files also still need the article-link href prefix difference (`/${category.slug}/${article.slug}/` vs `/dau-tu/${category.slug}/${article.slug}/`) — but `getArticlePath()` from `src/data/site.ts` already handles this correctly via `getCategoryPath`, so `CategoryListing` can use `getArticlePath(article)` instead of manually constructing hrefs, eliminating the per-route hardcoded path prefixes entirely.

### Pattern 2: Reuse `.topic-card` hover pattern for new linked cards
**What:** The trust-strip cards and the about-page author-preview card are both "whole-card-is-a-link" or bordered boxes — reuse the existing `.topic-card` / `.profile-card` / `.card` CSS exactly (border `var(--line)`, `border-radius: var(--radius-md)`, `background: var(--surface)`, hover `border-color: var(--color-brand-100)` + `box-shadow: var(--shadow-sm)`).
**When to use:** Any new bordered/clickable card in this phase.
**Example:**
```css
/* Source: src/pages/index.astro existing .topic-card rules — reuse verbatim for .trust-card */
.trust-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: var(--space-6);
  text-decoration: none;
}
.trust-card:hover {
  border-color: var(--color-brand-100);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
}
```

### Pattern 3: `.article-header` + `.article-container.prose` for static policy pages
**What:** `editorial-policy.astro`, `corrections-policy.astro`, `sources-policy.astro` all use `<section class="article-header"><div class="article-container"><h1>/<p class="lead">` followed by `<section class="article-container prose">` with `<h2>` body sections.
**When to use:** `disclaimer.astro` (new) — copy this exact two-section structure from `corrections-policy.astro`.
**Example:**
```astro
// Source: src/pages/corrections-policy.astro (existing, verified read)
<BaseLayout title="Miễn trừ trách nhiệm" description="...">
  <section class="article-header">
    <div class="article-container">
      <h1>Miễn trừ trách nhiệm</h1>
      <p class="lead">Nội dung trên ValueInvesting.com.vn chỉ mang tính giáo dục và không phải lời khuyên đầu tư cá nhân hóa.</p>
    </div>
  </section>
  <section class="article-container prose">
    <h2>Phạm vi nội dung</h2>
    <p>...</p>
    <h2>Không phải lời khuyên đầu tư cá nhân hóa</h2>
    <p>...</p>
    <h2>Rủi ro đầu tư</h2>
    <p>...</p>
    <h2>Liên hệ và phản hồi</h2>
    <p>...</p>
  </section>
</BaseLayout>
<!-- No <style> block needed — .article-header/.article-container/.prose/.lead are all global -->
```

### Anti-Patterns to Avoid
- **Duplicating breadcrumb-depth logic inside `CategoryListing`:** Don't have `CategoryListing` branch on `category.group === "Đầu tư"` to decide breadcrumb depth — that re-creates the duplication this phase is meant to remove. Pass `breadcrumbItems` as an explicit prop (Pattern 1).
- **Copying `.author-hero`/`.author-layout` CSS into `about.astro`'s new `<style>` block:** These large block-styles (148px avatar, `.author-layout` grid, `.latest-author-list`, etc.) belong only to `/author/[slug].astro` now. The rewritten `about.astro` needs much smaller, different styles (mission hero ~`.page-hero`, preview card ~`.profile-card` at smaller scale, `.stat-stack` retained). Don't carry over unused CSS — delete it during the rewrite to avoid dead styles ballooning the page's scoped `<style>`.
- **Introducing a new icon library or SVG icon set for the trust strip:** UI-SPEC explicitly says use inline `<span aria-hidden="true">` glyphs (`→`, `›`) — no new dependency.
- **Changing `Disclaimer.astro`'s `text` prop contract:** D-11 requires the "Tìm hiểu thêm" link be additive (new element inside `<aside>`), not a prop signature change — existing call sites (`ArticleLayout.astro` and others from Phase 3/4) must continue to work unmodified.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Breadcrumb markup/styling | New breadcrumb CSS inside `CategoryListing` | `<Breadcrumb items={...} />` (`src/components/Breadcrumb.astro`, Phase 3) | Already styled, accessible (`aria-label`, `aria-current="page"`), used by `ArticleLayout` per Phase 4 D-10 — same integration pattern applies here |
| Article href construction per category-group | Hardcoded `/${category.slug}/...` vs `/dau-tu/${category.slug}/...` string templates inside `CategoryListing` | `getArticlePath(article)` from `src/data/site.ts` | Already derives the correct prefix via `getCategoryPath`, eliminates route-tree-specific string building inside the shared component |
| Citation/source display on Editorial Policy page | New mini "citation preview" component | Reference existing `<CitationBox />` (`src/components/CitationBox.astro`) in prose copy — describe its rendered output (label + "Nguồn tham khảo" heading + list with `factCheckedDate`/`updatedDate`) | TRST-02/D-13 asks the policy page to *describe* what CitationBox shows on articles, not to embed a new instance on a non-article page |
| Author preview card avatar | New avatar component/image asset | Reuse the `.author-avatar-large` radial-gradient circle pattern from `about.astro`/`author/[slug].astro`, scaled down (e.g. 64px) — `author.avatar` is `undefined` in `authors.ts` so initials-in-circle is the only option | `authors.ts` (Phase 2) has no avatar image; the initials-circle gradient is the established fallback pattern already in two files |

**Key insight:** Every "new" UI element in this phase is a smaller/repositioned instance of an existing pattern (card, page-hero, prose section, eyebrow+heading). The risk in this phase is not "what pattern to use" (UI-SPEC already answered that) but "don't let CSS duplication creep back in" — especially in the `about.astro` rewrite where ~270 lines of `.author-*` CSS need to shrink to a much smaller set.

## Runtime State Inventory

> Not applicable — this is a static-site code/content change with no databases, external services, OS registrations, secrets, or build artifacts that reference renamed strings. Skipping per the trigger condition ("rename, rebrand, refactor, string replacement, or migration phases only"). This phase is additive/refactor-of-presentation, not a rename.

## Common Pitfalls

### Pitfall 1: Sitemap/URL contract drift from new `/disclaimer/` page
**What goes wrong:** Adding `src/pages/disclaimer.astro` creates a new route `/disclaimer/`. If `astro.config.mjs`'s sitemap config has an allow-list (rather than deny-list) of pages, the new page might not appear in `sitemap-index.xml`, or conversely if there's a catch-all redirect rule it could conflict.
**Why it happens:** `astro.config.mjs` defines redirects from old flat category URLs and excludes legacy `kien-thuc` routes from the sitemap — a allow/deny list misconfiguration is an easy oversight when adding new top-level routes.
**How to avoid:** After creating `disclaimer.astro`, check `astro.config.mjs` redirects/sitemap `filter` config to confirm `/disclaimer/` is included by default (most likely — sitemap integration typically includes all routes unless filtered). No code change expected, but verify with `astro build` and inspect `dist/sitemap-*.xml` or `dist/disclaimer/index.html`.
**Warning signs:** `astro build` succeeds but `/disclaimer/` missing from sitemap, or 404 on `dist/disclaimer/index.html`.

### Pitfall 2: `CategoryListing` breaking the `dau-tu/[category].astro` 3-level breadcrumb / article href prefix simultaneously
**What goes wrong:** If the extraction only swaps the `<nav class="breadcrumb">` for `<Breadcrumb>` but forgets that `dau-tu/[category].astro`'s `.latest-panel` links use `/dau-tu/${category.slug}/${article.slug}/` while `[category].astro` uses `/${category.slug}/${article.slug}/`, hardcoding either prefix inside `CategoryListing` breaks one of the two route trees.
**Why it happens:** The two existing files are 90% identical but diverge exactly on this URL-prefix detail and breadcrumb depth — easy to miss during extraction since most of the file is copy-paste identical.
**How to avoid:** `src/components/ArticleList.astro` (verified read this session) already uses `getArticlePath(article)` for the "Learning path" grid — no change needed there. Only the `.latest-panel` sidebar links (currently hardcoded per-route as `/${category.slug}/${article.slug}/` vs `/dau-tu/${category.slug}/${article.slug}/`) need to switch to `getArticlePath(article)` inside `CategoryListing`, making the whole component route-tree-agnostic by construction.
**Warning signs:** After refactor, "Mới nhất" sidebar links on `/dau-tu/co-phieu/` point to `/co-phieu/{slug}/` (missing `/dau-tu/` prefix) or vice versa — a 404 on click, not a build error (Astro won't catch bad relative hrefs).

### Pitfall 3: `/about/` rewrite accidentally orphaning `/author/[slug]/`'s uniqueness
**What goes wrong:** If `/about/`'s new author-preview-card duplicates too much of `/author/[slug].astro`'s content (full bio paragraph, all credentials, moneyPerspective quote), the two pages become near-duplicates again — re-creating the exact problem D-01 is meant to fix, and potentially creating thin/duplicate-content SEO issues (two pages both fully describing the same author).
**Why it happens:** `src/data/authors.ts`'s `author` object has many fields (`bio`, `experience`, `expertise[]`, `moneyPerspective`, `education`, `credentials[]`, `publishedIn[]`) — it's tempting to surface "just a few more" fields on `/about/` for richness.
**How to avoid:** Strictly limit the `/about/` preview card to: avatar-initial, `author.name`, `author.role`, and a 1-line excerpt of `author.bio` (with `-webkit-line-clamp: 2` per UI-SPEC) plus the "Xem hồ sơ đầy đủ" CTA. All other author fields (`experience`, `expertise`, `moneyPerspective`, `education`, `credentials`, `publishedIn`) stay exclusively on `/author/[slug]/`.
**Warning signs:** `/about/`'s author section exceeds ~4-5 lines of content, or includes any `<ul>` of expertise/credentials — that's dossier content belonging to `/author/[slug]/`.

### Pitfall 4: Forgetting `astro check` after removing unused imports
**What goes wrong:** When `[category].astro`/`dau-tu/[category].astro` shrink to `getStaticPaths()` + data fetch + `<CategoryListing />`, the `ArticleList` import becomes unused in those route files (moves into `CategoryListing.astro`) — TypeScript strict mode + `astro check` (run as part of `npm run build`) will flag or fail on unused imports depending on `tsconfig` settings.
**Why it happens:** Easy to leave stale imports when extracting a component — Astro frontmatter imports aren't always auto-flagged by editors.
**How to avoid:** After the extraction, remove `import ArticleList from "@/components/ArticleList.astro"` from both `[category].astro` and `dau-tu/[category].astro` (it moves to `CategoryListing.astro`'s imports), and double-check `import { categories, getCategoryPath }` usage — `getCategoryPath` is used to build `categoryUrl` for the breadcrumb JSON-LD schema, which **stays in the route files** (schema generation is route-specific), so that import likely stays.
**Warning signs:** `npm run build` fails on `astro check` with "unused import" or, if strict unused-checks aren't on, no error but dead code remains — run `astro check` explicitly to catch it either way.

## Code Examples

### Trust strip section (HOME-02)
```astro
// Source: 05-UI-SPEC.md §"Component & Layout Notes #1" + existing .topic-grid/.topic-card pattern
// Insert in src/pages/index.astro, immediately after </section> closing .home-hero,
// before <section class="section topic-section">
<section class="section trust-strip-section">
  <div class="container">
    <div class="section-header">
      <div>
        <div class="eyebrow">Vì sao tin chúng tôi</div>
        <h2 class="section-title">Nguyên tắc xây dựng nội dung</h2>
      </div>
    </div>
    <div class="trust-strip">
      <a class="trust-card" href="/editorial-policy/">
        <h3>Quy trình biên tập rõ ràng</h3>
        <p>Mỗi bài viết được rà soát về nguồn, tính cập nhật và rủi ro trước khi xuất bản.</p>
      </a>
      <a class="trust-card" href="/disclaimer/">
        <h3>Không khuyến nghị mua/bán</h3>
        <p>Nội dung mang tính giáo dục, không thay thế tư vấn tài chính cá nhân hóa.</p>
      </a>
      <a class="trust-card" href="/about/">
        <h3>Có nguồn, có tác giả rõ ràng</h3>
        <p>Mỗi bài viết ghi rõ tác giả, nguồn tham khảo và ngày cập nhật cuối.</p>
      </a>
      <a class="trust-card" href="/editorial-policy/">
        <h3>Cập nhật thường xuyên</h3>
        <p>Nội dung được rà soát và cập nhật định kỳ khi có thay đổi về số liệu hoặc quy định.</p>
      </a>
    </div>
  </div>
</section>
```
```css
/* trust-card grid: matches .topic-grid responsive breakpoints (860px → 2col, 640px → 1col per UI-SPEC) */
.trust-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}
.trust-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: var(--space-6);
  text-decoration: none;
}
.trust-card:hover {
  border-color: var(--color-brand-100);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
}
.trust-card h3 {
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text);
  margin: 0 0 var(--space-2);
}
.trust-card p {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--muted);
  line-height: 1.55;
  margin: 0;
}
@media (max-width: 860px) {
  .trust-strip { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .trust-strip { grid-template-columns: 1fr; }
}
```

### Disclaimer component "Tìm hiểu thêm" link (D-11)
```astro
// Source: src/components/Disclaimer.astro (existing, verified read) — additive change only
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
  <a class="disclaimer-link" href="/disclaimer/">Tìm hiểu thêm</a>
</aside>

<style>
  /* ...existing .disclaimer/.disclaimer strong/.disclaimer span rules unchanged... */
  .disclaimer-link {
    color: var(--brand);
    font-size: 0.85rem;
    font-weight: 700;
    justify-self: start;
  }
</style>
```

### About page author preview card (D-02.3, D-03)
```astro
// Source: src/data/authors.ts (author object) + .profile-card / .author-avatar-large patterns
// from src/pages/about.astro and src/pages/author/[slug].astro (existing, verified read)
---
import { author } from "@/data/authors";
const authorInitial = author.name.split(" ").pop()?.charAt(0) ?? author.name.charAt(0);
---
<div class="author-preview-card">
  <div class="author-avatar-small" aria-hidden="true">{authorInitial}</div>
  <div>
    <strong>{author.name}</strong>
    <span class="author-role-small">{author.role}</span>
    <p class="author-bio-excerpt">{author.bio}</p>
    <a class="preview-cta" href={`/author/${author.slug}/`}>Xem hồ sơ đầy đủ</a>
  </div>
</div>
```
```css
.author-preview-card {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: var(--space-6);
}
.author-avatar-small {
  width: 64px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 26%, var(--color-neutral-50) 0 0, var(--color-neutral-50) 18%, var(--color-brand-700) 19%, var(--color-brand-900) 72%);
  color: #fff;
  display: grid;
  place-items: center;
  font-family: var(--font-serif);
  font-size: 1.6rem;
  line-height: 1;
}
.author-bio-excerpt {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.55;
  margin: var(--space-1) 0 var(--space-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.preview-cta {
  color: var(--brand);
  font-size: 0.88rem;
  font-weight: 700;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `/about/` = full `author-hero`/`author-layout` dossier (same markup as `/author/[slug]/`) | `/about/` = brand/mission story; `/author/[slug]/` = full dossier | This phase (D-01) | Removes duplicate-content risk between two pages describing the same person identically; clarifies page intent for SEO/EEAT |
| `[category].astro` and `dau-tu/[category].astro` each maintain their own near-duplicate page body + `<style>` block | Both reduce to thin route files calling shared `<CategoryListing />` | This phase (CATG-01, D-07–D-09) | Single source of visual truth for category pages; future redesigns touch one file |
| Inline `<nav class="breadcrumb">` in category pages | `<Breadcrumb items={...} />` component (already used in `ArticleLayout` per Phase 4 D-10) | This phase (D-08) | Consistent breadcrumb a11y/markup across article and category pages |
| `<Disclaimer />` shows only short `site.disclosure` text, no escape hatch | `<Disclaimer />` retains short text + adds "Tìm hiểu thêm" link to full `/disclaimer/` page | This phase (D-11) | Connects inline risk notice to full legal/educational disclaimer without duplicating its content inline |

**Deprecated/outdated:** None — no library/tooling deprecations relevant to this phase (pure Astro component composition on current Astro 5.9.3).

## Assumptions Log

> All claims below were verified directly by reading the current repository files (`src/pages/index.astro`, `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro`, `src/pages/about.astro`, `src/pages/editorial-policy.astro`, `src/pages/corrections-policy.astro`, `src/components/Disclaimer.astro`, `src/components/Breadcrumb.astro`, `src/components/CitationBox.astro`, `src/data/authors.ts`, `src/data/site.ts`, `src/styles/global.css`, `src/pages/author/[slug].astro`) in this research session — none are `[ASSUMED]` from training data alone. The table below lists the only items that involve some interpretive judgment (not raw verification).

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Sitemap config in `astro.config.mjs` will automatically include `/disclaimer/` without additional filter changes (not directly re-read in this session, but consistent with pattern of other static pages like `/corrections-policy/` which already exist and presumably appear in sitemap) | Common Pitfalls #1 | Low — if wrong, planner adds a one-line filter-list update to `astro.config.mjs`; verifiable at build time via `dist/sitemap-*.xml` |
**If this table is empty:** N/A — see A1 above for the one remaining low-risk item.

## Open Questions

1. **Exact wording for `/about/` mission statement, `/disclaimer/` full body copy, and editorial-policy expansion sections**
   - What we know: 05-UI-SPEC.md provides headings/CTAs and a few short labels (trust-strip copy is fully specified verbatim), and `.antigravity/rules/content-anti-ai.md` + YMYL caution govern tone.
   - What's unclear: Full paragraph-level copy for the mission statement, the 2-3 step editorial process list, disclaimer page body sections (Phạm vi nội dung / Không phải lời khuyên / Rủi ro đầu tư / Liên hệ), and the two new editorial-policy `<h2>` sections.
   - Recommendation: Per CONTEXT.md "Claude's Discretion," planner/implementer drafts this copy following `.antigravity/rules/content-anti-ai.md`, keeping each section to 1-3 short paragraphs (matching existing `editorial-policy.astro`/`corrections-policy.astro` density), and flags for user review per the Content Edit Rule in CLAUDE.md (read `anti-ai-rules.md` + `instincts.md` before writing, even though this is UI/page copy not `src/content/articles/`).

## Environment Availability

> Skipped — this phase is purely Astro component/page edits within the existing repo; no new external tools, services, or runtimes are introduced. The existing `npm run dev`/`npm run build` toolchain (Astro 5.9.3, Node v25.9.0, confirmed present from prior phases) is sufficient.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none — no test framework detected in repo (confirmed: "No test framework, test files, or test config found" per project tech-stack notes) |
| Config file | none |
| Quick run command | `npx astro check` (type-check frontmatter/props across all `.astro` files) |
| Full suite command | `npm run build` (runs `astro check && astro build` — also validates `getStaticPaths()` output, broken imports, and Zod content schema) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Homepage renders hero, topic grid, featured/latest sections (no regression) | build/smoke | `npm run build` then inspect `dist/index.html` | ✅ existing build pipeline |
| HOME-02 | Trust strip renders with 3-4 cards linking to `/about/`, `/editorial-policy/`, `/disclaimer/` (all 3 targets present per D-05) | manual + build | `npm run build`, grep `dist/index.html` for `href="/about/"`, `href="/editorial-policy/"`, `href="/disclaimer/"` | ❌ Wave 0 — no automated grep helper exists, but trivial shell check |
| CATG-01 | Both `[category].astro` and `dau-tu/[category].astro` render identical body structure via `CategoryListing` | build + visual | `npm run build` then diff `dist/co-phieu/index.html` vs `dist/dau-tu/co-phieu/index.html` structurally (excluding breadcrumb depth) | ❌ Wave 0 — manual diff |
| CATG-01 | `getStaticPaths()` filtering unchanged — `Đầu tư` categories only under `dau-tu/`, others under root | build | `npm run build` — astro fails build if `getStaticPaths()` produces invalid/duplicate routes | ✅ existing build pipeline catches route collisions |
| TRST-01 | `/about/` renders mission/process/preview-card/stats, links to `/author/{slug}/` and `/editorial-policy/` | manual + build | `npm run build`, inspect `dist/about/index.html` | ❌ Wave 0 — manual inspection |
| TRST-02 | `/editorial-policy/` has new fact-check + CitationBox-reference sections | manual + build | `npm run build`, inspect `dist/editorial-policy/index.html` for new `<h2>` text | ❌ Wave 0 — manual inspection |
| TRST-03 | `/disclaimer/` exists, styled like `corrections-policy.astro`; `Disclaimer.astro` links to it | build + manual | `npm run build`, check `dist/disclaimer/index.html` exists; grep any page using `<Disclaimer />` for `href="/disclaimer/"` | ❌ Wave 0 — new page, new link |

### Sampling Rate
- **Per task commit:** `npx astro check` (fast type-check, catches prop-contract mismatches in `CategoryListing`/`Disclaimer` immediately)
- **Per wave merge:** `npm run build` (full build — catches `getStaticPaths()` route issues, broken imports, Zod schema violations)
- **Phase gate:** `npm run build` green + manual visual check of `/`, `/co-phieu/`, `/dau-tu/co-phieu/`, `/about/`, `/editorial-policy/`, `/disclaimer/` before `/gsd-verify-work`

### Wave 0 Gaps
- No automated test files exist for this phase or project. Given "No test framework" is the established project state (and out of scope per REQUIREMENTS.md — QASE-01..04 belong to Phase 6), Wave 0 gaps are **manual verification checklist items**, not missing test files:
  - [ ] Manual: `/disclaimer/` page builds and is reachable
  - [ ] Manual: trust-strip on `/` links to all 3 of `/about/`, `/editorial-policy/`, `/disclaimer/`
  - [ ] Manual: `[category].astro` and `dau-tu/[category].astro` visually identical except breadcrumb depth
  - [ ] Manual: `/about/` no longer shows full author dossier (credentials/expertise/moneyPerspective/education lists)
  - [ ] Manual: `Disclaimer.astro`'s existing usages (e.g., on article pages from Phase 3/4) still render correctly with the new link added

*(Phase 6 (QASE-01..04) is the formal cross-site visual-regression/CWV/sitemap verification pass — Phase 5's gate is build-success + the manual checklist above.)*

## Security Domain

> This is a static-content marketing/informational site phase with no auth, sessions, forms, or user input — `security_enforcement` considerations are minimal. Including this section per default-enabled policy, but most ASVS categories are not applicable.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | no | No auth anywhere in this static site |
| V3 Session Management | no | No sessions — fully static SSG |
| V4 Access Control | no | All pages are public/static |
| V5 Input Validation | no | No forms/user input introduced by this phase (search.astro is client-side only and out of scope) |
| V6 Cryptography | no | No crypto operations |

### Known Threat Patterns for {stack}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| XSS via unescaped author/category data in `set:html` | Tampering/Information Disclosure | Not applicable to new code in this phase — the only `set:html` usages are existing JSON-LD `<script type="application/ld+json">` blocks (`JSON.stringify(breadcrumbSchema)`), which are already in place and unmodified by this phase's `CategoryListing` extraction (schema generation stays in route files per Pattern 1) |
| YMYL misleading financial claims (not a STRIDE category but critical for this domain) | n/a | `/disclaimer/` and `/about/` copy must avoid any phrasing that could be read as personalized investment advice or buy/sell recommendation — enforced via `.antigravity/rules/content-anti-ai.md` and the Content Edit Rule in CLAUDE.md, applies to all new page copy in this phase |

## Project Constraints (from CLAUDE.md)

- **Tech stack lock:** Must continue with Astro + content collections — no framework change (this phase complies: zero new deps).
- **Content schema compatibility:** `src/content.config.ts` Zod schema must remain compatible — this phase does not touch `content.config.ts` or article frontmatter, so no risk.
- **YMYL caution:** All new copy (`/about/`, `/disclaimer/`, trust-strip, editorial-policy expansion) must follow `.antigravity/rules/content-anti-ai.md` and avoid buy/sell recommendation framing — directly relevant to TRST-01/02/03 copy.
- **Output language:** All UI/content must be Vietnamese — UI-SPEC copy table is already entirely in Vietnamese; planner must keep all new copy Vietnamese.
- **Content Edit Rule:** Although this phase edits `src/pages/*.astro` (not `knowledge/4-content/` or `src/content/articles/`), the new on-page copy (about/disclaimer/editorial-policy/trust-strip) is reader-facing financial-education content — recommend the implementer still skim `.antigravity/rules/anti-ai-rules.md` and `.antigravity/memory/instincts.md` before drafting this copy, even though the strict "Content Edit Rule" technically gates `knowledge/4-content/`/`src/content/articles/` paths.
- **GSD Workflow Enforcement:** All file edits in this phase must go through `/gsd-execute-phase` (per CLAUDE.md "GSD Workflow Enforcement") — not direct ad-hoc edits.
- **No Tailwind/UI kit:** Confirmed compliant — all code examples above use existing CSS custom properties and scoped `<style>` blocks only.

## Sources

### Primary (HIGH confidence)
- Direct file reads (this session) of: `src/pages/index.astro`, `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro`, `src/pages/about.astro`, `src/pages/author/[slug].astro`, `src/pages/editorial-policy.astro`, `src/pages/corrections-policy.astro`, `src/components/Disclaimer.astro`, `src/components/Breadcrumb.astro`, `src/components/CitationBox.astro`, `src/data/authors.ts`, `src/data/site.ts`, `src/styles/global.css` (lines 30-370)
- `.planning/phases/05-homepage-category-trust-pages/05-UI-SPEC.md` (approved design contract, already extremely detailed)
- `.planning/phases/05-homepage-category-trust-pages/05-CONTEXT.md` (locked decisions D-01–D-13)
- `.planning/REQUIREMENTS.md`, `.planning/STATE.md`

### Secondary (MEDIUM confidence)
- None — no external/web sources needed for this phase (pure codebase research)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, all verified against installed/used Astro 5.9.3 codebase
- Architecture: HIGH — directly read all relevant existing files; extraction pattern (Pattern 1) is a standard Astro component-props refactor
- Pitfalls: HIGH — Pitfall 2 (URL prefix divergence) and Pitfall 3 (about/author duplication) are derived from direct diff of the two category route files and the about/author pages, not speculation

**Research date:** 2026-06-13
**Valid until:** Stable — no time-sensitive dependencies (no npm packages, no API versions). Valid until the next phase that touches `index.astro`, `[category].astro`, `about.astro`, `editorial-policy.astro`, or `authors.ts` shape changes.
</content>
