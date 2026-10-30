/* motion.js v8 — scroll reveals, shuffled looping cards (phone + laptop), mobile menu, light scroll loop. */
(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=matchMedia('(hover:hover) and (pointer:fine)');
var BP=matchMedia('(max-width:860px)');          /* keep in sync with the 860px media queries in motion.css */
var fine=FINE.matches;
var small=function(){return BP.matches};
var root=document.documentElement;
var $$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function onMQ(mq,fn){if(mq.addEventListener)mq.addEventListener('change',fn);else if(mq.addListener)mq.addListener(fn)}
onMQ(FINE,function(){fine=FINE.matches});

/* =====================================================================
   MOBILE MENU — own overlay (tile grid + animated "Let's talk") and a compact animated pill in the header.
   It only takes over when the page's hamburger is really visible, so a screen can never end up with no navigation.
   ===================================================================== */
function initMenu(){
  var bar=document.querySelector('header.bar'),mb=document.getElementById('mb'),nav=document.getElementById('nav');
  if(!bar||!mb||!nav)return;
  var links=$$('a',nav),cta=null,rest=[];
  links.forEach(function(a){if(a.classList.contains('cta'))cta=a;else rest.push(a)});
  var ctaHref=cta?cta.getAttribute('href'):'#contact';

  var pill=document.createElement('a');
  pill.className='mx-hcta';pill.href=ctaHref;
  pill.innerHTML='<i aria-hidden="true"></i><span>Let\u2019s talk</span>';
  bar.insertBefore(pill,mb);

  /* NOTE: built from <div>s on purpose. A <nav> element here was being hidden by the site's own mobile "nav" rules, which is why the menu looked empty. */
  var DESC={'#top':'Start here','#stack':'The layers I work with','#about':'Why work with me','#work':'JARVIS, Time Marketing, Visecore','#agency':'Time Digital concept work','#results':'ROAS, leads and reach','#path':'Roles and experience','#contact':'Email, call or message'};
  var m=document.createElement('div');
  m.className='mxm';m.id='mxMenu';m.hidden=true;
  m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Site menu');
  var scrim=document.createElement('div');scrim.className='mxm-scrim';
  var sheet=document.createElement('div');sheet.className='mxm-sheet';
  var top=document.createElement('div');top.className='mxm-top';
  var brand=document.createElement('span');brand.className='mxm-brand';
  var logo=bar.querySelector('.logo');
  brand.innerHTML=logo?logo.innerHTML:'M. Shoaib';
  var x=document.createElement('button');x.type='button';x.className='mxm-x';x.setAttribute('aria-label','Close menu');
  x.innerHTML='<i></i><i></i>';
  top.appendChild(brand);top.appendChild(x);
  var grid=document.createElement('div');grid.className='mxm-list';grid.setAttribute('role','navigation');grid.setAttribute('aria-label','Primary');
  var rows=[];
  rest.forEach(function(a,i){
    var href=a.getAttribute('href')||'#',t=document.createElement('a');t.href=href;t.className='mxm-row';t.style.setProperty('--i',i);
    var n=document.createElement('b');n.textContent=('0'+(i+1)).slice(-2);
    var tx=document.createElement('span');tx.className='mxm-t';
    var st=document.createElement('strong');st.textContent=a.textContent.trim();tx.appendChild(st);
    if(DESC[href]){var sm=document.createElement('small');sm.textContent=DESC[href];tx.appendChild(sm)}
    var ar=document.createElement('i');ar.className='mxm-ar';ar.setAttribute('aria-hidden','true');ar.textContent='→';
    t.appendChild(n);t.appendChild(tx);t.appendChild(ar);grid.appendChild(t);rows.push([t,href]);
  });
  var c=document.createElement('a');c.className='mxm-cta';c.href=ctaHref;c.style.setProperty('--i',rest.length);
  c.innerHTML='<span>Let’s talk</span><em aria-hidden="true">→</em>';
  var quick=document.createElement('div');quick.className='mxm-quick';quick.style.setProperty('--i',rest.length+1);
  var mail=document.querySelector('a[href^="mailto:"]'),tel=document.querySelector('a[href^="tel:"]');
  if(mail){var q1=document.createElement('a');q1.href=mail.getAttribute('href');q1.textContent='✉  Email';quick.appendChild(q1)}
  if(tel){var q2=document.createElement('a');q2.href=tel.getAttribute('href');q2.textContent='☎  Call';quick.appendChild(q2)}
  var foot=document.createElement('p');foot.className='mxm-foot';foot.style.setProperty('--i',rest.length+2);
  foot.innerHTML='<i aria-hidden="true"></i>Available for AI projects · Lahore, PK';
  sheet.appendChild(top);sheet.appendChild(grid);sheet.appendChild(c);
  if(quick.childNodes.length)sheet.appendChild(quick);
  sheet.appendChild(foot);
  m.appendChild(scrim);m.appendChild(sheet);
  document.body.appendChild(m);
  /* highlight the section the visitor is reading */
  function spy(){
    var vh=innerHeight,cur=null;
    rows.forEach(function(r){
      var id=r[1];if(id.charAt(0)!=='#'||id.length<2)return;
      var t=document.querySelector(id);if(!t)return;
      if(t.getBoundingClientRect().top<=vh*.4)cur=r[0];
    });
    rows.forEach(function(r){r[0].classList.toggle('on',r[0]===cur)});
  }

  var open=false,lastFocus=null,hideT=0,inerted=[];
  function menuOn(){return root.classList.contains('mx-menu-on')}
  function setInert(v){
    if(v){[].forEach.call(document.body.children,function(ch){if(ch!==m&&ch.tagName!=='SCRIPT'&&!ch.inert){ch.inert=true;inerted.push(ch)}})}
    else{inerted.forEach(function(ch){ch.inert=false});inerted=[]}
  }
  function setOpen(v){
    if(v===open)return;open=v;
    clearTimeout(hideT);
    mb.setAttribute('aria-expanded',v?'true':'false');
    mb.classList.toggle('open',v);
    root.classList.toggle('mx-lock',v);
    if(v){
      lastFocus=document.activeElement;
      spy();m.hidden=false;void m.offsetWidth;m.classList.add('open');setInert(true);
      setTimeout(function(){var f=m.querySelector('.mxm-x');if(f)f.focus({preventScroll:true})},120);
    }else{
      m.classList.remove('open');setInert(false);
      hideT=setTimeout(function(){if(!open)m.hidden=true},800);
      if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
    }
  }
  /* the overlay only exists where the page's own hamburger is visible */
  function sync(){
    var on=getComputedStyle(mb).display!=='none';
    root.classList.toggle('mx-menu-on',on);
    if(!on)setOpen(false);
  }
  sync();onMQ(BP,sync);addEventListener('resize',sync);addEventListener('load',sync);

  /* capture phase: our handler wins and the page's old nav toggle cannot fight it */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(menuOn()&&t.closest&&t.closest('#mb')){e.preventDefault();e.stopPropagation();setOpen(!open)}
  },true);
  x.addEventListener('click',function(){setOpen(false)});
  m.addEventListener('click',function(e){if(e.target===m||e.target===scrim||e.target===sheet)setOpen(false);else if(e.target.closest&&e.target.closest('a'))setOpen(false)});
  /* iOS: keep the page from scrolling behind the menu */
  m.addEventListener('touchmove',function(e){if(sheet.scrollHeight<=sheet.clientHeight+1)e.preventDefault()},{passive:false});
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
  var busy=false;
  function fix(){
    if(busy)return;busy=true;
    var w=document.createTreeWalker(pane,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode())){if(n.nodeValue.indexOf('powers the agent below')>-1)n.nodeValue=n.nodeValue.replace('powers the agent below','powers my agents')}
    busy=false;
  }
  fix();
  new MutationObserver(fix).observe(pane,{childList:true,subtree:true});
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

  /* ---- pause decorative loops in sections that are off-screen ---- */
  if('IntersectionObserver' in window){
    var offIO=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('mx-off',!e.isIntersecting)})},{rootMargin:'10% 0px'});
    $$('section').forEach(function(s){offIO.observe(s)});
  }

  /* ---- scroll reveal for headings, leads and photos (once, when they really come into view) ---- */
  var seen=new Set();
  function assign(sel,variants,opt){
    opt=opt||{};
    $$(sel).forEach(function(el,i){
      if(seen.has(el)||(hero&&hero.contains(el)))return;
      seen.add(el);
      el.classList.remove('rv');
      el.classList.add('mx');
      if(opt.img)el.classList.add('mx-img');
      el.setAttribute('data-mx',variants[i%variants.length]);
      el.style.setProperty('--d',((opt.stagger===false?0:(i%4)*110))+'ms');
    });
  }
  assign('.sec>h2,.sec-in>h2,.about-content h2,.brain-copy h2,.dash-head h2,.ct h2,.proof-title,.me h2',['head']);
  assign('.sec>.lead,.sec-in>.lead,.about-intro,.dash-head p,.brain-copy .lead',['up']);
  assign('.mp,.cp,.about-photo',['clip'],{img:1,stagger:false});

  var pending=$$('.mx[data-mx]');
  function finish(el){
    el.classList.remove('mx','mx-img','mx-in');el.removeAttribute('data-mx');el.style.removeProperty('--d');
    el.classList.add('in');                       /* hand state back to the site's own CSS */
  }
  function show(el){
    if(el.classList.contains('mx-in'))return;
    el.classList.add('mx-in','in');
    var d=parseFloat(el.style.getPropertyValue('--d'))||0;
    setTimeout(function(){finish(el)},1500+d);
  }
  function sweep(){                               /* reveal whatever is on screen right now */
    pending=pending.filter(function(el){
      if(el.classList.contains('mx-in'))return false;
      var r=el.getBoundingClientRect();
      if(r.top<innerHeight*.97&&r.bottom>0){show(el);return false}
      return true;
    });
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -7% 0px'});
    pending.forEach(function(el){io.observe(el)});
  }else{pending.forEach(show);pending=[]}
  setTimeout(sweep,400);
  addEventListener('load',sweep);

  /* =====================================================================
     EVERY SCREEN: each card flips / flies in, a different way each time, and replays on every scroll
     (loop + mix + shuffle & pick). Cards hide only while off-screen and only after the first scroll,
     so crawlers, print and screenshots always see full content.
     ===================================================================== */
  var CARD_SEL='.dash-card,.why-card,.bento>article,.proj,.stats li,.chart,.tl li,.cc,.brain-layout,.about-glass,.stk';
  var TILT_SEL='.dash-card,.why-card,.bento>article,.stats li,.chart';
  var MCV=['flipy','flipx','up','left','right','zoom','drop','spin'];
  var bag=[],lastFx='',armed=false;
  function pick(){
    if(!bag.length){
      bag=MCV.slice();
      for(var i=bag.length-1;i>0;i--){var k=Math.floor(Math.random()*(i+1));var t=bag[i];bag[i]=bag[k];bag[k]=t}
      if(bag[bag.length-1]===lastFx){var f=bag.shift();bag.push(f)}   /* never the same twice in a row */
    }
    lastFx=bag.pop();return lastFx;
  }
  /* visibility comes from the card's LAYOUT position (offsetTop), never from its transformed box */
  var mcCards=[],mcDirty=true;
  function mcShow(c){
    var el=c.el;if(!c.hidden)return;c.hidden=false;
    el.classList.add('mc-anim');el.classList.remove('mc-hide');
    clearTimeout(el._mcT);el._mcT=setTimeout(function(){el.classList.remove('mc-anim')},2500);
  }
  function mcHide(c){
    var el=c.el;if(c.hidden)return;c.hidden=true;
    clearTimeout(el._mcT);
    el.setAttribute('data-mc',pick());el.classList.remove('mc-anim');el.classList.add('mc-hide');   /* off-screen: re-arm with a fresh effect */
  }
  function mcMeasure(){
    mcCards.forEach(function(c){var t=0,n=c.el;while(n){t+=n.offsetTop;n=n.offsetParent}c.top=t;c.h=c.el.offsetHeight});
    mcDirty=false;
  }
  function mcStep(vh,sy){
    if(!armed)return;
    mcCards.forEach(function(c){
      var top=c.top-sy,bot=top+c.h;
      var vis=Math.min(bot,vh)-Math.max(top,0);
      var need=Math.max(1,Math.min(c.h*0.08,vh*0.07));
      if(c.hidden){if(vis>=need)mcShow(c)}
      else if(bot<-160||top>vh+160)mcHide(c);                 /* fully off-screen */
    });
  }
  var cardEls=$$(CARD_SEL).filter(function(el){return !el.querySelector(CARD_SEL)});   /* containers of cards stay still; their cards animate */
  cardEls.forEach(function(el){
    el.classList.remove('rv');el.classList.add('in','mc');
    el.setAttribute('data-mc',pick());
    mcCards.push({el:el,top:0,h:0,hidden:false});
    if(el.matches(TILT_SEL))bindTilt(el);
  });
  addEventListener('beforeprint',function(){mcCards.forEach(mcShow)});

  /* ---- tilt on pointer (laptop only). Uses classes + CSS variables, never inline transition/transform ---- */
  function bindTilt(el){
    var raf=0,rect=null,y0=0,outT=0;
    el.addEventListener('pointerenter',function(){rect=null});
    el.addEventListener('pointermove',function(e){
      if(e.pointerType!=='mouse'||!fine||small()||el.classList.contains('mc-hide'))return;
      if(!rect||Math.abs(scrollY-y0)>2){rect=el.getBoundingClientRect();y0=scrollY}
      var x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        clearTimeout(outT);el.classList.remove('tilt-out');
        el.style.setProperty('--ry',(x*8).toFixed(2)+'deg');el.style.setProperty('--rx',(-y*8).toFixed(2)+'deg');
        el.classList.add('is-tilt');
      });
    });
    el.addEventListener('pointerleave',function(){
      cancelAnimationFrame(raf);rect=null;
      el.classList.remove('is-tilt');el.classList.add('tilt-out');
      el.style.removeProperty('--ry');el.style.removeProperty('--rx');
      clearTimeout(outT);outT=setTimeout(function(){el.classList.remove('tilt-out')},700);
    });
  }

  /* ---- scroll "road" effect: only tiles near the viewport are measured ---- */
  var tiles=$$('#agency .rail figure,.proof figure');
  tiles.forEach(function(el){el.classList.remove('rv');el.classList.add('in');el.setAttribute('data-road','1')});
  var vTiles=new Set(),vis=new Set(),tlVis=false;
  var tl=document.querySelector('.tl');
  var pars=$$('.proj .shot img,.about-photo img,.mp img,.cp img');
  pars.forEach(function(im){im.setAttribute('data-par','1')});
  if('IntersectionObserver' in window){
    var tio=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vTiles.add(e.target):vTiles.delete(e.target)});req(true)},{rootMargin:'60% 0px 60% 0px'});
    tiles.forEach(function(t){tio.observe(t)});
    var pio=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)});req(true)},{rootMargin:'20% 0px'});
    pars.forEach(function(p){pio.observe(p)});
    if(tl)new IntersectionObserver(function(es){tlVis=es[0].isIntersecting;req(true)},{rootMargin:'20% 0px'}).observe(tl);
  }
  function roadWrite(list,vh,phone,W){
    list.forEach(function(it){
      var el=it[0],r=it[1];
      var cy=r.top+r.height/2,cx=((r.left+r.width/2)-W/2)/(W/2);
      var t=Math.min(1,Math.max(0,(cy-vh*.6)/(vh*.55)));          /* entering from below */
      var u=Math.min(1,Math.max(0,(vh*.16-cy)/(vh*.45)));         /* leaving above */
      if(t<.003&&u<.003){if(el.style.transform){el.style.transform='';el.style.opacity=''}return}
      var z=(phone?-220:-420)*t-(phone?60:140)*u,y=(phone?90:150)*t,rx=(phone?30:46)*t-(phone?10:16)*u,sx=phone?0:-cx*90*t;
      el.style.transform='perspective(1100px) translate3d('+sx.toFixed(1)+'px,'+y.toFixed(1)+'px,'+z.toFixed(1)+'px) rotateX('+rx.toFixed(2)+'deg) scale('+(1-.06*t-.04*u).toFixed(3)+')';
      el.style.opacity=(1-.72*t-.45*u).toFixed(3);
    });
  }

  /* ---- scroll loop: skipped when nothing changed; all reads first, then all writes ---- */
  var ticking=false,force=true,lastPy=-1,lastPg=-1,idleT=0;
  var mx=-999,my=-999,sx=-999,sy=-999;
  function frame(){
    ticking=false;
    var py=scrollY;
    if(py===lastPy&&!force&&!mcDirty)return;
    var moved=py!==lastPy;lastPy=py;force=false;
    if(moved&&py>2)armed=true;
    var vh=innerHeight,W=innerWidth,phone=small();
    /* reads */
    var max=Math.max(1,root.scrollHeight-vh);
    var pr=[];
    if(!phone)vis.forEach(function(im){var r=im.parentElement.getBoundingClientRect();pr.push([im,Math.round(((r.top+r.height/2)-vh/2)/vh*-34*2)/2])});
    var rr=[];
    vTiles.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-vh*.6||r.top>vh*1.6)return;rr.push([el,r])});
    var tr=(tl&&tlVis)?tl.getBoundingClientRect():null;
    if(mcDirty)mcMeasure();
    /* writes */
    mcStep(vh,py);
    if(!phone){var pg=Math.round(Math.min(1,py/max)*200)/200;if(pg!==lastPg){lastPg=pg;orbs.style.setProperty('--pg',pg)}}
    pr.forEach(function(it){var v=it[1]+'px';if(it[0]._py!==v){it[0]._py=v;it[0].style.setProperty('--py',v)}});
    roadWrite(rr,vh,phone,W);
    if(tr){var p=Math.round(Math.min(1,Math.max(0,(vh*.75-tr.top)/Math.max(1,tr.height)))*500)/500;if(tl._p!==p){tl._p=p;tl.style.setProperty('--tlp',p)}}
  }
  function req(f){if(f)force=true;if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  function onScroll(){
    armed=true;req();
    clearTimeout(idleT);idleT=setTimeout(function(){mcDirty=true;sweep();req(true)},180);   /* once scrolling stops: re-measure + reveal */
  }
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',function(){mcDirty=true;req(true)});
  ['wheel','touchmove','keydown'].forEach(function(ev){addEventListener(ev,function(){armed=true;req()},{passive:true,once:true})});
  if(window.ResizeObserver)new ResizeObserver(function(){mcDirty=true;req(true)}).observe(document.body);
  addEventListener('load',function(){mcDirty=true;req(true)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){mcDirty=true;req(true)});
  frame();

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

/* ---- project pictures: damped (inertial) scroll-linked motion; runs only while a card is on screen ---- */
(function(){
  var cards=[].slice.call(document.querySelectorAll('.proj'));if(!cards.length||!window.IntersectionObserver)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var st=cards.map(function(c){return {c:c,cur:.5,on:false}}),raf=0;
  function target(c){var r=c.getBoundingClientRect(),vh=innerHeight;return Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)))}
  function loop(){
    raf=0;var any=false;
    st.forEach(function(o){
      if(!o.on)return;any=true;
      var t=target(o.c);o.cur+=(t-o.cur)*.075;if(Math.abs(t-o.cur)<.0004)o.cur=t;
      o.c.style.setProperty('--vp',o.cur.toFixed(4));
    });
    if(any)raf=requestAnimationFrame(loop);
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      st.forEach(function(o){if(o.c===e.target){o.on=e.isIntersecting;if(o.on)o.cur=target(o.c);o.c.classList.toggle('vflow-on',o.on)}});
    });
    if(!raf)raf=requestAnimationFrame(loop);
  },{rootMargin:'10% 0px'});
  cards.forEach(function(c){io.observe(c);
    c.addEventListener('pointermove',function(e){
      if(e.pointerType!=='mouse')return;var r=c.getBoundingClientRect();
      c.style.setProperty('--mxp',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
      c.style.setProperty('--myp',((e.clientY-r.top)/r.height*100).toFixed(1)+'%')},{passive:true});
  });
})();
