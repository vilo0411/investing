import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");

const CATEGORY_PATHS = {
  "co-phieu": "/dau-tu/co-phieu/",
  "etf": "/dau-tu/etf/",
  "trai-phieu": "/dau-tu/trai-phieu/",
  "phai-sinh": "/dau-tu/phai-sinh/",
  "co-ban": "/phan-tich/co-ban/",
  "ky-thuat": "/phan-tich/ky-thuat/",
  "reviews": "/reviews/",
  "nha-dau-tu": "/nha-dau-tu/",
};

const HUB_ACTION_MAP = {
  "co-phieu": { hub: "co-phieu-la-gi", action: "cach-dau-tu-co-phieu" },
  "etf": { hub: "etf-la-gi", action: "cach-dau-tu-quy-etf" },
  "trai-phieu": { hub: "trai-phieu-la-gi", action: "cach-dau-tu-trai-phieu" },
  "phai-sinh": { hub: "phai-sinh-la-gi", action: "cach-dau-tu-chung-khoan-phai-sinh" },
  "co-ban": { hub: "phan-tich-co-ban-la-gi", action: "cach-chon-co-phieu-tot" },
  "ky-thuat": { hub: "phan-tich-ky-thuat-la-gi", action: "cach-dau-tu-co-phieu" },
  "reviews": { hub: "review-cong-ty-chung-khoan-cho-nguoi-moi", action: "cach-mo-tai-khoan-chung-khoan" },
  "nha-dau-tu": { hub: "warren-buffett", action: "cach-dau-tu-co-phieu" },
};

const VALID_STATIC_ROUTES = new Set([
  "/",
  "/dau-tu/",
  "/dau-tu/co-phieu/",
  "/dau-tu/etf/",
  "/dau-tu/trai-phieu/",
  "/dau-tu/phai-sinh/",
  "/phan-tich/",
  "/phan-tich/co-ban/",
  "/phan-tich/ky-thuat/",
  "/reviews/",
  "/nha-dau-tu/",
  "/about/",
  "/contact/",
  "/disclaimer/",
  "/editorial-policy/",
  "/corrections-policy/",
  "/sources-policy/",
  "/so-do-trang/",
  "/search/",
]);

const GENERIC_ANCHORS = [
  "xem thêm", "bài viết này", "tại đây", "link này", "đây", "click vào đây", "xem chi tiết", "đọc thêm", "tham khảo"
];

function runAudit() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));

  const articles = [];
  const validArticleUrls = new Map(); // url -> slug
  const validSlugs = new Set();

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(ARTICLES_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: body } = matter(content);

    const cat = data.category;
    const catPath = CATEGORY_PATHS[cat];
    if (!catPath) {
      console.warn(`[WARN] Unknown category '${cat}' in ${file}`);
    }
    const fullUrl = `${catPath || "/"}${slug}/`;

    validSlugs.add(slug);
    validArticleUrls.set(fullUrl, slug);
    validArticleUrls.set(fullUrl.slice(0, -1), slug);

    articles.push({
      file,
      slug,
      category: cat,
      fullUrl,
      body,
      title: data.title,
    });
  }

  const linkGraph = new Map();
  const incomingLinks = new Map();
  const brokenLinks = [];
  const badAnchors = [];
  const wheelViolations = [];

  for (const slug of validSlugs) {
    linkGraph.set(slug, new Set());
    incomingLinks.set(slug, new Set());
  }

  const linkRegex = /(?:^|[^!])\[([^\]]+)\]\(([^)]+)\)/g;

  for (const art of articles) {
    let match;
    const hubsAndActions = HUB_ACTION_MAP[art.category] || {};

    let linkedToHub = art.slug === hubsAndActions.hub;
    let linkedToAction = art.slug === hubsAndActions.action;

    while ((match = linkRegex.exec(art.body)) !== null) {
      const anchorText = match[1].trim();
      const rawUrl = match[2].trim();

      const lowerAnchor = anchorText.toLowerCase();
      if (GENERIC_ANCHORS.some((ga) => lowerAnchor === ga || lowerAnchor.includes(ga))) {
        badAnchors.push({
          sourceSlug: art.slug,
          anchorText,
          url: rawUrl,
        });
      }

      if (
        rawUrl.startsWith("http://") ||
        rawUrl.startsWith("https://") ||
        rawUrl.startsWith("mailto:") ||
        rawUrl.startsWith("#") ||
        /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(rawUrl)
      ) {
        continue;
      }

      const cleanUrl = rawUrl.split("#")[0];
      if (!cleanUrl) continue;

      let targetSlug = validArticleUrls.get(cleanUrl);

      if (!targetSlug) {
        const normalizedUrl = cleanUrl.endsWith("/") ? cleanUrl : cleanUrl + "/";
        if (VALID_STATIC_ROUTES.has(normalizedUrl) || VALID_STATIC_ROUTES.has(cleanUrl)) {
          continue;
        }

        const parts = cleanUrl.split("/").filter(Boolean);
        const lastPart = parts[parts.length - 1];
        if (validSlugs.has(lastPart)) {
          targetSlug = lastPart;
        } else {
          brokenLinks.push({
            sourceFile: art.file,
            sourceSlug: art.slug,
            anchorText,
            url: rawUrl,
          });
          continue;
        }
      }

      if (targetSlug) {
        linkGraph.get(art.slug).add(targetSlug);
        incomingLinks.get(targetSlug).add(art.slug);

        if (hubsAndActions.hub && targetSlug === hubsAndActions.hub) {
          linkedToHub = true;
        }
        if (hubsAndActions.action && targetSlug === hubsAndActions.action) {
          linkedToAction = true;
        }
      }
    }

    if (!linkedToHub && hubsAndActions.hub) {
      wheelViolations.push({
        sourceSlug: art.slug,
        category: art.category,
        missing: `Hub (${hubsAndActions.hub})`,
      });
    }
    if (!linkedToAction && hubsAndActions.action) {
      wheelViolations.push({
        sourceSlug: art.slug,
        category: art.category,
        missing: `Action Spoke (${hubsAndActions.action})`,
      });
    }
  }

  const orphanArticles = [];
  for (const [slug, sources] of incomingLinks.entries()) {
    if (sources.size === 0) {
      orphanArticles.push(slug);
    }
  }

  const zeroOutLinks = [];
  for (const [slug, targets] of linkGraph.entries()) {
    if (targets.size === 0) {
      zeroOutLinks.push(slug);
    }
  }

  console.log("=== BÁO CÁO KIỂM TRA LINK NỘI BỘ (INTERNAL LINK AUDIT REPORT) ===");
  console.log(`Tổng số bài viết đã kiểm tra: ${articles.length}`);
  console.log(`\n1. Broken Links / Liên kết hỏng (404): ${brokenLinks.length}`);
  if (brokenLinks.length > 0) {
    brokenLinks.forEach((b) => {
      console.log(`   - [${b.sourceSlug}] "${b.anchorText}" -> ${b.url}`);
    });
  } else {
    console.log("   ✅ Không tìm thấy link hỏng nào!");
  }

  console.log(`\n2. Generic Anchor Text (Anchor kém chuẩn SEO): ${badAnchors.length}`);
  if (badAnchors.length > 0) {
    badAnchors.forEach((ba) => {
      console.log(`   - [${ba.sourceSlug}] Anchor: "${ba.anchorText}" -> ${ba.url}`);
    });
  } else {
    console.log("   ✅ Anchor text đều tự nhiên, chuẩn SEO!");
  }

  console.log(`\n3. Link Wheel Spoke Violations (Thiếu link Hub / Action của Category): ${wheelViolations.length}`);
  if (wheelViolations.length > 0) {
    wheelViolations.forEach((wv) => {
      console.log(`   - [${wv.sourceSlug}] (${wv.category}) thiếu link tới: ${wv.missing}`);
    });
  } else {
    console.log("   ✅ Tất cả bài viết đều tuân thủ nan hoa Link Wheel!");
  }

  console.log(`\n4. Orphan Articles (Bài viết mồ côi - 0 link nội bộ trỏ tới): ${orphanArticles.length}`);
  if (orphanArticles.length > 0) {
    orphanArticles.forEach((slug) => {
      console.log(`   - ${slug}`);
    });
  } else {
    console.log("   ✅ Không có bài viết mồ côi!");
  }

  console.log(`\n5. Articles with 0 outgoing internal links (0 link trỏ đi): ${zeroOutLinks.length}`);
  if (zeroOutLinks.length > 0) {
    zeroOutLinks.forEach((slug) => {
      console.log(`   - ${slug}`);
    });
  } else {
    console.log("   ✅ Tất cả bài viết đều có link trỏ đi!");
  }
}

runAudit();
