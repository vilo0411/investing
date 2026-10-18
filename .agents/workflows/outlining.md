---
description: Nghiên cứu SERP và tạo Expert Outline (Phase 1 & 2 của write pipeline)
---

# Lệnh: /outlining [keyword]

Dùng khi bạn chỉ muốn thực hiện bước Research + Outline mà chưa cần viết bài ngay.
Tương đương với `Phase 1` và `Phase 2` của lệnh `/write`.

## Quy trình thực thi

### 🔄 Bước 0: Context Load (BẮT BUỘC)
1. `knowledge/1-brand/profile.md`
2. `knowledge/1-brand/personas.md`
3. `knowledge/3-pipeline/anti-ai-rules.md`
4. `knowledge/3-pipeline/glossary.md`
5. Trạng thái topic: `python3 scripts/topic_status.py --find "[keyword]"` (chỉ đọc, chưa set — không load cả `knowledge/4-content/topic-clusters.md`)
6. `.antigravity/memory/instincts.md` (bản rút gọn, sinh tự động) + `.antigravity/memory/instincts-by-scope/<topic>.md` nếu đầu file instincts.md liệt kê file khớp topic bài

### Bước 0.5: Cannibalization Gate (trước SERP research)
Mục đích: không tốn SERP research và không tạo bài trùng intent với bài Value Investing đã publish.

1. **Luôn chạy** (miễn phí, bắt được cả bài mới chưa có dữ liệu GSC):
   `python3 scripts/find_links.py "[keyword]" --top 5`
2. **Nếu agent có SEO Dashboard MCP:**
   - Gọi `list_properties` trước, chọn property có chứa `valueinvesting.com.vn` và copy `property_url` nguyên văn (dạng `https://.../` hoặc `sc-domain:...`, không hardcode). Không có property nào khớp → bỏ qua bước MCP.
   - Gọi `query_search_analytics` với `property_url` đó, `dimensions: ["page"]`, `query_value: "[keyword]"`, `days: 90`, `limit: 10`.
3. **Quy tắc xác định cannibalization** — có URL Value Investing cùng intent:
   - Trong kết quả find_links: title/slug nhắm cùng keyword (cùng câu hỏi chính, không chỉ trùng 1 từ); hoặc
   - Trong GSC: 1 page chiếm phần lớn impressions của keyword với vị trí trung bình ≤ 10.
4. **Xử lý khi có cannibalization:**
   - Mặc định / `--step`: **DỪNG**, đề xuất `/optimize [slug-đó]` thay vì viết bài mới, chờ user quyết.
   - `--auto` / `--sprint`: KHÔNG viết bài mới và KHÔNG tự chạy `/optimize` (sửa bài đã publish cần user đồng ý). Ghi khối `⚠️ Cannibalization` (URL đang rank, intent, đề xuất `/optimize [slug]`) vào báo cáo cuối rồi kết thúc keyword này, không dừng chờ. Đang `--sprint` thì chuyển sang keyword kế tiếp.
   - `--force-new` (user xác nhận vẫn muốn viết bài mới): bỏ qua lệnh dừng, nhưng outline bắt buộc có `Intent_Boundary:` và link chéo 2 chiều với bài đã có.
5. **Khác intent** → tiếp tục; ghi `Intent_Boundary:` trong outline YAML và link chéo 2 chiều với bài gần chủ đề.
6. **Qua gate rồi mới set trạng thái:** `python3 scripts/topic_status.py [slug] --set "In Progress"`. Slug chưa có dòng nào → thêm 1 dòng vào bảng của cluster phù hợp trong topic-clusters.md theo đúng format (`| Keyword | `slug` | `Planned` |`), rồi chạy lại lệnh.

### Bước 1: SEO Collector — SERP Research + Gap Synthesis + Internal Link Planning
- Kích hoạt agent `.antigravity/agents/seo-collector.md`.
- Kích hoạt skill `.antigravity/skills/seo-outlining/SKILL.md` → Step 1: Plan.
- Dùng skill `.antigravity/skills/web-serp/SKILL.md` — SERP Lookup + Content Extraction song song qua Jina AI. KHÔNG dùng browser.
- Thu thập: H-tag structure, số liệu cụ thể, content gaps, UX elements.
- **Chạy Competitor Gap Synthesis** (theo format trong `web-serp/SKILL.md`) sau khi extract xong tất cả competitors.
- **Internal Link Planning**: `python3 scripts/find_links.py "[keyword]" --top 6 --exclude [slug]` (không đọc anchor-index.md), chọn 2–3 URL phù hợp, ghi URL root-relative đúng như script in ra vào `Internal_Links:` trong outline YAML.

> **30-second Rule:** Nếu trong lúc research gặp data/insight hay mà không dùng ngay vào bài này → save 1 dòng vào `knowledge/raw/intel/dump.md` (ngày + nguồn + mô tả ngắn) trong 30 giây. Categorize thành file riêng sau.

### Bước 2: Brand Guardian — Brand Context + Writer Profile
- Kích hoạt agent `.antigravity/agents/brand-guardian.md`.
- Output: `Brand Context Snippet` gồm Persona, **Writer Profile** (educational/analytical/comparison) + 3 tone characteristics, mandatory USPs, Anti-AI checklist cho bài này.

### Bước 3: Expert Outline Generation
- Tích hợp Brand Context Snippet (bao gồm Writer Profile) vào output của SERP Research.
- Tạo Outline theo template `.antigravity/skills/seo-outlining/references/brief-template.md`.
- Đảm bảo outline YAML có đầy đủ: `Writer_Profile:`, `Internal_Links:`, `Featured_Snippet:` (+ `Intent_Boundary:` khi Bước 0.5 phát hiện bài gần chủ đề).
- Lưu tại: `knowledge/4-content/1-outlines/[slug].md`.
- Trạng thái đã là `In Progress` từ Bước 0.5 — không set thêm ở bước này.

### Bước 4: Image Manifest & Cover Image Planning
- **Ảnh bìa (Hero/Cover Image)**:
  - Nếu bài viết là bài so sánh (`reviewType: comparison`) hoặc đánh giá sàn (`reviewType: company`), ảnh bìa sẽ được dựng từ template HTML (không dùng Unsplash). Đánh dấu ở mục ảnh bìa là "HTML Cover Template".
  - Nếu là bài blog/kiến thức thông thường, ảnh bìa sẽ tự động render bằng template mặc định (`article-cover-template.html`), không cần tìm ảnh Unsplash.
- **Ảnh inline (Thân bài)**:
  - Dựa trên cấu trúc H2 vừa tạo, chọn 1–3 vị trí chèn ảnh photo/editorial trong thân bài.
  - Với mỗi vị trí inline, điền vào **Section 5 (Image Manifest)** của outline:
    - Search query tiếng Anh (ngắn, cụ thể — concept ảnh cho Unsplash).
    - Alt text tiếng Việt (mô tả ảnh, tự nhiên, chứa từ khóa liên quan nếu hợp lý).
  - Ảnh inline sẽ được tìm và tải thực tế ở bước `/drafting`.

### Bước 4b: [CHỈ CHO REVIEW] Official Resources Research
> Áp dụng khi `layoutType: review` và `reviewType: company`.

Thu thập tài nguyên chính thức từ doanh nghiệp được review để điền vào field `officialResources` của frontmatter:

1. **YouTube**: Tìm kênh YouTube chính thức của công ty → lấy tối đa 3 video liên quan nhất (mở tài khoản, hướng dẫn giao dịch, nạp/rút tiền).
2. **Blog/Guide trên website**: Tìm `site:[domain-cong-ty] hướng dẫn mở tài khoản` + `hướng dẫn giao dịch` → lấy 2–3 bài hữu ích nhất.
3. Format mỗi resource theo schema:
   ```yaml
   - type: "video" | "article" | "guide"
     title: "Tên video/bài viết"
     url: "https://..."
     description: "Mô tả ngắn 1 câu — nói rõ bài đó dạy gì"
   ```
4. Chỉ lấy resource từ nguồn chính thức của công ty (YouTube channel của họ, website của họ). Không dùng nguồn bên thứ ba.
5. Ghi vào `officialResources:` trong frontmatter khi `/approve` sang drafting.

### 🚧 APPROVAL GATE:
> Trình bày Outline + SERP summary cho người dùng.
> **DỪNG LẠI. Chờ `/approve` trước khi tiếp tục sang drafting.**
> Khi approve: `python3 scripts/topic_status.py [slug] --set Outline-Approved`.
