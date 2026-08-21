---
phase: quick-260821-umf
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/schema.ts
  - src/layouts/BaseLayout.astro
  - src/layouts/ArticleLayout.astro
  - src/layouts/ReviewLayout.astro
  - .planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs
autonomous: true
requirements: []

must_haves:
  truths:
    - "Mỗi trang bài viết (article + review) chỉ phát đúng MỘT khối <script type=\"application/ld+json\"> chứa một @graph duy nhất"
    - "Node Organization gốc (@id {site}#organization) giữ nguyên name = site.name và url = site root — không còn bị reviewedBy ghi đè"
    - "Ban biên tập là node Organization riêng @id {site}#organization/ban-bien-tap, có parentOrganization trỏ về Organization gốc"
    - "Article không còn property dateReviewed; ngày fact-check xuất hiện dưới dạng WebPage.lastReviewed"
    - "Organization không còn sameAs LinkedIn cá nhân; Person vẫn giữ sameAs"
    - "Review rating dùng thang bestRating 5 / worstRating 1"
    - "Có node WebPage @id {pageUrl}#webpage nối breadcrumb, primaryimage, article (và review) thành một cụm"
    - "BreadcrumbList, ImageObject chính, FAQ đều có @id và được node khác trỏ tới — không còn node mồ côi"
    - "Trang review company có node Review riêng @id {pageUrl}#review; node Article trở lại @type Article thuần"
    - "ArticleLayout và ReviewLayout không còn duplicate code JSON-LD — cả hai gọi chung builder trong src/lib/schema.ts"
    - "npm run build (astro check && astro build) chạy xanh, 0 errors, 122 bài viết build đủ như trước"
  artifacts:
    - path: "src/lib/schema.ts"
      provides: "Builder JSON-LD dùng chung: buildSiteNodes + buildArticlePageNodes + type SchemaNode"
      exports: ["SchemaNode", "ArticlePageInput", "buildSiteNodes", "buildArticlePageNodes"]
      contains: "buildArticlePageNodes"
      min_lines: 150
    - path: "src/layouts/BaseLayout.astro"
      provides: "Prop schemaNodes + emit MỘT @graph gộp site nodes với page nodes; bỏ sameAs khỏi Organization"
      contains: "schemaNodes"
    - path: "src/layouts/ArticleLayout.astro"
      provides: "Dùng buildArticlePageNodes, truyền schemaNodes cho BaseLayout, xoá 3 script ld+json rời"
      contains: "buildArticlePageNodes"
    - path: "src/layouts/ReviewLayout.astro"
      provides: "Dùng buildArticlePageNodes + input review cho company review; xoá code duplicate"
      contains: "buildArticlePageNodes"
    - path: ".planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs"
      provides: "Script Node thuần kiểm tra dist: 1 khối ld+json, mọi @id ref resolve, graph liên thông"
  key_links:
    - from: "src/layouts/BaseLayout.astro"
      to: "src/lib/schema.ts"
      via: "import { buildSiteNodes } from '@/lib/schema'"
      pattern: "buildSiteNodes"
    - from: "src/layouts/ArticleLayout.astro"
      to: "src/layouts/BaseLayout.astro"
      via: "prop schemaNodes={pageNodes}"
      pattern: "schemaNodes=\\{"
    - from: "src/layouts/ReviewLayout.astro"
      to: "src/layouts/BaseLayout.astro"
      via: "prop schemaNodes={pageNodes}"
      pattern: "schemaNodes=\\{"
---

<objective>
Tái kiến trúc Entity Graph JSON-LD cho site Astro ValueInvesting.com.vn — Phase 1 (sửa 4 lỗi P0) + Phase 2 (gộp một @graph duy nhất, thêm node WebPage trục, khử duplicate giữa ArticleLayout/ReviewLayout).

Purpose: Hiện mỗi trang bài viết phát 4 khối ld+json rời rạc, `reviewedBy` dùng trùng `@id` với Organization gốc làm hỏng entity của brand, `dateReviewed` là property không hợp lệ nên tín hiệu fact-check YMYL bị mất, BreadcrumbList/FAQPage/ImageObject mồ côi hoàn toàn. Sau refactor, mỗi trang có một graph liên thông, mọi reference resolve được, và logic schema sống ở một chỗ duy nhất.

Output: `src/lib/schema.ts` (builder dùng chung), BaseLayout emit một `@graph`, ArticleLayout + ReviewLayout chỉ còn map dữ liệu vào builder.
</objective>

<execution_context>
@/Users/nguyenvietloc/Documents/investing/.claude/gsd-core/workflows/execute-plan.md
@/Users/nguyenvietloc/Documents/investing/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@src/layouts/BaseLayout.astro
@src/layouts/ArticleLayout.astro
@src/layouts/ReviewLayout.astro
@src/data/site.ts
@src/data/authors.ts
@src/lib/sitemap.ts

## Sự thật đã xác minh về codebase (không cần khám phá lại)

- `src/lib/` ĐÃ tồn tại (chứa `sitemap.ts`). Chỉ thêm file mới `schema.ts`, không cần tạo thư mục.
- Path alias `@/*` → `src/*` đã cấu hình trong `tsconfig.json`; `src/lib/sitemap.ts` là tiền lệ cho module TS thuần trong `src/lib/`.
- `src/data/site.ts` export `site` (có `site.name`, `site.email`, `site.editorialReviewer`, `site.description`), `categories`, `getCategoryPath`, `url`. Nó dùng `import.meta.env.BASE_URL` — import an toàn từ module `.ts` khác.
- `src/data/authors.ts` export object `author` (name, slug, role, bio, expertise, avatar, socialLinks).
- `Astro.site` là `URL | undefined`. Code hiện tại dùng `${Astro.site}#organization`, cho ra `https://valueinvesting.com.vn/#organization` (có dấu `/` trước `#`). **Phải giữ nguyên chuỗi @id này** — không được đổi format.
- BaseLayout hiện có `<slot name="head" />`. ArticleLayout và ReviewLayout dùng `<Fragment slot="head">` CHỈ để chứa 3 script ld+json — sau refactor cả Fragment đó bị xoá hoàn toàn.
- Các trang khác cũng bơm ld+json qua head slot: `src/pages/author/[slug].astro`, `src/pages/[category].astro`, `src/pages/dau-tu/[category].astro`, `src/pages/phan-tich/[category].astro`. **NGOÀI SCOPE — không đụng tới.** Chúng vẫn giữ 2 khối ld+json; yêu cầu "1 khối" chỉ áp dụng cho trang bài viết.
- Baseline đã đo: `npx astro check` → **0 errors, 0 warnings, 20 hints**. Build sau refactor phải giữ 0 errors (hints về `is:inline` là bình thường, chấp nhận được).
- Baseline `dist/`: `dist/dau-tu/etf/etf-la-gi/index.html` và `dist/reviews/review-dnse-securities/index.html` đều có **4** khối `application/ld+json`. Sau refactor phải còn **1**.
- Bài review: 8 bài `reviewType: company`, 10 bài `comparison`, 1 bài `listicle`. Tất cả nằm trong `category: reviews` → URL `/reviews/{slug}/`.
- `mergeBroker` trong `src/data/brokers.ts` trả về broker có `rating: number`.

## Quyết định thiết kế đã chốt (executor KHÔNG được tự đổi)

**Q1 — FAQ:** Giữ node `FAQPage` riêng với `@id: {pageUrl}#faq`, `isPartOf: {"@id": "{pageUrl}#webpage"}`, và `WebPage.hasPart: [{"@id": "{pageUrl}#faq"}]` (liên kết hai chiều, `hasPart`/`isPartOf` là cặp inverse hợp lệ trên CreativeWork). Mỗi câu hỏi là node `Question` top-level riêng `@id: {pageUrl}#faq-question-{n}`, `FAQPage.mainEntity` là mảng reference thuần tới các Question đó.
*Lý do:* Google yêu cầu type `FAQPage` mới nhận diện FAQ — bỏ type này là mất eligibility. Vì `FAQPage` mang `@id` fragment `#faq` khác `#webpage` và KHÔNG có property `url`, nó không tranh chấp "trang này là gì" với node `WebPage` (`WebPage` mới là node giữ `url`). Không dual-type `["WebPage","FAQPage"]` vì khi đó `mainEntity` phải mang hai ngữ nghĩa (Article vs Question) cùng lúc.

**Q2 — Cơ chế gộp graph:** Thêm prop `schemaNodes?: SchemaNode[]` (mặc định `[]`) vào BaseLayout. BaseLayout emit đúng một `<script type="application/ld+json">` với `{"@context": "https://schema.org", "@graph": [...buildSiteNodes(siteUrl), ...schemaNodes]}`. Layout con build mảng node rồi truyền lên qua prop.
*Lý do:* slot không cho phép merge dữ liệu, chỉ nối HTML — muốn một `@graph` duy nhất thì dữ liệu phải đi lên bằng prop. `<slot name="head" />` vẫn giữ nguyên cho các trang khác đang dùng.

**Q3 — Nối node Review:** `WebPage.mainEntity` là reference đơn `{"@id": "{pageUrl}#article"}` cho mọi trang; riêng trang company review thì là mảng `[{"@id": "...#article"}, {"@id": "...#review"}]`.
*Lý do:* Cả Article lẫn Review đều là thực thể chính của trang review; mảng cho `mainEntity` là JSON-LD hợp lệ và đảm bảo cả hai node đều có in-degree ≥ 1 (không mồ côi). Không dùng `Article.review` (nghĩa là "review VỀ bài viết" — sai ngữ nghĩa).

**Q4 — Node Person:** Hoist Person ra thành node top-level trong graph, `Article.author` chỉ còn `{"@id": ...}`. **Giữ NGUYÊN `@id` = `{site}author/{slug}/#person`** (migration @id namespace thuộc Phase 4, ngoài scope).

**Q5 — `founder` trong Organization:** Giữ nguyên dạng inline `{"@type":"Person","@id": personId, "name", "url"}`. Đây là *inline definition* (nhiều key), không phải dangling reference, nên trang không có node Person đầy đủ (homepage, category) vẫn hợp lệ. Trên trang bài viết nó merge với node Person đầy đủ vì trùng `@id` và trùng giá trị.

**Q6 — Node ban biên tập đặt ở đâu:** Trong `buildSiteNodes()` (tức mọi trang đều có). Như vậy `reviewedBy` luôn resolve được, và ban biên tập đúng là thực thể cấp site.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Tạo src/lib/schema.ts — builder JSON-LD dùng chung (chứa toàn bộ fix P0)</name>
  <files>src/lib/schema.ts</files>
  <action>
Tạo module TypeScript thuần `src/lib/schema.ts` (KHÔNG phải `.astro`). Import `site` từ `@/data/site` và `author` từ `@/data/authors`. Comment trong code viết bằng tiếng Anh theo CLAUDE.md. Không thêm dependency.

Export type công khai:
- `SchemaNode` — interface với `"@type": string | string[]`, `"@id"?: string`, và index signature `[key: string]: unknown`.
- `ArticlePageInput` — interface nhận: `siteUrl: string`, `pageUrl: string`, `title: string`, `description: string`, `publishDate: Date`, `updatedDate: Date`, `factCheckedDate?: Date`, `categoryTitle: string`, `tags?: string[]`, `imageUrl: string`, `breadcrumb: { name: string; item?: string }[]`, `faq?: { question: string; answer: string }[]`, `citations?: { title: string; url?: string; publisher?: string; date?: string }[]`, `sources?: string[]`, `review?: { name: string; url?: string; ratingValue: number }`.

Export helper @id nội bộ (không cần export ra ngoài trừ khi tiện): `orgId(siteUrl) = ${siteUrl}#organization`, `editorialBoardId(siteUrl) = ${siteUrl}#organization/ban-bien-tap`, `websiteId(siteUrl) = ${siteUrl}#website`, `personId(siteUrl) = ${siteUrl}author/${author.slug}/#person`. Lưu ý `siteUrl` được truyền vào đã có dấu `/` ở cuối (nó là `Astro.site.toString()`), nên nối chuỗi trực tiếp — KHÔNG dùng `new URL()` cho các @id này để giữ y hệt chuỗi hiện có.

Export `buildSiteNodes(siteUrl: string): SchemaNode[]` trả về đúng 3 node:
1. `Organization` `@id: orgId` — `name: site.name`, `url: siteUrl`, `logo: {"@type":"ImageObject","url": `${siteUrl}images/hero-investing.png`}`, `email: site.email`, `areaServed: "VN"`, `founder` inline như Q5. **KHÔNG có `sameAs`** — đây là fix P0-3 (LinkedIn cá nhân của tác giả đã và vẫn nằm ở `Person.sameAs`). Không emit mảng rỗng.
2. `Organization` `@id: editorialBoardId` — `name: site.editorialReviewer`, `url: `${siteUrl}editorial-policy/``, `parentOrganization: {"@id": orgId}`. Đây là fix P0-1: ban biên tập là entity riêng, không còn dùng chung @id với Organization gốc.
3. `WebSite` `@id: websiteId` — `url: siteUrl`, `name: site.name`, `description: site.description`, `inLanguage: "vi"`, `publisher: {"@id": orgId}`, `potentialAction` SearchAction giữ y hệt bản hiện có trong BaseLayout (`target: ${siteUrl}search/?q={search_term_string}`, `query-input: "required name=search_term_string"`).

Export `buildArticlePageNodes(input: ArticlePageInput): SchemaNode[]` trả về mảng node theo thứ tự: Person → BreadcrumbList → ImageObject → WebPage → Article → (FAQPage + các Question nếu có faq) → (Review nếu có input.review).

- **Person** `@id: personId(siteUrl)`: `name`, `url: ${siteUrl}author/${author.slug}/`, `jobTitle: author.role`, `description: author.bio`, `knowsAbout: author.expertise`, `image: {"@type":"ImageObject","url": ${siteUrl}${author.avatar.replace(/^\//, "")}}`, và `sameAs` CHỈ khi mảng `[linkedin, twitter].filter(Boolean)` không rỗng (giữ đúng hành vi hiện tại).
- **BreadcrumbList** `@id: ${pageUrl}#breadcrumb`: `itemListElement` map từ `input.breadcrumb` thành `{"@type":"ListItem","position": i+1, "name", ...(item ? {item} : {})}`.
- **ImageObject** `@id: ${pageUrl}#primaryimage`: `url: input.imageUrl`, `width: 1200`, `height: 630`.
- **WebPage** `@id: ${pageUrl}#webpage`: `url: pageUrl`, `name: title`, `description`, `inLanguage: "vi"`, `isPartOf: {"@id": websiteId}`, `breadcrumb: {"@id": ...#breadcrumb}`, `primaryImageOfPage: {"@id": ...#primaryimage}`, `mainEntity` theo Q3, `datePublished: publishDate.toISOString()`, `dateModified: updatedDate.toISOString()`, `lastReviewed: factCheckedDate.toISOString()` chỉ khi có (fix P0-2 — property này hợp lệ trên WebPage), `reviewedBy: {"@id": editorialBoardId}`, và `hasPart: [{"@id": ...#faq}]` chỉ khi có faq (Q1).
- **Article** `@id: ${pageUrl}#article`, `"@type": "Article"` (luôn là string thuần — fix 2f): `headline: title`, `description`, `url: pageUrl`, `mainEntityOfPage: {"@id": ...#webpage}` (reference thuần tới node có thật, thay cho `{"@type":"WebPage","@id": articleUrl}` cũ), `datePublished`, `dateModified`, `inLanguage: "vi"`, `articleSection: categoryTitle`, `keywords: tags.join(", ")` chỉ khi `tags?.length`, `image: {"@id": ...#primaryimage}` (reference thuần), `author: {"@id": personId}`, `reviewedBy: {"@id": editorialBoardId}`, `publisher: {"@id": orgId}`, `isPartOf: {"@id": websiteId}`, `citation` (xem dưới). **TUYỆT ĐỐI không còn key `dateReviewed`** — fix P0-2.
- **citation**: giữ logic hiện tại, tách thành hàm nội bộ `buildCitations(citations, sources)` — nếu `citations?.length` thì map sang `{"@type":"CreativeWork","name": c.title, ...(url), ...(publisher: {"@type":"Organization","name"}), ...(datePublished: date)}`; ngược lại trả `sources` (mảng string). Chỉ set key `citation` khi kết quả không rỗng.
- **FAQPage** `@id: ${pageUrl}#faq`: `mainEntity: [{"@id": ...#faq-question-1}, ...]`, `isPartOf: {"@id": ...#webpage}`. Mỗi **Question** là node riêng `@id: ${pageUrl}#faq-question-{n}` (n bắt đầu từ 1) với `name: item.question`, `acceptedAnswer: {"@type":"Answer","text": item.answer}`.
- **Review** `@id: ${pageUrl}#review` (chỉ khi `input.review`): `name: title`, `itemReviewed: {"@type":"FinancialService","name": review.name, ...(review.url ? {url} : {})}`, `reviewRating: {"@type":"Rating","ratingValue": review.ratingValue, "bestRating": 5, "worstRating": 1}` — **`worstRating: 1`, không phải 0** (fix P0-4), `author: {"@id": personId}`, `datePublished: publishDate.toISOString()`, `publisher: {"@id": orgId}`, `isPartOf: {"@id": ...#webpage}`.

Yêu cầu TypeScript strict: mọi field optional phải dùng spread có điều kiện (`...(cond ? { key: value } : {})`), không gán `undefined`. Hàm phải là pure — không đọc `Astro`, không đọc `import.meta.env` trực tiếp.
  </action>
  <verify>
    <automated>npx astro check 2>&1 | tail -5 | grep -q "0 errors" && grep -q "buildArticlePageNodes" src/lib/schema.ts && grep -v '^\s*//' src/lib/schema.ts | grep -c "dateReviewed" | grep -qx 0 && grep -v '^\s*//' src/lib/schema.ts | grep -qE '"?worstRating"?: *1'</automated>
  </verify>
  <done>`src/lib/schema.ts` tồn tại, export `SchemaNode`, `ArticlePageInput`, `buildSiteNodes`, `buildArticlePageNodes`; `npx astro check` báo 0 errors; file không chứa `dateReviewed`; `worstRating` là 1.</done>
</task>

<task type="auto">
  <name>Task 2: Wire BaseLayout (một @graph + prop schemaNodes) và ArticleLayout</name>
  <files>src/layouts/BaseLayout.astro, src/layouts/ArticleLayout.astro</files>
  <action>
**BaseLayout.astro:**
1. Thêm `import { buildSiteNodes, type SchemaNode } from "@/lib/schema";`. Bỏ `import { author } from "@/data/authors"` CHỈ KHI không còn chỗ nào dùng — kiểm tra kỹ: `author.name` vẫn đang được dùng trong `extend.meta` (`{ name: "author", content: author.name }`), nên GIỮ import này.
2. Thêm vào `interface Props`: `schemaNodes?: SchemaNode[];` và destructure với default `schemaNodes = []`.
3. Thay toàn bộ block `<script type="application/ld+json" set:html={JSON.stringify({...@graph...})} />` hiện tại (khoảng dòng 87-125) bằng một block dựng từ biến frontmatter, ví dụ tính trong frontmatter: `const siteUrl = Astro.site?.toString() ?? "";` và `const graph = { "@context": "https://schema.org", "@graph": [...buildSiteNodes(siteUrl), ...schemaNodes] };` rồi render `<script type="application/ld+json" set:html={JSON.stringify(graph)} />`. Giữ comment mô tả bằng tiếng Anh.
4. `<slot name="head" />` GIỮ NGUYÊN (các trang author/category vẫn dùng).
5. Kết quả: Organization không còn `sameAs` (fix P0-3 đến từ `buildSiteNodes`).

**ArticleLayout.astro:**
1. Import: `import { buildArticlePageNodes } from "@/lib/schema";`. Xoá các const `sameAs`, `structuredCitations`, `articleSchema`, `faqSchema`, `breadcrumbSchema` (khoảng dòng 67-156) — chúng chuyển hết vào builder. Giữ `import { author }` vì template vẫn dùng `author.name`, `author.avatar`, `author.slug`.
2. Tính mảng breadcrumb cho schema từ dữ liệu đã có (`hasGroup`, `categoryGroup`, `categoryGroupPath`, `categoryTitle`, `categoryPath`, `title`, `articleUrl`) — dùng đúng các URL tuyệt đối như bản cũ: item 1 = `Astro.site?.toString()`, item group = `new URL(categoryGroupPath, Astro.site).toString()`, item category = `new URL(categoryPath, Astro.site).toString()`, item cuối = `articleUrl`. Tên biến gợi ý `schemaBreadcrumb`.
3. Gọi builder:
   `const pageNodes = buildArticlePageNodes({ siteUrl: Astro.site?.toString() ?? "", pageUrl: articleUrl, title, description, publishDate, updatedDate, factCheckedDate, categoryTitle, tags: entry.data.tags, imageUrl: ogImageUrl, breadcrumb: schemaBreadcrumb, faq: entry.data.faq, citations, sources });`
4. Xoá hoàn toàn `<Fragment slot="head"> ... </Fragment>` (3 script ld+json). Thay bằng truyền prop cho BaseLayout: thêm `schemaNodes={pageNodes}` vào thẻ `<BaseLayout ...>`.
5. Không đụng bất kỳ phần HTML/CSS nào khác của layout.
  </action>
  <verify>
    <automated>npx astro check 2>&1 | tail -5 | grep -q "0 errors" && grep -q "schemaNodes" src/layouts/BaseLayout.astro && grep -q "buildArticlePageNodes" src/layouts/ArticleLayout.astro && grep -c "application/ld+json" src/layouts/ArticleLayout.astro | grep -qx 0</automated>
  </verify>
  <done>BaseLayout nhận prop `schemaNodes` và emit đúng 1 script ld+json gộp site nodes + page nodes; ArticleLayout không còn khối `application/ld+json` nào, chỉ truyền `schemaNodes={pageNodes}`; `npx astro check` 0 errors.</done>
</task>

<task type="auto">
  <name>Task 3: Wire ReviewLayout (tách node Review) + build và verify graph trong dist</name>
  <files>src/layouts/ReviewLayout.astro, .planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs</files>
  <action>
**ReviewLayout.astro:**
1. Import `buildArticlePageNodes` từ `@/lib/schema`. Xoá các const `sameAs`, `structuredCitations`, `articleSchema`, `faqSchema`, `breadcrumbSchema` (khoảng dòng 73-178). GIỮ `isCompanyReview`, `primaryBroker`, `mergedBrokers` và toàn bộ logic `reviewType`/`navItems`.
2. Dựng `schemaBreadcrumb` giống hệt cách làm ở ArticleLayout (Task 2).
3. Gọi builder với input review có điều kiện:
   `const pageNodes = buildArticlePageNodes({ ...các field như ArticleLayout..., ...(isCompanyReview && primaryBroker ? { review: { name: primaryBroker.name, ...(entry.data.companyInfo?.website ? { url: entry.data.companyInfo.website } : {}), ratingValue: primaryBroker.rating } } : {}) });`
   Đây là fix 2f + P0-4: node Article trở lại `@type: "Article"` thuần (builder luôn set vậy), thông tin review chuyển sang node `Review` riêng với `worstRating: 1`.
4. Xoá `<Fragment slot="head">` (3 script ld+json), thêm `schemaNodes={pageNodes}` vào `<BaseLayout ...>`.
5. Không đụng phần HTML/CSS còn lại.

**Script verify — `.planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs`:**
Viết script Node thuần (ESM, không dependency), nhận danh sách đường dẫn file HTML qua argv. Với mỗi file:
- Trích mọi khối `<script type="application/ld+json"...>...</script>` bằng regex. FAIL nếu số khối khác 1.
- `JSON.parse` khối đó; FAIL nếu không có mảng `@graph`.
- Duyệt đệ quy mọi object trong graph. Với mỗi object con có `@id`: nếu object CHỈ có duy nhất key `@id` → coi là *reference*; ngược lại (nhiều key) → coi là *inline definition* và đăng ký `@id` đó vào tập node đã biết. Node top-level trong `@graph` cũng đăng ký `@id` của nó.
- FAIL nếu có reference trỏ tới `@id` không nằm trong tập node đã biết (dangling reference).
- Dựng đồ thị vô hướng: mỗi cạnh nối `@id` của node top-level chứa reference với `@id` được trỏ tới. FAIL nếu graph không liên thông (tồn tại node mồ côi / cụm tách rời).
- Kiểm tra bổ sung, FAIL nếu vi phạm: (a) chuỗi `"dateReviewed"` xuất hiện ở bất kỳ đâu trong JSON; (b) `"worstRating"` có giá trị khác 1; (c) node có `@id` kết thúc bằng `#organization` phải có `name` đúng bằng `"Value Investing"` (không bị ghi đè thành "Ban biên tập Value Investing"); (d) tồn tại node `@id` kết thúc `#webpage`, `#breadcrumb`, `#primaryimage`, `#article`.
- In `PASS <file>` hoặc `FAIL <file>: <lý do>`; `process.exit(1)` nếu có bất kỳ FAIL nào.

Sau đó chạy `npm run build` và chạy script trên 3 trang bắt buộc:
`dist/dau-tu/etf/etf-la-gi/index.html` (bài thường), `dist/reviews/review-dnse-securities/index.html` (company review), `dist/reviews/dsc-vs-ssi/index.html` (comparison).
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -5 && node .planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs dist/dau-tu/etf/etf-la-gi/index.html dist/reviews/review-dnse-securities/index.html dist/reviews/dsc-vs-ssi/index.html && test "$(grep -o 'application/ld+json' dist/reviews/review-dnse-securities/index.html | wc -l | tr -d ' ')" = "1"</automated>
  </verify>
  <done>`npm run build` xanh (astro check 0 errors, build đủ 122 bài); script verify in PASS cho cả 3 trang; mỗi trang bài viết chỉ còn đúng 1 khối `application/ld+json`.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Nội dung markdown (`src/content/articles/*.md`) → JSON-LD trong HTML | Dữ liệu do tác giả nhập (title, description, faq, citations, companyInfo.website) được nhúng vào `<script>` ở build time |
| Site → Google / crawler | Entity graph phát ra công khai, ảnh hưởng entity resolution của brand (YMYL) |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-umf-01 | Tampering | `JSON.stringify` vào `<script type="application/ld+json">` với dữ liệu markdown chứa `</script>` | accept | Astro `set:html` + `JSON.stringify` là cơ chế đang dùng sẵn trên toàn site; nội dung do chính chủ repo viết (không có user input runtime), site static, không có JS thực thi từ khối này. Không mở rộng bề mặt so với hiện trạng. |
| T-umf-02 | Spoofing | Entity Organization bị ghi đè `name`/`url` do trùng `@id` (P0-1) | mitigate | Task 1 tách ban biên tập sang `@id` riêng `#organization/ban-bien-tap`; script verify (Task 3) fail nếu node `#organization` có `name` khác `"Value Investing"` |
| T-umf-03 | Information Disclosure | `Organization.sameAs` gán LinkedIn cá nhân, trộn danh tính cá nhân với brand (P0-3) | mitigate | Task 1 bỏ `sameAs` khỏi Organization; chỉ `Person.sameAs` giữ link cá nhân |
| T-umf-04 | Tampering | Refactor làm mất/hỏng markup của 122 bài đang build | mitigate | Gate `npm run build` (astro check 0 errors) ở Task 3 + script verify chạy trên 3 loại trang đại diện |
| T-umf-SC | Tampering | npm/pip/cargo installs | mitigate | Không cài package nào trong plan này (ràng buộc "không thêm dependency"); nếu executor thấy cần install → dừng và hỏi |
</threat_model>

<verification>
1. `npx astro check` → 0 errors (baseline trước refactor cũng là 0 errors, 20 hints).
2. `npm run build` chạy xanh; số bài build ra không giảm so với trước (122 bài).
3. `node .planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/verify-graph.mjs dist/dau-tu/etf/etf-la-gi/index.html dist/reviews/review-dnse-securities/index.html dist/reviews/dsc-vs-ssi/index.html` → PASS cả 3.
4. Kiểm tra thủ công một trang review company: node `Review` tồn tại với `worstRating: 1`, node `Article` có `"@type": "Article"` (string, không phải mảng).
5. `git status` chỉ hiện thay đổi ở `src/lib/schema.ts`, 3 file layout, và thư mục `.planning/quick/260821-umf-.../` — KHÔNG được có thay đổi ở `knowledge/`, `.antigravity/`, hay `src/content/articles/`.
</verification>

<success_criteria>
- [ ] 4 lỗi P0 đã sửa: ban biên tập có `@id` riêng + `parentOrganization`; không còn `dateReviewed` (thay bằng `WebPage.lastReviewed`); Organization không còn `sameAs`; `worstRating: 1`.
- [ ] Trang bài viết chỉ còn đúng 1 khối `application/ld+json`, chứa 1 `@graph`.
- [ ] Có node `WebPage` `#webpage` nối `#breadcrumb`, `#primaryimage`, `#article` (và `#review` trên trang company review).
- [ ] Mọi reference `{"@id": ...}` resolve tới node có thật; graph liên thông, không node mồ côi.
- [ ] `src/lib/schema.ts` là nguồn duy nhất sinh JSON-LD cho article/review; hai layout không còn code duplicate.
- [ ] `npm run build` xanh, 0 errors.
- [ ] Không đổi `src/content.config.ts`, không đổi `@id` của Person, không thêm dependency.
</success_criteria>

<output>
Create `.planning/quick/260821-umf-phase-1-2-entity-graph-schema-refactor/260821-umf-SUMMARY.md` when done
</output>
