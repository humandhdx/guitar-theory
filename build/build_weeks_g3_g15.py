"""将 G3～G15（共 13 个模块、58 个全手写级练习日）合并写入 assets/data-week.js。"""
import json
from pathlib import Path
from week_specs_p1_p2 import WEEK_P1_P2
from week_specs_p3 import WEEK_P3
from week_specs_p4 import WEEK_P4
from week_specs_p5 import WEEK_P5

ROOT = Path(__file__).resolve().parent.parent
WEEK_JS = ROOT / "assets" / "data-week.js"

src = WEEK_JS.read_text(encoding="utf-8")
marker = "\n// ══ 以下为 G3～G15 完整每日计划 ══\n"
if marker in src:
    src = src.split(marker)[0]

ALL = {}
ALL.update(WEEK_P1_P2)
ALL.update(WEEK_P3)
ALL.update(WEEK_P4)
ALL.update(WEEK_P5)

chunks = [src.rstrip(), "", marker.strip()]
for mid in [f"G{i}" for i in range(3, 16)]:
    chunks.append(f"window.WEEKPLAN.{mid} = " + json.dumps(ALL[mid], ensure_ascii=False, indent=2) + ";")

WEEK_JS.write_text("\n".join(chunks) + "\n", encoding="utf-8")
total_days = sum(len(ALL[f"G{i}"]["days"]) for i in range(3, 16))
print(f"Wrote G3..G15 ({total_days} handcrafted days) into {WEEK_JS}")
