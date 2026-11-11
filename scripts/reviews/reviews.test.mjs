import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { reviewDataSchema, isPolicyActive, isOfferActive, isStale, todayVN, formatPolicy } from '../../src/lib/review-data.mjs';
import { startReviewAdmin } from './admin.mjs';
import { policyEmphasis } from '../../src/lib/review-emphasis.mjs';
const fixture = JSON.parse(await readFile(new URL('../../src/data/reviews/catalog.json', import.meta.url), 'utf8'));

test('catalog validates and unknown fees never become zero', () => {
  assert.ok(reviewDataSchema.safeParse(fixture).success);
  assert.equal(formatPolicy(undefined), 'Chưa xác minh');
  const free = fixture.policies.find((policy) => policy.value === 0);
  assert.equal(formatPolicy(free), '0đ/HĐ');
  assert.notEqual(formatPolicy(undefined), formatPolicy(free));
});
test('reject dangling sources, duplicate IDs, bad units and overlapping baselines', () => {
  for (const change of [
    (data) => { data.policies[0].sourceId = 'missing'; },
    (data) => { data.policies[0].supportingSourceIds = ['missing']; },
    (data) => { data.policies.push(structuredClone(data.policies[0])); },
    (data) => { data.policies[0].unit = 'vnd-contract'; },
    (data) => { data.policies.push({ ...data.policies[0], id: 'overlapping' }); },
    (data) => { data.policies[0].maxValue = -1; },
    (data) => { data.policies[0].checkedAt = '2026-02-30'; },
    (data) => { data.sources[0].url = 'not-a-url'; },
    (data) => { data.sources[0].url = 'https://user:secret@example.com'; },
  ]) {
    const data = structuredClone(fixture); change(data);
    assert.equal(reviewDataSchema.safeParse(data).success, false);
  }
});
test('non-overlapping revisions are valid; drafts and future policies are hidden', () => {
  const data = structuredClone(fixture);
  const original = data.policies[0]; original.validUntil = '2026-11-30';
  const replacement = { ...original, id: 'replacement', validFrom: '2026-12-01', validUntil: null };
  data.policies.push(replacement);
  assert.ok(reviewDataSchema.safeParse(data).success);
  assert.equal(isPolicyActive(replacement, '2026-11-30'), false);
  assert.equal(isPolicyActive(original, '2026-11-30'), true);
  assert.equal(isPolicyActive(original, '2026-12-01'), false);
  assert.equal(isPolicyActive({ ...original, status: 'draft' }, '2026-11-11'), false);
});
test('offers expire inclusively by Vietnam date, not the visitor timezone', () => {
  const offer = { status: 'published', startsAt: '2026-11-01', endsAt: '2026-11-11' };
  assert.equal(todayVN(new Date('2026-11-11T16:59:59Z')), '2026-11-11');
  assert.equal(todayVN(new Date('2026-11-11T17:00:00Z')), '2026-11-12');
  assert.equal(isOfferActive(offer, '2026-11-11'), true);
  assert.equal(isOfferActive(offer, '2026-11-12'), false);
  assert.equal(isOfferActive({ ...offer, status: 'draft' }, '2026-11-11'), false);
  assert.equal(isOfferActive({ ...offer, status: 'ended' }, '2026-11-11'), false);
  assert.equal(isStale('2026-10-12', '2026-11-11'), false);
  assert.equal(isStale('2026-10-11', '2026-11-11'), true);
});
test('cost highlighting excludes unknown, ranged, expired and incompatible fee bases', () => {
  const a = { ...fixture.policies[0], value: .03, checkedAt: '2026-11-11' };
  const b = { ...a, id: 'peer', value: .15 };
  const unknown = { ...a, value: 0, exchangeFee: 'unknown' };
  assert.equal(policyEmphasis(a, [a, b, unknown], '2026-11-11').kind, 'low');
  assert.equal(policyEmphasis(b, [a, b, unknown], '2026-11-11').kind, 'high');
  assert.equal(policyEmphasis(unknown, [a, b, unknown], '2026-11-11').kind, 'none');
  assert.equal(policyEmphasis({ ...a, qualifier: 'from' }, [a, b], '2026-11-11').kind, 'none');
  assert.equal(policyEmphasis(a, [a, { ...b, exchangeFee: 'excluded' }], '2026-11-11').kind, 'none');
  assert.equal(policyEmphasis(a, [a, { ...b, value: .03 }], '2026-11-11').kind, 'none');
  assert.equal(policyEmphasis(a, [a, b], '2027-01-01').kind, 'none');
});
test('local admin protects edits, rejects conflicts and preserves history with backups', async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'investing-review-admin-'));
  const catalogPath = path.join(dir, 'catalog.json');
  await writeFile(catalogPath, JSON.stringify(fixture));
  const { server, token, url } = await startReviewAdmin({ port: 0, catalogPath, historyDir: path.join(dir, 'history') });
  t.after(async () => { await new Promise((resolve) => server.close(resolve)); await rm(dir, { recursive: true, force: true }); });
  const endpoint = `${new URL(url).origin}/api/catalog`;
  assert.equal((await fetch(endpoint)).status, 401);
  assert.equal((await fetch(endpoint, { headers: { authorization: `Bearer ${token}`, origin: 'https://example.com' } })).status, 403);
  const loaded = await (await fetch(endpoint, { headers: { authorization: `Bearer ${token}` } })).json();
  const edited = structuredClone(loaded.catalog); edited.policies[0].conditions += ' Ghi chú đã kiểm chứng.';
  edited.history = [{ at: 'fake', note: 'Do not trust client history', changes: [] }];
  const send = (catalog, revision = loaded.revision, note = 'Đối chiếu điều kiện') => fetch(endpoint, {
    method: 'PUT', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'if-match': revision },
    body: JSON.stringify({ catalog, note }),
  });
  assert.equal((await send(edited, 'stale')).status, 409);
  const invalid = structuredClone(edited); invalid.policies[0].sourceId = 'unknown';
  assert.equal((await send(invalid)).status, 422);
  assert.equal((await send(edited, loaded.revision, '')).status, 400);
  const response = await send(edited); assert.equal(response.status, 200);
  const saved = await response.json();
  assert.equal(saved.catalog.history.length, fixture.history.length + 1);
  assert.deepEqual(saved.catalog.history[0], fixture.history[0]);
  assert.ok(saved.catalog.history.at(-1).changes.includes(`policies:${edited.policies[0].id}`));
  assert.equal((await readdir(path.join(dir, 'history'))).length, 1);
  assert.equal((await send(edited)).status, 409);
  assert.equal(JSON.parse(await readFile(catalogPath, 'utf8')).policies[0].conditions, edited.policies[0].conditions);
});

test('each missing baseline has a dated explanation and an official source to follow up', async () => {
  const gaps = JSON.parse(await readFile(new URL('../../src/data/reviews/verification-gaps.json', import.meta.url), 'utf8'));
  const keys = gaps.map((gap) => `${gap.broker}:${gap.metric}`);
  assert.equal(new Set(keys).size, keys.length);
  for (const gap of gaps) {
    assert.ok(fixture.brokers.includes(gap.broker));
    assert.ok(['stocks', 'margin', 'derivatives', 'advance'].includes(gap.metric));
    assert.ok(gap.reason.length > 30);
    assert.equal(new URL(gap.url).protocol, 'https:');
    assert.ok(gap.checkedAt <= todayVN());
  }
  for (const broker of fixture.brokers) {
    for (const metric of ['stocks', 'margin', 'derivatives', 'advance']) {
      const active = fixture.policies.some((policy) => policy.broker === broker && policy.metric === metric && policy.primary && isPolicyActive(policy));
      if (!active) assert.ok(keys.includes(`${broker}:${metric}`), `Missing evidence note: ${broker}:${metric}`);
    }
  }
});
