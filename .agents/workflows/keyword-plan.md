---
description: Chọn N bài nên viết tiếp từ cluster map
---

# Lệnh: /keyword-plan [N] [persona]

## Nhiệm vụ
Phân tích Topic Clusters và đề xuất [N] bài viết tiếp theo nên được ưu tiên triển khai dựa trên chân dung độc giả (persona).

## Quy trình thực thi
1. Lấy danh sách keyword chưa viết bằng `python3 scripts/topic_status.py --list Planned` (thêm `--cluster Cxx` để lọc theo cluster). Không đọc nguyên file `knowledge/4-content/topic-clusters.md`.
2. Đọc persona tương ứng trong `knowledge/1-brand/personas.md`.
3. Phân tích ngữ cảnh, độ khó, và tính cấp thiết để lọc ra [N] từ khóa phù hợp nhất.
4. Ghi nhận các từ khóa này vào `knowledge/4-content/sprint-backlog.md` với trạng thái `Planned`.
