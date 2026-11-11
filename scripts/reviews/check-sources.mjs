import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { reviewDataSchema } from '../../src/lib/review-data.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const cache = path.join(root, '.local/reviews/sources');
const catalog = reviewDataSchema.parse(JSON.parse(await readFile(path.join(root, 'src/data/reviews/catalog.json'), 'utf8')));
let previous = {};
try { previous = JSON.parse(await readFile(path.join(cache, 'manifest.json'), 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const ids = process.argv.slice(2);
const sources = catalog.sources.filter((source) => !ids.length || ids.includes(source.id));
if (ids.some((id) => !catalog.sources.some((source) => source.id === id))) throw new Error('ID nguồn không tồn tại.');
const results = [];
const normalizeHTML = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// Three independent network reads at a time; no changes to published data.
for (let offset = 0; offset < sources.length; offset += 3) {
  const batch = await Promise.allSettled(sources.slice(offset, offset + 3).map(async (source) => {
    const response = await fetch(source.url, { signal: AbortSignal.timeout(15_000), headers: { 'User-Agent': 'ValueInvesting-SourceCheck/1.0', Accept: 'text/html,application/pdf' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.body) throw new Error('Nguồn không trả nội dung.');
    let size = 0; const chunks = [];
    for await (const chunk of response.body) { size += chunk.length; if (size > 10_000_000) throw new Error('Tài liệu vượt 10 MB.'); chunks.push(chunk); }
    const body = Buffer.concat(chunks);
    const isPDF = response.headers.get('content-type')?.includes('pdf') || body.subarray(0, 4).toString() === '%PDF';
    const comparable = isPDF ? body : normalizeHTML(body.toString('utf8'));
    const hash = createHash('sha256').update(comparable).digest('hex');
    return { id: source.id, url: source.url, hash, status: !previous[source.id] ? 'first-seen' : previous[source.id].hash === hash ? 'unchanged' : 'changed', checkedAt: new Date().toISOString(), isPDF, body };
  }));
  batch.forEach((result, index) => {
    const source = sources[offset + index];
    if (result.status === 'fulfilled') results.push(result.value);
    else results.push({ id: source.id, url: source.url, status: 'error', checkedAt: new Date().toISOString(), error: result.reason.message });
  });
}
await mkdir(cache, { recursive: true });
const manifest = { ...previous };
for (const result of results) {
  const { body, isPDF, ...metadata } = result;
  if (body) {
    // Keep every distinct response as evidence, including the previous version.
    await writeFile(path.join(cache, `${result.id}-${result.hash.slice(0, 12)}.${isPDF ? 'pdf' : 'html'}`), body);
    manifest[result.id] = metadata;
  }
  console.log(`${result.id}: ${result.status}${result.error ? ` (${result.error})` : ''}`);
}
await writeFile(path.join(cache, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(path.join(cache, 'report.json'), `${JSON.stringify(results.map(({ body, isPDF, ...metadata }) => metadata), null, 2)}\n`);
console.log('Báo cáo: .local/reviews/sources/report.json. Thay đổi nội dung là tín hiệu cần đọc lại, không tự xác nhận số liệu.');
if (results.some((result) => result.status === 'error')) process.exitCode = 1;
