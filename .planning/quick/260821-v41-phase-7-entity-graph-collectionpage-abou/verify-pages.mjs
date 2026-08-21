#!/usr/bin/env node
// Phase 7 gate: verify the entity graph of EVERY real page in dist/.
//
// Usage: node .planning/quick/260821-v41-.../verify-pages.mjs [distDir]
//
// Steps:
//   1. Walk dist/ for *.html, split redirect stubs (http-equiv="refresh") from
//      real pages. Stubs carry no graph and are skipped.
//   2. Run verify-graph.mjs over every real page; any FAIL fails this gate.
//   3. Compare page counts against baseline.txt (recorded before Phase 7), so a
//      page silently disappearing or appearing is caught.
//   4. Assert the 18 in-scope pages carry the right page-level node.
//   5. Anti-regression checks on the Person and Organization nodes.
//
// Zero dependencies — plain Node ESM. Exits 1 on any failure.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "../../..");
const VERIFY_GRAPH = resolve(
  REPO_ROOT,
  ".planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs"
);
const BASELINE = join(HERE, "baseline.txt");
const DIST = resolve(REPO_ROOT, process.argv[2] ?? "dist");

const LD_BLOCK_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i;
const STUB_RE = /http-equiv=["']refresh/i;

const isObject = v => typeof v === "object" && v !== null && !Array.isArray(v);
const hasType = (node, type) => {
  const t = node["@type"];
  return Array.isArray(t) ? t.includes(type) : t === type;
};

const failures = [];
const fail = msg => failures.push(msg);

/* ── 1. Collect pages ────────────────────────────────────────────────────── */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

const allHtml = walk(DIST).sort();
const stubs = [];
const realPages = [];
for (const file of allHtml) {
  const html = readFileSync(file, "utf8");
  if (STUB_RE.test(html)) stubs.push(file);
  else realPages.push(file);
}

console.log(
  `Scanned ${allHtml.length} HTML files: ${realPages.length} real pages, ${stubs.length} redirect stubs.`
);

if (realPages.length === 0) {
  console.error("FAIL: no real pages found — did the build run?");
  process.exit(1);
}

/* ── 2. Run the Phase 1+2 graph verifier over every real page ────────────── */

const run = spawnSync("node", [VERIFY_GRAPH, ...realPages], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
const graphOut = `${run.stdout ?? ""}${run.stderr ?? ""}`;
const graphFails = graphOut.split("\n").filter(l => l.startsWith("FAIL"));
for (const line of graphFails) console.log(line);
if (run.status !== 0) {
  fail(`verify-graph.mjs exited ${run.status} with ${graphFails.length} failing page(s)`);
}

/* ── 3. Parse each page's graph once ─────────────────────────────────────── */

/** @type {Map<string, any[]>} absolute file path -> @graph array */
const graphs = new Map();
for (const file of realPages) {
  const match = LD_BLOCK_RE.exec(readFileSync(file, "utf8"));
  if (!match) continue;
  try {
    const doc = JSON.parse(match[1]);
    if (Array.isArray(doc["@graph"])) graphs.set(file, doc["@graph"]);
  } catch {
    /* verify-graph.mjs already reports parse errors */
  }
}

const articlePages = [...graphs.entries()].filter(([, g]) =>
  g.some(n => isObject(n) && hasType(n, "Article"))
);

/* ── 4. Baseline regression ──────────────────────────────────────────────── */

let baseline;
try {
  baseline = readFileSync(BASELINE, "utf8");
} catch {
  console.error(
    `FAIL: missing ${BASELINE}. Record it before changing code:\n` +
      `  articles=$(grep -rl '#article"' dist --include='*.html' | wc -l)\n` +
      `  pages=$(grep -rL 'http-equiv="refresh"' dist --include='*.html' | wc -l)`
  );
  process.exit(1);
}
const expectedArticles = Number(/articles=(\d+)/.exec(baseline)?.[1]);
const expectedPages = Number(/pages=(\d+)/.exec(baseline)?.[1]);

if (articlePages.length !== expectedArticles) {
  fail(`article pages: expected ${expectedArticles} (baseline), found ${articlePages.length}`);
}
if (realPages.length !== expectedPages) {
  fail(`real pages: expected ${expectedPages} (baseline), found ${realPages.length}`);
}

/* ── 5. Derive siteUrl from the graph itself (never hardcode the domain) ─── */

const anyGraph = [...graphs.values()][0] ?? [];
const websiteNode = anyGraph.find(
  n => isObject(n) && typeof n["@id"] === "string" && n["@id"].endsWith("#website")
);
const siteUrl = websiteNode?.url;
if (typeof siteUrl !== "string" || !siteUrl.endsWith("/")) {
  console.error(`FAIL: could not derive siteUrl from the #website node (got ${siteUrl})`);
  process.exit(1);
}

/** dist/foo/index.html -> https://site/foo/ */
const pageUrlOf = file =>
  siteUrl + relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/");

/* ── 6. The 18 in-scope pages carry the right page-level node ────────────── */

const EXPECTED = [
  ["index.html", "WebPage", ["about", "mainEntity"]],
  ["dau-tu/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["phan-tich/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["dau-tu/co-phieu/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["dau-tu/etf/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["dau-tu/trai-phieu/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["dau-tu/phai-sinh/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["phan-tich/co-ban/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["phan-tich/ky-thuat/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["reviews/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["nha-dau-tu/index.html", "CollectionPage", ["breadcrumb", "mainEntity"]],
  ["about/index.html", "AboutPage", ["breadcrumb", "mainEntity"]],
  ["contact/index.html", "ContactPage", ["breadcrumb", "mainEntity"]],
  ["author/nguyen-viet-loc/index.html", "ProfilePage", ["breadcrumb", "mainEntity", "hasPart"]],
  ["editorial-policy/index.html", "WebPage", ["breadcrumb"]],
  ["corrections-policy/index.html", "WebPage", ["breadcrumb"]],
  ["sources-policy/index.html", "WebPage", ["breadcrumb"]],
  ["disclaimer/index.html", "WebPage", ["breadcrumb"]],
];

let inScopeOk = 0;
for (const [relPath, expectedType, requiredKeys] of EXPECTED) {
  const file = join(DIST, relPath);
  const graph = graphs.get(file);
  if (!graph) {
    fail(`${relPath}: no parsable @graph`);
    continue;
  }
  const pageUrl = pageUrlOf(file);
  const webPageId = `${pageUrl}#webpage`;
  const node = graph.find(n => isObject(n) && n["@id"] === webPageId);
  if (!node) {
    fail(`${relPath}: no top-level node with @id ${webPageId}`);
    continue;
  }

  let ok = true;
  if (!hasType(node, expectedType)) {
    fail(`${relPath}: @type is ${JSON.stringify(node["@type"])}, expected ${expectedType}`);
    ok = false;
  }
  if (!isObject(node.isPartOf) || !String(node.isPartOf["@id"] ?? "").endsWith("#website")) {
    fail(`${relPath}: isPartOf must reference the #website node`);
    ok = false;
  }
  for (const key of requiredKeys) {
    if (!(key in node)) {
      fail(`${relPath}: #webpage missing required key "${key}"`);
      ok = false;
    }
  }
  // A mainEntity/hasPart pointing at #itemlist must resolve to a filled list.
  const pointsAtItemList = ["mainEntity", "hasPart"].some(
    k => isObject(node[k]) && node[k]["@id"] === `${pageUrl}#itemlist`
  );
  if (pointsAtItemList) {
    const list = graph.find(n => isObject(n) && n["@id"] === `${pageUrl}#itemlist`);
    if (!list || !Array.isArray(list.itemListElement) || list.itemListElement.length === 0) {
      fail(`${relPath}: #itemlist missing or empty`);
      ok = false;
    }
  }
  if (ok) inScopeOk++;
}

/* ── 7. Anti-regression: Person defined once, Organization has contactPoint ─ */

const profileFile = join(DIST, "author/nguyen-viet-loc/index.html");
const profileGraph = graphs.get(profileFile);
if (!profileGraph) {
  fail(`author profile page has no parsable @graph`);
} else {
  const personNodes = profileGraph.filter(n => isObject(n) && hasType(n, "Person"));
  if (personNodes.length !== 1) {
    fail(`profile page defines ${personNodes.length} top-level Person nodes, expected exactly 1`);
  }
  const expectedPersonId = `${siteUrl}author/nguyen-viet-loc/#person`;
  if (personNodes[0] && personNodes[0]["@id"] !== expectedPersonId) {
    fail(`profile Person @id is ${personNodes[0]["@id"]}, expected ${expectedPersonId}`);
  }
  const profileNode = profileGraph.find(n => isObject(n) && hasType(n, "ProfilePage"));
  if (!profileNode || profileNode.mainEntity?.["@id"] !== expectedPersonId) {
    fail(`ProfilePage.mainEntity must reference ${expectedPersonId}`);
  }
}

// The Person node must look the same wherever it appears.
const personCarriers = [
  ["profile page", profileGraph],
  ["article page", articlePages[0]?.[1]],
];
for (const [label, graph] of personCarriers) {
  if (!graph) continue;
  const person = graph.find(n => isObject(n) && hasType(n, "Person") && n["@id"]);
  if (!person) {
    fail(`${label}: no top-level Person node`);
    continue;
  }
  if (!String(person.worksFor?.["@id"] ?? "").endsWith("#organization")) {
    fail(`${label}: Person.worksFor must reference the #organization node`);
  }
  if (typeof person.mainEntityOfPage !== "string") {
    fail(
      `${label}: Person.mainEntityOfPage must be a URL string, got ${typeof person.mainEntityOfPage}`
    );
  }
}

const contactGraph = graphs.get(join(DIST, "contact/index.html"));
const contactOrg = contactGraph?.find(
  n => isObject(n) && typeof n["@id"] === "string" && n["@id"].endsWith("#organization")
);
if (!contactOrg?.contactPoint) {
  fail(`contact/: #organization node is missing contactPoint`);
}

/* ── 8. Report ───────────────────────────────────────────────────────────── */

if (failures.length) {
  console.log("");
  for (const f of failures) console.log(`FAIL ${f}`);
  console.log(`\n${failures.length} failure(s).`);
  process.exit(1);
}

console.log(
  `PAGES ${realPages.length} (stub ${stubs.length} skipped) | ARTICLE ${articlePages.length} | PHASE7 ${inScopeOk}/${EXPECTED.length} OK`
);
process.exit(0);
