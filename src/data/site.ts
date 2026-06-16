export const site = {
  name: "Value Investing",
  email: "hello@valueinvesting.com.vn",
  description:
    "Đơn giản hóa kiến thức đầu tư tài chính dài hạn và sản phẩm tài chính cơ bản cho người mới bắt đầu (F0) tại Việt Nam bằng ngôn ngữ đời thường, thực chiến.",
  editorialReviewer: "Ban biên tập Value Investing",
  trustStats: [
    "Nội dung giáo dục, không khuyến nghị mua bán",
    "Ưu tiên nguồn gốc: cơ quan quản lý, sàn giao dịch, tài liệu công bố",
    "Có ngày cập nhật và quy trình đính chính công khai",
  ],
  disclosure:
    "Value Investing không cung cấp dịch vụ tư vấn đầu tư cá nhân, môi giới chứng khoán hoặc tín hiệu giao dịch. Nội dung chỉ nhằm mục đích giáo dục.",
};

export const navigation = [
  { label: "Đầu tư", href: "/dau-tu/" },
  { label: "Phân tích", href: "/phan-tich/" },
  { label: "Reviews", href: "/reviews/" },
  { label: "Nhà đầu tư", href: "/nha-dau-tu/" },
];

export const categories = [
  {
    title: "Cổ phiếu",
    slug: "co-phieu",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Nền tảng về cổ phiếu, cổ tức, blue chip, margin và các khái niệm cần biết trước khi tham gia thị trường.",
    path: "/dau-tu/co-phieu/",
  },
  {
    title: "Quỹ ETF",
    slug: "etf",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Tìm hiểu ETF, quỹ mở, chứng chỉ quỹ — các loại quỹ đầu tư và cách chọn quỹ phù hợp cho chiến lược dài hạn.",
    path: "/dau-tu/etf/",
  },
  {
    title: "Trái phiếu",
    slug: "trai-phieu",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Kiến thức cơ bản về trái phiếu chính phủ, trái phiếu doanh nghiệp, lợi suất và rủi ro tín dụng.",
    path: "/dau-tu/trai-phieu/",
  },
  {
    title: "Phái sinh",
    slug: "phai-sinh",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Khái niệm hợp đồng tương lai, ký quỹ phái sinh, đòn bẩy và rủi ro trước khi giao dịch.",
    path: "/dau-tu/phai-sinh/",
  },
  {
    title: "Phân tích cơ bản",
    slug: "co-ban",
    group: "Phân tích",
    description:
      "Các chỉ số như P/E, P/B, ROE, ROA, EPS và phương pháp đọc báo cáo tài chính.",
    path: "/phan-tich/co-ban/",
  },
  {
    title: "Phân tích kỹ thuật",
    slug: "ky-thuat",
    group: "Phân tích",
    description:
      "Đọc biểu đồ, xu hướng, hỗ trợ/kháng cự, các chỉ báo RSI, MACD và ứng dụng trong giao dịch.",
    path: "/phan-tich/ky-thuat/",
  },
  {
    title: "Reviews",
    slug: "reviews",
    group: "Reviews",
    description:
      "Đánh giá công ty chứng khoán, sản phẩm đầu tư và các so sánh hữu ích cho người mới.",
    path: "/reviews/",
  },
  {
    title: "Nhà đầu tư",
    slug: "nha-dau-tu",
    group: "Nhà đầu tư",
    description:
      "Bài học từ Warren Buffett, Benjamin Graham, Charlie Munger, Peter Lynch và các nhà đầu tư dài hạn.",
    path: "/nha-dau-tu/",
  },
];

export type Category = (typeof categories)[number];

export const categoryMeta: Record<string, { abbr: string; label: string; gradientClass: string }> = {
  "co-phieu": { abbr: "CP", label: "Cổ phiếu", gradientClass: "thumb-stocks" },
  "etf": { abbr: "QĐT", label: "Quỹ ETF", gradientClass: "thumb-etf" },
  "trai-phieu": { abbr: "TP", label: "Trái phiếu", gradientClass: "thumb-bond" },
  "phai-sinh": { abbr: "PS", label: "Phái sinh", gradientClass: "thumb-derivative" },
  "co-ban": { abbr: "CB", label: "Phân tích cơ bản", gradientClass: "thumb-analyse" },
  "ky-thuat": { abbr: "KT", label: "Phân tích kỹ thuật", gradientClass: "thumb-technical" },
  "reviews": { abbr: "REV", label: "Reviews", gradientClass: "thumb-review" },
  "nha-dau-tu": { abbr: "NĐT", label: "Nhà đầu tư", gradientClass: "thumb-investor" },
};

export const getCategoryPath = (category: Category | string) => {
  const categoryMeta =
    typeof category === "string"
      ? categories.find((item) => item.slug === category)
      : category;

  return categoryMeta?.path ?? "/";
};

export const getArticlePath = (article: { slug: string; data: { category: string } }) => {
  const categoryPath = getCategoryPath(article.data.category);
  return `${categoryPath}${article.slug}/`;
};
