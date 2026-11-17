// 页面：能力自评、自测题库、曲目分析
(function () {
  const C = Core;
  const { esc, cn, md } = C;
  const K = () => window.PageKit;

  // ── 能力自评 ──
  function pageAssess() {
    const A = C.state.assess;
    const has = Object.keys(A).length > 0;
    const groups = { none: [], risk: [], shallow: [], ok: [] };
    SKILLS.forEach((s) => {
      const cur = A[s.id] ?? 0;
      const gap = s.target - cur;
      const key = cur === 0 ? "none" : gap >= 2 ? "risk" : gap === 1 ? "shallow" : "ok";
      groups[key].push(s);
    });
    const rows = SKILLS.map((s) => {
      const cur = A[s.id] ?? 0;
      const seg = [1, 2, 3, 4].map((v) => `<button class="${v <= cur ? "fill" : ""} ${v === s.target ? "target" : ""}" data-act="assess" data-id="${s.id}" data-v="${v === cur ? v - 1 : v}" title="${DEPTHS[v].name}：${DEPTHS[v].desc}" aria-label="${esc(s.name)} 设为 ${DEPTHS[v].name}">${v}</button>`).join("");
      const mods = s.mods.map((id) => `<a href="#/roadmap?m=${id}">${id}</a>`).join(" ") || '<a href="#/songs">曲目分析</a>';
      return `<tr><td>${esc(s.name)}</td><td><span class="seg">${seg}</span><span class="seg-label">${DEPTHS[cur].name}</span></td><td class="small">${DEPTHS[s.target].name}</td><td class="small">${mods}</td></tr>`;
    }).join("");
    const g = (title, desc, list) => `<div><h4>${title}（${list.length}）</h4><p class="small muted" style="margin:0 0 4px">${desc}</p><ul>${list.map((s) => `<li>${esc(s.name)} <span class="small muted">目标 ${DEPTHS[s.target].name}</span></li>`).join("") || '<li class="muted">无</li>'}</ul></div>`;
    return `<section class="page">
      <div class="page-head"><h1>能力自评</h1>
        <p class="lead">给每项能力打当前深度，红色小三角是目标深度。深度分四级：知道概念（说得出是什么）、照图能弹（看着图或谱能弹出来）、能讲清（讲得清原理，扛得住追问）、能即用（不看图，在演奏、即兴、扒歌里实时用出来）。再点一次当前格子可以降一级。</p>
        <p class="small muted">建议开始前打一次，每个阶段结束再打一次。“能讲清”和“能即用”是两件事：很多人说得清 CAGED，一上琴还是要数格子。差距大的项，对应模块要多转一圈学习循环。</p></div>
      <table class="assess"><thead><tr><th>能力</th><th>当前深度</th><th>目标</th><th>对应模块</th></tr></thead><tbody>${rows}</tbody></table>
      <h2>差距分类</h2>
      ${has ? "" : '<p class="muted">还没打分。上表全部默认“未覆盖”，打完分这里会自动分类。</p>'}
      <div class="gap-groups">
        ${g("完全未覆盖", "需要系统学习 + 上琴练习", groups.none)}
        ${g("差得多", "差两级及以上，一上琴或一追问就会露馅", groups.risk)}
        ${g("差一点", "差一级，补原理或补手上的熟练度", groups.shallow)}
        ${g("已达标", "保持，放进曲目分析和即兴里用", groups.ok)}
      </div>
    </section>`;
  }

  // ── 自测题库 ──
  const ST = { ok: "会", fuzzy: "模糊", no: "不会" };
  function pageQuestions(params) {
    const F = window.UI.qf;
    const Q = C.state.qs;
    const list = QUESTIONS.filter((q) =>
      (F.freq === "all" || q.freq === F.freq) &&
      (F.stat === "all" || (F.stat === "none" ? !Q[q.id] : Q[q.id] === F.stat)) &&
      (F.mod === "all" || q.mod === F.mod)
    );
    const cnt = (s) => QUESTIONS.filter((q) => Q[q.id] === s).length;
    const fbtn = (key, val, label) => `<button class="btn ${F[key] === val ? "on" : ""}" data-act="qf" data-k="${key}" data-v="${val}">${label}</button>`;
    const mods = [...new Set(QUESTIONS.map((q) => q.mod))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
    const focus = params.get("q");
    const items = list.map((q) => {
      const st = Q[q.id];
      const freqChip = q.freq === "核心" ? '<span class="chip must">核心</span>' : q.freq === "重要" ? '<span class="chip high">重要</span>' : '<span class="chip">拓展</span>';
      const m = MODULES.find((x) => x.id === q.mod);
      const open = window.UI.open.has("ans-" + q.id) || focus === q.id ? "open" : "";
      const sbtn = (k, cls) => `<button class="btn ${st === k ? "on " + cls : ""}" data-act="qs" data-id="${q.id}" data-v="${k}">${ST[k]}</button>`;
      return `<article class="qa" id="q-${q.id}">
        <div class="qa-top">${freqChip}<a href="#/roadmap?m=${q.mod}">${q.mod} ${esc(m ? m.title : "")}</a>${q.note ? `<span class="chip key">${esc(q.note)}</span>` : ""}</div>
        <h3>${esc(q.q)}</h3>
        <details data-key="ans-${q.id}" ${open}><summary>先自己答一遍${q.note ? "、在琴上弹一遍" : ""}，再展开要点</summary>
          <ol>${q.a.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
          <div class="note-block">常见追问：${q.f.map(esc).join("；")}<br>常见误区：${esc(q.pit)}</div>
        </details>
        <div class="btn-row"><span class="status">${sbtn("ok", "ok")}${sbtn("fuzzy", "")}${sbtn("no", "no")}</span>
          <button class="btn" data-act="copy" data-tpl="question" data-q="${q.id}">复制反问提示词</button></div>
      </article>`;
    }).join("");
    return `<section class="page">
      <div class="page-head"><h1>自测题库</h1>
        <p class="lead">${QUESTIONS.length} 道题，覆盖 ${mods.length} 个模块里最关键的概念。先合上要点自己答，标了“上琴题”的要真的在琴上弹出来，答完再对照，然后标记掌握程度。标了“不会”和“模糊”的题会出现在「今天」页。</p>
        <p class="small muted">已标记：会 ${cnt("ok")}，模糊 ${cnt("fuzzy")}，不会 ${cnt("no")}，未标记 ${QUESTIONS.length - cnt("ok") - cnt("fuzzy") - cnt("no")}</p></div>
      <div class="filters">
        <span class="grp"><span>重要度</span>${fbtn("freq", "all", "全部")}${fbtn("freq", "核心", "核心")}${fbtn("freq", "重要", "重要")}${fbtn("freq", "拓展", "拓展")}</span>
        <span class="grp"><span>状态</span>${fbtn("stat", "all", "全部")}${fbtn("stat", "none", "未标记")}${fbtn("stat", "no", "不会")}${fbtn("stat", "fuzzy", "模糊")}${fbtn("stat", "ok", "会")}</span>
        <span class="grp"><span>模块</span><select data-act="qmod" aria-label="按模块筛选"><option value="all">全部</option>${mods.map((id) => `<option value="${id}" ${F.mod === id ? "selected" : ""}>${id} ${esc(MODULES.find((m) => m.id === id).title)}</option>`).join("")}</select></span>
      </div>
      ${items || '<div class="empty"><p>没有符合筛选条件的题。换个筛选试试。</p></div>'}
    </section>`;
  }

  // ── 曲目分析 ──
  function pageSongs() {
    const sched = C.buildSchedule();
    const total = SONGS.reduce((a, s) => a + s.items.length, 0);
    const done = SONGS.reduce((a, s) => a + C.songProgress(s).done, 0);
    const stages = SONGS.map((a) => {
      const s = sched[a.id], pr = C.songProgress(a);
      const rows = a.items.map((it) => {
        const d = !!C.state.songs[it[0]];
        const localCard = window.LocalHub ? LocalHub.renderSongCard(it[0], true) : "";
        return `<tr class="${d ? "done" : ""}"><td class="c"><input type="checkbox" data-act="song" data-id="${it[0]}" ${d ? "checked" : ""} aria-label="完成 ${esc(it[1])}"></td>
          <td class="s">${K().songLink(it)}${localCard}</td><td class="p">${esc(it[3])}</td><td class="p">${esc(it[4])}</td></tr>`;
      }).join("");
      return `<h2>${a.id}　${esc(a.name)}</h2>
        <p>${md(s.start)} – ${md(s.end)}，与 ${a.from}～${a.to} 并行。重点：${esc(a.focus)}。</p>
        <div class="meter-row"><span>已分析 ${pr.done} / ${pr.total}</span><div class="meter"><i style="width:${(pr.frac * 100).toFixed(1)}%"></i></div><span class="num">${Math.round(pr.frac * 100)}%</span></div>
        <table class="probs songs"><thead><tr><th></th><th>曲目</th><th>看点</th><th>上琴任务</th></tr></thead><tbody>${rows}</tbody></table>`;
    }).join("");
    return `<section class="page">
      <div class="page-head"><h1>曲目分析</h1>
        <p class="lead">乐理只有放回真实的歌里才算学会。和模块并行，每天分析 1 首：先听、先猜，再对照“看点”，最后完成上琴任务。共 ${total} 首，已完成 ${done} 首。「今天」页会按阶段自动推荐下一首。</p>
        <p class="small muted">${esc(PRACTICE.note)}点曲名会在 YouTube 搜索这首歌。</p></div>
      <h2>分析一首歌的步骤</h2>
      <table class="simple"><thead><tr><th>步骤</th><th>做什么</th><th>留下什么</th></tr></thead><tbody>${ANALYSIS_STEPS.map((r) => `<tr><td style="white-space:nowrap">${esc(r[0])}</td><td>${esc(r[1])}</td><td style="white-space:nowrap">${esc(r[2])}</td></tr>`).join("")}</tbody></table>
      <h2>每日短练</h2>
      <p>每次练琴开头 10 分钟，「今天」页会按阶段轮换推荐一项。</p>
      <table class="simple"><thead><tr><th>阶段</th><th>练什么</th><th>怎么练</th></tr></thead><tbody>${DRILLS.map((d) => `<tr><td>${d.phase}</td><td style="white-space:nowrap">${K().drillLink(d)}</td><td>${esc(d.hint)}</td></tr>`).join("")}</tbody></table>
      ${stages}
      <h2>分析工具</h2>
      <ul class="plain">${["hooktheory", "songsterr", "transcribe", "twelveTone"].map((k) => `<li><a href="${RES[k].u}" target="_blank" rel="noopener">${esc(RES[k].t)}</a></li>`).join("")}</ul>
    </section>`;
  }

  window.Pages.assess = pageAssess;
  window.Pages.questions = pageQuestions;
  window.Pages.songs = pageSongs;
})();
