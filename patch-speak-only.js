const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let h = fs.readFileSync(PATH, 'utf8');

// --- Improved voice loading + speak ---
h = h.replace(
  `  function loadVoices(){
    if(!window.speechSynthesis)return;
    var v=speechSynthesis.getVoices();
    voices.zh=v.find(function(x){return x.lang==='zh-TW'||(x.lang&&x.lang.indexOf('zh-TW')===0)})||v.find(function(x){return x.lang&&x.lang.indexOf('zh')===0})||null;
    voices.fr=v.find(function(x){return x.lang==='fr-FR'||(x.lang&&x.lang.indexOf('fr')===0})||null;
  }
  if(window.speechSynthesis){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;}
  function speak(text,lang,btn){
    if(!text||!window.speechSynthesis)return;
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);
    u.lang=lang==='fr'?'fr-FR':'zh-TW';
    u.rate=0.85;
    var voice=lang==='fr'?voices.fr:voices.zh;
    if(voice)u.voice=voice;
    if(btn){btn.classList.add('speaking');u.onend=u.onerror=function(){btn.classList.remove('speaking');};}
    speechSynthesis.speak(u);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.btn-speak[data-speak], [data-speak].btn-speak');
    if(!b)b=e.target.closest('[data-speak]');
    if(!b)return;
    if(b.getAttribute('data-action')==='error')return;
    e.preventDefault();
    e.stopPropagation();
    speak(b.getAttribute('data-speak'),b.getAttribute('data-lang')||'zh',b);
  },true);`,
  `  function loadVoices(){
    if(!window.speechSynthesis)return;
    var v=speechSynthesis.getVoices();
    if(!v.length)return;
    voices.zh=v.find(function(x){return x.lang==='zh-TW'})||v.find(function(x){return x.lang&&x.lang.indexOf('zh')===0})||null;
    voices.fr=v.find(function(x){return x.lang==='fr-FR'})||v.find(function(x){return x.lang&&/^fr/i.test(x.lang)})||null;
  }
  if(window.speechSynthesis){
    loadVoices();
    speechSynthesis.onvoiceschanged=loadVoices;
    window.addEventListener('load',function(){loadVoices();});
  }
  function speak(text,lang,btn){
    if(!text||!window.speechSynthesis)return;
    loadVoices();
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(String(text).trim());
    var isFr=lang==='fr';
    u.lang=isFr?'fr-FR':'zh-TW';
    u.rate=0.85;
    var voice=isFr?voices.fr:voices.zh;
    if(voice)u.voice=voice;
    if(btn){btn.classList.add('speaking');u.onend=u.onerror=function(){btn.classList.remove('speaking');};}
    speechSynthesis.speak(u);
  }
  function findSpeakButton(e){
    var b=e.target.closest('button.btn-speak[data-speak],button.btn-chip[data-speak],button.btn-sentence[data-speak]');
    if(!b||b.disabled)return null;
    var text=(b.getAttribute('data-speak')||'').trim();
    if(!text)return null;
    return b;
  }
  document.addEventListener('click',function(e){
    var b=findSpeakButton(e);
    if(!b)return;
    if(b.getAttribute('data-action')==='error')return;
    e.preventDefault();
    e.stopPropagation();
    speak(b.getAttribute('data-speak'),b.getAttribute('data-lang')||'zh',b);
  },true);`
);

// Remove auto-speak on practice match
h = h.replace(
  `      document.getElementById('drag-msg').textContent='對了！Correct !';
      if(card.dataset.speak)speak(card.dataset.speak,'zh',null);`,
  `      document.getElementById('drag-msg').textContent='對了！Correct !';`
);

// Remove auto-speak on learn board correct
h = h.replace(
  `        var ck=state.verb.zh+"+"+state.noun.zh;
        if(ck!==lastCorrectKey){
          lastCorrectKey=ck;
          speak(state.noun.full||wrongCombo,'zh',null);
        }`,
  `        var ck=state.verb.zh+"+"+state.noun.zh;
        if(ck!==lastCorrectKey){lastCorrectKey=ck;}`
);

// Sync French speak buttons on learn tiles from data-fr (full phrase for nouns, tile data-fr for verbs)
h = h.replace(
  `    root.querySelectorAll('.learn-tile[draggable]').forEach(function(tile){
      tile.querySelectorAll('.btn-speak').forEach(function(btn){
        btn.addEventListener('mousedown',function(e){e.stopPropagation();});
        btn.addEventListener('touchstart',function(e){e.stopPropagation();},{passive:true});
      });`,
  `    root.querySelectorAll('.learn-tile[draggable]').forEach(function(tile){
      var frBtn=tile.querySelector('.btn-speak.btn-fr');
      if(frBtn&&tile.dataset.fr){
        var frText=tile.dataset.fr;
        if(tile.dataset.dragType==='noun'&&tile.dataset.full){
          frText=tile.dataset.fr;
        }
        frBtn.setAttribute('data-speak',frText);
      }
      tile.querySelectorAll('.btn-speak').forEach(function(btn){
        btn.addEventListener('mousedown',function(e){e.stopPropagation();});
        btn.addEventListener('touchstart',function(e){e.stopPropagation();},{passive:true});
        btn.addEventListener('click',function(e){e.stopPropagation();});
      });`
);

// Remove data-speak from tile/card containers so mis-clicks never match (handler already fixed)
h = h.replace(/(<div class="learn-tile[^"]*)" draggable="true" data-drag-type="verb" data-zh="[^"]*" data-py="[^"]*" data-speak="[^"]*"/g,
  '$1 draggable="true" data-drag-type="verb"');
h = h.replace(/(<div class="learn-tile learn-tile-noun)" draggable="true" data-drag-type="noun" data-zh="[^"]*" data-py="[^"]*" data-speak="[^"]*"/g,
  '$1 draggable="true" data-drag-type="noun"');

// drag cards - remove data-speak from card div
h = h.replace(/<div class="drag-card" draggable="true" data-bucket="([^"]*)" data-speak="[^"]*">/g,
  '<div class="drag-card" draggable="true" data-bucket="$1">');

// Fix applyPracticeMatch / drag - still use dataset.speak from card? We removed data-speak from HTML - need data-zh-full or keep internal speak text
// drag cards need speak text for nothing now since auto removed. drag payload uses zh text only.

// Fix dragstart JSON - still references card.dataset.speak - add data-full-zh on cards or derive from text
// After removing data-speak, card.dataset.speak is undefined - only used in removed auto speak line. OK.

// Fix initLearnBoard drag JSON speak field - use tile.dataset.speak removed from tiles, use tile.dataset.zh
h = h.replace(/speak:tile\.dataset\.speak\|\|tile\.dataset\.zh/g, 'speak:tile.dataset.zh');
h = h.replace(/speak:tile\.dataset\.speak\|\|tile\.dataset\.zh/g, 'speak:tile.dataset.zh');
h = h.replace(/speak:tile\.dataset\.speak\|\|tile\.dataset\.zh/g, 'speak:tile.dataset.zh');

h = h.replace(
  `return{type:tile.dataset.dragType,zh:tile.dataset.zh,py:tile.dataset.py,speak:tile.dataset.speak||tile.dataset.zh,`,
  `return{type:tile.dataset.dragType,zh:tile.dataset.zh,py:tile.dataset.py,speak:tile.dataset.zh,`
);

h = h.replace(
  `          speak:tile.dataset.speak||tile.dataset.zh,
`,
  `          speak:tile.dataset.zh,
`
);

fs.writeFileSync(PATH, h);
console.log('speak-only patch ok');
