---
description: Kích hoạt Content Feedback Loop để học hỏi từ lịch sử sửa bài
---

# Lệnh: /learn [slug?]

Phân tích lịch sử chỉnh sửa và cập nhật bộ quy tắc của hệ thống.

## Options
- `/learn` — Phân tích tổng thể toàn bộ `revision-log.md`, tổng hợp patterns.
- `/learn [slug]` — Phân tích sâu một bài cụ thể (VD: `/learn lai-suat-tiet-kiem-acb`).

## Quy trình thực thi

### 🔄 Bước 0: Context Load
1. `knowledge/3-pipeline/revision-log.md` — Toàn bộ lịch sử sửa bài
2. `knowledge/3-pipeline/anti-ai-rules.md` — Bộ quy tắc hiện tại
3. `.antigravity/memory/instincts-archive.md` — Lịch sử bản năng đầy đủ (nguồn chân lý), dùng để chống ghi trùng
4. Nếu có `[slug]`: đọc thêm `src/content/articles/[slug].md`

### Bước 1: Kích hoạt Content Feedback Loop
- Kích hoạt skill `.antigravity/skills/content-feedback-loop/SKILL.md`.
- Nếu có `[slug]`: phân tích sâu bài đó.
- Nếu không có `[slug]`: phân tích tổng thể revision-log.
- Bản năng mới: **APPEND** vào `.antigravity/memory/instincts-archive.md` theo format chuẩn (`### Tiêu đề` + `Trạng thái` / `Nguồn` / `Bản năng` / `Phạm vi`). Không sửa tay `instincts.md`.
- Sau khi append, **BẮT BUỘC** chạy `python3 scripts/optimize_instincts.py` để sinh lại `instincts.md` (+ `instincts-by-scope/` nếu có bản năng `Phạm vi: Chỉ topic: X`).

### Bước 2: Xác nhận Updates
Hiển thị cho người dùng:
- Danh sách quy tắc mới được thêm vào `anti-ai-rules.md`.
- Danh sách bản năng mới được thêm vào `instincts-archive.md`.
- Số ký tự của `instincts.md` mà script in ra. Script cảnh báo > 8.000 ký tự → đề xuất DEPRECATE bớt bản năng trong archive (hỏi người dùng trước khi đổi trạng thái).
- Số pattern được tổng hợp.

> Không tự động ghi đè quy tắc cũ. Chỉ APPEND thêm. Nếu cần xóa rule cũ, hỏi người dùng trước.
