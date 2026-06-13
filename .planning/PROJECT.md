# ValueInvesting.com.vn — Redesign & EEAT Upgrade

## What This Is

ValueInvesting.com.vn là một website SEO tài chính tại Việt Nam, xây dựng trên Astro (static site), cung cấp nội dung giáo dục đầu tư bằng tiếng Việt theo phong cách Investopedia và NerdWallet. Milestone này tập trung làm lại toàn bộ design system và trải nghiệm đọc, đồng thời tăng cường tín hiệu E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) — yếu tố sống còn với nội dung YMYL (Your Money, Your Life).

## Core Value

Người đọc và Google phải cảm nhận ngay đây là một nguồn tài chính **chuyên nghiệp, đáng tin cậy** — từ giao diện tổng thể đến từng bài viết, với thông tin tác giả, nguồn tham khảo và quy trình biên tập rõ ràng.

## Requirements

### Validated

- ✓ Astro static site với content collection cho bài viết (Zod schema: title, description, category, dates, readingTime, faq, sources...) — existing
- ✓ Cấu trúc điều hướng theo categories (Đầu tư, Kiến thức...) với routing `[category]/[slug]` — existing
- ✓ Trang bài viết có AuthorBox, TOC, ShareBar, RelatedArticles — existing
- ✓ Trang About và Editorial Policy đã tồn tại (nội dung cơ bản) — existing
- ✓ SEO setup: astro-seo, sitemap, redirects cho URL cũ — existing
- ✓ Brand identity hiện tại: navy + serif/sans, design tokens trong `global.css` — existing (sẽ được làm lại)
- ✓ Component mới: "Key Takeaways" — box tóm tắt ý chính đầu bài viết (Phase 3)
- ✓ Component mới: Bảng so sánh / data table cho bài so sánh sản phẩm tài chính (Phase 3)
- ✓ Component mới: Fact-check / Citation box — hiển thị nguồn tham khảo, ngày cập nhật, inline citation (Phase 3)
- ✓ Component mới: Breadcrumb, Disclaimer (Phase 3)
- ✓ Nâng cấp Author Box — chuyên môn, chứng chỉ, kinh nghiệm hiển thị rõ ràng hơn (Phase 3, component standalone — chưa wiring vào ArticleLayout production, xem Phase 4)

### Active

- [ ] Làm lại design system: màu sắc, typography, spacing, design tokens — phong cách chuyên nghiệp, đáng tin cậy cho YMYL finance
- [ ] Redesign trang chủ (Homepage) — điều hướng rõ ràng đến các chuyên mục, thể hiện uy tín thương hiệu
- [ ] Redesign trang danh mục/listing (category pages)
- [ ] Redesign trải nghiệm đọc bài viết: typography, layout, spacing, khoảng cách dòng tối ưu cho đọc dài
- [ ] Nâng cấp trang About — giới thiệu chuyên sâu hơn về tác giả/đội ngũ và chuyên môn
- [ ] Nâng cấp trang Editorial Policy — quy trình biên tập, fact-check, độc lập biên tập rõ ràng hơn (chuẩn EEAT)
- [ ] Wiring các component EEAT mới (KeyTakeaways, CitationBox, AuthorBox v2, Breadcrumb, Disclaimer, ComparisonTable) vào ArticleLayout production + trang author profile (Phase 4)

### Out of Scope

- Viết lại nội dung các bài viết hiện có — chỉ thay đổi trình bày/giao diện, giữ nguyên nội dung
- CMS động / backend — site giữ nguyên kiến trúc static Astro
- Ứng dụng mobile riêng — chỉ web responsive

## Context

- Stack: Astro 5.9.3, TypeScript strict, content collections (Zod schema), `astro-seo`, `@astrojs/sitemap`, static build → `dist/`
- Codebase đã có codebase map tại `.planning/codebase/` (ARCHITECTURE, STACK, CONVENTIONS, STRUCTURE, INTEGRATIONS, TESTING, CONCERNS)
- Component hiện có: `AuthorBox.astro`, `ShareBar.astro`, `TOC.astro`, `RelatedArticles.astro`, `ArticleList.astro`
- Trang hiện có: `about.astro`, `editorial-policy.astro`, trang chủ, category listing, article detail
- Design tokens hiện tại nằm trong `src/styles/global.css` (CSS custom properties: `--brand`, `--surface`, `--line`, `--muted`, `--radius-lg`, `--font-serif`, ...) — sẽ được thay thế bằng bộ token mới
- Tham khảo phong cách: Investopedia, NerdWallet — đặc biệt là layout bài viết, key takeaways box, author credibility signals, citation/fact-check

## Constraints

- **Tech stack**: Phải tiếp tục dùng Astro + content collections hiện có — không đổi sang framework khác
- **Content schema**: Schema Zod hiện tại (`src/content.config.ts`) cần được giữ tương thích hoặc mở rộng có kiểm soát (không phá build các bài viết hiện có)
- **Domain**: Nội dung tài chính Việt Nam — YMYL, cần thận trọng về tuyên bố/khuyến nghị (theo `.antigravity/rules/`)
- **Output ngôn ngữ**: Toàn bộ UI/nội dung tiếng Việt

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Làm lại toàn bộ design system thay vì giữ brand cũ | Brand hiện tại chưa truyền tải sự chuyên nghiệp/tin cậy cần thiết cho YMYL finance | — Pending |
| Ưu tiên redesign Homepage, Category, Article, About/Editorial Policy | Đây là các trang ảnh hưởng trực tiếp đến trải nghiệm đọc và tín hiệu EEAT | — Pending |
| Thêm 3 component mới: Key Takeaways, Comparison Table, Fact-check/Citation box | Mô phỏng theo Investopedia/NerdWallet, lấp khoảng trống UI hiện tại | Validated in Phase 4 — Key Takeaways và Citation box đã wired vào ArticleLayout cho toàn bộ 21 bài viết; Comparison Table vẫn pending |
| Giữ nguyên nội dung bài viết hiện có | Tập trung vào trình bày/giao diện, tránh phạm vi quá rộng | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-13 after Phase 4 completion*
