const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let html = fs.readFileSync(PATH, 'utf8');

// CSS: replace sentence-speak-bar with builder-outside-speak
html = html.replace(
  /\.sentence-speak-bar\{[\s\S]*?\.sentence-speak-bar \.btn-sentence\.btn-fr\{[^}]+\}\n@media\(max-width:768px\)\{\n  \.builder-stem\{grid-template-columns:1fr\}\n  \.pick-opt-audio\{grid-template-columns:1fr\}\n\}/,
  `.builder-outside-speak{
  margin-top:.7rem;padding:.65rem .75rem;border-radius:12px;
  background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(237,233,254,.5));
  border:2px dashed rgba(167,139,250,.45);
}
.builder-outside-speak[hidden]{display:none!important}
.outside-speak-row{
  display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.4rem .5rem;
  padding:.35rem 0;
}
.outside-speak-row+.outside-speak-row{
  border-top:1px solid rgba(167,139,250,.2);margin-top:.35rem;padding-top:.55rem;
}
.outside-hint{
  width:100%;margin:0;text-align:center;font-size:.72rem;font-weight:700;color:var(--lav-deep);
  font-family:var(--font-fr);
}
.builder-outside-speak .btn-chip{font-size:.74rem;padding:.35rem .65rem}
.builder-outside-speak .btn-sentence{
  padding:.4rem .8rem;border-radius:999px;border:2px solid #fff;font-size:.78rem;font-weight:700;
  cursor:pointer;font-family:inherit;touch-action:manipulation;
}
.builder-outside-speak .btn-sentence.btn-zh{background:linear-gradient(145deg,#d4faf0,#a8e6cf);color:#047857}
.builder-outside-speak .btn-sentence.btn-fr{background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6;font-family:var(--font-fr)}
@media(max-width:768px){
  .builder-stem{grid-template-columns:1fr}
  .pick-opt-audio{grid-template-columns:1fr}
  .builder-outside-speak .btn-chip,.builder-outside-speak .btn-sentence{flex:1;min-width:calc(50% - .35rem)}
}`
);

// HTML: replace sentence-speak-bar
html = html.replace(
  `  <div class="sentence-speak-bar" id="sentence-speak-bar" hidden>
    <p class="sentence-speak-hint">Phrase complète · 完整句子</p>
    <button type="button" class="btn-sentence btn-zh" id="speak-zh-full" data-lang="zh" data-speak="" title="聽整句">整句中文 🔊</button>
    <button type="button" class="btn-sentence btn-fr" id="speak-fr-full" data-lang="fr" data-speak="" title="Écouter la phrase">Phrase FR 🔊</button>
  </div>`,
  `  <div class="builder-outside-speak" id="builder-outside-speak" hidden>
    <div class="outside-speak-row word-speak-row">
      <p class="outside-hint">所選詞 · Mot choisi</p>
      <button type="button" class="btn-chip btn-zh" id="speak-zh-part" data-lang="zh" data-speak="" title="聽中文詞">詞 🔊</button>
      <button type="button" class="btn-chip btn-fr" id="speak-fr-part" data-lang="fr" data-speak="" title="Écouter le mot">mot 🔊</button>
    </div>
    <div class="outside-speak-row sentence-speak-row">
      <p class="outside-hint">完整句子 · Phrase complète</p>
      <button type="button" class="btn-sentence btn-zh" id="speak-zh-full" data-lang="zh" data-speak="" title="聽整句">整句 🔊</button>
      <button type="button" class="btn-sentence btn-fr" id="speak-fr-full" data-lang="fr" data-speak="" title="Écouter la phrase">phrase 🔊</button>
    </div>
  </div>`
);

// Simplify menu options: word only (no full sentence in dropdown)
html = html.replace(
  `  function pickOptionHTML(opt,kind){
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
  }`,
  `  function pickOptionHTML(opt,kind){
    if(!opt.value)return '<span class="pick-opt-zh">—</span>';
    var p=pickParts(opt,kind);
    return '<div class="pick-opt-card"><div class="pick-opt-text">'
      +'<span class="pick-opt-zh zh">'+escPick(p.zh)+'</span>'
      +'<span class="pick-opt-py pinyin">'+escPick(p.py)+'</span>'
      +'<span class="pick-opt-fr fr-line">'+escPick(p.fr)+'</span></div>'
      +'<div class="pick-opt-audio"><div class="pick-audio-zh">'
      +'<button type="button" class="btn-chip btn-zh" data-lang="zh" data-speak="'+escPick(p.zh)+'" title="聽詞語">詞 🔊</button>'
      +'</div><div class="pick-audio-fr">'
      +'<button type="button" class="btn-chip btn-fr" data-lang="fr" data-speak="'+escPick(p.fr)+'" title="Écouter le mot">mot 🔊</button>'
      +'</div></div></div>';
  }`
);

// Fix updateSpeakPanel + add speakWordPair
html = html.replace(
  `  function updateSpeakPanel(opt){
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
  }`,
  `  function updateSpeakPanel(opt){
    var panel=document.getElementById('builder-outside-speak');
    if(!panel)return;
    if(!opt||!opt.value){panel.hidden=true;return;}
    var kind=pickKindFromId((opt.parentElement&&opt.parentElement.id)||'');
    var p=pickParts(opt,kind);
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
  function speakWordPair(zh,fr){
    if(!zh||!window.speechSynthesis)return;
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(zh);
    u.lang='zh-TW';u.rate=0.85;
    if(voices.zh)u.voice=voices.zh;
    u.onend=function(){
      if(!fr)return;
      var f=new SpeechSynthesisUtterance(fr);
      f.lang='fr-FR';f.rate=0.85;
      if(voices.fr)f.voice=voices.fr;
      speechSynthesis.speak(f);
    };
    speechSynthesis.speak(u);
  }`
);

// On select: update panel + auto word pronunciation
html = html.replace(
  `      updateSpeakPanel(o);
    });`,
  `      updateSpeakPanel(o);
      var kind2=pickKindFromId(id);
      var p2=pickParts(o,kind2);
      speakWordPair(p2.zh,p2.fr);
    });`
);

// Bump pick UI to rebuild menus
html = html.replace(/pickUi==='3'/g, "pickUi==='4'");
html = html.replace(/pickUi='3'/g, "pickUi='4'");

fs.writeFileSync(PATH, html);
console.log('speak outside ok');
