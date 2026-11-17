// 路由、导航、事件
(function () {
  const C = Core;
  const NL = String.fromCharCode(10);
  window.UI = {
    open: new Set(),
    qf: { freq: "all", stat: "all", mod: "all" },
    rf: { q: "", k: "all" }
  };

  const NAV = [
    ["today", "今天"], ["week", "本周"], ["method", "方法论"], ["roadmap", "路线图"], ["assess", "能力自评"], null,
    ["questions", "自测题库"], ["songs", "曲目分析"], ["fretboard", "指板"], ["ear", "练耳与节奏"], ["log", "复盘日志"], ["lessons", "讲义"], null,
    ["works", "作品与里程碑"], ["resources", "资源库"], ["settings", "设置"]
  ];

  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [name, query] = h.split("?");
    return { name: Pages[name] ? name : "today", params: new URLSearchParams(query || "") };
  }

  function navCounts() {
    const S = C.state;
    const qsOk = QUESTIONS.filter((q) => S.qs[q.id] === "ok").length;
    const songDone = SONGS.reduce((a, s) => a + C.songProgress(s).done, 0);
    const songTotal = SONGS.reduce((a, s) => a + s.items.length, 0);
    const modsDone = MODULES.filter((m) => C.modProgress(m).complete).length;
    const E = S.ear || {};
    const earTot = (E.intTot || 0) + (E.chTot || 0) + (E.degTot || 0) + (E.progTot || 0);
    const earOk = (E.intOk || 0) + (E.chOk || 0) + (E.degOk || 0) + (E.progOk || 0);
    return {
      roadmap: `${modsDone}/${MODULES.length}`,
      questions: `${qsOk}/${QUESTIONS.length}`,
      songs: `${songDone}/${songTotal}`,
      fretboard: S.fret.best ? (S.fret.best / 1000).toFixed(1) + "s" : "",
      ear: earTot ? Math.round((earOk / earTot) * 100) + "%" : "",
      log: S.log.length ? String(S.log.length) : "",
      lessons: (window.LESSONS || []).length ? String(window.LESSONS.length) : ""
    };
  }

  function renderNav(cur) {
    const cnt = navCounts();
    document.getElementById("nav").innerHTML = NAV.map((n) => n
      ? `<li><a href="#/${n[0]}" ${n[0] === cur ? 'aria-current="page"' : ""}>${n[1]}<span class="count">${cnt[n[0]] || ""}</span></a></li>`
      : '<li class="nav-gap" aria-hidden="true"></li>').join("");
  }

  let lastRoute = "";
  function render(keepScroll) {
    const r = route();
    const y = window.scrollY;
    document.getElementById("page").innerHTML = Pages[r.name](r.params);
    renderNav(r.name === "day" ? "week" : r.name);
    const titleMap = { ...Object.fromEntries(NAV.filter(Boolean)), day: "每日学习" };
    document.title = `${titleMap[r.name]}｜电吉他乐理`;
    const key = location.hash;
    if (keepScroll) window.scrollTo(0, y);
    else if (key !== lastRoute) {
      const m = r.params.get("m"), q = r.params.get("q");
      const target = m ? document.getElementById("mod-" + m) : q ? document.getElementById("q-" + q) : null;
      if (target) {
        if (m) { UI.open.add("pack-" + m); const d = target.querySelector("details"); if (d) d.open = true; }
        target.scrollIntoView({ block: "start" });
        window.scrollBy(0, -16);
      } else window.scrollTo(0, 0);
    }
    lastRoute = key;
  }
  function update() { C.save(); render(true); }

  // ── 提示词复制 ──
  function promptFor(el) {
    const tpl = el.dataset.tpl;
    if (tpl === "question") {
      const q = QUESTIONS.find((x) => x.id === el.dataset.q);
      return C.fill(PROMPTS.question, { q: q.q, background: C.state.settings.background });
    }
    const m = MODULES.find((x) => x.id === el.dataset.mod) || MODULES[0];
    return C.fill(PROMPTS[tpl], C.modCtx(m));
  }

  function toggle(obj, k) { if (obj[k]) delete obj[k]; else obj[k] = true; }

  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.matches("input, select")) return;
    const S = C.state;
    const a = el.dataset.act;
    if (a === "loop") {
      const m = el.dataset.mod;
      S.loop[m] = S.loop[m] || {};
      toggle(S.loop[m], el.dataset.step);
      update();
    } else if (a === "copy") {
      const ok = await C.copyText(promptFor(el));
      C.toast(ok ? "已复制，粘贴到 AI 对话框即可" : "复制失败，请手动选择文本复制");
    } else if (a === "copy-cmd") {
      const ok = await C.copyText(el.dataset.text);
      C.toast(ok ? "已复制，粘贴到 Claude Code 即可" : "复制失败，请手动选择文本复制");
    } else if (a === "jump") {
      scrollToEl(document.getElementById(el.dataset.id));
    } else if (a === "rdlang") {
      S.settings.readLang = el.dataset.v;
      update();
    } else if (a === "assess") {
      S.assess[el.dataset.id] = Number(el.dataset.v);
      update();
    } else if (a === "qs") {
      if (S.qs[el.dataset.id] === el.dataset.v) delete S.qs[el.dataset.id];
      else S.qs[el.dataset.id] = el.dataset.v;
      update();
    } else if (a === "qf") {
      UI.qf[el.dataset.k] = el.dataset.v;
      render(true);
    } else if (a === "rk") {
      UI.rf.k = el.dataset.v;
      render(true);
    } else if (a === "rebase") {
      S.settings.rebase = { mod: el.dataset.mod, date: C.todayStr };
      update();
      C.toast(`已从今天起顺延 ${el.dataset.mod} 及之后的模块`);
    } else if (a === "unrebase") {
      S.settings.rebase = null;
      update();
    } else if (a === "log-del") {
      if (!confirm("删除这条日志？")) return;
      S.log = S.log.filter((x) => x.id !== el.dataset.id);
      update();
    } else if (a === "log-export") {
      const md = [...S.log].sort((x, y) => (x.date > y.date ? 1 : -1)).map((x) => [
        `## ${x.date}${x.mod ? " " + x.mod : ""}`,
        x.learned ? `**心智模型**：${x.learned}` : "",
        x.stuck ? `**卡点**：${x.stuck}` : "",
        x.next ? `**下次回看与要练的**：${x.next}` : ""
      ].filter(Boolean).join(NL + NL)).join(NL + NL);
      download("电吉他乐理-复盘日志.md", "# 电吉他乐理复盘日志" + NL + NL + md, "text/markdown");
    } else if (a === "export") {
      download(`guitar-theory-进度-${C.todayStr}.json`, JSON.stringify(S, null, 2), "application/json");
    } else if (a === "reset") {
      if (!confirm("清空所有进度、自评、题库标记、找音成绩和日志？这一步无法撤销，建议先导出。")) return;
      localStorage.removeItem(C.KEY);
      location.reload();
    } else if (a === "theme") {
      const order = ["auto", "light", "dark"];
      S.settings.theme = order[(order.indexOf(S.settings.theme) + 1) % 3];
      C.applyTheme();
      C.save();
      themeLabel();
    }
  });

  // 键盘操作环形图节点
  document.addEventListener("keydown", (e) => {
    const g = e.target.closest && e.target.closest("g.node");
    if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); g.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    const S = C.state;
    const a = el.dataset.act;
    if (a === "prac") {
      const m = el.dataset.mod;
      S.prac[m] = S.prac[m] || {};
      toggle(S.prac[m], el.dataset.i);
      update();
    } else if (a === "deliv") { toggle(S.deliv, el.dataset.mod); update(); }
    else if (a === "p0") { toggle(S.p0, el.dataset.id); update(); }
    else if (a === "song") { toggle(S.songs, el.dataset.id); update(); }
    else if (a === "read") {
      // 读完一篇：收起它，展开并滚到下一篇没读的
      const k = el.dataset.k, nx = el.dataset.next;
      toggle(S.read, k);
      const goNext = S.read[k] && nx && !S.read[nx];
      if (S.read[k]) UI.open.delete("doc-" + k);
      if (goNext) UI.open.add("doc-" + nx);
      update();
      if (goNext) scrollToEl(document.querySelector(`[data-key="doc-${nx}"]`));
    } else if (a === "loop") {
      const m = el.dataset.mod;
      S.loop[m] = S.loop[m] || {};
      toggle(S.loop[m], el.dataset.step);
      update();
    } else if (a === "qmod") { UI.qf.mod = el.value; render(true); }
    else if (a === "import") {
      const f = el.files[0];
      if (!f) return;
      f.text().then((t) => {
        try {
          const data = JSON.parse(t);
          if (!data.settings) throw new Error("bad");
          localStorage.setItem(C.KEY, JSON.stringify(data));
          location.reload();
        } catch (_) { C.toast("文件格式不对，导入失败"); }
      });
    } else if (el.form && el.form.dataset.form === "settings") {
      const fd = new FormData(el.form);
      S.settings.start = fd.get("start") || S.settings.start;
      S.settings.pace = Number(fd.get("pace")) || 1;
      S.settings.weekend = fd.get("weekend") === "on";
      S.settings.holidays = String(fd.get("holidays") || "").split(/[,，\s]+/).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x));
      S.settings.background = String(fd.get("background") || "").trim();
      S.settings.theme = fd.get("theme");
      C.applyTheme();
      themeLabel();
      update();
      C.toast("设置已保存，排期已更新");
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.dataset.act === "rq") {
      UI.rf.q = e.target.value;
      const pos = e.target.selectionStart;
      render(true);
      const box = document.querySelector('[data-act="rq"]');
      box.focus();
      box.setSelectionRange(pos, pos);
    }
  });

  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.dataset.form !== "log") return;
    e.preventDefault();
    const fd = new FormData(form);
    const entry = {
      id: Date.now().toString(36),
      date: fd.get("date") || C.todayStr,
      mod: fd.get("mod") || "",
      learned: String(fd.get("learned") || "").trim(),
      stuck: String(fd.get("stuck") || "").trim(),
      next: String(fd.get("next") || "").trim()
    };
    if (!entry.learned && !entry.stuck && !entry.next) { C.toast("三栏至少写一栏"); return; }
    C.state.log.push(entry);
    update();
    C.toast("日志已保存");
  });

  // 记住展开状态，重绘后保持
  document.addEventListener("toggle", (e) => {
    const d = e.target;
    if (d.tagName !== "DETAILS" || !d.dataset.key) return;
    if (d.open) UI.open.add(d.dataset.key); else UI.open.delete(d.dataset.key);
  }, true);

  // 甘特图悬停提示
  const tip = document.getElementById("tip");
  document.addEventListener("mousemove", (e) => {
    const t = e.target.closest && e.target.closest("[data-tip]");
    if (!t) { tip.style.display = "none"; return; }
    tip.textContent = t.dataset.tip;
    tip.style.display = "block";
    const w = tip.offsetWidth;
    tip.style.left = Math.min(e.clientX + 14, window.innerWidth - w - 8) + "px";
    tip.style.top = e.clientY + 16 + "px";
  });

  function scrollToEl(t) { if (!t) return; t.scrollIntoView({ block: "start" }); window.scrollBy(0, -12); }

  function download(name, text, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type + ";charset=utf-8" }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function themeLabel() {
    const t = C.state.settings.theme;
    document.getElementById("themeBtn").textContent = t === "auto" ? "外观：跟随系统" : t === "dark" ? "外观：深色" : "外观：浅色";
  }

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", C.applyTheme);
  window.addEventListener("hashchange", () => render(false));
  C.applyTheme();
  themeLabel();
  render(false);
})();
