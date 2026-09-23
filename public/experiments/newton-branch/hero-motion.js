/* Newton motion: alpha-culled mesh, weighted fruit, scroll-velocity wind.
 * The template supplies the image and rig; the existing artwork is the fallback. */
(() => {
  'use strict';
  const hero = document.querySelector('[data-newton-branch]');
  if (!hero) return;
  const image = hero.querySelector('.hero-bough img');
  const holder = hero.querySelector('.hero-bough-art');
  const region = hero.querySelector('.hero-art');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pieces = [...hero.querySelectorAll('.hero-fruits .branch-fruit'), null];
  const frameInterval = 1000 / 144;
  let nextFrameAt = 0, drag = null, handle = null;
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  function endDrag() {
    if (!drag) return;
    const id = drag.id; drag = null;
    handle?.classList.remove('is-dragging');
    if (handle?.hasPointerCapture(id)) handle.releasePointerCapture(id);
  }
  function placeHandle() {
    if (!handle) return;
    const rect = image.getBoundingClientRect(), host = hero.getBoundingClientRect();
    const scale = rect.width/image.naturalWidth, center = warp(1250, 575);
    handle.style.left = `${rect.left-host.left+center[0]*scale}px`;
    handle.style.top = `${rect.top-host.top+center[1]*scale}px`;
    handle.style.width = `${330*scale}px`; handle.style.height = `${290*scale}px`;
    handle.hidden = !allowed();
  }
  function attachDrag() {
    handle = document.createElement('button'); handle.type = 'button';
    handle.className = 'hero-apple-drag';
    handle.setAttribute('aria-label', 'Move the apple: drag or use arrow keys to sway the branch');
    hero.append(handle);
    const point = e => { const r = image.getBoundingClientRect(); return [(e.clientX-r.left)*image.naturalWidth/r.width, (e.clientY-r.top)*image.naturalHeight/r.height]; };
    handle.addEventListener('pointerdown', e => {
      if (!allowed() || drag || !e.isPrimary || e.button !== 0) return;
      const p = point(e), f = fruits[2];
      drag = {id:e.pointerId, start:p, point:p, x:f.x, y:f.y, bend};
      handle.setPointerCapture(e.pointerId); handle.classList.add('is-dragging'); e.preventDefault();
    });
    handle.addEventListener('pointermove', e => {
      if (drag?.id !== e.pointerId) return;
      // Recover if the release happened outside the page or during a reload/focus change.
      if (!(e.buttons & 1)) { endDrag(); return; }
      drag.point = point(e);
    });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) handle.addEventListener(event, endDrag);
    handle.addEventListener('keydown', e => {
      if (!allowed() || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') fruits[2].vx += e.key === 'ArrowLeft' ? -100 : 100;
      else bendVelocity += e.key === 'ArrowUp' ? -.12 : .12;
    });
    window.addEventListener('blur', endDrag);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pageshow', endDrag);
    placeHandle();
  }
  let raf = 0, ready = false, initializing = false, visible = true, disposed = false, last = 0, scrollY = window.scrollY, scrollAt = performance.now();
  let wind = 0, pendingWind = 0, inputAt = 0, time = 0, appleAngle = 0, bend = 0, bendVelocity = 0, accumulator = 0;
  let canvas, gl, drawMesh, resize, fruits = [], points = [], leaves = [];
  const stop = () => { endDrag(); if(handle)handle.hidden=true; cancelAnimationFrame(raf); raf = 0; last = 0; nextFrameAt = 0; accumulator = 0; };
  const allowed = () => ready && visible && !document.hidden && !reduced.matches && region.dataset.userPaused !== 'true' && !disposed;
  function wake() { if (allowed() && !raf) raf = requestAnimationFrame(frame); else if (!allowed()) stop(); }
  function restore() {
    stop(); hero.classList.remove('hero-physics-ready');
    pieces.forEach(p => { if(p)p.style.transform = ''; });
  }
  function warp(x, y, leaf = -1, q = bend) {
    const sourceX = x, sourceY = y;
    if (leaf >= 0) {
      const l = leaves[leaf], dx = x-l.base[0], dy = y-l.base[1];
      const progress = Math.max(0, Math.min(1, (dx*l.vx+dy*l.vy)/l.length2));
      const a = l.angle * progress, c = Math.cos(a), s = Math.sin(a);
      x = l.base[0]+dx*c-dy*s; y = l.base[1]+dx*s+dy*c;
    }
    const u = Math.max(0, Math.min(1, x/image.naturalWidth)), a = q*u, c = Math.cos(a), s = Math.sin(a);
    const branch = [x*c-(y-320)*s, 320+x*s+(y-320)*c];
    // Only the stem blends. Every body vertex shares one rigid attachment pose.
    const weight = Math.max(0, Math.min(1, (sourceY-310)/80)) * Math.max(0, Math.min(1, (sourceX-1000)/40));
    if (!weight) return branch;
    const attachmentAngle = q*1240/image.naturalWidth;
    const pc = Math.cos(attachmentAngle), ps = Math.sin(attachmentAngle);
    const angle = attachmentAngle+appleAngle, ac = Math.cos(angle), as = Math.sin(angle);
    const dx = sourceX-1240, dy = sourceY-305;
    const rigidX = 1240*pc+15*ps+dx*ac-dy*as;
    const rigidY = 320+1240*ps-15*pc+dx*as+dy*ac;
    const blend = weight*weight*(3-2*weight);
    return [branch[0]+(rigidX-branch[0])*blend, branch[1]+(rigidY-branch[1])*blend];
  }

  function simulate(dt) {
    time += dt;
    const breeze = wind + .065*Math.sin(time*.71) + .025*Math.sin(time*1.37);
    let load = 0;
    for (const f of fruits) {
      if(f.mass===0)continue;
      const a = warp(...f.anchor), avx = (a[0]-f.previous[0])/dt, avy = (a[1]-f.previous[1])/dt;
      f.previous = a;
      const dx=f.x-a[0],dy=f.y-a[1],length=Math.max(1,Math.hypot(dx,dy)),nx=dx/length,ny=dy/length;
      const tension=Math.max(0,500*(length-f.length)+18*((f.vx-avx)*nx+(f.vy-avy)*ny));
      f.vx+=(breeze*180/f.mass-tension*nx/f.mass-f.vx*1.2)*dt;
      f.vy+=(650-tension*ny/f.mass-f.vy*1.2)*dt;
      // A slow idle breeze keeps the heavy apple gently swaying around its stem.
      if (f === fruits[2] && !drag) f.vx += 16*Math.sin(time*.71)*dt;
      if (drag && f === fruits[2]) {
        const tx = drag.x+clamp(drag.point[0]-drag.start[0], 220);
        const ty = drag.y+clamp(drag.point[1]-drag.start[1], 140);
        f.vx += clamp((tx-f.x)*100-f.vx*20, 12000)*dt;
        f.vy += clamp((ty-f.y)*100-f.vy*20, 12000)*dt;
      }
      f.x+=f.vx*dt;f.y+=f.vy*dt;
      const u=f.anchor[0]/image.naturalWidth;
      load+=tension*(-nx*(a[1]-320)+ny*a[0])*u/6500000;
    }
    const apple=fruits[2],pivot=warp(...apple.anchor);appleAngle=-Math.atan2(apple.x-pivot[0],apple.y-pivot[1])-bend*apple.anchor[0]/image.naturalWidth;
    const pull = drag ? clamp(drag.bend+(drag.point[1]-drag.start[1])/1100-(drag.point[0]-drag.start[0])/3500, .14) : breeze*.024;
    bendVelocity+=((pull-bend)*(drag ? 65 : 20)-bendVelocity*(drag ? 14 : 7)+load)*dt;
    bend+=bendVelocity*dt;
    leaves.forEach((l,i)=>{const target=breeze*(.045+.024*Math.sin(time*2+i));l.velocity+=((target-l.angle)*35-l.velocity*6)*dt;l.angle+=l.velocity*dt;});
  }
  function frame(now) {
    raf = 0; if (!allowed()) return;
    // Never render more than once per 144 Hz interval; slower screens use their native cadence.
    if (now + 0.000001 < nextFrameAt) { raf = requestAnimationFrame(frame); return; }
    nextFrameAt = now + frameInterval;
    const dt=Math.min(.05,(now-(last||now))/1000);last=now;
    if(now-inputAt>100)pendingWind=0;
    wind+=(pendingWind-wind)*(1-Math.exp(-dt*(pendingWind?10:3)));
    accumulator+=dt;while(accumulator>=1/120){simulate(1/120);accumulator-=1/120;}
    drawMesh(); placeHandle();
    for(const f of fruits){if(!f.element)continue;const a=warp(...f.anchor),angle=-Math.atan2(f.x-a[0],f.y-a[1]);
      const px=f.x+Math.sin(angle)*f.length,py=f.y-Math.cos(angle)*f.length;
      f.element.style.transform=`translate(${(px-f.anchor[0])*f.scale}px,${(py-f.anchor[1])*f.scale}px) ${f.center?'translateX(-50%) ':''}rotate(${angle}rad)`;
    }
    hero.dataset.wind=wind.toFixed(3);hero.dataset.bend=bend.toFixed(4);
    raf=requestAnimationFrame(frame);
  }
  async function initialize() {
    if(ready||initializing||disposed||reduced.matches)return;
    initializing=true;
    try {
      await image.decode();if(disposed||reduced.matches)return;
      const W=image.naturalWidth,H=image.naturalHeight;
      // Reserve transparent drawing space for the apple's rightward swing.
      // Keep source coordinates and CSS scale unchanged so fruit anchors stay attached.
      const renderWidth=W+512;
      canvas=document.createElement('canvas');canvas.className='hero-mesh';canvas.setAttribute('aria-hidden','true');
      gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true});if(!gl)return;
      const shader=(type,code)=>{const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Hero shader compilation failed');return s;};
      const program=gl.createProgram();
      const vs=shader(gl.VERTEX_SHADER,'attribute vec2 p;attribute vec2 uv;uniform vec2 size;varying vec2 t;void main(){t=uv;gl_Position=vec4(p.x/size.x*2.-1.,1.-p.y/size.y*2.,0.,1.);}');
      const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 t;uniform sampler2D art;void main(){gl_FragColor=texture2D(art,t);}');
      gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Hero shader link failed');gl.useProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);// Power-of-two storage enables WebGL 1 mipmaps at every display scale.
      const texCanvas=document.createElement('canvas');texCanvas.width=2**Math.ceil(Math.log2(W));texCanvas.height=2**Math.ceil(Math.log2(H));texCanvas.getContext('2d').drawImage(image,0,0,texCanvas.width,texCanvas.height);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texCanvas);gl.generateMipmap(gl.TEXTURE_2D);
      const anisotropy=gl.getExtension('EXT_texture_filter_anisotropic');if(anisotropy)gl.texParameterf(gl.TEXTURE_2D,anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(4,gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
      const sample=document.createElement('canvas');sample.width=W;sample.height=H;const cx=sample.getContext('2d');cx.drawImage(image,0,0);const rgba=cx.getImageData(0,0,W,H).data;
      const integral=new Uint32Array((W+1)*(H+1)),stride=W+1;for(let y=0;y<H;y++){let sum=0;for(let x=0;x<W;x++){sum+=rgba[(y*W+x)*4+3]>8?1:0;integral[(y+1)*stride+x+1]=integral[y*stride+x+1]+sum;}}
      const anchors=[[W*.38,W*.121],[W*.52,W*.1165],[1240,305]];
      const step=Math.max(12,Math.min(96,Number(hero.dataset.meshStep)||24));
      const axis=(n,extra)=>[...new Set([0,n,...extra.map(Math.round),...Array.from({length:Math.ceil(n/step)},(_,i)=>i*step)])].sort((a,b)=>a-b);
      const xs=axis(W,anchors.map(a=>a[0])),ys=axis(H,anchors.map(a=>a[1])),index=[],map=new Map();
      const vertex=(x,y)=>{const key=y*xs.length+x;if(!map.has(key)){map.set(key,points.length);points.push([xs[x],ys[y]])}return map.get(key);};
      for(let y=0;y<ys.length-1;y++)for(let x=0;x<xs.length-1;x++){const l=xs[x],r=xs[x+1],t=ys[y],b=ys[y+1];if(integral[b*stride+r]-integral[t*stride+r]-integral[b*stride+l]+integral[t*stride+l]){const a=vertex(x,y),b=vertex(x+1,y),c=vertex(x,y+1),d=vertex(x+1,y+1);index.push(a,c,b,b,c,d);}}
      const rig=[[[168,239],[296,95],65],[[348,251],[429,116],45],[[903,179],[815,91],50],[[985,210],[1168,142],60],[[958,241],[1015,361],48],[[1274,300],[1440,204],55],[[1380,323],[1517,368],52],[[70,337],[185,431],53],[[75,250],[127,174],33]];
      leaves=rig.map(([base,tip,width])=>({base,vx:tip[0]-base[0],vy:tip[1]-base[1],length2:(tip[0]-base[0])**2+(tip[1]-base[1])**2,width,angle:0,velocity:0}));
      const bindings=points.map(([x,y])=>leaves.findIndex(l=>{const dx=x-l.base[0],dy=y-l.base[1],t=(dx*l.vx+dy*l.vy)/l.length2,d=Math.abs(dx*l.vy-dy*l.vx)/Math.sqrt(l.length2);return t>0&&t<1.15&&d<l.width;}));
      const buffer=(name,data)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);return b;};
      buffer('uv',new Float32Array(points.flatMap(([x,y])=>[x/W,y/H])));const positions=new Float32Array(points.length*2),pb=buffer('p',positions),ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(index),gl.STATIC_DRAW);gl.uniform2f(gl.getUniformLocation(program,'size'),renderWidth,H);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      drawMesh=()=>{points.forEach(([x,y],i)=>{const p=warp(x,y,bindings[i]);positions[i*2]=p[0];positions[i*2+1]=p[1];});gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferSubData(gl.ARRAY_BUFFER,0,positions);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0);};
      fruits=pieces.map((element,i)=>({element,anchor:anchors[i],mass:[.55,.4,2.4][i],x:anchors[i][0],y:anchors[i][1],vx:0,vy:0,previous:[...anchors[i]],length:1,scale:1,center:i<2}));
      resize=()=>{const scale=image.clientWidth/W,dpr=Math.min(2,devicePixelRatio||1);if(!scale)return;canvas.style.width=`${renderWidth*scale}px`;const cw=Math.round(renderWidth*scale*dpr),ch=Math.round(image.clientHeight*dpr);if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}gl.viewport(0,0,canvas.width,canvas.height);
        fruits.forEach((f,i)=>{if(!f.element){const length=280;f.y+=length-f.length;f.length=length;f.scale=scale;return;}const width=f.element.offsetWidth,styles=getComputedStyle(f.element),length=((parseFloat(styles.getPropertyValue('--stem-length'))||22)+width*.4)/scale;const delta=length-f.length;f.y+=delta;f.length=length;f.scale=scale;});if(ready)drawMesh();};
      holder.append(canvas);resize();for(let i=0;i<240;i++)simulate(1/120);
      // Start at the same upward bend limit as dragging, then release under gravity.
      bend = -.14; bendVelocity = 0;
      fruits.forEach(f => {
        const anchor = warp(...f.anchor);
        f.x += anchor[0]-f.previous[0]; f.y += anchor[1]-f.previous[1];
        f.previous = anchor; f.vx = 0; f.vy = 0;
      });
      const apple = fruits[2], pivot = warp(...apple.anchor);
      appleAngle = -Math.atan2(apple.x-pivot[0], apple.y-pivot[1])-bend*apple.anchor[0]/W;
      ready=true;hero.dataset.triangles=index.length/3;hero.classList.add('hero-physics-ready');drawMesh();
      const ro=new ResizeObserver(resize);ro.observe(image);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;restore();ro.disconnect();});
      attachDrag(); wake();
    } catch(error) { restore(); console.warn('Newton hero uses its still artwork:',error.message); } finally { initializing=false; }
  }
  window.addEventListener('scroll',()=>{const now=performance.now(),dy=window.scrollY-scrollY,dt=Math.max(.016,Math.min(.12,(now-scrollAt)/1000));scrollY=window.scrollY;scrollAt=now;if(!allowed())return;pendingWind=Math.max(-1.8,Math.min(1.8,dy/dt/1400));inputAt=now;wake();},{passive:true});
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;hero.dataset.branchVisible=String(visible);wake();},{threshold:0});io.observe(hero);
  new MutationObserver(wake).observe(region,{attributes:true,attributeFilter:['data-user-paused']});
  document.addEventListener('visibilitychange',wake);
  reduced.addEventListener('change',()=>{if(reduced.matches){restore();}else if(ready){hero.classList.add('hero-physics-ready');wake();}else initialize();});
  window.addEventListener('pagehide',stop);window.addEventListener('pageshow',wake);
  initialize();
})();
