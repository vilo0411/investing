---
phase: quick-261018-mla
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  # Task 1 — scripts + instincts split
  - scripts/_common.py
  - scripts/topic_status.py
  - scripts/find_links.py
  - scripts/optimize_instincts.py
  - .antigravity/memory/instincts-archive.md
  - .antigravity/memory/instincts.md
  - knowledge/4-content/topic-clusters.md
  # Task 2 — knowledge gaps + peripheral reference fixes
  - knowledge/1-brand/writers/README.md
  - knowledge/1-brand/writers/educational.md
  - knowledge/1-brand/writers/analytical.md
  - knowledge/1-brand/writers/comparison.md
  - knowledge/raw/intel/dump.md
  - .gitignore
  - .antigravity/config/api-keys.example.md
  - .antigravity/skills/web-serp/SKILL.md
  - .agents/workflows/setup.md
  - .agents/workflows/cluster.md
  - .agents/workflows/image.md
  - .agents/workflows/keyword-plan.md
  - .antigravity/agents/visual-architect.md
  - .antigravity/agents/seo-collector.md
  - .antigravity/skills/seo-optimization/SKILL.md
  - .antigravity/internal-templates/4-content/sprint-backlog.md
  - .antigravity/memory/DECISIONS.md
  # Task 3 — core pipeline rewire
  - .agents/workflows/write.md
  - .agents/workflows/drafting.md
  - .agents/workflows/outlining.md
  - .agents/workflows/optimize.md
  - .agents/workflows/approve.md
  - .agents/workflows/revise.md
  - .agents/workflows/learn.md
  - .agents/workflows/link.md
  - .antigravity/rules/workflow-integrity.md
  - .antigravity/agents/quality-guardian.md
  - .antigravity/skills/qa-qc/SKILL.md
  - .antigravity/skills/internal-linking/SKILL.md
  - .antigravity/skills/content-feedback-loop/SKILL.md
  - .antigravity/skills/seo-outlining/SKILL.md
  - .antigravity/skills/seo-outlining/references/brief-template.md
  - .antigravity/skills/seo-drafting/SKILL.md
autonomous: true
requirements: ["QUICK-261018-mla"]

must_haves:
  truths:
    - "`python3 scripts/find_links.py \"chỉ số pe\" --top 5` trả về URL `/phan-tich/co-ban/pe-la-gi/` — URL root-relative tính đúng theo `categories[].path` trong src/data/site.ts"
    - "`python3 scripts/find_links.py --backfill pe-la-gi` liệt kê bài trong src/content/articles chưa link tới pe-la-gi kèm số dòng; slug không tồn tại thì exit 1"
    - "`python3 scripts/topic_status.py --find \"etf\"` liệt kê các dòng ETF trong topic-clusters.md; `<slug> --set STATUS` chỉ sửa đúng 1 dòng, và từ chối (exit 1) khi slug khớp nhiều dòng mà không có --all"
    - ".antigravity/memory/instincts-archive.md giống từng byte với instincts.md tại commit 55abd30; instincts.md sinh tự động, ≤ 8.000 ký tự, chứa đủ mọi tiêu đề instinct ACTIVE"
    - "optimize_instincts.py không bao giờ ghi vào archive; instinct có `Phạm vi: Chỉ topic: X` được tách ra .antigravity/memory/instincts-by-scope/<x>.md (đã kiểm bằng fixture)"
    - "Không còn đường dẫn backtick gãy trong .agents/workflows/*.md và .antigravity/**/*.md (trừ memory/ và api-keys.md cục bộ đã gitignore); không còn `3-finalized` trong tài liệu pipeline"
    - "knowledge/1-brand/writers/ có README + educational + analytical + comparison, giọng Value Investing (bạn + Value Investing, YMYL), không DSC/CTA"
    - "write.md Bước 3.1 có template frontmatter khớp block Astro trong CLAUDE.md + heroImage, tên trường đúng như src/content.config.ts"
    - "Vòng QA tối đa 2 vòng; sau vòng 2 vẫn FAIL thì dừng, trình bày `⚠️ Remaining issues` (trong --auto: ghi vào báo cáo cuối, không dừng chờ) — áp dụng ở write, drafting, optimize, workflow-integrity, quality-guardian, qa-qc"
    - "/outlining và /write chạy Cannibalization Gate (SEO Dashboard MCP list_properties → query_search_analytics, cộng find_links.py) trước SERP research, hành vi cho --auto được định nghĩa rõ"
    - "/revise ghi log vào knowledge/3-pipeline/revision-log.md TRƯỚC khi sửa; các workflow dùng topic_status.py/find_links.py thay vì đọc nguyên topic-clusters.md/anchor-index.md"
  artifacts:
    - path: "scripts/_common.py"
      provides: "Hằng số đường dẫn, setup_utf8, unaccent, compact, tokens, split_frontmatter, load_categories, article_url, load_articles"
      contains: "def article_url"
      min_lines: 90
    - path: "scripts/topic_status.py"
      provides: "Đọc/cập nhật trạng thái một dòng trong topic-clusters.md (slug, --set, --find, --list, --cluster, --all)"
      contains: "--cluster"
      min_lines: 120
    - path: "scripts/find_links.py"
      provides: "Tìm bài nội bộ để link từ frontmatter src/content/articles + gợi ý anchor từ anchor-index; chế độ --backfill"
      contains: "--backfill"
      min_lines: 140
    - path: "scripts/optimize_instincts.py"
      provides: "archive → instincts.md rút gọn + instincts-by-scope/"
      contains: "def parse_instincts_file"
      min_lines: 150
    - path: ".antigravity/memory/instincts-archive.md"
      provides: "Bản đầy đủ nguyên vẹn của instincts — nguồn chân lý cho /learn"
      contains: "Bản năng Active"
    - path: "knowledge/1-brand/writers/README.md"
      provides: "Bảng chọn writer profile theo loại bài"
      contains: "Writer_Profile"
    - path: "knowledge/raw/intel/dump.md"
      provides: "File capture nhanh cho 30-second Rule"
  key_links:
    - from: "scripts/find_links.py"
      to: "src/data/site.ts"
      via: "_common.load_categories() parse categories[].slug/path → article_url()"
      pattern: "article_url"
    - from: "scripts/topic_status.py"
      to: "knowledge/4-content/topic-clusters.md"
      via: "parse bảng | Keyword | Slug | Status | và dòng **Hub:**"
      pattern: "TOPIC_FILE"
    - from: ".agents/workflows/outlining.md"
      to: "scripts/find_links.py"
      via: "Cannibalization Gate + Internal Link Planning"
      pattern: "find_links.py"
    - from: ".antigravity/skills/content-feedback-loop/SKILL.md"
      to: "scripts/optimize_instincts.py"
      via: "ghi archive rồi chạy script đồng bộ"
      pattern: "optimize_instincts.py"
---

<objective>
Tối ưu SEO content engine (`.agents/workflows/`, `.antigravity/`, `knowledge/`) theo repo tham khảo dsc-content-seo, đã chỉnh cho site Astro của Value Investing (bài final ở `src/content/articles/*.md`, URL tính theo `categories[].path` trong `src/data/site.ts`). Không copy nguyên văn.

Purpose: sửa các tham chiếu gãy khiến agent đọc file không tồn tại, khoá frontmatter đúng schema Astro, giới hạn vòng QA, chặn cannibalization trước khi tốn SERP research, và giảm context cho LLM: tra topic-clusters.md / anchor-index.md bằng script thay vì load cả file (28 KB + 25 KB), cắt instincts.md từ 11,4k ký tự xuống ≤ 8k mà vẫn giữ lịch sử đầy đủ trong archive.

Output: 4 script Python dùng stdlib (`scripts/_common.py`, `topic_status.py`, `find_links.py`, `optimize_instincts.py`), instincts-archive + instincts.md rút gọn, 4 writer profile, 1 file stub intel dump, và khoảng 30 tài liệu workflow/agent/skill đã nối lại.
</objective>

<execution_context>
@/Users/nguyenvietloc/Documents/investing/.claude/gsd-core/workflows/execute-plan.md
@/Users/nguyenvietloc/Documents/investing/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md
@src/data/site.ts
@src/content.config.ts
@knowledge/1-brand/profile.md
@knowledge/1-brand/personas.md

Repo tham khảo (chỉ đọc, absolute path): REF=/private/tmp/claude-501/-Users-nguyenvietloc-Documents-investing/9270e198-7f1c-4ef4-b79a-4cf14644d201/scratchpad/ref/dsc-content-seo
- $REF/scripts/_common.py, $REF/scripts/topic_status.py, $REF/scripts/find_links.py, $REF/scripts/optimize_instincts.py
- $REF/knowledge/1-brand/writers/{README,educational,analytical,comparison}.md
- $REF/knowledge/raw/intel/dump.md
- $REF/.antigravity/rules/workflow-integrity.md, $REF/.agents/skills/outlining/SKILL.md (Bước 0.5), $REF/.agents/skills/write/SKILL.md (Bước 1.0, dòng ~103), $REF/.antigravity/agents/quality-guardian.md (dòng ~153), $REF/.antigravity/skills/content-feedback-loop/SKILL.md
Nếu thư mục REF không còn, plan này đã mô tả đủ logic để tự viết.

<interfaces>
Dữ kiện đã kiểm trong quá trình lập plan, executor không cần dò lại:

src/data/site.ts — `categories` là mảng object có `slug`, `group` (tuỳ chọn), `groupPath` (tuỳ chọn), `path`. Các path thực tế:
co-phieu → /dau-tu/co-phieu/ · etf → /dau-tu/etf/ · trai-phieu → /dau-tu/trai-phieu/ · phai-sinh → /dau-tu/phai-sinh/ · co-ban → /phan-tich/co-ban/ · ky-thuat → /phan-tich/ky-thuat/ · reviews → /reviews/ · nha-dau-tu → /nha-dau-tu/
`getCategoryPath(c) = url(categories.find(slug===c)?.path ?? "/")`, `getArticlePath(a) = getCategoryPath(a.data.category) + a.slug + "/"`. `url()` thêm BASE_URL; link nội bộ trong markdown KHÔNG kèm base (astro.config.mjs tự thêm prefix lúc build cho GitHub Pages). Vì vậy article_url trả về path root-relative, không có base. Lưu ý: CLAUDE.md liệt kê `quy-dau-tu` nhưng site.ts KHÔNG có category này — coi site.ts là nguồn chân lý.

src/content/articles/*.md — 147 bài .md + thư mục `images/`. Slug = tên file (không bài nào override `slug:`). Giá trị category có khi có ngoặc kép (`category: "co-ban"`), có khi không (`category: co-ban`), và có một bài có khoảng trắng thừa (`category: reviews `) — phải strip cả nháy lẫn khoảng trắng. Có 859 link nội bộ, đều dạng root-relative `](/phan-tich/co-ban/pb-la-gi/)`; 0 link tuyệt đối tới valueinvesting.com.vn. Các trường frontmatter cần parse: title, description, category (scalar), tags, keyTakeaways (danh sách chuỗi dạng `  - "..."` hoặc `  - text`). faq/citations là danh sách object; parser được phép giữ dạng thô hoặc bỏ qua.

knowledge/4-content/topic-clusters.md — heading cluster dạng `## CLUSTER C7 — Quỹ ETF (ETF + Quỹ mở)`, heading con tuỳ chọn dạng `### ETF`. Bảng dữ liệu có header `| Keyword (Spoke) | Slug | Status | Ghi chú |` (biến thể: `Keyword`, `Keyword (Hub)`, `Broker | Slug pillar | Status | Ưu tiên`, có bảng chỉ 3 cột). Cột 2 = slug bọc backtick, cột 3 = status bọc backtick (`` `Finalized` ``, `` `Planned` ``). Dòng hub KHÔNG nằm trong bảng: `**Hub:** Cổ phiếu là gì | `/dau-tu/co-phieu/co-phieu-la-gi/` | `Finalized``. Hai bảng không phải dữ liệu cần bỏ qua: bảng tổng quan ở đầu file (`| # | Cluster (Hub) | ...`) và bảng thống kê cuối file (`| Nhóm trang | Số cluster | Tổng keyword |`). Slug xuất hiện nhiều lần (hub + spoke): `cach-chon-co-phieu-tot`, `phan-tich-nganh-la-gi`, `warren-buffett`. Dòng chú thích trạng thái (dòng 5): `Trạng thái có thể dùng: `Planned` | `In Progress` | `Outline-Approved` | `Drafting` | `Finalized``.

knowledge/3-pipeline/anchor-index.md — mỗi nhóm có bảng `| Slug | Title | URL Path | Anchor Text gợi ý |`, dòng dạng `| `co-tuc-la-gi` | Cổ tức là gì? | `/dau-tu/co-phieu/co-tuc-la-gi/` | cổ tức |`.

.antigravity/memory/instincts.md (hiện 11.443 ký tự) — dùng đúng format mà parser của ref đọc được: `### Tiêu đề`, sau đó là các dòng `- **Trạng thái:** ACTIVE|PENDING`, `- **Nguồn:**`, `- **Phản hồi từ User:**` (tuỳ chọn), `- **Bản năng:**` (có thể kéo dài nhiều dòng, ví dụ instinct "Tách biệt list-item..." có các dòng con đánh số), `- **Phạm vi:** Global`. Phía trên có code block mẫu với `### [Tên ngắn gọn]` (phải bỏ qua) và có dòng `---` ngăn cách giữa các instinct. Đếm được 21 instinct: 20 ACTIVE, 1 PENDING, tất cả `Global`. Chạy thử ref script với LINT_COVERED rỗng: không có cặp nào bị dedupe, 20 instinct đầy đủ → 7.239 ký tự ở --max-chars 450.

knowledge/3-pipeline/revision-log.md — bảng dưới `## Nhật ký chỉnh sửa`: `| Ngày | Slug bài viết | Yêu cầu từ người dùng | Hành động xử lý | Trạng thái |`, trạng thái dạng `**Hoàn thành**`. Bảng kết thúc trước `## Hướng dẫn cập nhật cho Agent`.

scripts/audit-links.mjs có sẵn (Node, gray-matter đã cài), in báo cáo link nội bộ hỏng ra stdout — đây là công cụ audit đúng cho site này. `.antigravity/skills/internal-linking/scripts/link_audit.py` trỏ tới `content/blog/3-finalized` và không chạy được ở đây.

`.gitignore` hiện có `.env` nhưng KHÔNG có `.antigravity/config/api-keys.md`, dù api-keys.example.md ghi là đã ignore. `.antigravity/skills/web-serp/scripts/scrape.py` đọc env `FIRECRAWL_API_KEY` trước, sau đó mới tới file api-keys.md.

SEO Dashboard MCP (read-only): `list_properties` trả về property_url dạng 'https://example.com/' hoặc 'sc-domain:example.com' — phải copy nguyên văn. `query_search_analytics` nhận property_url, dimensions, query_value, days, limit.
</interfaces>
</context>

## Scope Coverage (multi-source audit)

| Nguồn | Mục | Task |
|---|---|---|
| GOAL | Tối ưu pipeline theo ref, chỉnh cho Astro | 1, 2, 3 |
| SCOPE a | Tham chiếu gãy: writers/ (tạo mới), raw/intel/dump.md (stub), keyword-hvs, 2-market/persona, visual-brand-guidelines, api-keys.md, 3-finalized trong image/seo-optimization/sprint-backlog template | 2 |
| SCOPE a | Tham chiếu gãy: service-operations, internal-link-dashboard, 3-finalized trong write/approve/optimize/learn/quality-guardian/qa-qc/internal-linking | 3 |
| SCOPE b | Frontmatter mẫu ở write.md Bước 3.1 + approve.md | 3 |
| SCOPE c | QA tối đa 2 vòng + ⚠️ Remaining issues (giữ hành vi --auto) | 3 |
| SCOPE d | Inline revision logging (rule 5 đã có trong workflow-integrity → giữ nguyên, siết lại) + revise.md | 3 |
| SCOPE e | Cannibalization Gate (MCP + find_links fallback, có quyết định cho auto mode) | 3 |
| SCOPE f | scripts/_common.py | 1 |
| SCOPE g | scripts/topic_status.py | 1 |
| SCOPE h | scripts/find_links.py | 1 |
| SCOPE i | instincts-archive + optimize_instincts.py + chạy script (Task 1); tài liệu learn/feedback-loop (Task 3) | 1, 3 |
| SCOPE j | Nối workflow sang topic_status/find_links/instincts-by-scope | 2 (peripheral), 3 (core) |
| OUT | qa_lint, slop_check, market_facts, CRO/CTA, gsc-sync, bài trong src/content/articles, code Astro, CLAUDE.md | — (không làm) |

Quyết định của planner (chỗ được tự quyết):
- PD-1 Cannibalization trong `--auto`/`--sprint`: KHÔNG viết bài mới và KHÔNG tự chạy `/optimize`, vì sửa bài đã publish cần user đồng ý. Ghi khối `⚠️ Cannibalization` (URL đang rank, intent, đề xuất `/optimize [slug]`) vào báo cáo cuối rồi kết thúc keyword đó, không dừng chờ; nếu đang `--sprint` thì chuyển sang keyword kế tiếp. Thêm option mới `--force-new`: user xác nhận vẫn muốn viết bài mới → bỏ qua lệnh dừng, nhưng outline phải ghi `Intent_Boundary:` và link chéo 2 chiều với bài đã có. Cách này tôn trọng memory "/write --auto chạy end-to-end, không dừng ở gate" mà không tạo bài trùng intent trên site YMYL.
- PD-2 QA vẫn FAIL sau 2 vòng trong `--auto`: theo scope — vẫn finalize, đặt `⚠️ Remaining issues` lên đầu báo cáo cuối, ghi một dòng vào revision-log với trạng thái `**Cần xử lý**`, và KHÔNG thêm `factCheckedDate` (khớp quy tắc của CLAUDE.md: chỉ thêm khi đã fact-check).
- PD-3 Không sửa CLAUDE.md (file do user quản lý). Đường dẫn `.antigravity/memory/instincts.md` giữ nguyên nên Mandatory Context Protocol vẫn đúng.

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Scripts Python (_common, topic_status, find_links, optimize_instincts) + tách instincts (scope f, g, h, i)</name>
  <files>scripts/_common.py, scripts/topic_status.py, scripts/find_links.py, scripts/optimize_instincts.py, .antigravity/memory/instincts-archive.md, .antigravity/memory/instincts.md, knowledge/4-content/topic-clusters.md</files>
  <behavior>
    - article_url("co-ban","pe-la-gi") == "/phan-tich/co-ban/pe-la-gi/"; article_url("reviews","x") == "/reviews/x/"; article_url("nha-dau-tu","warren-buffett") == "/nha-dau-tu/warren-buffett/"; article_url("khong-co","x") == "/x/" (giống fallback `?? "/"` của TS)
    - load_categories() trả về đủ 8 slug của site.ts kèm path
    - find_links "chỉ số pe" --top 5 có /phan-tich/co-ban/pe-la-gi/; --exclude etf-la-gi không bao giờ trả về etf-la-gi; --json trả về list với url bắt đầu và kết thúc bằng "/"
    - find_links --backfill pe-la-gi exit 0 và in các dòng `file | line | excerpt`; --backfill slug-khong-ton-tai exit 1
    - topic_status --find "etf" có etf-la-gi; --list Finalized --cluster C7 có URL /dau-tu/etf/etf-la-gi/ và không lẫn dòng của C1x
    - topic_status etf-la-gi --set Optimizing chỉ đổi đúng 1 dòng (giữ backtick), --set Finalized đưa file về đúng từng byte như cũ
    - topic_status phan-tich-nganh-la-gi --set Drafting → exit 1, file không đổi (nhiều dòng khớp, không có --all)
    - optimize_instincts: archive không bao giờ bị ghi; instincts.md ≤ 8000 ký tự và chứa mọi tiêu đề ACTIVE; fixture có `Phạm vi: Chỉ topic: Vĩ mô` sinh ra instincts-by-scope/vi-mo.md
  </behavior>
  <action>
Viết 4 script stdlib-only bằng python3, chạy được trên Python ≥ 3.9 (macOS system python): dùng `from __future__ import annotations`, không dùng `match`, không thêm dependency, không gọi network/subprocess/eval. Code comment và docstring bằng tiếng Anh; output cho người dùng bằng tiếng Việt (giống ref). Mỗi script tự thêm thư mục của chính nó vào sys.path (`sys.path.insert(0, str(Path(__file__).resolve().parent))`) trước `from _common import ...`, để chạy được từ bất kỳ cwd nào và cả với `python3 -I`. Mọi regex tạo từ input của user phải qua re.escape.

1) scripts/_common.py — chỉ để import, adapt từ $REF/scripts/_common.py. Hằng số: ROOT (parents[1]), ARTICLES_DIR=src/content/articles, SITE_TS=src/data/site.ts, CONTENT=knowledge/4-content, OUTLINES_DIR, DRAFTS_DIR, TOPIC_FILE=knowledge/4-content/topic-clusters.md, BACKLOG_FILE=knowledge/4-content/sprint-backlog.md, PIPELINE_DIR=knowledge/3-pipeline, ANCHOR_INDEX, REVISION_LOG, MEMORY_DIR=.antigravity/memory, INSTINCTS_FILE, INSTINCTS_ARCHIVE, INSTINCTS_SCOPE_DIR=.antigravity/memory/instincts-by-scope, HOST="https://valueinvesting.com.vn" (chỉ để tham khảo, link nội bộ luôn là root-relative). BỎ hết hằng số của DSC (FINAL_DIR/3-finalized, SITEMAP_CACHE, OPEN_ACCOUNT_URL, BLACKLIST, PROPOSALS, SOURCES). Hàm: setup_utf8(); unaccent(s) (đ→d, bỏ dấu NFD, lowercase); compact(s) = unaccent rồi bỏ mọi ký tự không phải [a-z0-9] (để "Chỉ số P/E" và "chỉ số pe" cùng thành "chisope"); tokens(s, stop=STOPWORDS) = trước khi tách, gộp dấu / hoặc . nằm giữa hai ký tự chữ-số (P/E→pe, P/B→pb, EV/EBITDA→evebitda), sau đó tách theo [^a-z0-9]+, bỏ token rỗng, token 1 ký tự và stopword (STOPWORDS chỉnh từ ref: bỏ "dsc"/"kien"/"thuc", giữ các từ chức năng tiếng Việt, thêm "value","investing"); slug_from_path (bỏ tiền tố Draft-/Optimize-/Proposal-/Outline-); read_text/write_text (giữ nguyên kiểu xuống dòng, có utf-8-sig) giống ref. split_frontmatter(text) -> (fm: dict, body_start: int, lines: list[str]): khoá cấp cao nhất khớp `^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$`; giá trị scalar được strip khoảng trắng và một cặp nháy bao ngoài (unescape \" khi là nháy kép); khoá có giá trị rỗng theo sau là các dòng `- item` thụt lề thì thành list[str] (strip nháy); item có dạng `key: value` (faq/citations) giữ nguyên chuỗi thô; dừng ở dòng `---` thứ hai. load_categories() -> dict[slug, {"group": str|None, "path": str}]: đọc SITE_TS, cắt khối từ `export const categories = [` tới `];` đầu tiên, rồi với mỗi `slug: "..."` lấy `path: "..."` và `group: "..."` đầu tiên trước `slug:` kế tiếp (không parse theo dấu ngoặc nhọn, vì description có thể chứa ký tự lạ); cache lại. article_url(category, slug, cats=None) = (cats.get(category.strip().strip('"\'')).path or "/") + slug + "/" — tái tạo đúng getArticlePath, không base. load_articles() -> list[dict(slug, path, fm, body_start, lines, url, category)] cho ARTICLES_DIR/*.md (bỏ qua thư mục images/).

2) scripts/topic_status.py — adapt $REF/scripts/topic_status.py theo format thật đã mô tả trong <interfaces>. Parse: theo dõi cluster (`## CLUSTER Cxx — Tên` → cluster_id "Cxx", tên cluster = phần sau "CLUSTER "; heading `### Con` nối vào thành "Cxx — Tên / Con") và header của bảng hiện tại. Một dòng `|` chỉ là dòng dữ liệu khi header của bảng có cột 2 bắt đầu bằng "Slug" và cột 3 == "Status", và dòng đó không phải dòng phân cách `|---|`. Với mỗi dòng: keyword=cột 1, slug=cột 2 bỏ backtick (nếu chứa "/" thì lấy đoạn path cuối), status=cột 3 bỏ backtick. Dòng hub khớp `^\*\*Hub:\*\*\s*(.+?)\s*\|\s*` + slug path trong backtick + `\|\s*` + status trong backtick → cũng là một row (kind="hub"). Mode: `<slug>` (khớp chính xác slug; nếu không có thì fallback substring, chỉ để hiển thị), `<slug> --set STATUS` (chỉ dùng khớp chính xác; từ 2 dòng khớp trở lên thì exit 1 và liệt kê từng dòng kèm số dòng, trừ khi có `--all` thì cập nhật tất cả; không khớp thì exit 1 kèm hướng dẫn thêm dòng vào cluster phù hợp), `--find TEXT` (khớp nếu unaccent(q) nằm trong unaccent(keyword/slug) HOẶC compact(q) nằm trong compact(keyword/slug); tối đa 30 dòng), `--list STATUS` (không phân biệt hoa thường), `--cluster X` dùng chung với --find/--list (nếu X khớp `^C\d+$` thì so cluster_id chính xác, nên C1 không khớp C10–C19; nếu không thì so substring unaccent trên tên cluster). Bảng output gồm cột: Slug | Keyword | Trạng thái | Cluster | URL | publishDate — URL = article_url nếu tồn tại src/content/articles/<slug>.md, ngược lại "—"; publishDate lấy từ frontmatter của bài. Khi có --cluster thì sort theo publishDate giảm dần (dòng không có ngày xếp cuối), để Link Wheel lấy được "2 bài Finalized gần nhất cùng cluster". Khi --set: chỉ thay nội dung ô status (với dòng bảng thì tách theo `|`, thay ô thứ 3 và giữ nguyên khoảng trắng, giữ backtick; với dòng hub thì thay span status trong backtick cuối cùng), giữ kiểu xuống dòng của file, in `Đã cập nhật slug: old → new (dòng N, cluster)`. VALID_STATUS = Planned, In Progress, Outline-Approved, Drafting, Optimizing, Finalized; status lạ thì in cảnh báo ra stderr nhưng vẫn ghi (giống ref). Sau khi script chạy xong, sửa dòng chú thích trạng thái (dòng 5) của topic-clusters.md để thêm `Optimizing` (thứ tự: Planned | In Progress | Outline-Approved | Drafting | Optimizing | Finalized). Đây là chỉnh sửa tay duy nhất trên file đó.

3) scripts/find_links.py — adapt $REF/scripts/find_links.py. Nguồn chính là load_articles() (frontmatter của src/content/articles); bỏ toàn bộ sitemap-cache, GSC clicks, DSC_KB, logic Slug: của 3-finalized. Phụ: parse anchor-index.md (bảng `| `slug` | Title | `/url/` | anchor |`) thành map slug→anchor, chỉ để gợi ý anchor; URL luôn tính bằng article_url, không lấy URL từ anchor-index. Chế độ tìm kiếm `"keyword" [--top N=8] [--exclude slug] [--json]`: q=tokens(keyword); điểm = 3·|q∩tokens(title)|/|q| + 2·|q∩tokens(slug với "-" đổi thành khoảng trắng)|/|q| + 2·|q∩tokens(tags)|/|q| + 2·|q∩tokens(anchor)|/|q| + 1·|q∩tokens(description + keyTakeaways)|/|q| + 1.5 nếu compact(keyword) nằm trong compact(title) hoặc compact(slug); chỉ giữ điểm > 0; sort theo (-score, slug). Output dạng bảng markdown: # | Anchor gợi ý (anchor từ index, nếu không có thì lấy title bỏ đuôi sau "?" hoặc ":") | URL | Category | Title | Score, kèm ghi chú cuối: chỉ dùng URL root-relative đúng như in ra, anchor đặt tự nhiên trong câu, không dùng "xem thêm"/"tại đây". --json: list các object {slug,url,title,category,anchor,score}. Nếu category của bài không có trong site.ts thì thêm cảnh báo `⚠ category không có trong site.ts` (bài đó sẽ không được build ở đúng route). Chế độ `--backfill <slug> [--top N=5] [--json]`: bài đích phải tồn tại trong ARTICLES_DIR, nếu không thì in lỗi ra stderr và exit 1. Lấy target_url=article_url; core phrase = unaccent của title cắt ở dấu "?"/":" đầu tiên, bỏ đuôi " la gi"/" la ai"/" nhu the nao", rồi gộp dấu / giữa các chữ (P/E→pe); q=tokens(title)|tokens(tags)|tokens(anchor). Với mỗi bài khác: bỏ qua nếu text đã có link tới bài đích (regex `\]\([^)]*/` + re.escape(slug) + `/?\)`, bắt được cả path cũ như /kien-thuc/slug/). Quét các dòng body (sau frontmatter), bỏ dòng trống, heading `#`, bảng `|`, ảnh `!`, blockquote `>`, code fence, `---`; plain = dòng đã bỏ cú pháp link markdown, normalize như trên; hit = 2.0 nếu core xuất hiện trong plain như một từ trọn vẹn (`(?<![a-z0-9])core(?![a-z0-9])`) + |q∩tokens(plain)|/max(1,|q|); giữ dòng tốt nhất nếu hit ≥ 1.0. Sort theo (-hit, filename). Output bảng `| # | Bài nguồn | Dòng | Đoạn gợi ý chèn link |` (excerpt ≤ 160 ký tự, escape |) cộng URL đích. Thêm nhắc nhở: anchor lấy từ chính câu trong bài nguồn, chỉ sửa đúng dòng đã nêu. Không có ứng viên thì exit 0 kèm thông báo.

4) .antigravity/memory/instincts-archive.md — tạo bằng sao chép nguyên byte instincts.md hiện tại (`cp`), KHÔNG sửa nội dung (scope i: nguyên vẹn).

5) scripts/optimize_instincts.py — adapt $REF/scripts/optimize_instincts.py: dùng hằng số từ _common (INSTINCTS_ARCHIVE, INSTINCTS_FILE, INSTINCTS_SCOPE_DIR) làm default cho các tham số CLI mới `--archive`, `--core`, `--scope-dir` (để test bằng fixture), giữ `--max-chars` (450) và `--dry-run`. Giữ nguyên parse_instincts_file ở cấp module (import được, code chạy chỉ nằm dưới `if __name__ == "__main__":`), giữ hằng số ARCHIVE ở cấp module. Giữ dedupe (Jaccard ≥ 0.5, giữ bản mới hơn), trim, categorize, scope_slug và render_scope như ref. LINT_COVERED = [] kèm comment tiếng Anh: điền vào khi có lint script kiểm instinct bằng máy (hiện repo chưa có qa_lint.py). Header của bản render: tiêu đề "# Continuous Learning: Instincts (Bản năng rút gọn)"; ghi là mọi agent đọc file này trước khi viết; bản đầy đủ ở instincts-archive.md; file sinh tự động bởi scripts/optimize_instincts.py, không sửa tay, sau /learn thì ghi vào archive rồi chạy lại script. Chỉ khi có file scope mới thêm dòng "Bản năng theo topic: `instincts-by-scope/<x>.md` — chỉ load khi bài thuộc topic đó". Bỏ hẳn mọi nhắc tới qa_lint khi LINT_COVERED rỗng. An toàn: nếu đường dẫn resolve của --core hoặc --scope-dir trùng/chứa archive thì exit 2 mà không ghi gì; chỉ tạo scope dir khi có instinct scoped; nếu > 8.000 ký tự thì in cảnh báo (exit 0). Sau đó chạy `python3 scripts/optimize_instincts.py` để sinh lại .antigravity/memory/instincts.md (kỳ vọng khoảng 7,2k ký tự, 20 instinct, chưa có thư mục scope vì mọi instinct đều Global).

Kiểm tra thủ công trước khi coi là xong: chạy từng lệnh trong <verify> và đọc lướt output của find_links "quỹ etf" và --backfill pe-la-gi để chắc kết quả có nghĩa (không phải chỉ vì exit 0).
  </action>
  <verify>
    <automated>cd /Users/nguyenvietloc/Documents/investing && (cd scripts && python3 -c "from _common import article_url, load_categories as L; c=L(); assert len(c)==8, c; assert article_url('co-ban','pe-la-gi')=='/phan-tich/co-ban/pe-la-gi/'; assert article_url('reviews','x')=='/reviews/x/'; assert article_url('nha-dau-tu','warren-buffett')=='/nha-dau-tu/warren-buffett/'; assert article_url('khong-co','x')=='/x/'; print('common ok')") && python3 scripts/find_links.py "chỉ số pe" --top 5 | grep -q '/phan-tich/co-ban/pe-la-gi/' && python3 scripts/find_links.py "quỹ etf" --top 5 --exclude etf-la-gi --json | python3 -c "import json,sys; d=json.load(sys.stdin); assert d and all(x['url'].startswith('/') and x['url'].endswith('/') for x in d) and all(x['slug']!='etf-la-gi' for x in d); print('find ok')" && python3 scripts/find_links.py --backfill pe-la-gi --top 5 && (python3 scripts/find_links.py --backfill khong-co-bai-nay >/dev/null 2>&1; test $? -eq 1) && python3 scripts/topic_status.py --find "etf" | grep -q 'etf-la-gi' && python3 scripts/topic_status.py --list Finalized --cluster C7 | grep -q '/dau-tu/etf/etf-la-gi/' && F=knowledge/4-content/topic-clusters.md && T=$(mktemp -d) && cp $F $T/b && python3 scripts/topic_status.py etf-la-gi --set Optimizing && test "$(diff $F $T/b | grep -c '^<')" = 1 && python3 scripts/topic_status.py etf-la-gi --set Finalized && cmp $F $T/b && (python3 scripts/topic_status.py phan-tich-nganh-la-gi --set Drafting; test $? -eq 1) && cmp $F $T/b && grep -q 'Optimizing' $F && git show 55abd30:.antigravity/memory/instincts.md | cmp - .antigravity/memory/instincts-archive.md && python3 scripts/optimize_instincts.py && git show 55abd30:.antigravity/memory/instincts.md | cmp - .antigravity/memory/instincts-archive.md && python3 -c "import sys; sys.path.insert(0,'scripts'); import optimize_instincts as o; a=[i['title'] for i in o.parse_instincts_file(str(o.ARCHIVE)) if i['status'].upper()=='ACTIVE']; c=open('.antigravity/memory/instincts.md',encoding='utf-8').read(); m=[t for t in a if t not in c]; print(len(c),'chars, missing:',m); sys.exit(1 if m or len(c)>8000 else 0)" && S=$(mktemp -d) && printf '### Test scope\n- **Trạng thái:** ACTIVE\n- **Nguồn:** test\n- **Bản năng:** Quy tắc thử nghiệm.\n- **Phạm vi:** Chỉ topic: Vĩ mô\n' > $S/a.md && python3 scripts/optimize_instincts.py --archive $S/a.md --core $S/core.md --scope-dir $S/scope && test -f $S/scope/vi-mo.md && grep -q 'instincts-by-scope/vi-mo.md' $S/core.md && echo TASK1-OK</automated>
  </verify>
  <done>Cả 4 script chạy được trên dữ liệu thật và in TASK1-OK; find_links trả về URL root-relative đúng site.ts; topic_status sửa đúng 1 ô status, round-trip trả file về đúng từng byte; archive giống từng byte bản gốc tại 55abd30 và không bị script đụng tới; instincts.md sinh tự động, ≤ 8.000 ký tự, đủ 20 tiêu đề ACTIVE; fixture tách scope chạy đúng; legend của topic-clusters.md có thêm Optimizing.</done>
</task>

<task type="auto">
  <name>Task 2: Bù file knowledge còn thiếu + sửa tham chiếu gãy ở tài liệu ngoại vi (scope a, j-peripheral)</name>
  <files>knowledge/1-brand/writers/README.md, knowledge/1-brand/writers/educational.md, knowledge/1-brand/writers/analytical.md, knowledge/1-brand/writers/comparison.md, knowledge/raw/intel/dump.md, .gitignore, .antigravity/config/api-keys.example.md, .antigravity/skills/web-serp/SKILL.md, .agents/workflows/setup.md, .agents/workflows/cluster.md, .agents/workflows/image.md, .agents/workflows/keyword-plan.md, .antigravity/agents/visual-architect.md, .antigravity/agents/seo-collector.md, .antigravity/skills/seo-optimization/SKILL.md, .antigravity/internal-templates/4-content/sprint-backlog.md, .antigravity/memory/DECISIONS.md</files>
  <action>
Trước khi viết, đọc knowledge/1-brand/profile.md (mục 2–4: định vị, 3 tính cách Gần gũi/Thành thật/Thực chiến, bảng Tone of Voice, xưng "bạn" + "Value Investing", cấm "chúng tôi"/"mình"/"tôi"/"Quý độc giả"), knowledge/1-brand/personas.md (Persona 1 "Minh Anh" F0 nhân viên văn phòng, Persona 2 "Khoa" sinh viên & F0 tự học, Persona 3 "Hùng" nhà đầu tư trung cấp), knowledge/3-pipeline/anti-ai-rules.md (mục 6 về Tuyên bố miễn trừ trách nhiệm cho bài phân tích/đánh giá tài sản) và .antigravity/memory/instincts-archive.md. KHÔNG bịa thông tin brand ngoài các file đó.

1) knowledge/1-brand/writers/ — adapt 4 file từ $REF/knowledge/1-brand/writers/, giữ cấu trúc của ref (frontmatter name/description; Tổng quan; Tone; Nguyên tắc viết; Cấu trúc câu hay dùng; Câu tránh dùng; Ví dụ đoạn ĐÚNG/SAI tone), nhưng: (a) bỏ mọi chữ DSC, mục "CTA mặc định", chuyên viên, lời mời mở tài khoản; thay bằng mục "Kết bài & bước tiếp theo": kết bằng một hành động áp dụng được ("Đọc xong thì tôi làm được gì?" theo profile.md) cộng 1 link nội bộ tới bài liên quan cùng cluster; KHÔNG dùng chữ "CTA" (trong file này dùng cụm "bước tiếp theo"). (b) Map persona theo personas.md của site: educational → bài "X là gì", khái niệm, how-to cơ bản; Persona 1 + Persona 2; giải thích thuật ngữ ngay trong câu, mỗi khái niệm có 1 ví dụ số "giả sử" ở mức vốn F0. analytical → phân tích kỹ thuật/chỉ báo, chỉ số tài chính, đọc BCTC, định giá; Persona 3 (và F0 đã nắm nền); dùng thuật ngữ chính xác kèm định nghĩa ngắn, công thức viết dạng chữ thường (không LaTeX, theo instinct), luôn nêu giới hạn của tín hiệu và nhắc kết hợp công cụ khác, cấm "chắc chắn tăng/giảm". comparison → so sánh CTCK/quỹ/sản phẩm, "X vs Y", "nên chọn", bài thuộc category `reviews`; Persona 1; bảng tiêu chí trung lập, mọi số phí/lãi suất phải có nguồn chính thức + mốc thời gian hoặc `[CẦN XÁC NHẬN]`, nói "phù hợp với ai" thay vì "tốt nhất". (c) Mỗi profile có mục "YMYL" ngắn: không khuyến nghị mua/bán mã cụ thể, không hứa lợi nhuận, số liệu thị trường phải có nguồn và thời điểm; bài phân tích/đánh giá cổ phiếu/tài sản có Tuyên bố miễn trừ trách nhiệm ở cuối bài theo anti-ai-rules.md (bài kiến thức nền thì không bắt buộc). (d) Ví dụ đúng/sai tone dùng bối cảnh Việt Nam (HOSE, VN30, ETF, lô 100 cổ phiếu) với số giả định có chữ "giả sử" — không được đưa giá/chỉ số thị trường thật chưa kiểm chứng. README.md: bảng chọn profile (Profile | File | Loại bài | Persona chính | Category gợi ý); quy tắc ưu tiên `anti-ai-rules.md` + `glossary.md` + `profile.md` > writer profile; cách khai báo `Writer_Profile: educational | analytical | comparison` trong outline YAML; default `educational` khi outline không khai báo (khớp drafting.md); 4 ví dụ chọn profile lấy từ topic thật của site (ví dụ "RSI là gì" → analytical, "Cổ tức là gì" → educational, "TCBS vs VPS" → comparison, "Báo cáo lưu chuyển tiền tệ" → analytical hoặc educational tuỳ intent). Mỗi file khoảng 2–3,5 KB.

2) knowledge/raw/intel/dump.md — stub theo $REF/knowledge/raw/intel/dump.md: tiêu đề "Intel Dump — Quick Capture", mục đích (30-second Rule trong /outlining), format entry `- [YYYY-MM-DD] [nguồn] — [mô tả 1 dòng] → idea: [góc khai thác]`, dòng `<!-- Thêm entries mới vào đây -->`. Không có entry nào.

3) Bảo mật API key: thêm dòng `.antigravity/config/api-keys.md` vào .gitignore (kèm comment `# Local API keys for content engine scripts`). Sửa .antigravity/config/api-keys.example.md: ưu tiên biến môi trường (`export FIRECRAWL_API_KEY=...` hoặc đặt trong `.env`, file này đã gitignore); cách thay thế là copy thành `.antigravity/config/api-keys.md` (giờ đã thật sự gitignore). Sửa .antigravity/skills/web-serp/SKILL.md (quanh dòng 138) theo cùng nội dung. Không sửa scrape.py.

4) Sửa tham chiếu gãy (chỉ sửa đúng dòng đó, không viết lại cả file): .agents/workflows/setup.md dòng 13 `knowledge/2-market/persona.md` → `knowledge/1-brand/personas.md` (và nhắc `knowledge/1-brand/icp.md` cho ICP). .agents/workflows/cluster.md dòng 11 `knowledge/raw/keyword-hvs.csv` → `knowledge/3-pipeline/keywords.csv` (khớp bảng lệnh trong CLAUDE.md); bước ghi vào topic-clusters.md giữ nguyên, và dặn giữ đúng format bảng `| Keyword | Slug | Status |` + dòng `**Hub:**` để topic_status.py parse được. .agents/workflows/image.md dòng 16 `knowledge/4-content/3-finalized/Final-[slug].md` → `src/content/articles/[slug].md`. .agents/workflows/keyword-plan.md: bước 1 → `python3 scripts/topic_status.py --list Planned` (thêm `--cluster Cxx` để lọc), không đọc cả topic-clusters.md; bước 2 `knowledge/2-market/` → `knowledge/1-brand/personas.md`. .antigravity/agents/visual-architect.md dòng 15 `knowledge/1-brand/visual-brand-guidelines.md` → `.antigravity/skills/seo-image/assets/brand.md` (palette + design language của Value Investing) và `.antigravity/skills/seo-image/assets/styles/`. .antigravity/agents/seo-collector.md dòng 13 (context topic-clusters) → `python3 scripts/topic_status.py --find "[keyword]"` (không load cả file). .antigravity/skills/seo-optimization/SKILL.md dòng 12 → `src/content/articles/[slug].md`. .antigravity/internal-templates/4-content/sprint-backlog.md dòng 15 "moved to `3-finalized/`" → "finalize vào `src/content/articles/`".

5) .antigravity/memory/DECISIONS.md — chỉ append (không sửa dòng cũ) 4 dòng ngày 2026-10-18: bài final ở `src/content/articles/[slug].md` (thay cho `3-finalized/` trong quyết định 2026-05-17), URL tính theo `src/data/site.ts`; tra topic-clusters/anchor-index bằng `scripts/topic_status.py` / `scripts/find_links.py`; instincts tách thành archive (nguồn chân lý) + instincts.md rút gọn sinh bởi `scripts/optimize_instincts.py`; QA tối đa 2 vòng + Cannibalization Gate trước SERP research.
  </action>
  <verify>
    <automated>cd /Users/nguyenvietloc/Documents/investing && for f in README educational analytical comparison; do test -s knowledge/1-brand/writers/$f.md || echo "MISSING writers/$f.md"; done && test -s knowledge/raw/intel/dump.md && test -z "$(grep -rniwE 'dsc|cta' knowledge/1-brand/writers/)" && grep -q 'Writer_Profile' knowledge/1-brand/writers/README.md && grep -q '^\.antigravity/config/api-keys\.md' .gitignore && git check-ignore -q .antigravity/config/api-keys.md && test -z "$(grep -rn -e 'keyword-hvs' -e '2-market/persona' -e 'visual-brand-guidelines' .agents/workflows .antigravity/agents .antigravity/skills)" && test -z "$(grep -n '3-finalized' .agents/workflows/image.md .antigravity/skills/seo-optimization/SKILL.md .antigravity/internal-templates/4-content/sprint-backlog.md)" && grep -q 'topic_status.py' .agents/workflows/keyword-plan.md && grep -q 'topic_status.py' .antigravity/agents/seo-collector.md && grep -q '2026-10-18' .antigravity/memory/DECISIONS.md && echo TASK2-OK</automated>
  </verify>
  <done>Có 4 writer profile với giọng Value Investing (không DSC/CTA, có mục YMYL, persona khớp personas.md); dump.md tồn tại; api-keys.md thật sự được gitignore và tài liệu ưu tiên env var; các tham chiếu keyword-hvs / 2-market/persona / visual-brand-guidelines / 3-finalized trong các file của task này đã hết; keyword-plan và seo-collector dùng topic_status.py; DECISIONS.md có các mục ngày 2026-10-18.</done>
</task>

<task type="auto">
  <name>Task 3: Nối lại pipeline lõi — frontmatter, QA 2 vòng, revision logging, Cannibalization Gate, script và instincts (scope a, b, c, d, e, i-docs, j)</name>
  <files>.agents/workflows/write.md, .agents/workflows/drafting.md, .agents/workflows/outlining.md, .agents/workflows/optimize.md, .agents/workflows/approve.md, .agents/workflows/revise.md, .agents/workflows/learn.md, .agents/workflows/link.md, .antigravity/rules/workflow-integrity.md, .antigravity/agents/quality-guardian.md, .antigravity/skills/qa-qc/SKILL.md, .antigravity/skills/internal-linking/SKILL.md, .antigravity/skills/content-feedback-loop/SKILL.md, .antigravity/skills/seo-outlining/SKILL.md, .antigravity/skills/seo-outlining/references/brief-template.md, .antigravity/skills/seo-drafting/SKILL.md</files>
  <action>
Chỉ sửa đúng chỗ (Edit theo đoạn), giữ giọng và cấu trúc tiếng Việt hiện có, không viết lại cả file. KHÔNG sửa CLAUDE.md (PD-3). Không đụng tới các nhắc DSC/Product Bridge/CRO ngoài các dòng nêu dưới đây (ngoài phạm vi). Dùng nhất quán các câu lệnh sau (CLI do Task 1 tạo): `python3 scripts/topic_status.py --find "[keyword]"`, `python3 scripts/topic_status.py [slug]`, `python3 scripts/topic_status.py [slug] --set "<Status>"`, `python3 scripts/topic_status.py --list Finalized --cluster <Cxx>`, `python3 scripts/find_links.py "[keyword]" --top 6 --exclude [slug]`, `python3 scripts/find_links.py --backfill [slug] --top 5`, `python3 scripts/optimize_instincts.py`. Câu chuẩn cho chỗ load instincts (INST): "`.antigravity/memory/instincts.md` (bản rút gọn, sinh tự động) + `.antigravity/memory/instincts-by-scope/<topic>.md` nếu đầu file instincts.md liệt kê file khớp topic bài". Câu chuẩn cho vòng QA (QA2): "FAIL → sửa đúng các mục FAIL rồi QA lại, **tối đa 2 vòng sửa**. Sau vòng 2 vẫn FAIL → dừng (không tự chạy vòng 3), trình bày bản hiện tại kèm mục `⚠️ Remaining issues` (từng CRITICAL/MAJOR còn lại: mã checklist, số dòng, mô tả). `--auto`: không dừng chờ — đặt `⚠️ Remaining issues` lên đầu báo cáo cuối, ghi 1 dòng revision-log trạng thái `**Cần xử lý**`, vẫn finalize nhưng KHÔNG thêm `factCheckedDate` (PD-2)."

A) .antigravity/rules/workflow-integrity.md: rule 2 thay dòng instincts bằng INST. Rule 4: xác nhận trạng thái bằng `python3 scripts/topic_status.py [slug]` (không mở cả topic-clusters.md). Rule 5 (Inline Revision Logging) ĐÃ CÓ (scope d) — giữ nguyên nội dung, chỉ thêm: ghi một dòng vào bảng `## Nhật ký chỉnh sửa` với trạng thái `**Đang xử lý**`, sửa xong đổi thành `**Hoàn thành**`. Rule 6: giữ ý chính, thêm QA2 và câu "không bao giờ trình bày bản FAIL như thể đã PASS". Thêm rule 7 "Cannibalization Gate": trước SERP research của /outlining và /write phải chạy Bước 0.5 của `.agents/workflows/outlining.md`.

B) .agents/workflows/outlining.md: Bước 0 mục 5 → `topic_status.py --find "[keyword]"` (chỉ đọc), mục 6 → INST. Thêm "Bước 0.5: Cannibalization Gate (trước SERP research)" chỉnh từ $REF/.agents/skills/outlining/SKILL.md Bước 0.5: (1) luôn chạy `python3 scripts/find_links.py "[keyword]" --top 5` (miễn phí, bắt được cả bài mới chưa có dữ liệu GSC); (2) nếu agent có SEO Dashboard MCP: gọi `list_properties` trước, chọn property có chứa `valueinvesting.com.vn` và copy property_url nguyên văn (không hardcode); không có property thì bỏ qua bước MCP; sau đó gọi `query_search_analytics` với property_url đó, `dimensions: ["page"]`, `query_value: "[keyword]"`, `days: 90`, `limit: 10`; (3) quy tắc: có URL Value Investing cùng intent (trong find_links, title/slug nhắm cùng keyword; hoặc trong GSC là page chiếm phần lớn impressions của keyword với vị trí trung bình ≤ 10) → cannibalization. Mặc định / `--step`: DỪNG, đề xuất `/optimize [slug-đó]`, chờ user quyết. `--auto`/`--sprint`: áp dụng PD-1 nguyên văn (không viết mới, không tự optimize, ghi `⚠️ Cannibalization` vào báo cáo cuối, sprint thì chuyển keyword kế tiếp). `--force-new`: bỏ qua lệnh dừng nhưng bắt buộc có `Intent_Boundary:` + link chéo 2 chiều. Khác intent → tiếp tục, ghi `Intent_Boundary:` trong outline YAML và link chéo 2 chiều. Qua gate rồi mới chạy `topic_status.py [slug] --set "In Progress"` (dòng chưa có thì thêm 1 dòng vào bảng của cluster phù hợp theo đúng format, rồi chạy lại). Bước 1 Internal Link Planning → `find_links.py "[keyword]" --top 6 --exclude [slug]`, chọn 2–3 URL, không đọc anchor-index.md. Bước 3: trạng thái `Outlining` (không hợp lệ) → bỏ, vì đã set `In Progress` ở Bước 0.5. Approval gate → `topic_status.py [slug] --set Outline-Approved`. Dòng 30-second Rule giữ nguyên (dump.md giờ đã có).

C) .agents/workflows/write.md: Options thêm `--force-new` (bỏ lệnh dừng của Cannibalization Gate khi user xác nhận viết mới). Bước 0 mục 5 → `topic_status.py --find "[keyword]"` (chỉ đọc, chưa set), mục 6 → INST. Thêm "Bước 1.0 — Cannibalization Gate": chạy đúng Bước 0.5 của `.agents/workflows/outlining.md` (gồm hành vi PD-1 cho --auto/--sprint), qua gate thì `--set "In Progress"`. Approval gate 1 → `--set Outline-Approved`. Bước 2.2 → `find_links.py` (thay "Scan anchor-index.md"), chèn URL root-relative đúng như script in ra. Bước 2.3 → thêm QA2. Approval gate 2 → "Draft + QA report (PASS, hoặc kèm ⚠️ Remaining issues)". Bước 3.1: thay khối "Frontmatter Astro bắt buộc" bằng template đầy đủ khớp CLAUDE.md + `src/content.config.ts` (scope b), theo thứ tự: title, description (~155 ký tự), category, heroImage `"/images/articles/[slug]/[slug].jpg"` (sửa `hero.jpg` cũ, khớp generate-all-covers.mjs), publishDate, updatedDate, readingTime `"X phút đọc"`, featured false, order, tags (list), faq (list question/answer), sources (list), citations (list title + url/publisher/date tuỳ chọn, date dạng YYYY-MM-DD), keyTakeaways (3–5 ý, mỗi ý ≤ 20 từ), dòng comment `# factCheckedDate: "YYYY-MM-DD"  # chỉ thêm khi đã fact-check`. Dưới template thêm ghi chú: category phải khớp `categories[].slug` trong `src/data/site.ts` (hiện có co-phieu, etf, trai-phieu, phai-sinh, co-ban, ky-thuat, reviews, nha-dau-tu — site.ts là nguồn chân lý; sai category thì bài bị loại khỏi build); Q&A chỉ để ở `faq[]` của frontmatter, không để H2 FAQ trong body (theo instinct); bài review chấm điểm thêm các trường review tuỳ chọn (layoutType, reviewType, brokers, companyInfo, accountSteps, officialResources...) theo `src/content.config.ts`. Bước 3.1 cập nhật trạng thái → `topic_status.py [slug] --set Finalized`; thêm: append 1 dòng vào đúng bảng nhóm trong anchor-index.md (chỉ ghi: grep -n heading của nhóm rồi chèn dòng, không đọc cả file). Bước 3.2: instincts → append vào `.antigravity/memory/instincts-archive.md` rồi chạy `python3 scripts/optimize_instincts.py` (không sửa tay instincts.md). Sơ đồ "Luồng Quyết định" thêm nhánh Cannibalization Gate và `--force-new`.

D) .agents/workflows/drafting.md: Bước 0 bỏ dòng `knowledge/1-brand/service-operations.md` (không tồn tại, không áp dụng cho site) và dòng anchor-index.md (thay bằng find_links ở Bước 2), dòng instincts → INST, dòng writers giữ nguyên (giờ đã có file), đánh lại số thứ tự. Kiểm tra Outline-Approved bằng `topic_status.py [slug]`. Đầu Bước 1 → `--set Drafting`. Bước 2: Link Wheel lấy 2 bài Finalized gần nhất bằng `topic_status.py [slug]` (để biết cluster) + `--list Finalized --cluster <Cxx>`; Contextual Insertion bằng `find_links.py`. Bước 3 → QA2. Approval gate → trình bày kèm Remaining issues nếu có.

E) .agents/workflows/optimize.md: Bước 0 bỏ mục 3 service-operations, mục 7 → INST, mục 8 → `src/content/articles/[slug].md`; đánh lại số. Bước 1.1: file gốc ở `src/content/articles/[slug].md`; `topic_status.py [slug] --set Optimizing`; working copy `knowledge/4-content/2-drafts/Optimize-[slug].md` (copy cả frontmatter). Bước 4 mục 2 → INST. Bước 5 → QA2. Gate 2: approve ghi đè lên `src/content/articles/[slug].md`.

F) .agents/workflows/approve.md: Context Load mục 1 → `topic_status.py [slug]`, mục 2 → instincts-archive.md (nơi ghi bài học). Stage Outline → `--set Outline-Approved`. Stage Draft: dòng "Di chuyển file" → `src/content/articles/[slug].md`, bỏ phương án 3-finalized, thêm frontmatter Astro theo template ở write.md Bước 3.1 (khớp CLAUDE.md + `src/content.config.ts`; scope b); `--set Finalized`; anchor-index: giữ bước GHI (append 1 dòng vào đúng bảng nhóm, không đọc cả file); Link Wheel: tìm 2 bài cũ bằng `--list Finalized --cluster <Cxx>`, có thể kiểm thêm bằng `find_links.py --backfill [slug]`. Stage Optimize: ghi đè `src/content/articles/[slug].md` (cập nhật updatedDate), xoá Optimize-/Proposal-, `--set Finalized`.

G) .agents/workflows/revise.md (scope d): Bước 0 mục 2 → INST; mục 4 ghi rõ Final = `src/content/articles/[slug].md`. Thêm "Bước 1.5: Log trước khi sửa (BẮT BUỘC — workflow-integrity rule 5)": append 1 dòng vào cuối bảng dưới `## Nhật ký chỉnh sửa` trong `knowledge/3-pipeline/revision-log.md` (ngay sau dòng cuối của bảng, trước `## Hướng dẫn cập nhật cho Agent`), dạng `| YYYY-MM-DD | `slug` | yêu cầu tóm tắt | hành động dự kiến | **Đang xử lý** |`. Bước 4: sau khi user xác nhận và đã ghi vào file → đổi trạng thái dòng đó thành `**Hoàn thành**` (user bỏ yêu cầu thì `**Huỷ**`).

H) .agents/workflows/learn.md: Context mục 3 → `.antigravity/memory/instincts-archive.md` (lịch sử đầy đủ, để chống trùng); mục 4 → `src/content/articles/[slug].md`. Bước 1/2: bản năng mới APPEND vào archive theo format chuẩn, rồi BẮT BUỘC chạy `python3 scripts/optimize_instincts.py`, báo số ký tự instincts.md mà script in ra; nếu script cảnh báo > 8.000 ký tự thì đề xuất DEPRECATE bớt trong archive (hỏi user trước). Giữ nguyên quy tắc chỉ APPEND.

I) .agents/workflows/link.md: bước 3 → `topic_status.py [slug]` để biết cluster, rồi `--list Finalized --cluster <Cxx>` lấy 2 bài có publishDate gần nhất (bỏ chính bài đó); bước 4 (cross-cluster) → `find_links.py "[chủ đề]" --exclude [slug]`; chỉ dùng URL root-relative do script in ra.

J) .antigravity/agents/quality-guardian.md: Context Loading dòng instincts → INST. Bước 4 Finalization: `2-drafts/` → `src/content/articles/[slug].md` (với frontmatter Astro), trạng thái → `topic_status.py [slug] --set Finalized`. CL7: đọc instincts.md + file scope khớp topic. Quy tắc Re-audit: "Tối đa 3 vòng..." → **Tối đa 2 vòng re-audit**; sau vòng 2 vẫn FAIL → dừng, trình bày kèm `⚠️ Remaining issues` (CRITICAL/MAJOR còn lại + số dòng), không tự chạy vòng 3 (theo $REF quality-guardian dòng ~153); thêm khối `⚠️ Remaining issues` vào template báo cáo.

K) .antigravity/skills/qa-qc/SKILL.md: dòng 33 → INST; Step 3 FAIL → thêm QA2; Step 4: dòng 79 → `src/content/articles/[slug].md`, dòng 80 → `topic_status.py [slug] --set Finalized`.

L) .antigravity/skills/internal-linking/SKILL.md: Link Wheel bước 4 → `--list Finalized --cluster <Cxx>` (đã sort theo publishDate). Contextual Insertion: bước 1 → `find_links.py "[keyword]" --top 6 --exclude [slug]`; bước 3 → dùng URL root-relative (ví dụ `/phan-tich/co-ban/pe-la-gi/`), không dùng đường dẫn file .md, không dùng URL tuyệt đối (Astro tự thêm base khi deploy). Backfill: `find_links.py --backfill [slug] --top 5` (quét src/content/articles, trả về số dòng), chỉ sửa đúng dòng được nêu. Audit: `node scripts/audit-links.mjs` (in báo cáo ra stdout), bỏ link_audit.py + internal-link-dashboard.md.

M) .antigravity/skills/content-feedback-loop/SKILL.md: dòng instincts trong bảng Step 3 → `.antigravity/memory/instincts-archive.md`; tiêu đề "Quy tắc ghi instincts.md" → ghi vào archive (giữ format block); thêm bước: sau khi append thì chạy `python3 scripts/optimize_instincts.py` — script tự dedupe, tách `Phạm vi: Chỉ topic: X` sang `instincts-by-scope/<x>.md`, cảnh báo khi > 8.000 ký tự; không bao giờ sửa tay instincts.md (adapt từ $REF content-feedback-loop dòng 33–43, bỏ phần qa_lint).

N) .antigravity/skills/seo-outlining/SKILL.md Step 1 mục 4 → `find_links.py` (url lấy từ output của script); .antigravity/skills/seo-outlining/references/brief-template.md: các dòng 48/125/132 "anchor-index" → "`python3 scripts/find_links.py`", thêm dòng YAML tuỳ chọn `Intent_Boundary: "[chỉ dùng khi đã có bài cùng chủ đề — ranh giới intent]"` cạnh `Internal_Links`. .antigravity/skills/seo-drafting/SKILL.md: 2.3 mục 3 giữ bước GHI anchor-index (append, không đọc cả file), mục 4 → `topic_status.py [slug] --set Finalized`; 2.4 → ghi vào instincts-archive.md rồi chạy optimize_instincts.py.

Self-check sau khi sửa: chạy lệnh trong <verify>; đọc lại Bước 0.5 của outlining.md và Bước 1.0 của write.md để chắc PD-1 không mâu thuẫn với "--auto chạy end-to-end".
  </action>
  <verify>
    <automated>cd /Users/nguyenvietloc/Documents/investing && python3 -c "import re,glob,pathlib; fs=[f for f in glob.glob('.agents/workflows/*.md')+glob.glob('.antigravity/**/*.md',recursive=True) if '/memory/' not in f]; pat=re.compile('\x60((?:knowledge|src|scripts|[.]antigravity|[.]agents|public)/[^\x60 ]+)\x60'); bad=[(f,p) for f in fs for p in pat.findall(open(f,encoding='utf-8').read()) if not any(c in p for c in '[]*{}\x3c\x3e') and p not in ('.antigravity/config/api-keys.md',) and not pathlib.Path(p.rstrip('.,;:)')).exists()]; print('broken:',bad); raise SystemExit(1 if bad else 0)" && test -z "$(grep -rn '3-finalized' .agents/workflows .antigravity/agents .antigravity/rules .antigravity/skills .antigravity/internal-templates .antigravity/hooks | grep '\.md:')" && test -z "$(grep -rn -e 'service-operations' -e 'internal-link-dashboard' .agents/workflows .antigravity/agents .antigravity/skills .antigravity/rules | grep '\.md:')" && for f in .agents/workflows/write.md .agents/workflows/drafting.md .agents/workflows/optimize.md .antigravity/rules/workflow-integrity.md .antigravity/agents/quality-guardian.md .antigravity/skills/qa-qc/SKILL.md; do grep -q 'Remaining issues' $f && grep -qi 'tối đa 2 vòng' $f || echo "QA2 MISSING $f"; done | (! grep .) && test -z "$(grep -n 'Tối đa 3 vòng' .antigravity/agents/quality-guardian.md)" && python3 -c "import re; t=open('.agents/workflows/write.md',encoding='utf-8').read(); b=t.split('Frontmatter Astro bắt buộc',1)[1]; b=b[b.index('---'):][:4000]; ks=['title','description','category','heroImage','publishDate','updatedDate','readingTime','featured','order','tags','faq','sources','citations','keyTakeaways','factCheckedDate']; m=[k for k in ks if not re.search('(?m)^#?[ ]*'+k+':',b)]; print('missing fm keys:',m); raise SystemExit(1 if m else 0)" && grep -q 'list_properties' .agents/workflows/outlining.md && grep -q 'query_search_analytics' .agents/workflows/outlining.md && grep -q 'Cannibalization' .agents/workflows/write.md && grep -q -- '--force-new' .agents/workflows/write.md && grep -q 'revision-log.md' .agents/workflows/revise.md && grep -q 'Đang xử lý' .agents/workflows/revise.md && test "$(grep -l 'topic_status.py' .agents/workflows/write.md .agents/workflows/drafting.md .agents/workflows/outlining.md .agents/workflows/optimize.md .agents/workflows/approve.md .agents/workflows/link.md | wc -l | tr -d ' ')" = 6 && test "$(grep -l 'find_links.py' .agents/workflows/write.md .agents/workflows/drafting.md .agents/workflows/outlining.md .antigravity/skills/internal-linking/SKILL.md .antigravity/skills/seo-outlining/SKILL.md | wc -l | tr -d ' ')" = 5 && test -z "$(grep -rn -e 'Scan .*anchor-index' -e 'Đọc .*anchor-index' .agents/workflows .antigravity/skills .antigravity/agents | grep '\.md:')" && grep -q 'optimize_instincts.py' .antigravity/skills/content-feedback-loop/SKILL.md && grep -q 'instincts-archive.md' .agents/workflows/learn.md && grep -q 'instincts-by-scope' .agents/workflows/write.md && grep -q 'audit-links.mjs' .antigravity/skills/internal-linking/SKILL.md && git diff --quiet -- CLAUDE.md src/ && echo TASK3-OK</automated>
  </verify>
  <done>Lệnh quét đường dẫn trả về `broken: []`; không còn 3-finalized / service-operations / internal-link-dashboard trong tài liệu pipeline; 6 file có QA2 + ⚠️ Remaining issues; quality-guardian hết "3 vòng"; template frontmatter ở write.md đủ 15 trường; outlining/write có Cannibalization Gate (list_properties → query_search_analytics + find_links, PD-1, --force-new); revise log trước khi sửa; 6 workflow dùng topic_status.py, 5 tài liệu dùng find_links.py, không còn bước đọc cả anchor-index; learn/feedback-loop ghi vào archive rồi chạy optimize_instincts.py; CLAUDE.md và src/ không bị đụng tới; in TASK3-OK.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| CLI args → scripts | Keyword/slug do agent hoặc user nhập được đưa vào regex và tra file |
| scripts → knowledge files | topic_status.py ghi vào topic-clusters.md; optimize_instincts.py ghi vào instincts.md |
| repo → git remote | File cấu hình chứa API key có thể bị commit nhầm |
| SEO Dashboard MCP → agent | Dữ liệu GSC read-only đi vào quyết định chặn viết bài |
| auto pipeline → site công khai (YMYL) | Bài finalize khi chưa qua hết QA |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-261018-01 | Tampering | topic_status.py --set | mitigate | --set chỉ dùng khớp slug chính xác; nhiều dòng khớp thì exit 1 trừ khi có --all; chỉ thay nội dung ô status; giữ kiểu xuống dòng; được kiểm bằng round-trip `cmp` trong verify của Task 1 |
| T-261018-02 | Tampering / mất dữ liệu | optimize_instincts.py vs instincts-archive.md | mitigate | Archive chỉ được đọc; exit 2 nếu --core/--scope-dir trỏ vào archive; archive là bản copy nguyên byte, verify bằng `git show 55abd30:… \| cmp` trước và sau khi chạy script |
| T-261018-03 | Information Disclosure | .antigravity/config/api-keys.md | mitigate | Thêm vào .gitignore (kiểm bằng `git check-ignore`); tài liệu ưu tiên env var / `.env` (đã gitignore) |
| T-261018-04 | Tampering (injection) | regex trong find_links/topic_status | mitigate | Mọi chuỗi từ user đi qua re.escape; không subprocess/eval/shell/network; chỉ dùng stdlib |
| T-261018-05 | Tampering | find_links.py đọc src/content/articles | accept | Chỉ đọc; --backfill chỉ gợi ý dòng, không ghi file |
| T-261018-06 | Information Disclosure | SEO Dashboard MCP | accept | Tool read-only, property tra động qua list_properties (không hardcode), dữ liệu chỉ ở trong session |
| T-261018-07 | Repudiation / integrity (YMYL) | --auto finalize khi QA còn FAIL | mitigate | `⚠️ Remaining issues` lên đầu báo cáo cuối + dòng revision-log `**Cần xử lý**` + không thêm factCheckedDate (PD-2) |
| T-261018-08 | Tampering (nội dung trùng intent) | /write --auto với keyword bị cannibalization | mitigate | PD-1: không viết bài mới, không tự chạy optimize; muốn viết vẫn phải dùng --force-new |
| T-261018-SC | Tampering | cài package | accept | Không cài package nào (chỉ stdlib Python, Node scripts có sẵn) — không cần gate legitimacy |
</threat_model>

<verification>
Chạy lần lượt 3 lệnh `<automated>` của Task 1 → 2 → 3; mỗi lệnh phải kết thúc bằng TASK1-OK / TASK2-OK / TASK3-OK. Sau đó:
- `git status --short` chỉ có các file thuộc files_modified (cộng SUMMARY); không có thay đổi trong `src/` hay `CLAUDE.md`.
- `python3 scripts/optimize_instincts.py --dry-run` báo ≤ 8.000 ký tự.
- Không cần `npm run build` (không đụng src/).
</verification>

<success_criteria>
- Agent chạy /write, /outlining, /drafting, /optimize, /approve, /revise, /learn, /link không còn bị dẫn tới file không tồn tại (quét đường dẫn trả về rỗng).
- Tra trạng thái topic và link nội bộ bằng script (vài trăm byte output) thay vì load topic-clusters.md (28 KB) và anchor-index.md (25 KB).
- instincts.md giảm từ 11.443 ký tự xuống ≤ 8.000 ký tự, giữ đủ 20 tiêu đề ACTIVE; lịch sử đầy đủ nằm nguyên trong instincts-archive.md.
- Frontmatter mẫu đúng schema Astro; QA tối đa 2 vòng; có Cannibalization Gate; revision logging trước khi sửa — mỗi mục đều có grep gate đi kèm.
</success_criteria>

<output>
Tạo `.planning/quick/261018-mla-toi-uu-content-pipeline-theo-dsc-content/261018-mla-SUMMARY.md` khi hoàn thành. SUMMARY cần ghi: các quyết định PD-1/PD-2/PD-3; các điểm drift để user tự xử lý (CLAUDE.md liệt kê `quy-dau-tu` mà site.ts không có; profile.md liệt kê `dinh-gia`/`quy-dau-tu`; CLAUDE.md block frontmatter thiếu `heroImage`; còn sót DSC ở quality-guardian CL7 "Môi giới 1:1", optimize.md "Product Bridge DSC", 1 instinct trong archive nhắc DSC; `.antigravity/skills/internal-linking/scripts/link_audit.py` và `seo-optimization/evals/evals.json` đã chết). Commit message kết thúc bằng dòng `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
</output>
