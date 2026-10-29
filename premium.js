/* Premium 3D layer: scroll-driven Three.js scene, smooth lerp, tilt + magnetic buttons */
(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};

/* ---------- 3D scene ---------- */
function scene3d(){
  if(!window.THREE||reduce)return;
  var cv=document.createElement('canvas');cv.id='gl';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
  var R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:'high-performance'})}catch(e){cv.remove();return}
  var mob=innerWidth<800;
  R.setPixelRatio(Math.min(devicePixelRatio||1,mob?1.5:2));
  var S=new THREE.Scene();S.fog=new THREE.FogExp2(0x030a08,.04);
  var C=new THREE.PerspectiveCamera(45,1,.1,100);C.position.z=9;
  S.add(new THREE.AmbientLight(0x2a6b55,.7));
  var L1=new THREE.PointLight(0xe9c57c,2.6,40);L1.position.set(4,3,6);S.add(L1);
  var L2=new THREE.PointLight(0x5df2b2,2.8,40);L2.position.set(-5,-2,5);S.add(L2);
  var L3=new THREE.PointLight(0x35d6e8,1.6,40);L3.position.set(0,5,-2);S.add(L3);

  var em=new THREE.MeshStandardMaterial({color:0x1fbf8a,metalness:.92,roughness:.22});
  var gold=new THREE.MeshStandardMaterial({color:0xe9c57c,metalness:.95,roughness:.2});
  var wire=new THREE.MeshBasicMaterial({color:0x8affd0,wireframe:true,transparent:true,opacity:.16});

  var rig=new THREE.Group();S.add(rig);
  var knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1,.3,200,28,2,3),em);rig.add(knot);
  var shell=new THREE.Mesh(new THREE.IcosahedronGeometry(2,1),wire);rig.add(shell);
  var r1=new THREE.Mesh(new THREE.TorusGeometry(2.7,.035,16,140),gold);r1.rotation.x=1.2;rig.add(r1);
  var r2=new THREE.Mesh(new THREE.TorusGeometry(3.2,.025,16,140),em);r2.rotation.set(.4,.9,0);rig.add(r2);
  var sats=[];for(var i=0;i<6;i++){var s=new THREE.Mesh(new THREE.SphereGeometry(.12,20,20),i%2?gold:em);s.userData={a:i/6*6.283,r:2.7,t:.35+i*.04};rig.add(s);sats.push(s)}

  var N=mob?500:1100,pos=new Float32Array(N*3);
  for(var k=0;k<N;k++){pos[k*3]=(Math.random()-.5)*30;pos[k*3+1]=(Math.random()-.5)*30;pos[k*3+2]=(Math.random()-.5)*24-4}
  var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xcffff0,size:.045,transparent:true,opacity:.65}));S.add(pts);

  var sz=function(){mob=innerWidth<800;R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()};
  addEventListener('resize',sz);sz();

  var mx=0,my=0,tx=0,ty=0,sy=scrollY,tsy=scrollY,vel=0,clock=new THREE.Clock(),run=true;
  addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
  document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)loop()});

  function loop(){
    if(!run)return;requestAnimationFrame(loop);
    var t=clock.getElapsedTime(),vh=innerHeight,max=Math.max(1,document.documentElement.scrollHeight-vh);
    tsy=scrollY;var prev=sy;sy+=(tsy-sy)*.075;vel+=((sy-prev)-vel)*.12;      // eased scroll + velocity
    mx+=(tx-mx)*.05;my+=(ty-my)*.05;
    var p=clamp(sy/max,0,1);
    // fade in after the hero video
    var vis=clamp((sy-vh*.55)/(vh*.45),0,1);cv.style.opacity=(vis*(mob?.5:.9)).toFixed(3);
    if(vis<=0)return R.clear();
    // path: weave between left/right gutters as the page scrolls
    var amp=mob?0:4.3;
    rig.position.x+=(Math.sin(p*Math.PI*5)*amp-rig.position.x)*.06;
    rig.position.y=Math.sin(t*.6)*.18+Math.cos(p*Math.PI*3)*.8;
    var sc=(mob?.62:1)*(1+Math.sin(p*Math.PI*6)*.08);rig.scale.setScalar(sc);
    rig.rotation.y=t*.28+mx*.9+p*6;rig.rotation.x=my*.6+vel*.02;
    knot.rotation.x=t*.35;shell.rotation.y=-t*.12;
    r1.rotation.z=t*.4+vel*.05;r2.rotation.z=-t*.3;
    sats.forEach(function(s){var d=s.userData,a=d.a+t*d.t;s.position.set(Math.cos(a)*d.r,Math.sin(a*2)*.5,Math.sin(a)*d.r)});
    pts.rotation.y=t*.012+p*1.2;pts.position.y=p*3;
    C.position.x=mx*.7;C.position.y=-my*.5;C.fov=45+clamp(Math.abs(vel)*.35,0,6);C.updateProjectionMatrix();C.lookAt(0,0,0);
    R.render(S,C);
  }
  loop();
}

/* ---------- 3D tilt (glass cards) ---------- */
function tilt(){
  if(!fine||reduce)return;
  document.querySelectorAll('.bento article,.stats li,.agents,.proj .shot').forEach(function(el){
    var raf=0;
    el.addEventListener('pointermove',function(e){
      var b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
      cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){el.style.transform='perspective(900px) rotateY('+(x*9).toFixed(2)+'deg) rotateX('+(-y*9).toFixed(2)+'deg) translateZ(6px)'});
    });
    el.addEventListener('pointerleave',function(){cancelAnimationFrame(raf);el.style.transform=''});
  });
}

/* ---------- magnetic buttons ---------- */
function magnet(){
  if(!fine||reduce)return;
  document.querySelectorAll('.btn,nav .cta').forEach(function(el){
    el.classList.add('mag');
    el.addEventListener('pointermove',function(e){var b=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-b.left-b.width/2)*.22).toFixed(1)+'px,'+((e.clientY-b.top-b.height/2)*.3).toFixed(1)+'px)'});
    el.addEventListener('pointerleave',function(){el.style.transform=''});
  });
}

function init(){scene3d();tilt();magnet()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
