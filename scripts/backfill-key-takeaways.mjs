// One-off migration script: relocate "## Key takeaways" body sections into
// `keyTakeaways: string[]` frontmatter for all articles in src/content/articles/.
//
// Usage: node scripts/backfill-key-takeaways.mjs
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");
const SECTION_REGEX = /^## Key takeaways\s*\n((?:- .+\n?)+)\n*/m;

const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));

let processed = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);

  const match = parsed.content.match(SECTION_REGEX);
  if (!match) {
    console.warn("SKIP (no Key takeaways section found): " + file);
    skipped += 1;
    continue;
  }

  const bullets = match[1]
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());

  parsed.data.keyTakeaways = bullets;
  parsed.content = parsed.content.replace(SECTION_REGEX, "").replace(/^\n+/, "");

  const output = matter.stringify(parsed, parsed.data, { lineWidth: -1 });
  fs.writeFileSync(filePath, output);

  console.log("Updated " + file + ": " + bullets.length + " key takeaways");
  processed += 1;
}

console.log(`\nDone: ${processed} processed, ${skipped} skipped (of ${files.length} files)`);
