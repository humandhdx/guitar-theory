import sys
from bs4 import BeautifulSoup, Tag
sys.stdout.reconfigure(encoding="utf-8")
p = sys.argv[1]
soup = BeautifulSoup(open(p, encoding="utf-8").read(), "html.parser")
main = soup.select_one("section[data-type=chapter] .ugc, .chapter .ugc, .entry-content, #content")
print("main:", main.name, main.get("class"), main.get("id"))
def walk(el, d=0):
    for c in el.children:
        if isinstance(c, Tag):
            txt = c.get_text(" ", strip=True)[:90]
            print("  "*d + f"<{c.name} id={c.get('id')} class={c.get('class')}> {txt}")
            if d < 1 and c.name in ("div","section","figure"):
                walk(c, d+1)
walk(main)
