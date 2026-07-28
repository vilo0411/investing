import fs from "fs";
import path from "path";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");

function removeInjectedCallouts() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  let cleanedCount = 0;

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    let content = fs.readFileSync(filePath, "utf-8");

    const originalLength = content.length;

    // Regex to match injected block callouts at end/middle of files
    content = content.replace(/\n+>\s*\*\*(?:Bài viết cùng chủ đề|Đọc thêm kiến thức liên quan|Xem hướng dẫn|Tham khảo thêm|Bài viết đề xuất):\*\*[^\n]+/g, "");

    if (content.length !== originalLength) {
      fs.writeFileSync(filePath, content, "utf-8");
      cleanedCount++;
    }
  }

  console.log(`✅ Đã loại bỏ hoàn toàn các khối Callout tự động trên ${cleanedCount} bài viết!`);
}

removeInjectedCallouts();
