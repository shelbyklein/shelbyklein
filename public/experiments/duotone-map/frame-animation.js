const canvas=document.querySelector('#map'),ctx=canvas.getContext('2d');
const stage=document.querySelector('#map-stage'),loading=document.querySelector('#loading'),error=document.querySelector('#load-error');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const frames=[];
const fps=4;
let current=0,timer=null,ready=false;
function draw(){
 if(!ready)return;
 const w=canvas.clientWidth,h=canvas.clientHeight,d=Math.min(devicePixelRatio||1,2);
 if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);}
 ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
 const scale=Math.min(w/1536,h/1024),iw=1536*scale,ih=1024*scale;
 ctx.drawImage(frames[current],(w-iw)/2,(h-ih)/2,iw,ih);
 canvas.dataset.frame=String(current);canvas.dataset.ready='true';
}
function playback(){
 clearInterval(timer);timer=null;
 if(!ready)return;
 if(reduced.matches){current=0;draw();return;}
 if(document.hidden)return;
 timer=setInterval(()=>{current=(current+1)%frames.length;draw();},1000/fps);
}
async function init(){
 clearInterval(timer);ready=false;stage.setAttribute('aria-busy','true');error.hidden=true;loading.hidden=false;
 try{
  const loaded=await Promise.all(Array.from({length:6},(_,i)=>new Promise((resolve,reject)=>{
   const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Frame '+(i+1)+' could not load'));
   image.src=new URL('assets/duotone/frame-'+String(i+1).padStart(2,'0')+'.png',import.meta.url).href;
  })));
  frames.splice(0,frames.length,...loaded);current=0;ready=true;loading.hidden=true;draw();playback();
 }catch(e){loading.hidden=true;error.hidden=false;console.error(e);}
 finally{stage.setAttribute('aria-busy','false');}
}
new ResizeObserver(draw).observe(canvas);
reduced.addEventListener('change',playback);
document.addEventListener('visibilitychange',playback);
document.querySelector('#retry').onclick=init;
init();
