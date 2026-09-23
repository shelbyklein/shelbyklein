// Click-triggered sky particles, in landscape coordinates so parallax stays registered.
(() => {
  const hero=document.querySelector('.hero'),landscape=document.querySelector('.landscape');
  const canvas=document.createElement('canvas');canvas.className='shooting-stars';canvas.width=1536;canvas.height=1024;canvas.setAttribute('aria-hidden','true');landscape.append(canvas);
  const c=canvas.getContext('2d');let active=false,timer=0,stars=[],bursts=0;
  function coordinates(x,y){const r=landscape.getBoundingClientRect(),s=Math.max(r.width/1536,r.height/1024);return{x:(x-r.left-(r.width-1536*s)/2)/s,y:(y-r.top-(r.height-1024*s)/2)/s};}
  function draw(){
    c.clearRect(0,0,1536,1024);c.save();c.beginPath();c.rect(0,0,1536,365);c.clip();
    for(const s of stars){if(s.age<0)continue;const fade=Math.sin(Math.PI*Math.min(1,s.age/s.life));const x=s.x+s.vx*s.age,y=s.y+s.vy*s.age;const length=55+35*s.size;
      const tx=x-length,ty=y-length*s.vy/s.vx;
      const trail=c.createLinearGradient(tx,ty,x,y);trail.addColorStop(0,'rgba(154,204,255,0)');trail.addColorStop(.7,`rgba(180,220,255,${fade*.35})`);trail.addColorStop(1,`rgba(245,255,234,${fade})`);
      c.strokeStyle=trail;c.lineWidth=s.size;c.beginPath();c.moveTo(tx,ty);c.lineTo(x,y);c.stroke();
      c.shadowColor='#cceaff';c.shadowBlur=10;c.fillStyle=`rgba(248,255,237,${fade})`;c.beginPath();c.arc(x,y,s.size*1.1,0,Math.PI*2);c.fill();c.shadowBlur=0;
    }c.restore();
  }
  function tick(){stars.forEach(s=>s.age+=1/24);stars=stars.filter(s=>s.age<s.life);draw();if(!stars.length){clearInterval(timer);timer=0;}}
  function launch(x,y){if(!active)return;bursts++;for(let i=0;i<3;i++)stars.push({x:x-35-i*18,y:Math.max(30,y-30-i*17),vx:145+i*22,vy:33+i*4,age:-i*.17,life:1.1+i*.15,size:1.1+(2-i)*.35});stars=stars.slice(-18);if(!timer)timer=setInterval(tick,1000/24);}
  hero.addEventListener('click',e=>{
    if(e.target.closest('a,button,input'))return;
    const p=coordinates(e.clientX,e.clientY);
    if(p.y>100&&p.y<350&&p.x>0&&p.x<1536&&depthUnderPointer(e.clientX,e.clientY)===6)launch(p.x,p.y);
  });
  const button=document.createElement('button');button.type='button';button.textContent='Shooting stars';button.disabled=true;button.addEventListener('click',()=>launch(530,245));document.querySelector('.test-panel').append(button);
  window.skyStars={setActive(value){active=value;button.disabled=!value;if(!value){clearInterval(timer);timer=0;stars=[];draw();}},snapshot(){return{active,particles:stars.length,bursts,running:!!timer};}};
})();
