// 页面：方法论、路线图（含甘特图）
(function () {
  const C = Core;
  const { esc, cn, md, TODAY, modProgress, songProgress, dayDiff, addDays } = C;
  const K = () => window.PageKit;

  // ── 方法论 ──
  function promptCard(title, desc, tplKey, sample) {
    return `<div class="prompt-card"><header><div><b>${title}</b><div class="small muted">${desc}</div></div>
      <button class="btn" data-act="copy" data-tpl="${tplKey}" data-mod="${sample}">复制</button></header>
      <pre>${esc(C.fill(PROMPTS[tplKey], C.modCtx(MODULES.find((m) => m.id === sample))))}</pre></div>`;
  }

  function pageMethod() {
    const sched = C.buildSchedule();
    const w = C.whereToday(sched);
    const sample = (w.mod || MODULES[0]).id;
    const steps = LOOP.map((s) => `<li><span class="n">${s.n}</span><div><h3>${esc(s.name)}</h3><p>${esc(s.what)}</p><p class="muted">${esc(s.how)}</p></div></li>`).join("");
    const three = THREE.map((t) => `<div><h4>${t.name}</h4><p>${esc(t.q)}</p><p class="small muted">${esc(t.tell)}</p></div>`).join("");
    const pr = PRINCIPLES.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("");
    return `<section class="page">
      <div class="page-head"><h1>方法论</h1>
        <p class="lead">读资料是输入，上琴和 AI 反问是用输出倒逼输入。每个模块都按同一个五步循环走，每次练琴开头用 5 分钟做一次三层递进。</p></div>
      <h2>学习循环</h2>
      <ol class="steps">${steps}</ol>
      <p class="note-block">第 5 步答不上来或弹不出来，就带着那个问题回到第 4 步。循环转两三圈，才算真的过了这个模块。</p>

      <h2>三层递进（每次练琴开头 5 分钟）</h2>
      <p>对上次学的内容做一次自检，一层一层往下挖，直到答不上来或弹不出来为止。</p>
      <div class="three">${three}</div>

      <h2>原则</h2>
      <dl class="principles">${pr}</dl>

      <h2>提示词模板</h2>
      <p>下面用 ${sample} 做示例。路线图里每个模块都有同样的按钮，会自动填入该模块的主题、重点和资料。在「设置」里写好你的情况，提示词会带上它。</p>
      <p>在本文件夹用 Claude Code 时，直接用 <code>/teach</code> 和 <code>/quiz</code> 两个命令；用其他 AI 工具时，复制“通用版”。</p>
      ${promptCard("第 1 步：资料检索", "让 AI 补充或校验一手资料", "find", sample)}
      ${promptCard("第 2 步：/teach 命令", "Claude Code 内使用，讲义自动存进「讲义」页", "teach", sample)}
      ${promptCard("第 2 步：讲义提示词（通用版）", "其他 AI 工具使用", "teachGeneric", sample)}
      ${promptCard("第 3～4 步：原资料定位", "只要定位，不要答案", "locate", sample)}
      ${promptCard("第 5 步：/quiz 命令", "Claude Code 内使用", "quiz", sample)}
      ${promptCard("第 5 步：反问提示词（通用版）", "其他 AI 工具使用", "quizGeneric", sample)}
      ${promptCard("每日：三层递进（通用版）", "也可以用 /quiz 三层 主题", "threeGeneric", sample)}
    </section>`;
  }

  // ── 甘特图 ──
  function gantt(sched) {
    const first = sched[MODULES[0].id].start;
    const last = sched[MODULES[MODULES.length - 1].id].end;
    const rs = addDays(first, -((first.getDay() + 6) % 7));
    const re = addDays(last, (7 - last.getDay()) % 7);
    const D = dayDiff(rs, re) + 1;
    const x = (d) => (dayDiff(rs, d) / D) * 100;
    const span = (a, b) => ((dayDiff(a, b) + 1) / D) * 100;
    const weeks = Math.ceil(D / 7);
    const step = weeks > 16 ? 2 : 1;
    let ticks = "", grid = "";
    for (let i = 0; i < weeks; i += step) {
      const d = addDays(rs, i * 7);
      ticks += `<span style="left:${x(d)}%">${md(d)}</span>`;
      grid += `<div class="g-grid" style="left:${x(d)}%"></div>`;
    }
    const w = C.whereToday(sched);
    const nowId = w.kind === "study" ? w.mod.id : null;
    let rows = "";
    PHASES.forEach((p, pi) => {
      rows += `<div class="g-group">阶段${K().CN_NUM[pi]} ${esc(p.name)}</div>`;
      const ms = MODULES.filter((m) => m.phase === p.id);
      ms.forEach((m, mi) => {
        const s = sched[m.id], pr = modProgress(m);
        const tip = `${m.id} ${m.title}｜${md(s.start)} – ${md(s.end)}，${s.n} 个练习日｜完成 ${Math.round(pr.frac * 100)}%`;
        const ms_ = mi === ms.length - 1 ? `<span class="g-ms" style="left:${x(addDays(s.end, 1))}%" data-tip="${esc(p.milestone + "：" + cn(s.end))}"></span>` : "";
        rows += `<div class="g-row"><div class="g-label">${m.id} ${esc(m.title)}</div><div class="g-track">
          <a class="g-bar ${m.id === nowId ? "is-now" : ""}" href="#/roadmap?m=${m.id}" style="left:${x(s.start)}%;width:${span(s.start, s.end)}%" data-tip="${esc(tip)}" aria-label="${esc(tip)}"><i style="width:${(pr.frac * 100).toFixed(1)}%"></i></a>${ms_}</div></div>`;
      });
    });
    rows += `<div class="g-group">曲目分析（并行）</div>`;
    SONGS.forEach((a) => {
      const s = sched[a.id], pr = songProgress(a);
      const tip = `${a.id} ${a.name}｜${md(s.start)} – ${md(s.end)}｜已分析 ${pr.done} / ${pr.total}`;
      rows += `<div class="g-row"><div class="g-label">${esc(a.name)}</div><div class="g-track">
        <a class="g-bar" href="#/songs" style="left:${x(s.start)}%;width:${span(s.start, s.end)}%" data-tip="${esc(tip)}" aria-label="${esc(tip)}"><i style="width:${(pr.frac * 100).toFixed(1)}%"></i></a></div></div>`;
    });
    const todayLine = TODAY >= rs && TODAY <= re ? `<div class="g-today" style="left:${x(TODAY)}%"><b>今天</b></div>` : "";
    return `<div class="gantt"><div class="gantt-inner">
      <div class="g-axis">${ticks}</div>
      <div style="position:relative">
        <div style="position:absolute;left:150px;right:0;top:0;bottom:0">${grid}${todayLine}</div>
        <div style="position:relative">${rows}</div>
      </div>
    </div></div>
    <div class="legend"><span><i class="sw-done"></i>已完成部分</span><span><i class="sw-left"></i>计划时段</span><span><i class="sw-ms"></i>里程碑</span><span><i class="sw-today"></i>今天</span></div>`;
  }

  // ── 路线图 ──
  function modEntry(m, sched, nowId) {
    const s = sched[m.id], pr = modProgress(m);
    const l = C.state.loop[m.id] || {}, p = C.state.prac[m.id] || {};
    const open = window.UI.open.has("pack-" + m.id) ? "open" : "";
    const loopBtns = LOOP.map((st) => `<button class="${l[st.n] ? "done" : ""}" data-act="loop" data-mod="${m.id}" data-step="${st.n}" aria-pressed="${!!l[st.n]}"><b>${st.n}</b>${esc(st.short)}</button>`).join("");
    const res = C.resOf(m).map((r) => `<li><span class="k">${r.k}</span><span><a href="${esc(r.u)}" target="_blank" rel="noopener">${esc(r.t)}</a>${r.main ? ' <span class="main-tag">主资料</span>' : ""}${window.LocalHub ? LocalHub.renderResDigest(r.key) : ""}</span></li>`).join("");
    const prac = m.practice.map((t, i) => K().checkRow("prac", `data-mod="${m.id}" data-i="${i}"`, !!p[i], esc(t))).join("");
    const copyBtns = [
      ["find", "资料检索提示词"], ["teach", "/teach 命令"], ["teachGeneric", "讲义提示词（通用）"],
      ["locate", "原资料定位提示词"], ["quiz", "/quiz 命令"], ["quizGeneric", "反问提示词（通用）"], ["three", "三层递进命令"]
    ].map(([k, t]) => `<button class="btn" data-act="copy" data-tpl="${k}" data-mod="${m.id}">复制${t}</button>`).join("");
    return `<article class="entry ${m.id === nowId ? "is-now" : ""}" id="mod-${m.id}">
      <div class="entry-margin"><span class="mid">${m.id}</span>${md(s.start)} – ${md(s.end)}<br>${s.n} 个练习日<br>
        <span class="chip">目标：${DEPTHS[m.depth].name}</span>${m.key ? '<br><span class="chip key">重点模块</span>' : ""}
        ${pr.complete ? '<br><span class="chip">已完成</span>' : ""}</div>
      <div>
        <h3><span class="t">${esc(m.title)}</span></h3>
        <p>${esc(m.summary)}</p>
        <p class="note">${esc(m.why)}</p>
        <div class="loop-mini" aria-label="学习循环">${loopBtns}</div>
        <details class="pack" data-key="pack-${m.id}" ${open}><summary>学习包：重点、资料、练习、验收、提示词</summary>
          <div class="pack-body">
            <h4>读原资料时重点看</h4><ul class="plain">${m.keyPoints.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <h4>资料</h4><ul class="res-list">${res}</ul>
            <h4>上琴练习</h4>${prac}
            <h4>产出</h4>${K().checkRow("deliv", `data-mod="${m.id}"`, !!C.state.deliv[m.id], esc(m.deliverable))}
            <h4>验收：做到这些才算过</h4><ul class="plain">${m.checks.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <h4>反问种子</h4><ul class="plain note">${m.quiz.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <div class="btn-row">${copyBtns}</div>
          </div>
        </details>
      </div>
    </article>`;
  }

  function pageRoadmap() {
    const sched = C.buildSchedule();
    const S = C.state.settings;
    const totalN = MODULES.reduce((a, m) => a + sched[m.id].n, 0);
    const w = C.whereToday(sched);
    const nowId = w.kind === "study" ? w.mod.id : null;
    const paceText = S.pace === 1 ? "标准节奏（每天约 75 分钟）" : `节奏系数 ${S.pace}`;
    const phases = PHASES.map((p, pi) => {
      const ms = MODULES.filter((m) => m.phase === p.id);
      return `<section class="phase">
        <div class="phase-head"><h2>阶段${K().CN_NUM[pi]}　${esc(p.name)}</h2><span class="dates">${cn(sched[p.id].start)} – ${cn(sched[p.id].end)}，${sched[p.id].n} 个练习日</span></div>
        <p class="phase-goal"><b>${p.milestone}</b>（${cn(sched[p.id].end)}）：${esc(p.goal)}</p>
        <p class="small muted">阶段作品：${esc(p.show)}</p>
        ${ms.map((m) => modEntry(m, sched, nowId)).join("")}
      </section>`;
    }).join("");
    return `<section class="page">
      <div class="page-head"><h1>路线图</h1>
        <p class="lead">${cn(sched[MODULES[0].id].start)} 到 ${cn(sched[MODULES[MODULES.length - 1].id].end)}，共 ${totalN} 个练习日，${paceText}，${S.weekend ? "周末也练" : "周末休息"}。日期会随「<a href="#/settings">设置</a>」里的开始日期和节奏自动重排。</p></div>
      ${gantt(sched)}
      ${phases}
    </section>`;
  }

  window.Pages.method = pageMethod;
  window.Pages.roadmap = pageRoadmap;
})();
