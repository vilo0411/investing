# Phase 4: Article Layout Wiring & Author Profile Pages - Pattern Map

**Mapped:** 2026-06-13
**Files analyzed:** 3 (1 modified, 1 new page, 1 new script)
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `src/layouts/ArticleLayout.astro` | layout | transform (render composition + JSON-LD) | itself (existing file, modified in place) | exact (self-edit) |
| `src/pages/author/[slug].astro` | route/page | request-response (SSG) | `src/pages/about.astro` (bio sections) + `src/pages/[category].astro` (getStaticPaths + ArticleList) | role-match (composite) |
| `scripts/backfill-key-takeaways.mjs` | utility (one-off migration) | batch / file-I/O | none in repo (new pattern, gray-matter-based) | no analog |

## Pattern Assignments

### `src/layouts/ArticleLayout.astro` (layout, transform)

**Analog:** itself — modify in place per D-08/D-09/D-10/D-11

**Current JSON-LD author (to expand, D-08)** — lines 44-48:
```javascript
"author": {
  "@type": "Person",
  "name": author.name,
  "url": new URL("/about/", Astro.site).toString(),
},
```
Replace with full Person object using `author.role`, `author.bio`, `author.expertise`, and `sameAs` derived from `author.socialLinks` (currently `undefined` → omit `sameAs` entirely):
```javascript
const sameAs = author.socialLinks
  ? [author.socialLinks.linkedin, author.socialLinks.twitter].filter(
      (v): v is string => Boolean(v)
    )
  : [];
// ...
"author": {
  "@type": "Person",
  "name": author.name,
  "url": new URL(`/author/${author.slug}/`, Astro.site).toString(),
  "jobTitle": author.role,
  "description": author.bio,
  "knowsAbout": author.expertise,
  ...(sameAs.length > 0 ? { "sameAs": sameAs } : {}),
},
```

**Inline breadcrumb to replace with `<Breadcrumb>` (D-10)** — lines 110-122:
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
Build `breadcrumbItems` in frontmatter (mirrors `breadcrumbSchema.itemListElement` logic at lines 77-88) and replace markup with `<Breadcrumb items={breadcrumbItems} />`:
```javascript
const breadcrumbItems = isInvestingCategory && categoryGroupPath
  ? [
      { label: "Trang chủ", href: "/" },
      { label: "Đầu tư", href: categoryGroupPath },
      { label: categoryTitle, href: categoryPath },
      { label: title },
    ]
  : [
      { label: "Trang chủ", href: "/" },
      { label: categoryTitle, href: categoryPath },
      { label: title },
    ];
```
Then delete dead `.breadcrumb`/`.breadcrumb a`/`.breadcrumb a:hover`/`.breadcrumb span[aria-current]` CSS rules at lines 191-214 — `Breadcrumb.astro` ships its own scoped styles.

**Article body reorder (D-09/D-11)** — current lines 138-180:
```astro
<article class="prose article-content">
  <aside class="ymyl-note" aria-label="Lưu ý tài chính">
    <strong>Lưu ý trước khi đọc:</strong>
    <span>{site.disclosure}</span>
  </aside>
  <slot />
  {entry.data.faq?.length ? ( ...FAQ... ) : null}
  {sources?.length ? ( ...source-section... ) : null}
  <section class="editorial-review">...</section>
  <ShareBar title={title} url={articleUrl} />
  <AuthorBox />
  <RelatedArticles category={entry.data.category} currentSlug={entry.slug} />
</article>
```
New order per D-09/D-11 (imports `KeyTakeaways`, `CitationBox` from Phase 3; `Disclaimer` optional per D-11 discretion — note heading text differs "Lưu ý trước khi đọc:" vs "Lưu ý quan trọng:"):
```astro
<article class="prose article-content">
  {/* optionally: <Disclaimer /> — note heading copy change, see Pitfall 6 */}
  <KeyTakeaways items={entry.data.keyTakeaways} />
  <slot />
  {entry.data.faq?.length ? ( ...FAQ unchanged... ) : null}
  <CitationBox sources={entry.data.sources} updatedDate={updatedDate} />
  <AuthorBox />
  <ShareBar title={title} url={articleUrl} />
  <RelatedArticles category={entry.data.category} currentSlug={entry.slug} />
</article>
```
Remove `.source-section` markup (lines 157-168) and its dedicated CSS — but `.source-section` CSS is comma-shared with `.editorial-review` at lines 260-267, 288-292, 318-319; split selectors carefully so `.editorial-review` keeps its border/background/padding/margin rules.

**Imports to add** (top of frontmatter, alongside existing imports at lines 1-8):
```typescript
import Breadcrumb from "@/components/Breadcrumb.astro";
import KeyTakeaways from "@/components/KeyTakeaways.astro";
import CitationBox from "@/components/CitationBox.astro";
```

---

### `src/pages/author/[slug].astro` (route/page, request-response/SSG)

**Analogs:** `src/pages/about.astro` (bio section markup + box pattern) and `src/pages/[category].astro` (getStaticPaths + ArticleList usage)

**getStaticPaths + ArticleList pattern** (from `src/pages/[category].astro` lines 1-22, 81):
```astro
---
import { getCollection } from "astro:content";
import ArticleList from "@/components/ArticleList.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { author } from "@/data/authors";

export async function getStaticPaths() {
  // Array-friendly: if authors.ts later exports `authors: Author[]`,
  // map over that array instead of returning a single-element list.
  return [{ params: { slug: author.slug }, props: { author } }];
}

const { author: profileAuthor } = Astro.props;
const articles = (await getCollection("articles"))
  .toSorted((a, b) => b.data.updatedDate.getTime() - a.data.updatedDate.getTime());
---
<BaseLayout title={profileAuthor.name} description={profileAuthor.bio}>
  ...
  <ArticleList articles={articles} />
</BaseLayout>
```

**Bio/credibility section markup + box styling** (from `src/pages/about.astro`):
- Hero identity block (avatar initial, name, role) — lines 19-40
- "Quan điểm về đầu tư" quote block — lines 45-48, styled via `.quote-block` (lines 236-247): border-left 4px `var(--color-brand-900)`, `var(--surface)`, padding 26px 28px
- Sidebar profile cards (experience, education, publishedIn) — lines 101-117, `.profile-card` style at lines 351-364: `border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); padding: 22px;`
- Expertise tag list — lines 33-38, `.expertise-panel ul` styling lines 199-218
- `author.experience` is a **string** (not array) — render as single `<p>{author.experience}</p>` per comment in `src/data/authors.ts` line 7

`/author/[slug]` must additionally surface fields `about.astro` does NOT show: `credentials`, `socialLinks` (currently empty/undefined — render conditionally), `moneyPerspective` (about.astro already shows this via quote-block), and the full `<ArticleList>` (about.astro only shows a 6-item "latest" list, not full grid) — per D-06/D-07 this page must be more comprehensive than `/about/`.

**AuthorBox link target to honor:**
```typescript
// src/components/AuthorBox.astro line 13, 15
<a class="author-name" href={`/author/${author.slug}`}>{author.name}</a>
<a class="author-profile-link" href={`/author/${author.slug}`}>Xem hồ sơ</a>
```
This route currently 404s; `/author/[slug].astro` resolves it.

---

### `scripts/backfill-key-takeaways.mjs` (utility, batch/file-I/O)

**No analog in repo** — new pattern type (one-off Node migration script using `gray-matter`).

**Reference implementation** (from RESEARCH.md Pattern 1, already vetted against `benjamin-graham.md`'s colon-in-bullet case):
```javascript
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = path.resolve("src/content/articles");

for (const file of fs.readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith(".md")) continue;
  const filePath = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);

  const sectionRegex = /^## Key takeaways\s*\n((?:- .+\n?)+)\n*/m;
  const match = parsed.content.match(sectionRegex);

  if (!match) {
    console.warn(`SKIP (no Key takeaways section found): ${file}`);
    continue;
  }

  const bullets = match[1]
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.replace(/^- /, "").trim());

  parsed.data.keyTakeaways = bullets;
  parsed.content = parsed.content.replace(sectionRegex, "");
  parsed.content = parsed.content.replace(/^\n+/, "");

  const output = matter.stringify(parsed, parsed.data, { lineWidth: -1 });
  fs.writeFileSync(filePath, output, "utf8");
  console.log(`Updated ${file}: ${bullets.length} key takeaways`);
}
```

**Target file shape** (verified against `src/content/articles/benjamin-graham.md`):
- Frontmatter currently has `tags`, `faq`, `sources` but no `keyTakeaways` key
- Body starts with `## Key takeaways\n\n- bullet\n- bullet\n- bullet\n\n## Next heading`
- One bullet (`benjamin-graham.md` line 24) contains `: ` mid-sentence — confirms need for `gray-matter.stringify` (not hand-rolled YAML)

**Verification one-liners** (run after script):
```bash
grep -L "keyTakeaways" src/content/articles/*.md   # expect empty
grep -l "## Key takeaways" src/content/articles/*.md  # expect empty
npm run build                                       # expect success
```

---

## Shared Patterns

### Box pattern (border-left + surface + radius)
**Source:** `src/components/KeyTakeaways.astro`, `CitationBox.astro`, `AuthorBox.astro`, `Disclaimer.astro` (all consistent)
**Apply to:** `/author/[slug]` profile sections (per D-06 Claude's discretion, follow this pattern)
```css
border: 1px solid var(--line);
border-radius: var(--radius-md);
background: var(--surface);
border-left: 4px solid var(--color-brand-900);
padding: var(--space-6);
```
Section label convention (used by KeyTakeaways/CitationBox/AuthorBox):
```css
.xxx-label {
  margin: 0 0 var(--space-2);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}
```

### `@/data/authors` import + field access
**Source:** `src/data/authors.ts`, used identically in `AuthorBox.astro` line 2, `about.astro` line 5, `ArticleLayout.astro` line 8
```typescript
import { author } from "@/data/authors";
// fields: name, slug, role, bio, credentials (string[]), experience (string),
// expertise (string[]), avatar?, socialLinks?, moneyPerspective, education, publishedIn (string[])
```

### Vietnamese date formatting
**Source:** used throughout (`ArticleLayout.astro` line 127, `ArticleList.astro` line 31, `about.astro` line 77)
```typescript
updatedDate.toLocaleDateString("vi-VN")
// or with options:
updatedDate.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `scripts/backfill-key-takeaways.mjs` | utility | batch/file-I/O | No prior migration scripts exist in repo; first use of `gray-matter`. Use RESEARCH.md Pattern 1 reference implementation directly. |

## Metadata

**Analog search scope:** `src/layouts/`, `src/pages/`, `src/components/`, `src/data/`, `src/content/articles/`
**Files scanned:** 11 (ArticleLayout.astro, authors.ts, about.astro, [category].astro, Breadcrumb.astro, CitationBox.astro, AuthorBox.astro, KeyTakeaways.astro, ArticleList.astro, Disclaimer.astro, benjamin-graham.md)
**Pattern extraction date:** 2026-06-13
