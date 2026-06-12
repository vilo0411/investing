export const author = {
  name: "Nguyễn Viết Lộc",
  slug: "nguyen-viet-loc",
  role: "Người phụ trách nội dung",
  bio: "Phụ trách nội dung tại ValueInvesting.com.vn — tập trung giải thích khái niệm đầu tư bằng ngôn ngữ rõ ràng, có nguồn tham khảo, không khuyến nghị mua bán.",
  credentials: [] as string[],
  // String per D-02 (not string[] — about.astro rendering updated in plan 02-03 to render this as a single paragraph)
  experience:
    "Xây dựng nội dung giáo dục tài chính cho nhà đầu tư cá nhân, biên tập theo hướng có nguồn, rõ rủi ro và không khuyến nghị mua bán.",
  expertise: ["Đầu tư giá trị", "Phân tích cơ bản", "Sản phẩm đầu tư cho người mới"],
  avatar: undefined as string | undefined,
  socialLinks: undefined as { linkedin?: string; twitter?: string; email?: string } | undefined,
  moneyPerspective:
    "Đầu tư nên bắt đầu từ hiểu doanh nghiệp, hiểu rủi ro và biết giới hạn của chính mình trước khi nhìn vào lợi nhuận kỳ vọng.",
  education:
    "Thông tin học vấn và chứng chỉ chuyên môn sẽ được cập nhật khi có hồ sơ xác thực công khai.",
  publishedIn: ["ValueInvesting.com.vn"],
};

export type Author = typeof author;
