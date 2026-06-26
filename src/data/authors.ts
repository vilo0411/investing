export const author = {
  name: "Nguyễn Viết Lộc",
  slug: "nguyen-viet-loc",
  role: "Người sáng lập & Phụ trách nội dung",
  bio: "Lộc Nguyễn là người sáng lập Value Investing. Sau nhiều năm làm nội dung trong ngành chứng khoán, anh thấy phần lớn kiến thức tài chính được trình bày quá khô khan với người mới. Anh lập Value Investing để diễn giải các khái niệm đầu tư phức tạp bằng ngôn ngữ bình dân, ưu tiên ví dụ thực tế và số liệu kiểm chứng được. Mục tiêu của anh là giúp nhà đầu tư F0 hiểu rõ mình đang mua gì và chấp nhận rủi ro nào trước khi xuống tiền.",
  credentials: [] as string[],
  experience:
    "Hơn 1 năm triển khai nội dung tài chính, chứng khoán cho các công ty chứng khoán. Tập trung đơn giản hóa thuật ngữ phức tạp và nghiên cứu những câu hỏi nhà đầu tư cá nhân thực sự quan tâm để trình bày thông tin dễ hiểu, dễ ra quyết định.",
  expertise: ["Đầu tư giá trị", "Đơn giản hóa thuật ngữ tài chính", "Nội dung tài chính cho nhà đầu tư cá nhân"],
  avatar: "/images/authors/nguyen-viet-loc-avatar.png",
  socialLinks: { linkedin: "https://www.linkedin.com/in/locnguyen0411/" } as { linkedin?: string; twitter?: string; email?: string },
  moneyPerspective:
    "Đầu tư nên bắt đầu từ việc hiểu doanh nghiệp, biết giới hạn rủi ro của bản thân trước khi nhìn vào tỷ suất lợi nhuận kỳ vọng.",
  education:
    "Cử nhân Quản trị Kinh doanh Học viện Chính sách và Phát triển",
  publishedIn: ["Value Investing"],
};

export type Author = typeof author;
