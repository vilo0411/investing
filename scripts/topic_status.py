#!/usr/bin/env python3
"""Read or update one article's status in topic-clusters.md without loading the file into the LLM.

Usage:
  python3 scripts/topic_status.py <slug>                       → print the matching row(s)
  python3 scripts/topic_status.py <slug> --set "In Progress"   → update the Status cell of that row
  python3 scripts/topic_status.py <slug> --set Finalized --all → update every row with that exact slug
  python3 scripts/topic_status.py --find "từ khóa"             → search rows by keyword / slug text
  python3 scripts/topic_status.py --list Finalized             → list rows with a given status
  python3 scripts/topic_status.py --list Finalized --cluster C7  → same, limited to one cluster
                                                                  (sorted by publishDate, newest first)

Data rows: tables whose header has column 2 starting with "Slug" and column 3 == "Status",
plus hub lines of the form  **Hub:** Name | `/path/slug/` | `Status`.
Statuses: Planned · In Progress · Outline-Approved · Drafting · Optimizing · Finalized
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _common import ARTICLES_DIR, TOPIC_FILE, article_url, compact, read_text, setup_utf8, split_frontmatter, unaccent  # noqa: E402

VALID_STATUS = ["Planned", "In Progress", "Outline-Approved", "Drafting", "Optimizing", "Finalized"]

CLUSTER_RE = re.compile(r"^##\s+CLUSTER\s+(C\d+)\b(.*)$")
HUB_RE = re.compile(r"^\*\*Hub:\*\*\s*(.+?)\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`")


def split_cells(line: str) -> list[str]:
    return [c.strip() for c in line.strip().strip("|").split("|")]


def parse_rows(lines: list[str]) -> list[dict]:
    """Return one dict per data row: idx, kind (table|hub), cluster_id, cluster, keyword, slug, status."""
    rows: list[dict] = []
    cluster_id, cluster_name, sub = "", "", ""
    header: list[str] | None = None
    for i, line in enumerate(lines):
        m = CLUSTER_RE.match(line)
        if m:
            cluster_id = m.group(1)
            cluster_name = (m.group(1) + m.group(2)).strip()
            sub, header = "", None
            continue
        if line.startswith("## "):
            # Non-cluster section (overview, statistics) — nothing below belongs to a cluster.
            cluster_id, cluster_name, sub, header = "", "", "", None
            continue
        if line.startswith("### "):
            sub = line[4:].strip()
            header = None
            continue
        cluster = f"{cluster_name} / {sub}" if sub and cluster_name else cluster_name
        hub = HUB_RE.match(line)
        if hub:
            slug = hub.group(2).strip().strip("/").split("/")[-1]
            rows.append({"idx": i, "kind": "hub", "cluster_id": cluster_id, "cluster": cluster,
                         "keyword": hub.group(1).strip(), "slug": slug, "status": hub.group(3).strip()})
            continue
        if not line.startswith("|"):
            header = None
            continue
        cells = split_cells(line)
        if header is None:
            header = cells
            continue
        if set("".join(cells)) <= set(":- "):
            continue  # separator row
        if len(header) < 3 or not header[1].startswith("Slug") or header[2] != "Status" or len(cells) < 3:
            continue
        slug = cells[1].strip("`").strip()
        if "/" in slug:
            slug = slug.strip("/").split("/")[-1]
        rows.append({"idx": i, "kind": "table", "cluster_id": cluster_id, "cluster": cluster,
                     "keyword": cells[0], "slug": slug, "status": cells[2].strip("`").strip()})
    return rows


def article_meta(slug: str) -> tuple[str, str]:
    """(url, publishDate) if src/content/articles/<slug>.md exists, else ("—", "")."""
    p = ARTICLES_DIR / f"{slug}.md"
    if not slug or not p.is_file():
        return "—", ""
    fm, _, _ = split_frontmatter(read_text(p)[0])
    cat = fm.get("category", "")
    date = fm.get("publishDate", "")
    return article_url(cat if isinstance(cat, str) else "", slug), date if isinstance(date, str) else ""


def cluster_filter(rows: list[dict], cluster: str | None) -> list[dict]:
    if not cluster:
        return rows
    c = cluster.strip()
    if re.fullmatch(r"[Cc]\d+", c):
        return [r for r in rows if r["cluster_id"].upper() == c.upper()]
    q = unaccent(c)
    return [r for r in rows if q in unaccent(r["cluster"])]


def print_table(title: str, rows: list[dict], sort_by_date: bool = False) -> None:
    enriched = [(r, *article_meta(r["slug"])) for r in rows]
    if sort_by_date:
        dated = sorted([e for e in enriched if e[2]], key=lambda e: e[2], reverse=True)
        enriched = dated + [e for e in enriched if not e[2]]
    print(f"# {title}\n")
    print("| Slug | Keyword | Trạng thái | Cluster | URL | publishDate |")
    print("|---|---|---|---|---|---|")
    for r, url, date in enriched:
        kw = r["keyword"] + (" (Hub)" if r["kind"] == "hub" else "")
        print(f"| {r['slug']} | {kw} | {r['status']} | {r['cluster']} | {url} | {date or '—'} |")


def replace_status(line: str, row: dict, new_status: str) -> str:
    """Swap only the status text, keeping spacing and backticks."""
    if row["kind"] == "hub":
        spans = list(re.finditer(r"`([^`]*)`", line))
        last = spans[-1]
        return line[:last.start(1)] + new_status + line[last.end(1):]
    lead = line[: len(line) - len(line.lstrip())]
    parts = line.lstrip().split("|")  # parts[0] == "" (leading pipe), parts[3] == status cell
    cell = parts[3]
    old = row["status"]
    pos = cell.find(old)
    if pos < 0:
        return line
    parts[3] = cell[:pos] + new_status + cell[pos + len(old):]
    return lead + "|".join(parts)


def main() -> None:
    setup_utf8()
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", nargs="?")
    ap.add_argument("--set", metavar="STATUS", help="New status for the matched row (exact slug only)")
    ap.add_argument("--all", action="store_true", help="With --set: update every row with this exact slug")
    ap.add_argument("--find", metavar="TEXT", help="Search keyword/slug (accent- and punctuation-insensitive)")
    ap.add_argument("--list", metavar="STATUS", help="List all rows with this status")
    ap.add_argument("--cluster", metavar="X", help="Limit --find/--list to a cluster (C7 or part of its name)")
    args = ap.parse_args()

    if not TOPIC_FILE.exists():
        print(f"Không tìm thấy {TOPIC_FILE}", file=sys.stderr)
        sys.exit(2)
    raw = TOPIC_FILE.read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"  # preserve the file's line endings on write
    lines = raw.decode("utf-8").split(nl)
    rows = parse_rows(lines)

    if args.list:
        hits = cluster_filter([r for r in rows if r["status"].lower() == args.list.strip().lower()], args.cluster)
        scope = f" · cluster {args.cluster}" if args.cluster else ""
        print_table(f"{len(hits)} dòng ở trạng thái {args.list}{scope}", hits, sort_by_date=bool(args.cluster))
        return

    if args.find:
        q, qc = unaccent(args.find), compact(args.find)
        hits = [r for r in rows
                if any(q in unaccent(r[k]) or (qc and qc in compact(r[k])) for k in ("keyword", "slug"))]
        hits = cluster_filter(hits, args.cluster)
        print_table(f"{len(hits)} dòng khớp “{args.find}”" + (" (hiện 30 dòng đầu)" if len(hits) > 30 else ""),
                    hits[:30], sort_by_date=bool(args.cluster))
        return

    if not args.slug:
        ap.error("cần <slug>, --find hoặc --list")

    slug = args.slug.strip().strip("/").split("/")[-1]
    exact = [r for r in rows if r["slug"] == slug]

    if args.set is None:
        hits = exact or [r for r in rows if slug in r["slug"]]  # substring fallback: display only
        if not hits:
            print(f"Không có dòng nào cho slug '{slug}' trong topic-clusters.md.", file=sys.stderr)
            sys.exit(1)
        print_table(f"{len(hits)} dòng cho '{slug}'" + ("" if exact else " (khớp gần đúng)"), hits)
        return

    if not exact:
        print(f"Không có dòng nào với slug chính xác '{slug}' trong topic-clusters.md. Thêm 1 dòng "
              f"`| Keyword | `{slug}` | `Planned` |` vào bảng của cluster phù hợp rồi chạy lại.", file=sys.stderr)
        sys.exit(1)
    if len(exact) > 1 and not args.all:
        print(f"{len(exact)} dòng khớp '{slug}' — không --set khi chưa có --all:", file=sys.stderr)
        for r in exact:
            print(f"  dòng {r['idx'] + 1}: [{r['kind']}] {r['keyword']} ({r['status']}) — {r['cluster']}",
                  file=sys.stderr)
        sys.exit(1)

    new_status = args.set.strip()
    if new_status not in VALID_STATUS:
        print(f"Cảnh báo: '{new_status}' không nằm trong {VALID_STATUS} — vẫn ghi.", file=sys.stderr)

    changed = []
    for r in exact:
        if r["status"] == new_status:
            print(f"Không đổi: {slug} đã ở trạng thái {new_status} (dòng {r['idx'] + 1})")
            continue
        new_line = replace_status(lines[r["idx"]], r, new_status)
        if new_line == lines[r["idx"]]:
            print("Không thay được ô trạng thái (format dòng không chuẩn):\n" + lines[r["idx"]], file=sys.stderr)
            sys.exit(1)
        lines[r["idx"]] = new_line
        changed.append(r)
    if changed:
        TOPIC_FILE.write_bytes(nl.join(lines).encode("utf-8"))
    for r in changed:
        print(f"Đã cập nhật {slug}: {r['status']} → {new_status} (dòng {r['idx'] + 1}, {r['cluster']})")


if __name__ == "__main__":
    main()
