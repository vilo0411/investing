---
name: analytical
description: Giọng viết cho bài phân tích kỹ thuật, chỉ báo, chỉ số tài chính, đọc BCTC, định giá. Phù hợp Persona 3 "Hùng" và F0 đã nắm nền.
---

# Writer Profile: Analytical

## Tổng quan

Viết cho nhà đầu tư đã có tài khoản 1–3 năm, đang muốn bỏ thói quen giao dịch theo cảm tính hoặc theo group tín hiệu. Bài cũng phục vụ sinh viên tự học phân tích kỹ thuật/cơ bản.
Mục tiêu: người đọc hiểu chỉ báo hoặc chỉ số đo cái gì, đọc tín hiệu thế nào, và khi nào tín hiệu không còn đáng tin.

## Tone

- Ngang hàng, chính xác, không giảng giải dài dòng.
- Nhận định rõ ràng về cách dùng công cụ, nhưng thành thật về giới hạn của nó.
- Ngắn gọn: dữ kiện trước, giải thích sau.

## Nguyên tắc viết

**Thuật ngữ chính xác kèm định nghĩa ngắn.** Dùng đúng tên (RSI, MACD, ROE, EPS, P/B), định nghĩa trong một mệnh đề ở lần đầu xuất hiện rồi đi tiếp.

**Công thức viết dạng chữ thường.** Không LaTeX (theo instinct). Viết in đậm chuẩn Markdown, ví dụ `**ROE = Lợi nhuận sau thuế / Vốn chủ sở hữu bình quân**`, sau đó giải thích từng thành phần.

**Luôn nêu giới hạn của tín hiệu.** Mỗi chỉ báo/chỉ số có một đoạn nói khi nào nó sai (thị trường đi ngang, lợi nhuận bất thường, khác biệt ngành) và nhắc kết hợp công cụ khác như khối lượng, xu hướng, chỉ số cùng ngành.

**Không khẳng định tương lai.** Cấm "chắc chắn tăng/giảm", "điểm mua an toàn". Viết theo điều kiện: "khi A và B cùng xuất hiện, xác suất X cao hơn, nhưng vẫn cần...".

**Ví dụ số giả định.** Ví dụ tính toán dùng "giả sử" với doanh nghiệp giả định, không đưa giá hay chỉ số thị trường thật chưa kiểm chứng.

## Cấu trúc câu hay dùng

- "[Chỉ báo] cho tín hiệu [X] khi [điều kiện cụ thể]."
- "Giả sử doanh nghiệp A có lợi nhuận sau thuế 50 tỷ đồng và vốn chủ sở hữu 400 tỷ đồng..."
- "Tín hiệu này kém tin cậy khi [điều kiện] vì [lý do]."
- "So với trung bình ngành, con số này cho thấy..."

## Câu tránh dùng

- "Đây là một chỉ báo rất hữu ích..." → chứng minh bằng ví dụ, không khen.
- "Chắc chắn cổ phiếu sẽ tăng khi..." → vi phạm YMYL, viết theo điều kiện.
- "Tuỳ thuộc vào mỗi nhà đầu tư..." → nêu điều kiện cụ thể thay vì né.
- Giải thích lại khái niệm nền đã có bài riêng → link nội bộ tới bài đó.

## Kết bài & bước tiếp theo

Kết bài bằng một hành động áp dụng được, ví dụ mở biểu đồ VN30 trên app đang dùng, bật chỉ báo vừa học và ghi lại 3 lần tín hiệu xuất hiện gần nhất.
Thêm 1 link nội bộ tới bài liên quan cùng cluster (chỉ báo bổ trợ hoặc chỉ số cùng nhóm).

## YMYL

- Không khuyến nghị mua/bán mã cụ thể, không hứa lợi nhuận, không gợi ý điểm vào lệnh cho mã thật.
- Số liệu thị trường thật phải có nguồn và thời điểm, hoặc ghi `[CẦN XÁC NHẬN]`.
- Bài phân tích/đánh giá cổ phiếu hoặc tài sản cụ thể bắt buộc có Tuyên bố miễn trừ trách nhiệm ở cuối bài (`anti-ai-rules.md`). Bài giải thích chỉ báo/chỉ số chung thì không bắt buộc.

## Ví dụ đoạn văn ĐÚNG tone

> RSI trên 70 cho thấy giá đã tăng nhanh trong 14 phiên gần nhất. Trong xu hướng tăng mạnh, RSI có thể nằm trên 70 nhiều tuần mà giá vẫn đi lên. Vì vậy tín hiệu quá mua chỉ đáng chú ý khi đi kèm khối lượng giảm hoặc giá thủng đường MA20.

## Ví dụ đoạn văn SAI tone

> "RSI là một chỉ báo kỹ thuật rất mạnh mẽ. Khi RSI vượt 70, cổ phiếu chắc chắn sẽ điều chỉnh, đây là thời điểm vàng để chốt lời."
> → Khen suông, khẳng định tương lai, dùng từ cấm "thời điểm vàng".
