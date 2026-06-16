# Skill: SEO Image — Gemini Paste Pipeline

> Tạo Gemini prompts cho ảnh SEO. 1 ảnh = 1 prompt. Paste vào Gemini app.

---

## Trigger

`/image [slug]` — chạy sau Draft hoặc Final approve.

---

## Assets

| File | Nội dung |
|------|---------|
| `assets/brand.md` | [BRAND] block — paste cố định |
| `assets/negative.md` | [NEGATIVE] block — paste cố định |
| `assets/styles/abstract-finance.md` | Chỉ báo kỹ thuật, oscillator, chart |
| `assets/styles/editorial-photo.md` | Phân tích, lifestyle tài chính |
| `assets/styles/flat-illustration.md` | Hướng dẫn, checklist, step-by-step |
| `assets/templates/featured.md` | [IMAGE] block — 1200×630 |
| `assets/templates/inline.md` | [IMAGE] block — 800×450 |
| `assets/templates/infographic.md` | [IMAGE] block — 800×1200 |

---

## Quy trình

**Bước 1 — Đọc bài**
- Đọc `Final-[slug].md` (hoặc Draft nếu chưa final)
- Xác định: topic, tone, các H2 section, có table/step-by-step không

**Bước 2 — Chọn style + lập manifest**
- Chọn 1 style từ bảng assets
- Áp dụng **Quy tắc số lượng & vị trí** bên dưới để xác định số ảnh inline
- Announce manifest:
```
📸 [slug] — [style]
- featured-01: [concept 5 từ] → đầu bài
- inline-01:   [concept 5 từ] → H2 "[tên section]"
- inline-02:   [concept 5 từ] → H2 "[tên section]"
```

---

## Quy tắc số lượng & vị trí (SEO)

| Loại bài (theo word count) | Featured | Inline | Tổng |
|---|---|---|---|
| Ngắn (< 1200 từ) | 1 | 1 | 2 |
| Chuẩn (1200–2500 từ) | 1 | 2–3 | 3–4 |
| Dài/Pillar (> 2500 từ) | 1 | 3–4 | 4–5 |

**Vị trí:**
- `featured-01`: luôn đặt đầu bài (trước H2 đầu tiên) — dùng làm OG image/social share
- `inline-XX`: đặt ngay **sau heading** của H2 mà nó minh họa, **trước** đoạn văn đầu của section đó
- Cách nhau **tối thiểu 2 H2** giữa hai ảnh inline — không đặt 2 ảnh liền kề nhau
- Không đặt ảnh trong section "Key takeaways" hoặc "FAQ"

**Ưu tiên chọn H2 để gắn inline image** (theo thứ tự):
1. Section có table/so sánh → minh họa bằng `abstract-finance` hoặc infographic
2. Section step-by-step/hướng dẫn → `flat-illustration` dạng infographic
3. Section khái niệm trừu tượng (định nghĩa, công thức) → `abstract-finance`
4. Bỏ qua section quá ngắn (< 100 từ) hoặc section list đơn giản

**Alt text (bắt buộc cho SEO):**
- Mỗi ảnh phải có alt text tiếng Việt chứa từ khóa chính hoặc biến thể (semantic keyword), mô tả đúng nội dung ảnh — không nhồi keyword
- Format: `![{{mô tả ngắn có chứa từ khóa liên quan}}](đường-dẫn-ảnh)`

**Bước 3 — Compose prompt mỗi ảnh**

Cấu trúc cố định — theo thứ tự:
```
[BRAND]    ← assets/brand.md
[IMAGE]    ← assets/templates/[type].md (điền {{SECTION_NAME}} nếu inline)
[STYLE]    ← assets/styles/[style].md
[SCENE]    ← điền theo bài (xem schema bên dưới)
[NEGATIVE] ← assets/negative.md
```

**Bước 4 — Save + show**
- Save: `knowledge/4-content/2-drafts/[slug]-image-prompts.md`
- Show: từng prompt trong code block

**Bước 5 — QA sau khi nhận ảnh**
- Chạy checklist cuối file

---

## [SCENE] Schema

Agent chỉ cần điền block này. Dùng `{}` cho nested objects, `[]` cho arrays.

```
[SCENE] {
  subject: {{main visual element — 1 line EN}}

  bg: { color: {{hex}}, mood: {{1 word}} }

  fg: {
    element: {{primary visual object}}
    color:   {{hex hoặc gradient}}
    detail:  {{1 đặc điểm quan trọng}}
  }

  accent: { element: {{Mint/Lilac/Peach xuất hiện như thế nào}}, max: 15% canvas }

  depth: {{secondary layer — hoặc none}}

  composition: {
    focus:   {{focal element + vị trí trong frame}}
    balance: {{left | center | right | asymmetric | split}}
    space:   {{tight | balanced | airy}}
  }

  mood: {{analytical | trustworthy | dynamic | calm}}
  tone: {{cinematic | editorial | clean | dramatic}}

  constraints: {
    no-text:    true
    no-faces:   true
    no-red:     true
    no-collage: {{true | "intentional split only"}}
  }
}
```

**Infographic thêm vào `constraints {}`:**
```
    structure:  {{3-step | comparison | timeline | ranked-list}}
    data:       [{{item 1}}, {{item 2}}, {{item 3}}]
    text-rule:  numbers + max 3-word labels only
```

---

## QA Checklist

| # | Check | Pass |
|---|-------|------|
| 1 | No text | Không có chữ trong featured/inline |
| 2 | Brand palette | Deep Pine (#2A625A) + Mint/Lilac/Peach xuất hiện tự nhiên |
| 3 | No red | Không có đỏ bất kỳ dạng nào |
| 4 | No cliché | Không bắt tay, không chỉ màn hình |
| 5 | Sharp edges | Không có rounded corners, không soft shadow/blur/gradient |
| 6 | Ratio đúng | 5:3 (1000×600) featured, 8:5 (800×500) inline — 2:3 infographic |
| 7 | Tone match | Mood ảnh khớp tone bài viết |

Fail → regen: `"Regenerate. Fix: [vấn đề]. Keep everything else identical."`
