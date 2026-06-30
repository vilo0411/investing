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

### Bước 1.5: Chèn ảnh Unsplash (Image Manifest)
- **Bắt buộc** có ít nhất 1 hình ảnh inline trong thân bài và 1 ảnh bìa heroImage riêng biệt được crop tỉ lệ 5:3. Đọc **Section 5 (Image Manifest)** trong outline.
- Với mỗi dòng trong manifest:
  1. Chạy `node .antigravity/skills/seo-image/scripts/unsplash.mjs search "<search query>"` → trả về 3 ảnh (thumb, mô tả, tác giả).
  2. **Chọn ảnh:**
     - Pipeline_Mode `Auto` hoặc cờ `--auto`: tự động chọn ảnh đầu tiên (top-1), không hỏi người dùng.
     - Mặc định (Guided/Express): hiển thị 3 lựa chọn cho người dùng (thumbnail URL + mô tả + tác giả) để chọn 1.
  3. Chạy `node .antigravity/skills/seo-image/scripts/unsplash.mjs download <photoId> <slug> <filename>` với ảnh đã chọn — lưu vào `src/content/articles/images/[slug]/[filename].jpg`.
  4. Chèn vào draft tại đúng vị trí trong manifest:
     ```markdown
     ![<alt text tiếng Việt>](./images/[slug]/[filename].jpg)
     *Ảnh: <photographer> / Unsplash*
     ```
     Không gắn link — chỉ ghi tên nguồn.
- Nếu thiếu `UNSPLASH_ACCESS_KEY` (trong `.env`): báo người dùng và bỏ qua bước này, tiếp tục draft không ảnh.

**Hero Image (BẮT BUỘC):**
- Dùng ảnh `featured-01` đã chọn ở trên (cùng `photoId`), chạy thêm:
  ```bash
  node .antigravity/skills/seo-image/scripts/unsplash.mjs hero <photoId> <slug>
  ```
  Lệnh này tự crop ảnh về tỷ lệ chuẩn 5:3 (1000×600, entropy crop) và lưu vào `public/images/articles/[slug]/hero.jpg`.
- **Lưu ý chọn ảnh**: nếu ảnh `featured-01` có chữ/text lớn trong khung hình (dễ bị cắt mất khi crop về thumbnail nhỏ trên card), nên search thêm 1 query khác không có chữ (ví dụ "finance growth chart") và dùng ảnh đó cho `hero`, thay vì ảnh featured trong bài.
- Khi finalize (Step 2 trong `seo-drafting/SKILL.md`), set `heroImage: "/images/articles/[slug]/hero.jpg"` trong frontmatter — KHÔNG dùng ảnh mặc định category.

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
