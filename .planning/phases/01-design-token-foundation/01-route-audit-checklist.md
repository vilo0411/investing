# Phase 01 — Route Audit Checklist (DSGN-05)

This checklist is walked **manually** via `npm run preview` as part of Plan 03's
DSGN-05 final sign-off. For each of the 13 route templates below, visit ONE
representative instance at each of the 4 viewport widths (375px, 768px, 1024px,
1440px) and confirm the new design tokens (Source Serif 4 + Inter, new color
palette, spacing scale) render correctly with no visual regressions.

Vietnamese diacritics test string (use on article-page entries):
`Phân tích cơ bản: Định giá cổ phiếu`

---

## 1. Homepage — `/`

Instance: `/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

## 2. Category listing (non-Đầu tư) — `/{category}/`

Instance: `/phan-tich/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] `.eyebrow` text legible (gold-700, not gold-500)

## 3. Article detail (non-Đầu tư) — `/{category}/{slug}/`

Instance: `/phan-tich/pe-la-gi/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] Vietnamese diacritics render correctly (test string: "Phân tích cơ bản: Định giá cổ phiếu")
- [ ] `.eyebrow` text legible (gold-700, not gold-500)

## 4. Đầu tư hub — `/dau-tu/`

Instance: `/dau-tu/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] `.eyebrow` text legible (gold-700, not gold-500)

## 5. Category listing (Đầu tư) — `/dau-tu/{category}/`

Instance: `/dau-tu/co-phieu/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] `.eyebrow` text legible (gold-700, not gold-500)

## 6. Article detail (Đầu tư) — `/dau-tu/{category}/{slug}/`

Instance: `/dau-tu/co-phieu/co-phieu-la-gi/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] Vietnamese diacritics render correctly (test string: "Phân tích cơ bản: Định giá cổ phiếu")
- [ ] `.eyebrow` text legible (gold-700, not gold-500)

## 7. Legacy article route — `/kien-thuc/{slug}/`

Instance: `/kien-thuc/co-phieu-la-gi/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] Vietnamese diacritics render correctly (test string: "Phân tích cơ bản: Định giá cổ phiếu")

## 8. Search — `/search/`

Instance: `/search/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

## 9. About — `/about/`

Instance: `/about/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

## 10. Contact — `/contact/`

Instance: `/contact/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

## 11. Editorial Policy — `/editorial-policy/`

Instance: `/editorial-policy/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

## 12. Corrections Policy — `/corrections-policy/`

Instance: `/corrections-policy/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

## 13. Sources Policy — `/sources-policy/`

Instance: `/sources-policy/`

- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

---

## Global Check

- [ ] Article column width (`--article: 65ch`) measured at 1280px+ lands in 680-760px range (Pitfall 3)
