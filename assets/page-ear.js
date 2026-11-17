// 页面：练耳与节奏（音程听辨、和弦性质听辨、功能级数听辨、和弦进行听辨、伴奏循环 Jam、随身节拍器）
(function () {
  const C = Core;
  const { esc } = C;
  const M = () => window.Music;

  const INTERVALS = [
    { s: 1, id: "m2", name: "小二度", song: "《大白鲨》主题" },
    { s: 2, id: "M2", name: "大二度", song: "《生日快乐》前两音" },
    { s: 3, id: "m3", name: "小三度", song: "《Seven Nation Army》E–G" },
    { s: 4, id: "M3", name: "大三度", song: "《圣者进行曲》开头" },
    { s: 5, id: "P4", name: "纯四度", song: "《婚礼进行曲》开头" },
    { s: 6, id: "TT", name: "三全音", song: "《Maria》（西区故事）" },
    { s: 7, id: "P5", name: "纯五度", song: "《小星星》1→5" },
    { s: 8, id: "m6", name: "小六度", song: "《Love Story》开头" },
    { s: 9, id: "M6", name: "大六度", song: "《My Bonnie》开头" },
    { s: 10, id: "m7", name: "小七度", song: "《Star Trek》主题开头" },
    { s: 11, id: "M7", name: "大七度", song: "《Take On Me》副歌跳跃" },
    { s: 12, id: "P8", name: "纯八度", song: "《Somewhere Over the Rainbow》" }
  ];
  const INT_POOLS = {
    g3: { name: "G3 预习（P4/P5/P8）", items: [5, 7, 12] },
    core5: { name: "基础 5 种（m3/M3/P4/P5/P8）", items: [3, 4, 5, 7, 12] },
    core8: { name: "常用 8 种（含大小二、三全音）", items: [1, 2, 3, 4, 5, 6, 7, 12] },
    all12: { name: "全部 12 音程", items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
  };

  const CHORD_POOLS = {
    triads4: { name: "四种三和弦（大/小/减/增）", items: ["maj", "min", "dim", "aug"] },
    triads6: { name: "三和弦 + 挂留（含 sus2/sus4）", items: ["maj", "min", "dim", "aug", "sus2", "sus4"] },
    sevenths: { name: "五种七和弦（maj7/7/m7/m7♭5/dim7）", items: ["maj7", "dom7", "m7", "m7b5", "dim7"] }
  };

  const DEG_LIST = [
    { d: "1", s: 0, hint: "主音：完全稳定，就是家" },
    { d: "2", s: 2, hint: "上主音：离开家一步，常想回 1 或去 3" },
    { d: "3", s: 4, hint: "中音：温暖的大调色彩，和声的锚点" },
    { d: "4", s: 5, hint: "下属音：半音悬在 3 上方，想往下落到 3" },
    { d: "5", s: 7, hint: "属音：宽阔稳定，仅次于主音" },
    { d: "6", s: 9, hint: "下中音：略带抒情/小调感，常去 5" },
    { d: "7", s: 11, hint: "导音：只差半音到 1，强烈想往上解决" }
  ];
  const DEG_POOLS = {
    triad: { name: "主和弦音（1 / 3 / 5）", items: ["1", "3", "5"] },
    penta: { name: "大调五声（1 / 2 / 3 / 5 / 6）", items: ["1", "2", "3", "5", "6"] },
    major7: { name: "全部 7 个自然音级（1～7）", items: ["1", "2", "3", "4", "5", "6", "7"] }
  };

  // ── 和弦进行听辨题库（对应 G7～G9, G12, G14, G15）──
  // steps: [[semisFromKey, chordType, romanLabel], ...]
  const PROG_LIST = [
    {
      id: "1451", name: "I – IV – V – I", tag: "经典正格",
      steps: [[0, "maj", "I"], [5, "maj", "IV"], [7, "maj", "V"], [0, "maj", "I"]],
      songs: "《Twist and Shout》《La Bamba》",
      tip: "最经典的 T–PD–D–T 闭环：第 2 个和弦上扬（IV），第 3 个最紧张（V），最后稳稳回家（I）。"
    },
    {
      id: "1564", name: "I – V – vi – IV", tag: "流行之王",
      steps: [[0, "maj", "I"], [7, "maj", "V"], [9, "min", "vi"], [5, "maj", "IV"]],
      songs: "《Let It Be》《No Woman No Cry》《With or Without You》",
      tip: "第 3 个和弦突然变暗（vi 阻碍进行），第 4 个和弦托住在明亮温暖的大三和弦 IV 上。"
    },
    {
      id: "1645", name: "I – vi – IV – V", tag: "50s 黄金循环",
      steps: [[0, "maj", "I"], [9, "min", "vi"], [5, "maj", "IV"], [7, "maj", "V"]],
      songs: "《Stand By Me》《Every Breath You Take》",
      tip: "从主和弦直接落向关系小调 vi，随后 IV → V 一级级往上推回起点。"
    },
    {
      id: "6415", name: "vi – IV – I – V", tag: "伤感史诗",
      steps: [[9, "min", "vi"], [5, "maj", "IV"], [0, "maj", "I"], [7, "maj", "V"]],
      songs: "《晴天》副歌、《Zombie》《Apologize》",
      tip: "和 I–V–vi–IV 完全同四个和弦，但以小和弦 vi 开头，立刻染上一层叙事与伤感。"
    },
    {
      id: "251", name: "ii7 – V7 – Imaj7 – Imaj7", tag: "爵士/R&B 核心",
      steps: [[2, "m7", "ii7"], [7, "dom7", "V7"], [0, "maj7", "Imaj7"], [0, "maj7", "Imaj7"]],
      songs: "《Autumn Leaves》《Sunday Morning》《Fly Me to the Moon》",
      tip: "根音走五度圈逆时针（2→5→1），小七的柔和过渡到属七的三全音紧张，再融化在大七和弦里。"
    },
    {
      id: "1b741", name: "I – ♭VII – IV – I", tag: "混合利底亚摇滚",
      steps: [[0, "maj", "I"], [10, "maj", "♭VII"], [5, "maj", "IV"], [0, "maj", "I"]],
      songs: "《Sweet Child O' Mine》《Hey Jude》尾声、《Sympathy for the Devil》",
      tip: "没有导音 V–I，第 2 个和弦是比主音低全音的大三和弦 ♭VII，充满摇滚硬朗感（连续两个变格关系）。"
    },
    {
      id: "andalusian", name: "i – ♭VII – ♭VI – V7", tag: "安达卢西亚下行",
      steps: [[0, "min", "i"], [10, "maj", "♭VII"], [8, "maj", "♭VI"], [7, "dom7", "V7"]],
      songs: "《Hit the Road Jack》《Smooth Criminal》《Sultans of Swing》",
      tip: "小调低音沿着自然小调台阶一路往下走（1 → ♭7 → ♭6），最后停在和声小调大 V7 上擦出强烈火花！"
    },
    {
      id: "minPop", name: "i – ♭VI – ♭III – ♭VII", tag: "现代小调四和弦",
      steps: [[0, "min", "i"], [8, "maj", "♭VI"], [3, "maj", "♭III"], [10, "maj", "♭VII"]],
      songs: "《Numb》《Someone Like You》过渡段",
      tip: "自然小调版本的 vi–IV–I–V，全程不出现导音大 V，充满恢弘电影感。"
    },
    {
      id: "dorianVamp", name: "i7 – IV7 – i7 – IV7", tag: "多利亚 Vamp",
      steps: [[0, "m7", "i7"], [5, "dom7", "IV7"], [0, "m7", "i7"], [5, "dom7", "IV7"]],
      songs: "《Oye Como Va》《Breathe》《Another Brick in the Wall Pt.2》",
      tip: "小调主和弦 i7 后面本该是小四级 iv7，这里却亮出大三度属七 IV7（含特征音 ♮6），瞬间变酷变暖！"
    },
    {
      id: "phrygVamp", name: "i – ♭II – i – ♭II", tag: "弗里几亚 Vamp",
      steps: [[0, "min", "i"], [1, "maj", "♭II"], [0, "min", "i"], [1, "maj", "♭II"]],
      songs: "《Wherever I May Roam》《White Rabbit》",
      tip: "根音只往上挪半音（1 ↔ ♭2）的大三和弦往返，黑暗、神秘、极具金属与弗拉门戈张力。"
    },
    {
      id: "1364", name: "I – III7 – vi – IV", tag: "副属 V/vi 点亮",
      steps: [[0, "maj", "I"], [4, "dom7", "III7(V/vi)"], [9, "min", "vi"], [5, "maj", "IV"]],
      songs: "《海阔天空》主歌、日系王道进行",
      tip: "把原本平淡的 iii 级换成大三度属七 III7（即 V/vi），产生强烈的半音牵引拉进 vi 级小和弦！"
    },
    {
      id: "creep", name: "I – III7 – IV – iv", tag: "副属 + 小四级",
      steps: [[0, "maj", "I"], [4, "dom7", "III7"], [5, "maj", "IV"], [5, "min", "iv"]],
      songs: "Radiohead《Creep》、David Bowie《Space Oddity》",
      tip: "前半段 III7 冲向高潮 IV，第 4 个和弦突然把大四级改小（IV → iv），半音下行催泪回主！"
    },
    {
      id: "14m41", name: "I – IV – iv – I", tag: "平行小调借用 iv",
      steps: [[0, "maj", "I"], [5, "maj", "IV"], [5, "min", "iv"], [0, "maj", "I"]],
      songs: "《Wake Me Up When September Ends》《In My Life》《Don't Look Back in Anger》",
      tip: "高音引导线走 5 → 6 → ♭6 → 5：大四级转小四级再回家，是流行摇滚最经典的催泪落幕手法。"
    },
    {
      id: "1625", name: "Imaj7 – VI7 – ii7 – V7", tag: "爵士 Turnaround",
      steps: [[0, "maj7", "Imaj7"], [9, "dom7", "VI7(V/ii)"], [2, "m7", "ii7"], [7, "dom7", "V7"]],
      songs: "《I Got Rhythm》《Blue Moon》",
      tip: "1–6–2–5 循环里把六级改成了属七 VI7（V/ii），连环五度解决推动力极强。"
    }
  ];
  const PROG_POOLS = {
    pop: { name: "大调流行核心（5 种，对应 G7/G8）", items: ["1451", "1564", "1645", "6415", "251"] },
    rockModal: { name: "摇滚调式与小调（5 种，对应 G9/G12）", items: ["1b741", "andalusian", "minPop", "dorianVamp", "phrygVamp"] },
    borrowed: { name: "调外副属与借用（4 种，对应 G14/G15）", items: ["1364", "creep", "14m41", "1625"] },
    all: { name: "全部 14 种经典进行综合盲测", items: PROG_LIST.map((x) => x.id) }
  };
  const PROG_KEYS = ["C", "G", "D", "A", "E", "F"];

  // ── 伴奏循环发生器（Jam / Backing Track Looper，对应 G10～G14）──
  const JAM_TRACKS = [
    {
      id: "blues12", name: "12 小节标准布鲁斯（I7–IV7–V7）", mod: "G11",
      scaleType: "minorPenta",
      desc: "第 1–4 小节 I7，第 5–6 小节 IV7，第 7–8 小节 I7，第 9–10 小节 V7–IV7，第 11–12 小节 I7–V7（Turnaround）。",
      bars: [
        [0, "dom7", "I7", "主和弦属七：可用小五声混大五声（♭3 推向 3）"],
        [0, "dom7", "I7", "继续在 I7 上呼吸留白，准备回答刚才的问句"],
        [0, "dom7", "I7", "第 3 小节：建立律动"],
        [0, "dom7", "I7", "第 4 小节结尾注意听！下一小节马上进 IV7（它的 ♭7 将降半音到 IV7 的 3 音）"],
        [5, "dom7", "IV7", "进入 IV7！立刻瞄准它的 3 音（当前调的第 6 级）点亮和弦换色！"],
        [5, "dom7", "IV7", "第 6 小节：准备从 IV7 的 3 音滑回 I7"],
        [0, "dom7", "I7", "回到 I7 家中，稳住根音或大三音"],
        [0, "dom7", "I7", "第 8 小节：酝酿高潮，下一小节进全曲最高潮 V7"],
        [7, "dom7", "V7", "进入 V7！瞄准 V7 的 3 音（导音 7）或 5 音（2 级）"],
        [5, "dom7", "IV7", "退回 IV7：把刚才的导音往下降全音到 IV7 的 3 音"],
        [0, "dom7", "I7", "第 11 小节落回根音 I7，可开始跑半音下行 Turnaround 线"],
        [7, "dom7", "V7", "第 12 小节 Turnaround V7！制造悬念拉回下一轮第 1 小节"]
      ]
    },
    {
      id: "minBlues12", name: "12 小节小调布鲁斯（i7–iv7–♭VI7–V7）", mod: "G11",
      scaleType: "blues",
      desc: "B.B. King《The Thrill Is Gone》同款进行：全程小调五声/布鲁斯音阶，第 9–10 小节走 ♭VI7 → V7 半音下行！",
      bars: [
        [0, "m7", "i7", "小调主和弦 i7：纯正小调五声 + ♭5 经过音，禁止弹大三度"],
        [0, "m7", "i7", "第 2 小节：慢推弦与长揉弦"],
        [0, "m7", "i7", "第 3 小节：2 小节问句"],
        [0, "m7", "i7", "第 4 小节：留白呼吸，准备进小四级 iv7"],
        [5, "m7", "iv7", "进入 iv7！瞄准第 4 级（iv7 根音）或 ♭6（iv7 的小三音）"],
        [5, "m7", "iv7", "第 6 小节：从 ♭6 滑回 5 音"],
        [0, "m7", "i7", "回到 i7 主和弦"],
        [0, "m7", "i7", "第 8 小节：准备迎接最惊艳的 ♭VI7 → V7"],
        [8, "dom7", "♭VI7", "第 9 小节 ♭VI7：情绪突然托起，瞄准 ♭6 或 1 音"],
        [7, "dom7", "V7", "第 10 小节大 V7！大胆点亮和声小调导音（♮7，即 V7 的大三音）！"],
        [0, "m7", "i7", "第 11 小节回到 i7 根音落地"],
        [7, "dom7", "V7", "第 12 小节 V7 半终止吊起，准备进下一轮 chorus"]
      ]
    },
    {
      id: "dorianVamp", name: "多利亚两和弦 Vamp（i7 – IV7）", mod: "G12",
      scaleType: "dorian",
      desc: "Santana《Oye Como Va》/ Pink Floyd《Breathe》同款：小调五声 + 1 个特征音 ♮6（IV7 的大三音）！",
      bars: [
        [0, "m7", "i7", "主和弦 i7：确立小三度（♭3）与根音（1）的小调底色"],
        [5, "dom7", "IV7", "进入大四级 IV7！必落特征音 ♮6（IV7 的 3 音），听多利亚特有的暖亮感！"],
        [0, "m7", "i7", "回到 i7：用 1 – ♭3 – 5 – ♭7 收句"],
        [5, "dom7", "IV7", "再次进入 IV7：用小调五声 + ♮6 推弦或滑音点题"]
      ]
    },
    {
      id: "mixoVamp", name: "混合利底亚摇滚 Vamp（I – ♭VII）", mod: "G12",
      scaleType: "mixolydian",
      desc: "经典摇滚双和弦循环：大调五声 + 特征音 ♭7，既有大三度的阳光又有降七级的叛逆感。",
      bars: [
        [0, "maj", "I", "主和弦 I：强调大三度（3）与根音（1）"],
        [10, "maj", "♭VII", "进入 ♭VII！瞄准特征音 ♭7（♭VII 的根音）或第 4 级（♭VII 的五音）"],
        [0, "maj", "I", "回到主和弦 I：可试大/小三度微推弦混用"],
        [10, "maj", "♭VII", "♭VII 小节：用 ♭7 → 6 → 5 → 3 走顺滑摇滚下行线"]
      ]
    },
    {
      id: "lydianVamp", name: "利底亚漂浮 Vamp（I – II）", mod: "G12",
      scaleType: "lydian",
      desc: "Joe Satriani / 电影配乐同款：主和弦 I 与升高半音的大二级 II 往返，核心特征音是 ♯4！",
      bars: [
        [0, "maj7", "Imaj7", "主和弦 Imaj7：开阔温暖，可停在大七度 7 或大三度 3"],
        [2, "maj", "II", "进入大二级 II！它的三音正是利底亚灵魂特征音 ♯4，停在上面感受失重漂浮感！"],
        [0, "maj7", "Imaj7", "回到 Imaj7：让 ♯4 顺滑解决到 5 音或 3 音"],
        [2, "maj", "II", "II 和弦：大胆在 ♯4 与 7 音之间跳跃"]
      ]
    },
    {
      id: "phrygianVamp", name: "弗里几亚金属/西班牙 Vamp（i – ♭II）", mod: "G12",
      scaleType: "phrygian",
      desc: "小主和弦 i 与贴着鼻尖的降二级大三和弦 ♭II 半音摩擦，特征音是 ♭2（若把 i 换成大三 I 即变弗里几亚属）！",
      bars: [
        [0, "min", "i", "主和弦 i：稳住根音 1 与小三度 ♭3"],
        [1, "maj", "♭II", "进入降二级 ♭II！紧贴根音上方的特征音 ♭2 极具异域与金属压迫感"],
        [0, "min", "i", "把刚才的 ♭2 下行半音解决回 1 音，释放张力"],
        [1, "maj", "♭II", "再次进入 ♭II：可试弗里几亚属色彩（从 ♭2 跨向大 3 音）"]
      ]
    },
    {
      id: "jazz251", name: "爵士与和弦音靶场（ii7 – V7 – Imaj7 – VI7）", mod: "G13",
      scaleType: "major",
      desc: "G13 引导线（Guide Tones）黄金训练场：用 3 音和 7 音的半音连接串起四个和弦！",
      bars: [
        [2, "m7", "ii7", "ii7：找准它的 ♭3（大调第 4 级）与 ♭7（大调第 1 级）"],
        [7, "dom7", "V7", "V7：把刚才 ii7 的 ♭7 往下挪半音，就踩中了 V7 的 3 音（导音 7）！"],
        [0, "maj7", "Imaj7", "Imaj7：导音 7 上行半音到 1，或让 V7 的 ♭7（4 级）下行半音解决到 Imaj7 的 3 音！"],
        [9, "dom7", "VI7(V/ii)", "VI7（副属 V/ii）：点亮升高的 ♯1（VI7 的大三音），把耳朵推回下一轮 ii7！"]
      ]
    },
    {
      id: "pop1564", name: "流行四和弦靶场（I – V – vi – IV）", mod: "G8",
      scaleType: "majorPenta",
      desc: "在大调五声底盘上，每换一个和弦就把乐句尾音稳稳落在该和弦的 3 音上！",
      bars: [
        [0, "maj", "I", "I 级：落在大调第 3 级或第 1 级"],
        [7, "maj", "V", "V 级：瞄准第 7 级（V 的 3 音）或第 2 级（V 的 5 音）"],
        [9, "min", "vi", "vi 级：回到第 1 级（恰好是 vi 的小三音！）或第 6 级"],
        [5, "maj", "IV", "IV 级：落在第 6 级（IV 的 3 音）或第 4 级（IV 的根音）"]
      ]
    }
  ];

  const UI = {
    tab: "int",
    intPool: "core5", intDir: "up", intQ: null, intAns: null,
    chPool: "triads4", chStyle: "strum", chQ: null, chAns: null,
    degPool: "triad", degQ: null, degAns: null,
    progPool: "pop", progQ: null, progAns: null,
    jamId: "blues12", jamKey: "A", jamBpm: 84, jamRunning: false, jamBar: 0, jamBeat: -1,
    tunerOn: false, tunerErr: "", bendBase: 62, bendTarget: 200,
    bpm: 80, meter: "4/4", sub: "1", running: false, beat: -1, bar: 1, taps: []
  };

  function earStats() {
    const E = C.state.ear || (C.state.ear = { intOk: 0, intTot: 0, chOk: 0, chTot: 0, degOk: 0, degTot: 0, progOk: 0, progTot: 0, history: [] });
    if (E.progOk === undefined) { E.progOk = 0; E.progTot = 0; }
    return E;
  }

  function nextInt() {
    const pool = INT_POOLS[UI.intPool].items;
    const semis = pool[Math.floor(Math.random() * pool.length)];
    const baseMidi = 45 + Math.floor(Math.random() * 14); // A2–B3
    UI.intQ = { baseMidi, semis };
    UI.intAns = null;
    M().playInterval(baseMidi, semis, UI.intDir);
  }

  function nextChord() {
    const pool = CHORD_POOLS[UI.chPool].items;
    const typeId = pool[Math.floor(Math.random() * pool.length)];
    const rootPc = Math.floor(Math.random() * 12);
    UI.chQ = { rootPc, typeId };
    UI.chAns = null;
    playChordQ();
  }
  function playChordQ() {
    if (!UI.chQ) return;
    const notes = M().chordMidis(UI.chQ.rootPc, UI.chQ.typeId);
    if (UI.chStyle === "arp") notes.forEach((m, i) => M().play(m, i * 0.24, 0.9));
    else M().strum(notes, 0.04);
  }

  function nextDeg() {
    const pool = DEG_POOLS[UI.degPool].items;
    const deg = pool[Math.floor(Math.random() * pool.length)];
    const rootPc = Math.floor(Math.random() * 12);
    const item = DEG_LIST.find((x) => x.d === deg);
    UI.degQ = { rootPc, deg, semis: item.s, hint: item.hint };
    UI.degAns = null;
    M().playDegreeContext(rootPc, item.s);
  }

  // ── 和弦进行出题与播放 ──
  function nextProg() {
    const ids = PROG_POOLS[UI.progPool].items;
    const id = ids[Math.floor(Math.random() * ids.length)];
    const keyName = PROG_KEYS[Math.floor(Math.random() * PROG_KEYS.length)];
    const keyPc = M().parseName(keyName).pc;
    UI.progQ = { id, keyName, keyPc };
    UI.progAns = null;
    playProgQ();
  }
  function playProgChordAt(step, delaySec) {
    const Mu = M();
    const [semis, typeId] = step;
    const rootPc = (UI.progQ.keyPc + semis) % 12;
    const bassMidi = 36 + ((rootPc - 0 + 12) % 12);
    Mu.play(bassMidi, delaySec, 0.95);
    const midis = Mu.chordMidis(rootPc, typeId);
    midis.forEach((m, i) => Mu.play(m, delaySec + 0.03 + i * 0.028, 0.72));
  }
  function playProgQ(onlyIdx) {
    if (!UI.progQ) return;
    const item = PROG_LIST.find((x) => x.id === UI.progQ.id);
    if (!item) return;
    if (typeof onlyIdx === "number") {
      if (item.steps[onlyIdx]) playProgChordAt(item.steps[onlyIdx], 0);
      return;
    }
    item.steps.forEach((st, idx) => playProgChordAt(st, idx * 0.74));
  }

  // ── 节拍器引擎 & 伴奏循环 Jam 引擎 ──
  let metroTimer = null, nextTickTime = 0, stepIdx = 0, barCount = 1;
  let jamTimer = null, jamNextTime = 0, jamStep = 0;

  const METERS = {
    "4/4": { beats: 4, comp: false },
    "3/4": { beats: 3, comp: false },
    "6/8": { beats: 2, comp: true },
    "12/8": { beats: 4, comp: true }
  };
  const LADDER = ["1", "2", "3", "4"];

  function currentSub() {
    if (UI.sub === "ladder") return LADDER[(barCount - 1) % 16 >> 2];
    return UI.sub;
  }

  function scheduleBeat() {
    const c = M().ac();
    if (!c || !UI.running) return;
    const mInfo = METERS[UI.meter];
    const beatSec = 60 / UI.bpm;
    while (nextTickTime < c.currentTime + 0.12) {
      const sub = currentSub();
      const b = stepIdx % mInfo.beats;
      const isAcc = b === 0;
      const when = nextTickTime;
      setTimeout(() => {
        if (!UI.running) return;
        UI.beat = b; UI.bar = barCount;
        updateMetroUI();
      }, Math.max(0, (when - c.currentTime) * 1000));
      playAt(when, isAcc ? "accent" : "beat");
      if (mInfo.comp) {
        playAt(when + beatSec / 3, "sub");
        playAt(when + (2 * beatSec) / 3, "sub");
      } else if (sub === "2") {
        playAt(when + beatSec / 2, "sub");
      } else if (sub === "3") {
        playAt(when + beatSec / 3, "sub");
        playAt(when + (2 * beatSec) / 3, "sub");
      } else if (sub === "4") {
        playAt(when + beatSec / 4, "sub");
        playAt(when + beatSec / 2, "sub");
        playAt(when + (3 * beatSec) / 4, "sub");
      } else if (sub === "swing") {
        playAt(when + (2 * beatSec) / 3, "sub");
      }
      nextTickTime += beatSec;
      stepIdx++;
      if (stepIdx % mInfo.beats === 0) barCount++;
    }
  }
  function playAt(when, kind) {
    const c = M().ac();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "triangle";
    o.frequency.value = kind === "accent" ? 1320 : kind === "sub" ? 660 : 920;
    const amp = kind === "accent" ? 0.32 : kind === "sub" ? 0.12 : 0.20;
    g.gain.setValueAtTime(amp, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.045);
    o.connect(g).connect(c.destination);
    o.start(when); o.stop(when + 0.05);
  }
  function startMetro() {
    if (UI.jamRunning) stopJam();
    const c = M().ac();
    if (!c) return;
    UI.running = true; stepIdx = 0; barCount = 1; UI.beat = -1;
    nextTickTime = c.currentTime + 0.05;
    clearInterval(metroTimer);
    metroTimer = setInterval(scheduleBeat, 25);
  }
  function stopMetro() {
    UI.running = false; UI.beat = -1;
    clearInterval(metroTimer); metroTimer = null;
  }
  function updateMetroUI() {
    const box = document.getElementById("metro-dots");
    if (!box) return;
    const beats = METERS[UI.meter].beats;
    const subNames = { "1": "四分音符", "2": "八分音符", "3": "三连音", "4": "十六分音符", swing: "Swing (2:1)" };
    box.innerHTML = Array.from({ length: beats }, (_, i) => `<span class="m-dot ${i === 0 ? "acc" : ""} ${i === UI.beat ? "now" : ""}">${i + 1}</span>`).join("") +
      `<span class="small muted" style="margin-left:10px">第 ${UI.bar} 小节${UI.sub === "ladder" ? ` · 当前：${subNames[currentSub()]}` : ""}</span>`;
  }

  // ── 伴奏循环 Jam 调度 ──
  function scheduleJam() {
    const Mu = M();
    const c = Mu.ac();
    if (!c || !UI.jamRunning) return;
    const tr = JAM_TRACKS.find((x) => x.id === UI.jamId) || JAM_TRACKS[0];
    const keyPc = Mu.parseName(UI.jamKey).pc;
    const beatSec = 60 / UI.jamBpm;
    while (jamNextTime < c.currentTime + 0.14) {
      const b = jamStep % 4;
      const barIdx = Math.floor(jamStep / 4) % tr.bars.length;
      const barInfo = tr.bars[barIdx];
      const rootPc = (keyPc + barInfo[0]) % 12;
      const typeId = barInfo[1];
      const when = jamNextTime;
      const delay = Math.max(0, when - c.currentTime);

      playAt(when, b === 0 ? "accent" : "beat");
      if (tr.id.includes("blues") || tr.id === "dorianVamp") {
        // 轻微 Swing 脉冲提示
        playAt(when + (2 * beatSec) / 3, "sub");
      }
      const bassRoot = 36 + ((rootPc + 12) % 12);
      const midis = Mu.chordMidis(rootPc, typeId);
      if (b === 0) {
        Mu.play(bassRoot, delay, 0.95);
        midis.forEach((m, i) => Mu.play(m, delay + 0.02 + i * 0.028, 0.68));
      } else if (b === 2) {
        Mu.play(bassRoot + 7, delay, 0.72);
        midis.slice(1).forEach((m, i) => Mu.play(m, delay + 0.02 + i * 0.025, 0.48));
      }

      setTimeout(() => {
        if (!UI.jamRunning) return;
        UI.jamBar = barIdx;
        UI.jamBeat = b;
        updateJamUI();
      }, delay * 1000);

      jamNextTime += beatSec;
      jamStep++;
    }
  }
  function startJam() {
    if (UI.running) stopMetro();
    const c = M().ac();
    if (!c) return;
    UI.jamRunning = true; jamStep = 0; UI.jamBar = 0; UI.jamBeat = 0;
    jamNextTime = c.currentTime + 0.05;
    clearInterval(jamTimer);
    jamTimer = setInterval(scheduleJam, 25);
  }
  function stopJam() {
    UI.jamRunning = false; UI.jamBeat = -1;
    clearInterval(jamTimer); jamTimer = null;
  }
  function jamBarDetailHtml(tr, barIdx) {
    const Mu = M();
    const keyPc = Mu.parseName(UI.jamKey).pc;
    const [semis, typeId, rn, tip] = tr.bars[barIdx] || tr.bars[0];
    const chRoot = Mu.SHARP[(keyPc + semis) % 12];
    const chBuild = Mu.build(chRoot, typeId);
    const tones = chBuild.t.ivs.map((iv, i) => `<b>${esc(chBuild.names[i])}</b><small class="muted">(${esc(iv)})</small>`).join(" · ");
    const fbHref = `#/fretboard?root=${encodeURIComponent(UI.jamKey)}&type=${tr.scaleType}&ov=${encodeURIComponent(chRoot + ":" + typeId)}`;
    return `<p style="margin:0"><b>当前第 ${barIdx + 1} / ${tr.bars.length} 小节：${esc(chRoot + (chBuild.t.sym || ""))}（${esc(rn)}）</b>　拍点：<b>${UI.jamBeat >= 0 ? UI.jamBeat + 1 : 1} / 4</b></p>
      <p class="small" style="margin:4px 0">当小节和弦音（靶心音）：${tones}　<a href="${fbHref}">在指板上叠显此和弦 ↗</a></p>
      <p class="small muted" style="margin:0">即兴提示：${esc(tip)}</p>`;
  }
  function updateJamUI() {
    const tr = JAM_TRACKS.find((x) => x.id === UI.jamId) || JAM_TRACKS[0];
    const grid = document.getElementById("jam-grid");
    if (grid) {
      grid.querySelectorAll("[data-jbar]").forEach((el) => {
        el.classList.toggle("is-now", Number(el.dataset.jbar) === UI.jamBar);
      });
    }
    const info = document.getElementById("jam-live");
    if (info) info.innerHTML = jamBarDetailHtml(tr, UI.jamBar);
  }

  // ── 页面渲染 ──
  function renderInt() {
    const E = earStats();
    const pool = INT_POOLS[UI.intPool].items;
    const opts = Object.entries(INT_POOLS).map(([k, v]) => `<option value="${k}" ${UI.intPool === k ? "selected" : ""}>${esc(v.name)}</option>`).join("");
    const dirs = [["up", "上行"], ["down", "下行"], ["harm", "同时（和声）"]].map(([k, v]) => `<button class="btn ${UI.intDir === k ? "on" : ""}" data-act="ear-idir" data-v="${k}">${v}</button>`).join("");
    const btns = pool.map((s) => {
      const it = INTERVALS.find((x) => x.s === s);
      let cls = "";
      if (UI.intAns) {
        if (s === UI.intQ.semis) cls = "on ok";
        else if (s === UI.intAns.pick) cls = "on bad";
      }
      return `<button class="btn ${cls}" data-act="ear-ians" data-s="${s}" ${!UI.intQ || UI.intAns ? "disabled" : ""}>${esc(it.name)} <small class="muted">${it.id}</small></button>`;
    }).join("");
    let feedback = "";
    if (UI.intAns && UI.intQ) {
      const it = INTERVALS.find((x) => x.s === UI.intQ.semis);
      const ok = UI.intAns.pick === UI.intQ.semis;
      feedback = `<p class="ear-fb ${ok ? "ok" : "bad"}"><b>${ok ? "答对了！" : "再听一次："}</b>这是 <b>${esc(it.name)}（${it.id}，${it.s} 个半音）</b>。参考曲：${esc(it.song)}。</p>`;
    }
    const pct = E.intTot ? Math.round((E.intOk / E.intTot) * 100) : 0;
    return `<div class="block"><h3>音程听辨（对应 G3）</h3>
      <p class="small muted">先用“G3 预习”或“基础 5 种”，正确率稳定在 80% 以上再扩大范围。用你熟悉的参考曲开头去套这个声音。</p>
      <div class="filters"><span class="grp"><span>范围</span><select data-act="ear-ipool">${opts}</select></span><span class="grp"><span>方向</span>${dirs}</span></div>
      <div class="btn-row">
        <button class="btn primary" data-act="ear-inext">${UI.intQ && !UI.intAns ? "换一题" : "播放新音程"}</button>
        ${UI.intQ ? `<button class="btn" data-act="ear-ireplay">再听一遍</button>` : ""}
      </div>
      <div class="ear-choices">${btns}</div>
      ${feedback}
      <p class="small muted">累计成绩：${E.intOk} / ${E.intTot}${E.intTot ? `（${pct}%）` : ""}</p>
    </div>`;
  }

  function renderChord() {
    const E = earStats();
    const pool = CHORD_POOLS[UI.chPool].items;
    const opts = Object.entries(CHORD_POOLS).map(([k, v]) => `<option value="${k}" ${UI.chPool === k ? "selected" : ""}>${esc(v.name)}</option>`).join("");
    const styles = [["strum", "扫弦"], ["arp", "分解琶音"]].map(([k, v]) => `<button class="btn ${UI.chStyle === k ? "on" : ""}" data-act="ear-cstyle" data-v="${k}">${v}</button>`).join("");
    const btns = pool.map((id) => {
      const t = M().TYPE[id];
      let cls = "";
      if (UI.chAns) {
        if (id === UI.chQ.typeId) cls = "on ok";
        else if (id === UI.chAns.pick) cls = "on bad";
      }
      return `<button class="btn ${cls}" data-act="ear-cans" data-id="${id}" ${!UI.chQ || UI.chAns ? "disabled" : ""}>${esc(t.name)} <small class="muted">${esc(t.sym || "大三")}</small></button>`;
    }).join("");
    let feedback = "";
    if (UI.chAns && UI.chQ) {
      const t = M().TYPE[UI.chQ.typeId];
      const ok = UI.chAns.pick === UI.chQ.typeId;
      const rName = M().SHARP[UI.chQ.rootPc];
      feedback = `<p class="ear-fb ${ok ? "ok" : "bad"}"><b>${ok ? "答对了！" : "注意听 3 音和 7 音："}</b>这是 <b>${esc(rName + (t.sym || ""))}（${esc(t.name)}）</b>，结构 ${t.ivs.join(" ")}。<a href="#/fretboard?root=${encodeURIComponent(rName)}&type=${t.id}">在指板查看 ↗</a></p>`;
    }
    const pct = E.chTot ? Math.round((E.chOk / E.chTot) * 100) : 0;
    return `<div class="block"><h3>和弦性质听辨（对应 G5、G6）</h3>
      <p class="small muted">先扫弦听整体明暗，答不出再切“分解琶音”去抓里面的三音和七音。</p>
      <div class="filters"><span class="grp"><span>和弦组</span><select data-act="ear-cpool">${opts}</select></span><span class="grp"><span>弹法</span>${styles}</span></div>
      <div class="btn-row">
        <button class="btn primary" data-act="ear-cnext">${UI.chQ && !UI.chAns ? "换一题" : "播放新和弦"}</button>
        ${UI.chQ ? `<button class="btn" data-act="ear-creplay">再听一遍</button>` : ""}
      </div>
      <div class="ear-choices">${btns}</div>
      ${feedback}
      <p class="small muted">累计成绩：${E.chOk} / ${E.chTot}${E.chTot ? `（${pct}%）` : ""}</p>
    </div>`;
  }

  function renderDeg() {
    const E = earStats();
    const pool = DEG_POOLS[UI.degPool].items;
    const opts = Object.entries(DEG_POOLS).map(([k, v]) => `<option value="${k}" ${UI.degPool === k ? "selected" : ""}>${esc(v.name)}</option>`).join("");
    const btns = pool.map((d) => {
      let cls = "";
      if (UI.degAns) {
        if (d === UI.degQ.deg) cls = "on ok";
        else if (d === UI.degAns.pick) cls = "on bad";
      }
      return `<button class="btn ${cls}" data-act="ear-dans" data-d="${d}" ${!UI.degQ || UI.degAns ? "disabled" : ""}>第 ${d} 级</button>`;
    }).join("");
    let feedback = "";
    if (UI.degAns && UI.degQ) {
      const ok = UI.degAns.pick === UI.degQ.deg;
      const rName = M().SHARP[UI.degQ.rootPc];
      feedback = `<p class="ear-fb ${ok ? "ok" : "bad"}"><b>${ok ? "听准了！" : "感受它的倾向："}</b>在 ${esc(rName)} 大调里这是 <b>第 ${UI.degQ.deg} 级</b>（${esc(UI.degQ.hint)}）。</p>`;
    }
    const pct = E.degTot ? Math.round((E.degOk / E.degTot) * 100) : 0;
    return `<div class="block"><h3>功能级数听辨（浏览器版 Functional Ear Trainer，对应 G7、G8）</h3>
      <p class="small muted">每次先弹一遍 <code>I–IV–V–I</code> 建立调性中心（家），再弹出一个目标音。不要数半音，去听这个音“稳不稳、想往哪里走”。</p>
      <div class="filters"><span class="grp"><span>音级范围</span><select data-act="ear-dpool">${opts}</select></span></div>
      <div class="btn-row">
        <button class="btn primary" data-act="ear-dnext">${UI.degQ && !UI.degAns ? "换一题" : "定调并出题"}</button>
        ${UI.degQ ? `<button class="btn" data-act="ear-dreplay">再听一遍</button>` : ""}
      </div>
      <div class="ear-choices">${btns}</div>
      ${feedback}
      <p class="small muted">累计成绩：${E.degOk} / ${E.degTot}${E.degTot ? `（${pct}%）` : ""}</p>
    </div>`;
  }

  function renderProg() {
    const Mu = M();
    const E = earStats();
    const ids = PROG_POOLS[UI.progPool].items;
    const opts = Object.entries(PROG_POOLS).map(([k, v]) => `<option value="${k}" ${UI.progPool === k ? "selected" : ""}>${esc(v.name)}</option>`).join("");
    const btns = ids.map((id) => {
      const it = PROG_LIST.find((x) => x.id === id);
      let cls = "";
      if (UI.progAns) {
        if (id === UI.progQ.id) cls = "on ok";
        else if (id === UI.progAns.pick) cls = "on bad";
      }
      return `<button class="btn ${cls}" data-act="ear-pans" data-id="${id}" ${!UI.progQ || UI.progAns ? "disabled" : ""}><b>${esc(it.name)}</b> <small class="muted">${esc(it.tag)}</small></button>`;
    }).join("");
    let feedback = "";
    if (UI.progAns && UI.progQ) {
      const it = PROG_LIST.find((x) => x.id === UI.progQ.id);
      const ok = UI.progAns.pick === UI.progQ.id;
      const chordNames = it.steps.map(([s, t, rn], idx) => {
        const rName = Mu.SHARP[(UI.progQ.keyPc + s) % 12];
        const sym = Mu.TYPE[t] ? Mu.TYPE[t].sym : "";
        return `<button class="btn" data-act="ear-pstep" data-i="${idx}" title="单独重听第 ${idx + 1} 个和弦">▶ ${idx + 1}. <b>${esc(rName + sym)}</b> <small class="muted">(${esc(rn)})</small></button>`;
      }).join(" ");
      feedback = `<div class="ear-fb ${ok ? "ok" : "bad"}">
        <p style="margin:0 0 6px"><b>${ok ? "耳朵很准！" : "拆开听每个和弦："}</b>刚才在 <b>${esc(UI.progQ.keyName)} 调</b> 播放的是 <b>${esc(it.name)}（${esc(it.tag)}）</b>。</p>
        <div class="btn-row" style="margin:6px 0">${chordNames}</div>
        <p class="small" style="margin:4px 0 0"><b>听感特征：</b>${esc(it.tip)}<br><b>代表曲目：</b>${esc(it.songs)}</p>
      </div>`;
    }
    const pct = E.progTot ? Math.round((E.progOk / E.progTot) * 100) : 0;
    return `<div class="block"><h3>和弦进行听辨（对应 G7～G9、G12、G14、G15 扒歌核心）</h3>
      <p class="small muted">G15 扒歌的第一步就是听出 4 和弦循环的骨架。先听低音贝斯根音是往上走、往下走还是五度跳进，再听每个和弦是大三、小三还是属七。答完可逐个点选重听。</p>
      <div class="filters"><span class="grp"><span>进行题库</span><select data-act="ear-ppool">${opts}</select></span></div>
      <div class="btn-row">
        <button class="btn primary" data-act="ear-pnext">${UI.progQ && !UI.progAns ? "换一题" : "播放四和弦进行"}</button>
        ${UI.progQ ? `<button class="btn" data-act="ear-preplay">整段重听</button>` : ""}
      </div>
      <div class="ear-choices">${btns}</div>
      ${feedback}
      <p class="small muted">累计成绩：${E.progOk} / ${E.progTot}${E.progTot ? `（${pct}%）` : ""}</p>
    </div>`;
  }

  function renderJam() {
    const Mu = M();
    const tr = JAM_TRACKS.find((x) => x.id === UI.jamId) || JAM_TRACKS[0];
    const keyPc = Mu.parseName(UI.jamKey).pc;
    const trOpts = JAM_TRACKS.map((x) => `<option value="${x.id}" ${x.id === UI.jamId ? "selected" : ""}>[${x.mod}] ${esc(x.name)}</option>`).join("");
    const keyOpts = ["C", "G", "D", "A", "E", "F", "B♭", "E♭", "A♭", "F♯", "B", "C♯"].map((k) => `<option value="${k}" ${k === UI.jamKey ? "selected" : ""}>${k} 调</option>`).join("");
    const cards = tr.bars.map(([semis, typeId, rn], idx) => {
      const chRoot = Mu.SHARP[(keyPc + semis) % 12];
      const sym = Mu.TYPE[typeId] ? Mu.TYPE[typeId].sym : "";
      const now = idx === UI.jamBar;
      return `<button class="jam-card ${now ? "is-now" : ""}" data-act="ear-jbar" data-jbar="${idx}" title="点击试听并切到第 ${idx + 1} 小节">
        <span class="jam-barno">#${idx + 1}</span>
        <b>${esc(chRoot + sym)}</b>
        <small>${esc(rn)}</small>
      </button>`;
    }).join("");
    return `<div class="block"><h3>伴奏循环发生器（Backing Track &amp; Vamp Looper，对应 G10～G14 上琴即兴）</h3>
      <p class="small muted">不用离开页面找伴奏视频！任选调性与速度，直接拿起真琴跟着 12 小节布鲁斯、4 大调式 Vamp 或爵士 <code>ii–V–I</code> 循环练习目标音即兴。点任意小节卡片可单独试听该小节和弦。</p>
      <div class="filters">
        <span class="grp"><span>进行模板</span><select data-act="ear-jtrack">${trOpts}</select></span>
        <span class="grp"><span>主音调性</span><select data-act="ear-jkey">${keyOpts}</select></span>
        <span class="grp"><span>速度 <b id="jam-bpm-val">${UI.jamBpm}</b> BPM</span><input type="range" min="50" max="160" value="${UI.jamBpm}" data-act="ear-jbpm" aria-label="伴奏速度"></span>
      </div>
      <div class="btn-row">
        <button class="btn primary" data-act="ear-jtoggle">${UI.jamRunning ? "停止伴奏循环" : "▶ 开始伴奏循环"}</button>
        <a class="btn" href="#/fretboard?root=${encodeURIComponent(UI.jamKey)}&type=${tr.scaleType}">在指板打开 ${esc(UI.jamKey)} ${esc(Mu.TYPE[tr.scaleType].name)} ↗</a>
      </div>
      <p class="small muted" style="margin:6px 0 10px">${esc(tr.desc)}</p>
      <div class="jam-grid" id="jam-grid">${cards}</div>
      <div class="note-block" id="jam-live" style="margin-top:12px">${jamBarDetailHtml(tr, UI.jamBar)}</div>
    </div>`;
  }

  function renderMetro() {
    const meters = ["4/4", "3/4", "6/8", "12/8"].map((m) => `<button class="btn ${UI.meter === m ? "on" : ""}" data-act="ear-mmeter" data-v="${m}">${m}</button>`).join("");
    const subs = [["1", "四分"], ["2", "八分"], ["3", "三连音"], ["4", "十六分"], ["swing", "Swing"], ["ladder", "细分阶梯 (自动换)"]].map(([k, v]) => `<button class="btn ${UI.sub === k ? "on" : ""}" data-act="ear-msub" data-v="${k}">${v}</button>`).join("");
    const beats = METERS[UI.meter].beats;
    return `<div class="block"><h3>随身节拍器与细分阶梯（对应 G2 及日常练习）</h3>
      <p class="small muted">支持 4/4、3/4、6/8、12/8 与 Swing 摇摆。“细分阶梯”每 4 小节自动按 四分 → 八分 → 三连音 → 十六分 循环切换。</p>
      <div class="filters">
        <span class="grp"><span>速度 <b id="bpm-val">${UI.bpm}</b> BPM</span><input type="range" min="40" max="220" value="${UI.bpm}" data-act="ear-bpm" aria-label="BPM"></span>
        <button class="btn" data-act="ear-tap">Tap 测速</button>
      </div>
      <div class="filters" style="margin-top:6px"><span class="grp"><span>拍号</span>${meters}</span></div>
      <div class="filters" style="margin-top:6px"><span class="grp"><span>细分</span>${subs}</span></div>
      <div class="btn-row"><button class="btn primary" data-act="ear-mtoggle">${UI.running ? "停止节拍器" : "开始节拍器"}</button></div>
      <div class="metro-dots" id="metro-dots">${Array.from({ length: beats }, (_, i) => `<span class="m-dot ${i === 0 ? "acc" : ""} ${i === UI.beat ? "now" : ""}">${i + 1}</span>`).join("")}</div>
    </div>`;
  }

  function renderTuner() {
    const Mu = M();
    const strings = [
      [40, "6 弦 E2 (82.4Hz)"], [45, "5 弦 A2 (110Hz)"], [50, "4 弦 D3 (146.8Hz)"],
      [55, "3 弦 G3 (196Hz)"], [59, "2 弦 B3 (246.9Hz)"], [64, "1 弦 E4 (329.6Hz)"]
    ].map(([m, label]) => `<button class="btn" data-act="ear-tstr" data-m="${m}">▶ ${esc(label)}</button>`).join("");

    const bendBases = [
      [60, "3 弦 5 品 C4（A 调 ♭3 推弦起点）"],
      [62, "3 弦 7 品 D4（A 调 4 推向 5 音 E4）"],
      [67, "2 弦 8 品 G4（A 调 ♭7 推向根音 A4）"],
      [69, "2 弦 10 品 A4（高把位推弦起点）"],
      [64, "2 弦 5 品 E4（推向 F♯4 多利亚特征音）"]
    ].map(([m, label]) => `<option value="${m}" ${UI.bendBase === m ? "selected" : ""}>${esc(label)}</option>`).join("");

    const bendTargets = [
      [45, "1/4 蓝调微推弦 (+45 cents)"],
      [100, "半音推弦 (+100 cents / 1 品)"],
      [200, "全音推弦 (+200 cents / 2 品)"],
      [300, "小三度大推弦 (+300 cents / 3 品)"]
    ].map(([c, label]) => `<button class="btn ${UI.bendTarget === c ? "on" : ""}" data-act="ear-btarget" data-c="${c}">${esc(label)}</button>`).join("");

    const baseName = Mu.SHARP[UI.bendBase % 12] + (Math.floor(UI.bendBase / 12) - 1);
    const goalMidi = UI.bendBase + Math.round(UI.bendTarget / 100);
    const goalName = UI.bendTarget === 45
      ? `${baseName} 与 ${Mu.SHARP[(UI.bendBase + 1) % 12]} 之间（微蓝调音）`
      : `${Mu.SHARP[goalMidi % 12]}${Math.floor(goalMidi / 12) - 1}（+${UI.bendTarget} cents）`;

    return `<div class="block"><h3>真琴麦克风调音与推弦音准仪（对应 G1 调音、G10/G11 推弦与微推弦）</h3>
      <p class="small muted">开启麦克风后，直接弹响你手里的真吉他：上方实时显示音名、频率（Hz）与音分偏差（±50 cents）；下方可专门训练全音推弦、半音推弦与四分之一蓝调微推弦的音准控制。</p>
      <div class="btn-row">
        <button class="btn primary" data-act="ear-ttoggle">${UI.tunerOn ? "停止麦克风监听" : "🎙️ 开启麦克风监听真琴"}</button>
        <button class="btn" data-act="ear-bplay">▶ 试听推弦起点与目标音</button>
      </div>
      ${UI.tunerErr ? `<p class="ear-fb bad">${esc(UI.tunerErr)}</p>` : ""}
      <div class="tuner-box" id="tuner-live">
        <div class="tuner-note" id="tuner-note">${UI.tunerOn ? "请拨弦…" : "未开启"}</div>
        <div class="tuner-sub" id="tuner-sub">标准音 A4 = 440 Hz · 误差 ±5 cents 内为精准</div>
        <div class="tuner-meter"><div class="tuner-zero"></div><div class="tuner-needle" id="tuner-needle" style="left:50%"></div></div>
      </div>
      <div class="cof-sec"><span>标准调弦参考音（点按发声对照）</span><div class="btn-row" style="margin-top:4px">${strings}</div></div>
      <hr style="border:0;border-top:1px solid var(--rule);margin:14px 0">
      <h4>推弦音准靶场（Bend Accuracy Trainer）</h4>
      <div class="filters">
        <span class="grp"><span>推弦起点</span><select data-act="ear-bbase">${bendBases}</select></span>
      </div>
      <div class="filters" style="margin-top:6px"><span class="grp"><span>目标幅度</span>${bendTargets}</span></div>
      <div class="note-block" id="bend-live" style="margin-top:10px">
        <p style="margin:0"><b>起点音：${esc(baseName)}</b> → <b>目标音高：${esc(goalName)}</b></p>
        <p class="small muted" style="margin:4px 0 0" id="bend-status">开启麦克风后，先在琴上弹响起点音 ${esc(baseName)}，再往上推弦，观察实时上升的音分（cents）是否稳稳停在目标区间！</p>
      </div>
    </div>`;
  }

  function updateTunerDOM(info) {
    const noteEl = document.getElementById("tuner-note");
    const subEl = document.getElementById("tuner-sub");
    const needle = document.getElementById("tuner-needle");
    const bendSt = document.getElementById("bend-status");
    if (!noteEl) return;
    if (!info) {
      return;
    }
    const sign = info.cents > 0 ? "+" : "";
    const ok = Math.abs(info.cents) <= 6;
    noteEl.textContent = `${info.full} (${sign}${info.cents}c)`;
    noteEl.className = "tuner-note " + (ok ? "ok" : "");
    if (subEl) subEl.textContent = `实测频率：${info.hz.toFixed(1)} Hz · ${ok ? "✓ 音准极佳" : info.cents < 0 ? "偏低（请拧紧或继续往上推）" : "偏高（请放松或少推一点）"}`;
    if (needle) {
      const pct = Math.max(4, Math.min(96, 50 + info.cents * 0.9));
      needle.style.left = pct.toFixed(1) + "%";
      needle.className = "tuner-needle " + (ok ? "ok" : "");
    }
    if (bendSt) {
      const diffCents = Math.round((info.midiFloat - UI.bendBase) * 100);
      if (diffCents >= -35 && diffCents <= 360) {
        const err = diffCents - UI.bendTarget;
        const hit = Math.abs(err) <= 15;
        bendSt.innerHTML = `当前相对起点已推高：<b>${diffCents >= 0 ? "+" : ""}${diffCents} cents</b>（目标 +${UI.bendTarget} cents） — ` +
          (hit ? `<b style="color:var(--good)">🎯 稳稳命中目标音准！保持住揉弦！</b>`
            : err < 0 ? `还差 <b>${Math.abs(err)} cents</b> 到位`
            : `<span style="color:var(--red)">推高了 <b>+${err} cents</b>，略收一点手指！</span>`);
      }
    }
  }

  function inner() {
    const tabs = [
      ["int", "音程听辨"],
      ["chord", "和弦听辨"],
      ["deg", "功能级数"],
      ["prog", "进行听辨"],
      ["jam", "伴奏循环 (Jam)"],
      ["tuner", "调音与推弦仪"],
      ["metro", "节拍器"]
    ].map(([k, v]) =>
      `<button class="btn ${UI.tab === k ? "on" : ""}" data-act="ear-tab" data-v="${k}">${v}</button>`
    ).join("");
    const body = UI.tab === "int" ? renderInt()
      : UI.tab === "chord" ? renderChord()
      : UI.tab === "deg" ? renderDeg()
      : UI.tab === "prog" ? renderProg()
      : UI.tab === "jam" ? renderJam()
      : UI.tab === "tuner" ? renderTuner()
      : renderMetro();
    return `<div class="btn-row">${tabs}</div>${body}`;
  }

  function pageEar(params) {
    const t = params.get("tab");
    if (t && ["int", "chord", "deg", "prog", "jam", "tuner", "metro"].includes(t)) UI.tab = t;
    return `<section class="page">
      <div class="page-head"><h1>练耳与节奏</h1>
        <p class="lead">解决“三通”里的<b>听得出</b>与<b>跟伴奏弹得出</b>：从单音程、单和弦、功能级数一路练到 14 种经典和弦进行盲听，内置 8 套可调速伴奏循环（Backing Track Looper）与随身节拍器。</p></div>
      <div id="ear-root">${inner()}</div>
      <h2>每天 5～10 分钟怎么练最有效</h2>
      <ul class="plain">
        <li><b>G3 阶段</b>：音程听辨只开“基础 5 种”，听完立刻在吉他上把它弹出来并唱出声</li>
        <li><b>G5～G6 阶段</b>：和弦听辨先攻四种三和弦，再开五种七和弦；注意听 3 音和 7 音的摩擦感</li>
        <li><b>G7～G9 / G14～G15 阶段</b>：先练“功能级数”，再开“进行听辨”盲测 <code>I–V–vi–IV</code>、<code>ii–V–I</code>、<code>I–♭VII–IV–I</code> 与调外借用</li>
        <li><b>G10～G13 阶段</b>：打开“伴奏循环 (Jam)”，跟着 12 小节布鲁斯、4 大调式 Vamp 与 <code>ii–V–I</code> 实时盯准当小节的 3 音/7 音即兴</li>
      </ul>
    </section>`;
  }

  function refresh() {
    const box = document.getElementById("ear-root");
    if (box) box.innerHTML = inner();
    const E = earStats();
    const tot = E.intTot + E.chTot + E.degTot + (E.progTot || 0);
    const ok = E.intOk + E.chOk + E.degOk + (E.progOk || 0);
    const cnt = document.querySelector('#nav a[href="#/ear"] .count');
    if (cnt && tot) cnt.textContent = `${Math.round((ok / tot) * 100)}%`;
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.matches("input, select")) return;
    const a = el.dataset.act;
    if (!a.startsWith("ear-")) return;
    const E = earStats();
    if (a === "ear-tab") { UI.tab = el.dataset.v; }
    else if (a === "ear-idir") { UI.intDir = el.dataset.v; }
    else if (a === "ear-inext") { nextInt(); }
    else if (a === "ear-ireplay") { if (UI.intQ) M().playInterval(UI.intQ.baseMidi, UI.intQ.semis, UI.intDir); return; }
    else if (a === "ear-ians") {
      if (!UI.intQ || UI.intAns) return;
      const pick = Number(el.dataset.s);
      UI.intAns = { pick };
      E.intTot++; if (pick === UI.intQ.semis) E.intOk++;
      C.save();
    }
    else if (a === "ear-cstyle") { UI.chStyle = el.dataset.v; }
    else if (a === "ear-cnext") { nextChord(); }
    else if (a === "ear-creplay") { playChordQ(); return; }
    else if (a === "ear-cans") {
      if (!UI.chQ || UI.chAns) return;
      const pick = el.dataset.id;
      UI.chAns = { pick };
      E.chTot++; if (pick === UI.chQ.typeId) E.chOk++;
      C.save();
    }
    else if (a === "ear-dnext") { nextDeg(); }
    else if (a === "ear-dreplay") { if (UI.degQ) M().playDegreeContext(UI.degQ.rootPc, UI.degQ.semis); return; }
    else if (a === "ear-dans") {
      if (!UI.degQ || UI.degAns) return;
      const pick = el.dataset.d;
      UI.degAns = { pick };
      E.degTot++; if (pick === UI.degQ.deg) E.degOk++;
      C.save();
    }
    else if (a === "ear-pnext") { nextProg(); }
    else if (a === "ear-preplay") { playProgQ(); return; }
    else if (a === "ear-pstep") { playProgQ(Number(el.dataset.i)); return; }
    else if (a === "ear-pans") {
      if (!UI.progQ || UI.progAns) return;
      const pick = el.dataset.id;
      UI.progAns = { pick };
      E.progTot++; if (pick === UI.progQ.id) E.progOk++;
      C.save();
    }
    else if (a === "ear-jtoggle") { if (UI.jamRunning) stopJam(); else startJam(); }
    else if (a === "ear-ttoggle") {
      if (UI.tunerOn) {
        M().stopMic();
        UI.tunerOn = false;
      } else {
        UI.tunerErr = "";
        M().startMic((info) => updateTunerDOM(info)).then(() => {
          UI.tunerOn = true;
          refresh();
        }).catch((err) => {
          UI.tunerOn = false;
          UI.tunerErr = "无法打开麦克风：" + (err && err.message ? err.message : "请检查浏览器麦克风权限");
          refresh();
        });
        return;
      }
    }
    else if (a === "ear-tstr") { M().play(Number(el.dataset.m), 0, 0.95); return; }
    else if (a === "ear-btarget") { UI.bendTarget = Number(el.dataset.c); }
    else if (a === "ear-bplay") {
      M().play(UI.bendBase, 0, 0.95);
      if (UI.bendTarget >= 100) M().play(UI.bendBase + Math.round(UI.bendTarget / 100), 0.65, 0.95);
      return;
    }
    else if (a === "ear-jbar") {
      const idx = Number(el.dataset.jbar);
      UI.jamBar = idx;
      const tr = JAM_TRACKS.find((x) => x.id === UI.jamId) || JAM_TRACKS[0];
      const barInfo = tr.bars[idx];
      if (barInfo) {
        const rootPc = (M().parseName(UI.jamKey).pc + barInfo[0]) % 12;
        M().strum(M().chordMidis(rootPc, barInfo[1]), 0.035);
      }
      updateJamUI();
      return;
    }
    else if (a === "ear-mmeter") { UI.meter = el.dataset.v; }
    else if (a === "ear-msub") { UI.sub = el.dataset.v; }
    else if (a === "ear-mtoggle") { if (UI.running) stopMetro(); else startMetro(); }
    else if (a === "ear-tap") {
      const now = performance.now();
      UI.taps = UI.taps.filter((t) => now - t < 2500);
      UI.taps.push(now);
      if (UI.taps.length >= 2) {
        const gaps = UI.taps.slice(1).map((t, i) => t - UI.taps[i]);
        const avg = gaps.reduce((x, y) => x + y, 0) / gaps.length;
        UI.bpm = Math.max(40, Math.min(220, Math.round(60000 / avg)));
      }
    }
    refresh();
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    const a = el.dataset.act;
    if (!a || !a.startsWith("ear-")) return;
    if (a === "ear-ipool") { UI.intPool = el.value; UI.intQ = null; UI.intAns = null; }
    else if (a === "ear-cpool") { UI.chPool = el.value; UI.chQ = null; UI.chAns = null; }
    else if (a === "ear-dpool") { UI.degPool = el.value; UI.degQ = null; UI.degAns = null; }
    else if (a === "ear-ppool") { UI.progPool = el.value; UI.progQ = null; UI.progAns = null; }
    else if (a === "ear-jtrack") { UI.jamId = el.value; UI.jamBar = 0; jamStep = 0; }
    else if (a === "ear-jkey") { UI.jamKey = el.value; }
    else if (a === "ear-jbpm") { UI.jamBpm = Number(el.value); }
    else if (a === "ear-bbase") { UI.bendBase = Number(el.value); }
    else if (a === "ear-bpm") { UI.bpm = Number(el.value); }
    refresh();
  });

  document.addEventListener("input", (e) => {
    if (e.target.dataset.act === "ear-bpm") {
      UI.bpm = Number(e.target.value);
      const b = document.getElementById("bpm-val");
      if (b) b.textContent = UI.bpm;
    } else if (e.target.dataset.act === "ear-jbpm") {
      UI.jamBpm = Number(e.target.value);
      const b = document.getElementById("jam-bpm-val");
      if (b) b.textContent = UI.jamBpm;
    }
  });

  window.Pages.ear = pageEar;
})();
