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

function cleanAndRedistribute() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articlesMap = new Map();
  const slugToUrl = new Map();

  // 1. Clean existing repetitive callout blocks from all files
  const calloutRegex = /\n+>\s*\*\*Bài viết cùng chủ đề:\*\*[^\n]+/g;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(ARTICLES_DIR, file);
    let rawContent = fs.readFileSync(filePath, "utf-8");

    // Clean repetitive callouts
    if (calloutRegex.test(rawContent)) {
      rawContent = rawContent.replace(calloutRegex, "");
      fs.writeFileSync(filePath, rawContent, "utf-8");
    }

    const parsed = matter(rawContent);
    const cat = parsed.data.category || "co-phieu";
    const catPath = CATEGORY_PATHS[cat] || "/dau-tu/co-phieu/";
    const fullUrl = `${catPath}${slug}/`;

    slugToUrl.set(slug, fullUrl);

    articlesMap.set(slug, {
      file,
      filePath,
      slug,
      data: parsed.data,
      content: parsed.content,
      rawContent,
      category: cat,
      fullUrl,
      title: parsed.data.title || slug,
    });
  }

  function hasExactLinkToSlug(body, targetSlug) {
    const targetUrl = slugToUrl.get(targetSlug);
    if (!targetUrl) return false;
    const targetUrlNoSlash = targetUrl.slice(0, -1);
    const linkRegex = /(?:^|[^!])\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(body)) !== null) {
      const url = match[2].trim().split("#")[0];
      if (url === targetUrl || url === targetUrlNoSlash || url === `/${targetSlug}/` || url === `/${targetSlug}`) {
        return true;
      }
    }
    return false;
  }

  // 2. Identify incoming links
  const incomingMap = new Map();
  for (const slug of slugToUrl.keys()) {
    incomingMap.set(slug, new Set());
  }

  for (const [slug, art] of articlesMap.entries()) {
    const body = art.content;
    for (const targetSlug of slugToUrl.keys()) {
      if (slug === targetSlug) continue;
      if (hasExactLinkToSlug(body, targetSlug)) {
        incomingMap.get(targetSlug).add(slug);
      }
    }
  }

  // 3. Find orphan articles
  const orphanSlugs = [];
  for (const [slug, sources] of incomingMap.entries()) {
    if (sources.size === 0) {
      orphanSlugs.push(slug);
    }
  }

  console.log(`Tìm thấy ${orphanSlugs.length} bài mồ côi. Đang phân bổ đều liên kết...`);

  // Peer usage counter to avoid overloading any single peer
  const peerUsage = new Map();
  for (const slug of slugToUrl.keys()) {
    peerUsage.set(slug, 0);
  }

  // Group articles by category
  const categoryArticles = new Map();
  for (const art of articlesMap.values()) {
    if (!categoryArticles.has(art.category)) {
      categoryArticles.set(art.category, []);
    }
    categoryArticles.get(art.category).push(art);
  }

  // Round-robin distribute orphan links
  for (let i = 0; i < orphanSlugs.length; i++) {
    const orphanSlug = orphanSlugs[i];
    const orphanArt = articlesMap.get(orphanSlug);
    if (!orphanArt) continue;

    const peers = categoryArticles.get(orphanArt.category) || [];
    const validPeers = peers.filter((p) => p.slug !== orphanSlug);

    if (validPeers.length === 0) continue;

    // Sort peers by usage count ascending so we pick peers with least injected links
    validPeers.sort((a, b) => (peerUsage.get(a.slug) || 0) - (peerUsage.get(b.slug) || 0));

    // Pick top 1 peer to host link to this orphan
    const chosenPeer = validPeers[0];
    if (chosenPeer) {
      let peerBody = chosenPeer.content;
      const linkBlock = `\n\n> **Bài viết cùng chủ đề:** Tìm hiểu thêm về **[${orphanArt.title}](${orphanArt.fullUrl})** để có góc nhìn toàn diện hơn.\n`;
      peerBody += linkBlock;

      chosenPeer.content = peerBody;
      chosenPeer.rawContent = matter.stringify(chosenPeer.content, chosenPeer.data);
      fs.writeFileSync(chosenPeer.filePath, chosenPeer.rawContent, "utf-8");

      peerUsage.set(chosenPeer.slug, (peerUsage.get(chosenPeer.slug) || 0) + 1);
    }
  }

  console.log("✅ Đã làm sạch các khối lặp lại và phân bổ liên kết đều đặn cho tất cả bài viết!");
}

cleanAndRedistribute();
