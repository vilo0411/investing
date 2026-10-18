#!/usr/bin/env python3
"""Shared helpers for the Value Investing content-engine scripts. Import only — do not run directly.

    from _common import ROOT, setup_utf8, unaccent, split_frontmatter, load_articles, article_url

Finalized articles live in src/content/articles/*.md (Astro content collection). Public URLs are
derived exactly like getArticlePath() in src/data/site.ts: categories[].path + slug + "/".
Internal links in markdown are root-relative (no base prefix — astro.config.mjs adds it at build).
"""

from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Canonical project paths (single place to change if the layout moves)
ARTICLES_DIR = ROOT / "src/content/articles"
SITE_TS = ROOT / "src/data/site.ts"
CONTENT = ROOT / "knowledge/4-content"
OUTLINES_DIR = CONTENT / "1-outlines"
DRAFTS_DIR = CONTENT / "2-drafts"
TOPIC_FILE = CONTENT / "topic-clusters.md"
BACKLOG_FILE = CONTENT / "sprint-backlog.md"
PIPELINE_DIR = ROOT / "knowledge/3-pipeline"
ANCHOR_INDEX = PIPELINE_DIR / "anchor-index.md"
REVISION_LOG = PIPELINE_DIR / "revision-log.md"
MEMORY_DIR = ROOT / ".antigravity/memory"
INSTINCTS_FILE = MEMORY_DIR / "instincts.md"
INSTINCTS_ARCHIVE = MEMORY_DIR / "instincts-archive.md"
INSTINCTS_SCOPE_DIR = MEMORY_DIR / "instincts-by-scope"

# Reference only — internal links are always root-relative.
HOST = "https://valueinvesting.com.vn"

# Vietnamese function words + brand words that carry no topical signal.
STOPWORDS = {
    "la", "gi", "va", "cua", "cho", "cac", "nhung", "co", "khong", "duoc", "trong", "khi", "voi", "de",
    "mot", "nay", "nao", "nhu", "the", "cach", "nen", "hay", "ve", "tu", "den", "theo", "tai", "bi", "se",
    "da", "dang", "hon", "nhat", "huong", "dan", "chi", "tiet", "nguoi", "moi", "f0", "bai", "viet",
    "2024", "2025", "2026", "cap", "top", "dieu", "can", "biet", "ma", "hieu", "qua", "tot", "nhanh",
    "an", "toan", "phuong", "phap", "buoc", "so", "value", "investing",
}


def setup_utf8() -> None:
    """Force UTF-8 on stdout/stderr (some consoles default to a legacy codepage)."""
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")


def unaccent(s: str) -> str:
    """Lowercase and strip Vietnamese diacritics (đ → d)."""
    s = s.replace("đ", "d").replace("Đ", "D")
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn").lower()


def compact(s: str) -> str:
    """unaccent + drop everything outside [a-z0-9] ("Chỉ số P/E" == "chỉ số pe" == "chisope")."""
    return re.sub(r"[^a-z0-9]+", "", unaccent(s))


def join_ratios(s: str) -> str:
    """Merge '/' or '.' between two alphanumerics so ratios stay one token (P/E → PE, EV/EBITDA → EVEBITDA)."""
    return re.sub(r"(?<=[A-Za-z0-9])[/.](?=[A-Za-z0-9])", "", s)


def tokens(s: str, stop: set[str] | None = None) -> set[str]:
    stop = STOPWORDS if stop is None else stop
    return {t for t in re.split(r"[^a-z0-9]+", unaccent(join_ratios(s))) if len(t) > 1 and t not in stop}


def slugify(s: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", unaccent(s))).strip("-")


def slug_from_path(p: Path | str) -> str:
    stem = Path(p).stem
    return re.sub(r"^(Draft|Optimize|Proposal|Outline)-", "", stem)


def read_text(p: Path) -> tuple[str, str]:
    """Return (text with LF endings, original newline) so writers can preserve CRLF/LF."""
    raw = p.read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    return raw.decode("utf-8-sig").replace("\r\n", "\n"), nl


def write_text(p: Path, text: str, nl: str = "\n") -> None:
    p.write_bytes(text.replace("\r\n", "\n").replace("\n", nl).encode("utf-8"))


def _unquote(v: str) -> str:
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        inner = v[1:-1]
        return inner.replace('\\"', '"') if v[0] == '"' else inner
    return v


def split_frontmatter(text: str) -> tuple[dict, int, list[str]]:
    """Return (frontmatter dict, body_start_line_index, all_lines).

    Top-level scalars are unquoted strings. A key with an empty value followed by indented
    `- item` lines becomes list[str]; object items (`- question: ...`) are kept as raw strings.
    """
    lines = text.split("\n")
    fm: dict = {}
    if not lines or lines[0].strip() != "---":
        return fm, 0, lines
    current_list: str | None = None
    for i in range(1, len(lines)):
        line = lines[i]
        if line.strip() == "---":
            return fm, i + 1, lines
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            if val:
                fm[key] = _unquote(val)
                current_list = None
            else:
                fm[key] = []
                current_list = key
            continue
        if current_list is not None:
            item = re.match(r"^\s+-\s+(.*)$", line)
            if item:
                fm[current_list].append(_unquote(item.group(1)))
    return fm, 0, lines


_CATEGORIES_CACHE: dict | None = None


def load_categories() -> dict[str, dict]:
    """Parse categories[] in src/data/site.ts → {slug: {"group": str|None, "path": str}}."""
    global _CATEGORIES_CACHE
    if _CATEGORIES_CACHE is not None:
        return _CATEGORIES_CACHE
    text = SITE_TS.read_text(encoding="utf-8")
    start = text.find("export const categories = [")
    if start < 0:
        _CATEGORIES_CACHE = {}
        return _CATEGORIES_CACHE
    end = text.find("];", start)
    block = text[start:end if end > 0 else len(text)]
    # Split on each `slug:` occurrence; take the first path/group inside that slice.
    # (Not brace-based on purpose: descriptions may contain arbitrary characters.)
    starts = [m for m in re.finditer(r'\bslug:\s*"([^"]+)"', block)]
    cats: dict[str, dict] = {}
    for n, m in enumerate(starts):
        seg_end = starts[n + 1].start() if n + 1 < len(starts) else len(block)
        seg = block[m.end():seg_end]
        path = re.search(r'\bpath:\s*"([^"]+)"', seg)
        group = re.search(r'\bgroup:\s*"([^"]+)"', seg)
        cats[m.group(1)] = {"group": group.group(1) if group else None, "path": path.group(1) if path else "/"}
    _CATEGORIES_CACHE = cats
    return cats


def article_url(category: str, slug: str, cats: dict | None = None) -> str:
    """Mirror getArticlePath(): category path (fallback "/") + slug + "/". Root-relative, no base."""
    cats = load_categories() if cats is None else cats
    meta = cats.get((category or "").strip().strip("\"'").strip())
    path = (meta or {}).get("path") or "/"
    return f"{path}{slug}/"


def load_articles() -> list[dict]:
    """All finalized articles: slug, path, fm, body_start, lines, url, category."""
    cats = load_categories()
    out = []
    for p in sorted(ARTICLES_DIR.glob("*.md")):
        if not p.is_file():
            continue
        text, _ = read_text(p)
        fm, body_start, lines = split_frontmatter(text)
        cat = fm.get("category", "")
        cat = cat.strip().strip("\"'").strip() if isinstance(cat, str) else ""
        out.append({
            "slug": p.stem,
            "path": p,
            "fm": fm,
            "body_start": body_start,
            "lines": lines,
            "url": article_url(cat, p.stem, cats),
            "category": cat,
        })
    return out
