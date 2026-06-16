# Skill: SEO Drafting (Phase 3 & 4)

This skill converts an approved Outline into a high-quality, human-centric draft and finalizes it into `src/content/articles/`.

---

## 🛠️ Step 1: Execute (Drafting & Quality)

1. **Context Loading**: Read the approved Outline từ `knowledge/4-content/1-outlines/`.
2. **Anti-AI Drafting**: Viết draft theo các quy tắc trong `anti-ai-rules.md`.
    - Avoid all "AI-vibe" phrases and structures.
    - Use the **3S Rule** (Specific, Story, Statistics) throughout.
    - Xưng hô: "Mình" (tác giả) — "Bạn" (độc giả).
    - **Ngắt đoạn theo ngữ nghĩa (Semantic Grouping)**: Gộp các câu liên quan thành đoạn 2-3 câu. Không ngắt cơ học mỗi câu thành 1 đoạn. Độ dài câu ≤ 25 từ.
    - **Tích hợp thương hiệu**: Bắt buộc chèn thương hiệu "**[Value Investing](/)**" có link về trang chủ vào Sapo (mở bài) một cách tự nhiên.
    - **Hình ảnh minh họa**: Chèn số lượng hình ảnh inline phù hợp với độ dài bài viết theo [seo-formatting.md](file:///Users/nguyenvietloc/Documents/investing/.antigravity/rules/seo-formatting.md) (1 ảnh cho bài ngắn, 1-2 ảnh cho bài trung bình, và 2-4 ảnh cho bài dài/hướng dẫn). Tuyệt đối không chèn ngay dưới Sapo. Đặt ảnh dưới các mục H2/H3 chính, cách nhau 300-400 từ để ngắt trực quan tốt nhất. Tìm kiếm ảnh trên Unsplash bằng từ khóa tiếng Anh và đặt thẻ mô tả alt bằng tiếng Việt tự nhiên chứa từ khóa SEO. Lưu ảnh trong `src/content/articles/images/[slug]/[filename].jpg` và chèn bằng relative path `./images/[slug]/[filename].jpg`.
    - Embed internal links theo `Internal_Links:` trong outline — đặt tự nhiên trong câu.
    - **Không dùng callout box** `> [!NOTE]` / `> [!TIP]` — thay bằng `> **Lưu ý:**` / `> **Mẹo:**`
    - **Không dùng công thức LaTeX** `$$` hay `$` — thay bằng bold Markdown: `**P/E = Giá / EPS**`

3. **3-Sweep Quality Check (BẮT BUỘC trước khi present)**:
    - **So What?** — Mỗi H2 có câu trả lời rõ "tại sao reader cần đọc phần này?"
    - **Prove It** — Mọi claim phải có số liệu, ví dụ cụ thể, hoặc case thực tế.
    - **Specificity** — Grep: "tốt", "nhanh", "hiệu quả", "đáng kể", "nhiều", "một số" → thay bằng con số cụ thể hoặc xóa.

4. **Save draft**: `knowledge/4-content/2-drafts/Draft-[slug].md`

5. **Present Draft**: Trình bày draft + Feedback Table để user review.

---

## 🏁 Step 2: Finalize & Learn (sau khi user `/approve`)

### 2.1 — Chuẩn bị Astro Frontmatter (BẮT BUỘC)

Khi viết file final vào `src/content/articles/[slug].md`, frontmatter phải đầy đủ theo schema `src/content.config.ts`:

```yaml
---
title: "[Title đúng với H1 — tối đa 59 ký tự]"
description: "[~155 ký tự, chứa keyword chính, tóm tắt giá trị bài]"
category: "[slug category — phải khớp với categories[] trong src/data/site.ts]"
heroImage: "[/images/articles/{slug}/hero.jpg — ảnh riêng cho bài, xem mục Hero Image bên dưới, BẮT BUỘC]"
publishDate: "YYYY-MM-DD"
updatedDate: "YYYY-MM-DD"
readingTime: "[X phút đọc]"
featured: false
order: 100
tags:
  - "[tag 1]"
  - "[tag 2]"
faq:
  - question: "[Câu hỏi 1 từ FAQ section trong bài]"
    answer: "[Câu trả lời ngắn gọn 1-2 câu]"
  - question: "[Câu hỏi 2]"
    answer: "[Câu trả lời]"
sources:
  - "[Nguồn 1 — ví dụ: Ủy ban Chứng khoán Nhà nước]"
  - "[Nguồn 2 — ví dụ: CFA Institute]"
citations:
  - title: "[Tên tài liệu]"
    url: "[URL nếu có]"
    publisher: "[Tên tổ chức phát hành]"
    date: "[YYYY-MM-DD nếu biết]"
keyTakeaways:
  - "[Key takeaway 1 — ≤ 20 từ]"
  - "[Key takeaway 2]"
  - "[Key takeaway 3]"
# factCheckedDate: "YYYY-MM-DD"  # Chỉ thêm nếu bài đã qua fact-check chính thức
---
```

**Lưu ý bắt buộc về `category`:**
Giá trị `category` phải là một trong các slug sau (xem `src/data/site.ts`):
- Nhóm Đầu tư: `co-phieu`, `etf`, `quy-dau-tu`, `trai-phieu`, `phai-sinh`
- Nhóm Phân tích: `co-ban`, `ky-thuat`
- Nhóm khác: `reviews`, `nha-dau-tu`

**URL tương ứng:**
- `co-phieu` → `/dau-tu/co-phieu/[slug]/`
- `co-ban` → `/phan-tich/co-ban/[slug]/`
- `reviews` → `/reviews/[slug]/`
- `nha-dau-tu` → `/nha-dau-tu/[slug]/`

**Hero Image (BẮT BUỘC điền `heroImage` riêng cho từng bài):**

Mỗi bài viết mới PHẢI có ảnh hero/ảnh bìa RIÊNG, KHÔNG dùng ảnh mặc định chung của category.

- Nguồn ảnh: ảnh `featured` đã tải qua Unsplash ở Bước 1.5 của drafting (`src/content/articles/images/[slug]/featured-[slug].jpg`).
- **Tỷ lệ chuẩn (thống nhất toàn site): 5:3 (≈1000×600)** — khi search Unsplash cho ảnh bìa/ảnh inline, ưu tiên chọn ảnh có tỷ lệ ngang gần 5:3 để hiển thị đồng nhất trên card trang chủ/danh mục (dùng `object-fit: cover` nên lệch nhẹ vẫn ok, nhưng tránh ảnh dọc hoặc vuông).
- Copy ảnh đó vào `public/images/articles/[slug]/hero.jpg` (đây là bước BẮT BUỘC trong Bước 1.5 — xem `drafting.md`).
- Set `heroImage: "/images/articles/[slug]/hero.jpg"` trong frontmatter.

> Fallback: `/images/hero-{category}.png` (trong `categoryDefaultImages` của `ArticleLayout.astro`) chỉ dùng cho các bài CŨ chưa có ảnh riêng, KHÔNG dùng cho bài mới.

### 2.2 — Cấu trúc body bài viết

Sau frontmatter, body bài viết theo thứ tự:

```
[Sapo — 2-3 câu, chứa keyword, dùng Story/Contrarian hook. Bắt buộc chứa thương hiệu **[Value Investing](/)**]

## [H2 Section 1]
[Nội dung...]

![Mô tả hình ảnh](./images/[slug]/[filename].jpg)
*Ảnh: [Tác giả] / Unsplash*

[Nội dung tiếp theo...]

## [H2 Section 2]
[Nội dung...]

## Câu hỏi thường gặp

### [Câu hỏi 1]
[Trả lời]

### [Câu hỏi 2]
[Trả lời]

[CTA cuối bài — 1 insight + 1 hành động cụ thể]

---
*[Tuyên bố miễn trừ trách nhiệm — chỉ với bài phân tích/review cổ phiếu hoặc tài sản]*
```

**Không có sapo trong frontmatter** — Sapo là đoạn văn đầu tiên ngay sau dấu `---` đóng của frontmatter.

### 2.3 — File Management (BẮT BUỘC)

1. Viết file final: `src/content/articles/[slug].md` với frontmatter đầy đủ
2. Xóa draft tạm: `knowledge/4-content/2-drafts/Draft-[slug].md`
3. Thêm vào anchor-index: `knowledge/3-pipeline/anchor-index.md` — bổ sung dòng mới cho bài vừa publish
4. Cập nhật status: `knowledge/4-content/topic-clusters.md` → `Finalized`

### 2.4 — Learning

Trigger **`content-feedback-loop`** skill để phân tích revisions và cập nhật `.antigravity/memory/instincts.md`.

### 2.5 — Delivery

Confirm với user:
- ✅ Path file đã tạo: `src/content/articles/[slug].md`
- ✅ Category & URL: `/[path]/[slug]/`
- ✅ Anchor-index đã cập nhật
