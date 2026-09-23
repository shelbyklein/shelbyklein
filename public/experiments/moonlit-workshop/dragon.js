// Two independently masked wing sprites, each attached to its own shoulder bone.
// Interpolated pose chart at 24fps, retaining the original cycle duration.
(() => {
  const wrapper=document.querySelector('.dragon-wings');
  const source=wrapper.querySelector('img');
  const old=wrapper.querySelector('canvas');
  old.remove();
  const nearWrapper=document.createElement("div");
  nearWrapper.className="dragon-wings near-wing";
  wrapper.after(nearWrapper);
  const W=1536,H=1024,PAD=220;
  const wings=[
    {name:'far',pivot:[1180,550],amplitude:.13,delay:1},
    {name:'near',pivot:[1180,550],amplitude:.23,delay:0}
  ];
  // Boundary follows the transparent gap; any shared root is hidden by the body.
  const boundary=[[1065,0],[1170,240],[1110,405],[1190,590],[1190,H]];
  for(const wing of wings){
    wing.canvas=document.createElement('canvas');
    wing.canvas.dataset.wing=wing.name;
    wing.canvas.width=W+PAD*2;wing.canvas.height=H+PAD*2;
    wing.canvas.style.cssText=`left:${-PAD/W*100}%;top:${-PAD/H*100}%;width:${(W+PAD*2)/W*100}%;height:${(H+PAD*2)/H*100}%;`;
    (wing.name === "near" ? nearWrapper : wrapper).append(wing.canvas);
    wing.ctx=wing.canvas.getContext('2d');
    wing.sprite=document.createElement('canvas');wing.sprite.width=W;wing.sprite.height=H;
  }
  let timer=0,ready=false,active=false,frame=0,pose=0,draws=0;
  let mode="rest", gain=0, nextFlex=288;
  // Deliberate anticipation, quick downstroke, then a slower recovery.
  const poses=[0,.18,.42,.76,1,.92,.5,-.22,-.8,-1,-.84,-.59,-.34,-.16,0,0];
  // Both skins meet at one shoulder-blade anchor, regardless of their flap pose.
  const shoulder=[1180,550];
  function samplePose(index){const t=(index+poses.length)%poses.length,i=Math.floor(t),f=t-i;return poses[i]*(1-f)+poses[(i+1)%poses.length]*f;}
  function draw(rest=false){
    for(const wing of wings){
      const value=rest?0:gain*samplePose(pose-wing.delay);
      const c=wing.ctx,[x,y]=wing.pivot;
      c.clearRect(0,0,wing.canvas.width,wing.canvas.height);
      c.save();c.translate(PAD+shoulder[0],PAD+shoulder[1]);
      c.rotate(value*wing.amplitude);
      // Foreshortening is local to each bone and never crosses into the other wing.
      c.scale(1-Math.abs(value)*.055,1-Math.abs(value)*.085);
      c.drawImage(wing.sprite,-x,-y);c.restore();
      wing.canvas.dataset.pose=String(rest?0:pose);
    }
    window.dragonBodyRig?.render(frame / 24, rest);
    draws++;
  }
  function step(){
    frame++;

    if(mode==='rest' && frame>=nextFlex){mode='idle';gain=.16;pose=0;}
    else if(mode!=='rest'){
      pose+=.25;
      if(pose>=poses.length){pose=0;gain=0;mode='rest';nextFlex=frame+288;}
    }
    draw();
  }
  function flap(){
    if(!active || !ready || mode==='flap')return;
    mode='flap';gain=1.9;pose=0;
  }
  // The scene itself is pointer-transparent; test rendered wing alpha on hero clicks.
  document.querySelector('.hero').addEventListener('click',event=>{
    if(event.target.closest('a,button,input'))return;
    for(const wing of [...wings].reverse()){
      const r=wing.canvas.getBoundingClientRect();
      const x=Math.floor((event.clientX-r.left)/r.width*wing.canvas.width);
      const y=Math.floor((event.clientY-r.top)/r.height*wing.canvas.height);
      if(x>=0&&y>=0&&x<wing.canvas.width&&y<wing.canvas.height && wing.ctx.getImageData(x,y,1,1).data[3]>120){flap();break;}
    }
  });
  const flapButton=document.createElement('button');
  flapButton.type='button';flapButton.textContent='Flap wings';flapButton.addEventListener('click',flap);
  document.querySelector('.test-panel').append(flapButton);
  function schedule(){flapButton.disabled=!active;clearInterval(timer);if(!ready)return;if(active)timer=setInterval(step,1000/24);else{frame=pose=0;mode="rest";gain=0;nextFlex=288;draw(true);}}
  window.dragonRig={setActive(value){if(value===active)return;active=value;schedule();},snapshot(){return {active,ready,mode,gain,pose,draws,parts:wings.length,timelineFps:24,poseFps:24};}};
  source.decode().then(()=>{
    for(const wing of wings){
      const c=wing.sprite.getContext('2d');c.save();c.beginPath();
      c.moveTo(...boundary[0]);for(const point of boundary.slice(1))c.lineTo(...point);
      const side=wing.name==='near'?0:W;c.lineTo(side,H);c.lineTo(side,0);c.closePath();c.clip();
      c.drawImage(source,0,0,W,H);c.restore();
    }
    ready=true;wrapper.classList.add('ready');nearWrapper.classList.add('ready');draw(true);schedule();
  }).catch(()=>{});
})();
