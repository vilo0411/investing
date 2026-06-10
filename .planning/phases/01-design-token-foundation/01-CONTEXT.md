# Phase 1: Design Token Foundation - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 làm lại toàn bộ bộ design token (color, typography, spacing, radius/shadow, motion) trong `src/styles/tokens/*.css`, import vào `global.css`, mà KHÔNG thay đổi markup/component nào. Mọi component cũ phải tiếp tục render đúng nhờ alias tên biến cũ. Kết quả: site chuyển sang nhận diện navy/finance mới, trang bài viết có typography đọc dài tối ưu (~1.7 line-height, ~65ch), font mới hiển thị đúng dấu tiếng Việt, và toàn bộ route được audit không vỡ layout.

</domain>

<decisions>
## Implementation Decisions

### Color Palette / Brand Direction
- **D-01:** Tone màu brand chính chuyển từ xanh lá hiện tại (`#006b2c`) sang **navy/blue đậm** — chuẩn ngành tài chính (kiểu Investopedia/NerdWallet).
- **D-02:** Neutral (text/background) chuyển từ xám/đen trung tính sang **neutral ám nhẹ theo navy** (tinted gray) để đồng bộ tổng thể, cảm giác cao cấp hơn.
- **D-03:** Mỗi màu trong palette mới có **thang đầy đủ 50-900** (giống Tailwind scale) thay vì 3-4 sắc độ như hiện tại.
- **D-04:** Thêm **accent màu vàng/gold** cho tín hiệu "premium/trust" (vd. badge "Editor's pick", highlight đặc biệt) — bổ sung bên cạnh navy chính, không thay thế hoàn toàn xanh lá hiện có (xanh lá có thể giữ làm accent phụ thứ cấp nếu cần, do team quyết khi research/plan).

### Typography / Font Pairing
- **D-05:** Đổi font pairing từ DM Serif Display + DM Sans sang **Source Serif 4 (heading) + Inter (body/UI)** — cảm giác "editorial/báo chí tài chính" hơn, cả hai có trên Google Fonts với Vietnamese subset.
- **D-06:** Nội dung bài viết (article body) dùng **sans-serif (Inter)**, đồng bộ với UI — không dùng serif cho long-form body.
- **D-07:** Type scale dùng **fluid scale với `clamp()`** cho heading/body — tránh nhiều breakpoint-specific override, hỗ trợ audit toàn site (DSGN-05).
- **D-08:** Font-weight tối giản: chỉ **Regular (400), Medium (500), Bold (700)** — giảm số font file tải (tốt cho CWV/QASE-02).
- **D-08a:** Researcher cần xác minh thực tế Vietnamese glyph coverage của Source Serif 4 + Inter (đặc biệt dấu thanh điệu ở các weight khác nhau) trước khi planner khóa cứng lựa chọn — nếu có vấn đề, đề xuất font thay thế gần nhất (vd. Lora/IBM Plex Sans).

### Token Architecture & Scale
- **D-09:** File token mới chia theo nhóm trong `src/styles/tokens/`: `colors.css`, `typography.css`, `spacing.css`, `effects.css` (effects = radius/shadow/transition/motion).
- **D-10:** Alias tên biến cũ (`--brand`, `--surface`, `--line`, `--muted`, `--font-serif`...) được tách riêng vào file `aliases-legacy.css` — map tên cũ → token mới, giúp dễ migrate/xóa dần sau này (DSGN-02).
- **D-11:** Spacing scale (`--space-1` đến `--space-24`, bội số 0.25rem) **giữ nguyên** — không cần alias riêng cho spacing vì tên biến không đổi.
- **D-12:** Color tokens tổ chức **2 lớp**: primitive (vd. `--color-navy-50..900`, `--color-gold-50..900`) chứa giá trị thực; semantic (`--brand`, `--text`, `--surface`, `--accent`...) trỏ về primitive — chuẩn design token, dễ đổi theme sau này.

### Motion & Elevation
- **D-13:** Shadow giữ **trung tính** (rgba đen/xám) như hiện tại — không chuyển sang tinted-navy shadow. Giữ 3 mức sm/md/lg.
- **D-14:** Mở rộng `--transition` thành **3 token**: `--transition-fast` (~100ms), `--transition-base` (~200ms), `--transition-slow` (~350ms).
- **D-15:** Hover/interactive states **chỉ đổi màu/underline** — không thêm hiệu ứng lift/scale mới, giữ đơn giản và an toàn cho CLS/CWV (QASE-02).

### Claude's Discretion
- Giá trị cụ thể của các shade trong thang 50-900 (navy, gold, neutral) — researcher/planner chọn giá trị hex cụ thể đảm bảo contrast AA cho text trên các nền liên quan.
- Vị trí chính xác của xanh lá hiện tại trong palette mới (giữ làm accent phụ thứ cấp hay loại bỏ hoàn toàn) — quyết định khi thấy toàn cảnh palette mới.
- Giá trị `clamp()` cụ thể cho từng bước type scale.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints (giữ Astro, giữ schema tương thích, YMYL caution, tiếng Việt)
- `.planning/REQUIREMENTS.md` — DSGN-01 đến DSGN-05 (yêu cầu chi tiết của Phase 1)
- `.planning/ROADMAP.md` §Phase 1 — Goal và Success Criteria của phase này

### Codebase Maps
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md` — quy ước CSS custom properties, scoped styles
- `.planning/codebase/STRUCTURE.md`

### Existing Token Source
- `src/styles/global.css` — toàn bộ token hiện tại cần thay thế/alias (color, typography, spacing, radius, shadow, transition, layout)

No other external specs/ADRs referenced during this discussion.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/global.css` :root block (lines ~1-70) — danh sách đầy đủ token hiện tại cần map sang alias mới
- Google Fonts setup hiện có cho DM Serif Display + DM Sans (trong `BaseLayout.astro`) — pattern tương tự sẽ dùng cho Source Serif 4 + Inter

### Established Patterns
- CSS custom properties + scoped `<style>` blocks trong từng `.astro` component — token mới phải tương thích hoàn toàn với pattern này
- Semantic alias pattern đã tồn tại (`--brand: var(--color-brand-900)`) — D-12 tiếp nối pattern này, chỉ mở rộng thang màu

### Integration Points
- `global.css` sẽ `@import` các file token mới từ `src/styles/tokens/`
- Mọi `.astro` component dùng `var(--brand)`, `var(--surface)`, etc. phải tiếp tục resolve đúng qua `aliases-legacy.css`

</code_context>

<specifics>
## Specific Ideas

- Tham khảo phong cách Investopedia/NerdWallet cho tone navy + xanh lá/gold accent (đã ghi trong PROJECT.md)
- Font pairing cụ thể: Source Serif 4 (heading) + Inter (body/UI), cả hai từ Google Fonts
- Gold/vàng accent dùng cho tín hiệu "premium/trust" (badge, highlight đặc biệt) — ý tưởng mới phát sinh trong discussion này

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Design Token Foundation*
*Context gathered: 2026-06-10*
