import sys
from bs4 import BeautifulSoup
sys.stdout.reconfigure(encoding="utf-8")
soup = BeautifulSoup(open(sys.argv[1], encoding="utf-8").read(), "html.parser")
sec = soup.select_one("section.chapter")
for sel in sys.argv[2:]:
    for el in sec.select(sel)[:2]:
        print("=====", sel); print(str(el)[:1500])
