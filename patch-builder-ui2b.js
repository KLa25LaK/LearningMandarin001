const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let html = fs.readFileSync(PATH, 'utf8');

// Add speak panel after picked-result
if (!html.includes('id="picked-speak-panel"')) {
  html = html.replace(
    '  <div class="result" id="picked-result"></div>\n</div>\n<p class="section-title">COCO',
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
  </div>
</div>
<p class="section-title">COCO`
  );
}

// Fix change handler
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
      if(bar){bar.hidden=false;}
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

// Result area: text only (speak via panel + dropdown chips)
html = html.replace(
  `    box.innerHTML='<div class="phrase"><div class="zh-block"><button type="button" class="btn-speak btn-zh" data-lang="zh" data-speak="'+escHtml(zh)+'" title="聽">🔊</button><div><span class="zh-line zh">'+escHtml(zh)+'</span>'+(py?'<span class="pinyin">'+escHtml(py)+'</span>':'')+'</div></div><div class="fr-block"><button type="button" class="btn-speak btn-fr" data-lang="fr" data-speak="'+escHtml(fr)+'" title="Écouter">🔊</button><span class="fr-line">'+escHtml(fr)+'</span></div></div>';`,
  `    box.innerHTML='<div class="phrase phrase-display-only"><div class="zh-block"><div><span class="zh-line zh">'+escHtml(zh)+'</span>'+(py?'<span class="pinyin">'+escHtml(py)+'</span>':'')+'</div></div><div class="fr-block"><span class="fr-line">'+escHtml(fr)+'</span></div></div>';`
);

// Remove first duplicate pick-enhanced CSS block (keep stem/chip styles)
html = html.replace(
  /\.builder-711 \.pick-enhanced\{position:relative;width:100%\}\s*\.builder-711 \.pick-select-native\{\s*position:absolute;width:1px;height:1px;opacity:0;pointer-events:none\s*\}\s*\.builder-711 \.pick-trigger\{\s*width:100%;display:flex;align-items:center;gap:\.5rem;padding:\.75rem 1rem;min-height:3\.1rem;\s*border:2px solid var\(--lav-soft\);border-radius:12px;background:#fff;cursor:pointer;\s*font-family:inherit;font-size:1rem;box-shadow:0 2px 8px rgba\(167,139,250,\.12\);\s*touch-action:manipulation;text-align:left;\s*\}\s*\.builder-711 \.pick-trigger::after\{\s*content:'▾';color:var\(--lav-deep\);font-size:1\.1rem;flex-shrink:0;margin-left:auto\s*\}\s*\.builder-711 \.pick-trigger\.is-open::after\{content:'▴'\}\s*\.builder-711 \.pick-menu\{\s*position:absolute;left:0;right:0;top:calc\(100% \+ \.35rem\);z-index:80;\s*max-height:min\(52vh,320px\);overflow-y:auto;-webkit-overflow-scrolling:touch;\s*background:#fff;border:2px solid var\(--lav-soft\);border-radius:14px;\s*box-shadow:0 14px 36px rgba\(80,60,100,\.2\);padding:\.35rem;\s*\}\s*\.builder-711 \.pick-menu\[hidden\]\{display:none!important\}\s*/,
  ''
);

// Slightly larger result phrase on mobile
if (!html.includes('.phrase-display-only')) {
  html = html.replace(
    '#picked-result .phrase{margin-bottom:0}',
    '#picked-result .phrase{margin-bottom:0}\n.phrase-display-only .zh-line{font-size:clamp(1.05rem,4.2vw,1.22rem)}\n.phrase-display-only .fr-line{font-size:clamp(.95rem,3.5vw,1.1rem)}'
  );
}

fs.writeFileSync(PATH, html);
console.log('UI2b done');
