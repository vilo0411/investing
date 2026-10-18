#!/usr/bin/env python3
"""Sync instincts-archive.md → compact instincts.md (+ per-scope files).

Reads every ACTIVE instinct from the archive, then:
  1. Dedupes near-identical entries (title token Jaccard ≥ 0.5) — keeps the most recent.
  2. Lists instincts that a lint script enforces mechanically (LINT_COVERED) in a one-line table
     instead of repeating the full rule text (currently none — no lint script in this repo).
  3. Trims each remaining rule to ~MAX_CHARS at a sentence boundary.
  4. Writes Global instincts to .antigravity/memory/instincts.md (target ≤ 8,000 chars) and
     scoped instincts ("Phạm vi: Chỉ topic: X") to .antigravity/memory/instincts-by-scope/<x>.md.

Usage:  python3 scripts/optimize_instincts.py [--max-chars 450] [--dry-run]
                                              [--archive PATH] [--core PATH] [--scope-dir PATH]
The archive is never modified.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _common import INSTINCTS_ARCHIVE, INSTINCTS_FILE, INSTINCTS_SCOPE_DIR, setup_utf8, unaccent  # noqa: E402

ARCHIVE = INSTINCTS_ARCHIVE
CORE = INSTINCTS_FILE
SCOPE_DIR = INSTINCTS_SCOPE_DIR

DEDUPE_THRESHOLD = 0.5
MAX_CHARS = 450
CHAR_BUDGET = 8000

# (title regex, check id) pairs for instincts fully enforced by a machine lint script.
# Fill this in once such a script exists (this repo has no qa_lint.py yet); while empty,
# every ACTIVE instinct is rendered in full and no lint table is emitted.
LINT_COVERED: list[tuple[str, str]] = []

STOP = set("la gi va cua cho cac nhung co khong duoc trong khi voi de mot nay nao nhu the cach nen hay ve tu den "
           "theo tai bi se da dang hon nhat can phai bai viet su dung hoac bang bat buoc tuyet doi luon".split())

CATEGORIES = [
    ("Văn phong & Ngôn từ (Style & Tone)",
     ["vĩ mô", "ngoặc kép", "thuật ngữ", "từ ", "giọng", "xưng hô", "mở bài", "kết bài", "intent", "persona"]),
    ("Cấu trúc & Định dạng (Structure & Formatting)",
     ["heading", "đoạn", "list", "bảng", "table", "sapo", "dấu câu", "định dạng", "faq", "h2", "word count", "visual",
      "ma trận", "so sánh"]),
    ("SEO & Liên kết (SEO & Internal Links)",
     ["link", "sitemap", "đường dẫn", "seo", "title", "url", "anchor"]),
    ("Sản phẩm & Thương hiệu (Products & Brand Context)", []),
]


# ─────────────────────────── Parsing ───────────────────────────

def parse_instincts_file(archive_path):
    """Parse `### Title` blocks with `- **Trạng thái:**`, `- **Bản năng:**`, `- **Phạm vi:**` lines."""
    with open(archive_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    instincts, current = [], None
    for line in lines:
        stripped = line.strip()
        if line.startswith("### "):
            title = line[4:].strip()
            if title == "[Tên ngắn gọn]" or not title:
                continue  # template block in the file header
            if current:
                instincts.append(current)
            current = {"title": title, "status": "", "source": "", "user_feedback": "",
                       "instinct_lines": [], "scope": "Global", "parsing_instinct": False}
            continue
        if current is None:
            continue
        if stripped.startswith("- **Trạng thái:**"):
            current["status"] = stripped.replace("- **Trạng thái:**", "").strip()
            current["parsing_instinct"] = False
        elif stripped.startswith("- **Nguồn:**"):
            current["source"] = stripped.replace("- **Nguồn:**", "").strip()
            current["parsing_instinct"] = False
        elif stripped.startswith("- **Phản hồi từ User:**"):
            current["user_feedback"] = stripped.replace("- **Phản hồi từ User:**", "").strip()
            current["parsing_instinct"] = False
        elif stripped.startswith("- **Bản năng:**"):
            current["parsing_instinct"] = True
            content = stripped.replace("- **Bản năng:**", "").strip()
            if content:
                current["instinct_lines"].append(content)
        elif stripped.startswith("- **Phạm vi:**"):
            current["scope"] = stripped.replace("- **Phạm vi:**", "").strip()
            current["parsing_instinct"] = False
        elif stripped == "---" or line.startswith("## "):
            current["parsing_instinct"] = False
        elif current["parsing_instinct"]:
            current["instinct_lines"].append(line.rstrip("\r\n"))
    if current:
        instincts.append(current)
    return instincts


# ─────────────────────────── Helpers ───────────────────────────

def toks(s: str) -> set[str]:
    return {t for t in re.split(r"[^a-z0-9]+", unaccent(s)) if len(t) > 2 and t not in STOP}


def body_text(inst) -> str:
    return re.sub(r"\s+", " ", " ".join(l.strip() for l in inst["instinct_lines"])).strip()


def trim(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    cut = text[:limit]
    m = max(cut.rfind(". "), cut.rfind("; "))
    if m > limit * 0.5:
        return cut[: m + 1] + " (…xem archive)"
    return cut.rstrip() + "… (xem archive)"


def dedupe(instincts):
    """Drop earlier entries whose title overlaps ≥ threshold with a later one (keep the newer)."""
    keep, merged = [], {}
    sigs = [toks(i["title"]) for i in instincts]
    for i in range(len(instincts)):
        dup_of = None
        for j in range(i + 1, len(instincts)):
            inter = len(sigs[i] & sigs[j])
            union = len(sigs[i] | sigs[j]) or 1
            if inter / union >= DEDUPE_THRESHOLD:
                dup_of = j
                break
        if dup_of is None:
            keep.append(instincts[i])
        else:
            # carry over anything already merged into i (chains: a→b→c)
            chain = merged.pop(instincts[i]["title"], [])
            merged.setdefault(instincts[dup_of]["title"], []).extend(chain + [instincts[i]["title"]])
    return keep, merged


def lint_check_for(title: str) -> str | None:
    """Return the lint check id(s) if EVERY clause of the title is machine-checked."""
    if not LINT_COVERED:
        return None
    clauses = [c for c in re.split(r"\s+(?:và|&|,)\s+", title.lower()) if c.strip()]
    checks = []
    for c in clauses:
        hit = next((check for pat, check in LINT_COVERED if re.search(pat, c)), None)
        if hit is None:
            return None
        if hit not in checks:
            checks.append(hit)
    return " + ".join(checks) if checks else None


def categorize(inst) -> str:
    hay = (inst["title"] + " " + body_text(inst)).lower()
    for name, kws in CATEGORIES[:-1]:
        if any(k in hay for k in kws):
            return name
    return CATEGORIES[-1][0]


def scope_slug(scope: str) -> str:
    s = re.sub(r"^chỉ topic:\s*", "", scope.strip(), flags=re.I)
    return re.sub(r"[^a-z0-9]+", "-", unaccent(s)).strip("-") or "other"


# ─────────────────────────── Rendering ───────────────────────────

def render_core(globals_, linted, merged, scoped_files, max_chars) -> str:
    out = ["# Continuous Learning: Instincts (Bản năng rút gọn)", "",
           "> **Bắt buộc:** Mọi agent/skill đọc file này trước khi viết. Bản đầy đủ (nguồn, feedback gốc, "
           "bản năng PENDING/DEPRECATED) ở `.antigravity/memory/instincts-archive.md`.",
           "> **Sinh tự động** bởi `scripts/optimize_instincts.py` — không sửa tay. Sau `/learn`, ghi vào "
           "archive rồi chạy lại script.",
           ""]
    if scoped_files:
        out.append("> **Bản năng theo topic:** " + ", ".join(f"`instincts-by-scope/{f}`" for f in scoped_files)
                   + " — chỉ load khi bài thuộc topic đó.")
        out.append("")
    cats: dict[str, list] = {}
    for inst in globals_:
        cats.setdefault(categorize(inst), []).append(inst)
    for name, _ in CATEGORIES:
        items = cats.get(name)
        if not items:
            continue
        out += [f"## {name}", ""]
        for inst in items:
            title = inst["title"]
            if title in merged:
                title += f" *(gộp: {'; '.join(merged[title])})*"
            out.append(f"### {title}")
            out.append("- " + trim(body_text(inst), max_chars))
            out.append("")
    if linted:
        out += ["## ✅ Đã tự động hoá bởi lint script (vẫn phải tuân thủ khi viết)", "",
                "| Bản năng | Check |", "|---|---|"]
        for inst, check in linted:
            out.append(f"| {inst['title']} | `{check}` |")
        out.append("")
    return "\n".join(out).rstrip() + "\n"


def render_scope(scope: str, items, max_chars) -> str:
    out = [f"# Instincts — {scope}", "",
           f"> Chỉ load khi bài viết thuộc phạm vi **{scope}**. Sinh tự động từ instincts-archive.md "
           "bởi `scripts/optimize_instincts.py` — không sửa tay.", ""]
    for inst in items:
        out += [f"### {inst['title']}", "- " + trim(body_text(inst), max_chars), ""]
    return "\n".join(out).rstrip() + "\n"


def _overlaps(path: Path, archive: Path) -> bool:
    """True if writing to `path` (file or dir) could touch the archive."""
    return path == archive or archive.is_relative_to(path)


def run(max_chars: int, dry_run: bool, archive: Path = ARCHIVE, core_path: Path = CORE,
        scope_dir: Path = SCOPE_DIR) -> int:
    archive, core_path, scope_dir = archive.resolve(), core_path.resolve(), scope_dir.resolve()
    if _overlaps(core_path, archive) or _overlaps(scope_dir, archive):
        print("Lỗi: --core / --scope-dir trỏ vào archive — từ chối ghi để bảo vệ instincts-archive.md.",
              file=sys.stderr)
        return 2
    if not archive.exists():
        print(f"Lỗi: không tìm thấy {archive}", file=sys.stderr)
        return 2
    all_inst = parse_instincts_file(str(archive))
    active = [i for i in all_inst if i["status"].upper() == "ACTIVE"]
    print(f"Parsed {len(all_inst)} instincts ({len(active)} ACTIVE) từ archive.")

    active, merged = dedupe(active)
    for k, v in merged.items():
        print(f"  dedupe: {v} → giữ '{k}'")

    globals_, linted, scoped = [], [], {}
    for inst in active:
        if inst["scope"].strip().lower() != "global":
            scoped.setdefault(inst["scope"], []).append(inst)
            continue
        check = lint_check_for(inst["title"])
        if check:
            linted.append((inst, check))
        else:
            globals_.append(inst)

    scoped_files = [f"{scope_slug(s)}.md" for s in scoped]
    core = render_core(globals_, linted, merged, scoped_files, max_chars)
    chars = len(core)
    print(f"instincts.md: {len(globals_)} đầy đủ + {len(linted)} lint-covered → {chars:,} ký tự "
          f"({len(core.encode('utf-8')) / 1024:.1f} KB UTF-8)")
    if chars > CHAR_BUDGET:
        print(f"⚠ instincts.md > {CHAR_BUDGET:,} ký tự — giảm --max-chars hoặc DEPRECATE bớt trong archive.")
    for s, items in scoped.items():
        print(f"instincts-by-scope/{scope_slug(s)}.md: {len(items)} bản năng")
    if dry_run:
        return 0
    core_path.write_text(core, encoding="utf-8")
    if scoped:
        scope_dir.mkdir(parents=True, exist_ok=True)
        for s, items in scoped.items():
            (scope_dir / f"{scope_slug(s)}.md").write_text(render_scope(s, items, max_chars), encoding="utf-8")
    print(f"Đã cập nhật {core_path.name}.")
    return 0


if __name__ == "__main__":
    setup_utf8()
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--max-chars", type=int, default=MAX_CHARS)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--archive", type=Path, default=ARCHIVE, help="Source archive (read-only)")
    ap.add_argument("--core", type=Path, default=CORE, help="Output compact instincts file")
    ap.add_argument("--scope-dir", type=Path, default=SCOPE_DIR, help="Output dir for per-topic files")
    a = ap.parse_args()
    sys.exit(run(a.max_chars, a.dry_run, a.archive, a.core, a.scope_dir))
