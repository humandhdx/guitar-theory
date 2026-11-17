// 页面：指板（音阶/和弦显示 + CAGED 把位聚焦 + 音阶×和弦双层叠显 + 实战指型库 + 持续音 + 五度圈实验室 + 找音练习）
(function () {
  const C = Core;
  const { esc } = C;
  const M = () => window.Music;
  const FRETS = 15;
  const NATURAL = ["C", "D", "E", "F", "G", "A", "B"];
  const ALL = ["C", "C♯", "D♭", "D", "E♭", "E", "F", "F♯", "G♭", "G", "A♭", "A", "B♭", "B"];

  const UI = {
    root: "A", type: "minorPenta", lab: "name", tone: "clean", pos: "all",
    ov: "", vCat: "triad432", vId: "", vPoints: null,
    acc: false, drill: null, flash: null, micOn: false, micLast: "", applied: "", cofKey: "C"
  };

  // 计算 CAGED / 五声 5 个把位的品格窗口 [lo, hi]（落在 0..15 品内）
  function cagedWindow(rootPc, typeId, pos) {
    if (pos === "all") return null;
    const t = M().TYPE[typeId];
    const isMinor = t && t.ivs.includes("♭3") && !t.ivs.includes("3");
    let f6 = (rootPc - 4 + 12) % 12;
    let f5 = (rootPc - 9 + 12) % 12;
    let f4 = (rootPc - 2 + 12) % 12;
    const fit = (lo, hi) => {
      while (lo < 0) { lo += 12; hi += 12; }
      while (hi > FRETS && lo >= 12) { lo -= 12; hi -= 12; }
      return [Math.max(0, lo), Math.min(FRETS, hi)];
    };
    if (isMinor) {
      if (pos === "E") return fit(f6, f6 + 3);
      if (pos === "D") return fit(f4, f4 + 3);
      if (pos === "C") return fit(f4 + 2, f4 + 6);
      if (pos === "A") return fit(f5, f5 + 3);
      if (pos === "G") return fit(f6 - 3, f6);
    } else {
      if (pos === "C") return fit(f5 < 3 ? f5 + 9 : f5 - 3, (f5 < 3 ? f5 + 12 : f5) + 1);
      if (pos === "A") return fit(f5 === 0 ? 0 : f5 - 1, (f5 === 0 ? 1 : f5) + 3);
      if (pos === "G") return fit(f6 < 4 ? f6 + 8 : f6 - 4, f6 < 4 ? f6 + 12 : f6);
      if (pos === "E") return fit(f6 === 0 ? 0 : f6 - 1, f6 + 2);
      if (pos === "D") return fit(f4 < 1 ? f4 + 11 : f4 - 1, (f4 < 1 ? f4 + 12 : f4) + 3);
    }
    return null;
  }

  // 解析叠显目标和弦（格式 "Root:typeId"，例如 "D:dom7"）
  function parseOverlay() {
    if (!UI.ov || !UI.ov.includes(":")) return null;
    const [r, t] = UI.ov.split(":");
    const Mu = M();
    if (!Mu.ROOTS.includes(r) || !Mu.TYPE[t]) return null;
    return { root: r, typeId: t, build: Mu.build(r, t) };
  }

  // ── 实战和弦把位指型计算器（密排三和弦 / 壳和弦 / Drop 2 四部七和弦）──
  // voices: [[stringIdx(0=1弦..5=6弦), degLabel, semisOffsetFromBass], ...]
  function solveVoicing(rootName, voices) {
    const Mu = M();
    const rPc = Mu.parseName(rootName).pc;
    const [s0, lab0] = voices[0];
    const deg0 = Mu.parseDeg(lab0).semis;
    const pc0 = (rPc + deg0) % 12;
    let f0 = (pc0 - (Mu.OPEN[s0] % 12) + 12) % 12;
    let baseMidi = Mu.OPEN[s0] + f0;
    let pts = voices.map(([s, lab, off]) => {
      const m = baseMidi + off;
      return { s, f: m - Mu.OPEN[s], lab, midi: m, name: Mu.spell(rootName, lab) };
    });
    if (pts.some((p) => p.f < 0) || (pts[0].f === 0 && pts.some((p) => p.f > 5))) {
      pts = pts.map((p) => ({ ...p, f: p.f + 12, midi: p.midi + 12 }));
    }
    if (pts.some((p) => p.f > FRETS) && pts.every((p) => p.f >= 12)) {
      pts = pts.map((p) => ({ ...p, f: p.f - 12, midi: p.midi - 12 }));
    }
    // 生成 6→1 弦品格谱，例如 "x-5-4-5-x-x"
    const tab = [5, 4, 3, 2, 1, 0].map((s) => {
      const hit = pts.find((p) => p.s === s);
      return hit ? String(hit.f) : "x";
    }).join("-");
    return { pts, tab, midis: pts.map((p) => p.midi) };
  }

  function getVoicingDefs(rootName, typeId) {
    const Mu = M();
    const t = Mu.TYPE[typeId];
    const isMin = t && t.ivs.includes("♭3") && !t.ivs.includes("3");
    const isDim = t && t.ivs.includes("♭5") && isMin;
    const hasMaj7 = t && t.ivs.includes("7");
    const third = isMin ? "♭3" : "3";
    const s3 = isMin ? 3 : 4;
    const fifth = isDim ? "♭5" : "5";
    const s5 = isDim ? 6 : 7;
    const sev = hasMaj7 ? "7" : "♭7";
    const s7 = hasMaj7 ? 11 : 10;

    return [
      {
        id: "t432-0", cat: "triad", group: "4-3-2 弦密排三和弦（G5）",
        title: "原位（1–" + third + "–" + fifth + "）",
        v: solveVoicing(rootName, [[3, "1", 0], [2, third, s3], [1, fifth, s5]])
      },
      {
        id: "t432-1", cat: "triad", group: "4-3-2 弦密排三和弦（G5）",
        title: "第一转位（" + third + "–" + fifth + "–1）",
        v: solveVoicing(rootName, [[3, third, 0], [2, fifth, s5 - s3], [1, "1", 12 - s3]])
      },
      {
        id: "t432-2", cat: "triad", group: "4-3-2 弦密排三和弦（G5）",
        title: "第二转位（" + fifth + "–1–" + third + "）",
        v: solveVoicing(rootName, [[3, fifth, 0], [2, "1", 12 - s5], [1, third, 12 + s3 - s5]])
      },
      {
        id: "t321-0", cat: "triad", group: "3-2-1 弦高音密排三和弦（G5）",
        title: "原位（1–" + third + "–" + fifth + "）",
        v: solveVoicing(rootName, [[2, "1", 0], [1, third, s3], [0, fifth, s5]])
      },
      {
        id: "t321-1", cat: "triad", group: "3-2-1 弦高音密排三和弦（G5）",
        title: "第一转位（" + third + "–" + fifth + "–1）",
        v: solveVoicing(rootName, [[2, third, 0], [1, fifth, s5 - s3], [0, "1", 12 - s3]])
      },
      {
        id: "t321-2", cat: "triad", group: "3-2-1 弦高音密排三和弦（G5）",
        title: "第二转位（" + fifth + "–1–" + third + "）",
        v: solveVoicing(rootName, [[2, fifth, 0], [1, "1", 12 - s5], [0, third, 12 + s3 - s5]])
      },
      {
        id: "sh6", cat: "shell", group: "壳和弦 Shell Voicings（G6/G11/G13）",
        title: "6 弦根音（1–" + sev + "–" + third + "）",
        v: solveVoicing(rootName, [[5, "1", 0], [3, sev, s7], [2, third, 12 + s3]])
      },
      {
        id: "sh5", cat: "shell", group: "壳和弦 Shell Voicings（G6/G11/G13）",
        title: "5 弦根音（1–" + third + "–" + sev + "）",
        v: solveVoicing(rootName, [[4, "1", 0], [3, third, s3], [2, sev, s7]])
      },
      {
        id: "d2-r", cat: "drop2", group: "4-3-2-1 弦 Drop 2 四部七和弦（进阶）",
        title: "根音最低（1–" + fifth + "–" + sev + "–" + third + "）",
        v: solveVoicing(rootName, [[3, "1", 0], [2, fifth, s5], [1, sev, s7], [0, third, 12 + s3]])
      },
      {
        id: "d2-1", cat: "drop2", group: "4-3-2-1 弦 Drop 2 四部七和弦（进阶）",
        title: "三音最低（" + third + "–" + sev + "–1–" + fifth + "）",
        v: solveVoicing(rootName, [[3, third, 0], [2, sev, s7 - s3], [1, "1", 12 - s3], [0, fifth, 12 + s5 - s3]])
      },
      {
        id: "d2-2", cat: "drop2", group: "4-3-2-1 弦 Drop 2 四部七和弦（进阶）",
        title: "五音最低（" + fifth + "–1–" + third + "–" + sev + "）",
        v: solveVoicing(rootName, [[3, fifth, 0], [2, "1", 12 - s5], [1, third, 12 + s3 - s5], [0, sev, 12 + s7 - s5]])
      },
      {
        id: "d2-3", cat: "drop2", group: "4-3-2-1 弦 Drop 2 四部七和弦（进阶）",
        title: "七音最低（" + sev + "–" + third + "–" + fifth + "–1）",
        v: solveVoicing(rootName, [[3, sev, 0], [2, third, 12 + s3 - s7], [1, fifth, 12 + s5 - s7], [0, "1", 12 - s7]])
      }
    ];
  }

  // ── 指板 SVG ──
  const L = 46, OPENW = 40, FW = 54, TOP = 20, SS = 30;
  const fx = (f) => (f === 0 ? L + OPENW / 2 : L + OPENW + (f - 0.5) * FW);
  const sy = (s) => TOP + s * SS;
  const W = L + OPENW + FRETS * FW + 12, H = TOP + 5 * SS + 40;

  function boardSVG() {
    const Mu = M();
    const B = Mu.build(UI.root, UI.type);
    const ov = B.t.g === "音阶" ? parseOverlay() : null;
    const d = UI.drill;
    const win = d ? null : cagedWindow(B.rootPc, UI.type, UI.pos);
    const vPts = !d && UI.vPoints ? UI.vPoints : null;
    let g = "";
    if (win) {
      const x1 = win[0] === 0 ? L : L + OPENW + (win[0] - 1) * FW;
      const x2 = win[1] === 0 ? L + OPENW : L + OPENW + win[1] * FW;
      g += `<rect class="fb-win" x="${x1}" y="${sy(0) - 14}" width="${x2 - x1}" height="${5 * SS + 28}" rx="6"/>`;
    }
    for (let k = 0; k <= FRETS; k++) {
      const x = L + OPENW + k * FW;
      g += `<line class="${k === 0 ? "nut" : "fret"}" x1="${x}" y1="${sy(0)}" x2="${x}" y2="${sy(5)}"/>`;
    }
    const mid = (sy(2) + sy(3)) / 2;
    [3, 5, 7, 9, 15].forEach((f) => { g += `<circle class="inlay" cx="${fx(f)}" cy="${mid}" r="5"/>`; });
    g += `<circle class="inlay" cx="${fx(12)}" cy="${(sy(1) + sy(2)) / 2}" r="5"/><circle class="inlay" cx="${fx(12)}" cy="${(sy(3) + sy(4)) / 2}" r="5"/>`;
    for (let s = 0; s < 6; s++) {
      g += `<line class="string" x1="${L + OPENW}" y1="${sy(s)}" x2="${W - 12}" y2="${sy(s)}" style="stroke-width:${(0.8 + s * 0.35).toFixed(2)}"/>`;
      g += `<text class="sname" x="${L - 10}" y="${sy(s) + 4}">${s + 1} ${Mu.SHARP[Mu.OPEN[s] % 12]}</text>`;
    }
    for (let f = 1; f <= FRETS; f++) g += `<text class="fnum" x="${fx(f)}" y="${sy(5) + 30}">${f}</text>`;
    g += `<text class="fnum" x="${fx(0)}" y="${sy(5) + 30}">空弦</text>`;

    // 如果激活了指型高亮，先画连接线
    if (vPts && vPts.length > 1) {
      const poly = vPts.map((p) => `${fx(p.f)},${sy(p.s)}`).join(" ");
      g += `<polyline class="v-line" points="${poly}"/>`;
    }

    // 音符
    for (let s = 0; s < 6; s++) {
      for (let f = 0; f <= FRETS; f++) {
        const midi = Mu.OPEN[s] + f, pc = midi % 12;
        const x = fx(f), y = sy(s);
        let mark = "";
        if (d) {
          const target = Mu.parseName(d.note).pc;
          const hit = d.found[s] && d.found[s].includes(f);
          if (hit && pc === target) mark = `<circle class="dot ok" cx="${x}" cy="${y}" r="11"/><text class="dl" x="${x}" y="${y + 4}">${esc(d.note)}</text>`;
          else if (UI.flash && UI.flash[0] === s && UI.flash[1] === f) mark = `<circle class="dot bad" cx="${x}" cy="${y}" r="11"/><text class="dl" x="${x}" y="${y + 4}">${esc(Mu.SHARP[pc])}</text>`;
        } else {
          const vHit = vPts && vPts.find((p) => p.s === s && p.f === f);
          const inBase = B.map[pc];
          const inOv = ov && ov.build.map[pc];
          const inWin = !win || (f >= win[0] && f <= win[1]);
          const dim = (win && !inWin) || (vPts && !vHit) ? " is-dim" : "";

          if (vHit) {
            const text = UI.lab === "deg" ? vHit.lab : vHit.name;
            mark = `<circle class="ov-ring" cx="${x}" cy="${y}" r="14.5"/><circle class="dot color" cx="${x}" cy="${y}" r="11"/><text class="dl color" x="${x}" y="${y + 4}">${esc(text)}</text>`;
          } else if (inBase) {
            const cls = inBase.root ? "root" : inBase.color ? "color" : "tone";
            const text = UI.lab === "deg" ? inBase.lab : inBase.name;
            const ring = inOv ? `<circle class="ov-ring${dim}" cx="${x}" cy="${y}" r="14"/><text class="ov-tag${dim}" x="${x + 12}" y="${y - 9}">${esc(inOv.lab)}</text>` : "";
            mark = `${ring}<circle class="dot ${cls}${dim}" cx="${x}" cy="${y}" r="11"/><text class="dl ${cls}${dim}" x="${x}" y="${y + 4}">${esc(text)}</text>`;
          } else if (inOv) {
            // 叠显和弦里“跨出底层音阶盒子”的灵魂变色音（例如 A 小五声叠显 D7 时的 F♯）
            const text = UI.lab === "deg" ? inOv.lab : inOv.name;
            mark = `<circle class="ov-ring out${dim}" cx="${x}" cy="${y}" r="14"/><circle class="dot out-tone${dim}" cx="${x}" cy="${y}" r="10.5"/><text class="dl out-tone${dim}" x="${x}" y="${y + 4}">${esc(text)}</text>`;
          }
        }
        const cw = f === 0 ? OPENW : FW;
        g += `<g class="cell" data-act="fb-note" data-s="${s}" data-f="${f}"><rect x="${x - cw / 2}" y="${y - SS / 2}" width="${cw}" height="${SS}"/>${mark}</g>`;
      }
    }
    return `<div class="fb-scroll"><svg class="fb" viewBox="0 0 ${W} ${H}" style="width:100%;min-width:${Math.round(W * 0.8)}px" role="img" aria-label="吉他指板，0 到 ${FRETS} 品，1 弦在上">${g}</svg></div>`;
  }

  // ── 叠显目标和弦快捷栏（对应 G10/G11/G13 Playing the Changes）──
  function overlayBar(B) {
    if (B.t.g !== "音阶") return "";
    const Mu = M();
    const isMinor = B.t.ivs.includes("♭3") && !B.t.ivs.includes("3");
    const r = UI.root;
    const n4 = Mu.spell(r, "4"), n5 = Mu.spell(r, "5");
    const presets = isMinor
      ? [
          ["", "不叠显"],
          [`${r}:m7`, `i7 (${r}m7)`],
          [`${n4}:m7`, `iv7 (${n4}m7)`],
          [`${n5}:dom7`, `V7 (${n5}7)`],
          [`${r}:dom7`, `I7 (${r}7 布鲁斯)`],
          [`${n4}:dom7`, `IV7 (${n4}7 布鲁斯/多利亚)`],
          [`${Mu.spell(r, "♭6")}:maj`, `♭VI (${Mu.spell(r, "♭6")})`],
          [`${Mu.spell(r, "♭7")}:maj`, `♭VII (${Mu.spell(r, "♭7")})`]
        ]
      : [
          ["", "不叠显"],
          [`${r}:maj7`, `Imaj7 (${r}maj7)`],
          [`${Mu.spell(r, "2")}:m7`, `ii7 (${Mu.spell(r, "2")}m7)`],
          [`${Mu.spell(r, "3")}:m7`, `iii7 (${Mu.spell(r, "3")}m7)`],
          [`${n4}:maj7`, `IVmaj7 (${n4}maj7)`],
          [`${n5}:dom7`, `V7 (${n5}7)`],
          [`${Mu.spell(r, "6")}:m7`, `vi7 (${Mu.spell(r, "6")}m7)`],
          [`${Mu.spell(r, "♭7")}:maj`, `♭VII (${Mu.spell(r, "♭7")})`]
        ];
    const btns = presets.map(([v, label]) => `<button class="btn ${UI.ov === v ? "on" : ""}" data-act="fb-ov" data-v="${esc(v)}">${esc(label)}</button>`).join("");
    const ov = parseOverlay();
    let detail = "";
    if (ov) {
      const inNotes = [], outNotes = [];
      ov.build.t.ivs.forEach((iv, idx) => {
        const pc = (ov.build.rootPc + Mu.parseDeg(iv).semis) % 12;
        const item = `${ov.build.names[idx]}(${iv})`;
        if (B.map[pc]) inNotes.push(item);
        else outNotes.push(item);
      });
      detail = `<div class="ov-info">
        <span>当前叠显：<b>${esc(ov.root + (ov.build.t.sym || ""))}</b>（外环标出和弦音）</span>
        <span>音阶内共有音：<b>${esc(inNotes.join("、") || "无")}</b></span>
        ${outNotes.length ? `<span class="ov-out-tip">跨出音阶的变色目标音（虚线环）：<b>${esc(outNotes.join("、"))}</b></span>` : `<span class="muted">全部和弦音均在当前音阶内</span>`}
        <button class="btn" data-act="fb-ov-play">▶ 试听 ${esc(ov.root + (ov.build.t.sym || ""))}</button>
      </div>`;
    }
    return `<div class="filters fb-ctl" style="margin-top:6px"><span class="grp"><span>叠显目标和弦</span>${btns}</span></div>${detail}`;
  }

  // ── 控件与说明 ──
  function controls() {
    const Mu = M();
    const B = Mu.build(UI.root, UI.type);
    const rootOpt = Mu.ROOTS.map((r) => `<option ${r === UI.root ? "selected" : ""}>${r}</option>`).join("");
    const grp = (name) => Mu.TYPES.filter((t) => t.g === name).map((t) => `<option value="${t.id}" ${t.id === UI.type ? "selected" : ""}>${esc(t.name)}${t.sym !== undefined && t.sym !== "" ? "（" + esc(t.sym) + "）" : ""}</option>`).join("");
    const isChord = B.t.g === "和弦";
    const isMinor = B.t.ivs.includes("♭3") && !B.t.ivs.includes("3");
    const legend = isChord ? "实心：根音　红色：3 音和 7 音，决定和弦性质的音" : "实心：根音　红色：特征音　红色外环：叠显的目标和弦音";
    const seg = (v, t) => `<button class="btn ${UI.lab === v ? "on" : ""}" data-act="fb-lab" data-v="${v}">${t}</button>`;
    const posList = isMinor
      ? [["all", "全指板"], ["E", "Em型 (P1)"], ["D", "Dm型 (P2)"], ["C", "Cm型 (P3)"], ["A", "Am型 (P4)"], ["G", "Gm型 (P5)"]]
      : [["all", "全指板"], ["C", "C型"], ["A", "A型"], ["G", "G型"], ["E", "E型"], ["D", "D型"]];
    const posBtns = posList.map(([v, t]) => `<button class="btn ${UI.pos === v ? "on" : ""}" data-act="fb-pos" data-v="${v}">${t}</button>`).join("");
    const win = cagedWindow(B.rootPc, UI.type, UI.pos);
    const droneOn = Mu.isDrone() === B.rootPc;
    return `<div class="filters fb-ctl">
        <span class="grp"><span>根音</span><select data-act="fb-root" aria-label="根音">${rootOpt}</select></span>
        <span class="grp"><span>类型</span><select data-act="fb-type" aria-label="音阶或和弦"><optgroup label="音阶">${grp("音阶")}</optgroup><optgroup label="和弦">${grp("和弦")}</optgroup></select></span>
        <span class="grp"><span>显示</span>${seg("name", "音名")}${seg("deg", "级数")}</span>
        <span class="grp"><span>音色</span><select data-act="fb-tone" aria-label="音色"><option value="clean" ${UI.tone === "clean" ? "selected" : ""}>清音</option><option value="drive" ${UI.tone === "drive" ? "selected" : ""}>过载</option></select></span>
        <button class="btn primary" data-act="fb-play">${isChord ? "播放：扫弦 + 分解" : "播放：上行一个八度"}</button>
        <button class="btn ${droneOn ? "on" : ""}" data-act="fb-drone">${droneOn ? "关闭持续音 (" + esc(UI.root) + ")" : "持续音伴奏 (" + esc(UI.root) + ")"}</button>
      </div>
      <div class="filters fb-ctl" style="margin-top:6px"><span class="grp"><span>把位聚焦</span>${posBtns}</span>${win ? `<span class="small muted">当前聚焦：第 ${win[0]}～${win[1]} 品</span>` : ""}${UI.vPoints ? `<button class="btn" data-act="fb-vclear">清除指型高亮</button>` : ""}</div>
      ${overlayBar(B)}
      <p class="fb-info"><b>${esc(Mu.label(UI.root, UI.type))}</b>　${B.names.map(esc).join(" ")}　<span class="muted">${B.t.ivs.map(esc).join(" ")}</span></p>
      <p class="small muted" style="margin:0 0 8px">${esc(B.t.tip)}${/[𝄪𝄫]/u.test(B.names.join("")) ? "　出现重升、重降是因为按音程拼写：七个字母每个只用一次。" : ""}<br>${legend}。点任意一格都能听到这个音；开着持续音就能直接在屏幕上练习调式或五声即兴。</p>`;
  }

  // ── 实战和弦把位指型速查面板（密排三和弦 / 壳和弦 / Drop 2 四部和弦）──
  function voicingBlock() {
    const defs = getVoicingDefs(UI.root, UI.type);
    const groups = [...new Set(defs.map((d) => d.group))];
    const rows = groups.map((gName) => {
      const cards = defs.filter((d) => d.group === gName).map((d) => {
        const on = UI.vId === d.id;
        return `<button class="btn v-card ${on ? "on" : ""}" data-act="fb-voicing" data-id="${d.id}">
          <b>${esc(d.title)}</b>
          <code>${esc(d.v.tab)}</code>
        </button>`;
      }).join("");
      return `<div class="cof-sec"><span>${esc(gName)}</span><div class="cof-chords">${cards}</div></div>`;
    }).join("");
    return `<div class="block"><h3>实战和弦把位指型库（当前根音：${esc(UI.root)}）</h3>
      <p class="small muted">解决“满指板都是和弦音，到底按哪几根弦”的问题。点击任意指型卡片，上方指板会用连线高亮这 3～4 个真实按弦点并直接扫弦发声（数字谱从左到右为 6→1 弦）。</p>
      ${rows}
      ${UI.vPoints ? `<div class="btn-row" style="margin-top:10px"><button class="btn" data-act="fb-vclear">恢复全指板视图</button></div>` : ""}
    </div>`;
  }

  // ── 交互式五度圈与顺阶和弦实验室 ──
  const COF_KEYS = [
    { k: "C", rel: "Am", sig: "无升降", acc: "0" },
    { k: "G", rel: "Em", sig: "1♯（F♯）", acc: "1♯" },
    { k: "D", rel: "Bm", sig: "2♯（F♯ C♯）", acc: "2♯" },
    { k: "A", rel: "F♯m", sig: "3♯（F♯ C♯ G♯）", acc: "3♯" },
    { k: "E", rel: "C♯m", sig: "4♯（F♯ C♯ G♯ D♯）", acc: "4♯" },
    { k: "B", rel: "G♯m", sig: "5♯（F♯ C♯ G♯ D♯ A♯）", acc: "5♯" },
    { k: "F♯", rel: "D♯m", sig: "6♯ / 6♭（G♭ = F♯）", acc: "6♯/♭" },
    { k: "D♭", rel: "B♭m", sig: "5♭（B♭ E♭ A♭ D♭ G♭）", acc: "5♭" },
    { k: "A♭", rel: "Fm", sig: "4♭（B♭ E♭ A♭ D♭）", acc: "4♭" },
    { k: "E♭", rel: "Cm", sig: "3♭（B♭ E♭ A♭）", acc: "3♭" },
    { k: "B♭", rel: "Gm", sig: "2♭（B♭ E♭）", acc: "2♭" },
    { k: "F", rel: "Dm", sig: "1♭（B♭）", acc: "1♭" }
  ];
  const DIA_TRIAD = [["I", "maj"], ["ii", "min"], ["iii", "min"], ["IV", "maj"], ["V", "maj"], ["vi", "min"], ["vii°", "dim"]];
  const DIA_SEVEN = [["Imaj7", "maj7"], ["ii7", "m7"], ["iii7", "m7"], ["IVmaj7", "maj7"], ["V7", "dom7"], ["vi7", "m7"], ["viiø7", "m7b5"]];

  function cofBlock() {
    const Mu = M();
    const cur = COF_KEYS.find((x) => x.k === UI.cofKey) || COF_KEYS[0];
    const scale = Mu.build(cur.k, "major").names;
    const cx = 155, cy = 155, Ro = 122, Ri = 76;
    const items = COF_KEYS.map((item, idx) => {
      const a = ((-90 + idx * 30) * Math.PI) / 180;
      const xo = cx + Ro * Math.cos(a), yo = cy + Ro * Math.sin(a);
      const xi = cx + Ri * Math.cos(a), yi = cy + Ri * Math.sin(a);
      const on = item.k === cur.k;
      return `<g class="cof-node ${on ? "is-on" : ""}" role="button" tabindex="0" data-act="fb-cof" data-k="${esc(item.k)}">
        <circle cx="${xo.toFixed(1)}" cy="${yo.toFixed(1)}" r="21"/>
        <text class="cof-maj" x="${xo.toFixed(1)}" y="${(yo - 1).toFixed(1)}">${esc(item.k)}</text>
        <text class="cof-acc" x="${xo.toFixed(1)}" y="${(yo + 12).toFixed(1)}">${esc(item.acc)}</text>
        <text class="cof-min" x="${xi.toFixed(1)}" y="${(yi + 4).toFixed(1)}">${esc(item.rel)}</text>
      </g>`;
    }).join("");

    const chordBtn = (root, typeId, rn) => {
      const t = Mu.TYPE[typeId];
      const sym = root + (t.sym ?? "");
      return `<button class="btn cof-chord" data-act="fb-ch-play" data-r="${esc(root)}" data-t="${typeId}"><small>${esc(rn)}</small><b>${esc(sym)}</b></button>`;
    };
    const triads = scale.map((n, i) => chordBtn(n, DIA_TRIAD[i][1], DIA_TRIAD[i][0])).join("");
    const sevens = scale.map((n, i) => chordBtn(n, DIA_SEVEN[i][1], DIA_SEVEN[i][0])).join("");
    const borrowed = [
      [Mu.spell(cur.k, "♭3"), "maj", "♭III"],
      [scale[3], "min", "iv"],
      [Mu.spell(cur.k, "♭6"), "maj", "♭VI"],
      [Mu.spell(cur.k, "♭7"), "maj", "♭VII"]
    ].map(([r, t, rn]) => chordBtn(r, t, rn)).join("");
    const secDom = [
      [scale[1], "dom7", "V/V"],
      [scale[5], "dom7", "V/ii"],
      [scale[2], "dom7", "V/vi"],
      [cur.k, "dom7", "V/IV"]
    ].map(([r, t, rn]) => chordBtn(r, t, rn)).join("");

    return `<div class="block cof-box"><h3>五度圈与顺阶和弦实验室</h3>
      <p class="small muted">点五度圈上任意一个调，立刻查看调号、7 个音与顺阶和弦；点下方任意和弦按钮可直接试听并切换上方指板。</p>
      <div class="cof-wrap">
        <svg class="cof-svg" viewBox="0 0 310 310" role="group" aria-label="交互式五度圈">
          <circle class="cof-ring" cx="${cx}" cy="${cy}" r="${Ro}"/>
          <circle class="cof-ring" cx="${cx}" cy="${cy}" r="${Ri}"/>
          <text class="cof-mid-1" x="${cx}" y="${cy - 4}">${esc(cur.k)} 大调</text>
          <text class="cof-mid-2" x="${cx}" y="${cy + 15}">关系小调 ${esc(cur.rel)}</text>
          ${items}
        </svg>
        <div class="cof-detail">
          <p><b>${esc(cur.k)} 大调</b>（关系小调 <b>${esc(cur.rel)}</b>）　调号：<span class="muted">${esc(cur.sig)}</span></p>
          <p>音阶 7 音：<b>${scale.map(esc).join(" – ")}</b></p>
          <div class="cof-sec"><span>顺阶三和弦</span><div class="cof-chords">${triads}</div></div>
          <div class="cof-sec"><span>顺阶七和弦</span><div class="cof-chords">${sevens}</div></div>
          <div class="cof-sec"><span>常用借用和弦（同主音小调）</span><div class="cof-chords">${borrowed}</div></div>
          <div class="cof-sec"><span>常用副属和弦</span><div class="cof-chords">${secDom}</div></div>
        </div>
      </div>
    </div>`;
  }

  // ── 找音练习 ──
  function drillBlock() {
    const d = UI.drill;
    const F = C.state.fret;
    const hist = F.history.slice(-6).reverse().map((h) => `<tr><td>${esc(h.d)}</td><td>${esc(h.n)}</td><td class="num">${(h.ms / 1000).toFixed(1)} 秒</td><td>${h.miss ? h.miss + " 次点错" : "全对"}</td></tr>`).join("");
    const micBtn = `<button class="btn ${UI.micOn ? "on" : ""}" data-act="fb-mic">${UI.micOn ? "🎙️ 真琴识别已开（收听：" + esc(UI.micLast || "待拨弦") + "）" : "🎙️ 开启麦克风真琴找音"}</button>`;
    const status = d
      ? `<p class="fb-target">找出所有的 <b>${esc(d.note)}</b>　<span class="muted">已找到 ${d.found.filter((x) => x && x.length).length} / 6 根弦，点错 ${d.miss} 次，用时 <span id="fb-time">0.0</span> 秒</span></p>
         <div class="btn-row"><button class="btn" data-act="fb-drill-stop">放弃这一题</button>${micBtn}</div>`
      : `<div class="btn-row"><button class="btn primary" data-act="fb-drill">开始找音</button>${micBtn}
          <label class="check" style="margin:0"><input type="checkbox" data-act="fb-acc" ${UI.acc ? "checked" : ""}><span>包含升降音</span></label></div>`;
    return `<div class="block fb-drill"><h3>找音练习（支持屏幕点击或 🎙️ 真琴弹奏识别）</h3>
      <p class="small muted">随机出一个音，在 6 根弦上各找到一次（0～${FRETS} 品都算），全部找到自动计时。开启“麦克风真琴找音”后，按从 6 弦到 1 弦顺序在真吉他上依次弹响该音，系统会自动听音识别并点亮对应琴弦！</p>
      ${status}
      <p class="small">${F.best ? `最好成绩：${(F.best / 1000).toFixed(1)} 秒` : "还没有成绩"}${F.history.length ? `，共练了 ${F.history.length} 次` : ""}</p>
      ${hist ? `<table class="simple"><thead><tr><th>日期</th><th>音</th><th>用时</th><th>准确</th></tr></thead><tbody>${hist}</tbody></table>` : ""}
    </div>`;
  }

  function inner() {
    return `${controls()}${boardSVG()}${voicingBlock()}${drillBlock()}${cofBlock()}`;
  }

  function pageFretboard(params) {
    // 从链接带参数打开：#/fretboard?root=A&type=dorian&ov=D:dom7
    if (location.hash !== UI.applied) {
      UI.applied = location.hash;
      const r = params.get("root"), t = params.get("type"), ov = params.get("ov");
      if (r && M().ROOTS.includes(r)) UI.root = r;
      if (t && M().TYPE[t]) UI.type = t;
      if (ov !== null) UI.ov = ov;
      UI.vId = ""; UI.vPoints = null;
    }
    const drills = DRILLS.filter((d) => d.phase === "P1" || d.phase === "P2").slice(0, 4);
    return `<section class="page">
      <div class="page-head"><h1>指板与五度圈</h1>
        <p class="lead">任选根音、音阶或和弦，看它铺在整个指板或某一个 CAGED 把位上的样子；开启“叠显目标和弦”一眼看穿音阶盒子里的和弦靶心音；点选“实战把位指型库”直接看密排三和弦、壳和弦与 Drop 2 四部和弦按法。</p></div>
      <div id="fb-root">${inner()}</div>
      <h2>怎么用这一页</h2>
      <ul class="plain">
        <li>学 G1、G3：只开“大调”或“小调五声”，观察八度和相邻弦音程形状，尤其是跨过 3、2 弦时错开的那一品</li>
        <li>学 G5、G6：用「实战和弦把位指型库」依次点听 4-3-2 / 3-2-1 密排三和弦转位、6/5 弦壳和弦与 Drop 2 七和弦</li>
        <li>学 G10、G11、G13：在五声或大调音阶上开启「叠显目标和弦」，看清换和弦时哪颗 3 音/7 音在盒子里、哪颗需要跨出盒子半音点亮</li>
        <li>学 G12：开启“持续音伴奏”，切到级数模式并对比多利亚、混合利底亚、利底亚、弗里几亚的红色特征音</li>
      </ul>
      <h2>配套的日练</h2>
      <ul class="plain">${drills.map((d) => `<li>${window.PageKit.drillLink(d)} <span class="small muted">${esc(d.hint)}</span></li>`).join("")}</ul>
    </section>`;
  }

  function refresh() {
    const box = document.getElementById("fb-root");
    if (box) box.innerHTML = inner();
    tick();
  }

  // 计时：只在找音时更新显示
  let timer = null;
  function tick() {
    clearInterval(timer);
    if (!UI.drill) return;
    timer = setInterval(() => {
      const el = document.getElementById("fb-time");
      if (!el || !UI.drill) { clearInterval(timer); return; }
      el.textContent = ((performance.now() - UI.drill.t0) / 1000).toFixed(1);
    }, 100);
  }

  function startDrill() {
    const pool = UI.acc ? ALL : NATURAL;
    let note = pool[Math.floor(Math.random() * pool.length)];
    if (UI.drill && pool.length > 1) while (note === UI.drill.note) note = pool[Math.floor(Math.random() * pool.length)];
    UI.drill = { note, found: [[], [], [], [], [], []], miss: 0, t0: performance.now() };
    UI.flash = null;
  }

  let lastMicHit = 0;
  function onMicPitch(info) {
    if (!info) return;
    UI.micLast = `${info.full} (${info.cents >= 0 ? "+" : ""}${info.cents}c)`;
    const d = UI.drill;
    if (!d) return;
    const now = performance.now();
    if (now - lastMicHit < 380) return;
    const Mu = M();
    const targetPc = Mu.parseName(d.note).pc;
    if (info.pc === targetPc && Math.abs(info.cents) <= 25) {
      // 按从 6 弦(s=5)到 1 弦(s=0)找第一个尚未完成且 midi 落在 0..15 品的弦
      for (let s = 5; s >= 0; s--) {
        if (d.found[s] && d.found[s].length) continue;
        const f = info.midi - Mu.OPEN[s];
        if (f >= 0 && f <= FRETS) {
          lastMicHit = now;
          hitNote(s, f, true);
          refresh();
          break;
        }
      }
    }
  }

  function hitNote(s, f, fromMic) {
    const Mu = M();
    const midi = Mu.OPEN[s] + f;
    if (!fromMic) Mu.play(midi);
    const d = UI.drill;
    if (!d) return;
    if (midi % 12 === Mu.parseName(d.note).pc) {
      if (!d.found[s].includes(f)) d.found[s].push(f);
      UI.flash = null;
      if (d.found.every((x) => x.length)) {
        const ms = Math.round(performance.now() - d.t0);
        const F = C.state.fret;
        F.history.push({ d: C.todayStr, n: d.note, ms, miss: d.miss });
        if (F.history.length > 60) F.history = F.history.slice(-60);
        const best = !F.best || ms < F.best;
        if (best) F.best = ms;
        C.save();
        const cnt = document.querySelector('#nav a[href="#/fretboard"] .count');
        if (cnt) cnt.textContent = (F.best / 1000).toFixed(1) + "s";
        UI.drill = null;
        C.toast(`${d.note}：${(ms / 1000).toFixed(1)} 秒${best ? "，新纪录" : ""}${d.miss ? `，点错 ${d.miss} 次` : ""}`);
        setTimeout(() => Mu.strum([40, 45, 50, 55, 59, 64].map((m) => m + ((Mu.parseName(d.note).pc - (m % 12) + 12) % 12)), 0.06), 120);
      }
    } else {
      d.miss++;
      UI.flash = [s, f];
    }
  }

  function playCurrent() {
    const Mu = M();
    const B = Mu.build(UI.root, UI.type);
    const base = 40 + ((B.rootPc - 4 + 12) % 12);
    const semis = B.t.ivs.map((lab) => Mu.parseDeg(lab).semis);
    if (B.t.g === "和弦") {
      const notes = Mu.chordMidis(B.rootPc, UI.type);
      Mu.strum(notes);
      notes.forEach((m, i) => Mu.play(m, 1.0 + i * 0.28, 0.9));
    } else {
      [...semis, 12].forEach((x, i) => Mu.play(base + x, i * 0.28, 0.9));
    }
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    if (!a.startsWith("fb-") || el.matches("input, select")) return;
    if (a === "fb-note") hitNote(Number(el.dataset.s), Number(el.dataset.f));
    else if (a === "fb-lab") UI.lab = el.dataset.v;
    else if (a === "fb-pos") { UI.pos = el.dataset.v; UI.vId = ""; UI.vPoints = null; }
    else if (a === "fb-ov") {
      UI.ov = el.dataset.v;
      UI.vId = ""; UI.vPoints = null;
      const ov = parseOverlay();
      if (ov) M().strum(M().chordMidis(ov.build.rootPc, ov.typeId), 0.035);
    }
    else if (a === "fb-ov-play") {
      const ov = parseOverlay();
      if (ov) M().strum(M().chordMidis(ov.build.rootPc, ov.typeId), 0.035);
      return;
    }
    else if (a === "fb-voicing") {
      const id = el.dataset.id;
      const defs = getVoicingDefs(UI.root, UI.type);
      const hit = defs.find((x) => x.id === id);
      if (hit) {
        UI.vId = id;
        UI.vPoints = hit.v.pts;
        M().strum(hit.v.midis, 0.045);
      }
    }
    else if (a === "fb-vclear") { UI.vId = ""; UI.vPoints = null; }
    else if (a === "fb-play") { playCurrent(); return; }
    else if (a === "fb-drone") {
      const Mu = M();
      const pc = Mu.parseName(UI.root).pc;
      if (Mu.isDrone() === pc) Mu.stopDrone();
      else Mu.startDrone(pc);
    }
    else if (a === "fb-cof") { UI.cofKey = el.dataset.k; UI.root = el.dataset.k; UI.type = "major"; UI.vId = ""; UI.vPoints = null; }
    else if (a === "fb-ch-play") {
      const Mu = M();
      const r = el.dataset.r, t = el.dataset.t;
      const pc = Mu.parseName(r).pc;
      Mu.strum(Mu.chordMidis(pc, t));
      if (Mu.TYPE[UI.type] && Mu.TYPE[UI.type].g === "音阶") {
        // 如果当前上方正在看音阶，点五度圈里的和弦自动叠显到当前音阶上！
        UI.ov = `${r}:${t}`;
      } else {
        if (Mu.ROOTS.includes(r)) UI.root = r;
        if (Mu.TYPE[t]) UI.type = t;
      }
      UI.vId = ""; UI.vPoints = null;
    }
    else if (a === "fb-drill") { M().ac(); startDrill(); }
    else if (a === "fb-drill-stop") { UI.drill = null; UI.flash = null; }
    else if (a === "fb-mic") {
      if (UI.micOn) {
        M().stopMic();
        UI.micOn = false; UI.micLast = "";
      } else {
        M().startMic(onMicPitch).then(() => {
          UI.micOn = true;
          refresh();
        }).catch((err) => {
          UI.micOn = false;
          C.toast("无法开启麦克风：" + (err && err.message ? err.message : "请检查权限"));
        });
        return;
      }
    }
    refresh();
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    const a = el.dataset.act;
    if (!a || !a.startsWith("fb-")) return;
    if (a === "fb-root") {
      UI.root = el.value;
      UI.ov = ""; UI.vId = ""; UI.vPoints = null;
      if (M().isDrone() !== null) M().startDrone(M().parseName(UI.root).pc);
    }
    else if (a === "fb-type") { UI.type = el.value; UI.vId = ""; UI.vPoints = null; }
    else if (a === "fb-tone") { UI.tone = el.value; M().setTone(el.value); }
    else if (a === "fb-acc") UI.acc = el.checked;
    refresh();
  });

  window.Pages.fretboard = (params) => { setTimeout(tick, 0); return pageFretboard(params); };
})();
