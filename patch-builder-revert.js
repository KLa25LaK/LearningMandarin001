const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let html = fs.readFileSync(PATH, 'utf8');

// Replace builder-711 layout CSS block
const layoutStart = html.indexOf('.builder-711 .builder-row{');
const layoutEnd = html.indexOf('/* —— COCO boissons —— */');
if (layoutStart < 0 || layoutEnd < 0) throw new Error('CSS block not found');

const builderCss = `.builder-711 .builder-row{margin-bottom:.85rem}
.builder-711 .builder-row:last-of-type{margin-bottom:.35rem}
.builder-stem{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.stem-cell{
  background:rgba(255,255,255,.85);border-radius:12px;padding:.55rem .6rem;
  border:1px solid rgba(167,139,250,.2);min-width:0;
}
.stem-cell-zh{border-color:rgba(110,200,170,.35)}
.stem-cell-pick{border-color:rgba(167,139,250,.35);padding:.45rem .5rem}
.stem-text .zh-line{font-size:clamp(1.02rem,4vw,1.18rem);font-weight:700;color:var(--pink-deep);display:block}
.stem-text .pinyin{font-size:clamp(.8rem,2.5vw,.92rem);display:block;margin-top:.12rem}
.stem-audio{margin-top:.4rem}
.btn-chip{
  display:inline-flex;align-items:center;gap:.2rem;padding:.3rem .55rem;
  border-radius:999px;border:2px solid #fff;font-size:.68rem;font-weight:700;
  cursor:pointer;font-family:inherit;box-shadow:0 2px 6px rgba(0,0,0,.06);touch-action:manipulation;
}
.btn-chip.btn-zh{background:linear-gradient(145deg,#d4faf0,#a8e6cf);color:#047857}
.btn-chip.btn-fr{background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6}
.stem-cell-pick .pick-enhanced{position:relative;width:100%}
.stem-cell-pick .pick-select-native{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.stem-cell-pick .pick-trigger{
  width:100%;display:flex;align-items:center;gap:.35rem;padding:0;min-height:0;
  border:none;border-radius:0;background:transparent;cursor:pointer;
  box-shadow:none;touch-action:manipulation;text-align:left;font-family:inherit;
}
.stem-cell-pick .pick-trigger::after{content:'▾';color:var(--lav-deep);font-size:.95rem;flex-shrink:0;margin-left:auto}
.stem-cell-pick .pick-trigger.is-open::after{content:'▴'}
.stem-cell-pick .pick-trigger-inner{flex:1;min-width:0;line-height:1.25}
.stem-cell-pick .pick-trigger .pick-opt-zh{font-size:clamp(.95rem,3.8vw,1.1rem);font-weight:700;color:var(--ink)}
.stem-cell-pick .pick-trigger .pick-opt-py{font-size:clamp(.72rem,2.2vw,.82rem);color:var(--muted)}
.stem-cell-pick .pick-trigger .pick-opt-fr{
  font-size:clamp(.68rem,2vw,.78rem);color:var(--lav-deep);font-family:var(--font-fr);
  display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.stem-cell-pick .pick-menu{
  position:absolute;left:0;right:0;top:calc(100% + .3rem);z-index:80;
  max-height:min(50vh,300px);overflow-y:auto;-webkit-overflow-scrolling:touch;
  background:#fff;border:2px solid var(--lav-soft);border-radius:12px;
  box-shadow:0 12px 28px rgba(80,60,100,.18);padding:.3rem;
}
.stem-cell-pick .pick-menu[hidden]{display:none!important}
.stem-cell-pick .pick-option{
  display:block;width:100%;text-align:left;border:none;background:transparent;
  padding:.45rem .5rem;margin:0 0 .25rem;border-radius:10px;cursor:pointer;
  font-family:inherit;touch-action:manipulation;
}
.stem-cell-pick .pick-option:last-child{margin-bottom:0}
.stem-cell-pick .pick-option:hover,.stem-cell-pick .pick-option:focus{background:var(--lav-soft)}
.stem-cell-pick .pick-option.is-selected{background:linear-gradient(135deg,var(--pink-soft),#fff)}
.pick-opt-card{width:100%}
.pick-opt-text{padding:0 .1rem .35rem}
.pick-opt-zh{display:block;font-size:1rem;font-weight:700;color:var(--ink)}
.pick-opt-py{display:block;font-size:.82rem;color:var(--muted)}
.pick-opt-fr{display:block;font-size:.78rem;color:var(--lav-deep);font-family:var(--font-fr);line-height:1.3}
.pick-opt-audio{
  display:grid;grid-template-columns:1fr 1fr;gap:.3rem;
  padding-top:.3rem;border-top:1px dashed rgba(167,139,250,.22);
}
.pick-audio-zh,.pick-audio-fr{display:flex;flex-wrap:wrap;align-items:center;gap:.25rem}
.pick-audio-label{font-size:.65rem;font-weight:700;width:100%}
.pick-audio-zh .pick-audio-label{color:#047857}
.pick-audio-fr .pick-audio-label{color:#5b21b6}
.sentence-speak-bar{
  margin-top:.65rem;padding:.5rem .65rem;border-radius:12px;
  background:linear-gradient(135deg,rgba(212,250,240,.45),rgba(237,233,254,.55));
  border:1px solid rgba(167,139,250,.3);
  display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.4rem .5rem;
}
.sentence-speak-bar[hidden]{display:none!important}
.sentence-speak-hint{width:100%;margin:0;text-align:center;font-size:.75rem;font-weight:700;color:var(--lav-deep)}
.sentence-speak-bar .btn-sentence{
  padding:.4rem .75rem;border-radius:999px;border:2px solid #fff;font-size:.78rem;font-weight:700;
  cursor:pointer;font-family:inherit;touch-action:manipulation;
}
.sentence-speak-bar .btn-sentence.btn-zh{background:linear-gradient(145deg,#d4faf0,#a8e6cf);color:#047857}
.sentence-speak-bar .btn-sentence.btn-fr{background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6;font-family:var(--font-fr)}
@media(max-width:768px){
  .builder-stem{grid-template-columns:1fr}
  .pick-opt-audio{grid-template-columns:1fr}
}
`;

html = html.slice(0, layoutStart) + builderCss + html.slice(layoutEnd);

// Rebuild builder rows: 2-col stem, pick replaces FR cell
const rowRe = /<div class="builder-row">[\s\S]*?<select id="(pick-\w+)">([\s\S]*?)<\/select>\s*<\/div>\s*<\/div>/g;
const stems = {
  'pick-buy': {
    zh: '<span class="zh-line zh">我要去7-11買</span><span class="pinyin">Wǒ yào qù 7-11 mǎi</span>',
    zhs: '我要去7-11買',
  },
  'pick-pay': {
    zh: '<span class="zh-line zh">我要去7-11繳</span><span class="pinyin">Wǒ yào qù 7-11 jiǎo</span>',
    zhs: '我要去7-11繳',
  },
  'pick-svc': {
    zh: '<span class="zh-line zh">我要去7-11</span><span class="pinyin">Wǒ yào qù 7-11</span>',
    zhs: '我要去7-11',
  },
};

html = html.replace(rowRe, (_, id, options) => {
  const s = stems[id];
  return `<div class="builder-row">
  <div class="builder-stem">
    <div class="stem-cell stem-cell-zh">
      <div class="stem-text">${s.zh}</div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="${s.zhs}" title="聽句型">句型 🔊</button></div>
    </div>
    <div class="stem-cell stem-cell-pick">
      <select id="${id}">${options}</select>
    </div>
  </div>
</div>`;
});

// Bump pick UI version so enhanced selects rebuild
html = html.replace(/sel\.dataset\.pickUi==='2'/g, "sel.dataset.pickUi==='3'");
html = html.replace(/sel\.dataset\.pickUi='2'/g, "sel.dataset.pickUi='3'");

fs.writeFileSync(PATH, html);
console.log('revert ok');
