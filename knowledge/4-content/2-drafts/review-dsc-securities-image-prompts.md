# Image Prompts — review-dsc-securities

> reviewType: `company` | Hero đã có (`public/images/articles/review-dsc-securities/hero.jpg`).
> Cần bổ sung **1 ảnh inline** cho thân bài (hiện đang thiếu).

## 📸 Manifest
- `featured-01` (inline) → đặt sau H2 **"Đánh giá chi tiết DSC Securities"** — style: editorial-photo

**Markdown chèn (sau khi có file ảnh):**
```
![Bàn làm việc tối giản đánh giá ứng dụng giao dịch của công ty chứng khoán DSC](./images/review-dsc-securities/featured-01.jpg)
*Ảnh minh họa: Value Investing*
```
→ File ảnh lưu tại: `src/content/articles/images/review-dsc-securities/featured-01.jpg`

---

## Gemini Prompt — featured-01 (inline)

```
[BRAND] {
  name: Value Investing
  voice: trustworthy, calm, editorial — "Investopedia phong cách Việt Nam"
  design-language: Neo-Brutalist Minimalism — premium editorial finance
  palette: { pine: #2A625A, paper: #FDFCF8, ink: #121212, mint: #B4EEE3, lilac: #E2D5F3, peach: #FFDBD0 }
  gradient: none — flat colors only
  shape-language: sharp corners (0px radius), 1px solid ink borders, hard-edged offset shadows (never blurred)
  mood: premium editorial, architectural, "financial ledger" precision
  forbidden: [red, soft shadows/blur/glow, rounded corners, gradients, glassmorphism, neon, stock-photo clichés]
}

[IMAGE]
type:    inline
size:    800 × 500 px
ratio:   8:5
purpose: visual metaphor for section "Đánh giá chi tiết DSC Securities"
output:  single image — no collage, no border, no frame

[STYLE: editorial-photo] {
  ref: Kinfolk + The Economist + Vietcetera editorial photography
  objects: { type: calm minimal desk — smartphone on a stand, paper notebook, no people; dof: shallow f/2.0 soft bokeh }
  color-grade: { shadows: ink #121212 neutral, mids: warm paper #FDFCF8, accent: Deep Pine #2A625A on notebook cover }
  lighting: natural side window light, soft afternoon warmth, ink-tinted shadows
  grain: 6–8% film, slight vignette
}

[SCENE] {
  subject: an organized minimal desk evaluating a stock-broker mobile app — a smartphone on a stand showing an abstract dashboard of plain geometric blocks (NO text, NO numbers), next to an open ledger notebook and a pen

  bg: { color: #FDFCF8, mood: calm }

  fg: {
    element: smartphone on stand + open notebook with Deep Pine cover
    color: #2A625A
    detail: clean abstract app layout suggested only by flat color blocks, no readable UI
  }

  accent: { element: a small Mint #B4EEE3 sticky note as prop, max: 15% canvas }

  depth: softly blurred small plant and window light in background

  composition: { focus: smartphone, center-left; balance: asymmetric; space: airy }

  mood: trustworthy
  tone: editorial

  constraints: { no-text: true, no-faces: true, no-red: true, no-collage: true }
}

[NEGATIVE] {
  visual: [no watermarks/logos, no clichés (handshakes/pointing-at-laptop/forced smiles), no red, no soft shadows/blur/glow/glassmorphism, no rounded corners, no gradients, no neon outside Pine/Mint/Lilac/Peach, no blur/pixelation/artifacts, no border or frame]
  text: [no words/labels/captions/axis numbers, no placeholder text/URLs/QR codes]
  culture: [no $ — use ₫ or omit, no misrepresentation of Vietnamese financial context]
}
```
