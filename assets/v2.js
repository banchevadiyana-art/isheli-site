(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const LIVE = location.hostname==='isheli.app' || location.hostname==='www.isheli.app';
const FORM_ID="cmwpfi21z01la0jyw6uijipj7";

/* First practices (based on the app’s chapter Inward), keyed by onboarding intention */
const P={
 "myself-last":["Old rules","Some rules kept you safe once. You’ve outgrown them.","Where did this rule come from?",["childhood","school","my first job","a relationship","not sure"],"Put one thing for you first","Before you help anyone today, take five minutes that are only yours."],
 "own-rules":["Whose voice is this?","Some rules helped you become who you are. Do they still fit?","Whose expectations are you living by?",["my parents","my partner","my manager","people online","an older version of me"],"Name one rule that isn’t yours","Write it down. You don’t have to change it yet."],
 "say-what-i-think":["The yes you didn’t mean","Rules get tested by one small word — yes.","Where did it show up since last time?",["at work","at home","with people","alone","not sure"],"Give yourself a moment before yes","Next time someone asks, try “Let me get back to you.”"],
 "know-myself":["What you do when no one’s watching","Who are you when no one is watching?","When do you feel most like yourself?",["alone in the morning","walking","with one close friend","making something"],"Do one thing the old you loved","Even for ten minutes. Notice how it feels."],
 "slow-down":["An ordinary day you’d keep","Slow isn’t the same as behind.","Which part of your day feels rushed for no reason?",["mornings","work","evenings","weekends"],"Do one thing slowly","Your coffee, a walk, a shower. Just one, at its own pace."],
 "begin-new":["A note to yourself, now","Most beginnings start before we feel ready.","What would you begin if no one were judging?",["a side project","a new routine","a creative habit","a different kind of work"],"Take the smallest first step","Ten minutes today. Write down what you’d begin."]
};
const REFLECT={"myself-last":"You don’t have to earn rest. Let’s start with one moment that belongs to you.","own-rules":"You can keep the rules that still help and let the others go. You decide which.","say-what-i-think":"A pause before yes isn’t rude. It’s room for your own answer.","know-myself":"She’s still there. We’ll find her again in small, ordinary moments.","slow-down":"You don’t need a slower life to have one slow moment.","begin-new":"You don’t have to feel ready. You only have to begin small."};
/* Echo lines from the app’s library */
const ECHO={
 evening:["You can stop now. The day is done.","What went well, even a little?"],
 morning:["Before the day asks anything, ask yourself one thing.","What would make today feel like yours?"],
 afterPractice:["You gave yourself ten minutes. That’s new.","What you wrote was true. Keep it."],
 dayOff:["Today, rest is the whole assignment.","No stone today. The cairn still stands."],
 heavyDay:["Today, just get through gently.","You’re carrying a lot. Set some down."],
 comingBack:["Welcome back. Nothing was lost.","You came back. That’s the whole practice."],
 ordinary:["Ordinary days are where life actually happens.","Notice one beautiful thing before noon."],
 intention:["You don’t have to earn rest.","Your needs are not extra."]
};
const EYEBROW={evening:"evening",morning:"morning",afterPractice:"after a practice",dayOff:"a day to settle",heavyDay:"for a heavy day",comingBack:"coming back",ordinary:"an ordinary day",intention:"for you"};

const IMG={'slow-down':'body','myself-last':'body','own-rules':'mind','say-what-i-think':'mind','know-myself':'soul','begin-new':'soul'};
const AREA={body:'slow-down',mind:'own-rules',soul:'know-myself',suggest:'myself-last'};
/* ---------- site ---------- */
const nav=$('#nav');
const onScroll=()=>nav.classList.toggle('solid',scrollY>innerHeight*.8);
addEventListener('scroll',onScroll,{passive:true}); onScroll();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.h2,.serif-xl,.moment,.season-cards article,.cols4>div,.pc,.timeline li,.offer').forEach(el=>{el.classList.add('reveal');io.observe(el)});

function siteToast(t,d){const el=$('#site-toast');el.innerHTML='<b>'+t+'</b>'+d;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),4200);}

/* try section */
let picked='myself-last';
$$('.chip').forEach(c=>c.addEventListener('click',()=>{
  $$('.chip').forEach(x=>x.setAttribute('aria-checked',x===c));
  picked=c.dataset.k; window.ishTrack&&ishTrack('try_feeling_selected'); const line=$('#moment-line'); line.classList.add('fade');
  setTimeout(()=>{line.textContent=REFLECT[picked];$('#moment-title').textContent=P[picked][0];$('#moment-ph').style.backgroundImage='url(assets/img/'+(IMG[picked]||'mind')+'.jpg)';$('#moment-try-t').textContent=P[picked][4]+'.';$('#moment-try-d').textContent=P[picked][5];line.classList.remove('fade')},300);
  App.setPractice(picked);
}));
$('#moment-begin').addEventListener('click',()=>{
  window.ishTrack&&ishTrack('try_begin_clicked');
  $('#app').scrollIntoView({behavior:'smooth'});
  yours=true; stopLoop(); setTimeout(()=>{App.reset(true);App.openPractice()},900);
});

/* forms (preview never sends real sign-ups) */
$$('form.join').forEach(f=>{
  const input=$('input',f), btn=$('button',f), note=f.nextElementSibling, label=btn.textContent;
  input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');note.textContent=''});
  f.addEventListener('submit',async e=>{
    e.preventDefault(); const email=input.value.trim();
    if(!email){input.setAttribute('aria-invalid','true');note.textContent='Add your email to save your place.';return input.focus();}
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)){input.setAttribute('aria-invalid','true');note.textContent='That email doesn’t look quite right. Please check it.';return input.focus();}
    btn.textContent='Saving…';btn.disabled=true;
    try{
      if(!LIVE){await wait(700);siteToast('Preview: you’re on the list','On the live site this sends a confirmation email. Nothing was sent from this preview.');}
      else{
        const body='email='+encodeURIComponent(email)+'&userGroup=website'+'&mailingLists=';
        const r=await fetch('https://app.loops.so/api/newsletter-form/'+FORM_ID,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
        let d={};try{d=await r.json()}catch(_){}
        if(r.ok&&d.success!==false){ siteToast('You’re on the list','Check your inbox and tap “Confirm” — then your founding place is saved.'); window.ishTrack&&ishTrack('generate_lead',{method:'waitlist',demo_completed:!!window.__ishDemoDone}); }
        else if((d.message||'').toLowerCase().includes('already')) siteToast('You’re already on the list','Nothing else to do. Your founding code comes on launch day.');
        else siteToast('That didn’t go through','Please try again in a moment, or write to hello@isheli.app.');
      }
      f.reset();f.classList.add('joined');
    }catch(_){siteToast('That didn’t go through','Check your connection and try again.')}
    finally{btn.textContent=label;btn.disabled=false}
  });
});

/* ---------- the app ---------- */
const phone=$('#phone');
/* stones: organic pebbles in sand and taupe, the newest one in mocha */
const PEB='M151.722 40.7958C151.045 48.3656 148.475 55.4839 139.378 60.4493C130.263 65.4148 111.634 69.8073 97.0671 70.606C82.5006 71.4046 65.6597 68.3837 51.9613 65.2412C38.2628 62.0987 20.4844 57.9319 14.8592 51.7337C9.23398 45.5356 12.7411 35.5352 18.21 28.087C23.679 20.6562 34.5821 10.9857 47.7076 7.11403C60.8158 3.24236 80.9554 3.58959 96.9109 4.90909C112.866 6.22858 134.273 9.05855 143.423 15.0484C152.555 21.0208 152.399 33.2261 151.722 40.7958Z';
const STONES=[[1,0,-1.5],[.84,2,2],[.7,-1,-2.5],[.58,1.5,3],[.48,-1,-2],[.4,.5,2.5]];
function buildCairn(el,n,scale,newIdx){
  const W=150,H=170, base=H-14; let y=base, out='';
  const uid='c'+Math.random().toString(36).slice(2,7);
  out+=`<defs><linearGradient id="${uid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFE7DE"/><stop offset="1" stop-color="#D9CCBF"/></linearGradient><linearGradient id="${uid}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A8272"/><stop offset="1" stop-color="#6F5B4E"/></linearGradient></defs>`;
  out+=`<ellipse cx="${W/2}" cy="${base+6}" rx="56" ry="5" fill="#2E2620" opacity=".08"/>`;
  const count=Math.min(Math.max(n,1),6);
  for(let i=0;i<count;i++){
    const [k,dx,rot]=STONES[i], w=140*k*.78, h=74*k*.78, x=W/2-w/2+dx; y-=h*.82;
    const isNew=i===newIdx, isTop=i===n-1;
    const fill=(isNew||isTop)?`url(#${uid}m)`:`url(#${uid}s)`;
    out+=`<g class="${isNew?'peb-new':''}" style="transform-origin:${W/2}px ${y+h/2}px"><path d="${PEB}" transform="translate(${x} ${y}) rotate(${rot} ${w/2} ${h/2}) scale(${w/152} ${h/74})" fill="${fill}"/><path d="${PEB}" transform="translate(${x} ${y}) rotate(${rot} ${w/2} ${h/2}) scale(${w/152} ${h/74})" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="${152/w*0.8}" stroke-dasharray="40 400" stroke-dashoffset="-120"/></g>`;
  }
  const top=Math.max(0,y-10), vh=H-top;
  el.innerHTML=`<svg viewBox="0 ${top} ${W} ${vh}" width="${W*scale/1.6}" height="${vh*scale/1.6}" style="overflow:visible" aria-hidden="true">${out}</svg>`;
}
const App={
  stones:2, done:false, kept:[], moment:'evening', echoIdx:0, practice:'myself-last', answer:'', busy:false,
  init(){
    const d=new Date(), h=d.getHours();
    $('#ph-date').textContent=d.toLocaleDateString('en-GB',{weekday:'short'})+' · '+d.getDate()+' '+d.toLocaleDateString('en-GB',{month:'short'});
    $('#ph-greet').textContent=h<12?'Good morning.':h<18?'Good afternoon.':'Good evening.';
    this.moment=h<11?'morning':h>=19?'evening':'ordinary';
    $$('.tab').forEach(t=>t.addEventListener('click',()=>this.tab(t.dataset.tab)));
    $$('[data-area]').forEach(a=>a.addEventListener('click',()=>this.pickArea(a)));
    $('#ph-card').addEventListener('click',()=>this.openPractice());
    $('#sheet-x').addEventListener('click',()=>this.closePractice());
    $('#st-next1').addEventListener('click',()=>this.step(2));
    $('#st-next2').addEventListener('click',()=>this.step(3));
    $('#st-stone').addEventListener('click',()=>this.placeStone());
    $('#st-done').addEventListener('click',()=>{this.closePractice();this.tab('today')});
    $('#echo-save').addEventListener('click',()=>this.keep());
    $('#echo-share').addEventListener('click',()=>this.toast('Share card ready · Story, square or lock screen'));
    $('#echo-next').addEventListener('click',()=>this.nextEcho());
    $$('.seg button').forEach(b=>b.addEventListener('click',()=>{$$('.seg button').forEach(x=>x.classList.toggle('on',x===b));$('#mine-words').hidden=b.dataset.seg!=='words';$('#mine-echoes').hidden=b.dataset.seg!=='echoes'}));
    this.setPractice(this.practice); this.renderEcho(); this.renderStones(); this.tab('start');
  },
  pickArea(a){
    $$('.area').forEach(x=>x.classList.toggle('picked',x===a));
    this.setPractice(AREA[a.dataset.area]);
    setTimeout(()=>{phone.classList.remove('onboard');this.tab('today');$$('.area').forEach(x=>x.classList.remove('picked'))},450);
  },
  toast(t){const el=$('#ph-toast');el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2200)},
  tab(name){
    $$('.tab').forEach(t=>t.classList.toggle('on',t.dataset.tab===name));
    const tabs=$$('.tab'), i=tabs.findIndex(t=>t.dataset.tab===name), sel=$('#tab-sel');
    if(sel){ if(i<0||name==='echo'){sel.style.opacity=0} else {sel.style.opacity=1; sel.style.transform='translateX('+(i*100)+'%)'} }
    $$('.scr').forEach(s=>s.classList.toggle('is-on',s.dataset.scr===name));
    phone.classList.toggle('photo-top',name==='today'||name==='echo');
    if(name==='echo'){$('#orb-dot').classList.remove('show');stepsLive('echo')}
  },
  setPractice(k){
    this.practice=k; const p=P[k];
    $('#ph-card-t').textContent=p[0]; const img='assets/img/'+(IMG[k]||'mind')+'.jpg'; $('#ph-hero').style.backgroundImage='url('+img+')';
    $('#st-title').textContent=p[0]; $('#st-insight').textContent=p[1]; $('#st-q').textContent=p[2];
    $('#st-try').textContent=p[4]; $('#st-try-d').textContent=p[5]; $('#st-reflect').textContent=REFLECT[k];
    const c=$('#st-chips'); c.innerHTML='';
    p[3].forEach(o=>{const b=document.createElement('button');b.textContent=o;b.addEventListener('click',()=>{$$('button',c).forEach(x=>x.classList.toggle('on',x===b));this.answer=o;setTimeout(()=>this.step(1),450)});c.appendChild(b)});
  },
  openPractice(){ if(this.done) return this.toast('Done for today · next practice opens the day after'); this.tab('today'); this.step(0); $('#sheet').classList.add('open'); $('#sheet').setAttribute('aria-hidden','false'); },
  closePractice(){ $('#sheet').classList.remove('open'); $('#sheet').setAttribute('aria-hidden','true'); stepsLive(null); },
  step(n){
    $$('.step').forEach(s=>{const i=+s.dataset.st; s.classList.toggle('is-on',i===n); s.classList.toggle('was',i<n)});
    $$('#sheet-dots i').forEach((d,i)=>d.classList.toggle('on',i<=n));
    if(n===0){$$('#st-chips button').forEach(b=>b.classList.remove('on'));$('#st-text').value='';$('#st-stone').hidden=false;$('#stone-msg').hidden=true;$('#st-done').hidden=true;buildCairn($('#cairn-drop'),this.stones,1.9,-1);stepsLive('notice')}
    if(n===2){const t=$('#st-text').value.trim();$('#st-you').textContent='“'+(t||this.answer)+'”';stepsLive('understand')}
    if(n===3) stepsLive('try');
  },
  placeStone(){
    this.stones++; buildCairn($('#cairn-drop'),this.stones,1.9,this.stones-1);
    $('#st-stone').hidden=true; $('#stone-msg').hidden=false; $('#stone-msg').textContent=this.stones===1?'Your first stone.':'Stone '+this.stones+' is placed.';
    setTimeout(()=>$('#st-done').hidden=false,900);
    this.done=true; this.moment='afterPractice'; this.echoIdx=0; this.renderEcho(); this.renderStones();
    $('#ph-card').hidden=true; $('#ph-done').hidden=false; $('#orb-dot').classList.add('show');
    const t=$('#st-text').value.trim()||this.answer, e=document.createElement('div'); e.className='entry added';
    e.innerHTML='<p class="q"></p><p class="meta">Today · '+P[this.practice][0]+'</p>'; $('.q',e).textContent='“'+t+'”'; $('#mine-words').prepend(e);
  },
  renderStones(){ buildCairn($('#mini-cairn'),this.stones,.36,-1); $('#ph-stones').textContent=this.stones+' stones'; $('#ph-ch-n').textContent=this.stones+' stones'; },
  renderEcho(){ const L=ECHO[this.moment]; const line=$('#echo-line'); line.classList.add('fade'); setTimeout(()=>{line.textContent=L[this.echoIdx%L.length];$('#echo-eb').textContent='Today’s Echo · '+EYEBROW[this.moment];line.classList.remove('fade')},200) },
  nextEcho(){ const keys=Object.keys(ECHO); this.moment=keys[(keys.indexOf(this.moment)+1)%keys.length]; this.echoIdx=0; this.renderEcho(); },
  keep(){
    const t=$('#echo-line').textContent; if(this.kept.includes(t)) return this.toast('Already in Mine');
    this.kept.unshift(t); $('#mine-empty')?.remove();
    const e=document.createElement('div'); e.className='entry added'; e.innerHTML='<p class="q"></p><p class="meta">Kept from Echo</p>'; $('.q',e).textContent=t; $('#mine-echoes').prepend(e);
    this.toast('Kept in Mine, with your words');
  },
  reset(keepPractice){
    this.stones=2; this.done=false; this.moment=new Date().getHours()<11?'morning':new Date().getHours()>=19?'evening':'ordinary';
    $('#ph-card').hidden=false; $('#ph-done').hidden=true; $('#orb-dot').classList.remove('show');
    $$('.entry.added').forEach(e=>e.remove()); this.kept=[];
    $$('.seg button').forEach((x,i)=>x.classList.toggle('on',i===0)); $('#mine-words').hidden=false; $('#mine-echoes').hidden=true;
    this.closePractice(); this.renderEcho(); this.renderStones(); if(!keepPractice) this.setPractice(picked);
    if(keepPractice){phone.classList.remove('onboard');this.tab('today')} else {phone.classList.add('onboard');this.tab('start')}
  }
};
App.init();

function stepsLive(k){const ol=$('.app-steps');ol.classList.toggle('live',!!k);$$('li',ol).forEach(li=>li.classList.toggle('on',li.dataset.step===k))}

/* measure meaningful completion only (a real person placing the stone), never what she types */
$('#st-stone').addEventListener('click',e=>{ if(e.isTrusted){ window.__ishDemoDone=true; window.ishTrack&&ishTrack('demo_practice_completed'); } });
/* ---------- autoplay loop: plays like a video until she touches the phone ---------- */
const tap=$('#tap'); let run=0, looping=false, yours=false;
const hint=$('#ctrl-hint'), hintText=$('#ctrl-text');
const sleep=(ms,id)=>new Promise((res,rej)=>setTimeout(()=>id===run?res():rej('stop'),ms));
async function tapOn(el,id,{type}={}){
  const pr=phone.getBoundingClientRect(), r=el.getBoundingClientRect();
  tap.style.left=(r.left-pr.left+r.width/2)+'px'; tap.style.top=(r.top-pr.top+r.height/2)+'px'; tap.classList.add('show');
  await sleep(600,id); tap.classList.remove('press'); void tap.offsetWidth; tap.classList.add('press'); await sleep(180,id);
  if(!type) el.click();
}
async function typeInto(el,text,id){ el.value=''; for(const ch of text){ el.value+=ch; await sleep(42,id); } }
async function loop(){
  const id=++run; looping=true; yours=false; hint.classList.remove('yours'); hintText.textContent='Playing · tap the phone to try it yourself';
  try{
    while(true){
      App.reset(); await sleep(1500,id);
      await tapOn($('[data-area=mind]'),id); await sleep(1100,id);
      await tapOn($('#ph-card .pill'),id); await sleep(1300,id);
      await tapOn($$('#st-chips button')[0],id); await sleep(700,id);
      await tapOn($('#st-next1'),id); await sleep(2200,id);
      await tapOn($('#st-next2'),id); await sleep(900,id);
      await tapOn($('#st-stone'),id); await sleep(2800,id);
      tap.classList.remove('show'); await sleep(600,id);
    }
  }catch(_){}
}
function stopLoop(){ run++; looping=false; tap.classList.remove('show'); }
/* the moment she touches the phone, it becomes hers */
phone.addEventListener('pointerdown',e=>{
  if(!e.isTrusted||!looping) return;
  stopLoop(); yours=true; swallow=true; hint.classList.add('yours'); hintText.textContent='It’s yours now · tap around';
  App.reset();
},true);
let swallow=false;
phone.addEventListener('click',e=>{ if(swallow&&e.isTrusted){ e.stopPropagation(); e.preventDefault(); swallow=false; } },true);
/* start playing when the section scrolls into view, pause when it leaves */
new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting&&!looping&&!yours) loop();
  else if(!e.isIntersecting&&looping) stopLoop();
}),{threshold:.45}).observe(phone);
$('#reset').addEventListener('click',()=>{yours=false;swallow=false;loop()});
})();
