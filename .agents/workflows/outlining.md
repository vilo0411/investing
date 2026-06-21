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
5. `knowledge/4-content/topic-clusters.md`
6. `.antigravity/memory/instincts.md`

### Bước 1: SEO Collector — SERP Research + Gap Synthesis + Internal Link Planning
- Kích hoạt agent `.antigravity/agents/seo-collector.md`.
- Kích hoạt skill `.antigravity/skills/seo-outlining/SKILL.md` → Step 1: Plan.
- Dùng skill `.antigravity/skills/web-serp/SKILL.md` — SERP Lookup + Content Extraction song song qua Jina AI. KHÔNG dùng browser.
- Thu thập: H-tag structure, số liệu cụ thể, content gaps, UX elements.
- **Chạy Competitor Gap Synthesis** (theo format trong `web-serp/SKILL.md`) sau khi extract xong tất cả competitors.
- **Internal Link Planning**: Đọc `knowledge/3-pipeline/anchor-index.md`, identify 2–3 bài phù hợp để link, ghi vào `Internal_Links:` trong outline YAML.

> **30-second Rule:** Nếu trong lúc research gặp data/insight hay mà không dùng ngay vào bài này → save 1 dòng vào `knowledge/raw/intel/dump.md` (ngày + nguồn + mô tả ngắn) trong 30 giây. Categorize thành file riêng sau.

### Bước 2: Brand Guardian — Brand Context + Writer Profile
- Kích hoạt agent `.antigravity/agents/brand-guardian.md`.
- Output: `Brand Context Snippet` gồm Persona, **Writer Profile** (educational/analytical/comparison) + 3 tone characteristics, mandatory USPs, Anti-AI checklist cho bài này.

### Bước 3: Expert Outline Generation
- Tích hợp Brand Context Snippet (bao gồm Writer Profile) vào output của SERP Research.
- Tạo Outline theo template `.antigravity/skills/seo-outlining/references/brief-template.md`.
- Đảm bảo outline YAML có đầy đủ: `Writer_Profile:`, `Internal_Links:`, `Featured_Snippet:`.
- Lưu tại: `knowledge/4-content/1-outlines/[slug].md`.
- Cập nhật `topic-clusters.md` → trạng thái `Outlining`.

### Bước 4: Image Manifest (Unsplash)
- Dựa trên cấu trúc H2 vừa tạo, chọn 1–3 vị trí chèn ảnh photo/editorial (đầu bài + 1–2 section quan trọng).
- Với mỗi vị trí, điền vào **Section 5 (Image Manifest)** của outline:
  - Search query tiếng Anh (ngắn, cụ thể — concept ảnh cho Unsplash)
  - Alt text tiếng Việt (mô tả ảnh, tự nhiên, chứa từ khóa liên quan nếu hợp lý)
- Ảnh sẽ được fetch & download thật ở bước `/drafting` — ở đây chỉ lập kế hoạch.

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
> Khi approve: cập nhật `topic-clusters.md` → `Outline-Approved`.
