# Phase 2: EEAT Data Model & Schema Extensions - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-12
**Phase:** 2-EEAT Data Model & Schema Extensions
**Areas discussed:** Author model, Citations shape, Key Takeaways, Refactor scope, ReviewedBy field, Author fields

---

## Author model

| Option | Description | Selected |
|--------|-------------|----------|
| Mảng nhiều tác giả, scaffold sẵn cho tương lai | authors.ts export array Author[], scaffold cho reviewer/multi-author sau này | |
| Single author object, đơn giản | Chỉ export 1 object Author duy nhất, đủ field hơn site.authorProfile | (free-text override) |

**User's choice:** Free-text — "Website cá nhân chỉ có tôi là tác giả thôi" → single author object (D-01).
**Notes:** Confirms single-author scope; no multi-author/reviewer scaffold needed.

---

## Citations shape

| Option | Description | Selected |
|--------|-------------|----------|
| Structured objects | citations: [{ title, url?, publisher?, date? }], sources giữ nguyên | ✓ |
| Giữ string[] như sources hiện tại | citations: string[] tương tự sources | |

**User's choice:** Structured objects (Recommended).
**Notes:** Enables Citation box (Phase 3) to render links/dates separately. `sources` field unchanged.

---

## Key Takeaways

| Option | Description | Selected |
|--------|-------------|----------|
| Frontmatter array, optional, fallback parse markdown | keyTakeaways: string[] optional; Phase 3 component falls back to `## Key takeaways` markdown section if empty | ✓ |
| Chỉ thêm field frontmatter, không quan tâm markdown section | keyTakeaways: string[] optional default []; markdown parsing left to Phase 4 backfill | |

**User's choice:** Frontmatter array, optional, fallback parse markdown (Recommended).
**Notes:** Matches existing 21 articles which all have `## Key takeaways` markdown sections but no frontmatter field.

---

## Refactor scope

| Option | Description | Selected |
|--------|-------------|----------|
| Refactor nhẹ ngay trong Phase 2 | Create authors.ts AND update AuthorBox.astro/site.ts to read from it | ✓ |
| Chỉ tạo data file, không sửa component | Create authors.ts only; refactor AuthorBox deferred to Phase 3/4 | |

**User's choice:** Refactor nhẹ ngay trong Phase 2 (Recommended).
**Notes:** Avoids duplication immediately; satisfies Success Criteria #3.

---

## ReviewedBy field

| Option | Description | Selected |
|--------|-------------|----------|
| factCheckedDate thôi, bỏ reviewedBy | Add factCheckedDate (date, optional); drop reviewedBy entirely | ✓ |
| Giữ cả hai, reviewedBy optional string để dùng sau | Add both reviewedBy (optional string) and factCheckedDate | |

**User's choice:** factCheckedDate thôi, bỏ reviewedBy (Recommended).
**Notes:** Single-author solo blog — no separate reviewer needed.

---

## Author fields

| Option | Description | Selected |
|--------|-------------|----------|
| Bộ đầy đủ EEAT | name, slug, role, bio, credentials[], experience, expertise[], avatar?, socialLinks? | ✓ |
| Tối thiểu, mở rộng sau nếu cần | name, slug, role, bio, expertise[] only | |

**User's choice:** Bộ đầy đủ EEAT (Recommended).
**Notes:** Avoids adding new fields to authors.ts during Phase 3/4.

---

## Claude's Discretion

- Concrete values for `credentials`, `experience`, `avatar`, `socialLinks` — reasonable placeholders if real data not yet available.
- Export shape of `authors.ts` (single object vs. named export ready for future array expansion).
- AuthorBox.astro markup/styling unchanged — only data source swapped.

## Deferred Ideas

None — discussion stayed within phase scope. Backfill for 21 articles (EEAT-10) and `/author/[slug]` page (EEAT-06) remain Phase 4 per roadmap.
