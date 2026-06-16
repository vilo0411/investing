# Xác nhận Knowledge Base — Value Investing

> **Tài liệu này cần được chủ blog (Nguyễn Viết Lộc) xem qua và xác nhận.**
> Mọi thông tin `[assumed ⚠️]` cần được verify hoặc sửa lại trước khi hệ thống chạy chính thức.
> **Ngày tạo:** 2026-06-14

---

## Mục đích

Đây là tài liệu tóm tắt những gì Research Agent đã build vào Knowledge Base.
Vui lòng xem qua các file bên dưới và xác nhận độ chính xác.

---

## Các file đã được tạo / cập nhật

| File | Mô tả | Trạng thái cần verify |
|------|-------|----------------------|
| `knowledge/1-brand/profile.md` | Brand identity, mission, tone of voice | Phần **Monetization** & **Giai đoạn dự án** |
| `knowledge/1-brand/personas.md` | 3 persona: F0 VP, Sinh viên, Trung cấp | Persona 3 là `[assumed]` — có đúng không? |
| `knowledge/1-brand/icp.md` | Ideal Customer Profile | OK — `[verified]` từ tài liệu nội bộ |
| `knowledge/2-market/market-landscape.md` | Đối thủ, market size, content gaps | Market size là `[assumed]` — cần xác nhận |
| `knowledge/3-pipeline/anti-ai-rules.md` | Quy tắc viết bài chống AI-vibe | OK — không thay đổi |
| `knowledge/3-pipeline/glossary.md` | Bảng thuật ngữ chuẩn | OK — không thay đổi |
| `knowledge/3-pipeline/anchor-index.md` | Index bài đã publish + URL đúng | Đã rebuild với URL mới — cần verify |
| `knowledge/raw/intel/brand-voice-valueinvesting-2026.md` | File gốc Brand Voice | Đã archive vào `raw/intel/` |

---

## Câu hỏi cần xác nhận `[TBD ❓]`

1. **Market size:** Số liệu "~8 triệu tài khoản" và "80–85% nhà đầu tư cá nhân" có đúng không? Cần nguồn chính xác hơn.

2. **Persona 3 (Nhà đầu tư trung cấp):** Blog có thực sự target nhóm này không, hay vẫn chỉ tập trung F0?

3. **Competitors mới:** Có đối thủ nào mới nổi trong 6 tháng gần đây (ngoài CafeF, Vietstock, F319) cần bổ sung không?

4. **Affiliate Partners:** Hiện tại đã có thỏa thuận với CTCK nào chưa, hay chưa có? (Để điều chỉnh Review content strategy)

5. **Author bio:** Cần thêm thông tin chuyên môn của Nguyễn Viết Lộc vào `profile.md` để tăng EEAT (học vấn, kinh nghiệm đầu tư...).

---

## Hành động tiếp theo

Sau khi xác nhận:
1. Sửa các thông tin `[assumed ⚠️]` → `[verified ✅]` trong từng file
2. Bổ sung Author bio vào `knowledge/1-brand/profile.md`
3. Chạy `/cluster` để tổ chức keyword clusters từ `knowledge/3-pipeline/keywords.csv`
4. Chạy `/keyword-plan 5` để chọn 5 bài viết tiếp theo

*File này có thể xóa sau khi đã xác nhận toàn bộ.*
