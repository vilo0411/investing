export const site = {
  name: "Value Investing",
  email: "hello@valueinvesting.com.vn",
  description:
    "Tìm hiểu cổ phiếu, ETF, quỹ đầu tư và phân tích tài chính dành cho người mới (F0) tại Việt Nam. Kiến thức thực chiến, cập nhật 2026, ngôn ngữ đời thường.",
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
      "Tìm hiểu cổ phiếu là gì, cách mua bán, phân tích cổ tức, blue chip và margin cho người mới tại Việt Nam. Kiến thức nền tảng, cập nhật 2026.",
    path: "/dau-tu/co-phieu/",
  },
  {
    title: "Quỹ ETF",
    slug: "etf",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Tất cả về quỹ ETF tại Việt Nam: cách hoạt động, danh sách ETF HOSE, so sánh với quỹ mở và hướng dẫn mua ETF lần đầu dành cho F0.",
    path: "/dau-tu/etf/",
  },
  {
    title: "Trái phiếu",
    slug: "trai-phieu",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Kiến thức trái phiếu chính phủ và doanh nghiệp tại Việt Nam: lãi suất, rủi ro, cách mua và so sánh với cổ phiếu. Cập nhật 2026.",
    path: "/dau-tu/trai-phieu/",
  },
  {
    title: "Phái sinh",
    slug: "phai-sinh",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Hướng dẫn phái sinh cơ bản: hợp đồng tương lai VN30, ký quỹ, cách giao dịch và quản lý rủi ro cho người mới tìm hiểu phái sinh.",
    path: "/dau-tu/phai-sinh/",
  },
  {
    title: "Phân tích cơ bản",
    slug: "co-ban",
    group: "Phân tích",
    description:
      "Phân tích cơ bản cho nhà đầu tư Việt Nam: P/E, P/B, ROE, EPS, định giá cổ phiếu và cách đọc báo cáo tài chính doanh nghiệp niêm yết.",
    path: "/phan-tich/co-ban/",
  },
  {
    title: "Phân tích kỹ thuật",
    slug: "ky-thuat",
    group: "Phân tích",
    description:
      "Phân tích kỹ thuật cơ bản: đọc biểu đồ nến, RSI, MACD, Bollinger Bands, vùng hỗ trợ kháng cự cho nhà đầu tư chứng khoán Việt Nam.",
    path: "/phan-tich/ky-thuat/",
  },
  {
    title: "Reviews",
    slug: "reviews",
    group: "Reviews",
    description:
      "Đánh giá khách quan công ty chứng khoán, quỹ đầu tư và ứng dụng tài chính Việt Nam. So sánh phí, tính năng và chất lượng dịch vụ 2026.",
    path: "/reviews/",
  },
  {
    title: "Nhà đầu tư",
    slug: "nha-dau-tu",
    group: "Nhà đầu tư",
    description:
      "Bài học từ nhà đầu tư huyền thoại: Warren Buffett, Benjamin Graham, Peter Lynch và triết lý đầu tư giá trị áp dụng cho thị trường Việt Nam.",
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

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const url = (path: string) => `${base}${path}`;

export const getCategoryPath = (category: Category | string) => {
  const categoryMeta =
    typeof category === "string"
      ? categories.find((item) => item.slug === category)
      : category;

  return url(categoryMeta?.path ?? "/");
};

export const getArticlePath = (article: { slug: string; data: { category: string } }) => {
  const categoryPath = getCategoryPath(article.data.category);
  return `${categoryPath}${article.slug}/`;
};
