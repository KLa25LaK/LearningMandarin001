const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let html = fs.readFileSync(PATH, 'utf8');

// Remove old builder-711 pick/prefix/speak CSS (between pick-option.is-selected and #picked-result or COCO)
const cssStart = html.indexOf('.builder-prefix-row{');
const cssEnd = html.indexOf('#picked-result .phrase{margin-bottom:0}');
if (cssStart > 0 && cssEnd > cssStart) {
  html = html.slice(0, cssStart) + html.slice(cssEnd);
}

const newCss = `
.builder-stem{
  display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.55rem;
}
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
.btn-chip{
  display:inline-flex;align-items:center;gap:.25rem;padding:.35rem .65rem;
  border-radius:999px;border:2px solid #fff;font-size:.72rem;font-weight:700;
  cursor:pointer;font-family:inherit;box-shadow:0 2px 6px rgba(0,0,0,.06);
  touch-action:manipulation;white-space:nowrap;
}
.btn-chip.btn-zh{background:linear-gradient(145deg,#d4faf0,#a8e6cf);color:#047857}
.btn-chip.btn-fr{background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6}
.builder-711 .pick-enhanced{position:relative;width:100%}
.builder-711 .pick-select-native{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.builder-711 .pick-trigger{
  width:100%;display:flex;align-items:center;gap:.5rem;padding:.75rem .85rem;min-height:3rem;
  border:2px solid var(--lav-soft);border-radius:12px;background:#fff;cursor:pointer;
  box-shadow:0 2px 8px rgba(167,139,250,.12);touch-action:manipulation;text-align:left;
}
.builder-711 .pick-trigger::after{content:'▾';color:var(--lav-deep);font-size:1.1rem;flex-shrink:0;margin-left:auto}
.builder-711 .pick-trigger.is-open::after{content:'▴'}
.builder-711 .pick-trigger-inner{flex:1;min-width:0}
.builder-711 .pick-trigger .pick-opt-zh{font-size:clamp(1rem,4vw,1.15rem);font-weight:700;color:var(--ink)}
.builder-711 .pick-trigger .pick-opt-py{font-size:clamp(.78rem,2.4vw,.9rem);color:var(--muted)}
.builder-711 .pick-trigger .pick-opt-fr{font-size:clamp(.78rem,2.4vw,.88rem);color:var(--lav-deep);font-family:var(--font-fr)}
.builder-711 .pick-menu{
  position:absolute;left:0;right:0;top:calc(100% + .35rem);z-index:80;
  max-height:min(55vh,340px);overflow-y:auto;-webkit-overflow-scrolling:touch;
  background:#fff;border:2px solid var(--lav-soft);border-radius:14px;
  box-shadow:0 14px 36px rgba(80,60,100,.2);padding:.35rem;
}
.builder-711 .pick-menu[hidden]{display:none!important}
.builder-711 .pick-option{
  display:block;width:100%;text-align:left;border:none;background:transparent;
  padding:.5rem;margin:0 0 .35rem;border-radius:12px;cursor:pointer;
  font-family:inherit;touch-action:manipulation;
}
.builder-711 .pick-option:last-child{margin-bottom:0}
.builder-711 .pick-option:hover,.builder-711 .pick-option:focus{background:var(--lav-soft)}
.builder-711 .pick-option.is-selected{background:linear-gradient(135deg,var(--pink-soft),#fff);outline:2px solid rgba(240,139,184,.35)}
.pick-opt-card{width:100%}
.pick-opt-text{padding:0 .15rem .4rem}
.pick-opt-zh{display:block;font-size:clamp(1.02rem,4.2vw,1.16rem);font-weight:700;color:var(--ink)}
.pick-opt-py{display:block;font-size:clamp(.8rem,2.5vw,.92rem);color:var(--muted);margin-top:.06rem}
.pick-opt-fr{display:block;font-size:clamp(.78rem,2.4vw,.9rem);color:var(--lav-deep);font-family:var(--font-fr);margin-top:.1rem;line-height:1.3}
.pick-opt-audio{
  display:grid;grid-template-columns:1fr 1fr;gap:.35rem;
  padding-top:.35rem;border-top:1px dashed rgba(167,139,250,.25);
}
.pick-audio-zh,.pick-audio-fr{display:flex;flex-wrap:wrap;align-items:center;gap:.3rem}
.pick-audio-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;width:100%;margin-bottom:.1rem}
.pick-audio-zh .pick-audio-label{color:#047857}
.pick-audio-fr .pick-audio-label{color:#5b21b6}
.picked-speak-panel{
  margin-top:.85rem;padding:.85rem 1rem;border-radius:14px;
  background:linear-gradient(135deg,rgba(255,245,250,.95),rgba(237,233,254,.9));
  border:2px solid rgba(167,139,250,.25);
}
.picked-speak-panel[hidden]{display:none!important}
.speak-panel-title{margin:0 0 .6rem;font-size:.88rem;font-weight:700;color:var(--lav-deep);text-align:center;font-family:var(--font-fr)}
.speak-grid{display:grid;grid-template-columns:1fr 1fr;gap:.55rem}
.speak-col{
  background:#fff;border-radius:12px;padding:.6rem .65rem;
  display:flex;flex-direction:column;gap:.4rem;align-items:stretch;
}
.speak-col-label{font-size:.75rem;font-weight:700;text-align:center;padding-bottom:.2rem}
.speak-col-zh .speak-col-label{color:#047857}
.speak-col-fr .speak-col-label{color:#5b21b6;font-family:var(--font-fr)}
.speak-col .btn-chip{width:100%;justify-content:center;font-size:.8rem;padding:.45rem .5rem}
@media(max-width:768px){
  .builder-stem{grid-template-columns:1fr}
  .speak-grid,.pick-opt-audio{grid-template-columns:1fr}
}
`;

html = html.replace(
  '#picked-result .phrase{margin-bottom:0}',
  newCss + '\n#picked-result .phrase{margin-bottom:0}'
);

// Replace prefix rows
const stems = [
  {
    old: /<div class="builder-prefix-row">[\s\S]*?<\/div>\s*<\/div>\s*<select id="pick-buy">/,
    neu: `<div class="builder-stem">
    <div class="stem-cell stem-cell-zh">
      <div class="stem-text"><span class="zh-line zh">我要去7-11買</span><span class="pinyin">Wǒ yào qù 7-11 mǎi</span></div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="我要去7-11買" title="聽句型">句型 🔊</button></div>
    </div>
    <div class="stem-cell stem-cell-fr">
      <div class="stem-text"><span class="fr-line">Je vais à 7-11 acheter</span></div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="Je vais à 7-11 acheter." title="Écouter le modèle">modèle 🔊</button></div>
    </div>
  </div>
    <select id="pick-buy">`,
  },
  {
    old: /<div class="builder-prefix-row">[\s\S]*?<\/div>\s*<\/div>\s*<select id="pick-pay">/,
    neu: `<div class="builder-stem">
    <div class="stem-cell stem-cell-zh">
      <div class="stem-text"><span class="zh-line zh">我要去7-11繳</span><span class="pinyin">Wǒ yào qù 7-11 jiǎo</span></div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="我要去7-11繳" title="聽句型">句型 🔊</button></div>
    </div>
    <div class="stem-cell stem-cell-fr">
      <div class="stem-text"><span class="fr-line">Je vais à 7-11 payer</span></div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="Je vais à 7-11 payer." title="Écouter le modèle">modèle 🔊</button></div>
    </div>
  </div>
    <select id="pick-pay">`,
  },
  {
    old: /<div class="builder-prefix-row">[\s\S]*?<\/div>\s*<\/div>\s*<select id="pick-svc">/,
    neu: `<div class="builder-stem">
    <div class="stem-cell stem-cell-zh">
      <div class="stem-text"><span class="zh-line zh">我要去7-11</span><span class="pinyin">Wǒ yào qù 7-11</span></div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="我要去7-11" title="聽句型">句型 🔊</button></div>
    </div>
    <div class="stem-cell stem-cell-fr">
      <div class="stem-text"><span class="fr-line">Je vais à 7-11</span></div>
      <div class="stem-audio"><button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="Je vais à 7-11." title="Écouter le modèle">modèle 🔊</button></div>
    </div>
  </div>
    <select id="pick-svc">`,
  },
];

for (const s of stems) {
  html = html.replace(s.old, s.neu);
}

// Add speak panel after picked-result
if (!html.includes('picked-speak-panel')) {
  html = html.replace(
    '<div class="result" id="picked-result"></div>\n</div>\n<p class="section-title">COCO',
    `<div class="result" id="picked-result"></div>
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
  </div>
</div>
<p class="section-title">COCO`
  );
}

// Replace JS block from pickKindFromId through document click before ['pick-buy'
const jsStart = html.indexOf('  function pickKindFromId(id){');
const jsEnd = html.indexOf("  ['pick-buy','pick-pay','pick-svc'].forEach(function(id){");
if (jsStart < 0 || jsEnd < 0) throw new Error('JS block not found');

const newJs = `  function pickKindFromId(id){
    if(id==='pick-buy')return 'buy';
    if(id==='pick-pay')return 'pay';
    return 'svc';
  }
  function pickWordPy(opt,kind){
    var py=(opt.getAttribute('data-py')||'').replace(/\\.$/,'');
    if(kind==='buy')return py.replace(/^Wǒ yào qù 7-11 mǎi\\s*/,'');
    if(kind==='pay')return py.replace(/^Wǒ yào qù 7-11 jiǎo\\s*/,'');
    return py.replace(/^Wǒ yào qù 7-11\\s*/,'');
  }
  function pickParts(opt){
    var parts=(opt.textContent||'').split(' · ');
    return {zh:parts[0]||opt.value||'',fr:parts[1]||'',py:pickWordPy(opt,pickKindFromId(opt.parentElement&&opt.parentElement.id||''))};
  }
  function escPick(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
  function pickTriggerHTML(opt,kind){
    if(!opt||!opt.value)return '—';
    var p=pickParts(opt);
    return '<span class="pick-opt-zh zh">'+escPick(p.zh)+'</span><span class="pick-opt-py pinyin">'+escPick(p.py)+'</span><span class="pick-opt-fr fr-line">'+escPick(p.fr)+'</span>';
  }
  function pickOptionHTML(opt,kind){
    if(!opt.value)return '<span class="pick-opt-zh">—</span>';
    var p=pickParts(opt);
    var zhFull=opt.getAttribute('data-zh')||'';
    var frFull=opt.getAttribute('data-fr')||'';
    return '<div class="pick-opt-card"><div class="pick-opt-text">'
      +'<span class="pick-opt-zh zh">'+escPick(p.zh)+'</span>'
      +'<span class="pick-opt-py pinyin">'+escPick(p.py)+'</span>'
      +'<span class="pick-opt-fr fr-line">'+escPick(p.fr)+'</span></div>'
      +'<div class="pick-opt-audio"><div class="pick-audio-zh">'
      +'<span class="pick-audio-label">中文</span>'
      +'<button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="'+escPick(p.zh)+'" title="聽詞語">詞 🔊</button>'
      +'<button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="'+escPick(zhFull)+'" title="聽整句">整句 🔊</button>'
      +'</div><div class="pick-audio-fr">'
      +'<span class="pick-audio-label">FR</span>'
      +'<button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="'+escPick(p.fr)+'" title="Écouter le mot">mot 🔊</button>'
      +'<button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="'+escPick(frFull)+'" title="Écouter la phrase">phrase 🔊</button>'
      +'</div></div></div>';
  }
  function updateSpeakPanel(opt){
    var panel=document.getElementById('picked-speak-panel');
    if(!panel)return;
    if(!opt||!opt.value){panel.hidden=true;return;}
    var p=pickParts(opt);
    panel.hidden=false;
    var zhp=document.getElementById('speak-zh-part');
    var zhf=document.getElementById('speak-zh-full');
    var frp=document.getElementById('speak-fr-part');
    var frf=document.getElementById('speak-fr-full');
    if(zhp)zhp.setAttribute('data-speak',p.zh);
    if(zhf)zhf.setAttribute('data-speak',opt.getAttribute('data-zh')||'');
    if(frp)frp.setAttribute('data-speak',p.fr);
    if(frf)frf.setAttribute('data-speak',opt.getAttribute('data-fr')||'');
  }
  function enhancePickSelect(sel){
    if(!sel)return;
    if(sel.dataset.pickUi==='2')return;
    sel.dataset.pickUi='2';
    if(sel.dataset.pickEnhanced){try{sel.closest('.pick-enhanced').remove();}catch(e){}}
    sel.dataset.pickEnhanced='1';
    var kind=pickKindFromId(sel.id);
    var wrap=document.createElement('div');
    wrap.className='pick-enhanced';
    sel.parentNode.insertBefore(wrap,sel);
    wrap.appendChild(sel);
    sel.classList.add('pick-select-native');
    var trigger=document.createElement('button');
    trigger.type='button';
    trigger.className='pick-trigger';
    trigger.setAttribute('aria-haspopup','listbox');
    trigger.setAttribute('aria-expanded','false');
    var triggerInner=document.createElement('span');
    triggerInner.className='pick-trigger-inner';
    trigger.appendChild(triggerInner);
    var menu=document.createElement('div');
    menu.className='pick-menu';
    menu.setAttribute('role','listbox');
    menu.hidden=true;
    function closeMenu(){menu.hidden=true;trigger.classList.remove('is-open');trigger.setAttribute('aria-expanded','false');}
    function openMenu(){
      document.querySelectorAll('.builder-711 .pick-menu').forEach(function(m){if(m!==menu)m.hidden=true;});
      document.querySelectorAll('.builder-711 .pick-trigger').forEach(function(t){if(t!==trigger)t.classList.remove('is-open');});
      menu.hidden=false;trigger.classList.add('is-open');trigger.setAttribute('aria-expanded','true');
    }
    function syncTrigger(){
      var o=sel.selectedOptions[0];
      triggerInner.innerHTML=pickTriggerHTML(o,kind);
      menu.querySelectorAll('.pick-option').forEach(function(btn){
        btn.classList.toggle('is-selected',btn.dataset.value===(sel.value||''));
      });
    }
    Array.from(sel.options).forEach(function(opt){
      var btn=document.createElement('button');
      btn.type='button';btn.className='pick-option';btn.setAttribute('role','option');
      btn.dataset.value=opt.value;
      Array.from(opt.attributes).forEach(function(attr){if(attr.name.indexOf('data-')===0)btn.setAttribute(attr.name,attr.value);});
      btn.innerHTML=pickOptionHTML(opt,kind);
      btn.addEventListener('click',function(e){
        if(e.target.closest('.btn-chip')){e.stopPropagation();return;}
        sel.value=opt.value;syncTrigger();closeMenu();
        sel.dispatchEvent(new Event('change',{bubbles:true}));
      });
      menu.appendChild(btn);
    });
    trigger.addEventListener('click',function(e){e.stopPropagation();if(menu.hidden)openMenu();else closeMenu();});
    wrap.appendChild(trigger);wrap.appendChild(menu);
    sel._syncPickTrigger=syncTrigger;syncTrigger();
  }
  document.addEventListener('click',function(e){
    if(!e.target.closest('.pick-enhanced'))document.querySelectorAll('.builder-711 .pick-menu').forEach(function(m){m.hidden=true;});
    if(!e.target.closest('.pick-trigger'))document.querySelectorAll('.builder-711 .pick-trigger').forEach(function(t){t.classList.remove('is-open');t.setAttribute('aria-expanded','false');});
  });
`;

html = html.slice(0, jsStart) + newJs + html.slice(jsEnd);

// Fix pickParts - opt.parentElement is select, need kind passed
// pickParts uses opt - for option element parent is select with id - fix pickWordPy call in pickParts:

const fixPickParts = `  function pickParts(opt,kind){
    var parts=(opt.textContent||'').split(' · ');
    kind=kind||pickKindFromId((opt.parentElement&&opt.parentElement.id)||'');
    return {zh:parts[0]||opt.value||'',fr:parts[1]||'',py:pickWordPy(opt,kind)};
  }`;

html = html.replace(
  `  function pickParts(opt){
    var parts=(opt.textContent||'').split(' · ');
    return {zh:parts[0]||opt.value||'',fr:parts[1]||'',py:pickWordPy(opt,pickKindFromId(opt.parentElement&&opt.parentElement.id||''))};
  }`,
  fixPickParts
);

html = html.replace(
  '    var p=pickParts(opt);',
  '    var p=pickParts(opt,kind);'
);

html = html.replace(
  `    sel.addEventListener('change',function(){
      var o=this.selectedOptions[0];
      var bar=document.getElementById('picked-speak-bar');
      var btnZh=document.getElementById('btn-picked-speak-zh');
      var btnFr=document.getElementById('btn-picked-speak-fr');
      if(!o||!o.dataset.zh){
        renderPickedPhrase('','','');
        if(bar)bar.hidden=true;
        return;
      }
      ['pick-buy','pick-pay','pick-svc'].forEach(function(other){
        if(other!==id){
          var s=document.getElementById(other);
          if(s){s.selectedIndex=0;if(s._syncPickTrigger)s._syncPickTrigger();}
        }
      });
      renderPickedPhrase(o.dataset.zh,o.dataset.fr,o.dataset.py||'');
      if(bar){bar.hidden=true;}
      if(btnZh){btnZh.setAttribute('data-speak',o.dataset.zh);}
      if(btnFr){btnFr.setAttribute('data-speak',o.dataset.fr||'');}
    });`,
  `    sel.addEventListener('change',function(){
      var o=this.selectedOptions[0];
      if(!o||!o.dataset.zh){
        renderPickedPhrase('','','');
        updateSpeakPanel(null);
        return;
      }
      ['pick-buy','pick-pay','pick-svc'].forEach(function(other){
        if(other!==id){
          var s=document.getElementById(other);
          if(s){s.selectedIndex=0;if(s._syncPickTrigger)s._syncPickTrigger();}
        }
      });
      renderPickedPhrase(o.dataset.zh,o.dataset.fr,o.dataset.py||'');
      updateSpeakPanel(o);
    });`
);

// Remove old duplicate .builder-711 .pick-option block at line 318 if still there
html = html.replace(
  /\.builder-711 \.pick-option\{\s*display:block;width:100%;text-align:left[\s\S]*?touch-action:manipulation;\s*\}\s*\.builder-711 \.pick-option:hover[\s\S]*?color:var\(--pink-deep\)\}\s*/,
  ''
);

fs.writeFileSync(PATH, html);
console.log('UI2 patch done');
