# Phase 2: EEAT Data Model & Schema Extensions - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 mở rộng `src/content.config.ts` với các field tùy chọn mới (`citations`, `factCheckedDate`, `keyTakeaways`) mà 21 bài viết hiện có không cần cung cấp để build thành công, và tạo `src/data/authors.ts` làm nguồn dữ liệu tác giả duy nhất. Phase này cũng refactor nhẹ `AuthorBox.astro` và các nơi đang dùng `site.author`/`site.authorProfile` để đọc từ `authors.ts`, tránh duplication. Không tạo component mới (Key Takeaways, Citation box — Phase 3), không backfill dữ liệu cho 21 bài viết (Phase 4, EEAT-10), không build trang `/author/[slug]` (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Author Data Model (`src/data/authors.ts`)
- **D-01:** Website cá nhân — chỉ có **một tác giả duy nhất** (Nguyễn Viết Lộc). `authors.ts` export một single author object (không cần array/multi-author scaffold).
- **D-02:** Author object dùng **bộ field đầy đủ cho EEAT**: `name`, `slug`, `role`, `bio`, `credentials` (string[]), `experience` (string mô tả số năm/nền tảng), `expertise` (string[]), `avatar` (optional path), `socialLinks` (optional: linkedin/twitter/email). Đủ chi tiết để Phase 3 (AuthorBox v2) và Phase 4 (trang `/author/[slug]`, JSON-LD Person) không cần thêm field mới vào `authors.ts`.

### Schema Extensions (`src/content.config.ts`)
- **D-03:** `citations` là field mới, **structured objects**: `citations: z.array(z.object({ title: z.string(), url: z.string().optional(), publisher: z.string().optional(), date: z.string().optional() })).default([])`. Field `sources` (string[]) hiện tại **giữ nguyên không đổi** — `citations` là field bổ sung, không thay thế.
- **D-04:** `keyTakeaways` là field mới optional: `keyTakeaways: z.array(z.string()).default([])`. Bài cũ không có field này (mặc định `[]`) — component ở Phase 3 sẽ fallback đọc section markdown `## Key takeaways` trong body khi frontmatter rỗng. Bài mới có thể set field trực tiếp.
- **D-05:** `factCheckedDate` là field mới optional: `factCheckedDate: z.coerce.date().optional()`. **Không thêm `reviewedBy`** — vì chỉ có một tác giả duy nhất, không cần trường reviewer riêng cho YMYL solo blog.

### Refactor Scope
- **D-06:** Phase 2 refactor `AuthorBox.astro` và mọi nơi đang dùng `site.author` / `site.authorProfile` (bao gồm `ArticleLayout.astro`, `BaseLayout.astro` JSON-LD) để đọc dữ liệu từ `src/data/authors.ts` thay vì `src/data/site.ts`. Mục tiêu: single source of truth ngay từ Phase 2, tránh duplication — Phase 3 (AuthorBox v2) và Phase 4 (trang profile, JSON-LD đầy đủ) build tiếp trên nền này mà không cần sửa lại nguồn dữ liệu.
- Có thể giữ `site.author` (string) trong `site.ts` như một re-export/alias từ `authors.ts` nếu cần tương thích chỗ khác, nhưng giá trị phải bắt nguồn từ `authors.ts` (không duplicate).

### Claude's Discretion
- Giá trị cụ thể cho `credentials`, `experience`, `avatar`, `socialLinks` của tác giả (placeholder hợp lý nếu chưa có dữ liệu thật — user có thể điền sau).
- Vị trí chính xác đặt `authors.ts` (`src/data/authors.ts` theo roadmap) và cách export (named export object/array — theo D-01 là single object, nhưng đặt tên export rõ ràng để Phase 4 dễ mở rộng thành array nếu cần).
- Cách AuthorBox.astro import và render dữ liệu mới — giữ markup/style hiện tại, chỉ đổi nguồn data.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints (giữ Astro, giữ schema tương thích, YMYL caution, tiếng Việt)
- `.planning/REQUIREMENTS.md` — EEAT-01, EEAT-02 (yêu cầu chi tiết của Phase 2)
- `.planning/ROADMAP.md` §Phase 2 — Goal và Success Criteria của phase này

### Codebase Maps
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/codebase/STRUCTURE.md`

### Existing Schema & Data Source
- `src/content.config.ts` — schema hiện tại cần mở rộng (additive only, không phá 21 bài viết hiện có)
- `src/data/site.ts` — `site.author`, `site.authorProfile` hiện tại cần migrate sang `authors.ts`
- `src/components/AuthorBox.astro` — component cần refactor để đọc từ `authors.ts`
- `src/layouts/ArticleLayout.astro`, `src/layouts/BaseLayout.astro` — nơi dùng `site.author` cho byline và JSON-LD, cần cập nhật theo D-06

### Prior Phase Context
- `.planning/phases/01-design-token-foundation/01-CONTEXT.md` — token system đã hoàn thành, không ảnh hưởng trực tiếp đến Phase 2 nhưng AuthorBox refactor không nên phá vỡ token/markup hiện tại

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/site.ts` (`authorProfile: { role, expertise }`) — base để mở rộng thành `authors.ts` (D-02 thêm credentials, experience, slug, avatar, socialLinks)
- `src/components/AuthorBox.astro` — markup/style giữ nguyên, chỉ đổi data source

### Established Patterns
- Data/config module pattern: single source of truth object trong `src/data/*.ts`, export named const, helper functions co-located (giống `getCategoryPath`, `getArticlePath` trong `site.ts`)
- Zod schema additive với `.default()` cho field optional mới — pattern đã dùng cho `featured`, `order`, `tags`, `faq`, `sources` trong `content.config.ts`

### Integration Points
- `ArticleLayout.astro:43-45,98,126` và `BaseLayout.astro:17,42-43,79,121,138` — tất cả điểm dùng `site.author` cần trỏ sang `authors.ts` (D-06)
- 21 bài viết trong `src/content/articles/*.md` đều có section `## Key takeaways` trong body và `sources: string[]` trong frontmatter — pattern này informs D-03/D-04 fallback design

</code_context>

<specifics>
## Specific Ideas

- Tác giả duy nhất: Nguyễn Viết Lộc — đây là website cá nhân, không cần multi-author/reviewer scaffold.
- `citations` dùng structured objects để Citation box (Phase 3) hiển thị link/ngày nguồn rõ ràng, đúng chuẩn EEAT.
- `factCheckedDate` thay cho `reviewedBy` — phù hợp solo blog, vẫn thể hiện tín hiệu "đã kiểm tra nguồn gần đây".

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Backfill dữ liệu cho 21 bài viết (EEAT-10) và trang `/author/[slug]` (EEAT-06) đã thuộc Phase 4 theo roadmap, không phải deferred mới.

</deferred>

---

*Phase: 2-EEAT Data Model & Schema Extensions*
*Context gathered: 2026-06-12*
