// 曲目分析：和模块并行，每天分析 1 首（或 1 段），把刚学的乐理放回真实的歌里
// 阶段跨度按模块定义，跟随设置里的开始日期和节奏自动计算
// 曲目：[编号, 曲名, 艺人, 看点, 上琴任务]
// 和弦与调性以常见记谱为准，不同版本、不同调弦会有出入；以原录音为准
window.SONGS = [
  {
    id: "S1", name: "听音程、数节拍", from: "G1", to: "G3",
    focus: "在指板上找出旋律和 riff 的每个音，说出音程和拍号",
    items: [
      ["s01", "Smoke on the Water", "Deep Purple", "G 小调 riff：G–B♭–C、G–B♭–D♭–C；原版用纯四度双音弹", "先在 6 弦单音弹，说出每个音名；再在 4、3 弦用同品的纯四度双音弹"],
      ["s02", "Seven Nation Army", "The White Stripes", "E–E–G–E–D–C–B：小三度上行，再级进下行；最后 C–B 是小二度", "在 5 弦上弹 7-7-10-7-5-3-2，说出每两个相邻音的音程"],
      ["s03", "小星星", "儿歌", "开头 1 1 5 5：纯五度上行", "从 6 弦任意品起，用“下一根弦 +2 品”的形状弹出纯五度，换 3 个根音", "Twinkle Twinkle Little Star"],
      ["s04", "婚礼进行曲（Bridal Chorus）", "Wagner", "开头“Here comes the bride”是纯四度上行", "用相邻弦同品的形状弹出纯四度，再在同一根弦上弹（差 5 品）", "Wagner Bridal Chorus Lohengrin"],
      ["s05", "大白鲨主题", "John Williams", "两个音来回：小二度，最紧张的音程之一", "同一根弦相邻两品来回弹，逐渐加速，感受小二度的张力", "Jaws theme John Williams"],
      ["s06", "Somewhere Over the Rainbow", "Harold Arlen", "开头“Some-where”是八度大跳", "用 6→4 弦 +2 品、4→2 弦 +3 品两种八度形状弹出开头两个音"],
      ["s07", "Maria（《西区故事》）", "Leonard Bernstein", "“Ma-ri-a”：C–F♯–G，三全音之后上行半音解决", "弹 C–F♯，停住，再弹 G；对比只弹 C–G 的听感", "Maria West Side Story Bernstein"],
      ["s08", "We Will Rock You", "Queen", "跺、跺、拍：两个八分音符 + 一个四分音符，每两拍一次，4/4；拍手落在 2、4 拍，就是反拍重音", "开节拍器，嘴里数“1 & 2，3 & 4”，用闷音扫弦打出这个节奏型"],
      ["s09", "Pride and Joy", "Stevie Ray Vaughan", "德州 shuffle：长–短的三连音律动；原版降半音调弦", "节拍器打四分，6 弦闷音弹 shuffle 八分音符，再加上 5–6 根音律动"],
      ["s10", "Nothing Else Matters", "Metallica", "6/8：每小节两大拍，每拍三个八分音符；前奏用空弦 E–G–B–E 琶音", "跟原曲拍脚，确认每小节踩两下；数“1 2 3 4 5 6”弹前奏"],
      ["s11", "Happy Birthday", "传统歌曲", "3/4，从弱起开始：5 5 | 6 5 1 | 7", "数“1 2 3”拍手唱，找出强拍落在哪个字上；再在 C 大调里弹出旋律"]
    ]
  },
  {
    id: "S2", name: "音阶、调与和弦", from: "G4", to: "G6",
    focus: "找出歌曲的调，用级数写下和弦，认出和弦的类型和指型",
    items: [
      ["s12", "Knockin' on Heaven's Door", "Bob Dylan", "G 大调：G–D–Am / G–D–C，即 I–V–ii / I–V–IV", "用 CAGED 换到第 3 品以上的指型弹同一个进行"],
      ["s13", "Let It Be", "The Beatles", "C 大调：C–G–Am–F（I–V–vi–IV），之后 C–G–F–C", "说出每个和弦的 1、3、5 音，在 2、3、4 弦上找出这三个音"],
      ["s14", "Here Comes the Sun", "The Beatles", "变调夹夹第 7 品弹 D 指型，实际是 A 大调；桥段用了不规则的混合拍子", "不用变调夹，用 E 型、A 型横按在 A 大调里弹主歌和弦；数出桥段每小节有几拍"],
      ["s15", "Message in a Bottle", "The Police", "C♯m–A–B–F♯m，用的是“根音–五度–九度”的指型，没有三音", "弹出这个指型，再补上三音，对比声音有什么变化"],
      ["s16", "Purple Haze", "Jimi Hendrix", "E7♯9 = E–G♯–B–D–F𝄪：同时有大三度和听起来像小三度的 ♯9；前奏 B♭ 对 E 是三全音", "按出 E7♯9，说出每根弦是几度；单独弹 E 和 B♭，听三全音"],
      ["s17", "Paranoid", "Black Sabbath", "以 E5 为中心，穿插 D5、G5：强力和弦没有三音", "在 6、5 弦和 5、4 弦两种位置弹强力和弦，说出每个和弦的根音"],
      ["s18", "Something", "The Beatles", "C–Cmaj7–C7–F：和弦里的一条内声部 C–B–B♭–A 半音下行", "在 2、3、4 弦上只弹这条半音线，再补成完整和弦"]
    ]
  },
  {
    id: "S3", name: "级数、功能与小调", from: "G7", to: "G9",
    focus: "用罗马数字分析进行，听出 T–S–D，认出小调里的大 V",
    items: [
      ["s19", "Stand By Me", "Ben E. King", "A 大调：A–F♯m–D–E，即 I–vi–IV–V（doo-wop 进行）", "把这个进行转到 C、G、E 三个调，用级数而不是和弦名记"],
      ["s20", "Don't Stop Believin'", "Journey", "E 大调：E–B–C♯m–A（I–V–vi–IV），再 E–B–G♯m–A（iii 代替 vi）", "两种进行交替弹，说出 vi 和 iii 共用哪两个音"],
      ["s21", "Basket Case", "Green Day", "E♭ 大调：I–V–vi–iii–IV–I–V，和卡农的进行同源", "在 E 大调里弹同样的级数，录音后和原曲对比"],
      ["s22", "Hallelujah", "Leonard Cohen", "歌词“the fourth, the fifth, the minor fall, the major lift”正好对应 F–G–Am–F（C 大调）", "边唱这句边换和弦，确认每个词落在哪个和弦上"],
      ["s23", "Hey Joe", "Jimi Hendrix", "C–G–D–A–E：每个和弦都比上一个高纯五度，最后落在 E", "在五度圈上找出这条路线；以 E 为主，写出每个和弦的级数"],
      ["s24", "Fly Me to the Moon", "Bart Howard", "Am7–Dm7–G7–Cmaj7–Fmaj7–Bm7♭5–E7–Am：沿五度圈下行", "标出每个和弦在 C 大调里的级数，找出唯一一个调外和弦（E7）"],
      ["s25", "All Along the Watchtower", "Jimi Hendrix", "C♯m–B–A：i–♭VII–♭VI，自然小调的下行", "在 C♯ 小调里写出 i 到 ♭VII 七个顺阶和弦，确认这三个都在里面"],
      ["s26", "Stairway to Heaven（前奏）", "Led Zeppelin", "A 小调，低音 A–G♯–G–F♯–F 半音下行", "只弹低音线，再加上高音部分；说出 G♯ 来自哪种小调", "Stairway to Heaven Led Zeppelin"],
      ["s27", "House of the Rising Sun", "The Animals", "Am–C–D–F–Am–C–E，6/8；E 是和声小调的大 V，D 带着多利亚色彩的 F♯", "用分解和弦弹完整进行，单独对比 E 和 Em 回到 Am 的感觉"],
      ["s28", "Sultans of Swing", "Dire Straits", "Dm–C–B♭–A：i–♭VII–♭VI–V，常称为安达卢西亚终止", "弹这四个和弦，说出 A 和弦里哪个音不在 D 自然小调里"],
      ["s29", "Black Magic Woman", "Santana", "D 小调：Dm–Am–Dm–Gm–Dm–A7–Dm，同时出现小 v 和大 V7", "对比 Am → Dm 和 A7 → Dm 两次解决的力度"],
      ["s30", "Smells Like Teen Spirit", "Nirvana", "F5–B♭5–A♭5–D♭5：四个强力和弦循环，主音和调性有争议", "列出两种解释（F 小调或 F 混合利底亚等），各说一个理由"]
    ]
  },
  {
    id: "S4", name: "五声、布鲁斯与调式", from: "G10", to: "G12",
    focus: "认出 riff 和独奏用的音阶，听出 12 小节结构和调式的特征音",
    items: [
      ["s31", "Sunshine of Your Love", "Cream", "D–D–C–D–A♭–G–F–D：D 布鲁斯音阶，A♭ 是 ♭5", "弹 riff，说出每个音是 D 布鲁斯音阶的几级"],
      ["s32", "Johnny B. Goode", "Chuck Berry", "B♭ 调 12 小节布鲁斯；前奏是双音弹法", "跟原曲数 12 小节，标出 I、IV、V 各从第几小节开始"],
      ["s33", "The Thrill Is Gone", "B.B. King", "B 小调布鲁斯：Bm–Em–Bm–G–F♯7–Bm，最后一句是 ♭VI–V", "在 B 小调五声第一把位即兴，换到 F♯7 时落在 A♯"],
      ["s34", "Crossroads", "Cream", "A 调布鲁斯，独奏混用大调五声和小调五声", "在 A 大调五声和 A 小调五声之间来回切换，各弹 4 小节"],
      ["s35", "Red House", "Jimi Hendrix", "慢布鲁斯，12/8：每拍三个八分音符", "数“1 2 3, 2 2 3…”跟原曲走完一遍 12 小节"],
      ["s36", "Comfortably Numb", "Pink Floyd", "独奏在 B 小调；副歌 D–A–C–G，C 是 ♭VII", "在 B 小调五声里找出 Gilmour 推弦常用的目标音"],
      ["s37", "Oye Como Va", "Santana", "Am7–D9 往返：D 和弦里的 F♯ 是 A 多利亚的 ♮6", "在 Am7–D9 上即兴，刻意在 D9 上弹 F♯"],
      ["s38", "Another Brick in the Wall, Part 2", "Pink Floyd", "Dm–G：G 和弦里的 B 是 D 多利亚的 ♮6", "把 G 换成 Gm 弹一遍，对比多利亚和自然小调"],
      ["s39", "Sweet Home Alabama", "Lynyrd Skynyrd", "D–C–G 循环：是 D 混合利底亚还是 G 大调，一直有争议", "分别以 D 和 G 为家各即兴一遍，说出你听到的家在哪里"],
      ["s40", "Norwegian Wood", "The Beatles", "E 调（变调夹第 2 品弹 D 指型），旋律里的 D♮ 是混合利底亚的 ♭7", "在 E 上弹 E 大调音阶和 E 混合利底亚，对比 D♯ 与 D♮"],
      ["s41", "Sweet Child O' Mine", "Guns N' Roses", "主歌 D–C–G，常被当成混合利底亚的例子；原版降半音调弦", "分析前奏 riff 用了哪些音，说出它属于哪个音阶"],
      ["s42", "Wherever I May Roam", "Metallica", "常被拿来当 E 弗里几亚的例子：E 与 F 之间的小二度", "在 E 持续音上弹 E 弗里几亚，强调 F"],
      ["s43", "The Simpsons Theme", "Danny Elfman", "常被拿来当利底亚的例子：旋律里有 ♯4", "在 C 上弹 C 大调和 C 利底亚，对比 F 与 F♯"]
    ]
  },
  {
    id: "S5", name: "和弦音、调外和弦与扒歌", from: "G13", to: "G15",
    focus: "跟着和弦即兴，解释调外和弦，完整扒下一段独奏",
    items: [
      ["s44", "Autumn Leaves", "Joseph Kosma", "Am7–D7–Gmaj7–Cmaj7–F♯m7♭5–B7–Em：两组 ii–V", "只用每个和弦的 3、7 音走一遍，找出半音相连的引导线"],
      ["s45", "Little Wing", "Jimi Hendrix", "和弦里加入击弦、勾弦和双音装饰", "选一个和弦，用 1～2 个装饰音让它动起来，录 8 小节"],
      ["s46", "Hotel California", "Eagles", "Bm–F♯–A–E–G–D–Em–F♯：B 小调，F♯ 是大 V；结尾双吉他和声", "写出每个和弦的级数；扒结尾一段双吉他里的一条"],
      ["s47", "Yesterday", "The Beatles", "F 大调：F–Em7–A7–Dm，Em7–A7 是指向 vi 的 ii–V", "弹到 A7 时找出 C♯，说出它为什么不在 F 大调里"],
      ["s48", "Creep", "Radiohead", "G–B–C–Cm：B 是 V/vi 却去了 C；C–Cm–G 里有 E–E♭–D 的半音下行", "只弹这条半音线；再说出 B 和弦的 D♯ 去了哪里"],
      ["s49", "Man in the Mirror", "Michael Jackson", "后段整体上移半音转调", "找到转调的位置，说出转调前后的调"],
      ["s50", "While My Guitar Gently Weeps", "The Beatles", "Am–Am/G–Am/F♯–Fmaj7：低音 A–G–F♯–F 下行；桥段转到 A 大调", "只弹低音线；说出主歌和桥段是关系调还是同主音调"],
      ["s51", "自选一段独奏", "你喜欢的吉他手", "综合：调、和弦进行、音阶、和弦音、技巧", "按“扒歌流程”完整扒下 8～16 小节，写出每个强拍音的级数", false],
      ["s52", "Gravity", "John Mayer", "G 大调（6/8 慢蓝调摇滚）：主歌 G–C（I–IV），极简五声与目标音推弦教科书", "用 G 大调五声与小调五声混合弹主歌间隙的 fill，每次换到 C 时瞄准 E 音"],
      ["s53", "Cliffs of Dover（前奏与主题）", "Eric Johnson", "G 大调：五声音阶与大调音阶的宽音程跳进（string skipping），干净的三和弦转位分解", "用 2-3-4 弦三和弦转位弹主题和弦，体会五声音阶和三和弦挂钩", "Cliffs of Dover Eric Johnson"],
      ["s54", "海阔天空", "Beyond", "F 大调：F–C–Dm–Am–B♭–F–Gm–C（经典卡农下行 bass 线），尾奏独奏紧扣和弦音推弦", "弹一遍主歌低音走向（F–E–D–C–B♭–A–G–C），再把尾奏第一句的推弦目标音找出来"],
      ["s55", "晴天", "周杰伦", "G 大调：Em7–C–G–D（vi–IV–I–V）典型流行四和弦循环，前奏经典大调音阶下行双音", "用 1-2-3 弦三和弦转位弹出副歌循环，并试着改写一段用 I–V–vi–IV 对比听感"]
    ]
  }
];

// 每日短练：按阶段推荐，每次 5～10 分钟，节拍器常开
window.DRILLS = [
  { phase: "P1", t: "指板找音", hint: "指板页“找音”：一个音在 6 根弦上全部找出来，记录用时", link: "#/fretboard" },
  { phase: "P1", t: "指板识别练习", hint: "本站指板练习（或 musictheory.net），先只练自然音，再勾选升降音", link: "#/fretboard", res: "mtnExFret" },
  { phase: "P1", t: "音程听辨", hint: "在本站练耳室先开“基础 5 种”（纯四/纯五/八度/大三/小三），稳定后再扩范围", link: "#/ear?tab=int", res: "mtnExEarInt" },
  { phase: "P1", t: "节奏细分切换", hint: "在本站节拍器开 60 BPM“细分阶梯”，四分 → 八分 → 三连音 → 十六分自动轮换", link: "#/ear?tab=metro" },
  { phase: "P2", t: "五度圈默写", hint: "默写 12 个大调和调号，再用指板页「五度圈实验室」核对", link: "#/fretboard" },
  { phase: "P2", t: "一个和弦走遍 CAGED", hint: "随机一个和弦，在本站指板依次切换 C→A→G→E→D 把位聚焦并上琴弹响", link: "#/fretboard" },
  { phase: "P2", t: "三组弦转位", hint: "在本站指板「实战指型库」点听 4-3-2 与 3-2-1 弦密排三和弦三转位", link: "#/fretboard" },
  { phase: "P2", t: "和弦听辨", hint: "在本站练耳室先练四种三和弦，熟练后切五种七和弦", link: "#/ear?tab=chord", res: "mtnExEarChord" },
  { phase: "P3", t: "顺阶和弦", hint: "随机一个调，弹出 I 到 vii° 七个和弦，边弹边念罗马数字", link: "#/fretboard" },
  { phase: "P3", t: "听级数", hint: "在本站「功能级数听辨」（I–IV–V–I 定调）先只练 1/3/5，再开全部 7 级", link: "#/ear?tab=deg", res: "fet" },
  { phase: "P3", t: "一个进行三个调", hint: "在本站「进行听辨」盲听 I–vi–IV–V 与 ii–V–I，并在琴上换 3 个调", link: "#/ear?tab=prog" },
  { phase: "P4", t: "五声把位连接", hint: "A 小调五声 5 个把位依次连接，上行下行；再换到 E、G 调", link: "#/fretboard?root=A&type=minorPenta" },
  { phase: "P4", t: "12 小节布鲁斯", hint: "打开本站「伴奏循环 (Jam)」选 12 小节布鲁斯，一遍弹壳和弦节奏，一遍瞄准目标音即兴", link: "#/ear?tab=jam", res: "jgBlues1" },
  { phase: "P4", t: "调式特征音", hint: "打开本站指板「持续音伴奏」或 Jam 室調式 Vamp，依次弹多利亚、混合利底亚、利底亚特征音", link: "#/ear?tab=jam" },
  { phase: "P5", t: "引导线", hint: "打开本站 Jam 室「爵士 ii7–V7–Imaj7–VI7」，只弹每个和弦的 3、7 音半音连接", link: "#/ear?tab=jam" },
  { phase: "P5", t: "调外和弦识别", hint: "打开本站「进行听辨 → 调外副属与借用」或曲目表，听辨 V/x 与借用 iv", link: "#/ear?tab=prog" },
  { phase: "P5", t: "扒 2 小节", hint: "每天扒 2 小节旋律或独奏，先唱，再找音，最后写下级数", link: "#/songs", res: "transcribe" }
];

// 分析一首歌的步骤：曲目分析页按这个顺序做
window.ANALYSIS_STEPS = [
  ["听", "完整听一遍，标出段落：前奏、主歌、预副歌、副歌、桥段、间奏", "一行段落图"],
  ["找家", "哪个和弦或哪个音听起来像家；开头、结尾、副歌最后落在哪里", "调和主音"],
  ["记和弦", "按小节写下和弦，再写成罗马数字", "级数进行"],
  ["找调外", "标出不在调里的和弦或音，判断是副属、借用、调式还是转调", "一句解释"],
  ["看旋律", "旋律或独奏用了什么音阶，强拍落在哪些和弦音上", "音阶 + 关键音"],
  ["上琴", "完整弹一遍，录音和原曲对比", "一段录音"],
  ["结论", "这首歌最值得“偷”的一个点，用在你自己的即兴或创作里", "一句话"]
];

// 练习原则与常见误区（作品与里程碑页）
window.PRACTICE = {
  rules: [
    "三通：每个知识点都要弹得出、听得出、说得出。只会说不会弹，或只会弹说不出，都算没学会",
    "节拍器常开。乐理练习也一样：找音、换和弦、即兴，都要在拍子上",
    "录音回听。即兴和扒歌一定要录下来，隔一天再听，问题会比当时明显得多",
    "先听后看。分析一首歌之前先自己听、自己猜，再去查和弦谱和 TAB",
    "短时间、多次数。指板找音、听辨这类练习每天 5～10 分钟，比周末练 2 小时有效",
    "每个模块留一个产出：一张图、一段录音、一页分析，后面复习和反问都靠它"
  ],
  traps: [
    "只背指型：五个把位背得很熟，却说不出每个点是几级，一换调或换和弦就乱",
    "只学不弹：讲义看懂了、题会做了，上琴却找不到音",
    "过早追求复杂：五声和和弦音还没跟住和弦，就去学异域音阶和超级和弦",
    "把“规则”当法律：功能、调式、终止都是描述常见做法的框架，听到不符合的就去理解它为什么好听",
    "完全依赖 TAB：TAB 告诉你按哪里，不告诉你为什么；不扒歌，耳朵就练不出来",
    "调式只学“从第几级开始”：不把主音确立起来，弹出来的仍然是原来那个大调"
  ],
  note: "曲目里的和弦和调性以常见记谱为准，不同版本、不同调弦（很多摇滚乐队降半音）会有出入。查到的和弦谱也常有错，最后都以原录音为准。"
};
