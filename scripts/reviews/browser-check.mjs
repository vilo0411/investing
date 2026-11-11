import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { startReviewAdmin } from './admin.mjs';

const base = process.env.REVIEW_TEST_URL ?? 'http://localhost:4323';
const screenshotDir = new URL('../../.local/reviews/screenshots/', import.meta.url);
await mkdir(screenshotDir, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.route('**/*googletagmanager.com/**', (route) => route.abort());
const page = await context.newPage();
page.on('pageerror', (error) => errors.push(error.message));
const go = async (pathname) => { const response = await page.goto(`${base}${pathname}`); assert.equal(response.status(), 200, pathname); };
const visibleRows = () => page.locator('[data-broker-row]:visible');
try {
  await go('/reviews/');
  await page.waitForFunction(() => document.querySelectorAll('[data-broker-row]:not([hidden])').length === 8);
  assert.equal(await page.locator('[data-broker-row]').count(), 20);
  await page.locator('#broker-search').fill('SSI');
  assert.equal(await visibleRows().count(), 1);
  assert.equal(await visibleRows().getAttribute('data-broker'), 'ssi');
  await page.locator('[data-broker="ssi"] details').first().locator('summary').scrollIntoViewIfNeeded();
  const tableBefore = await page.locator('#broker-directory').boundingBox();
  const rowBefore = await page.locator('[data-broker="ssi"]').boundingBox();
  const columnsBefore = await page.locator('#broker-directory thead th').evaluateAll((cells) => cells.map((cell) => cell.getBoundingClientRect().width));
  await page.locator('[data-broker="ssi"] details').first().locator('summary').click();
  assert.ok(await page.locator('dialog.policy-dialog').isVisible());
  assert.match(await page.locator('dialog.policy-dialog').innerText(), /SSI/);
  assert.deepEqual(await page.locator('#broker-directory').boundingBox(), tableBefore, 'Opening a policy must not resize the table');
  assert.deepEqual(await page.locator('[data-broker="ssi"]').boundingBox(), rowBefore, 'Opening a policy must not resize the row');
  assert.deepEqual(await page.locator('#broker-directory thead th').evaluateAll((cells) => cells.map((cell) => cell.getBoundingClientRect().width)), columnsBefore);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog.policy-dialog').isVisible(), false);
  await page.locator('#broker-search').fill('khong-co-cong-ty-nay');
  assert.equal(await visibleRows().count(), 0);
  assert.ok(await page.locator('[data-directory-empty]').isVisible());
  await page.locator('[data-reset-filters]').first().click();
  await page.locator('[name="low-fee"]').check();
  for (const row of await visibleRows().all()) assert.ok(Number(await row.locator('[data-policy-metric="stocks"]').getAttribute('data-policy-value')) <= .1);
  assert.equal(await page.locator('[data-broker="hsc"]:visible').count(), 0, 'A starting rate is not a guaranteed fixed fee');
  await page.locator('[data-reset-filters]').first().click();
  await page.locator('#broker-sort').selectOption('stocks');
  const values = await visibleRows().locator('[data-policy-metric="stocks"]').evaluateAll((cells) => cells.map((cell) => Number(cell.dataset.policyValue ?? Infinity)));
  assert.deepEqual(values, [...values].sort((a, b) => a - b));
  await page.locator('[data-sort="stocks"]').click();
  assert.equal(await page.locator('[data-sort-column="stocks"]').getAttribute('aria-sort'), 'descending');
  const descending = await visibleRows().locator('[data-policy-metric="stocks"]').evaluateAll((cells) => cells.map((cell) => Number(cell.dataset.policyValue ?? -Infinity)));
  assert.deepEqual(descending, [...descending].sort((a, b) => b - a));
  await page.reload();
  assert.equal(await page.locator('[data-sort-column="stocks"]').getAttribute('aria-sort'), 'descending');
  await page.locator('[data-sort="stocks"]').click();
  assert.equal(await page.locator('[data-sort-column="stocks"]').getAttribute('aria-sort'), 'ascending');
  await page.locator('#broker-search').fill('SSI'); await page.locator('[data-compare="ssi"]').check();
  await page.locator('#broker-search').fill('TCBS'); await page.locator('[data-compare="tcbs"]').check();
  const tray = page.locator('[data-compare-tray]');
  assert.ok(await tray.isVisible());
  const bounds = await tray.boundingBox(); assert.ok(bounds.y + bounds.height <= 1000);
  assert.equal(await page.locator('[data-compare-link]').getAttribute('aria-disabled'), 'false');
  assert.ok(await page.locator('[data-selected-editorial]').isVisible());
  assert.ok((await page.locator('[data-selected-editorial]').getAttribute('href')).endsWith('/reviews/so-sanh-tcbs-vs-ssi/'));
  await page.locator('[data-compare-link]').click();
  await page.waitForFunction(() => document.querySelectorAll('thead [data-compare-column]:not([hidden])').length === 2);
  assert.deepEqual(await page.locator('thead [data-compare-column]:visible').allTextContents(), ['SSI', 'TCBS']);
  assert.ok(await page.locator('.editorial-bridge').isVisible());
  assert.ok(await page.locator('[data-editorial-pair="tcbs,ssi"]').isVisible());
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
  await page.locator('[name="company-1"]').selectOption('ssi'); await page.locator('[data-compare-form]').locator('button').click();
  assert.match(await page.locator('[data-comparison-status]').textContent(), /khác nhau/);
  await page.screenshot({ path: new URL('comparison-desktop.png', screenshotDir).pathname, fullPage: true });

  for (const slug of ['review-ssi-securities', 'so-sanh-tcbs-vs-ssi', 'cach-mo-tai-khoan-chung-khoan-ssi']) {
    await go(`/reviews/${slug}/`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.broker-journey').count(), 1);
    assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(), 0);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute('href')).endsWith(`/reviews/${slug}/`));
    if (slug === 'so-sanh-tcbs-vs-ssi') assert.equal(await page.locator('.sourced-comparison [data-policy-id]').count() > 0, true);
    if (slug === 'cach-mo-tai-khoan-chung-khoan-ssi') assert.ok(await page.getByRole('link', { name: 'Đọc đầy đủ phí và đánh giá công ty →' }).isVisible());
  }
  const sitemap = await (await context.request.get(`${base}/sitemap-pages.xml`)).text();
  assert.equal(sitemap.includes('/reviews/so-sanh/'), false);
  await go('/reviews/');
  await page.locator('#bang-so-sanh').scrollIntoViewIfNeeded();
  await page.screenshot({ path: new URL('directory-desktop.png', screenshotDir).pathname, fullPage: false });
  assert.ok(await page.locator('[data-emphasis="low"]').count() > 0);

  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const pathname of ['/reviews/', '/reviews/so-sanh/?ctck=ssi,tcbs', '/reviews/review-ssi-securities/', '/reviews/so-sanh-tcbs-vs-ssi/', '/reviews/cach-mo-tai-khoan-chung-khoan-ssi/']) {
      await go(pathname); await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(dimensions.page <= dimensions.viewport + 1, `${width}px overflow ${pathname}: ${JSON.stringify(dimensions)}`);
    }
    await go('/reviews/'); await page.locator('#bang-so-sanh').scrollIntoViewIfNeeded();
    await page.screenshot({ path: new URL(`directory-mobile-${width}.png`, screenshotDir).pathname });
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await noJS.newPage(); await fallback.goto(`${base}/reviews/`);
  assert.equal(await fallback.locator('[data-broker-row]:visible').count(), 20);
  await noJS.close();

  const temp = await mkdtemp(path.join(tmpdir(), 'review-browser-admin-'));
  let admin;
  try {
    const catalogPath = path.join(temp, 'catalog.json');
    await writeFile(catalogPath, await readFile(new URL('../../src/data/reviews/catalog.json', import.meta.url)));
    admin = await startReviewAdmin({ port: 0, catalogPath, historyDir: path.join(temp, 'history') });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(admin.url); await page.waitForFunction(() => !document.querySelector('#save-all').disabled);
    await page.locator('#entry-list button').first().click();
    await page.locator('#entry-form [name="conditions"]').fill('Điều kiện kiểm thử trên dữ liệu tạm.');
    await page.locator('#save-note').fill('Kiểm thử lưu từ giao diện'); await page.locator('#save-all').click();
    await page.waitForFunction(() => document.querySelector('#admin-status').textContent.includes('Đã lưu'));
    const saved = JSON.parse(await readFile(catalogPath, 'utf8')); assert.equal(saved.policies[0].conditions, 'Điều kiện kiểm thử trên dữ liệu tạm.');
    await page.screenshot({ path: new URL('admin-desktop.png', screenshotDir).pathname });
  } finally { if (admin) await new Promise((resolve) => admin.server.close(resolve)); await rm(temp, { recursive: true, force: true }); }
  assert.deepEqual(errors, []);
  console.log('PASS: filters, sources, sort, selection, comparison, article journeys, SEO, mobile 320/375px, no-JS fallback, admin save.');
} finally { await browser.close(); }
