---
description: Gắn internal links cho bài đang làm
---

# Lệnh: /link

## Nhiệm vụ
Đọc qua nội dung bài viết nháp và tự động chèn các internal links (liên kết nội bộ) phù hợp, dựa trên mạng lưới content đã có.

## Quy trình thực thi
1. Đọc nội dung file đang mở (bản draft/final) và `category` ở frontmatter.
2. **Link Wheel (bắt buộc trước):** tra `knowledge/3-pipeline/link-wheel.md` → chèn 2 link nan hoa của category (Hub định nghĩa + bài "cách đầu tư"). Bỏ qua nan hoa nếu bài chính là nan hoa đó. Chỉ link bài `Finalized`.
3. **Vành 2 chiều (bắt buộc):** tra `topic-clusters.md`, lấy 2 bài `Finalized` gần nhất cùng cluster → chèn 2 link trỏ tới chúng, RỒI mở đúng 2 bài đó chèn anchor trỏ ngược lại bài này. Bài mới ↔ bài cũ nối 2 chiều.
4. (Tùy) thêm 1 link cross-cluster liên quan nếu có ngữ cảnh tự nhiên.
5. **Anchor Text & Vị Trí Chèn (Tự nhiên 100%):**
   - **Ưu tiên 1 (Inline Natural/Partial Match):** Bọc link trên cụm từ/câu đã có sẵn trong bài phù hợp với ngữ cảnh bài đích (dùng Partial Match / Title Anchor nếu Exact Match bị gượng).
   - **Ưu tiên 2 (Callout Block Fallback):** Nếu thân bài không có vị trí chèn tự nhiên, **tuyệt đối KHÔNG ép từ vào giữa câu**. Tạo khối Callout gợi ý riêng ở cuối section/bài: `> **Xem hướng dẫn chi tiết:** **[Tên / Anchor bài đích](URL)**...`
   - Đảm bảo mật độ link vừa phải (tối đa 1 link/100–150 từ), bôi đậm link Wheel `**[anchor](url)**`, tuyệt đối không dùng "xem thêm tại đây", "click vào đây".
6. Áp dụng thay đổi trực tiếp vào file.
