# Image Prompts — so-sanh-tcbs-vs-ssi

> reviewType: `comparison` | Hero đã có (`public/images/articles/so-sanh-tcbs-vs-ssi/hero.jpg`).
> Cần bổ sung **1 ảnh inline** cho thân bài (hiện đang thiếu). Dùng style `abstract-finance` với motif so sánh split A/B.

## 📸 Manifest
- `featured-01` (inline) → đặt sau H2 **"Phân tích chi tiết từng tiêu chí"** — style: abstract-finance (split comparison)

**Markdown chèn (sau khi có file ảnh):**
```
![Biểu đồ trừu tượng so sánh hai công ty chứng khoán TCBS và SSI theo các tiêu chí](./images/so-sanh-tcbs-vs-ssi/featured-01.jpg)
*Ảnh minh họa: Value Investing*
```
→ File ảnh lưu tại: `src/content/articles/images/so-sanh-tcbs-vs-ssi/featured-01.jpg`

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
purpose: visual metaphor for section "Phân tích chi tiết từng tiêu chí" (so sánh hai công ty chứng khoán)
output:  single image — no collage, no border, no frame

[STYLE: abstract-finance] {
  ref: Bloomberg Terminal precision + The Economist data viz + Neo-Brutalist print journals
  objects: { type: abstract bars/blocks — geometric, architectural, ruler-precise; color: { primary: #2A625A, accent: #B4EEE3 } }
  bg: { color: #FDFCF8, overlay: 1px ink #121212 grid lines at 8–12% opacity — ledger-paper feel }
  lighting: flat even — depth only from hard-edged ink shadow offsets (4–8px solid #121212, never blurred)
  grain: none — crisp print/vector precision
}

[SCENE] {
  subject: a split A/B comparison motif on ledger paper — two groups of bold vertical bars side by side, each group representing one brokerage, of differing heights to imply contrasting criteria (NO text, NO numbers)

  bg: { color: #FDFCF8, mood: analytical }

  fg: {
    element: two columns of sharp-edged Deep Pine bars separated by a single 1px ink dividing line
    color: #2A625A
    detail: hard-edged 4–8px solid ink offset shadow under each bar, ruler-precise alignment
  }

  accent: { element: one Mint #B4EEE3 block topping the left group and one Peach #FFDBD0 block topping the right group, max: 15% canvas }

  depth: none

  composition: { focus: the two bar groups, centered with split balance; balance: split; space: balanced }

  mood: analytical
  tone: clean

  constraints: { no-text: true, no-faces: true, no-red: true, no-collage: "intentional split only" }
}

[NEGATIVE] {
  visual: [no watermarks/logos, no clichés, no red, no soft shadows/blur/glow/glassmorphism, no rounded corners, no gradients, no neon outside Pine/Mint/Lilac/Peach, no blur/pixelation/artifacts, no border or frame]
  text: [no words/labels/captions/axis numbers, no placeholder text/URLs/QR codes]
  culture: [no $ — use ₫ or omit, no misrepresentation of Vietnamese financial context]
}
```
