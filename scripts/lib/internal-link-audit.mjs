import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';

export function inspectHtml(html) {
  const result = { links: [], ids: new Set(), redirect: false, noindex: false, canonical: undefined };
  const text = (node) => node.nodeName === '#text' ? node.value : node.tagName === 'img'
    ? node.attrs?.find((attr) => attr.name === 'alt')?.value ?? '' : (node.childNodes ?? []).map(text).join(' ');
  function visit(node, inRelated = false) {
    const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (attrs.id) result.ids.add(attrs.id);
    if (node.tagName === 'a' && attrs.name) result.ids.add(attrs.name);
    const related = inRelated || (attrs.class ?? '').split(/\s+/).includes('related');
    if (node.tagName === 'a' && attrs.href !== undefined) result.links.push({ href: attrs.href, text: text(node).replace(/\s+/g, ' ').trim(), related, rel: attrs.rel ?? '' });
    if (node.tagName === 'meta') {
      if (attrs['http-equiv']?.toLowerCase() === 'refresh') result.redirect = true;
      if (attrs.name?.toLowerCase() === 'robots' && /\bnoindex\b/i.test(attrs.content ?? '')) result.noindex = true;
    }
    if (node.tagName === 'link' && attrs.rel === 'canonical') result.canonical = attrs.href;
    for (const child of node.childNodes ?? []) visit(child, related);
  }
  visit(parse(html));
  return result;
}

export function resolveInternalUrl(href, sourceUrl) {
  try {
    const url = new URL(href, sourceUrl);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== new URL(sourceUrl).origin) return null;
    return { pathname: decodeURIComponent(url.pathname), fragment: decodeURIComponent(url.hash.slice(1)) };
  } catch {
    return null;
  }
}

function filesUnder(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? filesUnder(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

export function auditBuild(distDir) {
  const rootFile = path.join(distDir, 'index.html');
  if (!fs.existsSync(rootFile)) throw new Error('Build chưa tồn tại; chạy astro build trước.');
  const rootPage = inspectHtml(fs.readFileSync(rootFile, 'utf8'));
  if (!rootPage.canonical) throw new Error('Trang chủ thiếu canonical để xác định origin/base.');
  const rootUrl = new URL(rootPage.canonical);
  const basePath = rootUrl.pathname.replace(/\/?$/, '/');
  const pages = new Map();
  const assets = new Set();
  for (const file of filesUnder(distDir)) {
    const relative = path.relative(distDir, file).split(path.sep).join('/');
    const urlPath = `${basePath}${relative}`;
    assets.add(urlPath);
    if (relative.endsWith('.html')) {
      const pagePath = urlPath.endsWith('/index.html') ? urlPath.slice(0, -10) : urlPath;
      pages.set(pagePath, inspectHtml(fs.readFileSync(file, 'utf8')));
    }
  }
  const sitemap = fs.readFileSync(path.join(distDir, 'sitemap-articles.xml'), 'utf8');
  const articles = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeURIComponent(new URL(match[1]).pathname)));
  const broken = [], redirects = [], fragments = [], emptyAnchors = [];
  const graph = new Map(), incoming = new Map(), relatedIncoming = new Map();
  for (const [source, page] of pages) {
    if (page.redirect || page.noindex || source.endsWith('/404.html')) continue;
    const targets = new Set();
    graph.set(source, targets);
    for (const link of page.links) {
      const resolved = resolveInternalUrl(link.href, new URL(source, rootUrl).href);
      if (!resolved) continue;
      const { pathname, fragment } = resolved;
      const target = pages.has(pathname) ? pathname : `${pathname.replace(/\/$/, '')}/`;
      const targetPage = pages.get(target);
      const evidence = { source, href: link.href, anchor: link.text };
      if (!targetPage) {
        if (!assets.has(pathname)) broken.push(evidence);
        continue;
      }
      if (targetPage.redirect) redirects.push(evidence);
      if (fragment && !targetPage.ids.has(fragment)) fragments.push(evidence);
      if (!link.text) emptyAnchors.push(evidence);
      if (target === source || link.rel.split(/\s+/).includes('nofollow')) continue;
      targets.add(target);
      if (!incoming.has(target)) incoming.set(target, new Set());
      incoming.get(target).add(source);
      if (link.related && articles.has(source) && articles.has(target)) {
        if (!relatedIncoming.has(target)) relatedIncoming.set(target, new Set());
        relatedIncoming.get(target).add(source);
      }
    }
  }
  const depth = new Map([[basePath, 0]]), queue = [basePath];
  for (let i = 0; i < queue.length; i++) {
    for (const target of graph.get(queue[i]) ?? []) {
      if (!depth.has(target)) { depth.set(target, depth.get(queue[i]) + 1); queue.push(target); }
    }
  }
  const orphans = [...articles].filter((url) => !incoming.get(url)?.size);
  const unreachable = [...articles].filter((url) => !depth.has(url));
  const missingArticles = [...articles].filter((url) => !pages.has(url));
  const depthCounts = {};
  for (const article of articles) {
    const key = depth.get(article) ?? 'unreachable';
    depthCounts[key] = (depthCounts[key] ?? 0) + 1;
  }
  return {
    pages: pages.size, articles: articles.size, basePath, broken, redirects, fragments, emptyAnchors,
    orphans, unreachable, missingArticles, depth: depthCounts,
    relatedCoverage: relatedIncoming.size,
    relatedIncoming: Object.fromEntries([...relatedIncoming].sort(([a], [b]) => a.localeCompare(b)).map(([url, sources]) => [url, sources.size])),
    errors: broken.length + redirects.length + fragments.length + orphans.length + unreachable.length + missingArticles.length,
  };
}
