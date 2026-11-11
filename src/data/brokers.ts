import { getPolicy, getOutboundLink } from './review-catalog';
import { formatPolicy } from '../lib/review-data.mjs';

/**
 * Canonical broker registry — single source of truth for Vietnamese broker profiles.
 *
 * Review articles reference brokers by slug. The ReviewLayout merges this central
 * data with article-level editorial overrides. Financial facts and outbound URLs
 * come from the sourced review catalog, including explicit unknown values.
 *
 * Data reflects publicly available information; update when official sources change.
 * Last updated: 2026-06
 */

export interface RatingDimension {
  fee: number;       // 1–5: competitiveness of trading fees
  app: number;       // 1–5: platform/app quality and tools
  support: number;   // 1–5: customer support quality
  stability: number; // 1–5: system stability under peak load
  products: number;  // 1–5: breadth of investment products
}

export interface UserVoice {
  quote: string;
  source: string;
  type: "pro" | "con";
}

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
  ratingBreakdown: RatingDimension;
  userVoices?: UserVoice[];
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
    ratingBreakdown: {
      fee: 5.0,
      app: 4.8,
      support: 3.8,
      stability: 4.3,
      products: 4.2,
    },
    userVoices: [
      {
        quote: "Miễn phí giao dịch cổ phiếu, tôi tiết kiệm được khoảng 5–8 triệu/năm so với hồi dùng CTCK cũ. Đây là lợi thế không ai cạnh tranh được.",
        source: "Google Play — TCInvest",
        type: "pro",
      },
      {
        quote: "TCInvest có đủ báo cáo tài chính, định giá và biểu đồ kỹ thuật trong một ứng dụng — tôi không cần mở thêm app thứ ba nào khác.",
        source: "App Store — TCInvest",
        type: "pro",
      },
      {
        quote: "Không có môi giới nên khi mới vào tôi phải tự mày mò nhiều. Chatbot trả lời cũng chậm vào những hôm thị trường sôi động.",
        source: "CafeF Diễn đàn",
        type: "con",
      },
    ],
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
    ratingBreakdown: {
      fee: 3.5,
      app: 4.0,
      support: 4.5,
      stability: 5.0,
      products: 4.8,
    },
    userVoices: [
      {
        quote: "Tôi chuyển về SSI sau sự cố VNDIRECT 2024. Dùng 20 năm, hệ thống SSI chưa bao giờ tôi thấy lỗi nghẽn — yên tâm hơn hẳn.",
        source: "CafeF Diễn đàn",
        type: "pro",
      },
      {
        quote: "Báo cáo phân tích của SSI Research là tốt nhất Việt Nam. Tôi đăng ký SSI chủ yếu để đọc research, không phải để giao dịch rẻ.",
        source: "App Store — iSSI",
        type: "pro",
      },
      {
        quote: "Phí 0.2%/lệnh cắn vào lợi nhuận khi tôi trade ngắn hạn nhiều. Chuyển một phần sang TCBS để tiết kiệm chi phí.",
        source: "Google Play — iSSI",
        type: "con",
      },
    ],
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
    ratingBreakdown: {
      fee: 3.5,
      app: 4.0,
      support: 4.8,
      stability: 3.5,
      products: 4.2,
    },
    userVoices: [
      {
        quote: "Môi giới của tôi gọi ngay khi thị trường biến động mạnh, giải thích cổ phiếu tôi đang nắm giữ. F0 như tôi rất cần người dẫn dắt như vậy.",
        source: "Google Play — SmartOne",
        type: "pro",
      },
      {
        quote: "3 lần trong năm app lỗi không đăng nhập được đúng lúc thị trường biến động. Tôi mất cơ hội cắt lỗ kịp — tức thật sự.",
        source: "App Store — SmartOne",
        type: "con",
      },
      {
        quote: "Sau khi hết ưu đãi phí 0%, tôi chuyển hết sang TCBS vì phí 0.2% mỗi lệnh cắn vào lợi nhuận khá nhiều khi giao dịch đều đặn.",
        source: "CafeF Diễn đàn",
        type: "con",
      },
    ],
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
    ratingBreakdown: {
      fee: 3.5,
      app: 4.3,
      support: 3.5,
      stability: 3.0,
      products: 3.8,
    },
    userVoices: [
      {
        quote: "Ứng dụng đẹp nhất trong số các CTCK tôi đã dùng — dễ dùng cho người mới, không bị choáng ngợp với quá nhiều thông tin.",
        source: "App Store — VNDIRECT",
        type: "pro",
      },
      {
        quote: "Sự cố ransomware 2024 khiến tôi không truy cập được tài khoản gần 1 tuần. Từ đó tôi không dám để nhiều tiền ở đây nữa.",
        source: "CafeF Diễn đàn",
        type: "con",
      },
    ],
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
    ratingBreakdown: {
      fee: 4.8,
      app: 3.2,
      support: 3.5,
      stability: 4.2,
      products: 3.5,
    },
    userVoices: [
      {
        quote: "Margin rate 9.9% thấp nhất tôi tìm được. Với danh mục margin cỡ 500 triệu, tiết kiệm được khoảng 3–4 triệu lãi/năm so với SSI.",
        source: "CafeF Diễn đàn",
        type: "pro",
      },
      {
        quote: "App DSC Trade khá cơ bản, thiếu nhiều công cụ phân tích. Tôi chủ yếu dùng DSC cho margin, phân tích thì dùng TCBS.",
        source: "Google Play — DSC Trade",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2006",
      hq: "Tầng 2, Thành Công Building, 80 Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
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

  dnse: {
    slug: "dnse",
    name: "DNSE Securities",
    shortName: "DNSE",
    rating: 4.3,
    best_for: "Nhà đầu tư tự chủ, muốn quản lý margin theo từng giao dịch và miễn phí trọn đời",
    fee_rate: "0% (miễn phí trọn đời)",
    margin_rate: "9.9% – 13.9%/năm",
    app_rating: "4.2/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.dnse.com.vn",
    pros: [
      "Miễn 100% phí giao dịch cổ phiếu trọn đời trên Entrade X",
      "Tính năng Margin X cho phép quản lý và vay margin độc lập theo từng deal",
      "Giao diện Entrade X hiện đại, mượt mà và trực quan cho thế hệ mới",
      "Quy trình nạp rút tiền nhanh, liên kết ngân hàng sâu",
    ],
    cons: [
      "Không có môi giới tư vấn truyền thống 1-1",
      "Báo cáo phân tích doanh nghiệp còn ở mức cơ bản",
      "Thị phần môi giới nhỏ hơn so với VPS hay SSI",
    ],
    verdict:
      "DNSE là lựa chọn tuyệt vời cho nhà đầu tư thích tự chủ và tối ưu chi phí. Tính năng Margin X độc đáo giúp quản lý rủi ro từng lệnh tách biệt là điểm cộng lớn, đi kèm chính sách miễn phí giao dịch trọn đời.",
    ratingBreakdown: {
      fee: 5.0,
      app: 4.5,
      support: 3.5,
      stability: 4.0,
      products: 3.8,
    },
    userVoices: [
      {
        quote: "Margin X cho tôi vay theo từng deal riêng — deal nào cháy chỉ mất deal đó, không ảnh hưởng cả tài khoản. Cách quản trị rủi ro này tôi chưa thấy sàn nào khác có.",
        source: "Google Play — Entrade X",
        type: "pro",
      },
      {
        quote: "Miễn phí giao dịch trọn đời nên tôi trade bao nhiêu lệnh cũng không lo phí cắn lợi nhuận. App Entrade X mượt, mở tài khoản qua eKYC xong dùng được ngay trong vài phút.",
        source: "App Store — Entrade X",
        type: "pro",
      },
      {
        quote: "DNSE không có môi giới gọi điện tư vấn, mọi thứ đều tự thao tác. Người mới như tôi ban đầu khá bỡ ngỡ, phải tự đọc tài liệu và mày mò nhiều.",
        source: "CafeF Diễn đàn",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2007",
      hq: "Tầng 6, Tòa nhà Pax Sky, 63-65 Ngô Thì Nhậm, Hai Bà Trưng, Hà Nội",
      license: "Giấy phép KDCK số 62/UBCK-GPHĐKD",
      website: "https://www.dnse.com.vn",
      products: [
        "Môi giới cổ phiếu, ETF, chứng chỉ quỹ",
        "Giao dịch phái sinh (Entrade X)",
        "Cho vay ký quỹ Margin X",
        "Tích lũy tài sản tự động",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng Entrade X",
        desc: "Tải Entrade X từ App Store hoặc Google Play để đăng ký mở tài khoản online.",
      },
      {
        title: "Xác minh danh tính eKYC",
        desc: "Chụp ảnh CCCD và quét nhận diện khuôn mặt. Tài khoản được phê duyệt tự động chỉ sau vài phút.",
      },
      {
        title: "Liên kết tài khoản ngân hàng",
        desc: "Thiết lập liên kết chuyển/nút tiền nhanh với ngân hàng để giao dịch thuận tiện.",
      },
      {
        title: "Nạp tiền và giao dịch",
        desc: "Chuyển tiền vào tài khoản DNSE theo hướng dẫn và bắt đầu mua cổ phiếu đầu tiên.",
      },
    ],
  },

  mbs: {
    slug: "mbs",
    name: "MBS (Chứng khoán MB)",
    shortName: "MBS",
    rating: 4.4,
    best_for: "Nhà đầu tư muốn sự an toàn từ ngân hàng quân đội và ứng dụng giao dịch hiện đại",
    fee_rate: "0.10% – 0.15%",
    margin_rate: "10.5% – 12.5%/năm",
    app_rating: "4.3/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://mbs.com.vn",
    pros: [
      "Bảo trợ bởi Ngân hàng Quân đội (MBBank) — uy tín và an toàn tài chính cực cao",
      "Ứng dụng MBS Mobile mới thiết kế trực quan, hiện đại, tích hợp phân tích tốt",
      "Hệ thống khuyến nghị đầu tư Pro Advice chuyên sâu và cập nhật liên tục",
      "Chuyển tiền liên thông tức thì giữa MBBank và MBS hoàn toàn không mất phí",
    ],
    cons: [
      "Phí giao dịch và lãi suất margin ở mức trung bình, không quá rẻ",
      "Chất lượng môi giới hỗ trợ không đồng đều ở các chi nhánh",
      "Hệ thống đôi lúc chậm phản hồi khi thị trường biến động quá mạnh",
    ],
    verdict:
      "MBS đem lại cảm giác yên tâm tuyệt đối cho nhà đầu tư nhờ thương hiệu ngân hàng MBBank. Ứng dụng MBS Mobile được đầu tư mạnh mẽ kết hợp cùng các tư vấn chất lượng giúp MBS là lựa chọn an toàn cho cả người mới lẫn người có kinh nghiệm.",
    ratingBreakdown: {
      fee: 3.8,
      app: 4.4,
      support: 4.0,
      stability: 4.2,
      products: 4.1,
    },
    userVoices: [
      {
        quote: "MBS là công ty con của ngân hàng Quân đội nên tôi yên tâm về độ an toàn. Chuyển tiền qua lại giữa MB Bank và tài khoản chứng khoán tức thì, không mất phí.",
        source: "Google Play — MBS Mobile",
        type: "pro",
      },
      {
        quote: "Bản khuyến nghị Pro Advice cập nhật đều đặn, giúp tôi có thêm góc nhìn trước khi ra quyết định. App MBS Mobile bản mới cũng dễ dùng hơn hẳn bản cũ.",
        source: "App Store — MBS Mobile",
        type: "pro",
      },
      {
        quote: "Phí giao dịch của MBS ở mức trung bình, không rẻ như các sàn zero-fee. Tôi giữ MBS cho phần đầu tư an toàn, còn phần lướt sóng thì để ở chỗ phí thấp hơn.",
        source: "CafeF Diễn đàn",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2000",
      hq: "Tòa nhà MB, 21 Cát Linh, Đống Đa, Hà Nội",
      license: "Giấy phép KDCK số 116/GP-UBCK",
      website: "https://mbs.com.vn",
      products: [
        "Môi giới cổ phiếu, ETF, chứng chỉ quỹ",
        "Giao dịch hợp đồng tương lai",
        "Dịch vụ cho vay margin",
        "Phân tích báo cáo Pro Advice",
        "Dịch vụ quản lý tài sản",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng MBS Mobile",
        desc: "Tải ứng dụng MBS Mobile trên App Store hoặc Google Play.",
      },
      {
        title: "Đăng ký eKYC trực tuyến",
        desc: "Cung cấp ảnh CCCD và quét nhận diện khuôn mặt online qua eKYC. Xác minh nhanh trong vài phút.",
      },
      {
        title: "Liên kết tài khoản MBBank",
        desc: "Dễ dàng liên kết với tài khoản ngân hàng MBBank (nếu có) để nạp rút tiền tự động không tốn phí.",
      },
      {
        title: "Nạp tiền và bắt đầu giao dịch",
        desc: "Chuyển tiền vào tài khoản chứng khoán MBS và thực hiện giao dịch mua bán cổ phiếu.",
      },
    ],
  },

  pinetree: {
    slug: "pinetree",
    name: "Chứng khoán Pinetree",
    shortName: "Pinetree",
    rating: 4.4,
    best_for: "Nhà đầu tư cá nhân tự chủ, muốn tối ưu chi phí giao dịch và margin",
    fee_rate: "0% (miễn phí trọn đời)",
    margin_rate: "9.9%/năm cố định",
    app_rating: "4.1/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.pinetree.com.vn",
    pros: [
      "Miễn 100% phí giao dịch cổ phiếu trọn đời cho mọi tài khoản tự giao dịch",
      "Lãi suất vay margin cố định dài hạn chỉ 9.9%/năm, không đi kèm điều kiện ẩn",
      "Hệ sinh thái ứng dụng đa dạng (PineX, Stock123, AlphaTrading) hỗ trợ tốt cho việc tự học và giao dịch",
      "Mở tài khoản online nhanh chóng 100% qua eKYC",
    ],
    cons: [
      "Không có đội ngũ môi giới tư vấn truyền thống 1-1",
      "Hỗ trợ chăm sóc khách hàng qua hotline/email phản hồi đôi khi chậm trong giờ cao điểm",
      "Tiền bán chứng khoán cần chờ T+2 để rút hoặc phải trả phí nếu muốn ứng trước",
    ],
    verdict:
      "Pinetree là lựa chọn lý tưởng cho các nhà đầu tư tự chủ, có kinh nghiệm hoặc các nhà đầu tư lướt sóng tần suất cao muốn triệt tiêu hoàn toàn chi phí giao dịch. Tuy nhiên, việc thiếu môi giới đồng hành đòi hỏi bạn phải tự trang bị kiến thức và chịu trách nhiệm cho các quyết định của mình.",
    ratingBreakdown: {
      fee: 5.0,
      app: 4.3,
      support: 3.2,
      stability: 4.2,
      products: 3.8,
    },
    userVoices: [
      {
        quote: "Miễn phí giao dịch trọn đời giúp tôi tiết kiệm được khoản tiền đáng kể mỗi năm. Ứng dụng mượt mà, đặt lệnh nhanh.",
        source: "App Store — AlphaTrading",
        type: "pro",
      },
      {
        quote: "Không có môi giới tư vấn nên người mới như tôi phải tự tìm hiểu mọi thứ. Những hôm thị trường biến động gọi hotline hỗ trợ rất khó.",
        source: "CafeF Diễn đàn",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2003",
      hq: "Tầng 20, Tòa nhà ROX Tower, số 54A Nguyễn Chí Thanh, Láng Thượng, Đống Đa, Hà Nội",
      license: "Giấy phép KDCK số 10/GPHĐKD",
      website: "https://www.pinetree.com.vn",
      products: [
        "Môi giới cổ phiếu, chứng chỉ quỹ, ETF",
        "Giao dịch ký quỹ Margin (lãi suất 9.9%/năm)",
        "Dịch vụ tài chính và quản lý tài sản",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng AlphaTrading",
        desc: "Tải ứng dụng AlphaTrading từ App Store hoặc Google Play để bắt đầu đăng ký.",
      },
      {
        title: "Xác minh danh tính eKYC",
        desc: "Chụp ảnh CCCD và quét khuôn mặt để mở tài khoản online tự động trong 5 phút.",
      },
      {
        title: "Nạp tiền vào tài khoản",
        desc: "Chuyển khoản định danh vào Pinetree theo hướng dẫn trên ứng dụng.",
      },
      {
        title: "Bắt đầu giao dịch 0% phí",
        desc: "Đặt lệnh mua bán cổ phiếu trên app hoàn toàn miễn phí giao dịch.",
      },
    ],
  },

  bsc: {
    slug: "bsc",
    name: "Chứng khoán BSC (BIDV Securities)",
    shortName: "BSC",
    rating: 4.4,
    best_for: "Nhà đầu tư ưu tiên an toàn ngân hàng BIDV, phí online thấp & lãi margin ưu đãi",
    fee_rate: "0.08% (online ưu đãi)",
    margin_rate: "7.5%/năm (ưu đãi) – 11.5%/năm",
    app_rating: "4.1/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.bsc.com.vn",
    pros: [
      "Trực thuộc BIDV — ngân hàng quốc doanh lớn nhất Việt Nam, đảm bảo an toàn vốn và bảo mật cao",
      "Phí giao dịch online siêu ưu đãi chỉ 0.08%, thuộc nhóm thấp nhất thị trường",
      "Gói lãi suất margin ưu đãi khách hàng mới chỉ từ 7.5%/năm",
      "Nạp rút tiền tức thì và miễn phí qua liên kết BIDV SmartBanking",
    ],
    cons: [
      "Phí giao dịch qua nhân viên môi giới trực tiếp còn cao (0.15% – 0.35%)",
      "Giao diện app BSC Mobile còn hơi phức tạp, cần thời gian làm quen cho F0",
      "Hệ thống công cụ Open API cho giao dịch tự động thuật toán còn hạn chế",
    ],
    verdict:
      "BSC là lựa chọn lý tưởng cho nhà đầu tư tìm kiếm sự kết hợp giữa uy tín, độ an toàn tuyệt đối từ ngân hàng quốc doanh BIDV với chính sách chi phí cạnh tranh (phí online 0.08% và lãi margin ưu đãi từ 7.5%/năm).",
    ratingBreakdown: {
      fee: 4.7,
      app: 4.0,
      support: 4.3,
      stability: 4.6,
      products: 4.3,
    },
    userVoices: [
      {
        quote: "Phí online 0.08% quá bất ngờ đối với một CTCK trực thuộc ngân hàng lớn. Nạp rút tiền qua BIDV SmartBanking chỉ mất vài giây.",
        source: "Google Play — BSC Mobile",
        type: "pro",
      },
      {
        quote: "Giao diện app BSC Mobile có nhiều chức năng xếp dày đặc, người mới bắt đầu như tôi phải mất vài ngày mới quen thao tác đặt lệnh.",
        source: "Diễn đàn Chứng khoán F319",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "1999",
      hq: "Tầng 8, 9 Tòa nhà Thaiholdings Tower, 210 Trần Quang Khải, Hoàn Kiếm, Hà Nội",
      license: "Giấy phép KDCK số 02/GPHĐKD",
      website: "https://www.bsc.com.vn",
      products: [
        "Môi giới cổ phiếu, trái phiếu, chứng chỉ quỹ",
        "Giao dịch ký quỹ Margin (lãi suất ưu đãi từ 7.5%)",
        "Giao dịch chứng khoán phái sinh",
        "Tư vấn tài chính doanh nghiệp và bảo lãnh phát hành",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng BSC Mobile",
        desc: "Tải app BSC Mobile trên App Store hoặc Google Play và chọn Đăng ký mở tài khoản.",
      },
      {
        title: "Xác minh định danh eKYC",
        desc: "Chụp ảnh hai mặt CCCD gắn chip và quét nhận diện khuôn mặt theo hướng dẫn trên màn hình.",
      },
      {
        title: "Liên kết tài khoản BIDV",
        desc: "Liên kết với BIDV SmartBanking để nạp rút tiền chứng khoán tức thì và hoàn toàn miễn phí.",
      },
      {
        title: "Kích hoạt và nạp tiền giao dịch",
        desc: "Xác nhận hợp đồng điện tử qua OTP và nạp tiền bắt đầu giao dịch với phí 0.08%.",
      },
    ],
  },

  shs: {
    slug: "shs",
    name: "Chứng khoán SHS (Sài Gòn - Hà Nội)",
    shortName: "SHS",
    rating: 4.3,
    best_for: "Nhà đầu tư vốn vừa và lớn, giao dịch năng động cần nguồn margin dồi dào",
    fee_rate: "0.15% (online)",
    margin_rate: "9.9%/năm (Gói S30) – 12.0%/năm",
    app_rating: "4.0/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.shs.com.vn",
    pros: [
      "Nguồn vốn margin dồi dào từ bệ phóng Ngân hàng SHB và Tập đoàn T&T, hiếm khi cạn room",
      "Các gói margin chuyên biệt cạnh tranh như Margin S30 lãi suất chỉ từ 9.9%/năm",
      "Báo cáo phân tích chiến lược vĩ mô và ngành có chất lượng chuyên môn cao",
      "Hệ thống quản lý tài sản và danh mục đầu tư toàn diện",
    ],
    cons: [
      "Phí giao dịch online 0.15% ở mức tiêu chuẩn, chưa cạnh tranh bằng các sàn miễn phí",
      "Ứng dụng SHS Mobile đôi khi phản hồi chậm trong những phút cao điểm mở phiên",
      "Kết quả kinh doanh chịu ảnh hưởng lớn từ biến động danh mục tự doanh",
    ],
    verdict:
      "SHS là điểm đến thích hợp cho các nhà đầu tư giao dịch năng động, cần quy mô vốn vay margin lớn và các gói lãi suất ưu đãi chuyên biệt (từ 9.9%/năm) cùng sự hỗ trợ vốn vững chắc từ ngân hàng SHB.",
    ratingBreakdown: {
      fee: 4.1,
      app: 3.9,
      support: 4.2,
      stability: 4.3,
      products: 4.4,
    },
    userVoices: [
      {
        quote: "Gói margin S30 lãi 9.9% rất hữu ích cho các đợt lướt sóng ngắn hạn. Hạn mức room vay luôn sẵn sàng khi thị trường bùng nổ.",
        source: "Diễn đàn F247",
        type: "pro",
      },
      {
        quote: "Phí 0.15% chưa tối ưu nếu lướt sóng liên tục mỗi ngày. Ứng dụng SHS Mobile cần cải thiện tốc độ mượt mà hơn.",
        source: "App Store — SHS Mobile",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2007",
      hq: "Tầng 1-5 Tòa nhà Unimex Hà Nội, số 41 Ngô Quyền, Hàng Bài, Hoàn Kiếm, Hà Nội",
      license: "Giấy phép UBCKNN số 66/UBCK-GP",
      website: "https://www.shs.com.vn",
      products: [
        "Môi giới cổ phiếu, trái phiếu, chứng quyền",
        "Cho vay ký quỹ Margin (Gói Elite, Gói S30)",
        "Giao dịch chứng khoán phái sinh",
        "Dịch vụ bảo lãnh phát hành và tư vấn tài chính",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng SHS Mobile",
        desc: "Tải ứng dụng SHS Mobile từ App Store hoặc Google Play và chọn Đăng ký tài khoản mới.",
      },
      {
        title: "Xác thực danh tính eKYC",
        desc: "Chụp ảnh hai mặt CCCD và nhận diện khuôn mặt tự động bằng camera điện thoại.",
      },
      {
        title: "Ký hợp đồng mở tài khoản điện tử",
        desc: "Kiểm tra thông tin cá nhân và ký kết hợp đồng điện tử qua mã OTP gửi về số điện thoại.",
      },
      {
        title: "Nạp tiền và bắt đầu giao dịch",
        desc: "Chuyển tiền vào tài khoản định danh SHS và bắt đầu giải ngân giao dịch cổ phiếu.",
      },
    ],
  },

  acbs: {
    slug: "acbs",
    name: "Chứng khoán ACBS (ACB Securities)",
    shortName: "ACBS",
    rating: 4.4,
    best_for: "Khách hàng ngân hàng ACB, nhà đầu tư thích lướt sóng ngắn hạn với gói margin T+",
    fee_rate: "0.075% – 0.10% (tự giao dịch)",
    margin_rate: "Miễn lãi 7 ngày (Gói T+) – 11.5%/năm",
    app_rating: "4.2/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.acbs.com.vn",
    pros: [
      "Hậu thuẫn 100% vốn từ Ngân hàng ACB, xếp hạng tín nhiệm hạng A từ FiinRatings",
      "Phí giao dịch online siêu ưu đãi chỉ từ 0.075% đến 0.10% cho tài khoản tự giao dịch",
      "Gói margin T+ độc đáo: miễn lãi 0% trong 7 ngày đầu hoặc 8% trong 14 ngày đầu",
      "Nạp rút tiền liền mạch, nhanh chóng trong hệ sinh thái ngân hàng số ACB",
    ],
    cons: [
      "Phí giao dịch có môi giới tư vấn còn ở mức tương đối cao (0.15% – 0.30%)",
      "App ACBS Smart còn thiếu một số công cụ phân tích kỹ thuật chuyên sâu",
      "Các chi nhánh phòng giao dịch tập trung chủ yếu ở Hà Nội và TP.HCM",
    ],
    verdict:
      "ACBS là lựa chọn tuyệt vời cho các nhà đầu tư sẵn có tài khoản tại ACB, muốn tối ưu chi phí với phí online chỉ từ 0.075% và tận dụng gói margin T+ miễn lãi 7 ngày để giao dịch ngắn hạn.",
    ratingBreakdown: {
      fee: 4.8,
      app: 4.1,
      support: 4.3,
      stability: 4.5,
      products: 4.2,
    },
    userVoices: [
      {
        quote: "Phí online 0.075% rẻ ngỡ ngàng so với các sàn ngân hàng khác. Gói margin T+ miễn lãi tuần đầu đánh T+ cực kỳ hời.",
        source: "Google Play — ACBS Smart",
        type: "pro",
      },
      {
        quote: "App đôi khi đăng nhập vào buổi sáng giờ mở phiên hơi chậm, cần tối ưu thêm về tốc độ load dữ liệu bảng giá.",
        source: "Diễn đàn Đầu tư ACB",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2000",
      hq: "Tầng 3, Tòa nhà Léman Luxury, 117 Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP.HCM",
      license: "Giấy phép KDCK số 06/GPHĐKD",
      website: "https://www.acbs.com.vn",
      products: [
        "Môi giới cổ phiếu, trái phiếu, chứng chỉ quỹ",
        "Gói cho vay ký quỹ Margin T+",
        "Giao dịch chứng khoán phái sinh",
        "Tư vấn đầu tư và tài chính doanh nghiệp",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng ACBS Smart",
        desc: "Tải app ACBS Smart trên điện thoại từ App Store hoặc Google Play và chọn Mở tài khoản.",
      },
      {
        title: "Định danh điện tử eKYC",
        desc: "Chụp ảnh 2 mặt CCCD và quét khuôn mặt xác thực sinh trắc học tự động.",
      },
      {
        title: "Liên kết tài khoản ngân hàng ACB",
        desc: "Liên kết tài khoản ACB ONE để nạp rút tiền tức thì 24/7 không tốn phí.",
      },
      {
        title: "Ký hợp đồng và bắt đầu giao dịch",
        desc: "Ký hợp đồng điện tử bằng mã OTP và nạp tiền bắt đầu giao dịch với phí từ 0.075%.",
      },
    ],
  },

  tps: {
    slug: "tps",
    name: "Chứng khoán TPS (Tiên Phong Securities)",
    shortName: "TPS",
    rating: 4.3,
    best_for: "Khách hàng hệ sinh thái TPBank, nhà đầu tư ưa chuộng công nghệ số & margin M7",
    fee_rate: "0.15% (thường xuyên có gói 0%)",
    margin_rate: "Miễn lãi 7 ngày (Gói M7) – 12.0%/năm",
    app_rating: "4.1/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://tpbs.com.vn",
    pros: [
      "Nằm trong hệ sinh thái TPBank — ngân hàng tiên phong về chuyển đổi số tại Việt Nam",
      "Gói margin M7 hấp dẫn: miễn lãi suất 0% trong 7 ngày đầu tiên",
      "Thường xuyên có các chương trình khuyến mãi miễn phí giao dịch cho khách hàng mở mới",
      "Nạp rút tiền tức thì 24/7 qua kết nối sâu với ứng dụng TPBank Mobile",
    ],
    cons: [
      "Biểu phí tiêu chuẩn ngoài thời gian khuyến mãi ở mức 0.15%, chưa thuộc nhóm rẻ nhất",
      "Báo cáo phân tích doanh nghiệp chưa phong phú bằng các CTCK top đầu như SSI hay HSC",
      "Ứng dụng TPS Mobile thỉnh thoảng có độ trễ nhẹ khi thị trường có biến động lớn",
    ],
    verdict:
      "TPS phù hợp cho các nhà đầu tư trẻ yêu thích trải nghiệm số hiện đại của TPBank, tận dụng gói ưu đãi margin ngắn hạn M7 miễn lãi và chuyển nạp tiền tức thì qua ngân hàng số.",
    ratingBreakdown: {
      fee: 4.3,
      app: 4.2,
      support: 4.1,
      stability: 4.3,
      products: 4.2,
    },
    userVoices: [
      {
        quote: "Nạp tiền từ app TPBank vào chứng khoán TPS chỉ mất 5 giây. Gói margin M7 miễn lãi 7 ngày rất thích hợp cho trading ngắn hạn.",
        source: "App Store — TPS Mobile",
        type: "pro",
      },
      {
        quote: "Biểu phí sau khi hết khuyến mãi 0% sẽ về mức 0.15%, cần theo dõi kỹ các chương trình ưu đãi để không bị bất ngờ.",
        source: "Cộng đồng Nhà đầu tư TPS",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2006",
      hq: "Tầng 4 & Tầng 7, Tòa nhà Doji Tower, số 81-83-85 Hàm Nghi, Quận 1, TP.HCM",
      license: "Giấy phép KDCK số 41/UBCK-GPHĐKD",
      website: "https://tpbs.com.vn",
      products: [
        "Môi giới cổ phiếu, trái phiếu doanh nghiệp",
        "Cho vay margin (Gói M7 ưu đãi)",
        "Tư vấn tài chính và bảo lãnh phát hành",
        "Sản phẩm tích lũy tài chính",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng TPS Mobile",
        desc: "Tải app TPS Mobile từ App Store hoặc CH Play và chọn Mở tài khoản trực tuyến.",
      },
      {
        title: "Xác thực danh tính eKYC",
        desc: "Chụp ảnh hai mặt CCCD gắn chip và quét nhận diện gương mặt qua camera.",
      },
      {
        title: "Liên kết tài khoản TPBank",
        desc: "Kết nối tài khoản ngân hàng TPBank để hỗ trợ nạp rút tự động và nhận ưu đãi.",
      },
      {
        title: "Kích hoạt và nạp tiền giao dịch",
        desc: "Xác thực mã OTP gửi về điện thoại để hoàn tất ký hợp đồng và bắt đầu giao dịch.",
      },
    ],
  },

  yuanta: {
    slug: "yuanta",
    name: "Chứng khoán Yuanta Việt Nam",
    shortName: "Yuanta",
    rating: 4.4,
    best_for: "Nhà đầu tư chủ động cần công cụ quét sóng YSradar và đòn bẩy vốn ngoại linh hoạt",
    fee_rate: "0.10% (tự giao dịch) – 0.15%",
    margin_rate: "Miễn lãi 7 ngày (Gói YST+) – 11.5%/năm",
    app_rating: "4.2/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://yuanta.com.vn",
    pros: [
      "Tiềm lực tài chính vững mạnh từ Tập đoàn Yuanta Đài Loan — tập đoàn tài chính hàng đầu châu Á",
      "Bộ công cụ phân tích công nghệ vượt trội: YSradar (quét tín hiệu), YSflex, YSinvest miễn phí",
      "Phí giao dịch online chỉ 0.10% cho tài khoản tự giao dịch, cạnh tranh cao",
      "Gói margin YST+ miễn lãi 0% trong 7 ngày đầu tiên với hạn mức vay lớn",
    ],
    cons: [
      "Mạng lưới chi nhánh vật lý còn tập trung ở các thành phố lớn",
      "Giao diện app YSflex có rất nhiều tính năng nâng cao nên người mới cần thời gian làm quen",
      "Các khuyến nghị đầu tư tự động đôi khi có độ trễ so với nhịp giao dịch thực tế",
    ],
    verdict:
      "Yuanta là sự kết hợp hoàn hảo giữa nguồn vốn ngoại dồi dào, chi phí giao dịch thấp (0.10%) và hệ thống công cụ định lượng YSradar mạnh mẽ cho nhà đầu tư thích tự chủ phân tích.",
    ratingBreakdown: {
      fee: 4.6,
      app: 4.4,
      support: 4.1,
      stability: 4.4,
      products: 4.3,
    },
    userVoices: [
      {
        quote: "Công cụ YSradar quét sóng và chấm điểm cổ phiếu rất chuẩn, giúp tôi tiết kiệm nhiều thời gian lọc mã hàng ngày.",
        source: "Google Play — YSflex",
        type: "pro",
      },
      {
        quote: "Nhiều công cụ quá nên lúc đầu vào app hơi bị ngợp. Nếu có thêm video hướng dẫn chi tiết từng tính năng thì tốt hơn.",
        source: "Diễn đàn Chứng khoán F319",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2007",
      hq: "Tầng 4, Tòa nhà Saigon Centre Tower 1, 65 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
      license: "Giấy phép KDCK số 77/UBCK-GP",
      website: "https://yuanta.com.vn",
      products: [
        "Môi giới cổ phiếu, chứng quyền, phái sinh",
        "Bộ công cụ phân tích dữ liệu YSradar",
        "Cho vay ký quỹ Margin (Gói YST+)",
        "Tư vấn tài chính doanh nghiệp",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng YSflex",
        desc: "Tải app YSflex trên App Store hoặc Google Play và chọn nút Mở tài khoản eKYC.",
      },
      {
        title: "Chụp ảnh CCCD và xác thực khuôn mặt",
        desc: "Chụp rõ 2 mặt thẻ CCCD và hoàn tất nhận diện sinh trắc học chỉ trong 1 phút.",
      },
      {
        title: "Đăng ký dịch vụ và gói Margin",
        desc: "Lựa chọn gói tự giao dịch (phí 0.10%) hoặc đăng ký gói margin ưu đãi YST+.",
      },
      {
        title: "Ký hợp đồng và nạp tiền giao dịch",
        desc: "Nhận thông tin tài khoản qua email/SMS, nạp tiền và bắt đầu trải nghiệm YSradar.",
      },
    ],
  },

  kis: {
    slug: "kis",
    name: "Chứng khoán KIS Việt Nam",
    shortName: "KIS",
    rating: 4.3,
    best_for: "Nhà đầu tư cần nguồn margin vốn ngoại dồi dào, lãi suất ưu đãi và phái sinh/chứng quyền",
    fee_rate: "0.15% (online tiêu chuẩn)",
    margin_rate: "Từ 8.9%/năm (ưu đãi) – 11.8%/năm",
    app_rating: "4.0/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://kisvn.vn",
    pros: [
      "Thuộc Tập đoàn Korea Investment & Securities (Hàn Quốc) — định chế tài chính sừng sỏ châu Á",
      "Nguồn vốn margin ngoại cực kỳ dồi dào, room vay lớn và lãi suất ưu đãi chỉ từ 8.9%/năm",
      "Đơn vị tiên phong và dẫn đầu thị trường về phát hành chứng quyền có bảo đảm (CW)",
      "Đội ngũ chuyên gia phân tích và quản lý rủi ro theo chuẩn mực quốc tế",
    ],
    cons: [
      "Biểu phí giao dịch online 0.15% chưa hấp dẫn bằng các sàn miễn phí hoặc 0.08%",
      "Giao diện app iKIS / KIS MTS còn mang phong cách Hàn Quốc khá đặc thù",
      "Dịch vụ chăm sóc khách hàng cá nhân ngoài giờ hành chính đôi khi phản hồi chậm",
    ],
    verdict:
      "KIS Việt Nam là bến đỗ sáng giá cho nhà đầu tư cần đòn bẩy tài chính ổn định với lãi suất margin rẻ từ nguồn vốn Hàn Quốc, cũng như những ai muốn giao dịch chứng quyền và phái sinh chuyên nghiệp.",
    ratingBreakdown: {
      fee: 4.2,
      app: 4.0,
      support: 4.0,
      stability: 4.5,
      products: 4.6,
    },
    userVoices: [
      {
        quote: "Room margin tại KIS rất thoải mái, vào sóng lớn không bao giờ lo hết hạn mức. Gói lãi suất 8.9% giúp tiết kiệm chi phí vay đáng kể.",
        source: "Diễn đàn Vietstock",
        type: "pro",
      },
      {
        quote: "App iKIS thiết kế hơi khác thói quen của người Việt, một số nút bấm và biểu đồ cần thời gian làm quen.",
        source: "Google Play — iKIS",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2010",
      hq: "Phòng 1801, Tầng 18, Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM",
      license: "Giấy phép KDCK số 118/GP-UBCK",
      website: "https://kisvn.vn",
      products: [
        "Môi giới cổ phiếu, trái phiếu, chứng chỉ quỹ",
        "Phát hành và môi giới chứng quyền có bảo đảm (CW)",
        "Cho vay ký quỹ Margin (lãi suất ưu đãi từ 8.9%)",
        "Giao dịch chứng khoán phái sinh",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng iKIS",
        desc: "Tải ứng dụng iKIS trên App Store hoặc Google Play và chọn Đăng ký mở tài khoản.",
      },
      {
        title: "Định danh điện tử eKYC",
        desc: "Chụp ảnh thẻ CCCD và thực hiện quay quét khuôn mặt theo chỉ dẫn trên app.",
      },
      {
        title: "Xác nhận gói dịch vụ và margin",
        desc: "Kiểm tra thông tin tài khoản và đăng ký gói lãi suất margin ưu đãi nếu có nhu cầu.",
      },
      {
        title: "Ký hợp đồng online và nạp tiền",
        desc: "Ký hợp đồng bằng mã OTP điện tử và chuyển tiền vào tài khoản để bắt đầu giao dịch.",
      },
    ],
  },

  fpts: {
    slug: "fpts",
    name: "Chứng khoán FPTS (FPT Securities)",
    shortName: "FPTS",
    rating: 4.4,
    best_for: "Nhà đầu tư theo trường phái phân tích cơ bản, coi trọng tính ổn định công nghệ",
    fee_rate: "0.10% – 0.15%",
    margin_rate: "12.0%/năm",
    app_rating: "4.1/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.fpts.com.vn",
    pros: [
      "Hậu thuẫn công nghệ mạnh mẽ và tính ổn định vượt trội từ Tập đoàn FPT",
      "Chính sách tách bạch phí tư vấn đầu tư minh bạch, không ép khách hàng quay vòng lệnh",
      "Hệ thống phân tích báo cáo tài chính và dữ liệu vĩ mô cực kỳ chất lượng",
      "Hệ thống cảnh báo và kiểm soát rủi ro tài khoản an toàn cao",
    ],
    cons: [
      "Giao diện phần mềm EzTrade tương đối cổ điển, hiển thị nhiều bảng biểu phức tạp",
      "Biểu phí giao dịch và lãi suất margin không thuộc nhóm rẻ nhất thị trường",
      "Ít có các chương trình khuyến mãi hay giảm lãi suất đòn bẩy ngắn hạn",
    ],
    verdict:
      "FPTS là bến đỗ an tâm cho nhà đầu tư tích lũy dài hạn, ưa chuộng sự ổn định tuyệt đối về hạ tầng công nghệ và dịch vụ tư vấn độc lập, minh bạch từ bệ phóng FPT.",
    ratingBreakdown: {
      fee: 4.0,
      app: 4.1,
      support: 4.4,
      stability: 4.8,
      products: 4.3,
    },
    userVoices: [
      {
        quote: "Hệ thống EzTrade cực kỳ ổn định, những ngày thị trường nghẽn lệnh kỷ lục vẫn đặt và khớp lệnh trơn tru.",
        source: "Diễn đàn F319",
        type: "pro",
      },
      {
        quote: "Giao diện EzMobile nhìn hơi cũ kỹ và ngợp số liệu đối với F0 mới học đầu tư.",
        source: "App Store — EzMobile",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2007",
      hq: "Số 52 đường Lạc Long Quân, Phường Bưởi, Quận Tây Hồ, Hà Nội",
      license: "Giấy phép KDCK số 59/UBCK-GP",
      website: "https://www.fpts.com.vn",
      products: [
        "Môi giới cổ phiếu, trái phiếu niêm yết",
        "Giao dịch ký quỹ Margin",
        "Cổng tư vấn đầu tư EzAdvisor",
        "Dịch vụ lưu ký và quản lý cổ đông",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng EzMobile",
        desc: "Tải app EzMobile trên App Store hoặc Google Play và chọn nút Mở tài khoản.",
      },
      {
        title: "Xác thực danh tính eKYC",
        desc: "Chụp ảnh CCCD 2 mặt và quét khuôn mặt theo chuẩn định danh điện tử eKYC.",
      },
      {
        title: "Thiết lập mật khẩu và phương thức OTP",
        desc: "Cài đặt mật khẩu giao dịch và kích hoạt phương thức Smart OTP bảo mật.",
      },
      {
        title: "Ký hợp đồng online và nạp tiền",
        desc: "Ký hợp đồng mở tài khoản qua mã OTP và chuyển tiền bắt đầu giao dịch trên EzTrade.",
      },
    ],
  },

  vcbs: {
    slug: "vcbs",
    name: "Chứng khoán VCBS (Vietcombank Securities)",
    shortName: "VCBS",
    rating: 4.4,
    best_for: "Khách hàng ngân hàng Vietcombank, nhà đầu tư lớn ưu tiên an toàn tuyệt đối",
    fee_rate: "0.15% – 0.20%",
    margin_rate: "11.5% – 12.0%/năm",
    app_rating: "4.1/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.vcbs.com.vn",
    pros: [
      "Hậu thuẫn 100% vốn từ Ngân hàng Vietcombank — định chế tài chính uy tín số 1 Việt Nam",
      "Tích hợp tính năng quản lý và chuyển tiền tức thì ngay trên app VCB Digibank",
      "Độ an toàn vốn và bảo mật tiêu chuẩn ngân hàng quốc doanh cao nhất",
      "Mạng lưới chi nhánh và phòng giao dịch hỗ trợ rộng khắp toàn quốc",
    ],
    cons: [
      "Biểu phí giao dịch 0.15% – 0.20% không phù hợp cho nhà đầu tư lướt sóng",
      "Gói lãi suất margin ít chương trình ưu đãi giảm sâu như các CTCK tư nhân",
      "Thủ tục hành chính mang tính chuẩn mực ngân hàng chặt chẽ",
    ],
    verdict:
      "VCBS là lựa chọn số một cho các nhà đầu tư tổ chức hoặc cá nhân có nguồn vốn lớn coi trọng sự an toàn tài sản, bảo mật cao cấp và sự tiện lợi tối đa khi liên kết trực tiếp với Vietcombank.",
    ratingBreakdown: {
      fee: 3.8,
      app: 4.1,
      support: 4.3,
      stability: 4.7,
      products: 4.4,
    },
    userVoices: [
      {
        quote: "Nạp rút tiền trực tiếp từ VCB Digibank sang tài khoản VCBS trong tích tắc. Tiền gửi ngân hàng nhà nước nên cực kỳ yên tâm.",
        source: "VCB Digibank User",
        type: "pro",
      },
      {
        quote: "Phí giao dịch hơi cao nếu lướt sóng ngắn hạn, dịch vụ môi giới tư vấn mang tính thận trọng.",
        source: "Cộng đồng Nhà đầu tư",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2002",
      hq: "Tầng 12 & 17, Tòa nhà Vietcombank, 198 Trần Quang Khải, Hoàn Kiếm, Hà Nội",
      license: "Giấy phép KDCK số 09/GPHĐKD",
      website: "https://www.vcbs.com.vn",
      products: [
        "Môi giới chứng khoán và chứng chỉ quỹ",
        "Giao dịch ký quỹ Margin",
        "Môi giới chứng khoán phái sinh",
        "Bảo lãnh phát hành và tư vấn tài chính doanh nghiệp",
      ],
    },
    accountSteps: [
      {
        title: "Mở tài khoản qua app VCBS hoặc VCB Digibank",
        desc: "Tải app VCBS Mobile hoặc truy cập mục Đầu tư trên ứng dụng VCB Digibank.",
      },
      {
        title: "Xác thực danh tính eKYC",
        desc: "Chụp ảnh hai mặt CCCD gắn chip và quét khuôn mặt theo quy trình sinh trắc học.",
      },
      {
        title: "Liên kết tài khoản Vietcombank",
        desc: "Đồng bộ tài khoản thanh toán VCB để nạp rút tiền chứng khoán hoàn toàn miễn phí.",
      },
      {
        title: "Kích hoạt và nạp tiền giao dịch",
        desc: "Ký hợp đồng trực tuyến và nạp tiền bắt đầu mua bán cổ phiếu trên VCBS Mobile.",
      },
    ],
  },

  hsc: {
    slug: "hsc",
    name: "Chứng khoán HSC (TP.HCM Securities)",
    shortName: "HSC",
    rating: 4.5,
    best_for: "Nhà đầu tư chuyên nghiệp, khách hàng tổ chức & giao dịch phái sinh",
    fee_rate: "0.15% – 0.20%",
    margin_rate: "11.5% – 12.0%/năm",
    app_rating: "4.3/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.hsc.com.vn",
    pros: [
      "Top đầu thị phần môi giới cho khối ngoại và các quỹ đầu tư tổ chức lớn",
      "Ứng dụng HSC ONE có tốc độ đặt lệnh nhanh và bộ công cụ phái sinh chuyên nghiệp",
      "Báo cáo phân tích doanh nghiệp và chiến lược thị trường chuẩn quốc tế",
      "Hệ thống quản trị rủi ro chặt chẽ và uy tín thương hiệu lâu đời từ 2003",
    ],
    cons: [
      "Phí giao dịch thuộc phân khúc cao cấp, không có chính sách zero-fee",
      "Chính sách margin tập trung vào nhóm cổ phiếu cơ bản vốn hóa lớn",
      "Định vị dịch vụ hướng nhiều về khách hàng lớn hơn là người mới F0",
    ],
    verdict:
      "HSC là bến đỗ đẳng cấp cho nhà đầu tư nghiêm túc và chuyên nghiệp, nơi giá trị nhận lại từ hệ thống giao dịch mượt mà, phân tích xuất sắc và tính chuyên nghiệp cao vượt xa bài toán chi phí phí lẻ.",
    ratingBreakdown: {
      fee: 3.7,
      app: 4.4,
      support: 4.5,
      stability: 4.7,
      products: 4.6,
    },
    userVoices: [
      {
        quote: "App HSC ONE giao diện cực kỳ mượt mà, đặt lệnh phái sinh không hề bị giật lag. Báo cáo phân tích của HSC chuẩn chỉnh số 1.",
        source: "App Store — HSC ONE",
        type: "pro",
      },
      {
        quote: "Phí 0.15% - 0.20% không phù hợp với tài khoản nhỏ thích lướt sóng liên tục.",
        source: "Diễn đàn Vietstock",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2003",
      hq: "Tầng 5 & 6, Tòa nhà AB Tower, 76 Lê Lai, Quận 1, TP.HCM",
      license: "Giấy phép KDCK số 11/GPHĐKD",
      website: "https://www.hsc.com.vn",
      products: [
        "Môi giới cổ phiếu, trái phiếu và chứng chỉ quỹ",
        "Môi giới chứng khoán phái sinh hàng đầu",
        "Cho vay giao dịch ký quỹ Margin",
        "Tư vấn đầu tư và tài chính doanh nghiệp",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng HSC ONE",
        desc: "Tải ứng dụng HSC ONE trên thiết bị di động và chọn Mở tài khoản trực tuyến.",
      },
      {
        title: "Định danh điện tử eKYC",
        desc: "Chụp ảnh CCCD và thực hiện xác thực khuôn mặt tự động qua camera.",
      },
      {
        title: "Lựa chọn gói dịch vụ tư vấn",
        desc: "Chọn hình thức tự giao dịch hoặc giao dịch cùng chuyên viên tư vấn đầu tư.",
      },
      {
        title: "Ký hợp đồng online và nạp tiền",
        desc: "Ký kết hợp đồng điện tử qua OTP và nạp tiền trải nghiệm nền tảng HSC ONE.",
      },
    ],
  },

  vietcap: {
    slug: "vietcap",
    name: "Chứng khoán Vietcap (VCI)",
    shortName: "Vietcap",
    rating: 4.5,
    best_for: "Nhà đầu tư giá trị, khách hàng tìm kiếm deal đầu tư độc quyền và IB hàng đầu",
    fee_rate: "0.15%",
    margin_rate: "11.5%/năm",
    app_rating: "4.2/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.vietcap.com.vn",
    pros: [
      "Ngân hàng đầu tư (IB) hàng đầu Việt Nam — bảo lãnh phát hành các thương vụ IPO tỷ đô",
      "Khối phân tích Vietcap Research có tầm ảnh hưởng lớn nhất đối với các quỹ ngoại",
      "Ứng dụng Vietcap Mobile hiện đại, giao diện trực quan và đặt lệnh nhanh",
      "Năng lực quản trị rủi ro và an toàn tài chính vượt trội",
    ],
    cons: [
      "Mức phí giao dịch 0.15% không theo xu hướng miễn phí để cạnh tranh số lượng",
      "Dịch vụ khách hàng tập trung mạnh cho nhóm khách hàng VIP và tổ chức",
      "Số lượng chi nhánh phòng giao dịch vật lý không nhiều",
    ],
    verdict:
      "Vietcap là sự lựa chọn chất lượng cao cho các nhà đầu tư dài hạn muốn tiếp cận tầm nhìn phân tích của các quỹ tổ chức lớn và hưởng lợi từ vị thế dẫn đầu trong các thương vụ IPO đình đám.",
    ratingBreakdown: {
      fee: 3.9,
      app: 4.3,
      support: 4.4,
      stability: 4.6,
      products: 4.5,
    },
    userVoices: [
      {
        quote: "Báo cáo Vietcap Research định giá doanh nghiệp rất sâu, nhiều góc nhìn độc quyền mà các bên khác không có.",
        source: "Cộng đồng Đầu tư Giá trị",
        type: "pro",
      },
      {
        quote: "Phí giao dịch tiêu chuẩn không rẻ, chủ yếu thích hợp cho các nhà đầu tư nắm giữ trung và dài hạn.",
        source: "Google Play — Vietcap Mobile",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2007",
      hq: "Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều, Quận 1, TP.HCM",
      license: "Giấy phép KDCK số 68/UBCK-GP",
      website: "https://www.vietcap.com.vn",
      products: [
        "Môi giới chứng khoán cá nhân và tổ chức",
        "Ngân hàng đầu tư (Tư vấn M&A, IPO)",
        "Cho vay ký quỹ Margin",
        "Môi giới phái sinh và chứng quyền",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng Vietcap Mobile",
        desc: "Tải app Vietcap Mobile trên App Store hoặc Google Play và chọn Đăng ký tài khoản.",
      },
      {
        title: "Định danh eKYC trực tuyến",
        desc: "Chụp ảnh thẻ CCCD hai mặt và quét nhận diện khuôn mặt tự động.",
      },
      {
        title: "Hoàn tất hợp đồng điện tử",
        desc: "Xác nhận điều khoản hợp đồng và nhập mã OTP gửi về số điện thoại đăng ký.",
      },
      {
        title: "Nạp tiền và bắt đầu đầu tư",
        desc: "Chuyển tiền vào tài khoản định danh Vietcap và bắt đầu thực hiện lệnh giao dịch.",
      },
    ],
  },

  kb: {
    slug: "kb",
    name: "Chứng khoán KB Việt Nam (KBSV)",
    shortName: "KBSV",
    rating: 4.4,
    best_for: "Nhà đầu tư cá nhân tự học với app KB Buddy, cần đòn bẩy margin vốn ngoại Hàn Quốc",
    fee_rate: "0.10% – 0.15%",
    margin_rate: "Từ 9.0%/năm (ưu đãi) – 11.5%/năm",
    app_rating: "4.3/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://www.kbsec.com.vn",
    pros: [
      "Hậu thuẫn bởi Tập đoàn Tài chính KB (Hàn Quốc) — tập đoàn tài chính số 1 xứ kim chi",
      "Ứng dụng KB Buddy thiết kế riêng cho F0 với tính năng chấm điểm cổ phiếu KB Rating",
      "Gói vay margin ưu đãi từ nguồn vốn ngoại dồi dào, lãi suất chỉ từ 9.0%/năm",
      "Quy trình mở tài khoản eKYC mượt mà, tích hợp nhiều nội dung giáo dục đầu tư",
    ],
    cons: [
      "Khách hàng phải cài đặt 2 ứng dụng riêng biệt (KB Buddy cho người mới và KB Trade cho chuyên nghiệp)",
      "Mức phí giao dịch có môi giới vẫn ở mức 0.15% – 0.25%",
      "Thị phần môi giới còn đứng sau các công ty top đầu nội địa",
    ],
    verdict:
      "KBSV là lựa chọn rất đáng giá cho người mới bắt đầu nhờ app KB Buddy trực quan, kết hợp với lợi thế nguồn vốn margin giá rẻ dồi dào từ tập đoàn tài chính KB Hàn Quốc.",
    ratingBreakdown: {
      fee: 4.4,
      app: 4.4,
      support: 4.2,
      stability: 4.5,
      products: 4.3,
    },
    userVoices: [
      {
        quote: "App KB Buddy giao diện cực kỳ đẹp và dễ hiểu cho người mới. Tính năng chấm điểm KB Rating tham khảo rất tiện.",
        source: "App Store — KB Buddy",
        type: "pro",
      },
      {
        quote: "Phải chuyển đổi giữa 2 app KB Buddy và KB Trade khi cần dùng tính năng nâng cao hơi bất tiện một chút.",
        source: "Google Play — KB Buddy",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2008",
      hq: "Tầng 16 & 17, Tòa nhà TNR Tower, 54A Nguyễn Chí Thanh, Đống Đa, Hà Nội",
      license: "Giấy phép KDCK số 87/UBCK-GP",
      website: "https://www.kbsec.com.vn",
      products: [
        "Môi giới chứng khoán cơ sở và phái sinh",
        "Cho vay giao dịch ký quỹ Margin",
        "Nền tảng KB Buddy & KB Trade",
        "Dịch vụ ngân hàng đầu tư",
      ],
    },
    accountSteps: [
      {
        title: "Tải ứng dụng KB Buddy",
        desc: "Tải app KB Buddy trên App Store hoặc Google Play và chọn nút Mở tài khoản eKYC.",
      },
      {
        title: "Chụp ảnh CCCD và quét khuôn mặt",
        desc: "Chụp ảnh 2 mặt CCCD và quét khuôn mặt theo hướng dẫn trực quan trên app.",
      },
      {
        title: "Thiết lập tài khoản và mã PIN",
        desc: "Tạo mật khẩu đăng nhập và mã PIN giao dịch bảo mật.",
      },
      {
        title: "Ký hợp đồng và nạp tiền giao dịch",
        desc: "Ký kết hợp đồng điện tử qua OTP và nạp tiền bắt đầu giao dịch nhận ưu đãi.",
      },
    ],
  },

  "mirae-asset": {
    slug: "mirae-asset",
    name: "Chứng khoán Mirae Asset Việt Nam (MAS)",
    shortName: "Mirae Asset",
    rating: 4.4,
    best_for: "Nhà đầu tư sử dụng đòn bẩy margin quy mô lớn, vốn ngoại ổn định",
    fee_rate: "0.15% (online)",
    margin_rate: "Từ 8.5%/năm (ưu đãi) – 11.0%/năm",
    app_rating: "4.1/5",
    min_deposit: "Không yêu cầu",
    ctaUrl: "https://masvn.com",
    pros: [
      "Quy mô vốn điều lệ hàng đầu thị trường nhờ dòng vốn từ Tập đoàn Mirae Asset (Hàn Quốc)",
      "Nguồn cung margin cực kỳ dồi dào, hạn mức lớn và lãi suất ưu đãi chỉ từ 8.5%/năm",
      "Hệ thống vận hành chuyên nghiệp theo chuẩn quốc tế, mạng lưới chi nhánh rộng",
      "Nhiều gói đòn bẩy tài chính linh hoạt phù hợp với từng khẩu vị rủi ro",
    ],
    cons: [
      "Phí giao dịch online 0.15% chưa cạnh tranh với các sàn miễn phí phí giao dịch",
      "Giao diện ứng dụng My Asset đôi khi chưa tối ưu tốt cho người dùng chuộng sự tối giản",
      "Quy trình xử lý một số thủ tục tài khoản còn khá nhiều bước xác thực",
    ],
    verdict:
      "Mirae Asset là điểm tựa vững chắc cho các nhà đầu tư coi trọng tiềm lực tài chính vốn ngoại, cần hạn mức vay margin lớn và lãi suất ưu đãi cạnh tranh mà không lo bị hạn chế room.",
    ratingBreakdown: {
      fee: 4.2,
      app: 4.0,
      support: 4.2,
      stability: 4.6,
      products: 4.5,
    },
    userVoices: [
      {
        quote: "Room margin của Mirae Asset phải nói là vô địch, thị trường sôi động cỡ nào cũng không sợ hết hạn mức vay.",
        source: "Diễn đàn F247",
        type: "pro",
      },
      {
        quote: "App My Asset dùng ổn nhưng giao diện hơi nhiều chữ số, người mới cần thời gian làm quen.",
        source: "App Store — My Asset",
        type: "con",
      },
    ],
    companyInfo: {
      founded: "2007",
      hq: "Tòa nhà Le Meridien, 3C Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP.HCM",
      license: "Giấy phép KDCK số 62/UBCK-GP",
      website: "https://masvn.com",
      products: [
        "Môi giới cổ phiếu, trái phiếu, phái sinh",
        "Cho vay ký quỹ Margin quy mô lớn",
        "Chứng quyền có bảo đảm (CW)",
        "Dịch vụ tư vấn tài chính doanh nghiệp",
      ],
    },
    accountSteps: [
      {
        title: "Tải app My Asset",
        desc: "Tải ứng dụng My Asset từ App Store hoặc Google Play và chọn Mở tài khoản.",
      },
      {
        title: "Định danh điện tử eKYC",
        desc: "Chụp 2 mặt CCCD và hoàn tất nhận diện khuôn mặt sinh trắc học.",
      },
      {
        title: "Đăng ký gói dịch vụ và Margin",
        desc: "Lựa chọn các gói margin ưu đãi theo nhu cầu sử dụng đòn bẩy.",
      },
      {
        title: "Ký hợp đồng online và nạp tiền",
        desc: "Nhận thông tin tài khoản qua email, ký hợp đồng điện tử và bắt đầu giao dịch.",
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
  const merged = { ...central, ...fallback, ...articleBroker } as BrokerProfile;
  // Financial facts come from the sourced catalog, never stale article overrides.
  // Retain legacy editorial fields until their individual reviews are revised.
  return {
    ...merged,
    fee_rate: formatPolicy(getPolicy(articleBroker.slug, 'stocks')),
    margin_rate: formatPolicy(getPolicy(articleBroker.slug, 'margin')),
    app_rating: 'Chưa xác minh',
    ctaUrl: getOutboundLink(articleBroker.slug)?.url ?? merged.ctaUrl,
    userVoices: undefined,
  };
}
