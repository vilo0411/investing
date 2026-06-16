#!/usr/bin/env node
// Unsplash helper: search photos or download a chosen photo into the article's image folder.
// Usage:
//   node unsplash.mjs search "<query>"
//   node unsplash.mjs download <photoId> <slug> <filename>

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../../../../");

function loadAccessKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY;
  const envPath = resolve(projectRoot, ".env");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const match = line.match(/^\s*UNSPLASH_ACCESS_KEY\s*=\s*(.+?)\s*$/);
      if (match) return match[1].replace(/^["']|["']$/g, "");
    }
  }
  throw new Error("UNSPLASH_ACCESS_KEY not found in env or .env file");
}

const ACCESS_KEY = loadAccessKey();
const API = "https://api.unsplash.com";

async function search(query) {
  const url = `${API}/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } });
  if (!res.ok) throw new Error(`Unsplash search failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const results = data.results.map((p) => ({
    id: p.id,
    thumb: p.urls.thumb,
    regular: p.urls.regular,
    description: p.description || p.alt_description || "",
    photographer: p.user.name,
    photographerUrl: `${p.user.links.html}?utm_source=valueinvesting&utm_medium=referral`,
  }));
  console.log(JSON.stringify(results, null, 2));
}

async function download(photoId, slug, filename) {
  const res = await fetch(`${API}/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (!res.ok) throw new Error(`Unsplash get photo failed: ${res.status} ${await res.text()}`);
  const photo = await res.json();

  // Required by Unsplash API guidelines: ping download_location when a photo is used.
  await fetch(photo.links.download_location, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  const imgRes = await fetch(photo.urls.regular);
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);
  const buffer = Buffer.from(await imgRes.arrayBuffer());

  const dir = resolve(projectRoot, "src/content/articles/images", slug);
  mkdirSync(dir, { recursive: true });
  const ext = ".jpg";
  const filePath = resolve(dir, `${filename}${ext}`);
  writeFileSync(filePath, buffer);

  const attribution = {
    filePath: `./images/${slug}/${filename}${ext}`,
    photographer: photo.user.name,
    photographerUrl: `${photo.user.links.html}?utm_source=valueinvesting&utm_medium=referral`,
  };
  console.log(JSON.stringify(attribution, null, 2));
}

async function downloadHero(photoId, slug) {
  const res = await fetch(`${API}/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (!res.ok) throw new Error(`Unsplash get photo failed: ${res.status} ${await res.text()}`);
  const photo = await res.json();

  // Required by Unsplash API guidelines: ping download_location when a photo is used.
  await fetch(photo.links.download_location, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  // Crop to the site's standard 5:3 hero/cover ratio (1000x600), entropy-based focal point.
  const heroUrl = `${photo.urls.raw}&w=1000&h=600&fit=crop&crop=entropy&q=80&fm=jpg`;
  const imgRes = await fetch(heroUrl);
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);
  const buffer = Buffer.from(await imgRes.arrayBuffer());

  const dir = resolve(projectRoot, "public/images/articles", slug);
  mkdirSync(dir, { recursive: true });
  const filePath = resolve(dir, "hero.jpg");
  writeFileSync(filePath, buffer);

  const attribution = {
    heroImage: `/images/articles/${slug}/hero.jpg`,
    photographer: photo.user.name,
    photographerUrl: `${photo.user.links.html}?utm_source=valueinvesting&utm_medium=referral`,
  };
  console.log(JSON.stringify(attribution, null, 2));
}

const [command, ...args] = process.argv.slice(2);

if (command === "search") {
  await search(args[0]);
} else if (command === "download") {
  await download(args[0], args[1], args[2]);
} else if (command === "hero") {
  await downloadHero(args[0], args[1]);
} else {
  console.error("Usage:\n  unsplash.mjs search \"<query>\"\n  unsplash.mjs download <photoId> <slug> <filename>\n  unsplash.mjs hero <photoId> <slug>");
  process.exit(1);
}
