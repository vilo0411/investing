# CLAUDE.md — ValueInvesting.com.vn

SEO content production engine cho dự án đầu tư cá nhân tại Việt Nam.

---

## ⚖️ Project Rules

All operations must strictly follow the rules defined in:
- [.antigravity/rules/workflow-integrity.md](.antigravity/rules/workflow-integrity.md)
- [.antigravity/rules/file-naming-standards.md](.antigravity/rules/file-naming-standards.md)
- [.antigravity/rules/content-anti-ai.md](.antigravity/rules/content-anti-ai.md)
- [.antigravity/rules/seo-formatting.md](.antigravity/rules/seo-formatting.md)
- [.antigravity/rules/learning-loop.md](.antigravity/rules/learning-loop.md)

---

## 🔄 Mandatory Context Protocol

> Mọi agent/skill phải load context sau **trước tiên** — không có exception:
> 1. `knowledge/1-brand/profile.md`
> 2. `knowledge/3-pipeline/anti-ai-rules.md`
> 3. `knowledge/3-pipeline/glossary.md`
> 4. `.antigravity/memory/instincts.md`
> 5. _(Agent-specific files theo từng agent's Context Loading block)_

## ✍️ Content Edit Rule

> **Bất kỳ khi nào được yêu cầu sửa / viết lại / chỉnh đoạn trong `knowledge/4-content/` hoặc `src/content/articles/`**, dù là slash command hay chat tự do, đều phải:
> 1. Đọc `knowledge/3-pipeline/anti-ai-rules.md` trước khi viết bất kỳ dòng nào
> 2. Đọc `.antigravity/memory/instincts.md` để tránh lặp lỗi cũ
> 3. Chạy Self-Audit Checklist trên bản sửa trước khi trình bày
>
> **Không có exception.**

---

## 🤖 Sub-Agent Architecture

| Sub-Agent | Instructions | Responsibility |
| :--- | :--- | :--- |
| **SEO Collector** | `.antigravity/agents/seo-collector.md` | SERP research + Content Brief |
| **Brand Guardian** | `.antigravity/agents/brand-guardian.md` | Brand audit & Style enforcement |
| **Quality Guardian** | `.antigravity/agents/quality-guardian.md` | Independent QA/QC |
| **Research Agent** | `.antigravity/agents/research-agent.md` | Build Knowledge Base |
| **Visual Architect** | `.antigravity/agents/visual-architect.md` | Image strategy & prompts |

---

## ⌨️ Slash Commands

| Command | Workflow File | Description |
| :--- | :--- | :--- |
| `/write [keyword]` | `.agents/workflows/write.md` | Full Pipeline — Outline → Draft → Finalize vào `src/content/articles/` |
| `/outlining [keyword]` | `.agents/workflows/outlining.md` | Phase 1 & 2 — Research SERP + Expert Outline |
| `/drafting [slug]` | `.agents/workflows/drafting.md` | Phase 3 — Chuyển Outline thành Draft + QA |
| `/approve` | `.agents/workflows/approve.md` | Phê duyệt stage hiện tại |
| `/revise [slug]` | `.agents/workflows/revise.md` | Sửa đoạn / section cụ thể |
| `/optimize [path]` | `.agents/workflows/optimize.md` | Re-optimize bài cũ với 7 Sweeps Framework |
| `/learn [slug?]` | `.agents/workflows/learn.md` | Tổng hợp feedback → cập nhật rules + instincts |
| `/image [slug]` | `.agents/workflows/image.md` | Tạo chiến lược hình ảnh |
| `/link` | `.agents/workflows/link.md` | Backfill internal links từ bài cũ sang bài mới |
| `/cluster` | `.agents/workflows/cluster.md` | Keyword Clustering từ `knowledge/3-pipeline/keywords.csv` |
| `/keyword-plan [N]` | `.agents/workflows/keyword-plan.md` | Chọn N bài nên viết tiếp từ cluster map |
| `/setup` | `.agents/workflows/setup.md` | Build Knowledge Base lần đầu (chạy 1 lần) |

---

## 📂 Workspace Structure

```text
.antigravity/           # [ENGINE] Logic, Agents, Skills, Memory
├── agents/             # Sub-agent personas
├── rules/              # Master rules
├── skills/             # Execution logic (outlining, drafting, QA, linking...)
└── memory/             # instincts.md, DECISIONS.md

knowledge/              # [BRAIN] Strategy & staging
├── 1-brand/            # Profile, personas, writers, ICP
├── 2-market/           # Market landscape, competitors
├── 3-pipeline/         # anti-ai-rules, glossary, keywords.csv, anchor-index
├── 4-content/          # Staging: 1-outlines → 2-drafts (xóa khi finalize)
└── raw/intel/          # Raw research dumps

src/content/articles/   # [OUTPUT] Bài finalized → Astro build
```

---

## 🔀 Content Flow (Astro-specific)

```
keyword
  → knowledge/4-content/1-outlines/[slug].md     (/outlining)
  → knowledge/4-content/2-drafts/Draft-[slug].md  (/drafting)
  → src/content/articles/[slug].md                (/approve — với Astro frontmatter)
```

**Astro frontmatter bắt buộc khi finalize:**
```yaml
---
title: ""
description: ""        # ~155 ký tự
category: ""           # slug của category
publishDate: "YYYY-MM-DD"
updatedDate: "YYYY-MM-DD"
readingTime: "X phút đọc"
featured: false
order: 1
sources:
  - ""
---
```

---

## Output bằng tiếng Việt, code comments bằng English
