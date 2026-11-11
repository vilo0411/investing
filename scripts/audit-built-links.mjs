import path from 'node:path';
import { auditBuild } from './lib/internal-link-audit.mjs';

try {
  const report = auditBuild(path.resolve('dist'));
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Internal links: ${report.articles} bài / ${report.pages} HTML`);
    console.log(`Link hỏng: ${report.broken.length}; qua chuyển hướng: ${report.redirects.length}; sai mục neo: ${report.fragments.length}`);
    console.log(`Bài mồ côi: ${report.orphans.length}; không đến được từ trang chủ: ${report.unreachable.length}; thiếu trang bài: ${report.missingArticles.length}`);
    console.log(`Bài được khối liên quan dẫn tới: ${report.relatedCoverage}/${report.articles}; độ sâu HTML: ${JSON.stringify(report.depth)}`);
    for (const key of ['broken', 'redirects', 'fragments', 'orphans', 'unreachable', 'missingArticles']) {
      if (report[key].length) console.error(key, JSON.stringify(report[key], null, 2));
    }
    if (report.emptyAnchors.length) console.warn(`Cảnh báo: ${report.emptyAnchors.length} anchor nội bộ trống.`);
  }
  if (report.errors) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
