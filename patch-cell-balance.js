const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let html = fs.readFileSync(PATH, 'utf8');

const cssStart = html.indexOf('.builder-stem{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}');
const cssEnd = html.indexOf('/* —— COCO boissons —— */');
if (cssStart < 0 || cssEnd < 0) throw new Error('CSS not found');

const newCss = `.builder-stem{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;align-items:stretch}
.stem-cell{
  background:rgba(255,255,255,.9);border-radius:12px;padding:.45rem .5rem;
  border:1px solid rgba(167,139,250,.22);min-width:0;display:flex;
}
.stem-cell-zh{border-color:rgba(110,200,170,.38)}
.stem-cell-pick{border-color:rgba(167,139,250,.38);padding:.4rem .45rem}
.cell-layout{
  display:grid;grid-template-columns:minmax(0,1fr) auto;
  column-gap:.4rem;row-gap:.2rem;width:100%;align-items:center;
  min-height:4.6rem;
}
.cell-text{align-self:center;min-width:0}
.cell-actions{
  display:flex;flex-direction:column;justify-content:center;gap:.28rem;
  align-items:stretch;flex-shrink:0;
}
.stem-text .zh-line{font-size:clamp(.98rem,3.8vw,1.12rem);font-weight:700;color:var(--pink-deep);display:block;line-height:1.2}
.stem-text .pinyin{font-size:clamp(.74rem,2.2vw,.86rem);display:block;margin-top:.1rem;color:var(--muted);line-height:1.2}
.stem-text .stem-fr{display:block;margin-top:.15rem;font-size:clamp(.7rem,2vw,.8rem);font-family:var(--font-fr);color:var(--lav-deep);line-height:1.25}
.btn-chip{
  display:inline-flex;align-items:center;justify-content:center;gap:.15rem;
  padding:.28rem .5rem;min-width:3.1rem;
  border-radius:999px;border:2px solid #fff;font-size:.64rem;font-weight:700;
  cursor:pointer;font-family:inherit;box-shadow:0 2px 5px rgba(0,0,0,.06);touch-action:manipulation;
  white-space:nowrap;
}
.btn-chip.btn-zh{background:linear-gradient(145deg,#d4faf0,#a8e6cf);color:#047857}
.btn-chip.btn-fr{background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6;font-family:var(--font-fr)}
.stem-cell-pick .pick-enhanced{position:relative;width:100%;height:100%;display:flex}
.stem-cell-pick .pick-select-native{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.stem-cell-pick .pick-trigger{
  width:100%;flex:1;display:block;position:relative;padding:0 .95rem 0 0;
  border:none;background:transparent;cursor:pointer;box-shadow:none;
  touch-action:manipulation;text-align:left;font-family:inherit;min-height:4.6rem;
}
.stem-cell-pick .pick-trigger::after{
  content:'▾';position:absolute;top:.12rem;right:0;
  color:var(--lav-deep);font-size:.9rem;line-height:1;
}
.stem-cell-pick .pick-trigger.is-open::after{content:'▴'}
.stem-cell-pick .pick-trigger-inner{width:100%;height:100%}
.stem-cell-pick .pick-trigger-body{
  display:grid;grid-template-columns:minmax(0,1fr) auto;
  column-gap:.35rem;align-items:center;min-height:4.6rem;
}
.stem-cell-pick .pick-trigger-text{min-width:0;line-height:1.2}
.stem-cell-pick .pick-trigger .pick-opt-zh{font-size:clamp(.95rem,3.8vw,1.08rem);font-weight:700;color:var(--ink);display:block}
.stem-cell-pick .pick-trigger .pick-opt-py{font-size:clamp(.72rem,2.2vw,.82rem);color:var(--muted);display:block;margin-top:.06rem}
.stem-cell-pick .pick-trigger .pick-opt-fr{
  font-size:clamp(.68rem,2vw,.76rem);color:var(--lav-deep);font-family:var(--font-fr);
  display:block;margin-top:.06rem;line-height:1.2;white-space:normal;
}
.stem-cell-pick .pick-trigger-audio{
  display:flex;flex-direction:column;gap:.25rem;margin:0;justify-content:center;
}
.stem-cell-pick .pick-menu{
  position:absolute;left:0;right:0;top:calc(100% + .28rem);z-index:80;
  max-height:min(48vh,280px);overflow-y:auto;-webkit-overflow-scrolling:touch;
  background:#fff;border:2px solid var(--lav-soft);border-radius:12px;
  box-shadow:0 12px 28px rgba(80,60,100,.18);padding:.3rem;
}
.stem-cell-pick .pick-menu[hidden]{display:none!important}
.stem-cell-pick .pick-option{
  display:block;width:100%;text-align:left;border:none;background:transparent;
  padding:.4rem .45rem;margin:0 0 .2rem;border-radius:10px;cursor:pointer;
  font-family:inherit;touch-action:manipulation;
}
.stem-cell-pick .pick-option:last-child{margin-bottom:0}
.stem-cell-pick .pick-option:hover,.stem-cell-pick .pick-option:focus{background:var(--lav-soft)}
.stem-cell-pick .pick-option.is-selected{background:linear-gradient(135deg,var(--pink-soft),#fff)}
.pick-opt-card{width:100%}
.pick-opt-text{padding:0 .08rem .3rem}
.pick-opt-zh{display:block;font-size:.95rem;font-weight:700;color:var(--ink)}
.pick-opt-py{display:block;font-size:.8rem;color:var(--muted)}
.pick-opt-fr{display:block;font-size:.76rem;color:var(--lav-deep);font-family:var(--font-fr);line-height:1.25}
.pick-opt-audio{
  display:grid;grid-template-columns:1fr 1fr;gap:.28rem;
  padding-top:.28rem;border-top:1px dashed rgba(167,139,250,.22);
}
.pick-audio-zh,.pick-audio-fr{display:flex;justify-content:center}
.builder-outside-speak{
  margin-top:.6rem;padding:.55rem .65rem;border-radius:12px;
  background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(237,233,254,.5));
  border:2px dashed rgba(167,139,250,.4);
}
.builder-outside-speak[hidden]{display:none!important}
.outside-speak-row{
  display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:.35rem;align-items:center;
  padding:.25rem 0;
}
.outside-speak-row .outside-hint{grid-column:1/-1;width:auto;margin:0 0 .15rem}
.outside-hint{font-size:.7rem;font-weight:700;color:var(--lav-deep);text-align:center;font-family:var(--font-fr)}
.builder-outside-speak .btn-chip,.builder-outside-speak .btn-sentence{
  justify-content:center;width:100%;font-size:.72rem;padding:.38rem .4rem;
}
.builder-outside-speak .btn-sentence{border-radius:999px;border:2px solid #fff;font-weight:700;cursor:pointer;touch-action:manipulation}
.builder-outside-speak .btn-sentence.btn-zh{background:linear-gradient(145deg,#d4faf0,#a8e6cf);color:#047857}
.builder-outside-speak .btn-sentence.btn-fr{background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6;font-family:var(--font-fr)}
@media(max-width:768px){
  .builder-stem{grid-template-columns:1fr}
  .cell-layout,.stem-cell-pick .pick-trigger-body{min-height:0}
  .stem-cell-pick .pick-trigger{min-height:0}
  .outside-speak-row{grid-template-columns:1fr 1fr}
  .pick-opt-audio{grid-template-columns:1fr}
}
`;

html = html.slice(0, cssStart) + newCss + html.slice(cssEnd);

// Wrap stem cells with cell-layout
const stems = {
  'pick-buy': {
    zh: '<span class="zh-line zh">我要去7-11買</span><span class="pinyin">Wǒ yào qù 7-11 mǎi</span><span class="fr-line stem-fr">Je vais à 7-11 acheter</span>',
    zhs: '我要去7-11買', frs: 'Je vais à 7-11 acheter.',
  },
  'pick-pay': {
    zh: '<span class="zh-line zh">我要去7-11繳</span><span class="pinyin">Wǒ yào qù 7-11 jiǎo</span><span class="fr-line stem-fr">Je vais à 7-11 payer</span>',
    zhs: '我要去7-11繳', frs: 'Je vais à 7-11 payer.',
  },
  'pick-svc': {
    zh: '<span class="zh-line zh">我要去7-11</span><span class="pinyin">Wǒ yào qù 7-11</span><span class="fr-line stem-fr">Je vais à 7-11</span>',
    zhs: '我要去7-11', frs: 'Je vais à 7-11.',
  },
};

const rowRe = /<div class="builder-row">[\s\S]*?<select id="(pick-\w+)">([\s\S]*?)<\/select>[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(rowRe, (_, id, options) => {
  const s = stems[id];
  return `<div class="builder-row">
  <div class="builder-stem">
    <div class="stem-cell stem-cell-zh">
      <div class="cell-layout">
        <div class="cell-text stem-text">${s.zh}</div>
        <div class="cell-actions stem-audio">
          <button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="${s.zhs}" title="聽句型">句型 🔊</button>
          <button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="${s.frs}" title="Écouter le modèle">modèle 🔊</button>
        </div>
      </div>
    </div>
    <div class="stem-cell stem-cell-pick">
      <select id="${id}">${options}</select>
    </div>
  </div>
</div>`;
});

// Outside speak: hint + buttons in one row each section
html = html.replace(
  `    <div class="outside-speak-row word-speak-row">
      <p class="outside-hint">所選詞 · Mot choisi</p>
      <button type="button" class="btn-chip btn-zh" id="speak-zh-part" data-lang="zh" data-speak="" title="聽中文詞">詞 🔊</button>
      <button type="button" class="btn-chip btn-fr" id="speak-fr-part" data-lang="fr" data-speak="" title="Écouter le mot">mot 🔊</button>
    </div>
    <div class="outside-speak-row sentence-speak-row">
      <p class="outside-hint">完整句子 · Phrase complète</p>
      <button type="button" class="btn-sentence btn-zh" id="speak-zh-full" data-lang="zh" data-speak="" title="聽整句">整句 🔊</button>
      <button type="button" class="btn-sentence btn-fr" id="speak-fr-full" data-lang="fr" data-speak="" title="Écouter la phrase">phrase 🔊</button>
    </div>`,
  `    <div class="outside-speak-row word-speak-row">
      <p class="outside-hint">所選詞 · Mot choisi</p>
      <button type="button" class="btn-chip btn-zh" id="speak-zh-part" data-lang="zh" data-speak="" title="聽中文詞">詞 🔊</button>
      <button type="button" class="btn-chip btn-fr" id="speak-fr-part" data-lang="fr" data-speak="" title="Écouter le mot">mot 🔊</button>
      <span aria-hidden="true"></span><span aria-hidden="true"></span>
    </div>
    <div class="outside-speak-row sentence-speak-row">
      <p class="outside-hint">完整句子 · Phrase complète</p>
      <button type="button" class="btn-sentence btn-zh" id="speak-zh-full" data-lang="zh" data-speak="" title="聽整句">整句 🔊</button>
      <button type="button" class="btn-sentence btn-fr" id="speak-fr-full" data-lang="fr" data-speak="" title="Écouter la phrase">phrase 🔊</button>
      <span aria-hidden="true"></span><span aria-hidden="true"></span>
    </div>`
);

html = html.replace(/pickUi==='5'/g, "pickUi==='6'");
html = html.replace(/pickUi='5'/g, "pickUi='6'");

fs.writeFileSync(PATH, html);
console.log('balance ok');
