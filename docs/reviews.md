# Reviews: cấu trúc nội dung và vận hành dữ liệu

## Kiến trúc và SEO

Giữ nguyên URL đang có. Ba loại bài phục vụ ba ý định tìm kiếm khác nhau, có title/H1, nội dung chính và canonical riêng. `/reviews/` là hub tra cứu và điều hướng; các bộ lọc dùng query string và canonical về hub. `/reviews/so-sanh/?ctck=...` là công cụ bổ trợ, đặt `noindex, follow` và không đưa vào sitemap. Không canonical bài A–B hoặc hướng dẫn mở tài khoản về bài review A.

Google khuyến khích review có bằng chứng, tiêu chí định lượng, ưu/nhược điểm và lý do phù hợp với từng đối tượng: [hướng dẫn review chất lượng](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews). Canonical dành cho nội dung trùng hoặc rất tương đồng, không thay thế kiến trúc nội dung: [tài liệu canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

| Loại bài | Câu hỏi chính | Nội dung riêng | Bước tiếp theo |
| --- | --- | --- | --- |
| Review A | Công ty có phù hợp với tôi? | Hồ sơ có bằng chứng; chi phí/điều kiện; trải nghiệm và giới hạn thử nghiệm; ưu/nhược điểm; phù hợp/không phù hợp | Bài so sánh A–B hoặc mở tài khoản A |
| So sánh A–B | Với nhu cầu của tôi, đánh đổi là gì? | Bảng số liệu chung; so theo cùng tình huống; khác biệt về sản phẩm, hỗ trợ và sử dụng; kết luận có điều kiện | Review riêng từng bên, hướng dẫn mở tài khoản bên đã chọn |
| Mở tài khoản A | Tôi cần làm gì và xử lý lỗi thế nào? | Chuẩn bị; link/app chính thức; từng bước với ảnh tự chụp đã ẩn thông tin; lỗi thường gặp; kiểm tra loại tài khoản, người giới thiệu và biểu phí | Hoàn thành tại CTCK; quay lại review nếu còn phân vân |

Không chép toàn bộ hướng dẫn mở tài khoản vào review. Component review rút gọn phần này thành liên kết khi có bài hướng dẫn tương ứng. Không tạo hàng loạt bài so sánh chỉ bằng cách thay tên; chỉ xuất bản khi có phân tích riêng. Không dùng ảnh stock làm bằng chứng đã trải nghiệm app. Ngày đối chiếu từng chính sách độc lập với ngày sửa bài; không đổi toàn bộ ngày kiểm chứng khi chỉ sửa giao diện.

### Metadata

Review công ty và so sánh tiếp tục dùng `layoutType: review`, `reviewType: company|comparison`, `brokers: [{slug: ...}]`. Hướng dẫn mở tài khoản giữ layout bài viết và bổ sung:

```yaml
category: reviews
reviewType: account
brokers:
  - slug: ssi
```

`BrokerJourney.astro` tự nối các bài hiện hữu theo metadata, không suy đoán URL và không tạo liên kết tới bài chưa tồn tại. Bài mở tài khoản chỉ nhắc ngắn phí trước đăng ký và dẫn về bảng đầy đủ. Bài so sánh nhúng `SourcedComparison.astro`; các mức trong bài, hub và công cụ cùng đọc catalog. Văn bản nhận định cũ chưa được coi là tái kiểm chứng: điểm biên tập cũ được ghi rõ, phần verdict cũ trong bài so sánh được thu gọn. Khi sửa từng bài, thay các khẳng định phí trong văn xuôi bằng diễn giải gói và liên kết tới bảng chung.

## Nguồn dữ liệu

- Hồ sơ/nội dung biên tập: `src/data/brokers.ts` và `src/content/articles/`.
- Chi phí, điều kiện, ưu đãi, nguồn và lịch sử: `src/data/reviews/catalog.json`.
- Schema kiểm tra khi build và lưu quản trị: `src/lib/review-data.mjs`.
- Dữ liệu tài chính trong `mergeBroker()` ưu tiên catalog, không lấy các override cũ trong frontmatter.
- Những trường thiếu giữ trạng thái “Chưa xác minh”. Số 0 phải có tài liệu làm căn cứ. Không suy ra không cung cấp dịch vụ từ việc chưa tìm được nguồn.

Mỗi chính sách có giá trị, đơn vị gốc, điều kiện, thành phần phí Sở, nguồn, ngày đối chiếu, thời gian hiệu lực và trạng thái nháp/xuất bản. Một công ty có nhiều gói; chỉ một mức chuẩn cho mỗi loại chi phí trong cùng khoảng thời gian. Nếu thay mức chuẩn, kết thúc thời hạn bản cũ trước khi xuất bản bản mới. Giữ lịch sử, không ghi đè ngày hiệu lực cũ.

### Phạm vi đối chiếu ban đầu

Đã đối chiếu số liệu cho 19/20 hồ sơ, bao phủ 70/80 ô chi phí chuẩn (4 tiêu chí × 20 công ty), 77 bản chính sách gồm lịch sử và các gói bổ sung, từ 49 mục nguồn. Pinetree dùng tài liệu mới hiệu lực 02/11/2026 và giữ bản trước trong lịch sử. Mirae Asset đã có phí cơ sở, margin và ứng trước từ API chính thức. KIS phái sinh được tách số học từ 7.700đ gồm Sở trừ 2.700đ phí Sở; ghi phép tính trong điều kiện.

10 ô còn thiếu có lý do và nguồn đã kiểm tra trong `src/data/reviews/verification-gaps.json`, hiển thị qua “Vì sao thiếu?”: KBSV (4 ô, tài liệu bị chặn); DSC (margin/ứng trước ghi 13,5% nhưng chưa xác nhận đơn vị và phái sinh chưa tìm được); KIS ứng trước (trang dịch vụ thiếu mức phí); TPS phái sinh (chưa có trong biểu phí đã đọc); Mirae Asset phái sinh (nguồn bị chặn). Không sử dụng số từ trang tổng hợp để lấp chỗ trống. Trạng thái này không nói về chất lượng công ty.

Các ví dụ cần giữ điều kiện: DNSE tách giao dịch tiền mặt/ký quỹ/có tư vấn và ứng trước để mua/để rút tiền; TCBS tách có/không có iWealth Partner; ACBS tách tự giao dịch/có tư vấn; MBS, FPTS công bố một số lãi theo ngày nên giữ nguyên đơn vị. Không dùng gói khuyến mãi thay lãi chuẩn. Không coi ưu đãi không ghi hạn là cam kết lâu dài.

## Giao diện và hành trình đọc

Hub có ba lối vào: review/biểu phí, bài so sánh và hướng dẫn mở tài khoản. `BrokerJourney.astro` hiển thị ba bước ngay sau tiêu đề trên các bài liên quan. Chọn đúng cặp có bài biên tập sẽ hiện nút đọc bài A–B trong thanh lựa chọn; công cụ đối chiếu có liên kết bài tương ứng ngay trước biểu mẫu và cập nhật theo lựa chọn. Công cụ vẫn noindex và ngoài sitemap; URL/canonical các bài cũ được giữ nguyên.

Bấm lại tiêu đề cột đảo tăng/giảm, có mũi tên, `aria-sort` và lưu chiều trong URL. Dữ liệu thiếu nằm cuối cả hai chiều. Mở điều kiện/nguồn dùng native dialog, cột có kích thước ổn định; đóng bằng Escape, nút Đóng hoặc vùng ngoài, trả focus. Không JavaScript dùng native details với đầy đủ nguồn.

## Làm nổi bật số liệu

`review-emphasis.mjs` chỉ tính nhấn mạnh khi có ít nhất hai mức chuẩn cố định, còn hiệu lực và đối chiếu trong 30 ngày, cùng loại phí, đơn vị và cách gồm phí. Mức “từ”, khoảng giá trị và phí Sở chưa xác định không được gắn nhãn rẻ nhất/đắt nhất. Tất cả bằng nhau không gắn nhãn cực trị. Nền xanh tăng dần cho số thấp hơn; nhãn chữ giúp người đọc không phải dựa vào màu. Không dùng cách này để chấm an toàn hay chất lượng CTCK.

Hub tính theo toàn bộ nhóm dữ liệu để bộ lọc không làm đổi ý nghĩa nhãn. Công cụ và bài A–B tính trong các công ty đang so sánh. Lãi theo năm và theo ngày được tách nhóm khi sắp xếp; không tự quy đổi khi chưa có cơ sở tính.

## Quản trị

```sh
npm run reviews:admin
```

Mở liên kết được in trong terminal. Công cụ chỉ bind `127.0.0.1`, dùng token phiên và không nằm trong website xuất bản. Có các nhóm biểu phí, nguồn, ưu đãi, liên kết, lịch sử; chỉnh bản làm việc rồi ghi lý do trước khi lưu. Schema chặn ID trùng, nguồn không tồn tại, ngày/đơn vị sai và mức chuẩn chồng thời hạn. Kiểm tra revision tránh ghi đè thay đổi của người khác. Bản sao trước khi lưu nằm trong `.local/reviews/history/`, được gitignore.

Sau khi lưu, xem `git diff`, chạy kiểm tra và build theo quy trình website. Đây là quản trị bằng tệp cho website tĩnh, không phải CMS nhiều người dùng trên production. Bài viết tiếp tục chỉnh bằng Markdown như hiện tại.

```sh
npm run reviews:validate
npm run reviews:test
npm run build
# Khi astro preview đang chạy ở cổng tương ứng:
REVIEW_TEST_URL=http://localhost:4323 npm run reviews:test:browser
```

Test trình duyệt dùng tệp tạm cho thao tác quản trị, không sửa catalog thật. Ảnh kiểm tra lưu trong `.local/reviews/screenshots/`.

## Theo dõi nguồn và thời hạn

```sh
npm run reviews:sources
# Hoặc chọn ID nguồn:
npm run reviews:sources -- ssi-trading dnse-stocks
```

Tác vụ lưu bản tài liệu gốc và hash trong `.local/reviews/sources/`. Báo cáo phân biệt lần đầu, không đổi, có thay đổi và lỗi tải. HTML/PDF thay đổi chỉ là tín hiệu cần đọc lại; không tự xác nhận số liệu hoặc cập nhật `checkedAt`. Dữ liệu chỉ xuất bản sau khi người phụ trách đối chiếu lại.

Trình duyệt tự kiểm tra ngày Việt Nam để ẩn ưu đãi hết hạn và hiện nhắc kiểm tra nguồn quá 30 ngày. Vì website tĩnh, cần build lại hằng ngày nếu muốn HTML không JavaScript và chính sách hiệu lực tương lai luôn cập nhật. Chưa tự cài lịch hay triển khai lên production. Gợi ý vận hành: kiểm tra thay đổi nguồn hằng ngày, duyệt khi có khác biệt, build lại sau khi duyệt; phân biệt hạn đăng ký và thời gian hưởng ưu đãi.

## Đo lường

Liên kết chính thức/đối tác gắn `data-broker-outbound` và phát sự kiện `review_outbound_click` vào `dataLayer`, gồm mã công ty, loại link và tên miền đích. Link đối tác dùng `rel=sponsored` và công khai ở vị trí hiển thị. Lượt bấm không được coi là tài khoản mở thành công nếu chưa có đối soát từ đối tác.
