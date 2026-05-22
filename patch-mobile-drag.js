const fs = require('fs');
const P = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let h = fs.readFileSync(P, 'utf8');

const cssBlock = `
.drag-ghost{
  position:fixed;left:0;top:0;z-index:10050;pointer-events:none;
  transform:translate(-50%,-50%);padding:.45rem .65rem;border-radius:12px;
  border:3px solid #fff;background:#fff;box-shadow:0 8px 24px rgba(120,80,160,.35);
  max-width:min(72vw,240px);opacity:.96;
}
.drag-ghost .zh{font-weight:700;font-size:1.2rem;color:var(--pink-deep)}
.drag-ghost .pinyin{color:var(--muted);font-size:.85rem}
body.touch-drag-active{-webkit-user-select:none;user-select:none}
.touch-drag-active [data-drop-zone].over,.touch-drag-active .bucket.over{
  outline:3px solid var(--pink);outline-offset:3px;background:rgba(255,200,230,.25);
}
.learn-tile.is-pointer-dragging,.drag-card.is-pointer-dragging{opacity:.42}
`;

if (!h.includes('.drag-ghost{')) {
  h = h.replace(
    '.touch-learn .learn-touch-hint{display:block}',
    '.touch-learn .learn-touch-hint{display:block}\n' + cssBlock.trim()
  );
}

const isTouchOld = `  function isTouchUI(){
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }`;

const isTouchNew = `  function isTouchUI(){
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

if (!h.includes('function setupPointerDrag')) {
  if (!h.includes(isTouchOld)) throw new Error('isTouchUI block not found');
  h = h.replace(isTouchOld, isTouchNew);
}

h = h.replace(
  '先點名詞，再點動詞 · Choisis un nom, puis un verbe',
  '按住名詞拖到動詞（或先點名詞再點動詞）· Glisse ou touche nom puis verbe'
);

const learnTileBlockOld = `    root.querySelectorAll('.learn-tile[draggable]').forEach(function(tile){
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
      });
      tile.addEventListener('dragstart',function(e){
        if(e.target.closest('.btn-speak')){e.preventDefault();return;}
        tile.classList.add('dragging');
        e.dataTransfer.setData('application/json',JSON.stringify({
          type:tile.dataset.dragType,
          zh:tile.dataset.zh,
          py:tile.dataset.py,
          speak:tile.dataset.zh,
          full:tile.dataset.full||'',fullPy:tile.dataset.fullPy||'',
          verb:tile.dataset.verb||'',fr:tile.dataset.fr||'',
          img:tile.querySelector('.tile-emoji')?tile.querySelector('.tile-emoji').textContent:(tile.querySelector('.tile-svg')?'go':'')
        }));
      });
      tile.addEventListener('dragend',function(){tile.classList.remove('dragging');});
    });
    root.querySelectorAll('[data-drop-zone]').forEach(function(zone){
      zone.addEventListener('dragover',function(e){e.preventDefault();zone.classList.add('over');});
      zone.addEventListener('dragleave',function(){zone.classList.remove('over');});
      zone.addEventListener('drop',function(e){
        e.preventDefault();zone.classList.remove('over');
        applyLearnDrop(zone,JSON.parse(e.dataTransfer.getData('application/json')));
      });
    });
    if(isTouchUI()){
      root.classList.add('touch-learn');
      var stage=root.querySelector('.learn-stage');
      if(stage&&!root.querySelector('.learn-touch-hint')){
        var hint=document.createElement('p');
        hint.className='learn-touch-hint';
        hint.textContent='先點詞語，再點空格 · Choisis une tuile, puis une zone';
        stage.parentNode.insertBefore(hint,stage);
      }
      var pickedTile=null;
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
    }`;

const learnTileBlockNew = `    var touchLearn=isTouchUI();
    root.querySelectorAll('.learn-tile').forEach(function(tile){
      var frBtn=tile.querySelector('.btn-speak.btn-fr');
      if(frBtn&&tile.dataset.fr){
        var frText=tile.dataset.fr;
        if(tile.dataset.dragType==='noun'&&tile.dataset.full)frText=tile.dataset.fr;
        frBtn.setAttribute('data-speak',frText);
      }
      tile.querySelectorAll('.btn-speak').forEach(function(btn){
        btn.addEventListener('mousedown',function(e){e.stopPropagation();});
        btn.addEventListener('touchstart',function(e){e.stopPropagation();},{passive:true});
        btn.addEventListener('click',function(e){e.stopPropagation();});
      });
      if(touchLearn)tile.draggable=false;
      else{
        tile.draggable=true;
        tile.addEventListener('dragstart',function(e){
          if(e.target.closest('.btn-speak')){e.preventDefault();return;}
          tile.classList.add('dragging');
          e.dataTransfer.setData('application/json',JSON.stringify({
            type:tile.dataset.dragType,zh:tile.dataset.zh,py:tile.dataset.py,speak:tile.dataset.zh,
            full:tile.dataset.full||'',fullPy:tile.dataset.fullPy||'',
            verb:tile.dataset.verb||'',fr:tile.dataset.fr||'',
            img:tile.querySelector('.tile-emoji')?tile.querySelector('.tile-emoji').textContent:(tile.querySelector('.tile-svg')?'go':'')
          }));
        });
        tile.addEventListener('dragend',function(){tile.classList.remove('dragging');});
      }
    });
    if(!touchLearn){
      root.querySelectorAll('[data-drop-zone]').forEach(function(zone){
        zone.addEventListener('dragover',function(e){e.preventDefault();zone.classList.add('over');});
        zone.addEventListener('dragleave',function(){zone.classList.remove('over');});
        zone.addEventListener('drop',function(e){
          e.preventDefault();zone.classList.remove('over');
          applyLearnDrop(zone,JSON.parse(e.dataTransfer.getData('application/json')));
        });
      });
    }
    if(touchLearn){
      root.classList.add('touch-learn');
      var stage=root.querySelector('.learn-stage');
      if(stage&&!root.querySelector('.learn-touch-hint')){
        var hint=document.createElement('p');
        hint.className='learn-touch-hint';
        hint.textContent='按住詞語拖到空格（或先點詞語再點空格）· Glisse ou touche tuile puis zone';
        stage.parentNode.insertBefore(hint,stage);
      }
      var pickedTile=null;
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
      });
    }`;

if (h.includes(learnTileBlockOld)) {
  h = h.replace(learnTileBlockOld, learnTileBlockNew);
} else if (!h.includes('setupPointerDrag({\n        scope:root')) {
  throw new Error('learn tile block not found');
}

const practiceOld = `    if(isTouchUI()){
      if(dragGame)dragGame.classList.add('touch-practice');
      pool.querySelectorAll('.drag-card').forEach(function(card){
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
    }else{
      pool.querySelectorAll('.drag-card').forEach(function(card){
        card.addEventListener('dragstart',function(e){card.classList.remove('wrong');card.classList.add('dragging');e.dataTransfer.setData('text/plain',card.dataset.bucket+'|'+card.querySelector('.zh').textContent);});
        card.addEventListener('dragend',function(){card.classList.remove('dragging');});
      });
      document.querySelectorAll('#drag-buckets .bucket').forEach(function(bucket){
        bucket.addEventListener('dragover',function(e){e.preventDefault();bucket.classList.add('over');});
        bucket.addEventListener('dragleave',function(){bucket.classList.remove('over');});
        bucket.addEventListener('drop',function(e){
          e.preventDefault();bucket.classList.remove('over');
          var parts=e.dataTransfer.getData('text/plain').split('|');
          var label=parts[1]||'';
          var card=Array.from(pool.querySelectorAll('.drag-card')).find(function(c){return c.querySelector('.zh').textContent===label;});
          if(!card)return;
          applyPracticeMatch(card,bucket);
        });
      });
    }`;

const practiceNew = `    var touchPractice=isTouchUI();
    if(touchPractice){
      if(dragGame)dragGame.classList.add('touch-practice');
      pool.querySelectorAll('.drag-card').forEach(function(card){card.draggable=false;});
      pool.querySelectorAll('.drag-card').forEach(function(card){
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
      });
    }else{
      pool.querySelectorAll('.drag-card').forEach(function(card){
        card.draggable=true;
        card.addEventListener('dragstart',function(e){card.classList.remove('wrong');card.classList.add('dragging');e.dataTransfer.setData('text/plain',card.dataset.bucket+'|'+card.querySelector('.zh').textContent);});
        card.addEventListener('dragend',function(){card.classList.remove('dragging');});
      });
      document.querySelectorAll('#drag-buckets .bucket').forEach(function(bucket){
        bucket.addEventListener('dragover',function(e){e.preventDefault();bucket.classList.add('over');});
        bucket.addEventListener('dragleave',function(){bucket.classList.remove('over');});
        bucket.addEventListener('drop',function(e){
          e.preventDefault();bucket.classList.remove('over');
          var parts=e.dataTransfer.getData('text/plain').split('|');
          var label=parts[1]||'';
          var card=Array.from(pool.querySelectorAll('.drag-card')).find(function(c){return c.querySelector('.zh').textContent===label;});
          if(!card)return;
          applyPracticeMatch(card,bucket);
        });
      });
    }`;

if (h.includes(practiceOld)) {
  h = h.replace(practiceOld, practiceNew);
} else if (!h.includes('scope:dragGame')) {
  throw new Error('practice block not found');
}

h = h.replace(
  '.btn-speak,.coco-card,.drag-card,.bucket,.learn-tile,.course-card,.sub-card{touch-action:manipulation}',
  '.btn-speak,.coco-card,.course-card,.sub-card{touch-action:manipulation}\n.drag-card,.bucket,.learn-tile,.stage-zone{touch-action:none}'
);

fs.writeFileSync(P, h);
console.log('mobile drag patch ok', h.includes('setupPointerDrag'), h.includes('touch-action:none'));
