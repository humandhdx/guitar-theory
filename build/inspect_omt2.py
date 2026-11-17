import sys, re
from pathlib import Path
from bs4 import BeautifulSoup, Tag
sys.stdout.reconfigure(encoding="utf-8")
for p in sorted(Path(sys.argv[1]).glob("*.html")):
    soup = BeautifulSoup(p.read_text(encoding="utf-8"), "html.parser")
    sec = soup.select_one("section.chapter")
    hdr = sec.find("header")
    words = len(sec.get_text(" ").split())
    heads = [(h.get("id"), h.get_text(" ", strip=True)) for h in sec.find_all(["h1","h2","h3"]) if not h.find_parent("header")]
    imgs = sec.find_all("img")
    ifr = [f.get("src","")[:70] for f in sec.find_all("iframe")]
    aud = sec.find_all(["audio","video"])
    print(f"== {p.stem}: words={words} imgs={len(imgs)} iframes={len(ifr)} audio={len(aud)}")
    print("   header:", hdr.get_text(" | ", strip=True)[:120])
    for h in heads: print("   ", h)
    for f in ifr: print("    iframe", f)
