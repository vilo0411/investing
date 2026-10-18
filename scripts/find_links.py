#!/usr/bin/env python3
"""Find internal-link targets without loading anchor-index.md (25 KB) into the LLM.

Modes:
  python3 scripts/find_links.py "từ khóa" [--top 8] [--exclude slug] [--json]
      → best-matching published articles to link TO from a new/optimized draft.

  python3 scripts/find_links.py --backfill <slug> [--top 5] [--json]
      → published articles that should link TO <slug> but don't yet, with the exact
        line where an anchor could be inserted.

Primary source: frontmatter of src/content/articles/*.md (title, slug, tags, description, keyTakeaways).
Secondary: knowledge/3-pipeline/anchor-index.md — anchor suggestions only. URLs are always computed
from src/data/site.ts (categories[].path + slug + "/"), root-relative, never taken from the index.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _common import ANCHOR_INDEX, compact, join_ratios, load_articles, load_categories, setup_utf8, tokens, unaccent  # noqa: E402

ANCHOR_ROW_RE = re.compile(r"^\|\s*`([^`]+)`\s*\|[^|]*\|[^|]*\|\s*([^|]+?)\s*\|\s*$")
SKIP_PREFIXES = ("#", "|", "!", ">", "```", "---")


def load_anchors() -> dict[str, str]:
    """slug → suggested anchor text from anchor-index.md (optional file)."""
    anchors: dict[str, str] = {}
    if not ANCHOR_INDEX.exists():
        return anchors
    for line in ANCHOR_INDEX.read_text(encoding="utf-8").splitlines():
        m = ANCHOR_ROW_RE.match(line)
        if m:
            anchors.setdefault(m.group(1).strip(), m.group(2).strip())
    return anchors


def as_text(v) -> str:
    if isinstance(v, list):
        return " ".join(str(x) for x in v)
    return str(v or "")


def short_title(title: str) -> str:
    return re.split(r"[?:]", title, maxsplit=1)[0].strip()


def score(q: set[str], keyword: str, art: dict, anchor: str) -> float:
    if not q:
        return 0.0
    fm = art["fm"]
    title = as_text(fm.get("title"))
    n = len(q)
    s = 3.0 * len(q & tokens(title)) / n
    s += 2.0 * len(q & tokens(art["slug"].replace("-", " "))) / n
    s += 2.0 * len(q & tokens(as_text(fm.get("tags")))) / n
    s += 2.0 * len(q & tokens(anchor)) / n
    s += 1.0 * len(q & tokens(as_text(fm.get("description")) + " " + as_text(fm.get("keyTakeaways")))) / n
    kc = compact(keyword)
    if kc and (kc in compact(title) or kc in compact(art["slug"])):
        s += 1.5
    return round(s, 3)


def mode_search(args, articles: list[dict], anchors: dict[str, str]) -> None:
    cats = load_categories()
    q = tokens(args.keyword)
    ranked = []
    for art in articles:
        if args.exclude and art["slug"] == args.exclude.strip().strip("/").split("/")[-1]:
            continue
        sc = score(q, args.keyword, art, anchors.get(art["slug"], ""))
        if sc > 0:
            ranked.append((sc, art))
    ranked.sort(key=lambda x: (-x[0], x[1]["slug"]))
    top = ranked[: args.top]

    def anchor_for(art: dict) -> str:
        return anchors.get(art["slug"]) or short_title(as_text(art["fm"].get("title"))) or art["slug"]

    if args.json:
        print(json.dumps([{"slug": a["slug"], "url": a["url"], "title": as_text(a["fm"].get("title")),
                           "category": a["category"], "anchor": anchor_for(a), "score": sc} for sc, a in top],
                         ensure_ascii=False, indent=2))
        return
    print(f"# Internal link candidates cho “{args.keyword}” (top {len(top)}/{len(ranked)})\n")
    print("| # | Anchor gợi ý | URL | Category | Title | Score |")
    print("|---|---|---|---|---|---:|")
    for n, (sc, a) in enumerate(top, 1):
        cat = a["category"] + ("" if a["category"] in cats else " ⚠ category không có trong site.ts")
        title = as_text(a["fm"].get("title")).replace("|", "\\|")
        print(f"| {n} | {anchor_for(a)} | {a['url']} | {cat} | {title} | {sc} |")
    if not top:
        print("Không có bài liên quan. Cân nhắc link về hub của cluster hoặc bỏ qua.")
    print("\nChỉ dùng URL root-relative đúng như in ra. Anchor đặt tự nhiên trong câu, "
          "không dùng \"xem thêm\" / \"tại đây\".")


def normalize(s: str) -> str:
    return unaccent(join_ratios(s)).replace("-", " ")


def mode_backfill(args, articles: list[dict], anchors: dict[str, str]) -> None:
    slug = args.backfill.strip().strip("/").split("/")[-1]
    target = next((a for a in articles if a["slug"] == slug), None)
    if target is None:
        print(f"Không tìm thấy bài '{slug}' trong src/content/articles/", file=sys.stderr)
        sys.exit(1)
    title = as_text(target["fm"].get("title"))
    core = normalize(short_title(title))
    core = re.sub(r"\s+(la gi|la ai|nhu the nao)\s*$", "", core).strip()
    anchor = anchors.get(slug, "")
    q = tokens(title) | tokens(as_text(target["fm"].get("tags"))) | tokens(anchor)
    link_re = re.compile(r"\]\([^)]*/" + re.escape(slug) + r"/?\)")
    core_re = re.compile(r"(?<![a-z0-9])" + re.escape(core) + r"(?![a-z0-9])") if core else None

    results = []
    for art in articles:
        if art["slug"] == slug:
            continue
        lines = art["lines"]
        if link_re.search("\n".join(lines)):
            continue
        best = None
        in_fence = False
        for idx in range(art["body_start"], len(lines)):
            s = lines[idx].strip()
            if s.startswith("```"):
                in_fence = not in_fence
                continue
            if in_fence or not s or s.startswith(SKIP_PREFIXES):
                continue
            plain = normalize(re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s))
            hit = 2.0 if core_re and core_re.search(plain) else 0.0
            hit += len(q & tokens(plain)) / max(1, len(q))
            if hit >= 1.0 and (best is None or hit > best[0]):
                best = (round(hit, 3), idx + 1, s)
        if best:
            results.append((best[0], art["path"].name, best[1], best[2]))
    results.sort(key=lambda r: (-r[0], r[1]))
    top = results[: args.top]

    if args.json:
        print(json.dumps([{"file": f, "line": ln, "score": sc, "excerpt": ex} for sc, f, ln, ex in top],
                         ensure_ascii=False, indent=2))
        return
    print(f"# Backfill candidates → {target['url']}\n")
    print(f"Bài đích: **{title}** · {len(results)} bài có đoạn liên quan nhưng chưa link tới bài này\n")
    if not top:
        print("Không có bài nào phù hợp — bỏ qua bước backfill.")
        return
    print("| # | Bài nguồn | Dòng | Đoạn gợi ý chèn link |")
    print("|---|---|---:|---|")
    for n, (sc, f, ln, ex) in enumerate(top, 1):
        ex = ex.replace("|", "\\|")
        print(f"| {n} | {f} | {ln} | {ex[:160]}{'…' if len(ex) > 160 else ''} |")
    print(f"\nURL đích: `{target['url']}`. Anchor lấy từ chính câu trong bài nguồn (không exact-match keyword). "
          "Chỉ sửa đúng dòng đã nêu.")


def main() -> None:
    setup_utf8()
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("keyword", nargs="?", help="Keyword / topic to find link targets for")
    ap.add_argument("--backfill", metavar="SLUG", help="Find published articles that should link to SLUG")
    ap.add_argument("--top", type=int, default=None)
    ap.add_argument("--exclude", help="Slug of the article being written (skip self-links)")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    if not args.keyword and not args.backfill:
        ap.error("cần keyword hoặc --backfill <slug>")
    articles, anchors = load_articles(), load_anchors()
    if args.backfill:
        args.top = args.top or 5
        mode_backfill(args, articles, anchors)
    else:
        args.top = args.top or 8
        mode_search(args, articles, anchors)


if __name__ == "__main__":
    main()
