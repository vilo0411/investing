# Phase 5: Homepage, Category & Trust Pages - Pattern Map

**Mapped:** 2026-06-13
**Files analyzed:** 7
**Analogs found:** 7 / 7

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|-----------------|----------------|
| `src/pages/index.astro` (modify: insert trust-strip) | component (page section) | request-response (static render) | `src/pages/index.astro` `.topic-grid`/`.topic-card` section (lines 65-82, styles 290-321) | exact |
| `src/components/CategoryListing.astro` (new) | component | CRUD-like (render list from props) | `src/pages/[category].astro` (entire body lines 51-224) | exact |
| `src/pages/[category].astro` (modify: shrink to getStaticPaths + CategoryListing) | route | request-response | `src/pages/dau-tu/[category].astro` (sibling route, near-identical) | exact |
| `src/pages/dau-tu/[category].astro` (modify: shrink similarly) | route | request-response | `src/pages/[category].astro` (sibling route) | exact |
| `src/pages/about.astro` (rewrite) | component (page) | request-response | `src/pages/author/[slug].astro` (current about.astro is near-duplicate of this) | exact (for what to remove) / `src/data/authors.ts` (for preview card data) |
| `src/pages/disclaimer.astro` (new) | component (page) | request-response | `src/pages/corrections-policy.astro` | exact |
| `src/components/Disclaimer.astro` (modify: add link) | component | request-response | itself (additive change) | exact |
| `src/pages/editorial-policy.astro` (modify: append sections) | component (page) | request-response | itself + `src/components/CitationBox.astro` (for description reference) | exact |

## Pattern Assignments

### `src/pages/index.astro` — trust strip insertion (HOME-02)

**Analog:** existing `.topic-section` in same file (lines 65-82, styles 290-321)

**Insertion point:** immediately after `</section>` closing `.home-hero` (line 63), before `<section class="section topic-section">` (line 65).

**Section header pattern** (lines 67-72, copy verbatim structure):
```astro
<div class="section-header">
  <div>
    <div class="eyebrow">Vì sao tin chúng tôi</div>
    <h2 class="section-title">Nguyên tắc xây dựng nội dung</h2>
  </div>
</div>
```

**Card grid pattern** (`.topic-grid`/`.topic-card`, lines 290-321) — reuse verbatim for `.trust-strip`/`.trust-card`:
```css
.trust-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.trust-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: 20px;
  text-decoration: none;
}
.trust-card:hover {
  border-color: var(--color-brand-100);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
}
.trust-card h3 { color: var(--text); font-size: 0.92rem; font-weight: 700; line-height: 1.4; margin: 0 0 var(--space-2); }
.trust-card p { color: var(--muted); margin: 0; font-size: 0.85rem; line-height: 1.55; }
@media (max-width: 860px) { .trust-strip { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .trust-strip { grid-template-columns: 1fr; } }
```
Responsive media query reference at line 677 (`.topic-grid` collapse for 900px breakpoint) — follow same nesting location for `.trust-strip`.

**Content** (from UI-SPEC, verbatim copy — 4 cards linking `/editorial-policy/`, `/disclaimer/`, `/about/`, `/editorial-policy/`):
```astro
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

---

### `src/components/CategoryListing.astro` (new) — CATG-01

**Analog:** `src/pages/[category].astro` (current full file, 225 lines) and `src/pages/dau-tu/[category].astro` (sibling, 248 lines) — both bodies are ~95% identical from line 51 (`<section class="page-hero">`) to end of `<style>`.

**Imports pattern** (from `[category].astro` lines 1-5, adapted — drop `getCollection`/`getStaticPaths`-only imports, keep what the component body needs):
```astro
---
import ArticleList from "@/components/ArticleList.astro";
import Breadcrumb from "@/components/Breadcrumb.astro";
import type { CollectionEntry } from "astro:content";
import type { Category } from "@/data/site";
import { getArticlePath } from "@/data/site";

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
```

**Core pattern — page-hero with Breadcrumb swap** (replaces inline `<nav class="breadcrumb">` at `[category].astro` lines 53-57):
```astro
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
```
**Breadcrumb component prop contract** (`src/components/Breadcrumb.astro`, full file read — 64 lines):
```astro
interface Props {
  items: { label: string; href?: string }[];
}
```
Renders `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>...</ol></nav>` with `aria-current="page"` on the last item — already has its own scoped `<style>`, so `CategoryListing` does NOT need to keep the old `.breadcrumb` CSS rules (lines 110-133 in `[category].astro`) — delete them during extraction.

**Body section — category-layout grid / empty state** (`[category].astro` lines 69-106, copy verbatim except the `.latest-panel` href — see Pitfall fix below):
```astro
<section class="section">
  <div class="container">
    {
      articles.length ? (
        <div class="category-layout">
          <div>
            <div class="section-header">
              <div>
                <h2>Learning path</h2>
                <p class="muted">Đọc theo thứ tự để xây dựng nền tảng vững chắc.</p>
              </div>
            </div>
            <ArticleList articles={articles} />
          </div>
          <aside class="latest-panel" aria-label="Bài viết mới nhất">
            <h2>Mới nhất</h2>
            {latestArticles.map((article) => (
              <a href={getArticlePath(article)}>
                <strong>{article.data.title}</strong>
                <span>{article.data.readingTime}</span>
              </a>
            ))}
          </aside>
        </div>
      ) : (
        <div class="card empty-state">
          <div class="eyebrow">Sắp ra mắt</div>
          <h3>Nội dung đang được biên tập</h3>
          <p>
            Chủ đề <strong>{category.title}</strong> sẽ sớm có bài viết mới.
            Quay lại trang chủ để xem nội dung hiện có.
          </p>
          <a href="/" class="empty-state-link">← Về trang chủ</a>
        </div>
      )
    }
  </div>
</section>
```

**IMPORTANT FIX (Pitfall 2 from research):** the `.latest-panel` link in both current files is hardcoded:
- `[category].astro` line 86: `href={`/${category.slug}/${article.slug}/`}`
- `dau-tu/[category].astro` line 97: `href={`/dau-tu/${category.slug}/${article.slug}/`}`

In `CategoryListing.astro`, replace BOTH with `href={getArticlePath(article)}` (imported from `@/data/site`) — this is route-tree-agnostic and matches what `ArticleList.astro` already does for the "Learning path" grid.

**Styles to retain in `CategoryListing.astro`** (from `[category].astro` lines 134-224, minus `.breadcrumb*` rules which move into `Breadcrumb.astro` — already exist there): `.category-meta`, `.article-count-badge`, `.empty-state*`, `.category-layout`, `.latest-panel*`, and the `@media (max-width: 920px)` block. Use `dau-tu/[category].astro`'s slightly extended `.category-meta`/`.category-meta-hint` rules (lines 145-159) since they're a superset.

---

### `src/pages/[category].astro` / `src/pages/dau-tu/[category].astro` (shrink) — CATG-01/D-09

**Analog:** each other (sibling route files) + Pattern 1 from research.

Both keep `getStaticPaths()` unchanged (D-09 — `group !== "Đầu tư"` vs `group === "Đầu tư"` filtering). Both keep article fetch/sort and `breadcrumbSchema` JSON-LD (route-specific, lines 26-43 / 26-49).

**`[category].astro` final shape:**
```astro
---
import { getCollection } from "astro:content";
import CategoryListing from "@/components/CategoryListing.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { categories, getCategoryPath } from "@/data/site";

export async function getStaticPaths() { /* unchanged, lines 7-14 */ }

const { category } = Astro.props;
const articles = (await getCollection("articles"))
  .filter((article) => article.data.category === category.slug)
  .sort((a, b) => a.data.order - b.data.order);

const categoryUrl = new URL(getCategoryPath(category), Astro.site).toString();
const breadcrumbSchema = { /* unchanged, lines 26-43 */ };
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
**REMOVE:** `import ArticleList` (moves into CategoryListing), `latestArticles` computation (moves into CategoryListing), entire `<style>` block (moves into CategoryListing).

**`dau-tu/[category].astro`** identical shape but `breadcrumbItems` is 3-level:
```astro
const breadcrumbItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Đầu tư", href: "/dau-tu/" },
  { label: category.title },
];
```

---

### `src/pages/about.astro` (rewrite) — TRST-01

**Analog (what to REMOVE):** current `src/pages/about.astro` itself (122 lines) — drop `.author-hero`/`.author-hero-grid`/`.author-identity`/`.author-avatar-large`/`.expertise-panel`/`.author-body`/`.author-layout`/`.quote-block`/`.bio-section`/`.latest-section`/`.latest-author-*`/`.author-sidebar`/`.profile-card`/`.published-list` and all corresponding `<style>` rules (lines 123-420 minus the few retained below). This content now lives at `src/pages/author/[slug].astro` (Phase 4, verified — has its own copy of these styles).

**Analog (what to KEEP/adapt):** `.stat-stack` markup+CSS (current about.astro lines 86-99 for markup, 321-349 for CSS) — retitle section "Quy mô nội dung", drop the "Năm cập nhật hồ sơ" stat:
```astro
<div class="stat-stack">
  <div>
    <strong>{articleCount}</strong>
    <span>Bài viết đã xuất bản</span>
  </div>
  <div>
    <strong>{categoryCount}</strong>
    <span>Nhóm chủ đề đầu tư</span>
  </div>
</div>
```
```css
.stat-stack { display: grid; padding: 0 22px; }
.stat-stack div { padding: 20px 0; border-bottom: 1px solid var(--line); }
.stat-stack div:last-child { border-bottom: 0; }
.stat-stack strong { display: block; color: var(--brand); font-family: var(--font-serif); font-size: 2rem; line-height: 1; }
.stat-stack span { display: block; margin-top: 6px; color: var(--muted); font-size: 0.88rem; line-height: 1.5; }
```

**Hero pattern** — use `.page-hero` (from `[category].astro` lines 51-67, structurally) for the mission hero, but without breadcrumb/category-meta:
```astro
<section class="page-hero">
  <div class="container">
    <div class="eyebrow">Giới thiệu</div>
    <h1>Vì sao ValueInvesting.com.vn ra đời</h1>
    <p class="lead">[mission/audience copy per D-02.1 — anti-AI rules apply]</p>
  </div>
</section>
```

**Editorial process summary — numbered step list** (analog: `.start-item`/`.start-number` from `src/pages/index.astro` lines 92-105, 327-349):
```astro
<div class="start-list">
  {steps.map((step, index) => (
    <div class="start-item">
      <span class="start-number">{String(index + 1).padStart(2, "0")}</span>
      <span>
        <strong>{step.title}</strong>
        <small>{step.description}</small>
      </span>
    </div>
  ))}
</div>
<a href="/editorial-policy/">Xem chính sách biên tập đầy đủ</a>
```
```css
.start-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
/* .start-item, .start-number, .start-item strong/small — copy verbatim from index.astro 327-349, collapse to 2-3 cols since only 2-3 steps */
```

**Author preview card** — analog `src/data/authors.ts` (full file, 21 lines, `author` object) + `.author-avatar-large` pattern scaled down from `src/pages/author/[slug].astro` lines 131-143:
```astro
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
.preview-cta { color: var(--brand); font-size: 0.88rem; font-weight: 700; }
```

**Data needed** (`articleCount`/`categoryCount` — analog: current about.astro lines 12-13):
```ts
const articleCount = articles.length;
const categoryCount = new Set(articles.map((article) => article.data.category)).size;
```

---

### `src/pages/disclaimer.astro` (new) — TRST-03

**Analog:** `src/pages/corrections-policy.astro` (full file, 26 lines) — copy structure exactly:
```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
---

<BaseLayout title="Miễn trừ trách nhiệm" description="Phạm vi nội dung giáo dục và giới hạn trách nhiệm của ValueInvesting.com.vn.">
  <section class="article-header">
    <div class="article-container">
      <h1>Miễn trừ trách nhiệm</h1>
      <p class="lead">Nội dung trên ValueInvesting.com.vn chỉ mang tính giáo dục và không phải lời khuyên đầu tư cá nhân hóa.</p>
    </div>
  </section>
  <section class="article-container prose">
    <h2>Phạm vi nội dung</h2>
    <p>[...]</p>
    <h2>Không phải lời khuyên đầu tư cá nhân hóa</h2>
    <p>[...]</p>
    <h2>Rủi ro đầu tư</h2>
    <p>[...]</p>
    <h2>Liên hệ và phản hồi</h2>
    <p>[...]</p>
  </section>
</BaseLayout>
```
No `<style>` block needed — `.article-header`/`.article-container`/`.prose`/`.lead` are global (`src/styles/global.css`).

---

### `src/components/Disclaimer.astro` (modify) — D-11

**Analog:** itself, current 37-line file (full file read).

**Additive change** — insert link after `<span>{text}</span>`, no prop-contract change:
```astro
<aside class="disclaimer" aria-label="Lưu ý tài chính">
  <strong>Lưu ý quan trọng:</strong>
  <span>{text}</span>
  <a class="disclaimer-link" href="/disclaimer/">Tìm hiểu thêm</a>
</aside>
```
```css
.disclaimer-link {
  color: var(--brand);
  font-size: 0.85rem;
  font-weight: 700;
  justify-self: start;
}
```
(append to existing `<style>` block — `.disclaimer { display: grid; gap: var(--space-1); ... }` already uses `display: grid`, so the new link naturally falls on its own row.)

---

### `src/pages/editorial-policy.astro` (modify, append sections) — TRST-02/D-13

**Analog:** itself, current 29-line file (full file read) — same `.prose` block, just append two more `<h2>` + `<p>` groups before `</section>` (line 28):
```astro
    <h2>Quy trình fact-check chi tiết</h2>
    <p>[expand on "Quy trình rà soát" — concrete steps per D-13]</p>

    <h2>Hộp nguồn tham khảo trên từng bài viết</h2>
    <p>
      Mỗi bài viết hiển thị một hộp "Nguồn tham khảo" (CitationBox) liệt kê các nguồn được dùng,
      kèm ngày kiểm tra nguồn lần cuối ("Kiểm tra nguồn lần cuối") và ngày cập nhật nội dung
      ("Cập nhật lần cuối"). [...]
    </p>
```
Reference for what `<CitationBox />` renders: `src/components/CitationBox.astro` props are `sources?/citations?/factCheckedDate?/updatedDate` (per Phase 3 context, not re-read this session since only a textual description is needed — no new instance embedded).

---

## Shared Patterns

### Box/Card pattern (border-left accent or full border)
**Source:** `.topic-card` (`src/pages/index.astro` 297-321), `.disclaimer` (`src/components/Disclaimer.astro` 17-25)
**Apply to:** `.trust-card` (index.astro), `.author-preview-card` (about.astro)
```css
border: 1px solid var(--line);
border-radius: var(--radius-md);
background: var(--surface);
padding: var(--space-6); /* or 20px for topic-card scale */
```

### Section header pattern
**Source:** `.section-header`/`.section-title` (`src/pages/index.astro` 597-609)
**Apply to:** trust-strip section, any new `.section`-wrapped block in about.astro
```css
.section-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 24px; }
.section-title { font-size: clamp(1.25rem, 2.2vw, 1.6rem); margin: 4px 0 0; color: var(--text); }
```

### Breadcrumb component
**Source:** `src/components/Breadcrumb.astro` (full file, 64 lines)
**Apply to:** `CategoryListing.astro` (replaces inline `<nav class="breadcrumb">` in both category route files per D-08)
**Contract:** `<Breadcrumb items={[{ label, href? }, ...]} />` — last item (no `href`) gets `aria-current="page"`.

### `.article-header` + `.article-container.prose` static page pattern
**Source:** `src/pages/corrections-policy.astro` (full file)
**Apply to:** `src/pages/disclaimer.astro` (new), and the appended sections in `editorial-policy.astro` (same `.prose` block already in use)

### `getArticlePath()` for cross-route-tree links
**Source:** `src/data/site.ts` (`getArticlePath`, also used in `src/pages/index.astro` line 96, `src/pages/author/[slug].astro` line 73)
**Apply to:** `CategoryListing.astro` `.latest-panel` links — replaces both route files' hardcoded `/${category.slug}/...` and `/dau-tu/${category.slug}/...` templates.

## No Analog Found

None — all 7 files/components have strong existing analogs in the codebase.

## Metadata

**Analog search scope:** `src/pages/`, `src/components/`, `src/data/`
**Files scanned:** `index.astro`, `[category].astro`, `dau-tu/[category].astro`, `about.astro`, `author/[slug].astro`, `corrections-policy.astro`, `editorial-policy.astro`, `Disclaimer.astro`, `Breadcrumb.astro`, `authors.ts`, `site.ts` (referenced, not re-read)
**Pattern extraction date:** 2026-06-13
</content>
