---
description: Tạo Topic Cluster map từ file keyword csv hoặc raw file
---

# Lệnh: /cluster [csv|raw file]

## Nhiệm vụ
Phân nhóm từ khóa (Topic Clustering) từ file dữ liệu đầu vào.

## Quy trình thực thi
1. Đọc file keyword từ đường dẫn được cung cấp hoặc mặc định tại `knowledge/3-pipeline/keywords.csv`.
2. Phân tích semantic (ngữ nghĩa) và nhóm các từ khóa thành các Cluster (Hub & Spoke).
3. Tạo ra cấu trúc Topic Clusters.
4. Cập nhật và lưu vào file `knowledge/4-content/topic-clusters.md`. Giữ đúng format để `scripts/topic_status.py` parse được: heading `## CLUSTER Cxx — Tên`, dòng hub ``**Hub:** Tên | `/path/slug/` | `Status` ``, bảng spoke có header `| Keyword | Slug | Status |` (slug và status bọc backtick). Trạng thái hợp lệ: `Planned` | `In Progress` | `Outline-Approved` | `Drafting` | `Optimizing` | `Finalized`.
