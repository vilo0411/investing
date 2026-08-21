// Shared JSON-LD builders for the site entity graph.
//
// Every page emits exactly one <script type="application/ld+json"> containing a
// single @graph. BaseLayout contributes the site-level nodes (Organization,
// editorial board, WebSite); article/review layouts contribute page-level nodes
// through the `schemaNodes` prop. Keeping the logic here means ArticleLayout and
// ReviewLayout share one source of truth instead of duplicating schema objects.
//
// Design constraints:
//  - All builders are pure: no Astro globals, no import.meta.env reads.
//  - `siteUrl` is expected to be `Astro.site.toString()`, which already ends
//    with a trailing slash. @id strings are concatenated directly (never through
//    `new URL()`) so the emitted identifiers stay byte-identical to the ones
//    already indexed by search engines.
//  - Optional fields use conditional spreads so no key is ever set to undefined
//    (TypeScript strict mode + cleaner serialized output).

import { site } from "@/data/site";
import { author } from "@/data/authors";

/** A single node inside the page @graph. */
export interface SchemaNode {
  "@type": string | string[];
  "@id"?: string;
  [key: string]: unknown;
}

/** One breadcrumb hop. The final (current page) hop may omit `item`. */
export interface BreadcrumbEntry {
  name: string;
  item?: string;
}

/** A structured citation as stored in article frontmatter. */
export interface CitationEntry {
  title: string;
  url?: string;
  publisher?: string;
  date?: string;
}

/** Review payload — only present on company review pages. */
export interface ReviewInput {
  name: string;
  url?: string;
  ratingValue: number;
}

export interface ArticlePageInput {
  siteUrl: string;
  pageUrl: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate: Date;
  factCheckedDate?: Date;
  categoryTitle: string;
  tags?: string[];
  imageUrl: string;
  breadcrumb: BreadcrumbEntry[];
  faq?: { question: string; answer: string }[];
  citations?: CitationEntry[];
  sources?: string[];
  review?: ReviewInput;
}

/* ── @id helpers ─────────────────────────────────────────────────────────── */

export const orgId = (siteUrl: string) => `${siteUrl}#organization`;
export const editorialBoardId = (siteUrl: string) =>
  `${siteUrl}#organization/ban-bien-tap`;
export const websiteId = (siteUrl: string) => `${siteUrl}#website`;
export const personId = (siteUrl: string) =>
  `${siteUrl}author/${author.slug}/#person`;

/* ── Site-level nodes (present on every page) ────────────────────────────── */

/**
 * Organization + editorial board + WebSite.
 *
 * The editorial board is its own Organization node rather than reusing the root
 * @id — sharing an @id made `reviewedBy` overwrite the brand's name and URL.
 * The root Organization intentionally carries no `sameAs`: the founder's
 * personal profiles belong on the Person node, not on the brand entity.
 */
export function buildSiteNodes(siteUrl: string): SchemaNode[] {
  return [
    {
      "@type": "Organization",
      "@id": orgId(siteUrl),
      "name": site.name,
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}images/hero-investing.png`,
      },
      "email": site.email,
      "areaServed": "VN",
      // Inline definition (not a bare reference) so pages without a full Person
      // node still resolve; merges with the Person node on article pages.
      "founder": {
        "@type": "Person",
        "@id": personId(siteUrl),
        "name": author.name,
        "url": `${siteUrl}author/${author.slug}/`,
      },
    },
    {
      "@type": "Organization",
      "@id": editorialBoardId(siteUrl),
      "name": site.editorialReviewer,
      "url": `${siteUrl}editorial-policy/`,
      "parentOrganization": { "@id": orgId(siteUrl) },
    },
    {
      "@type": "WebSite",
      "@id": websiteId(siteUrl),
      "url": siteUrl,
      "name": site.name,
      "description": site.description,
      "inLanguage": "vi",
      "publisher": { "@id": orgId(siteUrl) },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}search/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

/* ── Internal helpers ────────────────────────────────────────────────────── */

/**
 * Prefer structured `citations` when present, otherwise fall back to the plain
 * `sources` string array. Returns undefined when neither yields anything so the
 * caller can omit the `citation` key entirely.
 */
function buildCitations(
  citations?: CitationEntry[],
  sources?: string[]
): unknown[] | undefined {
  if (citations?.length) {
    return citations.map(c => ({
      "@type": "CreativeWork",
      "name": c.title,
      ...(c.url ? { "url": c.url } : {}),
      ...(c.publisher
        ? { "publisher": { "@type": "Organization", "name": c.publisher } }
        : {}),
      ...(c.date ? { "datePublished": c.date } : {}),
    }));
  }
  return sources?.length ? sources : undefined;
}

/** Person node, hoisted to top level so Article.author is a pure reference. */
function buildPersonNode(siteUrl: string): SchemaNode {
  const sameAs = [
    author.socialLinks?.linkedin,
    author.socialLinks?.twitter,
  ].filter((v): v is string => Boolean(v));

  return {
    "@type": "Person",
    "@id": personId(siteUrl),
    "name": author.name,
    "url": `${siteUrl}author/${author.slug}/`,
    "jobTitle": author.role,
    "description": author.bio,
    "knowsAbout": author.expertise,
    "image": {
      "@type": "ImageObject",
      "url": `${siteUrl}${author.avatar.replace(/^\//, "")}`,
    },
    ...(sameAs.length > 0 ? { "sameAs": sameAs } : {}),
  };
}

/* ── Page-level nodes ────────────────────────────────────────────────────── */

/**
 * Build the connected page graph for an article or review page.
 *
 * Node order: Person → BreadcrumbList → ImageObject → WebPage → Article
 *             → FAQPage + Question[] (if any) → Review (company reviews only).
 *
 * WebPage is the hub: it references the breadcrumb, primary image, the main
 * entity (Article, plus Review on company reviews) and the FAQ, so no node is
 * left orphaned. Fact-check dates land on WebPage.lastReviewed — the property
 * previously used on Article does not exist in schema.org, so the YMYL
 * fact-check signal was being silently dropped.
 */
export function buildArticlePageNodes(input: ArticlePageInput): SchemaNode[] {
  const {
    siteUrl,
    pageUrl,
    title,
    description,
    publishDate,
    updatedDate,
    factCheckedDate,
    categoryTitle,
    tags,
    imageUrl,
    breadcrumb,
    faq,
    citations,
    sources,
    review,
  } = input;

  const breadcrumbNodeId = `${pageUrl}#breadcrumb`;
  const imageNodeId = `${pageUrl}#primaryimage`;
  const webPageId = `${pageUrl}#webpage`;
  const articleId = `${pageUrl}#article`;
  const faqId = `${pageUrl}#faq`;
  const reviewId = `${pageUrl}#review`;

  const hasFaq = Boolean(faq?.length);
  const citation = buildCitations(citations, sources);

  const nodes: SchemaNode[] = [
    buildPersonNode(siteUrl),
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbNodeId,
      "itemListElement": breadcrumb.map((crumb, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": crumb.name,
        ...(crumb.item ? { "item": crumb.item } : {}),
      })),
    },
    {
      "@type": "ImageObject",
      "@id": imageNodeId,
      "url": imageUrl,
      "width": 1200,
      "height": 630,
    },
    {
      "@type": "WebPage",
      "@id": webPageId,
      "url": pageUrl,
      "name": title,
      "description": description,
      "inLanguage": "vi",
      "isPartOf": { "@id": websiteId(siteUrl) },
      "breadcrumb": { "@id": breadcrumbNodeId },
      "primaryImageOfPage": { "@id": imageNodeId },
      // Company reviews have two main entities: the article and the review.
      "mainEntity": review
        ? [{ "@id": articleId }, { "@id": reviewId }]
        : { "@id": articleId },
      "datePublished": publishDate.toISOString(),
      "dateModified": updatedDate.toISOString(),
      ...(factCheckedDate
        ? { "lastReviewed": factCheckedDate.toISOString() }
        : {}),
      "reviewedBy": { "@id": editorialBoardId(siteUrl) },
      ...(hasFaq ? { "hasPart": [{ "@id": faqId }] } : {}),
    },
    {
      "@type": "Article",
      "@id": articleId,
      "headline": title,
      "description": description,
      "url": pageUrl,
      "mainEntityOfPage": { "@id": webPageId },
      "datePublished": publishDate.toISOString(),
      "dateModified": updatedDate.toISOString(),
      "inLanguage": "vi",
      "articleSection": categoryTitle,
      ...(tags?.length ? { "keywords": tags.join(", ") } : {}),
      "image": { "@id": imageNodeId },
      "author": { "@id": personId(siteUrl) },
      "reviewedBy": { "@id": editorialBoardId(siteUrl) },
      "publisher": { "@id": orgId(siteUrl) },
      "isPartOf": { "@id": websiteId(siteUrl) },
      ...(citation ? { "citation": citation } : {}),
    },
  ];

  if (faq?.length) {
    nodes.push({
      "@type": "FAQPage",
      "@id": faqId,
      "mainEntity": faq.map((_item, i) => ({
        "@id": `${pageUrl}#faq-question-${i + 1}`,
      })),
      "isPartOf": { "@id": webPageId },
    });

    faq.forEach((item, i) => {
      nodes.push({
        "@type": "Question",
        "@id": `${pageUrl}#faq-question-${i + 1}`,
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer,
        },
      });
    });
  }

  if (review) {
    nodes.push({
      "@type": "Review",
      "@id": reviewId,
      "name": title,
      "itemReviewed": {
        "@type": "FinancialService",
        "name": review.name,
        ...(review.url ? { "url": review.url } : {}),
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.ratingValue,
        "bestRating": 5,
        "worstRating": 1,
      },
      "author": { "@id": personId(siteUrl) },
      "datePublished": publishDate.toISOString(),
      "publisher": { "@id": orgId(siteUrl) },
      "isPartOf": { "@id": webPageId },
    });
  }

  return nodes;
}
