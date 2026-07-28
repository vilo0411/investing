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

const HUB_INFO = {
  "co-phieu": { slug: "co-phieu-la-gi", phrases: ["cổ phiếu là gì", "cổ phiếu"], label: "cổ phiếu là gì", url: "/dau-tu/co-phieu/co-phieu-la-gi/" },
  "etf": { slug: "etf-la-gi", phrases: ["quỹ etf là gì", "etf là gì", "quỹ etf"], label: "quỹ ETF là gì", url: "/dau-tu/etf/etf-la-gi/" },
  "trai-phieu": { slug: "trai-phieu-la-gi", phrases: ["trái phiếu là gì", "trái phiếu"], label: "trái phiếu là gì", url: "/dau-tu/trai-phieu/trai-phieu-la-gi/" },
  "phai-sinh": { slug: "phai-sinh-la-gi", phrases: ["phái sinh là gì", "chứng khoán phái sinh"], label: "chứng khoán phái sinh là gì", url: "/dau-tu/phai-sinh/phai-sinh-la-gi/" },
  "co-ban": { slug: "phan-tich-co-ban-la-gi", phrases: ["phân tích cơ bản là gì", "phân tích cơ bản"], label: "phân tích cơ bản là gì", url: "/phan-tich/co-ban/phan-tich-co-ban-la-gi/" },
  "ky-thuat": { slug: "phan-tich-ky-thuat-la-gi", phrases: ["phân tích kỹ thuật là gì", "phân tích kỹ thuật"], label: "phân tích kỹ thuật là gì", url: "/phan-tich/ky-thuat/phan-tich-ky-thuat-la-gi/" },
  "reviews": { slug: "review-cong-ty-chung-khoan-cho-nguoi-moi", phrases: ["review công ty chứng khoán", "công ty chứng khoán"], label: "đánh giá các công ty chứng khoán", url: "/reviews/review-cong-ty-chung-khoan-cho-nguoi-moi/" },
  "nha-dau-tu": { slug: "warren-buffett", phrases: ["warren buffett", "buffett"], label: "Warren Buffett", url: "/nha-dau-tu/warren-buffett/" },
};

const ACTION_INFO = {
  "co-phieu": { slug: "cach-dau-tu-co-phieu", phrases: ["cách đầu tư cổ phiếu", "đầu tư cổ phiếu"], label: "cách đầu tư cổ phiếu", url: "/dau-tu/co-phieu/cach-dau-tu-co-phieu/" },
  "etf": { slug: "cach-dau-tu-quy-etf", phrases: ["cách đầu tư quỹ etf", "đầu tư quỹ etf"], label: "cách đầu tư quỹ ETF", url: "/dau-tu/etf/cach-dau-tu-quy-etf/" },
  "trai-phieu": { slug: "cach-dau-tu-trai-phieu", phrases: ["cách đầu tư trái phiếu", "đầu tư trái phiếu"], label: "cách đầu tư trái phiếu", url: "/dau-tu/trai-phieu/cach-dau-tu-trai-phieu/" },
  "phai-sinh": { slug: "cach-dau-tu-chung-khoan-phai-sinh", phrases: ["cách đầu tư chứng khoán phái sinh", "giao dịch phái sinh"], label: "cách đầu tư phái sinh", url: "/dau-tu/phai-sinh/cach-dau-tu-chung-khoan-phai-sinh/" },
  "co-ban": { slug: "cach-chon-co-phieu-tot", phrases: ["cách chọn cổ phiếu tốt", "lựa chọn cổ phiếu"], label: "cách chọn cổ phiếu tốt", url: "/dau-tu/co-phieu/cach-chon-co-phieu-tot/" },
  "ky-thuat": { slug: "cach-dau-tu-co-phieu", phrases: ["cách đầu tư cổ phiếu", "đầu tư cổ phiếu"], label: "cách đầu tư cổ phiếu", url: "/dau-tu/co-phieu/cach-dau-tu-co-phieu/" },
  "reviews": { slug: "cach-mo-tai-khoan-chung-khoan", phrases: ["cách mở tài khoản chứng khoán", "mở tài khoản chứng khoán"], label: "cách mở tài khoản chứng khoán", url: "/dau-tu/co-phieu/cach-mo-tai-khoan-chung-khoan/" },
  "nha-dau-tu": { slug: "cach-dau-tu-co-phieu", phrases: ["cách đầu tư cổ phiếu", "đầu tư cổ phiếu"], label: "cách đầu tư cổ phiếu", url: "/dau-tu/co-phieu/cach-dau-tu-co-phieu/" },
};

function runNaturalInlineLinking() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articlesMap = new Map();
  const slugToUrl = new Map();

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(ARTICLES_DIR, file);
    let rawContent = fs.readFileSync(filePath, "utf-8");

    // Remove any remaining block callouts
    rawContent = rawContent.replace(/\n+>\s*\*\*(?:Bài viết cùng chủ đề|Đọc thêm|Xem hướng dẫn|Tham khảo thêm|Bài viết đề xuất):\*\*[^\n]+/g, "");

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

  // 1. Inject Hub and Action links INLINE inside paragraphs
  for (const [slug, art] of articlesMap.entries()) {
    const hub = HUB_INFO[art.category];
    const action = ACTION_INFO[art.category];
    let body = art.content;

    const targetsToInject = [];
    if (hub && slug !== hub.slug && !hasExactLinkToSlug(body, hub.slug)) {
      targetsToInject.push(hub);
    }
    if (action && slug !== action.slug && !hasExactLinkToSlug(body, action.slug)) {
      targetsToInject.push(action);
    }

    if (targetsToInject.length > 0) {
      const paragraphs = body.split("\n\n");
      for (const target of targetsToInject) {
        let injected = false;
        // Try finding matching phrase in paragraph
        for (let i = 0; i < paragraphs.length; i++) {
          let p = paragraphs[i];
          if (p.startsWith("#") || p.startsWith(">") || p.startsWith("|") || p.startsWith("-") || p.startsWith("*") || p.includes("](")) {
            continue;
          }

          for (const phrase of target.phrases) {
            const regex = new RegExp(`(?<!\\[|\\/|\\w)${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\]|\\w)`, "gi");
            if (regex.test(p)) {
              paragraphs[i] = p.replace(regex, (match) => `**[${match}](${target.url})**`);
              injected = true;
              break;
            }
          }
          if (injected) break;
        }

        // Fallback: If no phrase matched, append a natural concluding sentence inside the last paragraph
        if (!injected) {
          for (let i = paragraphs.length - 1; i >= 0; i--) {
            let p = paragraphs[i];
            if (!p.startsWith("#") && !p.startsWith(">") && !p.startsWith("|") && p.trim().length > 30) {
              paragraphs[i] = `${p} Để hiểu rõ hơn về chủ đề này, bạn có thể tham khảo thêm hướng dẫn **[${target.label}](${target.url})**.`;
              injected = true;
              break;
            }
          }
        }
      }
      body = paragraphs.join("\n\n");
      art.content = body;
      art.rawContent = matter.stringify(art.content, art.data);
      fs.writeFileSync(art.filePath, art.rawContent, "utf-8");
    }
  }

  // 2. Identify incoming links and handle orphan articles naturally
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

  const orphanSlugs = [];
  for (const [slug, sources] of incomingMap.entries()) {
    if (sources.size === 0) {
      orphanSlugs.push(slug);
    }
  }

  console.log(`Đang xử lý ${orphanSlugs.length} bài mồ côi bằng cách chèn inline câu tự nhiên...`);

  // Distribute orphan links into peer articles INLINE inside regular paragraphs
  const peerUsage = new Map();
  for (const slug of slugToUrl.keys()) {
    peerUsage.set(slug, 0);
  }

  const categoryArticles = new Map();
  for (const art of articlesMap.values()) {
    if (!categoryArticles.has(art.category)) {
      categoryArticles.set(art.category, []);
    }
    categoryArticles.get(art.category).push(art);
  }

  for (const orphanSlug of orphanSlugs) {
    const orphanArt = articlesMap.get(orphanSlug);
    if (!orphanArt) continue;

    const peers = categoryArticles.get(orphanArt.category) || [];
    const validPeers = peers.filter((p) => p.slug !== orphanSlug);
    if (validPeers.length === 0) continue;

    validPeers.sort((a, b) => (peerUsage.get(a.slug) || 0) - (peerUsage.get(b.slug) || 0));
    const chosenPeer = validPeers[0];

    if (chosenPeer) {
      let peerBody = chosenPeer.content;
      const paragraphs = peerBody.split("\n\n");
      let injected = false;

      // Try searching for phrase in peer paragraph
      const titleClean = orphanArt.title.split(":")[0].split("?")[0].trim().toLowerCase();
      for (let i = 0; i < paragraphs.length; i++) {
        let p = paragraphs[i];
        if (p.startsWith("#") || p.startsWith(">") || p.startsWith("|") || p.includes("](")) continue;

        if (p.toLowerCase().includes(titleClean)) {
          const regex = new RegExp(titleClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
          paragraphs[i] = p.replace(regex, (m) => `[${m}](${orphanArt.fullUrl})`);
          injected = true;
          break;
        }
      }

      // If phrase not found, append a natural reading sentence into the last paragraph of chosenPeer
      if (!injected) {
        for (let i = paragraphs.length - 1; i >= 0; i--) {
          let p = paragraphs[i];
          if (!p.startsWith("#") && !p.startsWith(">") && !p.startsWith("|") && p.trim().length > 30) {
            paragraphs[i] = `${p} Bên cạnh đó, bạn cũng nên đọc thêm bài viết phân tích về [${orphanArt.title}](${orphanArt.fullUrl}) để trang bị kiến thức đầy đủ nhất.`;
            injected = true;
            break;
          }
        }
      }

      chosenPeer.content = paragraphs.join("\n\n");
      chosenPeer.rawContent = matter.stringify(chosenPeer.content, chosenPeer.data);
      fs.writeFileSync(chosenPeer.filePath, chosenPeer.rawContent, "utf-8");
      peerUsage.set(chosenPeer.slug, (peerUsage.get(chosenPeer.slug) || 0) + 1);
    }
  }

  console.log("✅ Đã chèn 100% liên kết nội bộ tự nhiên dạng Inline Paragraph (KHÔNG sử dụng Callout block)!");
}

runNaturalInlineLinking();
