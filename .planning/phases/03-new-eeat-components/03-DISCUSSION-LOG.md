# Phase 3: New EEAT Components - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-12
**Phase:** 3-New EEAT Components
**Areas discussed:** Key Takeaways, Citation/Fact-check box, AuthorBox v2, Comparison table

---

## Key Takeaways — extraction & style

| Option | Description | Selected |
|--------|-------------|----------|
| Chỉ nhận props (Phase 4 wire data) | Component nhận `items: string[]`, không tự parse markdown body | ✓ |
| Xây sẵn remark plugin trong Phase 3 | Build cả component và remark plugin extract '## Key takeaways' | |

| Option | Description | Selected |
|--------|-------------|----------|
| Box viền màu + icon checklist | border-left accent, title, item có icon ✓ | ✓ |
| Box nền màu nhạt đồng bộ token | Nền nhạt, không border nặng, bullet thường | |

| Option | Description | Selected |
|--------|-------------|----------|
| Không render gì (component trả null) | items=[] → return null | ✓ |
| Reserve space (placeholder ẩn) để tránh CLS | Vẫn chiếm khung container rỗng | |

**User's choice:** Props-only, border-left + icon checklist box, return null khi rỗng.
**Notes:** D-03 ghi chú khác biệt nhẹ với cách diễn đạt "reserved space" trong ROADMAP — cần planner xác nhận cách diễn giải.

---

## Citation/Fact-check box — data model hiển thị

| Option | Description | Selected |
|--------|-------------|----------|
| Render sources như list tên nguồn (không link) | Nhận cả `sources?` và `citations?`, render tương ứng | ✓ |
| Chỉ nhận citations, không xử lý sources | Box không hiển thị cho 21 bài cũ chưa có citations | |

| Option | Description | Selected |
|--------|-------------|----------|
| Fallback hiển thị `updatedDate` | factCheckedDate rỗng → show "Cập nhật lần cuối: {updatedDate}" | ✓ |
| Không hiển thị dòng ngày nếu factCheckedDate rỗng | Chỉ show khi có factCheckedDate | |

| Option | Description | Selected |
|--------|-------------|----------|
| Box riêng, giống pattern AuthorBox (border-left + surface) | Đặt cuối content, trước AuthorBox v2 | ✓ |
| Dải ngang nhỏ, gọn hơn | border-top mỏng, font nhỏ | |

**User's choice:** Hỗ trợ cả sources (legacy) và citations (mới); fallback updatedDate; style AuthorBox pattern.

---

## AuthorBox v2 — phạm vi nâng cấp

| Option | Description | Selected |
|--------|-------------|----------|
| Thêm credentials + experience, link → /author/[slug] | Bổ sung trên nền v1 hiện có | ✓ |
| Giới thiệu layout 2 cột/expanded card | Redesign toàn diện | |

| Option | Description | Selected |
|--------|-------------|----------|
| Ẩn hoàn toàn khu vực credentials | credentials=[] → không render heading/khu vực | ✓ |
| Hiển thị fallback text | "Thông tin chứng chỉ đang được cập nhật" | |

| Option | Description | Selected |
|--------|-------------|----------|
| Vẫn link /author/{slug}, chấp nhận 404 tạm | Link đúng thiết kế cuối, Phase 4 build trang | ✓ |
| Tạm giữ link /about/, Phase 4 đổi sang /author/{slug} | Tránh 404, dùng `profileHref` prop | |

**User's choice:** Bổ sung credentials/experience trên nền v1, ẩn khu vực rỗng, link thẳng /author/{slug}.

---

## Comparison table — kiến trúc component

| Option | Description | Selected |
|--------|-------------|----------|
| Astro component với structured props | `<ComparisonTable rows={} columns={} />` | ✓ |
| CSS style cho markdown table chuẩn | Style `<table>` trong content .md | |

| Option | Description | Selected |
|--------|-------------|----------|
| Scroll ngang (overflow-x: auto) trong wrapper | Giữ cấu trúc table, bọc wrapper scroll | ✓ |
| Stack thành card trên mobile | Mỗi row thành card label:value | |

| Option | Description | Selected |
|--------|-------------|----------|
| Header nổi bật màu brand + zebra rows | nền var(--color-brand-900), zebra striping | ✓ |
| Tối giản: border mỏng, không màu nền mạnh | Header chỉ đậm font + border-bottom | |

**User's choice:** Structured Astro component, overflow-x scroll wrapper, header brand color + zebra rows.
**Notes:** Flagged for research — content collection hiện dùng type "content" (.md); cần xác nhận khả năng dùng Astro component trong nội dung, hoặc cần chuyển sang MDX.

---

## Claude's Discretion

- Breadcrumb navigation component — implement theo design tokens, style đồng bộ AuthorBox/Citation box pattern, hoạt động cho cả article và category page contexts.
- Disclaimer/risk-disclosure component — wording theo `.antigravity/rules/content-anti-ai.md`, YMYL-appropriate, user review sau.
- Tên prop, cấu trúc file, chi tiết CSS theo conventions hiện có.

## Deferred Ideas

None — discussion stayed within phase scope.
