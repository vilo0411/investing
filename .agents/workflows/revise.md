---
description: Sửa nội dung bài viết theo yêu cầu chat — có context load bắt buộc
---

# Lệnh: /revise [slug]

## Nhiệm vụ
Chỉnh sửa một đoạn / section cụ thể trong bài viết theo yêu cầu của người dùng, đảm bảo bản sửa không vi phạm anti-ai-rules.

---

## Bước 0: Context Load (BẮT BUỘC — đọc đủ 4 file trước khi chạm vào bất kỳ nội dung nào)

1. `knowledge/3-pipeline/anti-ai-rules.md` — toàn bộ, không skip section nào
2. `.antigravity/memory/instincts.md` (bản rút gọn, sinh tự động) + `.antigravity/memory/instincts-by-scope/<topic>.md` nếu đầu file instincts.md liệt kê file khớp topic bài — lỗi đã học từ các vòng sửa trước
3. `knowledge/3-pipeline/glossary.md` — thuật ngữ chuẩn thương hiệu
4. File cần sửa: Draft (`knowledge/4-content/2-drafts/Draft-[slug].md` hoặc `Optimize-[slug].md`) hoặc Final = `src/content/articles/[slug].md`

---

## Bước 1: Xác định phạm vi sửa

Xác nhận với người dùng:
- **File:** `[path/to/file]`
- **Phạm vi:** `[section / heading / đoạn cụ thể người dùng yêu cầu]`
- **Yêu cầu:** `[mô tả lại yêu cầu sửa của người dùng để tránh hiểu nhầm]`

Nếu người dùng không chỉ rõ slug hoặc section → hỏi lại trước khi làm.

---

## Bước 1.5: Log trước khi sửa (BẮT BUỘC — workflow-integrity rule 5)

Trước khi viết bản sửa, append 1 dòng vào cuối bảng dưới `## Nhật ký chỉnh sửa` trong `knowledge/3-pipeline/revision-log.md` (ngay sau dòng cuối của bảng, trước `## Hướng dẫn cập nhật cho Agent`):

```
| YYYY-MM-DD | `slug` | [yêu cầu tóm tắt] | [hành động dự kiến] | **Đang xử lý** |
```

Không chờ đến `/approve` mới ghi.

---

## Bước 2: Viết bản sửa

- Chỉ sửa đúng phạm vi được yêu cầu. Không chạm vào phần còn lại của bài.
- Áp dụng quy tắc 3S: Specific · Story · Statistics — không viết vague.
- Tone: đúng Persona của bài (đọc từ Content Strategy Header hoặc hỏi user nếu không rõ).

---

## Bước 3: Self-Audit (BẮT BUỘC trước khi trình bày bản sửa)

Grep bản sửa cho từng pattern sau. Nếu phát hiện → sửa ngay, không trình bày bản có lỗi:

- [ ] Không có trigger phrase trong Blacklist (Phần 1.1 của anti-ai-rules.md)
- [ ] Không có emphatic quotes quanh từ thông thường (Phần 1.2)
- [ ] Không có hedge words: "tương đối", "khá", "có thể nói rằng", "nhìn chung"
- [ ] Không có transition AI: "Hơn nữa,", "Bên cạnh đó,", "Đáng chú ý là,"
- [ ] Câu đầu không phải opener vĩ mô (nếu sửa mở bài)
- [ ] Câu kết không phải summary/closer AI (nếu sửa kết bài)
- [ ] Mọi số liệu có thời điểm hoặc ghi `[CẦN XÁC NHẬN]`

---

## Bước 4: Trình bày

Trình bày bản sửa dưới dạng diff rõ ràng:

```
❌ BẢN CŨ:
[đoạn gốc]

✅ BẢN SỬA:
[đoạn mới]
```

Sau đó hỏi: *"Bạn muốn ghi đè vào file hay cần chỉnh thêm?"*

Chỉ ghi đè vào file khi người dùng xác nhận.

Sau khi người dùng xác nhận và đã ghi vào file → đổi trạng thái dòng log ở Bước 1.5 thành `**Hoàn thành**` (cập nhật cột "Hành động xử lý" nếu khác dự kiến). Người dùng bỏ yêu cầu → đổi thành `**Huỷ**`.
