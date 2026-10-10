import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = THREE.MathUtils.lerp;
let seed = 7;
const rand = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const range = (a, b) => a + rand() * (b - a);
const std = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, flatShading: true, ...opts });

// ---------------------------------------------------------------------------
// Renderer, scene, camera
// ---------------------------------------------------------------------------
const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  document.getElementById('loader').innerHTML = '<div>This trail needs WebGL.<small>Try a recent browser</small></div>';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xd7ebee, 70, 300);
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.5, 1200);

// ---------------------------------------------------------------------------
// Terrain
// ---------------------------------------------------------------------------
const LAKE = { x: 0, z: -62, r: 36 };
function heightAt(x, z) {
  const r = Math.hypot(x, z + 10);
  let h = Math.sin(x * 0.045) * Math.cos(z * 0.05) * 1.2 + Math.sin(x * 0.11 + z * 0.07) * 0.45 + Math.cos(z * 0.09 - x * 0.03) * 0.5;
  let ring = smoothstep(85, 175, r);
  const dirZ = (z + 10) / (r + 1e-3);
  ring *= 1 - 0.8 * smoothstep(0.45, 0.95, dirZ); // open valley toward the entrance road
  h += ring * ring * 46 * (0.7 + 0.3 * Math.sin(Math.atan2(z, x) * 5 + r * 0.03));
  const d = Math.hypot(x - LAKE.x, z - LAKE.z);
  h += 2.4 * smoothstep(LAKE.r + 8, LAKE.r + 30, d); // keep stray dips above the water plane
  h = lerp(-5, h, smoothstep(LAKE.r - 7, LAKE.r + 5, d));
  return h;
}

{
  const SIZE = 560, SEG = 170;
  const g = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, heightAt(p.getX(i), p.getZ(i)));
  const geo = g.toNonIndexed();
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  const grassA = new THREE.Color(0x6e9a42), grassB = new THREE.Color(0x8aae4f), forest = new THREE.Color(0x40613a);
  const rock = new THREE.Color(0x868b82), sand = new THREE.Color(0xd8c58f), wetSand = new THREE.Color(0x8f8a5c);
  for (let i = 0; i < pos.count; i += 3) {
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const ld = Math.hypot(cx - LAKE.x, cz - LAKE.z);
    if (cy < -0.9) c.copy(wetSand);
    else if (ld < LAKE.r + 4 && cy < 0.9) c.copy(sand);
    else if (cy > 26) c.copy(rock);
    else if (cy > 10) c.copy(forest).lerp(rock, smoothstep(14, 26, cy));
    else c.copy(grassA).lerp(grassB, rand());
    c.offsetHSL(0, 0, (rand() - 0.5) * 0.035);
    for (let k = 0; k < 3; k++) colors.set([c.r, c.g, c.b], (i + k) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
  terrain.receiveShadow = true;
  scene.add(terrain);
}

// ---------------------------------------------------------------------------
// Water
// ---------------------------------------------------------------------------
const waterGeo = new THREE.PlaneGeometry(120, 120, 60, 60);
waterGeo.rotateX(-Math.PI / 2);
const waterBase = Float32Array.from(waterGeo.attributes.position.array);
const waterMat = new THREE.MeshStandardMaterial({ color: 0x2f8193, roughness: 0.22, metalness: 0.0, flatShading: true, transparent: true, opacity: 0.93 });
const water = new THREE.Mesh(waterGeo, waterMat);
water.position.set(LAKE.x, -0.35, LAKE.z);
water.receiveShadow = true;
scene.add(water);

// ---------------------------------------------------------------------------
// Trail
// ---------------------------------------------------------------------------
const trail = new THREE.CatmullRomCurve3([
  [0, 170], [0, 120], [0, 72], [-3, 58], [-11, 47], [-7, 35], [6, 28], [17, 26], [23, 16], [31, 5], [38, -3],
  [30, -14], [14, -19], [2, -21], [-14, -21], [-26, -18], [-33, -17],
].map(([x, z]) => new THREE.Vector3(x, 0, z)));
const trailPts = trail.getSpacedPoints(300);
{
  const N = 500, W = 1.5;
  const verts = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const p = trail.getPointAt(i / N), t = trail.getTangentAt(i / N);
    const nx = -t.z, nz = t.x, l = Math.hypot(nx, nz);
    for (const s of [1, -1]) {
      const x = p.x + (nx / l) * W * s, z = p.z + (nz / l) * W * s;
      verts.push(x, heightAt(x, z) + 0.1, z);
    }
    if (i < N) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0xb79a68, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.receiveShadow = true;
  scene.add(m);
}

// ---------------------------------------------------------------------------
// Shared materials & props
// ---------------------------------------------------------------------------
const M = {
  log: std(0x7a4f2e), logDark: std(0x5a3a22), roofGreen: std(0x3c5a36), roofRed: std(0x8f3b2b),
  stone: std(0x8b8a83), plank: std(0xa77a4b), white: std(0xf1ece0), rope: std(0xd8cfb4),
  window: new THREE.MeshStandardMaterial({ color: 0x2a2116, emissive: 0xffc36b, emissiveIntensity: 0.1, flatShading: true }),
};
const glowTex = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const ctx = cv.getContext('2d');
  const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,220,150,1)'); gr.addColorStop(0.35, 'rgba(255,170,80,.45)'); gr.addColorStop(1, 'rgba(255,140,60,0)');
  ctx.fillStyle = gr; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
})();
const glowMat = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, fog: false });
function addGlow(parent, x, y, z, s) { const sp = new THREE.Sprite(glowMat); sp.position.set(x, y, z); sp.scale.setScalar(s); parent.add(sp); }

function mesh(geo, mat, x = 0, y = 0, z = 0, parent) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}
function gableRoof(width, height, length, mat) {
  const s = new THREE.Shape();
  s.moveTo(-width / 2, 0); s.lineTo(width / 2, 0); s.lineTo(0, height); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: length, bevelEnabled: false });
  g.translate(0, 0, -length / 2); g.rotateY(Math.PI / 2);
  return new THREE.Mesh(g, mat);
}
function textTexture(text, { w = 1024, h = 256, bg = '#6b4425', fg = '#f6efe0', font = '700 120px Fraunces, Georgia, serif', border = '#4a2e18' } = {}) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 3;
  for (let y = 22; y < h; y += 34) { ctx.beginPath(); ctx.moveTo(0, y + Math.sin(y) * 3); ctx.lineTo(w, y - Math.cos(y) * 3); ctx.stroke(); }
  ctx.strokeStyle = border; ctx.lineWidth = 16; ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.fillStyle = fg; ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + 6);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const signs = [];
function signpost(text, x, z, lookX, lookZ) {
  const g = new THREE.Group();
  const y = heightAt(x, z);
  g.position.set(x, y, z);
  mesh(new THREE.CylinderGeometry(0.14, 0.18, 3.2, 6), M.logDark, 0, 1.6, 0, g);
  const board = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 0.14), M.plank);
  board.position.set(0, 2.7, 0.12); board.castShadow = true; g.add(board);
  signs.push({ board, text });
  g.rotation.y = Math.atan2(lookX - x, lookZ - z);
  scene.add(g);
}
function placeSigns() {
  for (const s of signs) {
    const t = textTexture(s.text, { font: '700 118px Fraunces, Georgia, serif' });
    const tb = t.clone(); tb.wrapS = THREE.RepeatWrapping; tb.repeat.x = -1; tb.offset.x = 1;
    s.board.material = [M.plank, M.plank, M.plank, M.plank, new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }), new THREE.MeshStandardMaterial({ map: tb, roughness: 0.9 })];
  }
}

// ---------------------------------------------------------------------------
// Entrance gate
// ---------------------------------------------------------------------------
let gateBoard;
{
  const g = new THREE.Group();
  g.position.set(0, heightAt(0, 72), 72);
  for (const sx of [-6, 6]) {
    mesh(new THREE.CylinderGeometry(0.55, 0.7, 9, 8), M.log, sx, 4.5, 0, g);
    mesh(new THREE.DodecahedronGeometry(1.1), M.stone, sx, 0.3, 0, g);
  }
  const beam = mesh(new THREE.CylinderGeometry(0.45, 0.45, 15, 8), M.log, 0, 8.4, 0, g);
  beam.rotation.z = Math.PI / 2;
  for (const sx of [-2.6, 2.6]) mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 4), M.rope, sx, 7.6, 0, g);
  gateBoard = mesh(new THREE.BoxGeometry(9.5, 2, 0.3), M.plank, 0, 6.2, 0, g);
  scene.add(g);
}

// ---------------------------------------------------------------------------
// Cabin row
// ---------------------------------------------------------------------------
const CABINS = { x: -25, z: 42 };
function cabin(roofMat) {
  const g = new THREE.Group();
  mesh(new THREE.BoxGeometry(6.4, 2.6, 4.9), M.stone, 0, -0.7, 0, g);
  mesh(new THREE.BoxGeometry(6, 3, 4.5), M.log, 0, 2.1, 0, g);
  for (let y = 0.9; y < 3.6; y += 0.5) mesh(new THREE.BoxGeometry(6.15, 0.08, 4.65), M.logDark, 0, y, 0, g);
  const roof = gableRoof(5.8, 2.1, 7, roofMat); roof.position.y = 3.6; roof.castShadow = true; g.add(roof);
  mesh(new THREE.BoxGeometry(1.1, 2, 0.12), M.logDark, -1.2, 1.6, 2.28, g);
  mesh(new THREE.BoxGeometry(1.1, 0.8, 0.12), M.window, 1.4, 2.2, 2.28, g);
  mesh(new THREE.BoxGeometry(0.12, 0.8, 1), M.window, 3.02, 2.2, 0, g);
  mesh(new THREE.BoxGeometry(6, 0.25, 1.8), M.plank, 0, 0.55, 3.1, g);
  mesh(new THREE.BoxGeometry(1.6, 0.3, 0.6), M.plank, -1.2, 0.2, 4.2, g);
  addGlow(g, 1.4, 2.2, 2.6, 2.2);
  return g;
}
[70, 112, 152, 192, 232, 272].forEach((a, i) => {
  const r = 14, x = CABINS.x + Math.cos(a * Math.PI / 180) * r, z = CABINS.z + Math.sin(a * Math.PI / 180) * r;
  const c = cabin(i % 2 ? M.roofRed : M.roofGreen);
  c.position.set(x, heightAt(x, z) + 0.15, z);
  c.rotation.y = Math.atan2(CABINS.x - x, CABINS.z - z);
  scene.add(c);
});
{ // tetherball on the cabin green
  const x = CABINS.x - 2, z = CABINS.z;
  const g = new THREE.Group(); g.position.set(x, heightAt(x, z), z);
  mesh(new THREE.CylinderGeometry(0.08, 0.08, 4, 6), M.white, 0, 2, 0, g);
  mesh(new THREE.IcosahedronGeometry(0.35, 1), std(0xe8b23a), 0.9, 2.2, 0, g);
  scene.add(g);
}
signpost('CABIN ROW', -9, 51, 0, 70);

// ---------------------------------------------------------------------------
// Dining lodge + flag
// ---------------------------------------------------------------------------
const LODGE = { x: 33, z: 31 };
let flag;
{
  const g = new THREE.Group();
  g.position.set(LODGE.x, heightAt(LODGE.x, LODGE.z) + 0.2, LODGE.z);
  mesh(new THREE.BoxGeometry(15, 3, 10), M.stone, 0, -0.9, 0, g);
  mesh(new THREE.BoxGeometry(14, 5, 9), M.log, 0, 3, 0, g);
  for (let y = 1; y < 5.5; y += 0.55) mesh(new THREE.BoxGeometry(14.15, 0.09, 9.15), M.logDark, 0, y, 0, g);
  const roof = gableRoof(11, 4, 15.4, M.roofGreen); roof.position.y = 5.5; roof.castShadow = true; g.add(roof);
  mesh(new THREE.BoxGeometry(1.6, 9, 1.6), M.stone, 5.6, 5, -3, g);
  mesh(new THREE.BoxGeometry(2.2, 3, 0.15), M.logDark, 0, 1.9, 4.55, g);
  for (const sx of [-4.6, -2.4, 2.4, 4.6]) { mesh(new THREE.BoxGeometry(1.3, 1.4, 0.15), M.window, sx, 2.9, 4.55, g); addGlow(g, sx, 2.9, 5, 3); }
  for (const sz of [-2.5, 0, 2.5]) mesh(new THREE.BoxGeometry(0.15, 1.4, 1.3), M.window, -7.05, 2.9, sz, g);
  mesh(new THREE.BoxGeometry(14, 0.3, 3), M.plank, 0, 0.6, 6, g);
  for (const sx of [-6.6, -2.2, 2.2, 6.6]) mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.2, 6), M.logDark, sx, 2.6, 7.3, g);
  const porchRoof = mesh(new THREE.BoxGeometry(14.6, 0.25, 3.4), M.roofGreen, 0, 4.75, 6.1, g);
  porchRoof.rotation.x = 0.12;
  // signboard over the door
  const lodgeSign = mesh(new THREE.BoxGeometry(5, 1.1, 0.12), M.plank, 0, 5.45, 7.85, g);
  lodgeSign.rotation.x = 0.12;
  signs.push({ board: lodgeSign, text: 'THE LODGE' });
  // picnic tables
  for (const [tx, tz] of [[-4, 11], [3, 12], [8, 10]]) {
    const t = new THREE.Group(); t.position.set(tx, 0, tz); t.rotation.y = rand() * 0.5;
    mesh(new THREE.BoxGeometry(3.2, 0.15, 1.1), M.plank, 0, 1.1, 0, t);
    for (const bz of [-1, 1]) mesh(new THREE.BoxGeometry(3.2, 0.12, 0.4), M.plank, 0, 0.65, bz, t);
    for (const lx of [-1.2, 1.2]) mesh(new THREE.BoxGeometry(0.15, 1.1, 2.2), M.logDark, lx, 0.5, 0, t);
    g.add(t);
  }
  g.rotation.y = Math.atan2(17 - LODGE.x, 22 - LODGE.z);
  scene.add(g);

  // flag pole
  const fx = 16, fz = 36, fy = heightAt(fx, fz);
  mesh(new THREE.CylinderGeometry(0.1, 0.14, 13, 6), M.white, fx, fy + 6.5, fz, scene);
  mesh(new THREE.SphereGeometry(0.25, 8, 6), std(0xd9b04a, { metalness: 0.6, roughness: 0.4 }), fx, fy + 13.1, fz, scene);
  const fg = new THREE.PlaneGeometry(3.6, 2.2, 14, 6); fg.translate(1.8, 0, 0);
  const ft = (() => {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const ctx = cv.getContext('2d');
    ctx.fillStyle = '#2f4a2c'; ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = '#f6efe0'; ctx.beginPath(); ctx.moveTo(128, 22); ctx.lineTo(88, 82); ctx.lineTo(108, 82); ctx.lineTo(78, 124); ctx.lineTo(178, 124); ctx.lineTo(148, 82); ctx.lineTo(168, 82); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d9682f'; ctx.fillRect(0, 140, 256, 20);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  flag = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map: ft, side: THREE.DoubleSide, roughness: 0.9 }));
  flag.position.set(fx + 0.1, fy + 11.6, fz);
  flag.castShadow = true;
  flag.userData.base = Float32Array.from(fg.attributes.position.array);
  scene.add(flag);
}

// ---------------------------------------------------------------------------
// Climbing tower, zipline, archery
// ---------------------------------------------------------------------------
const TOWER = { x: 48, z: -9 };
{
  const g = new THREE.Group();
  const by = heightAt(TOWER.x, TOWER.z);
  g.position.set(TOWER.x, by, TOWER.z);
  const H = 15;
  for (const [px, pz] of [[-2.6, -2.6], [2.6, -2.6], [-2.6, 2.6], [2.6, 2.6]]) mesh(new THREE.CylinderGeometry(0.32, 0.36, H + 1.5, 7), M.log, px, (H + 1.5) / 2 - 0.5, pz, g);
  for (const py of [5, 10]) mesh(new THREE.BoxGeometry(5.6, 0.25, 5.6), M.plank, 0, py, 0, g);
  mesh(new THREE.BoxGeometry(6.2, 0.4, 6.2), M.plank, 0, H, 0, g);
  const rr = mesh(new THREE.ConeGeometry(4.8, 2.6, 4), M.roofRed, 0, H + 3.6, 0, g); rr.rotation.y = Math.PI / 4;
  for (const [px, pz] of [[-2.6, -2.6], [2.6, -2.6], [-2.6, 2.6], [2.6, 2.6]]) mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 5), M.logDark, px, H + 1.2, pz, g);
  // railings
  for (const s of [-1, 1]) { mesh(new THREE.BoxGeometry(6, 0.12, 0.12), M.logDark, 0, H + 1.1, 3 * s, g); mesh(new THREE.BoxGeometry(0.12, 0.12, 6), M.logDark, 3 * s, H + 1.1, 0, g); }
  // X braces on the back
  for (const [a, y] of [[0.9, 2.5], [-0.9, 7.5], [0.9, 12.5]]) { const b = mesh(new THREE.BoxGeometry(0.2, 6.8, 0.2), M.logDark, 0, y, -2.6, g); b.rotation.z = a; }
  // climbing wall with holds
  mesh(new THREE.BoxGeometry(5.4, H - 0.4, 0.35), std(0xc9b28a), 0, (H - 0.4) / 2, 2.9, g);
  const holdGeo = new THREE.IcosahedronGeometry(0.22, 0);
  const holdCols = [0xe24b3b, 0xf2c230, 0x3a8fd6, 0x4fb35b, 0xb05bd6, 0xf08a2b];
  for (let i = 0; i < 70; i++) mesh(holdGeo, std(holdCols[i % holdCols.length]), range(-2.4, 2.4), range(0.6, H - 1), 3.12, g);
  // belay ropes
  for (const rx of [-1.5, 0, 1.5]) mesh(new THREE.CylinderGeometry(0.035, 0.035, H, 4), std(holdCols[(rx + 1.5) / 1.5 | 0]), rx, H / 2, 3.35, g);
  g.rotation.y = Math.atan2(26 - TOWER.x, 14 - TOWER.z);
  scene.add(g);

  // zipline to the shore
  const start = new THREE.Vector3(0, H + 1.8, 0).applyMatrix4(g.matrixWorld.compose(g.position, g.quaternion, g.scale));
  const ex = 34, ez = -36, ey = heightAt(ex, ez);
  mesh(new THREE.CylinderGeometry(0.35, 0.42, 6, 7), M.log, ex, ey + 3, ez, scene);
  const end = new THREE.Vector3(ex, ey + 5.6, ez);
  const mid = start.clone().lerp(end, 0.5); mid.y -= 2.5;
  const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start, mid, end), 40, 0.05, 4), std(0x333333, { metalness: 0.6 }));
  scene.add(cable);

  // archery range
  for (let i = 0; i < 3; i++) {
    const ax = 62 + i * 4.5, az = 8 - i * 1.5;
    const t = new THREE.Group(); t.position.set(ax, heightAt(ax, az), az);
    const rings = [[1.2, 0xf1ece0], [0.96, 0x222222], [0.72, 0x3a8fd6], [0.48, 0xd93b2b], [0.24, 0xf2c230]];
    rings.forEach(([r, col], k) => { const d = mesh(new THREE.CylinderGeometry(r, r, 0.2 + k * 0.02, 20), std(col), 0, 1.9, 0, t); d.rotation.x = Math.PI / 2 - 0.2; });
    for (const lx of [-0.8, 0.8]) { const l = mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), M.logDark, lx, 1.1, -0.35, t); l.rotation.x = -0.2; }
    t.rotation.y = Math.atan2(40 - ax, 10 - az);
    scene.add(t);
  }
}
signpost('THE TOWER', 37, -10, 26, 14);

// ---------------------------------------------------------------------------
// Waterfront
// ---------------------------------------------------------------------------
const canoes = [];
{
  const dockY = 0.55;
  mesh(new THREE.BoxGeometry(3.2, 0.28, 18), M.plank, 0, dockY, -29, scene);
  mesh(new THREE.BoxGeometry(11, 0.28, 3.4), M.plank, 0, dockY, -38.5, scene);
  for (let z = -21; z >= -38; z -= 3.4) for (const sx of [-1.5, 1.5]) mesh(new THREE.CylinderGeometry(0.16, 0.16, 3, 6), M.logDark, sx, -1, z, scene);
  for (const sx of [-5.2, 5.2]) mesh(new THREE.CylinderGeometry(0.16, 0.16, 3, 6), M.logDark, sx, -1, -38.5, scene);
  // ladder
  for (const sx of [-0.4, 0.4]) mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), M.white, sx, 0, -40.3, scene);

  // canoes
  const hull = new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  hull.scale(0.75, 0.55, 3.4);
  const deck = new THREE.CircleGeometry(1, 16).rotateX(-Math.PI / 2).scale(0.7, 1, 3.3).translate(0, 0.02, 0);
  const cols = [0xc8432f, 0xe2a83a, 0x3f7a4e, 0x2f6aa0, 0xc8432f];
  [[6, -32, 0.3], [8.5, -35, -0.2], [-6, -33, 0.15], [-9, -44, 0.6], [12, -50, -0.4]].forEach(([x, z, r], i) => {
    const c = new THREE.Group();
    const h = new THREE.Mesh(hull, std(cols[i], { side: THREE.DoubleSide, roughness: 0.6 })); h.castShadow = true;
    c.add(h, new THREE.Mesh(deck, M.plank));
    c.position.set(x, 0, z); c.rotation.y = r;
    scene.add(c); canoes.push({ c, phase: i * 1.7 });
  });
  // canoe rack on shore
  for (let k = 0; k < 3; k++) {
    const c = new THREE.Mesh(hull, std(cols[k + 1], { side: THREE.DoubleSide, roughness: 0.6 }));
    c.rotation.set(Math.PI, Math.PI / 2, 0); c.position.set(-9, heightAt(-9, -19) + 1 + k * 0.9, -19); c.castShadow = true; scene.add(c);
  }
  for (const sx of [-12, -6]) mesh(new THREE.BoxGeometry(0.2, 3.4, 1.6), M.logDark, sx, heightAt(sx, -19) + 1.5, -19, scene);

  // swim buoy line
  const buoyGeo = new THREE.SphereGeometry(0.28, 8, 6);
  const buoyRed = std(0xd9442f), buoyWhite = M.white;
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-14, 0, -27), new THREE.Vector3(-14, 0, -52), new THREE.Vector3(14, 0, -48));
  curve.getSpacedPoints(26).forEach((p, i) => { const b = mesh(buoyGeo, i % 2 ? buoyWhite : buoyRed, p.x, -0.1, p.z, scene); canoes.push({ c: b, phase: i * 0.6, buoy: true }); });
  // floating raft
  mesh(new THREE.BoxGeometry(4, 0.5, 4), M.plank, -2, 0, -55, scene);

  // lifeguard chair
  const lg = new THREE.Group(); const lx = -5, lz = -22.5; lg.position.set(lx, heightAt(lx, lz), lz);
  for (const [px, pz] of [[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]]) mesh(new THREE.BoxGeometry(0.15, 3.4, 0.15), M.white, px, 1.7, pz, lg);
  mesh(new THREE.BoxGeometry(1.7, 0.15, 1.3), M.white, 0, 3.3, 0, lg);
  mesh(new THREE.BoxGeometry(1.7, 1.2, 0.15), std(0xd9442f), 0, 4, 0.6, lg);
  lg.rotation.y = Math.PI; scene.add(lg);
}
signpost('WATERFRONT', 7, -18, 16, -6);

// ---------------------------------------------------------------------------
// Campfire circle
// ---------------------------------------------------------------------------
const FIRE = { x: -43, z: -19 };
const fireParts = [];
let fireLight, embers;
{
  const g = new THREE.Group();
  const fy = heightAt(FIRE.x, FIRE.z);
  g.position.set(FIRE.x, fy, FIRE.z);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const s = mesh(new THREE.DodecahedronGeometry(range(0.35, 0.5)), M.stone, Math.cos(a) * 1.9, 0.2, Math.sin(a) * 1.9, g); s.rotation.set(rand(), rand(), rand()); }
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; const l = mesh(new THREE.CylinderGeometry(0.16, 0.2, 2.6, 6), M.logDark, Math.cos(a) * 0.5, 0.9, Math.sin(a) * 0.5, g); l.rotation.set(Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55); }
  const flameCols = [[0xff5a1f, 1.1, 2.6], [0xff9a2e, 0.8, 2.0], [0xffd56a, 0.45, 1.3]];
  for (const [col, r, h] of flameCols) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, fog: false }));
    f.position.y = 0.6 + h / 2; g.add(f); fireParts.push({ f, h, phase: rand() * 10 });
  }
  addGlow(g, 0, 1.6, 0, 9);
  fireLight = new THREE.PointLight(0xff8a3c, 0, 40, 1.6);
  fireLight.position.set(0, 2.2, 0); fireLight.castShadow = true; fireLight.shadow.mapSize.set(512, 512);
  g.add(fireLight);
  // log benches
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const b = mesh(new THREE.CylinderGeometry(0.42, 0.42, 3.4, 8), M.log, Math.cos(a) * 6, 0.42, Math.sin(a) * 6, g);
    b.rotation.z = Math.PI / 2; b.rotation.y = -a + Math.PI / 2;
  }
  // embers
  const N = 90, ep = new Float32Array(N * 3), ev = [];
  for (let i = 0; i < N; i++) { ep.set([range(-0.6, 0.6), range(0, 8), range(-0.6, 0.6)], i * 3); ev.push(range(0.8, 2.2)); }
  const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(ep, 3));
  embers = new THREE.Points(eg, new THREE.PointsMaterial({ color: 0xffa04a, size: 0.16, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  embers.userData.v = ev; g.add(embers);
  scene.add(g);
}
signpost('CAMPFIRE', -31, -12, -26, -2);

// ---------------------------------------------------------------------------
// Lamp posts along the trail
// ---------------------------------------------------------------------------
for (let t = 0.2; t < 0.97; t += 0.055) {
  const p = trail.getPointAt(t), tg = trail.getTangentAt(t);
  const side = Math.round(t * 18) % 2 ? 1 : -1;
  const x = p.x - tg.z * 2.6 * side, z = p.z + tg.x * 2.6 * side, y = heightAt(x, z);
  mesh(new THREE.CylinderGeometry(0.08, 0.1, 3, 5), M.logDark, x, y + 1.5, z, scene);
  mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), M.window, x, y + 3.15, z, scene);
  addGlow(scene, x, y + 3.15, z, 2.6);
}

// ---------------------------------------------------------------------------
// Forest
// ---------------------------------------------------------------------------
{
  const zones = [[0, 72, 9], [CABINS.x, CABINS.z, 23], [LODGE.x - 6, LODGE.z - 4, 17], [TOWER.x, TOWER.z, 12], [TOWER.x + 18, TOWER.z + 14, 10], [FIRE.x, FIRE.z, 11], [0, -22, 11], [-9, -19, 6], [16, 36, 4]];
  const clear = (x, z) => {
    if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 4) return false;
    for (const [zx, zz, zr] of zones) if (Math.hypot(x - zx, z - zz) < zr) return false;
    for (let i = 0; i < trailPts.length; i += 2) if (Math.abs(x - trailPts[i].x) < 5 && Math.abs(z - trailPts[i].z) < 5) return false;
    return true;
  };
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.34, 2.2, 5); trunkGeo.translate(0, 1.1, 0);
  const pineGeo = mergeGeometries([
    new THREE.ConeGeometry(2, 3.6, 7).translate(0, 3.4, 0),
    new THREE.ConeGeometry(1.55, 3, 7).translate(0, 5.1, 0),
    new THREE.ConeGeometry(1.05, 2.4, 7).translate(0, 6.6, 0),
  ]);
  const roundGeo = new THREE.IcosahedronGeometry(1.9, 0); roundGeo.translate(0, 3.8, 0);
  const pines = [], rounds = [];
  for (let i = 0; i < 4200 && pines.length + rounds.length < 1400; i++) {
    const x = range(-250, 250), z = range(-250, 230);
    const r = Math.hypot(x, z + 5);
    if (r < 55 && rand() > 0.55) continue;
    if (!clear(x, z)) continue;
    const y = heightAt(x, z);
    if (y < 0 || y > 40) continue;
    const s = range(0.75, 1.25) * (1 + smoothstep(50, 160, r) * 0.6);
    (rand() < 0.82 ? pines : rounds).push([x, y, z, s, rand() * Math.PI]);
  }
  const dummy = new THREE.Object3D(), col = new THREE.Color();
  const build = (geo, list, mat, colorFn) => {
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach(([x, y, z, s, ry], i) => {
      dummy.position.set(x, y - 0.2, z); dummy.scale.set(s, s * range(0.9, 1.2), s); dummy.rotation.set(0, ry, 0); dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
      if (colorFn) im.setColorAt(i, colorFn());
    });
    im.castShadow = true; im.receiveShadow = true;
    scene.add(im);
  };
  const all = [...pines, ...rounds];
  build(trunkGeo, all, std(0x5d3f27));
  build(pineGeo, pines, std(0xffffff), () => col.setHSL(range(0.27, 0.36), range(0.35, 0.5), range(0.2, 0.3)));
  build(roundGeo, rounds, std(0xffffff), () => col.setHSL(range(0.18, 0.28), range(0.4, 0.55), range(0.3, 0.42)));
}

// rocks scattered by the shore
for (let i = 0; i < 40; i++) {
  const a = rand() * Math.PI * 2, d = LAKE.r + range(1, 6);
  const x = LAKE.x + Math.cos(a) * d, z = LAKE.z + Math.sin(a) * d;
  if (Math.abs(x) < 6 && z > -30) continue;
  const r = mesh(new THREE.DodecahedronGeometry(range(0.5, 1.6)), M.stone, x, heightAt(x, z), z, scene);
  r.rotation.set(rand(), rand(), rand());
}

// ---------------------------------------------------------------------------
// Sky dome, sun, moon, stars, clouds, fireflies
// ---------------------------------------------------------------------------
const skyUniforms = {
  top: { value: new THREE.Color(0x4f9fd8) }, bottom: { value: new THREE.Color(0xd7ebee) },
  glow: { value: new THREE.Color(0xffb36b) }, glowAmt: { value: 0 }, sunDir: { value: new THREE.Vector3(0, 1, 0) },
};
const skyGroup = new THREE.Group();
scene.add(skyGroup);
skyGroup.add(new THREE.Mesh(new THREE.SphereGeometry(700, 32, 16), new THREE.ShaderMaterial({
  uniforms: skyUniforms, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 glow; uniform float glowAmt; uniform vec3 sunDir; varying vec3 vDir;
    void main(){ vec3 d = normalize(vDir); float h = d.y;
      vec3 c = mix(bottom, top, smoothstep(0.0, 0.55, h));
      float s = max(dot(d, normalize(sunDir)), 0.);
      c += glow * (pow(s, 6.) * 0.9 + pow(s, 60.) * 0.6) * glowAmt * (1. - smoothstep(0.0, 0.6, h) * 0.5);
      gl_FragColor = vec4(c, 1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
})));
const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(16, 32), new THREE.MeshBasicMaterial({ color: 0xfff1d0, fog: false, transparent: true, depthWrite: false }));
const moonDisc = new THREE.Mesh(new THREE.CircleGeometry(10, 32), new THREE.MeshBasicMaterial({ color: 0xf1ecdc, fog: false, transparent: true, opacity: 0, depthWrite: false }));
skyGroup.add(sunDisc, moonDisc);
const MOON_DIR = new THREE.Vector3(-0.55, 0.55, -0.6).normalize();
moonDisc.position.copy(MOON_DIR).multiplyScalar(600); moonDisc.lookAt(0, 0, 0);
const stars = (() => {
  const N = 1600, p = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const v = new THREE.Vector3(range(-1, 1), range(0.04, 1), range(-1, 1)).normalize().multiplyScalar(650); p.set([v.x, v.y, v.z], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const s = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
  skyGroup.add(s); return s;
})();
const clouds = [];
{
  const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 1, transparent: true, opacity: 0.95 });
  for (let i = 0; i < 9; i++) {
    const g = new THREE.Group();
    for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(range(4, 8), 0), cm); b.position.set(k * 6 - 12 + range(-2, 2), range(-1, 2), range(-3, 3)); b.scale.y = 0.6; g.add(b); }
    g.position.set(range(-220, 220), range(70, 100), range(-260, 120));
    scene.add(g); clouds.push(g);
  }
  clouds.mat = cm;
}
const fireflies = (() => {
  const N = 260, p = new Float32Array(N * 3), ph = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const near = [[FIRE.x, FIRE.z], [CABINS.x, CABINS.z], [LODGE.x, LODGE.z], [0, -15], [-20, -10]][i % 5];
    const x = near[0] + range(-18, 18), z = near[1] + range(-18, 18);
    p.set([x, heightAt(x, z) + range(0.6, 4), z], i * 3); ph[i] = rand();
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, opacity: { value: 0 }, size: { value: 0.5 * renderer.getPixelRatio() } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float phase; uniform float time; uniform float size; varying float vA;
      void main(){ vec3 p = position; p.x += sin(time*.5+phase*6.)*.9; p.y += sin(time*.8+phase*4.)*.5; p.z += cos(time*.4+phase*5.)*.9;
        vec4 mv = modelViewMatrix*vec4(p,1.); gl_PointSize = size*(300./-mv.z); gl_Position = projectionMatrix*mv;
        vA = pow(.5+.5*sin(time*1.7+phase*40.), 3.); }`,
    fragmentShader: `uniform float opacity; varying float vA; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,0.,d); gl_FragColor = vec4(vec3(.85,1.,.45), a*vA*opacity); }`,
  });
  const pts = new THREE.Points(g, mat); pts.frustumCulled = false; scene.add(pts); return pts;
})();

// ---------------------------------------------------------------------------
// Lights
// ---------------------------------------------------------------------------
const hemi = new THREE.HemisphereLight(0xcfe9ff, 0x4d6b2f, 1.1);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1d6, 2.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -110, right: 110, top: 110, bottom: -110, near: 1, far: 400 });
sun.shadow.bias = -0.0006;
sun.shadow.normalBias = 0.6;
sun.target.position.set(0, 0, 5);
scene.add(sun, sun.target);

// ---------------------------------------------------------------------------
// Time of day keyframes (driven by trail progress 0..1)
// ---------------------------------------------------------------------------
const KF = [
  { q: 0.0, top: 0x4f9fd8, bottom: 0xd7ebee, sun: 0xfff1d6, sunI: 2.7, hs: 0xcfe9ff, hg: 0x4d6b2f, hI: 1.1, dir: [0.6, 1.0, 0.5], glow: 0.15, exp: 1.05 },
  { q: 0.42, top: 0x58a3d8, bottom: 0xe4e8da, sun: 0xffe8c4, sunI: 2.6, hs: 0xd8e6f2, hg: 0x4d6b2f, hI: 1.0, dir: [0.55, 0.7, -0.2], glow: 0.25, exp: 1.05 },
  { q: 0.6, top: 0x6a7fb7, bottom: 0xf6be8a, sun: 0xffb06a, sunI: 2.1, hs: 0xf0c9a2, hg: 0x4a5530, hI: 0.8, dir: [0.3, 0.34, -1], glow: 0.9, exp: 1.05 },
  { q: 0.7, top: 0x2f3d70, bottom: 0xe48868, sun: 0xff874e, sunI: 1.1, hs: 0xa58fb0, hg: 0x2f3424, hI: 0.55, dir: [0.22, 0.18, -1], glow: 1.0, exp: 1.1 },
  { q: 0.82, top: 0x08112c, bottom: 0x1b2748, sun: 0x9fb4e6, sunI: 0.75, hs: 0x4a5d90, hg: 0x1a2218, hI: 0.55, dir: [-0.55, 0.55, -0.6], glow: 0.0, exp: 1.3 },
  { q: 1.0, top: 0x060d24, bottom: 0x18233f, sun: 0xa9bdec, sunI: 0.9, hs: 0x52669a, hg: 0x1c251a, hI: 0.65, dir: [-0.55, 0.55, -0.6], glow: 0.0, exp: 1.45 },
];
const cA = new THREE.Color(), cB = new THREE.Color(), vA = new THREE.Vector3(), vB = new THREE.Vector3();
function applyTime(q, time) {
  let i = 0; while (i < KF.length - 2 && q > KF[i + 1].q) i++;
  const a = KF[i], b = KF[i + 1], t = smoothstep(a.q, b.q, q);
  const mix = (k, out) => out.copy(cA.set(a[k])).lerp(cB.set(b[k]), t);
  mix('top', skyUniforms.top.value);
  mix('bottom', skyUniforms.bottom.value);
  scene.fog.color.copy(skyUniforms.bottom.value);
  mix('sun', sun.color);
  sun.intensity = lerp(a.sunI, b.sunI, t);
  mix('hs', hemi.color); mix('hg', hemi.groundColor);
  hemi.intensity = lerp(a.hI, b.hI, t);
  renderer.toneMappingExposure = lerp(a.exp, b.exp, t);
  const dir = vA.fromArray(a.dir).normalize().lerp(vB.fromArray(b.dir).normalize(), t).normalize();
  sun.position.copy(sun.target.position).addScaledVector(dir, 160);
  skyUniforms.sunDir.value.copy(dir);
  skyUniforms.glowAmt.value = lerp(a.glow, b.glow, t);

  const night = smoothstep(0.68, 0.82, q);
  const dusk = smoothstep(0.55, 0.7, q);
  sunDisc.position.copy(dir).multiplyScalar(600); sunDisc.lookAt(0, 0, 0);
  sunDisc.material.opacity = 1 - smoothstep(0.69, 0.74, q);
  sunDisc.material.color.set(0xfff1d0).lerp(cA.set(0xff9a55), dusk);
  moonDisc.material.opacity = smoothstep(0.74, 0.84, q);
  stars.material.opacity = smoothstep(0.7, 0.88, q);
  M.window.emissiveIntensity = 0.05 + smoothstep(0.58, 0.8, q) * 2.4;
  glowMat.opacity = smoothstep(0.62, 0.82, q) * 0.85;
  fireflies.material.uniforms.opacity.value = night;
  clouds.mat.color.set(0xffffff).lerp(cA.set(0xf3a07a), dusk).lerp(cB.set(0x26304d), night);
  clouds.mat.opacity = 0.95 - night * 0.5;
  waterMat.color.set(0x2f8193).lerp(cA.set(0x8a9cc0), dusk * (1 - night)).lerp(cB.set(0x1a3350), night);

  const fireAmt = 0.35 + night * 0.65;
  const flick = 0.85 + Math.sin(time * 13) * 0.08 + Math.sin(time * 7.3) * 0.07;
  fireLight.intensity = (4 + night * 70) * flick;
  fireParts.forEach(({ f, h, phase }) => {
    const s = fireAmt * (0.9 + Math.sin(time * 9 + phase) * 0.12);
    f.scale.set(s, s * (0.9 + Math.sin(time * 11 + phase * 2) * 0.15), s);
    f.position.y = 0.5 + (h * f.scale.y) / 2;
  });
  embers.material.opacity = 0.3 + night * 0.7;
}

// ---------------------------------------------------------------------------
// Camera stations
// ---------------------------------------------------------------------------
const STATIONS = [
  { pos: [0, 30, 140], look: [0, 11, 30] },        // welcome
  { pos: [-2, 13, 70], look: [-25, 2, 38] },      // cabins
  { pos: [8, 9, 14], look: [37, 4, 25] },         // lodge
  { pos: [24, 8, 16], look: [49, 9, -8] },        // tower
  { pos: [18, 9, -6], look: [-18, 3, -48] },       // waterfront
  { pos: [-29, 6, -3], look: [-45, 0.5, -20] },   // campfire
  { pos: [38, 78, 70], look: [-6, 0, -10] },      // enroll / aerial
];
const posCurve = new THREE.CatmullRomCurve3(STATIONS.map(s => new THREE.Vector3(...s.pos)), false, 'centripetal');
const lookCurve = new THREE.CatmullRomCurve3(STATIONS.map(s => new THREE.Vector3(...s.look)), false, 'centripetal');
const LAST = STATIONS.length - 1;
const camLook = new THREE.Vector3();
function placeCamera(p, time) {
  const i = Math.min(LAST - 1, Math.floor(p));
  const f = p - i;
  const e = smoothstep(0.22, 0.95, f); // linger at each stop, then travel
  const u = (i + e) / LAST;
  posCurve.getPoint(u, camera.position);
  lookCurve.getPoint(u, camLook);
  // gentle handheld drift
  camera.position.x += Math.sin(time * 0.31) * 0.35;
  camera.position.y += Math.sin(time * 0.43) * 0.2;
  const ground = heightAt(camera.position.x, camera.position.z) + 2.5;
  if (camera.position.y < ground) camera.position.y = ground;
  camera.lookAt(camLook);
}

// ---------------------------------------------------------------------------
// Scroll + UI
// ---------------------------------------------------------------------------
const sections = [...document.querySelectorAll('main > section')];
const cards = sections.map(s => s.querySelector('.card, .hero'));
const dots = [...document.querySelectorAll('.trail button')];
let target = 0, current = 0;
const secH = () => sections[0].offsetHeight;
function readScroll() { target = Math.min(LAST, Math.max(0, scrollY / secH())); }
addEventListener('scroll', readScroll, { passive: true });
document.querySelectorAll('[data-goto]').forEach(el => el.addEventListener('click', e => {
  e.preventDefault();
  scrollTo({ top: Number(el.dataset.goto) * secH(), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}));
function updateUI(p) {
  cards.forEach((c, i) => {
    const local = p - i;
    let o = i === 0 ? 1 - smoothstep(0.12, 0.4, local) : smoothstep(-0.45, -0.12, local) * (1 - smoothstep(0.42, 0.62, local));
    if (i === LAST) o = smoothstep(-0.45, -0.12, local);
    c.style.opacity = o.toFixed(3);
    c.style.transform = `translateY(${((1 - o) * (local < 0 ? 24 : -24)).toFixed(1)}px)`;
    c.style.visibility = o < 0.01 ? 'hidden' : 'visible';
  });
  const active = Math.round(p);
  dots.forEach((d, i) => { d.classList.toggle('active', i === active); d.classList.toggle('done', i < active); d.setAttribute('aria-current', i === active ? 'step' : 'false'); });
}

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.fov = innerWidth < 760 ? 60 : 48;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  readScroll();
}
addEventListener('resize', resize);
resize();

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let first = true;
function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;
  current += (target - current) * (1 - Math.exp(-dt * (reduced ? 30 : 4.5)));
  if (Math.abs(target - current) < 1e-4) current = target;

  placeCamera(current, reduced ? 0 : time);
  applyTime(current / LAST, time);
  updateUI(current);
  skyGroup.position.copy(camera.position);

  // water ripples
  const wp = waterGeo.attributes.position.array;
  for (let i = 0; i < wp.length; i += 3) {
    const x = waterBase[i], z = waterBase[i + 2];
    wp[i + 1] = Math.sin(x * 0.35 + time * 1.1) * 0.08 + Math.cos(z * 0.42 + time * 0.9) * 0.08;
  }
  waterGeo.attributes.position.needsUpdate = true;

  // flag wave
  const fp = flag.geometry.attributes.position.array, fb = flag.userData.base;
  for (let i = 0; i < fp.length; i += 3) { const x = fb[i]; fp[i + 2] = Math.sin(x * 1.6 - time * 4) * 0.22 * (x / 3.6); fp[i + 1] = fb[i + 1] - x * x * 0.012; }
  flag.geometry.attributes.position.needsUpdate = true;
  flag.geometry.computeVertexNormals();

  canoes.forEach(({ c, phase, buoy }) => { c.position.y = (buoy ? -0.08 : -0.05) + Math.sin(time * 1.3 + phase) * 0.07; if (!buoy) c.rotation.z = Math.sin(time * 0.9 + phase) * 0.04; });
  clouds.forEach((c, i) => { c.position.x += dt * (1.5 + i * 0.2); if (c.position.x > 260) c.position.x = -260; });

  const ep = embers.geometry.attributes.position.array, ev = embers.userData.v;
  for (let i = 0; i < ev.length; i++) {
    ep[i * 3 + 1] += ev[i] * dt;
    ep[i * 3] += Math.sin(time * 2 + i) * dt * 0.3;
    if (ep[i * 3 + 1] > 9) { ep[i * 3] = range(-0.5, 0.5); ep[i * 3 + 1] = 0.8; ep[i * 3 + 2] = range(-0.5, 0.5); }
  }
  embers.geometry.attributes.position.needsUpdate = true;
  fireflies.material.uniforms.time.value = time;

  renderer.render(scene, camera);
  if (first) { first = false; document.getElementById('loader').classList.add('gone'); }
  requestAnimationFrame(frame);
}

// Paint the wooden signs once the display font is ready, then start.
const gateTex = () => {
  const t = textTexture('CAMP HOLLOW PINE', { font: '800 92px Fraunces, Georgia, serif' });
  const tb = t.clone(); tb.wrapS = THREE.RepeatWrapping; tb.repeat.x = -1; tb.offset.x = 1;
  gateBoard.material = [M.plank, M.plank, M.plank, M.plank, new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }), new THREE.MeshStandardMaterial({ map: tb, roughness: 0.9 })];
};
Promise.race([document.fonts.load('800 112px Fraunces'), new Promise(r => setTimeout(r, 2500))]).finally(() => {
  gateTex(); placeSigns();
  readScroll(); current = target;
  frame();
}).catch(() => { /* Font loading can fail; the scene uses its fallback face. */ });
