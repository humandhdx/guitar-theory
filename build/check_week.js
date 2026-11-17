// 检查 data-week.js：每日内容引用的摘录、曲目、练习编号、讲义锚点都存在。用法：node build/check_week.js
const fs = require("fs");
global.window = {};
global.location = { search: "" };
global.localStorage = { getItem: () => null, setItem() {} };
for (const f of ["data-resources", "data-modules", "data-songs", "data-method", "data-reading", "data-reading-ext", "data-week"]) require("../assets/" + f + ".js");
Object.assign(global, window);
require("../assets/core.js");
const C = window.Core;
const ids = new Set(window.SONGS.flatMap((a) => a.items.map((s) => s[0])));
let bad = 0;
const err = (m) => { bad++; console.log("✗", m); };
for (const [mid, P] of Object.entries(window.WEEKPLAN)) {
  const m = window.MODULES.find((x) => x.id === mid);
  const html = fs.readFileSync(__dirname + "/../" + P.lesson, "utf8");
  P.days.forEach((d, i) => {
    const plan = C.dayPlan(m, i, m.days);
    const pi = d.practice.map((p) => p.i).join(",");
    if (pi !== plan.prac.join(",")) err(`${mid} d${i + 1} practice ${pi} ≠ plan ${plan.prac}`);
    if (!!d.accept !== plan.deliv) err(`${mid} d${i + 1} accept 与 deliv 不一致`);
    d.reading.forEach((g) => g.keys.forEach((k) => { if (!window.READING[k]) err(`${mid} d${i + 1} 缺摘录 ${k}`); }));
    d.songs.forEach((s) => { if (!ids.has(s.id)) err(`${mid} d${i + 1} 缺曲目 ${s.id}`); });
    d.lesson.anchors.forEach(([a]) => { if (!html.includes(`id="${a}"`)) err(`${mid} d${i + 1} 讲义缺锚点 ${a}`); });
    const txt = JSON.stringify(d);
    if (/undefined|NaN/.test(txt)) err(`${mid} d${i + 1} 有 undefined/NaN`);
  });
}
const used = new Set(Object.values(window.WEEKPLAN).flatMap((P) => P.days.flatMap((d) => d.reading.flatMap((g) => g.keys))));
console.log("未引用的摘录：", Object.keys(window.READING).filter((k) => !used.has(k)).join(", ") || "无");
console.log(bad ? `${bad} 处问题` : "全部通过");
