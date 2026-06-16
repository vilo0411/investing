import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(__dirname, "../");

function getMD5(filePath) {
  const fileBuffer = readFileSync(filePath);
  const hashSum = createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

function scanImages(dirPath, relativePrefix) {
  const results = [];
  if (!existsSync(dirPath)) return results;

  const items = readdirSync(dirPath);
  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...scanImages(fullPath, relativePrefix));
    } else if (stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item)) {
      results.push({
        filePath: fullPath,
        relative: join(relativePrefix, filePathToSlug(fullPath, dirPath), item),
        hash: getMD5(fullPath),
        size: stat.size,
      });
    }
  }
  return results;
}

function filePathToSlug(filePath, basePath) {
  const parts = filePath.replace(projectRoot, "").split("/");
  // Extract slug from path (e.g. /public/images/articles/slug/hero.jpg -> slug)
  const articlesIdx = parts.indexOf("articles");
  if (articlesIdx !== -1 && parts[articlesIdx + 1]) {
    return parts[articlesIdx + 1];
  }
  const imagesIdx = parts.indexOf("images");
  if (imagesIdx !== -1 && parts[imagesIdx + 1]) {
    return parts[imagesIdx + 1];
  }
  return "unknown";
}

function runAudit() {
  console.log("=== Bắt đầu kiểm tra ảnh trùng lặp ===");
  
  const publicDir = resolve(projectRoot, "public/images/articles");
  const contentDir = resolve(projectRoot, "src/content/articles/images");

  const allImages = [
    ...scanImages(publicDir, "public/images/articles"),
    ...scanImages(contentDir, "src/content/articles/images")
  ];

  console.log(`Đã quét tổng cộng ${allImages.length} hình ảnh.`);

  // Group by hash
  const hashGroups = {};
  for (const img of allImages) {
    if (!hashGroups[img.hash]) {
      hashGroups[img.hash] = [];
    }
    hashGroups[img.hash].push(img);
  }

  let duplicatesCount = 0;
  console.log("\n--- Kết quả phát hiện trùng lặp ---");
  
  for (const [hash, group] of Object.entries(hashGroups)) {
    if (group.length > 1) {
      duplicatesCount++;
      console.log(`\n[TRÙNG LẶP #${duplicatesCount}]`);
      console.log(`Mã băm ảnh: ${hash.slice(0, 8)}... (${(group[0].size / 1024).toFixed(1)} KB)`);
      console.log("Các bài viết/đường dẫn đang dùng chung ảnh này:");
      for (const img of group) {
        console.log(`  - ${img.filePath.replace(projectRoot, "")}`);
      }
    }
  }

  if (duplicatesCount === 0) {
    console.log("\n✅ Chúc mừng! Không phát hiện bất kỳ ảnh trùng lặp nào giữa các bài viết.");
    process.exit(0);
  } else {
    console.log(`\n⚠️ Phát hiện ${duplicatesCount} nhóm ảnh bị trùng lặp.`);
    console.log("Giải pháp: Bạn hãy chạy lại lệnh tải ảnh riêng của Unsplash cho các bài bị trùng lặp sau khi hết giới hạn rate limit.");
    process.exit(1);
  }
}

runAudit();
