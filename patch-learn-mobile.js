const fs = require('fs');
const PATH = '/Users/hsintzuchen/Library/Mobile Documents/com~apple~TextEdit/Documents/chinese-cours-jour/index.html';
let h = fs.readFileSync(PATH, 'utf8');

// Auto speak Chinese when correct
h = h.replace(
  `        var ck=state.verb.zh+"+"+state.noun.zh;
        if(ck!==lastCorrectKey){lastCorrectKey=ck;}`,
  `        var ck=state.verb.zh+"+"+state.noun.zh;
        if(ck!==lastCorrectKey){
          lastCorrectKey=ck;
          speak(state.noun.full||wrongCombo,'zh',null);
        }`
);

// Clear all buttons: querySelectorAll
h = h.replace(
  `    var clearBtn=root.querySelector('[data-stage-clear]');
    if(clearBtn)clearBtn.addEventListener('click',function(){
      state.verb=null;state.noun=null;lastWrongKey="";lastCorrectKey="";
      renderSlot(slotVerb,null);renderSlot(slotNoun,null);
      updateResult();
    });`,
  `    root.querySelectorAll('[data-stage-clear]').forEach(function(clearBtn){
      clearBtn.addEventListener('click',function(){
        state.verb=null;state.noun=null;lastWrongKey="";lastCorrectKey="";
        renderSlot(slotVerb,null);renderSlot(slotNoun,null);
        updateResult();
        root.querySelectorAll('.learn-tile').forEach(function(t){t.classList.remove('touch-pick');});
      });
    });`
);

// Replace stage clear UI (both learn pages)
const oldStage = `<div class="learn-stage">
  <button type="button" class="btn-stage-clear" data-stage-clear title="清空" aria-label="清空">↺</button>
  <div class="stage-row stage-equation">`;

const newStage = `<div class="learn-stage">
  <div class="stage-row stage-equation">`;

h = h.split(oldStage).join(newStage);

const oldStageEnd = `    </div>
  </div>
</div>
</section>

<section id="theme1-instruments-learn"`;
// Only first occurrence - games section ends before instruments

h = h.replace(
  `      <div class="feedback-speak">
        <button type="button" class="btn-speak btn-zh" data-speak-zh data-lang="zh" disabled>🔊</button>
        <button type="button" class="btn-speak btn-fr" data-speak-fr data-lang="fr" disabled>🔊</button>
      </div>
    </div>
  </div>
</div>
</section>

<section id="theme1-instruments-learn"`,
  `      <div class="feedback-speak">
        <button type="button" class="btn-speak btn-zh" data-speak-zh data-lang="zh" disabled>🔊</button>
        <button type="button" class="btn-speak btn-fr" data-speak-fr data-lang="fr" disabled>🔊</button>
      </div>
    </div>
  </div>
  <div class="stage-clear-bar">
    <button type="button" class="btn-learn-clear-all" data-stage-clear>清除全部 · Tout effacer</button>
  </div>
</div>
</section>

<section id="theme1-instruments-learn"`
);

// Second learn-stage (instruments) - before closing section
h = h.replace(
  `      <div class="feedback-speak">
        <button type="button" class="btn-speak btn-zh" data-speak-zh data-lang="zh" disabled>🔊</button>
        <button type="button" class="btn-speak btn-fr" data-speak-fr data-lang="fr" disabled>🔊</button>
      </div>
    </div>
  </div>
</div>
</section>

</div>
<script>`,
  `      <div class="feedback-speak">
        <button type="button" class="btn-speak btn-zh" data-speak-zh data-lang="zh" disabled>🔊</button>
        <button type="button" class="btn-speak btn-fr" data-speak-fr data-lang="fr" disabled>🔊</button>
      </div>
    </div>
  </div>
  <div class="stage-clear-bar">
    <button type="button" class="btn-learn-clear-all" data-stage-clear>清除全部 · Tout effacer</button>
  </div>
</div>
</section>

</div>
<script>`
);

// CSS: clear bar + mobile learn tiles
const mobileLearnCss = `
.stage-clear-bar{margin-top:.75rem;display:flex;justify-content:center;padding-top:.15rem}
.btn-learn-clear-all{
  padding:.5rem 1.15rem;border-radius:999px;border:2px solid #fff;
  background:linear-gradient(145deg,#ede9fe,#ddd6fe);color:#5b21b6;
  font-size:.88rem;font-weight:700;font-family:var(--font-fr);cursor:pointer;
  box-shadow:0 3px 10px rgba(167,139,250,.25);touch-action:manipulation;
}
.btn-learn-clear-all:hover{background:#ddd6fe;transform:scale(1.02)}
`;

h = h.replace('.btn-stage-clear{position:absolute;', mobileLearnCss + '\n.btn-stage-clear{position:absolute;');

// Hide old corner clear if any left - we removed buttons. Remove obsolete btn-stage-clear styles optional - leave harmless

// Mobile-only: show all tiles, scroll page not column
const mobilePatch = `
  /* 學習頁手機：字卡全部顯示，靠頁面捲動（不改電腦版） */
  .learn-col{height:auto!important;min-height:0!important;overflow:visible!important}
  .learn-scroll{overflow:visible!important;flex:none!important;min-height:0!important;padding:.45rem .5rem .55rem}
  .learn-scroll>.learn-tile{flex:0 0 auto!important;min-height:auto!important}
  .learn-board-four .learn-col{height:auto!important}
  .learn-board-four .learn-scroll{overflow:visible!important}
  .learn-board-four .learn-scroll>.learn-tile{flex:0 0 auto!important;min-height:auto!important}
  .learn-tile{padding:.5rem .55rem}
  .learn-board{margin-bottom:.5rem}
`;

h = h.replace(
  `  .learn-board{gap:.65rem}
  .learn-col-tiles{gap:.45rem}`,
  `  .learn-board{gap:.65rem}
  .learn-col-tiles{gap:.45rem}
${mobilePatch}`
);

fs.writeFileSync(PATH, h);
console.log('learn patch ok', h.includes('btn-learn-clear-all'), h.includes("speak(state.noun.full"));
