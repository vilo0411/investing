# Phase 3: New EEAT Components - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 xây 6 component EEAT mới — Key Takeaways, Citation/Fact-check box, AuthorBox v2, Breadcrumb navigation, Disclaimer/risk-disclosure, và Comparison table — như component Astro độc lập, token-driven (dùng design tokens từ Phase 1), render đúng với cả data đầy và rỗng/fallback. Phase này KHÔNG wire các component này vào ArticleLayout/trang thật (Phase 4), KHÔNG build trang `/author/[slug]` (Phase 4), KHÔNG backfill dữ liệu cho 21 bài viết (EEAT-10, Phase 4). Việc parse/extract `## Key takeaways` từ markdown body cũng KHÔNG thuộc Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Key Takeaways component
- **D-01:** Component chỉ nhận props (`items: string[]`) — không tự parse `## Key takeaways` từ markdown body. Việc extract (remark plugin hoặc cách khác) là việc của Phase 4/ARTL-01. Phase 3 chỉ test component với `items` đầy và `items = []`.
- **D-02:** Visual style: box viền màu (border-left accent, theo pattern AuthorBox hiện có với `border-left: 4px solid var(--color-brand-900)`, nền `var(--surface)`), title "Tóm tắt nội dung chính" hoặc tương đương, mỗi item có icon checklist (✓) phía trước.
- **D-03:** Empty state (`items = []`): component trả về `null` — không render gì, không reserve placeholder. (Lưu ý: điều này khác nhẹ với cách diễn đạt "reserved space to avoid layout shift" trong ROADMAP Success Criteria #1 của Phase 3 — planner nên xác nhận cách diễn giải "reserved space" là tránh CLS ở mức tổng thể trang khi backfill Phase 4 thêm component vào, không phải placeholder rỗng hiển thị ở Phase 3.)

### Citation/Fact-check box
- **D-04:** Component nhận cả 2 props optional: `sources?: string[]` (legacy, 21 bài hiện có) và `citations?: { title, url?, publisher?, date? }[]` (mới, Phase 2). Khi chỉ có `sources`, render mỗi string như một dòng trong danh sách nguồn tham khảo (không link/publisher/date). Khi có `citations`, render đầy đủ title/publisher/date/link nếu có.
- **D-05:** `factCheckedDate` prop optional. Nếu có giá trị → hiển thị "Kiểm tra nguồn lần cuối: {factCheckedDate}". Nếu rỗng (mặc định cho 21 bài hiện tại) → fallback hiển thị "Cập nhật lần cuối: {updatedDate}" (component cần nhận thêm `updatedDate` prop cho fallback này).
- **D-06:** Style/vị trí: box riêng theo pattern AuthorBox hiện có (border-left màu accent + `var(--surface)` + radius), không phải dải ngang mỏng. Đặt cuối content, trước AuthorBox v2 — phù hợp thứ tự EEAT của Phase 4 (Content → Citation box → AuthorBox v2).

### AuthorBox v2
- **D-07:** Thêm hiển thị `credentials: string[]` và `experience: string` (cả hai đã có trong `src/data/authors.ts` từ Phase 2; `credentials` hiện đang `[]`). Đổi link "Xem hồ sơ" từ `/about/` sang `/author/{slug}`.
- **D-08:** Khi `credentials = []` (trạng thái hiện tại) — ẩn hoàn toàn khu vực/heading credentials, không hiển thị fallback text. Layout co gọn tự nhiên.
- **D-09:** Link "Xem hồ sơ" trỏ thẳng tới `/author/{slug}` theo thiết kế cuối cùng, dù trang đó chưa tồn tại (Phase 4 mới build) — chấp nhận 404 tạm thời trong giai đoạn Phase 3 (component-isolation, chưa wire vào layout thật/deploy).
- Giữ nguyên các phần đã có ở v1: avatar/initial, name, role, bio, expertise tags — chỉ bổ sung thêm, không redesign toàn bộ layout.

### Comparison table
- **D-10:** Component Astro với structured props (ví dụ `<ComparisonTable columns={[...]} rows={[...]} />`), không phải CSS style cho markdown table thô.
  - **⚠ Research flag cho `gsd-phase-researcher`:** Bài viết hiện tại dùng content collection `type: "content"` (`.md`), không phải MDX — cần xác nhận liệu component Astro có thể được dùng/render trong nội dung `.md` của content collection hiện tại, hoặc liệu cần đổi sang MDX cho các bài có comparison table (ảnh hưởng schema/build, cần research trước khi plan).
- **D-11:** Bảng rộng trên mobile: bọc trong wrapper `overflow-x: auto`, giữ cấu trúc `<table>` nguyên vẹn (không stack thành card).
- **D-12:** Visual style: header row nổi bật với nền `var(--color-brand-900)`/chữ trắng (đồng bộ màu brand), kèm zebra striping cho các row — phong cách rõ ràng, data-heavy phù hợp so sánh sản phẩm tài chính.

### Claude's Discretion
- Breadcrumb navigation và Disclaimer/risk-disclosure component không được thảo luận sâu — implement theo design tokens hiện có (Phase 1), markup/style nhất quán với AuthorBox/Citation box pattern (border/surface/radius). Breadcrumb cần hoạt động cho cả ngữ cảnh article và category page (theo Success Criteria #4). Nội dung text cụ thể cho Disclaimer (wording rủi ro tài chính) — Claude soạn nội dung phù hợp YMYL theo `.antigravity/rules/content-anti-ai.md`, user review sau.
- Tên prop chính xác, cấu trúc file (`src/components/*.astro`), và chi tiết CSS — theo conventions hiện có trong codebase (scoped `<style>`, var(--space-*) tokens).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints (giữ Astro, YMYL caution, tiếng Việt, giữ schema tương thích)
- `.planning/REQUIREMENTS.md` — EEAT-03, EEAT-04, EEAT-05, EEAT-07, EEAT-08, EEAT-09 (yêu cầu chi tiết của Phase 3)
- `.planning/ROADMAP.md` §Phase 3 — Goal và Success Criteria (5 success criteria, đặc biệt #1 về reserved space/CLS)

### Codebase Maps
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/codebase/STRUCTURE.md`

### Prior Phase Context (data model & tokens this phase builds on)
- `.planning/phases/02-eeat-data-model-schema-extensions/02-CONTEXT.md` — schema cho `citations`, `keyTakeaways`, `factCheckedDate`, và `src/data/authors.ts` (author object với `credentials`, `experience`, `slug`)
- `.planning/phases/01-design-token-foundation/01-CONTEXT.md` — design token system (color/typography/spacing) các component mới phải dùng

### Existing Schema & Data Source
- `src/content.config.ts` — schema hiện tại: `sources: string[]`, `citations: object[]`, `keyTakeaways: string[]`, `factCheckedDate?: Date`, `updatedDate: Date`
- `src/data/authors.ts` — `author.credentials` (hiện `[]`), `author.experience`, `author.slug`
- `src/components/AuthorBox.astro` — pattern visual hiện tại (border-left, avatar initial, expertise tags) — AuthorBox v2 mở rộng từ đây

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/AuthorBox.astro` — pattern box (border-left + `var(--surface)` + radius + avatar initial) tái sử dụng cho Citation box và Key Takeaways
- `src/data/authors.ts` (`author.credentials`, `author.experience`, `author.slug`) — đã sẵn sàng cho AuthorBox v2, chỉ thiếu UI hiển thị
- `src/content.config.ts` (`citations`, `keyTakeaways`, `factCheckedDate`) — schema đã có từ Phase 2, Phase 3 chỉ cần component tiêu thụ props tương ứng

### Established Patterns
- Scoped `<style>` block ở cuối file `.astro`, dùng design tokens (`var(--space-*)`, `var(--color-brand-900)`, `var(--surface)`, `var(--line)`, `var(--radius-md)`)
- `interface Props { ... }` trong frontmatter Astro component
- Component không tự fetch/parse content — nhận data qua props (theo D-01, D-04, D-07)

### Integration Points
- `src/layouts/ArticleLayout.astro` — đã có breadcrumb dưới dạng JSON-LD (BreadcrumbList schema), Phase 3 build breadcrumb VISUAL component riêng (không trùng/conflict với JSON-LD hiện có, JSON-LD vẫn giữ ở Phase 4 wiring)
- 21 bài viết `src/content/articles/*.md` đều có `sources: string[]` và section `## Key takeaways` — informs D-01/D-04 fallback design cho Citation box và Key Takeaways

</code_context>

<specifics>
## Specific Ideas

- Key Takeaways: phong cách giống "Key Takeaways" box của Investopedia — box viền màu + icon checklist (✓).
- Comparison table: header nổi bật màu brand (`var(--color-brand-900)`) + zebra rows, dùng cho bài so sánh sản phẩm tài chính (ví dụ: so sánh các loại quỹ ETF, tài khoản chứng khoán).
- AuthorBox v2: bổ sung thêm thông tin (credentials, experience), không redesign toàn bộ — giữ avatar/initial + bio + expertise hiện có.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Việc wire components vào ArticleLayout, build `/author/[slug]`, JSON-LD đầy đủ từ `authors.ts`, và backfill 21 bài (EEAT-10) đã thuộc Phase 4 theo roadmap, không phải deferred mới.

</deferred>

---

*Phase: 3-New EEAT Components*
*Context gathered: 2026-06-12*
