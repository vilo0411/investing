import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { reviewDataSchema, todayVN } from '../../src/lib/review-data.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const defaultCatalog = path.join(root, 'src/data/reviews/catalog.json');
const hash = (value) => createHash('sha256').update(value).digest('hex');

/** Local-only editor. It never becomes part of the public Astro build. */
export async function startReviewAdmin({ port = 4390, catalogPath = defaultCatalog, historyDir = path.join(root, '.local/reviews/history') } = {}) {
  const token = randomBytes(32).toString('hex');
  let saving = false;
  const original = reviewDataSchema.parse(JSON.parse(await readFile(catalogPath, 'utf8')));
  const brokerIds = [...original.brokers].sort().join(',');
  const staticFiles = new Map([
    ['/', [path.join(root, 'scripts/reviews/admin.html'), 'text/html; charset=utf-8']],
    ['/admin-client.js', [path.join(root, 'scripts/reviews/admin-client.js'), 'text/javascript; charset=utf-8']],
    ['/admin.css', [path.join(root, 'scripts/reviews/admin.css'), 'text/css; charset=utf-8']],
    ['/styles/global.css', [path.join(root, 'src/styles/global.css'), 'text/css; charset=utf-8']],
    ...['colors', 'typography', 'spacing', 'effects', 'aliases-legacy'].map((name) => [`/styles/tokens/${name}.css`, [path.join(root, `src/styles/tokens/${name}.css`), 'text/css; charset=utf-8']]),
  ]);
  const server = createServer(async (req, res) => {
    const origin = `http://127.0.0.1:${server.address().port}`;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'");
    const json = (code, data) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)); };
    try {
      if (req.headers.host !== `127.0.0.1:${server.address().port}` || (req.headers.origin && req.headers.origin !== origin)) return json(403, { error: 'Yêu cầu không cùng nguồn.' });
      const pathname = new URL(req.url, origin).pathname;
      if (pathname.startsWith('/api/')) {
        const supplied = Buffer.from((req.headers.authorization ?? '').replace(/^Bearer /, ''));
        const expected = Buffer.from(token);
        if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return json(401, { error: 'Mở lại liên kết quản trị được in trong terminal.' });
        if (pathname !== '/api/catalog') return json(404, { error: 'Không tìm thấy.' });
        if (req.method === 'GET') {
          const source = await readFile(catalogPath, 'utf8');
          return json(200, { catalog: reviewDataSchema.parse(JSON.parse(source)), revision: hash(source) });
        }
        if (req.method !== 'PUT') return json(405, { error: 'Phương thức không được hỗ trợ.' });
        if (saving) return json(409, { error: 'Đang có thao tác lưu khác. Vui lòng thử lại.' });
        if (!req.headers['content-type']?.startsWith('application/json')) return json(415, { error: 'Yêu cầu JSON.' });
        saving = true;
        try {
          const chunks = []; let length = 0;
          for await (const chunk of req) {
            length += chunk.length;
            if (length > 2_000_000) return json(413, { error: 'Dữ liệu vượt giới hạn 2 MB.' });
            chunks.push(chunk);
          }
          const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (typeof payload.note !== 'string' || payload.note.trim().length < 3) return json(400, { error: 'Cần ghi lý do chỉnh sửa (ít nhất 3 ký tự).' });
          const previousText = await readFile(catalogPath, 'utf8');
          if (req.headers['if-match'] !== hash(previousText)) return json(409, { error: 'Dữ liệu đã thay đổi ở nơi khác. Tải lại trước khi lưu để tránh ghi đè.' });
          const parsed = reviewDataSchema.safeParse(payload.catalog);
          if (!parsed.success) return json(422, { error: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n') });
          const next = parsed.data;
          if ([...next.brokers].sort().join(',') !== brokerIds) return json(422, { error: 'Thêm hồ sơ công ty trong registry trước khi thay đổi danh bạ.' });
          if ([...next.policies, ...next.offers].some((item) => item.checkedAt > todayVN())) return json(422, { error: 'Ngày kiểm tra nguồn không được ở tương lai.' });
          const previous = JSON.parse(previousText);
          const changes = [];
          for (const key of ['sources', 'policies', 'offers', 'links']) {
            const getId = (item) => item.id ?? item.broker;
            const before = new Map(previous[key].map((item) => [getId(item), item]));
            const after = new Map(next[key].map((item) => [getId(item), item]));
            for (const id of new Set([...before.keys(), ...after.keys()])) {
              if (JSON.stringify(before.get(id)) !== JSON.stringify(after.get(id))) changes.push(`${key}:${id}`);
            }
          }
          if (!changes.length) return json(200, { catalog: previous, revision: hash(previousText), message: 'Không có thay đổi để lưu.' });
          const now = new Date().toISOString();
          next.history = [...previous.history, { at: now, note: payload.note.trim(), changes }];
          await mkdir(historyDir, { recursive: true });
          await writeFile(path.join(historyDir, `${now.replace(/[:.]/g, '-')}-${hash(previousText).slice(0, 8)}.json`), previousText, { flag: 'wx' });
          const serialized = `${JSON.stringify(next, null, 2)}\n`;
          const temp = `${catalogPath}.${randomBytes(6).toString('hex')}.tmp`;
          await writeFile(temp, serialized);
          // A second revision check catches external changes during backup creation.
          if (hash(await readFile(catalogPath, 'utf8')) !== hash(previousText)) return json(409, { error: 'Tệp vừa thay đổi. Tải lại trước khi lưu.' });
          await rename(temp, catalogPath);
          return json(200, { catalog: next, revision: hash(serialized), message: 'Đã lưu dữ liệu và lịch sử. Build lại website để xuất bản.' });
        } finally { saving = false; }
      }
      if (req.method !== 'GET') return json(405, { error: 'Phương thức không được hỗ trợ.' });
      let file = staticFiles.get(pathname);
      if (/^\/fonts\/[a-z0-9-]+\.woff2$/.test(pathname)) file = [path.join(root, 'public', pathname), 'font/woff2'];
      if (!file) return json(404, { error: 'Không tìm thấy.' });
      res.writeHead(200, { 'Content-Type': file[1] });
      res.end(await readFile(file[0]));
    } catch (error) {
      if (!res.headersSent) json(error instanceof SyntaxError ? 400 : 500, { error: error instanceof SyntaxError ? 'JSON không hợp lệ.' : 'Không thể xử lý dữ liệu. Kiểm tra tệp và quyền ghi.' });
      else res.end();
    }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { server, token, url: `http://127.0.0.1:${server.address().port}/#${token}` };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const admin = await startReviewAdmin({ port: Number(process.env.REVIEW_ADMIN_PORT ?? 4390) });
  console.log(`Quản trị review cục bộ: ${admin.url}\nChỉ chạy trên máy này. Ctrl+C để dừng.`);
}
