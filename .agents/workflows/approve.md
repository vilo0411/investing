---
description: Phê duyệt giai đoạn hiện tại (Outline → Draft/Final/Optimize)
---

# Lệnh: /approve

## Nhiệm vụ
Cho phép người dùng phê duyệt một bản nháp, outline, hoặc bản tối ưu để đẩy nó sang giai đoạn tiếp theo trong Content Pipeline.

## 🔄 Context Load (Trước khi thực thi)
1. `python3 scripts/topic_status.py [slug]` — để xác định dòng của slug và trạng thái hiện tại (không load cả `knowledge/4-content/topic-clusters.md`)
2. `.antigravity/memory/instincts-archive.md` — nơi ghi nhận bài học mới (nếu có), sau đó chạy `python3 scripts/optimize_instincts.py`
3. `knowledge/3-pipeline/revision-log.md` — để log revision

## Quy trình thực thi

### Bước 1: Xác định context
Xác định file đang ở stage nào dựa trên tên file hoặc stage đang được thảo luận trong conversation:

### Bước 2: Thực thi theo stage

**Nếu stage là Outline (`knowledge/4-content/1-outlines/[slug].md`):**
- Cập nhật trạng thái: `python3 scripts/topic_status.py [slug] --set Outline-Approved`.
- Thông báo: "Outline đã được approve. Gõ `/drafting [slug]` để bắt đầu viết bài."

**Nếu stage là Draft (`knowledge/4-content/2-drafts/Draft-[slug].md`):**
- **BẮT BUỘC — Hỏi trước khi finalize:**
  > *"Ngoài các chỉnh sửa đã trao đổi trong chat, bạn có tự sửa thêm gì trong file không? Mô tả ngắn để tôi ghi log. (Gõ 'không' để bỏ qua.)"*
- Tổng hợp **toàn bộ** những gì đã sửa trong session này (từ chat + file trực tiếp nếu user khai báo) → ghi vào `knowledge/3-pipeline/revision-log.md` theo format chuẩn.
- **BẮT BUỘC**: Di chuyển file sang `src/content/articles/[slug].md`, thêm frontmatter Astro theo template ở `.agents/workflows/write.md` Bước 3.1 (khớp block trong `CLAUDE.md` + schema `src/content.config.ts`; `category` phải khớp `categories[].slug` trong `src/data/site.ts`).
- **BẮT BUỘC — TỰ ĐỘNG DỌN DẸP**: Xóa `knowledge/4-content/1-outlines/[slug].md`, `knowledge/4-content/2-drafts/Draft-[slug].md`, `knowledge/4-content/2-drafts/[slug]-cover.html` (nếu có), `knowledge/4-content/2-drafts/[slug]-image-prompts.md` (nếu có).
- Cập nhật trạng thái: `python3 scripts/topic_status.py [slug] --set Finalized`.
- Auto-trigger: Kích hoạt skill `.antigravity/skills/content-feedback-loop/SKILL.md` để tổng hợp bài học.
- Ghi bài mới vào `knowledge/3-pipeline/anchor-index.md`: append 1 dòng vào đúng bảng của nhóm category (chỉ ghi — `grep -n` heading của nhóm rồi chèn dòng, không load cả file).
- **BẮT BUỘC — Khép vành Link Wheel 2 chiều:** kích hoạt `.antigravity/skills/internal-linking/SKILL.md` → Mode: Link Wheel trên bài vừa finalized. Đảm bảo (1) bài có 2 nan hoa + 2 link tới bài `Finalized` gần nhất cùng cluster; (2) mở đúng 2 bài cũ đó, chèn anchor trỏ ngược lên bài mới. Tham chiếu `knowledge/3-pipeline/link-wheel.md`.
  - Tìm 2 bài cũ: `python3 scripts/topic_status.py [slug]` (để biết cluster) → `python3 scripts/topic_status.py --list Finalized --cluster <Cxx>` (sort theo publishDate, bỏ chính bài mới).
  - Có thể kiểm thêm bài nào nên trỏ về bài mới bằng `python3 scripts/find_links.py --backfill [slug] --top 5`.

**Nếu stage là Optimize (`knowledge/4-content/2-drafts/Optimize-[slug].md`):**
- Ghi đè bản nâng cấp lên file gốc: `src/content/articles/[slug].md` (cập nhật `updatedDate`).
- Xóa file `Optimize-[slug].md` và file `Proposal-[slug].md` (nếu có) trong `2-drafts/`.
- Cập nhật trạng thái: `python3 scripts/topic_status.py [slug] --set Finalized`.
- **BẮT BUỘC — Khép vành Link Wheel 2 chiều:** như trên — chạy Mode: Link Wheel để bài giữ đủ 2 nan hoa + vành 2 chiều với 2 bài cùng cluster.

### Bước 3: Xác nhận
Sau khi hoàn thành, báo cáo cho người dùng:
- Đường dẫn file final.
- Trạng thái mới (output của `topic_status.py`).
- (Nếu Draft approve): Tóm tắt bài học mới từ Content Feedback Loop.
