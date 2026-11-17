// 本地学习中枢：把外部参考资料的核心精要（RES_GUIDES）与 55 首曲目的可发声和声/Riff 卡（SONG_CARDS）全部内置到本地网页
// 让学习者无需频繁跳转外网，在当前页面即可读透核心干货、直接试听原曲进行并在本地指板/练耳室实操
(function () {
  const C = () => window.Core;
  const M = () => window.Music;

  // ── 1. 权威外链资料的“本地核心精要”与“本站内置平替工具”映射 ──
  const RES_GUIDES = {
    // 顶级视频课与吉他体系
    aug: {
      summary: "Scotty West 32 课《Absolutely Understand Guitar》全套核心提炼",
      points: [
        "【指板底层几何】吉他不是 6 根独立的弦，而是一条折叠起来的半音阶尺子；由于 3→2 弦是大三度（4 半音）而非纯四度（5 半音），任何跨过 2、3 弦的音程、和弦或音阶形状都必须往高品方向平移 +1 品。",
        "【五指模式（5 Finger Patterns）】CAGED 的本质是同一条大调音阶在指板上的 5 个相邻切片，每个切片内部都装着该调的 I、IV、V 三和弦。",
        "【色彩与情绪光谱】把 7 种调式按明亮到阴暗排列（利底亚 → 伊奥尼亚 → 混合利底亚 → 多利亚 → 爱奥利亚 → 弗里几亚 → 洛克里亚），每往右一步正好降一个音级（五度圈逆时针移动一格）。"
      ],
      local: ["#/fretboard?root=C&type=major", "在本站指板验证 CAGED 与调式光谱"]
    },
    fretscience: {
      summary: "Fret Science（Keith Martin）：用“矩形与堆叠（Rectangle & Stack）”秒通全指板五声与调式",
      points: [
        "【两个积木统治全指板】五声音阶在任何一根弦上只有两种品格间距：相隔 2 品的「长边（全音，含 1–2–3 或 5–6）」与相隔 3 品的「宽边（小三度，含 3–5 或 6–1）」。",
        "【矩形（Rectangle）与堆叠（Stack）】两根相邻弦的长边叠在一起叫“矩形”（3×2 品格框，如大调 5-6 / 2-3），宽边叠在一起叫“堆叠”（4×2 品格框，如 6-1 / 3-5）。",
        "【跨弦自动对齐】在任意单弦或双弦上只要认出当前处于“矩形”还是“堆叠”，就能不背 5 个死盒子直接斜向滑通 0～15 品（遇到 3→2 弦把上层积木往右推 1 品即可）！",
        "【五声变七音调式】在“宽边（相隔 3 品的两个五声音之间）”填进 1 个中间音（4 级或 7 级），五声积木瞬间变成多利亚、混合利底亚或自然大小调。"
      ],
      local: ["lessons/2026-12-16-pentatonic-5pos.html", "打开 G10 讲义交互矩形+堆叠图解"]
    },
    signals: {
      summary: "Signals Music Studio（Jake Lizzio）：用吉他和弦进行写歌与听辨调式",
      points: [
        "【调式靠伴奏立住】单弹音阶听不出调式！必须先用主和弦占满 50% 以上时间立住“家”，再用第二个含特征音的和弦（如多利亚 i–IV、利底亚 I–II、混合利底亚 I–♭VII、弗里几亚 i–♭II）点题。",
        "【平行借用和弦配方】在大调歌曲副歌结尾加一个同主音小调借来的 iv（如 C 调里的 Fm）或 ♭VI–♭VII–I（A♭–B♭–C），瞬间获得电影级史诗感与怀旧落差。"
      ],
      local: ["#/ear?tab=jam", "在本站伴奏循环 (Jam) 实测 4 大调式 Vamp"]
    },
    jensLarsen: {
      summary: "Jens Larsen：现代/爵士吉他 3–7 引导线、壳和弦与目标音即兴",
      points: [
        "【先弹 3 音和 7 音】和弦的根音由贝斯手负责，5 音不决定性质；吉他手伴奏用 1–3–7 壳和弦（Shell Voicing），独奏强拍瞄准 3 音和 7 音，就能只用 2～3 个音把整个 ii–V–I 交代清楚。",
        "【半音包围（Enclosure）】在目标和弦音（比如第 1 拍的 3 音）到来前的第 4 拍，先弹它上方顺阶邻音 + 下方半音，再落回目标音，立刻消除“背琶音练习曲”的机械感。"
      ],
      local: ["lessons/2026-12-31-chord-tones-improv.html", "打开 G13 讲义练习 3–7 引导线与包围音"]
    },
    tomoFujita: {
      summary: "Tomo Fujita（伯克利教授）：密排三和弦转位、极简声部连接与右手控制",
      points: [
        "【Don't Expect, Just Train】不要一上来就扫 6 根弦大横按！用 4–3–2 弦密排三和弦（Close Triads）弹 I–IV–V，坚持“共同音手指不动，其余手指只走 1～2 品”。",
        "【动态与消音】好声音 70% 来自不弹的弦有多安静：左手食指尖顶住低一弦、指腹轻触高一弦，右手用拨片尖轻触控制强弱（pp 到 ff），让每个三和弦像管乐组一样干净。"
      ],
      local: ["#/fretboard?root=G&type=maj", "在本站指板「实战指型库」点听 4-3-2 密排三和弦"]
    },
    stichMethod: {
      summary: "StichMethod Guitar：五声盒子里的和弦重音与大小五声无缝混用",
      points: [
        "【一盒两家】第 5～8 品同一个五声指型，重音停在 A–C–E 上是 A 小调五声，重音停在 C–E–G 上就是 C 大调五声——决定大小调的不是指型，而是你停在哪个和弦音上。",
        "【布鲁斯跟随和弦（Playing the Changes）】A 调布鲁斯前 4 小节 A7 混用大小五声（C 击弦到 C♯）；第 5 小节进 D7 时，把 2 弦 8 品 G 退半音到 2 弦 7 品 F♯（D7 的 3 音），一句话点亮和弦换色。"
      ],
      local: ["#/fretboard?root=A&type=minorPenta&ov=D:dom7", "在本站指板开启 A 小五声叠显 D7 靶心"]
    },
    davidBennett: {
      summary: "David Bennett Piano：流行与摇滚金曲背后的和声套路与调式基因",
      points: [
        "【四大流行循环】I–V–vi–IV（开朗大气）、vi–IV–I–V（叙事伤感）、I–vi–IV–V（复古浪漫）、I–♭VII–IV–I（混合利底亚摇滚双变格）。",
        "【调外催泪三剑客】III7（V/vi，如《Creep》《海阔天空》）、iv（平行小调小四级，走 6→♭6→5 半音下行）、♭VI–♭VII–I（马里奥终止 / 摇滚凯旋进行）。"
      ],
      local: ["#/ear?tab=prog", "在本站「进行听辨」盲测 14 种经典金曲进行"]
    },
    twelveTone: {
      summary: "12tone：功能象限（Loop Theory）与摇滚/流行曲式功能分析",
      points: [
        "【四和弦循环的驱动力】现代流行乐常不靠强烈的 V7–I 终结，而是利用 vi、IV、I、V 四个和弦首尾相接形成永动循环（Loop），靠配器加减与鼓点切换区分主副歌。",
        "【双调性模糊】像《Sweet Home Alabama》（D–C–G）或《Smells Like Teen Spirit》这类进行故意在关系调/调式之间留出模糊地带，旋律落哪哪里就像家。"
      ],
      local: ["lessons/2026-12-08-harmony-cadences.html", "打开 G8 讲义查看流行四和弦与终止式"]
    },
    neely: {
      summary: "Adam Neely：节奏细分底层认知、摇摆比（Swing Ratio）与现代和声",
      points: [
        "【律动不是黑白分明的网格】真实的 Swing 并非死板的 2:1（66.7%），慢速布鲁斯接近 2:1，中高速爵士/放克往往落在 55%～60% 的微妙弹性区间。",
        "【节奏与音高同源】把复节奏（如 3 对 2）加速到每秒数十次就是纯五度音程（3:2 频率比）——节奏稳是一切高级和声能站住的前提。"
      ],
      local: ["#/ear?tab=metro", "在本站节拍器实测 Swing 与细分阶梯"]
    },

    // JustinGuitar 系列课程精要
    jgPmt1: {
      summary: "JustinGuitar 实用乐理 Grade 1：12 平均律半音圈、B–C / E–F 无升降与八度跳板",
      points: [
        "【两大无半音铁律】12 个音围绕圆圈排列，唯独 B–C 与 E–F 之间天然只有 1 品（半音），其余相邻字母均隔 2 品（全音）。",
        "【6 弦与 5 弦是全指板导航锚点】先背熟 6 弦和 5 弦 0～12 品的自然音（0/1/3/5/7/8/10/12 品），再用“6→4 弦隔一弦高 2 品”“4→2 弦隔一弦高 3 品”的八度跳板推导全指板。"
      ],
      local: ["lessons/2026-11-09-fretboard-notes.html", "打开 G1 讲义与找音练习"]
    },
    jgPmt2: {
      summary: "JustinGuitar 实用乐理 Grade 2：前 5 品音名定位、六线谱拍号结合与和弦图拆解",
      points: [
        "【看和弦图先认根音与三音】任何开放和弦（C/A/G/E/D/Am/Em/Dm）里，决定它是大是小的永远是那颗 3 音（例如 E 和弦 3 弦 1 品 G♯ 抬起空弦 G 即变 Em）。",
        "【数拍子口诀】四分音符数 1 2 3 4，八分音符数 1 & 2 & 3 & 4 &，十六分音符数 1 e & a，右手永远像钟摆一样上下匀速摆动。"
      ],
      local: ["lessons/2026-11-14-rhythm-meter.html", "打开 G2 节奏与拍号交互讲义"]
    },
    jgCagedLogic: {
      summary: "JustinGuitar：CAGED 系统底层逻辑——5 个开放和弦如何铺满整条琴颈",
      points: [
        "【食指横按代替琴枕】把开放 C、A、G、E、D 五个指型往高把位推，用食指横按充当移动的“0 品琴枕”，就能在整条指板上按出同一个和弦的 5 个把位。",
        "【C–A–G–E–D 永恒循环】无论什么调，从琴头往琴桥永远按 C型 → A型 → G型 → E型 → D型 → C型 的顺序首尾咬合（前一个指型的最高根音正好是下一个指型的最低根音）。"
      ],
      local: ["#/fretboard?root=C&type=maj", "在本站指板依次切换 C/A/G/E/D 把位聚焦"]
    },
    jgCagedIntro: {
      summary: "JustinGuitar：CAGED 实战取舍——哪些指型用来扫弦、哪些只截 3 根弦",
      points: [
        "【大横按扫弦主力】完整 5～6 根弦扫弦最实用的是 E 型（6 弦根音）和 A 型（5 弦根音），C 型次之；完整的 G 型和 D 型大横按反人类，实战中一律只截取其中 3～4 根弦！",
        "【指型 = 琶音骨架】每个 CAGED 把位不光能按和弦，它直接就是该把位五声音阶和七音音阶的 1–3–5 骨架。"
      ],
      local: ["lessons/2026-11-25-triads-caged.html", "打开 G5 三和弦与 CAGED 讲义"]
    },
    jgBlues1: {
      summary: "JustinGuitar Essential Blues Lead：Pattern 1 + B.B. Box 与布鲁斯推弦词库",
      points: [
        "【P1 两大必杀推弦】在 A 小调五声第 5～8 品（Pattern 1）中，最核心的两个全音推弦是：3 弦 7 品(D)推向 9 品(E)，以及 2 弦 8 品(G)推向 10 品(A)。",
        "【3 弦 5 品微推弦】3 弦 5 品的小三度 C 用食指或中指轻轻往下拉/往上推四分之一音（介于 C 与 C♯ 之间）立刻切住回 4 弦 7 品 A，是最纯正的蓝调哭腔。"
      ],
      local: ["#/ear?tab=tuner", "在本站「推弦音准靶场」实测微推弦与全音推弦"]
    },
    jgBlues2: {
      summary: "JustinGuitar Blues Solos All Over：打通 Pattern 1～5 的经典对角滑音走廊",
      points: [
        "【3 弦与 2 弦黄金走廊】以 A 小调五声为例：6弦5→7品滑进 P1 → 4弦5→7品 → 3弦7→9品滑入 P2（B.B. Box：2弦8/10品 + 1弦8/10品），一条斜线横跨 3 个八度！"
      ],
      local: ["#/fretboard?root=A&type=blues", "在本站指板查看 A 布鲁斯音阶全把位"]
    },
    jgBluesScale: {
      summary: "JustinGuitar：布鲁斯音阶里的 ♭5（Blue Note）怎么弹才好听",
      points: [
        "【♭5 只路过不停留】小调五声（1 ♭3 4 5 ♭7）加上 ♭5 得到布鲁斯音阶。在 A 调 P1 中，♭5（E♭）位于 5 弦 6 品和 3 弦 8 品——弹到它必须顺势滑向 5 音（E）或退回 4 音（D），绝不长时间停在上面。"
      ],
      local: ["lessons/2026-12-21-blues-12bar.html", "打开 G11 布鲁斯交互讲义"]
    },
    jgIntermediate: {
      summary: "JustinGuitar 中级进阶：把 CAGED 和弦音、五声与调式融为一炉",
      points: [
        "【三层指板透视】在同一个把位里：第 1 层看见 CAGED 的 1–3–5 和弦骨架，第 2 层套上五声音阶的 5 个音，第 3 层补上 2 个特征音变成七音调式。"
      ],
      local: ["#/fretboard?root=A&type=dorian&ov=A:m7", "在本站指板体验“音阶 + 和弦靶心”双层透视"]
    },

    // 经典纸质教材与大师著作精粹
    tagliarino: {
      summary: "Barrett Tagliarino《Guitar Fretboard Workbook》（MI 教材）指板通关秘籍",
      points: [
        "【八度 7 种形状】6→4 弦(+2品)、5→3 弦(+2品)、4→2 弦(+3品)、3→1 弦(+3品)，以及跨两根弦的 6→3 弦(-3品)、5→2 弦(-2品)、4→1 弦(-2品)——练熟这 7 个几何对角线，1 秒锁定全指板同名音。",
        "【密排三和弦水平+垂直矩阵】先在一组弦（如 4–3–2 弦）横向走通原位→一转→二转，再在同一个品位纵向跨 654→543→432→321 四组弦弹同一个和弦。"
      ],
      local: ["#/fretboard?root=C&type=maj", "在本站指板练习找音与密排三和弦矩阵"]
    },
    kolb: {
      summary: "Tom Kolb《Music Theory for Guitarists》（Hal Leonard）核心公式表",
      points: [
        "【音阶与和弦平行数字表】一切音阶与和弦都以同主音大调（1 2 3 4 5 6 7）为标尺：小三=1 ♭3 5，属七=1 3 5 ♭7，多利亚=1 2 ♭3 4 5 6 ♭7，混合利底亚=1 2 3 4 5 6 ♭7，利底亚=1 2 3 ♯4 5 6 7。"
      ],
      local: ["#/fretboard", "在本站指板对照 40 种音阶与和弦数字公式"]
    },
    serna: {
      summary: "Desi Serna《Fretboard Theory》：名曲里的五声、CAGED 与调式密码",
      points: [
        "【大调五声与小调五声选哪个】如果伴奏是 I–IV–V 大三和弦进行（如《Sweet Home Alabama》《Let It Be》），首选主音大调五声；如果伴奏是小调或硬摇滚 Riff（如《Paranoid》），首选小调五声；布鲁斯则两者叠加。"
      ],
      local: ["#/songs", "在本站曲目分析页直接试听 55 首名曲进行"]
    },
    goodrick: {
      summary: "Mick Goodrick《The Advancing Guitarist》（伯克利吉他圣经）三大练法",
      points: [
        "【Unitrib（单弦练习）】规定今天只在第 3 弦（或第 2 弦）一根弦上弹完整个大调、多利亚或琶音即兴！没有了跨弦指型拐杖，你被迫真正听见音程距离并学会滑音造句。",
        "【相邻双弦与限制练习】规定只在 3–2 弦第 5～9 品这 4×2 个格子里伴奏和即兴 5 分钟——限制越严格，大脑开发的音乐创意越深。"
      ],
      local: ["lessons/2026-12-16-pentatonic-5pos.html", "打开 G10 讲义体验三音受限与单弦思维"]
    },
    govan: {
      summary: "Guthrie Govan《Creative Guitar》：让电吉他发出“人声说话感”的细节",
      points: [
        "【推弦三要素】① 推弦前想清楚目标音是谁；② 推弦速度决定情绪（快推干脆、慢推挣扎）；③ 推到顶之后再加揉弦，绝不在半路上盲目乱抖。",
        "【打破手指机械模进】不要让手指牵着脑子走，尝试“先用嘴哼一句短旋律，再在琴上原封不动弹出来”，这是治愈机械爬音阶的唯一良药。"
      ],
      local: ["#/ear?tab=tuner", "在本站「推弦音准靶场」训练精准目标音推弦"]
    },
    leavitt: {
      summary: "William Leavitt《A Modern Method for Guitar》（伯克利标准教材）把位与声部法则",
      points: [
        "【四指四品把位制】左手食指所在的品格定义了当前把位（Position），食指、中指、无名指、小指各管 1 品（另有伸展指型），培养不低头看指板的盲弹空间感。",
        "【四部和声连接】弹七和弦进行时，保持声部平稳级进，避免四个声部同向大跳（可用本站指板 Drop 2 四转位直观练习）。"
      ],
      local: ["#/fretboard?root=C&type=maj7", "在本站指板「实战指型库」练习 Drop 2 四部和弦"]
    },
    levine: {
      summary: "Mark Levine《The Jazz Theory Book》：ii–V–I、壳和弦与调式爵士精髓",
      points: [
        "【3 音与 7 音引导线】在 ii7–V7–Imaj7（如 Dm7–G7–Cmaj7）中，Dm7 的 ♭7(C) 降半音变 G7 的 3(B)，G7 的 ♭7(F) 降半音变 Cmaj7 的 3(E)——两条半音下行线撑起了整个爵士和声大厦。",
        "【三全音替代（Tritone Sub）】因为 G7（B–F）和 D♭7（F–C♭/B）共享完全相同的三全音核心（3 音与 ♭7 音互换），所以 Dm7–G7–Cmaj7 可以直接改写成丝滑半音下行的 Dm7–D♭7–Cmaj7！"
      ],
      local: ["#/ear?tab=jam", "在本站伴奏循环选择 Jazz ii–V–I 实操引导线"]
    },
    tedGreene: {
      summary: "Ted Greene《Chord Chemistry》：把和弦连接变成多声部旋律",
      points: [
        "【高音旋律线（Top-Note Melody）】吉他手选哪个和弦转位，取决于你希望最高音（1 弦或 2 弦）唱出什么旋律音——让和弦顶音连成一条好听的歌，底下三个声部自然跟随。"
      ],
      local: ["#/fretboard?root=C&type=maj7", "在本站指板对比原位与三转位的顶音变化"]
    },
    hookBook: {
      summary: "Hooktheory I：用色彩块与罗马数字一眼看穿流行歌曲和声",
      points: [
        "【把所有歌移到同一个调对比】一旦把千百首流行歌全部转写为 1～7 级罗马数字，你会发现 80% 的热门副歌都在 I、IV、V、vi 四个和弦的排列组合里，偶尔借入 ♭VII、iv 或 V/vi 制造惊喜。"
      ],
      local: ["#/ear?tab=prog", "在本站「进行听辨」训练罗马数字瞬间反应"]
    },
    mit051: {
      summary: "MIT OCW 21M.051 Fundamentals of Music：大学乐理地基精要",
      points: [
        "【音高、节奏与调性的严密公理】从泛音列（八度 2:1、纯五度 3:2）理解为什么纯五度与大三和弦最协和，为什么导音（7→1）与小七度（♭7→3）构成的属七三全音具有不可抗拒的向心力。"
      ],
      local: ["lessons/2026-11-17-intervals.html", "打开 G3 音程讲义听协和与三全音解决"]
    },
    mit301: {
      summary: "MIT OCW 21M.301 Harmony and Counterpoint：声部独立与低音线条",
      points: [
        "【外声部优先（Bass & Soprano）】一段和弦进行好不好听，最重要是最高音旋律与最低音贝斯（Bassline）是否形成了平稳级进或反向运动——这也是吉他斜杠和弦（如 C → G/B → Am → Am/G → F）动听的原因。"
      ],
      local: ["lessons/2026-12-04-diatonic-roman.html", "打开 G7 顺阶和弦与斜杠低音讲义"]
    },

    // 在线工具与练习网站的“本站零跳转内置平替”
    oolimo: {
      summary: "Oolimo 和弦分析器核心用法（已内置于本站指板页）",
      points: [
        "【本站直接平替】无需跳转外网，直接在本站「指板与五度圈」选择任意根音与 25 种和弦类型，切到“级数”视图即可查看每个品格的 1/3/5/7/9 角色与实战把位指型。"
      ],
      local: ["#/fretboard", "直接打开本站指板与实战指型库"]
    },
    tonedearInt: {
      summary: "ToneDear 音程听辨练习（已完整内置于本站练耳室）",
      points: [
        "【本站直接平替】本站「练耳与节奏 → 音程听辨」已完整支持 G3 预习、基础 5 种、常用 8 种与全部 12 音程的上行/下行/和声听辨，并带参考曲提示。"
      ],
      local: ["#/ear?tab=int", "直接打开本站音程听辨器"]
    },
    tonedearChord: {
      summary: "ToneDear 和弦听辨练习（已完整内置于本站练耳室）",
      points: [
        "【本站直接平替】本站「练耳与节奏 → 和弦听辨」已内置大/小/减/增三和弦、sus2/sus4 挂留与五种七和弦的扫弦/分解琶音听辨。"
      ],
      local: ["#/ear?tab=chord", "直接打开本站和弦性质听辨器"]
    },
    tonedearProg: {
      summary: "ToneDear 和弦进行听辨（已完整内置于本站练耳室）",
      points: [
        "【本站直接平替】本站「练耳与节奏 → 进行听辨」已内置 14 种大调、摇滚调式、小调与副属/借用四和弦进行盲听，支持单和弦拆解重听。"
      ],
      local: ["#/ear?tab=prog", "直接打开本站和弦进行听辨器"]
    },
    fet: {
      summary: "Functional Ear Trainer 听级数训练法（已完整内置于本站练耳室）",
      points: [
        "【Alain Benbassat 听级数核心法】绝不孤立数半音！每次先播放 I–IV–V–I 确立调性引力场，再去感受目标音掉在调性里的“稳定感/倾向感”（如 4 想落 3、7 想升 1）。本站已内置完整浏览器版！"
      ],
      local: ["#/ear?tab=deg", "直接打开本站功能级数听辨器 (I–IV–V–I)"]
    },
    muted: {
      summary: "Muted.io 交互指板与五度圈对照（已完整内置于本站指板页）",
      points: [
        "【本站直接平替】本站「指板与五度圈」已内置交互式五度圈、顺阶三/七和弦、同主音小调借用和弦与副属和弦一键试听面板。"
      ],
      local: ["#/fretboard", "直接打开本站指板与五度圈实验室"]
    },
    fretastic: {
      summary: "Fretastic 把位聚焦与伴奏即兴（已完整内置于本站指板与 Jam 室）",
      points: [
        "【本站直接平替】在本站「指板」可切换 CAGED / 五声 5 把位窗口并叠显目标和弦；在「练耳与节奏 → 伴奏循环 (Jam)」可直接播放 8 套伴奏音轨。"
      ],
      local: ["#/ear?tab=jam", "直接打开本站伴奏循环发生器 (Jam)"]
    },
    hooktheory: {
      summary: "Hooktheory TheoryTab 歌曲和声库（本站曲目页已内置 55 首歌和声卡）",
      points: [
        "【怎么用最准】把任何歌曲的副歌和弦换成罗马数字看它属于哪个常见模板（如 I–V–vi–IV 或 vi–IV–I–V）。本站「曲目分析」页已将全部 55 首课表曲目的调性、罗马数字与可发声进行直接内置在页内！"
      ],
      local: ["#/songs", "在本站曲目分析页直接试听 55 首歌和声进行"]
    },
    transcribe: {
      summary: "Transcribe! / Soundslice 减速扒歌四步流水线",
      points: [
        "【扒歌四遍法则】第 1 遍不拿琴跟着原曲哼出主音定调；第 2 遍专听最低频贝斯抓每小节根音；第 3 遍用耳朵或三音测试定大小/七和弦性质；第 4 遍抓旋律与独奏强拍级数。"
      ],
      local: ["lessons/2027-01-09-transcribe-form.html", "打开 G15 扒歌与曲式交互讲义"]
    },
    jgYT: {
      summary: "JustinGuitar 视频频道核心练习法（已提炼进本站讲义与精读卡）",
      points: [
        "【One-Minute Changes（一分钟换和弦法）】练任何新和弦指型时，开 1 分钟倒计时在两个和弦间干净来回切换并记录次数，优先保证不碰哑音再提速。"
      ],
      local: ["#/fretboard", "在本站指板查看全部把位与实战指型库"]
    },
    soundslice: {
      summary: "Soundslice 音画同步慢放与 A–B 循环扒谱法",
      points: [
        "【A–B 逐小节锁定】扒快速度独奏时，每次只圈出 1～2 小节降速到 50%～75%（保持原音高），先用嘴跟唱准节奏落点，再在吉他上找到对应把位。"
      ],
      local: ["lessons/2027-01-09-transcribe-form.html", "打开 G15 扒歌流程交互讲义"]
    },
    teoria: {
      summary: "teoria.com 综合乐理与听辨训练（本站练耳室已内置同款功能）",
      points: [
        "【本站直接平替】直接在本站「练耳与节奏」即可完成音程、三/七和弦、功能级数与 14 种和弦进行的听辨训练。"
      ],
      local: ["#/ear", "直接打开本站练耳与节奏室"]
    },
    songsterr: {
      summary: "Songsterr 在线六线谱防坑指南与本站曲目和声对照",
      points: [
        "【永远用乐理校验六线谱】网络用户上传的 TAB 经常把同音换到不顺手的弦或写错转位；先看本站内置的「曲目和声级数卡」确认该曲的调性与和弦骨架，再用耳朵核对把位。"
      ],
      local: ["#/songs", "查看本站 55 首歌内置和声进行与 Riff 卡"]
    },
    wikiCircle: {
      summary: "五度圈（Circle of Fifths）全套记忆口诀与速查（已内置于本站指板页）",
      points: [
        "【顺时针升号调口诀】G(1♯) → D(2♯) → A(3♯) → E(4♯) → B(5♯) → F♯(6♯)，升号顺序：F–C–G–D–A–E–B（最后一个升号往上升半音即大调主音）。",
        "【逆时针降号调口诀】F(1♭) → B♭(2♭) → E♭(3♭) → A♭(4♭) → D♭(5♭) → G♭(6♭)，降号顺序：B–E–A–D–G–C–F（倒数第二个降号即大调主音）。"
      ],
      local: ["#/fretboard", "在本站指板页底部直接使用交互式五度圈"]
    },
    mtn31: {
      summary: "音程性质（Specific Intervals）符号与 12 半音速查",
      points: [
        "【纯音程家族 1/4/5/8 vs 大小音程家族 2/3/6/7】纯度减半音=减(d)、加半音=增(A)；大小家族大(M)减半音=小(m)、再减=减(d)、大加半音=增(A)。",
        "【指板验证】P4=5 半音（相邻弦同品，过 3–2 弦 +1 品）、P5=7 半音、M3=4 半音、m3=3 半音、TT 三全音=6 半音。"
      ],
      local: ["#/ear?tab=int", "在本站「音程听辨器」直接听辨与校验 12 音程"]
    },
    mtn33: {
      summary: "音程转位（Interval Inversion）核心 9 减法则",
      points: [
        "【度数相加=9，性质互换】原位度数 + 转位度数 = 9（3↔6、2↔7、4↔5）；半音数相加 = 12；性质变化：大↔小，增↔减，纯→纯。",
        "【吉他实战意义】比如 C→E 是大三度(4半音)，反过来 E→C 就是小六度(8半音)；这也是双吉他三/六度和声与三和弦转位的对称原理。"
      ],
      local: ["lessons/2026-11-17-intervals.html#concepts", "回到 G3 音程讲义概念卡对照指板形状"]
    },
    mtn43: {
      summary: "大调顺阶三和弦（Diatonic Triads）：I ii iii IV V vi vii°",
      points: [
        "【固定顺阶性质表】任何大调只用调内音隔位叠三度，永远是 I大 – ii小 – iii小 – IV大 – V大 – vi小 – vii°减。",
        "【本站五度圈直查】打开指板页面底部的五度圈并点击任意大调，7 个顺阶三和弦、七和弦一键高亮并可直接点按听声。"
      ],
      local: ["#/fretboard", "在本站五度圈一键点听任意调顺阶和弦"]
    }
  };

  // 根据资源 key 获取本地精要（涵盖精确匹配 + musictheory.net / OMT 分类智能提炼）
  function guideFor(key) {
    if (RES_GUIDES[key]) return RES_GUIDES[key];
    if (key.startsWith("mtnExFret")) {
      return {
        summary: "musictheory.net 指板识别练习（本站指板页已内置同款训练）",
        points: ["直接在本站「指板与五度圈」开启“找音练习”（支持屏幕点击或 🎙️ 真琴麦克风识别），或切换音阶/和弦做把位聚焦。"],
        local: ["#/fretboard", "直接打开本站指板找音练习"]
      };
    }
    if (key.startsWith("mtnExEar")) {
      return {
        summary: "musictheory.net 练耳练习（本站练耳室已内置同款训练）",
        points: ["直接在本站「练耳与节奏」使用吉他音色进行音程、和弦性质、功能级数与和弦进行听辨。"],
        local: ["#/ear", "直接打开本站练耳与节奏室"]
      };
    }
    if (key.startsWith("mtn")) {
      return {
        summary: "musictheory.net 互动图文短课核心提要",
        points: [
          "该短课用极简五线谱动画演示基础乐理定义（音符时值、拍号、半音全音、大调/小调音阶、音程转位、三/七和弦及罗马数字）。",
          "这些核心定义已 100% 转化为电吉他指板视角，嵌在本模块对应的「讲义」与每日「双语精读卡片」中，读完页内卡片即可完全掌握。"
        ],
        local: ["#/lessons", "查看本站 G1～G15 全套交互讲义"]
      };
    }
    if (key.startsWith("omt")) {
      return {
        summary: "Open Music Theory v2 大学开放教材章节（已内置页内双语精读卡）",
        points: [
          "本章节的原文核心段落、谱例与中文精译已经直接嵌在对应练习日的「精读原文」卡片中，在页面内切换“中文 / 中英对照 / English”即可完整学习，无需跳转外网。"
        ],
        local: ["#/week", "在每日学习页直接阅读内嵌双语原文"]
      };
    }
    return null;
  }

  // 渲染单条外链旁的“📖 本地精要（免去外网）”折叠块
  function renderResDigest(key) {
    const g = guideFor(key);
    if (!g) return "";
    const esc = C().esc;
    const pts = g.points.map((p) => `<li>${esc(p)}</li>`).join("");
    const loc = g.local ? `<div class="btn-row" style="margin-top:6px"><a class="btn" href="${esc(g.local[0])}">⚡ ${esc(g.local[1])} ↗</a></div>` : "";
    return `<details class="local-digest"><summary>📖 本地精要（免跳转直接看：${esc(g.summary)}）</summary>
      <div class="local-digest-body"><ul>${pts}</ul>${loc}</div>
    </details>`;
  }

  // ── 2. 55 首课表曲目的本地和声进行与 Riff 可发声数据库（s01～s55 全覆盖）──
  // riff: [midi, ...]（单音 Riff 示范） | prog: [[root, typeId, label], ...]（和弦进行示范）
  const SONG_CARDS = {
    s01: { key: "G 小调", rn: "1 – ♭3 – 4 | 1 – ♭3 – ♭5 – 4", riff: [55, 58, 60, 55, 58, 61, 60], seq: "G – B♭ – C | G – B♭ – D♭ – C（纯四度双音经典 Riff）", fb: ["G", "blues"] },
    s02: { key: "E 小调", rn: "1 – 1 – ♭3 – 1 – ♭7 – ♭6 – 5", riff: [52, 52, 55, 52, 50, 48, 47], seq: "E – E – G – E – D – C – B（5 弦 7-7-10-7-5-3-2）", fb: ["E", "minor"] },
    s03: { key: "C 大调", rn: "1 – 1 – 5 – 5 – 6 – 6 – 5", riff: [48, 48, 55, 55, 57, 57, 55], seq: "C – C – G – G – A – A – G（纯五度跳进参考曲）", fb: ["C", "major"] },
    s04: { key: "G 大调", rn: "5 – 1 – 1 – 1（纯四度上行号角）", riff: [50, 55, 55, 55], seq: "D → G – G – G（纯四度上行参考曲）", fb: ["G", "major"] },
    s05: { key: "E（无调性张力）", rn: "1 – ♭2 – 1 – ♭2（小二度半音摩擦）", riff: [40, 41, 40, 41, 40, 41], seq: "E – F – E – F（同弦相邻 1 品来回）", fb: ["E", "phrygian"] },
    s06: { key: "C 大调", rn: "1 → 高八度 1（纯八度大跳）", riff: [48, 60, 59, 55, 57, 59, 60], seq: "C3 → C4 – B3 – G3 – A3 – B3 – C4", fb: ["C", "major"] },
    s07: { key: "C 大调（利底亚色彩）", rn: "1 – ♯4 – 5（三全音上行半音解决）", riff: [48, 54, 55], seq: "C – F♯ – G（三全音落入纯五度）", fb: ["C", "lydian"] },
    s08: { key: "E 小调", rn: "4/4 反拍重音（跺-跺-拍）+ D–A–G–A 尾奏", prog: [["E", "power", "i5"], ["D", "maj", "♭VII"], ["A", "maj", "IV"]], fb: ["E", "minorPenta"] },
    s09: { key: "E 调布鲁斯", rn: "I7 – IV7 – V7（德州 Shuffle 12 小节）", prog: [["E", "dom7", "I7"], ["A", "dom7", "IV7"], ["E", "dom7", "I7"], ["B", "dom7", "V7"]], fb: ["E", "blues"] },
    s10: { key: "E 小调（6/8 拍）", rn: "Em 空弦琶音 1–♭3–5–1 → i–♭VII–♭VI–V7", riff: [40, 55, 59, 64, 59, 55], prog: [["E", "min", "i"], ["D", "maj", "♭VII"], ["C", "maj", "♭VI"], ["B", "dom7", "V7"]], fb: ["E", "minor"] },
    s11: { key: "C 大调（3/4 弱起）", rn: "I – V – V7 – I – IV – I – V7 – I", riff: [55, 55, 57, 55, 60, 59], prog: [["C", "maj", "I"], ["G", "dom7", "V7"], ["F", "maj", "IV"], ["C", "maj", "I"]], fb: ["C", "major"] },

    s12: { key: "G 大调", rn: "I – V – ii | I – V – IV", prog: [["G", "maj", "I"], ["D", "maj", "V"], ["A", "min", "ii"], ["C", "maj", "IV"]], fb: ["G", "majorPenta"] },
    s13: { key: "C 大调", rn: "I – V – vi – IV（流行四和弦教科书）", prog: [["C", "maj", "I"], ["G", "maj", "V"], ["A", "min", "vi"], ["F", "maj", "IV"]], fb: ["C", "major"] },
    s14: { key: "A 大调（Capo 7 D型）", rn: "I – IV – V7（A – D – E7）", prog: [["A", "maj", "I"], ["D", "maj", "IV"], ["E", "dom7", "V7"], ["A", "maj", "I"]], fb: ["A", "major"] },
    s15: { key: "C♯ 小调", rn: "i9 – ♭VIadd9 – ♭VIIadd9 – iv9（1-5-9 宽跨度指型）", prog: [["C♯", "min", "i"], ["A", "add9", "♭VI"], ["B", "add9", "♭VII"], ["F♯", "min", "iv"]], fb: ["C♯", "minor"] },
    s16: { key: "E 调布鲁斯摇滚", rn: "I7♯9 – ♭III – IV（Hendrix 和弦）", prog: [["E", "dom7s9", "I7♯9"], ["G", "maj", "♭III"], ["A", "maj", "IV"]], fb: ["E", "minorPenta"] },
    s17: { key: "E 小调", rn: "i5 – ♭VII5 – ♭III5（强力和弦省三音）", prog: [["E", "power", "i5"], ["D", "power", "♭VII5"], ["G", "power", "♭III5"], ["E", "power", "i5"]], fb: ["E", "minorPenta"] },
    s18: { key: "C 大调", rn: "I – Imaj7 – I7 – IV（内声部 8–7–♭7–6 半音下行）", prog: [["C", "maj", "I"], ["C", "maj7", "Imaj7"], ["C", "dom7", "I7(V/IV)"], ["F", "maj", "IV"]], fb: ["C", "major"] },

    s19: { key: "A 大调", rn: "I – vi – IV – V（50s Doo-Wop 进行）", prog: [["A", "maj", "I"], ["F♯", "min", "vi"], ["D", "maj", "IV"], ["E", "maj", "V"]], fb: ["A", "majorPenta"] },
    s20: { key: "E 大调", rn: "I – V – vi – IV（交替 iii 级 G♯m）", prog: [["E", "maj", "I"], ["B", "maj", "V"], ["C♯", "min", "vi"], ["A", "maj", "IV"]], fb: ["E", "major"] },
    s21: { key: "E 大调（原曲降半音 E♭）", rn: "I – V – vi – iii – IV – I – V（卡农进行）", prog: [["E", "maj", "I"], ["B", "maj", "V"], ["C♯", "min", "vi"], ["G♯", "min", "iii"], ["A", "maj", "IV"], ["E", "maj", "I"], ["B", "maj", "V"]], fb: ["E", "major"] },
    s22: { key: "C 大调", rn: "I – vi – I – vi | IV – V – vi – IV", prog: [["C", "maj", "I"], ["A", "min", "vi"], ["F", "maj", "IV"], ["G", "maj", "V"]], fb: ["C", "major"] },
    s23: { key: "E 调（五度圈顺时针链）", rn: "♭VI – ♭III – ♭VII – IV – I（C–G–D–A–E）", prog: [["C", "maj", "♭VI"], ["G", "maj", "♭III"], ["D", "maj", "♭VII"], ["A", "maj", "IV"], ["E", "maj", "I"]], fb: ["E", "minorPenta"] },
    s24: { key: "A 小调 / C 大调", rn: "vi7–ii7–V7–Imaj7–IVmaj7–viiø7–V7/vi–vi", prog: [["A", "m7", "Am7"], ["D", "m7", "Dm7"], ["G", "dom7", "G7"], ["C", "maj7", "Cmaj7"], ["F", "maj7", "Fmaj7"], ["B", "m7b5", "Bm7♭5"], ["E", "dom7", "E7(V/vi)"], ["A", "min", "Am"]], fb: ["A", "harmonic"] },
    s25: { key: "C♯ 小调", rn: "i – ♭VII – ♭VI – ♭VII（自然小调摇滚循环）", prog: [["C♯", "min", "i"], ["B", "maj", "♭VII"], ["A", "maj", "♭VI"], ["B", "maj", "♭VII"]], fb: ["C♯", "minorPenta"] },
    s26: { key: "A 小调", rn: "Am – Am(maj7)/G♯ – Am7/G – D/F♯ – Fmaj7", prog: [["A", "min", "Am"], ["A", "mMaj7", "Am/G♯"], ["A", "m7", "Am7/G"], ["D", "maj", "D/F♯"], ["F", "maj7", "Fmaj7"]], fb: ["A", "minor"] },
    s27: { key: "A 小调（6/8）", rn: "i – ♭III – IV(D大三) – ♭VI – i – V7(E7)", prog: [["A", "min", "i"], ["C", "maj", "♭III"], ["D", "maj", "IV(Dorian)"], ["F", "maj", "♭VI"], ["E", "dom7", "V7"]], fb: ["A", "harmonic"] },
    s28: { key: "D 小调", rn: "i – ♭VII – ♭VI – V7（安达卢西亚终止）", prog: [["D", "min", "i"], ["C", "maj", "♭VII"], ["B♭", "maj", "♭VI"], ["A", "dom7", "V7"]], fb: ["D", "harmonic"] },
    s29: { key: "D 小调", rn: "i – v(Am) – i – iv(Gm) – i – V7(A7) – i", prog: [["D", "min", "i"], ["A", "min", "v"], ["G", "min", "iv"], ["A", "dom7", "V7"], ["D", "min", "i"]], fb: ["D", "dorian"] },
    s30: { key: "F 小调", rn: "i5 – iv5 – ♭III5 – ♭VI5（F5–B♭5–A♭5–D♭5）", prog: [["F", "power", "i5"], ["B♭", "power", "iv5"], ["A♭", "power", "♭III5"], ["D♭", "power", "♭VI5"]], fb: ["F", "minor"] },

    s31: { key: "D 布鲁斯", rn: "1–1–♭7–1–♭5–4–♭3–1（含 ♭5 经典 Riff）", riff: [50, 50, 48, 50, 44, 43, 41, 38], prog: [["D", "dom7", "I7"], ["G", "dom7", "IV7"], ["A", "dom7", "V7"]], seq: "D – D – C – D – A♭(♭5) – G – F – D", fb: ["D", "blues"] },
    s32: { key: "B♭ 调布鲁斯", rn: "12 小节 I7 – IV7 – V7（摇滚双音鼻祖）", prog: [["B♭", "dom7", "I7"], ["E♭", "dom7", "IV7"], ["B♭", "dom7", "I7"], ["F", "dom7", "V7"]], fb: ["B♭", "majorBlues"] },
    s33: { key: "B 小调布鲁斯", rn: "i7 – iv7 – i7 – ♭VI7(G) – V7(F♯7) – i7", prog: [["B", "m7", "i7"], ["E", "m7", "iv7"], ["G", "maj7", "♭VImaj7"], ["F♯", "dom7", "V7"], ["B", "m7", "i7"]], fb: ["B", "blues"] },
    s34: { key: "A 调布鲁斯", rn: "I7 – IV7 – V7（大/小五声交替教科书）", prog: [["A", "dom7", "I7"], ["D", "dom7", "IV7"], ["A", "dom7", "I7"], ["E", "dom7", "V7"]], fb: ["A", "majorBlues"] },
    s35: { key: "B 调慢布鲁斯（12/8）", rn: "I7 – IV7 – I7 – V7 – IV7 – I7", prog: [["B", "dom7", "I7"], ["E", "dom7", "IV7"], ["F♯", "dom7", "V7"], ["B", "dom7", "I7"]], fb: ["B", "blues"] },
    s36: { key: "B 小调 / D 大调", rn: "副歌 D–A–C–G | 尾奏独奏 Bm–A–G–Em", prog: [["B", "min", "i"], ["A", "maj", "♭VII"], ["G", "maj", "♭VI"], ["E", "min", "iv"]], fb: ["B", "minorPenta"] },
    s37: { key: "A 多利亚", rn: "i7 – IV9（Am7 – D9，F♯ 为 ♮6 特征音）", prog: [["A", "m7", "i7(Am7)"], ["D", "dom9", "IV9(D9)"], ["A", "m7", "i7(Am7)"], ["D", "dom9", "IV9(D9)"]], fb: ["A", "dorian"] },
    s38: { key: "D 多利亚", rn: "i – IV（Dm – G，B♮ 为 ♮6 特征音）", prog: [["D", "min", "i(Dm)"], ["G", "maj", "IV(G)"], ["D", "min", "i(Dm)"], ["G", "maj", "IV(G)"]], fb: ["D", "dorian"] },
    s39: { key: "D 混合利底亚 / G 大调", rn: "D – C – G（I–♭VII–IV 或 V–IV–I 双解）", prog: [["D", "maj", "D"], ["C", "maj", "C"], ["G", "maj", "G"], ["G", "maj", "G"]], fb: ["D", "mixolydian"] },
    s40: { key: "E 混合利底亚", rn: "I – ♭VII – I（E – D – E，含 ♭7 音 D♮）", prog: [["E", "maj", "I(E)"], ["D", "maj", "♭VII(D)"], ["E", "maj", "I(E)"]], fb: ["E", "mixolydian"] },
    s41: { key: "D 混合利底亚", rn: "I – ♭VII – IV – I（D – C – G – D）", prog: [["D", "maj", "I(D)"], ["C", "maj", "♭VII(C)"], ["G", "maj", "IV(G)"], ["D", "maj", "I(D)"]], fb: ["D", "mixolydian"] },
    s42: { key: "E 弗里几亚", rn: "i – ♭II（Em – F，含小二度 ♭2 特征音 F）", riff: [40, 41, 47, 45, 41, 40], prog: [["E", "min", "i(Em)"], ["F", "maj", "♭II(F)"], ["E", "min", "i(Em)"]], seq: "E – F – B – A – F – E", fb: ["E", "phrygian"] },
    s43: { key: "C 利底亚", rn: "1 – 3 – ♯4 – 6 – 5（含增四度 ♯4 特征音 F♯）", riff: [60, 64, 66, 69, 67, 64, 60], prog: [["C", "maj", "I(C)"], ["D", "maj", "II(D)"]], seq: "C – E – F♯(♯4) – A – G – E – C", fb: ["C", "lydian"] },

    s44: { key: "E 小调 / G 大调", rn: "iv7–♭VII7–♭IIImaj7–♭VImaj7–iiø7–V7–i（两组 ii–V–I）", prog: [["A", "m7", "Am7"], ["D", "dom7", "D7"], ["G", "maj7", "Gmaj7"], ["C", "maj7", "Cmaj7"], ["F♯", "m7b5", "F♯m7♭5"], ["B", "dom7", "B7"], ["E", "min", "Em"]], fb: ["E", "harmonic"] },
    s45: { key: "E 小调", rn: "Em – G – Am – Em – Bm – B♭ – Am – C – G – F – C – D", prog: [["E", "min", "Em"], ["G", "maj", "G"], ["A", "min", "Am"], ["E", "min", "Em"], ["B", "min", "Bm"], ["A", "min", "Am"], ["G", "maj", "G"], ["D", "maj", "D"]], fb: ["E", "minorPenta"] },
    s46: { key: "B 小调", rn: "i – V(F♯) – ♭VII(A) – IV(E) – ♭VI(G) – ♭III(D) – iv(Em) – V(F♯)", prog: [["B", "min", "Bm(i)"], ["F♯", "dom7", "F♯7(V)"], ["A", "maj", "A(♭VII)"], ["E", "maj", "E(IV)"], ["G", "maj", "G(♭VI)"], ["D", "maj", "D(♭III)"], ["E", "min", "Em(iv)"], ["F♯", "dom7", "F♯7(V)"]], fb: ["B", "harmonic"] },
    s47: { key: "F 大调", rn: "I – viiø/vi(Em7) – V7/vi(A7) – vi(Dm) – IV(B♭) – V(C) – I", prog: [["F", "maj", "F(I)"], ["E", "m7", "Em7"], ["A", "dom7", "A7(V/vi)"], ["D", "min", "Dm(vi)"], ["B♭", "maj", "B♭(IV)"], ["C", "dom7", "C7(V)"], ["F", "maj", "F(I)"]], fb: ["F", "major"] },
    s48: { key: "G 大调", rn: "I(G) – III7(B=V/vi) – IV(C) – iv(Cm，借用小四级)", prog: [["G", "maj", "G(I)"], ["B", "dom7", "B7(III7)"], ["C", "maj", "C(IV)"], ["C", "min", "Cm(iv)"]], fb: ["G", "major"] },
    s49: { key: "G 大调 → A♭ 大调", rn: "I – V/vi? 实际为 I–V–vi–IV 后副歌直接升半音转调（G → A♭）", prog: [["G", "maj", "G(I)"], ["D", "maj", "D(V)"], ["E", "min", "Em(vi)"], ["C", "maj", "C(IV)"], ["A♭", "maj", "A♭(转调新I)"]], fb: ["G", "major"] },
    s50: { key: "A 小调 ↔ A 大调", rn: "主歌 Am–Am/G–D/F♯–Fmaj7 → 副歌转同主音 A 大调（A–C♯m–F♯m–E）", prog: [["A", "min", "Am"], ["D", "maj", "D/F♯"], ["F", "maj7", "Fmaj7"], ["E", "dom7", "E7"]], fb: ["A", "minor"] },
    s51: { key: "自选调性", rn: "按 G15 四遍扒歌法：定主音 → 抓贝斯 → 辨性质 → 标强拍级数", prog: [["A", "m7", "i7"], ["D", "dom7", "IV7"], ["G", "maj7", "♭VIImaj7"], ["E", "dom7", "V7"]], fb: ["A", "dorian"] },
    s52: { key: "G 大调（6/8）", rn: "主歌 I – IV（Gmaj7 – Cmaj7）| 桥段 Gm – C（同主音小调借用）", prog: [["G", "maj7", "Gmaj7(I)"], ["C", "maj7", "Cmaj7(IV)"], ["G", "min", "Gm(i借用)"], ["C", "dom7", "C7"]], fb: ["G", "majorPenta"] },
    s53: { key: "G 大调", rn: "I – IV – V – IV（G – C – D – C，五声跨弦大跳 + 密排三和弦）", prog: [["G", "maj", "G(I)"], ["C", "maj", "C(IV)"], ["D", "maj", "D(V)"], ["C", "maj", "C(IV)"]], fb: ["G", "majorPenta"] },
    s54: { key: "F 大调", rn: "I – V/7 – vi – iii/5 – IV – I/3 – ii7 – V7（卡农级进低音线）", prog: [["F", "maj", "F(I)"], ["C", "maj", "C/E(V)"], ["D", "min", "Dm(vi)"], ["A", "min", "Am/C(iii)"], ["B♭", "maj", "B♭(IV)"], ["F", "maj", "F/A(I)"], ["G", "m7", "Gm7(ii)"], ["C", "dom7", "C7(V)"]], fb: ["F", "major"] },
    s55: { key: "G 大调", rn: "vi – IV – I – V（Em7 – C – G – D，华语最经典四和弦循环）", prog: [["E", "m7", "Em7(vi)"], ["C", "maj", "C(IV)"], ["G", "maj", "G(I)"], ["D", "maj", "D(V)"]], fb: ["G", "major"] }
  };

  function playSong(id, stepIdx) {
    const sc = SONG_CARDS[id];
    if (!sc) return;
    const Mu = M();
    if (typeof stepIdx === "number" && sc.prog && sc.prog[stepIdx]) {
      const [r, t] = sc.prog[stepIdx];
      const pc = Mu.parseName(r).pc;
      Mu.play(36 + pc, 0, 0.95);
      Mu.strum(Mu.chordMidis(pc, t), 0.035);
      return;
    }
    if (sc.riff && (!sc.prog || stepIdx === "riff")) {
      sc.riff.forEach((m, i) => Mu.play(m, i * 0.34, 0.92));
      return;
    }
    if (sc.prog) {
      sc.prog.forEach(([r, t], idx) => {
        const pc = Mu.parseName(r).pc;
        const d = idx * 0.68;
        Mu.play(36 + pc, d, 0.92);
        Mu.chordMidis(pc, t).forEach((m, i) => Mu.play(m, d + 0.025 + i * 0.025, 0.7));
      });
    }
  }

  function renderSongCard(id, compact) {
    const sc = SONG_CARDS[id];
    if (!sc) return "";
    const esc = C().esc;
    const Mu = M();
    const btns = [];
    if (sc.riff) {
      btns.push(`<button class="btn" data-act="hub-song-play" data-id="${id}" data-mode="riff">▶ 本地试听 Riff 旋律</button>`);
    }
    if (sc.prog) {
      btns.push(`<button class="btn" data-act="hub-song-play" data-id="${id}">▶ 本地试听和弦进行</button>`);
    }
    if (sc.fb) {
      const [r, t] = sc.fb;
      const tName = Mu.TYPE[t] ? Mu.TYPE[t].name : t;
      btns.push(`<a class="btn" href="#/fretboard?root=${encodeURIComponent(r)}&type=${t}">在指板打开 ${esc(r)} ${esc(tName)} ↗</a>`);
    }
    const chordPills = sc.prog
      ? `<div class="hub-chords">${sc.prog.map(([r, t, lab], i) => {
          const sym = Mu.TYPE[t] ? Mu.TYPE[t].sym : "";
          return `<button class="btn hub-ch" data-act="hub-song-step" data-id="${id}" data-i="${i}" title="单点试听此和弦"><b>${esc(r + sym)}</b><small>${esc(lab)}</small></button>`;
        }).join("")}</div>`
      : "";
    if (compact) {
      return `<div class="hub-song-bar">
        <span class="chip">${esc(sc.key)}</span>
        <code class="hub-rn">${esc(sc.rn)}</code>
        ${sc.seq ? `<span class="small muted">${esc(sc.seq)}</span>` : ""}
        <span class="hub-acts">${btns.join(" ")}</span>
        ${chordPills}
      </div>`;
    }
    return `<div class="hub-song-box">
      <div class="hub-song-meta">
        <span class="chip key">${esc(sc.key)}</span>
        <span><b>核心级数/结构：</b><code>${esc(sc.rn)}</code></span>
        ${sc.seq ? `<span class="small muted">音符序列：${esc(sc.seq)}</span>` : ""}
      </div>
      ${chordPills}
      <div class="btn-row" style="margin-top:6px">${btns.join("")}</div>
    </div>`;
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    if (a === "hub-song-play") {
      playSong(el.dataset.id, el.dataset.mode === "riff" ? "riff" : undefined);
    } else if (a === "hub-song-step") {
      playSong(el.dataset.id, Number(el.dataset.i));
    }
  });

  window.RES_GUIDES = RES_GUIDES;
  window.SONG_CARDS = SONG_CARDS;
  window.LocalHub = { guideFor, renderResDigest, renderSongCard, playSong };
})();
