import { readdirSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(__dirname, "../");

function loadAccessKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY;
  const envPath = resolve(projectRoot, ".env");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const match = line.match(/^\s*UNSPLASH_ACCESS_KEY\s*=\s*(.+?)\s*$/);
      if (match) return match[1].replace(/^["']|["']$/g, "");
    }
  }
  return null;
}

const ACCESS_KEY = loadAccessKey();
const API = "https://api.unsplash.com";

// Map of slugs to search keywords for Unsplash
const slugKeywords = {
  "pe-la-gi": "financial calculator chart",
  "pb-la-gi": "balance sheet accounting book",
  "roe-la-gi": "equity return profit growth bar chart",
  "roa-la-gi": "factory industrial manufacturing plant",
  "eps-la-gi": "gold coins stack earnings dividend",
  "rsi-la-gi": "candlestick oscillator momentum chart",
  "hop-dong-tuong-lai-la-gi": "futures trading floor exchange",
  "benjamin-graham": "vintage library books reading desk",
  "warren-buffett": "newspaper reading investor office desk",
  "cong-ty-chung-khoan-phi-thap": "mobile fintech app smartphone banking",
  "review-cong-ty-chung-khoan-cho-nguoi-moi": "student laptop learning online education",
  "etf-vn30-la-gi": "stock exchange board ticker screen",
  "blue-chip-la-gi": "blue chip corporate headquarters skyscraper",
  "co-phieu-la-gi": "stock certificate equity ownership shares",
  "co-tuc-la-gi": "dividend payment check envelope money",
  "etf-la-gi": "diversified portfolio index mutual fund",
  "margin-la-gi": "leverage risk warning balance scale",
  "trai-phieu-la-gi": "government bond certificate fixed income",
  "trai-phieu-doanh-nghiep": "corporate bond contract office signing",
  "cach-dau-tu-co-phieu": "stock market trading screen monitor",
  "cach-dau-tu-quy-etf": "long term saving piggy bank growth",
  "cach-dau-tu-trai-phieu": "fixed income coupon rate interest",
  "cach-dau-tu-chung-khoan-phai-sinh": "risk management hedge derivative strategy",
  "cach-chon-co-phieu-tot": "stock research analyst screen",
  "chia-tach-co-phieu-la-gi": "stock split percentage diagram",
  "duong-ma-la-gi": "moving average technical indicator chart",
  "quy-thu-dong-la-gi": "passive income saving wealth growth",
  "nen-dau-tu-quy-etf-nao": "top index funds performance comparison",
  "cach-mo-tai-khoan-chung-khoan": "brokerage account registration form",
  "cach-mo-tai-khoan-chung-khoan-vps": "mobile stocks trading app screen",
  "cach-mua-trai-phieu": "bond certificate purchase document",
  "cach-nhan-biet-co-phieu-tiem-nang": "magnifying glass stock market data chart",
  "nen-dau-tu-co-phieu-nao": "best stocks comparison table analysis",
  "phan-tich-ky-thuat-la-gi": "technical analysis candlestick chart patterns",
  "co-nen-dau-tu-chung-khoan-khong": "office desk calculator money calendar",
  "dau-tu-chung-khoan-dai-han": "long term investment clock growth plant",
  "rui-ro-dau-tu-chung-khoan": "financial risk downward arrow chart",
  "phan-tich-co-ban-la-gi": "financial fundamental analysis reports valuation",
  "cach-dinh-gia-co-phieu": "stock valuation formula excel chart",
  "dao-han-phai-sinh-la-gi": "derivatives expiration calendar clock",
  "dca-la-gi": "dollar cost averaging piggy bank scale investment",
  "co-nen-dau-tu-trai-phieu": "bond vs stock decision balance scale",
};

function getMD5(filePath) {
  const fileBuffer = readFileSync(filePath);
  const hashSum = createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

function scanImages(dirPath) {
  const results = [];
  if (!existsSync(dirPath)) return results;

  const items = readdirSync(dirPath);
  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...scanImages(fullPath));
    } else if (stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item)) {
      results.push({
        filePath: fullPath,
        fileName: item,
        slug: filePathToSlug(fullPath),
        hash: getMD5(fullPath),
      });
    }
  }
  return results;
}

function filePathToSlug(filePath) {
  const parts = filePath.replace(projectRoot, "").split("/");
  // src/content/articles/images/[slug]/file.jpg → find 'images' AFTER 'articles'
  const articlesIdx = parts.indexOf("articles");
  if (articlesIdx !== -1) {
    const next = parts[articlesIdx + 1];
    if (next === "images" && parts[articlesIdx + 2]) {
      return parts[articlesIdx + 2];
    }
    if (next) return next;
  }
  return "unknown";
}

async function fetchPhoto(query) {
  const url = `${API}/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } });
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("RATE_LIMIT");
    }
    throw new Error(`Unsplash search failed: ${res.status}`);
  }
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("NO_RESULTS");
  }
  // Select a random result from top 5 to avoid reusing the same top result
  const index = Math.floor(Math.random() * data.results.length);
  return data.results[index];
}

async function downloadPhoto(photo, targetPath, isHero) {
  // Ping download location required by Unsplash API
  await fetch(photo.links.download_location, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  let downloadUrl = photo.urls.regular;
  if (isHero) {
    // Crop to 5:3 ratio
    downloadUrl = `${photo.urls.raw}&w=1000&h=600&fit=crop&crop=entropy&q=80&fm=jpg`;
  }

  const imgRes = await fetch(downloadUrl);
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);
  const buffer = Buffer.from(await imgRes.arrayBuffer());

  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, buffer);
}

async function fixDuplicates() {
  if (!ACCESS_KEY) {
    console.error("❌ Không tìm thấy UNSPLASH_ACCESS_KEY trong file .env!");
    process.exit(1);
  }

  console.log("=== Đang quét tìm ảnh trùng lặp để sửa tự động (Ảnh minh họa nội dung) ===");
  const contentDir = resolve(projectRoot, "src/content/articles/images");

  const allImages = [
    ...scanImages(contentDir)
  ];

  const hashGroups = {};
  for (const img of allImages) {
    if (!hashGroups[img.hash]) {
      hashGroups[img.hash] = [];
    }
    hashGroups[img.hash].push(img);
  }

  const itemsToFix = [];
  for (const [hash, group] of Object.entries(hashGroups)) {
    if (group.length > 1) {
      // Keep the first one, fix the rest — all duplicates must be replaced
      for (let i = 1; i < group.length; i++) {
        itemsToFix.push(group[i]);
      }
    }
  }

  if (itemsToFix.length === 0) {
    console.log("✅ Không phát hiện ảnh trùng lặp cần sửa!");
    process.exit(0);
  }

  console.log(`Phát hiện ${itemsToFix.length} tệp ảnh trùng lặp cần tải mới.`);

  for (const item of itemsToFix) {
    const keyword = slugKeywords[item.slug] || "finance investment charts";
    const isHero = item.fileName === "hero.jpg";
    console.log(`\n[Tải mới] ${item.filePath.replace(projectRoot, "")}`);
    console.log(`  - Từ khóa tìm kiếm: "${keyword}"`);

    try {
      const photo = await fetchPhoto(keyword);
      console.log(`  - Tìm thấy ảnh từ tác giả: ${photo.user.name}`);
      await downloadPhoto(photo, item.filePath, isHero);
      console.log(`  - ✅ Đã tải và thay thế thành công!`);
      
      // Delay to respect rate limits
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      if (err.message === "RATE_LIMIT") {
        console.error("❌ Unsplash API đã hết lượt sử dụng (Rate Limit Exceeded). Vui lòng thử lại sau 1 giờ hoặc dùng API Key khác.");
        process.exit(1);
      } else {
        console.error(`❌ Lỗi khi tải ảnh cho ${item.slug}: ${err.message}`);
      }
    }
  }

  console.log("\n=== Hoàn thành quá trình sửa ảnh trùng lặp! ===");
}

fixDuplicates();
