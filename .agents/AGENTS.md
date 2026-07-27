# Project Rules for Value Investing

## 📸 Cover Image & Hero Image Rules (MANDATORY)

To maintain consistent branding and avoid low-quality or irrelevant visual assets:

1. **DO NOT download cover images (Hero Images) from Unsplash.**
   - Unsplash images are ONLY permitted as inline images within the body of an article (e.g. `inline-01.jpg`).
   - All article cover images must be generated from HTML templates using Playwright.

2. **Template Selection**:
   - **Comparison Articles** (`reviewType: comparison`): Fill `.antigravity/skills/seo-image/assets/templates/comparison-cover.html` and save it to `knowledge/4-content/2-drafts/[slug]-cover.html` before rendering.
   - **Company Reviews** (`reviewType: company`): Fill `knowledge/4-content/2-drafts/company-cover-template.html` and save it to `knowledge/4-content/2-drafts/[slug]-cover.html` before rendering.
   - **Standard Articles** (All other articles): Do not create a custom cover HTML. The script automatically renders the general template `article-cover-template.html`.

3. **Cover Generation Command**:
   - After completing the draft and outline approval, generate the cover image by running:
     ```bash
     node scripts/generate-all-covers.mjs [slug]
     ```
   - This script generates `public/images/articles/[slug]/[slug].jpg` and automatically updates the article's frontmatter to:
     ```yaml
     heroImage: "/images/articles/[slug]/[slug].jpg"
     ```
   - Make sure no legacy `hero.jpg` files remain in the article's image folder.
