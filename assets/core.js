// 状态、日期、排期等基础能力。页面渲染在 page-*.js
(function () {
  const KEY = "guitarTheory.v1";
  const DEFAULTS = {
    settings: {
      start: "2026-11-10",
      pace: 1,
      weekend: true,
      holidays: [],
      background: "会弹一些开放和弦和简单 riff 的电吉他学习者（请在设置里改成你的真实情况，例如：弹了 1 年，会横按和弦和五声第一把位，不会看五线谱）",
      theme: "auto",
      rebase: null,
      readLang: "zh"
    },
    p0: {}, loop: {}, prac: {}, deliv: {}, assess: {}, qs: {}, songs: {}, read: {}, fret: { best: null, history: [] }, ear: { intOk: 0, intTot: 0, chOk: 0, chTot: 0, degOk: 0, degTot: 0, progOk: 0, progTot: 0, history: [] }, log: []
  };

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!raw) return structuredClone(DEFAULTS);
      return { ...structuredClone(DEFAULTS), ...raw, settings: { ...DEFAULTS.settings, ...(raw.settings || {}) } };
    } catch (e) {
      return structuredClone(DEFAULTS);
    }
  }
  const state = load();
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

  // ── 工具 ──
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const parseD = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d, 12); };
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const WD = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const cn = (d) => `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  const md = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
  const dayDiff = (a, b) => Math.round((parseD(fmt(b)) - parseD(fmt(a))) / 86400000);

  // 允许用 ?today=2026-11-20 预览某一天
  const qsToday = new URLSearchParams(location.search).get("today");
  const TODAY = qsToday && /^\d{4}-\d{2}-\d{2}$/.test(qsToday) ? parseD(qsToday) : parseD(fmt(new Date()));
  const todayStr = fmt(TODAY);

  function isStudyDay(d) {
    const S = state.settings;
    const w = d.getDay();
    if (!S.weekend && (w === 0 || w === 6)) return false;
    return !S.holidays.includes(fmt(d));
  }

  // ── 排期：按练习日推进，跳过休息日和节假日 ──
  function buildSchedule() {
    const S = state.settings;
    let cur = parseD(S.start);
    const sched = {};
    MODULES.forEach((m) => {
      if (S.rebase && S.rebase.mod === m.id) {
        const r = parseD(S.rebase.date);
        if (r > cur) cur = r;
      }
      const n = Math.max(1, Math.round(m.days * S.pace));
      const days = [];
      let guard = 0;
      while (days.length < n && guard++ < 2000) {
        if (isStudyDay(cur)) days.push(fmt(cur));
        cur = addDays(cur, 1);
      }
      sched[m.id] = { start: parseD(days[0]), end: parseD(days[days.length - 1]), days, n };
    });
    PHASES.forEach((p) => {
      const ms = MODULES.filter((m) => m.phase === p.id);
      sched[p.id] = { start: sched[ms[0].id].start, end: sched[ms[ms.length - 1].id].end, n: ms.reduce((a, m) => a + sched[m.id].n, 0) };
    });
    SONGS.forEach((a) => { sched[a.id] = { start: sched[a.from].start, end: sched[a.to].end }; });
    return sched;
  }

  // ── 进度 ──
  const loopOf = (id) => state.loop[id] || {};
  const pracOf = (id) => state.prac[id] || {};
  function modProgress(m) {
    const l = loopOf(m.id), p = pracOf(m.id);
    const loopDone = [1, 2, 3, 4, 5].filter((n) => l[n]).length;
    const pracDone = m.practice.filter((_, i) => p[i]).length;
    const total = 5 + m.practice.length + 1;
    const done = loopDone + pracDone + (state.deliv[m.id] ? 1 : 0);
    return { loopDone, pracDone, frac: done / total, complete: loopDone === 5 && !!state.deliv[m.id] };
  }
  function songProgress(stage) {
    const done = stage.items.filter((s) => state.songs[s[0]]).length;
    return { done, total: stage.items.length, frac: done / stage.items.length };
  }

  // 今天在路线上的位置
  function whereToday(sched) {
    const first = sched[MODULES[0].id].start, last = sched[MODULES[MODULES.length - 1].id].end;
    for (const m of MODULES) {
      const idx = sched[m.id].days.indexOf(todayStr);
      if (idx >= 0) return { kind: "study", mod: m, idx, n: sched[m.id].n };
    }
    if (TODAY < first) return { kind: "before", mod: MODULES[0], daysLeft: dayDiff(TODAY, first) };
    if (TODAY > last) return { kind: "after" };
    const next = MODULES.find((m) => sched[m.id].start > TODAY);
    const prev = [...MODULES].reverse().find((m) => sched[m.id].end < TODAY);
    return { kind: "rest", mod: next || prev, next, prev };
  }

  // 某个练习日该推进循环的哪几步、哪些练习
  function dayPlan(m, idx, n) {
    let steps;
    if (n === 1) steps = [1, 2, 3, 4, 5];
    else if (idx === 0) steps = [1, 2, 3];
    else if (idx === n - 1) steps = n === 2 ? [4, 5] : [5];
    else steps = [4];
    const P = m.practice.length;
    const prac = [];
    for (let i = 0; i < P; i++) {
      const a = Math.floor((i * n) / P), b = Math.max(a, Math.floor(((i + 1) * n) / P) - 1);
      if (idx >= a && idx <= b) prac.push(i);
    }
    return { steps, prac, deliv: idx === n - 1 };
  }

  function stageOn(sched, d) {
    return SONGS.find((a) => d >= sched[a.id].start && d <= sched[a.id].end);
  }

  // ── 提示词 ──
  function resOf(m) {
    return m.res.map(([k, main]) => ({ ...RES[k], key: k, main: !!main })).filter((r) => r.t);
  }
  function modCtx(m) {
    const rs = resOf(m);
    return {
      id: m.id, title: m.title, depth: DEPTHS[m.depth].name,
      background: state.settings.background,
      keyPoints: m.keyPoints.map((x) => "- " + x).join("\n"),
      mainRes: rs.filter((r) => r.main).map((r) => `${r.t} ${r.u}`).join("；"),
      resources: rs.map((r) => `- ${r.t} ${r.u}`).join("\n"),
      quizSeeds: m.quiz.map((x) => "- " + x).join("\n")
    };
  }
  const fill = (tpl, ctx) => tpl.replace(/\{(\w+)\}/g, (_, k) => (ctx[k] ?? ""));

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      ta.remove();
      return ok;
    }
  }
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function applyTheme() {
    const t = state.settings.theme;
    const dark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }

  window.Core = {
    state, save, esc, parseD, fmt, addDays, WD, cn, md, dayDiff, TODAY, todayStr,
    buildSchedule, modProgress, songProgress, whereToday, dayPlan, stageOn,
    resOf, modCtx, fill, copyText, toast, applyTheme, DEFAULTS, KEY
  };
})();
