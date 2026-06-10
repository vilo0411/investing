# Phase 1: Design Token Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-10
**Phase:** 1-Design Token Foundation
**Areas discussed:** Color palette / brand direction, Typography / font pairing, Token architecture & scale, Motion & elevation tone

---

## Color Palette / Brand Direction

| Option | Description | Selected |
|--------|-------------|----------|
| Navy/blue đậm (chuẩn finance) | Xanh navy/indigo đậm — phổ biến với site tài chính uy tín | ✓ |
| Xanh lá đậm hơn, giữ identity | Giữ tinh thần xanh lá hiện tại nhưng đậm/trầm hơn | |
| Kết hợp navy chính + xanh lá accent | Navy/charcoal chủ đạo, xanh lá làm accent | |

**User's choice:** Navy/blue đậm (chuẩn finance)

| Option (Neutrals) | Description | Selected |
|--------|-------------|----------|
| Neutral ám nhẹ theo brand | Xám/đen ám nhẹ theo navy mới | ✓ |
| Giữ neutral trung tính | Giữ đen/xám trung tính hiện tại | |

**User's choice:** Neutral ám nhẹ theo brand (Recommended)

| Option (Shade depth) | Description | Selected |
|--------|-------------|----------|
| Thang đầy đủ (50-900, ~9-10 shades) | Giống Tailwind scale, linh hoạt | ✓ |
| Thang rút gọn (3-4 shades/màu) | Giữ quy mô như hiện tại | |

**User's choice:** Thang đầy đủ (50-900, ~9-10 shades)

| Option (Accent) | Description | Selected |
|--------|-------------|----------|
| Giữ accent xanh lá (điều chỉnh sắc độ) | Giữ family màu xanh lá, điều chỉnh hài hòa | |
| Thêm accent vàng/gold cho "premium/trust" | Gold cho badge, highlight đặc biệt | ✓ |
| Không cần accent phụ | Chỉ brand + neutral | |

**User's choice:** Thêm accent vàng/gold cho tín hiệu "premium/trust"
**Notes:** Vị trí chính xác của xanh lá hiện tại trong palette mới (giữ làm accent phụ thứ cấp hay loại bỏ) để Claude quyết định khi thấy toàn cảnh palette mới.

---

## Typography / Font Pairing

| Option | Description | Selected |
|--------|-------------|----------|
| Giữ DM Serif Display + DM Sans | Cặp font hiện tại, đã hỗ trợ tiếng Việt, miễn phí | |
| Đổi sang serif editorial uy tín hơn + sans hiện đại | Cảm giác "báo chí tài chính" hơn | ✓ |
| Giữ DM Sans cho body, đổi heading | Giữ DM Sans, chỉ đổi heading font | |

**User's choice:** Đổi sang serif editorial uy tín hơn + sans hiện đại

| Option (Article font) | Description | Selected |
|--------|-------------|----------|
| Sans-serif (giống UI) | Đồng bộ với UI, hiện đại | ✓ |
| Serif cho body | Cảm giác editorial/báo chí | |

**User's choice:** Sans-serif (giống UI)

| Option (Type scale) | Description | Selected |
|--------|-------------|----------|
| Fluid scale với clamp() | Scale mượt theo viewport | ✓ |
| Fixed steps theo breakpoint | Size cố định theo breakpoint | |

**User's choice:** Fluid scale với clamp() (Recommended)

| Option (Font weights) | Description | Selected |
|--------|-------------|----------|
| Tối giản: 400/500/700 | Đủ dùng, giảm số font file | ✓ |
| Mở rộng: thêm 300/600 | Linh hoạt hơn, tăng số file | |

**User's choice:** Tối giản: Regular (400), Medium (500), Bold (700)

| Option (Font choice) | Description | Selected |
|--------|-------------|----------|
| Source Serif 4 + Inter | Cặp phổ biến, hỗ trợ Vietnamese subset đầy đủ | ✓ |
| Lora + IBM Plex Sans | Cảm giác ấm hơn, vẫn chuyên nghiệp | |
| Để Claude chọn khi research | Researcher kiểm tra glyph coverage thực tế | |

**User's choice:** Source Serif 4 + Inter
**Notes:** Researcher cần xác minh Vietnamese glyph coverage thực tế trước khi planner khóa cứng (D-08a).

---

## Token Architecture & Scale

| Option (Token files) | Description | Selected |
|--------|-------------|----------|
| Chia theo nhóm: colors/typography/spacing/effects.css | 4 file rõ ràng theo loại token | ✓ |
| Một file duy nhất tokens.css | Đơn giản nhưng dài | |

**User's choice:** Chia theo nhóm: colors.css, typography.css, spacing.css, effects.css (Recommended)

| Option (Alias location) | Description | Selected |
|--------|-------------|----------|
| File riêng aliases-legacy.css | Tách map tên cũ → token mới | ✓ |
| Khai báo alias ngay trong file token tương ứng | Mix trực tiếp | |

**User's choice:** File riêng aliases-legacy.css (Recommended)

| Option (Spacing scale) | Description | Selected |
|--------|-------------|----------|
| Giữ nguyên scale hiện tại | Thang spacing hiện tại đã hợp lý | ✓ |
| Mở rộng thêm các bước nhỏ | Thêm granularity | |

**User's choice:** Giữ nguyên scale hiện tại

| Option (Color layers) | Description | Selected |
|--------|-------------|----------|
| 2 lớp: primitive + semantic | Chuẩn design token, dễ đổi theme | ✓ |
| 1 lớp: chỉ semantic | Đơn giản hơn nhưng khó tổ chức thang 50-900 | |

**User's choice:** 2 lớp: primitive + semantic (Recommended)

---

## Motion & Elevation

| Option (Shadow style) | Description | Selected |
|--------|-------------|----------|
| Giữ shadow trung tính như hiện tại | An toàn, không xung đột | ✓ |
| Shadow ám navy nhẹ | Đồng bộ với palette mới | |

**User's choice:** Giữ shadow trung tính như hiện tại (rgba đen/xám)

| Option (Motion tokens) | Description | Selected |
|--------|-------------|----------|
| Thêm 2-3 token: fast/base/slow | Linh hoạt cho hover, modal, page transition | ✓ |
| Giữ 1 token --transition duy nhất | Tối giản | |

**User's choice:** Thêm 2-3 token: fast/base/slow

| Option (Hover effects) | Description | Selected |
|--------|-------------|----------|
| Chỉ đổi màu/underline | An toàn, không ảnh hưởng CLS | ✓ |
| Thêm subtle lift cho card | Hiện đại, tương tác hơn | |

**User's choice:** Chỉ đổi màu/underline (giữ đơn giản)

---

## Claude's Discretion

- Giá trị hex cụ thể của các shade trong thang 50-900 (navy, gold, neutral) — đảm bảo contrast AA.
- Vị trí của xanh lá hiện tại trong palette mới (accent phụ thứ cấp hay loại bỏ).
- Giá trị `clamp()` cụ thể cho từng bước type scale.

## Deferred Ideas

None — discussion stayed within phase scope.
