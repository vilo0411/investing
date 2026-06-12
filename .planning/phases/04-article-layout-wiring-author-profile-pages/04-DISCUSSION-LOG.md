# Phase 4: Article Layout Wiring & Author Profile Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-12
**Phase:** 4-Article Layout Wiring & Author Profile Pages
**Areas discussed:** Key Takeaways extraction (EEAT-10), Citations backfill (EEAT-10), /author/[slug] page content, Article layout reflow with new component order

---

## Key Takeaways extraction (EEAT-10)

| Option | Description | Selected |
|--------|-------------|----------|
| Backfill frontmatter | Copy bullets from '## Key takeaways' section into `keyTakeaways:` frontmatter for each of 21 articles, strip section from body | ✓ |
| Remark plugin extraction | Build-time remark plugin extracts section into `keyTakeaways` without frontmatter edits | |
| You decide | Claude picks during planning | |

**User's choice:** Backfill frontmatter (Recommended)
**Notes:** Simpler, no new build tooling, matches Phase 2 schema design intent.

| Option | Description | Selected |
|--------|-------------|----------|
| Remove the section | Delete '## Key takeaways' from body once copied to frontmatter, avoiding duplicate display | ✓ |
| Keep both | Leave section in body as well as new frontmatter field | |

**User's choice:** Remove the section (Recommended)
**Notes:** Bullets preserved verbatim, just relocated — not a content rewrite per PROJECT.md.

---

## Citations backfill (EEAT-10)

| Option | Description | Selected |
|--------|-------------|----------|
| Wire `sources` directly | Pass `entry.data.sources` into CitationBox's existing fallback rendering (D-04 from Phase 3) — no per-article backfill | ✓ |
| Parse into structured `citations` | Split each sources string into `{title, publisher}` and populate `citations:` frontmatter for all 21 articles | |

**User's choice:** Wire `sources` directly (Recommended)
**Notes:** Avoids inventing structure (publisher/url/date) not present in original strings.

| Option | Description | Selected |
|--------|-------------|----------|
| Leave empty / updatedDate fallback | Don't backfill `factCheckedDate` — CitationBox falls back to "Cập nhật lần cuối: {updatedDate}" | ✓ |
| Set factCheckedDate = updatedDate | Populate `factCheckedDate` for all 21 articles to show "Kiểm tra nguồn lần cuối" | |

**User's choice:** Leave empty / use updatedDate fallback (Recommended)
**Notes:** No actual fact-check pass has occurred — fallback wording is accurate.

---

## /author/[slug] page content

| Option | Description | Selected |
|--------|-------------|----------|
| Full credibility profile | Comprehensive E-E-A-T profile (bio, role, experience, expertise, credentials, education, moneyPerspective, socialLinks, publishedIn, article list); /about/ stays the brand/site-story page | ✓ |
| Near-duplicate of About | Mirrors About page content closely under /author/{slug} URL | |
| You decide | Claude designs content split during planning | |

**User's choice:** Full credibility profile (Recommended)
**Notes:** Distinct purpose from /about/ — "who wrote this and why trust them" vs "what is this site".

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, list articles | Show grid/list of published articles (reuse ArticleList.astro pattern) — strong EEAT signal | ✓ |
| No, bio-only page | Just the credibility profile, no article list | |

**User's choice:** Yes, list articles (Recommended)
**Notes:** Single author currently, so list = all 21 articles; gives the page substantive content beyond bio.

---

## Article layout reflow with new component order

| Option | Description | Selected |
|--------|-------------|----------|
| Inside article-content, above body | KeyTakeaways renders as first child inside `.article-content`, above `<slot />`, within existing 2-column grid | ✓ |
| Full-width above the grid | KeyTakeaways spans both columns between header and `.article-body` grid | |

**User's choice:** Inside article-content, above body (Recommended)
**Notes:** Minimal layout change, works with existing mobile collapse behavior.

| Option | Description | Selected |
|--------|-------------|----------|
| Replace with Breadcrumb component | Remove inline `<nav class="breadcrumb">` + CSS, build same `items` array, pass to `<Breadcrumb items={items}/>`; breadcrumbSchema JSON-LD unaffected | ✓ |
| Keep inline breadcrumb as-is | Leave existing inline nav untouched | |

**User's choice:** Replace with Breadcrumb component (Recommended)
**Notes:** Keeps article header visually identical, sourced from shared Phase 3 component.

| Option | Description | Selected |
|--------|-------------|----------|
| Full Person object | Expand `articleSchema.author` to `{@type: Person, name, url: /author/{slug}, jobTitle, description, knowsAbout, sameAs}` from authors.ts | ✓ |
| Minimal update | Just change `url` to /author/{slug} and add `jobTitle` | |

**User's choice:** Full Person object (Recommended)
**Notes:** Matches AuthorBox v2 display, strong EEAT signal, no new fields invented beyond authors.ts.

---

## Claude's Discretion

- Exact script/method for 21-article frontmatter backfill (manual vs Node script)
- `/author/[slug]` page markup/styling (follow established box patterns)
- `getStaticPaths()` implementation detail for single-author route (array-friendly naming)
- Whether to consolidate `.ymyl-note` with the Phase 3 `<Disclaimer />` component

## Deferred Ideas

None — discussion stayed within phase scope.
