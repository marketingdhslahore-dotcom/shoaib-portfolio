/* motion.js v6 — reveal / mobile cards / mobile menu / lighter scroll loop. Safe by design: content is force-revealed by timers. */
(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var BP=matchMedia('(max-width:860px)');
var small=function(){return BP.matches};
var $$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function onMQ(mq,fn){if(mq.addEventListener)mq.addEventListener('change',fn);else if(mq.addListener)mq.addListener(fn)}

/* =====================================================================
   MOBILE MENU — own overlay (grid of tiles + animated "Let's talk"), plus a compact animated pill in the header
   ===================================================================== */
function initMenu(){
  var bar=document.querySelector('header.bar'),mb=document.getElementById('mb'),nav=document.getElementById('nav');
  if(!bar||!mb||!nav)return;
  var links=$$('a',nav),cta=null,rest=[];
  links.forEach(function(a){if(a.classList.contains('cta'))cta=a;else rest.push(a)});
  var ctaHref=cta?cta.getAttribute('href'):'#contact';

  /* header pill */
  var pill=document.createElement('a');
  pill.className='mx-hcta';pill.href=ctaHref;
  pill.innerHTML='<i aria-hidden="true"></i><span>Let\u2019s talk</span>';
  bar.insertBefore(pill,mb);

  /* overlay */
  var m=document.createElement('div');
  m.className='mx-menu';m.id='mxMenu';m.hidden=true;
  m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Site menu');
  var top=document.createElement('div');top.className='mx-menu-top';
  var brand=document.createElement('span');brand.className='mx-menu-brand';
  var logo=bar.querySelector('.logo');
  brand.innerHTML=logo?logo.innerHTML:'M. Shoaib';
  var x=document.createElement('button');x.type='button';x.className='mx-menu-x';x.setAttribute('aria-label','Close menu');
  x.innerHTML='<i></i><i></i>';
  top.appendChild(brand);top.appendChild(x);
  var grid=document.createElement('nav');grid.className='mx-menu-grid';grid.setAttribute('aria-label','Primary');
  rest.forEach(function(a,i){
    var t=document.createElement('a');t.href=a.getAttribute('href');t.style.setProperty('--i',i);
    var n=document.createElement('b');n.textContent=('0'+(i+1)).slice(-2);
    var s=document.createElement('span');s.textContent=a.textContent;
    t.appendChild(n);t.appendChild(s);grid.appendChild(t);
  });
  var c=document.createElement('a');c.className='mx-menu-cta';c.href=ctaHref;c.style.setProperty('--i',rest.length);
  c.innerHTML='<span>Let\u2019s talk</span><em aria-hidden="true">\u2192</em>';
  grid.appendChild(c);
  m.appendChild(top);m.appendChild(grid);
  document.body.appendChild(m);

  var open=false,lastFocus=null,hideT=0;
  function setOpen(v){
    if(v===open)return;open=v;
    clearTimeout(hideT);
    mb.setAttribute('aria-expanded',v?'true':'false');
    mb.classList.toggle('open',v);
    document.documentElement.classList.toggle('mx-lock',v);
    if(v){
      lastFocus=document.activeElement;
      m.hidden=false;void m.offsetWidth;m.classList.add('open');
      setTimeout(function(){var f=m.querySelector('a');if(f)f.focus({preventScroll:true})},80);
    }else{
      m.classList.remove('open');
      hideT=setTimeout(function(){if(!open)m.hidden=true},420);
      if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
    }
  }
  /* capture phase: our handler wins, the page's old nav toggle never fires on phones */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(small()&&t.closest&&t.closest('#mb')){e.preventDefault();e.stopPropagation();setOpen(!open)}
  },true);
  x.addEventListener('click',function(){setOpen(false)});
  m.addEventListener('click',function(e){if(e.target===m||e.target===grid)setOpen(false);else if(e.target.closest&&e.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',function(e){
    if(!open)return;
    if(e.key==='Escape'){setOpen(false);return}
    if(e.key==='Tab'){
      var f=$$('a,button',m);if(!f.length)return;
      var first=f[0],lastEl=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastEl.focus()}
      else if(!e.shiftKey&&document.activeElement===lastEl){e.preventDefault();first.focus()}
    }
  });
  onMQ(BP,function(){if(!BP.matches)setOpen(false)});
}

/* tap a tile on touch screens to read its caption */
function initTouchCaptions(){
  var figs=$$('#agency .rail figure,.proof figure');
  figs.forEach(function(f){
    f.addEventListener('click',function(){
      if(!(small()||!fine))return;
      var on=f.classList.contains('mx-cap');
      figs.forEach(function(o){o.classList.remove('mx-cap')});
      if(!on)f.classList.add('mx-cap');
    });
  });
}

/* hero video: stop it off-screen, never autoplay for reduced-motion / data-saver */
function initHeroVideo(){
  var hv=document.getElementById('hv');if(!hv)return;
  var sd=navigator.connection&&navigator.connection.saveData;
  if(reduce||sd){hv.removeAttribute('autoplay');try{hv.pause()}catch(e){}return}
  if(!('IntersectionObserver' in window))return;
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){var p=hv.play();if(p&&p.catch)p.catch(function(){})}
      else{try{hv.pause()}catch(err){}}
    });
  },{threshold:0}).observe(hv);
}

/* the stack card mentions an agent that is not on the page */
function initStackText(){
  var pane=document.getElementById('lpane');if(!pane||!window.MutationObserver)return;
  function fix(){
    var w=document.createTreeWalker(pane,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode())){if(n.nodeValue.indexOf('powers the agent below')>-1)n.nodeValue=n.nodeValue.replace('powers the agent below','powers my agents')}
  }
  fix();
  new MutationObserver(fix).observe(pane,{childList:true,subtree:true,characterData:true});
}

function init(){
  var body=document.body;
  initMenu();
  initTouchCaptions();
  initHeroVideo();
  initStackText();

  /* ---- ambient orbs + cursor spotlight + hero scan (decor only) ---- */
  var orbs=document.createElement('div');orbs.className='mx-orbs';orbs.setAttribute('aria-hidden','true');
  orbs.innerHTML='<i class="mx-orb o1"></i><i class="mx-orb o2"></i><i class="mx-orb o3"></i>';
  body.prepend(orbs);
  var spot=null;
  if(fine&&!reduce){spot=document.createElement('i');spot.className='mx-spot';spot.setAttribute('aria-hidden','true');body.prepend(spot)}
  var hero=document.querySelector('.hero');
  if(hero&&!reduce&&!small()){var sc=document.createElement('i');sc.className='mx-scan';sc.setAttribute('aria-hidden','true');hero.appendChild(sc)}
  if(reduce)return;

  /* ---- reveal assignment ---- */
  var seen=new Set();
  var mobile=small();
  function assign(sel,variants,opt){
    opt=opt||{};
    if(mobile&&opt.mc)return;            /* phones: cards use the shuffled looping transitions below */
    $$(sel).forEach(function(el,i){
      if(seen.has(el)||(hero&&hero.contains(el)))return;
      seen.add(el);
      el.classList.remove('rv');
      el.classList.add('mx');
      if(opt.img)el.classList.add('mx-img');
      el.setAttribute('data-mx',variants[i%variants.length]);
      el.style.setProperty('--d',((opt.stagger===false?0:(i%4)*110)+(opt.base||0))+'ms');
      if(opt.tilt)el.setAttribute('data-want-tilt','1');
    });
  }
  assign('.sec>h2,.sec-in>h2,.about-content h2,.brain-copy h2,.dash-head h2,.ct h2,.proof-title,.me h2',['head']);
  assign('.sec>.lead,.sec-in>.lead,.about-intro,.dash-head p,.brain-copy .lead',['up']);
  assign('.dash-card',['left','up','right','zoom'],{tilt:1,mc:1});
  assign('.why-card',['left','right','left','right'],{tilt:1,mc:1});
  assign('.bento>article',['zoom','flip','flip','zoom','up'],{tilt:1,mc:1});
  assign('.proj',['left','right'],{stagger:false,mc:1});
  assign('.stats li',['zoom','zoom','zoom','zoom'],{tilt:1,mc:1});
  assign('.chart',['left','right'],{stagger:false,tilt:1,mc:1});
  assign('.tl li',['left','right','left','right'],{mc:1});
  assign('.mp,.cp,.about-photo',['clip'],{img:1,stagger:false});
  assign('.cc,.brain-layout',['zoom'],{stagger:false,mc:1});
  assign('.stk,.about-glass',['up'],{stagger:false,mc:1});

  var pending=$$('.mx[data-mx]');
  function finish(el){
    el.classList.remove('mx','mx-img','mx-in');el.removeAttribute('data-mx');el.style.removeProperty('--d');
    el.classList.add('in');                       /* hand state back to the site's own CSS */
    if(fine&&!small()&&el.getAttribute('data-want-tilt'))bindTilt(el);
  }
  function show(el){
    if(el.classList.contains('mx-in'))return;
    el.classList.add('mx-in','in');
    var d=parseFloat(el.style.getPropertyValue('--d'))||0;
    setTimeout(function(){finish(el)},1500+d);
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -7% 0px'});
  pending.forEach(function(el){io.observe(el)});
  function sweep(){pending=pending.filter(function(el){if(el.classList.contains('mx-in'))return false;var r=el.getBoundingClientRect();if(r.top<innerHeight*.97&&r.bottom>0){show(el);return false}return true})}
  setTimeout(sweep,400);
  /* safety net: never leave anything hidden */
  setTimeout(function(){$$('.mx[data-mx]').forEach(show)},6000);
  addEventListener('load',function(){sweep();setTimeout(function(){$$('.mx[data-mx]').forEach(show)},3000)});

  /* =====================================================================
     PHONES: every card flips / flies in, a different way each time, and replays on every scroll
     (loop + mix + shuffle & pick). Cards are only hidden while off-screen, so nothing can get stuck.
     ===================================================================== */
  var CARD_SEL='.dash-card,.why-card,.bento>article,.proj,.stats li,.chart,.tl li,.cc,.brain-layout,.about-glass,.stk';
  var MCV=['flipy','flipx','up','left','right','zoom','drop','spin'];
  var bag=[],lastFx='',cards=[],cio=null;
  function pick(){
    if(!bag.length){
      bag=MCV.slice();
      for(var i=bag.length-1;i>0;i--){var k=Math.floor(Math.random()*(i+1));var t=bag[i];bag[i]=bag[k];bag[k]=t}
      if(bag[bag.length-1]===lastFx){var f=bag.shift();bag.push(f)}   /* never the same twice in a row */
    }
    lastFx=bag.pop();return lastFx;
  }
  function onCards(es){
    es.forEach(function(e){
      var el=e.target;
      if(e.isIntersecting&&e.intersectionRatio>=0.12){el.classList.remove('mc-hide')}          /* animates in */
      else if(!e.isIntersecting){el.setAttribute('data-mc',pick());el.classList.add('mc-hide')} /* off-screen: re-arm with a fresh effect */
    });
  }
  function enableCards(){
    if(cio)return;
    cio=new IntersectionObserver(onCards,{threshold:[0,0.12]});
    cards=$$(CARD_SEL);
    cards.forEach(function(el){
      el.classList.remove('rv');el.classList.add('in','mc');
      if(el.classList.contains('mx'))show(el);
      el.setAttribute('data-mc',pick());
      cio.observe(el);
    });
  }
  function disableCards(){
    if(!cio)return;
    cio.disconnect();cio=null;
    cards.forEach(function(el){el.classList.remove('mc','mc-hide');el.removeAttribute('data-mc')});
    cards=[];
  }
  if(mobile)enableCards();
  onMQ(BP,function(){if(BP.matches)enableCards();else disableCards()});

  /* ---- tilt on pointer (desktop only) ---- */
  function bindTilt(el){
    var raf=0;
    el.addEventListener('pointermove',function(e){
      if(e.pointerType!=='mouse')return;
      var b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){el.style.transition='transform .18s ease-out';el.style.transform='perspective(1000px) rotateY('+(x*8).toFixed(2)+'deg) rotateX('+(-y*8).toFixed(2)+'deg) translate3d(0,-6px,0)'});
    });
    el.addEventListener('pointerleave',function(){cancelAnimationFrame(raf);el.style.transition='transform .6s cubic-bezier(.16,1,.3,1)';el.style.transform=''});
  }

  /* ---- scroll "road" effect: only tiles near the viewport are measured ---- */
  var tiles=$$('#agency .rail figure,.proof figure');
  tiles.forEach(function(el){el.classList.remove('rv');el.classList.add('in');el.setAttribute('data-road','1')});
  var vTiles=new Set();
  var tio=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vTiles.add(e.target):vTiles.delete(e.target)});req()},{rootMargin:'60% 0px 60% 0px'});
  tiles.forEach(function(t){tio.observe(t)});
  function roadWrite(list,vh,phone,W){
    list.forEach(function(it){
      var el=it[0],r=it[1];
      var cy=r.top+r.height/2,cx=((r.left+r.width/2)-W/2)/(W/2);
      var t=Math.min(1,Math.max(0,(cy-vh*.6)/(vh*.55)));          /* entering from below */
      var u=Math.min(1,Math.max(0,(vh*.16-cy)/(vh*.45)));         /* leaving above */
      if(t<.003&&u<.003){el.style.transform='';el.style.opacity='';return}
      var z=(phone?-220:-420)*t-(phone?60:140)*u,y=(phone?90:150)*t,rx=(phone?30:46)*t-(phone?10:16)*u,sx=phone?0:-cx*90*t;
      el.style.transform='perspective(1100px) translate3d('+sx.toFixed(1)+'px,'+y.toFixed(1)+'px,'+z.toFixed(1)+'px) rotateX('+rx.toFixed(2)+'deg) scale('+(1-.06*t-.04*u).toFixed(3)+')';
      el.style.opacity=(1-.72*t-.45*u).toFixed(3);
    });
  }

  /* ---- scroll loop: all reads first, then all writes (no layout thrash) ---- */
  var pars=$$('.proj .shot img,.about-photo img,.mp img,.cp img');
  pars.forEach(function(im){im.setAttribute('data-par','1')});
  var vis=new Set();
  var pio=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)})},{rootMargin:'20% 0px'});
  pars.forEach(function(p){pio.observe(p)});
  var tl=document.querySelector('.tl'),ticking=false,mx=-999,my=-999,sx=-999,sy=-999;
  function frame(){
    ticking=false;
    var vh=innerHeight,W=innerWidth,phone=small(),root=document.documentElement;
    /* reads */
    var max=Math.max(1,root.scrollHeight-vh),py=scrollY;
    var pr=[];
    if(!phone)vis.forEach(function(im){var r=im.parentElement.getBoundingClientRect();pr.push([im,((r.top+r.height/2)-vh/2)/vh])});
    var rr=[];
    vTiles.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-vh*.6||r.top>vh*1.6)return;rr.push([el,r])});
    var tr=tl?tl.getBoundingClientRect():null;
    /* writes */
    if(!phone)orbs.style.setProperty('--pg',Math.min(1,py/max).toFixed(4));
    var amp=34;
    pr.forEach(function(it){it[0].style.setProperty('--py',(it[1]*-amp).toFixed(1)+'px')});
    roadWrite(rr,vh,phone,W);
    if(tr){var p=Math.min(1,Math.max(0,(vh*.75-tr.top)/Math.max(1,tr.height)));tl.style.setProperty('--tlp',p.toFixed(3))}
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();
  if(spot){
    var spotRaf=0;
    var spotLoop=function(){
      sx+=(mx-sx)*.12;sy+=(my-sy)*.12;
      spot.style.setProperty('--sx',sx.toFixed(1)+'px');spot.style.setProperty('--sy',sy.toFixed(1)+'px');
      if(Math.abs(mx-sx)>.4||Math.abs(my-sy)>.4)spotRaf=requestAnimationFrame(spotLoop);else spotRaf=0;   /* idle = no work */
    };
    addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(!spotRaf)spotRaf=requestAnimationFrame(spotLoop)},{passive:true});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
