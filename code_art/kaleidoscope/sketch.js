// === Kaleidoscope Shader Animation

let kaleidoShader, glitchShader;
let kaleidoBuffer;
let gui;
let presetSelector;
let presetList = {};
let activePreset = 'None';

// Parameter definitions with bounds and defaults
const paramDefs = {
  tileCount:      { min: 1, max: 50, step: 1, default: 10 },
  squareSize:     { min: 0.05, max: 0.5, step: 0.01, default: 0.3 },
  thickness:      { min: 0.05, max: 0.5, step: 0.01, default: 0.15 },
  kaleidoSides:   { min: 1, max: 32, step: 1, default: 8 },
  distortionAmp:  { min: 0.0, max: 0.5, step: 0.01, default: 0.05 },
  distortionFreq: { min: 0.0, max: 100.0, step: 1, default: 5 },
  chromaOffset:   { min: 0.0, max: 0.2, step: 0.001, default: 0.01 },
  chromaBlur:     { min: 0.0, max: 0.5, step: 0.01, default: 0.05 },
  glowStrength:   { min: 0.0, max: 1.0, step: 0.01, default: 0.5 },
  glowSteps:      { min: 1, max: 20, step: 1, default: 5 },
  speed:          { min: 0.0, max: 2.0, step: 0.01, default: 0.5 },
  spiralStrength: { min: 0.0, max: 1.0, step: 0.01, default: 0.5 },
  spiralSpeed:    { min: 0.0, max: 1.0, step: 0.01, default: 0.5 },
  strength:       { min: 0.0, max: 0.2, step: 0.001, default: 0.005 },
  chunkSize:      { min: 1, max: 100, step: 1, default: 10 },
  glitchSpeed:    { min: 0.0, max: 10, step: 0.1, default: 0.0 },
  chance:         { min: 0.0, max: 1.0, step: 0.01, default: 1.0 },
};

const randomDamping = 0.75;

let params = {};
for (const key in paramDefs) {
  params[key] = paramDefs[key].default;
}

function preload() {
  kaleidoShader = new p5.Shader(this.renderer, vertSrc, fragSrc);
  glitchShader = new p5.Shader(this.renderer, vertSrc, glitchFragSrc);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  kaleidoBuffer = createGraphics(width, height, WEBGL);
  kaleidoBuffer.noStroke();
  gui = new dat.GUI();

  // Create folders with parameters and randomize buttons
  setupFolder('Kaleidoscope', ['tileCount', 'squareSize', 'thickness', 'kaleidoSides', 'speed']);
  setupFolder('Distortion', ['distortionAmp', 'distortionFreq']);
  setupFolder('Chromatic Effect', ['chromaOffset', 'chromaBlur', 'glowStrength', 'glowSteps']);
  setupFolder('Spiral Effect', ['spiralStrength', 'spiralSpeed']);
  setupFolder('Glitch Effect', ['strength', 'chunkSize', 'glitchSpeed', 'chance'], true);

  // Preset Manager Folder
  const presets = gui.addFolder('Preset Manager');
  presets.add({ Save: () => {
    const name = prompt('Preset name:');
    if (name) savePresetToLocal(name);
  } }, 'Save').name('Save As New');

  presets.add({ Delete: () => {
    const name = presetSelector?.getValue();
    if (name && name !== 'None') deletePreset(name);
  } }, 'Delete').name('Delete Preset');

  presets.add({ Export: exportPreset }, 'Export').name('Export to File');
  presets.add({ Import: importPreset }, 'Import').name('Import from File');

  loadAllPresets();
  updatePresetDropdown();
}

function setupFolder(name, keys, isGlitch = false) {
  const folder = gui.addFolder(name);
  keys.forEach(k => {
    const def = paramDefs[k];
    const controller = folder.add(params, k, def.min, def.max).step(def.step).name(k);
    params[`_${k}Controller`] = controller;
  });
  folder.add({ randomize: () => {
    randomizeParams(keys);
    updateAllControllers();
  } }, 'randomize').name('Randomize');
  if (isGlitch) folder.add({ disableGlitch }, 'disableGlitch').name('Disable Glitch');
}

function randomizeParams(keys) {
  keys.forEach(k => {
    const def = paramDefs[k];
    params[k] = random(def.min, def.max * randomDamping);
  });
}

function disableGlitch() {
  ['strength', 'chunkSize', 'glitchSpeed', 'chance'].forEach(k => {
    params[k] = paramDefs[k].min;
  });
  updateAllControllers();
}

function exportPreset() {
  const cleanParams = {};
  for (const key in paramDefs) cleanParams[key] = params[key];
  const preset = JSON.stringify(cleanParams, null, 2);
  const blob = new Blob([preset], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kaleido-preset.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importPreset() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        for (let k in params) {
          if (json.hasOwnProperty(k)) params[k] = json[k];
        }
        updateAllControllers();
        updatePresetDropdown();
      } catch (err) {
        console.error('❌ Failed to import preset:', err);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function updateAllControllers() {
  for (const k in paramDefs) {
    const controller = params[`_${k}Controller`];
    if (controller) controller.updateDisplay();
  }
}

function savePresetToLocal(name) {
  const cleanParams = {};
  for (const key in paramDefs) cleanParams[key] = params[key];
  presetList[name] = cleanParams;
  localStorage.setItem('kaleidoPresets', JSON.stringify(presetList));
  activePreset = name;
  updatePresetDropdown();
}

function loadPresetFromLocal(name) {
  if (presetList[name]) {
    Object.assign(params, presetList[name]);
    updateAllControllers();
    activePreset = name;
    updatePresetDropdown();
  }
}

function deletePreset(name) {
  delete presetList[name];
  localStorage.setItem('kaleidoPresets', JSON.stringify(presetList));
  activePreset = 'None';
  updatePresetDropdown();
}

function loadAllPresets() {
  const json = localStorage.getItem('kaleidoPresets');
  if (json) presetList = JSON.parse(json);
}

function updatePresetDropdown() {
  const names = Object.keys(presetList);
  const parent = gui.__folders['Preset Manager'];
  if (presetSelector) parent.remove(presetSelector);

  presetSelector = parent
    .add({ Active: activePreset }, 'Active', names.length ? names : ['None'])
    .name('Active Preset');

  presetSelector.onChange(name => loadPresetFromLocal(name));
  presetSelector.setValue(activePreset);
}

function draw() {
  kaleidoBuffer.shader(kaleidoShader);
  kaleidoShader.setUniform('u_resolution', [width, height]);
  kaleidoShader.setUniform('u_time', millis() / 1000);
  for (let k in params) kaleidoShader.setUniform(`u_${k}`, params[k]);
  kaleidoBuffer.quad(-1, -1, 1, -1, 1, 1, -1, 1);

  shader(glitchShader);
  glitchShader.setUniform('u_texture', kaleidoBuffer);
  glitchShader.setUniform('u_resolution', [width, height]);
  glitchShader.setUniform('u_time', millis() / 1000);
  glitchShader.setUniform('u_glitchStrength', params.strength);
  glitchShader.setUniform('u_chunkSize', params.chunkSize / height);
  glitchShader.setUniform('u_glitchSpeed', params.glitchSpeed);
  glitchShader.setUniform('u_glitchChance', params.chance);

  beginShape();
  texture(kaleidoBuffer);
  vertex(-width/2, -height/2, 0, 0);
  vertex(width/2, -height/2, 1, 0);
  vertex(width/2, height/2, 1, 1);
  vertex(-width/2, height/2, 0, 1);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  kaleidoBuffer.resizeCanvas(windowWidth, windowHeight);
}

// === SHADERS ===

const vertSrc = `
attribute vec3 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition.xy * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 1.0);
}`;

const fragSrc = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_tileCount, u_squareSize, u_thickness;
uniform float u_kaleidoSides, u_distortionAmp, u_distortionFreq;
uniform float u_chromaOffset, u_chromaBlur, u_glowStrength, u_glowSteps;
uniform float u_speed, u_spiralStrength, u_spiralSpeed;

varying vec2 vUv;

float square(vec2 uv, float size) {
  vec2 d = abs(uv - 0.5);
  return step(max(d.x, d.y), size);
}

vec2 kaleido(vec2 uv, float sides) {
  uv -= 0.5;
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle, 6.28318 / sides);
  angle = abs(angle - 3.14159 / sides);
  return vec2(cos(angle), sin(angle)) * radius + 0.5;
}

vec2 refractDistort(vec2 uv, float time, float offset) {
  float freq = u_distortionFreq;
  float amp = u_distortionAmp;
  uv.x += sin(uv.y * freq + time * 2.0 + offset) * amp;
  uv.y += cos(uv.x * freq - time * 2.0 + offset) * amp;
  return uv;
}

vec2 spiralWarp(vec2 uv, float time) {
  vec2 centered = uv - 0.5;
  float r = length(centered);
  float normR = r / 0.7071;
  float angle = atan(centered.y, centered.x);
  angle += normR * u_spiralStrength * time * u_spiralSpeed;
  return vec2(cos(angle), sin(angle)) * r + 0.5;
}

float renderPattern(vec2 uv, float offset) {
  float time = u_time * u_speed;
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;
  uv = spiralWarp(uv, time);
  uv = kaleido(uv, u_kaleidoSides);
  uv = refractDistort(uv, time, offset);
  uv = fract(uv * u_tileCount);
  float outer = square(uv, u_squareSize);
  float inner = square(uv, u_squareSize - u_thickness);
  return outer - inner;
}

vec3 chromaBlur(vec2 uv) {
  float blurRadius = u_chromaBlur * 0.01;
  vec3 col = vec3(0.0);
  float total = 0.0;

  for (int i = -2; i <= 2; i++) {
    float offset = float(i) * blurRadius;
    float weight = 1.0 - abs(float(i)) * 0.2;
    col.r += renderPattern(uv + vec2(offset + u_chromaOffset, 0.0), u_chromaOffset) * weight;
    col.g += renderPattern(uv + vec2(offset, 0.0), 0.0) * weight;
    col.b += renderPattern(uv + vec2(offset - u_chromaOffset, 0.0), -u_chromaOffset) * weight;
    total += weight;
  }

  return col / total;
}

#define MAX_GLOW_STEPS 32

float glowAround(vec2 uv) {
  float glow = 0.0;
  float radius = u_glowStrength * 0.01;
  int steps = int(min(max(u_glowSteps, 1.0), float(MAX_GLOW_STEPS)));

  for (int i = 0; i < MAX_GLOW_STEPS; i++) {
    if (i >= steps) break;
    float angle = float(i) * 6.28318 / float(steps);
    vec2 offset = vec2(cos(angle), sin(angle)) * radius;
    glow += renderPattern(uv + offset, 0.0);
  }

  return glow / float(steps);
}

void main() {
  vec3 color = chromaBlur(vUv);
  float glow = glowAround(vUv);
  color += vec3(glow) * u_glowStrength;
  gl_FragColor = vec4(color, 1.0);
}`;

const glitchFragSrc = `
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_glitchStrength;
uniform float u_chunkSize;
uniform float u_glitchSpeed;
uniform float u_glitchChance;

varying vec2 vUv;

float rand(float y) {
  return fract(sin(y * 43758.5453 + u_time * u_glitchSpeed) * 12345.6789);
}

void main() {
  float chunkIndex = floor(vUv.y / u_chunkSize);
  float shouldGlitch = step(1.0 - u_glitchChance, rand(chunkIndex));
  float offset = (rand(chunkIndex + 1.0) * 2.0 - 1.0) * u_glitchStrength * shouldGlitch;

  vec2 uv = vUv;
  uv.x += offset;

  gl_FragColor = texture2D(u_texture, uv);
}`