# Liên kết nội bộ

Khối “Bài viết liên quan” chọn tối đa ba bài từ collection đã xuất bản:

- Một bài nền tảng của danh mục; nếu đang đọc hub thì chọn bài hướng dẫn thực hành.
- Hai bài đọc tiếp xếp theo công ty chứng khoán chung, chủ đề nhỏ, tags và từ khóa trong tiêu đề. Các lựa chọn ngang điểm ưu tiên bài chưa được dẫn trong thân bài, sau đó dùng thứ tự ổn định theo cặp bài nguồn/đích.
- Không tự liên kết, không chọn trùng; không dùng ngày hiện tại hoặc thứ tự collection để quyết định kết quả.

Logic nằm ở `src/lib/related-articles.mjs`. Mapping hub/action và đường dẫn nằm ở `src/data/internal-links.json`. `src/data/link-topics.json` được khởi tạo từ các bài đã tồn tại trong `knowledge/4-content/topic-clusters.md`; khi thêm bài hoặc thay đổi cluster, cập nhật danh sách này. Bài chưa được gán cluster vẫn được xếp theo tags, tiêu đề và danh mục. Chỉ slug tồn tại trong collection mới có thể xuất hiện ở khối liên quan.

Link trong thân bài cần gắn vào ý đang được giải thích, dùng anchor mô tả rõ trang đích. Bổ sung liên kết tới bài chuyên sâu từ hub và bài cùng chủ đề khi phù hợp; tránh áp số lượng hoặc mật độ giống nhau cho mọi bài.

## Kiểm tra

- `npm run links:audit`: phân tích link Markdown trong thân bài, kiểm tra đường dẫn đầy đủ, hub/action, anchor và số nguồn dẫn tới từng bài. Chấp nhận URL tuyệt đối cùng origin, query và đường dẫn tương đối; không chấp nhận chỉ vì slug cuối tồn tại.
- `npm run links:check`: kiểm tra HTML trong `dist` sau build. Bắt cả link từ template, HTML thô và link tham chiếu Markdown đã render. Thất bại nếu có đích không tồn tại, trang chuyển hướng, mục neo thiếu, bài trong sitemap không có trang HTML, bài mồ côi hoặc bài không đến được từ trang chủ. Anchor trống được cảnh báo.
- `npm run links:test`: kiểm tra chọn bài liên quan và các tình huống URL sai danh mục, URL tuyệt đối, fragment, chuyển hướng, bài mồ côi và base path của GitHub Pages.
- `npm run build`: chạy validation hiện có, Astro check/build, rồi tự động chạy `links:check`.
- `node scripts/audit-built-links.mjs --json`: xuất báo cáo đầy đủ để so sánh phân bổ liên kết.

Audit HTML suy ra origin và base path từ canonical trang chủ. Các link tới domain khác không được kiểm tra HTTP. Độ sâu đếm theo HTML, bao gồm sơ đồ trang và thẻ bài ẩn chờ “xem thêm”; số liệu này không đo mức độ dễ thấy của bài trên giao diện. Các chỉ số phân bổ liên kết là dữ liệu hỗ trợ biên tập, không phải cam kết xếp hạng tìm kiếm.
