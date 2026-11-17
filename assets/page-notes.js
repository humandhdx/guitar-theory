// 页面：复盘日志、讲义、作品与里程碑、资源库、设置
(function () {
  const C = Core;
  const { esc, cn, md } = C;
  const K = () => window.PageKit;

  // ── 复盘日志 ──
  function pageLog() {
    const sched = C.buildSchedule();
    const w = C.whereToday(sched);
    const curMod = w.mod ? w.mod.id : "";
    const entries = [...C.state.log].sort((a, b) => (a.date < b.date ? 1 : -1));
    const list = entries.map((e) => `<div class="log-item"><div class="meta"><span>${cn(C.parseD(e.date))}${e.mod ? "，" + e.mod : ""}</span>
        <button class="btn danger" data-act="log-del" data-id="${e.id}">删除</button></div>
      <dl>
        ${e.learned ? `<dt>心智模型</dt><dd>${esc(e.learned)}</dd>` : ""}
        ${e.stuck ? `<dt>卡点</dt><dd>${esc(e.stuck)}</dd>` : ""}
        ${e.next ? `<dt>下次回看与要练的</dt><dd>${esc(e.next)}</dd>` : ""}
      </dl></div>`).join("");
    const modOpts = MODULES.map((m) => `<option value="${m.id}" ${m.id === curMod ? "selected" : ""}>${m.id} ${esc(m.title)}</option>`).join("");
    return `<section class="page">
      <div class="page-head"><h1>复盘日志</h1>
        <p class="lead">每次练完写一条。三栏各一两句就够：今天学的东西用一句话讲清楚，反问里答错或在琴上弹不出来的地方，下次要回看的资料和要练的东西。</p></div>
      <form class="block" data-form="log">
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <label class="field" style="margin:0"><span>日期</span><input type="date" name="date" value="${C.todayStr}" required></label>
          <label class="field" style="margin:0"><span>模块</span><select name="mod"><option value="">不关联</option>${modOpts}</select></label>
        </div>
        <label class="field"><span>心智模型：用一句话讲清今天学的东西</span><textarea name="learned"></textarea></label>
        <label class="field"><span>卡点：没答上来、没听出来或弹不出来的</span><textarea name="stuck"></textarea></label>
        <label class="field"><span>下次回看与要练的：资料章节、练习、节拍器速度</span><textarea name="next"></textarea></label>
        <div class="btn-row"><button class="btn primary" type="submit">保存这条日志</button>
          <button class="btn" type="button" data-act="log-export">导出全部为 Markdown</button></div>
      </form>
      ${list || '<div class="empty"><p>还没有日志。写下第一条吧，几句话就行。</p></div>'}
    </section>`;
  }

  // ── 讲义 ──
  function pageLessons() {
    const L = (window.LESSONS || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    const list = L.map((x) => {
      const m = MODULES.find((mm) => mm.id === x.module);
      return `<li><span class="muted small">${esc(x.date || "")}</span><span><a href="lessons/${encodeURIComponent(x.file)}" target="_blank" rel="noopener">${esc(x.title)}</a>
        ${x.source ? `<br><span class="small muted">主资料：${esc(x.source)}</span>` : ""}</span>
        <span class="small">${m ? `<a href="#/roadmap?m=${m.id}">${m.id}</a>` : ""}</span></li>`;
    }).join("");
    const how = `<p>在 Claude Code 里打开 <code>E:\\learn</code>，输入：</p>
        <p><code>/teach G3 音程 主资料 https://viva.pressbooks.pub/openmusictheory/chapter/intervals/</code></p>
        <p>生成的讲义会保存到 <code>guitar-theory/lessons/</code>，并自动出现在这个列表里。每份讲义都带可点击发声的指板和上琴练习。用其他 AI 工具生成的 HTML，也可以手动放进这个文件夹，再在 <code>lessons/manifest.js</code> 里加一行。</p>`;
    return `<section class="page">
      <div class="page-head"><h1>讲义</h1>
        <p class="lead">学习循环第 2 步生成的 HTML 讲义都放在这里，点开就是一份可以离线阅读的单页课程。走讲义时把琴放在手边。</p></div>
      ${list ? `<ul class="lesson-list">${list}</ul><h2>再生成一份</h2>${how}` : `<div class="empty"><p>还没有讲义。</p>${how}</div>`}
    </section>`;
  }

  // ── 作品与里程碑 ──
  function pageWorks() {
    const sched = C.buildSchedule();
    const tl = PHASES.map((p) => `<tr><td style="white-space:nowrap">${cn(sched[p.id].end)}</td><td style="white-space:nowrap">${p.milestone}</td><td>${esc(p.goal)}</td><td>${esc(p.show)}</td></tr>`).join("");
    const deliv = PHASES.map((p) => {
      const ms = MODULES.filter((m) => m.phase === p.id);
      return `<h3>${esc(p.name)}</h3>${ms.map((m) => K().checkRow("deliv", `data-mod="${m.id}"`, !!C.state.deliv[m.id], `<a href="#/roadmap?m=${m.id}">${m.id}</a> ${esc(m.deliverable)}`)).join("")}`;
    }).join("");
    const doneN = MODULES.filter((m) => C.state.deliv[m.id]).length;
    const core = QUESTIONS.filter((q) => q.freq === "核心").map((q) => `<li><a href="#/questions?q=${q.id}">${esc(q.q)}</a>${q.note ? ` <span class="small muted">${esc(q.note)}</span>` : ""}</li>`).join("");
    return `<section class="page">
      <div class="page-head"><h1>作品与里程碑</h1>
        <p class="lead">乐理学没学会，最后要看手上和耳朵里留下了什么。每个阶段结束交一份阶段作品，每个模块留一个产出；把它们按时间放进练习文件夹，回头听第一段录音，就是你最直观的进度条。</p></div>
      <h2>阶段作品</h2>
      <table class="simple"><thead><tr><th>预计日期</th><th>里程碑</th><th>能力标志</th><th>阶段作品</th></tr></thead><tbody>${tl}</tbody></table>
      <h2>模块产出（${doneN} / ${MODULES.length}）</h2>
      <div class="block">${deliv}</div>
      <h2>练习原则</h2>
      <ul class="plain">${PRACTICE.rules.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h2>常见误区</h2>
      <ul class="plain">${PRACTICE.traps.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h2>核心题速查</h2>
      <ul class="plain">${core}</ul>
    </section>`;
  }

  // ── 资源库 ──
  function pageResources() {
    const F = window.UI.rf;
    const kinds = [...new Set(Object.values(RES).map((r) => r.k))];
    const usedBy = {};
    MODULES.forEach((m) => m.res.forEach(([k, main]) => { (usedBy[k] = usedBy[k] || []).push(m.id + (main ? "（主）" : "")); }));
    DRILLS.forEach((d) => { if (d.res && !(usedBy[d.res] || []).includes("日练")) (usedBy[d.res] = usedBy[d.res] || []).push("日练"); });
    const kw = F.q.trim().toLowerCase();
    const items = Object.entries(RES).filter(([k, r]) =>
      (F.k === "all" || r.k === F.k) && (!kw || (r.t + " " + r.u + " " + (usedBy[k] || []).join(" ")).toLowerCase().includes(kw))
    ).map(([k, r]) => `<li><span class="k">${r.k}</span><span><a href="${esc(r.u)}" target="_blank" rel="noopener">${esc(r.t)}</a> <span class="small muted">${(usedBy[k] || ["通用"]).join("、")}</span>${window.LocalHub ? LocalHub.renderResDigest(k) : ""}</span></li>`).join("");
    return `<section class="page">
      <div class="page-head"><h1>资源库</h1>
        <p class="lead">${Object.keys(RES).length} 份资料。主线是两份：Open Music Theory（大学开放乐理教材，讲概念讲得最严谨）和 JustinGuitar（吉他教学者的系统课程，讲怎么落到指板上）。标“主”的是对应模块的主资料。</p>
        <p class="small muted">链接在 2026 年 11 月逐条核对过。JustinGuitar 站点会拦截自动访问，这几条链接取自它的官方检索结果，浏览器里可以正常打开。</p></div>
      <div class="filters">
        <input type="search" data-act="rq" placeholder="搜索标题、网址或模块号，例如 G5" value="${esc(F.q)}" aria-label="搜索资源" style="min-width:280px">
        <span class="grp"><span>类型</span><button class="btn ${F.k === "all" ? "on" : ""}" data-act="rk" data-v="all">全部</button>${kinds.map((k) => `<button class="btn ${F.k === k ? "on" : ""}" data-act="rk" data-v="${k}">${k}</button>`).join("")}</span>
      </div>
      <ul class="res-list" style="margin-top:14px">${items || '<li class="muted">没有匹配的资源。</li>'}</ul>
    </section>`;
  }

  // ── 设置 ──
  function pageSettings() {
    const S = C.state.settings;
    const paceOpt = [[1, "1.0　每天约 75 分钟"], [1.5, "1.5　每天约 50 分钟"], [2, "2.0　每天约 35 分钟"], [3, "3.0　每天约 25 分钟"]]
      .map(([v, t]) => `<option value="${v}" ${Number(S.pace) === v ? "selected" : ""}>${t}</option>`).join("");
    const F = C.state.fret;
    return `<section class="page">
      <div class="page-head"><h1>设置</h1><p class="lead">改动立即生效，所有数据只保存在这台电脑的浏览器里。</p></div>
      <form class="block" data-form="settings">
        <label class="field"><span>开始日期（第一个模块的第一天）</span><input type="date" name="start" value="${S.start}"></label>
        <label class="field"><span>练习节奏：每个模块的天数会乘以这个系数</span><select name="pace">${paceOpt}</select></label>
        <label class="check"><input type="checkbox" name="weekend" ${S.weekend ? "checked" : ""}><span>周末也算练习日（练琴贵在每天摸琴，默认打开）</span></label>
        <label class="field"><span>节假日（不排课），用逗号分隔，格式 2027-01-01</span><input type="text" name="holidays" value="${esc(S.holidays.join(", "))}" style="width:100%"></label>
        <label class="field"><span>我的情况（会写进每一条提示词，让 AI 讲得更贴合你）：弹了多久、会什么、想弹什么风格</span><textarea name="background">${esc(S.background)}</textarea></label>
        <label class="field"><span>外观</span><select name="theme">
          <option value="auto" ${S.theme === "auto" ? "selected" : ""}>跟随系统</option>
          <option value="light" ${S.theme === "light" ? "selected" : ""}>浅色</option>
          <option value="dark" ${S.theme === "dark" ? "selected" : ""}>深色</option></select></label>
        ${S.rebase ? `<p class="small">已从 ${cn(C.parseD(S.rebase.date))} 起顺延 ${S.rebase.mod} 及之后的模块。<button class="btn" type="button" data-act="unrebase">取消顺延</button></p>` : ""}
      </form>
      <h2>备份</h2>
      <p>换浏览器或清缓存前先导出。导入会覆盖当前所有进度（包括找音练习的成绩，目前共 ${F.history.length} 次）。</p>
      <div class="btn-row">
        <button class="btn" data-act="export">导出进度（JSON）</button>
        <label class="btn" style="cursor:pointer">导入进度<input type="file" accept="application/json" data-act="import" hidden></label>
        <button class="btn danger" data-act="reset">清空所有进度</button>
      </div>
      <h2>预览某一天</h2>
      <p class="small muted">在地址后面加 <code>?today=2026-11-20</code> 可以看到那一天的「今天」页，方便检查排期。</p>
    </section>`;
  }

  window.Pages.log = pageLog;
  window.Pages.lessons = pageLessons;
  window.Pages.works = pageWorks;
  window.Pages.resources = pageResources;
  window.Pages.settings = pageSettings;
})();
