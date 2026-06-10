<!-- refreshed: 2026-06-10 -->
# Architecture

**Analysis Date:** 2026-06-10

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│              Content Production Engine (offline)             │
├──────────────────┬──────────────────┬───────────────────────┤
│  Agents/Personas │  Workflows (slash │  Knowledge Base        │
│ `.antigravity/   │  commands)        │ `knowledge/`           │
│  agents/`        │ `.agents/         │  (brand, pipeline,     │
│                  │  workflows/`      │  staging content)      │
└──────────────────┴────────┬─────────┴───────────┬────────────┘
                             │                     │
                             ▼                     ▼
                  knowledge/4-content/2-drafts/*.md (staging)
                             │
                             ▼ (/approve, with Astro frontmatter)
┌─────────────────────────────────────────────────────────────┐
│                 src/content/articles/*.md                    │
│        (Astro content collection - "articles")               │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 Astro Pages (SSG routing)                     │
│   `src/pages/[category]/[slug].astro`                         │
│   `src/pages/dau-tu/[category]/[slug].astro`                  │
│   `src/pages/kien-thuc/[slug].astro` (legacy/redirects)       │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│        Layouts & Components                                   │
│  `src/layouts/{Base,Article}Layout.astro`                      │
│  `src/components/*.astro` (TOC, ArticleList, ShareBar, etc.)  │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│        Static Output → `dist/` (built by `astro build`)       │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Content collection schema | Defines/validates article frontmatter | `src/content.config.ts` |
| Site config & taxonomy | Categories, navigation, brand info, helpers (`getCategoryPath`) | `src/data/site.ts` |
| Base layout | HTML shell, SEO meta (astro-seo), global nav/footer | `src/layouts/BaseLayout.astro` |
| Article layout | Article-specific shell: TOC, AuthorBox, ShareBar, RelatedArticles, FAQ schema | `src/layouts/ArticleLayout.astro` |
| Category listing pages | Static-generate per-category article index pages | `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro` |
| Article detail pages | Static-generate per-article pages from content collection | `src/pages/[category]/[slug].astro`, `src/pages/dau-tu/[category]/[slug].astro` |
| Legacy `kien-thuc` routes | Backward-compatible article URLs (older slug scheme) | `src/pages/kien-thuc/[slug].astro` |
| Static policy pages | About, contact, editorial/corrections/sources policy | `src/pages/about.astro`, `src/pages/editorial-policy.astro`, etc. |
| Search page | Client-side search over articles | `src/pages/search.astro` |
| Content production agents | Personas defining tone/QA/research responsibilities | `.antigravity/agents/*.md` |
| Content production workflows | Slash-command pipelines (outline → draft → approve) | `.agents/workflows/*.md` |
| Knowledge base | Brand profile, anti-AI rules, glossary, keyword/topic clusters | `knowledge/1-brand/`, `knowledge/3-pipeline/`, `knowledge/4-content/` |
| GSD planning toolchain | Multi-agent dev workflow tooling (not site-specific) | `.agent/`, `.claude/`, `.codex/`, `.gemini/`, `.planning/` |

## Pattern Overview

**Overall:** Astro static-site generation (SSG) with file-based content collections, paired with a separate "headless" markdown content-production pipeline (agent prompts + knowledge base) that feeds finished articles into the Astro content directory.

**Key Characteristics:**
- Two distinct subsystems sharing one repo: (1) the Astro website (`src/`, `astro.config.mjs`, `dist/`), and (2) the SEO content engine (`.antigravity/`, `.agents/`, `knowledge/`) which is pure markdown/process docs, no runtime code.
- Content is data-driven: `src/data/site.ts` defines categories/navigation; `src/content/articles/*.md` (validated by `src/content.config.ts`) supplies pages. Pages are generated via `getStaticPaths()` + `getCollection("articles")`.
- Vietnamese-language site about value investing (ValueInvesting.com.vn). Two URL hierarchies for categories: `/dau-tu/{category}/{slug}/` (the "Đầu tư" group) and `/{category}/{slug}/` for non-Đầu tư groups (Phân tích, Reviews, Nhà đầu tư).
- Sitemap integration (`@astrojs/sitemap`) excludes legacy `kien-thuc` routes and old top-level category roots; `astro.config.mjs` defines explicit redirects from old flat category URLs (`/co-phieu/` etc.) to the new `/dau-tu/...` hierarchy.

## Layers

**Data/Content Layer:**
- Purpose: Source of truth for articles and taxonomy
- Location: `src/content/articles/*.md`, `src/content.config.ts`, `src/data/site.ts`
- Contains: Markdown articles with Zod-validated frontmatter; category/navigation/brand config objects
- Depends on: Nothing (leaf layer)
- Used by: Page layer (via `astro:content` `getCollection`/`render`)

**Routing/Page Layer:**
- Purpose: Static-generate URLs for categories and individual articles
- Location: `src/pages/**/*.astro`
- Contains: `getStaticPaths()` functions, page-level SEO/schema markup
- Depends on: Content layer, Layout layer, `src/data/site.ts`
- Used by: Astro build (produces `dist/`)

**Layout/Presentation Layer:**
- Purpose: Shared chrome (head/meta, header/nav, footer) and article-specific structure (TOC, related articles, FAQ JSON-LD)
- Location: `src/layouts/*.astro`, `src/components/*.astro`
- Contains: Astro components, astro-seo usage, schema.org JSON-LD blocks
- Depends on: `src/data/site.ts`, content entry props passed from pages
- Used by: Page layer

**Content Production Engine (separate subsystem):**
- Purpose: Produce new articles via AI agent workflows, ending with files placed in `src/content/articles/`
- Location: `.antigravity/agents/`, `.antigravity/skills/`, `.agents/workflows/`, `knowledge/`
- Contains: Markdown agent personas, slash-command workflow specs, brand/style/anti-AI rules, keyword & topic-cluster data, staging dirs (`knowledge/4-content/1-outlines`, `2-drafts`)
- Depends on: Nothing (no code dependency on Astro internals; output format must match `src/content.config.ts` schema)
- Used by: Human/agent-driven `/write`, `/outlining`, `/drafting`, `/approve` commands (see CLAUDE.md)

## Data Flow

### Primary Request Path (Article Page Build)

1. Astro build invokes `getStaticPaths()` in `src/pages/dau-tu/[category]/[slug].astro` (or `src/pages/[category]/[slug].astro`), which calls `getCollection("articles")`
2. Each entry's frontmatter is validated against the Zod schema in `src/content.config.ts`
3. `render(entry)` produces `Content` component and `headings` (for TOC)
4. Page passes `entry` and `headings` as props into `ArticleLayout.astro`
5. `ArticleLayout.astro` renders `BaseLayout.astro` (head/meta/nav/footer via astro-seo + `src/data/site.ts`), then TOC, `<Content />`, AuthorBox, ShareBar, RelatedArticles, and FAQ/Article JSON-LD schema blocks
6. Output written to `dist/dau-tu/{category}/{slug}/index.html`

### Category Listing Flow

1. `src/pages/dau-tu/[category].astro` (or `src/pages/[category].astro`) iterates `categories` from `src/data/site.ts` filtered by `group`
2. For each category, `getCollection("articles")` is filtered by `entry.data.category === category.slug` and sorted by `order`
3. `ArticleList.astro` renders the list; breadcrumb JSON-LD schema is built inline in the page

### Content Production Flow (offline, pre-build)

1. Keyword selected (`/keyword-plan`, `/cluster` using `knowledge/3-pipeline/keywords.csv` and `knowledge/4-content/topic-clusters.md`)
2. `/outlining [keyword]` → SEO Collector + Research agents produce `knowledge/4-content/1-outlines/[slug].md`
3. `/drafting [slug]` → draft + QA produce `knowledge/4-content/2-drafts/Draft-[slug].md`
4. `/approve` → finalizes into `src/content/articles/[slug].md` with required Astro frontmatter (title, description, category, publishDate, updatedDate, readingTime, featured, order, sources)
5. Staging files in `knowledge/4-content/` are deleted on finalize (per CLAUDE.md content flow)

**State Management:**
- No client-side app state/store. All state is build-time (Astro content collections) plus static markdown knowledge base files. `src/pages/search.astro` is the only page likely to involve client-side JS for interactivity (search index over articles).

## Key Abstractions

**Content Collection Entry (`articles`):**
- Purpose: Represents one published article with strict frontmatter contract
- Examples: `src/content/articles/*.md`, schema in `src/content.config.ts`
- Pattern: Zod-validated frontmatter; `category` field maps to `slug` in `src/data/site.ts` categories array; `faq` array drives FAQPage JSON-LD; `sources` array drives citation rendering

**Category Taxonomy Object:**
- Purpose: Single source of truth for category metadata, grouping (Đầu tư vs. Phân tích/Reviews/Nhà đầu tư), and URL paths
- Examples: `src/data/site.ts` (`categories`, `navigation`, `getCategoryPath`)
- Pattern: Pages filter this array by `group` to decide whether to use `/dau-tu/{slug}/` or `/{slug}/` routing

**Agent Persona / Workflow Markdown:**
- Purpose: Defines reusable AI agent behavior contracts (tone, QA gates, research scope) for content production
- Examples: `.antigravity/agents/*.md`, `.agents/workflows/*.md`, `.antigravity/skills/*/`
- Pattern: Pure markdown specs, no executable code; referenced by slash commands documented in root `CLAUDE.md`

## Entry Points

**Astro Dev/Build:**
- Location: `astro.config.mjs`, `package.json` scripts (`dev`, `build`, `preview`)
- Triggers: `npm run dev` / `npm run build`
- Responsibilities: Configures site URL, sitemap filtering, legacy URL redirects; `astro check && astro build` produces `dist/`

**Homepage:**
- Location: `src/pages/index.astro`
- Triggers: `/` route
- Responsibilities: Landing page, likely surfaces featured/categorized articles via `src/data/site.ts` and content collection

**Content Production Slash Commands:**
- Location: `.agents/workflows/*.md` (write, outlining, drafting, approve, optimize, revise, learn, image, link, cluster, keyword-plan, setup)
- Triggers: Invoked by AI coding agent per root `CLAUDE.md` table
- Responsibilities: Drive the staged content pipeline ending in `src/content/articles/`

## Architectural Constraints

- **Threading:** Not applicable — Astro SSG build is single-process, no runtime server logic beyond static generation (no API routes detected in `src/pages`).
- **Global state:** `src/data/site.ts` acts as a module-level config singleton imported across pages/layouts/components — any change to `categories`/`navigation` shape affects all pages that import it.
- **Circular imports:** None observed; dependency direction is strictly pages → layouts → components → data/content.
- **Routing duality:** Two parallel category URL schemes exist simultaneously (`/dau-tu/{category}/{slug}/` for "Đầu tư" group categories, `/{category}/{slug}/` for others, plus legacy `/kien-thuc/{slug}/`). New articles must have `category` values matching `src/data/site.ts` `categories[].slug`, and the page that statically generates them depends on which `group` that category belongs to — getting this wrong silently excludes the article from build output.
- **Content/code coupling:** The `src/content.config.ts` Zod schema is the binding contract for the separate content-production engine's `/approve` step (defined in root `CLAUDE.md`). Schema changes here must be mirrored in the workflow's "Astro frontmatter bắt buộc" spec.

## Anti-Patterns

### Duplicated category-page logic across two route trees

**What happens:** `src/pages/[category].astro` / `src/pages/[category]/[slug].astro` and `src/pages/dau-tu/[category].astro` / `src/pages/dau-tu/[category]/[slug].astro` contain near-identical `getStaticPaths`/render logic, differentiated only by filtering on `category.group`.
**Why it's wrong:** Any change to article rendering (e.g., new layout prop, new schema block) must be made in two places, risking drift.
**Do this instead:** When modifying article/category page logic, update both route trees together, or factor shared logic into a helper in `src/data/site.ts` or a shared `.astro` partial imported by both.

### Legacy `kien-thuc` route retained alongside new taxonomy

**What happens:** `src/pages/kien-thuc/[slug].astro` still exists and is excluded from the sitemap via `astro.config.mjs` filter, while `dist/kien-thuc/*` and `dist/phan-tich-ky-thuat/*` etc. show old build artifacts from prior URL schemes.
**Why it's wrong:** Increases routing surface area and risk of duplicate-content SEO issues if not properly redirected/canonicalized.
**Do this instead:** Treat `kien-thuc` routes as redirect-only/deprecated; new articles should only target the `categories` defined in `src/data/site.ts` with `/dau-tu/...` or root-level group paths.

## Error Handling

**Strategy:** Build-time validation only — Zod schema in `src/content.config.ts` throws at build if frontmatter is malformed; `astro check` (part of `npm run build`) performs TypeScript type checking.

**Patterns:**
- Frontmatter validation via `defineCollection` + `z.object(...)` schema (required fields, defaults for `featured`, `order`, `tags`, `faq`, `sources`)
- No runtime error boundaries needed (fully static output)

## Cross-Cutting Concerns

**Logging:** Not applicable (static site, no server runtime)
**Validation:** Astro content collection Zod schemas (`src/content.config.ts`); `astro check` for TS type safety
**Authentication:** Not applicable (public static content site)
**SEO:** `astro-seo` package used in layouts; JSON-LD structured data (BreadcrumbList, FAQPage/Article schema) built inline in pages/layouts; `@astrojs/sitemap` with custom `filter` in `astro.config.mjs`

---

*Architecture analysis: 2026-06-10*
