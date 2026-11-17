"""把 Open Music Theory 里要精读的小节摘出来，配上中文译文，生成 assets/data-reading.js，网站离线可读。

OMT（Open Music Theory, Version 2）以 CC BY-SA 4.0 发布；摘录只做格式清理，英文原文未改动；
中文是本站翻译，同样以 CC BY-SA 4.0 提供。谱例图片下载到 assets/reading/omt/，各自的版权声明见每条摘录的 credit。

用法（需要 beautifulsoup4）：
    # 1. 列出所有待译的句段，写到 build/omt_units.txt，方便对照翻译
    uv run --no-project --python 3.12 --with beautifulsoup4 python -I build/build_reading.py dump .raw/omt
    # 2. 合并 build/omt_zh.txt 里的译文，生成 data-reading.js（缺译文会报错）
    uv run --no-project --python 3.12 --with beautifulsoup4 python -I build/build_reading.py build .raw/omt

<原始 HTML 目录> 里放 CHAPTERS 中列出的页面，文件名是章节 slug 加 .html。
OMT 的服务器会拦截默认的 curl 请求，下载时要带浏览器的 User-Agent。
"""
import html
import json
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Comment, NavigableString, Tag
from bs4.element import TemplateString

ROOT = Path(__file__).resolve().parent.parent
OMT = "https://viva.pressbooks.pub/openmusictheory/chapter/"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
IMG_DIR = ROOT / "assets" / "reading" / "omt"
UNITS_TXT = ROOT / "build" / "omt_units.txt"
ZH_TXT = ROOT / "build" / "omt_zh.txt"
OUT_JS = ROOT / "assets" / "data-reading.js"

# 章节 slug -> 中文章名
CHAPTERS = {
    "half-and-whole-steps": "半音、全音与变音记号",
    "pitch-and-pitch-class": "音高与音级",
    "aspn": "美国标准音高记法（ASPN）",
    "notating-rhythm": "节奏的记谱",
    "simple-meter-and-time-signatures": "单拍子与拍号",
    "compound-meters-and-time-signatures": "复拍子与拍号",
    "swing-rhythms": "摇摆节奏",
    "rhythm-and-meter-in-pop-music": "流行音乐里的节奏与节拍",
}

# 摘录清单：键 -> (章节, 小节编号)；0 = 章首（要点框 + 第一个小节之前的引言）
EXCERPTS = {
    # G1 第 2 天
    "hs-intro": ("half-and-whole-steps", 0),
    "hs-steps": ("half-and-whole-steps", 1),
    "hs-acc": ("half-and-whole-steps", 2),
    "hs-black": ("half-and-whole-steps", 3),
    "hs-enh": ("half-and-whole-steps", 4),
    # G1 第 3 天
    "pc-pitch": ("pitch-and-pitch-class", 1),
    "pc-class": ("pitch-and-pitch-class", 2),
    "aspn-intro": ("aspn", 0),
    "aspn-pc": ("aspn", 1),
    "aspn-oct": ("aspn", 2),
    "aspn-key": ("aspn", 3),
    "aspn-staff": ("aspn", 4),
    # G2 第 1 天
    "nr-intro": ("notating-rhythm", 0),
    "nr-notes": ("notating-rhythm", 1),
    "nr-rests": ("notating-rhythm", 2),
    "nr-dots": ("notating-rhythm", 3),
    # G2 第 2 天
    "sm-intro": ("simple-meter-and-time-signatures", 0),
    "sm-terms": ("simple-meter-and-time-signatures", 1),
    "sm-sig": ("simple-meter-and-time-signatures", 4),
    "sm-count": ("simple-meter-and-time-signatures", 5),
    "cm-intro": ("compound-meters-and-time-signatures", 0),
    "cm-sig": ("compound-meters-and-time-signatures", 2),
    "cm-count": ("compound-meters-and-time-signatures", 3),
    # G2 第 3 天
    "sw-intro": ("swing-rhythms", 0),
    "sw-groove": ("swing-rhythms", 1),
    "sw-sync": ("swing-rhythms", 2),
    "pop-intro": ("rhythm-and-meter-in-pop-music", 0),
    "pop-sync": ("rhythm-and-meter-in-pop-music", 1),
    "pop-tresillo": ("rhythm-and-meter-in-pop-music", 2),
}

INLINE_KEEP = {"em": "em", "i": "em", "strong": "strong", "b": "strong", "sup": "sup", "sub": "sub"}


def norm_ws(s):
    return re.sub(r"[ \t\r\n]+", " ", s)


def has_class(el, *names):
    c = el.get("class") or []
    return any(n in c for n in names)


def is_section_header(el):
    return isinstance(el, Tag) and el.name == "h1" and has_class(el, "section-header")


def is_tail(el):
    """章末的延伸阅读、作业、图片版权、脚注、术语表：从这里往后都不属于任何小节。"""
    return isinstance(el, Tag) and el.name == "div" and (
        has_class(el, "media-attributions", "glossary", "footnotes") or
        (has_class(el, "textbox") and has_class(el, "shaded"))
    )


def latex(s):
    """OMT 用 [latex] 写拍号和级数，换成普通文字：^4_4 → 4/4，\\hat{6} → 6̂。"""
    def conv(m):
        t = m.group(1).replace("\\:", "")
        t = re.sub(r"\\mathbf\{\^\{?(\d+)\}?_\{?(\d+)\}?\}", r"\1/\2", t)
        t = t.replace("\\quad", "　").replace("\\downarrow", "↓").replace("\\uparrow", "↑")
        t = re.sub(r"\\hat\{(\d)\}", "\\1\u0302", t)
        return re.sub(r"\s+", " ", t).strip()
    return re.sub(r"\[latex\](.*?)\[/latex\]", conv, s)


def fetch(url, dest):
    if dest.exists() and dest.stat().st_size > 0:
        return
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/*,*/*;q=0.8"})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())


def pick_img(img):
    """优先用 768 宽的版本：够清楚，体积也小。"""
    best = img.get("src")
    srcset = img.get("srcset") or ""
    cands = []
    for part in srcset.split(","):
        bits = part.strip().split()
        if len(bits) == 2 and bits[1].endswith("w"):
            cands.append((int(bits[1][:-1]), bits[0]))
    if cands:
        cands.sort()
        fit = [c for c in cands if c[0] >= 700]
        best = (fit[0] if fit else cands[-1])[1]
    return best


class Cleaner:
    """把 OMT 的 HTML 转成本站的格式。每一段要翻译的文字登记成一个句段，先输出占位符，最后再替换成双语。"""

    def __init__(self, base_url, glossary, download, footnotes=None):
        self.base = base_url
        self.glossary = glossary
        self.download = download
        self.footnotes = footnotes or {}
        self.used_fn = []
        self.units = []
        self.images = []
        self.headings = 0

    def unit(self, inner):
        inner = latex(re.sub(r"\s+", " ", inner).strip())
        inner = re.sub(r"(<br>\s*)+$", "", inner)
        if not re.sub(r"<[^>]+>", "", inner).strip():
            return ""
        self.units.append(inner)
        return f"\u0000{len(self.units) - 1}\u0000"

    def footnote_block(self):
        out = ""
        for n in self.used_fn:
            li = self.footnotes.get(n)
            if li is None:
                continue
            for back in li.select("a.return-footnote"):
                back.decompose()
            out += f'<p class="doc-fn"><sup>[{n}]</sup> {self.unit(self.inline(li))}</p>'
        return out

    def children(self, el):
        return "".join(self.node(c) for c in el.children)

    def inline(self, el):
        """段落内部：保留强调、上下标、链接、术语。"""
        out = ""
        for c in el.children:
            if isinstance(c, Comment):
                continue
            if isinstance(c, NavigableString):
                out += html.escape(norm_ws(str(c)), quote=False)
                continue
            if not isinstance(c, Tag):
                continue
            n = c.name
            if n == "sup" and has_class(c, "footnote"):
                m = re.search(r"\d+", c.get_text())
                if m:
                    k = int(m.group())
                    if k not in self.used_fn:
                        self.used_fn.append(k)
                    out += f"<sup>[{k}]</sup>"
                continue
            if n == "a" and has_class(c, "glossary-term"):
                d = self.glossary.get((c.get("href") or "").lstrip("#"), "")
                t = f' title="{html.escape(d, quote=True)}"' if d else ""
                out += f'<b class="gl"{t}>{self.inline(c)}</b>'
            elif n == "a":
                href = c.get("href") or ""
                inner = self.inline(c)
                url = urljoin(self.base, href)
                if href.startswith("#") or not url.startswith(("http://", "https://")) or not inner.strip():
                    out += inner
                else:
                    out += f'<a href="{html.escape(url, quote=True)}" target="_blank" rel="noopener">{inner}</a>'
            elif n in INLINE_KEEP:
                out += f"<{INLINE_KEEP[n]}>{self.inline(c)}</{INLINE_KEEP[n]}>"
            elif n == "br":
                out += " "
            elif n in ("span", "abbr", "small", "u", "mark"):
                out += self.inline(c)
            elif n == "iframe":
                continue
            else:
                out += self.inline(c)
        return out

    def embed(self, f):
        src = f.get("src") or ""
        title = f.get("title") or ""
        if "youtube.com/embed/" in src:
            vid = urlparse(src).path.rsplit("/", 1)[-1]
            return f'<p class="doc-embed">▶ 视频：<a href="https://www.youtube.com/watch?v={vid}" target="_blank" rel="noopener">{html.escape(title or "在 YouTube 观看")}</a></p>'
        if "musescore.com" in src:
            u = src.replace("/embed", "")
            return f'<p class="doc-embed">♪ 谱例（MuseScore，可以播放）：<a href="{html.escape(u, quote=True)}" target="_blank" rel="noopener">在 MuseScore 打开</a></p>'
        if "spotify.com" in src:
            u = src.replace("/embed/", "/")
            return f'<p class="doc-embed">♪ 听例（Spotify）：<a href="{html.escape(u, quote=True)}" target="_blank" rel="noopener">在 Spotify 打开</a></p>'
        if has_class(f, "h5p-iframe"):
            return f'<p class="doc-embed">✎ 互动练习：{html.escape(title)}（<a href="{html.escape(self.base, quote=True)}" target="_blank" rel="noopener">到原页面做</a>）</p>'
        return ""

    def figure(self, el):
        img = el.find("img")
        out = ""
        if img is not None:
            url = pick_img(img)
            name = Path(urlparse(url).path).name
            if self.download:
                fetch(url, IMG_DIR / name)
            self.images.append(name)
            alt = html.escape(norm_ws(img.get("alt") or ""), quote=True)
            out += f'<img src="assets/reading/omt/{html.escape(name, quote=True)}" alt="{alt}" loading="lazy">'
        cap = el.find("figcaption")
        if cap is not None:
            out += f"<figcaption>{self.unit(self.inline(cap))}</figcaption>"
        return f'<figure class="doc-fig">{out}</figure>'

    def node(self, el):
        if isinstance(el, (Comment, NavigableString)) or not isinstance(el, Tag):
            if isinstance(el, NavigableString) and not isinstance(el, Comment) and str(el).strip():
                return f"<p>{self.unit(html.escape(norm_ws(str(el)), quote=False))}</p>"
            return ""
        n = el.name
        if n in ("script", "style", "template", "button", "noscript"):
            return ""
        if n == "iframe":
            return self.embed(el)
        if n in ("h1", "h2", "h3", "h4"):
            tag = "h4" if self.headings == 0 else "h5"
            self.headings += 1
            return f"<{tag}>{self.unit(self.inline(el))}</{tag}>"
        if n == "figure" or (n == "div" and has_class(el, "wp-caption")):
            return self.figure(el)
        if n == "p":
            frames = el.find_all("iframe")
            if frames:
                rest = BeautifulSoup(str(el), "html.parser").p
                for f in rest.find_all("iframe"):
                    f.decompose()
                txt = self.unit(self.inline(rest))
                return "".join(self.embed(f) for f in frames) + (f"<p>{txt}</p>" if txt else "")
            if el.find("img") is not None:
                return self.figure(el)
            txt = self.unit(self.inline(el))
            return f"<p>{txt}</p>" if txt else ""
        if n in ("ul", "ol"):
            items = []
            for li in el.find_all("li", recursive=False):
                sub = [c for c in li.children if isinstance(c, Tag) and c.name in ("ul", "ol")]
                for s in sub:
                    s.extract()
                body = self.unit(self.inline(li))
                body += "".join(self.node(s) for s in sub)
                items.append(f"<li>{body}</li>")
            start = f' start="{el.get("start")}"' if n == "ol" and el.get("start") else ""
            return f"<{n}{start}>{''.join(items)}</{n}>"
        if n == "table":
            rows = []
            for tr in el.find_all("tr"):
                cells = []
                for td in tr.find_all(["td", "th"], recursive=False):
                    span = "".join(f' {a}="{td.get(a)}"' for a in ("colspan", "rowspan") if td.get(a))
                    cells.append(f"<{td.name}{span}>{self.unit(self.inline(td))}</{td.name}>")
                rows.append("<tr>" + "".join(cells) + "</tr>")
            cap = el.find("caption")
            c = f"<caption>{self.unit(self.inline(cap))}</caption>" if cap else ""
            return f'<div class="doc-table"><table>{c}{"".join(rows)}</table></div>'
        if n == "div" and has_class(el, "textbox"):
            title_el = el.select_one(".textbox__title")
            title = self.inline(title_el) if title_el else ""
            body_el = el.select_one(".textbox__content") or el
            if title_el is not None and title_el.find_parent(class_="textbox__content") is None:
                pass
            if has_class(el, "textbox--exercises"):
                return "".join(self.embed(f) for f in body_el.find_all("iframe"))
            t = f"<b>{self.unit(title)}</b>" if title else ""
            return f'<div class="doc-note">{t}{self.children(body_el)}</div>'
        if n == "blockquote":
            return f"<blockquote>{self.children(el)}</blockquote>"
        if n in ("div", "section", "span", "header"):
            return self.children(el)
        if n == "hr":
            return ""
        txt = self.unit(self.inline(el))
        return f"<p>{txt}</p>" if txt else ""


def chapter_parts(soup):
    """章节正文按 h1.section-header 切开：parts[0] 是章首，parts[k] 是第 k 个小节。"""
    sec = soup.select_one("section.chapter")
    parts = [[]]
    heads = [None]
    for c in sec.children:
        if isinstance(c, Tag) and c.name == "header":
            continue
        if is_tail(c):
            break
        if is_section_header(c):
            parts.append([c])
            heads.append(c)
            continue
        parts[-1].append(c)
    return sec, parts, heads


def chapter_meta(soup):
    sec = soup.select_one("section.chapter")
    hdr = sec.find("header")
    title = norm_ws(hdr.find("h1").get_text(" ")).strip()
    au = hdr.find(attrs={"data-type": "author"})
    authors = norm_ws(au.get_text(" ")).strip() if au else ""
    glossary = {}
    for t in soup.select("div.glossary template"):
        d = t.find(class_="glossary__definition")
        if d is not None:
            p = d.find("p")
            # <template> 里的文字是 TemplateString，get_text 默认会跳过
            glossary[t.get("id")] = norm_ws((p or d).get_text(" ", types=(NavigableString, TemplateString))).strip()
    media = []
    ma = sec.select_one(".media-attributions")
    if ma is not None:
        for li in ma.find_all("li"):
            media.append(norm_ws(li.get_text(" ")).replace(" ,", ",").strip())
    footnotes = {i + 1: li for i, li in enumerate(soup.select("div.footnotes li"))}
    return title, authors, glossary, media, footnotes


def load_zh():
    zh, key = {}, None
    if not ZH_TXT.exists():
        return zh
    for ln, line in enumerate(ZH_TXT.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip() or line.startswith("#"):
            continue
        if line.startswith("@@ "):
            key = line[3:].strip()
            zh.setdefault(key, {})
            continue
        m = re.match(r"^(\d+)\s(.*)$", line)
        if not m or key is None:
            raise SystemExit(f"omt_zh.txt 第 {ln} 行格式不对：{line[:40]}")
        zh[key][int(m.group(1))] = m.group(2).strip()
    return zh


def plain(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    mode, raw_dir = sys.argv[1], Path(sys.argv[2])
    download = mode == "build"
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    soups, metas = {}, {}
    result, dump = {}, []
    zh = load_zh() if mode == "build" else {}
    missing = []
    for key, (slug, idx) in EXCERPTS.items():
        if slug not in soups:
            soups[slug] = BeautifulSoup((raw_dir / f"{slug}.html").read_text(encoding="utf-8"), "html.parser")
            metas[slug] = chapter_meta(soups[slug])
        title, authors, glossary, media, footnotes = metas[slug]
        _, parts, heads = chapter_parts(soups[slug])
        url = OMT + slug + "/"
        cl = Cleaner(url, glossary, download, footnotes)
        nodes = parts[idx]
        if idx == 0:
            # 章首没有小节标题，用章名当标题
            cl.headings = 1
            body = f"<h4>\u0000T\u0000</h4>" + "".join(cl.node(n) for n in nodes)
            sec_title = title
            anchor = url
        else:
            body = "".join(cl.node(n) for n in nodes)
            sec_title = norm_ws(heads[idx].get_text(" ")).strip()
            anchor = f"{url}#{heads[idx].get('id')}"
        body += cl.footnote_block()
        body = re.sub(r"<p>\s*</p>", "", body)
        dump.append(f"@@ {key}    〔{title} · {sec_title}〕")
        for i, u in enumerate(cl.units):
            if not re.search(r"[A-Za-z]{2}", plain(u)):
                continue
            dump.append(f"{i} {u}")
        dump.append("")
        if mode != "build":
            continue
        tz = zh.get(key, {})

        def bi(m):
            i = m.group(1)
            if i == "T":
                return f'<span class="en">{html.escape(title, quote=False)}</span><span class="zh">{html.escape(CHAPTERS[slug], quote=False)}</span>'
            i = int(i)
            if i in tz:
                z = tz[i]
            elif not re.search(r"[A-Za-z]{2}", plain(cl.units[i])):
                z = cl.units[i]  # 只有数字、符号或拍号，不用翻译
            else:
                missing.append(f"{key}#{i}")
                z = ""
            # 译文里的术语按出现顺序沿用英文术语表的释义（鼠标悬停可见）
            defs = iter(re.findall(r'<b class="gl"( title="[^"]*")?>', cl.units[i]))
            z = re.sub(r'<b class="gl">', lambda _: f'<b class="gl"{next(defs, "")}>', z)
            return f'<span class="en">{cl.units[i]}</span><span class="zh">{z}</span>'

        body = re.sub(r"\u0000(T|\d+)\u0000", bi, body)
        extra = [i for i in tz if i >= len(cl.units)]
        if extra:
            missing.append(f"{key} 多出了译文 {extra}")
        heading_zh = CHAPTERS[slug] if idx == 0 else plain(tz.get(0, ""))
        result[key] = {
            "t": heading_zh or sec_title,
            "te": sec_title if idx else title,
            "src": f"Open Music Theory · {CHAPTERS[slug]}（{title}）",
            "u": anchor,
            "credit": f"原文作者：{authors}。Open Music Theory, Version 2，CC BY-SA 4.0。中文为本站翻译，以英文原文为准。"
                      + (f"图片版权：{'；'.join(media)}" if media and cl.images else ""),
            "h": body.strip(),
        }
    UNITS_TXT.write_text("\n".join(dump), encoding="utf-8", newline="\n")
    if mode != "build":
        n = sum(1 for l in dump if re.match(r"^\d+ ", l))
        words = sum(len(plain(l).split()) for l in dump if re.match(r"^\d+ ", l))
        print(f"{len(EXCERPTS)} 条摘录，{n} 个句段，约 {words} 个英文词；已写到 {UNITS_TXT}")
        return
    if missing:
        raise SystemExit("译文缺失或多余：" + ", ".join(missing[:40]))
    header = (
        "// 自动生成，不要手改：build/build_reading.py\n"
        "// 摘自 Open Music Theory, Version 2（https://viva.pressbooks.pub/openmusictheory/），CC BY-SA 4.0。\n"
        "// 英文只做了格式清理，内容未改动；中文是本站翻译，同样以 CC BY-SA 4.0 提供。每条都带原文链接和作者。\n"
    )
    js = header + "window.READING = Object.assign(window.READING || {}, " + json.dumps(result, ensure_ascii=False, indent=0) + ");\n"
    OUT_JS.write_text(js, encoding="utf-8", newline="\n")
    imgs = sorted(IMG_DIR.glob("*"))
    print(f"{len(result)} 条，{OUT_JS.stat().st_size // 1024} KB；图片 {len(imgs)} 张，{sum(p.stat().st_size for p in imgs) // 1024} KB")


if __name__ == "__main__":
    main()
