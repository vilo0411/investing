import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditBuild, inspectHtml, resolveInternalUrl } from './lib/internal-link-audit.mjs';
import { selectRelatedArticles } from '../src/lib/related-articles.mjs';

const article = (slug, category = 'co-phieu', extra = {}) => ({ slug, body: '', data: { category, title: slug, tags: [], ...extra } });

test('related articles prioritize subtopics and broker continuity over generic category order', () => {
  const articles = [article('co-phieu-la-gi'), article('current-ratio-la-gi', 'co-ban', { title: 'Current ratio', tags: ['thanh khoản'] }),
    article('he-so-thanh-toan-la-gi', 'co-ban', { title: 'Hệ số thanh toán', tags: ['thanh khoản'] }),
    article('ty-so-no-tren-tong-tai-san', 'co-ban'), article('pe-la-gi', 'co-ban'), article('phan-tich-co-ban-la-gi', 'co-ban')];
  const selected = selectRelatedArticles(articles, 'current-ratio-la-gi').map((item) => item.slug);
  assert.equal(selected[0], 'phan-tich-co-ban-la-gi');
  assert.ok(selected.includes('he-so-thanh-toan-la-gi'));
  assert.ok(!selected.includes('co-phieu-la-gi'));
  const reviews = [article('review-cong-ty-chung-khoan-cho-nguoi-moi', 'reviews'),
    article('review-tcbs-securities', 'reviews', { brokers: [{ slug: 'tcbs' }] }),
    article('cach-mo-tai-khoan-chung-khoan-tcbs', 'reviews', { brokers: [{ slug: 'tcbs' }] }),
    article('tcbs-vs-vps', 'reviews', { brokers: [{ slug: 'tcbs' }, { slug: 'vps' }] }),
    article('cach-mo-tai-khoan-chung-khoan-dnse', 'reviews', { brokers: [{ slug: 'dnse' }] })];
  assert.deepEqual(new Set(selectRelatedArticles(reviews, 'review-tcbs-securities').map((a) => a.slug)),
    new Set(['review-cong-ty-chung-khoan-cho-nguoi-moi', 'cach-mo-tai-khoan-chung-khoan-tcbs', 'tcbs-vs-vps']));
});

test('related selection is independent of collection order, unique, and handles small categories', () => {
  const articles = [article('co-phieu-la-gi'), article('cach-dau-tu-co-phieu'), article('co-tuc-la-gi'), article('blue-chip-la-gi'), article('co-phieu-quy-la-gi')];
  const slugs = (items) => selectRelatedArticles(items, 'co-tuc-la-gi').map((a) => a.slug);
  assert.deepEqual(slugs(articles), slugs([...articles].reverse()));
  assert.equal(new Set(slugs(articles)).size, 3);
  assert.ok(!slugs(articles).includes('co-tuc-la-gi'));
  assert.deepEqual(selectRelatedArticles([article('only')], 'only'), []);
  assert.deepEqual(selectRelatedArticles(articles, 'missing'), []);
});

test('URL resolution checks absolute same-origin URLs, relative paths, query strings and encoded fragments', () => {
  const source = 'https://example.com/investing/dau-tu/co-phieu/example/';
  assert.deepEqual(resolveInternalUrl('../other/?sort=new#n%E1%BB%A3', source), { pathname: '/investing/dau-tu/co-phieu/other/', fragment: 'nợ' });
  assert.equal(resolveInternalUrl('//external.com/page/', source), null);
  assert.equal(resolveInternalUrl('mailto:hello@example.com', source), null);
  assert.equal(resolveInternalUrl('https://example.com/wrong-category/example/', source).pathname, '/wrong-category/example/');
});

test('HTML audit catches wrong-category slugs, absolute links, references, missing fragments and redirects', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'investing-links-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const write = (file, content) => { const dest = path.join(dir, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, content); };
  write('index.html', '<link rel="canonical" href="https://example.com/investing/"><a href="/investing/right/article/">Article</a>');
  write('sitemap-articles.xml', '<urlset><url><loc>https://example.com/investing/right/article/</loc></url><url><loc>https://example.com/investing/orphan/</loc></url></urlset>');
  write('right/article/index.html', `<div id="ok"></div><a href="?sort=asc#ok">Same page</a>
    <a href="https://example.com/investing/wrong/article/">Wrong category</a>
    <a href="/investing/right/article/#missing">Missing fragment</a>
    <a href="/investing/old/">Old URL</a><a href="https://external.com/missing/">External</a>`);
  write('old/index.html', '<meta http-equiv="refresh" content="0;url=/investing/right/article/">');
  write('orphan/index.html', '<p>Unlinked</p>');
  const report = auditBuild(dir);
  assert.equal(report.broken.length, 1);
  assert.equal(report.broken[0].href, 'https://example.com/investing/wrong/article/');
  assert.equal(report.fragments.length, 1);
  assert.equal(report.redirects.length, 1);
  assert.deepEqual(report.orphans, ['/investing/orphan/']);
  assert.deepEqual(report.unreachable, ['/investing/orphan/']);
  assert.equal(report.errors, 5);
  assert.equal(inspectHtml('<section class="related"><a href="/a/"><img alt="Mô tả"></a></section>').links[0].text, 'Mô tả');
});
