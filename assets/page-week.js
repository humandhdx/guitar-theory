// 页面：本周（7 天总览）、某一天的完整学习内容（要精读的原文嵌在页面里）
(function () {
  const C = Core;
  const { esc, cn, md, WD, TODAY, fmt, parseD, addDays } = C;
  const plans = () => window.WEEKPLAN || {};
  const kit = () => window.PageKit;

  const readKeys = (day) => (day && day.reading ? day.reading.flatMap((g) => g.keys) : []);
  const songIds = (day) => (day && day.songs ? day.songs.map((s) => s.id) : []);
  const songById = (id) => SONGS.flatMap((a) => a.items).find((s) => s[0] === id);
  const lis = (arr) => arr.map((x) => `<li>${x}</li>`).join("");
  const cmdBox = (cmd) => `<div class="cmd"><code>${esc(cmd)}</code><button class="btn" data-act="copy-cmd" data-text="${esc(cmd)}">复制</button></div>`;
  const secTime = (t) => (t ? `<small class="sec-time">${esc(t)}</small>` : "");
  const meter = (done, total) => `<div class="meter" role="meter" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><i style="width:${total ? ((done / total) * 100).toFixed(1) : 0}%"></i></div>`;

  // 一周从路线的开始日期算起，每 7 天一周（开始日期是周二，一周就是周二到下周一）
  const startDay = () => parseD(C.state.settings.start);
  const weekNo = (d) => Math.floor(C.dayDiff(startDay(), d) / 7);
  const weekStart = (d) => addDays(startDay(), weekNo(d) * 7);

  // 某一天在路线上的位置，以及有没有写好的每日内容
  function dayInfo(sched, ds) {
    for (const m of MODULES) {
      const idx = sched[m.id].days.indexOf(ds);
      if (idx >= 0) {
        const p = plans()[m.id];
        const n = sched[m.id].n;
        const dayNo = MODULES.slice(0, MODULES.indexOf(m)).reduce((a, x) => a + sched[x.id].n, 0) + idx + 1;
        return { kind: "study", m, idx, n, dayNo, plan: C.dayPlan(m, idx, n), day: p && p.days[idx], lesson: p && p.lesson };
      }
    }
    // 休息日：找它之前最近的一个学习日
    let last = null, lm = null;
    MODULES.forEach((m) => sched[m.id].days.forEach((d) => { if (d < ds && (!last || d > last)) { last = d; lm = m; } }));
    const next = MODULES.find((m) => sched[m.id].days[0] > ds) || null;
    if (!lm) return { kind: "before", next };
    return { kind: "rest", m: lm, next };
  }

  function progress(info) {
    if (info.kind !== "study") return null;
    const S = C.state;
    const { m, plan, day } = info;
    const l = S.loop[m.id] || {}, pr = S.prac[m.id] || {};
    const marks = [
      ...plan.steps.map((n) => !!l[n]),
      ...plan.prac.map((i) => !!pr[i]),
      ...(plan.deliv ? [!!S.deliv[m.id]] : []),
      ...readKeys(day).map((k) => !!S.read[k]),
      ...songIds(day).map((id) => !!S.songs[id])
    ];
    return { done: marks.filter(Boolean).length, total: marks.length };
  }

  // ── 本周 ──
  function weekCard(d, info, sched) {
    const ds = fmt(d);
    const isToday = ds === C.todayStr;
    let tag, title, lead, prog = "";
    if (info.kind === "study") {
      tag = `${info.m.id} 第 ${info.idx + 1} / ${info.n} 天 · 循环第 ${info.plan.steps.join("、")} 步`;
      title = info.day ? info.day.title : info.m.title;
      lead = info.day ? info.day.lead : "这一天的每日内容还没生成，先按「今天」页的节奏走。";
      const p = progress(info);
      prog = `<div class="wk-prog"><span class="num">${p.done} / ${p.total}</span>${meter(p.done, p.total)}</div>`;
    } else if (info.kind === "rest") {
      tag = "休息日";
      title = "休息";
      lead = info.next ? `不安排新内容。下一个练习日继续 ${info.next.id} ${esc(info.next.title)}。` : "不安排新内容。";
    } else {
      tag = "开始前";
      title = "路线还没开始";
      lead = info.next ? `${cn(parseD(sched[info.next.id].days[0]))}开始 ${info.next.id} ${esc(info.next.title)}。` : "";
    }
    return `<a class="wk-day${isToday ? " is-today" : ""}${info.kind === "study" ? "" : " is-rest"}" href="#/day?d=${ds}">
      <div class="wk-date"><b>${WD[d.getDay()]}</b><span>${md(d)}</span>${isToday ? "<em>今天</em>" : ""}</div>
      <div class="wk-main"><div class="wk-tag">${tag}</div><div class="wk-title">${esc(title)}</div><div class="wk-lead">${lead}</div></div>
      ${prog}
    </a>`;
  }

  function pageWeek(params) {
    const sched = C.buildSchedule();
    const off = parseInt(params.get("w") || "0", 10) || 0;
    const first = addDays(weekStart(TODAY), off * 7);
    const no = weekNo(first) + 1;
    const days = Array.from({ length: 7 }, (_, i) => addDays(first, i));
    const infos = days.map((d) => dayInfo(sched, fmt(d)));
    const studies = infos.filter((x) => x.kind === "study");
    const mods = [...new Set(studies.map((x) => x.m))];
    const S = C.state;

    const keys = studies.flatMap((x) => readKeys(x.day));
    const songs = studies.flatMap((x) => songIds(x.day));
    const sum = (arr, ok) => [arr.filter(ok).length, arr.length];
    const [rd, rt] = sum(keys, (k) => S.read[k]);
    const [sd, st] = sum(songs, (id) => S.songs[id]);
    const missing = studies.filter((x) => !x.day).length;
    const label = off === 0 ? "本周" : off === 1 ? "下周" : off === -1 ? "上周" : no > 0 ? `第 ${no} 周` : "开始之前";

    const modRows = mods.map((m) => {
      const ends = sched[m.id].days[sched[m.id].n - 1];
      const endsHere = days.some((d) => fmt(d) === ends);
      return `<li><b>${m.id} ${esc(m.title)}</b>：${endsHere ? `${md(parseD(ends))} 验收，产出是“${esc(m.deliverable)}”` : `这周进行中，${md(parseD(ends))} 验收`}</li>`;
    }).join("");

    return `<section class="page">
      <div class="page-head">
        <div class="today-date">${no > 0 ? `第 ${no} 周 · ` : ""}${cn(first)} – ${cn(days[6])}</div>
        <h1>${label}的学习内容</h1>
        <p class="lead">点开任何一天，就是那天要做的全部事情：时间表、讲义入口、要精读的原文（Open Music Theory 原文与中文译文、谱例图已经嵌在页面里，G3～G15 还配了电吉他指板专题卡）、上琴练习、自测题和曲目。</p>
        <div class="btn-row"><a class="btn" href="#/week?w=${off - 1}">← 上一周</a>${off ? '<a class="btn" href="#/week">回到本周</a>' : ""}<a class="btn" href="#/week?w=${off + 1}">下一周 →</a></div>
      </div>
      <div class="wk-list">${days.map((d, i) => weekCard(d, infos[i], sched)).join("")}</div>
      ${studies.length ? `<div class="block"><h3>这一周的账</h3>
        <ul class="plain">${modRows}</ul>
        ${rt ? `<div class="meter-row"><span>精读原文</span>${meter(rd, rt)}<span class="num">${rd}/${rt}</span></div>` : ""}
        ${st ? `<div class="meter-row"><span>曲目分析</span>${meter(sd, st)}<span class="num">${sd}/${st}</span></div>` : ""}
        ${missing ? `<p class="small muted" style="margin-top:10px">有 ${missing} 个练习日还没有每日内容。先用 /teach 生成那个模块的讲义，再在 Claude Code 里说“生成下一周的学习内容”。</p>` : ""}
      </div>` : ""}
    </section>`;
  }

  // ── 某一天 ──
  function excerpt(k, next) {
    const r = window.READING && READING[k];
    if (!r) return `<p class="small muted">（缺少摘录：${esc(k)}）</p>`;
    const key = "doc-" + k;
    const read = !!C.state.read[k];
    const src = r.src.replace(/^Open Music Theory/, "OMT").replace(/（.*）$/, "");
    return `<details class="doc${read ? " read" : ""}" data-key="${key}" ${UI.open.has(key) ? "open" : ""}>
      <summary><span class="doc-t">${esc(r.t)}${r.te && r.te !== r.t ? `<small>${esc(r.te)}</small>` : ""}</span><span class="doc-src">${read ? "已读 · " : ""}${esc(src)}</span></summary>
      <div class="doc-body">${r.h}<p class="doc-credit">${esc(r.src)}。${esc(r.credit)}</p></div>
      <div class="doc-foot">${kit().checkRow("read", `data-k="${k}"${next ? ` data-next="${next}"` : ""}`, read, "读完了")}<a href="${esc(r.u)}" target="_blank" rel="noopener">在原网站打开这一节 ↗</a></div>
    </details>`;
  }

  function readingGroup(g, nextOf) {
    const linksHtml = g.links && g.links.length
      ? `<ul class="rd-links">${g.links.map((x) => {
          const r = x.res && window.RES && RES[x.res];
          const url = x.u || (r && r.u) || "";
          const title = x.t || (r && r.t) || "";
          const digest = x.res && window.LocalHub ? LocalHub.renderResDigest(x.res) : "";
          return `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)} ↗</a>${x.note ? ` <span class="small muted">${esc(x.note)}</span>` : ""}${digest}</li>`;
        }).join("")}</ul>`
      : "";
    return `<div class="rd-group">
      <h3>${secTime(g.time)}${esc(g.title)}</h3>
      ${linksHtml}
      <div class="rd-look"><b>读的时候找：</b><ul class="plain">${lis(g.look)}</ul></div>
      ${g.skip ? `<p class="small muted">${g.skip}</p>` : ""}
      ${(g.keys || []).map((k) => excerpt(k, nextOf[k])).join("")}
      ${g.try ? `<p class="rd-try"><b>上琴：</b>${g.try}</p>` : ""}
    </div>`;
  }

  function langSwitch() {
    const v = C.state.settings.readLang || "zh";
    const b = (k, t) => `<button data-act="rdlang" data-v="${k}" aria-pressed="${v === k}">${t}</button>`;
    return `<div class="rd-lang"><span>原文显示：</span>${b("zh", "中文")}${b("both", "中英对照")}${b("en", "English")}</div>`;
  }

  function todoBlock(info) {
    const { m, plan, day } = info;
    const S = C.state;
    const { checkRow, songLink } = kit();
    const l = S.loop[m.id] || {}, pr = S.prac[m.id] || {};
    let html = plan.steps.map((n) => checkRow("loop", `data-mod="${m.id}" data-step="${n}"`, !!l[n], `循环第 ${n} 步：${esc(LOOP[n - 1].name)}`)).join("");
    html += plan.prac.map((i) => checkRow("prac", `data-mod="${m.id}" data-i="${i}"`, !!pr[i], `练习 ${i + 1}：${esc(m.practice[i])}`)).join("");
    if (plan.deliv) html += checkRow("deliv", `data-mod="${m.id}"`, !!S.deliv[m.id], "产出：" + esc(m.deliverable));
    html += songIds(day).map((id) => { const s = songById(id); return s ? checkRow("song", `data-id="${id}"`, !!S.songs[id], "曲目：" + songLink(s)) : ""; }).join("");
    const keys = readKeys(day);
    const rd = keys.filter((k) => S.read[k]).length;
    return `<div class="block"><h3>这一天要勾掉的</h3>
      ${day.loopNote ? `<p class="note">${day.loopNote}</p>` : ""}
      ${html}
      ${keys.length ? `<div class="meter-row" style="margin-top:10px"><span>精读原文</span>${meter(rd, keys.length)}<span class="num">${rd}/${keys.length}</span></div>` : ""}
      <p class="small muted" style="margin:8px 0 0">勾选和「今天」页、路线图同步。</p>
    </div>`;
  }

  function pracBlock(m, p) {
    const done = !!(C.state.prac[m.id] || {})[p.i];
    return `<div class="prac-item">
      <h3>练习 ${p.i + 1}：${esc(p.title)}</h3>
      ${p.rules ? `<p class="note">${p.rules.join("；")}。</p>` : ""}
      <ol class="plain">${lis(p.steps)}</ol>
      ${p.standard ? `<p><b>完成标准：</b>${p.standard}</p>` : ""}
      ${p.record ? `<p><b>留下记录：</b>${p.record}</p>` : ""}
      ${p.after ? `<p class="small">${p.after}</p>` : ""}
      ${kit().checkRow("prac", `data-mod="${m.id}" data-i="${p.i}"`, done, `练习 ${p.i + 1} 完成，达到了完成标准`)}
    </div>`;
  }

  function studyPage(info, ds, head) {
    const { m, idx, n, plan, day, dayNo } = info;
    const S = C.state;
    const { checkRow, songLink, drillLink, drillToday, CN_NUM } = kit();
    const keys = readKeys(day);
    const nextOf = Object.fromEntries(keys.map((k, i) => [k, keys[i + 1] || ""]));
    const drill = drillToday(m, dayNo);
    const total = day.schedule.reduce((a, r) => a + (parseInt(r[0], 10) || 0), 0);
    const hasReading = day.reading && day.reading.length > 0;
    const jumps = [
      ["sec-plan", "时间表"], day.warm && ["sec-warm", "三层递进"], ["sec-lesson", "讲义"], hasReading && ["sec-read", keys.length ? "精读原文" : "精读资料"],
      ["sec-q", "合上资料"], ["sec-prac", "上琴练习"], day.accept && ["sec-accept", "验收"], ["sec-self", "自测"],
      ["sec-song", "曲目"], drill && ["sec-drill", "日练"], ["sec-eve", "反问与复盘"]
    ].filter(Boolean);
    const ph = PHASES.find((p) => p.id === m.phase);
    const isToday = ds === C.todayStr;

    return `${head}
      <div class="page-head">
        <h1>${isToday ? `<span class="hl">${esc(day.title)}</span>` : esc(day.title)}</h1>
        <div class="today-sub" style="margin-top:12px">阶段${CN_NUM[PHASES.indexOf(ph)]}「${esc(ph.name)}」 · ${m.id} ${esc(m.title)} · 第 ${idx + 1} / ${n} 天 · 循环第 ${plan.steps.join("、")} 步</div>
        <p>${day.lead}</p>
        <div class="jump-row">${jumps.map((j) => `<button data-act="jump" data-id="${j[0]}">${j[1]}</button>`).join("")}</div>
      </div>

      <div class="cols-2">
        <div>${todoBlock(info)}</div>
        <div class="block" id="sec-plan"><h3>时间表</h3><div class="sched-wrap"><table class="simple sched"><tbody>
          ${day.schedule.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}${r[2] ? `<div class="small muted">${esc(r[2])}</div>` : ""}</td></tr>`).join("")}
        </tbody><tfoot><tr><td>共 ${total} 分钟</td><td>按顺序做，节拍器常开；时间不够就砍曲目，别砍上琴</td></tr></tfoot></table></div></div>
      </div>

      ${day.pre ? `<div class="block"><h3>${esc(day.pre.h)}</h3><ul class="plain">${lis(day.pre.items)}</ul>${day.pre.note ? `<p class="note-block">${day.pre.note}</p>` : ""}</div>` : ""}

      ${day.warm ? `<h2 id="sec-warm">${secTime(day.warm.time)}三层递进</h2>
        <p>在 Claude Code 里输入（或直接点右侧复制通用 AI 提示词）：</p><div class="cmd"><code>${esc(day.warm.cmd)}</code><button class="btn" data-act="copy-cmd" data-text="${esc(day.warm.cmd)}">复制命令</button><button class="btn" data-act="copy" data-tpl="threeGeneric" data-mod="${m.id}">复制通用提示词</button></div><p>${day.warm.text}</p>` : ""}

      <h2 id="sec-lesson">${secTime(day.lesson.time)}讲义</h2>
      <p>${day.lesson.text}</p>
      <ul class="plain">${day.lesson.anchors.map(([id, label]) => `<li><a href="${esc(info.lesson)}#${id}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join("")}</ul>

      ${hasReading ? (keys.length
        ? `<h2 id="sec-read">精读原文 <span class="muted small" style="font-weight:400">${keys.filter((k) => S.read[k]).length} / ${keys.length} 已读</span></h2>
          <p class="small muted">${keys.every((k) => window.READING && READING[k] && READING[k].verbatim === false)
            ? "下面是电吉他指板与名师实战双语精读卡片，可切换中文 / 中英对照 / English；虚线下划线的术语悬停可见英文释义，读完勾“读完了”会自动展开下一篇，也可点卡片右下角直达原站。"
            : keys.some((k) => window.READING && READING[k] && READING[k].verbatim === false)
              ? "下面包含 Open Music Theory（开放乐理教材，CC BY-SA 4.0）原文摘录，以及电吉他指板与名师实战双语卡片（可切换中文 / 中英对照 / English）。OMT 原文只做了排版清理，内容没改；虚线下划线术语悬停可见英文释义，读完勾“读完了”会自动展开下一篇。"
              : "下面是 Open Music Theory（开放乐理教材，CC BY-SA 4.0）的原文，只做了排版清理，内容没改；中文是本站翻译，有出入以英文为准。虚线下划线的术语，鼠标停上去能看到原书术语表的英文释义。点标题展开，读完勾“读完了”，会自动展开下一篇。"}</p>
          ${langSwitch()}
          ${day.reading.map((g) => readingGroup(g, nextOf)).join("")}`
        : `<h2 id="sec-read">精读资料与重点指引</h2>
          <p class="small muted">带着讲义里标出的 <b>？</b> 和 <b>！</b> 去读原教材与课程，只精读解决问题的段落，并立刻抱琴验证。</p>
          ${day.reading.map((g) => readingGroup(g, nextOf)).join("")}`) : ""}

      <h2 id="sec-q">${secTime(day.questionsTime)}合上资料，用自己的话回答</h2>
      <ol class="plain">${lis(day.questions)}</ol>
      <p class="small muted">答案写进 <a href="#/log">复盘日志</a>。写不出来的那题，回讲义或上面的原文再找一次。</p>

      <h2 id="sec-prac">${secTime(day.pracTime)}上琴练习</h2>
      ${day.practice.map((p) => pracBlock(m, p)).join("")}

      ${day.accept ? `<h2 id="sec-accept">${secTime(day.accept.time)}${m.id} 验收</h2>
        <ul class="plain">${lis(day.accept.items)}</ul>
        <p class="note-block">${day.accept.note}</p>
        ${checkRow("deliv", `data-mod="${m.id}"`, !!S.deliv[m.id], "产出：" + esc(m.deliverable))}` : ""}

      <h2 id="sec-self">自测</h2>
      <p class="small muted">先自己答（上琴题要真的弹），再展开看答案。</p>
      ${day.selfcheck.map((s, i) => `<div class="selfq"><p><b>${i + 1}.</b> ${s.q}</p>
        <details data-key="self-${ds}-${i}" ${UI.open.has(`self-${ds}-${i}`) ? "open" : ""}><summary>答案</summary><p>${s.a}</p></details></div>`).join("")}

      <h2 id="sec-song">${secTime(day.songTime)}曲目</h2>
      ${day.songs.map((x) => { const s = songById(x.id); return s ? `<div class="song-item">${checkRow("song", `data-id="${x.id}"`, !!S.songs[x.id], songLink(s))}
        ${window.LocalHub ? LocalHub.renderSongCard(x.id, false) : ""}
        <p>看点：${esc(s[3])}</p><p>上琴：${esc(s[4])}</p>${x.how ? `<p>${x.how}</p>` : ""}</div>` : ""; }).join("")}
      <p class="small muted">已内置全部曲目的本地和弦进行/Riff 试听与指板跳转；点曲名可在 YouTube 搜索原版录音。完整曲目表在 <a href="#/songs">曲目分析</a>。</p>

      ${drill ? `<h2 id="sec-drill">${secTime(day.drillTime)}日练</h2>
        <p><b>${drillLink(drill)}</b>：${esc(drill.hint)}</p>${day.drillNote ? `<p>${day.drillNote}</p>` : ""}` : ""}

      <h2 id="sec-eve">${secTime(day.evening.time)}反问与复盘</h2>
      <p>在 Claude Code 里输入（或点右侧复制通用 AI 提示词）：</p><div class="cmd"><code>${esc(day.evening.cmd)}</code><button class="btn" data-act="copy-cmd" data-text="${esc(day.evening.cmd)}">复制命令</button><button class="btn" data-act="copy" data-tpl="quizGeneric" data-mod="${m.id}">复制通用提示词</button></div>
      <ul class="plain">${lis(day.evening.items)}</ul>
      <div class="btn-row"><a class="btn" href="#/log">写复盘日志</a><a class="btn" href="#/fretboard">打开指板</a><a class="btn" href="#/ear">练耳与节奏</a></div>

      <div class="block" id="sec-done"><h3>这一天结束时应该有的</h3><ul class="plain">${lis(day.done)}</ul></div>`;
  }

  // 还没写每日内容的练习日：只列出排期给的练习
  function plainStudyPage(info, head) {
    const { m, idx, n, plan } = info;
    return `${head}<div class="page-head"><h1>${esc(m.title)}</h1>
      <div class="today-sub" style="margin-top:12px">${m.id} 第 ${idx + 1} / ${n} 天 · 循环第 ${plan.steps.join("、")} 步</div>
      <p class="lead">这一天的每日内容还没生成。先用 /teach 生成 ${m.id} 的讲义，再在 Claude Code 里说“生成下一周的学习内容”，这里就会出现时间表、要精读的原文和上琴练习。</p>
      <div class="btn-row"><a class="btn" href="#/roadmap?m=${m.id}">路线图里的 ${m.id}</a><a class="btn" href="#/today">「今天」页的节奏</a></div></div>
      <div class="block"><h3>这一天的上琴练习</h3><ul class="plain">${lis(plan.prac.map((i) => esc(m.practice[i])))}</ul>
      ${plan.deliv ? `<p><b>产出：</b>${esc(m.deliverable)}</p>` : ""}</div>`;
  }

  // 休息日：把这个模块还没读完的原文列出来，想补就在这里读
  function restPage(info, head) {
    const S = C.state;
    const P = plans()[info.m.id];
    const keys = P ? P.days.flatMap((dd) => readKeys(dd)).filter((k) => !S.read[k]) : [];
    return `${head}<div class="page-head"><h1>休息</h1>
      <p class="lead">不安排新内容。想摸琴的话，做 5 分钟指板找音，或者挑一两道标了“不会”的自测题用 /quiz 过一遍。${info.next ? `下一个练习日继续 ${info.next.id} ${esc(info.next.title)}。` : ""}</p></div>
      ${keys.length ? `<h2 id="sec-read">${info.m.id} 还没读完的原文</h2>${langSwitch()}${keys.map((k, j) => excerpt(k, keys[j + 1] || "")).join("")}` : ""}`;
  }

  function pageDay(params) {
    const sched = C.buildSchedule();
    const q = params.get("d") || "";
    const ds = /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : C.todayStr;
    const d = parseD(ds);
    const info = dayInfo(sched, ds);
    const woff = weekNo(d) - weekNo(TODAY);
    const head = `<div class="day-nav">
        <a href="#/week${woff ? "?w=" + woff : ""}">← ${woff === 0 ? "本周" : "那一周"}的全部安排</a>
        <span><a href="#/day?d=${fmt(addDays(d, -1))}">‹ 前一天</a><a href="#/day?d=${fmt(addDays(d, 1))}">后一天 ›</a></span>
      </div>
      <div class="today-date">${cn(d)}，${WD[d.getDay()]}${ds === C.todayStr ? "（今天）" : ""}</div>`;

    let body;
    if (info.kind === "study" && info.day) body = studyPage(info, ds, head);
    else if (info.kind === "study") body = plainStudyPage(info, head);
    else if (info.kind === "rest") body = restPage(info, head);
    else body = `${head}<div class="page-head"><h1>路线还没开始</h1><p class="lead">${info.next ? `${cn(parseD(sched[info.next.id].days[0]))}开始 ${info.next.id} ${esc(info.next.title)}。` : ""}先把「今天」页的准备清单做完。</p></div>`;
    const lang = C.state.settings.readLang || "zh";
    return `<section class="page day-page rd-${lang}">${body}
      <div class="day-nav day-nav-foot"><a href="#/day?d=${fmt(addDays(d, -1))}">‹ 前一天</a><a href="#/day?d=${fmt(addDays(d, 1))}">后一天 ›</a></div>
    </section>`;
  }

  window.Pages = window.Pages || {};
  window.Pages.week = pageWeek;
  window.Pages.day = pageDay;
  window.WeekKit = { dayInfo, progress, songById };
})();
