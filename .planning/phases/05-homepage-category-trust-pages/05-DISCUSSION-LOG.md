# Phase 5: Homepage, Category & Trust Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-13
**Phase:** 5-Homepage, Category & Trust Pages
**Areas discussed:** About vs Author profile, Trust strip vị trí & nội dung, CategoryListing component, Disclaimer page/section

---

## About vs Author profile

| Option | Description | Selected |
|--------|-------------|----------|
| Brand/mission story | Viết lại /about/ thành trang kể về ValueInvesting.com.vn: tại sao site tồn tại, triết lý nội dung, quy trình biên tập tóm tắt, link sang /author/{slug}/ | ✓ |
| Giữ cấu trúc hiện tại, bổ sung credentials/education | Giữ /about/ như bản mở rộng của author profile, chỉ thêm credentials/education | |

**User's choice:** Brand/mission story

| Content focus options | Description | Selected |
|--------|-------------|----------|
| Tại sao site tồn tại + đối tượng đọc giả | Mission, người mới, khác gì nguồn khác | ✓ |
| Quy trình biên tập tóm tắt + link Editorial Policy | Tóm tắt 2-3 bước, link /editorial-policy/ | ✓ |
| Thumbnail/preview author + CTA sang /author/{slug}/ | Card nhỏ avatar/name/role/bio + nút "Xem hồ sơ đầy đủ" | ✓ |
| Số liệu/thống kê site | Stat-stack (số bài, chuyên mục) trong context brand story | ✓ |

**User's choice:** All four selected — complete brief for new About page.
**Notes:** Driven by Phase 4 D-06 concern that /about/ and /author/[slug]/ shouldn't be near-duplicates (currently they share author-hero/author-layout markup).

---

## Trust strip vị trí & nội dung

| Option | Description | Selected |
|--------|-------------|----------|
| Section riêng mới, nằm sau hero | Dải ngang 3-4 tín hiệu tin cậy, mỗi ý link sang trang tương ứng, không xáo trộn hero hiện có | ✓ |
| Nâng cấp hero-trust-panel hiện có | Giữ vị trí trong hero, thêm link cho mỗi trustStat item | |

**User's choice:** Section riêng mới, nằm sau hero

| Link target options | Description | Selected |
|--------|-------------|----------|
| Cả 3: About, Editorial Policy, Disclaimer | Mỗi trụ cột link đến 1 trong 3 trang trust của Phase 5 | ✓ |
| Chỉ About + Editorial Policy | Theo đúng text HOME-02, không thêm Disclaimer | |

**User's choice:** Cả 3: About, Editorial Policy, Disclaimer

---

## CategoryListing component

| Option | Description | Selected |
|--------|-------------|----------|
| Refactor + redesign nhẹ | Extract logic chung thành CategoryListing.astro, giữ cấu trúc tổng thể nhưng áp design tokens mới + Breadcrumb component | ✓ |
| Chỉ extract logic, không đổi UI | CategoryListing.astro với UI giống y nguyên hiện tại | |

**User's choice:** Refactor + redesign nhẹ

| Scope options | Description | Selected |
|--------|-------------|----------|
| Toàn bộ (hero + breadcrumb + listing + sidebar) | Một component duy nhất render toàn bộ phần thân trang, route files chỉ còn getStaticPaths + render | ✓ |
| Chỉ phần listing/grid bài viết | CategoryListing chỉ là grid/list, hero/breadcrumb riêng mỗi route | |

**User's choice:** Toàn bộ (hero + breadcrumb + listing + sidebar)

---

## Disclaimer page/section

| Option | Description | Selected |
|--------|-------------|----------|
| Trang /disclaimer/ độc lập | src/pages/disclaimer.astro với nội dung disclaimer đầy đủ, style giống editorial-policy/corrections-policy | ✓ |
| Thêm <Disclaimer /> section vào các trang hiện có | Không tạo trang mới, chỉ nhúng component vào footer/homepage/about | |

**User's choice:** Trang /disclaimer/ độc lập

| Integration options | Description | Selected |
|--------|-------------|----------|
| <Disclaimer /> vẫn dùng như hiện tại + thêm link sang /disclaimer/ | Component giữ nguyên text ngắn, thêm "Xem chi tiết" link tới trang đầy đủ | ✓ |
| /disclaimer/ độc lập, không đổi <Disclaimer /> | Trang mới với nội dung riêng, không sửa component | |

**User's choice:** <Disclaimer /> vẫn dùng như hiện tại + thêm link sang /disclaimer/

---

## Claude's Discretion

- Exact file location/name for the shared category component (`src/components/CategoryListing.astro` vs a layout file)
- Wording/copy for `/about/` mission statement, trust-strip item labels, and `/disclaimer/` full text (per anti-AI rules, YMYL caution — user reviews after)
- Visual treatment of the trust strip (icon style, card vs plain row)
- Whether homepage featured/latest article sections need changes beyond current implementation

## Deferred Ideas

None — discussion stayed within phase scope.
