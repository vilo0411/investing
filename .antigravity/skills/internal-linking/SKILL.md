---
name: Internal Linking & Audit
description: >
  Use this skill when the user needs to build a strong internal link architecture 
  or audit the health of existing links. It ensures that the content ecosystem 
  is interconnected, boosting SEO authority and user navigation.
---

# Skill: Internal Linking & Audit

## 🛠️ Procedures

### Mode: Link Wheel (BẮT BUỘC — chạy trước mọi mode khác)
> Luật khép vòng deterministic. Nguồn chân lý: `knowledge/3-pipeline/link-wheel.md`.

1. **Đọc `category`** ở frontmatter bài đang xử lý.
2. **Tra 2 trục** trong bảng mapping của `link-wheel.md`: Hub định nghĩa + bài "cách đầu tư".
3. **Bắt buộc chèn 2 link** tới 2 nan hoa đó (anchor tự nhiên, wrap cụm có sẵn, giữa/cuối bài).
   - Nếu bài CHÍNH LÀ một nan hoa → bỏ qua nan hoa đó, chỉ link sang nan hoa còn lại.
   - **Chỉ link tới bài `Finalized`** — không bao giờ link slug `Planned` (tránh 404).
4. **Vành bánh xe (BẮT BUỘC)**: lấy **2 bài `Finalized` gần nhất cùng cluster** (theo `publishDate`, tra `topic-clusters.md`) → chèn 2 link trỏ tới chúng. Đây là cơ chế bài mới luôn nối bài viết hôm trước.
5. **Khép vành 2 chiều (BẮT BUỘC)**: mở đúng 2 bài ở bước 4, chèn vào mỗi bài 1 anchor trỏ ngược lên bài mới. Bài cũ A và bài mới B nối nhau cả hai chiều.

### Mode: Contextual Insertion (During Drafting)
1. **Identify Targets**: Scan `knowledge/3-pipeline/anchor-index.md` for pages relevant to the current topic.
2. **Find Opportunities**: Look for natural mentions of target keywords in the draft.
3. **Insert Links**: Use relative paths (e.g., `../3-finalized/Final-slug.md`) and approved anchor text variations.

### Mode: Backfill (After Publishing)
1. **Source Search**: Scan `knowledge/4-content/3-finalized/` for old articles that could link TO the new article.
2. **Update**: Append links to old articles without breaking the flow.

### Mode: Audit (Health Check)
1. **Execute Script**: Run `python .antigravity/skills/internal-linking/scripts/link_audit.py`.
2. **Analyze Dashboard**: Review `knowledge/3-pipeline/internal-link-dashboard.md`.
3. **Fix Issues**: Address "Over-optimized" or "Under-linked" pages.

---

## 🚦 Success Assertions
- [ ] Every new post has at least 2 outgoing internal links.
- [ ] No broken links (404) or dead-end pages.
- [ ] Anchor texts are varied (Exact vs. Partial vs. Title).

---

## ⚠️ Gotchas
- **Generic Anchors**: Avoid "click here" or "read more". *Use descriptive keywords.*
- **Circular Links**: Page A linking to Page B, and Page B linking back to Page A in the same context.
- **Link Stuffing**: Too many links in a single paragraph. *Limit to 1 link per 100-150 words.*
