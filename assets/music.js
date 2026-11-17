// 乐理与发声：音名拼写、音阶与和弦表、标准调弦、吉他声部排列、Karplus–Strong 拨弦合成、持续音与节拍器
(function () {
  const LET = "CDEFGAB";
  const LPC = [0, 2, 4, 5, 7, 9, 11];
  const ACC = { "-2": "𝄫", "-1": "♭", "0": "", "1": "♯", "2": "𝄪" };

  // 音名 → 字母序号、变音、音级
  function parseName(n) {
    const li = LET.indexOf(n[0]);
    let acc = 0;
    for (const ch of n.slice(1)) acc += ch === "♯" ? 1 : ch === "♭" ? -1 : ch === "𝄪" ? 2 : ch === "𝄫" ? -2 : 0;
    return { li, acc, pc: (LPC[li] + acc + 120) % 12 };
  }
  // 级数标签（♭3、♯4、𝄫7、♯9）→ 字母偏移与半音数
  function parseDeg(label) {
    let acc = 0, i = 0;
    const chars = [...label];
    while (i < chars.length && /[♯♭𝄪𝄫]/u.test(chars[i])) {
      const ch = chars[i++];
      acc += ch === "♯" ? 1 : ch === "♭" ? -1 : ch === "𝄪" ? 2 : -2;
    }
    const d = Number(chars.slice(i).join(""));
    const step = (d - 1) % 7;
    return { step, semis: LPC[step] + 12 * Math.floor((d - 1) / 7) + acc };
  }
  // 按音程拼写：字母由度数决定，变音由半音数决定（F 大调的 B♭、E7♯9 的 F𝄪）
  function spell(root, label) {
    const r = parseName(root), g = parseDeg(label);
    const li = (r.li + g.step) % 7;
    const pc = (r.pc + g.semis) % 12;
    const diff = ((pc - LPC[li] + 18) % 12) - 6;
    return LET[li] + (ACC[String(diff)] ?? "?");
  }
  const SHARP = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  const FLAT = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
  const pcName = (pc) => (SHARP[pc] === FLAT[pc] ? SHARP[pc] : `${SHARP[pc]}/${FLAT[pc]}`);

  const ROOTS = ["C", "C♯", "D♭", "D", "D♯", "E♭", "E", "F", "F♯", "G♭", "G", "G♯", "A♭", "A", "A♯", "B♭", "B"];

  // ivs：级数；color：红色标出的音（音阶 = 特征音，和弦 = 3、7 音）
  const TYPES = [
    { id: "major", g: "音阶", name: "大调（伊奥尼亚）", ivs: ["1", "2", "3", "4", "5", "6", "7"], color: [], tip: "全 全 半 全 全 全 半。调号、顺阶和弦、调式都从它推出来。" },
    { id: "minor", g: "音阶", name: "自然小调（爱奥利亚）", ivs: ["1", "2", "♭3", "4", "5", "♭6", "♭7"], color: [], tip: "关系大调从第 6 级开始，同一组音、不同的家。" },
    { id: "harmonic", g: "音阶", name: "和声小调", ivs: ["1", "2", "♭3", "4", "5", "♭6", "7"], color: ["7"], tip: "把 ♭7 升成导音，v 变成大三和弦 V；♭6 到 7 是增二度。" },
    { id: "melodic", g: "音阶", name: "旋律小调（爵士用法）", ivs: ["1", "2", "♭3", "4", "5", "6", "7"], color: ["6", "7"], tip: "上下行都用升高的 6、7；古典用法下行还原成自然小调。" },
    { id: "majorPenta", g: "音阶", name: "大调五声", ivs: ["1", "2", "3", "5", "6"], color: [], tip: "大调去掉 4、7，没有半音。和关系小调五声是同一组音。" },
    { id: "minorPenta", g: "音阶", name: "小调五声", ivs: ["1", "♭3", "4", "5", "♭7"], color: [], tip: "自然小调去掉 2、♭6。摇滚和布鲁斯独奏的起点。" },
    { id: "blues", g: "音阶", name: "布鲁斯音阶", ivs: ["1", "♭3", "4", "♭5", "5", "♭7"], color: ["♭5"], tip: "小调五声加 ♭5（OMT 写作 ♯4），通常作为经过音，不长时间停留。" },
    { id: "majorBlues", g: "音阶", name: "大调布鲁斯音阶", ivs: ["1", "2", "♭3", "3", "5", "6"], color: ["♭3"], tip: "大调五声加 ♭3，♭3 常推弦或击弦到 3。" },
    { id: "dorian", g: "音阶", name: "多利亚", ivs: ["1", "2", "♭3", "4", "5", "6", "♭7"], color: ["6"], tip: "自然小调把 ♭6 升成 6。红色是特征音。" },
    { id: "phrygian", g: "音阶", name: "弗里几亚", ivs: ["1", "♭2", "♭3", "4", "5", "♭6", "♭7"], color: ["♭2"], tip: "自然小调把 2 降成 ♭2，金属和弗拉门戈常用。" },
    { id: "phrygianDominant", g: "音阶", name: "弗里几亚属音阶", ivs: ["1", "♭2", "3", "4", "5", "♭6", "♭7"], color: ["♭2", "3"], tip: "和声小调第 5 级调式：既有弗里几亚 ♭2，又有大三度 3，常用于金属和小调大 V。" },
    { id: "lydian", g: "音阶", name: "利底亚", ivs: ["1", "2", "3", "♯4", "5", "6", "7"], color: ["♯4"], tip: "大调把 4 升成 ♯4，明亮、悬浮。" },
    { id: "mixolydian", g: "音阶", name: "混合利底亚", ivs: ["1", "2", "3", "4", "5", "6", "♭7"], color: ["♭7"], tip: "大调把 7 降成 ♭7。摇滚里最常见的调式，主和弦是属七。" },
    { id: "locrian", g: "音阶", name: "洛克里亚", ivs: ["1", "♭2", "♭3", "4", "♭5", "♭6", "♭7"], color: ["♭2", "♭5"], tip: "主和弦是减三和弦，♭5 让主音站不稳，很少当家。" },
    { id: "lydianDominant", g: "音阶", name: "利底亚属音阶", ivs: ["1", "2", "3", "♯4", "5", "6", "♭7"], color: ["♯4", "♭7"], tip: "旋律小调第 4 级调式：既有属七（3 + ♭7），又有明亮的 ♯4，常用于三全音替代 ♭II7 与非解决属七（IV7、♭VII7）。" },
    { id: "altered", g: "音阶", name: "变化属音阶（Altered）", ivs: ["1", "♭2", "♯2", "3", "♭5", "♭6", "♭7"], color: ["♭2", "♯2", "♭5", "♭6"], tip: "旋律小调第 7 级（Super Locrian）：集齐全部变化张力音（♭9、♯9、♯11、♭13），爵士与融合吉他 V7alt 解决回 I 的终极武器。" },
    { id: "halfWholeDim", g: "音阶", name: "半全减音阶", ivs: ["1", "♭2", "♯2", "3", "♯4", "5", "6", "♭7"], color: ["♭2", "♯2", "♯4"], tip: "按“半–全–半–全”对称排列的 8 音音阶，在属七和弦（特别是 V7♭9）上每隔小三度（3 品）指型完全对称平移。" },
    { id: "wholeTone", g: "音阶", name: "全音阶", ivs: ["1", "2", "3", "♯4", "♯5", "♭7"], color: [], tip: "全部由全音构成，共 6 个音，对称无中心，常用来制造梦幻或悬浮过渡。" },
    { id: "maj", g: "和弦", name: "大三和弦", sym: "", ivs: ["1", "3", "5"], color: ["3"], tip: "大三度 + 小三度。" },
    { id: "min", g: "和弦", name: "小三和弦", sym: "m", ivs: ["1", "♭3", "5"], color: ["♭3"], tip: "小三度 + 大三度。" },
    { id: "dim", g: "和弦", name: "减三和弦", sym: "°", ivs: ["1", "♭3", "♭5"], color: ["♭3"], tip: "两个小三度。大调的 vii°，相当于 V7 去掉根音。" },
    { id: "aug", g: "和弦", name: "增三和弦", sym: "+", ivs: ["1", "3", "♯5"], color: ["3"], tip: "两个大三度，结构对称，只有 4 个不同的增三和弦。" },
    { id: "power", g: "和弦", name: "强力和弦", sym: "5", ivs: ["1", "5"], color: [], tip: "根音 + 五度，没有三音，不分大小；失真音色下最干净。" },
    { id: "sus2", g: "和弦", name: "挂二和弦", sym: "sus2", ivs: ["1", "2", "5"], color: [], tip: "用 2 代替三音。" },
    { id: "sus4", g: "和弦", name: "挂四和弦", sym: "sus4", ivs: ["1", "4", "5"], color: [], tip: "用 4 代替三音，通常会解决回大三和弦。" },
    { id: "6", g: "和弦", name: "大六和弦", sym: "6", ivs: ["1", "3", "5", "6"], color: ["3", "6"], tip: "大三和弦 + 大六度。C6 与 Am7 组成音完全相同（C E G A）。" },
    { id: "m6", g: "和弦", name: "小六和弦", sym: "m6", ivs: ["1", "♭3", "5", "6"], color: ["♭3", "6"], tip: "小三和弦 + 大六度（多利亚色彩），例如 Am6（A C E F♯）。" },
    { id: "add9", g: "和弦", name: "加九和弦", sym: "add9", ivs: ["1", "3", "5", "9"], color: ["3", "9"], tip: "三和弦直接加 9 度，没有七音；流行与指弹吉他最常用的开放色彩。" },
    { id: "maj7", g: "和弦", name: "大七和弦", sym: "maj7", ivs: ["1", "3", "5", "7"], color: ["3", "7"], tip: "大三和弦 + 大七度。大调的 I 和 IV。" },
    { id: "dom7", g: "和弦", name: "属七和弦", sym: "7", ivs: ["1", "3", "5", "♭7"], color: ["3", "♭7"], tip: "大三和弦 + 小七度；3 与 ♭7 构成三全音，想往下五度解决。" },
    { id: "m7", g: "和弦", name: "小七和弦", sym: "m7", ivs: ["1", "♭3", "5", "♭7"], color: ["♭3", "♭7"], tip: "大调的 ii、iii、vi。" },
    { id: "m7b5", g: "和弦", name: "半减七和弦", sym: "m7♭5", ivs: ["1", "♭3", "♭5", "♭7"], color: ["♭3", "♭7"], tip: "大调的 viiø7，小调 ii–V–i 里的 iiø7。" },
    { id: "dim7", g: "和弦", name: "减七和弦", sym: "dim7", ivs: ["1", "♭3", "♭5", "𝄫7"], color: ["♭3", "𝄫7"], tip: "三个小三度叠成，结构对称；𝄫7 和 6 同音。" },
    { id: "mMaj7", g: "和弦", name: "小大七和弦", sym: "m(maj7)", ivs: ["1", "♭3", "5", "7"], color: ["♭3", "7"], tip: "小三和弦 + 大七度（来自和声/旋律小调，侦探电影尾音感）。" },
    { id: "7sus4", g: "和弦", name: "属七挂四和弦", sym: "7sus4", ivs: ["1", "4", "5", "♭7"], color: ["4", "♭7"], tip: "用 4 代替 3 的属七，流行/灵魂乐里最常见的柔和属和弦。" },
    { id: "dom9", g: "和弦", name: "属九和弦", sym: "9", ivs: ["1", "3", "5", "♭7", "9"], color: ["3", "♭7"], tip: "属七叠大九度（Funk / Blues 灵魂和弦，如 Santana 的 D9）。" },
    { id: "m9", g: "和弦", name: "小九和弦", sym: "m9", ivs: ["1", "♭3", "5", "♭7", "9"], color: ["♭3", "♭7"], tip: "小七叠大九度，城市流行与新灵魂乐（Neo-Soul）最常用色彩。" },
    { id: "maj9", g: "和弦", name: "大九和弦", sym: "maj9", ivs: ["1", "3", "5", "7", "9"], color: ["3", "7"], tip: "大七叠大九度，温暖开阔。" },
    { id: "dom7b9", g: "和弦", name: "属七降九和弦", sym: "7♭9", ivs: ["1", "3", "5", "♭7", "♭9"], color: ["3", "♭7", "♭9"], tip: "属七叠小九度：去掉根音后恰好是一个减七和弦（每隔 3 品完全对称），小调 V7→i 最强烈的解决和弦。" },
    { id: "dom7s9", g: "和弦", name: "属七升九和弦", sym: "7♯9", ivs: ["1", "3", "5", "♭7", "♯9"], color: ["3", "♯9"], tip: "大三度和 ♯9 同时出现，♯9 听起来像小三度。俗称 Hendrix 和弦（Purple Haze）。" }
  ];
  const TYPE = Object.fromEntries(TYPES.map((t) => [t.id, t]));

  // 某个根音 + 类型：音级 → 级数、拼写、是否红色
  function build(root, typeId) {
    const t = TYPE[typeId], r = parseName(root);
    const map = {};
    t.ivs.forEach((lab) => {
      const pc = (r.pc + parseDeg(lab).semis) % 12;
      map[pc] = { lab, name: spell(root, lab), root: lab === "1", color: t.color.includes(lab) };
    });
    return { t, map, rootPc: r.pc, names: t.ivs.map((lab) => spell(root, lab)) };
  }
  const label = (root, typeId) => {
    const t = TYPE[typeId];
    return t.g === "和弦" ? root + t.sym + "（" + t.name + "）" : root + " " + t.name;
  };

  // 标准调弦，1 弦到 6 弦：E4 B3 G3 D3 A2 E2（MIDI 编号）
  const OPEN = [64, 59, 55, 50, 45, 40];
  const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  // 吉他常用声部排列（按半音偏移，使高音弦分布自然）
  const VOICING_OFFSETS = {
    maj: [0, 7, 12, 16, 19],
    min: [0, 7, 12, 15, 19],
    dim: [0, 6, 12, 15],
    aug: [0, 4, 8, 12, 16],
    power: [0, 7, 12],
    sus2: [0, 7, 12, 14, 19],
    sus4: [0, 7, 12, 17, 19],
    "6": [0, 7, 9, 16, 19],
    m6: [0, 7, 9, 15, 19],
    add9: [0, 7, 14, 16, 19],
    maj7: [0, 7, 11, 16, 19],
    dom7: [0, 7, 10, 16, 19],
    m7: [0, 7, 10, 15, 19],
    m7b5: [0, 6, 10, 15],
    dim7: [0, 6, 9, 15],
    mMaj7: [0, 7, 11, 15, 19],
    "7sus4": [0, 7, 10, 17, 19],
    dom9: [0, 4, 10, 14, 19],
    m9: [0, 3, 10, 14, 19],
    maj9: [0, 4, 11, 14, 19],
    dom7b9: [0, 4, 10, 13],
    dom7s9: [0, 4, 10, 15]
  };
  function chordMidis(rootPc, typeId) {
    const base = 40 + ((rootPc - 4 + 12) % 12);
    const offs = VOICING_OFFSETS[typeId];
    if (offs) return offs.map((x) => base + x);
    const t = TYPE[typeId];
    return t ? t.ivs.map((lab) => base + parseDeg(lab).semis) : [base];
  }

  // ── 发声 ──
  let ctx = null, bus = null, cleanG = null, driveG = null;
  let tone = "clean";
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      bus = ctx.createGain();
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3800;
      cleanG = ctx.createGain(); cleanG.gain.value = 1;
      bus.connect(lp).connect(cleanG).connect(ctx.destination);
      // 过载：放大后用 tanh 削波，再滤掉刺耳的高频
      const pre = ctx.createGain(); pre.gain.value = 9;
      const ws = ctx.createWaveShaper();
      const curve = new Float32Array(2048);
      for (let i = 0; i < curve.length; i++) { const x = (i / (curve.length - 1)) * 2 - 1; curve[i] = Math.tanh(x * 3); }
      ws.curve = curve; ws.oversample = "4x";
      const lp2 = ctx.createBiquadFilter(); lp2.type = "lowpass"; lp2.frequency.value = 3200;
      driveG = ctx.createGain(); driveG.gain.value = 0;
      bus.connect(pre).connect(ws).connect(lp2).connect(driveG).connect(ctx.destination);
      setTone(tone);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function setTone(t) {
    tone = t;
    if (!ctx) return;
    cleanG.gain.value = t === "drive" ? 0 : 1;
    driveG.gain.value = t === "drive" ? 0.16 : 0;
  }

  // Karplus–Strong：一段噪声在延迟线里反复平均，模拟拨弦后的衰减
  const cache = new Map();
  function pluckBuffer(midi) {
    if (cache.has(midi)) return cache.get(midi);
    const c = ac(), sr = c.sampleRate, f = freq(midi);
    const N = Math.max(2, Math.floor(sr / f - 0.5));
    const T60 = 2.6 - Math.min(1.4, (midi - 40) / 30);
    const g = Math.pow(0.001, 1 / (f * T60));
    const d = Math.min(0.99995, g / Math.cos((Math.PI * f) / sr));
    const len = Math.floor(sr * (T60 + 0.2));
    const buf = c.createBuffer(1, len, sr);
    const y = buf.getChannelData(0);
    let prev = 0;
    for (let i = 0; i < N; i++) { prev = 0.55 * prev + 0.45 * (Math.random() * 2 - 1); y[i] = prev; }
    for (let i = N; i < len; i++) y[i] = d * 0.5 * (y[i - N] + (i - N - 1 >= 0 ? y[i - N - 1] : 0));
    const fade = Math.floor(sr * 0.15);
    for (let i = 0; i < fade; i++) y[len - 1 - i] *= i / fade;
    const out = { buf, rate: f / (sr / (N + 0.5)) };
    cache.set(midi, out);
    return out;
  }
  function play(midi, delay = 0, vel = 1) {
    const c = ac();
    if (!c) return;
    const { buf, rate } = pluckBuffer(midi);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = c.createGain();
    g.gain.value = 0.32 * vel;
    src.connect(g).connect(bus);
    src.start(c.currentTime + 0.01 + delay);
  }
  const strum = (midis, gap = 0.035) => midis.forEach((m, i) => play(m, i * gap, 0.8));

  function playInterval(baseMidi, semis, mode = "up") {
    if (mode === "harm") { play(baseMidi, 0, 0.85); play(baseMidi + semis, 0.02, 0.85); }
    else if (mode === "down") { play(baseMidi + semis, 0, 0.9); play(baseMidi, 0.52, 0.9); }
    else { play(baseMidi, 0, 0.9); play(baseMidi + semis, 0.52, 0.9); }
  }

  // 播放 I–IV–V–I 调性定调进行，再弹出目标音（功能级数练耳）
  function playDegreeContext(rootPc, targetSemis) {
    const base = 48 + ((rootPc - 0 + 12) % 12); // C3 起一个八度内
    const I = [base, base + 4, base + 7];
    const IV = [base + 5, base + 9, base + 12];
    const V = [base + 7, base + 11, base + 14];
    I.forEach((m, i) => play(m, i * 0.025, 0.55));
    IV.forEach((m, i) => play(m, 0.45 + i * 0.025, 0.55));
    V.forEach((m, i) => play(m, 0.90 + i * 0.025, 0.55));
    I.forEach((m, i) => play(m, 1.35 + i * 0.025, 0.6));
    play(base + 12 + targetSemis, 2.05, 1.0);
  }

  // 持续音 Drone（根音 + 纯五度低频合成），用于调式和五声即兴练习
  let droneState = null;
  function stopDrone() {
    if (!droneState) return;
    const { oscs, master, c } = droneState;
    try {
      master.gain.setTargetAtTime(0.0001, c.currentTime, 0.08);
      setTimeout(() => oscs.forEach((o) => { try { o.stop(); o.disconnect(); } catch (_) {} }), 350);
    } catch (_) {}
    droneState = null;
  }
  function startDrone(rootPc) {
    stopDrone();
    const c = ac();
    if (!c) return;
    const base = 40 + ((rootPc - 4 + 12) % 12); // E2–D#3 范围
    const f1 = freq(base), f2 = freq(base + 7), f3 = freq(base + 12);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
    const master = c.createGain(); master.gain.value = 0.0001;
    lp.connect(master).connect(c.destination);
    master.gain.setTargetAtTime(0.14, c.currentTime, 0.15);
    const specs = [[f1, "sawtooth", 0.55], [f1 * 1.003, "triangle", 0.35], [f2, "triangle", 0.25], [f3, "sine", 0.25]];
    const oscs = specs.map(([f, type, lv]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = f; g.gain.value = lv;
      o.connect(g).connect(lp); o.start();
      return o;
    });
    droneState = { rootPc, oscs, master, c };
  }
  const isDrone = () => (droneState ? droneState.rootPc : null);

  // 节拍器清脆木鱼/脉冲声
  function click(kind = "beat") {
    const c = ac();
    if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "triangle";
    o.frequency.value = kind === "accent" ? 1320 : kind === "sub" ? 660 : 920;
    const amp = kind === "accent" ? 0.35 : kind === "sub" ? 0.14 : 0.24;
    g.gain.setValueAtTime(amp, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + 0.05);
  }

  // ── 麦克风实时音高检测（自相关 + 抛物线插值，用于真琴找音、调音与推弦音准检测）──
  let micState = null;
  function detectPitch(buf, sr) {
    let rms = 0;
    for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / buf.length);
    if (rms < 0.012) return null; // 低于环境噪声门限

    const minLag = Math.floor(sr / 1350); // ~1350 Hz 上限
    const maxLag = Math.min(Math.floor(sr / 70), Math.floor(buf.length / 2)); // ~70 Hz 下限（低于 6 弦 E2=82.4Hz）
    let bestLag = -1, bestCorr = 0;
    const corr = new Float32Array(maxLag + 2);

    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0, e1 = 0, e2 = 0;
      const n = buf.length - lag;
      for (let i = 0; i < n; i += 2) {
        const a = buf[i], b = buf[i + lag];
        sum += a * b; e1 += a * a; e2 += b * b;
      }
      const c = e1 && e2 ? sum / Math.sqrt(e1 * e2) : 0;
      corr[lag] = c;
    }
    // 找第一个超过阈值 0.82 的局部峰值（避免泛音倍频误判）
    for (let lag = minLag + 1; lag < maxLag; lag++) {
      if (corr[lag] > 0.80 && corr[lag] >= corr[lag - 1] && corr[lag] >= corr[lag + 1]) {
        bestLag = lag; bestCorr = corr[lag]; break;
      }
    }
    if (bestLag < 0) {
      for (let lag = minLag; lag <= maxLag; lag++) {
        if (corr[lag] > bestCorr) { bestCorr = corr[lag]; bestLag = lag; }
      }
    }
    if (bestLag < 0 || bestCorr < 0.68) return null;

    // 抛物线插值提高亚采样精度
    const y1 = corr[bestLag - 1] || corr[bestLag], y2 = corr[bestLag], y3 = corr[bestLag + 1] || corr[bestLag];
    const denom = y1 - 2 * y2 + y3;
    const shift = denom !== 0 ? (0.5 * (y1 - y3)) / denom : 0;
    const trueLag = bestLag + (Math.abs(shift) < 1 ? shift : 0);
    const hz = sr / trueLag;
    const midiFloat = 69 + 12 * Math.log2(hz / 440);
    const midi = Math.round(midiFloat);
    const cents = Math.round((midiFloat - midi) * 100);
    const pc = ((midi % 12) + 12) % 12;
    const oct = Math.floor(midi / 12) - 1;
    return { hz, midi, midiFloat, cents, pc, name: SHARP[pc], oct, full: SHARP[pc] + oct, rms, conf: bestCorr };
  }

  async function startMic(onPitch) {
    stopMic();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("当前浏览器环境不支持麦克风输入");
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    });
    const c = ac();
    const src = c.createMediaStreamSource(stream);
    const analyser = c.createAnalyser();
    analyser.fftSize = 4096;
    src.connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
    const timer = setInterval(() => {
      if (!micState) return;
      analyser.getFloatTimeDomainData(buf);
      const info = detectPitch(buf, c.sampleRate);
      if (onPitch) onPitch(info);
    }, 60);
    micState = { stream, src, analyser, timer };
    return true;
  }

  function stopMic() {
    if (!micState) return;
    clearInterval(micState.timer);
    try { micState.src.disconnect(); } catch (_) {}
    try { micState.stream.getTracks().forEach((t) => t.stop()); } catch (_) {}
    micState = null;
  }
  const isMic = () => !!micState;

  window.Music = {
    LET, ROOTS, TYPES, TYPE, OPEN, parseName, parseDeg, spell, pcName, SHARP, FLAT,
    build, label, freq, chordMidis, play, strum, playInterval, playDegreeContext,
    startDrone, stopDrone, isDrone, click, setTone, ac,
    detectPitch, startMic, stopMic, isMic
  };
})();
