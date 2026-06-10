# Codebase Structure

**Analysis Date:** 2026-06-10

## Directory Layout

```
investing/
├── astro.config.mjs       # Astro config: site URL, sitemap filter, redirects
├── tsconfig.json           # Extends astro/tsconfigs/strict, "@/*" -> "src/*"
├── package.json            # Astro 5, astro-seo, @astrojs/sitemap, TypeScript
├── CLAUDE.md                # Project rules + content engine workflow map
├── src/
│   ├── content.config.ts   # Zod schema for "articles" content collection
│   ├── content/articles/   # OUTPUT: finalized Vietnamese SEO articles (.md)
│   ├── data/site.ts         # Categories, navigation, brand config, helpers
│   ├── layouts/             # BaseLayout.astro, ArticleLayout.astro
│   ├── components/          # ArticleList, AuthorBox, RelatedArticles, ShareBar, TOC
│   ├── pages/                # Astro file-based routes (see below)
│   ├── styles/global.css    # Global stylesheet
│   └── assets/               # Images used in components/pages (e.g. hero-investing.png)
├── public/images/           # Static public assets (served as-is)
├── dist/                     # Build output (generated, do not edit)
├── knowledge/                # BRAIN: content strategy, brand profile, pipeline data
│   ├── 1-brand/profile.md
│   ├── 3-pipeline/{anti-ai-rules.md, glossary.md, anchor-index.md, keywords.csv}
│   └── 4-content/
│       ├── topic-clusters.md
│       ├── 1-outlines/      # Staging: outline drafts (deleted after finalize)
│       └── 2-drafts/         # Staging: full drafts (deleted after finalize)
├── .antigravity/             # ENGINE: agents, rules, skills, memory for content production
│   ├── agents/                # Persona specs (seo-collector, brand-guardian, etc.)
│   ├── rules/                 # workflow-integrity, file-naming, anti-ai, seo-formatting, learning-loop
│   ├── skills/                 # seo-outlining, seo-drafting, qa-qc, internal-linking, seo-image, web-serp
│   ├── memory/                 # instincts.md, DECISIONS.md
│   └── config/, hooks/, internal-templates/
├── .agents/workflows/         # Slash command specs (write, outlining, drafting, approve, etc.)
├── .agents/skills/             # design-taste-frontend (frontend skill)
├── .planning/codebase/         # GSD-generated codebase maps (this directory)
└── .agent/, .claude/, .codex/, .gemini/   # GSD multi-agent dev tooling (not site-specific)
```

## Directory Purposes

**`src/pages/`:**
- Purpose: File-based routing for the Astro site
- Contains:
  - `index.astro` — homepage
  - `[category].astro`, `[category]/[slug].astro` — listing/detail pages for non-"Đầu tư" group categories (Phân tích, Reviews, Nhà đầu tư)
  - `dau-tu.astro`, `dau-tu/[category].astro`, `dau-tu/[category]/[slug].astro` — listing/detail pages for "Đầu tư" group categories (co-phieu, etf, quy-dau-tu, trai-phieu, phai-sinh)
  - `kien-thuc/[slug].astro` — legacy article route, excluded from sitemap
  - `search.astro` — search page
  - `about.astro`, `contact.astro`, `editorial-policy.astro`, `corrections-policy.astro`, `sources-policy.astro` — static policy pages
- Key files: `[category]/[slug].astro` and `dau-tu/[category]/[slug].astro` are the canonical article-rendering routes

**`src/content/articles/`:**
- Purpose: Finalized published articles (Astro content collection `articles`)
- Contains: One `.md` file per article, slug = filename (without extension)
- Key files: Each must satisfy schema in `src/content.config.ts` (title, description, category, publishDate, updatedDate, readingTime, featured, order, tags, faq, sources)

**`src/data/site.ts`:**
- Purpose: Central config — site metadata, navigation, category taxonomy (with `group`/`groupPath`/`path`), helper `getCategoryPath`
- Used by: nearly every page and layout

**`src/layouts/`:**
- Purpose: Shared page shells
- `BaseLayout.astro`: HTML head, SEO meta (astro-seo), header/nav, footer
- `ArticleLayout.astro`: wraps BaseLayout + adds TOC, AuthorBox, ShareBar, RelatedArticles, FAQ/Article JSON-LD

**`src/components/`:**
- Purpose: Reusable Astro components for article/listing pages
- `ArticleList.astro` (category listing cards), `TOC.astro` (table of contents from headings), `AuthorBox.astro`, `ShareBar.astro`, `RelatedArticles.astro`

**`knowledge/`:**
- Purpose: "Brain" — strategy, brand voice, anti-AI writing rules, glossary, keyword/cluster planning, and staging area for in-progress content
- `1-brand/profile.md`: brand voice/persona reference (mandatory context load per CLAUDE.md)
- `3-pipeline/`: anti-ai-rules.md, glossary.md, anchor-index.md (internal linking targets), keywords.csv
- `4-content/1-outlines/` and `2-drafts/`: transient staging dirs, emptied once an article is finalized into `src/content/articles/`

**`.antigravity/` and `.agents/`:**
- Purpose: "Engine" for the SEO content production pipeline — pure markdown agent personas, rules, and slash-command workflow definitions
- `.antigravity/agents/*.md`: persona contracts (SEO Collector, Brand Guardian, Quality Guardian, Research Agent, Visual Architect)
- `.antigravity/rules/*.md`: workflow-integrity, file-naming-standards, content-anti-ai, seo-formatting, learning-loop
- `.antigravity/memory/instincts.md`: accumulated learnings/avoid-repeat-mistakes log
- `.agents/workflows/*.md`: one file per slash command (`/write`, `/outlining`, `/drafting`, `/approve`, `/revise`, `/optimize`, `/learn`, `/image`, `/link`, `/cluster`, `/keyword-plan`, `/setup`)

**`.agent/`, `.claude/`, `.codex/`, `.gemini/`:**
- Purpose: GSD (Get Stuff Done) multi-agent development tooling — generic, not specific to this site's content domain
- Generated/managed: yes; treat as infrastructure, not project content

**`dist/`:**
- Purpose: Astro build output
- Generated: Yes (via `astro build`)
- Committed: Appears present in working tree but should generally be treated as build artifact (verify `.gitignore`)

## Key File Locations

**Entry Points:**
- `src/pages/index.astro`: Homepage
- `astro.config.mjs`: Site config, redirects, sitemap rules

**Configuration:**
- `src/content.config.ts`: Article frontmatter schema (Zod)
- `src/data/site.ts`: Categories, navigation, brand info
- `tsconfig.json`: Path alias `@/*` → `src/*`
- `CLAUDE.md`: Project rules, mandatory context protocol, slash command map

**Core Logic:**
- `src/pages/dau-tu/[category]/[slug].astro` and `src/pages/[category]/[slug].astro`: article page generation
- `src/pages/dau-tu/[category].astro` and `src/pages/[category].astro`: category listing generation
- `src/layouts/ArticleLayout.astro`: article rendering shell + structured data

**Testing:**
- Not detected — no test framework, test files, or test scripts in `package.json`

## Naming Conventions

**Files:**
- Articles: `kebab-case.md`, slug = filename, Vietnamese-language slugs (e.g., `pe-la-gi.md`, `co-tuc-la-gi.md`)
- Astro components/layouts: `PascalCase.astro` (e.g., `ArticleLayout.astro`, `RelatedArticles.astro`)
- Dynamic route segments: `[param].astro` / `[param]/[param].astro` Astro convention
- Workflow/agent docs: `kebab-case.md` (e.g., `seo-collector.md`, `keyword-plan.md`)

**Directories:**
- Vietnamese category slugs used as directory/route segments: `co-phieu`, `etf`, `quy-dau-tu`, `trai-phieu`, `phai-sinh`, `nha-dau-tu`, `phan-tich`, `reviews`, `dau-tu`
- Numbered staging pipeline dirs: `1-outlines/`, `2-drafts/` under `knowledge/4-content/`
- Numbered knowledge categories: `1-brand/`, `3-pipeline/`, `4-content/` under `knowledge/`

## Where to Add New Code

**New Article (content):**
- Do not hand-write directly into `src/content/articles/` unless following CLAUDE.md content edit rule (must read `knowledge/3-pipeline/anti-ai-rules.md` and `.antigravity/memory/instincts.md` first)
- Must include all required frontmatter fields per `src/content.config.ts`
- `category` value must match an existing `slug` in `src/data/site.ts` `categories` array; verify which `group` it belongs to to know which route tree (`/dau-tu/...` vs root) will render it

**New Category:**
- Add entry to `categories` array in `src/data/site.ts` (with `slug`, `group`, `groupPath`, `path`, `title`, `description`)
- If `group === "Đầu tư"`, it's picked up by `src/pages/dau-tu/[category].astro` and `src/pages/dau-tu/[category]/[slug].astro`
- Otherwise picked up by `src/pages/[category].astro` and `src/pages/[category]/[slug].astro`

**New Component:**
- Place in `src/components/`, `PascalCase.astro`, import via `@/components/Name.astro` (path alias)

**New Static Page:**
- Add `.astro` file directly under `src/pages/`, wrap content in `BaseLayout.astro`

**New Slash Command/Workflow (content engine):**
- Add workflow spec to `.agents/workflows/`, register in the table in root `CLAUDE.md`
- If it needs a new agent persona, add to `.antigravity/agents/`

## Special Directories

**`dist/`:**
- Purpose: Astro static build output
- Generated: Yes
- Committed: Unclear — verify `.gitignore`; should typically be excluded

**`knowledge/4-content/1-outlines/` and `2-drafts/`:**
- Purpose: Transient staging for in-progress articles
- Generated: Yes (by `/outlining`, `/drafting` workflows)
- Committed: Files deleted upon `/approve` finalize per content flow in CLAUDE.md

**`.astro/`:**
- Purpose: Astro internal cache/types (`.astro/collections`)
- Generated: Yes
- Committed: No (typically gitignored)

**`.agent/`, `.claude/`, `.codex/`, `.gemini/`:**
- Purpose: Parallel copies of GSD tooling for different AI coding assistants
- Generated: Likely scaffolded/synced
- Committed: Currently untracked per git status (`??`)

---

*Structure analysis: 2026-06-10*
