# Feature Research

**Domain:** Vietnamese personal-finance SEO/educational website (YMYL), redesign of Homepage / Category / Article / About / Editorial Policy modeled on Investopedia & NerdWallet
**Researched:** 2026-06-10
**Confidence:** HIGH (patterns are stable, widely-documented across major finance publishers; verified against current NerdWallet editorial guidelines and general E-E-A-T/YMYL guidance)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users (and Google's quality raters) assume exist on a YMYL finance site. Missing these makes the site feel amateurish or untrustworthy — directly hurting both conversion and rankings.

#### Article / Content Pages

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Key Takeaways box | Investopedia/NerdWallet open nearly every article with a 3-5 bullet "tóm tắt" box. Signals scannability + helps Google extract featured snippets / AI Overview content | LOW | Already planned. Place directly under H1/intro, before first body section. Style as a visually distinct callout (bordered box, icon, "Những điểm chính" heading) |
| Table of Contents (sticky/jump-links) | Long-form educational content (1500-3000+ words) is standard for finance education; readers expect to jump to relevant section | LOW | Already exists (`TOC.astro`) — redesign for sticky sidebar on desktop, collapsible on mobile |
| Author byline + credentials | E-E-A-T core signal. Must show name, title/role, and 1-line credential ("Chuyên gia phân tích tài chính, X năm kinh nghiệm") directly under title, not just at bottom | LOW-MEDIUM | Exists as AuthorBox at bottom — should ALSO appear at top (compact byline) near publish date |
| Published date + "Last updated" date | Finance content (rates, regulations, market data) goes stale fast. Google explicitly checks freshness for YMYL. Already in schema (`publishDate`, `updatedDate`) | LOW | Must be visually prominent, not buried — display both dates near top of article |
| Reviewed-by / fact-checked block | NerdWallet/Investopedia show "Reviewed by [Name], [credential]" separate from the writer, especially for technical/regulatory topics | MEDIUM | Requires new field in content schema (reviewer name, credential, review date) — extend Zod schema carefully (optional field, backward compatible) |
| Sources / citations list | Already have `sources` field in schema and a sources-policy page. Must render as a visible, numbered "Nguồn tham khảo" section at end of article, ideally with inline citation markers | MEDIUM | Inline citation markers `[1]`, `[2]` linking to footnote-style source list require either manual markup convention or a citation component — start with end-of-article source list (already partially exists), add inline links incrementally |
| Related articles | Already exists (`RelatedArticles.astro`). Standard for internal linking + dwell time | LOW | Redesign visually; ensure relevance (same category/cluster) |
| Share buttons | Standard expectation, low effort | LOW | Already exists (`ShareBar.astro`) — keep, restyle |
| Breadcrumb navigation | Helps users + Google understand site hierarchy (Trang chủ > Đầu tư > Cổ phiếu > [bài viết]) | LOW | Currently likely missing or minimal — add to ArticleLayout, also generates BreadcrumbList JSON-LD |
| FAQ section with schema | Already in schema (`faq` field) — common pattern for "PE là gì?" style explainer articles, supports FAQ rich snippets | LOW | Verify FAQ JSON-LD is emitted (per ARCHITECTURE notes, ArticleLayout already adds FAQ/Article JSON-LD) |
| Reading time | Already in schema (`readingTime`) — small but expected UX signal for long-form | LOW | Display near byline |
| Disclaimer / risk disclosure | YMYL legal/trust requirement — "Đây không phải lời khuyên đầu tư" type disclaimer | LOW | Standard footer-of-article or sidebar component; reuse across all financial articles |

#### Comparison Tables / Data Tables

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Comparison table component | NerdWallet's signature pattern for "X vs Y" / "Top N" articles (e.g., so sánh các quỹ ETF, so sánh broker phí giao dịch) | MEDIUM | New component planned. Needs: sortable/highlighted "best for" column, mobile-responsive (horizontal scroll or stacked cards), clear visual hierarchy. Markdown table → styled table via remark/rehype plugin or custom MDX-like component |

#### Homepage

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear hero with value proposition | Establishes what the site is and who it's for within 3 seconds | LOW | Should communicate "giáo dục đầu tư đáng tin cậy" positioning, not just generic hero image |
| Category navigation (visual) | Investopedia/NerdWallet homepages are essentially navigation hubs into topic verticals (Investing, Banking, Loans...) — this site has Đầu tư/Cổ phiếu/ETF/Quỹ/Trái phiếu/Phái sinh etc. | LOW-MEDIUM | Card-based category grid with icons/descriptions, mapped to existing `categories` in `site.ts` |
| Featured/curated articles section | Highlights cornerstone/pillar content (already have `featured` + `order` fields in schema) | LOW | Already supported by schema — just needs UI |
| Latest articles feed | Signals active publishing (freshness signal) | LOW | Simple chronological list/grid pulling recent `publishDate` |
| Search access | Already exists (`search.astro`) — must be discoverable from homepage header | LOW | Ensure prominent placement in header nav |
| Trust/credibility strip | A row near top or bottom showing "Về chúng tôi", editorial process link, author count, etc. — common on finance sites to build immediate trust | LOW-MEDIUM | New homepage section linking to About/Editorial Policy |

#### Category / Listing Pages

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Category description / intro copy | Investopedia category pages open with a short paragraph defining the topic and what readers will find — also good for category-page SEO (thin-content avoidance) | LOW | `categories` array in `site.ts` already has `description` field — surface it prominently |
| Article cards with metadata | Title, description/excerpt, category tag, reading time, updated date | LOW | `ArticleList.astro` exists — redesign cards to show updated date prominently (freshness) |
| Sub-category / filter navigation | "Đầu tư" group has sub-categories (co-phieu, etf, quy-dau-tu...) — listing pages should let users pivot between siblings | LOW-MEDIUM | Tab/pill navigation between sibling categories within a group |
| Pagination or "load more" | Once category has many articles, flat infinite list hurts UX/perf | LOW-MEDIUM | Defer until article count per category justifies it (check current counts) — may not be needed yet |
| Breadcrumbs | Same as article pages | LOW | Trang chủ > Đầu tư > Cổ phiếu |

#### About / Editorial Policy / Author Pages (E-E-A-T core)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Detailed About page: mission, who runs the site, editorial values | Google's quality rater guidelines explicitly call out About pages as primary E-A-T evidence for YMYL sites | LOW-MEDIUM | Expand existing `about.astro` — should answer "who is behind this content and why should I trust them" |
| Individual author profile pages | Each author/contributor should have their own page with full bio, credentials, photo, articles authored, social/professional links (LinkedIn) | MEDIUM-HIGH | New page type — `src/pages/author/[slug].astro` + author data source (could be simple JSON/data file initially, not full content collection) |
| Author credentials displayed consistently | Every article byline links to author's profile page; profile shows certifications, experience, education | MEDIUM | Requires structured author data (separate from article frontmatter) — e.g. `src/data/authors.ts` |
| Editorial Policy page detailing fact-check & review process | NerdWallet/Investopedia have dedicated, detailed editorial guidelines pages explaining sourcing standards, correction policy, independence from advertisers | LOW-MEDIUM | Already exists as basic page — expand with: how articles are researched, fact-checked, reviewed, updated; how corrections handled (links to existing `corrections-policy.astro`) |
| Contact page with real organizational info | E-E-A-T checks for legitimacy — physical presence/contact channel, not just a form | LOW | Already exists (`contact.astro`) — verify completeness |
| "How we make money" / independence statement | If site has any affiliate links/ads, explicit disclosure is both legal (Vietnam consumer protection norms increasingly mirror this) and an E-E-A-T signal | LOW | Add section to Editorial Policy if monetization exists or is planned; if not yet monetized, state editorial independence anyway |

### Differentiators (Competitive Advantage)

Features that set this site apart from generic Vietnamese finance content sites (which mostly lack any E-E-A-T scaffolding at all).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Fact-check / Citation box (inline, with last-verified date) | Most Vietnamese finance blogs cite nothing or cite each other in circular loops. A visible "Đã kiểm chứng vào [ngày]" + linked primary sources (SSC, HOSE, SBV, company reports) immediately differentiates from low-quality competitors | MEDIUM | New component planned — render per-claim or per-section citation markers linking to a sources list; tag sources by type (cơ quan quản lý, báo cáo công ty, dữ liệu thị trường) |
| Reviewer credential block separate from author | Two-person review (writer + domain-expert reviewer) is rare among Vietnamese competitors entirely | MEDIUM | Pairs with schema extension above; even if initially the same 1-2 people wear both hats, structurally separating roles signals process rigor |
| "Cập nhật lần cuối" prominent freshness indicator with changelog/revision note | Shows ongoing maintenance — most Vietnamese finance content is "write once, never touch" | LOW-MEDIUM | Could include a small "what changed" note on major updates (optional, lightweight) |
| Glossary cross-linking (term tooltips/links) | Site already has `knowledge/3-pipeline/glossary.md` — surfacing this as inline tooltips or links for jargon (e.g., hovering "P/E" shows definition) builds expertise perception and reduces bounce for beginner readers | MEDIUM-HIGH | Could start simple: auto-link first occurrence of glossary terms to existing "X là gì?" articles (internal linking, low-tech) before building hover tooltips |
| Comparison tables with Vietnam-specific data (phí giao dịch, AUM, lãi suất) | NerdWallet's comparison tables work because they're maintained with real product data — doing this for Vietnamese brokers/funds/banks is a content moat competitors lack | MEDIUM | Component is the easy part; content maintenance is the differentiator — flag as ongoing content ops concern, not just a UI task |
| Author "track record" / experience framing | E-E-A-T's newest pillar ("Experience") rewards demonstrable first-hand experience. Author bios that include "đã đầu tư trên thị trường Việt Nam từ năm X" or specific market experience differentiate from anonymous content farms | LOW | Content/copy task paired with author profile pages — low UI complexity, high trust value |
| Visual trust badges row (without overclaiming) | A subtle row referencing methodology/standards (e.g., "Tuân thủ chính sách biên tập độc lập", link to Editorial Policy) — NOT fake security badges | LOW | Anti-pattern risk if done poorly (see Anti-Features) — only link to real, substantive policy pages |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Fake/generic trust badges (SSL padlock icons, "verified" seals, stock award badges) | Seen on many low-quality finance sites, looks "official" | Google's quality raters and savvy users recognize these as manipulation; can actively hurt credibility if not backed by real accreditation | Link to substantive pages (Editorial Policy, About, Author profiles) instead of decorative badges |
| Aggressive popup CTAs / newsletter modals on article pages | Common growth-hacking pattern, assumed to boost conversion | Disrupts long-form reading experience that this redesign is explicitly trying to improve; conflicts with "trải nghiệm đọc dài" goal in PROJECT.md | Inline, non-blocking newsletter signup at natural break points (end of article, sidebar) |
| Over-engineered interactive calculators/widgets on every article | Investopedia/NerdWallet have many calculators (loan, retirement) — tempting to add broadly | High build cost, requires ongoing data accuracy maintenance (interest rates, tax brackets), out of scope per PROJECT.md (no backend/dynamic features), risk of becoming stale = E-E-A-T liability if wrong | Defer to future milestone; if needed, start with one well-maintained static calculator (client-side JS only) for highest-traffic comparison topic |
| Full citation apparatus with academic-style numbered footnotes throughout every paragraph | Looks rigorous, mimics Wikipedia/academic papers | Very high content-authoring overhead across hundreds of existing articles; risk of inconsistent application; PROJECT.md explicitly scopes "giữ nguyên nội dung" (don't rewrite content) | Start with end-of-article source list (low effort, already in schema) + selective inline citations only for new/updated articles going forward |
| Real-time market data widgets (stock tickers, live prices) embedded in articles | "Feels modern", common ask for finance sites | Static Astro site (no backend per constraints) — would require third-party JS embeds (perf, privacy, dependency risk) and isn't core to educational content mission | Keep content evergreen/educational; if data needed, use static "as of [date]" tables that get periodically updated |
| Author pages as full content-collection entries with heavy CMS-like editing flow | Seems consistent with article content collection pattern | Over-engineering for what's likely 1-3 authors/reviewers; adds schema complexity for little payoff at this stage | Simple typed data file (`src/data/authors.ts`) is sufficient; can migrate to content collection later if author count grows significantly |
| Comment sections / user reviews on articles | "Engagement" and UGC seen as good for SEO on some sites | Static site (no backend), moderation burden, spam/compliance risk for YMYL financial advice content (regulatory liability for user-posted "advice") | Omit entirely; channel engagement to social shares / contact form |

## Feature Dependencies

```
Author Profile Pages (src/pages/author/[slug].astro)
    └──requires──> Structured Author Data (src/data/authors.ts: name, credentials, bio, photo, links)
                       └──enhances──> Author Byline (top of article) + AuthorBox (bottom)
                       └──enhances──> About Page (team section can reuse author data)

Reviewed-by / Fact-checked Block
    └──requires──> Content schema extension (reviewer field, optional, backward-compatible)
                       └──requires──> Author Profile Pages (reviewer also needs a profile)

Citation/Fact-check Box (inline)
    └──enhances──> Sources list (existing `sources` field)
    └──enhances──> Sources Policy page (existing)

Comparison Table Component
    └──independent──> can ship without author/citation work, but most valuable when combined with Citation Box (cites data sources for the comparison)

Breadcrumbs
    └──requires──> Category taxonomy (already exists in src/data/site.ts)
    └──enhances──> Article pages, Category pages (shared component)

Category Page Redesign
    └──requires──> Category `description` field (already exists in site.ts)
    └──enhances──> Homepage category navigation (shared visual language)

Trust/Credibility Strip (Homepage)
    └──requires──> About Page expansion + Editorial Policy expansion (must have substance to link to)

Pagination on Category Pages
    └──conflicts(timing)──> Should be deferred until article volume per category warrants it (avoid building for hypothetical scale)
```

### Dependency Notes

- **Author Profile Pages require Structured Author Data:** Without a typed `authors.ts` (or similar), bylines, AuthorBox, reviewer blocks, and About-page team sections would each hardcode author info separately, causing drift. Build the data model first — this is a foundational, low-cost task that unblocks several E-E-A-T features.
- **Reviewed-by Block requires Content schema extension:** Must extend `src/content.config.ts` Zod schema with optional fields (`reviewedBy`, `reviewDate`) so existing articles without these fields don't break the build (per PROJECT.md constraint).
- **Trust/Credibility Strip requires substantive About/Editorial pages:** Linking a homepage trust element to thin pages would be counterproductive — sequence the About/Editorial Policy upgrades before or alongside the homepage trust strip.
- **Citation Box enhances but doesn't strictly require Sources field:** The `sources` field already exists in schema; the citation box is primarily a presentation/UI layer over existing data, making it lower-risk than schema-dependent features.
- **Pagination conflicts (timing) with current scope:** Building pagination prematurely adds complexity; verify actual article counts per category before committing UI for it.

## MVP Definition

### Launch With (v1) — This Milestone

These directly address the PROJECT.md Active requirements and the highest-leverage E-E-A-T gaps.

- [ ] Key Takeaways box — highest-visibility EEAT/UX win, low complexity, explicitly requested
- [ ] Citation/Fact-check box (end-of-article source list redesign + "verified as of" date) — core trust signal, builds on existing `sources` field
- [ ] Author byline (top of article, compact) + redesigned AuthorBox (bottom, expanded credentials) — core E-E-A-T
- [ ] Structured author data (`src/data/authors.ts`) — foundational dependency for above
- [ ] Author profile pages (`/author/[slug]`) — direct E-E-A-T requirement, modeled on Investopedia
- [ ] Breadcrumb navigation (article + category pages) — low cost, helps both UX and structured data
- [ ] Comparison table component — explicitly planned, differentiator
- [ ] Homepage redesign: hero + category navigation grid + featured articles + trust strip
- [ ] Category page redesign: intro copy + redesigned article cards + sibling-category navigation
- [ ] About page expansion (mission, team, editorial values, experience framing)
- [ ] Editorial Policy expansion (fact-check process, review process, sourcing standards, correction policy linkage)
- [ ] Disclaimer/risk-disclosure component for financial articles

### Add After Validation (v1.x)

- [ ] Reviewed-by / fact-checked-by block with schema extension — add once author profile infrastructure exists and a real reviewer workflow is defined
- [ ] Inline citation markers (footnote-style links to source list) — add incrementally to new/updated articles, don't retrofit entire archive at once
- [ ] Glossary auto-linking for jargon terms — enhances expertise perception, build after core redesign stabilizes
- [ ] "Cập nhật lần cuối" changelog notes for major content revisions

### Future Consideration (v2+)

- [ ] Pagination/load-more on category pages — defer until article volume justifies it
- [ ] Interactive calculators (single, well-scoped tool for highest-value comparison topic) — significant maintenance commitment, evaluate after core EEAT redesign ships
- [ ] Hover-tooltip glossary (vs. simple links) — nice-to-have UX polish over the simpler linking approach
- [ ] Author "track record" extended profiles (portfolio history, public track record pages) — high effort, evaluate based on author roster growth

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Key Takeaways box | HIGH | LOW | P1 |
| Citation/Fact-check box | HIGH | MEDIUM | P1 |
| Author byline + AuthorBox redesign | HIGH | LOW-MEDIUM | P1 |
| Structured author data | MEDIUM (enabler) | LOW | P1 |
| Author profile pages | HIGH | MEDIUM | P1 |
| Breadcrumbs | MEDIUM | LOW | P1 |
| Comparison table component | HIGH | MEDIUM | P1 |
| Homepage redesign | HIGH | MEDIUM | P1 |
| Category page redesign | HIGH | LOW-MEDIUM | P1 |
| About page expansion | HIGH | LOW-MEDIUM | P1 |
| Editorial Policy expansion | HIGH | LOW-MEDIUM | P1 |
| Disclaimer component | MEDIUM | LOW | P1 |
| Reviewed-by block + schema ext | MEDIUM-HIGH | MEDIUM | P2 |
| Inline citation markers | MEDIUM | MEDIUM-HIGH | P2 |
| Glossary auto-linking | MEDIUM | MEDIUM | P2 |
| Pagination | LOW (currently) | LOW-MEDIUM | P3 |
| Interactive calculators | MEDIUM | HIGH | P3 |
| Hover-tooltip glossary | LOW-MEDIUM | MEDIUM-HIGH | P3 |

**Priority key:**
- P1: Must have for this milestone (redesign + EEAT upgrade)
- P2: Should have, follow-up milestone once P1 infrastructure exists
- P3: Future consideration, defer until scale/need justifies

## Competitor Feature Analysis

| Feature | Investopedia | NerdWallet | Our Approach |
|---------|--------------|------------|--------------|
| Key Takeaways | Bulleted box at top of nearly every article | Used in guides/explainers, slightly less universal | Adopt Investopedia's near-universal placement; standardize as a reusable component for all educational articles |
| Author/Reviewer separation | "Reviewed by" tag distinct from author, both link to full bios | "Written by" + "Reviewed by" with credential lines, fact-checking badge | Start with author bios (P1); add reviewer separation in P2 once review workflow is real, not performative |
| Citations | Numbered inline links to primary sources (SEC, BLS, company filings), full reference list at bottom | Less numerous inline citations; relies more on linked sources within prose and a sources/methodology note | Hybrid: end-of-article source list (P1, easy), inline links opportunistically for high-stakes claims (P2) |
| Comparison tables | Used heavily for "best brokers", "best X" articles, sortable, with disclosure of how rankings are determined | NerdWallet's signature — ratings + "why we like it" + disclosure of star-rating methodology | Build comparison table component with a visible "Cách chúng tôi đánh giá/so sánh" methodology note for credibility |
| Editorial Policy depth | Dedicated, detailed page on editorial process, sourcing, review cadence | Very detailed editorial guidelines page (referenced in research), separate corrections policy | Expand existing editorial-policy.astro to match this depth; leverage existing corrections-policy.astro |
| Homepage structure | Topic-hub navigation (Investing, Stocks, Personal Finance...) with featured/trending content | Product/category hub (Banking, Credit Cards, Investing...) with tools and featured guides | Adapt to existing Vietnamese category taxonomy (Đầu tư group + Phân tích/Reviews/Nhà đầu tư) as the navigation spine |
| Author pages | Rich profile: photo, title, bio, "experience" narrative, social links, full article archive | Similar — photo, title, expertise areas, article archive, sometimes media mentions | Build a leaner v1 (photo, title, credential, bio, article list) — expand richness over time |

## Sources

- [NerdWallet Editorial Guidelines](https://www.nerdwallet.com/l/nerdwallet-editorial-guidelines)
- [Meet NerdWallet's Editorial Team](https://www.nerdwallet.com/l/nerdwallet-editorial-team)
- [E-E-A-T for Financial Websites: How to Earn Google's Trust - eSEOspace](https://eseospace.com/blog/e-e-a-t-for-financial-websites/)
- [Your Money or Your Life (YMYL) & SEO: Guidelines and Tips - Positional](https://www.positional.com/blog/ymyl-seo)
- [Google E-E-A-T: What It Is & How It Affects SEO - Semrush](https://www.semrush.com/blog/eeat/)
- [What is YMYL? Google's high-stakes content category - Search Engine Land](https://searchengineland.com/guide/ymyl)
- General domain knowledge of Investopedia/NerdWallet article, homepage, category, and author-page structures (publicly visible patterns, cross-checked against above sources)
- Project context: `.planning/PROJECT.md`, `.planning/codebase/STRUCTURE.md`

---
*Feature research for: Vietnamese personal-finance SEO/educational website redesign (EEAT/YMYL focus)*
*Researched: 2026-06-10*
