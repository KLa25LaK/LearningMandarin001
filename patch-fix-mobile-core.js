const fs = require('fs');
const P = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let h = fs.readFileSync(P, 'utf8');

// --- 1. Reduce bottom whitespace ---
h = h.replace('  padding-bottom:6rem;\n', '  padding-bottom:2rem;\n');
h = h.replace('.app{max-width:720px;margin:0 auto;padding:1.25rem 1rem 2rem}', '.app{max-width:720px;margin:0 auto;padding:1.25rem 1rem 1rem}');
h = h.replace(
  'body{-webkit-tap-highlight-color:transparent;padding-bottom:max(5.5rem,env(safe-area-inset-bottom))}\n.app{padding:1rem .85rem 2rem;max-width:720px}',
  'body{-webkit-tap-highlight-color:transparent;padding-bottom:max(2rem,env(safe-area-inset-bottom))}\n.app{padding:1rem .85rem 1rem;max-width:720px}'
);
h = h.replace(
  `#theme1.theme1-hub:target{
  display:flex;
  flex-direction:column;
  min-height:calc(100dvh - 4.5rem);
  gap:clamp(.6rem,1.8vh,.85rem);
  padding:0 0 .35rem;
  box-sizing:border-box;
}`,
  `#theme1.theme1-hub:target{
  display:flex;
  flex-direction:column;
  min-height:0;
  gap:clamp(.6rem,1.8vh,.85rem);
  padding:0 0 .35rem;
  box-sizing:border-box;
}`
);
h = h.replace(
  '  #theme1.theme1-hub:target{min-height:calc(100dvh - 5rem)}\n',
  '  #theme1.theme1-hub:target{min-height:0}\n'
);
h = h.replace('.learn-board{margin-bottom:1rem}', '.learn-board{margin-bottom:.65rem}');
h = h.replace('.learn-stage{position:relative;background:', '.learn-stage{position:relative;margin-bottom:.5rem;background:');

// touch-action: allow taps on speak buttons
h = h.replace(
  '.drag-card,.bucket,.learn-tile,.stage-zone{touch-action:none}',
  '.drag-card,.bucket,.learn-tile,.stage-zone{touch-action:manipulation}'
);

// --- 2. Speech: unlock + touchend + data-speak-zh/fr ---
const speechBlockOld = `  var voices={zh:null,fr:null};
  function loadVoices(){
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
  },true);`;

const speechBlockNew = `  var voices={zh:null,fr:null};
  var speechUnlocked=false;
  function loadVoices(){
    if(!window.speechSynthesis)return;
    var v=speechSynthesis.getVoices();
    if(!v||!v.length)return;
    voices.zh=v.find(function(x){return x.lang==='zh-TW'||(x.lang&&x.lang.indexOf('zh-TW')===0)})||v.find(function(x){return x.lang&&x.lang.indexOf('zh')===0})||null;
    voices.fr=v.find(function(x){return x.lang==='fr-FR'||(x.lang&&x.lang.indexOf('fr-FR')===0)})||v.find(function(x){return x.lang&&x.lang.indexOf('fr')===0})||null;
  }
  if(window.speechSynthesis){
    loadVoices();
    speechSynthesis.onvoiceschanged=function(){loadVoices();};
    window.addEventListener('pageshow',function(){loadVoices();});
  }
  function unlockSpeech(){
    if(!window.speechSynthesis)return;
    loadVoices();
    if(speechUnlocked)return;
    speechUnlocked=true;
    try{
      var u=new SpeechSynthesisUtterance('\\u200b');
      u.volume=0.01;u.rate=1;u.lang='zh-TW';
      speechSynthesis.speak(u);
      speechSynthesis.cancel();
    }catch(err){}
    if(window.speechSynthesis.paused)try{speechSynthesis.resume();}catch(e2){}
  }
  function speak(text,lang,btn){
    if(!text||!window.speechSynthesis)return;
    unlockSpeech();
    loadVoices();
    if(window.speechSynthesis.paused)try{speechSynthesis.resume();}catch(e){}
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);
    u.lang=lang==='fr'?'fr-FR':'zh-TW';
    u.rate=0.85;
    var voice=lang==='fr'?voices.fr:voices.zh;
    if(voice)u.voice=voice;
    if(btn){btn.classList.add('speaking');u.onend=u.onerror=function(){btn.classList.remove('speaking');};}
    speechSynthesis.speak(u);
  }
  function findSpeakButton(e){
    var t=e.target;
    if(!t||!t.closest)return null;
    var b=t.closest('button.btn-speak,button.btn-chip,button.btn-sentence');
    if(!b||b.disabled)return null;
    var text=(b.getAttribute('data-speak')||'').trim();
    if(!text&&b.hasAttribute('data-speak-zh'))text=(b.getAttribute('data-speak-zh')||'').trim();
    if(!text&&b.hasAttribute('data-speak-fr'))text=(b.getAttribute('data-speak-fr')||'').trim();
    if(!text)return null;
    return b;
  }
  function triggerSpeak(e){
    var b=findSpeakButton(e);
    if(!b)return false;
    if(b.getAttribute('data-action')==='error')return false;
    var lang=b.getAttribute('data-lang')||'zh';
    var text=(b.getAttribute('data-speak')||'').trim();
    if(!text&&lang==='zh')text=(b.getAttribute('data-speak-zh')||'').trim();
    if(!text&&lang==='fr')text=(b.getAttribute('data-speak-fr')||'').trim();
    if(!text)return false;
    speak(text,lang,b);
    return true;
  }
  document.addEventListener('click',function(e){
    if(!triggerSpeak(e))return;
    e.preventDefault();
    e.stopPropagation();
  },true);
  document.addEventListener('touchend',function(e){
    if(!triggerSpeak(e))return;
    e.preventDefault();
    e.stopPropagation();
  },{capture:true,passive:false});
  document.addEventListener('pointerup',function(e){
    if(e.pointerType!=='touch')return;
    if(!triggerSpeak(e))return;
    e.preventDefault();
    e.stopPropagation();
  },{capture:true});`;

if (!h.includes(speechBlockOld)) throw new Error('speech block not found');
h = h.replace(speechBlockOld, speechBlockNew);

// unlock speech on first touch (not only error beep)
h = h.replace(
  `  function unlockAudio(){
    buildErrorBeepUrl();
    if(!errorBeepAudio){
      errorBeepAudio=new Audio(buildErrorBeepUrl());
      errorBeepAudio.preload='auto';
    }
    try{errorBeepAudio.load();}catch(e){}
  }
  ['pointerdown','touchstart','click','dragstart','keydown'].forEach(function(ev){
    document.addEventListener(ev,unlockAudio,{passive:true});
  });`,
  `  function unlockAudio(){
    buildErrorBeepUrl();
    unlockSpeech();
    if(!errorBeepAudio){
      errorBeepAudio=new Audio(buildErrorBeepUrl());
      errorBeepAudio.preload='auto';
    }
    try{errorBeepAudio.load();}catch(e){}
  }
  ['pointerdown','touchstart','click','dragstart','keydown'].forEach(function(ev){
    document.addEventListener(ev,unlockAudio,{passive:true});
  });`
);

// --- 3. Replace setupPointerDrag with touch+pointer hybrid ---
const dragFnOld = `  function isTouchUI(){
    if(window.matchMedia('(hover: none) and (pointer: coarse)').matches)return true;
    if(navigator.maxTouchPoints>0&&window.matchMedia('(max-width: 900px)').matches)return true;
    return false;
  }
  function setupPointerDrag(opts){
    var active=null,ghost=null,hlZone=null,TH=10;
    function clearHL(){if(hlZone){hlZone.classList.remove('over');hlZone=null;}}
    function clearDrag(){
      if(ghost){ghost.remove();ghost=null;}
      document.body.classList.remove('touch-drag-active');
      if(active&&active.item)active.item.classList.remove('is-pointer-dragging');
      clearHL();active=null;
    }
    function findZone(x,y){
      if(ghost)ghost.style.visibility='hidden';
      var el=document.elementFromPoint(x,y);
      if(ghost)ghost.style.visibility='';
      return el?el.closest(opts.zoneSelector):null;
    }
    function onMove(e){
      if(!active||e.pointerId!==active.id)return;
      var dx=e.clientX-active.x,dy=e.clientY-active.y;
      if(!active.moved){
        if(Math.hypot(dx,dy)<TH)return;
        active.moved=true;
        try{active.item.setPointerCapture(e.pointerId);}catch(err){}
        active.item.classList.add('is-pointer-dragging');
        ghost=opts.makeGhost(active.item,active.payload);
        document.body.appendChild(ghost);
        document.body.classList.add('touch-drag-active');
      }
      ghost.style.left=e.clientX+'px';
      ghost.style.top=e.clientY+'px';
      var z=findZone(e.clientX,e.clientY);
      if(z!==hlZone){clearHL();hlZone=z;if(z)z.classList.add('over');}
    }
    function onEnd(e){
      if(!active||e.pointerId!==active.id)return;
      var was=active;
      if(was.moved){
        e.preventDefault();
        var z=findZone(e.clientX,e.clientY);
        if(z)opts.onDrop(z,was.payload,was.item);
        clearDrag();
      }else active=null;
    }
    opts.scope.addEventListener('pointerdown',function(e){
      if(e.button!==0)return;
      var item=e.target.closest(opts.itemSelector);
      if(!item||!opts.scope.contains(item))return;
      if(e.target.closest('.btn-speak'))return;
      if(opts.canDrag&&!opts.canDrag(item))return;
      active={id:e.pointerId,item:item,x:e.clientX,y:e.clientY,moved:false,payload:opts.getPayload(item)};
    },{passive:true});
    window.addEventListener('pointermove',onMove,{passive:true});
    window.addEventListener('pointerup',onEnd,{passive:true});
    window.addEventListener('pointercancel',onEnd,{passive:true});
  }`;

const dragFnNew = `  function isTouchUI(){
    if(navigator.maxTouchPoints>0)return true;
    if(window.matchMedia('(hover: none) and (pointer: coarse)').matches)return true;
    return false;
  }
  function setupPointerDrag(opts){
    var active=null,ghost=null,hlZone=null,TH=8;
    function clearHL(){if(hlZone){hlZone.classList.remove('over');hlZone=null;}}
    function clearDrag(){
      if(ghost){ghost.remove();ghost=null;}
      document.body.classList.remove('touch-drag-active');
      if(active&&active.item)active.item.classList.remove('is-pointer-dragging');
      clearHL();active=null;
    }
    function findZone(x,y){
      if(ghost)ghost.style.visibility='hidden';
      var el=document.elementFromPoint(x,y);
      if(ghost)ghost.style.visibility='';
      return el?el.closest(opts.zoneSelector):null;
    }
    function pt(e){
      var t=(e.touches&&e.touches[0])||(e.changedTouches&&e.changedTouches[0]);
      if(t)return{x:t.clientX,y:t.clientY};
      return{x:e.clientX,y:e.clientY};
    }
    function start(item,x,y){
      active={item:item,x:x,y:y,moved:false,payload:opts.getPayload(item),touch:!!navigator.maxTouchPoints};
    }
    function move(x,y){
      if(!active)return;
      var dx=x-active.x,dy=y-active.y;
      if(!active.moved){
        if(Math.hypot(dx,dy)<TH)return false;
        active.moved=true;
        active.item.classList.add('is-pointer-dragging');
        ghost=opts.makeGhost(active.item,active.payload);
        document.body.appendChild(ghost);
        document.body.classList.add('touch-drag-active');
      }
      ghost.style.left=x+'px';
      ghost.style.top=y+'px';
      var z=findZone(x,y);
      if(z!==hlZone){clearHL();hlZone=z;if(z)z.classList.add('over');}
      return true;
    }
    function end(x,y,prevent){
      if(!active)return;
      var was=active;
      if(was.moved){
        if(prevent)try{event.preventDefault();}catch(e){}
        var z=findZone(x,y);
        if(z)opts.onDrop(z,was.payload,was.item);
        clearDrag();
        return 'dropped';
      }
      if(opts.onTap)opts.onTap(was.item);
      active=null;
      return 'tap';
    }
    opts.scope.addEventListener('touchstart',function(e){
      var item=e.target.closest(opts.itemSelector);
      if(!item||!opts.scope.contains(item))return;
      if(e.target.closest('.btn-speak,.btn-chip'))return;
      if(opts.canDrag&&!opts.canDrag(item))return;
      var p=pt(e);
      start(item,p.x,p.y);
    },{passive:true});
    opts.scope.addEventListener('touchmove',function(e){
      if(!active)return;
      var p=pt(e);
      if(move(p.x,p.y))e.preventDefault();
    },{passive:false});
    opts.scope.addEventListener('touchend',function(e){
      if(!active)return;
      var p=pt(e);
      var r=end(p.x,p.y,true);
      if(r==='dropped')e.preventDefault();
    },{passive:false});
    opts.scope.addEventListener('touchcancel',function(){clearDrag();},{passive:true});
    opts.scope.addEventListener('pointerdown',function(e){
      if(e.pointerType==='touch')return;
      if(e.button!==0)return;
      var item=e.target.closest(opts.itemSelector);
      if(!item||!opts.scope.contains(item))return;
      if(e.target.closest('.btn-speak,.btn-chip'))return;
      if(opts.canDrag&&!opts.canDrag(item))return;
      start(item,e.clientX,e.clientY);
      active.id=e.pointerId;
    },{passive:true});
    window.addEventListener('pointermove',function(e){
      if(!active||active.id===undefined||e.pointerId!==active.id)return;
      move(e.clientX,e.clientY);
    },{passive:true});
    window.addEventListener('pointerup',function(e){
      if(!active||active.id===undefined||e.pointerId!==active.id)return;
      end(e.clientX,e.clientY,false);
    },{passive:true});
    window.addEventListener('pointercancel',function(e){
      if(!active||active.id===undefined||e.pointerId!==active.id)return;
      clearDrag();
    },{passive:true});
  }`;

if (!h.includes(dragFnOld)) throw new Error('drag fn not found');
h = h.replace(dragFnOld, dragFnNew);

// Learn board: use onTap instead of separate click for pick
const learnTapOld = `      var pickedTile=null;
      root.querySelectorAll('.learn-tile').forEach(function(tile){
        tile.addEventListener('click',function(e){
          if(e.target.closest('.btn-speak'))return;
          root.querySelectorAll('.learn-tile').forEach(function(t){t.classList.remove('touch-pick');});
          tile.classList.add('touch-pick');
          pickedTile=tile;
        });
      });
      root.querySelectorAll('[data-drop-zone]').forEach(function(zone){
        zone.addEventListener('click',function(){
          if(!pickedTile)return;
          applyLearnDrop(zone,tilePayload(pickedTile));
          pickedTile=null;
          root.querySelectorAll('.learn-tile').forEach(function(t){t.classList.remove('touch-pick');});
        });
      });
      setupPointerDrag({
        scope:root,itemSelector:'.learn-tile',zoneSelector:'[data-drop-zone]',
        getPayload:tilePayload,
        canDrag:function(){return true;},
        makeGhost:function(tile){
          var g=document.createElement('div');
          g.className='drag-ghost';
          g.innerHTML='<span class="zh">'+tile.dataset.zh+'</span><span class="pinyin">'+tile.dataset.py+'</span>';
          return g;
        },
        onDrop:function(zone,payload){applyLearnDrop(zone,payload);}
      });`;

const learnTapNew = `      var pickedTile=null;
      function pickTile(tile){
        root.querySelectorAll('.learn-tile').forEach(function(t){t.classList.remove('touch-pick');});
        tile.classList.add('touch-pick');
        pickedTile=tile;
      }
      root.querySelectorAll('[data-drop-zone]').forEach(function(zone){
        zone.addEventListener('click',function(){
          if(!pickedTile)return;
          applyLearnDrop(zone,tilePayload(pickedTile));
          pickedTile=null;
          root.querySelectorAll('.learn-tile').forEach(function(t){t.classList.remove('touch-pick');});
        });
        zone.addEventListener('touchend',function(e){
          if(!pickedTile)return;
          applyLearnDrop(zone,tilePayload(pickedTile));
          pickedTile=null;
          root.querySelectorAll('.learn-tile').forEach(function(t){t.classList.remove('touch-pick');});
          e.preventDefault();
        },{passive:false});
      });
      setupPointerDrag({
        scope:root,itemSelector:'.learn-tile',zoneSelector:'[data-drop-zone]',
        getPayload:tilePayload,
        canDrag:function(){return true;},
        onTap:pickTile,
        makeGhost:function(tile){
          var g=document.createElement('div');
          g.className='drag-ghost';
          g.innerHTML='<span class="zh">'+tile.dataset.zh+'</span><span class="pinyin">'+tile.dataset.py+'</span>';
          return g;
        },
        onDrop:function(zone,payload){applyLearnDrop(zone,payload);}
      });`;

if (h.includes(learnTapOld)) h = h.replace(learnTapOld, learnTapNew);

// Practice: onTap for card select
const practiceTapOld = `      pool.querySelectorAll('.drag-card').forEach(function(card){
        card.addEventListener('click',function(){
          if(card.classList.contains('correct'))return;
          pool.querySelectorAll('.drag-card').forEach(function(c){c.classList.remove('touch-pick');});
          card.classList.add('touch-pick');
          selectedPracticeCard=card;
          document.getElementById('drag-msg').textContent='再點一個動詞 · Choisis un verbe';
        });
      });
      document.querySelectorAll('#drag-buckets .bucket').forEach(function(bucket){
        bucket.addEventListener('click',function(){
          if(!selectedPracticeCard){
            document.getElementById('drag-msg').textContent='先點名詞 · Choisis un nom';
            return;
          }
          applyPracticeMatch(selectedPracticeCard,bucket);
          selectedPracticeCard=null;
        });
      });
      setupPointerDrag({
        scope:dragGame||document.body,itemSelector:'.drag-card',zoneSelector:'.bucket',
        canDrag:function(card){return !card.classList.contains('correct');},
        getPayload:function(card){
          return {card:card,bucket:card.dataset.bucket,label:card.querySelector('.zh').textContent};
        },
        makeGhost:function(card){
          var g=document.createElement('div');
          g.className='drag-ghost';
          g.innerHTML='<span class="zh">'+card.querySelector('.zh').textContent+'</span><span class="pinyin">'+card.querySelector('.pinyin').textContent+'</span>';
          return g;
        },
        onDrop:function(bucket,payload){
          if(payload&&payload.card)applyPracticeMatch(payload.card,bucket);
        }
      });`;

const practiceTapNew = `      function pickPracticeCard(card){
        if(card.classList.contains('correct'))return;
        pool.querySelectorAll('.drag-card').forEach(function(c){c.classList.remove('touch-pick');});
        card.classList.add('touch-pick');
        selectedPracticeCard=card;
        document.getElementById('drag-msg').textContent='再點一個動詞 · Choisis un verbe';
      }
      document.querySelectorAll('#drag-buckets .bucket').forEach(function(bucket){
        bucket.addEventListener('click',function(){
          if(!selectedPracticeCard){
            document.getElementById('drag-msg').textContent='先點名詞 · Choisis un nom';
            return;
          }
          applyPracticeMatch(selectedPracticeCard,bucket);
          selectedPracticeCard=null;
        });
        bucket.addEventListener('touchend',function(e){
          if(!selectedPracticeCard){
            document.getElementById('drag-msg').textContent='先點名詞 · Choisis un nom';
            return;
          }
          applyPracticeMatch(selectedPracticeCard,bucket);
          selectedPracticeCard=null;
          e.preventDefault();
        },{passive:false});
      });
      setupPointerDrag({
        scope:dragGame||document.body,itemSelector:'.drag-card',zoneSelector:'.bucket',
        canDrag:function(card){return !card.classList.contains('correct');},
        onTap:pickPracticeCard,
        getPayload:function(card){
          return {card:card,bucket:card.dataset.bucket,label:card.querySelector('.zh').textContent};
        },
        makeGhost:function(card){
          var g=document.createElement('div');
          g.className='drag-ghost';
          g.innerHTML='<span class="zh">'+card.querySelector('.zh').textContent+'</span><span class="pinyin">'+card.querySelector('.pinyin').textContent+'</span>';
          return g;
        },
        onDrop:function(bucket,payload){
          if(payload&&payload.card)applyPracticeMatch(payload.card,bucket);
        }
      });`;

if (h.includes(practiceTapOld)) h = h.replace(practiceTapOld, practiceTapNew);

// Fix bug in end() - used bare 'event' instead of parameter
h = h.replace(
  `    function end(x,y,prevent){
      if(!active)return;
      var was=active;
      if(was.moved){
        if(prevent)try{event.preventDefault();}catch(e){}`,
  `    function end(x,y,prevent,evt){
      if(!active)return;
      var was=active;
      if(was.moved){
        if(prevent&&evt)try{evt.preventDefault();}catch(e){}`
);
h = h.replace(
  `      var r=end(p.x,p.y,true);
      if(r==='dropped')e.preventDefault();`,
  `      var r=end(p.x,p.y,true,e);
      if(r==='dropped')e.preventDefault();`
);

// file:// hint (mobile speech often blocked)
if (!h.includes('file-protocol-hint')) {
  h = h.replace(
    '<body>',
    `<body>
<div id="file-protocol-hint" hidden style="position:fixed;left:.75rem;right:.75rem;bottom:.75rem;z-index:10060;padding:.65rem .85rem;border-radius:12px;background:#fff3cd;border:2px solid #f5d76e;color:#6d5f7a;font-size:.82rem;line-height:1.4;box-shadow:0 6px 20px rgba(0,0,0,.12)"></div>`
  );
  h = h.replace(
    '  setNavCurrent();\n})();',
    `  if(location.protocol==='file:'){
    var hint=document.getElementById('file-protocol-hint');
    if(hint){
      hint.hidden=false;
      hint.innerHTML='手機若無法發音：請用 Safari 開啟此頁的網址（https），不要直接用「檔案」預覽。\\u003cbr\\u003ePour la voix sur mobile : ouvrir via Safari (https), pas l’aperçu Fichiers.';
    }
  }
  setNavCurrent();\n})();`
  );
}

fs.writeFileSync(P, h);
console.log('patch ok', h.length);
