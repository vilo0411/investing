---
phase: 05-homepage-category-trust-pages
plan: 04
subsystem: trust-pages
tags: [disclaimer, editorial-policy, eeat, trust]
requires: []
provides:
  - "/disclaimer/ standalone page (TRST-03)"
  - "Disclaimer.astro 'Tìm hiểu thêm' link to /disclaimer/"
  - "editorial-policy.astro fact-check + CitationBox sections (TRST-02)"
affects:
  - src/pages/disclaimer.astro
  - src/components/Disclaimer.astro
  - src/pages/editorial-policy.astro
tech-stack:
  added: []
  patterns:
    - "article-header + article-container.prose pattern reused for new standalone page"
key-files:
  created:
    - src/pages/disclaimer.astro
  modified:
    - src/components/Disclaimer.astro
    - src/pages/editorial-policy.astro
decisions: []
metrics:
  duration_min: 12
  completed: 2026-06-13
---

# Phase 5 Plan 04: Disclaimer Page & Editorial Policy Expansion Summary

Created a standalone `/disclaimer/` legal/educational page and linked it from the inline `<Disclaimer />` component, while expanding `/editorial-policy/` with fact-check process detail and a CitationBox description.

## What Was Built

### Task 1: src/pages/disclaimer.astro
New page following the exact `.article-header` + `.article-container.prose` pattern from `corrections-policy.astro`. Four sections:
- "Phạm vi nội dung" — educational scope, no trading signals
- "Không phải lời khuyên đầu tư cá nhân hóa" — no personalized advice, not brokerage
- "Rủi ro đầu tư" — investment risk, reader responsibility
- "Liên hệ và phản hồi" — links to `/corrections-policy/`

Lead copy matches UI-SPEC exactly: "Nội dung trên ValueInvesting.com.vn chỉ mang tính giáo dục và không phải lời khuyên đầu tư cá nhân hóa."

### Task 2: Disclaimer.astro + editorial-policy.astro
- `src/components/Disclaimer.astro`: added `<a class="disclaimer-link" href="/disclaimer/">Tìm hiểu thêm</a>` inside the existing `<aside class="disclaimer">`, after `<span>{text}</span>`. Added `.disclaimer-link` CSS rule relying on existing `display: grid` layout. `Props { text?: string }` interface and `text = site.disclosure` default unchanged — fully additive.
- `src/pages/editorial-policy.astro`: appended two new `<h2>` sections after "Độc lập biên tập":
  - "Quy trình fact-check chi tiết" — concrete fact-check steps (đối chiếu số liệu/định nghĩa với nguồn gốc, rà soát khi quy định thay đổi)
  - "Hộp nguồn tham khảo trên từng bài viết" — describes the `<CitationBox />` rendered output (Nguồn tham khảo list + "Cập nhật lần cuối"/"Kiểm tra nguồn lần cuối" date), no new component instance added

## Verification

- `npm run build` exits 0, 62 pages built
- `dist/disclaimer/index.html` exists
- `dist/editorial-policy/index.html` contains "Hộp nguồn tham khảo trên từng bài viết"
- `<Disclaimer />` usages in `src/pages/preview/eeat-components.astro` (both `<Disclaimer />` and `<Disclaimer text="..." />`) still compile — prop signature unchanged

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

- FOUND: src/pages/disclaimer.astro
- FOUND: src/components/Disclaimer.astro (modified)
- FOUND: src/pages/editorial-policy.astro (modified)
- FOUND commit bdf7e84 (Task 1)
- FOUND commit 388a8e6 (Task 2)
