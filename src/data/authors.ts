export const author = {
  name: "Nguyễn Viết Lộc",
  slug: "nguyen-viet-loc",
  role: "Người sáng lập & Phụ trách nội dung",
  bio: "Lộc Nguyễn hiện là Chuyên viên SEO tại Công ty Chứng khoán DSC. Với hơn 3 năm kinh nghiệm triển khai nội dung và tối ưu hiệu suất tìm kiếm cho các sản phẩm tài chính lớn, Lộc sáng lập Value Investing nhằm chia sẻ các kiến thức đầu tư thực chiến bằng ngôn ngữ bình dân, giúp F0 tự tin và an toàn hơn trên thị trường.",
  credentials: [] as string[],
  experience:
    "Hơn 3 năm kinh nghiệm thực tế triển khai nội dung tài chính và tối ưu hiệu suất tìm kiếm cho các sản phẩm tài chính lớn (hiện là Chuyên viên SEO tại Công ty Chứng khoán DSC). Chuyên sâu về nghiên cứu hành vi tìm kiếm của nhà đầu tư cá nhân và đơn giản hóa cấu trúc thông tin.",
  expertise: ["Đầu tư giá trị", "Đơn giản hóa thuật ngữ tài chính", "Sản phẩm đầu tư cho người mới bắt đầu", "Cấu trúc thông tin tài chính (SEO)"],
  avatar: "/images/authors/nguyen-viet-loc-avatar.png",
  socialLinks: { linkedin: "https://www.linkedin.com/in/locnguyen0411/" } as { linkedin?: string; twitter?: string; email?: string },
  moneyPerspective:
    "Đầu tư nên bắt đầu từ việc hiểu doanh nghiệp, biết giới hạn rủi ro của bản thân trước khi nhìn vào tỷ suất lợi nhuận kỳ vọng.",
  education:
    "Tự học và nghiên cứu thực chiến về SEO kỹ thuật, Marketing tài chính và các hệ thống tự động hóa nội dung.",
  publishedIn: ["Value Investing"],
};

export type Author = typeof author;
