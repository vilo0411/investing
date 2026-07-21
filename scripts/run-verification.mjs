import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const buildDir = path.join(workspaceRoot, "dist");

const BASELINE_URLS = [
  "https://valueinvesting.com.vn/",
  "https://valueinvesting.com.vn/about/",
  "https://valueinvesting.com.vn/contact/",
  "https://valueinvesting.com.vn/corrections-policy/",
  "https://valueinvesting.com.vn/dau-tu/",
  "https://valueinvesting.com.vn/dau-tu/co-phieu/",
  "https://valueinvesting.com.vn/dau-tu/co-phieu/blue-chip-la-gi/",
  "https://valueinvesting.com.vn/dau-tu/co-phieu/co-phieu-la-gi/",
  "https://valueinvesting.com.vn/dau-tu/co-phieu/co-tuc-la-gi/",
  "https://valueinvesting.com.vn/dau-tu/co-phieu/margin-la-gi/",
  "https://valueinvesting.com.vn/dau-tu/co-phieu/cach-dau-tu-co-phieu/",
  "https://valueinvesting.com.vn/dau-tu/etf/",
  "https://valueinvesting.com.vn/dau-tu/etf/etf-la-gi/",
  "https://valueinvesting.com.vn/dau-tu/etf/etf-vn30-la-gi/",
  "https://valueinvesting.com.vn/dau-tu/phai-sinh/",
  "https://valueinvesting.com.vn/dau-tu/phai-sinh/hop-dong-tuong-lai-la-gi/",
  "https://valueinvesting.com.vn/dau-tu/trai-phieu/",
  "https://valueinvesting.com.vn/dau-tu/trai-phieu/trai-phieu-doanh-nghiep/",
  "https://valueinvesting.com.vn/dau-tu/trai-phieu/trai-phieu-la-gi/",
  "https://valueinvesting.com.vn/editorial-policy/",
  "https://valueinvesting.com.vn/nha-dau-tu/",
  "https://valueinvesting.com.vn/nha-dau-tu/benjamin-graham/",
  "https://valueinvesting.com.vn/nha-dau-tu/warren-buffett/",
  "https://valueinvesting.com.vn/phan-tich/",
  "https://valueinvesting.com.vn/phan-tich/co-ban/",
  "https://valueinvesting.com.vn/phan-tich/ky-thuat/",
  "https://valueinvesting.com.vn/phan-tich/co-ban/eps-la-gi/",
  "https://valueinvesting.com.vn/phan-tich/co-ban/pb-la-gi/",
  "https://valueinvesting.com.vn/phan-tich/co-ban/pe-la-gi/",
  "https://valueinvesting.com.vn/phan-tich/co-ban/roa-la-gi/",
  "https://valueinvesting.com.vn/phan-tich/co-ban/roe-la-gi/",
  "https://valueinvesting.com.vn/phan-tich/ky-thuat/rsi-la-gi/",
  "https://valueinvesting.com.vn/reviews/",
  "https://valueinvesting.com.vn/reviews/review-cong-ty-chung-khoan-cho-nguoi-moi/",
  "https://valueinvesting.com.vn/search/",
  "https://valueinvesting.com.vn/sources-policy/"
];

function walkDir(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath, extensions));
    } else {
      if (!extensions || extensions.includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function runVerification() {
  console.log("=== Starting Automated Site Verification ===");
  console.log(`Scanning build directory: ${buildDir}`);

  if (!fs.existsSync(buildDir)) {
    console.error("Error: build directory 'dist/' does not exist. Please run 'npm run build' first.");
    process.exit(1);
  }

  const htmlFiles = walkDir(buildDir, [".html"]);
  const cssFiles = walkDir(buildDir, [".css"]);

  console.log(`Found ${htmlFiles.length} HTML files and ${cssFiles.length} CSS files.\n`);

  let blockerErrors = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  const results = {
    cwv: { passed: 0, failed: 0, violations: [] },
    schema: { passed: 0, failed: 0, violations: [] },
    sitemap: { passed: 0, failed: 0, violations: [] },
    links: { passed: 0, failed: 0, violations: [] },
    redirects: { passed: 0, failed: 0, violations: [] }
  };

  // 1. CWV Auditor: Check <img> tags for width/height
  console.log("--- Running CWV Auditor ---");
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, "utf-8");
    const imgRegex = /<img\s+([^>]+)>/gi;
    let match;
    const relPath = path.relative(buildDir, htmlFile);

    while ((match = imgRegex.exec(content)) !== null) {
      const imgTag = match[0];
      const attributes = match[1];

      const hasWidth = /\bwidth\s*=\s*['"]?\d+['"]?/i.test(attributes);
      const hasHeight = /\bheight\s*=\s*['"]?\d+['"]?/i.test(attributes);

      if (!hasWidth || !hasHeight) {
        const errorMsg = `[Image Missing Dimensions] in ${relPath}: ${imgTag}`;
        results.cwv.violations.push(errorMsg);
        results.cwv.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
      } else {
        results.cwv.passed++;
        passedChecks++;
      }
    }
  }

  // 2. CWV Auditor: Check CSS for font-display: swap in @font-face
  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, "utf-8");
    const fontFaceRegex = /@font-face\s*\{([^}]+)\}/gi;
    let match;
    const relPath = path.relative(buildDir, cssFile);

    while ((match = fontFaceRegex.exec(content)) !== null) {
      const fontFaceBody = match[1];
      const hasSwap = /\bfont-display\s*:\s*swap\b/i.test(fontFaceBody);

      if (!hasSwap) {
        const errorMsg = `[Font Face Missing Display Swap] in ${relPath}`;
        results.cwv.violations.push(errorMsg);
        results.cwv.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
      } else {
        results.cwv.passed++;
        passedChecks++;
      }
    }
  }

  if (results.cwv.failed === 0) {
    console.log("✅ CWV Auditor: All image tags have explicit width/height and font-display: swap is present in CSS.\n");
  } else {
    console.log(`⚠️ CWV Auditor: Found ${results.cwv.failed} violations.\n`);
  }

  // 3. Structured Data Validator: Parse JSON-LD scripts
  console.log("--- Running Structured Data Validator ---");
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, "utf-8");
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    const relPath = path.relative(buildDir, htmlFile);

    while ((match = jsonLdRegex.exec(content)) !== null) {
      const jsonText = match[1].trim();
      try {
        const schema = JSON.parse(jsonText);
        const schemasToCheck = Array.isArray(schema) ? schema : [schema];

        for (const item of schemasToCheck) {
          const type = item["@type"];
          if (!type) continue;

          if (type === "Article") {
            // Check required fields: headline, author (Person + name), publisher (Organization or @id reference), datePublished, dateModified
            const required = ["headline", "author", "publisher", "datePublished", "dateModified"];
            for (const req of required) {
              if (!item[req]) {
                const errorMsg = `[Schema Article Missing Field] '${req}' in ${relPath}`;
                results.schema.violations.push(errorMsg);
                results.schema.failed++;
                failedChecks++;
                blockerErrors++;
                console.error(`❌ ${errorMsg}`);
              } else {
                results.schema.passed++;
                passedChecks++;
              }
            }

            // Check author type Person and name
            if (item.author) {
              const authors = Array.isArray(item.author) ? item.author : [item.author];
              for (const author of authors) {
                if (author["@type"] !== "Person" || !author.name) {
                  const errorMsg = `[Schema Article Author Invalid] expected Person with name in ${relPath}`;
                  results.schema.violations.push(errorMsg);
                  results.schema.failed++;
                  failedChecks++;
                  blockerErrors++;
                  console.error(`❌ ${errorMsg}`);
                } else {
                  results.schema.passed++;
                  passedChecks++;
                }
              }
            }

            // Check publisher type Organization or @id reference
            if (item.publisher) {
              if (item.publisher["@type"] !== "Organization" && !item.publisher["@id"]) {
                const errorMsg = `[Schema Article Publisher Invalid] expected Organization or @id reference in ${relPath}`;
                results.schema.violations.push(errorMsg);
                results.schema.failed++;
                failedChecks++;
                blockerErrors++;
                console.error(`❌ ${errorMsg}`);
              } else {
                results.schema.passed++;
                passedChecks++;
              }
            }
          } else if (type === "Person") {
            // Check required fields for Author Profile: name
            if (!item.name) {
              const errorMsg = `[Schema Person Missing name] in ${relPath}`;
              results.schema.violations.push(errorMsg);
              results.schema.failed++;
              failedChecks++;
              blockerErrors++;
              console.error(`❌ ${errorMsg}`);
            } else {
              results.schema.passed++;
              passedChecks++;
            }
          } else if (type === "BreadcrumbList") {
            // Check required fields: itemListElement containing position, name, item per item
            if (!item.itemListElement || !Array.isArray(item.itemListElement)) {
              const errorMsg = `[Schema BreadcrumbList Invalid] 'itemListElement' missing or not array in ${relPath}`;
              results.schema.violations.push(errorMsg);
              results.schema.failed++;
              failedChecks++;
              blockerErrors++;
              console.error(`❌ ${errorMsg}`);
            } else {
              for (const element of item.itemListElement) {
                if (element.position === undefined || !element.name || !element.item) {
                  const errorMsg = `[Schema BreadcrumbList Element Invalid] missing position, name, or item in ${relPath}`;
                  results.schema.violations.push(errorMsg);
                  results.schema.failed++;
                  failedChecks++;
                  blockerErrors++;
                  console.error(`❌ ${errorMsg}`);
                } else {
                  results.schema.passed++;
                  passedChecks++;
                }
              }
            }
          }
        }
      } catch (err) {
        const errorMsg = `[Schema Parse Error] malformed JSON-LD in ${relPath}: ${err.message}`;
        results.schema.violations.push(errorMsg);
        results.schema.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
      }
    }
  }

  if (results.schema.failed === 0) {
    console.log("✅ Structured Data Validator: All parsed JSON-LD scripts are compliant.\n");
  } else {
    console.log(`⚠️ Structured Data Validator: Found ${results.schema.failed} violations.\n`);
  }
  console.log("--- Running Sitemap & URL Freeze Auditor ---");
  const sitemapFiles = fs.readdirSync(buildDir).filter(f => f.startsWith("sitemap") && f.endsWith(".xml"));
  if (sitemapFiles.length === 0) {
    const errorMsg = "[Sitemap Missing] No sitemap XML files found in dist/";
    results.sitemap.violations.push(errorMsg);
    results.sitemap.failed++;
    failedChecks++;
    blockerErrors++;
    console.error(`❌ ${errorMsg}\n`);
  } else {
    const sitemapUrls = [];
    for (const sfile of sitemapFiles) {
      const sContent = fs.readFileSync(path.join(buildDir, sfile), "utf-8");
      const locRegex = /<loc>(.*?)<\/loc>/g;
      let match;
      while ((match = locRegex.exec(sContent)) !== null) {
        sitemapUrls.push(match[1]);
      }
    }

    console.log(`Sitemaps contain ${sitemapUrls.length} combined URLs.`);

    // Diff against baseline
    for (const baselineUrl of BASELINE_URLS) {
      if (!sitemapUrls.includes(baselineUrl)) {
        const errorMsg = `[Sitemap Deviation] Baseline URL is missing or renamed in sitemap: ${baselineUrl}`;
        results.sitemap.violations.push(errorMsg);
        results.sitemap.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
      } else {
        results.sitemap.passed++;
        passedChecks++;
      }
    }

    if (results.sitemap.failed === 0) {
      console.log("✅ Sitemap Auditor: All 38 baseline URLs are present in the sitemaps.\n");
    } else {
      console.log(`⚠️ Sitemap Auditor: Found ${results.sitemap.failed} sitemap violations.\n`);
    }
  }

  // 5. Internal Links Integrity Crawler
  console.log("--- Running Internal Links Crawler ---");
  for (const htmlFile of htmlFiles) {
    const rawContent = fs.readFileSync(htmlFile, "utf-8");
    // Strip script tags entirely so we don't parse dynamic hrefs inside JavaScript (e.g. templates)
    const content = rawContent.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");
    
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    const relPath = path.relative(buildDir, htmlFile);

    while ((match = hrefRegex.exec(content)) !== null) {
      const link = match[1];

      // Filters to skip external, mailto, tel, javascript, or hash links
      if (
        link.startsWith("http://") ||
        link.startsWith("https://")
      ) {
        // If it points to our domain, treat it as internal
        if (!link.startsWith("https://valueinvesting.com.vn") && !link.startsWith("http://valueinvesting.com.vn")) {
          continue; // External
        }
      } else if (
        link.startsWith("mailto:") ||
        link.startsWith("tel:") ||
        link.startsWith("javascript:") ||
        link.startsWith("#") ||
        link === ""
      ) {
        continue;
      }

      // Convert URL to file path
      let cleanLink = link;
      if (cleanLink.startsWith("https://valueinvesting.com.vn")) {
        cleanLink = cleanLink.slice("https://valueinvesting.com.vn".length);
      } else if (cleanLink.startsWith("http://valueinvesting.com.vn")) {
        cleanLink = cleanLink.slice("http://valueinvesting.com.vn".length);
      }

      // Strip query parameters and hash
      cleanLink = cleanLink.split("?")[0].split("#")[0];

      // Resolve the path on disk
      let targetPath;
      if (cleanLink.startsWith("/")) {
        targetPath = path.join(buildDir, cleanLink);
      } else {
        // Relative to the htmlFile directory
        targetPath = path.resolve(path.dirname(htmlFile), cleanLink);
      }

      // If it points to a directory (or has no extension), look for index.html
      if (!path.extname(targetPath)) {
        if (cleanLink === "/404" || cleanLink === "/404/") {
          targetPath = path.join(buildDir, "404.html");
        } else {
          targetPath = path.join(targetPath, "index.html");
        }
      }

      if (!fs.existsSync(targetPath)) {
        const errorMsg = `[Broken Link] in ${relPath} pointing to: ${link} (resolved: ${path.relative(workspaceRoot, targetPath)})`;
        results.links.violations.push(errorMsg);
        results.links.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
      } else {
        results.links.passed++;
        passedChecks++;
      }
    }
  }

  if (results.links.failed === 0) {
    console.log("✅ Links Crawler: All internal links are resolved successfully.\n");
  } else {
    console.log(`⚠️ Links Crawler: Found ${results.links.failed} broken links.\n`);
  }

  // 6. Redirects Auditor
  console.log("--- Running Redirects Auditor ---");
  const configPath = path.join(workspaceRoot, "astro.config.mjs");
  if (!fs.existsSync(configPath)) {
    console.error("⚠️ redirects check skipped: astro.config.mjs not found");
  } else {
    const configContent = fs.readFileSync(configPath, "utf-8");
    const redirectsIndex = configContent.indexOf("redirects:");
    const redirects = [];
    if (redirectsIndex !== -1) {
      const redirectsBlock = configContent.substring(redirectsIndex);
      const redirectRegex = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
      let redirectMatch;
      while ((redirectMatch = redirectRegex.exec(redirectsBlock)) !== null) {
        const from = redirectMatch[1];
        const to = redirectMatch[2];
        if (from.startsWith("/") && to.startsWith("/")) {
          redirects.push({ from, to });
        }
      }
    }

    console.log(`Found ${redirects.length} redirects in astro.config.mjs.`);

    for (const r of redirects) {
      const fromPath = path.join(buildDir, r.from, "index.html");
      const toPath = path.join(buildDir, r.to, "index.html");

      // Verify that the redirect HTML file exists
      if (!fs.existsSync(fromPath)) {
        const errorMsg = `[Redirect File Missing] expected file at ${path.relative(workspaceRoot, fromPath)} for redirect from ${r.from}`;
        results.redirects.violations.push(errorMsg);
        results.redirects.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
        continue;
      }

      // Read redirect HTML and verify it contains <meta http-equiv="refresh" ...>
      const redirectHtml = fs.readFileSync(fromPath, "utf-8");
      const refreshRegex = new RegExp(
        `<meta\\s+http-equiv=["']refresh["']\\s+content=["']\\d+\\s*;\\s*url\\s*=\\s*${r.to}["']`,
        "i"
      );

      if (!refreshRegex.test(redirectHtml)) {
        const errorMsg = `[Redirect Meta Invalid] HTML in ${path.relative(workspaceRoot, fromPath)} does not point to ${r.to}`;
        results.redirects.violations.push(errorMsg);
        results.redirects.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
      } else {
        results.redirects.passed++;
        passedChecks++;
      }

      // Verify destination target exists
      if (!fs.existsSync(toPath)) {
        const errorMsg = `[Redirect Target Missing] target ${r.to} (file: ${path.relative(workspaceRoot, toPath)}) does not exist`;
        results.redirects.violations.push(errorMsg);
        results.redirects.failed++;
        failedChecks++;
        blockerErrors++;
        console.error(`❌ ${errorMsg}`);
      } else {
        results.redirects.passed++;
        passedChecks++;
      }
    }

    if (results.redirects.failed === 0) {
      console.log("✅ Redirects Auditor: All redirects exist and contain correct refresh tags and targets.\n");
    } else {
      console.log(`⚠️ Redirects Auditor: Found ${results.redirects.failed} redirect violations.\n`);
    }
  }

  // Write report
  const status = blockerErrors === 0 ? "passed" : "failed";
  const report = {
    status,
    timestamp: new Date().toISOString(),
    counts: {
      passed: passedChecks,
      failed: failedChecks
    },
    results
  };

  const reportPath = path.join(buildDir, "verification-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Verification report written to: ${path.relative(workspaceRoot, reportPath)}`);

  console.log("\n=============================================");
  console.log(`Results: ${passedChecks} checks passed, ${failedChecks} checks failed.`);
  if (blockerErrors > 0) {
    console.error(`Status: FAILED with ${blockerErrors} blocker errors.`);
    process.exit(1);
  } else {
    console.log("Status: PASSED successfully.");
    process.exit(0);
  }
}

runVerification();
