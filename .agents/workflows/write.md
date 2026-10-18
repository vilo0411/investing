---
description: Kích hoạt quy trình viết bài SEO chuẩn Framework (Full Pipeline)
---

# Lệnh: /write [keyword] [options]

## Options Hỗ Trợ
- `--step`: Viết từng bước, dừng lại chờ `/approve` tại mỗi gate.
- `--auto`: Tự động chạy toàn bộ pipeline đến Final, không cần duyệt.
- `--no-serp`: Bỏ qua bước SERP research (dùng khi đã có data ngoại tuyến).
- `--sprint`: Chế độ viết hàng loạt (batch), lần lượt từng keyword trong backlog.
- `--force-new`: Bỏ lệnh dừng của Cannibalization Gate khi user xác nhận vẫn muốn viết bài mới (outline bắt buộc có `Intent_Boundary:` + link chéo 2 chiều với bài đã có).

---

## Quy trình thực thi chi tiết (Agent Sequencing)

### 🔄 Bước 0: System Context Load (BẮT BUỘC — trước mọi bước)
Trước khi làm bất cứ việc gì, hệ thống phải đọc:
1. `knowledge/1-brand/profile.md`
2. `knowledge/1-brand/personas.md`
3. `knowledge/3-pipeline/anti-ai-rules.md`
4. `knowledge/3-pipeline/glossary.md`
5. Trạng thái topic: `python3 scripts/topic_status.py --find "[keyword]"` — chỉ đọc để xem keyword đã có dòng/bài chưa, **chưa set** (set `In Progress` sau Bước 1.0)
6. `.antigravity/memory/instincts.md` (bản rút gọn, sinh tự động) + `.antigravity/memory/instincts-by-scope/<topic>.md` nếu đầu file instincts.md liệt kê file khớp topic bài — nạp bài học từ các vòng viết trước

---

### ⚙️ Giai đoạn 1: Outlining (SEO Research + Expert Outline)
**Agent phụ trách:** SEO Collector + Brand Guardian (song song)

**Bước 1.0 — Cannibalization Gate (trước SERP research):**
- Chạy đúng Bước 0.5 của `.agents/workflows/outlining.md`: `python3 scripts/find_links.py "[keyword]" --top 5` + SEO Dashboard MCP (`list_properties` → `query_search_analytics`) nếu có.
- Có bài Value Investing cùng intent:
  - Mặc định / `--step`: DỪNG, đề xuất `/optimize [slug-đó]`, chờ user quyết.
  - `--auto` / `--sprint`: không viết bài mới, không tự chạy `/optimize`; ghi khối `⚠️ Cannibalization` vào báo cáo cuối rồi kết thúc keyword này (sprint thì chuyển keyword kế tiếp). Không dừng chờ — đây là kết quả hợp lệ của pipeline end-to-end, không phải gate duyệt.
  - `--force-new`: tiếp tục viết, outline bắt buộc có `Intent_Boundary:` + link chéo 2 chiều.
- Qua gate → `python3 scripts/topic_status.py [slug] --set "In Progress"` (slug chưa có dòng thì thêm 1 dòng vào cluster phù hợp rồi chạy lại).

**Bước 1.1 — SEO Collector (SERP Research):**
- Kích hoạt skill `.antigravity/skills/seo-outlining/SKILL.md` → Step 1: Plan.
- Dùng skill `.antigravity/skills/web-serp/SKILL.md` — SERP Lookup + Content Extraction song song qua Jina AI. KHÔNG dùng browser.
- Thu thập: cấu trúc H-tag, số liệu thực tế, content gaps, UX elements.

**Bước 1.2 — Brand Guardian (Brand Context):**
- Chạy song song với 1.1 hoặc ngay sau khi 1.1 hoàn thành.
- Output: `Brand Context Snippet` — Persona, USPs bắt buộc, Anti-AI checklist riêng cho bài này.

**Bước 1.3 — SEO Collector (Expert Outline):**
- Kích hoạt skill `.antigravity/skills/seo-outlining/SKILL.md` → Step 2: Validate.
- Tích hợp Brand Context Snippet từ Brand Guardian vào Outline.
- Lưu Outline tại: `knowledge/4-content/1-outlines/[slug].md`.

**🚧 APPROVAL GATE 1:**
> Trình bày Outline kèm summary SERP findings cho người dùng.
> **DỪNG LẠI. Chờ người dùng gõ `/approve`.**
> Khi được approve: `python3 scripts/topic_status.py [slug] --set Outline-Approved`.

---

### ⚙️ Giai đoạn 2: Drafting (Human-centric Draft)
**Agent phụ trách:** Main Agent (drafting) + Quality Guardian (QA)

**Bước 2.1 — Drafting:**
- Kích hoạt skill `.antigravity/skills/seo-drafting/SKILL.md` → Step 1: Execute.
- Đọc Outline đã approve từ `knowledge/4-content/1-outlines/[slug].md`.
- Viết bài theo 3S Rule (Specific, Story, Statistics). Internalize anti-ai-rules — không chỉ liệt kê.
- **Bắt buộc** chèn tên thương hiệu "**[Value Investing](/)**" (có link về trang chủ `/`) một cách tự nhiên trong Sapo (đoạn mở đầu, ngay dưới H1).
- Lưu draft tại: `knowledge/4-content/2-drafts/Draft-[slug].md`.

**Bước 2.1.5 — Tạo Ảnh Bìa HTML và Chèn Ảnh Inline (Unsplash):**
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

**Bước 2.2 — Internal Linking:**
- Kích hoạt skill `.antigravity/skills/internal-linking/SKILL.md` → Mode: Contextual Insertion.
- Tìm link nội bộ bằng `python3 scripts/find_links.py "[keyword]" --top 6 --exclude [slug]` (không load anchor-index.md).
- Chèn tối thiểu 2 internal links vào draft, dùng URL root-relative đúng như script in ra (ví dụ `/phan-tich/co-ban/pe-la-gi/`).

**Bước 2.3 — Quality Guardian (QA):**
- Kích hoạt agent `.antigravity/agents/quality-guardian.md`.
- QA phải load: Outline gốc + anti-ai-rules + glossary + instincts.md (+ file instincts-by-scope khớp topic, nếu có).
- Kết quả: `PASS` hoặc `FAIL` với danh sách lỗi có số dòng.
- FAIL → sửa đúng các mục FAIL rồi QA lại, **tối đa 2 vòng sửa**. Sau vòng 2 vẫn FAIL → dừng (không tự chạy vòng 3), trình bày bản hiện tại kèm mục `⚠️ Remaining issues` (từng CRITICAL/MAJOR còn lại: mã checklist, số dòng, mô tả). `--auto`: không dừng chờ — đặt `⚠️ Remaining issues` lên đầu báo cáo cuối, ghi 1 dòng revision-log trạng thái `**Cần xử lý**`, vẫn finalize nhưng KHÔNG thêm `factCheckedDate` (chỉ thêm khi đã fact-check).

**🚧 APPROVAL GATE 2:**
> Trình bày Draft + QA report (PASS, hoặc kèm `⚠️ Remaining issues`) cho người dùng.
> **DỪNG LẠI. Chờ người dùng review và gõ `/approve`.**

---

### ⚙️ Giai đoạn 3: Finalize & Learn
**Agent phụ trách:** Main Agent + Content Feedback Loop

**Bước 3.1 — File Management & Automatic Cleanup (BẮT BUỘC):**
- Lấy nội dung từ `knowledge/4-content/2-drafts/Draft-[slug].md`.
- Thêm frontmatter Astro chuẩn (xem template dưới) và lưu vào `src/content/articles/[slug].md`. **BẮT BUỘC** phải điền trường `heroImage` trỏ đến ảnh bìa riêng của bài viết (`/images/articles/[slug]/[slug].jpg`), không dùng chung ảnh mặc định của category.
- **TỰ ĐỘNG DỌN DẸP FILE TẠM**:
  - Xóa file outline: `knowledge/4-content/1-outlines/[slug].md`.
  - Xóa file draft tạm: `knowledge/4-content/2-drafts/Draft-[slug].md` (hoặc `Optimize-[slug].md`).
  - Xóa file cover HTML tạm: `knowledge/4-content/2-drafts/[slug]-cover.html` (nếu có).
  - Xóa file image prompts tạm: `knowledge/4-content/2-drafts/[slug]-image-prompts.md` (nếu có).
- Cập nhật trạng thái: `python3 scripts/topic_status.py [slug] --set Finalized`.
- Ghi bài mới vào `knowledge/3-pipeline/anchor-index.md`: append 1 dòng `| `slug` | Title | `/url/` | anchor |` vào đúng bảng của nhóm category (chỉ ghi — `grep -n` heading của nhóm để biết vị trí rồi chèn dòng, không load cả file). URL lấy từ `python3 scripts/find_links.py "[keyword]" --top 1` hoặc tính theo `categories[].path` trong `src/data/site.ts`.

**Frontmatter Astro bắt buộc** (khớp block trong `CLAUDE.md` + schema `src/content.config.ts`):
```yaml
---
title: "[Tiêu đề bài viết]"
description: "[Meta description ~155 ký tự]"
category: "[slug-category]"
heroImage: "/images/articles/[slug]/[slug].jpg"
publishDate: "YYYY-MM-DD"
updatedDate: "YYYY-MM-DD"
readingTime: "X phút đọc"
featured: false
order: 100
tags:
  - "[tag 1]"
  - "[tag 2]"
faq:
  - question: "[Câu hỏi 1]"
    answer: "[Trả lời 1]"
sources:
  - "[Nguồn 1]"
citations:
  - title: "[Tên tài liệu]"
    url: "[https://...]"        # optional
    publisher: "[Đơn vị phát hành]"  # optional
    date: "YYYY-MM-DD"          # optional
keyTakeaways:
  - "[Ý chính 1 — ≤ 20 từ]"     # 3–5 ý, mỗi ý ≤ 20 từ
# factCheckedDate: "YYYY-MM-DD"  # chỉ thêm khi đã fact-check
---
```

Ghi chú frontmatter:
- `category` phải khớp `categories[].slug` trong `src/data/site.ts` — hiện có `co-phieu`, `etf`, `trai-phieu`, `phai-sinh`, `co-ban`, `ky-thuat`, `reviews`, `nha-dau-tu`. `src/data/site.ts` là nguồn chân lý; sai category thì bài bị loại khỏi build ở đúng route.
- Q&A chỉ để ở `faq[]` của frontmatter (layout tự render FAQ + JSON-LD), không để H2 FAQ trong body (theo instinct). `keyTakeaways` cũng chỉ để ở frontmatter.
- Bài review/so sánh chấm điểm thêm các trường review tuỳ chọn theo `src/content.config.ts`: `layoutType: review`, `reviewType` (company | comparison | listicle), `reviewSummary`, `brokers`, `companyInfo`, `accountSteps`, `officialResources`, `comparisonCriteria`, `winnerByCriteria`, `bestForScenarios`, `rankings`.
- QA còn `⚠️ Remaining issues` (chế độ `--auto`) → không thêm `factCheckedDate`.

**Bước 3.2 — Content Feedback Loop (Auto-trigger):**
- Kích hoạt skill `.antigravity/skills/content-feedback-loop/SKILL.md`.
- Phân tích sự khác biệt giữa Draft gốc và bản Final người dùng approve.
- Ghi bài học vào:
  - `knowledge/3-pipeline/revision-log.md` — log cụ thể theo bài
  - `knowledge/3-pipeline/anti-ai-rules.md` — nếu phát hiện pattern mới
  - `.antigravity/memory/instincts-archive.md` — bản năng tổng hợp (append theo format chuẩn), rồi chạy `python3 scripts/optimize_instincts.py` để sinh lại `instincts.md`. Không sửa tay `instincts.md`.

**Bước 3.3 — Delivery:**
- Xác nhận đường dẫn file Final cho người dùng.
- Hiển thị tóm tắt: "Đã học X bài học mới từ vòng viết này."

---

## Luồng Quyết định theo Options

```
/write [keyword]
  └── Bước 1.0 Cannibalization Gate (mọi chế độ)
        ├── Không trùng intent → tiếp tục
        ├── Trùng intent + mặc định/--step → DỪNG, đề xuất /optimize [slug]
        ├── Trùng intent + --auto/--sprint → ghi ⚠️ Cannibalization vào báo cáo, kết thúc keyword (sprint: sang keyword kế)
        └── Trùng intent + --force-new → viết tiếp, bắt buộc Intent_Boundary + link chéo 2 chiều
  └── --step  → Dừng tại mỗi GATE, chờ /approve
  └── --auto  → Bỏ qua GATE, chạy thẳng đến Final (QA tối đa 2 vòng, còn lỗi thì ⚠️ Remaining issues ở đầu báo cáo)
  └── --no-serp → Bỏ qua Bước 1.1, dùng data có sẵn trong KB
  └── --sprint  → Lặp lại toàn bộ pipeline cho từng keyword trong backlog
  └── --force-new → Bỏ lệnh dừng của Cannibalization Gate (user đã xác nhận)
```
