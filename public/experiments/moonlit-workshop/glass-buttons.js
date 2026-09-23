// Bounded buoyancy simulation, sampled at the hero's 24fps cadence.
(() => {
  let active=false,timer=0,frames=0;
  const buttons=[...document.querySelectorAll('.actions a')].map((link,index)=>{
    const label=document.createElement('span');label.className='glass-label';
    while(link.firstChild)label.append(link.firstChild);
    const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.className='glass-bubbles';
    link.append(canvas,label);
    const state={link,canvas,ctx:canvas.getContext('2d'),width:1,height:1,hover:false,pointer:{x:0,y:0},particles:[],index};
    function reset(p,initial=false){p.x=8+Math.random()*Math.max(1,state.width-16);p.y=initial?Math.random()*state.height:state.height+5;p.r=1.1+Math.random()*2.7;p.vx=(Math.random()-.5)*4;p.vy=-5-Math.random()*8;p.phase=Math.random()*Math.PI*2;}
    state.reset=reset;
    new ResizeObserver(()=>{const r=link.getBoundingClientRect();state.width=r.width;state.height=r.height;const dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);state.ctx.setTransform(dpr,0,0,dpr,0,0);state.particles=Array.from({length:14},()=>{const p={};reset(p,true);return p;});draw(state);}).observe(link);
    link.addEventListener('pointermove',e=>{const r=link.getBoundingClientRect();state.pointer={x:e.clientX-r.left,y:e.clientY-r.top};state.hover=e.pointerType!=='touch';});
    link.addEventListener('pointerleave',()=>state.hover=false);
    return state;
  });
  function draw(s){const c=s.ctx;c.clearRect(0,0,s.width,s.height);for(const p of s.particles){
    const fade=Math.min(1,Math.max(0,p.y/9));
    c.beginPath();c.arc(p.x,p.y,p.r,0,Math.PI*2);
    c.fillStyle=`rgba(${s.index?'186,225,255':'207,255,155'},${.09*fade})`;c.fill();
    c.strokeStyle=`rgba(235,255,238,${.38*fade})`;c.lineWidth=.7;c.stroke();
    c.beginPath();c.arc(p.x-p.r*.22,p.y-p.r*.22,p.r*.57,3.4,4.8);c.strokeStyle=`rgba(255,255,255,${.6*fade})`;c.stroke();
  }}
  function tick(){frames++;for(const s of buttons){for(const p of s.particles){
    const dt=1/24;p.phase+=dt;
    let force=Math.sin(p.phase*2)*3;
    if(s.hover){const dx=p.x-s.pointer.x,dy=p.y-s.pointer.y;force+=Math.exp(-(dx*dx+dy*dy)/900)*dx*.6;}
    p.vx+=(force-p.vx*.9)*dt;p.vy+=(-4-p.vy*.3)*dt;
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    if(p.x<p.r+2){p.x=p.r+2;p.vx=Math.abs(p.vx)*.5;}if(p.x>s.width-p.r-2){p.x=s.width-p.r-2;p.vx=-Math.abs(p.vx)*.5;}
    if(p.y < -p.r)s.reset(p);
  }draw(s);}}
  window.glassButtons={setActive(value){if(value===active)return;active=value;clearInterval(timer);if(active)timer=setInterval(tick,1000/24);},snapshot(){return{active,frames,buttons:buttons.length,particles:buttons.map(s=>s.particles.length)};}};
})();
