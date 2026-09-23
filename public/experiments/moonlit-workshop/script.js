const hero = document.querySelector('.hero');
const layers = [...document.querySelectorAll('[data-depth]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const pointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.querySelector('#motion');
const status = document.querySelector('#motion-status');
const slider = document.querySelector('#strength');
const FRAME_MS = 1000 / 24;
let lastPaint = 0;
let enabled = true, visible = true, frame = 0, previous = 0;
let target = { x: 0, y: 0 }, position = { x: 0, y: 0 }, velocity = { x: 0, y: 0 };
// Low-resolution alpha masks let the pointer look through transparent PNG margins.
// Read once at load, never read a full-resolution image during pointer movement.
const masks = new Map();
for (const layer of layers) {
  const img = layer.matches('img') ? layer : layer.querySelector('img');
  Promise.all([...layer.querySelectorAll("img"), img].map(image => image.decode())).then(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = Math.round(192 * img.naturalHeight / img.naturalWidth);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (layer.classList.contains('treasures')) {
      ctx.drawImage(layer.querySelector('.dragon-body img'), .28*canvas.width, -.035*canvas.height, .6*canvas.width, .6*canvas.height);
      ctx.drawImage(layer.querySelector('.dragon-wings img'), .308*canvas.width, -.076*canvas.height, .48*canvas.width, .48*canvas.height);
    }
    masks.set(layer, { pixels: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
      width: canvas.width, height: canvas.height, ratio: img.naturalWidth / img.naturalHeight });
  }).catch(() => {}); // file:// or unavailable images gracefully use background focus.
}
let focalDepth = 15, focalTarget = 15, focusAmount = 0, focusTarget = 0;
function depthUnderPointer(x, y) {
  for (const layer of [...layers].reverse()) {
    const mask = masks.get(layer);
    if (!mask) continue;
    const rect = layer.getBoundingClientRect();
    let width = rect.width, height = rect.height, left = rect.left, top = rect.top;
    const fit = getComputedStyle(layer).objectFit;
    if (fit === 'cover' || fit === 'contain') {
      const scale = Math[fit === 'cover' ? 'max' : 'min'](width / mask.width, height / mask.height);
      width = mask.width * scale; height = mask.height * scale;
      left += (rect.width - width) / 2; top += (rect.height - height) / 2;
    }
    const u = (x - left) / width, v = (y - top) / height;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom || u < 0 || u >= 1 || v < 0 || v >= 1) continue;
    const alpha = mask.pixels[(Math.floor(v * mask.height) * mask.width + Math.floor(u * mask.width)) * 4 + 3];
    if (alpha > 120) return Number(layer.dataset.depth);
  }
  return 6;
}
// Locations in the registered 1536 × 1024 workshop canvases.
// Each warm-render patch reveals actual illuminated materials, not a flat orange disc.
const firelight = document.querySelector('.firelight');
const lamps = [
  [50, 25, 15, 22, 4.7, -1.2], [38, 34, 12, 19, 3.9, -2.7],
  [64, 33, 12, 19, 5.3, -.8], [56.4, 44, 8, 12, 4.3, -3.1],
  [78, 40, 7, 11, 3.7, -1.8], [80, 52, 9, 14, 5.7, -4.2],
  [22, 66, 9, 15, 4.9, -2.1], [77.5, 72, 9, 14, 4.1, -.4]
];
for (const [x, y, rx, ry, duration, delay] of lamps) {
  const patch = document.createElement('div');
  patch.className = 'lamp-patch';
  // Crop the composited surface to the light's influence; background remains registered.
  patch.style.cssText = `left:${x-rx}%;top:${y-ry}%;width:${rx*2}%;height:${ry*2}%;`;
  const warm = document.createElement('img');
  warm.src = 'assets/05-midground-workshop-dark.png';
  warm.alt = '';
  warm.style.cssText = `width:${10000/(rx*2)}%;height:${10000/(ry*2)}%;left:${-(x-rx)/(rx*2)*100}%;top:${-(y-ry)/(ry*2)*100}%;`;
  patch.append(warm);
  const glow = document.createElement('span');
  glow.className = 'lamp-glow';
  patch.append(glow);
  patch.style.animationDuration = `${duration}s`;
  patch.style.animationDelay = `${delay}s`;
  firelight.append(patch);
}
const magicInterior = document.createElement('img');
magicInterior.className = 'magic-interior';
magicInterior.src = 'assets/05-midground-workshop-dark.png';
magicInterior.alt = '';
firelight.prepend(magicInterior);
const lampPatches = [...firelight.querySelectorAll('.lamp-patch')];
let magicTarget = 0, magicAmount = 0, foregroundTarget = 0, foregroundAmount = 0;
const propsWarm = document.querySelector(".props-warm");
let lightTimer = 0, lightTime = 0;
function renderFirelight() {
  lightTime += FRAME_MS / 1000;
  foregroundAmount += (foregroundTarget - foregroundAmount) * (1-Math.sqrt(.8));
  propsWarm.style.opacity = (.5 + foregroundAmount * .4 + .05 * Math.sin(lightTime * 3.7) + .025 * Math.sin(lightTime * 8.3)).toFixed(3);
  magicAmount += (magicTarget - magicAmount) * (1-Math.sqrt(.8));
  magicInterior.style.opacity = (magicAmount * .85).toFixed(3);
  hero.dataset.magic = magicAmount.toFixed(3);
  lampPatches.forEach((patch, index) => {
    const phase = lightTime * (1.1 + index * .13) + index * 2.37;
    patch.style.opacity = (.48 + magicAmount * .38 + .045 * Math.sin(phase * 2.1) + .025 * Math.sin(phase * 5.7) + .015 * Math.sin(phase * 11.3)).toFixed(3);
  });
}
function syncFirelight() {
  window.skyStars?.setActive(enabled && !reduced.matches && visible && !document.hidden);
  window.glassButtons?.setActive(enabled && !reduced.matches && visible && !document.hidden);
  window.waterRig?.setActive(enabled && !reduced.matches && visible && !document.hidden);
  window.vineRig?.setActive(enabled && !reduced.matches && pointer.matches && visible && !document.hidden);
  window.dragonRig?.setActive(enabled && !reduced.matches && visible && !document.hidden);
  clearInterval(lightTimer);
  if (!enabled || reduced.matches || !visible || document.hidden || document.body.dataset.room === 'light') {
    magicTarget = magicAmount = foregroundTarget = foregroundAmount = 0;
    propsWarm.style.opacity = ".55";
    magicInterior.style.opacity = '0';
    hero.dataset.magic = '0';
  }
  if (enabled && !reduced.matches && visible && !document.hidden) lightTimer = setInterval(renderFirelight, FRAME_MS);
  firelight.classList.toggle('still', !enabled || reduced.matches || !visible || document.hidden);
}

const canMove = () => enabled && !reduced.matches && pointer.matches && visible && !document.hidden;
function paint() {
  const strength = Number(slider.value) / 100;
  for (const layer of layers) {
    const plane = Number(layer.dataset.depth);
    const depth = plane * strength;
    // A small in-focus band, capped defocus; interface text is outside these layers.
    const blur = Math.min(5, Math.max(0, Math.abs(plane - focalDepth) - 3) * .17) * focusAmount;
    layer.style.filter = blur < .025 ? 'none' : `blur(${blur.toFixed(2)}px)`;
    layer.style.transform = `translate3d(${(-position.x * depth).toFixed(3)}px, ${(-position.y * depth * .65).toFixed(3)}px, 0)`;
  }
}
function tick(now) {
  const dt = Math.min((now - previous) / 1000 || 1 / 60, 1 / 30);
  previous = now;
  // Damped spring: mass 1, stiffness 100, damping 20. Retarget without restarting.
  for (const axis of ['x', 'y']) {
    velocity[axis] += ((target[axis] - position[axis]) * 100 - velocity[axis] * 20) * dt;
    position[axis] += velocity[axis] * dt;
  }
  const blend = 1 - Math.exp(-dt * 8);
  focalDepth += (focalTarget - focalDepth) * blend;
  focusAmount += (focusTarget - focusAmount) * blend;
  if (now - lastPaint >= FRAME_MS) { paint(); lastPaint = now - ((now - lastPaint) % FRAME_MS || 0); }
  if (Math.abs(focalTarget-focalDepth) + Math.abs(focusTarget-focusAmount) + Math.abs(target.x-position.x)+Math.abs(target.y-position.y)+Math.abs(velocity.x)+Math.abs(velocity.y) > .0005) frame = requestAnimationFrame(tick);
  else { position = { ...target }; focalDepth = focalTarget; focusAmount = focusTarget; paint(); frame = 0; }
}
function wake() { if (!frame) { previous = performance.now(); frame = requestAnimationFrame(tick); } }
function reset() { setBackgroundFocus(false); focusAmount = focusTarget = 0; cancelAnimationFrame(frame); frame = 0; target = { x: 0, y: 0 }; position = { ...target }; velocity = { ...target }; paint(); }
const heroCopy=document.querySelector('.copy');
function setBackgroundFocus(value){
  hero.classList.toggle('background-focus',value);
  heroCopy.inert=value;
}
// Keyboard navigation restores the copy before the browser chooses its next focus target.
document.addEventListener('keydown',event=>{if(event.key==='Tab')setBackgroundFocus(false);},true);
hero.addEventListener('pointermove', event => {
  if (!canMove() || event.pointerType === 'touch') return;
  focalTarget = depthUnderPointer(event.clientX, event.clientY);
  setBackgroundFocus(focalTarget === 6 && !event.target.closest("header, .test-panel"));
  magicTarget = focalTarget === 15 ? 1 : 0;
  foregroundTarget = focalTarget === 25 ? 1 : 0;
  focusTarget = 1;
  hero.dataset.focusDepth = String(focalTarget);
  const rect = hero.getBoundingClientRect();
  target.x = Math.max(-1, Math.min(1, (event.clientX-rect.left)/rect.width*2-1));
  target.y = Math.max(-1, Math.min(1, (event.clientY-rect.top)/rect.height*2-1));
  wake();
});
hero.addEventListener('pointerleave', () => { setBackgroundFocus(false); magicTarget = foregroundTarget = 0; target = { x: 0, y: 0 }; focusTarget = 0; if (canMove()) wake(); });
function sync() {
  const available = !reduced.matches;
  syncFirelight();
  motionButton.disabled = !available;
  motionButton.setAttribute('aria-pressed', String(enabled && available));
  motionButton.textContent = enabled && available ? 'Pause motion' : 'Enable motion';
  status.textContent = reduced.matches ? 'Static scene · reduced motion preference' : !pointer.matches ? 'Touch-friendly scene · ambient candlelight' : enabled ? 'Point at a treasure to bring its depth into focus' : 'Motion paused';
  if (!canMove()) reset();
}
motionButton.addEventListener('click', () => { enabled = !enabled; sync(); });
slider.addEventListener('input', () => { document.querySelector('output').value = `${slider.value}%`; paint(); });
for (const button of document.querySelectorAll('[data-room]')) button.addEventListener('click', () => {
  document.body.dataset.room = button.dataset.room;
  syncFirelight();
  for (const option of document.querySelectorAll('[data-room]')) option.setAttribute('aria-pressed', String(option === button));
});
reduced.addEventListener('change', sync); pointer.addEventListener('change', sync);
document.addEventListener('visibilitychange', sync);
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncFirelight(); if (!visible) reset(); }).observe(hero);
sync();
