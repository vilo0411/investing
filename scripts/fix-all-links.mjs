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
  "co-phieu": { slug: "co-phieu-la-gi", title: "cổ phiếu là gì", label: "Cổ phiếu là gì", url: "/dau-tu/co-phieu/co-phieu-la-gi/" },
  "etf": { slug: "etf-la-gi", title: "quỹ etf là gì", label: "Quỹ ETF là gì", url: "/dau-tu/etf/etf-la-gi/" },
  "trai-phieu": { slug: "trai-phieu-la-gi", title: "trái phiếu là gì", label: "Trái phiếu là gì", url: "/dau-tu/trai-phieu/trai-phieu-la-gi/" },
  "phai-sinh": { slug: "phai-sinh-la-gi", title: "phái sinh là gì", label: "Phái sinh là gì", url: "/dau-tu/phai-sinh/phai-sinh-la-gi/" },
  "co-ban": { slug: "phan-tich-co-ban-la-gi", title: "phân tích cơ bản là gì", label: "Phân tích cơ bản là gì", url: "/phan-tich/co-ban/phan-tich-co-ban-la-gi/" },
  "ky-thuat": { slug: "phan-tich-ky-thuat-la-gi", title: "phân tích kỹ thuật là gì", label: "Phân tích kỹ thuật là gì", url: "/phan-tich/ky-thuat/phan-tich-ky-thuat-la-gi/" },
  "reviews": { slug: "review-cong-ty-chung-khoan-cho-nguoi-moi", title: "review công ty chứng khoán", label: "Review các công ty chứng khoán", url: "/reviews/review-cong-ty-chung-khoan-cho-nguoi-moi/" },
  "nha-dau-tu": { slug: "warren-buffett", title: "warren buffett", label: "Warren Buffett", url: "/nha-dau-tu/warren-buffett/" },
};

const ACTION_INFO = {
  "co-phieu": { slug: "cach-dau-tu-co-phieu", title: "cách đầu tư cổ phiếu", label: "Cách đầu tư cổ phiếu", url: "/dau-tu/co-phieu/cach-dau-tu-co-phieu/" },
  "etf": { slug: "cach-dau-tu-quy-etf", title: "cách đầu tư quỹ etf", label: "Cách đầu tư quỹ ETF", url: "/dau-tu/etf/cach-dau-tu-quy-etf/" },
  "trai-phieu": { slug: "cach-dau-tu-trai-phieu", title: "cách đầu tư trái phiếu", label: "Cách đầu tư trái phiếu", url: "/dau-tu/trai-phieu/cach-dau-tu-trai-phieu/" },
  "phai-sinh": { slug: "cach-dau-tu-chung-khoan-phai-sinh", title: "cách đầu tư chứng khoán phái sinh", label: "Cách đầu tư phái sinh", url: "/dau-tu/phai-sinh/cach-dau-tu-chung-khoan-phai-sinh/" },
  "co-ban": { slug: "cach-chon-co-phieu-tot", title: "cách chọn cổ phiếu tốt", label: "Cách chọn cổ phiếu tốt", url: "/dau-tu/co-phieu/cach-chon-co-phieu-tot/" },
  "ky-thuat": { slug: "cach-dau-tu-co-phieu", title: "cách đầu tư cổ phiếu", label: "Cách đầu tư cổ phiếu", url: "/dau-tu/co-phieu/cach-dau-tu-co-phieu/" },
  "reviews": { slug: "cach-mo-tai-khoan-chung-khoan", title: "cách mở tài khoản chứng khoán", label: "Cách mở tài khoản chứng khoán", url: "/dau-tu/co-phieu/cach-mo-tai-khoan-chung-khoan/" },
  "nha-dau-tu": { slug: "cach-dau-tu-co-phieu", title: "cách đầu tư cổ phiếu", label: "Cách đầu tư cổ phiếu", url: "/dau-tu/co-phieu/cach-dau-tu-co-phieu/" },
};

function fixLinks() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articlesMap = new Map();
  const slugToUrl = new Map();

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(ARTICLES_DIR, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
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
    // Regex matching exact link URL
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

  for (const [slug, art] of articlesMap.entries()) {
    const hub = HUB_INFO[art.category];
    const action = ACTION_INFO[art.category];
    let body = art.content;

    const missingLinks = [];

    if (hub && slug !== hub.slug && !hasExactLinkToSlug(body, hub.slug)) {
      missingLinks.push(hub);
    }
    if (action && slug !== action.slug && !hasExactLinkToSlug(body, action.slug)) {
      missingLinks.push(action);
    }

    if (missingLinks.length > 0) {
      for (const item of missingLinks) {
        const noteText = `\n\n> **Xem hướng dẫn tổng quan:** Đọc bài viết **[${item.label}](${item.url})** để biết chi tiết các bước thực hiện.\n`;
        body += noteText;
      }
      art.content = body;
      art.rawContent = matter.stringify(art.content, art.data);
      fs.writeFileSync(art.filePath, art.rawContent, "utf-8");
    }
  }

  // Incoming map for orphan articles
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

  // Orphan articles fix
  for (const [orphanSlug, sources] of incomingMap.entries()) {
    if (sources.size === 0) {
      const orphanArt = articlesMap.get(orphanSlug);
      if (!orphanArt) continue;

      const categoryPeers = Array.from(articlesMap.values()).filter(
        (a) => a.category === orphanArt.category && a.slug !== orphanSlug
      );

      const targetsToInject = categoryPeers.slice(0, 2);

      for (const peer of targetsToInject) {
        let peerBody = peer.content;
        const linkBlock = `\n\n> **Bài viết cùng chủ đề:** Tìm hiểu thêm về **[${orphanArt.title}](${orphanArt.fullUrl})** để có góc nhìn toàn diện hơn.\n`;
        peerBody += linkBlock;

        peer.content = peerBody;
        peer.rawContent = matter.stringify(peer.content, peer.data);
        fs.writeFileSync(peer.filePath, peer.rawContent, "utf-8");

        incomingMap.get(orphanSlug).add(peer.slug);
      }
    }
  }
}

fixLinks();
