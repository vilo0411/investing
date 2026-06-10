export const site = {
  name: "ValueInvesting.com.vn",
  author: "Nguyễn Viết Lộc",
  email: "hello@valueinvesting.com.vn",
  description:
    "Kiến thức đầu tư, phân tích tài chính và đánh giá sản phẩm đầu tư dành cho người mới bắt đầu.",
  editorialReviewer: "Ban biên tập ValueInvesting.com.vn",
  trustStats: [
    "Nội dung giáo dục, không khuyến nghị mua bán",
    "Ưu tiên nguồn gốc: cơ quan quản lý, sàn giao dịch, tài liệu công bố",
    "Có ngày cập nhật và quy trình đính chính công khai",
  ],
  disclosure:
    "ValueInvesting.com.vn không cung cấp dịch vụ tư vấn đầu tư cá nhân, môi giới chứng khoán hoặc tín hiệu giao dịch. Nội dung chỉ nhằm mục đích giáo dục.",
  authorProfile: {
    role: "Người phụ trách nội dung",
    expertise: ["Đầu tư giá trị", "Phân tích cơ bản", "Sản phẩm đầu tư cho người mới"],
    moneyPerspective:
      "Đầu tư nên bắt đầu từ hiểu doanh nghiệp, hiểu rủi ro và biết giới hạn của chính mình trước khi nhìn vào lợi nhuận kỳ vọng.",
    experience: ["Xây dựng nội dung giáo dục tài chính cho nhà đầu tư cá nhân", "Biên tập bài viết theo hướng có nguồn, rõ rủi ro và không khuyến nghị mua bán"],
    education: "Thông tin học vấn và chứng chỉ chuyên môn sẽ được cập nhật khi có hồ sơ xác thực công khai.",
    publishedIn: ["ValueInvesting.com.vn"],
  },
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
    title: "ETF",
    slug: "etf",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Tìm hiểu cách ETF hoạt động, ưu nhược điểm và cách dùng ETF cho chiến lược đầu tư dài hạn.",
    path: "/dau-tu/etf/",
  },
  {
    title: "Quỹ đầu tư",
    slug: "quy-dau-tu",
    group: "Đầu tư",
    groupPath: "/dau-tu/",
    description:
      "Các loại quỹ mở, quỹ chủ động, quỹ thụ động và cách đánh giá chứng chỉ quỹ.",
    path: "/dau-tu/quy-dau-tu/",
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
    slug: "phan-tich",
    group: "Phân tích",
    description:
      "Các chỉ số như P/E, P/B, ROE, ROA, EPS và phương pháp đọc báo cáo tài chính.",
    path: "/phan-tich/",
  },
  {
    title: "Phân tích kỹ thuật",
    slug: "phan-tich-ky-thuat",
    group: "Phân tích",
    description:
      "Đọc biểu đồ, xu hướng, hỗ trợ/kháng cự, các chỉ báo RSI, MACD và ứng dụng trong giao dịch.",
    path: "/phan-tich-ky-thuat/",
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
  "etf": { abbr: "ETF", label: "ETF", gradientClass: "thumb-etf" },
  "quy-dau-tu": { abbr: "QĐT", label: "Quỹ đầu tư", gradientClass: "thumb-fund" },
  "trai-phieu": { abbr: "TP", label: "Trái phiếu", gradientClass: "thumb-bond" },
  "phai-sinh": { abbr: "PS", label: "Phái sinh", gradientClass: "thumb-derivative" },
  "phan-tich": { abbr: "PT", label: "Phân tích", gradientClass: "thumb-analyse" },
  "phan-tich-ky-thuat": { abbr: "KT", label: "Kỹ thuật", gradientClass: "thumb-technical" },
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
