# Continuous Learning: Instincts (Bản năng rút gọn)

> **Bắt buộc:** Mọi agent/skill đọc file này trước khi viết. Bản đầy đủ (nguồn, feedback gốc, bản năng PENDING/DEPRECATED) ở `.antigravity/memory/instincts-archive.md`.
> **Sinh tự động** bởi `scripts/optimize_instincts.py` — không sửa tay. Sau `/learn`, ghi vào archive rồi chạy lại script.

## Văn phong & Ngôn từ (Style & Tone)

### Tránh mở bài vĩ mô
- Mở bài đi thẳng vào vấn đề cụ thể của người dùng. Không dạo đầu bằng bối cảnh vĩ mô (kỷ nguyên số, thế giới công nghệ, thị trường biến động...).

### Loại bỏ ngoặc kép nhấn mạnh (Emphatic Quotes)
- Tuyệt đối không sử dụng dấu ngoặc kép cho các cụm từ ẩn dụ, ví von hoặc thuật ngữ thông thường (ví dụ: đu đỉnh, vùng kiếm tiền). Viết thẳng và trực diện để tránh cảm giác máy móc.

### Thỏa mãn Search Intent kỹ thuật trong bài phân tích
- Đối với các bài viết về báo cáo tài chính hoặc công cụ kỹ thuật, ngoài việc phân tích chiến lược cho nhà đầu tư, cần bổ sung các kiến thức nền tảng như 'Phương pháp lập' hoặc 'Cấu tạo chi tiết'. Điều này giúp thỏa mãn các truy vấn tìm kiếm mang tính học thuật mà không làm loãng ảnh hưởng chiến lược của DSC.

### Tuân thủ độ dài đoạn và cấu trúc Heading chuẩn
- Khi chuyển từ Outline sang Draft, luôn sử dụng Markdown Headings tiêu chuẩn (`#`, `##`, `###`) thay vì giữ nguyên các chuỗi định dạng của Outline (`### H2:`). Điều này đảm bảo Script QA hoạt động chính xác khi cắt block nội dung.

### Bắt buộc có Sapo
- Mọi bài viết phải có đoạn Sapo (Mở bài) ngay dưới tiêu đề H1, đi thẳng vào vấn đề của reader. CTA cuối bài phải dẫn đến bài liên quan hoặc action cụ thể — không để lời kêu gọi suông.

### Sử dụng từ Chiến lược thay cho Thủ thuật hoặc Chiêu trò
- Luôn sử dụng từ "chiến lược" hoặc "phương pháp" thay cho "thủ thuật" hay "chiêu trò". Giọng văn chuẩn: chuyên gia tài chính độc lập, không phải blogger.

### Tránh sử dụng thuật ngữ "cơ chế truyền dẫn"
- Không sử dụng cụm từ "cơ chế truyền dẫn" trong các bài viết tài chính hay kinh tế vĩ mô. Hãy thay thế hoàn toàn bằng từ "tác động" để đảm bảo câu văn ngắn gọn, dễ hiểu, phù hợp với văn phong chuyên nghiệp và tự nhiên của nhà đầu tư.

### Sapo chứa từ khóa và bắt buộc Miễn trừ trách nhiệm
- 1. Sapo đầu bài phải chứa từ khóa chính xác dạng truy vấn một cách tự nhiên. 2. Bắt buộc chèn "Tuyên bố miễn trừ trách nhiệm" ở cuối bài viết phân tích/đánh giá cổ phiếu/tài sản — bài viết kiến thức nền tảng thì không cần.

### Loại bỏ từ ngữ giật gân, thiếu chuyên nghiệp
- Không sử dụng từ ngữ cảm xúc tiêu cực hoặc giật gân (ví dụ: "xương máu", "thất bại thảm hại"). Thay bằng các cụm từ trung tính và chuẩn mực: "quý báu", "cốt lõi", "quan trọng".

### Tách biệt list-item chứa nhiều câu và loại bỏ từ trigger "rõ ràng"
- 1. Với các danh sách gạch đầu dòng (list-item) mà mỗi dòng chứa từ 2 câu trở lên, luôn chèn một dòng trống ngăn cách giữa các dòng. Điều này giúp ngăn script QA tự động gộp các câu thành một đoạn văn quá dài (> 3 câu), đồng thời làm thoáng bố cục trên giao diện di động. 2. Tuyệt đối không sử dụng từ trigger rỗng nghĩa như "rõ ràng" (ví dụ: "phân biệt rõ ràng") để đảm bảo văn phong chuyên nghiệp và khách quan.

### Tránh đặt target từ số trên H2 chứa H3 con
- Đối với các thẻ H2 trong Outline dự kiến sẽ chứa các thẻ H3 con trong Draft (như phần Câu hỏi thường gặp FAQ), tuyệt đối không đặt target từ bằng con số ở Outline (ví dụ: **Target: 150 từ**). Thay vào đó, mô tả bằng chữ (ví dụ: **Target: Mỗi câu trả lời 40-80 từ**) để tránh script QA count_words.py parsing số và tính sai từ của H2.

### Không chèn FAQ vào body — Layout tự render từ frontmatter
- ArticleLayout và ReviewLayout tự render mục "Câu hỏi thường gặp" từ trường `faq[]` trong frontmatter (giống `keyTakeaways`). Khi finalize, tuyệt đối KHÔNG để lại H2 `## Câu hỏi thường gặp` với các H3 câu hỏi trong body — sẽ bị trùng lặp. Đưa toàn bộ Q&A vào frontmatter `faq[]`; `sources` cũng để frontmatter (CitationBox tự render). CTA/disclosure cuối bài thì giữ trong body.

## Cấu trúc & Định dạng (Structure & Formatting)

### Trình bày trực quan bằng List/Table
- Khi trình bày các số liệu so sánh, mức phí, hoặc quy trình từng bước, ưu tiên sử dụng Bảng (Table) hoặc Danh sách (Bullet list) để bài viết trực quan, dễ đọc, tránh các đoạn văn bản (text) quá dài.

### Loại bỏ công thức LaTeX và tối ưu đếm câu list-item
- Tuyệt đối không sử dụng định dạng LaTeX `$$` hay `$` cho các công thức tính toán tài chính vì dễ gây lỗi hiển thị trên CMS. Thay thế bằng công thức in đậm chuẩn trực quan (ví dụ: `**P' = P / (1 + a)**`). Đối với các danh sách (list-item) hoặc câu định nghĩa bắt đầu bằng cụm in đậm có dấu hai chấm `: `, hãy thay thế `:` bằng dấu chấm `. ` để ngăn script QA đếm gộp thành câu dài quá 25 từ, đồng thời giúp câu văn gãy gọn hơn.

### Tách biệt hoàn toàn visual elements để pass check đoạn văn liên tiếp
- Trong bài viết, các danh sách liệt kê (bullet points, numbered lists) hoặc bảng biểu khi đứng ngay sau một đoạn giới thiệu ngắn (ví dụ: "Các mốc tiến độ bao gồm:") phải được ngăn cách bằng 2 dòng trống (`\n\n`) thay vi viết liền kề. Việc này ngăn chặn script QA tự động đếm gộp đoạn văn và danh sách thành một khối không trực quan dài dòng, đồng thời tạo nhịp đọc thông thoáng cho người dùng.

### Tải cấu trúc đoạn văn theo ngữ nghĩa thay vì chia câu cơ học
- Khi tối ưu cấu trúc đoạn văn để đáp ứng chuẩn Mobile-First (tối đa 3 câu/đoạn, câu dưới 25 từ), phải gộp và ngắt đoạn dựa trên sự liên kết ngữ nghĩa (semantic grouping) của nội dung thay vì bẻ câu hay gộp câu một cách máy móc. Các câu thuộc cùng một khía cạnh giải thích phải nằm chung trong một đoạn (tối đa 3 câu) để đảm bảo mạch văn trôi chảy và tự nhiên.

### Trực quan hóa danh sách để tối ưu độ cô đọng
- Đối với các bài viết tài chính cho F0, tránh lạm dụng các khối văn bản lớn (text-heavy). Hãy cấu trúc lại thông tin thành các danh sách gạch đầu dòng có tiêu đề in đậm làm mốc phân cấp để tăng tính cô đọng và scannable. Các câu chuyện minh họa thực tế nên được trình bày thành các điểm dữ liệu ngắn gọn thay vì viết thành đoạn văn miêu tả dài dòng.

### Hợp nhất các danh sách liên tiếp để tránh đứt đoạn mạch đọc
- Khi gặp các nội dung phân loại liệt kê liên tiếp (như Đặc điểm nổi bật và Đối tượng phù hợp), tránh thiết lập các khối danh sách (bullet list) đứng kề nhau. Hãy hợp nhất chúng thành một danh sách kết hợp hoặc viết thêm một đoạn văn xuôi ngắn ở giữa làm cầu nối dẫn dắt để mạch đọc tự nhiên và pass QA.

### Cách đặt dấu câu trong list-item/FAQ để tối ưu tách câu
- Khi viết câu hỏi FAQ hoặc list-item bắt đầu bằng thẻ in đậm `**`, hãy đặt dấu chấm `. ` hoặc dấu chấm hỏi `? ` ngay bên ngoài thẻ in đậm (ví dụ: `* **Nhóm hàng hóa tỷ trọng lớn nhất**. Hàng ăn...` thay vì `* **Nhóm hàng hóa tỷ trọng lớn nhất?** Hàng ăn...`). Điều này giúp regex phân tách câu của script QA nhận diện dấu câu chính xác và ngăn chặn hiện tượng gộp đầu dòng thành câu dài quá 25 từ.

## Sản phẩm & Thương hiệu (Products & Brand Context)

### Tránh sử dụng callout box không tương thích
- Không sử dụng cú pháp callout mở rộng của Markdown (như `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`) vì chúng không tương thích hiển thị trên một số CMS. Hãy thay thế bằng cú pháp trích dẫn chuẩn của Markdown kết hợp tiêu đề in đậm (ví dụ: `> **Lưu ý:**` hoặc `> **Mẹo:**`).
