const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let html = fs.readFileSync(PATH, 'utf8');

// --- CSS: row layout left stems / right pick; simplify speak bar ---
const oldStemBlock = /\.builder-stem\{[\s\S]*?@media\(max-width:768px\)\{\s*\.builder-stem\{grid-template-columns:1fr\}\s*\.speak-grid[\s\S]*?\}\s*\}/;
const newLayoutCss = `.builder-711 .builder-row{
  display:grid;grid-template-columns:1fr minmax(9.5rem,40%);
  grid-template-rows:auto auto;gap:.45rem .5rem;align-items:stretch;
  margin-bottom:.85rem;
}
.builder-711 .builder-row:last-of-type{margin-bottom:.35rem}
.builder-711 .stem-cell-zh{grid-column:1;grid-row:1}
.builder-711 .stem-cell-fr{grid-column:1;grid-row:2}
.builder-711 .builder-row-pick{
  grid-column:2;grid-row:1/span 2;display:flex;flex-direction:column;min-height:0;
}
.builder-711 .pick-slot-label{
  font-size:.7rem;font-weight:700;color:var(--lav-deep);margin:0 0 .25rem .1rem;
  font-family:var(--font-fr);letter-spacing:.02em;
}
.builder-711 .builder-row-pick .pick-enhanced{flex:1;display:flex;flex-direction:column}
.builder-711 .builder-row-pick .pick-trigger{flex:1;min-height:100%;align-items:flex-start;padding:.65rem .75rem}
.builder-711 .builder-row-pick .pick-trigger-inner{display:flex;flex-direction:column;justify-content:center;gap:.08rem}
.stem-cell{
  background:rgba(255,255,255,.85);border-radius:12px;padding:.55rem .6rem;
  border:1px solid rgba(167,139,250,.2);
}
.stem-cell-zh{border-color:rgba(110,200,170,.35)}
.stem-cell-fr{border-color:rgba(167,139,250,.35)}
.stem-text .zh-line{font-size:clamp(1.02rem,4vw,1.18rem);font-weight:700;color:var(--pink-deep);display:block}
.stem-text .pinyin{font-size:clamp(.8rem,2.5vw,.92rem);display:block;margin-top:.12rem}
.stem-text .fr-line{font-size:clamp(.88rem,3.2vw,1.05rem);font-family:var(--font-fr);color:var(--lav-deep);font-weight:600;display:block;line-height:1.3}
.stem-audio{margin-top:.45rem}
.sentence-speak-bar{
  margin-top:.75rem;padding:.75rem .85rem;border-radius:14px;
  background:linear-gradient(135deg,rgba(212,250,240,.5),rgba(237,233,254,.65));
  border:2px solid rgba(110,200,170,.35);
  display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.5rem .65rem;
}
.sentence-speak-bar[hidden]{display:none!important}
.sentence-speak-hint{
  width:100%;margin:0;text-align:center;font-size:.82rem;font-weight:700;color:var(--lav-deep);
  font-family:var(--font-fr);
}
.sentence-speak-bar .btn-sentence{
  flex:1;min-width:8.5rem;max-width:14rem;padding:.55rem 1rem;border-radius:999px;
  border:2px solid #fff;font-size:clamp(.82rem,3.2vw,.95rem);font-weight:700;
  cursor:pointer;font-family:inherit;box-shadow:0 3px 10px rgba(0,0,0,.08);
  touch-action:manipulation;display:inline-flex;align-items:center;justify-content:center;gap:.35rem;
}
.sentence-speak-bar .btn-sentence.btn-zh{background:linear-gradient(145deg,#d4faf0,#a8e6cf);color:#047857}
.sentence-speak-bar .btn-sentence.btn-fr{background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6;font-family:var(--font-fr)}
@media(max-width:768px){
  .builder-711 .builder-row{grid-template-columns:1fr;grid-template-rows:auto auto auto}
  .builder-711 .stem-cell-zh{grid-column:1;grid-row:1}
  .builder-711 .stem-cell-fr{grid-column:1;grid-row:2}
  .builder-711 .builder-row-pick{grid-column:1;grid-row:3}
  .builder-711 .builder-row-pick .pick-trigger{min-height:3.2rem}
  .speak-grid,.pick-opt-audio{grid-template-columns:1fr}
  .sentence-speak-bar .btn-sentence{min-width:100%;max-width:none}
}`;
if (!oldStemBlock.test(html)) throw new Error('stem CSS block not found');
html = html.replace(oldStemBlock, newLayoutCss);

// Remove picked-result / old speak panel styles (keep pick-opt-audio)
html = html.replace(/\.picked-speak-panel\{[\s\S]*?\.speak-col \.btn-chip\{[^}]+\}\n/, '');
html = html.replace(/#picked-result \.phrase\{margin-bottom:0\}\n\.phrase-display-only[^\n]+\n\.phrase-display-only[^\n]+\n/, '');

// Remove duplicate first pick-trigger block (lines 298-317 area) - keep one set
html = html.replace(
  /\.builder-711 \.pick-enhanced\{position:relative;width:100%\}\s*\.builder-711 \.pick-select-native\{\s*position:absolute;left:0;top:0[^}]+\}\s*\.builder-711 \.pick-trigger\{\s*width:100%;display:flex;align-items:center;justify-content:space-between[^}]+\}\s*\.builder-711 \.pick-trigger::after\{[^}]+\}\s*\.builder-711 \.pick-trigger\.is-open::after\{content:'▴'\}\s*\.builder-711 \.pick-menu\{\s*position:absolute;left:0;right:0;top:calc\(100% \+ \.35rem\);z-index:80;\s*max-height:min\(52vh,320px\)[^}]+\}\s*\.builder-711 \.pick-menu\[hidden\]\{display:none!important\}\s*/,
  ''
);

// Fix builder-row margin duplicate
html = html.replace('.builder-711 .builder-row{margin-bottom:.85rem}\n.builder-711 .builder-row:last-of-type{margin-bottom:.35rem}\n', '');

// --- HTML: restructure each builder-row ---
function wrapRow(stemZh, stemFr, selectId, pickLabel) {
  return `  <div class="builder-row">
    <div class="stem-cell stem-cell-zh">
      <div class="stem-text">${stemZh}</div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="${stemZh.match(/data-speak="([^"]+)"/) ? '' : ''}" title="聽句型">句型 🔊</button></div>
    </div>
    <div class="stem-cell stem-cell-fr">
      <div class="stem-text">${stemFr}</div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="" title="Écouter le modèle">modèle 🔊</button></div>
    </div>
    <div class="builder-row-pick">
      <p class="pick-slot-label">${pickLabel}</p>
      <select id="${selectId}">PLACEHOLDER</select>
    </div>
  </div>`;
}

// Replace rows by regex preserving select content
const rowRe = /<div class="builder-row">[\s\S]*?<select id="(pick-\w+)">([\s\S]*?)<\/select>\s*<\/div>/g;
const labels = { 'pick-buy': 'Choisir · 選一個', 'pick-pay': 'Choisir · 選一個', 'pick-svc': 'Choisir · 選一個' };
const stems = {
  'pick-buy': {
    zh: '<span class="zh-line zh">我要去7-11買</span><span class="pinyin">Wǒ yào qù 7-11 mǎi</span>',
    zhs: '我要去7-11買',
    fr: '<span class="fr-line">Je vais à 7-11 acheter</span>',
    frs: 'Je vais à 7-11 acheter.',
  },
  'pick-pay': {
    zh: '<span class="zh-line zh">我要去7-11繳</span><span class="pinyin">Wǒ yào qù 7-11 jiǎo</span>',
    zhs: '我要去7-11繳',
    fr: '<span class="fr-line">Je vais à 7-11 payer</span>',
    frs: 'Je vais à 7-11 payer.',
  },
  'pick-svc': {
    zh: '<span class="zh-line zh">我要去7-11</span><span class="pinyin">Wǒ yào qù 7-11</span>',
    zhs: '我要去7-11',
    fr: '<span class="fr-line">Je vais à 7-11</span>',
    frs: 'Je vais à 7-11.',
  },
};

html = html.replace(rowRe, (_, id, options) => {
  const s = stems[id];
  return `  <div class="builder-row">
    <div class="stem-cell stem-cell-zh">
      <div class="stem-text">${s.zh}</div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="${s.zhs}" title="聽句型">句型 🔊</button></div>
    </div>
    <div class="stem-cell stem-cell-fr">
      <div class="stem-text">${s.fr}</div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="${s.frs}" title="Écouter le modèle">modèle 🔊</button></div>
    </div>
    <div class="builder-row-pick">
      <p class="pick-slot-label">${labels[id]}</p>
      <select id="${id}">${options}</select>
    </div>
  </div>`;
});

// Replace result + old speak panel with compact sentence bar
html = html.replace(
  `  <div class="result" id="picked-result"></div>
  <div class="picked-speak-panel" id="picked-speak-panel" hidden>
    <p class="speak-panel-title">Écoute · 聽一聽（選完後）</p>
    <div class="speak-grid">
      <div class="speak-col speak-col-zh">
        <span class="speak-col-label">中文 Zhōngwén</span>
        <button type="button" class="btn-chip btn-zh" id="speak-zh-part" data-lang="zh" data-speak="" title="聽詞語">詞 🔊</button>
        <button type="button" class="btn-chip btn-zh" id="speak-zh-full" data-lang="zh" data-speak="" title="聽整句">整句 🔊</button>
      </div>
      <div class="speak-col speak-col-fr">
        <span class="speak-col-label">Français</span>
        <button type="button" class="btn-chip btn-fr" id="speak-fr-part" data-lang="fr" data-speak="" title="Écouter le mot">mot 🔊</button>
        <button type="button" class="btn-chip btn-fr" id="speak-fr-full" data-lang="fr" data-speak="" title="Écouter la phrase">phrase 🔊</button>
      </div>
    </div>
  </div>`,
  `  <div class="sentence-speak-bar" id="sentence-speak-bar" hidden>
    <p class="sentence-speak-hint">Phrase complète · 完整句子</p>
    <button type="button" class="btn-sentence btn-zh" id="speak-zh-full" data-lang="zh" data-speak="" title="聽整句">整句中文 🔊</button>
    <button type="button" class="btn-sentence btn-fr" id="speak-fr-full" data-lang="fr" data-speak="" title="Écouter la phrase">Phrase FR 🔊</button>
  </div>`
);

// --- JS: updateSpeakPanel + remove renderPickedPhrase usage ---
html = html.replace(
  `  function renderPickedPhrase(zh,fr,py){
    var box=document.getElementById('picked-result');
    if(!box)return;
    if(!zh){box.innerHTML='';return;}
    box.innerHTML='<div class="phrase phrase-display-only"><div class="zh-block"><div><span class="zh-line zh">'+escHtml(zh)+'</span>'+(py?'<span class="pinyin">'+escHtml(py)+'</span>':'')+'</div></div><div class="fr-block"><span class="fr-line">'+escHtml(fr)+'</span></div></div>';
  }`,
  `  function renderPickedPhrase(zh,fr,py){/* phrase shown in stem + pick; no duplicate block */}`
);

html = html.replace(
  `  function updateSpeakPanel(opt){
    var panel=document.getElementById('picked-speak-panel');
    if(!panel)return;
    if(!opt||!opt.value){panel.hidden=true;return;}
    panel.hidden=false;
    var p=pickParts(opt);
    var zhp=document.getElementById('speak-zh-part');
    var zhf=document.getElementById('speak-zh-full');
    var frp=document.getElementById('speak-fr-part');
    var frf=document.getElementById('speak-fr-full');
    if(zhp)zhp.setAttribute('data-speak',p.zh);
    if(zhf)zhf.setAttribute('data-speak',opt.getAttribute('data-zh')||'');
    if(frp)frp.setAttribute('data-speak',p.fr);
    if(frf)frf.setAttribute('data-speak',opt.getAttribute('data-fr')||'');
  }`,
  `  function updateSpeakPanel(opt){
    var bar=document.getElementById('sentence-speak-bar');
    if(!bar)return;
    if(!opt||!opt.value){bar.hidden=true;return;}
    bar.hidden=false;
    var zhf=document.getElementById('speak-zh-full');
    var frf=document.getElementById('speak-fr-full');
    if(zhf)zhf.setAttribute('data-speak',opt.getAttribute('data-zh')||'');
    if(frf)frf.setAttribute('data-speak',opt.getAttribute('data-fr')||'');
  }`
);

html = html.replace(
  `        renderPickedPhrase('','','');
        updateSpeakPanel(null);`,
  `        updateSpeakPanel(null);`
);
html = html.replace(
  `      renderPickedPhrase(o.dataset.zh,o.dataset.fr,o.dataset.py||'');
      updateSpeakPanel(o);`,
  `      updateSpeakPanel(o);`
);

fs.writeFileSync(PATH, html);
console.log('layout patch ok');
