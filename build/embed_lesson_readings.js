// 为 G1～G15 全部讲义 HTML（lessons/*.html）的「6. 读原资料指南」直接嵌入：
// 1) 该模块全部 Open Music Theory v2 原文 + 本地谱例图 + 中英对照切换（取自 data-reading.js / data-reading-ext.js）
// 2) 非 OMT 外部资料的「本地精要 / 站内平替工具」折叠卡（取自 data-local-hub.js）
// 脚本幂等，可重复执行；也会被 build/gen_lessons.py 在重建讲义后调用。
"use strict";

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LESSONS_DIR = path.join(ROOT, "lessons");

function loadAppData() {
  const mkEl = () => ({
    innerHTML: "", textContent: "", value: "", className: "", style: {}, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, setAttribute() {}, getAttribute() { return ""; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    closest() { return null; }, focus() {}, click() {}
  });
  const ctx = {
    console, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, Error, Promise, Set, Map,
    URLSearchParams, encodeURIComponent, decodeURIComponent, parseInt, parseFloat, isNaN, isFinite,
    structuredClone,
    localStorage: { _d: {}, getItem() { return null; }, setItem() {}, removeItem() {} },
    location: { search: "", hash: "#/today", href: "http://localhost/" },
    history: { replaceState() {} },
    navigator: {},
    document: {
      getElementById() { return mkEl(); }, querySelector() { return null; }, querySelectorAll() { return []; },
      createElement() { return mkEl(); }, addEventListener() {}, documentElement: mkEl(), body: mkEl()
    },
    addEventListener() {}, setTimeout() { return 0; }, clearTimeout() {}, setInterval() { return 0; }, clearInterval() {},
    requestAnimationFrame() {}
  };
  ctx.window = ctx.self = ctx.globalThis = ctx;
  vm.createContext(ctx);

  const files = [
    "assets/data-resources.js",
    "assets/data-modules.js",
    "assets/data-reading.js",
    "assets/data-reading-ext.js",
    "assets/data-week.js",
    "assets/music.js",
    "assets/core.js",
    "assets/data-local-hub.js",
    "lessons/manifest.js"
  ];
  for (const f of files) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  }
  return ctx;
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normUrl(u) {
  return String(u || "").replace(/&amp;/g, "&").replace(/^http:/, "https:").replace("://www.", "://").replace(/\/+$/, "").toLowerCase();
}

function rewriteLessonHref(target, currentLessonFile) {
  if (!target) return "";
  if (target.startsWith("#/")) return "../index.html" + target;
  if (target.startsWith("lessons/")) {
    const fname = target.slice("lessons/".length);
    if (fname.split("#")[0] === currentLessonFile && !fname.includes("#")) return "#reading";
    return "./" + fname;
  }
  return target;
}

function renderDigestForLesson(ctx, resKey, currentLessonFile) {
  const g = ctx.LocalHub && ctx.LocalHub.guideFor(resKey);
  if (!g) return "";
  const pts = (g.points || []).map((p) => `<li>${esc(p)}</li>`).join("");
  let locBtn = "";
  if (g.local && g.local[0]) {
    const href = rewriteLessonHref(g.local[0], currentLessonFile);
    locBtn = `<div class="emb-act"><a class="emb-jump" href="${esc(href)}">⚡ ${esc(g.local[1])} ↗</a></div>`;
  }
  return `<details class="local-digest"><summary>📖 本地精要（免跳转直接看：${esc(g.summary)}）</summary><div class="local-digest-body"><ul>${pts}</ul>${locBtn}</div></details>`;
}

function renderExcerptCard(ctx, key) {
  const r = ctx.READING[key];
  if (!r) return "";
  const body = String(r.h || "").replace(/src="assets\/reading\/omt\//g, 'src="../assets/reading/omt/');
  const src = String(r.src || "").replace(/^Open Music Theory/, "OMT").replace(/（.*）$/, "");
  const isExt = r.verbatim === false;
  return `<details class="doc" data-rk="${esc(key)}">
    <summary><span class="doc-t">${esc(r.t)}${r.te && r.te !== r.t ? `<small>${esc(r.te)}</small>` : ""}</span><span class="doc-src">${isExt ? "吉他专题 · " : ""}${esc(src)}</span></summary>
    <div class="doc-body">${body}<p class="doc-credit">${esc(r.src)}。${esc(r.credit || "")}</p></div>
    <div class="doc-foot"><a href="../index.html#/week">去「本周 / 今日」页面勾选已读 ↗</a><a href="${esc(r.u)}" target="_blank" rel="noopener">查看原出处 ↗</a></div>
  </details>`;
}

const EMBED_CSS = `<style id="emb-read-css">
.emb-badge { display: inline-block; margin-left: 6px; padding: 1px 7px; border-radius: 999px; font-size: 12px; font-weight: 700; color: var(--good, #2e7a33); background: color-mix(in srgb, var(--good, #2e7a33) 12%, transparent); vertical-align: 1px; }
#reading details.local-digest { margin: 6px 0 8px; padding: 5px 11px; border: 0; border-left: 3px solid var(--blue); border-radius: 0 6px 6px 0; background: var(--blue-wash); font-size: 13.5px; }
#reading details.local-digest > summary { color: var(--ink); font-weight: 700; }
#reading details.local-digest .local-digest-body { margin-top: 6px; }
#reading details.local-digest ul { margin: 4px 0; padding-left: 1.25em; }
#reading details.local-digest li { margin: 3px 0; line-height: 1.55; }
.emb-act { margin: 6px 0 2px; }
.emb-jump { display: inline-block; padding: 2px 10px; border: 1px solid var(--blue); border-radius: 5px; font-size: 13px; text-decoration: none; background: var(--sheet); }
.emb-jump:hover { background: var(--blue-wash); }
.emb-reading-panel { margin-top: 18px; padding: 14px 16px; border: 1px solid var(--rule); border-radius: 8px; background: color-mix(in srgb, var(--paper) 55%, var(--sheet)); }
.emb-reading-bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 10px 16px; margin-bottom: 10px; }
.emb-sub { font-size: 13.5px; color: var(--pencil); margin-top: 2px; }
.emb-reading-panel .rd-lang { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13.5px; color: var(--ink-2); }
.emb-reading-panel .rd-lang button { border: 1px solid var(--rule); background: var(--sheet); border-radius: 4px; padding: 2px 10px; font-size: 13px; color: var(--ink-2); cursor: pointer; font-family: inherit; }
.emb-reading-panel .rd-lang button[aria-pressed="true"] { border-color: var(--ink); color: var(--ink); font-weight: 700; background: var(--blue-wash); }
.emb-reading-panel details.doc { background: var(--sheet); border: 1px solid var(--rule); border-radius: 7px; margin: 8px 0; padding: 0; }
.emb-reading-panel details.doc > summary { display: flex; align-items: baseline; gap: 10px; padding: 9px 14px; cursor: pointer; list-style: none; color: var(--ink); }
.emb-reading-panel details.doc > summary::-webkit-details-marker { display: none; }
.emb-reading-panel details.doc > summary::before { content: "+"; flex: none; width: 1em; font-family: var(--font-code); color: var(--blue); }
.emb-reading-panel details.doc[open] > summary { border-bottom: 1px solid var(--rule-soft); }
.emb-reading-panel details.doc[open] > summary::before { content: "−"; }
.emb-reading-panel .doc-t { flex: 1; min-width: 0; font-weight: 700; overflow-wrap: anywhere; }
.emb-reading-panel .doc-t small { margin-left: 8px; font-weight: 400; font-size: 13px; color: var(--pencil); }
.emb-reading-panel .doc-src { flex: none; font-size: 12.5px; color: var(--pencil); white-space: nowrap; }
.emb-reading-panel .doc-body { padding: 8px 18px 6px; font-size: 15px; line-height: 1.75; }
.emb-reading-panel .doc-body p, .emb-reading-panel .doc-body li { max-width: 44em; }
.emb-reading-panel .doc-body h4 { font-size: 16.5px; margin: 10px 0 8px; }
.emb-reading-panel .doc-body h5 { font-size: 15px; margin: 16px 0 6px; }
.emb-reading-panel .doc-body ul, .emb-reading-panel .doc-body ol { margin: 0 0 10px; padding-left: 1.4em; }
.emb-reading-panel .doc-body blockquote { margin: 8px 0 12px; padding: 2px 0 2px 14px; border-left: 2px solid var(--rule); color: var(--ink-2); }
.emb-reading-panel .doc-body b.gl { font-weight: 700; text-decoration: underline dotted var(--pencil); text-underline-offset: 3px; cursor: help; }
.emb-reading-panel .doc-fig { margin: 10px 0 14px; max-width: 44em; }
.emb-reading-panel .doc-fig img { display: block; max-width: 100%; height: auto; padding: 6px; background: #fff; border: 1px solid var(--rule-soft); border-radius: 6px; }
.emb-reading-panel .doc-fig figcaption { margin-top: 6px; font-size: 13px; line-height: 1.55; color: var(--ink-2); }
.emb-reading-panel .doc-embed, .emb-reading-panel .doc-fn { font-size: 13px; color: var(--ink-2); }
.emb-reading-panel .doc-note { max-width: 44em; margin: 10px 0 12px; padding: 8px 14px; border-left: 3px solid var(--pencil); border-radius: 0 6px 6px 0; background: var(--paper); font-size: 14.5px; }
.emb-reading-panel .doc-note > b { display: block; margin-bottom: 2px; font-size: 13px; color: var(--ink-2); }
.emb-reading-panel .doc-table { margin: 8px 0 12px; overflow-x: auto; }
.emb-reading-panel .doc-table table { border-collapse: collapse; font-size: 14px; width: auto; min-width: 60%; }
.emb-reading-panel .doc-table th, .emb-reading-panel .doc-table td { padding: 5px 10px; border: 1px solid var(--rule); text-align: left; vertical-align: top; }
.emb-reading-panel .doc-table th { background: var(--paper); }
.emb-reading-panel .doc-credit { margin: 6px 0 2px; font-size: 12.5px; line-height: 1.55; color: var(--pencil); }
.emb-reading-panel .doc-foot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px 16px; padding: 8px 14px 10px; border-top: 1px solid var(--rule-soft); font-size: 13.5px; }
.emb-reading-panel.rd-zh .doc-body .en, .emb-reading-panel.rd-en .doc-body .zh { display: none; }
.emb-reading-panel.rd-both .doc-body .en, .emb-reading-panel.rd-both .doc-body .zh { display: block; }
.emb-reading-panel.rd-both .doc-body .zh { margin-top: 2px; color: var(--ink-2); }
.emb-more-res { margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--rule); }
.emb-more-res h4 { margin: 0 0 6px; font-size: 14.5px; color: var(--ink-2); }
.emb-more-res ul { margin: 0; padding-left: 1.25em; }
.emb-more-res li { margin: 4px 0; }
</style>`;

const EMBED_JS = `<script id="emb-read-js">
(function () {
  const wrap = document.getElementById("lesson-rd-wrap");
  if (!wrap) return;
  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-rdlang]");
    if (!btn) return;
    const v = btn.getAttribute("data-rdlang");
    wrap.className = "emb-reading-panel rd-" + v;
    wrap.querySelectorAll("[data-rdlang]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b === btn));
    });
  });
})();
</script>`;

function main() {
  const ctx = loadAppData();

  // 建立 URL -> RES key 反查表
  const urlToKey = new Map();
  for (const [k, r] of Object.entries(ctx.RES)) {
    urlToKey.set(normUrl(r.u), k);
  }

  let updatedCount = 0;
  for (const item of ctx.LESSONS) {
    const modId = item.module;
    const mod = ctx.MODULES.find((m) => m.id === modId);
    const plan = ctx.WEEKPLAN[modId];
    if (!mod || !plan) continue;

    const lessonPath = path.join(LESSONS_DIR, item.file);
    let html = fs.readFileSync(lessonPath, "utf8");

    // 清理旧的注入块，保持完全幂等
    html = html.replace(/<style id="emb-read-css">[\s\S]*?<\/style>\s*/g, "");
    html = html.replace(/<script id="emb-read-js">[\s\S]*?<\/script>\s*/g, "");
    html = html.replace(/<!-- EMBEDDED_READING_START -->[\s\S]*?<!-- EMBEDDED_READING_END -->\s*/g, "");

    // 收集该模块在 WEEKPLAN 里全部的精读 keys（保持顺序去重）
    const keys = [];
    const seen = new Set();
    for (const d of (plan.days || [])) {
      for (const g of (d.reading || [])) {
        for (const k of (g.keys || [])) {
          if (!seen.has(k) && ctx.READING[k]) {
            seen.add(k);
            keys.push(k);
          }
        }
      }
    }
    const omtCount = keys.filter((k) => ctx.READING[k].verbatim !== false).length;
    const extCount = keys.length - omtCount;

    // 定位第 6 节：从 <h2 id="reading">6. 读原资料指南</h2> 到 <h2 id="quiz"> 之间
    const secRe = /(<h2 id="reading">[\s\S]*?)(?=<h2 id="quiz">)/;
    const secMatch = html.match(secRe);
    if (!secMatch) {
      throw new Error(`Missing #reading -> #quiz section in ${item.file}`);
    }
    let sec = secMatch[1];

    // 清理之前注入到列表项内的标记/折叠块，并统一 G1/G2 引导句文案
    sec = sec.replace(/<span class="emb-badge">[\s\S]*?<\/span>/g, "");
    sec = sec.replace(/<details class="local-digest">[\s\S]*?<\/details>/g, "");
    sec = sec.replace(
      /<p>下面三章 OMT 的原文已经嵌进网站「本周」G1 第 2、3 天的页面里，中英对照，图片也在。点“读完了”会自动展开下一篇。JustinGuitar 的视频在站外，要去原网站看。<\/p>/,
      "<p>下面三章 OMT 的原文（含中英对照与谱例图）与 JustinGuitar 本地精要已直接嵌入本节下方，同时在「本周 / 今日」G1 页面也可打卡已读。</p>"
    );
    sec = sec.replace(
      /<p>下面这些小节的原文已经嵌进网站「本周」的 G2 每日页面里，中英对照，图片也在。点“读完了”会自动展开下一篇。<\/p>/,
      "<p>下面这些小节的 OMT 原文（含中英对照与谱例图）已直接嵌入本节下方，同时在「本周 / 今日」G2 每日页面也可打卡已读。</p>"
    );

    const matchedResKeys = new Set();
    // 增强第 6 节原本的外部资源条目：OMT 标注已嵌入下方，非 OMT 附带本地精要/平替卡片
    sec = sec.replace(/<li>([\s\S]*?)<\/li>/g, (full, inner) => {
      const hrefs = [...inner.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
      const keysInLi = [];
      let hasOmt = false;
      for (const href of hrefs) {
        if (/openmusictheory\.com|viva\.pressbooks\.pub\/openmusictheory/i.test(href)) {
          hasOmt = true;
        }
        const rk = urlToKey.get(normUrl(href));
        if (rk) {
          matchedResKeys.add(rk);
          if (!rk.startsWith("omt")) keysInLi.push(rk);
        }
      }
      const badge = hasOmt ? ' <span class="emb-badge">已嵌入下方全文</span>' : "";
      const digests = [...new Set(keysInLi)].map((rk) => renderDigestForLesson(ctx, rk, item.file)).join("");
      return `<li>${inner}${badge}${digests}</li>`;
    });

    // 找出本模块下尚未在上面 <li> 里出现过的非 OMT 资源，补充为“本站精要与平替工具”
    const extraRes = (mod.res || [])
      .map((r) => (Array.isArray(r) ? r[0] : r && (r.id || r)))
      .filter((rk) => rk && !rk.startsWith("omt") && !matchedResKeys.has(rk));

    const extraHtml = extraRes.length
      ? `<div class="emb-more-res"><h4>⚡ 本模块其余配套课程与工具的本地精要 / 平替</h4><ul>${extraRes.map((rk) => {
          const r = ctx.RES[rk];
          if (!r) return "";
          return `<li><a href="${esc(r.u)}" target="_blank" rel="noopener">${esc(r.t)} ↗</a>${renderDigestForLesson(ctx, rk, item.file)}</li>`;
        }).join("")}</ul></div>`
      : "";

    const subText = extCount
      ? `含 ${omtCount} 节 Open Music Theory 原文（带本地谱例图）与 ${extCount} 张电吉他实战卡片；无需跳转外网，也可前往 <a href="../index.html#/week">「本周 / 今日」打卡已读 ↗</a>`
      : `含 ${omtCount} 节 Open Music Theory 原文（带本地谱例图）；无需跳转外网，也可前往 <a href="../index.html#/week">「本周 / 今日」打卡已读 ↗</a>`;

    const cardsHtml = keys.map((k) => renderExcerptCard(ctx, k)).join("\n");
    const panelHtml = `\n<!-- EMBEDDED_READING_START -->
<div class="emb-reading-panel rd-zh" id="lesson-rd-wrap">
  <div class="emb-reading-bar">
    <div>
      <b>📚 本模块精读原文与本地精要（已嵌入讲义）</b>
      <div class="emb-sub">${subText}</div>
    </div>
    <div class="rd-lang" role="group" aria-label="原文显示语言">
      <span>显示：</span>
      <button type="button" data-rdlang="zh" aria-pressed="true">中文</button>
      <button type="button" data-rdlang="both" aria-pressed="false">中英对照</button>
      <button type="button" data-rdlang="en" aria-pressed="false">English</button>
    </div>
  </div>
${cardsHtml}
${extraHtml}
</div>
<!-- EMBEDDED_READING_END -->\n`;

    sec = sec.replace(/\s*$/, "\n") + panelHtml;
    html = html.replace(secRe, sec);

    // 插入 CSS 与 JS
    html = html.replace("</head>", `${EMBED_CSS}\n</head>`);
    html = html.replace("</body>", `${EMBED_JS}\n</body>`);

    fs.writeFileSync(lessonPath, html, "utf8");
    updatedCount++;
    console.log(`Embedded readings into ${item.file} (${modId}: ${omtCount} OMT + ${extCount} ext, ${extraRes.length} extra local digests)`);
  }
  console.log(`Done: updated ${updatedCount} lesson files.`);
}

main();
