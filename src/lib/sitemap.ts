// Shared helpers for the hand-rolled sitemap endpoints.
// We build our own sitemaps (instead of @astrojs/sitemap) so the output is
// grouped by theme: an index that points to per-section child sitemaps.

export interface SitemapUrl {
  loc: string; // absolute URL
  lastmod?: string; // YYYY-MM-DD
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Resolve a root-relative, base-prefixed path (e.g. "/dau-tu/co-phieu/") into an
// absolute URL against the configured site origin.
export const absolute = (site: URL | undefined, path: string) =>
  site ? new URL(path, site).toString() : path;

const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';

export const urlsetXml = (urls: SitemapUrl[]) => {
  const body = urls
    .map(({ loc, lastmod }) => {
      const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
      return `<url><loc>${escapeXml(loc)}</loc>${mod}</url>`;
    })
    .join("");
  return `${xmlHeader}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
};

export const sitemapIndexXml = (locs: string[]) => {
  const body = locs
    .map((loc) => `<sitemap><loc>${escapeXml(loc)}</loc></sitemap>`)
    .join("");
  return `${xmlHeader}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
};

export const xmlResponse = (xml: string) =>
  new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
