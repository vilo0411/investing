# Link Wheel — Value Investing

> Luật internal-linking **bắt buộc, deterministic**. Mọi bài mới khi `/drafting`, `/write`, `/link`
> đều phải khép vòng theo luật này. Tham chiếu URL chính xác tại `anchor-index.md`.
> **Cập nhật:** 2026-06-30

---

## Nguyên tắc

Mỗi bài (spoke) đứng tại tâm một bánh xe. Bánh xe có **2 trục cố định** (nan hoa) + **vành nối các spoke 2 chiều**:

```
Bài viết mới X (spoke)
 ├─ [BẮT BUỘC] → Hub định nghĩa của category          (nan hoa 1)
 ├─ [BẮT BUỘC] → Bài "cách đầu tư" của category        (nan hoa 2)
 ├─ [BẮT BUỘC] → 2 bài Finalized GẦN NHẤT cùng cluster (vành bánh xe)
 └─ [TÙY]      → 1 bài cross-cluster liên quan
```

**Khép vành 2 chiều (BẮT BUỘC).** Ngay khi finalize X, mở đúng 2 bài cùng cluster mà X vừa trỏ tới, **chèn 1 anchor trỏ ngược lên X**. Nhờ vậy bài A (cũ) và bài B (mới) luôn nối nhau cả hai chiều — đây là điểm biến hub-and-spoke hình sao thành bánh xe thật.

### Luật cứng

1. **Chỉ link tới bài `Finalized`** (đã tồn tại trong `src/content/articles/`). Tuyệt đối không link tới slug `Planned` → tránh 404.
2. **Không tự-link** — nếu bài đang viết CHÍNH LÀ Hub hoặc bài "cách đầu tư" của category, bỏ qua trục đó và chỉ cần link sang trục còn lại.
3. **Hub và bài "cách đầu tư" phải cross-link lẫn nhau.**
4. Anchor text tự nhiên trong câu (theo `anti-ai-rules.md`) — không "xem thêm tại đây". Wrap cụm từ có sẵn trong thân bài; ưu tiên vị trí giữa/cuối bài, không nhồi vào Sapo.
   - **Bôi đậm mọi link Wheel** bằng markdown `**[anchor](url)**` (render ra `<strong>`, đồng bộ với brand `**[Value Investing](/)**`) để nổi bật. Chỉ áp dụng cho link Wheel, không bôi đậm tràn lan các link nội bộ khác.
5. Mật độ: tối đa 1 link / 100–150 từ. Không 2 link cùng đoạn.

---

## Mapping category → 2 trục (nguồn chân lý)

| Category | Hub định nghĩa (trục 1) | URL Hub | Bài "cách đầu tư" (trục 2) | URL Action |
|---|---|---|---|---|
| `co-phieu` | `co-phieu-la-gi` | `/dau-tu/co-phieu/co-phieu-la-gi/` | `cach-dau-tu-co-phieu` | `/dau-tu/co-phieu/cach-dau-tu-co-phieu/` |
| `etf` | `etf-la-gi` | `/dau-tu/etf/etf-la-gi/` | `cach-dau-tu-quy-etf` | `/dau-tu/etf/cach-dau-tu-quy-etf/` |
| `trai-phieu` | `trai-phieu-la-gi` | `/dau-tu/trai-phieu/trai-phieu-la-gi/` | `cach-dau-tu-trai-phieu` | `/dau-tu/trai-phieu/cach-dau-tu-trai-phieu/` |
| `phai-sinh` | `phai-sinh-la-gi` | `/dau-tu/phai-sinh/phai-sinh-la-gi/` | `cach-dau-tu-chung-khoan-phai-sinh` | `/dau-tu/phai-sinh/cach-dau-tu-chung-khoan-phai-sinh/` |
| `co-ban` | `phan-tich-co-ban-la-gi` | `/phan-tich/co-ban/phan-tich-co-ban-la-gi/` | `cach-chon-co-phieu-tot` | `/dau-tu/co-phieu/cach-chon-co-phieu-tot/` |
| `ky-thuat` | `phan-tich-ky-thuat-la-gi` | `/phan-tich/ky-thuat/phan-tich-ky-thuat-la-gi/` | `cach-dau-tu-co-phieu` † | `/dau-tu/co-phieu/cach-dau-tu-co-phieu/` |
| `reviews` | `review-cong-ty-chung-khoan-cho-nguoi-moi` | `/reviews/review-cong-ty-chung-khoan-cho-nguoi-moi/` | `cach-mo-tai-khoan-chung-khoan` | `/dau-tu/co-phieu/cach-mo-tai-khoan-chung-khoan/` |
| `nha-dau-tu` | `warren-buffett` | `/nha-dau-tu/warren-buffett/` | `cach-dau-tu-co-phieu` | `/dau-tu/co-phieu/cach-dau-tu-co-phieu/` |

† **Trục action tạm** — `ky-thuat` chưa có bài "cách giao dịch/chiến lược kỹ thuật" riêng (`chien-luoc-giao-dich` còn `Planned`), tạm dùng `cach-dau-tu-co-phieu`. Cập nhật khi có bài thật. (3 Hub định nghĩa `phai-sinh-la-gi`, `phan-tich-co-ban-la-gi`, `phan-tich-ky-thuat-la-gi` đã `Finalized` 2026-06-30 → đã thay hub tạm.)

---

## Quy trình áp dụng (mỗi bài)

1. Đọc `category` ở frontmatter → tra 2 nan hoa trong bảng trên.
2. Nếu bài KHÔNG phải nan hoa đó và CHƯA có link → wrap 1 cụm từ tự nhiên trỏ tới nan hoa.
3. Nếu bài CHÍNH LÀ một nan hoa → chỉ cần link sang nan hoa còn lại.
4. **Vành (BẮT BUỘC):** tra `topic-clusters.md`, lấy **2 bài `Finalized` gần nhất cùng cluster** (loại chính nó + 2 nan hoa nếu trùng) → chèn 2 link tự nhiên trỏ tới chúng. Nếu cluster có < 2 bài finalized khác, link bao nhiêu có bấy nhiêu.
5. **Khép vành 2 chiều (BẮT BUỘC):** mở đúng 2 bài vừa trỏ tới ở bước 4, chèn vào mỗi bài 1 anchor tự nhiên trỏ ngược lên bài mới. Giữ mật độ ≤ 1 link/100–150 từ, ưu tiên đoạn giữa/cuối.
6. Cập nhật `anchor-index.md` + đảm bảo trạng thái `Finalized` trong `topic-clusters.md`.

### Cách xác định "2 bài gần nhất cùng cluster"

So `publishDate` (hoặc `updatedDate`) của các bài `Finalized` trong cùng cluster, lấy 2 bài mới nhất trước bài đang viết. Đây chính là cơ chế khiến bài B viết hôm sau luôn nối với bài A viết hôm trước.
