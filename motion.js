/* motion.js — heavy scroll/entrance/parallax/tilt layer. Safe by design: content is force-revealed by timers. */
(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var small=function(){return innerWidth<=860};
var $$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function init(){
  var body=document.body;

  /* ---- ambient orbs + cursor spotlight + hero scan (decor only) ---- */
  var orbs=document.createElement('div');orbs.className='mx-orbs';orbs.setAttribute('aria-hidden','true');
  orbs.innerHTML='<i class="mx-orb o1"></i><i class="mx-orb o2"></i><i class="mx-orb o3"></i>';
  body.prepend(orbs);
  var spot=null;
  if(fine&&!reduce){spot=document.createElement('i');spot.className='mx-spot';spot.setAttribute('aria-hidden','true');body.prepend(spot)}
  var hero=document.querySelector('.hero');
  if(hero&&!reduce){var sc=document.createElement('i');sc.className='mx-scan';sc.setAttribute('aria-hidden','true');hero.appendChild(sc)}
  if(reduce)return;

  /* ---- reveal assignment ---- */
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
      el.style.setProperty('--d',((opt.stagger===false?0:(i%4)*110)+(opt.base||0))+'ms');
      if(opt.tilt)el.setAttribute('data-want-tilt','1');
    });
  }
  assign('.sec>h2,.sec-in>h2,.about-content h2,.brain-copy h2,.dash-head h2,.ct h2,.proof-title,.me h2',['head']);
  assign('.sec>.lead,.sec-in>.lead,.about-intro,.dash-head p,.brain-copy .lead',['up']);
  assign('.dash-card',['left','up','right','zoom'],{tilt:1});
  assign('.why-card',['left','right','left','right'],{tilt:1});
  assign('.bento>article',['zoom','flip','flip','zoom','up'],{tilt:1});
  assign('.proj',['left','right'],{stagger:false});
  assign('.stats li',['zoom','zoom','zoom','zoom'],{tilt:1});
  assign('.chart',['left','right'],{stagger:false,tilt:1});
  assign('.tl li',['left','right','left','right']);
  assign('.mp,.cp,.about-photo',['clip'],{img:1,stagger:false});
  assign('.cc,.brain-layout',['zoom'],{stagger:false});
  assign('.stk,.about-glass',['up'],{stagger:false});

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
  addEventListener('load',function(){sweep();setTimeout(function(){$$('.mx[data-mx]').forEach(show)},5000)});

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


  /* ---- scroll "road" effect: tiles tilt back and converge like a road, then flatten as they reach you ---- */
  var tiles=$$('#agency .rail figure,.proof figure');
  tiles.forEach(function(el){el.classList.remove('rv');el.classList.add('in');el.setAttribute('data-road','1')});
  function roadFrame(vh){
    var phone=innerWidth<=860,W=innerWidth;
    tiles.forEach(function(el){
      var r=el.getBoundingClientRect();
      if(r.bottom<-vh*.6||r.top>vh*1.6){return}
      var cy=r.top+r.height/2,cx=((r.left+r.width/2)-W/2)/(W/2);
      var t=Math.min(1,Math.max(0,(cy-vh*.6)/(vh*.55)));          /* entering from below */
      var u=Math.min(1,Math.max(0,(vh*.16-cy)/(vh*.45)));         /* leaving above */
      if(t<.003&&u<.003){el.style.transform='';el.style.opacity='';return}
      var z=(phone?-220:-420)*t-(phone?60:140)*u,y=(phone?90:150)*t,rx=(phone?30:46)*t-(phone?10:16)*u,sx=phone?0:-cx*90*t;
      el.style.transform='perspective(1100px) translate3d('+sx.toFixed(1)+'px,'+y.toFixed(1)+'px,'+z.toFixed(1)+'px) rotateX('+rx.toFixed(2)+'deg) scale('+(1-.06*t-.04*u).toFixed(3)+')';
      el.style.opacity=(1-.72*t-.45*u).toFixed(3);
    });
  }

  /* ---- scroll loop: parallax, orbs, timeline line, spotlight ---- */
  var pars=$$('.proj .shot img,.about-photo img,.mp img,.cp img');
  pars.forEach(function(im){im.setAttribute('data-par','1')});
  var vis=new Set();
  var pio=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)})},{rootMargin:'20% 0px'});
  pars.forEach(function(p){pio.observe(p)});
  var tl=document.querySelector('.tl'),ticking=false,mx=-999,my=-999,sx=-999,sy=-999;
  function frame(){
    ticking=false;
    var vh=innerHeight,max=Math.max(1,document.documentElement.scrollHeight-vh);
    orbs.style.setProperty('--pg',Math.min(1,scrollY/max).toFixed(4));
    var amp=small()?14:34;
    vis.forEach(function(im){var r=im.parentElement.getBoundingClientRect();var p=((r.top+r.height/2)-vh/2)/vh;im.style.setProperty('--py',(p*-amp).toFixed(1)+'px')});
    roadFrame(vh);
    if(tl){var r=tl.getBoundingClientRect();var p=Math.min(1,Math.max(0,(vh*.75-r.top)/Math.max(1,r.height)));tl.style.setProperty('--tlp',p.toFixed(3))}
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();
  if(spot){
    addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
    (function loop(){sx+=(mx-sx)*.12;sy+=(my-sy)*.12;spot.style.setProperty('--sx',sx.toFixed(1)+'px');spot.style.setProperty('--sy',sy.toFixed(1)+'px');requestAnimationFrame(loop)})();
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
