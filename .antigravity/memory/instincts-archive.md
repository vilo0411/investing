# Continuous Learning: Instincts (Bản năng)

> **Bắt buộc:** Mọi agent, skill, và workflow đều phải đọc file này trước khi thực thi.
> **Cập nhật:** Được auto-append sau mỗi `/approve` hoặc thủ công qua `/learn`.

File này lưu trữ những "bản năng" mà hệ thống AI học được qua quá trình sửa bài cùng người dùng.
Mỗi khi người dùng đưa ra phản hồi chỉnh sửa, hãy trích xuất nguyên lý và lưu vào đây.

---

## Format chuẩn cho mỗi bản năng

```
### [Tên ngắn gọn]
- **Trạng thái:** ACTIVE / DEPRECATED
- **Nguồn:** [Tên bài viết hoặc "Global feedback"]
- **Phản hồi từ User:** "[Quote phản hồi gốc]"
- **Bản năng:** [Quy tắc hành động cụ thể]
- **Phạm vi:** [Global / Chỉ topic: X]
```

---

## Bản năng Active

### Tránh mở bài vĩ mô
- **Trạng thái:** ACTIVE
- **Nguồn:** Feedback chung
- **Phản hồi từ User:** "Đừng bao giờ mở bài bằng cụm 'Trong kỷ nguyên số ngày nay...'"
- **Bản năng:** Mở bài đi thẳng vào vấn đề cụ thể của người dùng. Không dạo đầu bằng bối cảnh vĩ mô (kỷ nguyên số, thế giới công nghệ, thị trường biến động...).
- **Phạm vi:** Global

### Loại bỏ ngoặc kép nhấn mạnh (Emphatic Quotes)
- **Trạng thái:** ACTIVE
- **Nguồn:** adx-la-gi
- **Phản hồi từ User:** "sao tôi thấy đang sử dụng các ngoặc kép. Loại bỏ kiểu trình bày nài, AI quá"
- **Bản năng:** Tuyệt đối không sử dụng dấu ngoặc kép cho các cụm từ ẩn dụ, ví von hoặc thuật ngữ thông thường (ví dụ: đu đỉnh, vùng kiếm tiền). Viết thẳng và trực diện để tránh cảm giác máy móc.
- **Phạm vi:** Global

### [PLACEHOLDER: Brand-specific CTA rules]
- **Trạng thái:** PENDING
- **Nguồn:** Cần bổ sung sau khi có knowledge/1-brand/profile.md
- **Bản năng:** Sẽ cập nhật sau khi setup brand profile cho Value Investing.
- **Phạm vi:** Global

### Thỏa mãn Search Intent kỹ thuật trong bài phân tích
- **Trạng thái:** ACTIVE
- **Nguồn:** bao-cao-luu-chuyen-tien-te
- **Phản hồi từ User:** (Tham khảo AI Overview)
- **Bản năng:** Đối với các bài viết về báo cáo tài chính hoặc công cụ kỹ thuật, ngoài việc phân tích chiến lược cho nhà đầu tư, cần bổ sung các kiến thức nền tảng như 'Phương pháp lập' hoặc 'Cấu tạo chi tiết'. Điều này giúp thỏa mãn các truy vấn tìm kiếm mang tính học thuật mà không làm loãng ảnh hưởng chiến lược của DSC.
- **Phạm vi:** Global

### Tuân thủ độ dài đoạn và cấu trúc Heading chuẩn
- **Trạng thái:** ACTIVE
- **Nguồn:** phi-giao-dich-chung-khoan
- **Phản hồi từ User:** QA script `count_words.py` báo sai lệch khi dùng sai thẻ Heading.
- **Bản năng:** Khi chuyển từ Outline sang Draft, luôn sử dụng Markdown Headings tiêu chuẩn (`#`, `##`, `###`) thay vì giữ nguyên các chuỗi định dạng của Outline (`### H2:`). Điều này đảm bảo Script QA hoạt động chính xác khi cắt block nội dung.
- **Phạm vi:** Global

### Trình bày trực quan bằng List/Table
- **Trạng thái:** ACTIVE
- **Nguồn:** phi-luu-ky-chung-khoan
- **Phản hồi từ User:** "trình bày bài viết linh hoạt giữa list, table thay vì chỉ có text thôi"
- **Bản năng:** Khi trình bày các số liệu so sánh, mức phí, hoặc quy trình từng bước, ưu tiên sử dụng Bảng (Table) hoặc Danh sách (Bullet list) để bài viết trực quan, dễ đọc, tránh các đoạn văn bản (text) quá dài.
- **Phạm vi:** Global

### Bắt buộc có Sapo
- **Trạng thái:** ACTIVE
- **Nguồn:** phi-luu-ky-chung-khoan
- **Phản hồi từ User:** "chưa thấy có phần sapo bài viết"
- **Bản năng:** Mọi bài viết phải có đoạn Sapo (Mở bài) ngay dưới tiêu đề H1, đi thẳng vào vấn đề của reader. CTA cuối bài phải dẫn đến bài liên quan hoặc action cụ thể — không để lời kêu gọi suông.
- **Phạm vi:** Global

### Sử dụng từ Chiến lược thay cho Thủ thuật hoặc Chiêu trò
- **Trạng thái:** ACTIVE
- **Nguồn:** bollinger-bands-la-gi
- **Phản hồi từ User:** "dùng từ chiến lược hơn từ thủ thuật", "từ chiêu trò nghe không chuyên nghiệp"
- **Bản năng:** Luôn sử dụng từ "chiến lược" hoặc "phương pháp" thay cho "thủ thuật" hay "chiêu trò". Giọng văn chuẩn: chuyên gia tài chính độc lập, không phải blogger.
- **Phạm vi:** Global

### Tránh sử dụng thuật ngữ "cơ chế truyền dẫn"
- **Trạng thái:** ACTIVE
- **Nguồn:** cac-chi-so-phan-tich-bao-cao-tai-chinh
- **Phản hồi từ User:** "'cơ chế truyền dẫn' không phải từ ngữ phù hợp trong văn viết, đặc biệt là lĩnh vực tài chính. Viết là Tác động là được rồi. Không cần cơ chế đâu"
- **Bản năng:** Không sử dụng cụm từ "cơ chế truyền dẫn" trong các bài viết tài chính hay kinh tế vĩ mô. Hãy thay thế hoàn toàn bằng từ "tác động" để đảm bảo câu văn ngắn gọn, dễ hiểu, phù hợp với văn phong chuyên nghiệp và tự nhiên của nhà đầu tư.
- **Phạm vi:** Global

### Loại bỏ công thức LaTeX và tối ưu đếm câu list-item
- **Trạng thái:** ACTIVE
- **Nguồn:** chia-tach-co-phieu
- **Phản hồi từ User:** "phần công thức lên docs sẽ bị lỗi. Sửa lại" + "word count / sentence length check"
- **Bản năng:** Tuyệt đối không sử dụng định dạng LaTeX `$$` hay `$` cho các công thức tính toán tài chính vì dễ gây lỗi hiển thị trên CMS. Thay thế bằng công thức in đậm chuẩn trực quan (ví dụ: `**P' = P / (1 + a)**`). Đối với các danh sách (list-item) hoặc câu định nghĩa bắt đầu bằng cụm in đậm có dấu hai chấm `: `, hãy thay thế `:` bằng dấu chấm `. ` để ngăn script QA đếm gộp thành câu dài quá 25 từ, đồng thời giúp câu văn gãy gọn hơn.
- **Phạm vi:** Global

### Sapo chứa từ khóa và bắt buộc Miễn trừ trách nhiệm
- **Trạng thái:** ACTIVE
- **Nguồn:** General
- **Bản năng:**
  1. Sapo đầu bài phải chứa từ khóa chính xác dạng truy vấn một cách tự nhiên.
  2. Bắt buộc chèn "Tuyên bố miễn trừ trách nhiệm" ở cuối bài viết phân tích/đánh giá cổ phiếu/tài sản — bài viết kiến thức nền tảng thì không cần.
- **Phạm vi:** Global

### Tách biệt hoàn toàn visual elements để pass check đoạn văn liên tiếp
- **Trạng thái:** ACTIVE
- **Nguồn:** co-nen-mua-co-phieu-novaland
- **Phản hồi từ User:** "consecutive paragraphs check"
- **Bản năng:** Trong bài viết, các danh sách liệt kê (bullet points, numbered lists) hoặc bảng biểu khi đứng ngay sau một đoạn giới thiệu ngắn (ví dụ: "Các mốc tiến độ bao gồm:") phải được ngăn cách bằng 2 dòng trống (`\n\n`) thay vi viết liền kề. Việc này ngăn chặn script QA tự động đếm gộp đoạn văn và danh sách thành một khối không trực quan dài dòng, đồng thời tạo nhịp đọc thông thoáng cho người dùng.
- **Phạm vi:** Global

### Loại bỏ từ ngữ giật gân, thiếu chuyên nghiệp
- **Trạng thái:** ACTIVE
- **Nguồn:** General
- **Bản năng:** Không sử dụng từ ngữ cảm xúc tiêu cực hoặc giật gân (ví dụ: "xương máu", "thất bại thảm hại"). Thay bằng các cụm từ trung tính và chuẩn mực: "quý báu", "cốt lõi", "quan trọng".
- **Phạm vi:** Global

### Tải cấu trúc đoạn văn theo ngữ nghĩa thay vì chia câu cơ học
- **Trạng thái:** ACTIVE
- **Nguồn:** quy-dong-la-gi
- **Phản hồi từ User:** "việc ngắt của bạn đang ko theo nội dung. sau cái đầu tiên ko ngắt mà cái thứ 2 lại ngắt"
- **Bản năng:** Khi tối ưu cấu trúc đoạn văn để đáp ứng chuẩn Mobile-First (tối đa 3 câu/đoạn, câu dưới 25 từ), phải gộp và ngắt đoạn dựa trên sự liên kết ngữ nghĩa (semantic grouping) của nội dung thay vì bẻ câu hay gộp câu một cách máy móc. Các câu thuộc cùng một khía cạnh giải thích phải nằm chung trong một đoạn (tối đa 3 câu) để đảm bảo mạch văn trôi chảy và tự nhiên.
- **Phạm vi:** Global

### Trực quan hóa danh sách để tối ưu độ cô đọng
- **Trạng thái:** ACTIVE
- **Nguồn:** quy-tuong-ho-la-gi
- **Phản hồi từ User:** "bài viết đang toàn text, dài. cô đọng hơn"
- **Bản năng:** Đối với các bài viết tài chính cho F0, tránh lạm dụng các khối văn bản lớn (text-heavy). Hãy cấu trúc lại thông tin thành các danh sách gạch đầu dòng có tiêu đề in đậm làm mốc phân cấp để tăng tính cô đọng và scannable. Các câu chuyện minh họa thực tế nên được trình bày thành các điểm dữ liệu ngắn gọn thay vì viết thành đoạn văn miêu tả dài dòng.
- **Phạm vi:** Global

### Hợp nhất các danh sách liên tiếp để tránh đứt đoạn mạch đọc
- **Trạng thái:** ACTIVE
- **Nguồn:** quy-trai-phieu-la-gi
- **Phản hồi từ User:** "Tham khảo nội dung AI overview trên để tối ưu" (Đặc điểm nổi bật + Ai nên đầu tư)
- **Bản năng:** Khi gặp các nội dung phân loại liệt kê liên tiếp (như Đặc điểm nổi bật và Đối tượng phù hợp), tránh thiết lập các khối danh sách (bullet list) đứng kề nhau. Hãy hợp nhất chúng thành một danh sách kết hợp hoặc viết thêm một đoạn văn xuôi ngắn ở giữa làm cầu nối dẫn dắt để mạch đọc tự nhiên và pass QA.
- **Phạm vi:** Global

---

### Tránh sử dụng callout box không tương thích
- **Trạng thái:** ACTIVE
- **Nguồn:** dcf-la-gi
- **Phản hồi từ User:** "các phần quote kiểu > [!NOTE] ko hoạt động trên website tôi nên bỏ đi"
- **Bản năng:** Không sử dụng cú pháp callout mở rộng của Markdown (như `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`) vì chúng không tương thích hiển thị trên một số CMS. Hãy thay thế bằng cú pháp trích dẫn chuẩn của Markdown kết hợp tiêu đề in đậm (ví dụ: `> **Lưu ý:**` hoặc `> **Mẹo:**`).
- **Phạm vi:** Global

### Cách đặt dấu câu trong list-item/FAQ để tối ưu tách câu
- **Trạng thái:** ACTIVE
- **Nguồn:** chi-so-gia-tieu-dung-cpi-la-gi-va-moi-quan-he-voi-thi-truong-chung-khoan
- **Phản hồi từ User:** Lỗi "Sentence too long" do script QA gộp câu trong danh sách hoặc FAQ.
- **Bản năng:** Khi viết câu hỏi FAQ hoặc list-item bắt đầu bằng thẻ in đậm `**`, hãy đặt dấu chấm `. ` hoặc dấu chấm hỏi `? ` ngay bên ngoài thẻ in đậm (ví dụ: `* **Nhóm hàng hóa tỷ trọng lớn nhất**. Hàng ăn...` thay vì `* **Nhóm hàng hóa tỷ trọng lớn nhất?** Hàng ăn...`). Điều này giúp regex phân tách câu của script QA nhận diện dấu câu chính xác và ngăn chặn hiện tượng gộp đầu dòng thành câu dài quá 25 từ.
- **Phạm vi:** Global

---

### Tách biệt list-item chứa nhiều câu và loại bỏ từ trigger "rõ ràng"
- **Trạng thái:** ACTIVE
- **Nguồn:** loi-nhuan-rong-va-loi-nhuan-sau-thue
- **Phản hồi từ User:** Lỗi "Paragraph too many sentences" do script QA gộp các list item và cảnh báo từ trigger "rõ ràng".
- **Bản năng:**
  1. Với các danh sách gạch đầu dòng (list-item) mà mỗi dòng chứa từ 2 câu trở lên, luôn chèn một dòng trống ngăn cách giữa các dòng. Điều này giúp ngăn script QA tự động gộp các câu thành một đoạn văn quá dài (> 3 câu), đồng thời làm thoáng bố cục trên giao diện di động.
  2. Tuyệt đối không sử dụng từ trigger rỗng nghĩa như "rõ ràng" (ví dụ: "phân biệt rõ ràng") để đảm bảo văn phong chuyên nghiệp và khách quan.
- **Phạm vi:** Global

---

### Tránh đặt target từ số trên H2 chứa H3 con
- **Trạng thái:** ACTIVE
- **Nguồn:** cach-dau-tu-co-phieu
- **Phản hồi từ User:** Sửa lỗi script count_words.py đếm thiếu từ của H2 Câu hỏi thường gặp do split bởi H3 câu hỏi con.
- **Bản năng:** Đối với các thẻ H2 trong Outline dự kiến sẽ chứa các thẻ H3 con trong Draft (như phần Câu hỏi thường gặp FAQ), tuyệt đối không đặt target từ bằng con số ở Outline (ví dụ: **Target: 150 từ**). Thay vào đó, mô tả bằng chữ (ví dụ: **Target: Mỗi câu trả lời 40-80 từ**) để tránh script QA count_words.py parsing số và tính sai từ của H2.
- **Phạm vi:** Global

### Không chèn FAQ vào body — Layout tự render từ frontmatter
- **Trạng thái:** ACTIVE
- **Nguồn:** cach-mo-tai-khoan-chung-khoan-vps
- **Bản năng:** ArticleLayout và ReviewLayout tự render mục "Câu hỏi thường gặp" từ trường `faq[]` trong frontmatter (giống `keyTakeaways`). Khi finalize, tuyệt đối KHÔNG để lại H2 `## Câu hỏi thường gặp` với các H3 câu hỏi trong body — sẽ bị trùng lặp. Đưa toàn bộ Q&A vào frontmatter `faq[]`; `sources` cũng để frontmatter (CitationBox tự render). CTA/disclosure cuối bài thì giữ trong body.
- **Phạm vi:** Global

*(Agent tự động append bản năng mới vào section "Bản năng Active" sau mỗi vòng viết.)*




