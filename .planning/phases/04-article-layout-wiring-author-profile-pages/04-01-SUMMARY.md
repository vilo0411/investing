---
phase: 04-article-layout-wiring-author-profile-pages
plan: 01
subsystem: content-migration
tags: [content-collection, frontmatter, key-takeaways, eeat]
dependency-graph:
  requires: []
  provides:
    - "keyTakeaways frontmatter populated on all 21 articles"
    - "scripts/backfill-key-takeaways.mjs migration script"
  affects:
    - "src/content/articles/*.md"
    - "Plan 02 (ArticleLayout wiring of <KeyTakeaways> component)"
tech-stack:
  added:
    - "gray-matter ^4.0.3 (devDependency)"
  patterns:
    - "One-off Node ES-module migration script using gray-matter for frontmatter read/write"
key-files:
  created:
    - scripts/backfill-key-takeaways.mjs
  modified:
    - package.json
    - package-lock.json
    - src/content/articles/*.md (all 21 files)
decisions: []
metrics:
  duration: "~15 min"
  completed: 2026-06-13
---

# Phase 4 Plan 01: Backfill Key Takeaways frontmatter Summary

One-off Node migration script using gray-matter relocated each article's `## Key takeaways` body bullet list into a new `keyTakeaways: string[]` frontmatter field across all 21 articles, removing the now-redundant body section.

## What Was Built

1. **`scripts/backfill-key-takeaways.mjs`** — ES module migration script that:
   - Iterates all `.md` files in `src/content/articles/`
   - Parses each file with `gray-matter`
   - Matches `## Key takeaways` section via regex, extracts bullet text verbatim
   - Sets `parsed.data.keyTakeaways` to the bullet array
   - Removes the matched section from the body
   - Writes back via `matter.stringify(parsed, parsed.data, { lineWidth: -1 })` to prevent js-yaml re-wrapping long Vietnamese strings

2. **`gray-matter` ^4.0.3`** added as devDependency (per RESEARCH.md Package Legitimacy Audit — pre-approved, no checkpoint required).

3. **All 21 article files** in `src/content/articles/` now have:
   - `keyTakeaways: string[]` frontmatter (3 bullets each, sourced verbatim from former body section)
   - No `## Key takeaways` heading remaining in the body

## Verification Results

- `node scripts/backfill-key-takeaways.mjs` → 21/21 processed, 0 skipped
- `grep -L "keyTakeaways" src/content/articles/*.md` → empty (all files have the key)
- `grep -l "## Key takeaways" src/content/articles/*.md` → empty (section removed from all bodies)
- `npm run build` → exits 0, "0 errors, 0 warnings" from `astro check`, build completed (60 pages)
- `src/content/articles/benjamin-graham.md` frontmatter: `keyTakeaways` is a 3-element array; the colon-containing bullet ("Biên an toàn là nguyên tắc trung tâm: mua với giá đủ thấp so với giá trị ước tính.") is correctly emitted as a single quoted YAML string (`'Biên an toàn là nguyên tắc trung tâm: mua với giá đủ thấp so với giá trị ước tính.'`), not as a nested YAML mapping. Body's first heading after frontmatter is `## Triết lý đầu tư`.
- `git diff --stat src/content/articles/` → 21 files changed, 344 insertions(+), 363 deletions(-), scoped to `keyTakeaways` frontmatter addition + `## Key takeaways` body section removal. Minor frontmatter key reordering (alphabetical-ish via js-yaml) and quote-style normalization (single quotes for strings needing quoting) occurred as expected gray-matter/js-yaml output behavior — no content rewording.

## Deviations from Plan

None — plan executed exactly as written. The pre-existing build warnings (deprecated `document.execCommand`, `astro(4000)` inline-script warnings in ShareBar/ArticleLayout/BaseLayout/category pages/search) are unrelated to this plan's file scope and were not touched.

## Commits

- `1f70f07` — feat(04-01): add gray-matter and key takeaways backfill script
- `8579872` — feat(04-01): backfill keyTakeaways frontmatter for all 21 articles

## Known Stubs

None.

## Self-Check: PASSED

- FOUND: scripts/backfill-key-takeaways.mjs
- FOUND: .planning/phases/04-article-layout-wiring-author-profile-pages/04-01-SUMMARY.md
- FOUND: commit 1f70f07
- FOUND: commit 8579872
