# External Integrations

**Analysis Date:** 2026-06-10

## APIs & External Services

No third-party API SDKs or HTTP API clients detected in `src/`. The site is a fully static Astro build with no runtime API calls.

## Data Storage

**Databases:**
- None. Content is file-based: Markdown articles in `src/content/articles/`, validated against the Zod schema in `src/content.config.ts` (Astro Content Collections).

**File Storage:**
- Local filesystem only - images in `public/images/` and `src/assets/` (e.g. `src/assets/hero-investing.png`)

**Caching:**
- None (static site, no cache layer)

## Authentication & Identity

**Auth Provider:**
- None - site has no user accounts, login, or auth-gated content

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, no error-tracking SDK)

**Logs:**
- None - static site has no server-side logging

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured in repo (no `vercel.json`, `netlify.toml`, or deploy config found). Output is static `dist/` from `astro build`, deployable to any static host.

**CI Pipeline:**
- None - no `.github/workflows/`, `.gitlab-ci.yml`, or other CI config found

## Environment Configuration

**Required env vars:**
- None detected - no `.env*` files present and no `import.meta.env` usage found in source

**Secrets location:**
- N/A - no secrets management present

## Search

- Client-side search implemented in `src/pages/search.astro`, which builds a search index in-page from `getCollection("articles")` (no external search service like Algolia).

## Sitemap & Robots

- `@astrojs/sitemap` integration in `astro.config.mjs` generates `sitemap-index.xml` at build time
- `public/robots.txt` references `https://valueinvesting.com.vn/sitemap-index.xml`

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Content Production Engine Integrations

The `.antigravity/` / `.agents/` content engine (agents, workflows, knowledge base under `knowledge/`) is a prompt/workflow system for Claude/agent tooling — it does not call external APIs directly from code. It references external research sources (SERP data, competitor sites) as part of its workflow process (`.agents/workflows/outlining.md`, etc.) but these are manual/agent-driven research steps, not coded API integrations.

---

*Integration audit: 2026-06-10*
