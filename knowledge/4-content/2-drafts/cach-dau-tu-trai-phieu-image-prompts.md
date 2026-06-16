# Image Prompts — cach-dau-tu-trai-phieu

Style: **abstract-finance** (Bloomberg Terminal precision + Neo-Brutalist print)

Manifest:
- featured-01: bond certificate ledger with growth line → đầu bài
- inline-01: three diverging paths (3 cách đầu tư) → dưới H2 "3 cách đầu tư trái phiếu phổ biến tại Việt Nam"
- inline-02: balance scale (rủi ro) → dưới H2 "Rủi ro và tiêu chí chọn trái phiếu cần lưu ý"

---

## featured-01 — Bond ledger with growth line (1000×600, 5:3)

```
[BRAND] {
  name: Value Investing
  tagline: "Đầu tư dễ hiểu hơn."
  audience: Vietnamese F0 investors, 22–40, beginner to intermediate, urban + tier-2 cities
  voice: trustworthy, calm, editorial — "Investopedia phong cách Việt Nam"
  design-language: Neo-Brutalist Minimalism — premium editorial finance, ink-on-paper precision

  palette: {
    pine:      #2A625A
    pine-dark: #0B4A43
    paper:     #FDFCF8
    ink:       #121212
    mint:      #B4EEE3
    lilac:     #E2D5F3
    peach:     #FFDBD0
  }

  gradient: none — flat colors only, no gradients anywhere
  shape-language: sharp corners (0px radius everywhere), 1px solid ink (#121212) borders, hard-edged offset shadows (4–8px solid ink, never blurred)
  mood: premium editorial, architectural, "financial ledger" precision
  forbidden: [red, soft drop-shadows / blur / glow, rounded corners, gradients, glassmorphism, neon, stock-photo clichés]
}

[IMAGE]
type:    featured
size:    1000 × 600 px
ratio:   5:3
output:  single image — no collage, no border, no frame

[STYLE: abstract-finance] {
  ref: Bloomberg Terminal precision + The Economist data viz + Neo-Brutalist print journals
  objects: { type: abstract chart elements — lines, bands, blocks — geometric and architectural, weight: bold sharp-edged ruler-precise, color: { primary: #2A625A, accent: #B4EEE3 } }
  bg: { color: #FDFCF8, overlay: 1px ink (#121212) grid lines at 8–12% opacity — "ledger paper" feel }
  lighting: flat, even, no gradients — depth from hard-edged ink shadow offsets (4–8px solid #121212, never blurred)
  grain: none — crisp print/vector precision
  decoration: [stark 1px ink axis lines, solid Mint or Peach blocks marking key data points, no unrelated shapes, no glow]
  vibe: a page from a premium financial almanac — architectural, every line intentional
}

[SCENE] {
  subject: abstract bond certificate document rendered as a stack of rectangular blocks with an embossed ascending growth line across the top edge

  bg: { color: #FDFCF8, mood: trustworthy }

  fg: {
    element: 3-4 stacked rectangular certificate blocks of slightly offset sizes, each with a 1px ink border
    color: Deep Pine (#2A625A) blocks with a Mint (#B4EEE3) ascending line graph overlaid across them
    detail: hard-edged ink offset shadow (6px) under the stack, giving an architectural document feel
  }

  accent: { element: small Peach (#FFDBD0) square marking a single data point on the growth line, max: 15% canvas }

  depth: thin ink grid lines in the background, evenly spaced

  composition: {
    focus: stacked certificate blocks positioned center-left
    balance: asymmetric
    space: balanced
  }

  mood: trustworthy
  tone: editorial

  constraints: {
    no-text:    true
    no-faces:   true
    no-red:     true
    no-collage: true
  }
}

[NEGATIVE] {
  visual: [no watermarks or third-party logos, no clichés: handshakes / pointing-at-laptop / forced smiles, no red, no soft drop-shadows / blur / glow / glassmorphism, no rounded corners, no gradients or mesh gradients, no neon or saturated colors outside Deep Pine / Mint / Lilac / Peach, no blurry / pixelated output, no border or frame around image]
  text: [no words / labels / captions / axis numbers, no placeholder text / URLs / QR codes]
  culture: [no $ for VN-specific topics — use ₫ or omit, no misrepresentation of Vietnamese financial context]
}
```

---

## inline-01 — Three diverging paths (800×500, 8:5)

```
[BRAND] {
  name: Value Investing
  tagline: "Đầu tư dễ hiểu hơn."
  audience: Vietnamese F0 investors, 22–40, beginner to intermediate, urban + tier-2 cities
  voice: trustworthy, calm, editorial — "Investopedia phong cách Việt Nam"
  design-language: Neo-Brutalist Minimalism — premium editorial finance, ink-on-paper precision

  palette: {
    pine:      #2A625A
    pine-dark: #0B4A43
    paper:     #FDFCF8
    ink:       #121212
    mint:      #B4EEE3
    lilac:     #E2D5F3
    peach:     #FFDBD0
  }

  gradient: none — flat colors only, no gradients anywhere
  shape-language: sharp corners (0px radius everywhere), 1px solid ink (#121212) borders, hard-edged offset shadows (4–8px solid ink, never blurred)
  mood: premium editorial, architectural, "financial ledger" precision
  forbidden: [red, soft drop-shadows / blur / glow, rounded corners, gradients, glassmorphism, neon, stock-photo clichés]
}

[IMAGE]
type:    inline
size:    800 × 500 px
ratio:   8:5
purpose: visual metaphor for section "3 cách đầu tư trái phiếu phổ biến tại Việt Nam"
output:  single image — no collage, no border, no frame

[STYLE: abstract-finance] {
  ref: Bloomberg Terminal precision + The Economist data viz + Neo-Brutalist print journals
  objects: { type: abstract chart elements — lines, bands, blocks — geometric and architectural, weight: bold sharp-edged ruler-precise, color: { primary: #2A625A, accent: #B4EEE3 } }
  bg: { color: #FDFCF8, overlay: 1px ink (#121212) grid lines at 8–12% opacity — "ledger paper" feel }
  lighting: flat, even, no gradients — depth from hard-edged ink shadow offsets (4–8px solid #121212, never blurred)
  grain: none — crisp print/vector precision
  decoration: [stark 1px ink axis lines, solid Mint or Peach blocks marking key data points, no unrelated shapes, no glow]
  vibe: a page from a premium financial almanac — architectural, every line intentional
}

[SCENE] {
  subject: three bold ink-outlined paths diverging from a single starting point, each ending in a distinct rectangular block of different size

  bg: { color: #FDFCF8, mood: analytical }

  fg: {
    element: three straight diverging lines branching rightward from one origin point, ending in three rectangular blocks of increasing size
    color: Deep Pine (#2A625A) lines, with the three end-blocks filled Mint (#B4EEE3), Lilac (#E2D5F3), and Peach (#FFDBD0) respectively
    detail: each end-block has a 1px ink border and a small hard-edged offset shadow
  }

  accent: { element: smallest Peach block sized noticeably smaller to suggest lowest entry threshold, max: 15% canvas }

  depth: none

  composition: {
    focus: origin point on the left, three blocks fanning out to the right
    balance: left
    space: airy
  }

  mood: analytical
  tone: clean

  constraints: {
    no-text:    true
    no-faces:   true
    no-red:     true
    no-collage: true
  }
}

[NEGATIVE] {
  visual: [no watermarks or third-party logos, no clichés: handshakes / pointing-at-laptop / forced smiles, no red, no soft drop-shadows / blur / glow / glassmorphism, no rounded corners, no gradients or mesh gradients, no neon or saturated colors outside Deep Pine / Mint / Lilac / Peach, no blurry / pixelated output, no border or frame around image]
  text: [no words / labels / captions / axis numbers, no placeholder text / URLs / QR codes]
  culture: [no $ for VN-specific topics — use ₫ or omit, no misrepresentation of Vietnamese financial context]
}
```

---

## inline-02 — Balance scale (risk) (800×500, 8:5)

```
[BRAND] {
  name: Value Investing
  tagline: "Đầu tư dễ hiểu hơn."
  audience: Vietnamese F0 investors, 22–40, beginner to intermediate, urban + tier-2 cities
  voice: trustworthy, calm, editorial — "Investopedia phong cách Việt Nam"
  design-language: Neo-Brutalist Minimalism — premium editorial finance, ink-on-paper precision

  palette: {
    pine:      #2A625A
    pine-dark: #0B4A43
    paper:     #FDFCF8
    ink:       #121212
    mint:      #B4EEE3
    lilac:     #E2D5F3
    peach:     #FFDBD0
  }

  gradient: none — flat colors only, no gradients anywhere
  shape-language: sharp corners (0px radius everywhere), 1px solid ink (#121212) borders, hard-edged offset shadows (4–8px solid ink, never blurred)
  mood: premium editorial, architectural, "financial ledger" precision
  forbidden: [red, soft drop-shadows / blur / glow, rounded corners, gradients, glassmorphism, neon, stock-photo clichés]
}

[IMAGE]
type:    inline
size:    800 × 500 px
ratio:   8:5
purpose: visual metaphor for section "Rủi ro và tiêu chí chọn trái phiếu cần lưu ý"
output:  single image — no collage, no border, no frame

[STYLE: abstract-finance] {
  ref: Bloomberg Terminal precision + The Economist data viz + Neo-Brutalist print journals
  objects: { type: abstract chart elements — lines, bands, blocks — geometric and architectural, weight: bold sharp-edged ruler-precise, color: { primary: #2A625A, accent: #B4EEE3 } }
  bg: { color: #FDFCF8, overlay: 1px ink (#121212) grid lines at 8–12% opacity — "ledger paper" feel }
  lighting: flat, even, no gradients — depth from hard-edged ink shadow offsets (4–8px solid #121212, never blurred)
  grain: none — crisp print/vector precision
  decoration: [stark 1px ink axis lines, solid Mint or Peach blocks marking key data points, no unrelated shapes, no glow]
  vibe: a page from a premium financial almanac — architectural, every line intentional
}

[SCENE] {
  subject: abstract balance scale built from hard-edged geometric bars, one pan weighted down lower than the other

  bg: { color: #FDFCF8, mood: calm }

  fg: {
    element: a horizontal ink bar pivoting on a triangular fulcrum, with a rectangular Deep Pine (#2A625A) block sitting in the lower pan and the opposite pan empty and raised
    color: Deep Pine (#2A625A) block with Mint (#B4EEE3) fulcrum triangle
    detail: 1px ink outlines on all elements, hard-edged offset shadow (6px) beneath the lowered pan
  }

  accent: { element: small Peach (#FFDBD0) triangle marker positioned near the lowered pan, max: 15% canvas }

  depth: thin ink grid lines in the background

  composition: {
    focus: balance scale centered in frame
    balance: center
    space: balanced
  }

  mood: trustworthy
  tone: editorial

  constraints: {
    no-text:    true
    no-faces:   true
    no-red:     true
    no-collage: true
  }
}

[NEGATIVE] {
  visual: [no watermarks or third-party logos, no clichés: handshakes / pointing-at-laptop / forced smiles, no red, no soft drop-shadows / blur / glow / glassmorphism, no rounded corners, no gradients or mesh gradients, no neon or saturated colors outside Deep Pine / Mint / Lilac / Peach, no blurry / pixelated output, no border or frame around image]
  text: [no words / labels / captions / axis numbers, no placeholder text / URLs / QR codes]
  culture: [no $ for VN-specific topics — use ₫ or omit, no misrepresentation of Vietnamese financial context]
}
```
