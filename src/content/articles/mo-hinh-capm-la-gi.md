---
title: "Mô hình CAPM là gì? Công thức tính và ứng dụng định giá cổ phiếu"
description: >-
  Mô hình CAPM là gì? Hướng dẫn công thức tính tỷ suất sinh lời kỳ vọng, hệ số
  Beta, phần bù rủi ro thị trường và cách áp dụng CAPM tại Việt Nam cho F0.
category: co-ban
heroImage: "/images/articles/mo-hinh-capm-la-gi/mo-hinh-capm-la-gi.jpg"
publishDate: '2026-11-11'
updatedDate: '2026-11-11'
readingTime: 7 phút đọc
featured: false
order: 100
tags:
  - mô hình capm là gì
  - mô hình định giá tài sản vốn
  - hệ số beta
  - chi phí vốn chủ sở hữu
  - phân tích cơ bản
faq:
  - question: Lãi suất phi rủi ro trong mô hình CAPM tại Việt Nam thường lấy theo chỉ số nào?
    answer: >-
      Tại thị trường Việt Nam, các nhà phân tích thường sử dụng lợi suất trái phiếu Chính phủ
      Việt Nam kỳ hạn 10 năm (dao động khoảng 2,7% đến 3,5%/năm) làm lãi suất phi rủi ro chuẩn.
  - question: Hệ số Beta của một cổ phiếu bằng 1,5 có ý nghĩa gì trong mô hình CAPM?
    answer: >-
      Hệ số Beta bằng 1,5 cho biết cổ phiếu đó có mức biến động rủi ro hệ thống gấp 1,5 lần
      so với thị trường chung; khi VN-Index tăng 10%, cổ phiếu này có xu hướng tăng khoảng 15% và ngược lại.
  - question: Hạn chế lớn nhất của mô hình CAPM khi áp dụng vào thực tế là gì?
    answer: >-
      Mô hình CAPM tính hệ số Beta dựa trên dữ liệu giá quá khứ và giả định thị trường hoàn hảo,
      nên có thể chưa phản ánh hết những thay đổi đột biến về nội tại kinh doanh trong tương lai.
sources:
  - CFA Institute
  - Sở Giao dịch Chứng khoán Hà Nội (HNX - Chuyên trang Trái phiếu Chính phủ)
citations:
  - title: "Capital Asset Pricing Model (CAPM) and Portfolio Theory"
    publisher: CFA Institute
  - title: "Capital Asset Prices: A Theory of Market Equilibrium under Conditions of Risk"
    publisher: Journal of Finance (William F. Sharpe, 1964)
keyTakeaways:
  - >-
    Mô hình CAPM (Capital Asset Pricing Model) là công cụ đo lường mối quan hệ
    giữa rủi ro hệ thống (Beta) và tỷ suất sinh lời kỳ vọng của một cổ phiếu.
  - >-
    Công thức chuẩn của CAPM là Re = Rf + Beta × (Rm - Rf), cho biết nhà đầu tư
    cần đòi hỏi mức lãi bao nhiêu để xứng đáng với rủi ro gánh chịu.
  - >-
    Trong định giá doanh nghiệp, kết quả từ mô hình CAPM chính là chi phí sử dụng
    vốn chủ sở hữu dùng để chiết khấu dòng tiền về hiện tại.
---

Khi quyết định rút tiền khỏi sổ tiết kiệm ngân hàng có lãi suất cố định 5%/năm để mua một mã cổ phiếu trên sàn, bạn cần đòi hỏi mức sinh lời tối thiểu bao nhiêu phần trăm mới xứng đáng với rủi ro biến động giá? Thay vì ước lượng cảm tính, giới tài chính toàn cầu sử dụng một công thức toán học từng đoạt giải Nobel Kinh tế để định lượng con số này trong **[phân tích cơ bản là gì](/phan-tich/co-ban/phan-tich-co-ban-la-gi/)**. Bài viết này từ **[Value Investing](/)** sẽ giải thích chi tiết **mô hình CAPM là gì**, ý nghĩa từng biến số và cách áp dụng thực tế tại thị trường Việt Nam.

## Mô hình CAPM là gì?

**Mô hình CAPM** (viết tắt của Capital Asset Pricing Model, dịch là Mô hình định giá tài sản vốn) là mô hình tài chính xác định tỷ suất sinh lời kỳ vọng hợp lý của một tài sản dựa trên mức độ rủi ro hệ thống mà nhà đầu tư phải gánh chịu. Mô hình này do nhà kinh tế học William Sharpe cùng các cộng sự phát triển vào thập niên 1960 và được trao giải Nobel Kinh tế năm 1990.

Triết lý cốt lõi của mô hình CAPM dựa trên sự đánh đổi giữa rủi ro và lợi nhuận: nhà đầu tư chỉ chấp nhận bỏ vốn vào một cổ phiếu rủi ro khi được đền bù bằng hai cấu phần:

* **Giá trị thời gian của tiền**. Được đại diện bởi mức lãi suất phi rủi ro mà bạn chắc chắn nhận được khi gửi vào tài sản an toàn tuyệt đối như trái phiếu Chính phủ.

* **Phần bù rủi ro (Risk Premium)**. Khoản lợi nhuận cộng thêm để đền bù cho việc cổ phiếu của bạn biến động mạnh hay yếu so với toàn bộ thị trường chung.

Giả sử bạn cho một người họ hàng công chức nhà nước vay tiền với lãi suất 6%/năm vì chắc chắn thu hồi được gốc. Nhưng nếu một người quen rủ bạn góp vốn mở quán lẩu nướng có nguy cơ vắng khách, bạn sẽ yêu cầu mức sinh lời kỳ vọng phải đạt tối thiểu 15% - 18%/năm mới đồng ý xuống tiền.

## Công thức tính mô hình CAPM và giải mã 4 thành phần

Công thức chuẩn của mô hình định giá tài sản vốn CAPM được xác lập như sau:

**Re = Rf + Beta × (Rm - Rf)**

Bảng dưới đây giải thích chi tiết ý nghĩa và nguồn lấy dữ liệu của từng thành phần tại thị trường chứng khoán Việt Nam:


| Ký hiệu | Tên gọi tiếng Việt | Ý nghĩa thực tế | Cách lấy số liệu tại Việt Nam |
| :--- | :--- | :--- | :--- |
| **Re** | **Tỷ suất sinh lời kỳ vọng** | Mức lợi nhuận tối thiểu cổ đông đòi hỏi (Chi phí vốn chủ sở hữu) | Kết quả tính toán từ mô hình CAPM |
| **Rf** | **Lãi suất phi rủi ro** | Lợi suất của tài sản không có rủi ro vỡ nợ | Lợi suất Trái phiếu Chính phủ Việt Nam kỳ hạn 10 năm (~2,8% - 3,2%) |
| **Beta** | **Hệ số rủi ro hệ thống** | Độ nhạy biến động giá của cổ phiếu so với VN-Index | Tra cứu miễn phí trên FireAnt, Simplize, Vietstock, SSI iBoard |
| **Rm** | **Tỷ suất sinh lời thị trường** | Mức sinh lời bình quân dài hạn của chỉ số VN-Index | Trung bình lịch sử của VN-Index dao động từ 11% đến 13%/năm |
| **Rm - Rf** | **Phần bù rủi ro thị trường** | Chênh lệch lợi nhuận giữa đầu tư cổ phiếu và trái phiếu Chính phủ | Thường nằm trong khoảng từ 8% đến 9,5% tại Việt Nam |


Trong công thức trên, biến số tạo ra sự khác biệt giữa từng doanh nghiệp chính là hệ số **Beta**:

* **Beta = 1,0**. Cổ phiếu biến động đồng pha với thị trường chung; nếu VN-Index tăng 10% thì cổ phiếu kỳ vọng tăng 10%.

* **Beta > 1,0 (Nhóm cổ phiếu nhạy chu kỳ)**. Thường gặp ở nhóm chứng khoán, bất động sản, thép (ví dụ Beta = 1,4), nghĩa là thị trường tăng 10% thì cổ phiếu có xu hướng tăng 14%, nhưng khi thị trường giảm cũng sẽ giảm sâu hơn, đòi hỏi Re cao hơn.

* **Beta < 1,0 (Nhóm cổ phiếu phòng thủ)**. Thường gặp ở ngành điện, nước, dược phẩm (ví dụ Beta = 0,6), biến động êm ả hơn thị trường nên cổ đông chỉ cần mức Re thấp hơn.

## Ví dụ thực hành tính CAPM cho cổ phiếu trên sàn HOSE

Để hiểu cách các chuyên gia phân tích vận hành công thức trên, hãy xét bài toán tính tỷ suất sinh lời kỳ vọng cho 2 mã cổ phiếu thuộc 2 nhóm ngành trái ngược trên sàn HOSE với các thông số vĩ mô chung:

* **Lãi suất phi rủi ro (Rf)**: Lấy theo lợi suất trái phiếu Chính phủ kỳ hạn 10 năm bằng **3,0%/năm**.

* **Tỷ suất sinh lời kỳ vọng của thị trường (Rm)**: Lấy theo mức tăng trưởng bình quân dài hạn của VN-Index là **12,0%/năm** (suy ra phần bù rủi ro thị trường **Rm - Rf = 9,0%**).

Áp dụng công thức CAPM cho 2 cổ phiếu cụ thể:

1. **Cổ phiếu ngành Dược phẩm (Hệ số Beta = 0,6).** Thay số vào công thức: **Re = 3,0% + 0,6 × (12,0% - 3,0%) = 8,4%/năm**. Do cổ phiếu dược phẩm rất ít biến động khi thị trường rung lắc, nhà đầu tư chỉ cần mức sinh lời từ 8,4%/năm trở lên là đã hợp lý để nắm giữ.

2. **Cổ phiếu ngành Chứng khoán (Hệ số Beta = 1,5).** Thay số vào công thức: **Re = 3,0% + 1,5 × (12,0% - 3,0%) = 16,5%/năm**. Vì cổ phiếu chứng khoán có biên độ giật mạnh gấp rưỡi thị trường, bạn phải kỳ vọng doanh nghiệp mang lại mức sinh lời tối thiểu 16,5%/năm mới bù đắp được rủi ro nắm giữ.

## Ứng dụng thực chiến của mô hình CAPM trong đầu tư giá trị

Khi thực hiện **[cách định giá cổ phiếu](/phan-tich/co-ban/cach-dinh-gia-co-phieu/)**, mô hình CAPM không chỉ là lý thuyết sách vở mà đóng vai trò trụ cột trong 3 quyết định đầu tư:

* **Xác định lãi suất chiết khấu để tìm giá trị nội tại**. Kết quả Re từ mô hình CAPM chính là chi phí vốn chủ sở hữu (Cost of Equity), được dùng để tính chi phí vốn bình quân WACC trong bài toán **[cơ cấu vốn là gì](/phan-tich/co-ban/co-cau-von-la-gi/)** và chiết khấu dòng tiền tương lai về **[giá trị nội tại của cổ phiếu](/phan-tich/co-ban/gia-tri-noi-tai-cua-co-phieu/)**.

* **Đánh giá hiệu quả tạo giá trị thực của ban lãnh đạo**. Khi bạn so sánh chỉ số sinh lời trên vốn đầu tư (**[ROIC là gì](/phan-tich/co-ban/roic-la-gi/)**) hoặc ROE của doanh nghiệp với mức Re tính từ CAPM, chỉ những công ty có ROE và ROIC lớn hơn Re mới thực sự tạo ra giá trị thặng dư cho cổ đông.

* **Sàng lọc cổ phiếu đang định giá rẻ hoặc đắt qua đường SML**. Nếu bạn phân tích báo cáo tài chính và ước tính một cổ phiếu có thể mang lại lợi nhuận 20%/năm, trong khi mức sinh lời đòi hỏi theo CAPM chỉ là 12%/năm, cổ phiếu đó đang tạo ra phần chênh lệch dương (Alpha = +8%) và xứng đáng đưa vào danh mục theo **[cách chọn cổ phiếu tốt](/dau-tu/co-phieu/cach-chon-co-phieu-tot/)**.

## 3 Hạn chế cần lưu ý khi áp dụng CAPM tại Việt Nam

Dù được sử dụng rộng rãi trong mọi báo cáo phân tích của các công ty chứng khoán, bạn cần lưu ý 3 giới hạn thực tế của mô hình CAPM:

1. **Hệ số Beta nhìn về quá khứ.** Beta được tính từ biến động giá lịch sử 1 đến 3 năm trước, nên không thể dự báo trước các thay đổi đột ngột về mô hình kinh doanh hoặc biến cố nội bộ trong tương lai của doanh nghiệp.

2. **Biến động thanh khoản ở nhóm cổ phiếu vốn hóa nhỏ.** Trên sàn chứng khoán Việt Nam, nhiều cổ phiếu nhỏ bị thao túng giá hoặc mất thanh khoản khiến hệ số Beta bị bóp méo, làm sai lệch kết quả Re.

3. **Giả định thị trường hoàn hảo không tồn tại.** CAPM giả định nhà đầu tư có thể vay và cho vay không giới hạn ở mức lãi suất phi rủi ro và không tốn phí giao dịch, điều khác biệt với thực tế thị trường.

Mô hình CAPM cung cấp một thước đo chuẩn mực giúp bạn biết chính xác mình đang đòi hỏi mức lợi nhuận bao nhiêu cho mỗi đơn vị rủi ro trên thị trường. Ngay hôm nay, bạn hãy mở chuyên trang tài chính để tra cứu hệ số Beta của các mã cổ phiếu trong danh mục cá nhân và thử tính mức sinh lời kỳ vọng Re xem liệu hiệu quả kinh doanh (ROE) của doanh nghiệp có đang vượt qua ngưỡng yêu cầu đó hay không.

