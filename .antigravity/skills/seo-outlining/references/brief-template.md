---
name: Content Brief Template — Value Investing
description: Template dàn ý SEO chi tiết cho dự án Value Investing — Investopedia phiên bản Việt Nam.
---

# SEO Content Outline: [Tên bài viết]

## 1. Thông số kỹ thuật (Metadata)

```yaml
---
Author: Nguyễn Viết Lộc
Status: Outline
Pipeline_Mode: Express | Guided | Auto
SERP_Research: true

# SEO Technical
Target_Keyword: "[Từ khóa chính]"
Secondary_Keywords: ["Từ khóa phụ 1", "phụ 2"]
LSI_Keywords: ["Từ khóa LSI"]
Entities: ["Tên người, tổ chức, khái niệm chuyên ngành"]
Search_Intent: "Informational | Transactional | Commercial"
Content_Type: "Comprehensive Guide | How-to | Listicle | Comparison"
Featured_Snippet: "Paragraph | List | Table | None"
Word_Count_Target: 0  # Đề xuất dựa trên Top 1-3 đối thủ + 10%

# Audience & Brand
Persona: "F0 Nhân viên văn phòng | Sinh viên tự học | Nhà đầu tư trung cấp"
Tone: "Gần gũi + Thành thật + Thực chiến"
Writer_Profile: "educational | analytical | comparison"
Writing_Method: "PAS | AIDA | 4Cs"
Disclaimer_Required: false  # true nếu bài phân tích/review cổ phiếu hoặc tài sản

# Anti-AI
Anti_AI_Flags:
  - "Trong kỷ nguyên số ngày nay..."
  - "Tóm lại, có thể thấy rằng..."
  - "Hy vọng bài viết này đã giúp bạn..."
  - "Không thể phủ nhận rằng..."
  # [Thêm cụm từ cụ thể cho bài này từ anti-ai-rules.md]

# Cluster & Linking
Cluster: "[Tên Cluster — ví dụ: co-phieu, phan-tich-co-ban]"
Cluster_Role: "Pillar | Cluster"
Category: "[slug category — ví dụ: co-phieu, co-ban, etf]"
Internal_Links:
  - anchor: "[Anchor text tự nhiên]"
    url: "[URL từ anchor-index.md]"
    placement: "[Vị trí trong bài — ví dụ: H2 Công thức EPS]"
---
```

- **Title:** [Tối đa 59 ký tự, chứa từ khóa chính]
- **Sapo:** [Chứa từ khóa chính, dạng Story hook hoặc Contrarian hook — KHÔNG mở bằng định nghĩa]
- **Meta description:** [~155 ký tự, chứa từ khóa chính, tóm tắt nội dung]
- **keyTakeaways:** [3–5 ý chính — dùng cho frontmatter Astro]
- **Slug:** `[tên-file-khong-dau-tieng-viet]`

---

## 2. SERP Data Points (Verified [Tháng/Năm])

- **Dữ liệu thực tế:** [BẮT BUỘC: Số liệu %, bảng giá, sự kiện thị trường thực tế từ SERP]
- **AI Overview hiện tại:** [Nội dung Google AI Overview đang hiển thị — nếu có]
- **Đối thủ Top 1–3:** [Điểm mạnh, điểm yếu/thiếu sót để tối ưu hơn]
- **Content Gap của ValueInvesting:** [Những gì Top 1-3 chưa có mà mình sẽ làm tốt hơn]

---

## 3. Cấu trúc nội dung chi tiết (Headings)

### H1: [Tiêu đề chính — chứa keyword chính xác]
> *Ghi chú cho drafter:* Sapo đi ngay sau H1, không có heading khác. Dùng Story hook hoặc Contrarian hook. Chứa keyword dạng truy vấn tự nhiên.

---

### H2: Key Takeaways
- Đặt ngay sau Sapo, trước khi bắt đầu nội dung chính.
- Dạng bullet 3–5 ý, mỗi ý ≤ 20 từ.
- Sẽ map sang `keyTakeaways:` trong Astro frontmatter.

---

### H2: [Section 1 — thường là "X là gì?" hoặc "X hoạt động thế nào?"]
- **Nội dung chính:** [Nhiệm vụ, luận điểm chính]
- **Entities & Keywords:** [List cụ thể]
- **Bằng chứng thực tế:** [BẮT BUỘC: Số liệu, ví dụ đời thường Việt Nam — quán cà phê, xe máy...]
- **Featured Snippet pattern:** [Paragraph 40–60 từ | List 6–8 items | Table | None]
- **Target:** [Số từ]

#### H3: [Tiêu đề con nếu cần]
- **Nội dung chính:** [Chi tiết hóa]
- **Target:** [Số từ]

---

### H2: [Section 2 — Ứng dụng thực tế / Cách dùng]
- **Nội dung chính:** [Trả lời "Đọc xong tôi làm được gì?"]
- **Entities & Keywords:** [List cụ thể]
- **Bằng chứng thực tế:** [Ví dụ cụ thể tại thị trường Việt Nam — HOSE, HNX, cổ phiếu VN cụ thể]
- **Ưu tiên format:** [Table so sánh | Numbered list các bước | Bullet list]
- **Target:** [Số từ]

---

### H2: [Section 3 — Lưu ý / Hạn chế / Sai lầm thường gặp]
- **Mục tiêu:** Tăng EEAT — chỉ ra điều người mới dễ hiểu sai.
- **Nội dung chính:** [Các điểm cần thận trọng, context Việt Nam cụ thể]
- **Target:** [Số từ]

---

### H2: Câu hỏi thường gặp (FAQ)
> Dùng 2–4 câu hỏi thực tế từ SERP "People Also Ask". Sẽ map sang `faq:` trong Astro frontmatter.
- **Q1:** [Câu hỏi thực tế từ PAA / Người dùng]
- **Q2:** [Câu hỏi thực tế]
- **Q3:** [Nếu có]
- **Target:** Mỗi câu trả lời 40–80 từ, trực diện.

---

### Kết bài & CTA
- **Mục tiêu:** 1 insight cốt lõi nhất bài + 1 hành động cụ thể làm ngay hôm nay.
- **Câu cuối:** Câu hỏi mở hoặc CTA nhẹ dẫn sang bài liên quan.
- **Internal link CTA:** [Bài nào trong anchor-index.md phù hợp nhất để dẫn tới?]

---

## 4. Kế hoạch Liên kết

- **External Links (Nguồn uy tín):** [UBCKNN, HOSE, CFA Institute, báo cáo tài chính doanh nghiệp...]
- **Internal Links:** [Xem `knowledge/3-pipeline/anchor-index.md` — ghi rõ anchor text + URL]
- **Yếu tố cạnh tranh:** [Bảng biểu | Ví dụ số liệu thực | Box "Lưu ý quan trọng"]

---

## 5. Image Manifest (Unsplash)

> Lập kế hoạch ảnh minh hoạ — sẽ được fetch & download tự động ở bước `/drafting`.
> Mỗi ảnh cần: vị trí chèn, search query tiếng Anh (cho Unsplash), alt text tiếng Việt (SEO + accessibility).

| Vị trí | Search query (EN) | Alt text (VN) |
|--------|--------------------|----------------|
| Đầu bài (sau Sapo) | "[concept ảnh, ví dụ: stock market chart screen]" | "[Mô tả ảnh bằng tiếng Việt, chứa từ khóa liên quan nếu tự nhiên]" |
| Dưới H2 "[tên section]" | "[concept ảnh liên quan section]" | "[Mô tả ảnh]" |

- Chỉ lập manifest cho ảnh **photo/editorial** (Unsplash). Infographic/illustration vẫn dùng `/image` (Gemini pipeline).
- Số lượng đề xuất: 1–3 ảnh/bài (đầu bài + 1–2 section quan trọng nhất).

---

## 6. Brand Voice Checklist (tự kiểm trước khi giao drafter)

- [ ] Sapo dùng Story hook hoặc Contrarian hook — KHÔNG mở bằng định nghĩa khô
- [ ] Có ít nhất 1 ví dụ đời thường Việt Nam (quán cà phê, xe máy, gửi tiết kiệm...)
- [ ] Không có từ nào trong Anti_AI_Flags
- [ ] Xưng hô: "Value Investing" (thương hiệu) — "Bạn" (độc giả); không xưng "chúng tôi", "mình"/"tôi"
- [ ] Mọi claim có số liệu hoặc nguồn đi kèm
- [ ] Kết bài = 1 insight + 1 hành động cụ thể

---

## 7. Nhật ký chỉnh sửa (Revision Log)

- **v1.0 (2026-06-14):** Cập nhật template cho Value Investing — thêm keyTakeaways, faq mapping, Astro frontmatter fields.
