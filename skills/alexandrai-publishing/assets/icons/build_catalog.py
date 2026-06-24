#!/usr/bin/env python3
"""Build the icon-library catalog: aggregate manifest.json + a self-contained index.html.

Source of truth = the .svg files on disk under icons/<category>/. This script:
  1. Walks every category folder (skips _exemplars and dotfiles),
  2. Validates each SVG against the SPEC.md hard rules (canonical header, no width/height,
     single currentColor, viewBox 0 0 24 24) and prints any warnings,
  3. Merges keywords from each category's manifest.json (matched by icon name),
  4. Writes icons/manifest.json  — a flat array [{name, file, category, keywords}],
  5. Writes icons/index.html     — a themed, searchable gallery with click-to-copy, every
     SVG inlined so it works straight off the filesystem (file://), no server needed.

Re-run after adding or editing icons:  python3 icons/build_catalog.py   (or: uv run …)
Pure stdlib, no dependencies.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SKIP_DIRS = {"_exemplars"}

SVG_OPEN_RE = re.compile(r"<svg\b[^>]*>", re.IGNORECASE)
VIEWBOX_RE = re.compile(r'viewBox\s*=\s*"0 0 24 24"', re.IGNORECASE)
# match width=/height= ON THE <svg> tag only, preceded by whitespace, so "stroke-width" (hyphen-joined) never trips it
WH_RE = re.compile(r"<svg\b[^>]*?\s(width|height)\s*=", re.IGNORECASE)


def validate(svg: str, rel: str, warns: list[str]) -> None:
    m = SVG_OPEN_RE.search(svg)
    if not m:
        warns.append(f"{rel}: no <svg> tag")
        return
    open_tag = m.group(0)
    if WH_RE.search(svg):
        warns.append(f"{rel}: <svg> carries width/height (consumer must size it)")
    if not VIEWBOX_RE.search(open_tag):
        warns.append(f'{rel}: viewBox is not "0 0 24 24"')
    if 'stroke="currentColor"' not in open_tag and "currentColor" not in svg:
        warns.append(f"{rel}: no currentColor (icons must inherit theme colour)")
    for bad in ("linearGradient", "radialGradient", "<text", "<image", "filter="):
        if bad.lower() in svg.lower():
            warns.append(f"{rel}: contains banned construct '{bad}'")


def main() -> int:
    categories: dict[str, list[dict]] = {}
    warns: list[str] = []

    for cat_dir in sorted(p for p in ROOT.iterdir() if p.is_dir() and p.name not in SKIP_DIRS and not p.name.startswith(".")):
        svgs = sorted(cat_dir.glob("*.svg"))
        if not svgs:
            continue
        # keyword lookup from ALL manifests in the folder (manifest.json + manifest.extra.json …)
        kw: dict[str, list[str]] = {}
        for man in sorted(cat_dir.glob("manifest*.json")):
            try:
                for e in json.loads(man.read_text(encoding="utf-8")):
                    if isinstance(e, dict) and e.get("name"):
                        kw[e["name"]] = e.get("keywords", []) or []
            except json.JSONDecodeError:
                warns.append(f"{cat_dir.name}/{man.name}: invalid JSON (keywords skipped)")
        entries = []
        for svg_path in svgs:
            name = svg_path.stem
            svg = svg_path.read_text(encoding="utf-8").strip()
            validate(svg, f"{cat_dir.name}/{svg_path.name}", warns)
            entries.append({
                "name": name,
                "file": f"{cat_dir.name}/{svg_path.name}",
                "category": cat_dir.name,
                "keywords": kw.get(name) or sorted({*name.split("-"), cat_dir.name}),
                "_svg": svg,  # stripped before writing manifest.json
            })
        categories[cat_dir.name] = entries

    total = sum(len(v) for v in categories.values())

    # ---- manifest.json (no inline svg) ----
    flat = [{k: v for k, v in e.items() if k != "_svg"} for cat in categories.values() for e in cat]
    (ROOT / "manifest.json").write_text(json.dumps(flat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # ---- index.html ----
    (ROOT / "index.html").write_text(render_html(categories, total), encoding="utf-8")

    # ---- report ----
    print(f"icons: {total} across {len(categories)} categories")
    for c, e in categories.items():
        print(f"  {c:<12} {len(e)}")
    if warns:
        print(f"\n{len(warns)} warning(s):")
        for w in warns:
            print(f"  ! {w}")
    else:
        print("\nno warnings — all icons pass the SPEC header checks")
    print("\nwrote: icons/manifest.json, icons/index.html")
    return 0


def render_html(categories: dict[str, list[dict]], total: int) -> str:
    cats = list(categories)
    nav = "\n".join(
        f'<a href="#cat-{c}">{c} <span class="n">{len(categories[c])}</span></a>' for c in cats
    )
    sections = []
    for c in cats:
        tiles = []
        for e in categories[c]:
            kws = " ".join(e["keywords"])
            tiles.append(
                f'<button class="tile" data-name="{e["name"]}" data-kw="{kws}" '
                f'data-cat="{c}" title="{e["name"]} — click to copy SVG">'
                f'<span class="ic">{e["_svg"]}</span>'
                f'<span class="nm">{e["name"]}</span></button>'
            )
        sections.append(
            f'<section class="cat" id="cat-{c}"><h2>{c} '
            f'<span class="cn">{len(categories[c])}</span></h2>'
            f'<div class="grid">{"".join(tiles)}</div></section>'
        )
    body = "\n".join(sections)
    return _TEMPLATE.replace("{{TOTAL}}", str(total)).replace("{{NCAT}}", str(len(cats))).replace("{{NAV}}", nav).replace("{{BODY}}", body)


_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en" data-theme="purple">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1280">
<title>Icon library — {{TOTAL}} icons · Dense Institutional Report System</title>
<style>
:root{
 --bg:#fff;--bg-band:#f6f6f8;--bg-subtle:#fafafb;--bg-deep:#15131a;--rule:#dcdce2;--rule-soft:#ebebef;
 --ink:#11131a;--ink-mid:#33363f;--ink-soft:#5a5e68;--ink-faint:#868b95;
 --navy:#0b5fd4;--navy-deep:#0842a0;--navy-bg:#e8f1fc;--navy-line:#bcd6f5;
 --mono:ui-monospace,"JetBrains Mono","SFMono-Regular",Menlo,Consolas,monospace;
 --sans:-apple-system,"Segoe UI",system-ui,Roboto,"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic UI","Apple SD Gothic Neo","Malgun Gothic","PingFang SC","Microsoft YaHei","Noto Sans CJK JP","Noto Sans CJK KR","Noto Sans CJK SC","Noto Sans JP","Noto Sans KR","Noto Sans SC","Noto Sans",sans-serif;}
html[data-theme="purple"]{--navy:#a100ff;--navy-deep:#7a00c2;--navy-bg:#f3e8ff;--navy-line:#d9bef5;}
html[data-theme="indigo"]{--navy:#4338ca;--navy-deep:#312c92;--navy-bg:#ebebfb;--navy-line:#c7c3f0;}
html[data-theme="teal"]{--navy:#0e7c86;--navy-deep:#095861;--navy-bg:#e0f3f4;--navy-line:#a9dade;}
html[data-theme="green"]{--navy:#1f7a44;--navy-deep:#155730;--navy-bg:#e6f4ea;--navy-line:#b3dcc1;}
html[data-theme="plum"]{--navy:#a21d6e;--navy-deep:#7c1450;--navy-bg:#fbe8f2;--navy-line:#e8b9d4;}
html[data-theme="slate"]{--navy:#3f4f63;--navy-deep:#29384b;--navy-bg:#eef1f5;--navy-line:#c2ccd8;}
html[data-theme="black"]{--navy:#000000;--navy-deep:#000;--navy-bg:#f1f1f3;--navy-line:#d6d6db;}
*{box-sizing:border-box;}
body{margin:0;background:var(--bg);color:var(--ink);font:13px/1.6 var(--sans);-webkit-font-smoothing:antialiased;}
.topbar{position:sticky;top:0;z-index:9;background:#fff;border-bottom:1px solid var(--rule);padding:10px 32px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;}
.logo{font-weight:800;font-size:15px;}.logo small{font-weight:600;color:var(--ink-faint);margin-left:8px;font-size:11px;}
.count{font-family:var(--mono);font-size:11px;color:var(--ink-faint);}
.controls{margin-left:auto;display:flex;gap:10px;align-items:center;}
#q{font:13px var(--sans);padding:6px 11px;border:1px solid var(--rule);border-radius:7px;width:240px;outline:none;}
#q:focus{border-color:var(--navy);box-shadow:0 0 0 3px var(--navy-bg);}
select{font:12px var(--sans);padding:5px 8px;border:1px solid var(--rule);border-radius:7px;background:#fff;color:var(--ink-mid);}
.wrap{max-width:1280px;margin:0 auto;padding:20px 32px 80px;display:grid;grid-template-columns:160px 1fr;gap:32px;align-items:start;}
.toc{position:sticky;top:60px;display:flex;flex-direction:column;gap:1px;}
.toc a{display:flex;justify-content:space-between;gap:8px;padding:5px 9px;border-radius:6px;color:var(--ink-mid);text-decoration:none;font-size:12px;text-transform:capitalize;}
.toc a:hover{background:var(--navy-bg);color:var(--navy-deep);}
.toc .n{font-family:var(--mono);font-size:10px;color:var(--ink-faint);}
.cat{margin:0 0 26px;scroll-margin-top:64px;}
.cat h2{font-size:15px;font-weight:800;margin:0 0 12px;text-transform:capitalize;display:flex;align-items:center;gap:9px;}
.cat h2 .cn{font-family:var(--mono);font-size:10px;font-weight:700;color:var(--navy-deep);background:var(--navy-bg);border:1px solid var(--navy-line);border-radius:5px;padding:1px 7px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px;}
.tile{display:flex;flex-direction:column;align-items:center;gap:9px;padding:15px 8px 9px;background:#fff;border:1px solid var(--rule);border-radius:11px;cursor:pointer;font:inherit;color:var(--ink-soft);transition:border-color .12s,box-shadow .12s,color .12s;}
.tile:hover{border-color:var(--navy);color:var(--navy-deep);box-shadow:0 1px 3px rgba(17,19,26,.06);}
.tile .ic{color:var(--ink);}
.tile:hover .ic{color:var(--navy);}
.tile .ic svg{width:26px;height:26px;display:block;}
.tile .nm{font-family:var(--mono);font-size:9.5px;line-height:1.3;text-align:center;word-break:break-word;color:var(--ink-faint);}
.tile.hide{display:none;}
.cat.hide{display:none;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--bg-deep);color:#fff;font-size:12px;font-family:var(--mono);padding:9px 16px;border-radius:8px;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;z-index:20;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.empty{color:var(--ink-faint);font-size:13px;padding:30px 0;display:none;}
footer{border-top:1px solid var(--rule);color:var(--ink-faint);font-size:11px;font-family:var(--mono);padding:18px 32px;text-align:center;}
</style>
</head>
<body>
<nav class="topbar">
 <div class="logo">{{ORG}} <small>Icon library · currentColor · 24-grid monoline</small></div>
 <span class="count">{{TOTAL}} icons · {{NCAT}} categories</span>
 <div class="controls">
  <input id="q" type="search" placeholder="Search name or keyword…" autocomplete="off">
  <select id="theme" title="brand theme (icons follow currentColor)">
   <option value="purple">Purple</option><option value="">Blue</option><option value="indigo">Indigo</option>
   <option value="teal">Teal</option><option value="green">Green</option><option value="plum">Plum</option><option value="slate">Slate</option><option value="black">Black</option>
  </select>
 </div>
</nav>
<div class="wrap">
 <aside class="toc">{{NAV}}</aside>
 <main>
  <p class="empty" id="empty">No icons match that search.</p>
  {{BODY}}
 </main>
</div>
<div class="toast" id="toast">copied</div>
<footer>Dense Institutional Report System — bespoke icon set. Click any icon to copy its &lt;svg&gt;. Rebuild: <code>python3 icons/build_catalog.py</code></footer>
<script>
(function(){
 var q=document.getElementById('q'),toast=document.getElementById('toast'),empty=document.getElementById('empty');
 document.getElementById('theme').addEventListener('change',function(e){document.documentElement.setAttribute('data-theme',e.target.value);});
 var tiles=[].slice.call(document.querySelectorAll('.tile'));
 function flash(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(flash._t);flash._t=setTimeout(function(){toast.classList.remove('show');},1100);}
 tiles.forEach(function(t){t.addEventListener('click',function(){
   var svg=t.querySelector('svg').outerHTML;
   navigator.clipboard&&navigator.clipboard.writeText(svg).then(function(){flash('copied '+t.dataset.name);},function(){flash('copy failed');});
 });});
 q.addEventListener('input',function(){
   var s=q.value.trim().toLowerCase(),shown=0;
   tiles.forEach(function(t){
     var hit=!s||t.dataset.name.indexOf(s)>=0||(t.dataset.kw||'').toLowerCase().indexOf(s)>=0||t.dataset.cat.indexOf(s)>=0;
     t.classList.toggle('hide',!hit);if(hit)shown++;
   });
   document.querySelectorAll('.cat').forEach(function(c){
     c.classList.toggle('hide',!c.querySelector('.tile:not(.hide)'));
   });
   empty.style.display=shown?'none':'block';
 });
})();
</script>
</body>
</html>
"""

if __name__ == "__main__":
    raise SystemExit(main())
