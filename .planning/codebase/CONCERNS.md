# Codebase Concerns

**Analysis Date:** 2026-06-10

## Tech Debt

**Untyped content entry prop:**
- Issue: `entry: any` in props interface defeats Astro content collection type safety
- Files: `src/layouts/ArticleLayout.astro:10`
- Impact: No compile-time checking on `entry.data` fields used throughout the layout (title, description, sources, category, etc.); typos or schema changes won't be caught by `astro check`
- Fix approach: Use `CollectionEntry<"articles">` type from `astro:content` instead of `any`

**Single shared OG image for all articles:**
- Issue: Every article uses the same Open Graph image regardless of topic
- Files: `src/layouts/ArticleLayout.astro:24` (`/images/hero-investing.png` hardcoded)
- Impact: Social shares for all 21 articles look identical; weakens CTR from social/Zalo shares; the Visual Architect agent (`.antigravity/agents/visual-architect.md`) exists but its output isn't wired into per-article OG images
- Fix approach: Add an `ogImage` field to `src/content.config.ts` schema, generate per-article images via the image workflow, fall back to the shared hero if absent

**Massive multi-tool agent/skill duplication at repo root:**
- Issue: Nearly identical GSD skill/workflow trees duplicated across `.agent/`, `.claude/`, `.codex/`, `.gemini/`, `.agents/` (each ~70+ skill directories)
- Files: `.agent/`, `.claude/`, `.codex/`, `.gemini/`, `.agents/` (all currently untracked per git status)
- Impact: Massive repo bloat, drift risk if one copy is edited and others aren't, confusing for new contributors, slows down any full-repo search/grep
- Fix approach: Consolidate to a single source of directory (e.g. `.agent/`) and symlink or generate the others, or `.gitignore` the redundant tool-specific copies if they're vendored/generated

**Large monolithic page files:**
- Issue: Several pages mix data-fetching, layout, and large inline `<style>` blocks in single files
- Files: `src/pages/index.astro` (686 lines), `src/pages/about.astro` (421 lines), `src/layouts/ArticleLayout.astro` (353 lines), `src/pages/search.astro` (261 lines), `src/pages/dau-tu/[category].astro` (247 lines)
- Impact: Hard to maintain styling consistency; risk of duplicated CSS across pages (no shared design tokens visible at a glance)
- Fix approach: Extract shared section/card components into `src/components/`, move repeated styles into `src/styles/` shared stylesheets

**Empty `knowledge/4-content/` staging directories:**
- Issue: Per `CLAUDE.md`, content flows through `knowledge/4-content/1-outlines/` → `2-drafts/` → `src/content/articles/`, but `knowledge/4-content/` is essentially empty (4.0K)
- Files: `knowledge/4-content/`
- Impact: Not itself a bug, but indicates either all 21 articles were finalized and staging cleaned (expected per workflow) or the staging convention isn't being followed/tracked — worth confirming the `/approve` workflow actually cleans up vs. content being authored directly
- Fix approach: No action needed if this is the expected post-finalize state; verify during next `/write` run

## Known Bugs

**No bugs identified through static analysis.** `astro check` is wired into the build script (`"build": "astro check && astro build"`), so type errors would fail CI/build. No `console.log`/`debugger` statements found in `src/`. No empty `href="#"` placeholder links found.

## Security Considerations

**No `.env` files present:**
- Risk: None currently — confirms no secrets are committed
- Files: N/A
- Current mitigation: No environment-based config detected; site appears fully static (Astro content collections, no API calls)
- Recommendations: If future phases add external APIs (analytics, forms, search backend), ensure secrets go through `.env` (already in `.gitignore`) and never get committed

## Performance Bottlenecks

**Client-side search with no index pre-build:**
- Problem: `src/pages/search.astro` builds a full `searchIndex` array (title, description, tags, full lowercase text blob) for all articles at build time and presumably ships it to the client for filtering
- Files: `src/pages/search.astro:1-37`
- Cause: As article count grows (currently 21), the inline JSON payload sent to the browser grows linearly with no pagination or lazy-loading
- Improvement path: Fine at current scale (21 articles); revisit if article count exceeds ~200 — consider a lightweight client-side search lib with chunked index or a hosted search service

## Fragile Areas

**`categoryMeta` fallback pattern duplicated:**
- Files: `src/pages/search.astro:11-15`, likely repeated in `src/components/ArticleList.astro` and `src/pages/[category].astro`
- Why fragile: Each consumer independently constructs a fallback `{ label: article.data.category, abbr: "?", gradientClass: "thumb-stocks" }` when a category isn't in `categoryMeta`. If `categoryMeta` in `src/data/site.ts` (139 lines) is missing an entry for a new category, multiple places silently degrade rather than failing loudly
- Safe modification: When adding a new article category, always add a corresponding entry to `categoryMeta`/`categories` in `src/data/site.ts` first; consider a shared helper function `resolveCategoryMeta()` exported from `src/data/site.ts` to centralize the fallback
- Test coverage: No test suite exists in the repo (no `*.test.*`/`*.spec.*` files, no test runner in `package.json`)

**Astro frontmatter contract enforced only by Zod schema, not by content workflow tooling directly:**
- Files: `src/content.config.ts`, `.antigravity/skills/seo-drafting`, `/approve` workflow
- Why fragile: The `/approve` workflow (`.agents/workflows/approve.md`) is responsible for writing correct Astro frontmatter (title, description ~155 chars, category slug, dates, sources, etc.) per `CLAUDE.md`, but the only safety net is the Zod schema in `src/content.config.ts` which does not validate description length or that `category` matches a known slug in `src/data/site.ts`
- Safe modification: Add a Zod `.refine()` on `description` length (~155 chars) and validate `category` against the known category slug enum from `src/data/site.ts` to catch drift between content and category definitions at build time

## Scaling Limits

**Category/group structure hardcoded in `src/data/site.ts`:**
- Current capacity: 139 lines covering current category taxonomy (kien-thuc, dau-tu/*, nha-dau-tu, phan-tich, reviews, etc.)
- Limit: Adding new top-level groups or categories requires manual edits across `src/data/site.ts`, route files like `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro`, and `src/pages/dau-tu.astro` — no single source of truth driving route generation
- Scaling path: Consider deriving route generation (`getStaticPaths`) purely from `categories` config in `src/data/site.ts` so adding a category doesn't require touching multiple page files

## Dependencies at Risk

**Minimal, modern dependency set — low risk:**
- `astro@^5.9.3`, `@astrojs/check@^0.9.4`, `@astrojs/sitemap@^3.7.3`, `astro-seo@^1.1.0`, `typescript@^5.8.3`
- Risk: `astro-seo@^1.1.0` is a smaller community package (vs. Astro's built-in SEO patterns); if unmaintained, could lag behind Astro 5 changes
- Impact: SEO meta tag generation across all pages depends on this package
- Migration plan: If issues arise, replace with hand-rolled `<head>` meta tag component using Astro's native APIs — low effort given current scale

## Missing Critical Features

**No automated tests:**
- Problem: No test runner configured in `package.json`, no `*.test.*`/`*.spec.*` files anywhere in `src/`
- Blocks: Cannot verify content schema changes, route generation logic, or component rendering without manual `astro dev`/`astro build` checks
- Priority: Low for a content site at this scale, but `astro check` in the build script is the only safety net — consider adding basic build-output assertions (e.g., verify all 21 articles produce expected routes) as the article count grows

**No `robots.txt` validation against sitemap:**
- Files: `public/robots.txt`, sitemap generated via `@astrojs/sitemap`
- Problem: Not verified whether `robots.txt` correctly references the generated sitemap URL or blocks staging/dist paths
- Blocks: SEO crawl efficiency
- Priority: Low — quick manual check recommended before next deploy

## Test Coverage Gaps

**Entire `src/` has zero test coverage:**
- What's not tested: Route generation (`getStaticPaths` in `[category].astro`, `dau-tu/[category].astro`), category metadata resolution, search index generation, FAQ schema output, article schema (`articleSchema` in `ArticleLayout.astro`)
- Files: All of `src/pages/`, `src/components/`, `src/layouts/`, `src/data/site.ts`
- Risk: A bad edit to `src/data/site.ts` (e.g., removing a category) could silently break route generation for that category's articles, only surfacing as a 404 in production or a build failure caught by `astro check` (type-level only, not logic-level)
- Priority: Medium — recommend adding a simple build-time smoke test script that asserts every article in `src/content/articles/` has a matching category in `categoryMeta` and resolves to a valid route

---

*Concerns audit: 2026-06-10*
