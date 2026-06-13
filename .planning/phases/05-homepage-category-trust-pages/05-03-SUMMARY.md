---
phase: 05-homepage-category-trust-pages
plan: 03
subsystem: trust-pages
tags: [about-page, eeat, content-strategy]
dependency-graph:
  requires: []
  provides: [about-page-mission-story]
  affects: [src/pages/about.astro]
tech-stack:
  added: []
  patterns:
    - "Reused .start-list/.start-item/.start-number pattern from index.astro for editorial process steps (collapsed to 2-3 columns via auto-fit)"
    - "New .author-preview-card / .author-avatar-small / .author-role-small / .author-bio-excerpt / .preview-cta classes for a slimmed-down author teaser distinct from /author/[slug]/"
    - "Reframed .stat-stack to 2-column grid with only article/category counts"
key-files:
  created: []
  modified:
    - src/pages/about.astro
decisions:
  - "Dropped 'Năm cập nhật hồ sơ' stat entirely per D-03 — only articleCount and categoryCount remain"
  - "Editorial process steps are non-link .start-item divs (no per-step target page exists), reusing the visual pattern but not the anchor semantics"
metrics:
  duration: "~15 min"
  completed: "2026-06-13"
---

# Phase 5 Plan 3: About Page Rewrite Summary

Rewrote `src/pages/about.astro` from a near-duplicate of `/author/[slug]/` into a distinct brand/mission story page covering why the site exists, a 2-3 step editorial process summary, an author preview card, and a 2-stat content-scale section.

## What Was Built

`src/pages/about.astro` now has four sections:

1. **Mission hero** (`.page-hero`) — `<h1>Vì sao ValueInvesting.com.vn ra đời</h1>` with a lead paragraph explaining the audience (người mới bắt đầu đầu tư tại Việt Nam) and the no-recommendation / source-based positioning, following anti-AI rules (no "Trong kỷ nguyên số" openings, no emphatic quote marks).
2. **Editorial process summary** (`.section` with `.start-list`/`.start-item`/`.start-number`) — 3 steps (Nghiên cứu & viết theo nguồn / Rà soát nội dung & rủi ro / Cập nhật định kỳ), followed by a link "Xem chính sách biên tập đầy đủ" to `/editorial-policy/`.
3. **Author preview card** (`.author-preview-card`) — 64px avatar-initial circle, name, role, 2-line clamped bio excerpt, and "Xem hồ sơ đầy đủ" CTA linking to `/author/${author.slug}/`. Strictly excludes credentials, expertise, experience, moneyPerspective, education, publishedIn.
4. **Site stats** ("Quy mô nội dung") — 2-entry `.stat-stack` (articleCount, categoryCount), dropped the "Năm cập nhật hồ sơ" / 2026 stat.

The `<style>` block was reduced from the original ~420-line file to ~250 lines, removing all dossier-specific CSS (`.author-hero*`, `.author-identity`, `.author-avatar-large`, `.expertise-panel`, `.quote-block`, `.bio-section`, `.latest-section`, `.latest-author-*`, `.author-sidebar`, old `.profile-card`, `.published-list`, `.profile-links`).

## Verification

- `npm run build` exits 0, 61 pages built, 0 errors/0 warnings (only pre-existing unrelated warnings in other files)
- `dist/about/index.html` contains "Xem hồ sơ đầy đủ" and does NOT contain "Chứng chỉ", "Học vấn", "Đã xuất bản tại", "Quan điểm về đầu tư"
- `src/pages/about.astro` contains zero occurrences of `.author-hero`, `.author-layout`, `.author-sidebar`, `.expertise-panel`, `.quote-block`, `moneyPerspective`, `publishedIn`, `author.credentials`, `author.expertise`, `author.education`

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check

- FOUND: src/pages/about.astro
- FOUND: e439790 (feat(05-03) commit)
