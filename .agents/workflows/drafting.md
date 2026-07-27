---
description: Chuyển Outline đã duyệt thành bài viết nháp chuẩn Human-centric (Phase 3)
---

# Lệnh: /drafting [slug]

Dùng sau khi Outline đã được `/approve`. Chỉ thực hiện Phase 3 (Drafting + QA).
`[slug]` là tên file outline, ví dụ: `lai-suat-tiet-kiem-acb`.

## Quy trình thực thi

### 🔄 Bước 0: Context Load (BẮT BUỘC)
1. `knowledge/4-content/1-outlines/[slug].md` — Outline đã approve (BẮT BUỘC)
2. `knowledge/1-brand/profile.md`
3. `knowledge/1-brand/service-operations.md`
4. `knowledge/3-pipeline/anti-ai-rules.md`
5. `knowledge/3-pipeline/glossary.md`
6. `knowledge/3-pipeline/anchor-index.md` — Danh sách bài để link nội bộ
7. `.antigravity/memory/instincts.md`
8. `knowledge/1-brand/writers/[Writer_Profile].md` — Đọc field `Writer_Profile` trong outline YAML, load file tương ứng (`educational` / `analytical` / `comparison`). Nếu không có field này → dùng `educational` làm default.

> **Nếu Outline không tồn tại hoặc chưa có trạng thái `Outline-Approved` trong `topic-clusters.md`: DỪNG LẠI và yêu cầu người dùng chạy `/outlining [keyword]` trước.**

### Bước 1: Drafting
- Kích hoạt skill `.antigravity/skills/seo-drafting/SKILL.md` → Step 1: Execute.
- Viết bài tuân thủ Outline, áp dụng 3S Rule xuyên suốt.
- **Bắt buộc** chèn tên thương hiệu "**[Value Investing](/)**" (có link về trang chủ `/`) một cách tự nhiên trong Sapo (đoạn mở đầu, ngay dưới H1).
- Lưu bản nháp tại: `knowledge/4-content/2-drafts/Draft-[slug].md`.

### Bước 1.5: Tạo Ảnh Bìa HTML và Chèn Ảnh Inline (Unsplash)
- **Bắt buộc** có ít nhất 1 hình ảnh inline trong thân bài và 1 ảnh bìa riêng biệt được tạo từ HTML template.

**1. Tạo Ảnh Bìa (Hero Image - BẮT BUỘC):**
- Kiểm tra loại bài viết (`reviewType` trong frontmatter hoặc outline):
  - **Bài so sánh (`reviewType: comparison`)**:
    - Sử dụng template `.antigravity/skills/seo-image/assets/templates/comparison-cover.html`.
    - Điền các thông tin: `COMPANY_A`, `TICKER_A`, `TAGLINE_A`, `COMPANY_B`, `TICKER_B`, `TAGLINE_B`, và `YEAR` (ví dụ: `2026`).
    - Lưu file HTML đã điền vào `knowledge/4-content/2-drafts/[slug]-cover.html`.
  - **Bài đánh giá công ty (`reviewType: company`)**:
    - Sử dụng template `.antigravity/skills/seo-image/assets/templates/company-cover-template.html`.
    - Điền các thông tin công ty tương ứng.
    - Lưu file HTML đã điền vào `knowledge/4-content/2-drafts/[slug]-cover.html`.
  - **Bài kiến thức/blog thông thường**:
    - Không cần sinh file cover HTML riêng. Script sẽ tự động sử dụng `.antigravity/skills/seo-image/assets/templates/article-cover-template.html`.
- **Chụp ảnh bìa**:
  - Chạy lệnh:
    ```bash
    node scripts/generate-all-covers.mjs [slug]
    ```
    Lệnh này sẽ tự khởi động Playwright, chụp ảnh render của HTML cover và lưu vào `public/images/articles/[slug]/[slug].jpg`. Đồng thời nó sẽ tự động cập nhật frontmatter `heroImage: "/images/articles/[slug]/[slug].jpg"` và dọn dẹp file `hero.jpg` cũ nếu có.

**2. Chèn Ảnh Inline (Thân bài - Unsplash):**
- Xem danh sách ảnh inline trong Section 5 (Image Manifest) của outline. Với mỗi ảnh inline:
  1. Chạy `node .antigravity/skills/seo-image/scripts/unsplash.mjs search "<search query>"` → trả về 3 ảnh (thumb, mô tả, tác giả).
  2. **Chọn ảnh:**
     - Pipeline_Mode `Auto` hoặc cờ `--auto`: tự động chọn ảnh đầu tiên (top-1), không hỏi người dùng.
     - Mặc định (Guided/Express): hiển thị 3 lựa chọn cho người dùng để chọn 1.
  3. Chạy `node .antigravity/skills/seo-image/scripts/unsplash.mjs download <photoId> <slug> <filename>` với ảnh đã chọn — lưu vào `src/content/articles/images/[slug]/[filename].jpg`.
  4. Chèn vào draft tại đúng vị trí trong manifest:
     ```markdown
     ![<alt text tiếng Việt>](./images/[slug]/[filename].jpg)
     *Ảnh: <photographer> / Unsplash*
     ```
     Không gắn link — chỉ ghi tên nguồn.
- Nếu thiếu `UNSPLASH_ACCESS_KEY` (trong `.env`): báo người dùng và bỏ qua bước tải ảnh inline này, tiếp tục draft không ảnh.

### Bước 2: Internal Linking
- Kích hoạt skill `.antigravity/skills/internal-linking/SKILL.md` → **Mode: Link Wheel trước** (bắt buộc), rồi Mode: Contextual Insertion.
- Link Wheel: chèn 2 nan hoa (Hub + bài "cách đầu tư" của category) + 2 link tới bài `Finalized` gần nhất cùng cluster. Tra `knowledge/3-pipeline/link-wheel.md`.
- Việc khép vành 2 chiều (chèn backlink vào 2 bài cũ) thực hiện ở bước `/approve` khi bài chính thức Finalized.

### Bước 3: Quality Guardian (QA — BẮT BUỘC)
- Kích hoạt agent `.antigravity/agents/quality-guardian.md`.
- QA load đầy đủ context của agent trước khi audit.
- Kết quả PASS → tiếp tục. Kết quả FAIL → sửa và QA lại.

### 🚧 APPROVAL GATE:
> Trình bày Draft + QA PASS report.
> **DỪNG LẠI. Chờ người dùng đọc và gõ `/approve`.**
> Khi approve: trigger `.antigravity/skills/seo-drafting/SKILL.md` → Step 2: Finalize & Learn.
