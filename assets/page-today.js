// 页面：今天
(function () {
  const C = Core;
  const { esc, cn, WD, TODAY, dayPlan, modProgress, dayDiff } = C;
  const CN_NUM = ["一", "二", "三", "四", "五", "六"];

  // 学习循环环形图：点击节点勾选这一步
  function ringSVG(m, nowSteps, centerSub) {
    const l = C.state.loop[m.id] || {};
    const cx = 190, cy = 168, R = 105, r = 22;
    const ang = [-90, -18, 54, 126, 198].map((a) => (a * Math.PI) / 180);
    const pt = (a, rad) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    let arcs = "";
    for (let i = 0; i < 5; i++) {
      const a1 = ang[i] + (r + 6) / R;
      const a2 = (i === 4 ? ang[0] + 2 * Math.PI : ang[i + 1]) - (r + 9) / R;
      const [x1, y1] = pt(a1, R), [x2, y2] = pt(a2, R);
      arcs += `<path class="arc" d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" marker-end="url(#ah)"/>`;
    }
    // 标签放在节点外侧：上、右、下、下、左
    const lab = (i, x, y) => [
      [x, y - r - 10, "middle"], [x + r + 8, y + 5, "start"], [x, y + r + 20, "middle"],
      [x, y + r + 20, "middle"], [x - r - 8, y + 5, "end"]
    ][i];
    const nodes = LOOP.map((s, i) => {
      const [x, y] = pt(ang[i], R);
      const [lx, ly, anchor] = lab(i, x, y);
      const cls = l[s.n] ? "done" : nowSteps.includes(s.n) ? "now" : "";
      const state = l[s.n] ? "已完成" : "未完成";
      return `<g class="node ${cls}" role="button" tabindex="0" data-act="loop" data-mod="${m.id}" data-step="${s.n}" aria-label="第 ${s.n} 步 ${esc(s.name)}，${state}，点击切换">
        <title>${esc(s.name)}：${state}</title>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>
        <text class="num" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${s.n}</text>
        <text class="lbl" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" style="text-anchor:${anchor}">${esc(s.short)}</text>
      </g>`;
    }).join("");
    return `<svg class="loop-svg" viewBox="0 0 380 340" role="group" aria-label="学习循环进度">
      <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9" fill="none" stroke="currentColor" stroke-width="1.6" style="color:var(--pencil)"/></marker>
      <marker id="ahr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9" fill="none" stroke="currentColor" stroke-width="1.6" style="color:var(--red)"/></marker></defs>
      ${arcs}
      <path class="back" d="M113 146 Q 160 190 142 234" marker-end="url(#ahr)"/>
      <text class="back-note" x="196" y="226">答不上来</text>
      <text class="center-1" x="${cx}" y="${cy - 8}">学习循环</text>
      <text class="center-2" x="${cx}" y="${cy + 14}">${esc(centerSub)}</text>
      ${nodes}
    </svg>`;
  }

  function stepButtons(m, steps) {
    const map = {
      1: ["find", "复制资料检索提示词"],
      2: ["teach", "复制 /teach 命令"],
      3: ["locate", "复制原资料定位提示词"],
      4: ["locate", "复制原资料定位提示词"],
      5: ["quiz", "复制 /quiz 命令"]
    };
    const seen = new Set();
    return steps.map((s) => map[s]).filter((x) => x && !seen.has(x[0]) && seen.add(x[0]))
      .map(([k, label]) => `<button class="btn" data-act="copy" data-tpl="${k}" data-mod="${m.id}">${label}</button>`).join("");
  }

  function checkRow(act, attrs, checked, text) {
    return `<label class="check ${checked ? "done" : ""}"><input type="checkbox" data-act="${act}" ${attrs} ${checked ? "checked" : ""}><span>${text}</span></label>`;
  }

  function progressBlock(sched, m) {
    const totalN = MODULES.reduce((a, x) => a + sched[x.id].n, 0);
    const overall = MODULES.reduce((a, x) => a + modProgress(x).frac * sched[x.id].n, 0) / totalN;
    const ph = PHASES.find((p) => p.id === m.phase);
    const pms = MODULES.filter((x) => x.phase === ph.id);
    const phaseFrac = pms.reduce((a, x) => a + modProgress(x).frac * sched[x.id].n, 0) / sched[ph.id].n;
    const mp = modProgress(m);
    const studyLeft = MODULES.filter((x) => x.phase === ph.id)
      .reduce((a, x) => a + sched[x.id].days.filter((d) => d >= C.todayStr).length, 0);
    const pi = PHASES.indexOf(ph);
    const row = (label, f) => `<div class="meter-row"><span>${label}</span><div class="meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(f * 100)}" aria-label="${label}"><i style="width:${(f * 100).toFixed(1)}%"></i></div><span class="num">${Math.round(f * 100)}%</span></div>`;
    return `<div class="block"><h3>进度</h3>
      ${row("整条路线", overall)}
      ${row("阶段" + CN_NUM[pi] + " " + ph.name, phaseFrac)}
      ${row(m.id + " " + m.title, mp.frac)}
      <p class="small muted" style="margin-top:10px">${ph.milestone}预计 ${cn(sched[ph.id].end)} 达成，本阶段还剩 ${studyLeft} 个练习日。${esc(ph.goal)}</p>
    </div>`;
  }

  function behindBlock(sched) {
    const behind = MODULES.filter((m) => sched[m.id].end < TODAY && !modProgress(m).complete);
    if (!behind.length) return "";
    const list = behind.map((m) => {
      const p = modProgress(m);
      const miss = [];
      if (p.loopDone < 5) miss.push(`循环还差 ${5 - p.loopDone} 步`);
      if (!C.state.deliv[m.id]) miss.push("产出未勾选");
      return `<li><a href="#/roadmap?m=${m.id}">${m.id} ${esc(m.title)}</a>：计划 ${cn(sched[m.id].end)} 完成，${miss.join("，")}</li>`;
    }).join("");
    return `<div class="note-block">有 ${behind.length} 个模块过了计划日期还没完成：<ul class="plain" style="margin:6px 0">${list}</ul>
      落后一两天正常，手上的功夫本来就比看懂慢。如果差得多，可以把未完成的模块从今天起整体顺延。
      <div class="btn-row"><button class="btn" data-act="rebase" data-mod="${behind[0].id}">从今天起顺延 ${behind[0].id} 及之后的模块</button></div></div>`;
  }

  function weakBlock() {
    const weak = QUESTIONS.filter((q) => ["no", "fuzzy"].includes(C.state.qs[q.id]));
    if (!weak.length) return "";
    const items = weak.slice(0, 6).map((q) => `<li><a href="#/questions?q=${q.id}">${esc(q.q)}</a> <span class="muted small">${C.state.qs[q.id] === "no" ? "不会" : "模糊"}，回看 ${q.mod}</span></li>`).join("");
    return `<div class="block"><h3>待补的弱项</h3><p class="small muted">自测题库里标了“不会”或“模糊”的题。今天的 /quiz 可以从这里挑。</p><ul class="plain">${items}</ul></div>`;
  }

  // 今天的曲目：当前阶段及之前阶段里，第一首还没分析的
  function songToday(sched) {
    const st = C.stageOn(sched, TODAY);
    if (!st) return { st: null, items: [] };
    // 「本周」页给今天排了曲目的，用排好的那首
    const wd = window.WeekKit && WeekKit.dayInfo(sched, C.todayStr);
    if (wd && wd.day && wd.day.songs) return { st, items: wd.day.songs.map((x) => WeekKit.songById(x.id)).filter(Boolean) };
    const idx = SONGS.indexOf(st);
    const pool = SONGS.slice(0, idx + 1).flatMap((a) => a.items);
    return { st, items: pool.filter((s) => !C.state.songs[s[0]]).slice(0, 1) };
  }
  const songUrl = (s) => s[5] === false ? "" : "https://www.youtube.com/results?search_query=" + encodeURIComponent(s[5] || `${s[1]} ${s[2]}`);
  const songLink = (s) => {
    const u = songUrl(s);
    return `${u ? `<a href="${u}" target="_blank" rel="noopener">${esc(s[1])}</a>` : esc(s[1])} <span class="muted small">${esc(s[2])}</span>`;
  };

  // 今天的日练：按阶段轮换
  function drillToday(m, dayNo) {
    const list = DRILLS.filter((d) => d.phase === m.phase);
    if (!list.length) return null;
    return list[(dayNo - 1) % list.length];
  }
  function drillLink(d) {
    if (d.link) return `<a href="${d.link}">${esc(d.t)}</a>`;
    if (d.res && RES[d.res]) return `<a href="${esc(RES[d.res].u)}" target="_blank" rel="noopener">${esc(d.t)}</a>`;
    return esc(d.t);
  }

  function rhythmBlock(m, plan, song, drill) {
    const S = C.state.settings;
    const rows = S.pace > 1.2 ? RHYTHM.part : RHYTHM.full;
    const stepNames = plan.steps.map((n) => LOOP[n - 1].short).join("、");
    const pracText = plan.prac.length ? plan.prac.map((i) => esc(m.practice[i])).join("；") : "继续未完成的练习";
    const items = rows.map((r) => {
      let extra = "";
      if (r.kind === "study") extra = `今天走第 ${plan.steps.join("、")} 步：${stepNames}`;
      if (r.kind === "build") extra = pracText;
      if (r.kind === "drill" && drill) extra = `${drillLink(drill)}：${esc(drill.hint)}`;
      if (r.kind === "song") extra = song.items.length ? song.items.map((s) => `${songLink(s)}。${esc(s[3])}`).join("") : "本阶段曲目已分析完，挑一首重新弹一遍";
      return `<li class="${r.kind === "rest" ? "rest" : ""}"><span class="t">${r.time}</span><span class="w">${esc(r.what)}${extra ? `<br><span class="small muted">${extra}</span>` : ""}</span></li>`;
    }).join("");
    return `<div class="block"><h3>今天的节奏</h3><ul class="timeline-day">${items}</ul></div>`;
  }

  function todoBlock(m, plan, song) {
    const l = C.state.loop[m.id] || {};
    const p = C.state.prac[m.id] || {};
    let html = plan.steps.map((n) => checkRow("loop", `data-mod="${m.id}" data-step="${n}"`, !!l[n], `循环第 ${n} 步：${esc(LOOP[n - 1].name)}`)).join("");
    html += plan.prac.map((i) => checkRow("prac", `data-mod="${m.id}" data-i="${i}"`, !!p[i], "上琴：" + esc(m.practice[i]))).join("");
    if (plan.deliv) html += checkRow("deliv", `data-mod="${m.id}"`, !!C.state.deliv[m.id], "产出：" + esc(m.deliverable));
    html += song.items.map((s) => checkRow("song", `data-id="${s[0]}"`, !!C.state.songs[s[0]], "曲目分析：" + songLink(s) + `<br><span class="small muted">上琴任务：${esc(s[4])}</span>`) + (window.LocalHub ? LocalHub.renderSongCard(s[0], true) : "")).join("");
    return `<div class="block"><h3>今天要勾掉的</h3>${html}
      <p class="small muted" style="margin:10px 0 0">勾选会同步到路线图和「本周」页。每天的详细安排和要精读的原文在 <a href="#/day">今天的学习内容</a>，完整的练习清单和资料在 <a href="#/roadmap?m=${m.id}">路线图的 ${m.id}</a>。</p></div>`;
  }

  function phase0Block() {
    const items = PHASE0.map((x) => checkRow("p0", `data-id="${x.id}"`, !!C.state.p0[x.id], esc(x.text))).join("");
    const done = PHASE0.filter((x) => C.state.p0[x.id]).length;
    return `<div class="block"><h3>开始前的准备（${done} / ${PHASE0.length}）</h3>${items}</div>`;
  }

  function milestoneList(sched) {
    return `<div class="block"><h3>里程碑</h3><table class="simple"><thead><tr><th>里程碑</th><th>预计日期</th><th>能力标志</th></tr></thead><tbody>
      ${PHASES.map((p) => `<tr><td style="white-space:nowrap">${p.milestone}</td><td style="white-space:nowrap">${cn(sched[p.id].end)}</td><td>${esc(p.goal)}</td></tr>`).join("")}
    </tbody></table></div>`;
  }

  function pageToday() {
    const sched = C.buildSchedule();
    const w = C.whereToday(sched);
    const dateLine = `${cn(TODAY)}，${WD[TODAY.getDay()]}`;
    const totalN = MODULES.reduce((a, x) => a + sched[x.id].n, 0);

    if (w.kind === "study") {
      const m = w.mod;
      const plan = dayPlan(m, w.idx, w.n);
      const ph = PHASES.find((p) => p.id === m.phase);
      const before = MODULES.slice(0, MODULES.indexOf(m)).reduce((a, x) => a + sched[x.id].n, 0);
      const dayNo = before + w.idx + 1;
      const song = songToday(sched);
      const drill = drillToday(m, dayNo);
      const prevMod = w.idx === 0 ? MODULES[MODULES.indexOf(m) - 1] : m;
      const threeBtn = prevMod ? `<button class="btn" data-act="copy" data-tpl="three" data-mod="${prevMod.id}">复制三层递进命令（${prevMod.id}）</button>` : "";
      const wd = window.WeekKit && WeekKit.dayInfo(sched, C.todayStr);
      const dayBtn = wd && wd.day ? `<a class="btn primary" href="#/day">打开今天的学习内容：${esc(wd.day.title)}</a>` : "";
      return `<section class="page">
        <div class="today-hero">
          <div>
            <div class="today-date">${dateLine}，练习第 ${dayNo} 天，共 ${totalN} 天</div>
            <h1><span class="hl">${esc(m.title)}</span></h1>
            <div class="today-sub">阶段${CN_NUM[PHASES.indexOf(ph)]}「${esc(ph.name)}」，${m.id} 第 ${w.idx + 1} / ${w.n} 天</div>
            <p>${esc(m.summary)}</p>
            <p class="note">${esc(m.why)}</p>
            ${dayBtn ? `<div class="btn-row">${dayBtn}</div>` : ""}
            <div class="btn-row">${threeBtn}${stepButtons(m, plan.steps)}<a class="btn" href="#/fretboard">打开指板</a><a class="btn" href="#/ear">练耳与节奏</a></div>
          </div>
          <div class="loop-wrap">${ringSVG(m, plan.steps, `${m.id} 第 ${w.idx + 1} / ${w.n} 天`)}</div>
        </div>
        ${behindBlock(sched)}
        <div class="cols-2"><div>${todoBlock(m, plan, song)}</div><div>${progressBlock(sched, m)}</div></div>
        ${rhythmBlock(m, plan, song, drill)}
        ${weakBlock()}
      </section>`;
    }

    if (w.kind === "before") {
      const m = w.mod;
      const start = sched[m.id].start;
      const when = w.daysLeft === 1 ? "明天" : `${w.daysLeft} 天后`;
      return `<section class="page">
        <div class="today-hero">
          <div>
            <div class="today-date">${dateLine}</div>
            <h1><span class="hl">开始前的准备</span></h1>
            <div class="today-sub">${when}（${cn(start)}，${WD[start.getDay()]}）开始第一个模块：${esc(m.title)}</div>
            <p>整条路线 ${totalN} 个练习日，${cn(start)} 到 ${cn(sched[MODULES[MODULES.length - 1].id].end)}。每个模块都按右边这个循环走：先找权威资料，用 AI 生成讲义搭骨架，抱着琴走一遍，再有重点地回到原资料并上琴验证，最后让 AI 反问你。</p>
            <p class="note">先把下面的准备清单做完，再去「指板」页试一次找音，记下你的起点成绩。</p>
            <div class="btn-row"><a class="btn" href="#/method">看方法论</a><a class="btn" href="#/assess">做能力自评</a><a class="btn" href="#/fretboard">试一次找音</a><a class="btn" href="#/settings">调整开始日期和节奏</a></div>
          </div>
          <div class="loop-wrap">${ringSVG(m, [1, 2, 3], `${m.id} 从 ${C.md(start)} 开始`)}</div>
        </div>
        ${phase0Block()}
        ${milestoneList(sched)}
      </section>`;
    }

    if (w.kind === "rest") {
      const m = w.next || w.prev;
      const nextLine = w.next ? `下一个练习日继续 ${w.next.id} ${esc(w.next.title)}` : "";
      const cur = MODULES.find((x) => sched[x.id].start <= TODAY && sched[x.id].end >= TODAY);
      const ringMod = cur || m;
      return `<section class="page">
        <div class="today-hero">
          <div>
            <div class="today-date">${dateLine}</div>
            <h1>今天休息</h1>
            <div class="today-sub">${nextLine}</div>
            <p>不安排强制任务。想摸琴的话，做 5 分钟指板找音，或者挑一两道标了“不会”的自测题用 /quiz 过一遍就够了。</p>
          </div>
          <div class="loop-wrap">${ringSVG(ringMod, [], `${ringMod.id} ${esc(ringMod.title.slice(0, 8))}`)}</div>
        </div>
        ${behindBlock(sched)}
        ${weakBlock()}
        ${progressBlock(sched, ringMod)}
      </section>`;
    }

    const doneCount = MODULES.filter((x) => modProgress(x).complete).length;
    return `<section class="page">
      <div class="page-head"><div class="today-date">${dateLine}</div><h1>路线走完了</h1>
      <p class="lead">${MODULES.length} 个模块完成了 ${doneCount} 个。接下来是“扒歌 → 分析 → 回模块补”的循环：每扒一首歌，就把卡住的知识点放回对应模块再转一圈。</p></div>
      ${behindBlock(sched)}
      ${weakBlock()}
      <div class="btn-row"><a class="btn primary" href="#/works">看作品与里程碑</a><a class="btn" href="#/songs">继续曲目分析</a><a class="btn" href="#/questions">刷自测题</a></div>
    </section>`;
  }

  window.Pages = window.Pages || {};
  window.Pages.today = pageToday;
  window.PageKit = { ringSVG, checkRow, songLink, songUrl, drillLink, drillToday, CN_NUM };
})();
