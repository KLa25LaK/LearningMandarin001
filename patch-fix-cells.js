const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let html = fs.readFileSync(PATH, 'utf8');

const stems = {
  'pick-buy': {
    zh: '<span class="zh-line zh">我要去7-11買</span><span class="pinyin">Wǒ yào qù 7-11 mǎi</span>',
    fr: '<span class="fr-line stem-fr">Je vais à 7-11 acheter</span>',
    zhs: '我要去7-11買',
    frs: 'Je vais à 7-11 acheter.',
  },
  'pick-pay': {
    zh: '<span class="zh-line zh">我要去7-11繳</span><span class="pinyin">Wǒ yào qù 7-11 jiǎo</span>',
    fr: '<span class="fr-line stem-fr">Je vais à 7-11 payer</span>',
    zhs: '我要去7-11繳',
    frs: 'Je vais à 7-11 payer.',
  },
  'pick-svc': {
    zh: '<span class="zh-line zh">我要去7-11</span><span class="pinyin">Wǒ yào qù 7-11</span>',
    fr: '<span class="fr-line stem-fr">Je vais à 7-11</span>',
    zhs: '我要去7-11',
    frs: 'Je vais à 7-11.',
  },
};

const rowRe = /<div class="builder-row">[\s\S]*?<select id="(pick-\w+)">([\s\S]*?)<\/select>[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(rowRe, (_, id, options) => {
  const s = stems[id];
  return `<div class="builder-row">
  <div class="builder-stem">
    <div class="stem-cell stem-cell-zh">
      <div class="stem-text">${s.zh}${s.fr}</div>
      <div class="stem-audio">
        <button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="${s.zhs}" title="聽句型">句型 🔊</button>
        <button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="${s.frs}" title="Écouter le modèle">modèle 🔊</button>
      </div>
    </div>
    <div class="stem-cell stem-cell-pick">
      <select id="${id}">${options}</select>
    </div>
  </div>
</div>`;
});

// CSS additions
html = html.replace(
  '.stem-audio{margin-top:.4rem}',
  `.stem-audio{margin-top:.4rem;display:flex;flex-wrap:wrap;gap:.3rem}
.stem-text .stem-fr{display:block;margin-top:.2rem;font-size:clamp(.72rem,2.2vw,.82rem);font-family:var(--font-fr);color:var(--lav-deep);line-height:1.25}
.stem-cell-pick .pick-trigger{align-items:flex-start;flex-wrap:wrap}
.stem-cell-pick .pick-trigger-body{flex:1;min-width:0}
.stem-cell-pick .pick-trigger-text{line-height:1.25}
.stem-cell-pick .pick-trigger .pick-opt-fr{
  font-size:clamp(.68rem,2vw,.76rem);color:var(--lav-deep);font-family:var(--font-fr);
  display:block;margin-top:.08rem;white-space:normal;overflow:visible;text-overflow:unset;
}
.stem-cell-pick .pick-trigger-audio{display:flex;flex-wrap:wrap;gap:.28rem;margin-top:.35rem}
.stem-cell-pick .pick-trigger-audio .btn-chip{font-size:.65rem;padding:.28rem .5rem}`
);

// pickTriggerHTML with fr + audio
html = html.replace(
  `  function pickTriggerHTML(opt,kind){
    if(!opt||!opt.value)return '—';
    var p=pickParts(opt,kind);
    return '<span class="pick-opt-zh zh">'+escPick(p.zh)+'</span><span class="pick-opt-py pinyin">'+escPick(p.py)+'</span>';
  }`,
  `  function pickTriggerHTML(opt,kind){
    if(!opt||!opt.value)return '—';
    var p=pickParts(opt,kind);
    return '<div class="pick-trigger-body"><div class="pick-trigger-text">'
      +'<span class="pick-opt-zh zh">'+escPick(p.zh)+'</span>'
      +'<span class="pick-opt-py pinyin">'+escPick(p.py)+'</span>'
      +'<span class="pick-opt-fr fr-line">'+escPick(p.fr)+'</span></div>'
      +'<div class="pick-trigger-audio">'
      +'<button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="'+escPick(p.zh)+'" title="聽詞語">詞 🔊</button>'
      +'<button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="'+escPick(p.fr)+'" title="Écouter le mot">mot 🔊</button>'
      +'</div></div>';
  }`
);

// Trigger click: don't toggle menu when pressing speak chips
html = html.replace(
  `    trigger.addEventListener('click',function(e){e.stopPropagation();if(menu.hidden)openMenu();else closeMenu();});`,
  `    trigger.addEventListener('click',function(e){
      if(e.target.closest('.btn-chip')){e.stopPropagation();return;}
      e.stopPropagation();if(menu.hidden)openMenu();else closeMenu();
    });`
);

// Force rebuild enhanced pick UI
html = html.replace(/pickUi==='4'/g, "pickUi==='5'");
html = html.replace(/pickUi='4'/g, "pickUi='5'");
html = html.replace(
  `    if(sel.dataset.pickUi==='5')return;
    sel.dataset.pickUi='5';
    if(sel.dataset.pickEnhanced){try{sel.closest('.pick-enhanced').remove();}catch(e){}}`,
  `    var existing=sel.closest('.pick-enhanced');
    if(sel.dataset.pickUi==='5'&&existing)return;
    if(existing){try{existing.remove();}catch(e){}}
    sel.dataset.pickUi='5';
    delete sel.dataset.pickEnhanced;`
);

fs.writeFileSync(PATH, html);
console.log('cells fix ok');
