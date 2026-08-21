---
phase: quick-260821-umf
plan: 01
subsystem: seo-schema
tags: [json-ld, schema-org, eeat, astro, refactor]
requires: []
provides:
  - "src/lib/schema.ts — single source of truth for article/review JSON-LD"
  - "BaseLayout schemaNodes prop — one @graph per page"
affects:
  - src/layouts/BaseLayout.astro
  - src/layouts/ArticleLayout.astro
  - src/layouts/ReviewLayout.astro
tech-stack:
  added: []
  patterns:
    - "Pure TS builder module in src/lib/, consumed by .astro layouts"
    - "Data flows up via prop (not head slot) so one @graph can be merged"
key-files:
  created:
    - src/lib/schema.ts
    - .planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs
  modified:
    - src/layouts/BaseLayout.astro
    - src/layouts/ArticleLayout.astro
    - src/layouts/ReviewLayout.astro
decisions:
  - "FAQPage kept as its own node (#faq) linked via WebPage.hasPart — preserves Google FAQ eligibility without dual-typing WebPage"
  - "Graph merged via BaseLayout prop schemaNodes, not the head slot (slots concatenate HTML, they cannot merge data)"
  - "Company review WebPage.mainEntity is an array [#article, #review] so both entities have in-degree >= 1"
  - "Person @id left at {site}author/{slug}/#person — namespace migration is out of scope (Phase 4)"
metrics:
  duration: ~35m
  tasks: 3
  files-changed: 5
  completed: 2026-08-21
---

# Quick 260821-umf: Entity Graph Schema Refactor (Phase 1+2) Summary

Gộp 4 khối JSON-LD rời rạc trên mỗi trang bài viết thành một `@graph` liên thông duy nhất do `src/lib/schema.ts` sinh ra, đồng thời sửa 4 lỗi P0 làm hỏng entity của brand và mất tín hiệu fact-check YMYL.

## Kết quả

| Hạng mục | Trước | Sau |
|---|---|---|
| Khối `application/ld+json` / trang bài viết | 4 | **1** |
| Node mồ côi (BreadcrumbList, FAQPage, ImageObject) | 3 cụm tách rời | **0** |
| `@id` reference không resolve được | có | **0** |
| `astro check` | 0 errors / 0 warnings / 20 hints | **0 errors / 0 warnings / 14 hints** |
| Bài viết build ra | 122 | **122** |

## 4 lỗi P0 đã sửa

1. **P0-1 — Ban biên tập ghi đè entity brand.** `reviewedBy` trước đây dùng lại đúng `@id` `{site}#organization` nhưng gắn `name: "Ban biên tập Value Investing"` và `url: /editorial-policy/`, khiến node Organization gốc bị ghi đè tên và URL. Nay ban biên tập là Organization riêng `@id {site}#organization/ban-bien-tap` với `parentOrganization` trỏ về gốc. Node gốc giữ nguyên `name: "Value Investing"`, `url: https://valueinvesting.com.vn/`.
2. **P0-2 — `dateReviewed` không phải property schema.org.** Đã bỏ khỏi Article; ngày fact-check nay là `WebPage.lastReviewed` (property hợp lệ). Đã xác nhận trên dist: `etf-la-gi` có `lastReviewed: 2026-06-21`, `dsc-vs-ssi` có `2026-08-15`.
3. **P0-3 — LinkedIn cá nhân nằm trong `Organization.sameAs`.** Đã bỏ `sameAs` khỏi Organization; link cá nhân chỉ còn trên node `Person`.
4. **P0-4 — `worstRating: 0`.** Thang Rating nay là `bestRating: 5` / `worstRating: 1`.

## Cấu trúc graph sau refactor

Mọi trang có 3 node cấp site (`Organization`, `Organization/ban-bien-tap`, `WebSite`). Trang bài viết bổ sung: `Person` → `BreadcrumbList` → `ImageObject` → `WebPage` → `Article` → (`FAQPage` + `Question[]`) → (`Review` chỉ với company review).

`WebPage` (`#webpage`) là node trục: giữ `url`, trỏ `breadcrumb`, `primaryImageOfPage`, `mainEntity`, `hasPart` (FAQ), `reviewedBy`, `lastReviewed`. Nhờ vậy BreadcrumbList / ImageObject / FAQPage không còn mồ côi.

Node `Article` trở lại `"@type": "Article"` thuần (chuỗi, không phải mảng `["Article","Review"]`); thông tin review chuyển sang node `Review` riêng `#review`.

## Verification thực tế (đã chạy, không phải suy đoán)

`npm run build` chạy xanh: `astro check` **0 errors / 0 warnings / 14 hints**, build **266 page(s) in 4.61s**. Hints còn lại là cảnh báo `is:inline` trên các trang author/category — nằm ngoài scope, không đụng tới.

Script `verify-graph.mjs` kiểm tra: đúng 1 khối ld+json, mọi `{"@id"}` reference resolve tới node có thật, graph liên thông (BFS trên đồ thị vô hướng), không có `dateReviewed`, `worstRating` luôn = 1, node `#organization` giữ đúng tên brand, và tồn tại đủ `#webpage` / `#breadcrumb` / `#primaryimage` / `#article`.

Kết quả trên 3 trang bắt buộc:

```
PASS dist/dau-tu/etf/etf-la-gi/index.html          (bài thường,    12 nodes)
PASS dist/reviews/review-dnse-securities/index.html (company review, 12 nodes)
PASS dist/reviews/dsc-vs-ssi/index.html            (comparison,     11 nodes)
```

Số khối `application/ld+json` đếm được trên từng trang: **1 / 1 / 1**.

**Mở rộng ngoài yêu cầu:** đã chạy verifier trên **toàn bộ 122** trang bài viết trong `dist/` (`grep -rl '#article"' dist --include=index.html`) → **122 PASS, 0 FAIL, exit 0**. Số bài build khớp đúng 122 file `src/content/articles/*.md`.

**Negative test của chính verifier** (để chắc nó không pass rỗng): tạo 4 fixture hỏng từ trang DNSE — thêm node mồ côi, thêm dangling reference, đặt `worstRating: 0` + đổi tên `#organization`, và nhân đôi khối ld+json. Verifier báo FAIL đúng cả 4 trường hợp và `exit=1`.

Kiểm tra thủ công trang company review xác nhận: `Review` node có `worstRating: 1`, `ratingValue: 4.3`, `isPartOf` → `#webpage`; `WebPage.mainEntity` là mảng `[#article, #review]`; `Organization` gốc có `name: "Value Investing"` và không còn key `sameAs`.

## Deviations from Plan

None — plan executed exactly as written.

Một chi tiết nhỏ đáng ghi nhận: câu chữ trong JSDoc của `src/lib/schema.ts` phải viết lại để không chứa literal `dateReviewed`, vì gate verify của Task 1 chỉ lọc comment dạng `//` chứ không lọc comment block `/** */`. Đây là chỉnh câu comment, không đổi hành vi code.

## Known Stubs

Không có. Không có giá trị hardcode rỗng, placeholder hay component thiếu data source nào được đưa vào.

## Ngoài scope (giữ nguyên có chủ ý)

- `src/pages/author/[slug].astro`, `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro`, `src/pages/phan-tich/[category].astro` vẫn phát 2 khối ld+json qua `<slot name="head" />`. Yêu cầu "1 khối" chỉ áp dụng cho trang bài viết; `<slot name="head" />` trong BaseLayout được giữ nguyên cho các trang này.
- Không đổi `src/content.config.ts`, không đổi `@id` pattern của Person, không thêm dependency nào.

## Self-Check: PASSED

Files created — đã xác nhận tồn tại trên đĩa:
- `src/lib/schema.ts`
- `.planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs`

Commits — đã xác nhận có trong `git log`:
- `9a0103f` feat(quick-260821-umf): add shared JSON-LD entity graph builder
- `1825a69` feat(quick-260821-umf): emit one JSON-LD graph from BaseLayout
- `29a4614` feat(quick-260821-umf): split Review node out of ReviewLayout Article

`git diff --diff-filter=D HEAD~3 HEAD` → rỗng (không xoá nhầm file nào). `git status` chỉ hiện thay đổi trong `src/lib/`, 3 layout, và thư mục plan — không đụng `knowledge/`, `.antigravity/`, hay `src/content/articles/`.
