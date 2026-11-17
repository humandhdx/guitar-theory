// G3～G15 课程核心双语精读卡片（由 build/gen_reading_ext.py 生成，与 data-reading.js 合并进 window.READING）
// 每条带英文对照、术语悬停释义与原教材直达链接
window.READING = Object.assign(window.READING || {}, {
  "g3-int-name": {
    "t": "音程的度数与性质",
    "te": "Interval Size and Quality",
    "src": "双语精读 · 对应 OMT: Intervals",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/intervals/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Interval Size and Quality</span><span class=\"zh\">音程的度数与性质</span></h4><p><span class=\"en\">An <b class=\"gl\" title=\"The distance between two pitches\">interval</b> has two parts: size (a number like 3rd or 5th) and quality (major, minor, perfect, augmented, or diminished).</span><span class=\"zh\">一个<b class=\"gl\" title=\"The distance between two pitches\">音程</b>由两部分组成：度数（如三度、五度）和性质（大、小、纯、增、减）。</span></p><p><span class=\"en\">Size depends strictly on letter names, counting both the starting and ending letters. From C to E♭ is a 3rd (C–D–E), whereas from C to D♯ is a 2nd (C–D), even though both span 3 semitones on the guitar.</span><span class=\"zh\">度数完全由字母距离决定（包含首尾字母）。C 到 E♭ 经过 C–D–E，是三度；而 C 到 D♯ 只经过 C–D，是二度，即使两者在吉他上都相差 3 个半音。</span></p><p><span class=\"en\">Unisons, fourths, fifths, and octaves belong to the <b>perfect</b> family (they are never major or minor). Seconds, thirds, sixths, and sevenths belong to the <b>major/minor</b> family (they are never perfect).</span><span class=\"zh\">一度、四度、五度、八度属于<b>纯音程家族</b>（没有大小之分）；二度、三度、六度、七度属于<b>大小音程家族</b>（没有纯的说法）。</span></p>"
  },
  "g3-int-inv": {
    "t": "音程转位与等音程",
    "te": "Interval Inversion and Enharmonic Intervals",
    "src": "双语精读 · 对应 OMT: Intervals",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/intervals/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Interval Inversion and Enharmonic Intervals</span><span class=\"zh\">音程转位与等音程</span></h4><p><span class=\"en\">To <b>invert</b> an interval, move the lower note up an octave (or the upper note down an octave). The two sizes always add up to <b>9</b>, and the semitones add up to <b>12</b>.</span><span class=\"zh\">把低音升高八度（或高音降低八度）称为<b>转位</b>。原位与转位音程的度数之和永远等于 <b>9</b>，半音数之和永远等于 <b>12</b>。</span></p><p><span class=\"en\">Under inversion: Major becomes minor (and vice versa), Augmented becomes diminished (and vice versa), and Perfect stays Perfect. Thus a major 3rd (4 semitones) inverts to a minor 6th (8 semitones).</span><span class=\"zh\">转位后的性质规律：大↔小，增↔减，纯保持为纯。因此大三度（4 半音）转位后就是小六度（8 半音）。</span></p><p><span class=\"en\"><b>Tritone</b> (6 semitones) can be spelled either as an augmented 4th (C–F♯) or a diminished 5th (C–G♭). Spelling indicates harmonic resolution: A4 tends to expand outward, while d5 tends to contract inward.</span><span class=\"zh\"><b>三全音</b>（6 半音）既能拼成增四度（C–F♯），也能拼成减五度（C–G♭）。拼写指明了和声走向：增四度倾向向外扩张解决，减五度倾向向内收缩解决。</span></p>"
  },
  "g3-int-fret": {
    "t": "吉他指板上的音程几何与 3–2 弦补偿",
    "te": "Fretboard Interval Geometry & the B-String Shift",
    "src": "双语精读 · 吉他指板专题",
    "u": "https://www.justinguitar.com/modules/notes-sharps-flats-octaves",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Fretboard Interval Geometry &amp; the B-String Shift</span><span class=\"zh\">吉他指板上的音程几何与 3–2 弦补偿</span></h4><p><span class=\"en\">In standard tuning (E–A–D–G–B–E), adjacent string pairs 6–5, 5–4, 4–3, and 2–1 are tuned a <b>perfect fourth (5 semitones)</b> apart, while 3–2 (G–B) is tuned a <b>major third (4 semitones)</b> apart.</span><span class=\"zh\">标准调弦（E–A–D–G–B–E）中，6–5、5–4、4–3、2–1 弦相邻都差<b>纯四度（5 半音）</b>，唯独 3–2 弦（G–B）只差<b>大三度（4 半音）</b>。</span></p><p><span class=\"en\">Therefore, moving to the next higher string subtracts 5 semitones—unless you cross the 3–2 boundary, which only subtracts 4 semitones. Any interval shape crossing the 3–2 pair shifts <b>1 fret higher</b>.</span><span class=\"zh\">因此往高音弦换一根弦等同于减 5 个半音；只要跨过 3–2 弦只减了 4 个半音，所以<b>任何跨过 3–2 弦的音程与八度形状都要向高品多挪 1 品</b>。</span></p>"
  },
  "g4-maj-tetra": {
    "t": "大调公式与对称四音列",
    "te": "The Major Scale Formula & Tetrachords",
    "src": "双语精读 · 对应 OMT: Major Scales",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">The Major Scale Formula &amp; Tetrachords</span><span class=\"zh\">大调公式与对称四音列</span></h4><p><span class=\"en\">A <b class=\"gl\" title=\"A scale with pattern W-W-H-W-W-W-H\">major scale</b> follows the fixed pattern of whole (W) and half (H) steps: <b>W–W–H–W–W–W–H</b> (2–2–1–2–2–2–1 frets on one guitar string).</span><span class=\"zh\"><b class=\"gl\" title=\"A scale with pattern W-W-H-W-W-W-H\">大调音阶</b>遵循固定的全半音步公式：<b>全–全–半–全–全–全–半</b>（在单根吉他弦上就是 2–2–1–2–2–2–1 品）。</span></p><p><span class=\"en\">It consists of two identical <b>tetrachords</b> (four-note W–W–H patterns) separated by a whole step. Taking the upper tetrachord of C major (G–A–B–C) as the lower tetrachord of a new scale generates G major (requiring F♯).</span><span class=\"zh\">它可以拆成两个完全相同的<b>四音列（全–全–半）</b>中间隔一个全音。拿 C 大调的后半四音列（G–A–B–C）作起点，只需把 7 级升成 F♯，就自动生成高纯五度的 G 大调。</span></p>"
  },
  "g4-maj-deg": {
    "t": "音级名称、导音与调号速算",
    "te": "Scale Degrees, Leading Tone & Key Signatures",
    "src": "双语精读 · 对应 OMT: Major Scales",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Scale Degrees, Leading Tone &amp; Key Signatures</span><span class=\"zh\">音级名称、导音与调号速算</span></h4><p><span class=\"en\">The seven scale degrees are named: 1 Tonic, 2 Supertonic, 3 Mediant, 4 Subdominant, 5 Dominant, 6 Submediant, and <b>7 Leading Tone</b> (a half step below tonic, pulling upward toward 1).</span><span class=\"zh\">七个音级依次叫：1 主音、2 上主音、3 中音、4 下属音、5 属音、6 下中音、<b>7 导音</b>（离主音仅差半音，产生强烈往上解决到 1 级的牵引力）。</span></p><p><span class=\"en\">Every diatonic scale uses each of the seven letters A–G exactly once. Order of sharps: <b>F–C–G–D–A–E–B</b> (last sharp + 1 half step = Tonic). Order of flats: <b>B–E–A–D–G–C–F</b> (second-to-last flat = Tonic, with 1 flat = F).</span><span class=\"zh\">自然音阶必须把七个字母各用一次。升号顺序 <b>F–C–G–D–A–E–B</b>（最后一个升号上半音 = 主音）；降号顺序 <b>B–E–A–D–G–C–F</b>（1 降 = F，2 个以上倒数第二个降号 = 主音）。</span></p>"
  },
  "g4-cof-use": {
    "t": "五度圈与吉他 CAGED / 3NPS 视野",
    "te": "Circle of Fifths, CAGED & 3NPS on Guitar",
    "src": "双语精读 · 五度圈与指板视野",
    "u": "https://en.wikipedia.org/wiki/Circle_of_fifths",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Circle of Fifths, CAGED &amp; 3NPS on Guitar</span><span class=\"zh\">五度圈与吉他 CAGED / 3NPS 视野</span></h4><p><span class=\"en\">Moving clockwise around the <b class=\"gl\" title=\"A geometric diagram organizing the 12 pitch classes by fifths\">Circle of Fifths</b> adds one sharp (up a P5); moving counterclockwise adds one flat (up a P4 / down a P5). Adjacent keys share 6 out of 7 notes.</span><span class=\"zh\">沿<b class=\"gl\" title=\"A geometric diagram organizing the 12 pitch classes by fifths\">五度圈</b>顺时针走每步加 1 升号（上行纯五度）；逆时针每步加 1 降号（上行纯四度）。相邻两调共享 6 个音，只差 1 个音。</span></p><p><span class=\"en\">On guitar, <b>CAGED positions</b> anchor scale boxes to chord shapes (ideal for chord-tone soloing), whereas <b>3-Notes-Per-String (3NPS)</b> puts exactly three notes on every string (ideal for legato and alternate picking speed).</span><span class=\"zh\">在吉他上，<b>CAGED 把位</b>把音阶锚定在可按出的和弦指型上（最利和弦内音即兴），而<b>三音一弦（3NPS）</b>强迫每弦 3 个音（最利连奏与交替拨弦速度）。</span></p>"
  },
  "g5-triad-q": {
    "t": "四种三和弦与转位记号",
    "te": "Triad Qualities and Inversions",
    "src": "双语精读 · 对应 OMT: Triads & Inversion",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/triads/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Triad Qualities and Inversions</span><span class=\"zh\">四种三和弦与转位记号</span></h4><p><span class=\"en\">A <b class=\"gl\" title=\"A three-note chord stacked in thirds\">triad</b> stacks two thirds above a root: <b>Major</b> (M3+m3: 1–3–5), <b>Minor</b> (m3+M3: 1–♭3–5), <b>Diminished</b> (m3+m3: 1–♭3–♭5), and <b>Augmented</b> (M3+M3: 1–3–♯5).</span><span class=\"zh\"><b class=\"gl\" title=\"A three-note chord stacked in thirds\">三和弦</b>由两个三度叠成：<b>大三</b>（1–3–5）、<b>小三</b>（1–♭3–5）、<b>减三</b>（1–♭3–♭5）和<b>增三</b>（1–3–♯5）。三音定大小，五音定稳定度。</span></p><p><span class=\"en\">Inversion depends strictly on the <b>lowest-sounding pitch (bass note)</b>: root position (1 in bass), first inversion (3 in bass, e.g. <code>C/E</code>), and second inversion (5 in bass, e.g. <code>C/G</code>).</span><span class=\"zh\">转位完全取决于<b>最低音</b>是谁：原位（根音在低音）、第一转位（三音在低音，记作 <code>C/E</code>）、第二转位（五音在低音，记作 <code>C/G</code>）。</span></p>"
  },
  "g5-caged": {
    "t": "CAGED 几何逻辑与三弦组声部连接",
    "te": "CAGED Logic & String-Set Voice Leading",
    "src": "双语精读 · 对应 JustinGuitar CAGED Logic",
    "u": "https://www.justinguitar.com/guitar-lessons/caged-logic-ch-900",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">CAGED Logic &amp; String-Set Voice Leading</span><span class=\"zh\">CAGED 几何逻辑与三弦组声部连接</span></h4><p><span class=\"en\">Moving open chord shapes C, A, G, E, and D up the neck as barre shapes always yields the fixed cycle <b>C → A → G → E → D → C</b>. The high-fret boundary of each shape shares the root or chord tones of the next shape.</span><span class=\"zh\">把开放 C、A、G、E、D 五个大三指型用横按推上高把位，顺序永远固定为 <b>C → A → G → E → D → C</b>。前一指型的高品边界正好与下一指型的低品根音无缝重合。</span></p><p><span class=\"en\">For rhythm guitar in a band, playing 3-note triads on adjacent string sets (1-2-3 or 2-3-4) with smooth <b>voice leading</b> (keeping common tones and moving other voices by step) sounds cleaner and avoids clashing with the bass.</span><span class=\"zh\">在乐队伴奏中，只在 1-2-3 或 2-3-4 三根弦上弹三和弦转位并做<b>声部连接</b>（共同音不动、其余音级进），颗粒最干净且绝不和贝斯打架。</span></p>"
  },
  "g6-sev-types": {
    "t": "五种核心七和弦与符号默认规则",
    "te": "Five Seventh Chord Qualities & Symbol Defaults",
    "src": "双语精读 · 对应 OMT: Seventh Chords & Chord Symbols",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/seventh-chords/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Five Seventh Chord Qualities &amp; Symbol Defaults</span><span class=\"zh\">五种核心七和弦与符号默认规则</span></h4><p><span class=\"en\">Five core seventh chords: <b>maj7</b> (1–3–5–7), <b>7</b> (dominant, 1–3–5–♭7), <b>m7</b> (1–♭3–5–♭7), <b>m7♭5 / ø7</b> (half-diminished, 1–♭3–♭5–♭7), and <b>dim7</b> (fully diminished, 1–♭3–♭5–𝄫7).</span><span class=\"zh\">五种核心七和弦：<b>maj7</b>（大七 1–3–5–7）、<b>7</b>（属七 1–3–5–♭7）、<b>m7</b>（小七 1–♭3–5–♭7）、<b>m7♭5/ø7</b>（半减七 1–♭3–♭5–♭7）、<b>dim7</b>（减七 1–♭3–♭5–𝄫7）。</span></p><p><span class=\"en\">Chord symbol defaults: a plain letter means a major triad; a plain number <code>7</code> (or <code>9/11/13</code>) <b>implies a minor 7th (♭7)</b>; major 7ths require <code>maj7</code>; <code>add9</code> omits the 7th; <code>sus2/sus4</code> replace the 3rd.</span><span class=\"zh\">符号默认规则：单独字母 = 大三；单独写 <code>7</code>（或 <code>9/11/13</code>）<b>默认含小七度 ♭7</b>；大七度必须写 <code>maj7</code>；<code>add9</code> 没有七音；<code>sus2/sus4</code> 用 2 或 4 音彻底替代了 3 音。</span></p>"
  },
  "g6-shell": {
    "t": "壳和弦（1-3-7）与引导声部",
    "te": "Shell Voicings (1-3-7) and Guide Tones",
    "src": "双语精读 · 对应 OMT: Jazz Voicings",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/jazz-voicings/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Shell Voicings (1-3-7) and Guide Tones</span><span class=\"zh\">壳和弦（1-3-7）与引导声部</span></h4><p><span class=\"en\">In chord voicings on guitar, the <b>3rd and 7th</b> define the chord's major/minor and functional identity, whereas the <b>5th</b> adds weight without defining quality and is routinely omitted.</span><span class=\"zh\">吉他按弦编配时，<b>3 音和 7 音</b>决定了和弦的大小性质与功能倾向；而纯五度 <b>5 音</b>不提供核心色彩，最常被省略。</span></p><p><span class=\"en\"><b>Shell voicings</b> use only Root + 3rd + 7th (on strings 6-4-3 or 5-4-3). In a 12-bar blues or ii–V–I, the 7th of each chord resolves down by half step to the 3rd of the next chord.</span><span class=\"zh\"><b>壳和弦</b>只弹 1–3–7 三根弦（常放在 6-4-3 或 5-4-3 弦）。在布鲁斯或 ii–V–I 里，前一个和弦的 7 音正好能半音下行落入下一个和弦的 3 音。</span></p>"
  },
  "g7-roman": {
    "t": "大调顺阶和弦与罗马数字分析",
    "te": "Diatonic Chords and Roman Numeral Analysis",
    "src": "双语精读 · 对应 OMT: Roman Numerals",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/roman-numerals/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Diatonic Chords and Roman Numeral Analysis</span><span class=\"zh\">大调顺阶和弦与罗马数字分析</span></h4><p><span class=\"en\">Stacking thirds using only notes of the major scale yields seven <b class=\"gl\" title=\"Belonging exclusively to the prevailing key\">diatonic</b> triads: <b>I – ii – iii – IV – V – vi – vii°</b> (Major, minor, minor, Major, Major, minor, diminished).</span><span class=\"zh\">仅用大调音阶内音叠三度，必然生成 7 个<b class=\"gl\" title=\"Belonging exclusively to the prevailing key\">顺阶</b>三和弦：<b>I – ii – iii – IV – V – vi – vii°</b>（大小小大大 小减）。</span></p><p><span class=\"en\">Adding a diatonic 7th produces: <b>Imaj7 – ii7 – iii7 – IVmaj7 – V7 – vi7 – viiø7</b>. Notice that <b>V7 is the only dominant seventh</b> naturally occurring in a major key, making it a clear signpost for key finding.</span><span class=\"zh\">再叠七度得到 <b>Imaj7 – ii7 – iii7 – IVmaj7 – V7 – vi7 – viiø7</b>。全大调<b>只有 V7 是唯一的属七和弦</b>，因此看到属七往往就暴露了调性坐标。</span></p>"
  },
  "g7-keyfind": {
    "t": "定调三线索与 Capo 级数转换",
    "te": "Finding the Key & Capo Transposition",
    "src": "双语精读 · 实战定调与移调",
    "u": "https://www.hooktheory.com/books/one",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Finding the Key &amp; Capo Transposition</span><span class=\"zh\">定调三线索与 Capo 级数转换</span></h4><p><span class=\"en\">Because relative major and minor keys share the exact same set of diatonic chords (e.g. G major and E minor), determine the key by checking: (1) which key contains the chords, (2) <b>which chord feels like home</b> at phrase endings, and (3) whether <code>V→I</code> or a raised minor dominant appears.</span><span class=\"zh\">关系大小调（如 G 大调与 Em）共用同一组顺阶和弦。定调必须看三条线索：1) 和弦归属哪个调号；2) <b>哪个和弦听起来像家</b>（段落收尾）；3) 有没有 <code>V→I</code> 或小调大 V。</span></p><p><span class=\"en\">A <b>capo</b> shifts the sounding pitch up by N semitones while preserving all Roman numeral relationships between open chord shapes (G shape + Capo 2 sounds as A major).</span><span class=\"zh\"><b>变调夹（Capo）</b>将所有开放和弦的实际音高升高 N 个半音，但指型之间的罗马数字级数关系纹丝不动（G 指型 + Capo 2 = A 调）。</span></p>"
  },
  "g8-func": {
    "t": "和声功能（T–S–D）与终止式",
    "te": "Harmonic Function & Cadences",
    "src": "双语精读 · 对应 OMT: Intro to Harmony",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-harmony/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Harmonic Function &amp; Cadences</span><span class=\"zh\">和声功能（T–S–D）与终止式</span></h4><p><span class=\"en\">Classical tonal syntax follows <b>Tonic (T: I, vi, iii) → Subdominant/Pre-dominant (S: IV, ii) → Dominant (D: V, vii°) → Tonic (T)</b>. Substitutions work because of shared tones (ii shares 4 & 6 with IV; vi shares 1 & 3 with I).</span><span class=\"zh\">调性基本句法是 <b>主功能 T (I, vi, iii) → 预属/下属功能 S (IV, ii) → 属功能 D (V, vii°) → 主功能 T</b>。替代关系靠共同音成立：ii 与 IV 共用 4、6 级，vi 与 I 共用 1、3 级。</span></p><p><span class=\"en\">Four main cadences: <b>Authentic (V–I)</b>, <b>Plagal (IV–I)</b>, <b>Half (ending on V)</b>, and <b>Deceptive (V–vi)</b>. In rock and blues, ♭VII–IV–I and IV–I act as primary structural cadences.</span><span class=\"zh\">四种终止式：<b>正格（V–I）</b>像句号、<b>变格（IV–I）</b>柔和、<b>半终止（停在 V）</b>像问号、<b>阻碍（V–vi）</b>突然拐弯。摇滚中常见 ♭VII–IV–I 双变格回归。</span></p>"
  },
  "g8-schemas": {
    "t": "流行四和弦模板与 ii–V–I",
    "te": "Pop Four-Chord Schemas & ii–V–I",
    "src": "双语精读 · 对应 OMT: 4-Chord Schemas & ii-V-I",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/4-chord-schemas/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Pop Four-Chord Schemas &amp; ii–V–I</span><span class=\"zh\">流行四和弦模板与 ii–V–I</span></h4><p><span class=\"en\">Pop songs frequently rely on looping four-chord schemas instead of teleological V–I closure: <b>Doo-wop</b> (<code>I–vi–IV–V</code>), <b>Singer/Songwriter</b> (<code>I–V–vi–IV</code> / <code>vi–IV–I–V</code>), and <b>Hopscotch</b> (<code>IV–V–vi–I</code>).</span><span class=\"zh\">当代流行乐极常采用循环四和弦模板，而非追求终结感：<b>Doo-wop</b>（I–vi–IV–V）、<b>Singer/Songwriter</b>（I–V–vi–IV 或 vi–IV–I–V）以及 <b>Hopscotch</b>（IV–V–vi–I）。</span></p><p><span class=\"en\">In jazz and R&B, <b>ii–V–I</b> drives harmony counterclockwise around the Circle of Fifths, linking guide tones smoothly by half step (e.g. Dm7's C → G7's B; G7's F → Cmaj7's E).</span><span class=\"zh\">在爵士与 R&B 中，<b>ii–V–I</b> 沿五度圈逆时针落下，让 7 音与 3 音靠半音下行无缝接力（Dm7 的 C→G7 的 B；G7 的 F→Cmaj7 的 E）。</span></p>"
  },
  "g9-minor": {
    "t": "三种小调与小调的“大 V”",
    "te": "Natural, Harmonic, and Melodic Minor",
    "src": "双语精读 · 对应 OMT: Minor Scales",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/minor-scales/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Natural, Harmonic, and Melodic Minor</span><span class=\"zh\">三种小调与小调的“大 V”</span></h4><p><span class=\"en\"><b>Natural minor</b> (Aeolian: 1 2 ♭3 4 5 ♭6 ♭7) produces diatonic chords <code>i ii° ♭III iv v ♭VI ♭VII</code>. Because v is minor without a leading tone, composers raise ♭7 to 7, yielding <b>Harmonic minor</b> and turning v into a major/dominant <b>V</b>.</span><span class=\"zh\"><b>自然小调</b>（1 2 ♭3 4 5 ♭6 ♭7）的顺阶和弦是 <code>i ii° ♭III iv v ♭VI ♭VII</code>。为得到强回主推力，将 ♭7 升成导音 7 得到<b>和声小调</b>，把小 v 变成了大三/属七 <b>V</b>（代价是 ♭6–7 出现增二度）。</span></p><p><span class=\"en\"><b>Melodic minor</b> raises both 6 and 7 (1 2 ♭3 4 5 6 7) to smooth out the augmented second. In jazz, this ascending form is used both up and down; in rock/pop, all three minor flavors mix freely within one song.</span><span class=\"zh\"><b>旋律小调</b>将 6、7 级同时升高消除增二度；爵士里上下行都用 1 2 ♭3 4 5 6 7；摇滚与流行常在同一首歌里自由混用这三种小调色彩。</span></p>"
  },
  "g9-schemas": {
    "t": "关系调 vs 同主音调与小调模板",
    "te": "Relative vs. Parallel Minor & Minor Schemas",
    "src": "双语精读 · 对应 OMT: Modal Schemas",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/modal-schemas/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Relative vs. Parallel Minor &amp; Minor Schemas</span><span class=\"zh\">关系调 vs 同主音调与小调模板</span></h4><p><span class=\"en\"><b>Relative keys</b> share the same key signature and pitch set (C major & A minor); <b>Parallel keys</b> share the same tonic (C major & C minor). Relative keys govern scale shapes; parallel keys govern modal mixture.</span><span class=\"zh\"><b>关系大小调</b>同调号不同主音（C 与 Am）；<b>同主音大小调</b>同主音不同调号（C 与 Cm）。关系调用于复用指型，同主音调用于对比色彩与借用和弦。</span></p><p><span class=\"en\">Two ubiquitous minor schemas: the <b>Aeolian shuttle/cadence</b> (<code>i–♭VII–♭VI–♭VII</code> or <code>♭VI–♭VII–i</code>) and the <b>Andalusian cadence / Lament bass</b> (<code>i–♭VII–♭VI–V</code>, ending on a major V).</span><span class=\"zh\">小调两大黄金模板：<b>爱奥利亚往返/终止</b>（i–♭VII–♭VI–♭VII 与 ♭VI–♭VII–i）与<b>安达卢西亚终止</b>（i–♭VII–♭VI–V，末尾换成和声小调大 V）。</span></p>"
  },
  "g10-penta-sys": {
    "t": "五声音阶、关系共用与 Fret Science 几何",
    "te": "Pentatonic Harmony, Relative Pairs & Fretboard Geometry",
    "src": "双语精读 · 对应 OMT: Pentatonic & Fret Science",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/pentatonic-harmony/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Pentatonic Harmony, Relative Pairs &amp; Fretboard Geometry</span><span class=\"zh\">五声音阶、关系共用与 Fret Science 几何</span></h4><p><span class=\"en\">Minor pentatonic (<code>1 ♭3 4 5 ♭7</code>) removes 2 and ♭6 from natural minor; Major pentatonic (<code>1 2 3 5 6</code>) removes 4 and 7 from major. Stripping out half steps and tritones ensures every note blends smoothly over basic chords.</span><span class=\"zh\">小调五声（1 ♭3 4 5 ♭7）去掉了 2 和 ♭6，大调五声（1 2 3 5 6）去掉了 4 和 7。剔除半音冲突和三全音，使它极度安全顺耳；代价是缺乏变化、随和弦切换不明显。</span></p><p><span class=\"en\">Each of the 5 pentatonic patterns wraps around one of the 5 CAGED minor/major chord shapes (e.g., A minor pentatonic Pattern 1 at fret 5 wraps around the E-shape Am barre chord). Across adjacent strings, notes form alternating 3-fret <b>rectangles</b> and 2-fret <b>stacks</b>.</span><span class=\"zh\">五声 5 个把位精准包住 5 个 CAGED 和弦指型（例如第 5 品 A 小调五声 P1 包住 E 型 Am）。相邻弦几何上可简化为宽 3 品的<b>矩形</b>与宽 2 品的<b>堆叠</b>拼接。</span></p>"
  },
  "g11-blues-harm": {
    "t": "12 小节布鲁斯结构与属七和弦体系",
    "te": "12-Bar Blues Form and Dominant Harmony",
    "src": "双语精读 · 对应 OMT: Blues Harmony",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/blues-harmony/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">12-Bar Blues Form and Dominant Harmony</span><span class=\"zh\">12 小节布鲁斯结构与属七和弦体系</span></h4><p><span class=\"en\">The standard 12-bar blues forms three 4-bar phrases (AAB lyric structure): <code>| I | I | I | I | IV | IV | I | I | V | IV | I | I (or V) |</code>. Variants include the <b>quick change</b> (IV in bar 2) and a final-bar <b>turnaround</b>.</span><span class=\"zh\">标准 12 小节布鲁斯由三个 4 小节乐句（AAB 歌词结构）组成：<code>| I | I | I | I | IV | IV | I | I | V | IV | I | I/V |</code>。常见变体包括第 2 小节先去 IV（Quick Change）及末小节 Turnaround。</span></p><p><span class=\"en\">Unlike classical tonality, <b>I7, IV7, and V7 are all dominant seventh chords</b>, and structural closure happens via a plagal motion (IV–I inside V–IV–I) rather than V–I.</span><span class=\"zh\">与古典规则不同，布鲁斯里 <b>I7、IV7、V7 全部带小七度</b>，且大调进行结尾靠变格运动（V–IV–I 里的 IV–I）完成回归。</span></p>"
  },
  "g11-blues-note": {
    "t": "蓝调音微音高、布鲁斯音阶与 Turnaround",
    "te": "Blue Notes, the Blues Scale & Turnarounds",
    "src": "双语精读 · 对应 OMT: Blues Melodies & Scale",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/blues-melodies-and-the-blues-scale/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Blue Notes, the Blues Scale &amp; Turnarounds</span><span class=\"zh\">蓝调音微音高、布鲁斯音阶与 Turnaround</span></h4><p><span class=\"en\"><b>Blue notes</b> sit flexibly between equal-tempered pitches (notably between ♭3 and 3, and between ♭7 and 7). On electric guitar, quarter-tone bends and slides express this tension directly over major/dominant chords.</span><span class=\"zh\"><b>蓝调音</b>往往游走于十二平均律相邻两音之间（尤其是 ♭3 与大三度 3 之间），电吉他正好靠四分之一推弦、揉弦与滑音精准表达这种撕裂张力。</span></p><p><span class=\"en\">Adding ♭5 (♯4) as a passing tone to minor pentatonic gives the <b>blues scale</b> (1 ♭3 4 ♭5 5 ♭7). In bars 11–12, a classic chromatic descending turnaround (1–♭7–6–♭6–5) propels the chorus back to V7.</span><span class=\"zh\">小调五声加入经过音 ♭5（OMT 记作 ♯4）即为<b>布鲁斯音阶</b>；第 11–12 小节常用 1–♭7–6–♭6–5 的高音弦半音下行 Turnaround 推回 V7 重新开始。</span></p>"
  },
  "g12-modes-par": {
    "t": "平行调式思路与特征音光谱",
    "te": "Parallel Modes and Color Notes",
    "src": "双语精读 · 对应 OMT: Diatonic Modes",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/diatonic-modes/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Parallel Modes and Color Notes</span><span class=\"zh\">平行调式思路与特征音光谱</span></h4><p><span class=\"en\">Think of modes <b>in parallel</b> from the same tonic rather than as rotations of C major: Major-3rd modes are <b>Lydian</b> (major + ♯4), <b>Ionian</b> (major), and <b>Mixolydian</b> (major + ♭7). Minor-3rd modes are <b>Dorian</b> (minor + ♮6), <b>Aeolian</b> (minor), <b>Phrygian</b> (minor + ♭2), and <b>Locrian</b> (♭2, ♭5).</span><span class=\"zh\">实战学调式必须用<b>平行思路</b>与同一主音的大/小调比较：大三度家族为<b>利底亚（+♯4）</b>、伊奥尼亚、<b>混合利底亚（+♭7）</b>；小三度家族为<b>多利亚（+♮6）</b>、爱奥利亚、<b>弗里几亚（+♭2）</b>和洛克里亚（♭2, ♭5）。</span></p><p><span class=\"en\">Each mode's signature lies in its single <b>characteristic color note</b>. Without a modal vamp or drone establishing the tonic center, playing D Dorian over Dm7–G7–Cmaj7 simply sounds like C major.</span><span class=\"zh\">每个调式的味道全系于那个唯一的<b>特征音</b>。如果没有持续音或 Vamp 确立中心，在 Dm7–G7–Cmaj7 上弹“D 多利亚”听起来依然是 C 大调。</span></p>"
  },
  "g12-modes-id": {
    "t": "OMT 调式判断三步法与 Vamp 进行",
    "te": "OMT Modal Identification Flow & Modal Vamps",
    "src": "双语精读 · 对应 OMT: Diatonic Modes & Modal Schemas",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/modal-schemas/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">OMT Modal Identification Flow &amp; Modal Vamps</span><span class=\"zh\">OMT 调式判断三步法与 Vamp 进行</span></h4><p><span class=\"en\">Three-step identification: (1) Find the tonic and check whether the tonic triad is major or minor; (2) check the 7th degree (7 vs ♭7); (3) listen for the color alteration (♯4 = Lydian, ♮6 = Dorian, ♭2 = Phrygian).</span><span class=\"zh\">OMT 三步判别法：1) 找定家，判断主和弦是大还是小；2) 听第 7 级（导音还是 ♭7）；3) 抓特征音（♯4 为利底亚，♮6 为多利亚，♭2 为弗里几亚）。</span></p><p><span class=\"en\">Standard two-chord modal vamps highlight the color note in the second chord: Dorian <code>i–IV</code> (Am7–D9), Mixolydian <code>I–♭VII</code> (A–G), Lydian <code>I–II</code> (A–B), and Phrygian <code>i–♭II</code> (Am–B♭).</span><span class=\"zh\">典型双和弦调式 Vamp 把特征音直接藏在第二个和弦里：多利亚 <code>i–IV</code>（Am7–D9 含 F♯）、混合利底亚 <code>I–♭VII</code>（A–G 含 G）、利底亚 <code>I–II</code>（A–B 含 D♯）、弗里几亚 <code>i–♭II</code>（Am–B♭ 含 B♭）。</span></p>"
  },
  "g13-embellish": {
    "t": "强拍和弦音、修饰音与引导线",
    "te": "Chord Tones, Embellishing Tones & Guide Tones",
    "src": "双语精读 · 对应 OMT: Embellishing Tones",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/embellishing-tones/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Chord Tones, Embellishing Tones &amp; Guide Tones</span><span class=\"zh\">强拍和弦音、修饰音与引导线</span></h4><p><span class=\"en\">Great solos outline the chord progression by placing <b>chord tones (1, 3, 5, 7)</b> on strong beats and using other scale or chromatic tones as <b>embellishing tones</b> (passing, neighbor, appoggiatura, anticipation).</span><span class=\"zh\">动听的独奏把<b>和弦音（1 3 5 7）</b>稳放在强拍上勾勒和声，其余音则充当弱拍的<b>修饰音</b>（经过音、邻音、倚音、先现音）。</span></p><p><span class=\"en\"><b>Guide tones (3rds and 7ths)</b> connect smoothly across fifth-related changes: in A7→D7, the ♭7 of A7 (G) drops a half step to the 3rd of D7 (F♯), while C♯ drops to C.</span><span class=\"zh\"><b>引导线（3 音与 7 音）</b>在五度下行进行里极其丝滑：A7 的 ♭7（G）降半音就是 D7 的 3 音（F♯），A7 的 3 音（C♯）降半音就是 D7 的 ♭7（C）。</span></p>"
  },
  "g13-motif": {
    "t": "趋近、包围与旋律动机发展",
    "te": "Approach Notes, Enclosures & Motivic Development",
    "src": "双语精读 · 对应 OMT: Melody & Phrasing",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/melody-and-phrasing/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Approach Notes, Enclosures &amp; Motivic Development</span><span class=\"zh\">趋近、包围与旋律动机发展</span></h4><p><span class=\"en\">Target tones shine when approached via a <b>lower chromatic half step</b> or a three-note <b>enclosure</b> (diatonic step above → chromatic half step below → target tone).</span><span class=\"zh\">用<b>下方半音趋近</b>或<b>上下包围（上方音阶音 → 下方半音 → 目标音）</b>进出目标音，会让吉他琶音瞬间拥有唱片级的旋律流动感。</span></p><p><span class=\"en\">Instead of playing endless unrelated notes, repeat a short 3–5 note <b>motif</b> and develop it across chord changes via rhythmic displacement, transposition, or call-and-response.</span><span class=\"zh\">用<b>动机发展</b>代替无休止跑音阶：反复出现一个 3～5 音短动机，仅随和弦微调结尾目标音或改变节奏落点，让听众真正记住你的独奏。</span></p>"
  },
  "g14-sec-dom": {
    "t": "副属和弦（V/x）与离调 vs 转调",
    "te": "Tonicization (Applied Dominants) vs. Modulation",
    "src": "双语精读 · 对应 OMT: Tonicization & Modulation",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/tonicization/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Tonicization (Applied Dominants) vs. Modulation</span><span class=\"zh\">副属和弦（V/x）与离调 vs 转调</span></h4><p><span class=\"en\">A <b class=\"gl\" title=\"A non-diatonic dominant chord resolving to a diatonic chord other than I\">secondary dominant (V/x)</b> temporarily treats a diatonic chord other than I as a local tonic—most visibly by turning an expected minor chord (ii, iii, vi) into a major or dominant 7th chord resolving down a fifth.</span><span class=\"zh\"><b class=\"gl\" title=\"A non-diatonic dominant chord resolving to a diatonic chord other than I\">副属和弦（V/x）</b>短暂把顺阶某个非主和弦当成临时老板（离调），特征是原本应为小三和弦的级数变成了大三或属七并往下五度解决（如 C 调的 E7→Am、D7→G）。</span></p><p><span class=\"en\">Brief visits (1–2 bars) are <b>tonicization</b>; establishing a new tonic with its own cadences (or shifting up a half/whole step—'truck driver's modulation') is true <b>modulation</b>.</span><span class=\"zh\">一两小节过客称为<b>离调（Tonicization）</b>；在新调上站稳并完成新终止式（或直接整体升半音/全音的“卡车司机式转调”）才是真<b>转调（Modulation）</b>。</span></p>"
  },
  "g14-mixture": {
    "t": "调式互换（借用和弦）与半音中音",
    "te": "Modal Mixture (Borrowed Chords) & Chromatic Mediants",
    "src": "双语精读 · 对应 OMT: Modal Mixture",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/modal-mixture/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Modal Mixture (Borrowed Chords) &amp; Chromatic Mediants</span><span class=\"zh\">调式互换（借用和弦）与半音中音</span></h4><p><span class=\"en\"><b>Modal mixture</b> borrows chords from the parallel minor into a major key—most commonly <b>♭III, iv, ♭VI, and ♭VII</b>. Signature progression: <code>IV–iv–I</code> (the plagal sigh, featuring 6–♭6–5 chromatic voice leading).</span><span class=\"zh\"><b>调式互换（借用和弦）</b>通常从同主音小调借入降级音和弦：最常见 <b>♭III、iv、♭VI、♭VII</b>。经典模板 <code>IV–iv–I</code>（叹息终止，内声部走 6–♭6–5 半音下行）。</span></p><p><span class=\"en\">When improvising over any chromatic chord, temporarily alter only the conflicting scale note to match the chord's defining accidental (e.g. play C♯ over A7 = V/ii in C; play A♭ over Fm = iv).</span><span class=\"zh\">遇到调外和弦即兴时不必丢掉整张音阶地图，只需在该小节<b>精准点亮那个新变音</b>（如 C 调里 E7 弹 G♯、Fm 弹 A♭）。</span></p>"
  },
  "g15-form": {
    "t": "流行曲式（主副歌、AABA、分节歌）与扒歌流程",
    "te": "Popular Song Forms & Standard Transcription Workflow",
    "src": "双语精读 · 对应 OMT: Form in Popular Music",
    "u": "https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-form-in-popular-music/",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Popular Song Forms &amp; Standard Transcription Workflow</span><span class=\"zh\">流行曲式（主副歌、AABA、分节歌）与扒歌流程</span></h4><p><span class=\"en\">Three core popular forms: <b>Verse–Chorus</b> (with optional pre-chorus and contrasting bridge), <b>AABA</b> (32-bar classic/jazz standard form), and <b>Strophic</b> (repeating section such as 12-bar blues). Choruses typically ground the tonic chord with tighter harmonic rhythm.</span><span class=\"zh\">三大流行曲式：<b>主歌–副歌</b>（常配预副歌蓄力与桥段对比）、<b>AABA</b>（32 小节标准曲）、<b>分节歌</b>（如 12 小节布鲁斯反复）。副歌常直接落地主和弦、和声更规整，桥段常去往新和声区。</span></p><p><span class=\"en\">Reliable transcription starts with your ears, not internet TABs: sing the melody first → locate tonic & bass movement → slow down hard phrases in Transcribe!/Soundslice → notate TAB + Roman numerals/degrees relative to each chord.</span><span class=\"zh\">高效扒歌永远从耳朵出发而非盲搜误差极高的网络 TAB：先能哼唱 → 定调找低音 → 用减速工具分段抓音高节奏 → 记下 TAB 与每个强拍相对和弦的级数。</span></p>"
  },
  "g5-studio-triads": {
    "t": "录音室三和弦声部连接与八度网格（Tomo Fujita & Tagliarino 精要）",
    "te": "Studio Triad Voice Leading & Fretboard Grid (Tomo Fujita & Tagliarino Digest)",
    "src": "双语精读 · 提炼自 Tomo Fujita Guitar Wisdom 与《Guitar Fretboard Workbook》",
    "u": "https://www.youtube.com/@TomoFujitaMusic",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Studio Triad Voice Leading &amp; Fretboard Grid (Tomo Fujita &amp; Tagliarino Digest)</span><span class=\"zh\">录音室三和弦声部连接与八度网格（Tomo Fujita &amp; Tagliarino 精要）</span></h4><p><span class=\"en\">In a band mix, six-string barre chords clutter the bass and midrange. Studio guitarists rely on <b>close triads on strings 4–3–2 or 3–2–1</b>, keeping common tones stationary and moving the remaining voices by 1–2 frets.</span><span class=\"zh\">在乐队混音中，六弦大横按会严重挤占贝斯与主唱的中低频。录音室吉他手最核心的伴奏武器是 <b>4–3–2 弦或 3–2–1 弦密排三和弦</b>，严格遵循“共同音不动、其余声部只走 1～2 品”的就近连接。</span></p><p><span class=\"en\">Example in G major within frets 3–5 on strings 4–3–2: <code>G (5-4-3 = G-B-D)</code> → <code>C 2nd inv (5-5-5 = G-C-E)</code> → <code>D 1st inv (4-2-3 = F♯-A-D)</code>. Clean muting of unused strings with the fretting-hand index tip and thumb is mandatory.</span><span class=\"zh\">以 G 大调 4–3–2 弦第 3～5 品为例：<code>G 原位 (5-4-3 = G-B-D)</code> → <code>C 第二转位 (5-5-5 = G-C-E，4弦G共同音不动！)</code> → <code>D 第一转位 (4-2-3 = F♯-A-D)</code>。左手食指尖与拇指必须轻触不发音的粗弦消音，做到干脆利落。</span></p>"
  },
  "g10-stich-mix": {
    "t": "StichMethod 五声思维：一盒两家与大/小五声无缝混用",
    "te": "StichMethod Pentatonic Mindset: Relative & Parallel Mixing",
    "src": "双语精读 · 提炼自 StichMethod Guitar 与 Fretastic 五声架构",
    "u": "https://www.youtube.com/@StichMethodGuitar",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">StichMethod Pentatonic Mindset: Relative &amp; Parallel Mixing</span><span class=\"zh\">StichMethod 五声思维：一盒两家与大/小五声无缝混用</span></h4><p><span class=\"en\">Every pentatonic box holds two centers of gravity: in frets 5–8 (Pattern 1), landing on <b>A–C–E</b> creates A minor pentatonic, while landing on <b>C–E–G</b> inside the exact same fret dots turns it into C major pentatonic.</span><span class=\"zh\">每一个五声把位盒子里都同时装着两套引力中心：在第 5～8 品框（Pattern 1）内，落脚在 <b>A–C–E</b> 是 A 小调五声；保持手指按的圆点完全不变，改把落脚重音放在 <b>C–E–G</b> 上，立刻变成明亮的 C 大调五声！</span></p><p><span class=\"en\">To mix parallel major and minor pentatonic over an A blues/rock groove: shift Pattern 1 down 3 frets (to fret 2 = F♯m pentatonic) OR stay at frets 5–9 using the <b>B.B. Box</b>, hammering from <code>♭3 (C, 3rd string 5th fret)</code> into <code>3 (C♯, 3rd string 6th fret)</code>.</span><span class=\"zh\">要在 A 调摇滚/布鲁斯上混用同主音大、小五声：既可以把 P1 往低移 3 品（第 2 品起手），也可以留在第 5～9 品黄金区，直接把 <code>3弦5品 C(♭3)</code> 击弦或微推到 <code>3弦6品 C♯(大3度)</code>，一手掌控明暗冷暖。</span></p>"
  },
  "g10-govan-phrasing": {
    "t": "Guthrie Govan & Mick Goodrick：三音受限法、单弦造句与呼吸留白",
    "te": "Guthrie Govan & Mick Goodrick: Creative Limitation, Unitar & Vocal Breathing",
    "src": "双语精读 · 提炼自《Creative Guitar》与《The Advancing Guitarist》",
    "u": "https://www.halleonard.com/product/603009/the-advancing-guitarist",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Guthrie Govan &amp; Mick Goodrick: Creative Limitation, Unitar &amp; Vocal Breathing</span><span class=\"zh\">Guthrie Govan &amp; Mick Goodrick：三音受限法、单弦造句与呼吸留白</span></h4><p><span class=\"en\">Goodrick's golden rule of <b>creative limitation</b>: restricting yourself to just <b>three chord tones (1–♭3–5)</b> or a <b>single string (Unitrib/Unitar)</b> forces your brain to abandon mechanical finger muscle memory and focus on rhythm, slides, dynamics, and vibrato.</span><span class=\"zh\">伯克利传奇教材《The Advancing Guitarist》的核心法则——<b>受限创造力</b>：故意只允许自己用 <b>3 个音（1–♭3–5）</b> 或只在 <b>1 根琴弦（单弦练习）</b> 上即兴，能瞬间废掉手指机械爬格子的惯性，逼出滑音、切分、强弱动态与揉弦。</span></p><p><span class=\"en\">Guthrie Govan compares guitar phrasing to human speech: play a short 2-bar statement, then <b>physically lift your fingers off the strings for 1–2 beats</b> like a singer taking a breath. Bends must hit the exact target pitch—test by fretting the destination note first.</span><span class=\"zh\">Guthrie Govan 把电吉他乐句比作人声说话：弹完两小节句子后，<b>强迫左手离开琴弦留白呼吸一两拍</b>。每一次推弦都像主唱滑音，必须先按响目标品格校准耳朵，再从低音推到分毫不差的音高。</span></p>"
  },
  "g11-changes-phrasing": {
    "t": "布鲁斯问答句法与“Playing the Changes”目标音变色实战",
    "te": "Blues Call-and-Response & Playing the Changes over I7–IV7–V7",
    "src": "双语精读 · 提炼自 JustinGuitar Blues Lead 与 StichMethod 变色法则",
    "u": "https://www.justinguitar.com/modules/essential-blues-lead-guitar",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Blues Call-and-Response &amp; Playing the Changes over I7–IV7–V7</span><span class=\"zh\">布鲁斯问答句法与“Playing the Changes”目标音变色实战</span></h4><p><span class=\"en\">Authentic 12-bar blues follows an <b>AAB vocal call-and-response</b>: bars 1–2 ask a musical question (ending on an unstable tone like ♭3, 4, or 5), bars 3–4 leave space or answer on the root, bars 5–6 repeat the question over IV7, and bars 9–10 climax over V7–IV7.</span><span class=\"zh\">地道 12 小节布鲁斯遵循 <b>AAB 问答结构</b>：第 1–2 小节提出问句（常停在 ♭3、4 或 5 音留出悬念），第 3–4 小节留白呼吸或回答在根音，第 5–6 小节在 IV7 上复述问句，第 9–10 小节在 V7–IV7 上推向全曲高潮。</span></p><p><span class=\"en\">In A blues, A minor pentatonic (A–C–D–E–G) contains the ♭7 of A7 (G, 2nd string 8th fret). The instant bar 5 hits <b>D7 (D–F♯–A–C)</b>, drop that G down one fret to <b>F♯ (2nd string 7th fret or 4th string 4th fret)</b>—and at bar 9 <b>E7</b>, hit <b>G♯ (2nd string 9th fret / 4th string 6th fret)</b>.</span><span class=\"zh\">在 A 调布鲁斯中，A 小调五声自带 A7 的 ♭7 音（G，2弦8品）。一旦第 5 小节进入 <b>D7（D–F♯–A–C）</b>，把 2弦8品 G 往左退 1 品按住 <b>2弦7品 F♯（或 4弦4品 F♯）</b>；第 9 小节进 <b>E7</b> 时点亮 <b>2弦9品 / 4弦6品 G♯</b>——哪怕关掉伴奏，听众也能听见你手里的和弦在进行！</span></p>"
  },
  "g13-master-lines": {
    "t": "Jens Larsen & Goodrick：大师独奏中的 3–7 引导线与半音包围（Enclosure）",
    "te": "Jens Larsen & Goodrick: Guide-Tone Targeting & Chromatic Enclosures in Solos",
    "src": "双语精读 · 提炼自 Jens Larsen 爵士/现代吉他教程与目标音分析法",
    "u": "https://www.youtube.com/@JensLarsen",
    "verbatim": false,
    "credit": "课程核心双语精读（依据 Open Music Theory v2 与电吉他实用乐理体系精编）。点右下方链接可直达原教材整章对照。",
    "h": "<h4><span class=\"en\">Jens Larsen &amp; Goodrick: Guide-Tone Targeting &amp; Chromatic Enclosures in Solos</span><span class=\"zh\">Jens Larsen &amp; Goodrick：大师独奏中的 3–7 引导线与半音包围（Enclosure）</span></h4><p><span class=\"en\">When analyzing solos by David Gilmour, John Mayer, Larry Carlton, or jazz masters, <b>over 80% of strong-beat notes (beats 1 and 3) and long bends land on the active chord's 3rd, 7th, 5th, or 9th</b>. Scale runs only serve as bridges between these pillars.</span><span class=\"zh\">拆解 Gilmour、John Mayer、Larry Carlton 或爵士大师的经典独奏会发现：<b>超过 80% 的强拍落音（第 1、3 拍）与长推弦终点，都精准踩在当前和弦的 3 音、7 音、5 音或 9 音上</b>；音阶跑动只是连接这些桥墩的引桥。</span></p><p><span class=\"en\">To make arpeggios sound like real music instead of exercises, precede the target chord tone on beat 4 with a <b>chromatic approach from 1 fret below</b> or a <b>two-note enclosure</b> (1 scale step above + 1 half step below → target tone on beat 1).</span><span class=\"zh\">要让和弦音即兴摆脱“像在练琶音练习曲”的生硬感，秘诀是在前一拍弱拍用<b>下方半音趋近（低 1 品滑入）</b>或<b>双音包围（上方邻音 + 下方半音 → 第 1 拍命中目标 3 音）</b>。</span></p>"
  }
});
