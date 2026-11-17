// G3～G15 电吉他指板与实战双语精读卡片（由 build/gen_reading_ext.py 生成，与 data-reading.js 合并进 window.READING）
// 大学乐理正文原文由 data-reading.js 提供；本文件保留吉他指板几何与名师实战核心卡片
window.READING = Object.assign(window.READING || {}, {
  "g3-int-fret": {
    "t": "吉他指板上的音程几何与 3–2 弦补偿",
    "te": "Fretboard Interval Geometry & the B-String Shift",
    "src": "双语精读 · 吉他指板专题",
    "u": "https://www.justinguitar.com/modules/notes-sharps-flats-octaves",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Fretboard Interval Geometry &amp; the B-String Shift</span><span class=\"zh\">吉他指板上的音程几何与 3–2 弦补偿</span></h4><p><span class=\"en\">In standard tuning (E–A–D–G–B–E), adjacent string pairs 6–5, 5–4, 4–3, and 2–1 are tuned a <b>perfect fourth (5 semitones)</b> apart, while 3–2 (G–B) is tuned a <b>major third (4 semitones)</b> apart.</span><span class=\"zh\">标准调弦（E–A–D–G–B–E）中，6–5、5–4、4–3、2–1 弦相邻都差<b>纯四度（5 半音）</b>，唯独 3–2 弦（G–B）只差<b>大三度（4 半音）</b>。</span></p><p><span class=\"en\">Therefore, moving to the next higher string subtracts 5 semitones—unless you cross the 3–2 boundary, which only subtracts 4 semitones. Any interval shape crossing the 3–2 pair shifts <b>1 fret higher</b>.</span><span class=\"zh\">因此往高音弦换一根弦等同于减 5 个半音；只要跨过 3–2 弦只减了 4 个半音，所以<b>任何跨过 3–2 弦的音程与八度形状都要向高品多挪 1 品</b>。</span></p>"
  },
  "g4-cof-use": {
    "t": "五度圈与吉他 CAGED / 3NPS 视野",
    "te": "Circle of Fifths, CAGED & 3NPS on Guitar",
    "src": "双语精读 · 五度圈与指板视野",
    "u": "https://en.wikipedia.org/wiki/Circle_of_fifths",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Circle of Fifths, CAGED &amp; 3NPS on Guitar</span><span class=\"zh\">五度圈与吉他 CAGED / 3NPS 视野</span></h4><p><span class=\"en\">Moving clockwise around the <b class=\"gl\" title=\"A geometric diagram organizing the 12 pitch classes by fifths\">Circle of Fifths</b> adds one sharp (up a P5); moving counterclockwise adds one flat (up a P4 / down a P5). Adjacent keys share 6 out of 7 notes.</span><span class=\"zh\">沿<b class=\"gl\" title=\"A geometric diagram organizing the 12 pitch classes by fifths\">五度圈</b>顺时针走每步加 1 升号（上行纯五度）；逆时针每步加 1 降号（上行纯四度）。相邻两调共享 6 个音，只差 1 个音。</span></p><p><span class=\"en\">On guitar, <b>CAGED positions</b> anchor scale boxes to chord shapes (ideal for chord-tone soloing), whereas <b>3-Notes-Per-String (3NPS)</b> puts exactly three notes on every string (ideal for legato and alternate picking speed).</span><span class=\"zh\">在吉他上，<b>CAGED 把位</b>把音阶锚定在可按出的和弦指型上（最利和弦内音即兴），而<b>三音一弦（3NPS）</b>强迫每弦 3 个音（最利连奏与交替拨弦速度）。</span></p>"
  },
  "g5-caged": {
    "t": "CAGED 几何逻辑与三弦组声部连接",
    "te": "CAGED Logic & String-Set Voice Leading",
    "src": "双语精读 · 对应 JustinGuitar CAGED Logic",
    "u": "https://www.justinguitar.com/guitar-lessons/caged-logic-ch-900",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">CAGED Logic &amp; String-Set Voice Leading</span><span class=\"zh\">CAGED 几何逻辑与三弦组声部连接</span></h4><p><span class=\"en\">Moving open chord shapes C, A, G, E, and D up the neck as barre shapes always yields the fixed cycle <b>C → A → G → E → D → C</b>. The high-fret boundary of each shape shares the root or chord tones of the next shape.</span><span class=\"zh\">把开放 C、A、G、E、D 五个大三指型用横按推上高把位，顺序永远固定为 <b>C → A → G → E → D → C</b>。前一指型的高品边界正好与下一指型的低品根音无缝重合。</span></p><p><span class=\"en\">For rhythm guitar in a band, playing 3-note triads on adjacent string sets (1-2-3 or 2-3-4) with smooth <b>voice leading</b> (keeping common tones and moving other voices by step) sounds cleaner and avoids clashing with the bass.</span><span class=\"zh\">在乐队伴奏中，只在 1-2-3 或 2-3-4 三根弦上弹三和弦转位并做<b>声部连接</b>（共同音不动、其余音级进），颗粒最干净且绝不和贝斯打架。</span></p>"
  },
  "g6-shell": {
    "t": "吉他壳和弦（1-3-7）与引导声部",
    "te": "Guitar Shell Voicings (1-3-7) and Guide Tones",
    "src": "双语精读 · 吉他壳和弦实战编配",
    "u": "https://www.youtube.com/@JensLarsen",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Guitar Shell Voicings (1-3-7) and Guide Tones</span><span class=\"zh\">吉他壳和弦（1-3-7）与引导声部</span></h4><p><span class=\"en\">In chord voicings on guitar, the <b>3rd and 7th</b> define the chord's major/minor and functional identity, whereas the <b>5th</b> adds weight without defining quality and is routinely omitted.</span><span class=\"zh\">吉他按弦编配时，<b>3 音和 7 音</b>决定了和弦的大小性质与功能倾向；而纯五度 <b>5 音</b>不提供核心色彩，最常被省略。</span></p><p><span class=\"en\"><b>Shell voicings</b> use only Root + 3rd + 7th (on strings 6-4-3 or 5-4-3). In a 12-bar blues or ii–V–I, the 7th of each chord resolves down by half step to the 3rd of the next chord.</span><span class=\"zh\"><b>壳和弦</b>只弹 1–3–7 三根弦（常放在 6-4-3 或 5-4-3 弦）。在布鲁斯或 ii–V–I 里，前一个和弦的 7 音正好能半音下行落入下一个和弦的 3 音。</span></p>"
  },
  "g7-keyfind": {
    "t": "定调三线索与 Capo 级数转换",
    "te": "Finding the Key & Capo Transposition",
    "src": "双语精读 · 实战定调与移调",
    "u": "https://www.hooktheory.com/books/one",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Finding the Key &amp; Capo Transposition</span><span class=\"zh\">定调三线索与 Capo 级数转换</span></h4><p><span class=\"en\">Because relative major and minor keys share the exact same set of diatonic chords (e.g. G major and E minor), determine the key by checking: (1) which key contains the chords, (2) <b>which chord feels like home</b> at phrase endings, and (3) whether <code>V→I</code> or a raised minor dominant appears.</span><span class=\"zh\">关系大小调（如 G 大调与 Em）共用同一组顺阶和弦。定调必须看三条线索：1) 和弦归属哪个调号；2) <b>哪个和弦听起来像家</b>（段落收尾）；3) 有没有 <code>V→I</code> 或小调大 V。</span></p><p><span class=\"en\">A <b>capo</b> shifts the sounding pitch up by N semitones while preserving all Roman numeral relationships between open chord shapes (G shape + Capo 2 sounds as A major).</span><span class=\"zh\"><b>变调夹（Capo）</b>将所有开放和弦的实际音高升高 N 个半音，但指型之间的罗马数字级数关系纹丝不动（G 指型 + Capo 2 = A 调）。</span></p>"
  },
  "g10-penta-sys": {
    "t": "五声音阶 5 把位挂 CAGED 与 Fret Science 矩形+堆叠",
    "te": "Pentatonic CAGED Anchors & Fret Science Rectangle+Stack",
    "src": "双语精读 · JustinGuitar & Fret Science 指板几何",
    "u": "https://www.youtube.com/@FretScience",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Pentatonic CAGED Anchors &amp; Fret Science Rectangle+Stack</span><span class=\"zh\">五声音阶 5 把位挂 CAGED 与 Fret Science 矩形+堆叠</span></h4><p><span class=\"en\">Minor pentatonic (<code>1 ♭3 4 5 ♭7</code>) removes 2 and ♭6 from natural minor; Major pentatonic (<code>1 2 3 5 6</code>) removes 4 and 7 from major. Stripping out half steps and tritones ensures every note blends smoothly over basic chords.</span><span class=\"zh\">小调五声（1 ♭3 4 5 ♭7）去掉了 2 和 ♭6，大调五声（1 2 3 5 6）去掉了 4 和 7。剔除半音冲突和三全音，使它极度安全顺耳；代价是缺乏变化、随和弦切换不明显。</span></p><p><span class=\"en\">Each of the 5 pentatonic patterns wraps around one of the 5 CAGED minor/major chord shapes (e.g., A minor pentatonic Pattern 1 at fret 5 wraps around the E-shape Am barre chord). Across adjacent strings, notes form alternating 3-fret <b>rectangles</b> and 2-fret <b>stacks</b>.</span><span class=\"zh\">五声 5 个把位精准包住 5 个 CAGED 和弦指型（例如第 5 品 A 小调五声 P1 包住 E 型 Am）。相邻弦几何上可简化为宽 3 品的<b>矩形</b>与宽 2 品的<b>堆叠</b>拼接。</span></p>"
  },
  "g5-studio-triads": {
    "t": "录音室三和弦声部连接与八度网格（Tomo Fujita & Tagliarino 精要）",
    "te": "Studio Triad Voice Leading & Fretboard Grid (Tomo Fujita & Tagliarino Digest)",
    "src": "双语精读 · 提炼自 Tomo Fujita Guitar Wisdom 与《Guitar Fretboard Workbook》",
    "u": "https://www.youtube.com/@TomoFujitaMusic",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Studio Triad Voice Leading &amp; Fretboard Grid (Tomo Fujita &amp; Tagliarino Digest)</span><span class=\"zh\">录音室三和弦声部连接与八度网格（Tomo Fujita &amp; Tagliarino 精要）</span></h4><p><span class=\"en\">In a band mix, six-string barre chords clutter the bass and midrange. Studio guitarists rely on <b>close triads on strings 4–3–2 or 3–2–1</b>, keeping common tones stationary and moving the remaining voices by 1–2 frets.</span><span class=\"zh\">在乐队混音中，六弦大横按会严重挤占贝斯与主唱的中低频。录音室吉他手最核心的伴奏武器是 <b>4–3–2 弦或 3–2–1 弦密排三和弦</b>，严格遵循“共同音不动、其余声部只走 1～2 品”的就近连接。</span></p><p><span class=\"en\">Example in G major within frets 3–5 on strings 4–3–2: <code>G (5-4-3 = G-B-D)</code> → <code>C 2nd inv (5-5-5 = G-C-E)</code> → <code>D 1st inv (4-2-3 = F♯-A-D)</code>. Clean muting of unused strings with the fretting-hand index tip and thumb is mandatory.</span><span class=\"zh\">以 G 大调 4–3–2 弦第 3～5 品为例：<code>G 原位 (5-4-3 = G-B-D)</code> → <code>C 第二转位 (5-5-5 = G-C-E，4弦G共同音不动！)</code> → <code>D 第一转位 (4-2-3 = F♯-A-D)</code>。左手食指尖与拇指必须轻触不发音的粗弦消音，做到干脆利落。</span></p>"
  },
  "g10-stich-mix": {
    "t": "StichMethod 五声思维：一盒两家与大/小五声无缝混用",
    "te": "StichMethod Pentatonic Mindset: Relative & Parallel Mixing",
    "src": "双语精读 · 提炼自 StichMethod Guitar 与 Fretastic 五声架构",
    "u": "https://www.youtube.com/@StichMethodGuitar",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">StichMethod Pentatonic Mindset: Relative &amp; Parallel Mixing</span><span class=\"zh\">StichMethod 五声思维：一盒两家与大/小五声无缝混用</span></h4><p><span class=\"en\">Every pentatonic box holds two centers of gravity: in frets 5–8 (Pattern 1), landing on <b>A–C–E</b> creates A minor pentatonic, while landing on <b>C–E–G</b> inside the exact same fret dots turns it into C major pentatonic.</span><span class=\"zh\">每一个五声把位盒子里都同时装着两套引力中心：在第 5～8 品框（Pattern 1）内，落脚在 <b>A–C–E</b> 是 A 小调五声；保持手指按的圆点完全不变，改把落脚重音放在 <b>C–E–G</b> 上，立刻变成明亮的 C 大调五声！</span></p><p><span class=\"en\">To mix parallel major and minor pentatonic over an A blues/rock groove: shift Pattern 1 down 3 frets (to fret 2 = F♯m pentatonic) OR stay at frets 5–9 using the <b>B.B. Box</b>, hammering from <code>♭3 (C, 3rd string 5th fret)</code> into <code>3 (C♯, 3rd string 6th fret)</code>.</span><span class=\"zh\">要在 A 调摇滚/布鲁斯上混用同主音大、小五声：既可以把 P1 往低移 3 品（第 2 品起手），也可以留在第 5～9 品黄金区，直接把 <code>3弦5品 C(♭3)</code> 击弦或微推到 <code>3弦6品 C♯(大3度)</code>，一手掌控明暗冷暖。</span></p>"
  },
  "g10-govan-phrasing": {
    "t": "Guthrie Govan & Mick Goodrick：三音受限法、单弦造句与呼吸留白",
    "te": "Guthrie Govan & Mick Goodrick: Creative Limitation, Unitar & Vocal Breathing",
    "src": "双语精读 · 提炼自《Creative Guitar》与《The Advancing Guitarist》",
    "u": "https://www.halleonard.com/product/603009/the-advancing-guitarist",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Guthrie Govan &amp; Mick Goodrick: Creative Limitation, Unitar &amp; Vocal Breathing</span><span class=\"zh\">Guthrie Govan &amp; Mick Goodrick：三音受限法、单弦造句与呼吸留白</span></h4><p><span class=\"en\">Goodrick's golden rule of <b>creative limitation</b>: restricting yourself to just <b>three chord tones (1–♭3–5)</b> or a <b>single string (Unitrib/Unitar)</b> forces your brain to abandon mechanical finger muscle memory and focus on rhythm, slides, dynamics, and vibrato.</span><span class=\"zh\">伯克利传奇教材《The Advancing Guitarist》的核心法则——<b>受限创造力</b>：故意只允许自己用 <b>3 个音（1–♭3–5）</b> 或只在 <b>1 根琴弦（单弦练习）</b> 上即兴，能瞬间废掉手指机械爬格子的惯性，逼出滑音、切分、强弱动态与揉弦。</span></p><p><span class=\"en\">Guthrie Govan compares guitar phrasing to human speech: play a short 2-bar statement, then <b>physically lift your fingers off the strings for 1–2 beats</b> like a singer taking a breath. Bends must hit the exact target pitch—test by fretting the destination note first.</span><span class=\"zh\">Guthrie Govan 把电吉他乐句比作人声说话：弹完两小节句子后，<b>强迫左手离开琴弦留白呼吸一两拍</b>。每一次推弦都像主唱滑音，必须先按响目标品格校准耳朵，再从低音推到分毫不差的音高。</span></p>"
  },
  "g11-changes-phrasing": {
    "t": "布鲁斯问答句法与“Playing the Changes”目标音变色实战",
    "te": "Blues Call-and-Response & Playing the Changes over I7–IV7–V7",
    "src": "双语精读 · 提炼自 JustinGuitar Blues Lead 与 StichMethod 变色法则",
    "u": "https://www.justinguitar.com/modules/essential-blues-lead-guitar",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Blues Call-and-Response &amp; Playing the Changes over I7–IV7–V7</span><span class=\"zh\">布鲁斯问答句法与“Playing the Changes”目标音变色实战</span></h4><p><span class=\"en\">Authentic 12-bar blues follows an <b>AAB vocal call-and-response</b>: bars 1–2 ask a musical question (ending on an unstable tone like ♭3, 4, or 5), bars 3–4 leave space or answer on the root, bars 5–6 repeat the question over IV7, and bars 9–10 climax over V7–IV7.</span><span class=\"zh\">地道 12 小节布鲁斯遵循 <b>AAB 问答结构</b>：第 1–2 小节提出问句（常停在 ♭3、4 或 5 音留出悬念），第 3–4 小节留白呼吸或回答在根音，第 5–6 小节在 IV7 上复述问句，第 9–10 小节在 V7–IV7 上推向全曲高潮。</span></p><p><span class=\"en\">In A blues, A minor pentatonic (A–C–D–E–G) contains the ♭7 of A7 (G, 2nd string 8th fret). The instant bar 5 hits <b>D7 (D–F♯–A–C)</b>, drop that G down one fret to <b>F♯ (2nd string 7th fret or 4th string 4th fret)</b>—and at bar 9 <b>E7</b>, hit <b>G♯ (2nd string 9th fret / 4th string 6th fret)</b>.</span><span class=\"zh\">在 A 调布鲁斯中，A 小调五声自带 A7 的 ♭7 音（G，2弦8品）。一旦第 5 小节进入 <b>D7（D–F♯–A–C）</b>，把 2弦8品 G 往左退 1 品按住 <b>2弦7品 F♯（或 4弦4品 F♯）</b>；第 9 小节进 <b>E7</b> 时点亮 <b>2弦9品 / 4弦6品 G♯</b>——哪怕关掉伴奏，听众也能听见你手里的和弦在进行！</span></p>"
  },
  "g13-master-lines": {
    "t": "Jens Larsen & Goodrick：大师独奏中的 3–7 引导线与半音包围（Enclosure）",
    "te": "Jens Larsen & Goodrick: Guide-Tone Targeting & Chromatic Enclosures in Solos",
    "src": "双语精读 · 提炼自 Jens Larsen 爵士/现代吉他教程与目标音分析法",
    "u": "https://www.youtube.com/@JensLarsen",
    "verbatim": false,
    "credit": "电吉他指板与名师实战双语精读（与上面嵌页的 OMT 大学乐理原文互补，涵盖指板几何、CAGED、壳和弦与大师手法）。可切换中/英与术语悬停。",
    "h": "<h4><span class=\"en\">Jens Larsen &amp; Goodrick: Guide-Tone Targeting &amp; Chromatic Enclosures in Solos</span><span class=\"zh\">Jens Larsen &amp; Goodrick：大师独奏中的 3–7 引导线与半音包围（Enclosure）</span></h4><p><span class=\"en\">When analyzing solos by David Gilmour, John Mayer, Larry Carlton, or jazz masters, <b>over 80% of strong-beat notes (beats 1 and 3) and long bends land on the active chord's 3rd, 7th, 5th, or 9th</b>. Scale runs only serve as bridges between these pillars.</span><span class=\"zh\">拆解 Gilmour、John Mayer、Larry Carlton 或爵士大师的经典独奏会发现：<b>超过 80% 的强拍落音（第 1、3 拍）与长推弦终点，都精准踩在当前和弦的 3 音、7 音、5 音或 9 音上</b>；音阶跑动只是连接这些桥墩的引桥。</span></p><p><span class=\"en\">To make arpeggios sound like real music instead of exercises, precede the target chord tone on beat 4 with a <b>chromatic approach from 1 fret below</b> or a <b>two-note enclosure</b> (1 scale step above + 1 half step below → target tone on beat 1).</span><span class=\"zh\">要让和弦音即兴摆脱“像在练琶音练习曲”的生硬感，秘诀是在前一拍弱拍用<b>下方半音趋近（低 1 品滑入）</b>或<b>双音包围（上方邻音 + 下方半音 → 第 1 拍命中目标 3 音）</b>。</span></p>"
  }
});
