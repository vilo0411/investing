# Phase 4: Article Layout Wiring & Author Profile Pages - Research

**Researched:** 2026-06-12
**Domain:** Astro content collections, frontmatter migration, layout composition, JSON-LD structured data
**Confidence:** HIGH

## Summary

Phase 4 is primarily a wiring/composition task on top of components already built in Phase 3 — no new components, no new dependencies for the runtime site. The work splits into three independent tracks: (1) a one-off Node script to backfill `keyTakeaways` frontmatter for 21 articles by relocating their `## Key takeaways` body section, (2) rewiring `src/layouts/ArticleLayout.astro` to compose Breadcrumb → KeyTakeaways → TOC/Content → CitationBox → AuthorBox → ShareBar/RelatedArticles and expand `articleSchema.author` from `src/data/authors.ts`, and (3) a new static `/author/[slug].astro` page reusing `ArticleList.astro`.

All Phase 3 component prop contracts (`KeyTakeaways`, `CitationBox`, `Breadcrumb`, `AuthorBox`, `Disclaimer`) were read directly from `src/components/*.astro` and match what 03-CONTEXT.md documents — no drift found. `src/data/authors.ts` exports a single `author` object (not yet an array) with all fields needed for both the author page and JSON-LD expansion. All 21 articles use the exact heading `## Key takeaways` (verified via grep — 21/21 match), immediately followed by a flat bullet list (`- ...`) and then the next `## ` heading — a uniform, simple pattern. One article (`benjamin-graham.md`) has a bullet containing a colon (`Biên an toàn là nguyên tắc trung tâm: mua với giá đủ thấp...`), which is the concrete instance of the YAML-colon pitfall the planner must account for.

**Primary recommendation:** Use a one-off Node script with `gray-matter` (already a transitive dependency of Astro's content layer, but add explicitly as a devDependency for the script) to parse each article's frontmatter + body, extract the `## Key takeaways` bullet list into a `keyTakeaways: string[]` array, remove that section from the body, and write the file back using `gray-matter.stringify` (which handles YAML quoting/escaping automatically, including the colon case). Then rewire `ArticleLayout.astro` per D-09/D-10/D-11/D-08, and add `src/pages/author/[slug].astro` following the existing `getStaticPaths()` + `ArticleList` patterns from `src/pages/[category].astro`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Article layout composition (component order) | Frontend Server (SSR/SSG via Astro) | — | `ArticleLayout.astro` is a build-time template; ordering is pure markup composition |
| `/author/[slug]` profile page | Frontend Server (SSG) | Database/Storage (content collection as data source) | Static page generated from `src/data/authors.ts` + `getCollection("articles")` at build time |
| JSON-LD Person/Article schema | Frontend Server (SSG) | — | Generated inline in `ArticleLayout.astro` frontmatter from `authors.ts`, emitted as `<script type="application/ld+json">` |
| `keyTakeaways` frontmatter backfill | Database/Storage (content collection source files) | Build tooling (one-off Node script) | Markdown frontmatter is the persistence layer; the script is a one-time migration tool, not part of the build pipeline |
| Citation rendering | Frontend Server (SSG) | Database/Storage (`entry.data.sources`) | `CitationBox` consumes `entry.data.sources` directly, no new data layer |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 5.9.3 (already installed) | Static site generator, content collections, `getStaticPaths` | Existing project foundation, no change |
| gray-matter | 4.0.3 | Parse/stringify frontmatter + body for the 21-article backfill script | De facto standard frontmatter library; handles YAML escaping (colons, quotes) automatically on `stringify` — avoids hand-rolled regex YAML mutation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none — Node built-ins `fs`, `path`) | n/a | File I/O for the migration script | Sufficient for a 21-file one-off script run via `node` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| gray-matter | Manual regex extraction + string concatenation for frontmatter | Faster to write but fragile: a naive approach risks producing invalid YAML when bullet text contains `:` (confirmed present in `benjamin-graham.md`), unescaped quotes, or multi-line content. gray-matter's `stringify` (backed by `js-yaml`) quotes/escapes correctly. |
| gray-matter | Manual edit of all 21 files by hand | D-01/D-02 explicitly allow either; manual is viable for 21 files but error-prone for verbatim-preservation guarantee and removal-of-section correctness across all 21. Script is faster and auditable via diff. |

**Installation:**
```bash
npm install --save-dev gray-matter
```

**Version verification:** `npm view gray-matter version` → `4.0.3` [VERIFIED: npm registry], published 2014, actively used (50M+/week downloads historically as the standard frontmatter parser for static site tooling — used internally by Astro's own content loaders).

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| gray-matter | npm | ~12 yrs (created 2014-01-28) | Very high (standard frontmatter lib, bundled with many SSGs) | github.com/jonschlinkert/gray-matter | OK | Approved — devDependency only, used for one-off migration script |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

`gray-matter` is `[CITED: npm registry — package metadata confirms 2014 creation date, github.com/jonschlinkert/gray-matter repo]`. No `package-legitimacy check` seam was available in this environment; verification was done directly via `npm view gray-matter version time.created repository.url`, which returned consistent, long-lived registry metadata. This is a devDependency for a one-off script only — it is NOT part of the production build or runtime bundle (Astro build does not import it).

## Architecture Patterns

### System Architecture Diagram

```
Migration script (one-off, run once)
  src/content/articles/*.md (21 files)
    --gray-matter.read()--> { data: frontmatter, content: body }
    --regex/string ops on body--> extract "## Key takeaways" bullet block
    --data.keyTakeaways = [...bullets]-->
    --body = body without that section-->
    --gray-matter.stringify(body, data)--> write file back
  (run, verify diff, delete script)

Build-time (astro build / astro dev)
  getCollection("articles")
    --> entry.data.keyTakeaways: string[]   (now populated for 21 articles)
    --> entry.data.sources: string[]        (existing)
    --> entry.data (passed to) ArticleLayout.astro
                                |
                                v
  ArticleLayout.astro frontmatter
    - compute categoryMeta, categoryTitle, categoryPath, isInvestingCategory, categoryGroupPath (existing)
    - build `breadcrumbItems: {label, href?}[]` (NEW — reused for <Breadcrumb> AND breadcrumbSchema)
    - build `articleSchema.author` from `author` (src/data/authors.ts) — Person object (NEW, expanded)
                                |
                                v
  ArticleLayout.astro template (render order, D-09/D-10/D-11)
    <Breadcrumb items={breadcrumbItems} />          <- replaces inline <nav class="breadcrumb">
    <header> title/lead/meta/trust strip (unchanged)
    <div class="article-body--toc">
      <article class="article-content">
        <KeyTakeaways items={entry.data.keyTakeaways} />   <- NEW, first child, before <slot/>
        <slot />                                            <- article body (Key Takeaways section removed)
        FAQ section (unchanged)
        <CitationBox sources={entry.data.sources} updatedDate={updatedDate} />  <- replaces .source-section
        <AuthorBox />                                       <- existing, position confirmed
        <ShareBar /> <RelatedArticles />                    <- existing
      </article>
      <aside class="toc-sidebar"><TOC /></aside>
    </div>

New page: /author/[slug]
  src/pages/author/[slug].astro
    getStaticPaths() --> [{ params: { slug: author.slug }, props: { author } }]  (single entry, array-friendly shape)
    getCollection("articles")  --> all articles (single author = all articles, per D-07)
    render: bio / role / experience / expertise / credentials / education / moneyPerspective / socialLinks / publishedIn
            + <ArticleList articles={articles} />  (reused component)

JSON-LD on article pages (build time, inline <script type="application/ld+json">)
  articleSchema.author = {
    "@type": "Person",
    name: author.name,
    url: `${site}/author/${author.slug}/`,     <- was /about/, now /author/{slug}
    jobTitle: author.role,                      <- NEW
    description: author.bio,                    <- NEW
    knowsAbout: author.expertise,                <- NEW
    sameAs: [socialLinks.linkedin, socialLinks.twitter].filter(Boolean)  <- NEW, omitted if undefined
  }
```

### Recommended Project Structure
```
src/
├── pages/
│   ├── author/
│   │   └── [slug].astro       # NEW — /author/[slug] profile page (EEAT-06)
│   └── [category]/[slug].astro  # unchanged, passes entry+headings to ArticleLayout
├── layouts/
│   └── ArticleLayout.astro     # MODIFIED — component order, breadcrumb, JSON-LD author, citation/keytakeaways wiring
├── components/
│   ├── Breadcrumb.astro        # existing, now consumed by ArticleLayout
│   ├── KeyTakeaways.astro      # existing, now consumed by ArticleLayout
│   ├── CitationBox.astro       # existing, now consumed by ArticleLayout
│   ├── AuthorBox.astro         # existing, unchanged
│   └── ArticleList.astro       # existing, reused by /author/[slug]
├── data/
│   └── authors.ts              # unchanged (read-only this phase)
└── content/articles/*.md       # MODIFIED (21 files) — keyTakeaways frontmatter added, body section removed

scripts/                         # NEW (suggested, outside src/) — one-off migration script
└── backfill-key-takeaways.mjs   # run once via `node scripts/backfill-key-takeaways.mjs`, then can be deleted or kept for reference
```

### Pattern 1: One-off frontmatter migration script with gray-matter
**What:** Read each `.md` file, parse with `gray-matter`, extract the `## Key takeaways` bullet block from `content` via regex, set `data.keyTakeaways`, strip that block from `content`, write back with `matter.stringify`.
**When to use:** For the EEAT-10 backfill (D-01/D-02), run once across all 21 files in `src/content/articles/`.
**Example:**
```javascript
// scripts/backfill-key-takeaways.mjs
// Source: gray-matter README (github.com/jonschlinkert/gray-matter) + Astro content collection conventions
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = path.resolve("src/content/articles");

for (const file of fs.readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith(".md")) continue;
  const filePath = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);

  // Match the "## Key takeaways" section: heading + following bullet lines,
  // up to (but not including) the next "## " heading or end of content.
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
  // Trim leading blank lines left after removal
  parsed.content = parsed.content.replace(/^\n+/, "");

  const output = matter.stringify(parsed, parsed.data, { lineWidth: -1 });
  fs.writeFileSync(filePath, output, "utf8");
  console.log(`Updated ${file}: ${bullets.length} key takeaways`);
}
```

**Critical notes for the planner:**
- `matter.stringify` with `js-yaml` will correctly quote the `benjamin-graham.md` bullet containing `:` (`"Biên an toàn là nguyên tắc trung tâm: mua với giá đủ thấp..."`). Verify this specific file's output after running the script.
- Pass `{ lineWidth: -1 }` to gray-matter's stringify options to prevent `js-yaml` from line-wrapping long Vietnamese strings at an arbitrary column (default wrap is 80 chars, which would alter formatting of long bullet/description strings even though content is "unchanged").
- gray-matter preserves the existing frontmatter key order is NOT guaranteed — `js-yaml` dump may reorder keys alphabetically or by object-insertion order depending on options. **Run on one file first and diff the frontmatter key order** against `src/content.config.ts` schema field order; if `astro check` only cares about presence/types (it does — Zod schema, not key order), reordering is harmless but should be confirmed with the team / noted as expected diff noise.
- All 21 files confirmed to use exactly `## Key takeaways` (case-sensitive, no variants like "Key Takeaways") — `grep -h "^## Key" src/content/articles/*.md | sort -u` returned only `## Key takeaways`, 21 matches. The regex above does not need to handle heading-case variants for this dataset, but should still fail loudly (`console.warn`) if a file doesn't match, rather than silently skip.
- After the section is removed, the body must not have a leftover blank-heading gap before the next `## ` heading — the regex above consumes trailing newlines and the post-replace trim handles the leading-blank-line case.

### Pattern 2: Replacing inline breadcrumb with `<Breadcrumb>` component (D-10)
**What:** Build a shared `breadcrumbItems: {label, href?}[]` array in `ArticleLayout.astro` frontmatter, reuse it for both `<Breadcrumb items={breadcrumbItems} />` and as the source for `breadcrumbSchema.itemListElement` (optional refactor — `breadcrumbSchema` can stay as-is per D-10, but building from the same array reduces duplication).
**When to use:** ArticleLayout header section, replacing lines 110-122 (current inline `<nav class="breadcrumb">`).
**Example:**
```astro
---
// Source: src/components/Breadcrumb.astro prop contract — items: { label: string; href?: string }[]
const breadcrumbItems = isInvestingCategory && categoryGroupPath
  ? [
      { label: "Trang chủ", href: "/" },
      { label: "Đầu tư", href: categoryGroupPath },
      { label: categoryTitle, href: categoryPath },
      { label: title }, // no href = current page, rendered as aria-current
    ]
  : [
      { label: "Trang chủ", href: "/" },
      { label: categoryTitle, href: categoryPath },
      { label: title },
    ];
---
<!-- in template, replace <nav class="breadcrumb">...</nav> with: -->
<Breadcrumb items={breadcrumbItems} />
```
Note: after this change, the scoped `.breadcrumb` CSS block (lines 191-214 in current `ArticleLayout.astro` `<style>`) becomes dead code and should be removed — `Breadcrumb.astro` has its own scoped styles using `<ol>/<li>` markup (different from the current `<nav>` flat-span markup), so the old `.breadcrumb` selectors won't match anything after the swap.

### Pattern 3: JSON-LD Person expansion from authors.ts (D-08)
**What:** Replace the minimal `articleSchema.author` object with a full Person built from `author` fields, all already imported (`import { author } from "@/data/authors"` is already present at line 8).
**When to use:** `ArticleLayout.astro` frontmatter, `articleSchema` construction (current lines 44-48).
**Example:**
```javascript
// Source: src/data/authors.ts field names confirmed by direct read
// author.socialLinks is `{ linkedin?: string; twitter?: string; email?: string } | undefined`
const sameAs = author.socialLinks
  ? [author.socialLinks.linkedin, author.socialLinks.twitter].filter(
      (v): v is string => Boolean(v)
    )
  : [];

const articleSchema = {
  // ...existing fields unchanged...
  "author": {
    "@type": "Person",
    "name": author.name,
    "url": new URL(`/author/${author.slug}/`, Astro.site).toString(),
    "jobTitle": author.role,
    "description": author.bio,
    "knowsAbout": author.expertise,
    ...(sameAs.length > 0 ? { "sameAs": sameAs } : {}),
  },
  // ...
};
```
Currently `author.socialLinks` is `undefined` (no values set in `src/data/authors.ts`), so `sameAs` will be an empty array → omitted entirely per D-08 ("omitted/empty if `socialLinks` is undefined"). This is correct behavior and requires no further author.ts changes in this phase (authors.ts edits are out of scope — read-only dependency).

### Pattern 4: `/author/[slug]` static page with `getStaticPaths` (D-06/D-07)
**What:** New file `src/pages/author/[slug].astro`. Single static path now (`author.slug = "nguyen-viet-loc"`), written generically so adding array entries to `authors.ts` later doesn't require restructuring.
**When to use:** EEAT-06 implementation.
**Example:**
```astro
---
// Source: pattern adapted from src/pages/[category].astro getStaticPaths + ArticleList usage
import { getCollection } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import ArticleList from "@/components/ArticleList.astro";
import { author } from "@/data/authors";

export async function getStaticPaths() {
  // Array-friendly: if authors.ts later exports `authors: Author[]`,
  // change this to authors.map((author) => ({ params: {...}, props: { author } }))
  return [{ params: { slug: author.slug }, props: { author } }];
}

const { author: profileAuthor } = Astro.props;

// D-07: single author => filter matches all articles (article.data.author
// field does not exist; with one author, all articles are "by" them)
const articles = (await getCollection("articles"))
  .toSorted((a, b) => b.data.updatedDate.getTime() - a.data.updatedDate.getTime());
---
<BaseLayout title={profileAuthor.name} description={profileAuthor.bio}>
  <!-- credibility dossier sections: bio, role, experience, expertise,
       credentials, education, moneyPerspective, socialLinks, publishedIn -->
  <!-- D-07: article list -->
  <ArticleList articles={articles} />
</BaseLayout>
```

**Important: route collision risk.** `AuthorBox.astro` already links to `/author/${author.slug}` (line 13, 15 of `AuthorBox.astro`), and there is currently NO `src/pages/author/` directory — confirmed via `ls src/pages/` (only `[category]`, `about.astro`, `contact.astro`, `corrections-policy.astro`, `dau-tu`, `dau-tu.astro`, `editorial-policy.astro`, `index.astro`, `kien-thuc`, `preview`, `search.astro`, `sources-policy.astro`). This means `/author/nguyen-viet-loc/` currently 404s — AuthorBox's link is dangling until this page is created. No collision with existing routes; `src/pages/author/[slug].astro` is a clean new directory.

**Sitemap consideration:** `astro.config.mjs` filters `/kien-thuc/`, four legacy category roots (`/co-phieu/`, `/etf/`, `/quy-dau-tu/`, `/trai-phieu/`), and `/preview/` from the sitemap, and defines redirects only for those same legacy category roots plus `/phai-sinh/`. None of these patterns match `/author/*` — `[VERIFIED: astro.config.mjs direct read]` confirms `/author/[slug]` is a clean new route, included in the sitemap by default with no filter changes needed.

### Pattern 5: KeyTakeaways placement inside the 2-column grid (D-09)
**What:** `<KeyTakeaways items={entry.data.keyTakeaways} />` renders as the first child of `.article-content` (inside `<article class="prose article-content">`), before `<slot />`.
**When to use:** ArticleLayout template, inside the existing `<article class="prose article-content">` block (current lines 138-180).
**Example:**
```astro
<article class="prose article-content">
  {/* D-11 discretion: .ymyl-note -> <Disclaimer /> if visual output unchanged */}
  <Disclaimer />
  <KeyTakeaways items={entry.data.keyTakeaways} />
  <slot />
  {/* FAQ section unchanged */}
  {entry.data.faq?.length ? ( ... ) : null}
  <CitationBox sources={entry.data.sources} updatedDate={updatedDate} />
  <AuthorBox />
  <ShareBar title={title} url={articleUrl} />
  <RelatedArticles category={entry.data.category} currentSlug={entry.slug} />
</article>
```
`KeyTakeaways.astro` returns `null` (renders nothing) when `items.length === 0` per its own guard (`{items.length > 0 && (...)}`) — so for any article where the backfill script found no `## Key takeaways` section (none expected, but defensive), the component safely no-ops. Same null-guard pattern applies to `CitationBox` (`hasAny = sources.length > 0 || citations.length > 0`).

### Anti-Patterns to Avoid
- **Hand-rolled YAML string mutation for the backfill:** Don't use string `.replace()` on raw frontmatter text to inject `keyTakeaways:` — the `benjamin-graham.md` colon-in-bullet case will produce invalid YAML (`- Biên an toàn là nguyên tắc trung tâm: mua với giá...` parses as a YAML mapping, not a string, breaking `astro check`). Always go through `gray-matter` (or equivalent YAML-aware library) for both read and write.
- **Rewriting bullet wording during backfill:** D-01/D-02 and PROJECT.md both require verbatim text. The migration script must only move text, never edit it — no trimming beyond whitespace, no punctuation "fixes".
- **Reordering CitationBox before content:** ARTL-01/D-11 fix the order as Content → CitationBox → AuthorBox. Do not place CitationBox before `<slot />` even though `KeyTakeaways` is "first" — they serve different positions (KeyTakeaways = summary/preview, CitationBox = post-content references).
- **Inventing new JSON-LD fields:** D-08 explicitly says no fields beyond what's in `authors.ts`. Don't add `worksFor`, `affiliation`, etc. unless those fields exist in `author`.
- **Full-width KeyTakeaways above the grid:** D-09 specifies KeyTakeaways stays inside `.article-content` (the grid's content column), not as a full-width block spanning both columns. This is a deliberate minimal-layout-change decision.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing/writing for 21-file migration | Custom regex-based YAML editor | `gray-matter` | YAML escaping (colons, quotes, multi-line strings) is a known footgun; gray-matter + js-yaml handles it correctly and is the ecosystem standard |
| Breadcrumb markup/ARIA | New custom breadcrumb component | `src/components/Breadcrumb.astro` (Phase 3) | Already built, already styled, already has correct `aria-label`/`aria-current` semantics |
| Author article filtering for `/author/[slug]` | New "articles by author" field/index | `getCollection("articles")` filtered/sorted in-page (D-07: with one author, all articles qualify) | No `author` field exists on article frontmatter; adding one is out of scope. Single-author reality means no filter is even needed yet — just list all articles, sorted by `updatedDate` |

**Key insight:** This phase touches no new infrastructure — every "don't hand-roll" item points back to something Phase 2 or Phase 3 already built. The only genuinely new code is the migration script (small, one-off, gray-matter-backed) and the `/author/[slug]` page (composition of existing components + new bio markup).

## Common Pitfalls

### Pitfall 1: YAML colon-in-bullet breaks frontmatter on naive backfill
**What goes wrong:** A bullet like `Biên an toàn là nguyên tắc trung tâm: mua với giá đủ thấp so với giá trị ước tính.` (from `benjamin-graham.md`), if inserted into YAML frontmatter as an unquoted string under a `- ` list item, gets parsed by YAML as a mapping (`{Biên an toàn là nguyên tắc trung tâm: "mua với giá..."}`)  instead of a plain string, because `key: value` is valid YAML mapping syntax inside a sequence item.
**Why it happens:** YAML treats `text: more text` ambiguously — a colon followed by a space inside a scalar requires quoting.
**How to avoid:** Use `gray-matter`'s `stringify` (backed by `js-yaml`'s `dump`), which automatically quotes strings containing `: ` when needed. Do NOT manually construct the `keyTakeaways:` YAML block as a template string.
**Warning signs:** After running the backfill script, run `npm run build` (which runs `astro check && astro build`) — if `keyTakeaways` for `benjamin-graham.md` fails Zod's `z.array(z.string())` validation or comes through as objects instead of strings, the YAML was malformed. Spot-check `benjamin-graham.md`'s frontmatter output specifically.

### Pitfall 2: js-yaml line-wrapping alters string formatting on stringify
**What goes wrong:** `js-yaml.dump` (used internally by `gray-matter.stringify`) defaults to wrapping long string values at 80 characters using YAML's folded/literal block scalars or line continuations, which can visually change how long Vietnamese description/source strings are stored — even though the *content* is unchanged, the *diff* will show large changes to unrelated frontmatter fields (`description`, `sources`).
**Why it happens:** Default `lineWidth` option in js-yaml is 80.
**How to avoid:** Pass `{ lineWidth: -1 }` (or a large number) to `matter.stringify(file, data, { lineWidth: -1 })` to disable wrapping, keeping diffs minimal and scoped to the actual `keyTakeaways` addition + body section removal.
**Warning signs:** `git diff` after running the script shows changes to lines/fields that weren't part of the intended backfill (e.g., `description:` or `sources:` reformatted across multiple lines).

### Pitfall 3: Removing `## Key takeaways` leaves a body that starts with a blank line or orphaned whitespace
**What goes wrong:** After regex-removing the heading + bullets, the body may start with `\n\n## Next Heading` (extra blank lines) or, if the section was at the very start of content, leave the body starting mid-sentence relative to what Astro/remark expects.
**Why it happens:** The original content structure is `## Key takeaways\n\n- bullet\n- bullet\n\n## Next section` — removing only `## Key takeaways\n\n(- bullet\n)+` leaves a leading `\n## Next section`.
**How to avoid:** After the regex replace, trim leading newlines from `parsed.content` (`.replace(/^\n+/, "")`). Verify rendered output visually for 2-3 articles after the script runs (extra blank lines are usually harmless in rendered HTML but worth confirming no stray empty `<p>` appears).
**Warning signs:** `astro dev` preview of a backfilled article shows an unexpected gap between the article header and the first heading, or the first `## ` heading appears with extra top margin.

### Pitfall 4: Dead CSS after Breadcrumb component swap (D-10)
**What goes wrong:** The current `.breadcrumb` scoped styles in `ArticleLayout.astro` (lines ~191-214) target a `<nav class="breadcrumb"><a>...<span aria-current>` flat structure. `Breadcrumb.astro` renders `<nav class="breadcrumb"><ol><li><a>/<span aria-current="page">`. If the old `.breadcrumb` CSS is left in `ArticleLayout.astro`'s `<style>` block, it becomes dead/unused code (harmless but messy) — or worse, if `Breadcrumb.astro`'s own scoped styles and `ArticleLayout`'s leftover `.breadcrumb` styles both target `.breadcrumb` (Astro scopes styles per-component via `data-astro-cid-*` attributes, so they shouldn't collide, but visual inconsistency is possible if both apply).
**Why it happens:** Astro scoped styles are per-file; removing a component's markup from a parent doesn't auto-remove the parent's now-orphaned CSS rules.
**How to avoid:** When replacing the inline `<nav class="breadcrumb">` with `<Breadcrumb items={...} />`, also delete the `.breadcrumb`, `.breadcrumb a`, `.breadcrumb a:hover`, `.breadcrumb span[aria-current]` rules from `ArticleLayout.astro`'s `<style>` block (lines ~191-214).
**Warning signs:** Visual diff shows breadcrumb styled differently than `Breadcrumb.astro`'s own styles intend (e.g., wrong font-size, color) due to a stale `ArticleLayout` rule still matching.

### Pitfall 5: `.source-section` removal leaves orphaned `.source-section` CSS and "Nguồn tham khảo" heading duplication
**What goes wrong:** `CitationBox.astro` renders its own `<h2>Nguồn tham khảo</h2>`. The current `.source-section` block in `ArticleLayout.astro` (lines 157-168) also renders `<h2>Nguồn tham khảo</h2>` plus a link to `/sources-policy/`. If both are kept, there'd be two "Nguồn tham khảo" headings. D-11 says replace `.source-section` with `<CitationBox>` — but the `/sources-policy/` link text ("chính sách nguồn tham khảo") in the old `.source-section` paragraph is NOT reproduced by `CitationBox`. Decide: either drop that policy-link sentence (CitationBox doesn't have a slot for it), or note it's covered elsewhere (e.g., footer, editorial-policy page already links sources-policy).
**Why it happens:** `CitationBox` (Phase 3) was designed as a self-contained replacement, but the specific "see our sources policy" sentence wasn't part of its prop contract.
**How to avoid:** Planner should explicitly decide (likely Claude's discretion, low-stakes): drop the sentence (CitationBox is the new standard, sources-policy is still linked from `/editorial-policy/` and footer presumably) or accept the minor content loss as part of D-11's "replacing" intent. Also remove `.source-section` CSS rules (lines 262-267, 281-292, 318-319 in current `<style>`) once the markup is gone — but check if `.editorial-review` shares selectors with `.source-section` (it does, via comma-separated selectors at lines 260-267 and 288-292) and split them carefully so `.editorial-review` styling (which remains, per D-11 only addressing source-section/CitationBox/AuthorBox order) isn't broken.
**Warning signs:** Two "Nguồn tham khảo" headings on the page after the change, or `.editorial-review` box loses its border/background styling because a shared CSS rule was deleted wholesale.

### Pitfall 6: `.ymyl-note` vs `<Disclaimer />` consolidation (Claude's discretion)
**What goes wrong:** If `<Disclaimer />` is swapped in for `.ymyl-note`, its default text prop is `site.disclosure` (from `Disclaimer.astro`: `const { text = site.disclosure } = Astro.props`) — same source as the current `.ymyl-note`'s `{site.disclosure}`. Visual output should be near-identical (`Disclaimer.astro` uses the same box pattern: border-left 4px `var(--color-brand-900)`, `var(--surface)`, `var(--radius-md)`). However, `.ymyl-note`'s heading text is "Lưu ý trước khi đọc:" while `Disclaimer.astro`'s hardcoded heading is "Lưu ý quan trọng:" — these differ.
**Why it happens:** Phase 3 built `Disclaimer.astro` as a generic component without matching this specific copy.
**How to avoid:** If consolidating (per 04-CONTEXT.md's note that this is reasonable "if it doesn't change visible output"), be aware the heading text WILL change from "Lưu ý trước khi đọc:" to "Lưu ý quan trọng:" — this is a (minor) visible output change. Planner should flag this explicitly: either accept the copy change (likely fine, both are reasonable disclaimers) or pass a `text`/heading override prop to `<Disclaimer>` if one exists (checked: `Disclaimer.astro` only accepts a `text` prop, not a heading override — the `<strong>Lưu ý quan trọng:</strong>` is hardcoded). If exact copy preservation matters, either leave `.ymyl-note` as-is (skip this discretionary item) or add a heading prop to `Disclaimer.astro` (would be a Phase 3 component change — likely out of scope/avoid).

## Code Examples

### KeyTakeaways component usage (confirmed prop contract)
```typescript
// Source: src/components/KeyTakeaways.astro (read directly)
interface Props {
  items: string[];
}
// Renders null if items.length === 0
```

### CitationBox component usage (confirmed prop contract)
```typescript
// Source: src/components/CitationBox.astro (read directly)
interface Props {
  sources?: string[];
  citations?: { title: string; url?: string; publisher?: string; date?: string }[];
  factCheckedDate?: Date;
  updatedDate: Date;  // required
}
// Renders null if both sources and citations are empty.
// Per D-04/D-05: for the 21 articles, pass sources={entry.data.sources} updatedDate={updatedDate},
// leave citations and factCheckedDate undefined.
```

### Breadcrumb component usage (confirmed prop contract)
```typescript
// Source: src/components/Breadcrumb.astro (read directly)
interface Props {
  items: { label: string; href?: string }[];
}
// Renders <nav><ol><li>...; items without href render as aria-current="page" (last item convention)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `## Key takeaways` parsed from markdown body at render time (considered in Phase 3 research per STATE.md blocker) | `keyTakeaways: string[]` in frontmatter, read directly by `<KeyTakeaways items={entry.data.keyTakeaways} />` (D-03) | Decided in 02/03-CONTEXT.md and reaffirmed in 04-CONTEXT.md D-01-D-03 | No remark plugin or runtime markdown parsing needed — simpler, type-safe via Zod schema, already in `content.config.ts` |
| Inline `<nav class="breadcrumb">` + duplicated logic for `breadcrumbSchema` | Single `breadcrumbItems` array feeds both `<Breadcrumb>` component and (optionally) `breadcrumbSchema` | This phase (D-10) | Reduces duplication; `breadcrumbSchema` itself "is unaffected — separate, already-correct concern" per D-10, so reuse of the array for schema is optional cleanup, not required |
| `articleSchema.author` = minimal `{name, url: "/about/"}` | Full Person object from `authors.ts` (D-08) | This phase (ARTL-02) | Article JSON-LD now matches AuthorBox v2 display and Google's E-E-A-T signals for author Person markup |

**Deprecated/outdated:**
- Inline `.source-section` markup in `ArticleLayout.astro`: superseded by `<CitationBox>` (Phase 3), removal is part of D-11.
- Inline `<nav class="breadcrumb">` markup + its scoped CSS: superseded by `<Breadcrumb>` component (Phase 3), removal is part of D-10.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | gray-matter is the recommended/standard choice for this migration script (vs. a hand-rolled regex approach) | Standard Stack, Pattern 1 | Low — if the planner/user prefers zero new devDependencies, a hand-rolled approach is possible but MUST account for the colon-in-bullet YAML issue (Pitfall 1) via manual quoting logic; gray-matter is the lower-risk path |
| A2 | `js-yaml` (gray-matter's internal dependency) defaults to `lineWidth: 80` causing reformatting of unrelated long strings | Pitfall 2 | Medium — if this default has changed in gray-matter 4.0.3's bundled js-yaml version, the `{ lineWidth: -1 }` mitigation may be unnecessary (harmless either way) or insufficient (would need empirical verification by running on one file and diffing) |

## Open Questions

1. **Final decision on `.source-section`'s "xem chính sách nguồn tham khảo" sentence (Pitfall 5)**
   - What we know: `CitationBox` doesn't reproduce this link; D-11 says replace `.source-section` with `CitationBox`.
   - What's unclear: Whether dropping this specific sentence is acceptable, or whether it should be preserved elsewhere (e.g., as a small addition near CitationBox, or left to the editorial-policy page's existing links).
   - Recommendation: Treat as Claude's discretion (low-stakes); default to dropping it since `/sources-policy/` remains linked from editorial-policy/footer site-wide, and note the change in the plan's verification notes.

3. **`.ymyl-note` → `<Disclaimer />` heading copy difference (Pitfall 6)**
   - What we know: Heading text differs ("Lưu ý trước khi đọc:" vs "Lưu ý quan trọng:"); body text source (`site.disclosure`) is identical.
   - What's unclear: Whether 04-CONTEXT.md's "if it doesn't change visible output" condition is satisfied given this heading-text difference.
   - Recommendation: Planner should explicitly call out this discretionary item in the plan and let the implementer choose: (a) skip consolidation, keep `.ymyl-note` as-is, or (b) consolidate and accept the minor heading-copy change as within "doesn't change visible output" spirit (both are short, similar disclaimers).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Migration script execution, `npm run build` | ✓ | v25.9.0 (per CLAUDE.md) | — |
| npm | Installing `gray-matter` devDependency | ✓ | present (lockfile exists) | — |
| gray-matter | Migration script | not yet installed | 4.0.3 available on npm | Hand-rolled YAML-aware string ops (higher risk, see Pitfall 1) |
| Astro CLI (`astro check`, `astro build`) | Validating backfilled frontmatter against Zod schema | ✓ | 5.9.3 | — |

**Missing dependencies with no fallback:**
- None.

**Missing dependencies with fallback:**
- `gray-matter` — not yet installed; install via `npm install --save-dev gray-matter`. Fallback (hand-rolled YAML mutation) exists but is higher-risk per Pitfall 1.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — "no test framework, test files, or test config found" (per CONVENTIONS.md/CLAUDE.md tech stack summary) |
| Config file | none |
| Quick run command | `npm run build` (runs `astro check && astro build` — type-checks frontmatter against Zod schema, builds all pages) |
| Full suite command | `npm run build` (same — this is the only automated check in the repo) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ARTL-01 | Article pages render components in order Breadcrumb → KeyTakeaways → TOC → Content → CitationBox → AuthorBox → Share/Related | manual (visual) | `npm run dev` then visual check on `/co-phieu/co-phieu-la-gi/` (has TOC) and a non-TOC article | N/A — manual-only, no visual regression tooling in repo (QASE-01 is Phase 6) |
| ARTL-02 | JSON-LD `author` Person object on article pages matches `authors.ts` fields | smoke + manual | `npm run build` (type-checks JSON-LD object shape if typed) then manual: view page source, inspect `<script type="application/ld+json">`, optionally paste into Google Rich Results Test (QASE-03 is Phase 6, but a spot-check here is low-cost) | N/A |
| EEAT-06 | `/author/[slug]` page builds and renders author profile + article list | automated (build) + manual (visual) | `npm run build` (fails if `getStaticPaths`/page errors); manual: `npm run dev`, visit `/author/nguyen-viet-loc/` | N/A — page doesn't exist yet, created in this phase |
| EEAT-10 | All 21 articles have `keyTakeaways` frontmatter (non-empty array) and no duplicate "Key takeaways" content in body | automated (script self-check) + automated (build) | Migration script should `console.log` a summary (21/21 processed, bullet counts); `npm run build` validates Zod schema (`z.array(z.string())`) for all 21 files | ❌ Wave 0 — needs the migration script itself, plus optionally a tiny verification script (`grep -L "keyTakeaways:" src/content/articles/*.md` should return empty after backfill, and `grep -l "## Key takeaways" src/content/articles/*.md` should also return empty) |

### Sampling Rate
- **Per task commit:** `npm run build` (catches Zod schema violations, Astro type errors, broken JSON-LD object construction if typed)
- **Per wave merge:** `npm run build` + manual visual check of 2-3 representative articles (one with TOC, one without; the `benjamin-graham.md` colon-bullet article specifically)
- **Phase gate:** Full `npm run build` green + manual spot-check of `/author/nguyen-viet-loc/` + manual spot-check of JSON-LD via browser devtools on at least one article before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `scripts/backfill-key-takeaways.mjs` (or similar) — the migration script itself doesn't exist yet; this is effectively "Wave 0" for EEAT-10
- [ ] Verification one-liners (not a formal test file, but should be run and their output captured in the plan's verification step):
  - `grep -L "keyTakeaways" src/content/articles/*.md` → expect empty (all 21 have the key)
  - `grep -l "## Key takeaways" src/content/articles/*.md` → expect empty (all removed from body)
  - `npm run build` → expect success, 0 type errors
- Framework install: `npm install --save-dev gray-matter` — required before the migration script can run

## Security Domain

> This phase is content/layout wiring on a static site with no auth, no user input, no server-side data handling. ASVS categories largely non-applicable.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static site, no auth |
| V3 Session Management | no | Static site, no sessions |
| V4 Access Control | no | All pages public, statically generated |
| V5 Input Validation | yes (build-time only) | Zod schema in `content.config.ts` validates frontmatter shape (`keyTakeaways: z.array(z.string())`) — already exists, no change needed beyond ensuring the backfill produces schema-conformant data |
| V6 Cryptography | no | N/A |

### Known Threat Patterns for {stack}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| JSON-LD injection via unescaped user content | Tampering | N/A here — all JSON-LD source data (`author`, `entry.data.*`) comes from trusted repo-committed files (`authors.ts`, markdown frontmatter), not user input. `JSON.stringify()` (already used in `ArticleLayout.astro` for `articleSchema`) correctly escapes for `<script type="application/ld+json">` context. No change to this pattern needed. |
| Malformed YAML frontmatter causing build failure or silent data loss | Tampering (of build artifacts) | Mitigated by using `gray-matter` for the backfill (Pitfall 1/2) + `npm run build` (Zod validation) as the gate before committing the 21 modified files |

## Sources

### Primary (HIGH confidence)
- `src/layouts/ArticleLayout.astro` (direct file read) — exact current structure, line numbers, CSS blocks
- `src/data/authors.ts` (direct file read) — full author object shape, confirmed single-object (not array)
- `src/content.config.ts` (direct file read) — Zod schema confirms `keyTakeaways: z.array(z.string()).default([])`, `sources: z.array(z.string()).default([])`, `citations`/`factCheckedDate` optional with `.default([])`/`.optional()`
- `src/components/{KeyTakeaways,CitationBox,Breadcrumb,AuthorBox,Disclaimer,ArticleList}.astro` (direct file reads) — confirmed prop contracts, no drift from 03-CONTEXT.md
- `src/pages/[category]/[slug].astro`, `src/pages/[category].astro` (direct file reads) — confirmed `getStaticPaths()` + `getCollection`/`render` patterns for the new `/author/[slug]` page
- `src/pages/about.astro` (direct file read) — confirmed existing author-data-driven page pattern (sections, styling conventions) to model `/author/[slug]` after, while keeping it distinct per D-06
- All 21 article files in `src/content/articles/*.md` (grep) — confirmed `## Key takeaways` heading uniformity (21/21 exact match, no variants)
- `src/content/articles/benjamin-graham.md` (grep) — confirmed real instance of colon-in-bullet (Pitfall 1's concrete trigger case)
- `npm view gray-matter version time.created repository.url` — confirmed gray-matter 4.0.3, created 2014, github.com/jonschlinkert/gray-matter
- `astro.config.mjs` (direct file read) — confirmed no `/author/` collision in sitemap filter or redirects map; `/author/[slug]` is a clean new route, included in sitemap by default

### Secondary (MEDIUM confidence)
- None used — all findings derived from direct repo inspection and npm registry query.

### Tertiary (LOW confidence)
- A2 (js-yaml `lineWidth: 80` default behavior in gray-matter 4.0.3's bundled version) — based on general gray-matter/js-yaml knowledge, not verified against the exact bundled js-yaml version in this session. Low risk: mitigation (`lineWidth: -1`) is a no-op if the default has changed, and harmless either way.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — gray-matter version/age/repo confirmed via npm registry; it's a devDependency only, zero production risk
- Architecture: HIGH — all integration points read directly from source files, exact line numbers and prop contracts confirmed
- Pitfalls: HIGH — Pitfall 1 (colon-in-bullet) is not theoretical; a real instance exists in `benjamin-graham.md` and was found via grep in this session

**Research date:** 2026-06-12
**Valid until:** 2026-07-12 (30 days — stable Astro/static-site domain, no fast-moving dependencies; re-verify if `src/data/authors.ts` or Phase 3 component props change before this phase executes)
</content>
