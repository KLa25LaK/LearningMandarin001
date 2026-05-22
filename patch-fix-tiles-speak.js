const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let h = fs.readFileSync(PATH, 'utf8');

const verbFix = {
  'tile-da': ['打', 'dǎ'],
  'tile-ti': ['踢', 'tī'],
  'tile-xia': ['下', 'xià'],
  'tile-tan': ['彈', 'tán'],
  'tile-la': ['拉', 'lā'],
  'tile-chui': ['吹', 'chuī'],
};

h = h.replace(
  /<div class="learn-tile (learn-tile-verb tile-\w+) draggable="true" data-drag-type="verb" data-fr="([^"]*)">/g,
  (_, cls, fr) => {
    const key = cls.match(/tile-\w+/)[0];
    const [zh, py] = verbFix[key] || ['', ''];
    return `<div class="learn-tile ${cls}" draggable="true" data-drag-type="verb" data-zh="${zh}" data-py="${py}" data-fr="${fr}">`;
  }
);

const lines = h.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (!lines[i].includes('learn-tile-noun draggable="true"')) continue;
  const chunk = lines.slice(i, i + 4).join('\n');
  const zm = chunk.match(/tile-zh zh">([^<]+)</);
  const pm = chunk.match(/tile-py pinyin">([^<]+)</);
  lines[i] = lines[i]
    .replace(' learn-tile-noun draggable="true"', ' learn-tile-noun" draggable="true"')
    .replace(
      'data-drag-type="noun"',
      `data-drag-type="noun" data-zh="${zm ? zm[1] : ''}" data-py="${pm ? pm[1] : ''}"`
    );
}
h = lines.join('\n');

// French buttons on tiles: use data-fr for speak text
h = h.replace(
  /(<div class="learn-tile[^>]*data-fr=")([^"]*)("[^>]*>[\s\S]*?<button type="button" class="btn-speak btn-fr" data-lang="fr" data-speak=")[^"]*(")/g,
  '$1$2$3$2$4'
);

const oldHandler = `  document.addEventListener('click',function(e){
    var b=e.target.closest('.btn-speak[data-speak], [data-speak].btn-speak');
    if(!b)b=e.target.closest('[data-speak]');
    if(!b)return;
    if(b.getAttribute('data-action')==='error')return;
    e.preventDefault();
    e.stopPropagation();
    speak(b.getAttribute('data-speak'),b.getAttribute('data-lang')||'zh',b);
  },true);`;

const newHandler = `  function findSpeakButton(e){
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
  },true);`;

if (h.includes(oldHandler)) h = h.replace(oldHandler, newHandler);

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
  }`,
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
  }`
);

// Remove auto speak if still present
h = h.replace(/\s*if\(card\.dataset\.speak\)speak\(card\.dataset\.speak,'zh',null\);/g, '');
h = h.replace(/\s*speak\(state\.noun\.full\|\|wrongCombo,'zh',null\);/g, '');

fs.writeFileSync(PATH, h);
try {
  new Function(h.slice(h.indexOf('<script>') + 8, h.lastIndexOf('</script>')));
  console.log('OK');
} catch (e) {
  console.error('JS error', e.message);
  process.exit(1);
}
