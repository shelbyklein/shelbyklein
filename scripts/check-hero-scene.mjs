import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const html = await fs.readFile('public/scenes/alien-planet.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(script, 'Scene must contain a script');
const events = new Map();
const pageEvents = new Map();
const frames = new Map();
const painted = new Map();
const messages = [];
let nextFrame = 0;
const parent = { postMessage: message => messages.push(message) };
const canvasIds = ['space', 'moon-glow', 'moon', 'planet-glow', 'water', 'ground', 'cloud-shadow', 'clouds'];
const canvases = Object.fromEntries(canvasIds.map(id => [id, {
  getContext: () => ({
    clearRect() {}, fillRect() {},
    createRadialGradient: () => ({ addColorStop() {} }),
    createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
    putImageData: image => painted.set(id, image),
  }),
}]));
const document = {
  hidden: false,
  getElementById: id => canvases[id],
  addEventListener: (name, callback) => pageEvents.set(name, callback),
};
const context = vm.createContext({
  document, parent, innerWidth: 1440, innerHeight: 800,
  Uint8Array, Uint8ClampedArray, Math, Promise,
  setTimeout, clearTimeout,
  addEventListener: (name, callback) => events.set(name, callback),
  requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
  cancelAnimationFrame: id => frames.delete(id),
});
const read = expression => vm.runInContext(expression, context);
function tick(time) {
  const [id, callback] = frames.entries().next().value;
  frames.delete(id);
  callback(time);
}
function playback(paused, source = parent) {
  events.get('message')({ source, data: { type: 'hero-scene-playback', paused } });
}

await vm.runInContext(script, context);
assert(read('ready'));
assert(messages.some(message => message.type === 'hero-scene-ready'));
assert.equal(frames.size, 0, 'First frame must stay still until the host chooses playback');
for (const id of ['moon', 'water']) assert(painted.get(id)?.data.some(value => value > 0), `${id} must draw visible pixels`);
playback(false, {});
assert.equal(frames.size, 0, 'Unrelated windows cannot control playback');
playback(false);
assert.equal(frames.size, 1);
tick(1000);
const firstOffset = read('planet.surfaceOffset');
tick(1010);
assert.equal(read('planet.surfaceOffset'), firstOffset, 'Do not redraw above the frame cap');
tick(1060);
assert.notEqual(read('planet.surfaceOffset'), firstOffset, 'Surface must rotate during playback');
playback(true);
assert.equal(frames.size, 0, 'Pause must cancel the animation loop');
playback(false);
document.hidden = true;
pageEvents.get('visibilitychange')();
assert.equal(frames.size, 0, 'Hidden tabs must stop animating');
document.hidden = false;
pageEvents.get('visibilitychange')();
assert.equal(frames.size, 1);
const terrain = read('terrainMap');
const checksum = terrain.reduce((sum, value) => sum + value, 0);
context.innerWidth = 390;
context.innerHeight = 680;
events.get('resize')();
await new Promise(resolve => setTimeout(resolve, 160));
assert.equal(read('terrainMap'), terrain);
assert.equal(terrain.reduce((sum, value) => sum + value, 0), checksum, 'Resize must reuse terrain');
assert(canvases.space.height > canvases.space.width, 'Canvas must adapt to a portrait hero');
events.get('pagehide')();
assert.equal(frames.size, 0, 'Leaving the scene must cancel playback');
console.log('Hero scene: visible pixels, paused first frame, trusted playback messages, frame cap, pause/resume, hidden-tab suspension, portrait resize, and teardown passed.');
