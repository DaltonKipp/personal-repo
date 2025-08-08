// === Modular Kaleidoscope + Standalone Passes ===
// Scene generator + Post-processing pipeline with reusable passes

let gui;

// Ping-pong buffer pair
let bufA, bufB;

// === Shared full-screen vertex shader ===
const VERT_FSQ = `
attribute vec3 aPosition;
varying vec2 vUv;
void main(){
  vUv = aPosition.xy * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 1.0);
}`;

// ---------------------------------------------------------
// Base helpers
// ---------------------------------------------------------

// Small helper to make a p5.Shader for the given WEBGL renderer
function makeShader(renderer, fragSrc) {
  return new p5.Shader(renderer, VERT_FSQ, fragSrc);
}

// Utility: random within [min, max * damping]
const randomDamping = 0.75;
function randDef(def) {
  return random(def.min, def.max * randomDamping);
}

// Build controllers for a paramDefs object {key:{min,max,step,default}}
function buildFolder(folder, obj, paramDefs) {
  obj._controllers = obj._controllers || {};
  Object.keys(paramDefs).forEach((k) => {
    const d = paramDefs[k];
    const ctrl = folder.add(obj.params, k, d.min, d.max).step(d.step).name(k);
    obj._controllers[k] = ctrl;
  });
  folder.add({ randomize: () => {
    for (const k in paramDefs) obj.params[k] = randDef(paramDefs[k]);
    updateControllers(obj);
  }}, 'randomize').name('Randomize');
  folder.add(obj, 'enabled').name('Enabled');
}

function updateControllers(obj) {
  if (!obj._controllers) return;
  Object.values(obj._controllers).forEach(c => c.updateDisplay());
}

// ---------------------------------------------------------
// PassManager: runs an ordered list of passes
// ---------------------------------------------------------
class PassManager {
  constructor(p5Instance, w, h) {
    this.p = p5Instance;
    this.w = w; this.h = h;
    bufA = createGraphics(w, h, WEBGL);
    bufB = createGraphics(w, h, WEBGL);
    bufA.noStroke(); bufB.noStroke();
    this.passes = [];          // post passes that read u_texture
    this.scene = null;         // scene generator that renders first
  }
  setScene(scenePass) { this.scene = scenePass; }
  addPass(pass) { this.passes.push(pass); }
  resize(w, h) {
    this.w = w; this.h = h;
    bufA.resizeCanvas(w, h);
    bufB.resizeCanvas(w, h);
  }
  render(timeSec) {
    // 1) Scene → bufA
    this.scene.render(bufA, this.w, this.h, timeSec);

    // 2) Post passes ping-pong bufA <-> bufB
    let readTex = bufA;
    let writeBuf = bufB;

    for (const pass of this.passes) {
      if (!pass.enabled) continue;
      pass.render(readTex, writeBuf, this.w, this.h, timeSec);
      // swap
      const tmp = readTex; readTex = writeBuf; writeBuf = tmp;
    }

    // 3) Draw final texture to screen
    shader(this.scene.blitShader); // simple blit shader (uses same FSQ vert)
    this.scene.blitShader.setUniform('u_texture', readTex);
    beginShape();
    texture(readTex);
    vertex(-width/2, -height/2, 0, 0);
    vertex( width/2, -height/2, 1, 0);
    vertex( width/2,  height/2, 1, 1);
    vertex(-width/2,  height/2, 0, 1);
    endShape(CLOSE);
  }
}

// ---------------------------------------------------------
// Kaleidoscope Scene (source) — generates the base animation
// ---------------------------------------------------------
class KaleidoScene {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.shader = makeShader(this.p._renderer, KALEIDO_FRAG);
    this.blitShader = makeShader(this.p._renderer, BLIT_FRAG);

    this.paramDefs = {
      tileCount:      { min: 1,   max: 50,  step: 1,    default: 10 },
      squareSize:     { min: 0.05,max: 0.5, step: 0.01, default: 0.3 },
      thickness:      { min: 0.05,max: 0.5, step: 0.01, default: 0.15 },
      kaleidoSides:   { min: 1,   max: 32,  step: 1,    default: 8 },
      distortionAmp:  { min: 0.0, max: 0.5, step: 0.01, default: 0.05 },
      distortionFreq: { min: 0.0, max: 100, step: 1,    default: 5 },
      speed:          { min: 0.0, max: 2.0, step: 0.01, default: 0.5 },
    };
    this.params = {};
    for (const k in this.paramDefs) this.params[k] = this.paramDefs[k].default;
    this.enabled = true; // scenes are always “enabled” conceptually, but keep symmetry
  }
  setUniforms(gfx, w, h, t) {
    const sh = this.shader;
    sh.setUniform('u_resolution', [w, h]);
    sh.setUniform('u_time', t);
    sh.setUniform('u_tileCount',    this.params.tileCount);
    sh.setUniform('u_squareSize',   this.params.squareSize);
    sh.setUniform('u_thickness',    this.params.thickness);
    sh.setUniform('u_kaleidoSides', this.params.kaleidoSides);
    sh.setUniform('u_distortionAmp',this.params.distortionAmp);
    sh.setUniform('u_distortionFreq',this.params.distortionFreq);
    sh.setUniform('u_speed',        this.params.speed);
  }
  render(outGfx, w, h, t) {
    outGfx.shader(this.shader);
    this.setUniforms(outGfx, w, h, t);
    outGfx.quad(-1,-1, 1,-1, 1,1, -1,1);
  }
}

// ---------------------------------------------------------
// SpiralWarpPass — standalone post effect (oscillating/compounding)
// ---------------------------------------------------------
class SpiralWarpPass {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.shader = makeShader(this.p._renderer, SPIRAL_FRAG);
    this.paramDefs = {
      spiralStrength: { min: 0.0, max: 1.0, step: 0.01, default: 0.5 },
      spiralSpeed:    { min: 0.0, max: 1.0, step: 0.01, default: 0.5 },
      spiralMode:     { min: 0,   max: 1,   step: 1,    default: 0 }, // 0 osc, 1 comp
    };
    this.params = {};
    for (const k in this.paramDefs) this.params[k] = this.paramDefs[k].default;
    this.enabled = true;
  }
  setUniforms(readTex, outGfx, w, h, t) {
    const sh = this.shader;
    sh.setUniform('u_texture', readTex);
    sh.setUniform('u_resolution', [w, h]);
    sh.setUniform('u_time', t);
    sh.setUniform('u_spiralStrength', this.params.spiralStrength);
    sh.setUniform('u_spiralSpeed',    this.params.spiralSpeed);
    // clamp to 0 or 1 defensively
    const mode01 = this.params.spiralMode >= 0.5 ? 1.0 : 0.0;
    sh.setUniform('u_spiralMode', mode01);
  }
  render(readTex, outGfx, w, h, t) {
    outGfx.shader(this.shader);
    this.setUniforms(readTex, outGfx, w, h, t);
    outGfx.quad(-1,-1, 1,-1, 1,1, -1,1);
  }
}

// ---------------------------------------------------------
// ChromaAberrationPass — RGB split + small horizontal blur
// ---------------------------------------------------------
class ChromaAberrationPass {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.shader = makeShader(this.p._renderer, CHROMA_FRAG);
    this.paramDefs = {
      chromaOffset: { min: 0.0, max: 0.2, step: 0.001, default: 0.01 },
      chromaBlur:   { min: 0.0, max: 0.5, step: 0.01,  default: 0.05 },
      glowStrength: { min: 0.0, max: 1.0, step: 0.01,  default: 0.5 },
      glowSteps:    { min: 1,   max: 20,  step: 1,     default: 5 },
    };
    this.params = {};
    for (const k in this.paramDefs) this.params[k] = this.paramDefs[k].default;
    this.enabled = true;
  }
  setUniforms(readTex, outGfx, w, h, t) {
    const sh = this.shader;
    sh.setUniform('u_texture', readTex);
    sh.setUniform('u_resolution', [w, h]);
    sh.setUniform('u_time', t);
    sh.setUniform('u_chromaOffset', this.params.chromaOffset);
    sh.setUniform('u_chromaBlur',   this.params.chromaBlur);
    sh.setUniform('u_glowStrength', this.params.glowStrength);
    sh.setUniform('u_glowSteps',    this.params.glowSteps);
  }
  render(readTex, outGfx, w, h, t) {
    outGfx.shader(this.shader);
    this.setUniforms(readTex, outGfx, w, h, t);
    outGfx.quad(-1,-1, 1,-1, 1,1, -1,1);
  }
}

// ---------------------------------------------------------
// GlitchPass — discrete horizontal strips offset left/right
// ---------------------------------------------------------
class GlitchPass {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.shader = makeShader(this.p._renderer, GLITCH_FRAG);
    this.paramDefs = {
      strength:    { min: 0.0, max: 0.2, step: 0.001, default: 0.005 },
      chunkSize:   { min: 1,   max: 100, step: 1,     default: 10 },
      glitchSpeed: { min: 0.0, max: 10.0,step: 0.1,   default: 0.0 },
      chance:      { min: 0.0, max: 1.0, step: 0.01,  default: 1.0 },
    };
    this.params = {};
    for (const k in this.paramDefs) this.params[k] = this.paramDefs[k].default;
    this.enabled = true;
  }
  setUniforms(readTex, outGfx, w, h, t) {
    const sh = this.shader;
    sh.setUniform('u_texture', readTex);
    sh.setUniform('u_resolution', [w, h]);
    sh.setUniform('u_time', t);
    sh.setUniform('u_glitchStrength', this.params.strength);
    sh.setUniform('u_chunkSize', this.params.chunkSize / h); // normalized
    sh.setUniform('u_glitchSpeed', this.params.glitchSpeed);
    sh.setUniform('u_glitchChance', this.params.chance);
  }
  render(readTex, outGfx, w, h, t) {
    outGfx.shader(this.shader);
    this.setUniforms(readTex, outGfx, w, h, t);
    outGfx.quad(-1,-1, 1,-1, 1,1, -1,1);
  }
}

// ---------------------------------------------------------
// p5 lifecycle
// ---------------------------------------------------------
let chain; // PassManager
let scene, spiral, chroma, glitch;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  chain  = new PassManager(this, width, height);
  scene  = new KaleidoScene(this);
  spiral = new SpiralWarpPass(this);
  chroma = new ChromaAberrationPass(this);
  glitch = new GlitchPass(this);

  chain.setScene(scene);
  chain.addPass(spiral);
  chain.addPass(chroma);
  chain.addPass(glitch);

  // ---- GUI ----
  gui = new dat.GUI();

  const sceneFolder  = gui.addFolder('Scene: Kaleidoscope');
  buildFolder(sceneFolder, scene, scene.paramDefs);

  const spiralFolder = gui.addFolder('Pass: Spiral Warp');
  buildFolder(spiralFolder, spiral, spiral.paramDefs);

  const chromaFolder = gui.addFolder('Pass: Chroma + Glow');
  buildFolder(chromaFolder, chroma, chroma.paramDefs);

  const glitchFolder = gui.addFolder('Pass: Glitch');
  buildFolder(glitchFolder, glitch, glitch.paramDefs);

  // Global randomize
  gui.add({ randomizeAll: () => {
    for (const [obj, defs] of [
      [scene, scene.paramDefs],
      [spiral, spiral.paramDefs],
      [chroma, chroma.paramDefs],
      [glitch, glitch.paramDefs],
    ]) {
      for (const k in defs) obj.params[k] = randDef(defs[k]);
      updateControllers(obj);
    }
  }}, 'randomizeAll').name('Randomize All');
}

function draw() {
  const t = millis() / 1000;
  chain.render(t);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  chain.resize(width, height);
}

// BLIT: simple passthrough (used by PassManager to draw final texture)
const BLIT_FRAG = `
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D u_texture;
void main(){
  gl_FragColor = texture2D(u_texture, vUv);
}`;

// === Scene: Kaleidoscope generator ===
const KALEIDO_FRAG = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2  u_resolution;
uniform float u_time;

// scene params
uniform float u_tileCount, u_squareSize, u_thickness;
uniform float u_kaleidoSides, u_distortionAmp, u_distortionFreq;
uniform float u_speed;

float square(vec2 uv, float size){
  vec2 d = abs(uv - 0.5);
  return step(max(d.x, d.y), size);
}

vec2 kaleido(vec2 uv, float sides){
  uv -= 0.5;
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle, 6.2831853 / sides);
  angle = abs(angle - 3.1415926 / sides);
  return vec2(cos(angle), sin(angle)) * radius + 0.5;
}

vec2 refractDistort(vec2 uv, float time){
  float freq = u_distortionFreq;
  float amp  = u_distortionAmp;
  uv.x += sin(uv.y * freq + time * 2.0) * amp;
  uv.y += cos(uv.x * freq - time * 2.0) * amp;
  return uv;
}

float renderPattern(vec2 uv){
  float time = u_time * u_speed;

  // aspect fix
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;

  uv = kaleido(uv, u_kaleidoSides);
  uv = refractDistort(uv, time);

  uv = fract(uv * u_tileCount);

  float outer = square(uv, u_squareSize);
  float inner = square(uv, u_squareSize - u_thickness);
  return outer - inner;
}

void main(){
  float v = renderPattern(vUv);
  gl_FragColor = vec4(vec3(v), 1.0);
}`;

// === Pass: Spiral Warp (standalone) ===
const SPIRAL_FRAG = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2  u_resolution;
uniform float u_time;
uniform float u_spiralStrength, u_spiralSpeed, u_spiralMode;

vec2 spiralWarp(vec2 uv, float time){
  vec2 c = uv - 0.5;
  float r = length(c);
  float normR = r / 0.7071068;
  float angle = atan(c.y, c.x);

  // compounding vs oscillating
  float twist = (u_spiralMode > 0.5)
    ? time * u_spiralSpeed
    : sin(time * u_spiralSpeed);

  angle += normR * u_spiralStrength * twist;
  return vec2(cos(angle), sin(angle)) * r + 0.5;
}

void main(){
  vec2 uv = vUv;
  uv = spiralWarp(uv, u_time);
  gl_FragColor = texture2D(u_texture, uv);
}`;

// === Pass: Chroma Aberration + small horizontal blur + radial glow ===
const CHROMA_FRAG = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2  u_resolution;
uniform float u_time;
uniform float u_chromaOffset, u_chromaBlur;
uniform float u_glowStrength, u_glowSteps;

float sampleMono(vec2 uv){
  return dot(texture2D(u_texture, uv).rgb, vec3(0.299,0.587,0.114));
}

vec3 chroma(vec2 uv){
  float blurRadius = u_chromaBlur * 0.01;
  vec3 col = vec3(0.0);
  float total = 0.0;
  for (int i=-2;i<=2;i++){
    float off = float(i) * blurRadius;
    float w = 1.0 - abs(float(i)) * 0.2;
    col.r += texture2D(u_texture, uv + vec2(off + u_chromaOffset, 0.0)).r * w;
    col.g += texture2D(u_texture, uv + vec2(off, 0.0)).g * w;
    col.b += texture2D(u_texture, uv + vec2(off - u_chromaOffset, 0.0)).b * w;
    total += w;
  }
  return col / total;
}

float radialGlow(vec2 uv){
  // tiny ring blur around pixel using polar taps
  const int MAX_STEPS = 32;
  int steps = int(clamp(u_glowSteps, 1.0, float(MAX_STEPS)));
  float r = u_glowStrength * 0.01;
  float acc = 0.0;
  for (int i=0;i<MAX_STEPS;i++){
    if (i>=steps) break;
    float a = (6.2831853 * float(i)) / float(steps);
    vec2 d = vec2(cos(a), sin(a)) * r;
    acc += sampleMono(uv + d);
  }
  return acc / float(steps);
}

void main(){
  vec3 base = chroma(vUv);
  float g = radialGlow(vUv);
  base += vec3(g) * u_glowStrength;
  gl_FragColor = vec4(base, 1.0);
}`;

// === Pass: Glitch (discrete horizontal chunks) ===
const GLITCH_FRAG = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2  u_resolution;
uniform float u_time;
uniform float u_glitchStrength;
uniform float u_chunkSize;     // normalized height [0..1]
uniform float u_glitchSpeed;
uniform float u_glitchChance;

float rand(float y){
  return fract(sin(y * 43758.5453 + u_time * u_glitchSpeed) * 12345.6789);
}

void main(){
  float idx = floor(vUv.y / u_chunkSize);
  float doIt = step(1.0 - u_glitchChance, rand(idx));
  float off = (rand(idx + 1.0) * 2.0 - 1.0) * u_glitchStrength * doIt;
  vec2 uv = vUv;
  uv.x += off;
  gl_FragColor = texture2D(u_texture, uv);
}`;
