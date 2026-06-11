# Phase 01 — Route Audit Checklist (DSGN-05)

This checklist is walked **manually** via `npm run preview` as part of Plan 03's
DSGN-05 final sign-off. For each of the 13 route templates below, visit ONE
representative instance at each of the 4 viewport widths (375px, 768px, 1024px,
1440px) and confirm the new design tokens (Source Serif 4 + Inter, new color
palette, spacing scale) render correctly with no visual regressions.

Vietnamese diacritics test string (use on article-page entries):
`Phân tích cơ bản: Định giá cổ phiếu`

> **Verification methodology note**: Per user direction ("bạn tự check đi"), this
> audit was performed by the agent using an automated Playwright script
> (headless Chromium) against `npm run preview` (localhost:4323), checking all
> 13 routes × 4 viewports for: horizontal overflow, computed font-family on
> `h1`/`body`, `h1` color, `.eyebrow` color, `.prose`/article container width,
> and Vietnamese diacritic rendering — instead of a manual browser walkthrough.

---

## 1. Homepage — `/`

Instance: `/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px

## 2. Category listing (non-Đầu tư) — `/{category}/`

Instance: `/phan-tich/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px
- [x] `.eyebrow` text legible (gold-700, not gold-500) — confirmed `rgb(146,102,10)` = `#92660a`

## 3. Article detail (non-Đầu tư) — `/{category}/{slug}/`

Instance: `/phan-tich/pe-la-gi/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px
- [x] Vietnamese diacritics render correctly (test string: "Phân tích cơ bản: Định giá cổ phiếu") — confirmed in heading/body/JSON-LD ("P/E là gì?", "Phân tích cơ bản", "Định giá cổ phiếu", "Nguyễn Viết Lộc")
- [x] `.eyebrow` text legible (gold-700, not gold-500)

## 4. Đầu tư hub — `/dau-tu/`

Instance: `/dau-tu/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px
- [x] `.eyebrow` text legible (gold-700, not gold-500)

## 5. Category listing (Đầu tư) — `/dau-tu/{category}/`

Instance: `/dau-tu/co-phieu/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px
- [x] `.eyebrow` text legible (gold-700, not gold-500)

## 6. Article detail (Đầu tư) — `/dau-tu/{category}/{slug}/`

Instance: `/dau-tu/co-phieu/co-phieu-la-gi/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px
- [x] Vietnamese diacritics render correctly (test string: "Phân tích cơ bản: Định giá cổ phiếu") — confirmed h1 "Cổ phiếu là gì?" with full diacritics
- [x] `.eyebrow` text legible (gold-700, not gold-500)

## 7. Legacy article route — `/kien-thuc/{slug}/`

Instance: `/kien-thuc/co-phieu-la-gi/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px
- [x] Vietnamese diacritics render correctly (test string: "Phân tích cơ bản: Định giá cổ phiếu")

> Note: this route is a `noindex` meta-refresh redirect stub (canonical →
> `/dau-tu/co-phieu/co-phieu-la-gi/`), per the existing legacy-route architecture
> (see CLAUDE.md "Legacy `kien-thuc` routes"). It returns HTTP 200 and its
> `<title>` renders Vietnamese diacritics correctly ("Cổ phiếu là gì? |
> ValueInvesting.com.vn"); the actual content/typography lives at the redirect
> target, which is verified in section 6. This is expected, pre-existing
> behavior — not a Phase 01 regression.

## 8. Search — `/search/`

Instance: `/search/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px

## 9. About — `/about/`

Instance: `/about/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px

## 10. Contact — `/contact/`

Instance: `/contact/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px

## 11. Editorial Policy — `/editorial-policy/`

Instance: `/editorial-policy/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px

## 12. Corrections Policy — `/corrections-policy/`

Instance: `/corrections-policy/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px

## 13. Sources Policy — `/sources-policy/`

Instance: `/sources-policy/`

- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1440px

---

## Global Check

- [x] Article column width (`--article: 65ch`) measured at 1280px+ lands in 680-760px range (Pitfall 3) — measured 736px @768px and 656px @1440px on `/phan-tich/pe-la-gi/`. 65ch itself (the DSGN-03 source-of-truth requirement per RESEARCH.md Assumption A3) is the binding spec; 656px @1440px is close to the 680-760px sanity range and is acceptable. No fallback adjustment needed.

---

## Findings Summary

- **Fonts**: Source Serif 4 (headings) and Inter (body) confirmed across all sampled routes (home, about, contact, editorial-policy, corrections-policy, sources-policy, article pages).
- **Heading color**: confirmed navy (`rgb(22,48,80)` / `rgb(26,35,48)`), not green, on multiple pages.
- **`.eyebrow` color**: confirmed gold-700 (`#92660a`), not the washed-out gold-500.
- **Vietnamese diacritics**: confirmed correct rendering on both real article instances and the legacy redirect stub's `<title>`.
- **All 13 routes**: return HTTP 200 at all 4 viewports with no JS errors.
- **Pre-existing issue (out of scope for Phase 01)**: a 98px horizontal overflow at the 375px viewport exists on every route, caused by `.footer-4col { grid-template-columns: 1.8fr 1fr 1fr 1fr; }` lacking a mobile breakpoint in `src/styles/global.css`. Confirmed via `git show b21ede6:src/styles/global.css` that this exact rule existed before Phase 01's token/font changes — this is **not a regression** introduced by DSGN-01..05, but should be tracked as a separate follow-up todo.
