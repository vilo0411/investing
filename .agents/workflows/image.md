---
description: Tạo chiến lược hình ảnh và Gemini prompts cho bài viết đã có draft hoặc finalized
---

# Lệnh: /image [slug]

Kích hoạt Visual Architect + SEO Image Skill để tạo hệ thống hình ảnh cho bài viết.
Output: Gemini prompts sẵn sàng paste — lưu file + show inline.

Thường chạy sau khi Draft được approve hoặc bài đã finalized.

## Quy trình thực thi

### 🔄 Bước 0: Context Load
1. `.antigravity/skills/seo-image/skill.md` — Image skill (brand DNA, templates, QA)
2. `knowledge/4-content/3-finalized/Final-[slug].md` — ưu tiên file final
3. Nếu chưa final: `knowledge/4-content/2-drafts/Draft-[slug].md`
4. Nếu bài đã finalized vào `src/content/articles/[slug].md` thì đọc trực tiếp từ đó
5. `knowledge/4-content/1-outlines/[slug].md` — để hiểu cấu trúc section

### 🔀 Bước 0.5: Detect Review Type

Đọc frontmatter của bài. Nếu có `layoutType: review`, kiểm tra `reviewType`:

| `reviewType` | Hành động bìa |
|---|---|
| `company` | → Branch A: Company Image |
| `comparison` | → Branch B: Comparison HTML Template |
| `listicle` | → Branch C: Unsplash/Gemini bình thường |
| Không có `layoutType: review` | → Branch C: Unsplash/Gemini bình thường |

---

## Branch A — reviewType: company

**Mục tiêu:** Tìm ảnh đại diện/logo của công ty được review.

### A1: Xác định công ty
Đọc `title` và `tags` frontmatter để lấy tên công ty chính xác (ví dụ: "DSC Securities", "VPS Securities").

### A2: Tìm ảnh
Ưu tiên theo thứ tự:
1. **Website chính thức** của công ty → tải banner homepage hoặc logo chính thức
2. **Google Images** → search `[tên công ty] logo transparent` hoặc `[tên công ty] headquarters`
3. **Cafef / VnDirect / SSI Research** → thường có ảnh building/logo chuẩn

Tiêu chí ảnh hợp lệ:
- Minimum 1200×630 px (hoặc crop được về tỉ lệ 1.91:1)
- Có thể nhận diện rõ thương hiệu (logo, màu sắc đặc trưng)
- Không watermark, không ảnh raster mờ

### A3: Báo cáo
Announce cho user:
```
🏢 Branch A — Company Image: [tên công ty]
─────────────────────────────────────────
Nguồn đề xuất: [URL ảnh hoặc hướng dẫn tìm]
Kích thước: [W×H nếu biết]
Ghi chú: [crop/resize nếu cần]

→ Nếu không tìm được ảnh phù hợp, chuyển sang Gemini prompt bên dưới.
```

### A4: Fallback Gemini prompt (nếu không tìm được ảnh thực)
Compose 1 Gemini prompt theo template featured, với concept:
- Corporate headquarters exterior / office building exterior of a Vietnamese securities firm
- Brand colors của công ty (nếu biết)
- Style: Editorial Photo

---

## Branch B — reviewType: comparison

**Mục tiêu:** Tạo cover dạng "A vs B" dùng HTML template.

### B1: Đọc dữ liệu
Từ frontmatter của bài, lấy:
- `title`: để xác định 2 công ty (VD: "TCBS vs SSI")
- `comparisonCriteria`: để hiểu scope so sánh (dùng làm tagline)

### B2: Fill template
Mở template tại `.antigravity/skills/seo-image/assets/templates/comparison-cover.html`.

Điền các placeholder sau:

| Placeholder | Giá trị |
|---|---|
| `COMPANY_A` | Tên đầy đủ công ty A (VD: "TCBS") |
| `TICKER_A` | Viết tắt 2-4 ký tự (VD: "TC") |
| `TAGLINE_A` | 1 điểm mạnh nổi bật (VD: "Phí 0% · Công cụ phân tích") |
| `LOGO_URL_A` | URL logo nếu tìm được (bỏ qua nếu dùng monogram) |
| `COMPANY_B` | Tên đầy đủ công ty B |
| `TICKER_B` | Viết tắt 2-4 ký tự |
| `TAGLINE_B` | 1 điểm mạnh nổi bật |
| `LOGO_URL_B` | URL logo nếu tìm được |
| `YEAR` | Năm hiện tại (VD: "2026") |

### B3: Save + Báo cáo
1. **SAVE** HTML đã điền vào `knowledge/4-content/2-drafts/[slug]-cover.html`
2. **SHOW** preview dưới dạng code block để user review
3. Hướng dẫn user screenshot thành ảnh:
   - Mở file HTML trong Chrome → `Cmd+Shift+P` → "Capture screenshot" → chọn "Full size"
   - Hoặc dùng browser-to-image tool (Puppeteer, screely.com)
   - Target output: 1200×630 px JPG/PNG

### B4: Inline images
Sau khi cover xong, tiếp tục Branch C bình thường cho các ảnh **inline** (không áp dụng HTML template cho inline).

---

## Branch C — Unsplash / Gemini bình thường

Áp dụng cho: `reviewType: listicle`, bài thường (không có `layoutType: review`).

### Bước 1: Phân tích bài viết
- Xác định: topic chính, tone bài, các H2 section chính.
- Xác định: bài có bảng so sánh / how-to / timeline không? → quyết định có cần infographic.
- Chọn **Style Option** phù hợp từ skill (Editorial Photo / Abstract Finance / Flat Illustration).

### Bước 2: Lập Image Manifest
Quyết định số lượng và vị trí ảnh, announce cho user:

```
📸 Image Manifest — [slug]
Style: [style đã chọn]
─────────────────────────────
featured-01: [concept ngắn] → đầu bài
inline-01:   [concept ngắn] → dưới H2 "[tên section]"
inline-02:   [concept ngắn] → dưới H2 "[tên section]"
[infographic-01: nếu cần]
```

### Bước 3: Compose Gemini Prompts
- Dùng templates trong `.antigravity/skills/seo-image/skill.md`.
- Điền Brand DNA block + Image Spec + Content + Negative cho từng ảnh.
- Prompt bằng **tiếng Anh** — Imagen cho kết quả tốt nhất với English prompts.
- 1 prompt = 1 ảnh (không mega prompt).

### Bước 4: Save + Show
1. **SAVE** toàn bộ vào `knowledge/4-content/2-drafts/[slug]-image-prompts.md`
2. **SHOW** từng prompt trong code block — user copy paste thẳng vào Gemini

### Bước 5: QA Checklist
Sau khi user nhận ảnh về từ Gemini, chạy QA Checklist từ skill file.
Fail bất kỳ điểm → hướng dẫn user câu regen cụ thể.
