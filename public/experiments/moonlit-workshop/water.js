// Masked lake refraction: source art and shoreline remain intact outside the water mask.
(() => {
  const source=document.querySelector('img.landscape');
  const wrapper=document.createElement('div');
  wrapper.className=source.className;wrapper.dataset.depth=source.dataset.depth;
  source.replaceWith(wrapper);source.className='water-source';source.removeAttribute('data-depth');wrapper.append(source);
  const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;wrapper.append(canvas);
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true});if(!gl)return;
  function shader(type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 p; varying vec2 uv; void main(){uv=p;gl_Position=vec4(p.x*2.-1.,1.-p.y*2.,0.,1.);}'));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision mediump float;
    varying vec2 uv; uniform sampler2D art; uniform sampler2D waterMask; uniform float time; uniform float motion;
    void main(){
      float m=texture2D(waterMask,uv).a*motion;
      float depth=smoothstep(.53,.78,uv.y);
      float wave=sin(uv.y*520.+time*1.7)+.45*sin(uv.y*910.-time*2.3+uv.x*8.);
      vec2 shift=vec2(wave*(.00045+.0013*depth),sin(uv.x*100.+time*.8)*.00025)*m;
      vec4 original=texture2D(art,uv), refracted=texture2D(art,uv+shift);
      vec4 color=mix(original,refracted,m);
      float bright=smoothstep(.12,.48,max(color.r,max(color.g,color.b)));
      float shimmer=sin(uv.y*730.-time*2.1+uv.x*15.)*.055*bright*m;
      color.rgb*=1.+shimmer;
      gl_FragColor=color;
    }`));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  function texture(unit,image,name){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.uniform1i(gl.getUniformLocation(program,name),unit);}
  const mask=document.createElement('canvas');mask.width=1536;mask.height=1024;
  const c=mask.getContext('2d');c.filter='blur(3px)';c.fillStyle='white';
  // Conservative hand-traced water pockets avoid the islands and foreground pines.
  const pockets=[[[207,560],[418,557],[420,584],[385,605],[337,602],[308,568],[275,573],[262,603],[223,597]],[[326,611],[421,594],[469,610],[540,611],[550,627],[526,663],[484,652],[454,636],[425,649],[396,628],[365,637]],[[624,602],[828,603],[802,628],[763,650],[712,672],[654,676],[636,653],[609,658],[598,635]],[[662,686],[821,695],[936,699],[964,718],[945,746],[914,747],[899,718],[884,731],[867,755],[833,754],[817,728],[795,735],[775,765],[749,729],[715,717],[696,699]]];
  for(const points of pockets){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
  let ready=false,active=false,timer=0,time=0,draws=0;
  const timeLoc=gl.getUniformLocation(program,'time'),motionLoc=gl.getUniformLocation(program,'motion');
  function draw(){gl.uniform1f(timeLoc,time);gl.uniform1f(motionLoc,active?1:0);gl.drawArrays(gl.TRIANGLES,0,6);draws++;}
  function schedule(){clearInterval(timer);if(!ready)return;draw();if(active)timer=setInterval(()=>{time+=1/24;draw();},1000/24);}
  window.waterRig={setActive(value){if(active===value)return;active=value;schedule();},snapshot(){return{ready,active,time,draws,fps:24};}};
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();clearInterval(timer);ready=false;wrapper.classList.remove('water-ready');});
  source.decode().then(()=>{texture(0,source,'art');texture(1,mask,'waterMask');gl.viewport(0,0,1536,1024);ready=true;wrapper.classList.add('water-ready');schedule();}).catch(()=>{});
})();
