# Rule: Workflow Integrity

1.  **Phase-Gate Protocol**: Never skip phases. Every task must follow: `Research -> Outline -> User Approve -> Draft -> QA -> User Approve -> Finalize -> Learn`.
    *   **Research Requirement**: Must use `.antigravity/skills/web-serp/SKILL.md` (Jina AI) for SERP lookup and competitor extraction. Do not use browser directly. Do not rely on snippets.

2.  **Mandatory Context Loading**: Before starting ANY phase or agent, load the full context set:
    *   `knowledge/1-brand/profile.md`
    *   `knowledge/3-pipeline/anti-ai-rules.md`
    *   `knowledge/3-pipeline/glossary.md`
    *   `.antigravity/memory/instincts.md` (bản rút gọn, sinh tự động) + `.antigravity/memory/instincts-by-scope/<topic>.md` nếu đầu file instincts.md liệt kê file khớp topic bài
    *   **Agent-specific files** as listed in each agent's "Context Loading" block.
    *   **Failure to load context = Invalid execution.** Stop and load before proceeding.

3.  **No Hallucinations**: All interest rates, market data, and facts must be grounded in SERP or Knowledge Base. If data is missing, STOP and ask the user.

4.  **Mandatory Approval Gates**: 
    *   Do not proceed to Drafting without a clear `/approve` on the Outline.
    *   Do not Finalize without a clear `/approve` on the Draft.
    *   After each gate, confirm the state update with `python3 scripts/topic_status.py [slug]` (không mở cả `topic-clusters.md`) before moving on.

5.  **Inline Revision Logging**: Bất cứ khi nào user yêu cầu sửa nội dung trong chat (VD: "sửa đoạn này", "đổi câu kia"), agent phải **log ngay** vào `knowledge/3-pipeline/revision-log.md` trước khi thực hiện sửa. Không chờ đến `/approve` mới ghi.
    *   Cách ghi: thêm 1 dòng vào cuối bảng dưới `## Nhật ký chỉnh sửa` với trạng thái `**Đang xử lý**`; sửa xong (user xác nhận) đổi thành `**Hoàn thành**`.

6.  **Quality Guardian is Non-Negotiable**: Every draft must go through QA before being presented to the user. FAIL → sửa đúng các mục FAIL rồi QA lại, **tối đa 2 vòng sửa**. Sau vòng 2 vẫn FAIL → dừng (không tự chạy vòng 3), trình bày bản hiện tại kèm mục `⚠️ Remaining issues` (từng CRITICAL/MAJOR còn lại: mã checklist, số dòng, mô tả). `--auto`: không dừng chờ — đặt `⚠️ Remaining issues` lên đầu báo cáo cuối, ghi 1 dòng revision-log trạng thái `**Cần xử lý**`, vẫn finalize nhưng KHÔNG thêm `factCheckedDate` (chỉ thêm khi đã fact-check).
    *   Không bao giờ trình bày bản FAIL như thể đã PASS.

7.  **Cannibalization Gate**: Trước SERP research của `/outlining` và `/write`, bắt buộc chạy Bước 0.5 của `.agents/workflows/outlining.md` (find_links + SEO Dashboard MCP). Có bài Value Investing cùng intent → không viết bài mới; xử lý theo đúng hướng dẫn ở Bước 0.5 (mặc định dừng đề xuất `/optimize`, `--auto` ghi cảnh báo vào báo cáo cuối, `--force-new` khi user xác nhận).
