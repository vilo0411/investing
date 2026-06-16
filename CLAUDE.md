# CLAUDE.md — Value Investing

SEO content production engine cho dự án đầu tư cá nhân tại Việt Nam.

---

## ⚖️ Project Rules

All operations must strictly follow the rules defined in:

- [.antigravity/rules/workflow-integrity.md](.antigravity/rules/workflow-integrity.md)
- [.antigravity/rules/file-naming-standards.md](.antigravity/rules/file-naming-standards.md)
- [.antigravity/rules/content-anti-ai.md](.antigravity/rules/content-anti-ai.md)
- [.antigravity/rules/seo-formatting.md](.antigravity/rules/seo-formatting.md)
- [.antigravity/rules/learning-loop.md](.antigravity/rules/learning-loop.md)

---

## 🔄 Mandatory Context Protocol

> Mọi agent/skill phải load context sau **trước tiên** — không có exception:
> 1. `knowledge/1-brand/profile.md`
> 2. `knowledge/3-pipeline/anti-ai-rules.md`
> 3. `knowledge/3-pipeline/glossary.md`
> 4. `.antigravity/memory/instincts.md`
> 5. _(Agent-specific files theo từng agent's Context Loading block)_

## ✍️ Content Edit Rule

> **Bất kỳ khi nào được yêu cầu sửa / viết lại / chỉnh đoạn trong `knowledge/4-content/` hoặc `src/content/articles/`**, dù là slash command hay chat tự do, đều phải:
> 1. Đọc `knowledge/3-pipeline/anti-ai-rules.md` trước khi viết bất kỳ dòng nào
> 2. Đọc `.antigravity/memory/instincts.md` để tránh lặp lỗi cũ
> 3. Chạy Self-Audit Checklist trên bản sửa trước khi trình bày
>
> **Không có exception.**

---

## 🤖 Sub-Agent Architecture

| Sub-Agent | Instructions | Responsibility |
| :--- | :--- | :--- |
| **SEO Collector** | `.antigravity/agents/seo-collector.md` | SERP research + Content Brief |
| **Brand Guardian** | `.antigravity/agents/brand-guardian.md` | Brand audit & Style enforcement |
| **Quality Guardian** | `.antigravity/agents/quality-guardian.md` | Independent QA/QC |
| **Research Agent** | `.antigravity/agents/research-agent.md` | Build Knowledge Base |
| **Visual Architect** | `.antigravity/agents/visual-architect.md` | Image strategy & prompts |

---

## ⌨️ Slash Commands

| Command | Workflow File | Description |
| :--- | :--- | :--- |
| `/write [keyword]` | `.agents/workflows/write.md` | Full Pipeline — Outline → Draft → Finalize vào `src/content/articles/` |
| `/outlining [keyword]` | `.agents/workflows/outlining.md` | Phase 1 & 2 — Research SERP + Expert Outline |
| `/drafting [slug]` | `.agents/workflows/drafting.md` | Phase 3 — Chuyển Outline thành Draft + QA |
| `/approve` | `.agents/workflows/approve.md` | Phê duyệt stage hiện tại |
| `/revise [slug]` | `.agents/workflows/revise.md` | Sửa đoạn / section cụ thể |
| `/optimize [path]` | `.agents/workflows/optimize.md` | Re-optimize bài cũ với 7 Sweeps Framework |
| `/learn [slug?]` | `.agents/workflows/learn.md` | Tổng hợp feedback → cập nhật rules + instincts |
| `/image [slug]` | `.agents/workflows/image.md` | Tạo chiến lược hình ảnh |
| `/link` | `.agents/workflows/link.md` | Backfill internal links từ bài cũ sang bài mới |
| `/cluster` | `.agents/workflows/cluster.md` | Keyword Clustering từ `knowledge/3-pipeline/keywords.csv` |
| `/keyword-plan [N]` | `.agents/workflows/keyword-plan.md` | Chọn N bài nên viết tiếp từ cluster map |
| `/setup` | `.agents/workflows/setup.md` | Build Knowledge Base lần đầu (chạy 1 lần) |

---

## 📂 Workspace Structure

```text
.antigravity/           # [ENGINE] Logic, Agents, Skills, Memory
├── agents/             # Sub-agent personas
├── rules/              # Master rules
├── skills/             # Execution logic (outlining, drafting, QA, linking...)
└── memory/             # instincts.md, DECISIONS.md

knowledge/              # [BRAIN] Strategy & staging
├── 1-brand/            # Profile, personas, writers, ICP
├── 2-market/           # Market landscape, competitors
├── 3-pipeline/         # anti-ai-rules, glossary, keywords.csv, anchor-index
├── 4-content/          # Staging: 1-outlines → 2-drafts (xóa khi finalize)
└── raw/intel/          # Raw research dumps

src/content/articles/   # [OUTPUT] Bài finalized → Astro build
```

---

## 🔀 Content Flow (Astro-specific)

```
keyword
  → knowledge/4-content/1-outlines/[slug].md     (/outlining)
  → knowledge/4-content/2-drafts/Draft-[slug].md  (/drafting)
  → src/content/articles/[slug].md                (/approve — với Astro frontmatter)
```

**Astro frontmatter bắt buộc khi finalize:**

```yaml
---
title: ""
description: ""        # ~155 ký tự
category: ""           # slug category — phải khớp categories[] trong src/data/site.ts
publishDate: "YYYY-MM-DD"
updatedDate: "YYYY-MM-DD"
readingTime: "X phút đọc"
featured: false
order: 100
tags:
  - ""
faq:
  - question: ""
    answer: ""
sources:
  - ""
citations:
  - title: ""
    url: ""            # optional
    publisher: ""      # optional
    date: ""           # optional — YYYY-MM-DD
keyTakeaways:
  - ""                 # 3–5 ý chính, mỗi ý ≤ 20 từ
# factCheckedDate: "YYYY-MM-DD"  # chỉ thêm khi đã fact-check
---
```

**Category slugs hợp lệ** (theo `src/data/site.ts`):
- Nhóm `/dau-tu/...`: `co-phieu`, `etf`, `quy-dau-tu`, `trai-phieu`, `phai-sinh`
- Nhóm `/phan-tich/...`: `co-ban`, `ky-thuat`
- Nhóm gốc: `reviews`, `nha-dau-tu`

---

## Output bằng tiếng Việt, code comments bằng English

<!-- GSD:project-start source:PROJECT.md -->

## Project

**Value Investing — Redesign & EEAT Upgrade**

Value Investing là một website SEO tài chính tại Việt Nam, xây dựng trên Astro (static site), cung cấp nội dung giáo dục đầu tư bằng tiếng Việt theo phong cách Investopedia và NerdWallet. Milestone này tập trung làm lại toàn bộ design system và trải nghiệm đọc, đồng thời tăng cường tín hiệu E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) — yếu tố sống còn với nội dung YMYL (Your Money, Your Life).

**Core Value:** Người đọc và Google phải cảm nhận ngay đây là một nguồn tài chính **chuyên nghiệp, đáng tin cậy** — từ giao diện tổng thể đến từng bài viết, với thông tin tác giả, nguồn tham khảo và quy trình biên tập rõ ràng.

### Constraints

- **Tech stack**: Phải tiếp tục dùng Astro + content collections hiện có — không đổi sang framework khác
- **Content schema**: Schema Zod hiện tại (`src/content.config.ts`) cần được giữ tương thích hoặc mở rộng có kiểm soát (không phá build các bài viết hiện có)
- **Domain**: Nội dung tài chính Việt Nam — YMYL, cần thận trọng về tuyên bố/khuyến nghị (theo `.antigravity/rules/`)
- **Output ngôn ngữ**: Toàn bộ UI/nội dung tiếng Việt

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 5.8.3 - Astro components, config, content schema (`src/content.config.ts`, `src/data/site.ts`)
- Astro component syntax (`.astro` files) - Pages, layouts, components in `src/pages/`, `src/layouts/`, `src/components/`
- Markdown (`.md`) - Article content in `src/content/articles/` (Vietnamese investing content)
- CSS - Global styles in `src/styles/global.css`

## Runtime

- Node.js v25.9.0 (local dev environment; no `.nvmrc` or engines field present to pin a version)
- npm (lockfile `package-lock.json` present)

## Frameworks

- Astro 5.9.3 - Static site generator / framework, config in `astro.config.mjs`
- astro-seo 1.1.0 - SEO meta tag helper, likely used in `src/layouts/BaseLayout.astro`
- None detected - no test framework, test files, or test config found
- @astrojs/check 0.9.4 - Type checking via `astro check` (run as part of `npm run build`)
- @astrojs/sitemap 3.7.3 - Sitemap generation, configured in `astro.config.mjs`

## Key Dependencies

- `astro` 5.9.3 - Core framework powering routing, content collections, static build output to `dist/`
- `typescript` 5.8.3 - Strict mode via `astro/tsconfigs/strict` (extended in `tsconfig.json`)
- `@astrojs/sitemap` - Generates `sitemap-index.xml`, referenced in `public/robots.txt`
- `astro-seo` - Per-page SEO meta tags

## Configuration

- No `.env` files detected in repo - no runtime secrets/environment variables currently configured
- Site is fully static (no server-side env config needed at build time observed)
- `astro.config.mjs` - Site URL (`https://valueinvesting.com.vn`), sitemap integration, redirects map (old category URLs → `/dau-tu/...`)
- `tsconfig.json` - Extends `astro/tsconfigs/strict`, path alias `@/*` → `src/*`
- `src/content.config.ts` - Zod schema for the `articles` content collection (title, description, category, publishDate, updatedDate, readingTime, featured, order, tags, faq, sources)

## Platform Requirements

- Node.js (npm scripts use Astro CLI directly: `astro dev`, `astro check && astro build`, `astro preview`)
- `npm run dev` binds to `0.0.0.0` (accessible on local network)
- Static output build (`dist/` directory present, generated by `astro build`)
- Deployable to any static host / CDN supporting static files + sitemap/robots.txt (no server runtime dependencies detected)

## Content Production Engine (separate stack)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Astro components/layouts: PascalCase, `.astro` extension — `src/components/ArticleList.astro`, `src/layouts/BaseLayout.astro`
- Pages: lowercase, kebab-case, dynamic route params in brackets — `src/pages/[category]/[slug].astro`, `src/pages/dau-tu/[category]/[slug].astro`
- Data/utility modules: lowercase, `.ts` — `src/data/site.ts`, `src/content.config.ts`
- Content articles: kebab-case slugs in Vietnamese, descriptive of the topic question — `src/content/articles/etf-la-gi.md`, `roa-la-gi.md`, `warren-buffett.md`
- camelCase, descriptive verb-noun — `getCategoryPath`, `getArticlePath` (`src/data/site.ts`)
- camelCase for values/arrays — `categoryMeta`, `investCategories`, `phanTichCategories`
- Constants exported in camelCase even for config-like objects — `export const site = {...}`, `export const categories = [...]`
- PascalCase, derived via `typeof` from data arrays — `export type Category = (typeof categories)[number];` (`src/data/site.ts:113`)
- Astro Props interfaces named `Props` inside each component frontmatter — `interface Props { articles: CollectionEntry<"articles">[]; }` (`src/components/ArticleList.astro:5`)

## Code Style

- No Prettier/ESLint config present in repo. Formatting follows Astro defaults (2-space indentation, double quotes for strings, trailing commas in multiline objects/arrays).
- TypeScript strict mode enabled via `tsconfig.json` extending `astro/tsconfigs/strict`.
- No ESLint config detected. Type-checking enforced at build time via `astro check` (part of `npm run build`).
- `@/*` maps to `src/*` (`tsconfig.json`) — used as `import { site } from "@/data/site"`, `import ArticleLayout from "@/layouts/ArticleLayout.astro"`.

## Import Organization

## Astro Component Structure

## Dynamic Routes (`getStaticPaths`)

- Filter `categories` (from `src/data/site.ts`) to determine which articles belong on which route tree.
- Always pass the full `entry` as `props`, then `await render(entry)` to get `Content` and `headings`.

## Content Collections (Astro Content Layer)

- New articles MUST conform to this schema or `astro check`/build will fail.
- Articles live in `src/content/articles/*.md`, written in Vietnamese with sections: `## Key takeaways`, body sections (H2), `## FAQ` with `### Question` subsections matching `faq` frontmatter.

## Data/Config Module Pattern (`src/data/site.ts`)

- Single source of truth for site-wide config: `site` (brand info), `navigation`, `categories`, `categoryMeta` (lookup map keyed by category slug).
- Helper functions co-located with the data they operate on: `getCategoryPath(category)`, `getArticlePath(article)`.
- Lookup maps typed as `Record<string, {...}>` keyed by slug — follow this pattern for any new category-keyed metadata (e.g., `categoryMeta`).

## Error Handling

- Defensive fallback via nullish coalescing for missing lookups:
- No try/catch blocks observed — content is statically validated at build time via Zod schema (`src/content.config.ts`) and Astro's type checker (`astro check`).
- Filter arrays with `.filter((x): x is NonNullable<typeof x> => x !== null)` to type-narrow optional values (`src/layouts/BaseLayout.astro`).

## Logging

## Comments

- Section-divider comments in `.astro` frontmatter and templates to label structural blocks, e.g. `<!-- Organization + WebSite schema (all pages) -->`, `<!-- Google Fonts: DM Serif Display + DM Sans -->` (`src/layouts/BaseLayout.astro`).
- CSS sections commented by purpose, e.g. `/* Gradient thumbnails */` (`src/components/ArticleList.astro:66`).

## Function Design

## Module Design

## Styling Conventions

- All component-level styles live in scoped `<style>` blocks at the bottom of `.astro` files.
- Global design tokens (CSS custom properties) defined in `src/styles/global.css` and referenced via `var(--brand)`, `var(--surface)`, `var(--line)`, `var(--muted)`, `var(--radius-lg)`, `var(--transition)`, `var(--font-serif)`, etc.
- Responsive breakpoints via `@media (max-width: 900px)` and `@media (max-width: 580px)`, mobile-first reduction of grid columns (3 → 2 → 1).
- Category-specific color/gradient classes follow `thumb-{category-slug}` and `tag-{category-slug}` naming, defined per category in `categoryMeta` (`src/data/site.ts`) and styled in `ArticleList.astro`.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

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

- Two distinct subsystems sharing one repo: (1) the Astro website (`src/`, `astro.config.mjs`, `dist/`), and (2) the SEO content engine (`.antigravity/`, `.agents/`, `knowledge/`) which is pure markdown/process docs, no runtime code.
- Content is data-driven: `src/data/site.ts` defines categories/navigation; `src/content/articles/*.md` (validated by `src/content.config.ts`) supplies pages. Pages are generated via `getStaticPaths()` + `getCollection("articles")`.
- Vietnamese-language site about value investing (Value Investing). Two URL hierarchies for categories: `/dau-tu/{category}/{slug}/` (the "Đầu tư" group) and `/{category}/{slug}/` for non-Đầu tư groups (Phân tích, Reviews, Nhà đầu tư).
- Sitemap integration (`@astrojs/sitemap`) excludes legacy `kien-thuc` routes and old top-level category roots; `astro.config.mjs` defines explicit redirects from old flat category URLs (`/co-phieu/` etc.) to the new `/dau-tu/...` hierarchy.

## Layers

- Purpose: Source of truth for articles and taxonomy
- Location: `src/content/articles/*.md`, `src/content.config.ts`, `src/data/site.ts`
- Contains: Markdown articles with Zod-validated frontmatter; category/navigation/brand config objects
- Depends on: Nothing (leaf layer)
- Used by: Page layer (via `astro:content` `getCollection`/`render`)
- Purpose: Static-generate URLs for categories and individual articles
- Location: `src/pages/**/*.astro`
- Contains: `getStaticPaths()` functions, page-level SEO/schema markup
- Depends on: Content layer, Layout layer, `src/data/site.ts`
- Used by: Astro build (produces `dist/`)
- Purpose: Shared chrome (head/meta, header/nav, footer) and article-specific structure (TOC, related articles, FAQ JSON-LD)
- Location: `src/layouts/*.astro`, `src/components/*.astro`
- Contains: Astro components, astro-seo usage, schema.org JSON-LD blocks
- Depends on: `src/data/site.ts`, content entry props passed from pages
- Used by: Page layer
- Purpose: Produce new articles via AI agent workflows, ending with files placed in `src/content/articles/`
- Location: `.antigravity/agents/`, `.antigravity/skills/`, `.agents/workflows/`, `knowledge/`
- Contains: Markdown agent personas, slash-command workflow specs, brand/style/anti-AI rules, keyword & topic-cluster data, staging dirs (`knowledge/4-content/1-outlines`, `2-drafts`)
- Depends on: Nothing (no code dependency on Astro internals; output format must match `src/content.config.ts` schema)
- Used by: Human/agent-driven `/write`, `/outlining`, `/drafting`, `/approve` commands (see CLAUDE.md)

## Data Flow

### Primary Request Path (Article Page Build)

### Category Listing Flow

### Content Production Flow (offline, pre-build)

- No client-side app state/store. All state is build-time (Astro content collections) plus static markdown knowledge base files. `src/pages/search.astro` is the only page likely to involve client-side JS for interactivity (search index over articles).

## Key Abstractions

- Purpose: Represents one published article with strict frontmatter contract
- Examples: `src/content/articles/*.md`, schema in `src/content.config.ts`
- Pattern: Zod-validated frontmatter; `category` field maps to `slug` in `src/data/site.ts` categories array; `faq` array drives FAQPage JSON-LD; `sources` array drives citation rendering
- Purpose: Single source of truth for category metadata, grouping (Đầu tư vs. Phân tích/Reviews/Nhà đầu tư), and URL paths
- Examples: `src/data/site.ts` (`categories`, `navigation`, `getCategoryPath`)
- Pattern: Pages filter this array by `group` to decide whether to use `/dau-tu/{slug}/` or `/{slug}/` routing
- Purpose: Defines reusable AI agent behavior contracts (tone, QA gates, research scope) for content production
- Examples: `.antigravity/agents/*.md`, `.agents/workflows/*.md`, `.antigravity/skills/*/`
- Pattern: Pure markdown specs, no executable code; referenced by slash commands documented in root `CLAUDE.md`

## Entry Points

- Location: `astro.config.mjs`, `package.json` scripts (`dev`, `build`, `preview`)
- Triggers: `npm run dev` / `npm run build`
- Responsibilities: Configures site URL, sitemap filtering, legacy URL redirects; `astro check && astro build` produces `dist/`
- Location: `src/pages/index.astro`
- Triggers: `/` route
- Responsibilities: Landing page, likely surfaces featured/categorized articles via `src/data/site.ts` and content collection
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

### Legacy `kien-thuc` route retained alongside new taxonomy

## Error Handling

- Frontmatter validation via `defineCollection` + `z.object(...)` schema (required fields, defaults for `featured`, `order`, `tags`, `faq`, `sources`)
- No runtime error boundaries needed (fully static output)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| design-taste-frontend | Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check. | `.agents/skills/design-taste-frontend/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
