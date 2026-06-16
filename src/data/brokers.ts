/**
 * Canonical broker registry — single source of truth for Vietnamese broker profiles.
 *
 * Review articles reference brokers by slug. The ReviewLayout merges this central
 * data with any article-level overrides in frontmatter (article wins on conflict).
 *
 * Data reflects publicly available information; update when official sources change.
 * Last updated: 2026-06
 */

export interface BrokerProfile {
  slug: string;
  name: string;
  shortName: string;
  rating: number;
  best_for: string;
  fee_rate: string;
  margin_rate: string;
  app_rating: string;
  min_deposit: string;
  ctaUrl: string;
  pros: string[];
  cons: string[];
  verdict: string;
  companyInfo: {
    founded: string;
    hq: string;
    license: string;
    website: string;
    products: string[];
  };
  accountSteps: { title: string; desc: string }[];
}

export const brokerRegistry: Record<string, BrokerProfile> = {
  tcbs: {
    slug: "tcbs",
    name: "TCBS (Techcom Securities)",
    shortName: "TCBS",
    rating: 4.7,
    best_for: "Nhà đầu tư tự chủ, ưu tiên phí thấp & công cụ phân tích",
    fee_rate: "0% (miễn phí trọn đời)",
    margin_rate: "10.0%/năm",
    app_rating: "4.5/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://tcbs.com.vn",
    pros: [
      "Miễn 100% phí giao dịch cổ phiếu — Zero-fee áp dụng vĩnh viễn",
      "Bộ công cụ TCInvest: báo cáo tài chính, định giá, phân tích kỹ thuật tích hợp",
      "Liên kết hệ sinh thái Techcombank — chuyển tiền tức thì, không mất phí",
      "Giao diện ứng dụng hiện đại, thao tác đặt lệnh trực quan",
    ],
    cons: [
      "Không có đội ngũ môi giới tư vấn trực tiếp",
      "Hỗ trợ qua chatbot, phản hồi đôi khi chậm trong giờ cao điểm",
      "Thỉnh thoảng lag/nghẽn lệnh vào phiên giao dịch biến động mạnh",
    ],
    verdict:
      "TCBS là lựa chọn tối ưu cho phần lớn nhà đầu tư cá nhân tại Việt Nam. Zero-fee kết hợp TCInvest tạo ra lợi thế chi phí và thông tin rõ ràng — đặc biệt nếu bạn không cần môi giới dẫn dắt.",
    companyInfo: {
      founded: "2008",
      hq: "Tòa nhà Techcombank, 191 Bà Triệu, Hai Bà Trưng, Hà Nội",
      license: "Giấy phép KDCK số 28/UBCK-ĐKGPHĐKD",
      website: "https://tcbs.com.vn",
      products: [
        "Môi giới cổ phiếu, ETF, chứng chỉ quỹ",
        "Giao dịch hợp đồng tương lai VN30",
        "Cho vay margin",
        "Trái phiếu doanh nghiệp (BondS)",
        "Quỹ đầu tư (TCBF, TCEF)",
        "Công cụ phân tích TCInvest",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng TCBS",
        desc: "Tải ứng dụng TCBS trên App Store hoặc Google Play. Toàn bộ quy trình mở tài khoản thực hiện online trong ứng dụng.",
      },
      {
        title: "Đăng ký và xác minh eKYC",
        desc: "Chụp ảnh CCCD hai mặt và xác minh khuôn mặt theo hướng dẫn. Kết quả phê duyệt thường trong vòng 15 phút đến 1 giờ.",
      },
      {
        title: "Liên kết tài khoản Techcombank",
        desc: "Liên kết tài khoản ngân hàng Techcombank để chuyển tiền tức thì không mất phí. Cũng có thể dùng tài khoản ngân hàng khác.",
      },
      {
        title: "Nạp tiền và bắt đầu giao dịch",
        desc: "Nạp tiền vào ví TCBS và đặt lệnh ngay. Không có yêu cầu số dư tối thiểu.",
      },
    ],
  },

  ssi: {
    slug: "ssi",
    name: "SSI Securities",
    shortName: "SSI",
    rating: 4.5,
    best_for: "Nhà đầu tư cần sự ổn định, uy tín & phân tích chuyên sâu",
    fee_rate: "0.15% – 0.25%",
    margin_rate: "11.5%/năm",
    app_rating: "4.2/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.ssi.com.vn",
    pros: [
      "Uy tín và an toàn tài chính hàng đầu — hoạt động liên tục từ 1999",
      "Hệ thống giao dịch ổn định nhất thị trường, cực kỳ hiếm khi xảy ra lỗi",
      "Báo cáo phân tích doanh nghiệp thuộc hàng chất lượng cao nhất Việt Nam",
      "Đội ngũ môi giới chuyên nghiệp, có kinh nghiệm dày dặn",
    ],
    cons: [
      "Phí giao dịch cao hơn đáng kể so với TCBS và các đối thủ mới",
      "Lãi suất margin không cạnh tranh",
      "Giao diện ứng dụng ít hiện đại hơn",
    ],
    verdict:
      "SSI là lựa chọn tốt nhất khi sự ổn định và uy tín là ưu tiên hàng đầu — đặc biệt với nhà đầu tư có vốn lớn, nơi chi phí giao dịch cao hơn một chút không còn là rào cản đáng kể.",
    companyInfo: {
      founded: "1999",
      hq: "72 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      license: "Giấy phép KDCK số 01/UBCK-GPHĐKD",
      website: "https://www.ssi.com.vn",
      products: [
        "Môi giới cổ phiếu, ETF, chứng chỉ quỹ",
        "Giao dịch hợp đồng tương lai VN30",
        "Cho vay margin",
        "Trái phiếu và sản phẩm thu nhập cố định",
        "Dịch vụ tư vấn đầu tư cá nhân (Private Banking)",
        "Báo cáo phân tích SSI Research",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng iSSI",
        desc: "Tải ứng dụng iSSI trên App Store hoặc Google Play, hoặc truy cập website SSI để mở tài khoản online.",
      },
      {
        title: "Điền thông tin và xác minh eKYC",
        desc: "Cung cấp thông tin cá nhân và chụp ảnh CCCD theo hướng dẫn. Quy trình phê duyệt thường hoàn tất trong 1 ngày làm việc.",
      },
      {
        title: "Ký hợp đồng điện tử",
        desc: "Đọc và ký hợp đồng mở tài khoản điện tử. SSI có thể yêu cầu bổ sung giấy tờ trong một số trường hợp.",
      },
      {
        title: "Nạp tiền qua chuyển khoản",
        desc: "Chuyển tiền vào tài khoản SSI theo thông tin được cấp. SSI hỗ trợ chuyển khoản từ hầu hết ngân hàng thương mại lớn.",
      },
    ],
  },

  vps: {
    slug: "vps",
    name: "VPS Securities",
    shortName: "VPS",
    rating: 4.2,
    best_for: "Người mới cần hỗ trợ môi giới, muốn có người dẫn dắt",
    fee_rate: "0.15% (có ưu đãi ban đầu)",
    margin_rate: "10.5%/năm",
    app_rating: "4.1/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.vps.com.vn",
    pros: [
      "Thị phần môi giới cá nhân số 1 Việt Nam",
      "Đội ngũ môi giới hùng hậu, hỗ trợ 24/7",
      "Ứng dụng SmartOne nhiều tính năng tiện ích",
      "Quy trình mở tài khoản eKYC nhanh nhất thị trường",
    ],
    cons: [
      "Phí giao dịch tăng cao sau thời gian ưu đãi ban đầu",
      "Chất lượng môi giới không đồng đều do số lượng quá lớn",
      "Đôi khi nghẽn lệnh vào phiên giao dịch cao điểm",
    ],
    verdict:
      "VPS phù hợp nhất với F0 cần được hỗ trợ trực tiếp từ môi giới trong giai đoạn học hỏi ban đầu. Hãy tận dụng thời gian ưu đãi phí ban đầu để trải nghiệm trước khi tính toán lại chi phí dài hạn.",
    companyInfo: {
      founded: "2006",
      hq: "89 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh",
      license: "Giấy phép KDCK số 47/UBCK-GPHĐKD",
      website: "https://www.vps.com.vn",
      products: [
        "Môi giới cổ phiếu, ETF, chứng chỉ quỹ",
        "Giao dịch hợp đồng tương lai VN30",
        "Cho vay margin",
        "Ứng dụng SmartOne",
        "Tư vấn môi giới cá nhân",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng SmartOne",
        desc: "Tải SmartOne trên App Store hoặc Google Play để mở tài khoản online với eKYC nhanh trong 5 phút.",
      },
      {
        title: "Xác minh danh tính eKYC",
        desc: "Chụp ảnh CCCD và selfie theo hướng dẫn. VPS nổi tiếng với tốc độ phê duyệt eKYC nhanh nhất thị trường.",
      },
      {
        title: "Liên hệ môi giới (tùy chọn)",
        desc: "VPS sẽ assign môi giới hỗ trợ bạn sau khi mở tài khoản thành công. Bạn cũng có thể chủ động liên hệ nếu cần tư vấn.",
      },
      {
        title: "Nạp tiền và giao dịch",
        desc: "Chuyển tiền vào tài khoản VPS theo thông tin được cấp. Không có yêu cầu số dư tối thiểu.",
      },
    ],
  },

  vndirect: {
    slug: "vndirect",
    name: "VNDIRECT",
    shortName: "VND",
    rating: 3.9,
    best_for: "F0 thích giao diện thân thiện và hệ sinh thái đào tạo",
    fee_rate: "0.15% – 0.20%",
    margin_rate: "11.0%/năm",
    app_rating: "4.0/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.vndirect.com.vn",
    pros: [
      "Giao diện ứng dụng thân thiện nhất, dễ dùng nhất cho người mới",
      "Hệ thống đào tạo và cộng đồng nhà đầu tư lớn",
      "Nội dung giáo dục phong phú cho F0",
    ],
    cons: [
      "Từng xảy ra sự cố an ninh mạng nghiêm trọng năm 2024",
      "Hệ thống phục hồi chậm sau sự cố, mất niềm tin một bộ phận khách hàng",
      "Tính năng phân tích kỹ thuật còn hạn chế",
    ],
    verdict:
      "VNDIRECT có giao diện thân thiện nhất cho người mới bắt đầu, nhưng sự cố bảo mật năm 2024 là điểm trừ lớn cần cân nhắc. Phù hợp nếu bạn muốn trải nghiệm ban đầu với số vốn nhỏ.",
    companyInfo: {
      founded: "2006",
      hq: "1 Nguyễn Thượng Hiền, Phường 5, Quận Bình Thạnh, TP. Hồ Chí Minh",
      license: "Giấy phép KDCK số 61/UBCK-GPHĐKD",
      website: "https://www.vndirect.com.vn",
      products: [
        "Môi giới cổ phiếu, ETF, chứng chỉ quỹ",
        "Giao dịch hợp đồng tương lai VN30",
        "Cho vay margin",
        "Dịch vụ đào tạo và cộng đồng nhà đầu tư",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng VNDIRECT",
        desc: "Tải ứng dụng VNDIRECT trên App Store hoặc Google Play.",
      },
      {
        title: "Đăng ký và xác minh eKYC",
        desc: "Điền thông tin và xác minh CCCD theo hướng dẫn trong ứng dụng.",
      },
      {
        title: "Nạp tiền và bắt đầu",
        desc: "Chuyển tiền vào tài khoản VNDIRECT. Giao diện đơn giản giúp F0 làm quen nhanh chóng.",
      },
    ],
  },

  dsc: {
    slug: "dsc",
    name: "DSC Securities",
    shortName: "DSC",
    rating: 3.8,
    best_for: "Nhà đầu tư tự chủ muốn phí thấp, hệ thống ổn định",
    fee_rate: "0.10% – 0.15%",
    margin_rate: "9.9%/năm",
    app_rating: "3.5/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.dsc.com.vn",
    pros: [
      "Phí giao dịch cạnh tranh, từ 0.10% — thấp hơn mức trung bình thị trường",
      "Lãi suất margin 9.9%/năm, thuộc nhóm thấp nhất hiện nay",
      "Hệ thống giao dịch ổn định, rất ít xảy ra lỗi hay nghẽn lệnh",
      "Đội ngũ môi giới có chuyên môn, hỗ trợ tận tình qua điện thoại",
      "Thủ tục mở tài khoản online nhanh, thường phê duyệt trong ngày",
    ],
    cons: [
      "Ứng dụng di động giao diện cũ, thiếu tính năng phân tích kỹ thuật nâng cao",
      "Tên tuổi thị phần nhỏ, ít được người mới biết đến",
      "Không có công cụ lọc cổ phiếu (stock screener) tích hợp",
      "Báo cáo phân tích doanh nghiệp ít và không chuyên sâu bằng SSI, TCBS",
    ],
    verdict:
      "DSC phù hợp với nhà đầu tư đã có kinh nghiệm, tự chủ trong quyết định và muốn tối ưu hóa chi phí. Với mức phí và lãi suất margin cạnh tranh, đây là lựa chọn hợp lý để mở tài khoản thứ hai bên cạnh các công ty chứng khoán lớn hơn.",
    companyInfo: {
      founded: "2007",
      hq: "Tòa nhà PVcomBank, 22 Ngô Quyền, Hoàn Kiếm, Hà Nội",
      license: "Giấy phép KDCK số 20/UBCK-ĐKGPHĐKD",
      website: "https://www.dsc.com.vn",
      products: [
        "Môi giới cổ phiếu, chứng chỉ quỹ, ETF",
        "Giao dịch hợp đồng tương lai VN30",
        "Cho vay margin (lãi suất từ 9.9%/năm)",
        "Tư vấn đầu tư và phân tích báo cáo",
        "Phân phối trái phiếu doanh nghiệp",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng DSC Trade",
        desc: "Tải ứng dụng DSC Trade trên App Store hoặc Google Play. Hỗ trợ toàn bộ quy trình mở tài khoản online.",
      },
      {
        title: "Đăng ký và xác minh danh tính (eKYC)",
        desc: "Chụp ảnh CCCD hai mặt theo hướng dẫn. Quy trình eKYC thường hoàn tất trong vòng 5–10 phút, phê duyệt trong ngày.",
      },
      {
        title: "Nạp tiền vào tài khoản",
        desc: "Chuyển khoản từ tài khoản ngân hàng cá nhân vào tài khoản DSC. DSC liên kết với hầu hết ngân hàng lớn tại Việt Nam.",
      },
      {
        title: "Bắt đầu giao dịch",
        desc: "Đăng nhập DSC Trade và đặt lệnh mua ngay trong phiên giao dịch. Tiền về tài khoản sau T+2 theo quy định HOSE/HNX.",
      },
    ],
  },
};

/** Look up a broker profile by slug. Returns undefined if not found. */
export function getBroker(slug: string): BrokerProfile | undefined {
  return brokerRegistry[slug];
}

/**
 * Merge an article's partial broker override with the central registry entry.
 * Article-level values win on conflict; registry fills missing fields.
 */
export function mergeBroker(
  articleBroker: Partial<BrokerProfile> & { slug: string },
  fallback?: Partial<BrokerProfile>
): BrokerProfile {
  const central = brokerRegistry[articleBroker.slug] ?? {};
  return { ...central, ...fallback, ...articleBroker } as BrokerProfile;
}
