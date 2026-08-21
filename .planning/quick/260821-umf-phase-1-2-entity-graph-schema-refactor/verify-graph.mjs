#!/usr/bin/env node
// Verify the JSON-LD entity graph of any built page (article or not).
//
// Usage: node verify-graph.mjs dist/path/index.html [more.html ...]
//
// Checks per file:
//   1. Exactly one <script type="application/ld+json"> block.
//   2. That block parses and contains an @graph array.
//   3. Every bare {"@id": ...} reference resolves to a node defined in the graph.
//   4. The graph is connected (no orphan nodes / detached clusters).
//   5. No `dateReviewed` anywhere; worstRating is always 1; the root
//      #organization node keeps the brand name.
//   5d. Pages carrying an Article node must additionally define all four core
//      page nodes (#webpage, #breadcrumb, #primaryimage, #article). Non-article
//      pages (listing, static, profile) legitimately have no article/image node,
//      so this check is scoped to article pages only.
//   6. Shape checks that apply to every page: when a #webpage / #itemlist /
//      #breadcrumb node exists it must be well formed (absolute url, inLanguage,
//      isPartOf; non-empty itemListElement with numeric position + absolute url).
//
// Zero dependencies — plain Node ESM.

import { readFileSync } from "node:fs";

const LD_BLOCK_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

const isObject = v => typeof v === "object" && v !== null && !Array.isArray(v);

/** An object with exactly one key, "@id", is a reference — not a definition. */
const isReference = v => isObject(v) && Object.keys(v).length === 1 && "@id" in v;

/** @type may be a string or an array of strings. */
const hasType = (node, type) => {
  const t = node["@type"];
  return Array.isArray(t) ? t.includes(type) : t === type;
};

/**
 * Walk a value, collecting inline-defined @ids and every @id referenced from
 * within `ownerId`'s subtree.
 */
function walk(value, ownerId, defined, edges) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, ownerId, defined, edges);
    return;
  }
  if (!isObject(value)) return;

  if (typeof value["@id"] === "string") {
    if (isReference(value)) {
      edges.push([ownerId, value["@id"]]);
      return;
    }
    // Multi-key object with an @id: an inline definition.
    defined.add(value["@id"]);
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "@id") continue;
    walk(child, ownerId, defined, edges);
  }
}

function checkFile(file) {
  const errors = [];
  let html;
  try {
    html = readFileSync(file, "utf8");
  } catch {
    return [`cannot read file`];
  }

  const blocks = [...html.matchAll(LD_BLOCK_RE)].map(m => m[1]);
  if (blocks.length !== 1) {
    return [`expected exactly 1 ld+json block, found ${blocks.length}`];
  }

  const raw = blocks[0];
  let doc;
  try {
    doc = JSON.parse(raw);
  } catch (e) {
    return [`ld+json does not parse: ${e.message}`];
  }

  const graph = doc["@graph"];
  if (!Array.isArray(graph)) return [`ld+json has no @graph array`];

  // Collect defined @ids and reference edges.
  const defined = new Set();
  const edges = [];
  for (const node of graph) {
    if (isObject(node) && typeof node["@id"] === "string") {
      defined.add(node["@id"]);
    }
  }
  for (const node of graph) {
    const ownerId = isObject(node) ? node["@id"] : undefined;
    if (typeof ownerId !== "string") continue;
    for (const [key, child] of Object.entries(node)) {
      if (key === "@id") continue;
      walk(child, ownerId, defined, edges);
    }
  }

  // 3. Dangling references.
  const dangling = [...new Set(edges.map(([, to]) => to))].filter(
    id => !defined.has(id)
  );
  if (dangling.length) {
    errors.push(`dangling @id reference(s): ${dangling.join(", ")}`);
  }

  // 4. Connectivity over the undirected reference graph.
  const adjacency = new Map();
  for (const id of defined) adjacency.set(id, new Set());
  for (const [from, to] of edges) {
    if (!adjacency.has(from) || !adjacency.has(to)) continue;
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  }
  const topLevelIds = graph
    .filter(n => isObject(n) && typeof n["@id"] === "string")
    .map(n => n["@id"]);
  if (topLevelIds.length > 0) {
    const seen = new Set([topLevelIds[0]]);
    const queue = [topLevelIds[0]];
    while (queue.length) {
      const current = queue.shift();
      for (const next of adjacency.get(current) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    const unreachable = topLevelIds.filter(id => !seen.has(id));
    if (unreachable.length) {
      errors.push(`graph not connected, orphan node(s): ${unreachable.join(", ")}`);
    }
  }

  // 5a. No invalid dateReviewed property anywhere.
  if (raw.includes("dateReviewed")) {
    errors.push(`found forbidden property "dateReviewed"`);
  }

  // 5b. worstRating must be 1.
  const badWorst = [...raw.matchAll(/"worstRating"\s*:\s*([^,}\s]+)/g)]
    .map(m => m[1])
    .filter(v => v !== "1");
  if (badWorst.length) {
    errors.push(`worstRating must be 1, found: ${badWorst.join(", ")}`);
  }

  // 5c. Root organization keeps the brand name.
  const orgNode = graph.find(
    n => isObject(n) && typeof n["@id"] === "string" && n["@id"].endsWith("#organization")
  );
  if (!orgNode) {
    errors.push(`no root #organization node`);
  } else if (orgNode.name !== "Value Investing") {
    errors.push(
      `root #organization name is "${orgNode.name}", expected "Value Investing"`
    );
  }

  // 5d. Required page nodes exist — article pages only. Listing/static/profile
  // pages have no Article or primary image, so demanding those nodes there
  // would be meaningless; the shape checks below cover them instead.
  const isArticlePage = graph.some(n => isObject(n) && hasType(n, "Article"));
  if (isArticlePage) {
    for (const suffix of ["#webpage", "#breadcrumb", "#primaryimage", "#article"]) {
      if (![...defined].some(id => id.endsWith(suffix))) {
        errors.push(`missing node ending in ${suffix}`);
      }
    }
  }

  // 6. Shape checks for page-level nodes, applied to every page that has them.
  const nodeBySuffix = suffix =>
    graph.find(
      n => isObject(n) && typeof n["@id"] === "string" && n["@id"].endsWith(suffix)
    );

  const isAbsoluteUrl = v => typeof v === "string" && v.startsWith("https://");

  const webPageNode = nodeBySuffix("#webpage");
  if (webPageNode) {
    if (!isAbsoluteUrl(webPageNode.url)) {
      errors.push(`#webpage url must be an absolute https URL, got ${JSON.stringify(webPageNode.url)}`);
    }
    if (!webPageNode.inLanguage) errors.push(`#webpage missing inLanguage`);
    if (!webPageNode.isPartOf) errors.push(`#webpage missing isPartOf`);
  }

  const itemListNode = nodeBySuffix("#itemlist");
  if (itemListNode) {
    const elements = itemListNode.itemListElement;
    if (!Array.isArray(elements) || elements.length === 0) {
      errors.push(`#itemlist itemListElement must be a non-empty array`);
    } else {
      const bad = elements.filter(
        el => !isObject(el) || typeof el.position !== "number" || !isAbsoluteUrl(el.url)
      );
      if (bad.length) {
        errors.push(
          `#itemlist has ${bad.length} entr(ies) missing numeric position or absolute url`
        );
      }
    }
  }

  const breadcrumbNode = nodeBySuffix("#breadcrumb");
  if (breadcrumbNode) {
    const elements = breadcrumbNode.itemListElement;
    if (!Array.isArray(elements) || elements.length === 0) {
      errors.push(`#breadcrumb itemListElement must be a non-empty array`);
    }
  }

  return errors;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node verify-graph.mjs <html-file> [...]");
  process.exit(2);
}

let failed = false;
for (const file of files) {
  const errors = checkFile(file);
  if (errors.length) {
    failed = true;
    console.log(`FAIL ${file}: ${errors.join("; ")}`);
  } else {
    console.log(`PASS ${file}`);
  }
}
process.exit(failed ? 1 : 0);
