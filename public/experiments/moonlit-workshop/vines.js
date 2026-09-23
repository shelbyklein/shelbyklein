// Small pinned spring lattice, rendered as a textured 2D triangle mesh.
(() => {
  const source = document.querySelector('img.vines');
  const wrapper = document.createElement('div');
  wrapper.className = source.className;
  wrapper.dataset.depth = source.dataset.depth;
  source.replaceWith(wrapper);
  source.className = 'vine-source';
  source.removeAttribute('data-depth');
  wrapper.append(source);
  const canvas = document.createElement('canvas');
  canvas.className = 'vine-mesh';
  wrapper.append(canvas);
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return; // Original PNG remains the fallback.
  const compile = (type, text) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, text); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, 'attribute vec2 point; attribute vec2 uv; varying vec2 tex; void main(){tex=uv;gl_Position=vec4(point.x*2.-1.,1.-point.y*2.,0.,1.);}'));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, 'precision mediump float; varying vec2 tex; uniform sampler2D art; void main(){gl_FragColor=texture2D(art,tex);}'));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const cols=16, rows=12, nodes=[], indices=[];
  for(let y=0;y<=rows;y++) for(let x=0;x<=cols;x++) nodes.push({u:x/cols,v:y/rows,x:0,y:0,vx:0,vy:0,pin:y===0 || (y===rows && (x===0 || x===cols))});
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) {const a=y*(cols+1)+x,b=a+1,c=a+cols+1,d=c+1;indices.push(a,c,b,b,c,d);}
  const data=new Float32Array(nodes.length*4);
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  for(const [name,offset] of [['point',0],['uv',8]]) {const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,16,offset);}
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
  gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
  let timer=0,active=false,ready=false,time=0,px=.5,py=.5,inside=false;
  function draw(){
    nodes.forEach((n,i)=>data.set([n.u+n.x,n.v+n.y,n.u,n.v],i*4));
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
  }
  function step(){
    // Three stable physics substeps per displayed frame (24fps).
    for(let s=0;s<3;s++){
      const dt=1/72;time+=dt;
      nodes.forEach((n,i)=>{
        if(n.pin)return;
        const free=Math.sin(Math.PI*Math.min(n.v*1.4,.95));
        const wind=.004*free*Math.sin(time*1.2+n.u*7+n.v*3);
        const dist=Math.hypot((n.u-px)*1.5,n.v-py);
        const push=inside?Math.exp(-dist*dist/ .045):0;
        let nx=0,ny=0,count=0;
        for(const j of [i-1,i+1,i-cols-1,i+cols+1])if(nodes[j]&&Math.abs(nodes[j].u-n.u)<.1){nx+=nodes[j].x;ny+=nodes[j].y;count++;}
        n.vx+=((wind+push*(n.u-px)*.05-n.x)*100+(nx/count-n.x)*35-n.vx*10)*dt;
        n.vy+=((wind*.35+push*(n.v-py)*.035-n.y)*100+(ny/count-n.y)*35-n.vy*10)*dt;
      });
      nodes.forEach(n=>{if(!n.pin){n.x+=n.vx*dt;n.y+=n.vy*dt;}});
    }
    draw();
  }
  function schedule(){clearInterval(timer);if(active&&ready)timer=setInterval(step,1000/24);else if(ready){nodes.forEach(n=>{n.x=n.y=n.vx=n.vy=0;});draw();}}
  window.vineRig={setActive(value){active=value;schedule();},snapshot(){return {active,ready,maxOffset:Math.max(...nodes.map(n=>Math.hypot(n.x,n.y))),pinnedOffset:Math.max(...nodes.filter(n=>n.pin).map(n=>Math.hypot(n.x,n.y)))};}};
  const hero=document.querySelector('.hero');
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=wrapper.getBoundingClientRect();px=(e.clientX-r.left)/r.width;py=(e.clientY-r.top)/r.height;inside=true;});
  hero.addEventListener('pointerleave',()=>inside=false);
  function resize(){const r=wrapper.getBoundingClientRect();const scale=Math.min(devicePixelRatio,1.5,1920/r.width);canvas.width=Math.round(r.width*scale);canvas.height=Math.round(r.height*scale);gl.viewport(0,0,canvas.width,canvas.height);if(ready)draw();}
  new ResizeObserver(resize).observe(wrapper);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;clearInterval(timer);wrapper.classList.remove('mesh-ready');});
  source.decode().then(()=>{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);ready=true;resize();wrapper.classList.add('mesh-ready');schedule();}).catch(()=>{});
})();
