# Writer Profiles — Giọng viết theo loại bài

3 profile giọng viết, chia theo **loại bài** (không chia theo persona người đọc).
Agent đọc file này ở bước drafting để biết bài cần viết theo giọng nào.

> **Quy tắc ưu tiên:** `knowledge/3-pipeline/anti-ai-rules.md` + `knowledge/3-pipeline/glossary.md` + `knowledge/1-brand/profile.md` > writer profile. Khi có xung đột, làm theo rules và brand profile, không theo profile giọng viết.

Cả 3 profile dùng chung nền giọng của Value Investing: xưng "Value Investing", gọi người đọc là "bạn", không dùng "chúng tôi" / "mình" / "tôi" / "Quý độc giả". Ba tính cách Gần gũi · Thành thật · Thực chiến áp dụng cho mọi bài.

## Chọn profile theo loại bài

| Profile | File | Loại bài | Persona chính | Category gợi ý |
|---|---|---|---|---|
| `educational` | `educational.md` | "X là gì", khái niệm nền, how-to cơ bản | Persona 1 "Minh Anh" + Persona 2 "Khoa" | `co-phieu`, `etf`, `trai-phieu`, `phai-sinh`, `nha-dau-tu` |
| `analytical` | `analytical.md` | Phân tích kỹ thuật, chỉ báo, chỉ số tài chính, đọc BCTC, định giá | Persona 3 "Hùng" (và F0 đã nắm nền) | `ky-thuat`, `co-ban` |
| `comparison` | `comparison.md` | So sánh CTCK / quỹ / sản phẩm, "X vs Y", "nên chọn" | Persona 1 "Minh Anh" | `reviews` |

## Cách khai báo trong Outline

Trong YAML header của outline, thêm một dòng:

```yaml
Writer_Profile: educational | analytical | comparison
```

Outline không khai báo `Writer_Profile` → mặc định `educational` (khớp `.agents/workflows/drafting.md`).

## Ví dụ chọn profile

- **"RSI là gì"** → `analytical`. Người đọc thường đã biết biểu đồ giá, cần hiểu tín hiệu và giới hạn của chỉ báo.
- **"Cổ tức là gì"** → `educational`. Khái niệm nền, cần ví dụ số tiền cụ thể ở mức vốn F0.
- **"TCBS vs VPS"** → `comparison`. Bài thuộc category `reviews`, cần bảng tiêu chí trung lập có nguồn và mốc thời gian.
- **"Báo cáo lưu chuyển tiền tệ"** → `analytical` hoặc `educational` tuỳ search intent. SERP toàn bài định nghĩa thì chọn `educational`; SERP thiên về cách phân tích dòng tiền doanh nghiệp thì chọn `analytical`.

## Khi một bài lai nhiều loại

Chọn profile theo intent chính của keyword (H1 trả lời câu hỏi gì). Phần phụ vẫn giữ giọng của profile chính, chỉ mượn kỹ thuật của profile khác (ví dụ bài `educational` vẫn được chèn 1 bảng so sánh ngắn).
