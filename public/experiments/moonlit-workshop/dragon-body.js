// Small pinned spring lattice, rendered as a textured 2D triangle mesh.
(() => {
  const source = document.querySelector('img.dragon-body');
  const wrapper = document.createElement('div');
  wrapper.className = 'dragon-body body-rig';
  source.replaceWith(wrapper);source.className='body-source';wrapper.append(source);
  const canvas = document.createElement('canvas');wrapper.append(canvas);
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
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, `precision mediump float;
    varying vec2 tex; uniform sampler2D art; uniform float blink;
    vec4 lid(vec4 color, vec2 center, vec2 radius) {
      vec2 p=(tex-center)/radius;
      float ellipse=1.-smoothstep(.85,1.05,dot(p,p));
      float cover=1.-smoothstep(-1.+blink*2.2-.12,-1.+blink*2.2+.12,p.y);
      vec4 scales=texture2D(art,vec2(tex.x,tex.y-radius.y*2.1));
      scales.rgb*=.82;
      return mix(color,vec4(scales.rgb,color.a),ellipse*cover*step(.01,blink));
    }
    void main(){vec4 color=texture2D(art,tex);
      color=lid(color,vec2(.796,.299),vec2(.026,.044));
      color=lid(color,vec2(.873,.298),vec2(.013,.032));
      gl_FragColor=color;
    }`));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const cols=28, rows=20, nodes=[], indices=[];
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
  let ready=false, lastTime=0, resting=true, blink=0, maxOffset=0;
  const blinkUniform=gl.getUniformLocation(program,'blink');
  function draw(){
    nodes.forEach((n,i)=>data.set([n.u+n.x,n.v+n.y,n.u,n.v],i*4));
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
  }
  function render(time,rest=false){
    lastTime=time;resting=rest;if(!ready)return;
    const cycle=time%7.5;
    blink=rest?0:cycle>4.5&&cycle<4.84?Math.sin((cycle-4.5)/.34*Math.PI):0;
    gl.uniform1f(blinkUniform,blink);
    nodes.forEach(n=>{
      const chest=Math.exp(-((n.u-.60)**2/.035+(n.v-.43)**2/.025));
      const head=Math.exp(-((n.u-.79)**2/.025+(n.v-.25)**2/.04));
      const tail=Math.exp(-((n.u-.29)**2/.035+(n.v-.72)**2/.08));
      // Paws along y=.57 stay planted; chest expands above that contact line.
      const planted=Math.min(1,Math.abs(n.v-.57)/.10);
      n.x=rest?0:(head*Math.sin(time*1.1)*.004+tail*Math.sin(time*1.4-.8)*.007)*planted;
      n.y=rest?0:(-chest*(.5+.5*Math.sin(time*1.8))*.009+head*Math.sin(time*1.1)*.004)*planted;
    });
    maxOffset=Math.max(...nodes.map(n=>Math.hypot(n.x,n.y)));draw();
  }
  window.dragonBodyRig={render,snapshot(){return {ready,blink,maxOffset,resting};}};
  function resize(){const r=wrapper.getBoundingClientRect();const scale=Math.min(devicePixelRatio,1.5,1920/r.width);canvas.width=Math.round(r.width*scale);canvas.height=Math.round(r.height*scale);gl.viewport(0,0,canvas.width,canvas.height);if(ready)draw();}
  new ResizeObserver(resize).observe(wrapper);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;wrapper.classList.remove('mesh-ready');});
  source.decode().then(()=>{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);ready=true;resize();wrapper.classList.add('mesh-ready');render(lastTime,resting);}).catch(()=>{});
})();
