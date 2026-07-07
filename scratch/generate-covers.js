import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const templatePath = path.join(projectRoot, 'knowledge/4-content/2-drafts/company-cover-template.html');
const templateHtml = fs.readFileSync(templatePath, 'utf-8');

const brokers = [
  {
    slug: 'review-tcbs-securities',
    abbr: 'TCBS',
    nameVi: 'Chứng khoán Kỹ thương',
    nameEn: 'Techcom Securities',
    stat1Label: 'Thành lập',
    stat1Value: '2008',
    fee: 'Miễn phí (0%)',
    bestFor: 'Tự chủ & Phí thấp',
    stars: '<span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star half">★</span>',
    tagline: 'Ứng dụng TCInvest<br>Bộ công cụ phân tích & miễn phí giao dịch'
  },
  {
    slug: 'review-ssi-securities',
    abbr: 'SSI',
    nameVi: 'Chứng khoán SSI',
    nameEn: 'SSI Securities',
    stat1Label: 'Thành lập',
    stat1Value: '1999',
    fee: '0.15% - 0.25%',
    bestFor: 'Vốn lớn & An toàn',
    stars: '<span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star half">★</span>',
    tagline: 'Ứng dụng iSSI<br>Báo cáo phân tích chuyên sâu & hỗ trợ môi giới'
  },
  {
    slug: 'review-vndirect-securities',
    abbr: 'VND',
    nameVi: 'Chứng khoán VNDIRECT',
    nameEn: 'VNDIRECT Securities',
    stat1Label: 'Thành lập',
    stat1Value: '2006',
    fee: '0.15% - 0.20%',
    bestFor: 'Giao diện & Học tập',
    stars: '<span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span>',
    tagline: 'Bảng giá Dboard trực quan<br>Ứng dụng di động thân thiện cho F0'
  },
  {
    slug: 'review-dnse-securities',
    abbr: 'DNSE',
    nameVi: 'Chứng khoán DNSE',
    nameEn: 'DNSE Securities',
    stat1Label: 'Thành lập',
    stat1Value: '2007',
    fee: 'Miễn phí (0%)',
    bestFor: 'Giao dịch Margin X',
    stars: '<span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span>',
    tagline: 'Ứng dụng Entrade X<br>Quản trị margin theo từng deal & zero-fee'
  },
  {
    slug: 'review-mbs-securities',
    abbr: 'MBS',
    nameVi: 'Chứng khoán MB',
    nameEn: 'MB Securities',
    stat1Label: 'Thành lập',
    stat1Value: '2000',
    fee: '0.10% - 0.15%',
    bestFor: 'Hệ sinh thái MBBank',
    stars: '<span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star half">★</span>',
    tagline: 'Ứng dụng MBS Mobile<br>Uy tín từ ngân hàng quân đội & Pro Advice'
  }
];

async function generate() {
  console.log('Launching Playwright browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  for (const broker of brokers) {
    console.log(`Generating cover HTML for ${broker.abbr}...`);
    let html = templateHtml
      .replaceAll('{{ABBR}}', broker.abbr)
      .replaceAll('{{NAME_VI}}', broker.nameVi)
      .replaceAll('{{NAME_EN}}', broker.nameEn)
      .replaceAll('{{STAT1_LABEL}}', broker.stat1Label)
      .replaceAll('{{STAT1_VALUE}}', broker.stat1Value)
      .replaceAll('{{FEE}}', broker.fee)
      .replaceAll('{{BEST_FOR}}', broker.bestFor)
      .replaceAll('{{STARS}}', broker.stars)
      .replaceAll('{{TAGLINE}}', broker.tagline);

    const htmlFileName = `${broker.slug}-cover.html`;
    const htmlFilePath = path.join(projectRoot, 'knowledge/4-content/2-drafts', htmlFileName);
    fs.writeFileSync(htmlFilePath, html);

    console.log(`Navigating page to ${htmlFileName}...`);
    await page.goto(`file://${htmlFilePath}`);
    await page.waitForLoadState('networkidle');

    // Create target directory in public/images/articles
    const imgDir = path.join(projectRoot, 'public/images/articles', broker.slug);
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir, { recursive: true });
    }

    const imgPath = path.join(imgDir, 'hero.jpg');
    console.log(`Taking screenshot for ${broker.abbr} -> ${imgPath}`);
    await page.screenshot({ path: imgPath, type: 'jpeg', quality: 95 });
  }

  await browser.close();
  console.log('Cover generation finished successfully!');
}

generate().catch(err => {
  console.error('Error generating covers:', err);
  process.exit(1);
});
