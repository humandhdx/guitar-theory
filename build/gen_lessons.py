"""生成 G4～G15 的高质量单文件交互式 HTML 讲义（内嵌 SVG 全局地图、完整五段式概念卡、可点按发声 SVG 指板、持续音伴奏、练习、分歧点、5 道自测与歌曲试听）。"""
import html
import json
import subprocess
from pathlib import Path
from lesson_specs_a import SPECS_A
from lesson_specs_b import SPECS_B

ROOT = Path(__file__).resolve().parent.parent
LESSONS_DIR = ROOT / "lessons"

TEMPLATE = """<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{id} 讲义：{short_title}</title>
<style>
:root {{
  color-scheme: light;
  --paper: #eef1eb; --sheet: #fbfcf9; --ink: #1b2533; --ink-2: #3f4a58; --pencil: #5f6975;
  --rule: #d6ddd2; --rule-soft: #e5e9e1; --blue: #2557a7; --blue-wash: #e9eff8;
  --marker: #e2f25a; --red: #b3322a; --red-wash: #f6e3e0; --code-bg: #f2f5ef; --good: #2e7a33;
  --font-text: "DengXian", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-note: "KaiTi", "STKaiti", "楷体", serif;
  --font-code: "Cascadia Mono", Consolas, monospace;
}}
@media (prefers-color-scheme: dark) {{
  :root {{
    color-scheme: dark;
    --paper: #13161b; --sheet: #1a1e25; --ink: #e4e8ed; --ink-2: #c3cad3; --pencil: #98a2ae;
    --rule: #2e343d; --rule-soft: #242930; --blue: #86abe8; --blue-wash: #1f2836;
    --marker: #d2e255; --red: #f08378; --red-wash: #3a2422; --code-bg: #15191f; --good: #6fc275;
  }}
}}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.75 var(--font-text); }}
a {{ color: var(--blue); text-underline-offset: 3px; text-decoration-thickness: 1px; }}
a:hover {{ text-decoration-thickness: 2px; }}
code {{ font-family: var(--font-code); font-size: 0.88em; background: var(--code-bg); padding: 0.1em 0.3em; border-radius: 3px; }}
.top {{ max-width: 900px; margin: 0 auto; padding: 18px 20px 0; display: flex; justify-content: space-between; gap: 12px; font-size: 14px; color: var(--pencil); }}
main {{ max-width: 900px; margin: 10px auto 48px; background: var(--sheet); border: 1px solid var(--rule); border-radius: 6px; padding: 36px 52px 48px; }}
p, li, dd, .note {{ max-width: 44em; }}
h1 {{ font-size: 27px; line-height: 1.35; margin: 0 0 10px; }}
h2 {{ font-size: 21px; margin: 48px 0 14px; padding-top: 20px; border-top: 1px solid var(--rule); }}
h3 {{ font-size: 17.5px; margin: 0 0 6px; }}
.lead {{ font-size: 17px; color: var(--ink-2); }}
.note {{ font-family: var(--font-note); color: var(--red); font-size: 17px; }}
.meta {{ display: grid; grid-template-columns: 7em 1fr; gap: 4px 14px; margin: 18px 0; font-size: 15px; }}
.meta dt {{ color: var(--pencil); }} .meta dd {{ margin: 0; }}
.toc {{ background: var(--blue-wash); border-radius: 6px; padding: 12px 18px; font-size: 15px; }}
.toc ol {{ margin: 4px 0 0; padding-left: 1.4em; columns: 2; column-gap: 28px; }}
figure {{ margin: 16px 0; }}
figure > svg {{ width: 100%; height: auto; display: block; }}
.concept {{ border-left: 3px solid var(--rule); padding: 2px 0 2px 18px; margin: 28px 0; }}
.concept dl {{ margin: 8px 0 0; }}
.concept dt {{ font-size: 14px; font-weight: 700; color: var(--pencil); margin-top: 10px; }}
.concept dd {{ margin: 2px 0 0; }}
.concept dd.myth {{ color: var(--red); font-family: var(--font-note); font-size: 16.5px; }}
.play {{ font: 13px var(--font-text); color: var(--blue); background: var(--sheet); border: 1px solid var(--blue); border-radius: 999px; padding: 2px 11px; cursor: pointer; margin: 4px 6px 4px 0; white-space: nowrap; }}
.play::before {{ content: "▶ "; font-size: 10px; }}
.play:hover {{ background: var(--blue-wash); }}
table {{ border-collapse: collapse; width: 100%; font-size: 15px; margin: 10px 0 18px; }}
th, td {{ text-align: left; vertical-align: top; padding: 8px 10px; border-bottom: 1px solid var(--rule); }}
th {{ color: var(--pencil); font-weight: 400; font-size: 14px; border-bottom-color: var(--ink-2); }}
details {{ border: 1px solid var(--rule); border-radius: 5px; padding: 8px 14px; margin: 8px 0 18px; }}
summary {{ cursor: pointer; color: var(--blue); }}
.q {{ margin: 20px 0 6px; }} .q b {{ color: var(--pencil); font-weight: 400; font-size: 14px; margin-right: 6px; }}
ol.drill li {{ margin: 10px 0; }}
ol.drill .std {{ display: block; font-size: 14px; color: var(--pencil); }}
.handoff {{ background: var(--red-wash); border-radius: 6px; padding: 14px 20px; }}
.handoff h2 {{ border: 0; margin-top: 0; padding-top: 0; }}
.lab {{ border: 1px solid var(--rule); border-radius: 6px; padding: 14px 16px; margin: 14px 0 20px; }}
.ctl {{ display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; margin-bottom: 8px; font-size: 14px; }}
.btn {{ font: 13.5px var(--font-text); color: var(--ink); background: var(--sheet); border: 1px solid var(--rule); border-radius: 5px; padding: 3px 10px; cursor: pointer; }}
.btn:hover {{ border-color: var(--ink-2); }}
.btn.on {{ border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); font-weight: 700; background: var(--blue-wash); }}
.btn.primary {{ background: var(--ink); color: var(--sheet); border-color: var(--ink); }}
.fb-scroll {{ overflow-x: auto; }}
.fb {{ display: block; width: 100%; min-width: 700px; height: auto; }}
.fb .fret {{ stroke: var(--rule); stroke-width: 2; }}
.fb .nut {{ stroke: var(--ink); stroke-width: 5; }}
.fb .string {{ stroke: var(--pencil); }}
.fb .inlay {{ fill: var(--rule); }}
.fb .sname, .fb .fnum {{ fill: var(--pencil); font-size: 12px; }}
.fb .sname {{ text-anchor: end; }} .fb .fnum {{ text-anchor: middle; }}
.fb .cell rect {{ fill: transparent; cursor: pointer; }}
.fb .cell:hover rect {{ fill: var(--blue-wash); }}
.fb .win {{ fill: rgba(37, 87, 167, 0.09); stroke: var(--blue); stroke-width: 1.5; stroke-dasharray: 5 4; pointer-events: none; }}
.fb .dot {{ stroke-width: 1.5; pointer-events: none; }}
.fb .dot.tone {{ fill: var(--sheet); stroke: var(--ink); }}
.fb .dot.root {{ fill: var(--ink); stroke: var(--ink); }}
.fb .dot.color {{ fill: var(--red-wash); stroke: var(--red); stroke-width: 2; }}
.fb .dot.dim {{ opacity: 0.22; }}
.fb .dl {{ font-size: 11px; font-weight: 700; text-anchor: middle; fill: var(--ink); pointer-events: none; }}
.fb .dl.root {{ fill: var(--sheet); }}
.fb .dl.color {{ fill: var(--red); }}
.fb .dl.dim {{ opacity: 0.22; }}
@media (max-width: 720px) {{ main {{ padding: 22px 16px 32px; }} .toc ol {{ columns: 1; }} .meta {{ grid-template-columns: 1fr; }} }}
</style>
</head>
<body>
<div class="top"><a href="../index.html#/lessons">返回讲义列表</a><span>{id} {short_title} · {phase}</span></div>
<main>
<h1>{title}</h1>
<p class="lead">{lead}</p>
<dl class="meta">
  <dt>学完能做到</dt><dd>{goal}</dd>
  <dt>主资料</dt><dd>{source}</dd>
</dl>

<nav class="toc" aria-label="目录"><b>目录</b><ol>
  <li><a href="#map">全局地图</a></li>
  <li><a href="#concepts">逐个概念</a></li>
  <li><a href="#lab">交互指板与伴奏实验室</a></li>
  <li><a href="#drills">上琴练习</a></li>
  <li><a href="#choices">分歧点对照</a></li>
  <li><a href="#reading">读原资料指南</a></li>
  <li><a href="#quiz">自测 5 题</a></li>
  <li><a href="#songs">在歌里听一听</a></li>
  <li><a href="#handoff">带去原资料的 3 个问题</a></li>
</ol></nav>

<h2 id="map">1. 全局地图</h2>
<figure>{map_svg}</figure>

<h2 id="concepts">2. 逐个概念</h2>
{concepts_html}

<h2 id="lab">3. 交互指板与伴奏实验室</h2>
<p>点下方预设快速切换把位与音阶/和弦；点任意一格都能发声，开启持续音即可直接对着指板练习即兴与听辨。</p>
<div class="lab">
  <div class="ctl" id="lab-presets"></div>
  <div class="ctl">
    <button class="btn on" id="lab-mode" data-m="name">显示：音名 / 级数切换</button>
    <button class="btn primary" id="lab-play">播放示例</button>
    <button class="btn" id="lab-drone">持续音伴奏：关</button>
  </div>
  <p id="lab-desc" style="font-size:14.5px;margin:4px 0 8px"></p>
  <div class="fb-scroll"><svg class="fb" id="lab-svg" viewBox="0 0 880 215"></svg></div>
  <p style="font-size:13.5px;color:var(--pencil);margin:8px 0 0"><a href="../index.html#/fretboard">前往主站完整指板与五度圈实验室 ↗</a>　｜　<a href="../index.html#/ear">前往练耳与节奏实验室 ↗</a></p>
</div>

<h2 id="drills">4. 上琴练习</h2>
<ol class="drill">{drills_html}</ol>

<h2 id="choices">5. 分歧点对照</h2>
<table>
  <thead><tr><th>容易混淆的两面</th><th>核心区别</th><th>实战怎么选</th></tr></thead>
  <tbody>{choices_html}</tbody>
</table>

<h2 id="reading">6. 读原资料指南</h2>
<ul>{reads_html}</ul>

<h2 id="quiz">7. 自测 5 题</h2>
{quiz_html}

<h2 id="songs">8. 在歌里听一听</h2>
<ul>{songs_html}</ul>

<section class="handoff" id="handoff">
<h2>9. 带去原资料的 3 个问题</h2>
<ol>{handoff_html}</ol>
</section>
</main>

<script>
(function(){{
  const PRESETS = {presets_json};
  const LET = "CDEFGAB", LPC = [0,2,4,5,7,9,11];
  const ACC = {{"-2":"𝄫","-1":"♭","0":"","1":"♯","2":"𝄪"}};
  const SHARP = ["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
  const OPEN = [64, 59, 55, 50, 45, 40];
  const TYPES = {{
    major: {{g:"音阶",ivs:["1","2","3","4","5","6","7"],c:[]}},
    minor: {{g:"音阶",ivs:["1","2","♭3","4","5","♭6","♭7"],c:[]}},
    harmonic: {{g:"音阶",ivs:["1","2","♭3","4","5","♭6","7"],c:["7"]}},
    melodic: {{g:"音阶",ivs:["1","2","♭3","4","5","6","7"],c:["6","7"]}},
    minorPenta: {{g:"音阶",ivs:["1","♭3","4","5","♭7"],c:[]}},
    majorPenta: {{g:"音阶",ivs:["1","2","3","5","6"],c:[]}},
    blues: {{g:"音阶",ivs:["1","♭3","4","♭5","5","♭7"],c:["♭5"]}},
    majorBlues: {{g:"音阶",ivs:["1","2","♭3","3","5","6"],c:["♭3"]}},
    dorian: {{g:"音阶",ivs:["1","2","♭3","4","5","6","♭7"],c:["6"]}},
    phrygian: {{g:"音阶",ivs:["1","♭2","♭3","4","5","♭6","♭7"],c:["♭2"]}},
    phrygianDominant: {{g:"音阶",ivs:["1","♭2","3","4","5","♭6","♭7"],c:["♭2","3"]}},
    lydian: {{g:"音阶",ivs:["1","2","3","♯4","5","6","7"],c:["♯4"]}},
    mixolydian: {{g:"音阶",ivs:["1","2","3","4","5","6","♭7"],c:["♭7"]}},
    maj: {{g:"和弦",ivs:["1","3","5"],c:["3"]}},
    min: {{g:"和弦",ivs:["1","♭3","5"],c:["♭3"]}},
    maj7: {{g:"和弦",ivs:["1","3","5","7"],c:["3","7"]}},
    dom7: {{g:"和弦",ivs:["1","3","5","♭7"],c:["3","♭7"]}},
    m7: {{g:"和弦",ivs:["1","♭3","5","♭7"],c:["♭3","♭7"]}},
    m7b5: {{g:"和弦",ivs:["1","♭3","♭5","♭7"],c:["♭3","♭7"]}},
    dom7s9: {{g:"和弦",ivs:["1","3","5","♭7","♯9"],c:["3","♯9"]}}
  }};
  function parseN(n){{
    let acc=0; for(const ch of n.slice(1)) acc+=ch==="♯"?1:ch==="♭"?-1:0;
    return {{li:LET.indexOf(n[0]), pc:(LPC[LET.indexOf(n[0])]+acc+120)%12}};
  }}
  function parseD(lab){{
    let acc=0,i=0; const cs=[...lab];
    while(i<cs.length&&/[♯♭𝄪𝄫]/u.test(cs[i])) acc+=cs[i++]==="♯"?1:cs[i-1]==="♭"?-1:cs[i-1]==="𝄪"?2:-2;
    const d=Number(cs.slice(i).join("")), st=(d-1)%7;
    return {{st, semis:LPC[st]+12*Math.floor((d-1)/7)+acc}};
  }}
  function spell(root,lab){{
    const r=parseN(root), g=parseD(lab), li=(r.li+g.st)%7, pc=(r.pc+g.semis)%12;
    return LET[li]+(ACC[String(((pc-LPC[li]+18)%12)-6)]||"");
  }}

  let ctx=null, drone=null;
  const freq=m=>440*Math.pow(2,(m-69)/12);
  function ac(){{ if(!ctx){{ const A=window.AudioContext||window.webkitAudioContext; if(A) ctx=new A(); }} if(ctx&&ctx.state==="suspended") ctx.resume(); return ctx; }}
  function play(midi,delay=0,vel=0.9){{
    const c=ac(); if(!c) return;
    const sr=c.sampleRate, f=freq(midi), N=Math.max(2,Math.floor(sr/f-0.5)), len=Math.floor(sr*1.5);
    const buf=c.createBuffer(1,len,sr), y=buf.getChannelData(0);
    for(let i=0;i<N;i++) y[i]=Math.random()*2-1;
    for(let i=N;i<len;i++) y[i]=0.996*0.5*(y[i-N]+y[i-N-1]);
    const s=c.createBufferSource(); s.buffer=buf; const g=c.createGain(); g.gain.value=0.28*vel;
    s.connect(g).connect(c.destination); s.start(c.currentTime+0.01+delay);
  }}
  function stopDrone(){{
    if(!drone) return;
    try{{ drone.g.gain.setTargetAtTime(0.0001,drone.c.currentTime,0.08); setTimeout(()=>drone.os.forEach(o=>{{try{{o.stop();}}catch(_){{}}}}),300); }}catch(_){{}}
    drone=null;
  }}
  function startDrone(pc){{
    stopDrone(); const c=ac(); if(!c) return;
    const f1=freq(40+((pc-4+12)%12)), f2=f1*1.5;
    const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=420;
    const g=c.createGain(); g.gain.value=0.0001; lp.connect(g).connect(c.destination);
    g.gain.setTargetAtTime(0.13,c.currentTime,0.15);
    const os=[[f1,"sawtooth",0.55],[f2,"triangle",0.25]].map(([f,t,v])=>{{const o=c.createOscillator(),og=c.createGain();o.type=t;o.frequency.value=f;og.gain.value=v;o.connect(og).connect(lp);o.start();return o;}});
    drone={{pc,os,g,c}};
  }}

  let curP=0, mode="name";
  function draw(){{
    const P=PRESETS[curP], T=TYPES[P.type]||TYPES.major, rp=parseN(P.root).pc;
    const map={{}};
    T.ivs.forEach(lab=>{{ map[(rp+parseD(lab).semis)%12]={{lab,name:spell(P.root,lab),root:lab==="1",col:T.c.includes(lab)}}; }});
    document.getElementById("lab-presets").innerHTML = PRESETS.map((x,i)=>`<button class="btn ${{i===curP?"on":""}}" data-p="${{i}}">${{x.label}}</button>`).join("");
    document.getElementById("lab-desc").textContent = P.desc + "　（黑实心 = 根音 · 红框 = 特征音/3·7音）";
    document.getElementById("lab-mode").textContent = "当前显示：" + (mode==="name"?"音名":"级数") + "（点击切换）";
    const db = document.getElementById("lab-drone");
    db.textContent = drone ? `持续音：${{P.root}}（点击关闭）` : `持续音伴奏：${{P.root}}`;
    db.classList.toggle("on", !!drone);

    const L=44,OPENW=38,FW=51,TOP=18,SS=28,FRETS=15;
    const fx=f=>f===0?L+OPENW/2:L+OPENW+(f-0.5)*FW, sy=s=>TOP+s*SS;
    let g="";
    if(P.win){{
      const x1=P.win[0]===0?L:L+OPENW+(P.win[0]-1)*FW, x2=P.win[1]===0?L+OPENW:L+OPENW+P.win[1]*FW;
      g+=`<rect class="win" x="${{x1}}" y="${{sy(0)-13}}" width="${{x2-x1}}" height="${{5*SS+26}}" rx="6"/>`;
    }}
    for(let k=0;k<=FRETS;k++){{ const x=L+OPENW+k*FW; g+=`<line class="${{k===0?"nut":"fret"}}" x1="${{x}}" y1="${{sy(0)}}" x2="${{x}}" y2="${{sy(5)}}"/>`; }}
    [3,5,7,9,15].forEach(f=>{{ g+=`<circle class="inlay" cx="${{fx(f)}}" cy="${{(sy(2)+sy(3))/2}}" r="4.5"/>`; }});
    g+=`<circle class="inlay" cx="${{fx(12)}}" cy="${{(sy(1)+sy(2))/2}}" r="4.5"/><circle class="inlay" cx="${{fx(12)}}" cy="${{(sy(3)+sy(4))/2}}" r="4.5"/>`;
    for(let s=0;s<6;s++){{
      g+=`<line class="string" x1="${{L+OPENW}}" y1="${{sy(s)}}" x2="${{L+OPENW+FRETS*FW}}" y2="${{sy(s)}}" style="stroke-width:${{(0.8+s*0.3).toFixed(2)}}"/>`;
      g+=`<text class="sname" x="${{L-8}}" y="${{sy(s)+4}}">${{s+1}} ${{SHARP[OPEN[s]%12]}}</text>`;
    }}
    for(let f=1;f<=FRETS;f++) g+=`<text class="fnum" x="${{fx(f)}}" y="${{sy(5)+26}}">${{f}}</text>`;
    g+=`<text class="fnum" x="${{fx(0)}}" y="${{sy(5)+26}}">空</text>`;
    for(let s=0;s<6;s++){{
      for(let f=0;f<=FRETS;f++){{
        const pc=(OPEN[s]+f)%12, x=fx(f), y=sy(s), cw=f===0?OPENW:FW;
        let mk="";
        if(map[pc]){{
          const n=map[pc], cls=n.root?"root":n.col?"color":"tone", dim=(P.win&&(f<P.win[0]||f>P.win[1]))?" dim":"";
          mk=`<circle class="dot ${{cls}}${{dim}}" cx="${{x}}" cy="${{y}}" r="10.5"/><text class="dl ${{cls}}${{dim}}" x="${{x}}" y="${{y+4}}">${{mode==="deg"?n.lab:n.name}}</text>`;
        }}
        g+=`<g class="cell" data-m="${{OPEN[s]+f}}"><rect x="${{x-cw/2}}" y="${{y-SS/2}}" width="${{cw}}" height="${{SS}}"/>${{mk}}</g>`;
      }}
    }}
    document.getElementById("lab-svg").innerHTML = g;
  }}

  document.addEventListener("click",e=>{{
    const p=e.target.closest(".play");
    if(p){{
      const arr=p.dataset.notes.split(",").map(Number), mode=p.dataset.mode;
      if(mode==="chord") arr.forEach((m,i)=>play(m,i*0.035));
      else if(mode==="seq") arr.forEach((m,i)=>play(m,i*0.18));
      else arr.forEach((m,i)=>play(m,i*0.26));
      return;
    }}
    const pb=e.target.closest("#lab-presets button");
    if(pb){{ curP=Number(pb.dataset.p); if(drone) startDrone(parseN(PRESETS[curP].root).pc); draw(); return; }}
    const cell=e.target.closest(".cell");
    if(cell){{ play(Number(cell.dataset.m)); return; }}
  }});
  document.getElementById("lab-mode").addEventListener("click",()=>{{ mode=mode==="name"?"deg":"name"; draw(); }});
  document.getElementById("lab-play").addEventListener("click",()=>{{
    const P=PRESETS[curP], T=TYPES[P.type]||TYPES.major, base=40+((parseN(P.root).pc-4+12)%12);
    const semis=T.ivs.map(x=>parseD(x).semis);
    if(T.g==="和弦") semis.forEach((s,i)=>play(base+s,i*0.04));
    else [...semis,12].forEach((s,i)=>play(base+s,i*0.25));
  }});
  document.getElementById("lab-drone").addEventListener("click",()=>{{
    if(drone) stopDrone(); else startDrone(parseN(PRESETS[curP].root).pc);
    draw();
  }});
  draw();
}})();
</script>
</body>
</html>
"""

def build_map_svg(rows):
    h = 36 + len(rows) * 42 + 8
    items = [
        '<g font-size="13" fill="var(--pencil)"><text x="8" y="20">核心概念</text><text x="225" y="20">理论要点</text><text x="515" y="20">在指板与耳朵上</text></g>'
    ]
    for i, (col1, col2, col3) in enumerate(rows):
        y = 34 + i * 42
        fill1 = 'fill="var(--blue-wash)" stroke="var(--blue)"' if i in (0, 2) else 'fill="var(--sheet)" stroke="var(--rule)"'
        items.append(
            f'<rect x="8" y="{y}" width="185" height="34" rx="4" {fill1}/><text x="18" y="{y+22}" font-size="13.5" font-weight="700" fill="var(--ink)">{html.escape(col1)}</text>'
            f'<rect x="225" y="{y}" width="260" height="34" rx="4" fill="var(--sheet)" stroke="var(--rule)"/><text x="235" y="{y+22}" font-size="12.5" fill="var(--ink)">{html.escape(col2)}</text>'
            f'<rect x="515" y="{y}" width="235" height="34" rx="4" fill="var(--sheet)" stroke="var(--rule)"/><text x="525" y="{y+22}" font-size="12.5" fill="var(--ink)">{html.escape(col3)}</text>'
        )
    return f'<svg viewBox="0 0 760 {h}" role="img" aria-label="本模块概念全局地图">{"".join(items)}</svg>'

for s in SPECS_A + SPECS_B:
    chtml = []
    for cid, h, what, why, on_fb, btns, myth in s["concepts"]:
        bhtml = "".join(
            f'<button class="play" data-mode="{mode}" data-notes="{",".join(map(str, notes))}">{html.escape(lbl)}</button>'
            for lbl, mode, notes in btns
        )
        chtml.append(
            f'<section class="concept" id="{cid}"><h3>{html.escape(h)}</h3><dl>'
            f'<dt>是什么</dt><dd>{what}</dd>'
            f'<dt>为什么需要</dt><dd>{why}</dd>'
            f'<dt>在指板上</dt><dd>{on_fb}</dd>'
            f'{f"<dt>听起来</dt><dd>{bhtml}</dd>" if bhtml else ""}'
            f'<dt>常见误解</dt><dd class="myth">{html.escape(myth)}</dd>'
            f'</dl></section>'
        )
    dhtml = "".join(f'<li><b>{html.escape(t)}</b>（{html.escape(bpm)}）：{html.escape(desc)}<span class="std">重点验证：按节拍稳定、说得出级数与音名。</span></li>' for t, bpm, desc in s["drills"])
    ch_html = "".join(f'<tr><td><b>{html.escape(a)}</b></td><td>{html.escape(b)}</td><td>{html.escape(c)}</td></tr>' for a, b, c in s["choices"])
    rhtml = "".join(f'<li><a href="{html.escape(u)}" target="_blank" rel="noopener">{html.escape(t)} ↗</a> — {html.escape(note)}</li>' for t, u, note in s["reads"])
    qhtml = "".join(f'<div class="q"><b>{i+1}.</b> {html.escape(q)}</div><details><summary>答案</summary><p>{html.escape(a)}</p></details>' for i, (q, a) in enumerate(s["quiz"]))
    shtml = "".join(
        f'<li><b>{html.escape(t)}</b>（{html.escape(art)}）：{html.escape(desc)} <button class="play" data-mode="seq" data-notes="{",".join(map(str, notes))}">试听核心片段</button></li>'
        for t, art, desc, notes in s["songs"]
    )
    hhtml = "".join(f"<li>{html.escape(x)}</li>" for x in s["handoff"])
    short_title = s["title"].split("：")[0]
    out = TEMPLATE.format(
        id=s["id"], phase=s["phase"], title=html.escape(s["title"]), short_title=html.escape(short_title),
        lead=html.escape(s["lead"]), goal=html.escape(s["goal"]), source=html.escape(s["source"]),
        map_svg=build_map_svg(s["map_rows"]),
        concepts_html="\n".join(chtml),
        presets_json=json.dumps(s["presets"], ensure_ascii=False),
        drills_html=dhtml, choices_html=ch_html, reads_html=rhtml,
        quiz_html=qhtml, songs_html=shtml, handoff_html=hhtml
    )
    (LESSONS_DIR / s["file"]).write_text(out, encoding="utf-8")
    print("Generated rich interactive lesson:", s["file"])

subprocess.run(["node", str(ROOT / "build" / "embed_lesson_readings.js")], check=True)
