# Anti-AI Rules — Value Investing

Quy định bắt buộc về phong cách viết bài và loại bỏ "AI-vibe" nhằm tối ưu hóa trải nghiệm đọc thực tế và vượt qua các thuật toán đánh giá nội dung của công cụ tìm kiếm.

---

## 1. Blacklist Phrases (Tuyệt đối không dùng)

### Mở bài sáo rỗng (AI-vibe)
- "Trong kỷ nguyên số ngày nay..."
- "Trong bối cảnh thị trường biến động..."
- "Không thể phủ nhận rằng..."
- "Ngày nay, với sự phát triển của..."
- "Đối với nhiều nhà đầu tư..."
- Tránh dạo đầu bằng bối cảnh vĩ mô. Hãy đi thẳng vào vấn đề cụ thể của người đọc trong 2 câu đầu tiên.
- Tránh mở đầu trực tiếp bằng định nghĩa khô khan (ví dụ: "Value investing là phương pháp...").

### Kết bài công thức (AI-vibe)
- "Tóm lại, có thể thấy rằng..."
- "Nhìn chung, X là một yếu tố quan trọng..."
- "Hy vọng bài viết này đã giúp bạn..."
- "Chúc bạn đầu tư thành công!"
- Hãy kết bài bằng: 1 insight cốt lõi + 1 hành động cụ thể bạn đọc làm được ngay hôm nay. Câu cuối là câu hỏi mở hoặc CTA nhẹ dẫn bài liên quan.

### Tính từ/Phó từ mơ hồ
- "quan trọng", "hiệu quả", "tốt", "nhanh", "đáng kể", "nhiều", "một số"
- Thay bằng số liệu cụ thể hoặc xóa bỏ.
- Không sử dụng từ "rõ ràng" (ví dụ: "phân biệt rõ ràng") để giữ văn phong khách quan.
- Banned promotional words: "Không thể bỏ lỡ", "Siêu hot", "Cơ hội vàng", "Đừng bỏ lỡ", "Hãy cùng chúng tôi khám phá...".

### Dấu câu & Ký tự đặc biệt
- Ngoặc kép dùng để nhấn mạnh từ ẩn dụ/thuật ngữ (ví dụ: "đu đỉnh", "vùng kiếm tiền") → Viết thẳng, không ngoặc kép.
- LaTeX `$$formula$$` hoặc `$formula$` → Viết in đậm chuẩn Markdown (ví dụ: `**P' = P / (1 + a)**`) để tránh lỗi hiển thị trên CMS.
- Callout mở rộng dạng `> [!NOTE]`, `> [!TIP]` → Thay thế bằng trích dẫn tiêu chuẩn: `> **Lưu ý:**` hoặc `> **Mẹo:**`.

---

## 2. Quy tắc Soạn thảo

### Cấu trúc bài viết bắt buộc
1. **Sapo (Mở bài):** Ngay dưới Title H1, bắt buộc chứa từ khóa chính dạng truy vấn một cách tự nhiên. Sử dụng **Story hook** (kể câu chuyện ngắn liên quan) hoặc **Contrarian hook** (nói ngược quan niệm sai lầm).
2. **Key Takeaways:** 3-5 ý chính tóm tắt giá trị bài viết, đặt trong hộp tóm tắt ngay đầu bài.
3. **Thân bài:** Các thẻ Heading H2/H3 viết chuẩn Markdown.
4. **FAQ:** 2-4 câu hỏi thực tế từ người dùng.
5. **CTA:** Định hướng thực hiện hành động thực hành cụ thể.
6. **Tuyên bố miễn trừ trách nhiệm:** Bắt buộc chèn ở cuối mọi bài viết phân tích hoặc đánh giá cổ phiếu/tài sản (bài kiến thức nền tảng chung thì không cần).

### Quy định Mobile-First & Dễ đọc
- **Xưng hô:** Đây là dự án một người, nên thương hiệu xưng bằng tên "Value Investing", gọi người đọc là "bạn". Tránh "quý độc giả", "các bạn", "chúng tôi" (hàm ý tập thể) và ngôi cá nhân "mình"/"tôi". Lưu ý: "của mình", "tự mình" khi chỉ chính người đọc hoặc bên thứ ba thì vẫn dùng bình thường.
- **Ví dụ bắt buộc:** Mỗi bài viết bắt buộc có ít nhất 1 ví dụ đời thường Việt Nam để giải thích thuật ngữ khó (quán cà phê, xe máy, gửi tiết kiệm...).
- **Độ dài câu:** Tối đa 25 từ. Khi viết danh sách gạch đầu dòng có tiêu đề in đậm kèm dấu hai chấm `:`, hãy thay thế `:` bằng dấu chấm `. ` để tối ưu hóa đếm từ của script QA.
- **Độ dài đoạn:** Tối đa 2-3 câu. Ngắt đoạn dựa trên sự liên kết ngữ nghĩa (semantic grouping), tránh ngắt cơ học làm đứt mạch ý.
- **Tách biệt Visual Elements:** Để tránh script QA đếm gộp đoạn văn giới thiệu và danh sách/bảng biểu đứng ngay sau nó, hãy chèn đúng 2 dòng trống (`\n\n`) ngăn cách giữa chúng.
- **Độ thoáng danh sách:** Với các danh sách gạch đầu dòng (list-item) chứa từ 2 câu trở lên, hãy chèn một dòng trống ngăn cách giữa các dòng.

---

## 3. Self-Audit Checklist (Chạy trước khi gửi bài)

- [ ] Sapo chứa từ khóa chính xác dạng truy vấn?
- [ ] Mở bài bằng Story hook hoặc Contrarian hook (không mở đầu bằng định nghĩa)?
- [ ] Có ít nhất 1 ví dụ đời thường thực tế của Việt Nam?
- [ ] Không chứa bất kỳ cụm từ nào trong danh sách Blacklist?
- [ ] Không có công thức định dạng LaTeX?
- [ ] Xưng hô đúng chuẩn "bạn" — "Value Investing" (không xưng "chúng tôi", "mình"/"tôi")?
- [ ] Mọi con số, lãi suất, tỷ lệ đều có nguồn gốc trích dẫn?
- [ ] Không có câu nào dài quá 25 từ?
- [ ] Không có đoạn văn nào nhiều hơn 3 câu?
- [ ] Các danh sách và bảng biểu đã có khoảng trống ngăn cách chuẩn?
- [ ] Kết bài có tóm tắt 1 insight + 1 hành động thực tế làm ngay?
- [ ] Các bài viết phân tích/review cổ phiếu đã có Tuyên bố miễn trừ trách nhiệm ở cuối?
- [ ] Frontmatter có trường heroImage trỏ tới ảnh bìa riêng biệt của bài viết dạng "/images/articles/[slug]/hero.jpg" (không dùng ảnh mặc định chung của category)?
- [ ] Có ít nhất 1 hình ảnh inline trong thân bài dạng relative path `./images/[slug]/[filename].jpg` và tệp ảnh thực tế tồn tại? Ảnh này phải đặt ở các phần H2/H3 tiếp theo ở giữa/cuối bài, tuyệt đối không đặt ngay dưới Sapo.
- [ ] Sapo (mở bài) có chứa tên thương hiệu "**[Value Investing](/)**" có gắn link về trang chủ?
- [ ] Không chèn tiêu đề hoặc danh sách `## Key Takeaways` thủ công bằng Markdown vào thân bài viết (vì trường `keyTakeaways` trong frontmatter đã được Layout tự động render).



