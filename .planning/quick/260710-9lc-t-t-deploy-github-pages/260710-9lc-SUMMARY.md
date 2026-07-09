---
quick_id: 260710-9lc
slug: t-t-deploy-github-pages
status: complete
date: 2026-07-09
---

# Summary: Tắt deploy GitHub Pages

## Đã làm

- Xoá `.github/workflows/deploy.yml` (`git rm`). Đây là workflow duy nhất trong `.github/workflows/`; thư mục nay trống → không còn cơ chế deploy lên GitHub Pages.

## Còn lại (cần user thao tác thủ công)

`gh` CLI không có trong môi trường nên không tự tắt Pages qua API được. Xoá workflow chỉ chặn deploy tương lai — bản đã publish vẫn còn live tại `vilo0411.github.io/investing`. Để bản trùng trả 404:

1. Vào **GitHub repo → Settings → Pages**.
2. Ở **Build and deployment → Source**, đổi từ *GitHub Actions* sang **None** (Disable / Unpublish).
3. Kiểm tra sau vài phút: `curl -I https://vilo0411.github.io/investing/` phải trả `404`.

## Ảnh hưởng

- Cloudflare / `valueinvesting.com.vn`: không ảnh hưởng (build độc lập, không dùng workflow này).
- SEO: sau khi Pages tắt hẳn, hết duplicate content trên github.io → tín hiệu index dồn về domain chính.
