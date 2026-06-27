# Hướng dẫn setup "Markdown for Agents" (Lớp 2) — tự host, $0

Tài liệu này hướng dẫn bật **content negotiation** cho website Value Investing:
khi AI agent gửi header `Accept: text/markdown`, server trả về **bản markdown
sạch** ngay trên *cùng một URL* — y hệt tính năng trả phí của Cloudflare, nhưng
tự làm trên VPS + nginx (FlashPanel), không tốn phí.

> **Bối cảnh:** domain đang chạy qua Cloudflare proxy → VPS (nginx, FlashPanel)
> phục vụ bản build tĩnh của Astro (`dist/`).

---

## Điều kiện tiên quyết

1. **Lớp 1 đã có** — repo đã tạo endpoint `src/pages/[...slug].md.ts`. Mỗi bài
   viết sẽ build ra một file `.md` cạnh trang HTML, ví dụ:

   | Trang HTML | File markdown |
   | --- | --- |
   | `/dau-tu/etf/etf-la-gi/` | `/dau-tu/etf/etf-la-gi.md` |

   Kiểm tra sau khi `npm run build`:

   ```bash
   find dist -name "*.md" | wc -l    # phải ra số bài viết (vd 25)
   ```

2. **Đã deploy `dist/` mới lên VPS** (có các file `.md` ở document root).

3. **Quyền sửa cấu hình nginx của site** trong FlashPanel.

---

## Bước 1 — Thêm cấu hình nginx

Trong FlashPanel: mở site `valueinvesting.com.vn` → phần **Config / Nginx**
(khu vực cho phép thêm directive tùy chỉnh bên trong khối `server`).

Dán đoạn sau vào:

```nginx
# === Markdown for Agents — self-hosted, $0 ===

# 1) Phục vụ file .md dưới dạng markdown; nếu không có .md thì fallback về HTML.
location ~ ^(?<page>/.+)\.md$ {
    default_type text/markdown;
    charset utf-8;
    charset_types text/markdown;   # BẮT BUỘC: để nginx gắn "; charset=utf-8" cho .md
    add_header Vary Accept;
    add_header Content-Signal "ai-train=yes, search=yes, ai-input=yes";
    add_header X-Robots-Tag "noindex" always;   # tránh trùng lặp SEO: không index bản .md
    try_files $uri ${page}/index.html =404;
}

# 2) Trên URL "đẹp" (có dấu / cuối), nếu client thích markdown thì chuyển sang .md.
location ~ ^(?<page>/.+)/$ {
    if ($http_accept ~* text/markdown) {
        rewrite ^ $page.md last;
    }
    try_files $uri ${uri}index.html =404;
}
```

**Lưu ý quan trọng:**

- Giữ nguyên khối `location / { ... }` mà FlashPanel đã tạo sẵn. Hai khối regex
  ở trên sẽ được nginx ưu tiên đúng cho URL có `/` cuối và file `.md`.
- **Không** dùng `map` ở đây — `map` chỉ đặt được trong context `http`, còn block
  tùy chỉnh của FlashPanel nằm trong `server`. Vì vậy ta dùng biến built-in
  `$http_accept` trực tiếp.
- `if ($http_accept ~* ...) { rewrite ... }` là một trong các cách dùng `if`
  **an toàn** theo tài liệu nginx (chỉ kết hợp `if` với `rewrite`/`return`).

### Cách hoạt động

| Request | Header | Kết quả |
| --- | --- | --- |
| `/dau-tu/etf/etf-la-gi/` | `Accept: text/markdown` | rewrite → `etf-la-gi.md` → trả **markdown** |
| `/dau-tu/etf/etf-la-gi/` | (trình duyệt thường) | trả **HTML** như cũ |
| `/dau-tu/etf/etf-la-gi.md` | (bất kỳ) | trả **markdown** trực tiếp |
| `/dau-tu/etf/` (trang category) | `Accept: text/markdown` | không có `.md` → **fallback HTML** |

## Bước 2 — Reload nginx

Sau khi lưu, kiểm tra cú pháp rồi reload (qua nút **Reload/Restart** trong
FlashPanel, hoặc SSH):

```bash
sudo nginx -t        # phải báo "syntax is ok" + "test is successful"
sudo systemctl reload nginx
```

Nếu `nginx -t` báo lỗi, **không reload** — xem lại đoạn config vừa dán.

---

## Bước 3 — Tránh bẫy cache của Cloudflare

Cloudflare (gói free) **bỏ qua header `Vary: Accept`**. Nếu một trang bị
Cloudflare cache, bản HTML và bản Markdown có thể "đè" lẫn nhau cho mọi người.

Hiện các trang đang ở trạng thái `cf-cache-status: DYNAMIC` (Cloudflare không
cache) nên chưa có vấn đề. Để phòng về sau, thêm **một Cache Rule miễn phí**:

1. Vào **Cloudflare dashboard** → chọn domain → **Rules** → **Cache Rules**.
2. **Create rule**:
   - **When incoming requests match** (Custom filter expression):

     ```
     any(http.request.headers["accept"][*] contains "text/markdown")
     ```

   - **Then** → **Cache eligibility** → **Bypass cache**.
3. **Deploy**.

Như vậy mọi request markdown luôn đi thẳng tới origin, không bao giờ bị cache sai.

---

## Bước 4 — Kiểm tra

Chạy từ máy bất kỳ sau khi đã deploy + reload nginx:

```bash
# (1) Agent xin markdown → phải ra markdown sạch (bắt đầu bằng frontmatter ---)
curl -s https://valueinvesting.com.vn/dau-tu/etf/etf-la-gi/ \
  -H "Accept: text/markdown" | head

# (2) Content-Type của request markdown phải là text/markdown
curl -sI https://valueinvesting.com.vn/dau-tu/etf/etf-la-gi/ \
  -H "Accept: text/markdown" | grep -i content-type
# kỳ vọng: content-type: text/markdown; charset=utf-8

# (3) Trình duyệt thường (không có header) vẫn phải ra HTML
curl -sI https://valueinvesting.com.vn/dau-tu/etf/etf-la-gi/ | grep -i content-type
# kỳ vọng: content-type: text/html; charset=utf-8

# (4) Truy cập .md trực tiếp cũng phải chạy
curl -sI https://valueinvesting.com.vn/dau-tu/etf/etf-la-gi.md | grep -i content-type
# kỳ vọng: content-type: text/markdown; charset=utf-8
```

Thành công khi: (1) ra markdown, (2) và (4) là `text/markdown`, còn (3) vẫn là
`text/html`.

---

## SEO — có bị trùng lặp nội dung không?

Không, nếu cấu hình đúng như trên. Có hai trường hợp khác nhau:

- **Bản negotiation (cùng URL + `Accept` header):** an toàn tuyệt đối. Googlebot
  luôn gửi `Accept: text/html` nên nhận HTML như người dùng — đây là content
  negotiation hợp lệ, **không phải cloaking**. Header `Vary: Accept` đã khai báo
  đúng.
- **Bản `.md` (URL riêng, ví dụ `...etf-la-gi.md`):** là URL thật, nội dung gần
  trùng HTML. Để Google **chỉ index bản HTML**, response `.md` đã gắn
  `add_header X-Robots-Tag "noindex" always;`. Search engine bỏ qua `.md`, nhưng
  agent vẫn fetch bình thường (noindex chỉ cấm hiển thị trong kết quả tìm kiếm,
  không chặn truy cập).

Ngoài ra, file `.md` **không** nằm trong sitemap (sitemap chỉ liệt kê URL HTML),
nên không bị chủ động đẩy cho Google. Lưu ý Google **không** "phạt" nội dung
trùng lặp — đây chỉ là việc đảm bảo HTML là bản canonical duy nhất được index.

Kiểm tra header noindex sau khi reload:

```bash
curl -sI https://valueinvesting.com.vn/dau-tu/etf/etf-la-gi.md | grep -i x-robots-tag
# kỳ vọng: x-robots-tag: noindex
```

## Khắc phục sự cố

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
| --- | --- | --- |
| Request markdown vẫn trả HTML | Chưa reload nginx, hoặc bị Cloudflare cache | `systemctl reload nginx`; thêm Cache Rule ở Bước 3; thử lại với `?nocache=1` |
| `Content-Type` ra `application/octet-stream` hoặc `text/plain` cho `.md` | Khối `location ~ \.md$` chưa được áp dụng (sai thứ tự / sai chỗ dán) | Đảm bảo dán **bên trong** `server {}` của site, và `nginx -t` ok |
| Tiếng Việt bị vỡ (mojibake) khi xem `.md` | `Content-Type` ra `text/markdown` nhưng **thiếu** `; charset=utf-8` | Thêm dòng `charset_types text/markdown;` vào khối `.md` (nginx mặc định không gắn charset cho `text/markdown`), rồi reload |
| `404` khi xin markdown trên trang bài viết | File `.md` chưa được deploy lên VPS | Build lại (`npm run build`) và upload `dist/` đầy đủ; kiểm tra `find dist -name "*.md"` |
| `nginx -t` báo lỗi `location` | Dán nhầm ra ngoài `server {}` hoặc trùng location | Kiểm tra lại vị trí dán; không trùng với regex location sẵn có của FlashPanel |
| Trang category trả 404 thay vì HTML | Thiếu nhánh fallback `${page}/index.html` trong khối `.md` | Dán lại đúng khối (1) ở Bước 1 |

---

## Ghi chú vận hành

- **Mỗi lần thêm bài mới:** chỉ cần build + deploy như bình thường — file `.md`
  tương ứng tự sinh, không phải sửa nginx.
- **Đổi cấu trúc URL category** (`src/data/site.ts`): regex nginx ở trên không
  phụ thuộc tên category cụ thể nên vẫn chạy; chỉ cần các file `.md` nằm cạnh
  trang HTML (endpoint `[...slug].md.ts` đã đảm bảo điều đó).
- **Không cần `map`, không cần Worker, không cần gói Cloudflare trả phí.**
