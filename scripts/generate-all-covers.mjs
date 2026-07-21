import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const generalTemplatePath = path.join(projectRoot, 'knowledge/4-content/2-drafts/article-cover-template.html');
const generalTemplateHtml = fs.readFileSync(generalTemplatePath, 'utf-8');

const articlesDir = path.join(projectRoot, 'src/content/articles');
const draftsDir = path.join(projectRoot, 'knowledge/4-content/2-drafts');

const categoryMeta = {
  "co-phieu": "Cổ phiếu",
  "etf": "Quỹ ETF",
  "trai-phieu": "Trái phiếu",
  "phai-sinh": "Phái sinh",
  "co-ban": "Phân tích cơ bản",
  "ky-thuat": "Phân tích kỹ thuật",
  "reviews": "Reviews",
  "nha-dau-tu": "Nhà đầu tư",
};

function updateFrontmatterHeroImage(content, slug) {
  const newHeroImagePath = `/images/articles/${slug}/${slug}.jpg`;
  
  if (/^heroImage:\s*/m.test(content)) {
    return content.replace(/^heroImage:\s*["']?[^"'\n\r]+["']?/m, `heroImage: "${newHeroImagePath}"`);
  } else {
    return content.replace(/^---\r?\n/m, `---\nheroImage: "${newHeroImagePath}"\n`);
  }
}

async function generateAllCovers() {
  console.log('=== Khởi động tiến trình tạo ảnh bìa tối ưu SEO ===');
  
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  console.log(`Tìm thấy ${files.length} bài viết cần xử lý.`);

  console.log('Đang khởi động trình duyệt Playwright...');
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2
  });

  const tempHtmlPath = path.join(draftsDir, 'temp-render.html');

  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const slug = file.replace('.md', '');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter
    const { data } = matter(fileContent);
    const title = data.title || 'Value Investing';
    const description = data.description || 'Tìm hiểu đầu tư tài chính dành cho người mới';
    const categorySlug = data.category || '';
    const categoryLabel = categoryMeta[categorySlug] || 'Kiến thức';
    const readTime = data.readingTime || '5 phút đọc';

    console.log(`\nXử lý bài viết: [${slug}]`);

    // Check if custom HTML cover template exists for this slug
    const customHtmlPath = path.join(draftsDir, `${slug}-cover.html`);
    let htmlContent = '';
    
    if (fs.existsSync(customHtmlPath)) {
      console.log(`  - 📄 Phát hiện template HTML tùy chỉnh: ${slug}-cover.html`);
      htmlContent = fs.readFileSync(customHtmlPath, 'utf-8');
    } else {
      console.log(`  - 🎨 Dùng template HTML chung (Title: "${title}")`);
      htmlContent = generalTemplateHtml
        .replaceAll('{{TITLE}}', title)
        .replaceAll('{{DESCRIPTION}}', description)
        .replaceAll('{{CATEGORY}}', categoryLabel)
        .replaceAll('{{READ_TIME}}', readTime);
    }

    // Write temp HTML
    fs.writeFileSync(tempHtmlPath, htmlContent);

    // Open file in browser
    await page.goto(`file://${tempHtmlPath}`);
    await page.waitForLoadState('networkidle');

    // Create target directory in public/images/articles/[slug]
    const imgDir = path.join(projectRoot, 'public/images/articles', slug);
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir, { recursive: true });
    }

    const imgName = `${slug}.jpg`;
    const imgPath = path.join(imgDir, imgName);

    console.log(`  - 📸 Chụp ảnh bìa -> ${imgPath}`);
    await page.screenshot({ path: imgPath, type: 'jpeg', quality: 95 });

    // Update markdown frontmatter
    const updatedContent = updateFrontmatterHeroImage(fileContent, slug);
    fs.writeFileSync(filePath, updatedContent);
    console.log(`  - 📝 Đã cập nhật heroImage trong file bài viết.`);

    // Clean up old hero.jpg if it exists
    const oldHeroPath = path.join(imgDir, 'hero.jpg');
    if (fs.existsSync(oldHeroPath)) {
      fs.unlinkSync(oldHeroPath);
      console.log(`  - 🗑️ Đã xóa tệp hero.jpg cũ.`);
    }
  }

  // Cleanup temp files
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  await browser.close();
  console.log('\n✅ Hoàn thành! Đã tạo toàn bộ ảnh bìa và cập nhật tên tệp tối ưu SEO.');
}

generateAllCovers().catch(err => {
  console.error('Lỗi khi tạo ảnh bìa:', err);
  process.exit(1);
});
