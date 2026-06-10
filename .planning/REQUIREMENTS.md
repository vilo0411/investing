# Requirements: ValueInvesting.com.vn — Redesign & EEAT Upgrade

**Defined:** 2026-06-10
**Core Value:** Người đọc và Google phải cảm nhận ngay đây là một nguồn tài chính chuyên nghiệp, đáng tin cậy — từ giao diện tổng thể đến từng bài viết, với thông tin tác giả, nguồn tham khảo và quy trình biên tập rõ ràng.

## v1 Requirements

### Design System (Tokens)

- [ ] **DSGN-01**: Site sử dụng bộ design token mới (color, typography, spacing, radius/shadow, motion) tách thành các file riêng trong `src/styles/tokens/`, import vào `global.css`
- [ ] **DSGN-02**: Tên biến CSS hiện có (`--brand`, `--surface`, `--line`, `--muted`, `--space-*`, `--font-serif`...) được giữ làm alias để không vỡ component cũ
- [ ] **DSGN-03**: Trang bài viết có typography tối ưu cho đọc dài: type scale rõ ràng, line-height thoải mái (~1.7), độ rộng nội dung giới hạn (~65ch)
- [ ] **DSGN-04**: Site dùng bộ font thương hiệu mới (serif/sans), hiển thị đúng dấu tiếng Việt trên các trình duyệt phổ biến
- [ ] **DSGN-05**: Toàn bộ trang trong site (kể cả `search.astro`, trang lỗi, các trang chưa redesign trực tiếp) được audit để không bị vỡ giao diện sau khi đổi token

### EEAT Data & Components

- [ ] **EEAT-01**: Schema nội dung (`content.config.ts`) được mở rộng thêm các field tùy chọn (`citations`, `reviewedBy`, `factCheckedDate`, `keyTakeaways`...) mà không phá vỡ bài viết hiện có
- [ ] **EEAT-02**: Có file dữ liệu tác giả/reviewer tập trung (`src/data/authors.ts`) làm nguồn dữ liệu chung cho AuthorBox, trang tác giả và JSON-LD
- [ ] **EEAT-03**: Component "Key Takeaways" hiển thị box tóm tắt ý chính đầu bài viết, lấy dữ liệu từ section `## Key takeaways` hiện có hoặc field mới trong frontmatter
- [ ] **EEAT-04**: Component "Citation/Fact-check box" hiển thị danh sách nguồn tham khảo và ngày cập nhật cuối cùng ở cuối bài viết
- [ ] **EEAT-05**: AuthorBox được nâng cấp (v2): hiển thị chuyên môn, kinh nghiệm, link đến trang hồ sơ tác giả
- [ ] **EEAT-06**: Có trang hồ sơ tác giả `/author/[slug]` hiển thị thông tin chi tiết về tác giả/reviewer
- [ ] **EEAT-07**: Component breadcrumb navigation hiển thị trên trang bài viết và trang danh mục
- [ ] **EEAT-08**: Component disclaimer/risk-disclosure hiển thị trên các bài viết liên quan đến quyết định tài chính
- [ ] **EEAT-09**: Component bảng so sánh (comparison table) được style nhất quán cho các bài so sánh sản phẩm tài chính
- [ ] **EEAT-10**: Dữ liệu cấu trúc (Key Takeaways, citations) được backfill cho 21 bài viết hiện có dựa trên nội dung sẵn có (không viết lại nội dung chính)

### Article Layout

- [ ] **ARTL-01**: `ArticleLayout.astro` được wiring lại để hiển thị các component mới theo thứ tự: Breadcrumb → Key Takeaways → TOC → Nội dung → Citation box → AuthorBox v2 → Share/Related
- [ ] **ARTL-02**: JSON-LD (Person, Article, dateModified) trên trang bài viết lấy dữ liệu từ `src/data/authors.ts` để đồng nhất với AuthorBox

### Homepage & Category Pages

- [ ] **HOME-01**: Trang chủ redesign với hero section, grid điều hướng danh mục, danh sách bài viết nổi bật/mới nhất
- [ ] **HOME-02**: Trang chủ có "trust strip" — dải hiển thị tín hiệu tin cậy, liên kết đến Editorial Policy, About
- [ ] **CATG-01**: Trang danh mục (`[category].astro` và `dau-tu/[category].astro`) được redesign đồng bộ, lý tưởng qua shared component `CategoryListing`

### Trust Pages

- [ ] **TRST-01**: Trang About mở rộng, giới thiệu chuyên sâu về tác giả/team dựa trên `src/data/authors.ts` (chuyên môn, kinh nghiệm, chứng chỉ)
- [ ] **TRST-02**: Trang Editorial Policy mở rộng với mô tả quy trình fact-check chi tiết, liên kết đến Citation box trên bài viết
- [ ] **TRST-03**: Có trang/section Disclaimer riêng về giới hạn nội dung, không phải lời khuyên tài chính cá nhân hóa

### QA & SEO Verification

- [ ] **QASE-01**: Toàn bộ route hiện có (kể cả các trang không redesign trực tiếp) được kiểm tra visual regression sau khi đổi token
- [ ] **QASE-02**: Lighthouse/Core Web Vitals (đặc biệt CLS) được kiểm tra trên trang bài viết và trang chủ ở cả mobile/desktop
- [ ] **QASE-03**: JSON-LD trên các bài viết mẫu được validate qua Rich Results Test
- [ ] **QASE-04**: Sitemap và cấu trúc URL hiện có không thay đổi (frozen URL contract) — diff sitemap trước/sau

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### EEAT Mở rộng

- **EEAT2-01**: Block "Reviewed by / Fact-checked by" riêng biệt với schema mở rộng
- **EEAT2-02**: Inline citation markers trong nội dung (chỉ áp dụng cho bài mới/cập nhật)
- **EEAT2-03**: Glossary auto-linking cho thuật ngữ chuyên ngành
- **EEAT2-04**: "Cập nhật lần cuối" changelog notes chi tiết theo từng lần sửa

### Pagination & Tương tác

- **PAGE-01**: Pagination cho trang danh mục khi số lượng bài tăng
- **CALC-01**: Calculator tương tác (lãi kép, ROI...)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Viết lại nội dung 21 bài viết hiện có | Phạm vi tập trung vào trình bày/giao diện, không phải content rewrite |
| Migrate sang MDX | Không cần thiết cho các component mới (dùng convention-based extraction); tránh phá vỡ pipeline `/approve` hiện có |
| Tailwind CSS / UI kit | Đi ngược convention hiện tại (CSS custom properties + scoped styles); thêm phụ thuộc không cần thiết |
| Fake trust badge, popup CTA, comment section, market widget real-time | Anti-feature theo research — phản tác dụng với EEAT/YMYL và không phù hợp static site |
| CMS động / backend | Site giữ kiến trúc static Astro |
| Ứng dụng mobile riêng | Chỉ web responsive |
| Hover-tooltip glossary, extended author "track record" pages | Deferred — v2+ |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| DSGN-03 | Phase 1 | Pending |
| DSGN-04 | Phase 1 | Pending |
| DSGN-05 | Phase 1 | Pending |
| EEAT-01 | Phase 2 | Pending |
| EEAT-02 | Phase 2 | Pending |
| EEAT-03 | Phase 3 | Pending |
| EEAT-04 | Phase 3 | Pending |
| EEAT-05 | Phase 3 | Pending |
| EEAT-06 | Phase 4 | Pending |
| EEAT-07 | Phase 3 | Pending |
| EEAT-08 | Phase 3 | Pending |
| EEAT-09 | Phase 3 | Pending |
| EEAT-10 | Phase 4 | Pending |
| ARTL-01 | Phase 4 | Pending |
| ARTL-02 | Phase 4 | Pending |
| HOME-01 | Phase 5 | Pending |
| HOME-02 | Phase 5 | Pending |
| CATG-01 | Phase 5 | Pending |
| TRST-01 | Phase 5 | Pending |
| TRST-02 | Phase 5 | Pending |
| TRST-03 | Phase 5 | Pending |
| QASE-01 | Phase 6 | Pending |
| QASE-02 | Phase 6 | Pending |
| QASE-03 | Phase 6 | Pending |
| QASE-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27/27 ✓
- Unmapped: 0

---
*Requirements defined: 2026-06-10*
*Last updated: 2026-06-10 after roadmap creation*
</content>
