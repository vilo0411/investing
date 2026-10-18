# Skill: Content Feedback Loop (Learning & Synthesis)

This skill is the "Brain" of the project. It ensures that the system never makes the same mistake twice by analyzing the history of user feedback and manual revisions.

## 🛠️ Execution Strategy: Analyze-Synthesize-Update

This skill is triggered after the FINAL `/approve` of an article.

### Step 1: Historical Audit (Multi-version Analysis)
1. **Gather Data**: Retrieve all versions of the draft (v1, v2, v3...) and the corresponding User Feedback for the current article.
2. **Diff Analysis**: Identify consistent manual changes made by the user or requested in feedback.
3. **Pattern Recognition**:
   - What words/phrases does the user consistently remove?
   - What structure/tone does the user consistently ask for?
   - What factual corrections were made?

### Step 2: Synthesis of Rules
1. **Rule Generation**: Convert identified patterns into actionable instructions.
   - Example: "User removed 'Trong kỷ nguyên số' 3 times" -> Rule: Add to `Anti_AI_Flags`.
   - Example: "User asked for more 'Specific Statistics' in every H2" -> Rule: Update `brief-template.md` requirements.
2. **Persona Update**: Adjust the writing persona if the feedback relates to Tone (e.g., "Too formal").

### Step 3: Knowledge Base Update

Ghi vào **đúng file** theo loại bài học:

| Loại bài học | Ghi vào | Điều kiện |
| :--- | :--- | :--- |
| Pattern lặp ≥ 2 bài (từ/cụm từ cụ thể) | `knowledge/3-pipeline/anti-ai-rules.md` | Chỉ append, không overwrite |
| Judgment call, cách tiếp cận, ngữ cảnh cụ thể | `.antigravity/memory/instincts-archive.md` (rồi chạy script đồng bộ `instincts.md`) | Ngay sau mỗi /approve, kể cả 1 lần |
| Raw event (bài nào, ngày nào, sửa gì) | `knowledge/3-pipeline/revision-log.md` | Luôn luôn ghi |

**Quy tắc ghi bộ nhớ bản năng (Instincts Memory):**
1. **Ghi đầy đủ vào archive:** append bản năng mới (đủ metadata) vào cuối `.antigravity/memory/instincts-archive.md` theo format chuẩn. Archive là nguồn chân lý — chỉ append, không xoá; muốn bỏ bản năng cũ thì đổi `Trạng thái` thành `DEPRECATED` (hỏi user trước).
```
### [Tên ngắn gọn]
- **Trạng thái:** ACTIVE
- **Nguồn:** [slug bài viết hoặc "Global feedback"]
- **Phản hồi từ User:** "[Quote phản hồi gốc]"
- **Bản năng:** [Quy tắc hành động cụ thể]
- **Phạm vi:** [Global / Chỉ topic: X]
```
2. **Đồng bộ bản rút gọn:** chạy `python3 scripts/optimize_instincts.py`. Script tự dedupe tiêu đề gần trùng (giữ bản mới hơn), tách bản năng có `Phạm vi: Chỉ topic: X` sang `.antigravity/memory/instincts-by-scope/<x>.md`, và cảnh báo khi `instincts.md` vượt 8.000 ký tự (khi đó đề xuất DEPRECATE bớt trong archive). **Không bao giờ sửa tay `instincts.md`** — mọi thay đổi đi qua archive.
3. **Phạm vi:** bản năng chỉ đúng cho một nhóm bài (ví dụ phân tích kỹ thuật, review CTCK) thì ghi `Phạm vi: Chỉ topic: X` thay vì `Global`, để không làm phình `instincts.md` mà mọi bài đều phải load.

4. **Report to User**: Báo cáo tóm tắt: *"Đã học X bài học mới — Y rule mới vào anti-ai-rules, Z bản năng mới vào instincts."*

## 🚦 Triggers
- Triggered automatically after a final `/approve` command.
- Can be triggered manually with `/learn [article_path]` to analyze a specific history.

## ⚠️ Critical Rule
- **No Over-generalization**: A one-time correction might be topic-specific. Only synthesize into a "General Rule" if the pattern is repeated or explicitly stated as a global preference.
